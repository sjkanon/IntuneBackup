#!/usr/bin/env node
/**
 * Controleert ISMSTemplate/ — de set die uit de ISMS-documenten volgt en nog op een
 * pilotgroep moet.
 *
 * Vier controles:
 *
 *  1. Naamconventie: bestandsnaam ISMS_<PLATFORM>_<D|U>_<Item>, policynaam
 *     "[ISMS] - PLATFORM - D/U - Item", en allebei hetzelfde platform en dezelfde scope.
 *  2. Mapindeling: elk bestand in de map van zijn policytype, net als in IntuneTemplate/.
 *  3. Verantwoording: elke policy heeft een regel in _manifest.json met een doel én een
 *     control. Een policy die niet naar een artikel te herleiden is, hoort hier niet —
 *     dan is het een idee, geen ISMS-maatregel.
 *  4. Overlap met de uitgerolde baseline. Dit is de belangrijkste. check-scope.js kijkt
 *     alleen naar toegewezen policies binnen IntuneTemplate/ en ziet deze set dus niet.
 *     Zet een ISMS-policy dezelfde instelling als een tóégewezen baseline-policy, dan
 *     levert dat bij uitrol een Conflict op — waarna Intune de instelling door géén van
 *     beide toepast, en de baseline er dus op achteruit gaat. Zelfde waarde is geen
 *     conflict maar wel dubbel onderhoud, en meestal een teken dat de instelling al
 *     gedekt was.
 *
 * Gebruik: node scripts/check-isms.js [--docs]
 *   --docs schrijft daarnaast ISMSTemplate/README.md uit het manifest en de templates, zodat
 *   die tabel niet uit de pas kan lopen met wat de policies werkelijk zetten.
 */

