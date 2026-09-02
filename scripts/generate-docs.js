#!/usr/bin/env node
/**
 * Genereert de documentatie die uit IntuneTemplate/ af te leiden is:
 *
 *   OVERZICHT.md                          de samenvatting om te delen
 *   IntuneTemplate/README.md              de matrix en de mapindeling
 *   IntuneTemplate/<PLAT>/README.md       elke policy met wat hij doet en waar hij landt
 *   IntuneTemplate/<PLAT>/<CAT>/*.md      per policy élke instelling die hij zet
 *
 * Gegenereerd en niet met de hand geschreven, om dezelfde reden als baseline-v1.0.json: bijna
 * honderd policies met duizenden instellingen bijhouden gaat mis, en een tabel die niet meer
 * klopt is erger dan geen tabel — die leest namelijk nog steeds alsof hij klopt.
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

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

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

/**
 * Waarde leesbaar maken. Bij een keuze-instelling is de waarde de settingDefinitionId met een
 * suffix eraan geplakt (`..._requiresecuritydevice_true`); dat voorvoegsel herhalen maakt de
 * tabel onleesbaar, dus alleen het suffix blijft over.
 */
function shortValue(id, value) {
  if (value === null || value === undefined) return "—";
  let text = String(value);
  if (id && text.startsWith(id + "_")) text = text.slice(id.length + 1);
  if (text === "") return "*(leeg)*";
  if (text.length > 110) text = text.slice(0, 107) + "…";
  return text;
}

/**
 * Klapt een settingInstance-boom uit met behoud van de nesting, want die nesting is
 * betekenisvol: een kind is alleen actief als zijn parent op de juiste waarde staat.
 * flattenSettings() gooit dat weg — prima voor een vergelijking, niet voor documentatie.
 */
function settingRows(instance, depth, rows) {
  if (!instance || typeof instance !== "object") return;
  const odataType = instance["@odata.type"] || "";
  const id = instance.settingDefinitionId;

  if (odataType.endsWith("ChoiceSettingInstance")) {
    const value = instance.choiceSettingValue || {};
    rows.push({ depth, id, value: shortValue(id, value.value) });
    for (const child of value.children || []) settingRows(child, depth + 1, rows);
  } else if (odataType.endsWith("ChoiceSettingCollectionInstance")) {
    const values = instance.choiceSettingCollectionValue || [];
    rows.push({ depth, id, value: values.map((v) => shortValue(id, v.value)).join(", ") });
    for (const v of values) for (const child of v.children || []) settingRows(child, depth + 1, rows);
  } else if (odataType.endsWith("SimpleSettingInstance")) {
    const value = instance.simpleSettingValue || {};
    const secret = (value["@odata.type"] || "").includes("Secret");
    rows.push({ depth, id, value: secret ? "*(geheim — alleen geldig in de brontenant)*" : shortValue(null, value.value) });
  } else if (odataType.endsWith("SimpleSettingCollectionInstance")) {
    const values = (instance.simpleSettingCollectionValue || []).map((v) => String(v.value));
    rows.push({ depth, id, value: values.join(", ") });
  } else if (odataType.endsWith("GroupSettingCollectionInstance")) {
    const groups = instance.groupSettingCollectionValue || [];
    rows.push({ depth, id, value: groups.length > 1 ? `*(${groups.length} items)*` : "*(groep)*" });
    groups.forEach((group, i) => {
      if (groups.length > 1) rows.push({ depth: depth + 1, id: null, value: null, separator: `item ${i + 1}` });
      for (const child of group.children || []) settingRows(child, depth + 1, rows);
    });
  } else {
    rows.push({ depth, id, value: `*(onbekend type ${odataType})*` });
  }
}

/** Eigenschappen van een compliance-, device- of app protection-policy als tabelrijen. */
const BODY_SKIP = new Set(["@odata.type", "displayName", "description", "name", "roleScopeTagIds", "settings", "platforms", "technologies", "templateReference"]);

