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

/**
 * De CIPP-`Package` per policy: welke policies in CIPP als één pakket uitrollen.
 *
 * CIPP's baselines kennen sinds september 2026 de standard `IntuneTemplatePackage` ("Intune
 * Template Package"): die rolt in één keer élk template uit dat dezelfde `Package`-waarde
 * draagt, en bepaalt dat lidmaatschap bij iedere run opnieuw. Een nieuwe policy met die
 * `Package` schuift dus vanzelf de baseline in, zonder dat er in CIPP iets aangeklikt hoeft
 * te worden — precies het model van deze repo.
 *
 * De prijs ervan is dat de deploy-opties uit die ene standard letterlijk op élk lid worden
 * gekopieerd: één package is één toewijzingsdoel. Met `Package: "Baseline"` op alle 141
 * templates kun je dus alleen kiezen tussen "alles op alle apparaten" — waarmee de 28
 * gebruikerspolicies het verkeerde doel krijgen en fase 2 t/m 5 ongetest live gaan — of
 * "niets toewijzen". Vandaar één package per toewijzingsdoel, afgeleid uit `fase` en
 * `faseGroep` in _manifest.json en het doel in _assignments.json, zodat er geen tweede
 * waarheid ontstaat naast die twee bestanden.
 *
 * Fase 5 krijgt met opzet een lege `Package`: CIPP's pakkettenlijst filtert op een gevulde
 * waarde (`Where-Object { $_.Package }`), dus die policies verschijnen in geen enkel pakket.
 * Los kiezen kan nog steeds — dat is de bedoeling, ze bestaan als alternatief.
 */
const PACKAGE_PREFIX = "Baseline-";

/** Toewijzingsdoel in _assignments.json -> package. Alleen fase 1 komt hier langs. */
const PACKAGE_BY_TARGET = {
  allDevicesAssignmentTarget: PACKAGE_PREFIX + "Devices",
  allLicensedUsersAssignmentTarget: PACKAGE_PREFIX + "Users",
};

/** Fase -> package, voor de fases waar het doel niet uit _assignments.json volgt. */
const PACKAGE_BY_FASE = {
  2: PACKAGE_PREFIX + "Pilot",
  3: PACKAGE_PREFIX + "Wacht",
  5: "",
};

/**
 * Een macOS-inschrijfprofiel wordt aan een ADE-token gekoppeld en niet aan een Entra-groep.
 * De package bestaat wel — de profielen moeten in de tenant staan — maar krijgt in CIPP
 * "Do not assign"; het koppelen gebeurt in Intune bij het token zelf.
 */
const PACKAGE_WITHOUT_GROUP = new Set([PACKAGE_PREFIX + "ADE-token"]);

/** "SEC-Update-Ring1" uit een `faseGroep` die er nog een toelichting achter heeft staan. */
function groupOfFaseGroep(faseGroep) {
  return String(faseGroep || "").split(" (")[0].trim();
}

/** De @odata.type-suffixen waarop een policy in _assignments.json landt, ontdubbeld. */
function assignmentTargets(assignment) {
  return [...new Set((assignment || []).map((a) => ((a.target || {})["@odata.type"] || "").replace("#microsoft.graph.", "")))];
}

/**
 * De `Package` die bij deze policy hoort, of `null` als die niet af te leiden is — dan klopt
 * er iets niet aan het manifest of aan _assignments.json en hoort check-scope.js dat te
 * melden in plaats van hier een gok te doen.
 */
function packageFor(entry, assignment) {
  if (!entry || entry.fase === undefined) return null;
  if (entry.fase === 1) {
    const targets = assignmentTargets(assignment);
    if (targets.length !== 1) return null;
    return PACKAGE_BY_TARGET[targets[0]] ?? null;
  }
  if (entry.fase === 4) {
    const group = groupOfFaseGroep(entry.faseGroep);
    return group ? PACKAGE_PREFIX + group : null;
  }
  return PACKAGE_BY_FASE[entry.fase] ?? null;
}

