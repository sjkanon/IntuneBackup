#!/usr/bin/env node
/**
 * Bewaakt de indeling van IntuneTemplate/ (zie PLAN.md).
 *
 * Vijf dingen moeten kloppen:
 *  1. Eén policy bevat nooit zowel device- als user-scoped settings. Een gemengde policy kun
 *     je niet eenduidig toewijzen, en bij troubleshooting zie je niet of een instelling niet
 *     aankomt omdat het apparaat of omdat de gebruiker buiten scope valt.
 *  2. Bestandsnaam (Baseline_<PLATFORM>_<D|U>_*) en policynaam ([Baseline] - PLATFORM - D/U -
 *     Item) dragen hetzelfde platform en dezelfde scope.
 *  3. Die aangekondigde scope komt overeen met wat er werkelijk in de settings staat.
 *  4. Het bestand staat in de map die bij zijn platform en Type hoort.
 *  5. Geen twee toegewezen policies zetten dezelfde settingDefinitionId — dat levert in
 *     Intune een *Conflict* op, waarna de instelling door géén van beide wordt toegepast.
 *
 * De scope volgt uit de settingDefinitionId, niet uit het onderwerp: alles wat begint met
 * `user_` is user-scoped, de rest is device-scoped. Let op de derde vorm die in deze repo
 * voorkomt — Firewall en BitLocker gebruiken ids die met `vendor_msft_` beginnen, zonder
 * device-prefix; die zijn device-scoped.
 *
 * **Alleen voor Windows.** Bij macOS, iOS en Android zegt de settingDefinitionId niets over
 * device- of user-scope (`com.apple.*`, geen prefix), en bij Type "Admin", "Device",
 * "deviceCompliancePolicies" en "AppProtection" staan er helemaal geen settings in het
 * bestand. Daar is D/U een keuze over het toewijzingsdoel en wordt alleen de naamconventie
 * gecontroleerd. Dat is ook hoe OpenIntuneBaseline de letters gebruikt; voor Windows houden
 * we de strengere, afleidbare regel aan omdat die wél te controleren is.
 *
 * Gebruik:
 *   node scripts/check-scope.js            controleert alles, exit 1 bij problemen
 *   node scripts/check-scope.js --report    alleen het overzicht, exit altijd 0
 */

const fs = require("fs");
const path = require("path");
const { PLATFORMS, readTemplates, relativePathFor, parseBaseName, collectSettingIds, flattenSettings } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const RENAMES_PATH = path.join(TEMPLATE_DIR, "_renames.json");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");

const DISPLAY_NAME_RE = /^\[Baseline\] - (WIN|MAC|IOS|AND) - ([DU]) - .+$/;

/**
 * Update-ringen zetten bewust dezelfde instellingen met andere waarden — dat is geen
 * conflict maar het idee: elke ring krijgt een eigen groep. Ze staan daarom ook zonder
 * assignment in _assignments.json.
 */
const RING_RE = /_Update_Ring_\d/;

function scopeOfSettingId(id) {
  return id.startsWith("user_") ? "U" : "D";
}

