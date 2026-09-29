#!/usr/bin/env node
/**
 * Converts profiles from IntuneAdmin/IntuneBaselines into IntuneTemplate/Baseline_*.json,
 * driven by the `intuneadmin` block in IntuneTemplate/_manifest.json.
 *
 * Counterpart of import-oib.js, and deliberately a separate script instead of a second mode
 * in it: the two sources deliver a different file format, and one importer that has to guess
 * in two places is exactly how you get a silent misconversion. What they *do* share — what a
 * CIPP template looks like, how to read a settings array — lives in lib/templates.js.
 *
 * Usage:
 *   git clone --depth 1 https://github.com/IntuneAdmin/IntuneBaselines .intuneadmin-source
 *   node scripts/import-intuneadmin.js --dry-run
 *   node scripts/import-intuneadmin.js
 *
 * Four things this script does deliberately:
 *
 *  1. **Read UTF-16LE.** Each of the 874 files in that repo is in UTF-16LE with a BOM.
 *     `readFileSync(f, "utf8")` produces mojibake there and `JSON.parse` fails — on all 874,
 *     so you notice that immediately. Worse is the case where someone strips the BOM and keeps
 *     the first half of the characters; hence the encoding is determined explicitly here.
 *  2. **GUIDs are preserved.** The RowKey identifies the CIPP template row. A rewritten
 *     template with a new GUID produces a second row with the same name on the next sync.
 *  3. **Template references are removed.** IntuneAdmin exports profiles that come from an
 *     Endpoint Security template, including `settingInstanceTemplateReference` and
 *     `settingValueTemplateReference` with ids from *their* tenant. Copying them over produces
 *     a template that does not import in another tenant. The settings themselves stay, the
 *     references do not.
 *  4. **Deliberate deviations stay in place.** Just like with OIB: a value different from what
 *     the source sets belongs in the manifest as `overrides`, *with* a `reason`. If the anchor
 *     disappears from a new version of the source, **the import stops with an error** instead
 *     of silently dropping the deviation — the latter is the most dangerous, because then the
 *     file still looks correct while the reason is gone.
 */

const fs = require("fs");
const path = require("path");
const { listTemplateFiles, readTemplate, relativePathFor, collectSettingIds, packageFor, composeDescription: composeTenantDescription } = require("./lib/templates");
const { Translator } = require("./lib/i18n");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const SOURCE_DIR = path.join(REPO_ROOT, ".intuneadmin-source");

/**
 * IntuneAdmin schrijft UTF-16LE met BOM. Een gewone utf8-read levert daar onleesbare tekst op.
 * Beide andere coderingen worden ook herkend, zodat het script niet omvalt als de repo ooit
 * naar UTF-8 overstapt.
 */
function readJsonAnyEncoding(filePath) {
  const b = fs.readFileSync(filePath);
  let text;
  if (b[0] === 0xff && b[1] === 0xfe) text = b.toString("utf16le", 2);
  else if (b[0] === 0xfe && b[1] === 0xff) throw new Error(`${filePath}: UTF-16BE wordt niet ondersteund`);
  else if (b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) text = b.toString("utf8", 3);
  else text = b.toString("utf8");
  return JSON.parse(text);
}

/** OData-annotaties en tenant-specifieke velden die niet in een gedeeld template horen. */
const DROP_KEYS = new Set([
  "id", "createdDateTime", "lastModifiedDateTime", "version", "isAssigned",
  "assignments", "scheduledActionsForRule", "settingCount", "creationSource", "priorityMetaData",
]);

function clean(node) {
  if (Array.isArray(node)) return node.map(clean);
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("#") || k.includes("@odata.") && k !== "@odata.type") continue;
    if (DROP_KEYS.has(k)) continue;
    // Punt 3: template-referenties uit de brontenant gaan eruit.
    if (k === "settingInstanceTemplateReference" || k === "settingValueTemplateReference") { out[k] = null; continue; }
    out[k] = clean(v);
  }
  return out;
}

