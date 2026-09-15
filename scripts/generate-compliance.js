#!/usr/bin/env node
/**
 * Genereert COMPLIANCE.md: de verantwoording van de baseline naar ISO/IEC 27001:2022 Annex A,
 * NIS2 art. 21(2), CIS Controls v8.1 en NIST CSF 2.0, voor een CISO of auditor.
 *
 * Bronnen:
 *   IntuneTemplate/_manifest.json     controls, fase, faseWaarom, faseGroep per policy
 *   IntuneTemplate/_assignments.json  wat er werkelijk is toegewezen (fase 1)
 *   IntuneTemplate/_controls.json     de canonieke vocabulaire: alle 93 Annex A-controls, de tien
 *                                     NIS2-punten, de CIS-safeguards en de CSF-subcategorieën
 *   baseline/intune/baseline-v1.0.json de checkId's die TEST Policies Platform toetst
 *   ../CA-Policies/controls/ca-controls.json en ../CA-Policies/baseline/conditional-access/
 *                                     baseline-v1.0.json — optioneel, pad met --ca
 *
 * Gegenereerd om dezelfde reden als de rest van de documentatie: een normenmatrix die met de
 * hand wordt bijgehouden loopt binnen een kwartaal achter op de policies, en leest dan nog
 * steeds alsof hij klopt. Een auditor die een control volgt naar een policy die er niet meer
 * is, vertrouwt de rest van het document ook niet meer.
 *
 * Wat "afgedekt" hier betekent: er is een policy in fase 1 (of een actieve CA-policy) die de
 * control technisch afdwingt of toetst. Dat is een uitspraak over de baseline, niet over een
 * tenant — of de policy daar ook staat, toont de baseline-check in TEST Policies Platform.
 *
 * Draai generate-baseline.js eerst: de checkId's komen uit het gegenereerde bestand.
 *
 * Gebruik: node scripts/generate-compliance.js [--check] [--strict] [--ca <pad naar ca-controls.json> | --no-ca]
 *   --check   schrijft niets en geeft exit 1 als COMPLIANCE.md niet meer klopt (voor CI)
 *   --strict  exit 1 als een policy geen controls heeft of een label buiten de vocabulaire gebruikt
 *   --ca      pad naar ca-controls.json; standaard ../CA-Policies/controls/ca-controls.json naast deze repo
 *   --no-ca   Conditional Access niet meenemen, ook als die repo er staat (zelfde uitkomst lokaal en in CI)
 */

const fs = require("fs");
const path = require("path");
const { PLATFORMS, TYPE_TO_CATEGORY, readTemplates, parseBaseName } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const CONTROLS_PATH = path.join(TEMPLATE_DIR, "_controls.json");
const BASELINE_PATH = path.join(REPO_ROOT, "baseline", "intune", "baseline-v1.0.json");
const OUTPUT_PATH = path.join(REPO_ROOT, "COMPLIANCE.md");
/**
 * De repo heet op GitHub CA-Policies; dit script kende hem als CA-policies. Op Windows maakt dat
 * niets uit en op Linux mislukt hij stil: geen bestand, dus geen CA, dus een COMPLIANCE.md die
 * beweert dat er geen CA-verantwoording is. Daarom beide vormen proberen.
 */
const DEFAULT_CA_CONTROLS = ["CA-Policies", "CA-policies"]
  .map((dir) => path.resolve(REPO_ROOT, "..", dir, "controls", "ca-controls.json"))
  .find((p) => fs.existsSync(p)) || path.resolve(REPO_ROOT, "..", "CA-Policies", "controls", "ca-controls.json");

const GENERATED_HEADER = "<!-- Gegenereerd door scripts/generate-compliance.js — niet met de hand bijwerken. -->";
const PLATFORM_ORDER = ["WIN", "MAC", "IOS", "AND"];

/**
 * Compliance-, device- en app protection-policies leveren geen eigen check op (de engine heeft er
 * geen matcher voor), maar vijf generieke checks uit het platform toetsen wel precies wat deze
 * policies eisen. Zonder deze koppeling zou de bewijsroute voor versleuteling en OS-ondergrens
 * leeg lijken terwijl hij bestaat. INTUNE-BASE-002 (er is een toegewezen compliance-policy) geldt
 * voor élke compliance-policy en wordt hieronder generiek toegevoegd.
 */
const GENERIC_CHECKS = {
  Baseline_WIN_U_Compliance_BitLocker: ["INTUNE-BASE-001-DeviceEncryptionRequired"],
  Baseline_WIN_U_Compliance_OS_Version: ["INTUNE-BASE-003-CompliancePolicyMinOsVersion"],
  Baseline_WIN_U_Compliance_Defender_Real_Time_Protection: ["INTUNE-BASE-006-DefenderEnabled"],
  Baseline_WIN_U_Compliance_Defender_Security_Intelligence: ["INTUNE-BASE-006-DefenderEnabled"],
  Baseline_IOS_U_App_Protection: ["INTUNE-BASE-004-AppProtectionPolicyExists"],
  Baseline_AND_U_App_Protection: ["INTUNE-BASE-004-AppProtectionPolicyExists"],
};
const COMPLIANCE_ASSIGNED_CHECK = "INTUNE-BASE-002-CompliancePolicyAssigned";