function analyse(template) {
  const { baseName, type, displayName, raw, filePath } = template;
  const problems = [];

  const parsed = parseBaseName(baseName);
  const nameMatch = (displayName || "").match(DISPLAY_NAME_RE);

  if (!parsed) problems.push("bestandsnaam volgt niet Baseline_<WIN|MAC|IOS|AND>_<D|U>_Item");
  if (!nameMatch) problems.push(`policynaam volgt niet "[Baseline] - PLATFORM - D/U - Item" (nu: "${displayName}")`);
  if (parsed && nameMatch) {
    if (parsed.platform !== nameMatch[1]) problems.push(`bestandsnaam zegt platform ${parsed.platform}, policynaam zegt ${nameMatch[1]}`);
    if (parsed.scope !== nameMatch[2]) problems.push(`bestandsnaam zegt scope ${parsed.scope}, policynaam zegt ${nameMatch[2]}`);
  }

  if (parsed) {
    const expected = relativePathFor(baseName, type);
    if (!expected) {
      problems.push(`onbekend Type "${type}" — geen map voor dit policytype`);
    } else {
      const actual = path.relative(TEMPLATE_DIR, filePath);
      if (path.normalize(actual) !== path.normalize(expected)) {
        problems.push(`staat in ${actual.split(path.sep).join("/")}, hoort in ${expected.split(path.sep).join("/")}`);
      }
    }

    // Het platform in de naam moet overeenkomen met wat de policy zelf zegt. Een macOS-
    // policy die als WIN de deur uit gaat rolt nergens uit en valt niet op.
    if (type === "Catalog" && raw.platforms) {
      const expectedPlatforms = PLATFORMS[parsed.platform].expectedPlatforms;
      if (!expectedPlatforms.includes(raw.platforms)) {
        problems.push(`naam zegt ${parsed.platform}, maar platforms is "${raw.platforms}" (verwacht ${expectedPlatforms.join(" of ")})`);
      }
    }
  }

  // Scope-afleiding: alleen zinvol voor Windows Settings Catalog, zie de kop.
  //
  // Op de settings van het hoogste niveau, niet op de hele boom. Intune hangt sommige
  // instellingen als kind onder een parent van de andere scope — "Allow Windows Spotlight"
  // is user-scoped en heeft device-scoped kinderen (allowwindowsconsumerfeatures,
  // allowwindowstips). Die zijn niet los te configureren: ze bestaan alleen als kind en
  // reizen mee met hun parent. Een gemengde boom is dus niet per se een gemengde policy;
  // een gemengd tópniveau wel, want dát zijn de instellingen die je zelf kiest.
  let actual = null;
  let counts = null;
  let nestedOtherScope = [];
  const derivable = type === "Catalog" && parsed && parsed.platform === "WIN";
  if (derivable) {
    const topLevel = (raw.settings || []).map((s) => s.settingInstance.settingDefinitionId);
    const device = topLevel.filter((id) => scopeOfSettingId(id) === "D");
    const user = topLevel.filter((id) => scopeOfSettingId(id) === "U");
    counts = { device: device.length, user: user.length };

    if (device.length > 0 && user.length > 0) {
      actual = "gemengd";
      problems.push(`gemengde scope: ${device.length} device- en ${user.length} user-settings op topniveau — splitsen`);
      for (const id of user) problems.push(`  user-scoped: ${id}`);
    } else if (user.length > 0) {
      actual = "U";
    } else if (device.length > 0) {
      actual = "D";
    }

    const declared = parsed.scope;
    if (declared && actual && actual !== "gemengd" && declared !== actual) {
      problems.push(`aangekondigd als ${declared}, maar de settings zijn ${actual}-scoped`);
    }

    if (actual === "D" || actual === "U") {
      const all = [...collectSettingIds(raw.settings || [], new Set())];
      nestedOtherScope = all.filter((id) => !topLevel.includes(id) && scopeOfSettingId(id) !== actual);
    }
  }

  return { ...template, parsed, actual, counts, nestedOtherScope, problems };
}

/**
 * Twee policies die dezelfde instelling zetten zijn alleen een probleem als ze allebei
 * ergens landen én een andere waarde zetten. Drie afwegingen:
 *
 * - Een policy zonder assignment (de pilot-ringen) doet niets en telt dus niet mee, anders
 *   zou de check klagen over precies de constructie die bedoeld is.
 * - Vergelijken gebeurt op uitgeklapte instelling + waarde, niet op settingDefinitionId.
 *   Dezelfde waarde uit twee policies is geen conflict maar dubbelop: Intune past 'm
 *   gewoon toe. Verschillende waarden zijn wél een conflict — dan wordt de instelling door
 *   géén van beide toegepast.
 * - Alleen voor Windows. macOS-policies leveren elk een eigen configuratieprofiel; dat
 *   meerdere profielen dezelfde payload (PPPC, system extensions, service management)
 *   gebruiken is bij Apple normaal en wordt samengevoegd, niet als conflict behandeld.
 *   Die overlap wordt daarom alleen gemeld.
 */