/** Settings-array normaliseren naar {id, settingInstance} met oplopende id's. */
const renumber = (settings) => settings.map((s, i) => ({ id: String(i), settingInstance: s.settingInstance }));

/** De omschrijving in de tenant — Engels, uit lib/templates.js, dezelfde als set-packages.js schrijft. */
function composeDescription(entry, assignments) {
  return composeTenantDescription(entry, assignments[entry.displayName], new Translator("en"));
}

/**
 * `Package` bepaalt in welk CIPP-pakket de policy uitrolt en volgt uit de fase in
 * _manifest.json en het doel in _assignments.json — zie `packageFor` in lib/templates.js.
 */
function buildTemplateFile({ guid, displayName, description, type, body, pkg }) {
  const inner = { Displayname: displayName, Description: description, RAWJson: JSON.stringify(body), Type: type, GUID: guid, ReusableSettings: [] };
  return JSON.stringify({ PartitionKey: "IntuneTemplate", RowKey: guid, GUID: guid, JSON: JSON.stringify(inner), Package: pkg });
}

/**
 * Past de `overrides` uit het manifest toe. Zonder `parent` moet de instelling al in de bron
 * staan en wordt alleen de waarde vervangen; mét `parent` wordt hij als kind toegevoegd.
 * Ontbreekt het ankerpunt, dan is dat een fout — zie punt 4 in de kop.
 */
