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
const { readTemplates, relativePathFor, packageFor } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");

/** Mapnaam in de backup -> CIPP-`Type`. Andere mappen worden overgeslagen (met melding). */
const FOLDER_TO_TYPE = {
  "Settings Catalog": "Catalog",
  "Administrative Templates": "Admin",
  "Device Configurations": "Device",
  "Device Compliance Policies": "deviceCompliancePolicies",
  "App Protection Policies": "AppProtection",
};

/**
 * Tenant-specifieke velden: horen niet in een template dat naar een andere tenant gaat.
 * `id`/`createdDateTime`/`lastModifiedDateTime` verwijzen naar het bronobject, `version` en
 * `supportsScopeTags` worden serverside gezet. `isAssigned`/`deployedAppCount` zijn
 * afgeleide tellers uit de brontenant.
 */
const TENANT_FIELDS = ["id", "createdDateTime", "lastModifiedDateTime", "version", "supportsScopeTags", "@odata.context", "isAssigned", "deployedAppCount"];

/**
 * Bestandsnaam uit de policynaam: "[Baseline] - WIN - D - In-Box App Removal" wordt
 * "Baseline_WIN_D_In_Box_App_Removal". Leestekens worden underscores (niet weggehaald),
 * zodat "Sign-On" leesbaar "Sign_On" wordt in plaats van "SignOn".
 *
 * Dit is alleen een vangnet voor policies die hier nog niet bestaan. Bestaat de naam al,
 * dan wint het pad van dát bestand — de namen in IntuneTemplate/ zijn met de hand gekozen
 * (korter dan de policynaam, bv. "Microsoft Edge Profiles and Sync") en een mechanische
 * afleiding zou daar een tweede bestand naast zetten.
 */
