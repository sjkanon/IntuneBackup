#!/usr/bin/env node
/**
 * Writes IntuneTemplate/ out in the folder structure that IntuneBackupAndRestore expects,
 * so that `Start-IntuneRestoreConfig` can restore the baseline into a tenant. CIPP reads
 * IntuneTemplate/ directly; this exporter exists purely for the other tool.
 *
 * Folder names and body shape are derived from module 4.0.1 itself (Invoke-IntuneRestore*.ps1):
 * "Settings Catalog" POSTs the whole file minus id/createdDateTime/lastModifiedDateTime/
 * settingCount/creationSource; "Administrative Templates" uses the FILE NAME as displayName
 * and POSTs each array element separately to definitionValues; "Device Configurations"
 * POSTs the file minus id/createdDateTime/lastModifiedDateTime/version; "Device
 * Compliance Policies" likewise, but fills in a missing scheduledActionsForRule itself;
 * "App Protection Policies" POSTs to deviceAppManagement/managedAppPolicies.
 *
 * Counterpart of scripts/import-intunebackup.js. IntuneTemplate/ remains the source: the
 * export is a derivative and is completely rewritten on every run. Assignments come from
 * IntuneTemplate/_assignments.json and land in an Assignments/ subfolder per policy type; a
 * policy without an entry there (a phase that is not deployed automatically) is restored
 * unassigned.
 *
 * Next to the policies, the export carries two sidecar folders the module does not know:
 * the macOS ADE enrolment profiles (IntuneTemplate/MAC/Enrollment/ade-profile/) and the macOS shell scripts
 * (IntuneTemplate/MAC/PlatformScripts/). See SIDECARS below.
 *
 * Usage: node scripts/export-intunebackup.js [target-dir]
 *   default target-dir: export/NativeImport/IntuneBackupAndRestore/
 *
 * That `NativeImport` in the path is not a description but an exclusion. CIPP scans a
 * template repository with `git/trees?recursive=1` and ignores exactly two things: files
 * that do not end in `.json`, and paths containing `NativeImport`. Without that word in the
 * path CIPP imports this folder *too* — the same policies, but without a RowKey, so as a
 * duplicate with its own GUID next to the real template. See export/README.md.
 */

const fs = require("fs");
const path = require("path");
const { readTemplates } = require("./lib/templates");
const { LANGS, variantPath, languageBar } = require("./lib/i18n");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const DEFAULT_OUT = path.join(REPO_ROOT, "export", "NativeImport", "IntuneBackupAndRestore");

/** CIPP-`Type` -> mapnaam die IntuneBackupAndRestore gebruikt. */
const TYPE_TO_FOLDER = {
  Catalog: "Settings Catalog",
  Admin: "Administrative Templates",
  Device: "Device Configurations",
  deviceCompliancePolicies: "Device Compliance Policies",
  AppProtection: "App Protection Policies",
};

