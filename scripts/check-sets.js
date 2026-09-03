#!/usr/bin/env node
/**
 * Controleert de policysets naast de uitgerolde baseline — vandaag alleen BASELINE2/,
 * morgen wat er ook maar bij komt.
 *
 * Eén script en geen check-isms.js + check-baseline2.js naast elkaar, omdat elke set
 * dezelfde vier controles nodig heeft en een tweede kopie er precies één zou missen. Wat
 * per set verschilt staat in SETS hieronder: de map, de tekst boven de README en welke
 * manifestvelden in de detailtabel horen. Een nieuwe set toevoegen is `SET_PREFIXES` in
 * lib/templates.js uitbreiden en hier een blok prozatekst bijzetten — de controles, de
 * README en de IntuneBackupAndRestore-export komen dan vanzelf mee.
 *
 * Vier controles per set:
 *
 *  1. Naamconventie: bestandsnaam <SET>_<PLATFORM>_<D|U>_<Item>, policynaam
 *     "[SET] - PLATFORM - D/U - Item", en allebei hetzelfde platform en dezelfde scope.
 *  2. Mapindeling: elk bestand in de map van zijn policytype, net als in IntuneTemplate/.
 *  3. Verantwoording: elke policy heeft een regel in _manifest.json met een doel én een
 *     control. Een policy die niet naar een artikel te herleiden is, hoort hier niet —
 *     dan is het een idee, geen maatregel.
 *  4. Overlap. Dit is de belangrijkste. check-scope.js kijkt alleen naar toegewezen
 *     policies binnen IntuneTemplate/ en ziet deze sets dus niet. Zet een policy hier
 *     dezelfde instelling als een tóégewezen baseline-policy, dan levert dat bij uitrol
 *     een Conflict op — waarna Intune de instelling door géén van beide toepast, en de
 *     baseline er dus op achteruit gaat. Sets onderling worden ook vergeleken: twee
 *     pilotsets die dezelfde instelling anders zetten botsen net zo hard.
 *
 * Gebruik: node scripts/check-sets.js [--docs] [SET]
 *   --docs schrijft daarnaast de README van elke set uit het manifest en de templates, zodat
 *   die tabel niet uit de pas kan lopen met wat de policies werkelijk zetten.
 *   SET beperkt de run tot één set.
 */

const fs = require("fs");
const path = require("path");
const { SET_PREFIXES, readTemplates, parseBaseName, relativePathFor, flattenSettings } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const BASELINE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ASSIGNMENTS_PATH = path.join(BASELINE_DIR, "_assignments.json");

/** De export-map van een set; gelijk gehouden aan export-intunebackup.js. */
const exportDirFor = (set) => `export/NativeImport/IntuneBackupAndRestore-${set}`;

/**
 * Wat per set verschilt. `head` levert alles boven de tabel "De set"; `detailFields` bepaalt
 * welke manifestvelden onder elke policy in de detailtabel komen.
 */
