#!/usr/bin/env node
/**
 * Leest een IntuneBackupAndRestore-export (mappen per policytype, één JSON per policy,
 * plus een Assignments/-submap) en schrijft die om naar het CIPP-templateformaat in
 * IntuneTemplate/ — de bron waar generate-baseline.js en export-intunebackup.js op draaien.
 *
 * Tegenhanger van scripts/export-intunebackup.js; samen maken ze de baseline in beide
 * tools bruikbaar: CIPP leest IntuneTemplate/ rechtstreeks, IntuneBackupAndRestore leest
 * de map die de exporter schrijft.
 *
 * Standaard worden alleen policies toegevoegd die nog niet in IntuneTemplate/ staan.
 * Bestaande templates worden NIET overschreven zonder --overwrite: een export uit een
 * tenant is niet automatisch verser dan wat hier staat, en een half doorgevoerde
 * baselinewijziging zou er stilzwijgend mee teruggedraaid worden.
 *
 * Gebruik: node scripts/import-intunebackup.js <backup-map> [--overwrite] [--dry-run]
 *   bv.   node scripts/import-intunebackup.js "C:\\Temp\\BaselineIntuneBackup"
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");

/** Mapnaam in de backup -> CIPP-`Type`. Andere mappen worden overgeslagen (met melding). */
const FOLDER_TO_TYPE = {
  "Settings Catalog": "Catalog",
  "Administrative Templates": "Admin",
  "Device Configurations": "Device",
};

/**
 * Tenant-specifieke velden: horen niet in een template dat naar een andere tenant gaat.
 * `id`/`createdDateTime`/`lastModifiedDateTime` verwijzen naar het bronobject, `version` en
 * `supportsScopeTags` worden serverside gezet.
 */
const TENANT_FIELDS = ["id", "createdDateTime", "lastModifiedDateTime", "version", "supportsScopeTags", "@odata.context"];

/**
 * Bestandsnaamconventie van IntuneTemplate/, afgeleid uit de bestaande 21 bestanden:
 * "[Baseline] "-prefix eraf, leestekens weg, spaties naar underscores. " - " levert
 * daardoor een dubbele underscore op (Baseline_Edge_Standard_search_engine__Google).
 * assertFilenameConvention() controleert bij elke run dat dit nog klopt.
 */
function templateFileName(displayName) {
  const stripped = displayName.replace(/^\[Baseline\]\s*/, "");
  const slug = stripped.replace(/[^A-Za-z0-9 ]/g, "").replace(/ /g, "_");
  return `Baseline_${slug}.json`;
}

function assertFilenameConvention() {
  const mismatches = [];
  for (const f of fs.readdirSync(TEMPLATE_DIR)) {
    if (!f.startsWith("Baseline_") || !f.endsWith(".json")) continue;
    const inner = JSON.parse(JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, f), "utf8")).JSON);
    const expected = templateFileName(inner.Displayname);
    if (expected !== f) mismatches.push(`  ${f} -> conventie zegt ${expected} (Displayname: ${inner.Displayname})`);
  }
  if (mismatches.length > 0) {
    console.error("De bestandsnaamconventie klopt niet meer voor bestaande templates:");
    console.error(mismatches.join("\n"));
    console.error("Pas templateFileName() aan voordat je importeert, anders ontstaan er duplicaten.");
    process.exit(1);
  }
}

function stripTenantFields(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (!TENANT_FIELDS.includes(k)) out[k] = v;
  return out;
}

/**
 * Settings Catalog-export naar CIPP-RAWJson. `settingCount` is Graph's eigen telling; als
 * die niet overeenkomt met het aantal geëxporteerde settings is de export afgekapt (Graph
 * pagineert de settings-navigatieproperty standaard op 25) en is het bestand onbruikbaar
 * om mee te restoren — dan liever hard stoppen dan een halve policy importeren.
 */
function convertCatalog(policy, displayName) {
  if (typeof policy.settingCount === "number" && policy.settingCount !== (policy.settings || []).length) {
    return { error: `afgekapte export: settingCount=${policy.settingCount} maar ${(policy.settings || []).length} settings in het bestand (Graph-paginering niet gevolgd)` };
  }
  return {
    rawJson: {
      name: displayName,
      description: policy.description || "",
      settings: policy.settings || [],
      platforms: policy.platforms,
      technologies: policy.technologies,
      templateReference: policy.templateReference || { templateId: "", templateFamily: "none", templateDisplayName: null, templateDisplayVersion: null },
    },
  };
}

/**
 * ADMX-export is een kale array van definitionValues; CIPP verwacht de
 * groupPolicyConfigurations-updateDefinitionValues-body ({added, updated, deletedIds}).
 */