function bodyRows(raw, prefix = "", rows = []) {
  for (const [key, value] of Object.entries(raw)) {
    if (BODY_SKIP.has(key) && !prefix) continue;
    const label = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) bodyRows(value, label, rows);
    else if (Array.isArray(value)) {
      if (value.length === 0) rows.push({ id: label, value: "—" });
      else if (value.every((v) => typeof v !== "object")) rows.push({ id: label, value: value.join(", ") });
      else value.forEach((v, i) => bodyRows(v, `${label}[${i}]`, rows));
    } else rows.push({ id: label, value: value === null ? "—" : truncateScalar(String(value)) });
  }
  return rows;
}

/**
 * Losse waarden afkappen op dezelfde lengte als shortValue() bij de settings-tabellen. Een
 * custom macOS-profiel draagt zijn hele mobileconfig als base64 in `payload`; onafgekapt is dat
 * duizenden tekens in één tabelcel, en dan is de tabel eromheen niet meer te lezen. Alleen
 * scalairen: lijstwaarden (managedUniversalLinks bij App Protection) blijven volledig, want
 * daar is de inhoud van de lijst juist wat je wil zien.
 */
function truncateScalar(text) {
  return text.length > 110 ? `${text.slice(0, 107)}…` : text;
}

function policyTable(templates, { checkIds, assignments, manifestByTarget }) {
  const header =
    "| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |\n|---|---|---|---:|---|---|";

  const rows = templates.map((t) => {
    const item = parseBaseName(t.baseName).item.replace(/_/g, " ");
    const entry = manifestByTarget.get(t.baseName);
    const doc = `${TYPE_TO_CATEGORY[t.type]}/${t.baseName}.md`;
    const cells = [
      `[**${escapePipes(item)}**](${doc})`,
      escapePipes(entry && entry.doel ? entry.doel : "—"),
      TYPE_LABEL[t.type] || t.type,
      settingCount(t),
      assignmentLabel(assignments, t.displayName),
      checkIds ? (checkIds.get(t.baseName) ? `\`${checkIds.get(t.baseName)}\`` : "—") : "?",
    ];
    return `| ${cells.join(" | ")} |`;
  });
  return [header, ...rows].join("\n");
}

/**
 * Eén markdown per policy, naast de JSON: wat de policy doet, waar hij landt, en élke
 * instelling die hij zet. De JSON is voor de tooling, dit is voor de mens die wil weten wat
 * er precies verandert vóór hij het uitrolt.
 */
