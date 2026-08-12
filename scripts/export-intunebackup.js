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
 * POST't het bestand minus id/createdDateTime/lastModifiedDateTime/version.
 *
 * Tegenhanger van scripts/import-intunebackup.js. IntuneTemplate/ blijft de bron: de
 * export is een afgeleide en wordt bij elke run volledig opnieuw geschreven.
 *
 * Gebruik: node scripts/export-intunebackup.js [doelmap]
 *   standaard doelmap: export/IntuneBackupAndRestore/
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const DEFAULT_OUT = path.join(REPO_ROOT, "export", "IntuneBackupAndRestore");

/** CIPP-`Type` -> mapnaam die IntuneBackupAndRestore gebruikt. */
const TYPE_TO_FOLDER = {
  Catalog: "Settings Catalog",
  Admin: "Administrative Templates",
  Device: "Device Configurations",
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

function main() {
  const outDir = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUT;

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`IntuneTemplate/ niet gevonden op ${TEMPLATE_DIR}`);
    process.exit(1);
  }
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};

  const templateFiles = fs.readdirSync(TEMPLATE_DIR).sort().filter((f) => f.startsWith("Baseline_") && f.endsWith(".json"));
  const templates = templateFiles.map((file) => ({
    file,
    inner: JSON.parse(JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, file), "utf8")).JSON),
  }));

  // Een sleutel in _assignments.json die geen enkele Displayname meer raakt is een fout, geen
  // detail: assignments worden op naam gematcht, dus na een hernoeming waarbij dit bestand
  // niet meebeweegt verdwijnt de toewijzing stil uit de export en rolt de restore de policy
  // ongetoewezen uit. Dat merk je pas als iemand zich afvraagt waarom de baseline nergens
  // landt. Vóór de D/U-hernoeming (PLAN.md fase 2) is dit precies het vangnet dat mist.
  //
  // Vóór rmDirContents, niet erna: afbreken mag de bestaande export niet half gesloopt
  // achterlaten.
  const knownDisplayNames = new Set(templates.map((t) => t.inner.Displayname));
  const orphaned = Object.keys(assignments).filter((n) => !knownDisplayNames.has(n));
  if (orphaned.length > 0) {
    console.error(`FOUT: ${orphaned.length} sleutel(s) in ${path.relative(REPO_ROOT, ASSIGNMENTS_PATH)} horen bij geen enkele policy in IntuneTemplate/:`);
    for (const n of orphaned) console.error(`  - "${n}"`);
    console.error("Hernoemd of verwijderd? Werk _assignments.json bij. De export is ongewijzigd gelaten.");
    process.exit(1);
  }

  // Volledig herschrijven: een template dat uit IntuneTemplate/ verdwijnt moet ook uit de
  // export verdwijnen, anders rolt een restore later een policy uit die niet meer bestaat.
  rmDirContents(outDir);

  const written = [];
  const skipped = [];
  let withoutAssignment = 0;

  for (const { file, inner } of templates) {
    const folder = TYPE_TO_FOLDER[inner.Type];
    if (!folder) {
      skipped.push(`${file}: onbekend Type "${inner.Type}"`);
      continue;
    }

    const rawJson = JSON.parse(inner.RAWJson);
    const body = inner.Type === "Catalog" ? catalogBody(rawJson) : inner.Type === "Admin" ? adminBody(rawJson) : rawJson;
    const name = safeFileName(inner.Displayname) + ".json";

    fs.mkdirSync(path.join(outDir, folder), { recursive: true });
    fs.writeFileSync(path.join(outDir, folder, name), JSON.stringify(body, null, 4) + "\n");

    const assignment = assignments[inner.Displayname];
    if (assignment && assignment.length > 0) {
      fs.mkdirSync(path.join(outDir, folder, "Assignments"), { recursive: true });
      fs.writeFileSync(path.join(outDir, folder, "Assignments", name), JSON.stringify(assignment, null, 4) + "\n");
    } else {
      withoutAssignment += 1;
    }
    written.push(`${folder}/${name}`);
  }

  console.log(`Geschreven naar ${outDir} (${written.length} policies):`);
  for (const w of written) console.log(`  ${w}`);
  if (withoutAssignment > 0) console.log(`\n${withoutAssignment} policy/policies zonder assignment in ${path.relative(REPO_ROOT, ASSIGNMENTS_PATH)} — die worden zonder toewijzing teruggezet.`);
  if (skipped.length > 0) {
    console.log(`\n${skipped.length} overgeslagen:`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  console.log("\nTerugzetten (module IntuneBackupAndRestore 4.x):");
  console.log(`  Start-IntuneRestoreConfig -Path '${outDir}'`);
  console.log("  Start-IntuneRestoreAssignments -Path '<zelfde pad>' -RestoreById $false");
  console.log("Let op: -RestoreById $false is vereist — de assignments in de export bevatten bewust geen tenant-id's,");
  console.log("de module matcht dan op policynaam. Dat is ook de enige modus die cross-tenant klopt.");
}

main();