const STATUS = {
  AFGEDEKT: "Afgedekt (fase 1)",
  VOORBEREID: "Alleen pilot, wacht of eigen groep",
  ORGANISATORISCH: "Organisatorisch",
  GEEN: "Geen technische maatregel in de baseline",
};
const STATUS_ICON = { [STATUS.AFGEDEKT]: "●", [STATUS.VOORBEREID]: "◐", [STATUS.ORGANISATORISCH]: "▢", [STATUS.GEEN]: "○" };

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const escapePipes = (text) => String(text ?? "").replace(/\|/g, "\\|").replace(/\n+/g, " ");
const shortName = (displayName) => displayName.replace(/^\[Baseline\] - /, "");
const byNumber = (a, b) => a.localeCompare(b, "en", { numeric: true });

/** GitHub-anker van een kop, zodat de matrix naar de details kan linken. */
function anchor(heading) {
  return heading.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s/g, "-");
}

function parseArgs(argv) {
  const caIndex = argv.indexOf("--ca");
  return {
    check: argv.includes("--check"),
    strict: argv.includes("--strict"),
    // --no-ca: CA bewust niet meenemen, ook als de CA-repo naast deze repo staat. Zonder die
    // keuze levert een lokale run (met CA) een ander document op dan CI (zonder), en wisselt
    // COMPLIANCE.md bij elke PR heen en weer.
    noCa: argv.includes("--no-ca"),
    caControls: caIndex >= 0 && argv[caIndex + 1] ? path.resolve(argv[caIndex + 1]) : DEFAULT_CA_CONTROLS,
  };
}

/** De vocabulaire, geïndexeerd op de sleutel waarop de rest van dit script telt. */
function indexVocabulary(vocab) {
  const iso = vocab.iso27001.controls;
  return {
    vocab,
    iso,
    isoById: new Map(iso.map((c) => [c.id, c])),
    nis2: vocab.nis2.punten,
    nis2ByLetter: new Map(vocab.nis2.punten.map((p) => [p.letter, p])),
    cis: vocab.cis.safeguards,
    cisById: new Map(vocab.cis.safeguards.map((s) => [s.id, s])),
    csf: vocab.nistcsf.subcategorieen,
    csfById: new Map(vocab.nistcsf.subcategorieen.map((s) => [s.id, s])),
  };
}

/**
 * Label -> sleutel in de vocabulaire. Telt op id, niet op de letterlijke tekst: een label met een
 * afwijkende titel telt dus wél mee, maar wordt gemeld — check-scope.js laat het niet door.
 */
function resolveLabel(framework, label, voc) {
  const text = String(label).trim();
  if (framework === "iso") {
    const m = text.match(/^A\.(\d+\.\d+)(?:\s|$)/);
    const item = m && voc.isoById.get(`A.${m[1]}`);
    return item ? { key: item.id, afwijkend: item.label !== text } : null;
  }
  if (framework === "nis2") {
    const m = text.match(/^art\. 21\(2\)\(([a-j])\)/);
    const item = m && voc.nis2ByLetter.get(m[1]);
    return item ? { key: item.letter, afwijkend: item.label !== text } : null;
  }
  if (framework === "cis") {
    const m = text.match(/^CIS Controls v8\.1 (\d+\.\d+)(?:\s|$)/);
    const item = m && voc.cisById.get(m[1]);
    return item ? { key: item.id, afwijkend: item.label !== text } : null;
  }
  if (framework === "nistcsf") {
    const item = voc.csfById.get(text.toUpperCase());
    return item ? { key: item.id, afwijkend: item.id !== text } : null;
  }
  return null;
}

/** checkId's per templatebestand: de eigen check uit baseline-v1.0.json plus de generieke. */
function checkIdsByTarget(templates) {
  const map = new Map();
  if (!fs.existsSync(BASELINE_PATH)) return { map, present: false };
  const baseline = readJson(BASELINE_PATH);
  const known = new Set(baseline.rules.map((r) => r.checkId));
  for (const rule of baseline.rules) {
    const m = (rule.source || "").match(/IntuneTemplate\/(.+?)\.json/);
    if (m) map.set(path.basename(m[1]), [rule.checkId]);
  }
  for (const t of templates) {
    const list = map.get(t.baseName) || [];
    for (const id of GENERIC_CHECKS[t.baseName] || []) if (known.has(id) && !list.includes(id)) list.push(id);
    if (t.type === "deviceCompliancePolicies" && known.has(COMPLIANCE_ASSIGNED_CHECK)) list.push(COMPLIANCE_ASSIGNED_CHECK);
    if (list.length) map.set(t.baseName, list);
  }
  return { map, present: true };
}

/**
 * De Conditional Access-kant, als die er is. ca-controls.json is `{ "<CA-templatebestand>": {iso,
 * nis2, cis, nistcsf, cism365} }`; de checkId komt uit de CA-baseline (source verwijst naar het
 * templatebestand), de status uit `state` in het template. Een policy in report-only telt als
 * voorbereid, niet als afgedekt: hij doet niets.
 */
function readConditionalAccess(caControlsPath) {
  if (!fs.existsSync(caControlsPath)) return { present: false, path: caControlsPath, policies: [] };
  const caRoot = path.resolve(path.dirname(caControlsPath), "..");
  const baselinePath = path.join(caRoot, "baseline", "conditional-access", "baseline-v1.0.json");
  const templateDir = path.join(caRoot, "CATemplate");
  const rules = fs.existsSync(baselinePath) ? readJson(baselinePath).rules : [];
  const controls = readJson(caControlsPath);

  const policies = Object.entries(controls)
    .filter(([key]) => !key.startsWith("_"))
    .map(([key, value]) => {
      const file = key.endsWith(".json") ? key : `${key}.json`;
      const name = file.replace(/\.json$/, "");
      const rule = rules.find((r) => (r.source || "").includes(`CATemplate/${file}`));
      const state = readCaState(path.join(templateDir, file));
      const fase = state === "enabled" ? 1 : state === "disabled" ? 5 : 2;
      return { target: name, naam: name.replace(/__/g, " - ").replace(/_/g, " "), controls: value, state, fase, checkIds: rule ? [rule.checkId] : [] };
    });
  return { present: true, path: caControlsPath, policies };
}