function applyOverrides(settings, entry) {
  const applied = [];
  for (const o of entry.overrides || []) {
    if (!o.reason) throw new Error(`${entry.target}: override voor ${o.settingDefinitionId} zonder "reason"`);
    const anchor = o.parent || o.settingDefinitionId;
    let found = false;
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      if (node.settingDefinitionId === o.settingDefinitionId && !o.parent) {
        if (node.choiceSettingValue) node.choiceSettingValue.value = o.value;
        else if (node.simpleSettingValue) node.simpleSettingValue.value = o.value;
        found = true;
      }
      if (o.parent && node.settingDefinitionId === o.parent && node.choiceSettingValue) {
        node.choiceSettingValue.children = node.choiceSettingValue.children || [];
        node.choiceSettingValue.children.push({
          "@odata.type": "#microsoft.graph.deviceManagementConfigurationChoiceSettingInstance",
          settingDefinitionId: o.settingDefinitionId,
          settingInstanceTemplateReference: null,
          choiceSettingValue: { "@odata.type": "#microsoft.graph.deviceManagementConfigurationChoiceSettingValue", settingValueTemplateReference: null, value: o.value, children: [] },
        });
        found = true;
      }
      for (const v of Object.values(node)) walk(v);
    };
    walk(settings);
    if (!found) throw new Error(`${entry.target}: override-ankerpunt ${anchor} staat niet in de bron. Is de bron gewijzigd? Werk de override bij of haal 'm weg — stil laten vervallen is erger.`);
    applied.push(`${entry.target}: ${o.settingDefinitionId} -> ${o.value}  (${o.reason})`);
  }
  return applied;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`.intuneadmin-source/ niet gevonden op ${SOURCE_DIR}`);
    console.error("Haal de bron eerst op:");
    console.error("  git clone --depth 1 https://github.com/IntuneAdmin/IntuneBaselines .intuneadmin-source");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const entries = (manifest.policies || []).filter((p) => p.intuneadmin && p.intuneadmin.source);

  if (entries.length === 0) {
    console.log("Geen enkele policy in _manifest.json heeft een `intuneadmin.source`.");
    console.log("");
    console.log("Dat is de huidige stand: de instellingen die uit IntuneAdmin komen zijn met de hand");
    console.log("overgenomen en tegen de settings catalog-definities geverifieerd, omdat de profielen daar");
    console.log("niet één op één overneembaar waren — ze bevatten template-referenties uit een andere");
    console.log("tenant, en op één plek een kapotte waarde (het NIS2-profiel zet AccountLockoutPolicy op");
    console.log('"15" terwijl de CSP daar drie velden in één string verwacht).');
    console.log("");
    console.log("Wil je een profiel wél laten importeren, zet dan in de regel van die policy:");
    console.log('  "intuneadmin": { "source": "<pad in .intuneadmin-source>", "type": "Catalog" }');
    console.log("en draai dit script opnieuw. Vanaf dat moment wordt die policy bij elke run bijgewerkt");
    console.log("uit de bron, en blijven bewuste afwijkingen alleen staan als ze als `overrides` in het");
    console.log("manifest staan mét een reden.");
    process.exit(0);
  }

  const written = [];
  const skipped = [];
  const overrideLog = [];
  const carried = [];

  for (const entry of entries) {
    const srcPath = path.join(SOURCE_DIR, entry.intuneadmin.source);
    if (!fs.existsSync(srcPath)) {
      console.error(`FOUT: ${entry.target} verwijst naar ${entry.intuneadmin.source}, maar dat bestand staat niet in .intuneadmin-source/.`);
      process.exit(1);
    }
    const source = clean(readJsonAnyEncoding(srcPath));
    const type = entry.intuneadmin.type || "Catalog";
    const existing = listTemplateFiles(TEMPLATE_DIR).find((f) => path.basename(f, ".json") === entry.target);
    const ours = existing ? readTemplate(existing) : null;
    const guid = ours ? ours.outer.GUID : entry.intuneadmin.guid;
    if (!guid) {
      console.error(`FOUT: ${entry.target} bestaat nog niet en het manifest geeft geen "intuneadmin.guid". Zonder vaste GUID maakt CIPP bij elke sync een nieuwe rij.`);
      process.exit(1);
    }

    let settings = (source.settings || []).map((s) => ({ settingInstance: s.settingInstance }));

    // Eigen instellingen die de bron niet kent blijven staan — zelfde regel als bij OIB: een
    // top-level instelling uit het oude template blijft, tenzij die settingDefinitionId
    // érgens in de bron voorkomt.
    if (ours) {
      const inSource = collectSettingIds(settings);
      const keep = (ours.raw.settings || []).filter((s) => !inSource.has(s.settingInstance && s.settingInstance.settingDefinitionId));
      if (keep.length > 0) {
        carried.push(`${entry.target}: ${keep.length} eigen instelling(en) behouden die IntuneAdmin niet zet`);
        settings = settings.concat(keep.map((s) => ({ settingInstance: s.settingInstance })));
      }
    }

    overrideLog.push(...applyOverrides(settings, entry));

    const description = composeDescription(entry, assignments);
    const body = {
      name: entry.displayName,
      description,
      settings: renumber(settings),
      platforms: source.platforms || "windows10",
      technologies: source.technologies || "mdm",
      templateReference: { templateId: "", templateFamily: "none", templateDisplayName: null, templateDisplayVersion: null },
    };
    const content = buildTemplateFile({ guid, displayName: entry.displayName, description, type, body, pkg: packageFor(entry, assignments[entry.displayName]) ?? "" });
    const dest = existing || path.join(TEMPLATE_DIR, relativePathFor(entry.target, type));

    if (ours && JSON.stringify(JSON.parse(content)) === JSON.stringify(ours.outer)) {
      skipped.push(entry.target);
      continue;
    }
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, content);
    }
    written.push(`${entry.target}  <-  ${entry.intuneadmin.source}`);
  }

  console.log(`${entries.length} policy/policies met een IntuneAdmin-bron.`);
  if (carried.length) { console.log("\nEigen instellingen behouden:"); for (const c of carried) console.log(`  ${c}`); }
  if (overrideLog.length) { console.log("\nOverrides toegepast:"); for (const o of overrideLog) console.log(`  ${o}`); }
  if (skipped.length) console.log(`\n${skipped.length} ongewijzigd.`);
  if (written.length) {
    console.log(`\n${written.length} ${dryRun ? "zou worden geschreven" : "geschreven"}:`);
    for (const w of written) console.log(`  ${w}`);
  }
  if (dryRun) console.log("\n--dry-run: er is niets weggeschreven.");
}

main();