function findOverlaps(results, assignments) {
  const windows = new Map();
  const otherPlatforms = new Map();

  for (const r of results) {
    if (r.type !== "Catalog" || !r.parsed) continue;
    if (!assignments[r.displayName] || assignments[r.displayName].length === 0) continue;
    if (RING_RE.test(r.baseName)) continue;

    if (r.parsed.platform === "WIN") {
      for (const s of flattenSettings(r.raw.settings).settings) {
        const key = s.settingDefinitionId;
        if (!windows.has(key)) windows.set(key, new Map());
        const perPolicy = windows.get(key);
        if (!perPolicy.has(r.displayName)) perPolicy.set(r.displayName, new Set());
        perPolicy.get(r.displayName).add(JSON.stringify(s.expectedValue));
      }
    } else {
      // Alleen de top-level payload: de kinderen zijn collectie-items en horen per policy
      // te verschillen.
      for (const s of r.raw.settings || []) {
        const key = s.settingInstance.settingDefinitionId;
        if (!otherPlatforms.has(key)) otherPlatforms.set(key, []);
        otherPlatforms.get(key).push({ name: r.displayName });
      }
    }
  }

  const conflicts = [];
  const duplicates = [];
  for (const [id, perPolicy] of windows) {
    // Binnen één policy mag dezelfde instelling meermaals voorkomen met andere waarden: dat
    // is een collectie (firewallregels, hardened UNC paths), geen tegenspraak. Alleen tussen
    // policies is het er een.
    if (perPolicy.size < 2) continue;
    const hits = [...perPolicy.entries()].map(([name, values]) => ({ name, value: [...values].sort().join(", ") }));
    const distinct = new Set(hits.map((h) => h.value));
    (distinct.size > 1 ? conflicts : duplicates).push({ id, hits });
  }
  const shared = [...otherPlatforms.entries()]
    .filter(([, hits]) => hits.length > 1)
    .map(([id, hits]) => ({ id, hits }));

  return { conflicts, duplicates, shared };
}

/**
 * Elke `target` in _renames.json moet een policy zijn die hier bestaat. Zo niet, dan hernoemt
 * Rename-BaselinePolicy.ps1 een tenant-policy naar een naam die in deze repo nergens meer
 * voorkomt — waarna Set-BaselineAssignment.ps1 'm niet meer terugvindt en de policy stil
 * buiten de baseline valt. Zelfde vangnet als de wees-sleutelcontrole in
 * export-intunebackup.js, maar dan voor de migratietabel.
 */
function checkRenames(templates) {
  if (!fs.existsSync(RENAMES_PATH)) return [];
  const renames = JSON.parse(fs.readFileSync(RENAMES_PATH, "utf8")).policies || [];
  const known = new Set(templates.map((t) => t.displayName));
  const problems = [];

  for (const r of renames) {
    if (r.target && !known.has(r.target)) {
      problems.push(`_renames.json: target "${r.target}" bestaat niet in IntuneTemplate/`);
    }
    if (r.action === "retire" && r.target) {
      problems.push(`_renames.json: "${r.previousNames[0]}" is action "retire" maar heeft een target — retire hoort target null te hebben`);
    }
    if (r.action !== "retire" && !r.target) {
      problems.push(`_renames.json: "${r.previousNames[0]}" heeft action "${r.action}" zonder target`);
    }
    for (const replacement of r.replacedBy || []) {
      if (!known.has(replacement)) problems.push(`_renames.json: replacedBy "${replacement}" bestaat niet in IntuneTemplate/`);
    }
  }
  return problems;
}