function readCaState(file) {
  if (!fs.existsSync(file)) return "onbekend";
  try {
    const outer = readJson(file);
    if (outer.state) return outer.state;
    const inner = typeof outer.JSON === "string" ? JSON.parse(outer.JSON) : null;
    if (inner && inner.state) return inner.state;
    const raw = inner && typeof inner.RAWJson === "string" ? JSON.parse(inner.RAWJson) : null;
    return (raw && raw.state) || "onbekend";
  } catch {
    return "onbekend";
  }
}

/** Alle policies (Intune en CA) als verwijzingen, plus per normitem de lijst van verwijzingen. */
function buildIndex(ctx) {
  const { voc, manifest, templates, checkIds, ca } = ctx;
  const templateByTarget = new Map(templates.map((t) => [t.baseName, t]));
  const problems = { zonderControls: [], onbekend: [], afwijkend: [] };
  const index = { iso: new Map(), nis2: new Map(), cis: new Map(), nistcsf: new Map() };
  const refs = [];

  const add = (ref, controls) => {
    ref.keys = { iso: [], nis2: [], cis: [], nistcsf: [] };
    for (const framework of Object.keys(index)) {
      for (const label of (controls && controls[framework]) || []) {
        const resolved = resolveLabel(framework, label, voc);
        if (!resolved) {
          problems.onbekend.push(`${ref.naam}: ${framework} "${label}"`);
          continue;
        }
        if (resolved.afwijkend) problems.afwijkend.push(`${ref.naam}: ${framework} "${label}"`);
        if (ref.keys[framework].includes(resolved.key)) continue;
        ref.keys[framework].push(resolved.key);
        if (!index[framework].has(resolved.key)) index[framework].set(resolved.key, []);
        index[framework].get(resolved.key).push(ref);
      }
    }
  };

  for (const entry of manifest.policies) {
    const template = templateByTarget.get(entry.target);
    if (!template) continue; // check-scope.js meldt een manifestregel zonder template.
    const parsed = parseBaseName(entry.target);
    const ref = {
      bron: "Intune",
      target: entry.target,
      naam: shortName(entry.displayName),
      platform: parsed.platform,
      fase: entry.fase,
      entry,
      checkIds: checkIds.get(entry.target) || [],
      link: `IntuneTemplate/${parsed.platform}/${TYPE_TO_CATEGORY[template.type]}/${entry.target}.md`,
    };
    const hasControls = entry.controls && Object.values(entry.controls).some((list) => Array.isArray(list) && list.length > 0);
    if (!hasControls) problems.zonderControls.push(ref.naam);
    add(ref, entry.controls);
    refs.push(ref);
  }

  for (const policy of ca.policies) {
    const ref = { bron: "CA", target: policy.target, naam: policy.naam, platform: "CA", fase: policy.fase, state: policy.state, checkIds: policy.checkIds, link: null };
    add(ref, policy.controls);
    refs.push(ref);
  }

  return { index, refs, problems };
}

function statusOf(refs, organisatorisch) {
  if (refs.some((r) => r.fase === 1)) return STATUS.AFGEDEKT;
  if (refs.some((r) => r.fase >= 2 && r.fase <= 4)) return STATUS.VOORBEREID;
  if (organisatorisch) return STATUS.ORGANISATORISCH;
  return STATUS.GEEN;
}

const sortRefs = (list) => [...list].sort((a, b) => a.fase - b.fase || a.bron.localeCompare(b.bron) || a.naam.localeCompare(b.naam));

function refText(ref, { withChecks = true } = {}) {
  const name = ref.link ? `[\`${ref.naam}\`](${ref.link})` : `\`${ref.naam}\``;
  const fase = ref.bron === "CA" ? `CA, ${ref.state}` : `fase ${ref.fase}`;
  const checks = withChecks && ref.checkIds.length ? ` — ${ref.checkIds.map((c) => `\`${c}\``).join(", ")}` : "";
  return `${name} (${fase})${checks}`;
}

/** Korte opsomming voor een tabelcel: namen tot een maximum, de rest als aantal. */
function refCell(list, max = 6) {
  if (list.length === 0) return "—";
  const sorted = sortRefs(list);
  const shown = sorted.slice(0, max).map((r) => `\`${escapePipes(r.naam)}\``);
  return shown.join(", ") + (sorted.length > max ? ` en ${sorted.length - max} meer` : "");
}

const count = (list, pred) => list.filter(pred).length;

// ---------------------------------------------------------------------------------------------
// Secties
// ---------------------------------------------------------------------------------------------

