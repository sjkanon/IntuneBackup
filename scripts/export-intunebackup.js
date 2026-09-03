#!/usr/bin/env node
/**
 * Schrijft IntuneTemplate/ weg in de mapstructuur die IntuneBackupAndRestore verwacht,
 * zodat `Start-IntuneRestoreConfig` de baseline in een tenant kan terugzetten. CIPP leest
 * IntuneTemplate/ rechtstreeks; deze exporter is er puur voor de andere tool.
 *
 * Mapnamen en bodyvorm zijn afgeleid uit module 4.0.1 zelf (Invoke-IntuneRestore*.ps1):
 * "Settings Catalog" POST't het hele bestand minus id/createdDateTime/lastModifiedDateTime/
 * settingCount/creationSource; "Administrative Templates" gebruikt de BESTANDSNAAM als
 * displayName en POST't elk arrayelement los naar definitionValues; "Device Configurations"
 * POST't het bestand minus id/createdDateTime/lastModifiedDateTime/version; "Device
 * Compliance Policies" idem, maar vult een ontbrekende scheduledActionsForRule zelf aan;
 * "App Protection Policies" POST't naar deviceAppManagement/managedAppPolicies.
 *
 * Tegenhanger van scripts/import-intunebackup.js. De sets zelf blijven de bron: de export is
 * een afgeleide en wordt bij elke run volledig opnieuw geschreven.
 *
 * Elke set uit SET_PREFIXES (lib/templates.js) krijgt een eigen doelmap — bewust niet één
 * gedeelde:
 *
 *   IntuneTemplate/  ->  .../IntuneBackupAndRestore/            de uitgerolde baseline, mét assignments
 *
 * `Start-IntuneRestoreConfig` krijgt één pad mee en zet alles terug wat eronder staat. Stonden
 * de sets in dezelfde map, dan rolt wie de baseline terugzet ongemerkt de voorstellen mee uit
 * — en die veranderen gedrag dat gebruikers direct merken. Aparte paden houden dat een bewuste
 * keuze. De voorstelsets krijgen om dezelfde reden géén Assignments/-submap: die policies horen
 * na de restore met de hand op een pilotgroep.
 *
 * Een nieuwe set toevoegen is één regel in SET_PREFIXES; deze exporter pikt hem daarna vanzelf
 * op. Dat is de bedoeling: een set die niet exporteert is een set die alleen via CIPP uitrolt,
 * en dat verschil hoort niet stilzwijgend te ontstaan.
 *
 * Gebruik: node scripts/export-intunebackup.js [doelmap]
 *   standaard doelmap: export/NativeImport/IntuneBackupAndRestore/
 *   elke set naast de baseline gaat naar diezelfde map met "-<SET>" erachter
 *
 * Die `NativeImport` in het pad is geen beschrijving maar een uitsluiting. CIPP scant een
 * template-repository met `git/trees?recursive=1` en negeert precies twee dingen: bestanden
 * die niet op `.json` eindigen, en paden waarin `NativeImport` voorkomt. Zonder dat woord in
 * het pad importeert CIPP deze map óók — dezelfde 98 policies, maar zonder RowKey, dus als
 * duplicaat met een eigen GUID naast het echte template. Zie export/README.md.
 */

const fs = require("fs");
const path = require("path");
const { SET_PREFIXES, readTemplates } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, SET_PREFIXES.Baseline);
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
 * Schrijft één set weg. Geeft terug wat er is geschreven, zodat main() beide sets in één
 * overzicht kan samenvatten.
 */
function exportSet({ label, sourceDir, outDir, assignments }) {
  const templates = readTemplates(sourceDir);

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

  console.log(`${label}: geschreven naar ${outDir} (${written.length} policies):`);
  for (const [folder, count] of Object.entries(perFolder)) console.log(`  ${String(count).padStart(3)}  ${folder}`);
  if (skipped.length > 0) {
    console.log(`\n${skipped.length} overgeslagen:`);
    for (const s of skipped) console.log(`  ${s}`);
  }

  return { written, perFolder, withoutAssignment };
}

/**
 * Doelmap van een set naast de baseline: zusje van de baselinemap, niet een submap ervan.
 * Alles ónder het pad dat je aan Start-IntuneRestoreConfig meegeeft wordt teruggezet.
 */
const outDirFor = (baseOut, set) => `${baseOut}-${set}`;

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
 * enrollment/ en shellscripts/ blijven de bron; dit zijn kopieën die bij elke run opnieuw
 * worden geschreven, net als de rest van de export.
 */