/**
 * Elk template hoort een regel in _manifest.json te hebben. Die regel levert de
 * `doel`-zin die in de tenant naast de policy komt te staan; zonder regel staat de policy daar
 * straks zonder uitleg, en valt hij bovendien buiten `import-oib.js`.
 *
 * Daarnaast wordt hier het uitrolplan bewaakt. `fase` en `_assignments.json` zeggen allebei
 * iets over of een policy op alle apparaten hoort, en dat zijn twee bestanden die uit elkaar
 * kunnen lopen. Lopen ze uit elkaar, dan is de fout altijd erg: een fase-1-policy zonder
 * toewijzing wordt stilzwijgend niet uitgerold, en een fase-5-policy mét toewijzing levert een
 * Conflict op waarna de betwiste instelling door géén van beide policies wordt toegepast.
 */
function checkManifestCoverage(templates, assignments) {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const byTarget = new Map((manifest.policies || []).map((p) => [p.target, p]));
  const fases = manifest.fases || {};
  const known = new Set(templates.map((t) => t.baseName));
  const problems = [];

  for (const t of templates) {
    const entry = byTarget.get(t.baseName);
    if (!entry) { problems.push(`_manifest.json: geen regel voor ${t.baseName} — dus geen omschrijving in de tenant`); continue; }
    if (!entry.doel) problems.push(`_manifest.json: ${t.baseName} heeft geen "doel"`);

    const fase = entry.fase;
    if (fase === undefined) { problems.push(`_manifest.json: ${t.baseName} heeft geen "fase" — dus is niet te zeggen wanneer hij uitgerold hoort te worden`); continue; }
    if (!fases[String(fase)]) { problems.push(`_manifest.json: ${t.baseName} heeft fase ${fase}, maar die staat niet in "fases"`); continue; }
    // Alleen fase 1 gaat vanzelf naar alle apparaten. Alles daarboven is een uitzondering, en
    // een uitzondering zonder reden is over een half jaar niet meer te wegen.
    if (fase !== 1 && !entry.faseWaarom) problems.push(`_manifest.json: ${t.baseName} staat in fase ${fase} zonder "faseWaarom"`);
    if (fase === 4 && !entry.faseGroep) problems.push(`_manifest.json: ${t.baseName} staat in fase 4 zonder "faseGroep" — op welke groep hoort hij dan?`);

    const assigned = (assignments[t.displayName] || []).length > 0;
    if (fase === 1 && !assigned) problems.push(`${t.displayName}: fase 1, maar geen regel in _assignments.json — wordt dus niet uitgerold`);
    if (fase !== 1 && assigned) problems.push(`${t.displayName}: fase ${fase} (${fases[String(fase)].naam}), maar staat wél in _assignments.json`);
  }
  for (const target of byTarget.keys()) {
    if (!known.has(target)) problems.push(`_manifest.json: regel voor ${target}, maar dat template bestaat niet`);
  }
  return problems;
}