function sectionIntro(ctx) {
  const { ca, baselinePresent } = ctx;
  return [
    GENERATED_HEADER,
    "",
    "# Normenkader en verantwoording",
    "",
    "Hoe deze baseline invulling geeft aan **ISO/IEC 27001:2022 Annex A**, **NIS2 (richtlijn 2022/2555,",
    "art. 21 lid 2)**, **CIS Controls v8.1** en **NIST CSF 2.0** — en wat de organisatie daarnaast zelf",
    "moet regelen. Bedoeld voor een CISO, FG of auditor. Alles hieronder is afgeleid uit het veld",
    "`controls` in [`IntuneTemplate/_manifest.json`](IntuneTemplate/_manifest.json) en de vocabulaire in",
    "[`IntuneTemplate/_controls.json`](IntuneTemplate/_controls.json).",
    "",
    "**Lees dit eerst.** Dit document zegt wat de *baseline* afdwingt, niet wat een *tenant* doet. Of de",
    "policies in een tenant staan en kloppen, toetst TEST Policies Platform met de genoemde checkId's",
    "(bron: [`baseline/intune/baseline-v1.0.json`](baseline/intune/baseline-v1.0.json)). Een policy",
    "zonder eigen checkId (compliance, device configuration, app protection) is aantoonbaar via de",
    "Intune-rapportage en, waar vermeld, via een generieke check.",
    "",
    "| Status | Betekenis |",
    "|---|---|",
    `| ${STATUS_ICON[STATUS.AFGEDEKT]} ${STATUS.AFGEDEKT} | minstens één policy in fase 1${ca.present ? " of een actieve CA-policy" : ""} dwingt de maatregel af of toetst hem |`,
    `| ${STATUS_ICON[STATUS.VOORBEREID]} ${STATUS.VOORBEREID} | de policy bestaat, maar staat in fase 2, 3 of 4${ca.present ? " (of in report-only)" : ""}: nog niet op alle apparaten |`,
    `| ${STATUS_ICON[STATUS.ORGANISATORISCH]} ${STATUS.ORGANISATORISCH} | niet met endpoint- of identitybeleid in te vullen: proces, mensen, fysiek of een ander technisch domein |`,
    `| ${STATUS_ICON[STATUS.GEEN]} ${STATUS.GEEN} | wel technisch in te vullen, maar deze baseline doet het niet (of alleen met een alternatief in fase 5) |`,
    "",
    ca.uitgezet
      ? "> **Conditional Access is bewust niet meegenomen** (`--no-ca`). MFA (NIS2 (j)) en toegangsvoorwaarden steunen grotendeels op CA; de verantwoording daarvan staat in de CA-repo."
      : ca.present
      ? `Conditional Access is meegenomen uit \`${path.relative(REPO_ROOT, ca.path).split(path.sep).join("/")}\` (${ca.policies.length} policies).`
      : `> **Conditional Access is niet meegenomen**: \`ca-controls.json\` niet gevonden (gezocht: \`${path.relative(REPO_ROOT, ca.path).split(path.sep).join("/")}\`). MFA (NIS2 (j)) en toegangsvoorwaarden steunen grotendeels op CA; draai met \`--ca <pad>\` voor het volledige beeld.`,
    baselinePresent ? "" : "\n> **Let op:** `baseline/intune/baseline-v1.0.json` ontbreekt, dus de checkId's ontbreken. Draai eerst `node scripts/generate-baseline.js`.\n",
    "## Inhoud",
    "",
    "1. [Samenvatting](#samenvatting)",
    "2. [ISO/IEC 27001:2022 Annex A](#isoiec-270012022-annex-a)",
    "3. [NIS2 art. 21 lid 2](#nis2-art-21-lid-2)",
    "4. [CIS Controls v8.1](#cis-controls-v81)",
    "5. [NIST CSF 2.0](#nist-csf-20)",
    "6. [Klantkeuzes en restrisico's](#klantkeuzes-en-restrisicos)",
    "7. [Verklaring van toepasselijkheid — startpunt](#verklaring-van-toepasselijkheid--startpunt)",
    "8. [Controle van de mapping](#controle-van-de-mapping)",
    "",
  ].join("\n");
}