const SETS = {
  BASELINE2: {
    dir: "BASELINE2",
    title: "BASELINE2-set",
    // Eén extra eis boven de gedeelde drie: naast een control moet elke policy hier een
    // `bewijs` en een `universeel` in het manifest hebben. Dat zijn precies de twee vragen die
    // deze set definiëren — zonder die twee is een policy hier een mening.
    requiredFields: [
      ["bewijs", "waarom dit aantoonbaar werkt"],
      ["universeel", "waarom dit voor elk apparaat geldt"],
    ],
    detailFields: [
      ["Bron", "bron"],
      ["Bewezen", "bewijs"],
      ["Universeel", "universeel"],
    ],
    head: (n) => [
      `${n} Intune-policies die de uitgerolde baseline aanvullen en op alle drie de vragen ja`,
      "antwoorden: **werkt het aantoonbaar**, **hebben we het nodig** om gebruikers veilig te",
      "stellen, en **geldt het voor élk apparaat**? Een maatregel die op één van de drie nee",
      "scoort hoort hier niet, of hij staat er mét het voorbehoud erbij in het manifest.",
      "",
      "De set is samengesteld door `IntuneTemplate/` op `settingDefinitionId` te vergelijken met",
      "de 874 profielen van IntuneAdmin/IntuneBaselines (CIS v4 Windows 11 L1/L2, CIS Edge, de",
      "Microsoft Endpoint Security-baselines, Modern Workplace en de ISO 27001- en NIS2-mappen) en",
      "met de iOS- en Android-baselines van UniFy-Endpoint. De tien policies die tot september",
      "2026 in `ISMSTemplate/` stonden zijn hierin opgegaan — zie [ANALYSE.md](ANALYSE.md).",
      "",
      "**Nog geen tweede baseline.** Eigen prefix, eigen map, en nog geen enkele toewijzing:",
      "",
      "```",
      "IntuneTemplate/   Baseline_<PLATFORM>_<D|U>_<Item>.json     [Baseline] - WIN - D - Item     uitgerold",
      "BASELINE2/        BASELINE2_<PLATFORM>_<D|U>_<Item>.json    [BASELINE2] - WIN - D - Item    voorstel",
      "```",
      "",
      "De mapindeling is dezelfde als in `IntuneTemplate/` (`<PLATFORM>/<CATEGORIE>/`). Wat",
      "verschilt is de pijplijn: deze set komt bewust **niet** in",
      "`baseline/intune/baseline-v1.0.json`. Een policy die nog nergens is toegewezen hoort niet",
      "als check tegen een tenant te worden gelegd — dat levert alleen rode vinkjes op voor iets",
      "wat niemand heeft uitgerold. Bevalt een policy na de pilot, dan verhuist hij naar",
      "`IntuneTemplate/` onder de `Baseline_`-naam en krijgt hij daar een checkId en een",
      "toewijzing.",
    ],
  },
};

/** Elke set naast de baseline, in de volgorde van SET_PREFIXES. */
const extraSets = () => Object.keys(SET_PREFIXES).filter((s) => s !== "Baseline");

const setDir = (set) => path.join(REPO_ROOT, SETS[set] ? SETS[set].dir : SET_PREFIXES[set]);

/** Leest één set in: templates plus manifest. */
function readSet(set) {
  const dir = setDir(set);
  const manifestPath = path.join(dir, "_manifest.json");
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : { policies: [] };
  return {
    set,
    dir,
    templates: readTemplates(dir),
    byTarget: new Map((manifest.policies || []).map((p) => [p.target, p])),
  };
}