function convertAdmin(policy) {
  if (!Array.isArray(policy)) return { error: "verwachtte een array van definitionValues" };
  return {
    rawJson: {
      added: policy.map((d) => ({
        "definition@odata.bind": d["definition@odata.bind"],
        enabled: !!d.enabled,
        presentationValues: d.presentationValues || [],
      })),
      updated: [],
      deletedIds: [],
    },
  };
}

function convertDevice(policy) {
  if (!policy["@odata.type"]) return { error: "geen @odata.type — zonder dat kan CIPP de policy niet aanmaken" };
  return { rawJson: stripTenantFields(policy) };
}

function main() {
  const argv = process.argv.slice(2);
  const backupDir = argv.find((a) => !a.startsWith("--"));
  const overwrite = argv.includes("--overwrite");
  const dryRun = argv.includes("--dry-run");

  if (!backupDir) {
    console.error("Gebruik: node scripts/import-intunebackup.js <backup-map> [--overwrite] [--dry-run]");
    process.exit(1);
  }
  if (!fs.existsSync(backupDir)) {
    console.error(`Backup-map niet gevonden: ${backupDir}`);
    process.exit(1);
  }
  assertFilenameConvention();

  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const added = [], skipped = [], overwritten = [], failed = [];

  for (const folder of fs.readdirSync(backupDir)) {
    const folderPath = path.join(backupDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    const type = FOLDER_TO_TYPE[folder];
    if (!type) {
      console.warn(`Map overgeslagen (geen bekend policytype): ${folder}`);
      continue;
    }

    for (const file of fs.readdirSync(folderPath)) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isDirectory()) continue;

      const policy = JSON.parse(fs.readFileSync(filePath, "utf8"));
      // ADMX-exports zijn kale arrays zonder naam — de bestandsnaam ís de displayName.
      const displayName = policy.name || policy.displayName || path.basename(file, ".json");
      const target = templateFileName(displayName);
      const targetPath = path.join(TEMPLATE_DIR, target);
      const exists = fs.existsSync(targetPath);

      // Assignments staan in de backup in een parallelle Assignments/-submap. Die lezen we
      // ook voor overgeslagen policies: de assignment is losse informatie die nergens
      // anders in de repo staat, ook als het template zelf ongemoeid blijft.
      const assignmentPath = path.join(folderPath, "Assignments", file);
      if (fs.existsSync(assignmentPath)) {
        const rawAssignment = JSON.parse(fs.readFileSync(assignmentPath, "utf8"));
        assignments[displayName] = (Array.isArray(rawAssignment) ? rawAssignment : [rawAssignment]).map((a) => ({ target: a.target }));
      }

      if (exists && !overwrite) {
        skipped.push(`${displayName} -> ${target} (bestaat al; --overwrite om te vervangen)`);
        continue;
      }

      const conv = type === "Catalog" ? convertCatalog(policy, displayName) : type === "Admin" ? convertAdmin(policy) : convertDevice(policy);
      if (conv.error) {
        failed.push(`${displayName} [${folder}]: ${conv.error}`);
        continue;
      }

      // GUID hergebruiken bij overschrijven, zodat CIPP het als dezelfde template ziet.
      const guid = exists ? JSON.parse(fs.readFileSync(targetPath, "utf8")).GUID : crypto.randomUUID();
      const inner = {
        Displayname: displayName,
        Description: (Array.isArray(policy) ? "" : policy.description) || "",
        RAWJson: JSON.stringify(conv.rawJson),
        Type: type,
        GUID: guid,
        ReusableSettings: [],
      };
      const row = { PartitionKey: "IntuneTemplate", RowKey: guid, GUID: guid, JSON: JSON.stringify(inner), Package: "Baseline" };

      if (!dryRun) fs.writeFileSync(targetPath, JSON.stringify(row) + "\n");
      (exists ? overwritten : added).push(`${displayName} -> ${target} [${type}]`);
    }
  }

  if (!dryRun && Object.keys(assignments).length > 0) {
    const sorted = Object.fromEntries(Object.keys(assignments).sort().map((k) => [k, assignments[k]]));
    fs.writeFileSync(ASSIGNMENTS_PATH, JSON.stringify(sorted, null, 2) + "\n");
  }

  const report = (label, list) => { if (list.length) { console.log(`\n${label} (${list.length}):`); for (const l of list) console.log(`  ${l}`); } };
  report("Toegevoegd", added);
  report("Overschreven", overwritten);
  report("Overgeslagen", skipped);
  report("MISLUKT", failed);
  console.log(`\n${dryRun ? "[dry-run] " : ""}Assignments bijgewerkt voor ${Object.keys(assignments).length} policies -> ${path.relative(REPO_ROOT, ASSIGNMENTS_PATH)}`);
  if (added.length || overwritten.length) console.log("Draai hierna `node scripts/generate-baseline.js` om de baseline bij te werken.");
  if (failed.length) process.exit(1);
}

main();
