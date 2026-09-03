/**
 * Gedeelde kennis over IntuneTemplate/: hoe de map is ingedeeld, hoe je 'm uitleest en waar
 * een nieuw template hoort. Vier scripts lazen die map eerder elk op hun eigen manier uit
 * (`readdirSync` + `startsWith("Baseline_")`); met een mappenstructuur zou die aanname op
 * vier plekken stilzwijgend het verkeerde antwoord geven — vandaar één bron.
 *
 * Indeling: IntuneTemplate/<PLATFORM>/<CATEGORIE>/Baseline_<PLATFORM>_<SCOPE>_<Item>.json
 *
 * De map is afleidbaar uit de bestandsnaam (platform) en het CIPP-`Type` (categorie), dus
 * hij draagt geen informatie die niet ook in het bestand staat. Dat is bewust: de map is er
 * om in te bladeren en om per platform te kunnen filteren, niet als tweede waarheid die uit
 * de pas kan lopen. `check-scope.js` controleert daarom dat elk bestand op zijn plek staat.
 */

const fs = require("fs");
const path = require("path");

const PLATFORMS = {
  WIN: { label: "Windows", expectedPlatforms: ["windows10", "windows10X"] },
  MAC: { label: "macOS", expectedPlatforms: ["macOS"] },
  IOS: { label: "iOS/iPadOS", expectedPlatforms: ["iOS"] },
  AND: { label: "Android", expectedPlatforms: ["android"] },
};

/** CIPP-`Type` -> submap. Zelfde volgorde als de Graph-endpoints die erbij horen. */
const TYPE_TO_CATEGORY = {
  Catalog: "SettingsCatalog",
  Admin: "AdministrativeTemplates",
  Device: "DeviceConfigurations",
  deviceCompliancePolicies: "CompliancePolicies",
  AppProtection: "AppProtection",
};

/**
 * Eén set, één indeling: IntuneTemplate/Baseline_<PLATFORM>_<SCOPE>_<Item>.json.
 *
 * Er stonden tot september 2026 drie sets naast elkaar — de baseline, ISMSTemplate/ en
 * BASELINE2/, elk met een eigen prefix en een eigen wachtkamer. Dat leverde vooral de vraag
 * op in welke map iets hoorde, en drie overzichten die je bij elkaar moest optellen om te
 * weten wat er in totaal in zit. Ze zijn samengevoegd tot deze ene set.
 *
 * Wat de wachtkamer deed, doet nu het veld `fase` in _manifest.json: fase 1 gaat op alle
 * apparaten, fase 2 eerst op een pilotgroep, fase 3 wacht op een voorwaarde, fase 4 hoort op
 * een eigen groep, fase 5 wordt niet uitgerold. _assignments.json volgt daaruit en
 * check-scope.js bewaakt dat die twee niet uit elkaar lopen. Zo staat alles in één map zonder
 * dat er iets wordt uitgerold dat er nog niet klaar voor is.
 *
 * SET_PREFIXES blijft een map en geen constante: de exporter en de docs lopen erover heen, en
 * een tweede set toevoegen moet één regel blijven in plaats van een refactor.
 */
const SET_PREFIXES = { Baseline: "IntuneTemplate" };
const BASE_NAME_RE = /^(Baseline)_(WIN|MAC|IOS|AND)_([DU])_(.+)$/;

/** "Baseline_WIN_D_BitLocker" -> { set: "Baseline", platform: "WIN", scope: "D", item: "BitLocker" } */
function parseBaseName(baseName) {
  const m = baseName.match(BASE_NAME_RE);
  if (!m) return null;
  return { set: m[1], platform: m[2], scope: m[3], item: m[4] };
}

/** Relatief pad binnen IntuneTemplate/ waar dit template hoort. */
function relativePathFor(baseName, type) {
  const parsed = parseBaseName(baseName);
  const category = TYPE_TO_CATEGORY[type];
  if (!parsed || !category) return null;
  return path.join(parsed.platform, category, baseName + ".json");
}

/** Alle Baseline_*.json onder een map, ongeacht diepte, gesorteerd op bestandsnaam. */
function listTemplateFiles(templateDir) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (BASE_NAME_RE.test(path.basename(entry.name, ".json")) && entry.name.endsWith(".json")) out.push(full);
    }
  };
  walk(templateDir);
  return out.sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}

/**
 * Leest één template uit. De CIPP-vorm is een Table Storage-rij met een genestelde
 * JSON-string in `.JSON`, en dáárin nog eens de policy zelf als string in `.RAWJson`.
 */
function readTemplate(filePath) {
  const outer = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const inner = JSON.parse(outer.JSON);
  return {
    filePath,
    baseName: path.basename(filePath, ".json"),
    outer,
    inner,
    type: inner.Type,
    displayName: inner.Displayname,
    raw: JSON.parse(inner.RAWJson),
  };
}

/** Alle templates, ingelezen. */
function readTemplates(templateDir) {
  return listTemplateFiles(templateDir).map(readTemplate);
}

/** Verzamelt elke settingDefinitionId in een willekeurige boom. */
function collectSettingIds(node, acc = new Set()) {
  if (!node || typeof node !== "object") return acc;
  if (Array.isArray(node)) {
    for (const child of node) collectSettingIds(child, acc);
    return acc;
  }
  if (typeof node.settingDefinitionId === "string") acc.add(node.settingDefinitionId);
  for (const key of Object.keys(node)) collectSettingIds(node[key], acc);
  return acc;
}