const SIDECARS = [
  {
    sourceDir: "enrollment",
    folder: "Apple ADE Enrollment Profiles",
    extensions: [".json"],
    how: (files, folder) => [
      "`Start-IntuneRestoreConfig` slaat deze map over: IntuneBackupAndRestore kent geen",
      "restore-functie voor Apple ADE-enrollmentprofielen, en CIPP kent ze ook niet. Ze reizen",
      "hier mee omdat een tenant die je uit deze export opnieuw inricht ze wél nodig heeft — een",
      "Mac die zonder enrollmentprofiel uit Apple Business synct, faalt in de enrollment.",
      "",
      "Terugzetten gaat per profiel, met het ABM-token erbij:",
      "",
      "```powershell",
      ...files.map((f) => `.\\scripts\\New-MacOSEnrollmentPolicy.ps1 -TokenName <TOKEN> -Path '.\\${folder}\\${f.split("/").join("\\")}' -WhatIf`),
      "```",
      "",
      "Haal `-WhatIf` weg als het klopt. Toewijzen blijft handwerk in de portal (Enrollment",
      "program tokens → token → Devices), en dat is bewust: een profiel op de verkeerde",
      "serienummers levert Macs op die zonder wipe niet terug te draaien zijn.",
      "",
      "Zie `enrollment/macos/README.md` in de repo voor wat er in het profiel staat en waarom.",
    ],
  },
  {
    sourceDir: "shellscripts",
    folder: "macOS Shell Scripts",
    extensions: [".sh"],
    how: () => [
      "`Start-IntuneRestoreConfig` slaat deze map over: `deviceShellScripts` heeft geen",
      "restore-functie in de module en geen `TemplateType` in CIPP. Deze scripts reizen mee",
      "omdat ze bij een herinrichting anders vergeten worden.",
      "",
      "Aanmaken gaat met de hand: **Devices → macOS → Shell scripts → Add**. De instellingen",
      "per script (uitvoeren als aangemelde gebruiker, frequentie, toewijzing) staan in",
      "`shellscripts/macos/README.md` in de repo — die waarden zijn geen detail: een dockscript",
      "dat als root draait schrijft naar de verkeerde Dock en de gebruiker ziet niets.",
    ],
  },
];

/**
 * Kopieert één sidecar-map naar de export. Geeft de gekopieerde bestanden terug (relatief aan
 * de doelmap), of een lege lijst als de bronmap niet bestaat.
 */
function exportSidecar(outDir, { sourceDir, folder, extensions, how }) {
  const from = path.join(REPO_ROOT, sourceDir);
  if (!fs.existsSync(from)) return [];

  const written = [];
  for (const platform of fs.readdirSync(from, { withFileTypes: true })) {
    if (!platform.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(from, platform.name))) {
      if (!extensions.some((e) => file.endsWith(e))) continue;
      const target = path.join(outDir, folder, platform.name);
      fs.mkdirSync(target, { recursive: true });
      fs.copyFileSync(path.join(from, platform.name, file), path.join(target, file));
      written.push(`${platform.name}/${file}`);
    }
  }
  if (written.length === 0) return written;

  const lines = [`# ${folder}`, "", `**Gegenereerd** uit \`${sourceDir}/\` — niet met de hand bijwerken.`, "", ...how(written, folder), ""];
  fs.writeFileSync(path.join(outDir, folder, "README.md"), lines.join("\n"));
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

  const baseline = exportSet({ label: "Baseline", sourceDir: TEMPLATE_DIR, outDir, assignments });

  // Elke set naast de baseline, in de volgorde van SET_PREFIXES. Een set is optioneel: de
  // exporter moet ook werken in een checkout met alleen de baseline. Assignments
  // bewust leeg — die sets hebben er geen, en dat is de bedoeling.
  const extra = [];
  for (const [set, dirName] of Object.entries(SET_PREFIXES)) {
    if (set === "Baseline") continue;
    const sourceDir = path.join(REPO_ROOT, dirName);
    if (!fs.existsSync(sourceDir)) continue;
    console.log("");
    extra.push({ set, outDir: outDirFor(outDir, set), ...exportSet({ label: `${set} (voorstel)`, sourceDir, outDir: outDirFor(outDir, set), assignments: {} }) });
  }

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

  if (extra.length > 0) {
    console.log(`\n${extra.length === 1 ? "Eén set staat" : `${extra.length} sets staan`} apart en ${extra.length === 1 ? "wordt" : "worden"} door bovenstaande aanroep niet meegenomen:`);
    for (const e of extra) console.log(`  Start-IntuneRestoreConfig -Path '${e.outDir}'`);
    console.log("Geen Start-IntuneRestoreAssignments: die policies horen ongetoewezen terug en daarna met de hand");
    console.log("op een pilotgroep — niet op All Devices. Zie de README van de set.");
  }

  if (sidecars.length > 0) {
    console.log(`\nDeze kent de module niet en gaan apart — zie de README in elke map:`);
    for (const s of sidecars) console.log(`  ${s.folder}/  (${s.files.length})`);
  }
}

main();
