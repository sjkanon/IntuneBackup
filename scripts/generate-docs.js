#!/usr/bin/env node
/**
 * Genereert de README's die de inhoud van IntuneTemplate/ opsommen: één overzicht in
 * IntuneTemplate/ en één per platform, met per policy het type, het aantal instellingen, de
 * checkId, het toewijzingsdoel en de OIB-herkomst.
 *
 * Gegenereerd en niet met de hand geschreven, om dezelfde reden als baseline-v1.0.json: 95
 * policies met de hand bijhouden gaat mis, en een tabel die niet meer klopt is erger dan geen
 * tabel — die leest namelijk nog steeds alsof hij klopt.
 *
 * Leest baseline/intune/baseline-v1.0.json mee voor de checkId's, dus draai
 * generate-baseline.js eerst. Ontbreekt dat bestand, dan blijft de checkId-kolom leeg met een
 * melding erbij in plaats van stilzwijgend.
 *
 * Gebruik: node scripts/generate-docs.js [--check]
 *   --check schrijft niets en geeft exit 1 als een README niet meer klopt (voor CI).
 */

const fs = require("fs");
const path = require("path");
const { PLATFORMS, TYPE_TO_CATEGORY, readTemplates, parseBaseName, flattenSettings } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const BASELINE_PATH = path.join(REPO_ROOT, "baseline", "intune", "baseline-v1.0.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_oib-manifest.json");

const TYPE_LABEL = {
  Catalog: "Settings Catalog",
  Admin: "ADMX",
  Device: "Device config",
  deviceCompliancePolicies: "Compliance",
  AppProtection: "App Protection",
};

const GENERATED_HEADER = "<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->";

/** checkId per templatebestand, uit het `source`-veld van de gegenereerde baseline. */
function checkIdsByBaseName() {
  if (!fs.existsSync(BASELINE_PATH)) return null;
  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  const map = new Map();
  for (const rule of baseline.rules) {
    const m = (rule.source || "").match(/IntuneTemplate\/(.+?)\.json/);
    if (m) map.set(path.basename(m[1]), rule.checkId);
  }
  return map;
}

function assignmentLabel(assignments, displayName) {
  const list = assignments[displayName];
  if (!list || list.length === 0) return "—";
  return list
    .map((a) => {
      const type = a.target["@odata.type"] || "";
      if (type.includes("allDevices")) return "All Devices";
      if (type.includes("allLicensedUsers")) return "All Users";
      if (type.includes("exclusionGroup")) return "groep (uitsluiting)";
      if (type.includes("group")) return "groep";
      return type.replace("#microsoft.graph.", "");
    })
    .join(", ");
}

/** Het aantal instellingen dat een policy werkelijk zet — de uitgeklapte telling. */
function settingCount(template) {
  if (template.type === "Catalog") return flattenSettings(template.raw.settings).settings.length;
  if (template.type === "Admin") return (template.raw.added || []).length;
  return "—";
}

function escapePipes(text) {
  return String(text).replace(/\|/g, "\\|");
}

function policyTable(templates, { checkIds, assignments, manifestByTarget, showType }) {
  const header = showType
    ? "| Policy | Type | Instellingen | checkId | Toewijzing | Bron |\n|---|---|---:|---|---|---|"
    : "| Policy | Instellingen | checkId | Toewijzing | Bron |\n|---|---:|---|---|---|";

  const rows = templates.map((t) => {
    const item = parseBaseName(t.baseName).item.replace(/_/g, " ");
    const entry = manifestByTarget.get(t.baseName);
    const source = entry
      ? entry.source
        ? "OIB"
        : "eigen"
      : "eigen";
    const cells = [
      `\`${escapePipes(item)}\``,
      ...(showType ? [TYPE_LABEL[t.type] || t.type] : []),
      settingCount(t),
      checkIds ? (checkIds.get(t.baseName) ? `\`${checkIds.get(t.baseName)}\`` : "—") : "?",
      assignmentLabel(assignments, t.displayName),
      source,
    ];
    return `| ${cells.join(" | ")} |`;
  });
  return [header, ...rows].join("\n");
}

