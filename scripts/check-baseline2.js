#!/usr/bin/env node
/**
 * Controleert BASELINE2/ — de aanvulling op de uitgerolde baseline die de drie vragen met ja
 * beantwoordt: werkt het aantoonbaar, hebben we het nodig, en geldt het voor élk apparaat?
 *
 * Vijf controles:
 *
 *  1. Naamconventie: bestandsnaam BASELINE2_<PLATFORM>_<D|U>_<Item>, policynaam
 *     "[BASELINE2] - PLATFORM - D/U - Item", en allebei hetzelfde platform en dezelfde scope.
 *  2. Mapindeling: elk bestand in de map van zijn policytype, net als in IntuneTemplate/.
 *  3. Verantwoording. Strenger dan bij ISMSTemplate/: naast een doel en een control moet elke
 *     policy een `bewijs` en een `universeel` hebben. Dat zijn precies de twee vragen die deze
 *     set van de ISMS-set onderscheiden — waarom werkt dit aantoonbaar, en waarom geldt het
 *     voor elk apparaat. Een policy die die twee niet kan beantwoorden hoort hier niet; die
 *     hoort in ISMSTemplate/, waar een verwijzing naar een norm genoeg is.
 *  4. Overlap met de tóégewezen baseline. Dit is de belangrijkste. check-scope.js kijkt alleen
 *     binnen IntuneTemplate/ en ziet deze set dus niet. Zet een BASELINE2-policy dezelfde
 *     instelling als een toegewezen baseline-policy op een andere waarde, dan levert dat bij
 *     uitrol een Conflict op — waarna Intune de instelling door géén van beide toepast, en de
 *     baseline er dus op achteruit gaat. Bedoelde botsingen staan als `replaces` in
 *     _manifest.json; de rest blokkeert.
 *  5. Overlap met ISMSTemplate/. Die set is niet toegewezen, dus dit kan vandaag niets breken —
 *     maar twee voorstellen die dezelfde instelling anders zetten worden een conflict zodra
 *     iemand ze allebei uitrolt. Meldend, niet blokkerend.
 *
 * Gebruik: node scripts/check-baseline2.js [--docs]
 *   --docs schrijft daarnaast BASELINE2/README.md uit het manifest en de templates, zodat die
 *   tabel niet uit de pas kan lopen met wat de policies werkelijk zetten.
 */