/** De README van één set, uit het manifest en de templates. */
function writeDocs({ set, dir, templates, byTarget }) {
  const cfg = SETS[set];
  const esc = (s) => String(s).replace(/\|/g, "\\|");
  const rows = templates.map((t) => {
    const e = byTarget.get(t.baseName) || {};
    const c = e.controls || {};
    const controls = [...(c.iso || []), ...(c.nis2 || []).map((x) => `NIS2 ${x}`), ...(c.partis || []), ...(c.isms || [])];
    const n = flattenSettings(t.raw.settings || []).settings.length;
    return `| **${esc((t.displayName || "").replace(`[${set}] - `, ""))}** | ${esc(e.doel || "—")} | ${n} | ${esc(controls.join(" · "))} |`;
  });

  const detail = templates.map((t) => {
    const e = byTarget.get(t.baseName) || {};
    const { settings } = flattenSettings(t.raw.settings || []);
    const rel = path.relative(dir, t.filePath).split(path.sep).join("/");
    const lines = [
      `### ${t.displayName}`,
      "",
      e.doel || "",
      "",
      "| | |",
      "|---|---|",
      `| Bestand | \`${rel}\` |`,
      `| Instellingen | ${settings.length} |`,
      ...cfg.detailFields.filter(([, key]) => e[key]).map(([label, key]) => `| ${label} | ${esc(e[key])} |`),
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
    "<!-- Gegenereerd door scripts/check-sets.js --docs — niet met de hand bijwerken. -->",
    "",
    `# ${cfg.dir}/`,
    "",
    ...cfg.head(templates.length),
    "",
    "## Uitrollen",
    "",
    "Drie routes, alle drie zonder toewijzing:",
    "",
    "- **CIPP** — leest deze map net als `IntuneTemplate/` rechtstreeks; de policies staan er onder",
    `  \`Package: "${set}"\`.`,
    "- **IntuneBackupAndRestore** — `node scripts/export-intunebackup.js` ververst de export, daarna:",
    "",
    "  ```powershell",
    `  Start-IntuneRestoreConfig -Path '<repo>\\${exportDirFor(set).split("/").join("\\")}'`,
    "  ```",
    "",
    "  Géén `Start-IntuneRestoreAssignments`: de export bevat met opzet geen `Assignments/`-map.",
    "- **Met de hand** aanmaken in Intune.",
    "",
    "Daarna toewijzen aan een pilotgroep — niet aan All Devices, want een deel van deze",
    "instellingen verandert gedrag dat gebruikers direct merken.",
    "",
    "## Controles",
    "",
    "```bash",
    "node scripts/check-sets.js          # naam, plek, verantwoording en botsingen, alle sets",
    `node scripts/check-sets.js ${set.padEnd(10)} # alleen deze set`,
    "node scripts/check-sets.js --docs   # plus deze README opnieuw genereren",
    "```",
    "",
    "De belangrijkste controle is de laatste: `check-scope.js` kijkt alleen naar toegewezen policies",
    "binnen `IntuneTemplate/` en ziet deze set dus niet. Zet een policy hier dezelfde instelling als",
    "een tóégewezen baseline-policy, dan levert dat bij uitrol een Conflict op — waarna Intune de",
    "instelling door géén van beide toepast en de baseline er dus op achteruit gaat. Botsingen die",
    "bedoeld zijn, staan als `replaces` in `_manifest.json`; de rest blokkeert.",
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

  fs.writeFileSync(path.join(dir, "README.md"), content);
  console.log(`${cfg.dir}/README.md geschreven (${templates.length} policies).`);
}

/** Controles 1 tot en met 3 voor één set. Print de tabel en geeft de problemen terug. */
function checkSet({ set, dir, templates, byTarget }) {
  const problems = [];
  const displayNameRe = new RegExp(`^\\[${set}\\] - (WIN|MAC|IOS|AND) - ([DU]) - .+$`);

  console.log(`\n${SETS[set].title} (${templates.length} policies, ${path.relative(REPO_ROOT, dir)})\n`);
  console.log("    POLICY                                          INSTELLINGEN  CONTROLS");

  for (const t of templates) {
    const parsed = parseBaseName(t.baseName);
    const nameMatch = (t.displayName || "").match(displayNameRe);
    const entry = byTarget.get(t.baseName);
    const { settings } = flattenSettings(t.raw.settings || []);

    if (!parsed || parsed.set !== set) problems.push(`${t.baseName}: bestandsnaam volgt niet ${set}_<WIN|MAC|IOS|AND>_<D|U>_Item`);
    if (!nameMatch) problems.push(`${t.baseName}: policynaam volgt niet "[${set}] - PLATFORM - D/U - Item" (nu: "${t.displayName}")`);
    if (parsed && nameMatch) {
      if (parsed.platform !== nameMatch[1]) problems.push(`${t.baseName}: bestandsnaam zegt ${parsed.platform}, policynaam zegt ${nameMatch[1]}`);
      if (parsed.scope !== nameMatch[2]) problems.push(`${t.baseName}: bestandsnaam zegt scope ${parsed.scope}, policynaam zegt ${nameMatch[2]}`);
    }
    if (parsed) {
      const expected = relativePathFor(t.baseName, t.type);
      const actual = path.relative(dir, t.filePath);
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
      for (const [field, wat] of SETS[set].requiredFields || []) {
        if (!entry[field]) problems.push(`${t.baseName}: geen "${field}" in _manifest.json — ${wat}`);
      }
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

  // Een `replaces` die nergens meer op slaat is net zo misleidend als een niet-verantwoorde
  // botsing: de instelling is dan uit de baseline verdwenen en de reden staat er nog. De
  // tweede helft van die controle (staat de instelling nog in een toegewezen policy?) zit in
  // checkOverlap, die de baseline al heeft ingelezen.
  for (const t of templates) {
    const ids = new Set(flattenSettings(t.raw.settings || []).settings.map((s) => s.settingDefinitionId));
    for (const r of (byTarget.get(t.baseName) || {}).replaces || []) {
      if (!ids.has(r.settingDefinitionId)) problems.push(`${t.baseName}: "replaces" noemt ${r.settingDefinitionId}, maar die instelling staat niet in deze policy`);
    }
  }

  return problems;
}

/** Controle 4: overlap met de tóégewezen baseline, en van de sets onderling. */
function checkOverlap(sets) {
  const baseline = readTemplates(BASELINE_DIR);
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};

  const assignedSettings = new Map();
  for (const t of baseline) {
    if (!(assignments[t.displayName] || []).length) continue;
    for (const s of flattenSettings(t.raw.settings || []).settings) {
      if (!assignedSettings.has(s.settingDefinitionId)) assignedSettings.set(s.settingDefinitionId, []);
      assignedSettings.get(s.settingDefinitionId).push({ policy: t.displayName, value: JSON.stringify(s.expectedValue) });
    }
  }

  const problems = [];
  const conflicts = [];
  const duplicates = [];
  const replaced = [];

  for (const { templates, byTarget } of sets) {
    for (const t of templates) {
      const declared = new Map(((byTarget.get(t.baseName) || {}).replaces || []).map((r) => [r.settingDefinitionId, r]));
      for (const s of flattenSettings(t.raw.settings || []).settings) {
        const hits = assignedSettings.get(s.settingDefinitionId);
        if (!hits) continue;
        const mine = JSON.stringify(s.expectedValue);
        const row = { id: s.settingDefinitionId, mijn: t.displayName, value: mine, hits };
        const decl = declared.get(s.settingDefinitionId);
        if (decl) replaced.push({ ...row, reason: decl.reason, policy: decl.policy });
        else if (hits.every((h) => h.value === mine)) duplicates.push(row);
        else conflicts.push(row);
      }
    }
    for (const t of templates) {
      for (const r of (byTarget.get(t.baseName) || {}).replaces || []) {
        if (!assignedSettings.has(r.settingDefinitionId)) {
          problems.push(`${t.baseName}: "replaces" noemt ${r.settingDefinitionId}, maar geen enkele toegewezen baseline-policy zet die nog — regel kan weg`);
        }
      }
    }
  }

  // De sets onderling. Twee voorstellen die dezelfde instelling anders zetten botsen bij
  // uitrol net zo hard als een botsing met de baseline — en niemand ziet het aankomen, want
  // ze staan in verschillende mappen met verschillende manifesten.
  const crossConflicts = [];
  const crossDuplicates = [];
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const left = new Map();
      for (const t of sets[i].templates) {
        for (const s of flattenSettings(t.raw.settings || []).settings) left.set(s.settingDefinitionId, { policy: t.displayName, value: JSON.stringify(s.expectedValue) });
      }
      for (const t of sets[j].templates) {
        for (const s of flattenSettings(t.raw.settings || []).settings) {
          const hit = left.get(s.settingDefinitionId);
          if (!hit) continue;
          const row = { id: s.settingDefinitionId, a: hit, b: { policy: t.displayName, value: JSON.stringify(s.expectedValue) } };
          if (hit.value === row.b.value) crossDuplicates.push(row);
          else crossConflicts.push(row);
        }
      }
    }
  }

  if (conflicts.length > 0) {
    console.log(`\n${conflicts.length} instelling(en) botsen met een tóégewezen baseline-policy:\n`);
    for (const c of conflicts) {
      console.log(`  ${c.id}`);
      console.log(`      ${c.mijn} => ${c.value}`);
      for (const h of c.hits) console.log(`      ${h.policy} => ${h.value}`);
    }
    console.log("\nTwee toegewezen policies met een andere waarde leveren in Intune een Conflict op:");
    console.log("de instelling wordt dan door géén van beide toegepast. Los dit op vóór je toewijst.");
  }

  if (crossConflicts.length > 0) {
    console.log(`\n${crossConflicts.length} instelling(en) botsen tússen de sets onderling:\n`);
    for (const c of crossConflicts) {
      console.log(`  ${c.id}`);
      console.log(`      ${c.a.policy} => ${c.a.value}`);
      console.log(`      ${c.b.policy} => ${c.b.value}`);
    }
    console.log("\nAllebei toewijzen levert hetzelfde Conflict op. Kies één van de twee, of haal de");
    console.log("instelling weg bij de ander.");
  }

  if (replaced.length > 0) {
    console.log(`\n${replaced.length} instelling(en) nemen bewust de plek over van een baseline-policy:\n`);
    for (const r of replaced) {
      console.log(`  ${r.id}`);
      console.log(`      ${r.mijn}  vervangt  ${r.policy}`);
      console.log(`      ${r.reason}`);
    }
    console.log("\nBij uitrol: haal de instelling weg bij de genoemde policy. Allebei toewijzen levert een");
    console.log("Conflict op, en dan doet géén van beide iets.");
  }

  if (duplicates.length > 0) {
    console.log(`\n${duplicates.length} instelling(en) staan al met dezelfde waarde in een toegewezen baseline-policy:\n`);
    for (const d of duplicates) {
      console.log(`  ${d.id}`);
      console.log(`      ${d.mijn}`);
      for (const h of d.hits) console.log(`      ${h.policy}  (zelfde waarde)`);
    }
    console.log("\nGeen conflict, maar wel dubbel onderhoud — en meestal een teken dat de eis al gedekt was.");
  }

  if (crossDuplicates.length > 0) {
    console.log(`\n${crossDuplicates.length} instelling(en) staan met dezelfde waarde in twee sets:\n`);
    for (const d of crossDuplicates) console.log(`  ${d.id}\n      ${d.a.policy}\n      ${d.b.policy}  (zelfde waarde)`);
    console.log("\nGeen conflict, wel dubbel onderhoud. Laat 'm in één set staan.");
  }

  return { problems, blocking: conflicts.length + crossConflicts.length };
}

function main() {
  const args = process.argv.slice(2);
  const docs = args.includes("--docs");
  const only = args.find((a) => !a.startsWith("--"));

  const wanted = only ? [only] : extraSets();
  for (const set of wanted) {
    if (!SETS[set]) {
      console.error(`Onbekende set "${set}". Bekend: ${extraSets().join(", ")}.`);
      console.error("Een nieuwe set voeg je toe in scripts/lib/templates.js (SET_PREFIXES) en in SETS hierboven.");
      process.exit(1);
    }
    if (!fs.existsSync(setDir(set))) {
      console.error(`${SETS[set].dir}/ niet gevonden op ${setDir(set)}`);
      process.exit(1);
    }
  }

  const sets = wanted.map(readSet);
  const problems = sets.flatMap(checkSet);
  const overlap = checkOverlap(sets);
  problems.push(...overlap.problems);

  if (problems.length > 0) {
    console.log(`\n${problems.length} probleem/problemen:\n`);
    for (const p of problems) console.log(`  ${p}`);
  }

  if (docs) {
    console.log("");
    for (const s of sets) writeDocs(s);
  }

  const blocking = problems.length + overlap.blocking;
  if (blocking === 0) {
    const total = sets.reduce((n, s) => n + s.templates.length, 0);
    console.log(`\nAlle ${total} policies in ${wanted.join(" en ")} zijn te verantwoorden, staan op hun plek en botsen niet — niet met de uitgerolde baseline en niet met elkaar.`);
  }
  process.exit(blocking > 0 ? 1 : 0);
}

main();