function platformReadme(platform, templates, ctx) {
  const label = PLATFORMS[platform].label;
  const byScope = { D: templates.filter((t) => parseBaseName(t.baseName).scope === "D"), U: templates.filter((t) => parseBaseName(t.baseName).scope === "U") };
  const byCategory = {};
  for (const t of templates) {
    const cat = TYPE_TO_CATEGORY[t.type];
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  }

  const lines = [
    GENERATED_HEADER,
    "",
    `# ${label} — ${templates.length} policies`,
    "",
    `Alle policies heten \`[Baseline] - ${platform} - <D|U> - <Item>\`; de tabellen hieronder laten het \`<Item>\`-deel zien.`,
    "",
    "| Map | Aantal |",
    "|---|---:|",
    ...Object.entries(byCategory).map(([cat, n]) => `| \`${cat}/\` | ${n} |`),
    "",
  ];

  for (const [scope, list] of Object.entries(byScope)) {
    if (list.length === 0) continue;
    const heading = scope === "D" ? "Device-scoped (D)" : "User-scoped (U)";
    const target = scope === "D" ? "apparaatgroepen" : "gebruikersgroepen";
    lines.push(`## ${heading} — ${list.length}`, "", `Toewijzen aan ${target}.`, "", policyTable(list, { ...ctx, showType: true }), "");
  }

  lines.push(
    "---",
    "",
    "Kolom **Bron**: `OIB` komt uit [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) via",
    "[`_oib-manifest.json`](../_oib-manifest.json); `eigen` staat alleen in deze baseline.",
    "",
    "Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft",
    "(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).",
    ""
  );
  return lines.join("\n");
}

function overviewReadme(templates, ctx) {
  const platforms = ["WIN", "MAC", "IOS", "AND"];
  const types = Object.keys(TYPE_LABEL);

  const matrix = platforms.map((p) => {
    const list = templates.filter((t) => parseBaseName(t.baseName).platform === p);
    if (list.length === 0) return null;
    const counts = types.map((ty) => list.filter((t) => t.type === ty).length);
    return `| [${PLATFORMS[p].label}](${p}/README.md) | ${counts.map((c) => (c === 0 ? "–" : c)).join(" | ")} | **${list.length}** |`;
  }).filter(Boolean);

  const totals = types.map((ty) => templates.filter((t) => t.type === ty).length);

  return [
    GENERATED_HEADER,
    "",
    `# IntuneTemplate — ${templates.length} policies`,
    "",
    "De bron van deze repo: de afgesproken Intune-policies in CIPP-templateformaat. Alles wat",
    "in `baseline/` en `export/` staat is hieruit afgeleid en wordt gegenereerd.",
    "",
    `| Platform | ${types.map((t) => TYPE_LABEL[t]).join(" | ")} | Totaal |`,
    `|---|${types.map(() => "---:").join("|")}|---:|`,
    ...matrix,
    `| **Totaal** | ${totals.map((c) => `**${c || "–"}**`).join(" | ")} | **${templates.length}** |`,
    "",
    "## Indeling",
    "",
    "```mermaid",
    "flowchart LR",
    "  T[IntuneTemplate/] --> WIN[WIN/]",
    "  T --> MAC[MAC/]",
    "  T --> IOS[IOS/]",
    "  T --> AND[AND/]",
    "  WIN --> WSC[SettingsCatalog/]",
    "  WIN --> WAT[AdministrativeTemplates/]",
    "  WIN --> WDC[DeviceConfigurations/]",
    "  WIN --> WCP[CompliancePolicies/]",
    "  MAC --> MSC[SettingsCatalog/]",
    "  MAC --> MCP[CompliancePolicies/]",
    "  IOS --> IAP[AppProtection/]",
    "  AND --> AAP[AppProtection/]",
    "```",
    "",
    "De map volgt uit de bestandsnaam (platform) en het CIPP-`Type` (policytype) en draagt dus",
    "geen informatie die niet ook in het bestand staat. `check-scope.js` controleert dat elk",
    "bestand op zijn plek staat.",
    "",
    "## De drie `_`-bestanden",
    "",
    "| Bestand | Wat het vastlegt | Gelezen door |",
    "|---|---|---|",
    "| [`_assignments.json`](_assignments.json) | het toewijzingsdoel per policy | `export-intunebackup.js`, `check-scope.js` |",
    "| [`_oib-manifest.json`](_oib-manifest.json) | welke OIB-policy waar landt, en waarom er afgeweken wordt | `import-oib.js` |",
    "| [`_renames.json`](_renames.json) | hoe policies in de tenant heetten en wat er nu bij hoort | `Rename-BaselinePolicy.ps1`, `check-scope.js` |",
    "",
    "Assignments staan bewust niet in het template zelf: CIPP wijst apart toe, maar",
    "IntuneBackupAndRestore heeft ze wél nodig om compleet terug te kunnen zetten.",
    "",
    "Ze hebben geen `RowKey` en geen `Displayname`, dus CIPP maakt er bij een repo-sync één",
    "naamloze rij van. Die doet niets — zie de [hoofd-README](../README.md#terugzetten-in-een-tenant).",
    "",
    "## Per platform",
    "",
    ...platforms.filter((p) => templates.some((t) => parseBaseName(t.baseName).platform === p)).map((p) => {
      const n = templates.filter((t) => parseBaseName(t.baseName).platform === p).length;
      return `- [${PLATFORMS[p].label}](${p}/README.md) — ${n} policies`;
    }),
    "",
    "Zie de [hoofd-README](../README.md) voor de naamconventie, de controles en hoe je een",
    "nieuwe OpenIntuneBaseline-versie binnenhaalt.",
    "",
  ].join("\n");
}