function sectionSummary(ctx, data) {
  const { manifest, assignments, voc, ca } = ctx;
  const intune = data.refs.filter((r) => r.bron === "Intune");
  const fases = manifest.fases || {};
  const platforms = PLATFORM_ORDER.filter((p) => intune.some((r) => r.platform === p));

  const faseRows = Object.keys(fases).map((f) => {
    const n = Number(f);
    const cells = platforms.map((p) => count(intune, (r) => r.platform === p && r.fase === n) || "–");
    return `| ${n} — ${fases[f].naam} | ${cells.join(" | ")} | **${count(intune, (r) => r.fase === n)}** |`;
  });
  const assigned = count(intune, (r) => (assignments[r.entry.displayName] || []).length > 0);

  const isoStatus = voc.iso.map((c) => statusOf(data.index.iso.get(c.id) || [], c.dekking === "organisatorisch"));
  const isoRows = Object.values(STATUS).map((s) => {
    const perDekking = ["technisch", "deels", "organisatorisch"].map((d) => count(voc.iso, (c, i) => c.dekking === d && isoStatus[i] === s));
    return `| ${STATUS_ICON[s]} ${s} | ${perDekking.join(" | ")} | **${count(isoStatus, (x) => x === s)}** |`;
  });
  const dekkingTotals = ["technisch", "deels", "organisatorisch"].map((d) => count(voc.iso, (c) => c.dekking === d));

  const nis2Rows = voc.nis2.map((p) => {
    const refs = data.index.nis2.get(p.letter) || [];
    return `| [(${p.letter})](#${anchor(p.label)}) ${escapePipes(p.label.replace(/^art\. 21\(2\)\([a-j]\) /, ""))} | ${count(refs, (r) => r.bron === "Intune" && r.fase === 1)} | ${ca.present ? count(refs, (r) => r.bron === "CA" && r.fase === 1) : "n.v.t."} | ${count(refs, (r) => r.fase >= 2 && r.fase <= 4)} |`;
  });

  const cisTech = voc.cis.filter((s) => s.soort === "technisch");
  const cisCovered = (ig) => {
    const set = cisTech.filter((s) => s.ig <= ig);
    return `${count(set, (s) => statusOf(data.index.cis.get(s.id) || [], false) === STATUS.AFGEDEKT)} van ${set.length}`;
  };
  const csfRows = Object.entries(voc.vocab.nistcsf.functies).map(([f, naam]) => {
    const list = voc.csf.filter((s) => s.functie === f);
    return `| ${f} ${naam} | ${count(list, (s) => statusOf(data.index.nistcsf.get(s.id) || [], false) === STATUS.AFGEDEKT)} | ${count(list, (s) => statusOf(data.index.nistcsf.get(s.id) || [], false) === STATUS.VOORBEREID)} | ${list.length} |`;
  });

  return [
    "## Samenvatting",
    "",
    `### Policies per fase — ${intune.length} Intune-policies${ca.present ? ` en ${ca.policies.length} CA-policies` : ""}`,
    "",
    "Alleen fase 1 is op alle apparaten of gebruikers toegewezen en telt als afgedwongen. De rest is",
    "bewust nog niet uitgerold; waarom staat per policy in [Klantkeuzes en restrisico's](#klantkeuzes-en-restrisicos).",
    "",
    `| Fase | ${platforms.map((p) => PLATFORMS[p].label).join(" | ")} | Totaal |`,
    `|---|${platforms.map(() => "---:").join("|")}|---:|`,
    ...faseRows,
    `| **Totaal** | ${platforms.map((p) => `**${count(intune, (r) => r.platform === p)}**`).join(" | ")} | **${intune.length}** |`,
    "",
    `Toegewezen volgens \`_assignments.json\`: ${assigned} (hoort gelijk te zijn aan fase 1: ${count(intune, (r) => r.fase === 1)}).`,
    ca.present
      ? `\nConditional Access: ${count(ca.policies, (p) => p.state === "enabled")} actief, ${count(ca.policies, (p) => p.state === "enabledForReportingButNotEnforced")} report-only, ${count(ca.policies, (p) => !["enabled", "enabledForReportingButNotEnforced"].includes(p.state))} uit of onbekend.`
      : "",
    "",
    "### ISO/IEC 27001:2022 Annex A — 93 controls",
    "",
    "Kolommen: of de control volgens de vocabulaire met endpoint-/identitybeleid in te vullen is.",
    "",
    `| Status | Technisch (${dekkingTotals[0]}) | Deels (${dekkingTotals[1]}) | Organisatorisch (${dekkingTotals[2]}) | Totaal |`,
    "|---|---:|---:|---:|---:|",
    ...isoRows,
    "",
    "### NIS2 art. 21(2)",
    "",
    "Aantal policies dat het punt technisch invult. Geen enkel punt is met techniek alleen af: zie per punt wat organisatorisch nodig is.",
    "",
    "| Punt | Intune fase 1 | CA actief | Pilot, wacht, eigen groep |",
    "|---|---:|---:|---:|",
    ...nis2Rows,
    "",
    "### CIS Controls v8.1 en NIST CSF 2.0",
    "",
    `CIS-safeguards die technisch in te vullen zijn (proces-, documentatie- en trainingssafeguards niet meegeteld): **IG1 ${cisCovered(1)}** afgedekt, **IG1+IG2 ${cisCovered(2)}**, **IG1–IG3 ${cisCovered(3)}**.`,
    "",
    "| NIST CSF 2.0-functie | Afgedekt | Alleen voorbereid | Relevante subcategorieën |",
    "|---|---:|---:|---:|",
    ...csfRows,
    "",
  ].join("\n");
}

function sectionIso(ctx, data) {
  const { voc } = ctx;
  const themas = voc.vocab.iso27001.themas;
  const out = [
    "## ISO/IEC 27001:2022 Annex A",
    "",
    `Norm: ${voc.vocab.iso27001.norm}. De titels zijn die van de Nederlandse norm. **Invulbaar** zegt of de`,
    "control met endpoint- of identitybeleid in te vullen is; **Status** zegt wat deze baseline er vandaag mee doet.",
    "",
  ];

  for (const [thema, kop] of Object.entries(themas)) {
    out.push(`### ${kop}`, "", "| Control | Invulbaar | Status | Fase 1 | Overig | Wat organisatorisch nodig blijft |", "|---|---|---|---:|---:|---|");
    for (const c of voc.iso.filter((x) => x.thema === thema)) {
      const refs = data.index.iso.get(c.id) || [];
      const status = statusOf(refs, c.dekking === "organisatorisch");
      const heading = `${c.id} ${c.titelNen}`;
      const label = refs.length ? `[**${c.id}** ${escapePipes(c.titelNen)}](#${anchor(heading)})` : `**${c.id}** ${escapePipes(c.titelNen)}`;
      out.push(`| ${label} | ${c.dekking} | ${STATUS_ICON[status]} ${status} | ${count(refs, (r) => r.fase === 1) || "–"} | ${count(refs, (r) => r.fase !== 1) || "–"} | ${escapePipes(c.organisatorisch)} |`);
    }
    out.push("");
  }

  out.push("### Maatregelen per control", "", "Alle policies per control, met checkId en fase. Fase 5 is een alternatief dat niet uitrolt en telt niet mee voor de status.", "");
  for (const c of voc.iso) {
    const refs = data.index.iso.get(c.id) || [];
    if (!refs.length) continue;
    out.push(`#### ${c.id} ${c.titelNen}`, "");
    for (const ref of sortRefs(refs)) out.push(`- ${refText(ref)}`);
    out.push("");
  }
  return out.join("\n");
}