/** Wat je in CIPP bij deze package invult onder "Who should this template be assigned to?". */
function assignmentForPackage(pkg) {
  if (!pkg) return "wordt niet uitgerold";
  if (pkg === PACKAGE_PREFIX + "Devices") return "Assign to all devices";
  if (pkg === PACKAGE_PREFIX + "Users") return "Assign to all users";
  if (pkg === PACKAGE_PREFIX + "Wacht") return "Do not assign";
  if (pkg === PACKAGE_PREFIX + "Pilot") return "Custom group: SEC-Baseline-Pilot";
  if (PACKAGE_WITHOUT_GROUP.has(pkg)) return "Do not assign (koppelen aan een ADE-token in Intune)";
  return `Custom group: ${pkg.slice(PACKAGE_PREFIX.length)}`;
}

/**
 * De hele indeling in één keer: package -> { toewijzing, leden }. Voor de docs en voor wie in
 * CIPP een baseline samenstelt; de volgorde ligt vast in `rank` hieronder, zodat een tabel niet bij
 * elke run van volgorde wisselt.
 */
function packagePlan(manifest, assignments) {
  const plan = new Map();
  for (const entry of manifest.policies || []) {
    const pkg = packageFor(entry, assignments[entry.displayName]);
    if (pkg === null) continue;
    if (!plan.has(pkg)) plan.set(pkg, { pakket: pkg, toewijzing: assignmentForPackage(pkg), leden: [] });
    plan.get(pkg).leden.push(entry);
  }
  const rank = (pkg) => {
    const order = [PACKAGE_PREFIX + "Devices", PACKAGE_PREFIX + "Users", PACKAGE_PREFIX + "Pilot", PACKAGE_PREFIX + "Wacht"];
    const i = order.indexOf(pkg);
    if (i >= 0) return i;
    return pkg === "" ? order.length + 1 : order.length;
  };
  return [...plan.values()].sort((a, b) => rank(a.pakket) - rank(b.pakket) || a.pakket.localeCompare(b.pakket));
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

/**
 * De vijf velden waarmee een policy een OS-ondergrens zet, en hoe je ziet of er écht een
 * waarde in staat. Hier en niet in de scripts, om dezelfde reden als de rest van dit bestand:
 * `check-osversion.js` rapporteert erover en `check-scope.js` bewaakt dat er een reden bij
 * staat, en die twee mogen niet elk een eigen idee hebben van wat "gezet" betekent.
 *
 * Twee vormen van "niet gezet" die naast `null` voorkomen: de lege string, en `"0000-00-00"` —
 * de placeholder waarmee app protection een niet-ingevulde patchdatum aangeeft. Die laatste
 * ziet er in een export uit als een waarde en is het niet.
 *
 * `minimumRequired*` blokkeert de app, `minimumWarning*` laat de gebruiker door met een
 * melding. Dat onderscheid staat niet in dit bestand maar het is de reden dat beide erin
 * staan: een baseline die alleen de required-velden nakijkt mist precies de zachte variant
 * waarmee je zo'n ondergrens hoort te beginnen.
 */
const VERSION_FIELDS = [
  "osMinimumVersion",
  "minimumRequiredOsVersion",
  "minimumWarningOsVersion",
  "minimumRequiredPatchVersion",
  "minimumWarningPatchVersion",
];

/** Android-beveiligingspatchdatums (yyyy-MM-dd), geen OS-versies — die tellen anders. */
const PATCH_FIELDS = new Set(["minimumRequiredPatchVersion", "minimumWarningPatchVersion"]);

const UNSET_VERSIONS = new Set([null, undefined, "", "0000-00-00"]);

function isVersionSet(value) {
  return !UNSET_VERSIONS.has(value);
}

/** De gezette ondergrenzen van één policy, in de volgorde van VERSION_FIELDS. */
function versionFloors(raw) {
  return VERSION_FIELDS.filter((veld) => veld in (raw || {}) && isVersionSet(raw[veld])).map((veld) => ({ veld, waarde: String(raw[veld]) }));
}

module.exports = { PLATFORMS, PACKAGE_PREFIX, packageFor, assignmentForPackage, assignmentTargets, packagePlan, SET_PREFIXES, BASE_NAME_RE, TYPE_TO_CATEGORY, VERSION_FIELDS, PATCH_FIELDS, parseBaseName, relativePathFor, listTemplateFiles, readTemplate, readTemplates, collectSettingIds, flattenInstance, flattenSettings, stripDeprecatedTccAllowed, isVersionSet, versionFloors };
