#!/usr/bin/env node
/**
 * Bewaakt de device/user-scheiding in IntuneTemplate/ (zie PLAN.md).
 *
 * Drie dingen moeten kloppen:
 *  1. Eén policy bevat nooit zowel device- als user-scoped settings. Een gemengde policy kun
 *     je niet eenduidig toewijzen, en bij troubleshooting zie je niet of een instelling niet
 *     aankomt omdat het apparaat of omdat de gebruiker buiten scope valt.
 *  2. Bestandsnaam (Baseline_D_* / Baseline_U_*) en policynaam ([Baseline] - D/U - Item)
 *     dragen dezelfde scope.
 *  3. Die aangekondigde scope komt overeen met wat er werkelijk in de settings staat.
 *
 * De scope volgt uit de settingDefinitionId, niet uit het onderwerp: alles wat begint met
 * `user_` is user-scoped, de rest is device-scoped. Let op de derde vorm die in deze repo
 * voorkomt — Firewall gebruikt ids die met `vendor_msft_` beginnen, zonder device-prefix;
 * die zijn device-scoped.
 *
 * Voor Type "Admin" (ADMX) en "Device" is de scope niet uit het bestand af te leiden: daar
 * staan alleen catalogus-GUID's respectievelijk een kale deviceConfiguration in. Die worden
 * alleen op naamconventie gecontroleerd en in het overzicht als "n.v.t." gemeld.
 *
 * Gebruik:
 *   node scripts/check-scope.js            controleert alles, exit 1 bij problemen
 *   node scripts/check-scope.js --report    alleen het overzicht, exit altijd 0
 *
 * Wordt de eerste stap in .github/workflows/generate-baseline.yml zodra PLAN.md fase 2
 * (de hernoeming) gemerged is — tot die tijd meldt hij terecht de nog openstaande migratie.
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");

const FILE_NAME_RE = /^Baseline_([DU])_.+$/;
const DISPLAY_NAME_RE = /^\[Baseline\] - ([DU]) - .+$/;

/** Verzamelt elke settingDefinitionId uit een settingInstance-boom, ongeacht instance-vorm. */
function collectSettingIds(node, acc) {
  if (!node || typeof node !== "object") return acc;
  if (Array.isArray(node)) {
    for (const child of node) collectSettingIds(child, acc);
    return acc;
  }
  if (typeof node.settingDefinitionId === "string") acc.add(node.settingDefinitionId);
  for (const key of Object.keys(node)) collectSettingIds(node[key], acc);
  return acc;
}

function scopeOfSettingId(id) {
  return id.startsWith("user_") ? "U" : "D";
}

function readTemplate(file) {
  const outer = JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, file), "utf8"));
  const inner = JSON.parse(outer.JSON);
  return { baseName: path.basename(file, ".json"), type: inner.Type, displayName: inner.Displayname, inner };
}

function analyse(template) {
  const { baseName, type, displayName, inner } = template;
  const problems = [];

  const fileMatch = baseName.match(FILE_NAME_RE);
  const nameMatch = (displayName || "").match(DISPLAY_NAME_RE);
  const fileScope = fileMatch ? fileMatch[1] : null;
  const nameScope = nameMatch ? nameMatch[1] : null;

  if (!fileScope) problems.push(`bestandsnaam volgt niet Baseline_D_* / Baseline_U_*`);
  if (!nameScope) problems.push(`policynaam volgt niet "[Baseline] - D/U - Item" (nu: "${displayName}")`);
  if (fileScope && nameScope && fileScope !== nameScope) {
    problems.push(`bestandsnaam zegt ${fileScope}, policynaam zegt ${nameScope}`);
  }

  let actual = null;
  let counts = null;
  if (type === "Catalog") {
    const raw = JSON.parse(inner.RAWJson);
    const ids = [...collectSettingIds(raw.settings || [], new Set())];
    const device = ids.filter((id) => scopeOfSettingId(id) === "D");
    const user = ids.filter((id) => scopeOfSettingId(id) === "U");
    counts = { device: device.length, user: user.length };

    if (device.length > 0 && user.length > 0) {
      actual = "gemengd";
      problems.push(`gemengde scope: ${device.length} device- en ${user.length} user-settings — splitsen`);
      for (const id of user) problems.push(`  user-scoped: ${id}`);
    } else if (user.length > 0) {
      actual = "U";
    } else if (device.length > 0) {
      actual = "D";
    }

    const declared = fileScope || nameScope;
    if (declared && actual && actual !== "gemengd" && declared !== actual) {
      problems.push(`aangekondigd als ${declared}, maar de settings zijn ${actual}-scoped`);
    }
  }

  return { ...template, fileScope, nameScope, actual, counts, problems };
}

function main() {
  const reportOnly = process.argv.includes("--report");

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`IntuneTemplate/ niet gevonden op ${TEMPLATE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(TEMPLATE_DIR).filter((f) => f.startsWith("Baseline_") && f.endsWith(".json")).sort();
  if (files.length === 0) {
    console.error("Geen Baseline_*.json-bestanden gevonden in IntuneTemplate/");
    process.exit(1);
  }

  const results = files.map((f) => analyse(readTemplate(f)));

  console.log("Scope-overzicht (bron: settingDefinitionId-prefix, niet het onderwerp)\n");
  const rows = results.map((r) => ({
    naam: r.displayName,
    type: r.type,
    scope: r.type === "Catalog" ? r.actual ?? "leeg" : "n.v.t.",
    settings: r.counts ? `${r.counts.device}D / ${r.counts.user}U` : "-",
    ok: r.problems.length === 0 ? "ok" : "!",
  }));
  const w = (key) => Math.max(key.length, ...rows.map((row) => String(row[key]).length));
  const widths = { naam: w("naam"), type: w("type"), scope: w("scope"), settings: w("settings") };
  const line = (row) =>
    `  ${String(row.ok).padEnd(2)}${String(row.naam).padEnd(widths.naam)}  ${String(row.type).padEnd(widths.type)}  ${String(row.scope).padEnd(widths.scope)}  ${String(row.settings).padStart(widths.settings)}`;
  console.log(line({ ok: "", naam: "POLICY", type: "TYPE", scope: "SCOPE", settings: "SETTINGS" }));
  for (const row of rows) console.log(line(row));

  const failing = results.filter((r) => r.problems.length > 0);
  if (failing.length === 0) {
    console.log(`\nAlle ${results.length} policies hebben een eenduidige scope en volgen de naamconventie.`);
    return;
  }

  console.log(`\n${failing.length} van ${results.length} policies hebben werk openstaan:\n`);
  for (const r of failing) {
    console.log(`  ${r.baseName}.json`);
    for (const p of r.problems) console.log(`    - ${p}`);
  }

  const mixed = failing.filter((r) => r.actual === "gemengd");
  if (mixed.length > 0) {
    console.log(`\n${mixed.length} policy/policies zijn inhoudelijk gemengd — die moeten gesplitst, hernoemen alleen is niet genoeg.`);
  }

  if (reportOnly) {
    console.log("\n(--report: geen exitcode-fout)");
    return;
  }
  process.exit(1);
}

main();