function sectionNis2(ctx, data) {
  const { voc, ca } = ctx;
  const out = [
    "## NIS2 art. 21 lid 2",
    "",
    `Bron: ${voc.vocab.nis2.bron}. Per punt: wat de baseline technisch doet, welke policies dat zijn,`,
    "hoe het aantoonbaar is, en wat de organisatie zelf moet regelen. Artikel 21 vraagt maatregelen die",
    "*passend en evenredig* zijn op basis van een risicoanalyse; deze baseline is een onderbouwde invulling",
    "van het technische deel, geen vervanging van die afweging.",
    "",
  ];

  for (const p of voc.nis2) {
    const refs = data.index.nis2.get(p.letter) || [];
    const actief = sortRefs(refs.filter((r) => r.fase === 1));
    const voorbereid = sortRefs(refs.filter((r) => r.fase >= 2 && r.fase <= 4));
    const alternatief = sortRefs(refs.filter((r) => r.fase === 5));
    const checks = [...new Set(actief.flatMap((r) => r.checkIds))].sort(byNumber);
    const zonderCheck = actief.filter((r) => r.checkIds.length === 0);

    out.push(`### ${p.label}`, "", `*${p.titelWet}* — uitgewerkt in ${p.uitvoeringsverordening} van de uitvoeringsverordening.`, "", `**Technische invulling.** ${p.technisch}`, "");
    const intuneActief = actief.filter((r) => r.bron === "Intune");
    const caActief = actief.filter((r) => r.bron === "CA");
    out.push(`**Intune, fase 1 (${intuneActief.length})**`, "");
    out.push(...(intuneActief.length ? intuneActief.map((r) => `- ${refText(r)}`) : ["- geen"]), "");
    if (ca.present) out.push(`**Conditional Access, actief (${caActief.length})**`, "", ...(caActief.length ? caActief.map((r) => `- ${refText(r)}`) : ["- geen"]), "");
    if (voorbereid.length) out.push(`**Voorbereid — pilot, wacht of eigen groep (${voorbereid.length})**`, "", ...voorbereid.map((r) => `- ${refText(r)}`), "");
    if (alternatief.length) out.push(`**Alternatief, niet uitgerold (${alternatief.length})**: ${alternatief.map((r) => `\`${r.naam}\``).join(", ")}`, "");
    const bewijs = checks.length
      ? `TEST Policies Platform toetst ${checks.length} checkId's: ${checks.map((c) => `\`${c}\``).join(", ")}.`
      : actief.length
        ? "Geen checkId: aantoonbaar via de Intune-rapportage."
        : "Geen technische maatregel in fase 1, dus ook geen technische bewijsroute.";
    const zonder = zonderCheck.length ? ` Zonder eigen check (aantoonbaar via de Intune-rapportage): ${zonderCheck.map((r) => `\`${r.naam}\``).join(", ")}.` : "";
    out.push(
      `**Bewijsroute.** ${bewijs}${zonder}`,
      "",
      "**Organisatorisch nodig**",
      "",
      ...p.organisatorisch.map((o) => `- ${o}`),
      ""
    );
  }
  return out.join("\n");
}

function sectionCis(ctx, data) {
  const { voc } = ctx;
  const out = [
    "## CIS Controls v8.1",
    "",
    `${voc.vocab.cis.versie}. IG is de laagste Implementation Group waarin de safeguard zit (IG2 omvat IG1).`,
    "Benchmark-verwijzingen (CIS Microsoft Windows 11, Apple macOS, iOS, Android) staan per policy in `bron` en `bewijs`.",
    "",
  ];
  for (const [nr, titel] of Object.entries(voc.vocab.cis.controls)) {
    const list = voc.cis.filter((s) => String(s.control) === nr);
    if (!list.length) continue;
    out.push(`### ${nr} ${titel}`, "", "| Safeguard | IG | Soort | Status | Policies |", "|---|---|---|---|---|");
    for (const s of list) {
      const refs = data.index.cis.get(s.id) || [];
      const status = statusOf(refs, s.soort === "organisatorisch");
      out.push(`| **${s.id}** ${escapePipes(s.titel)} | IG${s.ig} | ${s.soort} | ${STATUS_ICON[status]} ${status} | ${refCell(refs)} |`);
    }
    out.push("");
  }
  return out.join("\n");
}

function sectionCsf(ctx, data) {
  const { voc } = ctx;
  const out = [
    "## NIST CSF 2.0",
    "",
    `${voc.vocab.nistcsf.versie}. Alleen de subcategorieën die voor endpoint en identiteit relevant zijn. Govern`,
    "is per definitie organisatorisch: geen policy vult het in, deze baseline is hooguit een uitvoering ervan.",
    "",
  ];
  for (const [f, naam] of Object.entries(voc.vocab.nistcsf.functies)) {
    out.push(`### ${f} — ${naam}`, "", "| Subcategorie | Omschrijving | Status | Policies |", "|---|---|---|---|");
    for (const s of voc.csf.filter((x) => x.functie === f)) {
      const refs = data.index.nistcsf.get(s.id) || [];
      const status = statusOf(refs, f === "GV");
      out.push(`| **${s.id}** | ${escapePipes(s.titel)} | ${STATUS_ICON[status]} ${status} | ${refCell(refs)} |`);
    }
    out.push("");
  }
  return out.join("\n");
}