/**
 * Klapt één settingInstance-boom uit naar platte {settingDefinitionId, expectedValue}-paren.
 * Vijf instance-vormen komen voor in de templates: Choice (met optionele children), Simple
 * (scalaire waarde), GroupSettingCollection (herhaalde child-groepen, bv. losse ASR-regels
 * of een macOS-payload), SimpleSettingCollection (lijst van platte waarden, bv. User
 * Rights-SID's) en ChoiceSettingCollection.
 *
 * Een GroupSettingCollection levert zelf géén paar op: die id is een container (de payload,
 * de policy-groep), geen instelling met een waarde. Dat onderscheid is belangrijk voor de
 * conflictcontrole — twee policies die dezelfde container gebruiken maar andere kinderen
 * zetten, botsen niet.
 *
 * Secret-waarden (bv. het EDR-onboarding-token) worden overgeslagen: die zijn per-tenant en
 * horen niet als vaste verwachte waarde in een gedeelde baseline.
 */
function flattenInstance(instance, out, warnings) {
  if (!instance || typeof instance !== "object") return;
  const odataType = instance["@odata.type"] || "";
  const settingDefinitionId = instance.settingDefinitionId;

  if (odataType.endsWith("ChoiceSettingInstance")) {
    const csv = instance.choiceSettingValue || {};
    out.push({ settingDefinitionId, expectedValue: csv.value });
    for (const child of csv.children || []) flattenInstance(child, out, warnings);
  } else if (odataType.endsWith("ChoiceSettingCollectionInstance")) {
    const values = instance.choiceSettingCollectionValue || [];
    out.push({ settingDefinitionId, expectedValue: values.map((v) => v.value) });
    for (const v of values) for (const child of v.children || []) flattenInstance(child, out, warnings);
  } else if (odataType.endsWith("SimpleSettingInstance")) {
    const ssv = instance.simpleSettingValue || {};
    if (ssv["@odata.type"] === "#microsoft.graph.deviceManagementConfigurationSecretSettingValue") {
      warnings.push(`Secret-waarde overgeslagen voor ${settingDefinitionId} (per-tenant, hoort niet in een gedeelde baseline)`);
      return;
    }
    out.push({ settingDefinitionId, expectedValue: ssv.value });
  } else if (odataType.endsWith("SimpleSettingCollectionInstance")) {
    const values = (instance.simpleSettingCollectionValue || []).map((v) => v.value);
    out.push({ settingDefinitionId, expectedValue: values });
  } else if (odataType.endsWith("GroupSettingCollectionInstance")) {
    for (const group of instance.groupSettingCollectionValue || []) {
      for (const child of group.children || []) flattenInstance(child, out, warnings);
    }
  } else {
    warnings.push(`Onbekend settingInstance-type overgeslagen: "${odataType}" (${settingDefinitionId})`);
  }
}

/**
 * Apple's PPPC-payload kent twee sleutels voor hetzelfde besluit: `Allowed` (macOS 10.14) en
 * `Authorization` (macOS 11+, met Allow / Deny / AllowStandardUserToSetSystemService). Ze
 * mogen niet samen in één regel staan. Doen ze dat wel, dan weigert macOS de hele
 * TCC-payload en meldt Intune **10022** op élk veld van die regel: de app krijgt dan geen
 * enkel recht, ook niet het recht dat wél goed stond.
 *
 * OpenIntuneBaseline levert ze allebei aan (issue #62, nog open), dus dit wordt bij elke
 * import opnieuw weggehaald in plaats van eenmalig in de templates gerepareerd.
 * `Allowed` is de verouderde van de twee en gaat eruit.
 *
 * Geeft het aantal verwijderde instellingen terug; muteert `node` niet.
 */
const TCC_ALLOWED_RE = /^com\.apple\.tcc\.configuration-profile-policy_services_[a-z]+_item_allowed$/;

function stripDeprecatedTccAllowed(node) {
  let removed = 0;
  const walk = (n) => {
    if (Array.isArray(n)) return n.map(walk);
    if (!n || typeof n !== "object") return n;
    const out = {};
    for (const [key, value] of Object.entries(n)) {
      if (key === "children" && Array.isArray(value)) {
        const kept = value.filter((c) => {
          const drop = c && TCC_ALLOWED_RE.test(c.settingDefinitionId || "");
          if (drop) removed++;
          return !drop;
        });
        out[key] = kept.map(walk);
      } else {
        out[key] = walk(value);
      }
    }
    return out;
  };
  return { node: walk(node), removed };
}

/** flattenInstance over een hele settings-array. */
function flattenSettings(settings) {
  const out = [];
  const warnings = [];
  for (const s of settings || []) flattenInstance(s.settingInstance, out, warnings);
  return { settings: out, warnings };
}

module.exports = { PLATFORMS, SET_PREFIXES, BASE_NAME_RE, TYPE_TO_CATEGORY, parseBaseName, relativePathFor, listTemplateFiles, readTemplate, readTemplates, collectSettingIds, flattenInstance, flattenSettings, stripDeprecatedTccAllowed };