/** Bestandsnaam in de export is de displayName; deze tekens mogen niet in een pad. */
function safeFileName(displayName) {
  return displayName.replace(/[<>:"/\\|?*]/g, "_");
}

/**
 * Settings Catalog-body zoals Graph 'm teruggeeft. `settingCount` zetten we gelijk aan het
 * werkelijke aantal settings — juist het uiteenlopen daarvan verraadt een afgekapte export
 * (zie import-intunebackup.js), dus een export die dat veld verkeerd invult zou een latere
 * import ten onrechte laten slagen of falen.
 */
function catalogBody(rawJson) {
  return {
    name: rawJson.name,
    description: rawJson.description || "",
    platforms: rawJson.platforms,
    technologies: rawJson.technologies,
    templateReference: rawJson.templateReference,
    roleScopeTagIds: ["0"],
    settingCount: (rawJson.settings || []).length,
    settings: rawJson.settings || [],
  };
}

/** ADMX: IntuneBackupAndRestore bewaart de kale definitionValues-array, niet de CIPP-envelop. */
function adminBody(rawJson) {
  return (rawJson.added || []).map((d) => ({
    enabled: !!d.enabled,
    "definition@odata.bind": d["definition@odata.bind"],
    ...(d.presentationValues && d.presentationValues.length > 0 ? { presentationValues: d.presentationValues } : {}),
  }));
}

function rmDirContents(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
}

/**
 * App Protection-assignments hebben twee eigenaardigheden in module 4.0.1, allebei uit
 * Invoke-IntuneRestoreAppProtectionPolicyAssignment.ps1:
 *
 * 1. De bestandsnaam is "<id> - <policynaam>.json" en de module leest de policynaam als
 *    alles ná het eerste " - ". Bij de andere policytypes ís de bestandsnaam de policynaam.
 *    Wij hebben geen tenant-id, dus staat de template-GUID vooraan; die wordt alleen bij
 *    -RestoreById $true gebruikt en is dan sowieso onbruikbaar in een andere tenant.
 * 2. De inhoud is geen kale array maar het Graph-antwoord met een `value`-property — de
 *    module leest `$assignments.Value`. Een array zonder envelop levert stilzwijgend nul
 *    assignments op.
 */
function appProtectionAssignmentFile(guid, displayName, assignment) {
  return {
    name: `${guid} - ${safeFileName(displayName)}.json`,
    body: { value: assignment },
  };
}

/**
 * Schrijft de templates weg in de mappen van de module. Geeft terug wat er is geschreven,
 * zodat main() het kan samenvatten.
 */
function exportTemplates({ templates, outDir, assignments }) {

  // Volledig herschrijven: een template dat uit de bronmap verdwijnt moet ook uit de export
  // verdwijnen, anders rolt een restore later een policy uit die niet meer bestaat.
  rmDirContents(outDir);

  const written = [];
  const skipped = [];
  const withoutAssignment = [];

  for (const { baseName, inner, raw } of templates) {
    const folder = TYPE_TO_FOLDER[inner.Type];
    if (!folder) {
      skipped.push(`${baseName}.json: onbekend Type "${inner.Type}"`);
      continue;
    }

    const body = inner.Type === "Catalog" ? catalogBody(raw) : inner.Type === "Admin" ? adminBody(raw) : raw;
    const name = safeFileName(inner.Displayname) + ".json";

    fs.mkdirSync(path.join(outDir, folder), { recursive: true });
    fs.writeFileSync(path.join(outDir, folder, name), JSON.stringify(body, null, 4) + "\n");

    const assignment = assignments[inner.Displayname];
    if (assignment && assignment.length > 0) {
      fs.mkdirSync(path.join(outDir, folder, "Assignments"), { recursive: true });
      const file =
        inner.Type === "AppProtection"
          ? appProtectionAssignmentFile(inner.GUID, inner.Displayname, assignment)
          : { name, body: assignment };
      fs.writeFileSync(path.join(outDir, folder, "Assignments", file.name), JSON.stringify(file.body, null, 4) + "\n");
    } else {
      withoutAssignment.push(inner.Displayname);
    }
    written.push(`${folder}/${name}`);
  }

  const perFolder = written.reduce((acc, w) => {
    const folder = w.split("/")[0];
    acc[folder] = (acc[folder] || 0) + 1;
    return acc;
  }, {});

  console.log(`Geschreven naar ${outDir} (${written.length} policies):`);
  for (const [folder, count] of Object.entries(perFolder)) console.log(`  ${String(count).padStart(3)}  ${folder}`);
  if (skipped.length > 0) {
    console.log(`\n${skipped.length} overgeslagen:`);
    for (const s of skipped) console.log(`  ${s}`);
  }

  return { written, perFolder, withoutAssignment };
}

/**
 * Twee soorten configuratie reizen mee in de baseline-export, in mappen die de module niet
 * kent en dus overslaat: de macOS ADE-enrollmentprofielen en de macOS-shellscripts.
 *
 * Niet omdat IntuneBackupAndRestore ze kan terugzetten — dat kan hij niet: een
 * depMacOSEnrollmentProfile hangt onder een ABM-token (depOnboardingSettings/{id}/
 * enrollmentProfiles) en een shellscript onder deviceShellScripts; de module heeft daar geen
 * Invoke-IntuneRestore* voor. CIPP kent ze evenmin; het is geen van de vijf TemplateTypes. De
 * weg naar een tenant is scripts/New-MacOSEnrollmentPolicy.ps1 voor het profiel en de portal
 * voor het script.
 *
 * Ze gaan tóch mee omdat de exportmap het pakket is waarmee je een tenant opnieuw inricht.
 * Wat daar niet in zit wordt bij zo'n herinrichting simpelweg vergeten — en een Mac die zonder
 * ADE-profiel uit Apple Business synct, faalt in de enrollment. De README die hier per map bij
 * wordt geschreven zegt hoe ze er wél in gaan.
 *
 * IntuneTemplate/MAC/Enrollment/ade-profile/ en IntuneTemplate/MAC/PlatformScripts/ blijven de bron; dit zijn kopieën
 * die bij elke run opnieuw worden geschreven, net als de rest van de export. `platform` is de
 * submap in de export (macos/), zodat de exportpaden niet afhangen van waar de bron in de repo
 * staat. De bron is bewust de macOS-map en niet heel IntuneTemplate/: IntuneTemplate/IOS/Enrollment/ bevat een
 * iOS-profiel met een ander Graph-type, dat New-MacOSEnrollmentPolicy.ps1 niet aanmaakt.
 */
const SIDECARS = [
  {
    sourceDir: "IntuneTemplate/MAC/Enrollment/ade-profile",
    platform: "macos",
    folder: "Apple ADE Enrollment Profiles",
    extensions: [".json"],
    how: {
      nl: (files, folder) => [
        "`Start-IntuneRestoreConfig` slaat deze map over: IntuneBackupAndRestore kent geen",
        "restore-functie voor Apple ADE-enrollmentprofielen, en CIPP kent ze ook niet. Ze reizen",
        "hier mee omdat een tenant die je uit deze export opnieuw inricht ze wél nodig heeft — een",
        "Mac die zonder enrollmentprofiel uit Apple Business synct, faalt in de enrollment.",
        "",
        "Terugzetten gaat per profiel, met het ABM-token erbij:",
        "",
        ...restoreCommands(files, folder),
        "",
        "Haal `-WhatIf` weg als het klopt. Toewijzen blijft handwerk in de portal (Enrollment",
        "program tokens → token → Devices), en dat is bewust: een profiel op de verkeerde",
        "serienummers levert Macs op die zonder wipe niet terug te draaien zijn.",
        "",
        "Zie `IntuneTemplate/MAC/Enrollment/ade-profile/README.md` in de repo voor wat er in het profiel staat en waarom.",
      ],
      en: (files, folder) => [
        "`Start-IntuneRestoreConfig` skips this folder: IntuneBackupAndRestore has no restore",
        "function for Apple ADE enrolment profiles, and CIPP does not know them either. They travel",
        "along here because a tenant you rebuild from this export does need them — a Mac that",
        "syncs from Apple Business without an enrolment profile fails enrolment.",
        "",
        "Restoring is done per profile, with the ABM token:",
        "",
        ...restoreCommands(files, folder),
        "",
        "Remove `-WhatIf` once it is correct. Assigning remains manual work in the portal (Enrollment",
        "program tokens → token → Devices), and that is deliberate: a profile on the wrong",
        "serial numbers produces Macs that cannot be reverted without a wipe.",
        "",
        "See `IntuneTemplate/MAC/Enrollment/ade-profile/README.en.md` in the repo for what the profile contains and why.",
      ],
      fr: (files, folder) => [
        "`Start-IntuneRestoreConfig` ignore ce dossier : IntuneBackupAndRestore n'a pas de fonction",
        "de restauration pour les profils d'inscription Apple ADE, et CIPP ne les connaît pas non plus.",
        "Ils voyagent ici parce qu'un tenant reconstruit à partir de cet export en a besoin — un Mac",
        "qui se synchronise depuis Apple Business sans profil d'inscription échoue à l'inscription.",
        "",
        "La restauration se fait profil par profil, avec le jeton ABM :",
        "",
        ...restoreCommands(files, folder),
        "",
        "Retirez `-WhatIf` quand tout est correct. L'affectation reste un travail manuel dans le portail",
        "(Enrollment program tokens → token → Devices), et c'est voulu : un profil sur les mauvais",
        "numéros de série donne des Mac qu'on ne peut pas rétablir sans effacement.",
        "",
        "Voir `IntuneTemplate/MAC/Enrollment/ade-profile/README.fr.md` dans le dépôt pour le contenu du profil et sa raison d'être.",
      ],
    },
  },
  {
    sourceDir: "IntuneTemplate/MAC/PlatformScripts",
    platform: "macos",
    folder: "macOS Shell Scripts",
    extensions: [".sh"],
    how: {
      nl: () => [
        "`Start-IntuneRestoreConfig` slaat deze map over: `deviceShellScripts` heeft geen",
        "restore-functie in de module en geen `TemplateType` in CIPP. Deze scripts reizen mee",
        "omdat ze bij een herinrichting anders vergeten worden.",
        "",
        "Aanmaken gaat met de hand: **Devices → macOS → Shell scripts → Add**. De instellingen",
        "per script (uitvoeren als aangemelde gebruiker, frequentie, toewijzing) staan in",
        "`IntuneTemplate/MAC/PlatformScripts/README.md` in de repo — die waarden zijn geen detail: een dockscript",
        "dat als root draait schrijft naar de verkeerde Dock en de gebruiker ziet niets.",
      ],
      en: () => [
        "`Start-IntuneRestoreConfig` skips this folder: `deviceShellScripts` has no restore",
        "function in the module and no `TemplateType` in CIPP. These scripts travel along",
        "because they would otherwise be forgotten in a rebuild.",
        "",
        "Creating them is manual: **Devices → macOS → Shell scripts → Add**. The settings",
        "per script (run as signed-in user, frequency, assignment) are in",
        "`IntuneTemplate/MAC/PlatformScripts/README.en.md` in the repo — those values are not a detail: a Dock script",
        "that runs as root writes to the wrong Dock and the user sees nothing.",
      ],
      fr: () => [
        "`Start-IntuneRestoreConfig` ignore ce dossier : `deviceShellScripts` n'a pas de fonction",
        "de restauration dans le module ni de `TemplateType` dans CIPP. Ces scripts voyagent ici",
        "parce qu'ils seraient sinon oubliés lors d'une reconstruction.",
        "",
        "La création se fait à la main : **Devices → macOS → Shell scripts → Add**. Les paramètres",
        "de chaque script (exécution en tant qu'utilisateur connecté, fréquence, affectation) figurent dans",
        "`IntuneTemplate/MAC/PlatformScripts/README.fr.md` dans le dépôt — ces valeurs ne sont pas un détail : un script",
        "de Dock exécuté en root écrit dans le mauvais Dock et l'utilisateur ne voit rien.",
      ],
    },
  },
];

function restoreCommands(files, folder) {
  return [
    "```powershell",
    ...files.map((f) => `.\\scripts\\New-MacOSEnrollmentPolicy.ps1 -TokenName <TOKEN> -Path '.\\${folder}\\${f.split("/").join("\\")}' -WhatIf`),
    "```",
  ];
}

const SIDECAR_GENERATED = {
  nl: (sourceDir) => `**Gegenereerd** uit \`${sourceDir}/\` — niet met de hand bijwerken.`,
  en: (sourceDir) => `**Generated** from \`${sourceDir}/\` — do not edit by hand.`,
  fr: (sourceDir) => `**Généré** à partir de \`${sourceDir}/\` — ne pas modifier à la main.`,
};

/**
 * Kopieert één sidecar-map naar de export, onder `<folder>/<platform>/`. Geeft de gekopieerde
 * bestanden terug (relatief aan de doelmap), of een lege lijst als de bronmap niet bestaat. De
 * README komt in drie talen, net als de rest van de documentatie.
 */
function exportSidecar(outDir, { sourceDir, platform, folder, extensions, how }) {
  const from = path.join(REPO_ROOT, sourceDir);
  if (!fs.existsSync(from)) return [];

  const written = [];
  for (const file of fs.readdirSync(from).sort()) {
    if (!extensions.some((e) => file.endsWith(e))) continue;
    const target = path.join(outDir, folder, platform);
    fs.mkdirSync(target, { recursive: true });
    fs.copyFileSync(path.join(from, file), path.join(target, file));
    written.push(`${platform}/${file}`);
  }
  if (written.length === 0) return written;

  for (const lang of LANGS) {
    const lines = [languageBar("README.md", lang), "", `# ${folder}`, "", SIDECAR_GENERATED[lang](sourceDir), "", ...how[lang](written, folder), ""];
    fs.writeFileSync(path.join(outDir, folder, variantPath("README.md", lang)), lines.join("\n"));
  }
  return written;
}

function main() {
  const outDir = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUT;

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`IntuneTemplate/ niet gevonden op ${TEMPLATE_DIR}`);
    process.exit(1);
  }
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const templates = readTemplates(TEMPLATE_DIR);

  // Een sleutel in _assignments.json die geen enkele Displayname meer raakt is een fout, geen
  // detail: assignments worden op naam gematcht, dus na een hernoeming waarbij dit bestand
  // niet meebeweegt verdwijnt de toewijzing stil uit de export en rolt de restore de policy
  // ongetoewezen uit. Dat merk je pas als iemand zich afvraagt waarom de baseline nergens
  // landt.
  //
  // Vóór rmDirContents in exportSet, niet erna: afbreken mag de bestaande export niet half
  // gesloopt achterlaten.
  const knownDisplayNames = new Set(templates.map((t) => t.displayName));
  const orphaned = Object.keys(assignments).filter((n) => !knownDisplayNames.has(n));
  if (orphaned.length > 0) {
    console.error(`FOUT: ${orphaned.length} sleutel(s) in ${path.relative(REPO_ROOT, ASSIGNMENTS_PATH)} horen bij geen enkele policy in IntuneTemplate/:`);
    for (const n of orphaned) console.error(`  - "${n}"`);
    console.error("Hernoemd of verwijderd? Werk _assignments.json bij. De export is ongewijzigd gelaten.");
    process.exit(1);
  }

  const baseline = exportTemplates({ templates, outDir, assignments });

  const sidecars = SIDECARS.map((s) => ({ ...s, files: exportSidecar(outDir, s) })).filter((s) => s.files.length > 0);
  for (const s of sidecars) {
    console.log(`\n${s.files.length} bestand(en) uit ${s.sourceDir}/ meegekopieerd naar "${s.folder}/":`);
    for (const f of s.files) console.log(`  ${f}`);
  }

  if (baseline.withoutAssignment.length > 0) {
    console.log(`\n${baseline.withoutAssignment.length} baseline-policy/policies zonder assignment in ${path.relative(REPO_ROOT, ASSIGNMENTS_PATH)} — die worden zonder toewijzing teruggezet:`);
    for (const n of baseline.withoutAssignment) console.log(`  ${n}`);
  }

  console.log("\nTerugzetten (module IntuneBackupAndRestore 4.x):");
  console.log(`  Start-IntuneRestoreConfig -Path '${outDir}'`);
  console.log("  Start-IntuneRestoreAssignments -Path '<zelfde pad>' -RestoreById $false");
  if (baseline.perFolder["App Protection Policies"]) {
    console.log("  Invoke-IntuneRestoreAppProtectionPolicyAssignment -Path '<zelfde pad>' -RestoreById $false");
    console.log("  ^ apart aanroepen: Start-IntuneRestoreAssignments doet App Protection niet (module 4.0.1).");
  }
  console.log("Let op: -RestoreById $false is vereist — de assignments in de export bevatten bewust geen tenant-id's,");
  console.log("de module matcht dan op policynaam. Dat is ook de enige modus die cross-tenant klopt.");

  if (sidecars.length > 0) {
    console.log(`\nDeze kent de module niet en gaan apart — zie de README in elke map:`);
    for (const s of sidecars) console.log(`  ${s.folder}/  (${s.files.length})`);
  }
}

main();