const fs = require("fs");
const path = require("path");
const { readTemplates, parseBaseName, relativePathFor, flattenSettings } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const SET_DIR = path.join(REPO_ROOT, "BASELINE2");
const BASELINE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const ISMS_DIR = path.join(REPO_ROOT, "ISMSTemplate");
const MANIFEST_PATH = path.join(SET_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(BASELINE_DIR, "_assignments.json");

const DISPLAY_NAME_RE = /^\[BASELINE2\] - (WIN|MAC|IOS|AND) - ([DU]) - .+$/;

/** Platte weergave van één instelling, zoals in de gegenereerde README. */
function settingLine(s) {
  const value = Array.isArray(s.expectedValue) ? s.expectedValue.join(" | ") : s.expectedValue;
  return `${s.settingDefinitionId} = ${String(value).replace(String(s.settingDefinitionId) + "_", "")}`;
}

/** BASELINE2/README.md uit het manifest en de templates. */
function writeDocs(set, byTarget) {
  const esc = (s) => String(s).replace(/\|/g, "\\|");

  const rows = set.map((t) => {
    const e = byTarget.get(t.baseName) || {};
    const c = e.controls || {};
    const controls = [...(c.iso || []), ...(c.nis2 || []).map((x) => `NIS2 ${x}`), ...(c.partis || []), ...(c.isms || [])];
    const n = flattenSettings(t.raw.settings || []).settings.length;
    return `| **${esc((t.displayName || "").replace(/^\[BASELINE2\] - /, ""))}** | ${esc(e.doel || "—")} | ${n} | ${esc(controls.join(" · "))} |`;
  });

  const detail = set.map((t) => {
    const e = byTarget.get(t.baseName) || {};
    const { settings } = flattenSettings(t.raw.settings || []);
    const rel = path.relative(SET_DIR, t.filePath).split(path.sep).join("/");
    const lines = [
      `### ${t.displayName}`,
      "",
      e.doel || "",
      "",
      "| | |",
      "|---|---|",
      `| Bestand | \`${rel}\` |`,
      `| Instellingen | ${settings.length} |`,
      `| Bron | ${esc(e.bron || "—")} |`,
      "",
      "Instellingen:",
      "",
      "```",
      ...settings.map(settingLine),
      "```",
      "",
      `**Waarom dit werkt.** ${e.bewijs || ""}`,
      "",
      `**Waarom dit voor elk apparaat geldt.** ${e.universeel || ""}`,
      "",
      `> ${e.note || ""}`,
    ];
    if (e.replaces) {
      lines.push("", `**Vervangt** in \`IntuneTemplate/\`: ${e.replaces.map((r) => `\`${r.settingDefinitionId}\` uit *${r.policy}*`).join(", ")}. Niet allebei toewijzen.`);
    }
    return lines.join("\n");
  });

  const content = [
    "<!-- Gegenereerd door scripts/check-baseline2.js --docs — niet met de hand bijwerken. -->",
    "",
    "# BASELINE2/",
    "",
    `${set.length} Intune-policies die de uitgerolde baseline aanvullen. De lat is niet "het staat`,
    'in een norm" maar drie vragen die alle drie met ja beantwoord moeten worden:',
    "",
    "1. **Werkt het en is het bewezen?** Wie schrijft het al voor, en wat houdt het tegen?",
    "2. **Hebben we het nodig om gebruikers veilig te stellen?** Wat kan er nu wat straks niet meer kan?",
    "3. **Geldt het voor élk apparaat?** Niet voor een rol, een groep of een pilot — voor de hele vloot.",
    "",
    "Een maatregel die op één van de drie nee scoort staat hier niet. Die hoort in",
    "[`ISMSTemplate/`](../ISMSTemplate/README.md), waar een verwijzing naar een artikel de",
    "verantwoording is, of nergens.",
    "",
    "**Dit is geen vervanging van de baseline.** De baseline staat in `IntuneTemplate/`; deze set",
    "vult hem aan met wat daar aantoonbaar ontbreekt. Drie sets, één indeling:",
    "",
    "```",
    "IntuneTemplate/   Baseline_<PLATFORM>_<D|U>_<Item>.json    [Baseline] - WIN - D - Item    uitgerold",
    "ISMSTemplate/     ISMS_<PLATFORM>_<D|U>_<Item>.json        [ISMS] - WIN - D - Item        pilot, vanuit een norm",
    "BASELINE2/        BASELINE2_<PLATFORM>_<D|U>_<Item>.json   [BASELINE2] - WIN - D - Item   voorstel, apparaatbreed",
    "```",
    "",
    "## Hoe deze set is samengesteld",
    "",
    "`IntuneTemplate/` en `ISMSTemplate/` zijn op `settingDefinitionId` vergeleken met",
    "[IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines) — 874 profielen:",
    "CIS v4 Windows 11 L1 en L2, CIS Microsoft Edge, de Microsoft Endpoint Security-baselines, de",
    "Modern Workplace-sets en de ISO 27001- en NIS2-mappen. Dat leverde 509 instellingen op die wij",
    "niet zetten. Daarvan valt het overgrote deel af omdat het een ander product betreft (Chrome,",
    "Safari, Linux, AVD), omdat het niet voor elk apparaat geldt, of omdat de baseline het al op een",
    "andere manier dekt. Wat overbleef staat hieronder.",
    "",
    "Elke waarde is daarna nagelopen tegen de Policy CSP-documentatie en tegen de",
    "settings catalog-definities zelf, niet klakkeloos overgenomen. Dat was nodig ook: het",
    "NIS2-profiel van IntuneAdmin zet `DeviceLock/AccountLockoutPolicy` op de kale waarde `\"15\"`,",
    "terwijl de CSP daar de drie velden als één string verwacht — die waarde doet daar niets.",
    "",
    "## Controles",
    "",
    "```bash",
    "node scripts/check-baseline2.js          # naam, plek, verantwoording en botsingen",
    "node scripts/check-baseline2.js --docs   # plus deze README opnieuw genereren",
    "```",
    "",
    "De belangrijkste controle is de botsing met een tóégewezen baseline-policy: twee toegewezen",
    "policies die dezelfde instelling anders zetten leveren in Intune een Conflict op, waarna de",
    "instelling door géén van beide wordt toegepast en de baseline er dus op achteruit gaat.",
    "Bedoelde botsingen staan als `replaces` in `_manifest.json`; de rest blokkeert. Botsingen met",
    "`ISMSTemplate/` worden gemeld maar blokkeren niet — die set is zelf ook nog niet toegewezen.",
    "",
    "Daarnaast eist de verantwoordingscontrole hier meer dan bij de ISMS-set: elke policy moet",
    "naast een doel en een control ook een `bewijs` en een `universeel` hebben. Dat zijn de twee",
    "vragen die deze set definiëren, en zonder antwoord erop is een policy hier een mening.",
    "",
    "## Uitrollen",
    "",
    "Via CIPP (die leest deze map net als `IntuneTemplate/` rechtstreeks) of door de policy met de",
    "hand aan te maken. Ook al is de bedoeling dat deze set uiteindelijk op alle apparaten staat:",
    "zet hem eerst op een pilotgroep. Twee policies hieronder veranderen iets dat een gebruiker",
    "direct merkt, en de Kernel DMA-policy kan een oud dock stilleggen. Bevalt de set, dan verhuist",
    "een policy naar `IntuneTemplate/` onder de `Baseline_`-naam en krijgt hij daar een checkId en",
    "een toewijzing.",
    "",
    "## De set",
    "",
    "| Policy | Wat het doet | Instellingen | Controls |",
    "|---|---|---:|---|",
    ...rows,
    "",
    "---",
    "",
    detail.join("\n"),
    "",
    "---",
    "",
    "Terug naar de [hoofd-README](../README.md).",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(SET_DIR, "README.md"), content);
  console.log(`\nBASELINE2/README.md geschreven (${set.length} policies).`);
}

/** settingDefinitionId -> [{ policy, value }] over een set templates, optioneel gefilterd. */
function indexSettings(templates, keep = () => true) {
  const index = new Map();
  for (const t of templates) {
    if (!keep(t)) continue;
    for (const s of flattenSettings(t.raw.settings || []).settings) {
      if (!index.has(s.settingDefinitionId)) index.set(s.settingDefinitionId, []);
      index.get(s.settingDefinitionId).push({ policy: t.displayName, value: JSON.stringify(s.expectedValue) });
    }
  }
  return index;
}

function main() {
  if (!fs.existsSync(SET_DIR)) {
    console.error(`BASELINE2/ niet gevonden op ${SET_DIR}`);
    process.exit(1);
  }

  const set = readTemplates(SET_DIR);
  const baseline = readTemplates(BASELINE_DIR);
  const isms = fs.existsSync(ISMS_DIR) ? readTemplates(ISMS_DIR) : [];
  const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) : { policies: [] };
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const byTarget = new Map(manifest.policies.map((p) => [p.target, p]));

  const problems = [];

  /* --- 1, 2 en 3: naam, plek en verantwoording ------------------------------------ */

  console.log(`BASELINE2-set (${set.length} policies, ${SET_DIR.replace(REPO_ROOT + path.sep, "")})\n`);
  console.log("    POLICY                                          INSTELLINGEN  CONTROLS");

  for (const t of set) {
    const parsed = parseBaseName(t.baseName);
    const nameMatch = (t.displayName || "").match(DISPLAY_NAME_RE);
    const entry = byTarget.get(t.baseName);
    const { settings } = flattenSettings(t.raw.settings || []);

    if (!parsed || parsed.set !== "BASELINE2") problems.push(`${t.baseName}: bestandsnaam volgt niet BASELINE2_<WIN|MAC|IOS|AND>_<D|U>_Item`);
    if (!nameMatch) problems.push(`${t.baseName}: policynaam volgt niet "[BASELINE2] - PLATFORM - D/U - Item" (nu: "${t.displayName}")`);
    if (parsed && nameMatch) {
      if (parsed.platform !== nameMatch[1]) problems.push(`${t.baseName}: bestandsnaam zegt ${parsed.platform}, policynaam zegt ${nameMatch[1]}`);
      if (parsed.scope !== nameMatch[2]) problems.push(`${t.baseName}: bestandsnaam zegt scope ${parsed.scope}, policynaam zegt ${nameMatch[2]}`);
    }
    if (parsed) {
      const expected = relativePathFor(t.baseName, t.type);
      const actual = path.relative(SET_DIR, t.filePath);
      if (expected && path.normalize(actual) !== path.normalize(expected)) {
        problems.push(`${t.baseName}: staat in ${actual.split(path.sep).join("/")}, hoort in ${expected.split(path.sep).join("/")}`);
      }
    }

    let controlCount = 0;
    if (!entry) problems.push(`${t.baseName}: geen regel in _manifest.json — dus geen doel, geen control en geen onderbouwing`);
    else {
      if (!entry.doel) problems.push(`${t.baseName}: geen "doel" in _manifest.json`);
      const c = entry.controls || {};
      controlCount = ["iso", "nis2", "partis", "isms"].reduce((n, k) => n + (c[k] || []).length, 0);
      if (controlCount === 0) problems.push(`${t.baseName}: geen enkele control in _manifest.json — niet te verantwoorden in een audit`);
      // De twee vragen die deze set van ISMSTemplate/ onderscheiden.
      if (!entry.bewijs) problems.push(`${t.baseName}: geen "bewijs" in _manifest.json — waarom werkt dit aantoonbaar?`);
      if (!entry.universeel) problems.push(`${t.baseName}: geen "universeel" in _manifest.json — waarom geldt dit voor elk apparaat?`);
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

  // Een manifestregel zonder template is net zo misleidend als een template zonder regel: de
  // verantwoording staat er dan nog terwijl de policy weg is.
  for (const p of manifest.policies) {
    if (!set.some((t) => t.baseName === p.target)) problems.push(`_manifest.json: "${p.target}" bestaat niet in BASELINE2/`);
  }

  /* --- 4: overlap met toegewezen baseline-policies -------------------------------- */

  const assignedSettings = indexSettings(baseline, (t) => (assignments[t.displayName] || []).length > 0);

  const conflicts = [];
  const duplicates = [];
  const replaced = [];
  for (const t of set) {
    const declared = new Map(((byTarget.get(t.baseName) || {}).replaces || []).map((r) => [r.settingDefinitionId, r]));
    for (const s of flattenSettings(t.raw.settings || []).settings) {
      const hits = assignedSettings.get(s.settingDefinitionId);
      if (!hits) continue;
      const mine = JSON.stringify(s.expectedValue);
      const row = { id: s.settingDefinitionId, mine: t.displayName, value: mine, hits };
      const decl = declared.get(s.settingDefinitionId);
      if (decl) replaced.push({ ...row, reason: decl.reason, policy: decl.policy });
      else if (hits.every((h) => h.value === mine)) duplicates.push(row);
      else conflicts.push(row);
    }
  }

  // Een `replaces` die nergens meer op slaat is net zo misleidend als een niet-verantwoorde
  // botsing: de instelling is dan uit de baseline verdwenen en de reden staat er nog.
  for (const t of set) {
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
      console.log(`      ${c.mine} => ${c.value}`);
      for (const h of c.hits) console.log(`      ${h.policy} => ${h.value}`);
    }
    console.log("\nTwee toegewezen policies met een andere waarde leveren in Intune een Conflict op:");
    console.log("de instelling wordt dan door géén van beide toegepast. Los dit op vóór je toewijst.");
  }

  if (replaced.length > 0) {
    console.log(`\n${replaced.length} instelling(en) nemen bewust de plek over van een baseline-policy:\n`);
    for (const r of replaced) {
      console.log(`  ${r.id}`);
      console.log(`      ${r.mine}  vervangt  ${r.policy}`);
      console.log(`      ${r.reason}`);
    }
    console.log("\nBij uitrol: haal de instelling weg bij de genoemde policy. Allebei toewijzen levert een");
    console.log("Conflict op, en dan doet géén van beide iets.");
  }

  if (duplicates.length > 0) {
    console.log(`\n${duplicates.length} instelling(en) staan al met dezelfde waarde in een toegewezen baseline-policy:\n`);
    for (const d of duplicates) {
      console.log(`  ${d.id}`);
      console.log(`      ${d.mine}`);
      for (const h of d.hits) console.log(`      ${h.policy}  (zelfde waarde)`);
    }
    console.log("\nGeen conflict, maar wel dubbel onderhoud — en meestal een teken dat de eis al gedekt was.");
  }

  /* --- 5: overlap met de ISMS-set (meldend) --------------------------------------- */

  const ismsSettings = indexSettings(isms);
  const ismsOverlap = [];
  for (const t of set) {
    for (const s of flattenSettings(t.raw.settings || []).settings) {
      const hits = ismsSettings.get(s.settingDefinitionId);
      if (!hits) continue;
      ismsOverlap.push({ id: s.settingDefinitionId, mine: t.displayName, value: JSON.stringify(s.expectedValue), hits });
    }
  }

  if (ismsOverlap.length > 0) {
    console.log(`\n${ismsOverlap.length} instelling(en) staan ook in ISMSTemplate/:\n`);
    for (const o of ismsOverlap) {
      console.log(`  ${o.id}`);
      console.log(`      ${o.mine} => ${o.value}`);
      for (const h of o.hits) console.log(`      ${h.policy} => ${h.value}`);
    }
    console.log("\nBlokkeert niet — geen van beide sets is toegewezen. Wordt wel een conflict zodra");
    console.log("iemand ze allebei uitrolt, dus kies er één vóór dat moment.");
  }

  if (problems.length > 0) {
    console.log(`\n${problems.length} probleem/problemen:\n`);
    for (const p of problems) console.log(`  ${p}`);
  }

  if (process.argv.includes("--docs")) writeDocs(set, byTarget);

  const blocking = problems.length + conflicts.length;
  if (blocking === 0) {
    console.log(`\nAlle ${set.length} BASELINE2-policies zijn onderbouwd, staan op hun plek en botsen niet met de uitgerolde baseline.`);
  }
  process.exit(blocking > 0 ? 1 : 0);
}

main();