function main() {
  const checkOnly = process.argv.includes("--check");
  const templates = readTemplates(TEMPLATE_DIR);
  const checkIds = checkIdsByBaseName();
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) : { policies: [] };
  const manifestByTarget = new Map(manifest.policies.map((p) => [p.target, p]));

  if (!checkIds) {
    console.warn(`Let op: ${path.relative(REPO_ROOT, BASELINE_PATH)} bestaat niet — de checkId-kolom blijft leeg. Draai eerst generate-baseline.js.`);
  }

  const ctx = { checkIds, assignments, manifestByTarget };
  const files = [{ file: path.join(TEMPLATE_DIR, "README.md"), content: overviewReadme(templates, ctx) }];

  for (const platform of Object.keys(PLATFORMS)) {
    const list = templates.filter((t) => parseBaseName(t.baseName).platform === platform);
    if (list.length === 0) continue;
    files.push({ file: path.join(TEMPLATE_DIR, platform, "README.md"), content: platformReadme(platform, list, ctx) });
  }

  const stale = [];
  for (const { file, content } of files) {
    const rel = path.relative(REPO_ROOT, file).split(path.sep).join("/");
    const before = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    if (before === content) {
      console.log(`  ongewijzigd  ${rel}`);
      continue;
    }
    stale.push(rel);
    if (checkOnly) {
      console.log(`  VEROUDERD    ${rel}`);
      continue;
    }
    fs.writeFileSync(file, content);
    console.log(`  ${before === null ? "nieuw       " : "bijgewerkt  "} ${rel}`);
  }

  if (checkOnly && stale.length > 0) {
    console.error(`\n${stale.length} README('s) lopen achter op IntuneTemplate/. Draai: node scripts/generate-docs.js`);
    process.exit(1);
  }
  console.log(`\n${files.length} README('s) gecontroleerd, ${stale.length} ${checkOnly ? "verouderd" : "geschreven"}.`);
}

main();