function policyDocument(template, ctx) {
  const { baseName, type, displayName, raw, inner } = template;
  const parsed = parseBaseName(baseName);
  const entry = ctx.manifestByTarget.get(baseName) || {};
  const checkId = ctx.checkIds ? ctx.checkIds.get(baseName) : null;
  const family = raw.templateReference && raw.templateReference.templateId ? raw.templateReference.templateFamily : null;

  const lines = [
    GENERATED_HEADER,
    "",
    `# ${displayName}`,
    "",
    entry.doel || "",
    "",
    "| | |",
    "|---|---|",
    `| Platform | ${PLATFORMS[parsed.platform].label} |`,
    `| Scope | ${parsed.scope === "D" ? "Device (D) — toewijzen aan apparaatgroepen" : "User (U) — toewijzen aan gebruikersgroepen"} |`,
    `| Type | ${TYPE_LABEL[type] || type}${family ? ` (${family})` : ""} |`,
    `| Toewijzing | ${assignmentLabel(ctx.assignments, displayName)} |`,
    `| checkId | ${checkId ? `\`${checkId}\`` : "geen — de platform-engine heeft geen matcher voor dit policytype"} |`,
    `| Bron | ${entry.bron || "eigen baseline"} |`,
    `| Bestand | [\`${baseName}.json\`](${baseName}.json) |`,
    "",
  ];

  if (entry.note) lines.push(`> ${entry.note}`, "");

  if (type === "Catalog") {
    const rows = [];
    for (const s of raw.settings || []) settingRows(s.settingInstance, 0, rows);
    lines.push(
      `## Instellingen — ${rows.filter((r) => r.id).length}`,
      "",
      "Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende",
      "instelling op de getoonde waarde staat.",
      "",
      "| Instelling | Waarde |",
      "|---|---|",
      ...rows.map((r) => {
        const indent = "&nbsp;".repeat(r.depth * 4);
        if (r.separator) return `| ${indent}*${r.separator}* | |`;
        return `| ${indent}\`${escapePipes(r.id)}\` | ${escapePipes(r.value)} |`;
      }),
      ""
    );
  } else if (type === "Admin") {
    lines.push(
      `## ADMX-definities — ${(raw.added || []).length}`,
      "",
      "Klassieke Group Policy-instellingen. De GUID's zijn Microsoft's vaste",
      "ADMX-catalogus-id's en dus tenant-onafhankelijk.",
      "",
      "| Definitie | Ingeschakeld | Waarden |",
      "|---|---|---|",
      ...(raw.added || []).map((d) => {
        const guid = (d["definition@odata.bind"] || "").match(/groupPolicyDefinitions\('([^']+)'\)/);
        const values = (d.presentationValues || []).map((p) => escapePipes(String(p.value))).join(", ") || "—";
        return `| \`${guid ? guid[1] : "?"}\` | ${d.enabled ? "ja" : "nee"} | ${values} |`;
      }),
      ""
    );
  } else {
    const rows = bodyRows(raw);
    lines.push(
      `## Eigenschappen — ${rows.length}`,
      "",
      type === "deviceCompliancePolicies"
        ? "Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet."
        : type === "AppProtection"
          ? "Een app protection-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `—` betekent niet ingesteld."
          : "Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.",
      "",
      "| Eigenschap | Waarde |",
      "|---|---|",
      ...rows.map((r) => `| \`${escapePipes(r.id)}\` | ${escapePipes(r.value)} |`),
      ""
    );
  }

  lines.push(
    "---",
    "",
    `Terug naar het [${PLATFORMS[parsed.platform].label}-overzicht](../README.md) · [hoofd-README](../../../README.md)`,
    ""
  );
  return lines.join("\n");
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
    `# ${label} — ${plural(templates.length, "policy", "policies")}`,
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
    lines.push(`## ${heading} — ${list.length}`, "", `Toewijzen aan ${target}.`, "", policyTable(list, ctx), "");
  }

  lines.push(
    "---",
    "",
    "**Wat het doet** komt uit `doel` in [`_oib-manifest.json`](../_oib-manifest.json). Diezelfde zin",
    "staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het",
    "template — en dus straks in de tenant naast de policy.",
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
    `# IntuneTemplate — ${plural(templates.length, "policy", "policies")}`,
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
      return `- [${PLATFORMS[p].label}](${p}/README.md) — ${plural(n, "policy", "policies")}`;
    }),
    "",
    "Zie de [hoofd-README](../README.md) voor de naamconventie, de controles en hoe je een",
    "nieuwe OpenIntuneBaseline-versie binnenhaalt.",
    "",
  ].join("\n");
}

/**
 * OVERZICHT.md: de samenvatting om te presenteren. De tellingen worden berekend, de rest is
 * vaste tekst — die beschrijft een moment (wat er in augustus 2026 veranderd is) en veroudert
 * dus niet zoals een telling dat doet.
 */
