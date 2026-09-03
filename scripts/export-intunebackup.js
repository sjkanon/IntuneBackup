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
 * Tegenhanger van scripts/import-intunebackup.js. IntuneTemplate/ en ISMSTemplate/ blijven
 * de bron: de export is een afgeleide en wordt bij elke run volledig opnieuw geschreven.
 *
 * Twee sets, twee doelmappen — bewust niet één:
 *
 *   IntuneTemplate/  ->  .../IntuneBackupAndRestore/       de uitgerolde baseline, mét assignments
 *   ISMSTemplate/    ->  .../IntuneBackupAndRestore-ISMS/  de pilotset, zonder assignments
 *
 * `Start-IntuneRestoreConfig` krijgt één pad mee en zet alles terug wat eronder staat. Stonden
 * beide sets in dezelfde map, dan rolt wie de baseline terugzet ongemerkt tien pilotpolicies
 * mee uit — en die veranderen gedrag dat gebruikers direct merken (zie ISMSTemplate/README.md).
 * Twee paden houden dat een bewuste keuze. De ISMS-export bevat om dezelfde reden géén
 * Assignments/-submap: die policies horen na de restore met de hand op een pilotgroep.
 *
 * Gebruik: node scripts/export-intunebackup.js [doelmap]
 *   standaard doelmap: export/NativeImport/IntuneBackupAndRestore/
 *   de ISMS-set gaat naar diezelfde map met "-ISMS" erachter
 *
 * Die `NativeImport` in het pad is geen beschrijving maar een uitsluiting. CIPP scant een
 * template-repository met `git/trees?recursive=1` en negeert precies twee dingen: bestanden
 * die niet op `.json` eindigen, en paden waarin `NativeImport` voorkomt. Zonder dat woord in
 * het pad importeert CIPP deze map óók — dezelfde 98 policies, maar zonder RowKey, dus als
 * duplicaat met een eigen GUID naast het echte template. Zie export/README.md.
 */

const fs = require("fs");
const path = require("path");
const { readTemplates } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ISMS_DIR = path.join(REPO_ROOT, "ISMSTemplate");
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

function main() {
  const outDir = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUT;
  // Zusje van de baselinemap, niet een submap ervan: alles ónder het pad dat je aan
  // Start-IntuneRestoreConfig meegeeft wordt teruggezet.
  const ismsOutDir = outDir + "-ISMS";

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

  // ISMSTemplate/ is optioneel: de exporter moet ook werken in een checkout zonder die set.
  // Assignments bewust leeg — de pilotset heeft er geen, en dat is de bedoeling.
  let isms = null;
  if (fs.existsSync(ISMS_DIR)) {
    console.log("");
    isms = exportSet({ label: "ISMS (pilot)", sourceDir: ISMS_DIR, outDir: ismsOutDir, assignments: {} });
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

  if (isms) {
    console.log(`\nDe ISMS-pilotset staat apart en wordt door bovenstaande aanroep niet meegenomen:`);
    console.log(`  Start-IntuneRestoreConfig -Path '${ismsOutDir}'`);
    console.log("Geen Start-IntuneRestoreAssignments: deze policies horen ongetoewezen terug en daarna met de hand");
    console.log("op een pilotgroep — niet op All Devices. Zie ISMSTemplate/README.md.");
  }
}

main();