const fs = require("fs");
const path = require("path");
const { readTemplates, parseBaseName, relativePathFor, flattenSettings } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const ISMS_DIR = path.join(REPO_ROOT, "ISMSTemplate");
const BASELINE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(ISMS_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(BASELINE_DIR, "_assignments.json");

const DISPLAY_NAME_RE = /^\[ISMS\] - (WIN|MAC|IOS|AND) - ([DU]) - .+$/;

/** ISMSTemplate/README.md uit het manifest en de templates. */
function writeDocs(isms, byTarget) {
  const esc = (s) => String(s).replace(/\|/g, "\\|");
  const rows = isms.map((t) => {
    const e = byTarget.get(t.baseName) || {};
    const c = e.controls || {};
    const controls = [...(c.iso || []), ...(c.nis2 || []).map((x) => `NIS2 ${x}`), ...(c.partis || []), ...(c.isms || [])];
    const n = flattenSettings(t.raw.settings || []).settings.length;
    return `| **${esc((t.displayName || "").replace(/^\[ISMS\] - /, ""))}** | ${esc(e.doel || "—")} | ${n} | ${esc(controls.join(" · "))} |`;
  });

  const detail = isms.map((t) => {
    const e = byTarget.get(t.baseName) || {};
    const { settings } = flattenSettings(t.raw.settings || []);
    const lines = [
      `### ${t.displayName}`,
      "",
      e.doel || "",
      "",
      "| | |",
      "|---|---|",
      `| Bestand | \`WIN/SettingsCatalog/${t.baseName}.json\` |`,
      `| Instellingen | ${settings.length} |`,
      `| Bron | ${esc(e.bron || "—")} |`,
      "",
      "Instellingen:",
      "",
      "```",
      ...settings.map((s) => `${s.settingDefinitionId} = ${String(Array.isArray(s.expectedValue) ? s.expectedValue.join(" | ") : s.expectedValue).replace(String(s.settingDefinitionId) + "_", "")}`),
      "```",
      "",
      `> ${e.note || ""}`,
    ];
    if (e.replaces) {
      lines.push("", `**Vervangt** in \`IntuneTemplate/\`: ${e.replaces.map((r) => `\`${r.settingDefinitionId}\` uit *${r.policy}*`).join(", ")}. Niet allebei toewijzen.`);
    }
    return lines.join("\n");
  });

  const content = [
    "<!-- Gegenereerd door scripts/check-isms.js --docs — niet met de hand bijwerken. -->",
    "",
    "# ISMSTemplate/",
    "",
    `${isms.length} Intune-policies die rechtstreeks uit de ISMS-documenten volgen (ISDP01–02, ISMP01–22),`,
    "voor de eisen die `IntuneTemplate/` nog niet afdwingt. Elke policy is te herleiden tot een",
    "artikel: ISO/IEC 27001:2022 Annex A, NIS2 (richtlijn 2022/2555 art. 21), EASA Part-IS.I.OR,",
    "en het interne ISMS-document dat het eist.",
    "",
    "**Dit is geen tweede baseline.** De baseline staat in `IntuneTemplate/` en is uitgerold; deze",
    "set is een voorstel dat nog op een pilotgroep moet. Daarom een eigen prefix, een eigen map en",
    "geen enkele toewijzing:",
    "",
    "```",
    "IntuneTemplate/   Baseline_<PLATFORM>_<D|U>_<Item>.json    [Baseline] - WIN - D - Item    uitgerold",
    "ISMSTemplate/     ISMS_<PLATFORM>_<D|U>_<Item>.json        [ISMS] - WIN - D - Item        pilot",
    "```",
    "",
    "De mapindeling binnen beide is hetzelfde (`<PLATFORM>/<CATEGORIE>/`), en `scripts/lib/templates.js`",
    "kent beide prefixen. Wat verschilt is de pijplijn: deze set komt bewust **niet** in",
    "`baseline/intune/baseline-v1.0.json` en niet in de IntuneBackupAndRestore-export. Een policy die",
    "nog nergens is toegewezen hoort niet als check tegen een tenant te worden gelegd — dat levert",
    "alleen rode vinkjes op voor iets wat niemand heeft uitgerold.",
    "",
    "## Controles",
    "",
    "```bash",
    "node scripts/check-isms.js          # naam, plek, verantwoording en botsingen met de baseline",
    "node scripts/check-isms.js --docs   # plus deze README opnieuw genereren",
    "```",
    "",
    "De belangrijkste controle is de laatste: `check-scope.js` kijkt alleen naar toegewezen policies",
    "binnen `IntuneTemplate/` en ziet deze set dus niet. Zet een ISMS-policy dezelfde instelling als",
    "een tóégewezen baseline-policy, dan levert dat bij uitrol een Conflict op — waarna Intune de",
    "instelling door géén van beide toepast en de baseline er dus op achteruit gaat. Botsingen die",
    "bedoeld zijn, staan als `replaces` in `_manifest.json`; de rest blokkeert.",
    "",
    "## Uitrollen",
    "",
    "Via CIPP (die leest deze map net als `IntuneTemplate/` rechtstreeks) of door de policy met de",
    "hand aan te maken. Daarna toewijzen aan een pilotgroep — niet aan All Devices, want een deel van",
    "deze instellingen verandert gedrag dat gebruikers direct merken. Bevalt een policy, dan verhuist",
    "hij naar `IntuneTemplate/` onder de `Baseline_`-naam en krijgt hij daar een checkId en een",
    "toewijzing.",
    "",
    "## De set",
    "",
    "| Policy | Wat het doet | Instellingen | Controls |",
    "|---|---|---:|---|",
    ...rows,
    "",
    "---",
    "",
    ...detail,
    "",
    "---",
    "",
    "Terug naar de [hoofd-README](../README.md).",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(ISMS_DIR, "README.md"), content);
  console.log(`\nISMSTemplate/README.md geschreven (${isms.length} policies).`);
}

function main() {
  if (!fs.existsSync(ISMS_DIR)) {
    console.error(`ISMSTemplate/ niet gevonden op ${ISMS_DIR}`);
    process.exit(1);
  }

  const isms = readTemplates(ISMS_DIR);
  const baseline = readTemplates(BASELINE_DIR);
  const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) : { policies: [] };
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const byTarget = new Map(manifest.policies.map((p) => [p.target, p]));

  const problems = [];

  /* --- 1, 2 en 3: naam, plek en verantwoording ------------------------------------ */

  console.log(`ISMS-set (${isms.length} policies, ${ISMS_DIR.replace(REPO_ROOT + path.sep, "")})\n`);
  console.log("    POLICY                                          INSTELLINGEN  CONTROLS");

  for (const t of isms) {
    const parsed = parseBaseName(t.baseName);
    const nameMatch = (t.displayName || "").match(DISPLAY_NAME_RE);
    const entry = byTarget.get(t.baseName);
    const { settings } = flattenSettings(t.raw.settings || []);

    if (!parsed || parsed.set !== "ISMS") problems.push(`${t.baseName}: bestandsnaam volgt niet ISMS_<WIN|MAC|IOS|AND>_<D|U>_Item`);
    if (!nameMatch) problems.push(`${t.baseName}: policynaam volgt niet "[ISMS] - PLATFORM - D/U - Item" (nu: "${t.displayName}")`);
    if (parsed && nameMatch) {
      if (parsed.platform !== nameMatch[1]) problems.push(`${t.baseName}: bestandsnaam zegt ${parsed.platform}, policynaam zegt ${nameMatch[1]}`);
      if (parsed.scope !== nameMatch[2]) problems.push(`${t.baseName}: bestandsnaam zegt scope ${parsed.scope}, policynaam zegt ${nameMatch[2]}`);
    }
    if (parsed) {
      const expected = relativePathFor(t.baseName, t.type);
      const actual = path.relative(ISMS_DIR, t.filePath);
      if (expected && path.normalize(actual) !== path.normalize(expected)) {
        problems.push(`${t.baseName}: staat in ${actual.split(path.sep).join("/")}, hoort in ${expected.split(path.sep).join("/")}`);
      }
    }

    let controlCount = 0;
    if (!entry) problems.push(`${t.baseName}: geen regel in _manifest.json — dus geen doel en geen control`);
    else {
      if (!entry.doel) problems.push(`${t.baseName}: geen "doel" in _manifest.json`);
      const c = entry.controls || {};
      controlCount = ["iso", "nis2", "partis", "isms"].reduce((n, k) => n + (c[k] || []).length, 0);
      if (controlCount === 0) problems.push(`${t.baseName}: geen enkele control in _manifest.json — niet te verantwoorden in een audit`);
    }

    // Gemengde scope is bij Windows Settings Catalog een echte fout: user- en device-
    // instellingen in één policy zijn niet eenduidig toe te wijzen.
    const scopes = new Set(settings.map((s) => (String(s.settingDefinitionId).startsWith("user_") ? "U" : "D")));
    if (scopes.size > 1) problems.push(`${t.baseName}: bevat zowel device- als user-instellingen`);
    if (parsed && scopes.size === 1 && !scopes.has(parsed.scope) && parsed.platform === "WIN") {
      problems.push(`${t.baseName}: naam zegt scope ${parsed.scope}, instellingen zijn ${[...scopes][0]}`);
    }

    console.log(`  ${(t.displayName || t.baseName).padEnd(48)}${String(settings.length).padStart(8)}${String(controlCount).padStart(10)}`);
  }

  /* --- 4: overlap met toegewezen baseline-policies -------------------------------- */

  const assignedSettings = new Map();
  for (const t of baseline) {
    if (!(assignments[t.displayName] || []).length) continue;
    for (const s of flattenSettings(t.raw.settings || []).settings) {
      if (!assignedSettings.has(s.settingDefinitionId)) assignedSettings.set(s.settingDefinitionId, []);
      assignedSettings.get(s.settingDefinitionId).push({ policy: t.displayName, value: JSON.stringify(s.expectedValue) });
    }
  }

  const conflicts = [];
  const duplicates = [];
  const replaced = [];
  for (const t of isms) {
    const declared = new Map(((byTarget.get(t.baseName) || {}).replaces || []).map((r) => [r.settingDefinitionId, r]));
    for (const s of flattenSettings(t.raw.settings || []).settings) {
      const hits = assignedSettings.get(s.settingDefinitionId);
      if (!hits) continue;
      const mine = JSON.stringify(s.expectedValue);
      const row = { id: s.settingDefinitionId, isms: t.displayName, value: mine, hits };
      const decl = declared.get(s.settingDefinitionId);
      if (decl) replaced.push({ ...row, reason: decl.reason, policy: decl.policy });
      else if (hits.every((h) => h.value === mine)) duplicates.push(row);
      else conflicts.push(row);
    }
  }

  // Een `replaces` die nergens meer op slaat is net zo misleidend als een niet-verantwoorde
  // botsing: de instelling is dan uit de baseline verdwenen en de reden staat er nog.
  for (const t of isms) {
    const ids = new Set(flattenSettings(t.raw.settings || []).settings.map((s) => s.settingDefinitionId));
    for (const r of ((byTarget.get(t.baseName) || {}).replaces || [])) {
      if (!ids.has(r.settingDefinitionId)) problems.push(`${t.baseName}: "replaces" noemt ${r.settingDefinitionId}, maar die instelling staat niet in deze policy`);
      else if (!assignedSettings.has(r.settingDefinitionId)) problems.push(`${t.baseName}: "replaces" noemt ${r.settingDefinitionId}, maar geen enkele toegewezen baseline-policy zet die nog — regel kan weg`);
    }
  }

  if (conflicts.length > 0) {
    console.log(`\n${conflicts.length} instelling(en) botsen met een tóégewezen baseline-policy:\n`);
    for (const c of conflicts) {
      console.log(`  ${c.id}`);
      console.log(`      ${c.isms} => ${c.value}`);
      for (const h of c.hits) console.log(`      ${h.policy} => ${h.value}`);
    }
    console.log("\nTwee toegewezen policies met een andere waarde leveren in Intune een Conflict op:");
    console.log("de instelling wordt dan door géén van beide toegepast. Los dit op vóór je toewijst.");
  }

  if (replaced.length > 0) {
    console.log(`\n${replaced.length} instelling(en) nemen bewust de plek over van een baseline-policy:\n`);
    for (const r of replaced) {
      console.log(`  ${r.id}`);
      console.log(`      ${r.isms}  vervangt  ${r.policy}`);
      console.log(`      ${r.reason}`);
    }
    console.log("\nBij uitrol: haal de instelling weg bij de genoemde policy. Allebei toewijzen levert een");
    console.log("Conflict op, en dan doet géén van beide iets.");
  }

  if (duplicates.length > 0) {
    console.log(`\n${duplicates.length} instelling(en) staan al met dezelfde waarde in een toegewezen baseline-policy:\n`);
    for (const d of duplicates) {
      console.log(`  ${d.id}`);
      console.log(`      ${d.isms}`);
      for (const h of d.hits) console.log(`      ${h.policy}  (zelfde waarde)`);
    }
    console.log("\nGeen conflict, maar wel dubbel onderhoud — en meestal een teken dat de eis al gedekt was.");
  }

  if (problems.length > 0) {
    console.log(`\n${problems.length} probleem/problemen:\n`);
    for (const p of problems) console.log(`  ${p}`);
  }

  if (process.argv.includes("--docs")) writeDocs(isms, byTarget);

  const blocking = problems.length + conflicts.length;
  if (blocking === 0) {
    console.log(`\nAlle ${isms.length} ISMS-policies zijn te verantwoorden, staan op hun plek en botsen niet met de uitgerolde baseline.`);
  }
  process.exit(blocking > 0 ? 1 : 0);
}

main();