function main() {
  const reportOnly = process.argv.includes("--report");

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`IntuneTemplate/ niet gevonden op ${TEMPLATE_DIR}`);
    process.exit(1);
  }

  const templates = readTemplates(TEMPLATE_DIR);
  if (templates.length === 0) {
    console.error("Geen Baseline_*.json-bestanden gevonden in IntuneTemplate/");
    process.exit(1);
  }
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};

  const results = templates.map(analyse);

  console.log("Scope-overzicht (bron: settingDefinitionId-prefix bij Windows Settings Catalog, elders de naamconventie)\n");
  const rows = results.map((r) => ({
    naam: r.displayName,
    type: r.type,
    scope: r.actual ?? (r.parsed ? `${r.parsed.scope} (n.v.t.)` : "?"),
    settings: r.counts ? `${r.counts.device}D / ${r.counts.user}U` : "-",
    ok: r.problems.length === 0 ? "ok" : "!",
  }));
  const w = (key) => Math.max(key.length, ...rows.map((row) => String(row[key]).length));
  const widths = { naam: w("naam"), type: w("type"), scope: w("scope"), settings: w("settings") };
  const line = (row) =>
    `  ${String(row.ok).padEnd(2)}${String(row.naam).padEnd(widths.naam)}  ${String(row.type).padEnd(widths.type)}  ${String(row.scope).padEnd(widths.scope)}  ${String(row.settings).padStart(widths.settings)}`;
  console.log(line({ ok: "", naam: "POLICY", type: "TYPE", scope: "SCOPE", settings: "SETTINGS" }));
  for (const row of rows) console.log(line(row));

  const { conflicts, duplicates, shared } = findOverlaps(results, assignments);
  const failing = results.filter((r) => r.problems.length > 0);
  const renameProblems = [...checkRenames(templates), ...checkManifestCoverage(templates, assignments)];

  if (failing.length > 0) {
    console.log(`\n${failing.length} van ${results.length} policies hebben werk openstaan:\n`);
    for (const r of failing) {
      console.log(`  ${r.baseName}.json`);
      for (const p of r.problems) console.log(`    - ${p}`);
    }
    const mixed = failing.filter((r) => r.actual === "gemengd");
    if (mixed.length > 0) {
      console.log(`\n${mixed.length} policy/policies zijn inhoudelijk gemengd — die moeten gesplitst, hernoemen alleen is niet genoeg.`);
    }
  }

  const nested = results.filter((r) => r.nestedOtherScope && r.nestedOtherScope.length > 0);
  if (nested.length > 0) {
    console.log(`\n${nested.length} policy/policies hebben kindinstellingen van de andere scope:\n`);
    for (const r of nested) console.log(`  ${r.displayName} (${r.actual})\n      ${r.nestedOtherScope.join("\n      ")}`);
    console.log("\nDie zijn niet los te configureren — Intune hangt ze onder hun parent, en ze worden mét die parent uitgerold.");
  }

  if (duplicates.length > 0) {
    console.log(`\n${duplicates.length} Windows-instelling(en) staan in meer dan één toegewezen policy, met dezelfde waarde:\n`);
    for (const d of duplicates) console.log(`  ${d.id}\n      ${d.hits.map((h) => h.name).join("\n      ")}`);
    console.log("\nGeen conflict — Intune past de waarde gewoon toe — maar wel dubbel onderhoud: bij een wijziging moeten beide mee.");
  }

  if (shared.length > 0) {
    console.log(`\n${shared.length} payload(s) worden door meer dan één niet-Windows-policy geleverd:\n`);
    for (const s of shared) console.log(`  ${s.id}\n      ${s.hits.map((h) => h.name).join("\n      ")}`);
    console.log("\nBij Apple is dat normaal: elke policy levert een eigen profiel en de payloads worden samengevoegd.");
  }

  if (conflicts.length > 0) {
    console.log(`\n${conflicts.length} Windows-instelling(en) worden door meer dan één toegewezen policy op een ANDERE waarde gezet:\n`);
    for (const c of conflicts.slice(0, 40)) console.log(`  ${c.id}\n      ${c.hits.map((h) => `${h.name} => ${h.value}`).join("\n      ")}`);
    if (conflicts.length > 40) console.log(`  ... en nog ${conflicts.length - 40}`);
    console.log("\nIn Intune levert dat een Conflict op: de instelling wordt dan door géén van beide policies toegepast.");
  }

  if (renameProblems.length > 0) {
    console.log(`\n${renameProblems.length} probleem/problemen in de migratietabel of het manifest:\n`);
    for (const p of renameProblems) console.log(`  ${p}`);
  }

  if (failing.length === 0 && conflicts.length === 0 && renameProblems.length === 0) {
    console.log(`\nAlle ${results.length} policies staan op hun plek, hebben een eenduidige scope en spreken elkaar niet tegen.`);
    return;
  }

  if (reportOnly) {
    console.log("\n(--report: geen exitcode-fout)");
    return;
  }
  process.exit(1);
}

main();