function sectionKeuzes(ctx, data) {
  const { voc, manifest } = ctx;
  const intune = data.refs.filter((r) => r.bron === "Intune");
  const displayNames = manifest.policies.map((p) => p.displayName);
  const related = (ref) => {
    const text = `${ref.entry.faseWaarom || ""} ${ref.entry.note || ""}`;
    return displayNames.filter((d) => d !== ref.entry.displayName && text.includes(d)).map((d) => `\`${shortName(d)}\``);
  };
  const isoShort = (ref) => ref.keys.iso.sort(byNumber).join(", ") || "—";
  const table = (list, extra) => [
    `| Policy | ${extra.kop} | Normen (ISO) |`,
    "|---|---|---|",
    ...list.map((r) => `| [\`${r.naam}\`](${r.link}) | ${escapePipes(extra.cel(r))} | ${isoShort(r)} |`),
  ];
  const perFase = (n) => intune.filter((r) => r.fase === n).sort((a, b) => a.naam.localeCompare(b.naam));

  const restIso = voc.iso
    .map((c) => ({ c, refs: data.index.iso.get(c.id) || [] }))
    .filter(({ c, refs }) => c.dekking !== "organisatorisch" && statusOf(refs, false) !== STATUS.AFGEDEKT);
  const restNis2 = voc.nis2.filter((p) => !(data.index.nis2.get(p.letter) || []).some((r) => r.fase === 1));

  return [
    "## Klantkeuzes en restrisico's",
    "",
    "Wat een managementbesluit vraagt vóór de baseline volledig staat. Elke regel komt uit `faseWaarom`",
    "in het manifest; een besluit hier is een wijziging van de fase in een PR, zodat het besluit en de",
    "uitrol op één plek terug te vinden zijn.",
    "",
    `### A. Kies een variant — fase 5, niet uitrollen (${perFase(5).length})`,
    "",
    "Alternatieven voor een policy die wél uitrolt, of klantkeuzes zonder technisch juist antwoord. Twee",
    "varianten tegelijk toewijzen levert in Intune een Conflict op, waarna géén van beide wordt toegepast.",
    "",
    ...table(perFase(5), { kop: "Waarom niet uitgerold · samenhang", cel: (r) => `${r.entry.faseWaarom}${related(r).length ? ` Samenhang: ${related(r).join(", ")}.` : ""}` }),
    "",
    `### B. Eigen groep — fase 4 (${perFase(4).length})`,
    "",
    "Hoort op een specifieke groep. Besluit: bestaat die groep, wie zit erin, en wie beheert het lidmaatschap.",
    "",
    ...table(perFase(4), { kop: "Groep · waarom", cel: (r) => `**${r.entry.faseGroep || "groep niet benoemd"}** — ${r.entry.faseWaarom}` }),
    "",
    `### C. Wacht op een voorwaarde — fase 3 (${perFase(3).length})`,
    "",
    "Klaar, maar doet pas iets als aan de voorwaarde is voldaan. Besluit: wie zorgt daarvoor en wanneer.",
    "",
    ...table(perFase(3), { kop: "Voorwaarde", cel: (r) => r.entry.faseWaarom }),
    "",
    `### D. Pilot — fase 2 (${perFase(2).length})`,
    "",
    "Merkbaar voor gebruikers of kan iets breken. Besluit: gevolgen accepteren na de pilot en naar fase 1 brengen.",
    "Tot dat besluit is de control die de policy invult niet afgedekt.",
    "",
    ...table(perFase(2), { kop: "Gevolg dat geaccepteerd moet worden", cel: (r) => r.entry.faseWaarom }),
    "",
    "### Restrisico's",
    "",
    `**ISO-controls die technisch in te vullen zijn maar vandaag niet door fase 1 worden afgedekt (${restIso.length}).**`,
    "Accepteer het risico expliciet, vul het in buiten deze baseline, of breng de voorbereide policy naar fase 1.",
    "",
    "| Control | Invulbaar | Voorbereid in de baseline |",
    "|---|---|---|",
    ...restIso.map(({ c, refs }) => `| **${c.id}** ${escapePipes(c.titelNen)} | ${c.dekking} | ${refCell(refs.filter((r) => r.fase !== 1), 8)} |`),
    "",
    restNis2.length
      ? `**NIS2-punten zonder enige technische maatregel in fase 1:** ${restNis2.map((p) => `(${p.letter})`).join(", ")}. Voor deze punten rust de naleving volledig op de organisatorische maatregelen.`
      : "**Elk NIS2-punt heeft minstens één technische maatregel in fase 1** — geen enkel punt is daarmee af; zie per punt wat organisatorisch nodig is.",
    "",
    data.problems.zonderControls.length
      ? `> **Waarschuwing: ${data.problems.zonderControls.length} policies zonder controls.** Die zijn niet te verantwoorden en tellen nergens mee: ${data.problems.zonderControls.map((n) => `\`${n}\``).join(", ")}.`
      : "Alle policies hebben een normverwijzing.",
    "",
  ].join("\n");
}

function sectionSoa(ctx, data) {
  const { voc } = ctx;
  const out = [
    "## Verklaring van toepasselijkheid — startpunt",
    "",
    "Een voorstel per Annex A-control voor de VvT (Statement of Applicability). **Toepasselijkheid is een",
    "besluit van de organisatie op basis van haar risicoanalyse**; deze kolommen zijn een startpunt, geen",
    "uitkomst. Kolom *NIS2* noemt de punten die de policies bij deze control raken.",
    "",
    "| Control | Toegepast (voorstel) | Reden | Maatregel | NIS2 |",
    "|---|---|---|---|---|",
  ];
  for (const c of voc.iso) {
    const refs = data.index.iso.get(c.id) || [];
    const status = statusOf(refs, c.dekking === "organisatorisch");
    const letters = [...new Set(refs.flatMap((r) => r.keys.nis2))].sort();
    const toegepast = c.soa.voorstel === "afhankelijk" ? "afhankelijk" : "ja";
    const reden =
      c.soa.voorstel === "afhankelijk"
        ? c.soa.reden
        : letters.length
          ? "basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse"
          : "basisbeveiliging; bevestigen met de risicoanalyse";
    const f1 = count(refs, (r) => r.fase === 1);
    const other = count(refs, (r) => r.fase >= 2 && r.fase <= 4);
    const technisch =
      status === STATUS.AFGEDEKT
        ? `Technisch: ${f1} ${f1 === 1 ? "policy" : "policies"} in fase 1${other ? `, ${other} voorbereid` : ""}. `
        : status === STATUS.VOORBEREID
          ? `Technisch voorbereid: ${other} ${other === 1 ? "policy" : "policies"} in pilot, wacht of eigen groep. `
          : "";
    out.push(`| **${c.id}** ${escapePipes(c.titelNen)} | ${toegepast} | ${escapePipes(reden)} | ${escapePipes(technisch + "Organisatorisch: " + c.organisatorisch)} | ${letters.map((l) => `(${l})`).join(" ") || "—"} |`);
  }
  out.push("");
  return out.join("\n");
}

function sectionControle(ctx, data) {
  const { problems } = data;
  const intune = data.refs.filter((r) => r.bron === "Intune");
  const lines = ["## Controle van de mapping", ""];
  lines.push(`| | Aantal |`, `|---|---:|`, `| Intune-policies met controls | ${intune.length - problems.zonderControls.length} van ${intune.length} |`, `| Labels buiten de vocabulaire | ${problems.onbekend.length} |`, `| Labels met een afwijkende schrijfwijze (wel meegeteld) | ${problems.afwijkend.length} |`, "");
  if (problems.onbekend.length) lines.push("**Buiten de vocabulaire — niet meegeteld:**", "", ...problems.onbekend.map((p) => `- ${escapePipes(p)}`), "");
  if (problems.afwijkend.length) lines.push("**Afwijkende schrijfwijze — meegeteld op id:**", "", ...problems.afwijkend.map((p) => `- ${escapePipes(p)}`), "");
  lines.push(
    "Map alleen wat een policy werkelijk afdwingt of toetst. `check-scope.js` weigert een policy zonder",
    "controls en labels die niet exact in `IntuneTemplate/_controls.json` staan.",
    "",
    "---",
    "",
    "Terug naar de [hoofd-README](README.md) · [OVERZICHT.md](OVERZICHT.md)",
    ""
  );
  return lines.join("\n");
}

// ---------------------------------------------------------------------------------------------

function main() {
  const opts = parseArgs(process.argv.slice(2));
  for (const file of [MANIFEST_PATH, CONTROLS_PATH]) {
    if (!fs.existsSync(file)) {
      console.error(`${path.relative(REPO_ROOT, file)} ontbreekt — zonder dat bestand valt er niets te verantwoorden.`);
      process.exit(1);
    }
  }
  const templates = readTemplates(TEMPLATE_DIR);
  const manifest = readJson(MANIFEST_PATH);
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? readJson(ASSIGNMENTS_PATH) : {};
  const voc = indexVocabulary(readJson(CONTROLS_PATH));
  const { map: checkIds, present: baselinePresent } = checkIdsByTarget(templates);
  const ca = opts.noCa ? { present: false, uitgezet: true, path: opts.caControls, policies: [] } : readConditionalAccess(opts.caControls);

  if (!baselinePresent) console.warn("Let op: baseline/intune/baseline-v1.0.json ontbreekt — geen checkId's. Draai eerst generate-baseline.js.");
  if (!ca.present && !ca.uitgezet) console.warn(`Conditional Access niet meegenomen: ${ca.path} bestaat niet.`);

  const ctx = { voc, manifest, assignments, templates, checkIds, ca, baselinePresent };
  const data = buildIndex(ctx);
  const content = [sectionIntro(ctx), sectionSummary(ctx, data), sectionIso(ctx, data), sectionNis2(ctx, data), sectionCis(ctx, data), sectionCsf(ctx, data), sectionKeuzes(ctx, data), sectionSoa(ctx, data), sectionControle(ctx, data)].join("\n");

  const before = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, "utf8") : null;
  if (opts.check) {
    if (before !== content) {
      console.error("COMPLIANCE.md loopt achter. Draai: node scripts/generate-compliance.js");
      process.exit(1);
    }
    console.log("  ongewijzigd  COMPLIANCE.md");
  } else if (before === content) {
    console.log("  ongewijzigd  COMPLIANCE.md");
  } else {
    fs.writeFileSync(OUTPUT_PATH, content);
    console.log(`  ${before === null ? "nieuw       " : "bijgewerkt  "} COMPLIANCE.md`);
  }

  const { zonderControls, onbekend, afwijkend } = data.problems;
  for (const n of zonderControls) console.warn(`  zonder controls: ${n}`);
  for (const p of onbekend) console.warn(`  buiten de vocabulaire: ${p}`);
  for (const p of afwijkend) console.warn(`  afwijkende schrijfwijze: ${p}`);
  if (opts.strict && (zonderControls.length || onbekend.length || afwijkend.length)) {
    console.error(`\n--strict: ${zonderControls.length} zonder controls, ${onbekend.length} buiten de vocabulaire, ${afwijkend.length} afwijkend.`);
    process.exit(1);
  }
}

main();