function overviewDocument(templates, ctx) {
  const platforms = ["WIN", "MAC", "IOS", "AND"];
  const types = Object.keys(TYPE_LABEL);
  const perPlatform = (p) => templates.filter((t) => parseBaseName(t.baseName).platform === p);
  const checks = ctx.checkIds ? new Set([...ctx.checkIds.values()]).size : 0;
  const unassigned = templates.filter((t) => !ctx.assignments[t.displayName]);

  const matrix = platforms
    .map((p) => {
      const list = perPlatform(p);
      if (list.length === 0) return null;
      const counts = types.map((ty) => list.filter((t) => t.type === ty).length);
      return `| [${PLATFORMS[p].label}](IntuneTemplate/${p}/README.md) | ${counts.map((c) => (c === 0 ? "–" : c)).join(" | ")} | **${list.length}** |`;
    })
    .filter(Boolean);

  return [
    GENERATED_HEADER,
    "",
    "# Intune-baseline — overzicht",
    "",
    `${templates.length} policies over ${platforms.filter((p) => perPlatform(p).length > 0).length} platformen, met`,
    "[OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) als bron.",
    "Dit is de samenvatting; de details staan in de [hoofd-README](README.md) en per map.",
    "",
    "| | Aantal |",
    "|---|---:|",
    `| Policies | ${templates.length} |`,
    `| Baseline-checks | ${checks + 6} |`,
    `| Zonder toewijzing (bewust) | ${unassigned.length} |`,
    `| Uitgerold in de tenant | 0 |`,
    "",
    "## Wat er in zit",
    "",
    `| Platform | ${types.map((t) => TYPE_LABEL[t]).join(" | ")} | Totaal |`,
    `|---|${types.map(() => "---:").join("|")}|---:|`,
    ...matrix,
    "",
    "Per platform staat er een tabel met **elke policy, wat hij doet en waar hij landt**:",
    ...platforms.filter((p) => perPlatform(p).length > 0).map((p) => `- [${PLATFORMS[p].label}](IntuneTemplate/${p}/README.md) — ${plural(perPlatform(p).length, "policy", "policies")}`),
    "",
    "## Eén bron, drie afgeleiden",
    "",
    "```mermaid",
    "flowchart LR",
    '  OIB["OpenIntuneBaseline"] -->|import-oib.js| T',
    '  T["<b>IntuneTemplate/</b><br/>de bron"]',
    '  T -->|generate-baseline.js| BL["baseline/intune/<br/>baseline-v1.0.json"]',
    '  T -->|export-intunebackup.js| EX["export/NativeImport/<br/>IntuneBackupAndRestore/"]',
    "  T -.->|leest rechtstreeks| CIPP[CIPP]",
    '  BL --> PLAT["TEST Policies Platform"]',
    '  EX -->|Start-IntuneRestoreConfig| TENANT[("Intune-tenant")]',
    "  CIPP --> TENANT",
    "  PLAT -.->|toetst| TENANT",
    "  style T stroke-width:3px",
    "```",
    "",
    "Wijzigen doe je in `IntuneTemplate/`. De rest wordt gegenereerd en door CI opnieuw gebouwd.",
    "",
    "## Wat er in augustus 2026 veranderde",
    "",
    "Van 24 eigen policies naar de huidige set.",
    "",
    "| | Aantal | |",
    "|---|---:|---|",
    "| Herschreven op OIB-inhoud | 15 | checkId behouden; Edge Security ging van 2 naar 54 instellingen, Defender Antivirus van 11 naar 28, Audit van 23 naar 40 |",
    "| Nieuw | 75 | o.a. Windows Hello for Business, Credential Guard, Local Administrators, Office Security, 7 compliance-policies, 20 macOS-policies, 2 BYOD-MAM |",
    "| Opgegaan in een andere policy | 6 | Administrative Templates (300 instellingen) uit elkaar getrokken; Network Security, System Services, Windows Search en OneDrive KFM opgeslokt |",
    "| Ongewijzigd meegegaan | 5 | waar OIB geen tegenhanger voor heeft: EDR-onboarding, Outlook-autoconfiguratie, Edge-zoekmachine, update-ring 3, user experience |",
    "",
    "Vijf checkId's zijn daarmee opgeheven (008, 017, 023, 025, 028) en worden niet opnieuw",
    "uitgedeeld. Instellingen die alleen wij hadden — versleuteling van vaste en verwisselbare",
    "schijven bijvoorbeeld — zijn bij een herschrijving behouden in plaats van stilzwijgend",
    "weggevallen.",
    "",
    "## Wat de vergelijking met IntuneAdmin opleverde",
    "",
    "Eind augustus 2026 is de set naast [IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines)",
    "gelegd — 874 profielen, vergeleken op settingDefinitionId en waarde. 654 instellingen komen in",
    "beide sets voor, waarvan 55 met een andere waarde. Dat leverde vier nieuwe policies en drie",
    "aanpassingen op:",
    "",
    "| | |",
    "|---|---|",
    "| `WIN - D - Windows AI` | Recall en Click To Do uit. OIB v3.8 kent nog geen Windows AI-policy en wij dus ook niet. |",
    "| `WIN - D - Removable Storage` | schrijven naar USB-opslag en WPD-apparaten geblokkeerd; verwisselbare media was nergens beperkt. |",
    "| `WIN - U - Windows Hello for Business` | WHfB per gebruiker naast de bestaande per-apparaatpolicy. |",
    "| `WIN - D - Windows Hello for Business Multi User` | WHfB voor gedeelde apparaten, zonder inrichting direct na het aanmelden. |",
    "| `WIN - D - Windows Firewall` | *local policy merge* stond alleen op het openbare profiel; nu ook op domein en privé. |",
    "| `WIN - D - Login and Lock Screen` | het wachtwoord-onthulknopje gaat uit — de enige harde CIS-L1-afwijking zonder functionele reden. |",
    "| `WIN - D - Defender Antivirus` | lage en gemiddelde dreigingen naar quarantaine in plaats van block en remove: een fout-positief is dan terug te draaien. |",
    "",
    "Daarnaast verloren de drie CIPP-standaardtemplates voor Defender hun toewijzing. Ze zetten",
    "dezelfde instellingen als hun OIB-tegenhanger op een andere waarde — 19 conflicten in totaal,",
    "waarvan 16 ASR-regels. Bij een conflict past Intune de instelling door géén van beide policies",
    "toe, dus die 16 regels stonden feitelijk uit.",
    "",
    "Wat bewust anders blijft dan CIS en IntuneAdmin: telemetrie op *Optioneel* (Endpoint Analytics",
    "en Windows Update-rapportage leunen erop) en locatie aan (Apparaat zoeken, tijdzone). Beide",
    "staan met reden in het `doel`-veld van hun policy.",
    "",
    "## Wat de macOS-herziening opleverde",
    "",
    "Eind augustus 2026 is de macOS-set als geheel nagelopen. Dat leverde twee nieuwe policies",
    "en drie correcties op:",
    "",
    "| | |",
    "|---|---|",
    "| `MAC - D - Enrollment Profile Administrator / Standard User Affinity` | twee ADE-inschrijfprofielen die in precies één instelling verschillen: wordt het aangemelde account beheerder of standaardgebruiker. Alternatieven van elkaar, dus geen van beide toegewezen. |",
    "| `MAC - D - Software Updates` | van de klassieke `com.apple.softwareupdate`-payload naar declaratief updatebeleid (DDM, macOS 14+): uitstel van 7 dagen voor kleine, 14 voor grote en 21 voor systeemupdates, Rapid Security Responses aan inclusief terugdraaien. checkId 047 blijft. |",
    "| `MAC - D - Defender for Endpoint` | de organisatienaam van het inhoudsfilter stond op *JAMF Software* — een restant uit de Jamf-profielen waar de MDE-documentatie op leunt. Die naam ziet de gebruiker in Systeeminstellingen → Netwerk → Filters. |",
    "| `MAC - U - Compliance Device Health` en `Device Security` | droegen elkaars omschrijving. Device Health toetst System Integrity Protection; Device Security toetst de versleuteling, de firewall en Gatekeeper. |",
    "",
    "Één gat is bewust niet gedicht: `MAC - U - Compliance Password` eist een wachtwoord van",
    "minimaal acht tekens met vergrendeling na vijftien minuten, maar er is geen configuratiepolicy",
    "die dat op de Mac instelt. Een Mac zonder schermvergrendeling wordt dus wel als niet-compliant",
    "gemeld en krijgt de instelling niet opgelegd — dat vraagt een eigen passcode-policy.",
    "",
    "## Wat er nog moet gebeuren",
    "",
    "De repo is klaar en de controles staan groen. De tenant is niet aangeraakt: de policies",
    "staan daar nog onder hun oude naam. De volgorde is een afhankelijkheid, geen suggestie —",
    "stap 4 vóór stap 3 levert twee policies op die elkaar tegenspreken.",
    "",
    "| # | Stap | |",
    "|---:|---|---|",
    "| 1 | Inventariseren | `Get-BaselinePolicyState.ps1` — moet nog gebouwd worden |",
    "| 2 | Hernoemen | `Rename-BaselinePolicy.ps1 -WhatIf` eerst; PATCH, dus id en assignments blijven |",
    "| 3 | Vervangen | Windows Firewall en Office Updates wisselen van policytype — handwerk |",
    "| 4 | Opheffen | Network Security, Windows Search, System Services, OneDrive KFM verwijderen |",
    "| 5 | Uitrollen | de nieuwe policies via CIPP of `Start-IntuneRestoreConfig` |",
    "| 6 | Toewijzen | `Set-BaselineAssignment.ps1 -Scope D -AllDevices` en `-Scope U -AllUsers` |",
    "| 7 | Opnieuw inventariseren | de lijst met wees-policies moet leeg zijn |",
    "",
    "> **De baseline-check is hier geen vangnet.** De checks vergelijken op inhoud, niet op naam.",
    "> Een achtergebleven policy onder de óude naam houdt zijn check dus groen, ook als de nieuwe",
    "> nooit is aangemaakt of nergens is toegewezen.",
    "",
    "## Eerst in een pilot",
    "",
    "| Policy | Waarom |",
    "|---|---|",
    "| `WIN - D - Disable NTLM` | breekt oude on-prem toepassingen en apparaten die geen Kerberos spreken |",
    "| `WIN - D - Device Guard and Credential Guard` | vraagt een herstart en kan oude stuurprogramma's blokkeren |",
    "| `WIN - D - Administrator Protection` | Windows 11 24H2+; verandert het UAC-gedrag van beheerders |",
    "| `WIN - D - In-Box App Removal` | verwijdert ingebouwde apps; controleer of niemand ze gebruikt |",
    "| `WIN - D - Windows Hello for Business` | vereist een TPM en een PIN van minimaal zes tekens |",
    "| `WIN - D - Script File Associations` | .js, .vbs en .hta openen voortaan in Kladblok |",
    "| `WIN - D - Removable Storage` | schrijven naar USB-opslag en naar telefoons en camera's wordt geblokkeerd |",
    "| `MAC - D - FileVault` | versleutelt de schijf; regel eerst de escrow van de herstelsleutel |",
    "| `MAC - D - Software Updates` | declaratief updatebeleid vraagt macOS 14 of hoger; oudere Macs krijgen het profiel niet |",
    "| `MAC - D - Enrollment Profile Administrator / Standard User Affinity` | vergrendelde inschrijving is na de inschrijving alleen met een wipe terug te draaien |",
    "",
    `Daarnaast staan ${unassigned.length} policies bewust zonder toewijzing. Stuk voor stuk een *alternatief*`,
    "voor een policy die wél is toegewezen, niet een aanvulling erop: de update-ringen 1 en 2 voor",
    "Windows en Defender zetten dezelfde instellingen als ring 3 met andere waarden, de drie",
    "CIPP-standaardtemplates voor Defender doen hetzelfde als hun OIB-tegenhanger, de WHfB-variant",
    "voor gedeelde apparaten hoort op een groep met gedeelde apparaten, en de twee macOS-inschrijf-",
    "profielen verschillen in precies één instelling. Allemaal op All Devices zou",
    "een conflict opleveren, waarna Intune de betwiste instelling door géén van beide policies",
    "toepast; die horen op een eigen groep.",
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
  const files = [
    { file: path.join(REPO_ROOT, "OVERZICHT.md"), content: overviewDocument(templates, ctx) },
    { file: path.join(TEMPLATE_DIR, "README.md"), content: overviewReadme(templates, ctx) },
  ];

  for (const platform of Object.keys(PLATFORMS)) {
    const list = templates.filter((t) => parseBaseName(t.baseName).platform === platform);
    if (list.length === 0) continue;
    files.push({ file: path.join(TEMPLATE_DIR, platform, "README.md"), content: platformReadme(platform, list, ctx) });
  }

  // Eén document per policy, naast de JSON.
  for (const template of templates) {
    files.push({ file: template.filePath.replace(/\.json$/, ".md"), content: policyDocument(template, ctx) });
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