function deriveBaseName(displayName) {
  const m = displayName.match(/^\[Baseline\] - (WIN|MAC|IOS|AND) - ([DU]) - (.+)$/);
  if (!m) return null;
  const item = m[3]
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `Baseline_${m[1]}_${m[2]}_${item}`;
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

/**
 * Compliance-policies moeten hun scheduledActionsForRule houden: zonder actie gebeurt er bij
 * non-compliance niets, en Graph weigert een POST zonder die property. De id's erin zijn
 * tenant-specifiek en gaan er juist uit.
 */
function convertCompliance(policy) {
  if (!policy["@odata.type"]) return { error: "geen @odata.type — zonder dat weet Graph niet welk soort compliance-policy dit is" };
  const rules = (policy.scheduledActionsForRule || []).map((rule) => ({
    ruleName: rule.ruleName ?? "PasswordRequired",
    scheduledActionConfigurations: (rule.scheduledActionConfigurations || []).map((cfg) => stripTenantFields(cfg)),
  }));
  return {
    rawJson: {
      ...stripTenantFields(policy),
      scheduledActionsForRule: rules.length > 0 ? rules : [{ ruleName: "PasswordRequired", scheduledActionConfigurations: [{ actionType: "block", gracePeriodHours: 0, notificationTemplateId: "" }] }],
    },
  };
}

/**
 * App Protection: `apps` gaat eruit. Bij appGroupType "allMicrosoftApps" bepaalt Intune de
 * lijst zelf en is de meegeëxporteerde lijst een momentopname van de brontenant; CIPP
 * verwijdert 'm ook voor het POST't.
 */
function convertAppProtection(policy) {
  if (!policy["@odata.type"]) return { error: "geen @odata.type — zonder dat kan de policy niet aan een platform gekoppeld worden" };
  const { apps, assignments, deploymentSummary, ...rest } = policy;
  return { rawJson: stripTenantFields(rest) };
}

/**
 * Assignments staan in een parallelle Assignments/-submap. Twee vormen, allebei uit
 * IntuneBackupAndRestore zelf: bij App Protection heet het bestand "<id> - <naam>.json" en
 * zit de lijst in een `value`-property; bij de rest is de bestandsnaam de policynaam en is
 * de inhoud een kale array.
 */
function readAssignment(folderPath, file, type) {
  const dir = path.join(folderPath, "Assignments");
  if (!fs.existsSync(dir)) return null;

  let assignmentFile = path.join(dir, file);
  if (type === "AppProtection") {
    const suffix = ` - ${file}`;
    const match = fs.readdirSync(dir).find((f) => f === file || f.endsWith(suffix));
    if (!match) return null;
    assignmentFile = path.join(dir, match);
  }
  if (!fs.existsSync(assignmentFile)) return null;

  const raw = JSON.parse(fs.readFileSync(assignmentFile, "utf8"));
  const list = Array.isArray(raw) ? raw : Array.isArray(raw.value) ? raw.value : [raw];
  return list.map((a) => ({ target: a.target })).filter((a) => a.target);
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
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) : { policies: [] };
  const manifestByTarget = new Map((manifest.policies || []).map((p) => [p.target, p]));
  const existingByName = new Map(readTemplates(TEMPLATE_DIR).map((t) => [t.displayName, t]));
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

      // Bestaat de policy hier al, dan is zijn huidige pad leidend; anders leiden we naam en
      // map af. Zoeken op naam en niet op pad, omdat een template in IntuneTemplate/ een
      // kortere bestandsnaam mag hebben dan de policynaam.
      const existing = existingByName.get(displayName);
      const baseName = existing ? existing.baseName : deriveBaseName(displayName);
      if (!baseName) {
        failed.push(`${displayName} [${folder}]: naam volgt niet "[Baseline] - PLATFORM - D/U - Item", dus is niet in te delen`);
        continue;
      }
      const relPath = relativePathFor(baseName, type);
      const targetPath = existing ? existing.filePath : path.join(TEMPLATE_DIR, relPath);
      const target = path.relative(TEMPLATE_DIR, targetPath).split(path.sep).join("/");
      const exists = Boolean(existing);

      // Assignments lezen we ook voor overgeslagen policies: de assignment is losse
      // informatie die nergens anders in de repo staat, ook als het template zelf
      // ongemoeid blijft.
      const assignment = readAssignment(folderPath, file, type);
      if (assignment) assignments[displayName] = assignment;

      if (exists && !overwrite) {
        skipped.push(`${displayName} -> ${target} (bestaat al; --overwrite om te vervangen)`);
        continue;
      }

      const conv =
        type === "Catalog" ? convertCatalog(policy, displayName)
        : type === "Admin" ? convertAdmin(policy)
        : type === "deviceCompliancePolicies" ? convertCompliance(policy)
        : type === "AppProtection" ? convertAppProtection(policy)
        : convertDevice(policy);
      if (conv.error) {
        failed.push(`${displayName} [${folder}]: ${conv.error}`);
        continue;
      }

      // GUID hergebruiken bij overschrijven, zodat CIPP het als dezelfde template ziet.
      const guid = existing ? existing.inner.GUID : crypto.randomUUID();
      const inner = {
        Displayname: displayName,
        Description: (Array.isArray(policy) ? "" : policy.description) || "",
        RAWJson: JSON.stringify(conv.rawJson),
        Type: type,
        GUID: guid,
        ReusableSettings: [],
      };
      // Een policy die hier voor het eerst uit een tenant binnenkomt heeft nog geen regel in
      // _manifest.json, en dus geen fase — dan is niet te zeggen in welk CIPP-pakket hij
      // hoort. Lege `Package` is daar het juiste antwoord: hij staat in de repo, maar rolt
      // nergens uit tot iemand de fase heeft bepaald. Draai daarna set-packages.js.
      const row = { PartitionKey: "IntuneTemplate", RowKey: guid, GUID: guid, JSON: JSON.stringify(inner), Package: packageFor(manifestByTarget.get(baseName), assignments[displayName]) ?? "" };

      if (!dryRun) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, JSON.stringify(row) + "\n");
      }
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
