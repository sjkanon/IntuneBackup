#!/usr/bin/env node
/**
 * Converts policies from OpenIntuneBaseline (SkipToTheEndpoint/OpenIntuneBaseline) into
 * IntuneTemplate/Baseline_*.json in CIPP template format, driven by
 * IntuneTemplate/_manifest.json.
 *
 * Why an importer and not manual work: OIB releases a new version a few times a year.
 * Manually retyped settingDefinitionIds cannot be reviewed and cannot be refreshed; a
 * manifest + importer turns "pull in OIB v3.9" into a repeatable run with a readable diff.
 *
 * Usage:
 *   git clone --depth 1 https://github.com/SkipToTheEndpoint/OpenIntuneBaseline .oib-source
 *   node scripts/import-oib.js                 # writes IntuneTemplate/
 *   node scripts/import-oib.js --dry-run       # only shows what would change
 *   node scripts/import-oib.js --source <path> # different location of the OIB checkout
 *
 * Windows tip: OIB has file names that exceed MAX_PATH. Clone with
 * `git -c core.longpaths=true clone ...` or put the checkout close to the drive root.
 *
 * Three things this importer does deliberately:
 *
 * 1. **GUIDs are preserved.** The RowKey/GUID of a CIPP template identifies the row in Table
 *    Storage. An existing template that is rewritten keeps its GUID, otherwise CIPP gets a
 *    second template with the same name on the next sync.
 *
 * 2. **Our own settings that OIB does not know stay in place** (`carryFrom`). Our BitLocker
 *    policy also covers fixed and removable drives, OIB only the OS drive; blindly
 *    overwriting would silently turn that off. The rule is: a top-level setting from the old
 *    template stays, unless that settingDefinitionId occurs *anywhere* in the imported OIB
 *    set — then OIB takes precedence and keeping it would produce a duplicate (and therefore
 *    conflicting) setting.
 *
 * 3. **Idempotent.** On a second run the target file itself is the `carryFrom` source: it
 *    contains the OIB settings plus the carried-over extras, and those extras are by
 *    definition exactly the settings that are not in the OIB set. Same input -> same output.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { relativePathFor, listTemplateFiles, readTemplate, collectSettingIds, stripDeprecatedTccAllowed, packageFor, composeDescription: composeTenantDescription } = require("./lib/templates");
const { Translator } = require("./lib/i18n");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const DEFAULT_SOURCE = path.join(REPO_ROOT, ".oib-source");

/** OIB levert een deel van zijn export als UTF-16LE aan; de rest is UTF-8, soms met BOM. */
function readJsonFile(filePath) {
  const buf = fs.readFileSync(filePath);
  let text;
  if (buf[0] === 0xff && buf[1] === 0xfe) text = buf.toString("utf16le");
  else text = buf.toString("utf8");
  return JSON.parse(text.replace(/^﻿/, ""));
}

/**
 * Graph geeft bij een GET annotaties terug die je bij een POST niet mag meesturen:
 * `platforms@odata.type`, `@odata.context`, `@odata.id`, `@odata.editLink`, en action-links
 * als `#microsoft.graph.assign`. De kale `@odata.type` is géén annotatie maar de
 * type-discriminator (welk soort compliance-policy, welk soort settingInstance) en moet
 * blijven — zonder die sleutel weigert Graph het hele object.
 */
function stripODataAnnotations(node) {
  if (Array.isArray(node)) return node.map(stripODataAnnotations);
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("#")) continue;
    if (key.includes("@odata.") && key !== "@odata.type") continue;
    // Alleen-lezen exportveld van nieuwere IntuneManagement-exports; hoort niet in een POST
    // en zou elke import een diff geven op templates die het veld niet hebben.
    if (key === "auditRuleInformation") continue;
    out[key] = stripODataAnnotations(value);
  }
  return out;
}

function omit(obj, keys) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (!keys.includes(k)) out[k] = v;
  return out;
}

function scopeOfSettingId(id) {
  return id.startsWith("user_") ? "U" : "D";
}

/**
 * Deterministische GUID voor een nieuw template: dezelfde naam levert altijd dezelfde GUID
 * op, zodat een herhaalde import geen eindeloze diff geeft. Vorm van een UUIDv5 (SHA-1),
 * wat CIPP en Table Storage prima accepteren als RowKey.
 */
function stableGuid(name) {
  const h = crypto.createHash("sha1").update(`oib:${name}`).digest("hex");
  const v = (parseInt(h[16], 16) & 0x3) | 0x8;
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-${v.toString(16)}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/** De omschrijving in de tenant — Engels, uit lib/templates.js, dezelfde als set-packages.js schrijft. */
function composeDescription(entry, assignments) {
  return composeTenantDescription(entry, assignments[entry.displayName], new Translator("en"));
}

/**
 * Zoekt een bestaand template op bestandsnaam, waar het ook staat. Op naam en niet op pad,
 * omdat een template van map wisselt zodra zijn Type verandert — de ADMX-variant van Office
 * Updates staat in AdministrativeTemplates/, de Settings Catalog-opvolger in SettingsCatalog/.
 * Zoeken op het nieuwe pad zou 'm dan niet vinden en een tweede GUID uitdelen.
 */
function findOurTemplate(baseName) {
  const hit = listTemplateFiles(TEMPLATE_DIR).find((f) => path.basename(f, ".json") === baseName);
  return hit ? readTemplate(hit) : null;
}

/**
 * CIPP-template: Table Storage-rij met een genestelde JSON-string, zie README.
 *
 * `Package` bepaalt in welk CIPP-pakket de policy uitrolt en volgt daarom uit dezelfde twee
 * bestanden als de omschrijving: de fase in _manifest.json en het doel in _assignments.json.
 * Zie `packageFor` in lib/templates.js; set-packages.js doet hetzelfde voor de policies die
 * hier niet langskomen.
 */
function buildTemplateFile({ guid, displayName, description, type, body, pkg }) {
  const inner = {
    Displayname: displayName,
    Description: description,
    RAWJson: JSON.stringify(body),
    Type: type,
    GUID: guid,
    ReusableSettings: [],
  };
  // Met afsluitende newline, zoals set-packages.js schrijft — anders verschilt elk bestand
  // één byte en is geen enkele run idempotent.
  return (
    JSON.stringify({
      PartitionKey: "IntuneTemplate",
      RowKey: guid,
      GUID: guid,
      JSON: JSON.stringify(inner),
      Package: pkg,
    }) + "\n"
  );
}

/** Settings-array normaliseren naar {id, settingInstance} met oplopende id's. */
function renumberSettings(settings) {
  return settings.map((s, i) => ({ id: String(i), settingInstance: s.settingInstance }));
}

/** Wat stripDeprecatedTccAllowed() tijdens deze run heeft weggehaald, voor het eindverslag. */
const tccFixes = [];

function bodyForCatalog(source, entry, displayName, description) {
  const cleaned = stripODataAnnotations(source);
  let settings = (cleaned.settings || []).map((s) => ({ settingInstance: s.settingInstance }));

  if (entry.dropSettings && entry.dropSettings.length > 0) {
    settings = settings.filter((s) => !entry.dropSettings.includes(s.settingInstance.settingDefinitionId));
  }
  if (entry.splitScope) {
    settings = settings.filter((s) => scopeOfSettingId(s.settingInstance.settingDefinitionId) === entry.splitScope);
  }

  // OIB levert in zijn PPPC-payloads zowel `Allowed` als `Authorization`; die combinatie
  // laat macOS het profiel weigeren (Intune meldt dan 10022 op elk veld van die regel).
  const tcc = stripDeprecatedTccAllowed(settings);
  if (tcc.removed > 0) tccFixes.push(`${entry.target}: ${tcc.removed}x verouderde PPPC-sleutel "Allowed" verwijderd (anders 10022)`);

  return {
    name: displayName,
    description,
    settings: renumberSettings(tcc.node),
    platforms: cleaned.platforms,
    technologies: cleaned.technologies,
    templateReference: cleaned.templateReference
      ? {
          templateId: cleaned.templateReference.templateId || "",
          templateFamily: cleaned.templateReference.templateFamily || "none",
          templateDisplayName: cleaned.templateReference.templateDisplayName ?? null,
          templateDisplayVersion: cleaned.templateReference.templateDisplayVersion ?? null,
        }
      : { templateId: "", templateFamily: "none", templateDisplayName: null, templateDisplayVersion: null },
  };
}

/** Zoekt één settingInstance op settingDefinitionId, op elke diepte. */
function findInstance(node, settingDefinitionId) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findInstance(child, settingDefinitionId);
      if (hit) return hit;
    }
    return null;
  }
  if (node.settingDefinitionId === settingDefinitionId) return node;
  for (const value of Object.values(node)) {
    const hit = findInstance(value, settingDefinitionId);
    if (hit) return hit;
  }
  return null;
}

/** De kinderlijst van een instelling, ongeacht of het een choice of een groep is. */
function childrenOf(instance) {
  if (instance.choiceSettingValue) return (instance.choiceSettingValue.children ??= []);
  const groups = instance.groupSettingCollectionValue;
  if (Array.isArray(groups) && groups.length > 0) return (groups[0].children ??= []);
  return null;
}

function newChildInstance(settingDefinitionId, value) {
  if (typeof value === "number") {
    return {
      "@odata.type": "#microsoft.graph.deviceManagementConfigurationSimpleSettingInstance",
      settingDefinitionId,
      settingInstanceTemplateReference: null,
      simpleSettingValue: {
        "@odata.type": "#microsoft.graph.deviceManagementConfigurationIntegerSettingValue",
        settingValueTemplateReference: null,
        value,
      },
    };
  }
  return {
    "@odata.type": "#microsoft.graph.deviceManagementConfigurationChoiceSettingInstance",
    settingDefinitionId,
    settingInstanceTemplateReference: null,
    choiceSettingValue: {
      "@odata.type": "#microsoft.graph.deviceManagementConfigurationChoiceSettingValue",
      settingValueTemplateReference: null,
      value,
      children: [],
    },
  };
}

/**
 * Bewuste afwijkingen van OpenIntuneBaseline, uit `overrides` in het manifest.
 *
 * Zonder deze stap draait de volgende import ze stilzwijgend terug: bodyForCatalog bouwt de
 * settings elke keer opnieuw uit de OIB-bron, en de carry-regel hierboven redt alleen
 * top-level instellingen die OIB niet kent — niet een ándere waarde op een instelling die
 * OIB wél zet, en niet een kind dat wij eronder hangen. Precies de twee vormen die uit de
 * vergelijking met IntuneAdmin/IntuneBaselines kwamen.
 *
 *   { settingDefinitionId, value }           andere waarde op een instelling die OIB al zet
 *                                            (bij een lijst: value is een array, vervangt de hele lijst)
 *   { parent, settingDefinitionId, value }   extra kind onder een instelling die OIB al zet
 *
 * Allebei falen hard als hun ankerpunt weg is. Een override die stil niets doet is het
 * gevaarlijkst van alles: het bestand blijft dan kloppen terwijl de reden verdwenen is.
 * `reason` is verplicht — een afwijking zonder opgeschreven waarom is over een half jaar
 * niet van een vergissing te onderscheiden.
 */
function applyOverrides(body, entry, applied) {
  for (const ov of entry.overrides || []) {
    const { settingDefinitionId, value, parent, reason } = ov;
    if (!reason) {
      console.error(`FOUT: override voor ${settingDefinitionId} in ${entry.target} heeft geen "reason".`);
      process.exit(1);
    }
    let instance = findInstance(body.settings, settingDefinitionId);

    if (!instance && parent) {
      const parentInstance = findInstance(body.settings, parent);
      if (!parentInstance) {
        console.error(`FOUT: override voor ${settingDefinitionId} in ${entry.target}: parent ${parent} staat niet (meer) in de OIB-bron.`);
        process.exit(1);
      }
      const children = childrenOf(parentInstance);
      if (!children) {
        console.error(`FOUT: override voor ${settingDefinitionId} in ${entry.target}: ${parent} heeft geen kinderlijst.`);
        process.exit(1);
      }
      children.push(newChildInstance(settingDefinitionId, value));
      applied.push(`${entry.target}: ${settingDefinitionId} toegevoegd onder ${parent} — ${reason}`);
      continue;
    }
    if (!instance) {
      console.error(`FOUT: override voor ${settingDefinitionId} in ${entry.target}: die instelling staat niet (meer) in de OIB-bron, en er is geen "parent" opgegeven om 'm onder te hangen.`);
      process.exit(1);
    }
    if (instance.choiceSettingValue) instance.choiceSettingValue.value = value;
    else if (instance.simpleSettingValue) instance.simpleSettingValue.value = value;
    else if (Array.isArray(instance.simpleSettingCollectionValue) && Array.isArray(value)) {
      // Lijst van strings (gebruikers, URL's): de hele lijst vervangen, met het type van het
      // eerste bronelement, zodat de vorm gelijk blijft aan wat OIB exporteert.
      const template = instance.simpleSettingCollectionValue[0] || {
        "@odata.type": "#microsoft.graph.deviceManagementConfigurationStringSettingValue",
        settingValueTemplateReference: null,
      };
      instance.simpleSettingCollectionValue = value.map((v) => ({ ...template, value: v }));
    } else {
      console.error(`FOUT: override voor ${settingDefinitionId} in ${entry.target}: geen choice- of simple-waarde om te overschrijven.`);
      process.exit(1);
    }
    applied.push(`${entry.target}: ${settingDefinitionId} -> ${value} — ${reason}`);
  }
}

/**
 * Compliance: `scheduledActionsForRule` is verplicht bij een POST — een compliance-policy
 * zonder actie doet niets bij non-compliance. De id's erin zijn tenant-specifiek en moeten
 * juist weg, anders weigert Graph ze bij het aanmaken.
 */
function bodyForCompliance(source, displayName, description) {
  const cleaned = stripODataAnnotations(source);
  const stripped = omit(cleaned, ["id", "createdDateTime", "lastModifiedDateTime", "version", "assignments", "deviceStatuses", "userStatuses", "deviceStatusOverview", "userStatusOverview", "deviceSettingStateSummaries"]);
  const rules = (cleaned.scheduledActionsForRule || []).map((rule) => ({
    ruleName: rule.ruleName ?? "PasswordRequired",
    scheduledActionConfigurations: (rule.scheduledActionConfigurations || []).map((cfg) => omit(cfg, ["id"])),
  }));
  return {
    ...stripped,
    displayName,
    description,
    roleScopeTagIds: cleaned.roleScopeTagIds || ["0"],
    scheduledActionsForRule: rules.length > 0 ? rules : [{ ruleName: "PasswordRequired", scheduledActionConfigurations: [{ actionType: "block", gracePeriodHours: 0, notificationTemplateId: "" }] }],
  };
}

function bodyForDevice(source, displayName, description) {
  const cleaned = stripODataAnnotations(source);
  return {
    ...omit(cleaned, ["id", "createdDateTime", "lastModifiedDateTime", "version", "assignments", "supportsScopeTags", "deviceManagementApplicabilityRuleOsEdition", "deviceManagementApplicabilityRuleOsVersion", "deviceManagementApplicabilityRuleDeviceMode"]),
    displayName,
    description,
    roleScopeTagIds: cleaned.roleScopeTagIds || ["0"],
  };
}

/**
 * App Protection (MAM). `apps` gaat er bewust uit: beide OIB-policies staan op
 * appGroupType "allMicrosoftApps", waarbij Intune de app-lijst zelf bepaalt — de
 * meegeleverde lijst is een momentopname van de brontenant. CIPP verwijdert `apps` ook
 * voor het POST't; door 'm hier al weg te laten doen beide restore-routes hetzelfde.
 */
/**
 * Bewuste afwijkingen op een plat veld, uit `veldOverrides` in het manifest.
 *
 * `applyOverrides` hierboven werkt op settingDefinitionId's en dus alleen op Settings
 * Catalog. App Protection en compliance zijn geen catalogus maar een platte Graph-resource:
 * daar heet een afwijking gewoon "dit veld krijgt een andere waarde dan de bron zegt".
 * Zonder deze stap draait de volgende import zo'n waarde stilzwijgend terug, want de body
 * wordt elke keer opnieuw uit de bron opgebouwd — hetzelfde gevaar, andere policyvorm.
 *
 *   { veld, waarde, reason }            veld dat in de bron staat krijgt een andere waarde
 *   { veld, waarde, reason, toevoegen }  veld dat de bron niet levert, bewust toegevoegd
 *
 * Zonder `toevoegen` faalt hij hard als het veld niet (meer) in de bron staat. Een override die stil niets doet is
 * het gevaarlijkst van alles: het bestand blijft dan kloppen terwijl de reden verdwenen is.
 * `reason` is verplicht, om dezelfde reden als bij `overrides`.
 */
function applyVeldOverrides(body, entry, applied) {
  for (const ov of entry.veldOverrides || []) {
    const { veld, waarde, reason, toevoegen } = ov;
    if (!reason) {
      console.error(`FOUT: veldOverride voor ${veld} in ${entry.target} heeft geen "reason".`);
      process.exit(1);
    }
    if (!(veld in body) && !toevoegen) {
      console.error(`FOUT: veldOverride voor ${veld} in ${entry.target}: dat veld staat niet (meer) in de bron.`);
      process.exit(1);
    }
    applied.push(`${entry.target}: ${veld} ${JSON.stringify(body[veld])} -> ${JSON.stringify(waarde)} — ${reason}`);
    body[veld] = waarde;
  }
}

function bodyForAppProtection(source, displayName, description) {
  const cleaned = stripODataAnnotations(source);
  return {
    ...omit(cleaned, ["id", "createdDateTime", "lastModifiedDateTime", "version", "isAssigned", "deployedAppCount", "apps", "assignments", "deploymentSummary"]),
    displayName,
    description,
  };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const sourceIdx = args.indexOf("--source");
  const sourceRoot = sourceIdx >= 0 ? path.resolve(args[sourceIdx + 1]) : DEFAULT_SOURCE;

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Manifest niet gevonden: ${MANIFEST_PATH}`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};

  const withoutDoel = manifest.policies.filter((p) => !p.doel).map((p) => p.target);
  if (withoutDoel.length > 0) {
    console.error(`FOUT: ${withoutDoel.length} policy/policies in het manifest hebben geen "doel":`);
    for (const t of withoutDoel) console.error(`  - ${t}`);
    console.error("Zonder die zin staat de policy straks naamloos in de tenant. Vul 'm aan in _manifest.json.");
    process.exit(1);
  }

  const needsSource = manifest.policies.some((p) => p.source);
  if (needsSource && !fs.existsSync(sourceRoot)) {
    console.error(`OIB-checkout niet gevonden op ${sourceRoot}.`);
    console.error("Haal 'm op met:");
    console.error("  git -c core.longpaths=true clone --depth 1 https://github.com/SkipToTheEndpoint/OpenIntuneBaseline .oib-source");
    process.exit(1);
  }

  // Eerst alle bronbestanden inlezen: de verzameling settingDefinitionId's die OIB dekt
  // bepaalt welke eigen instellingen mogen blijven, dus die moet compleet zijn vóór het
  // eerste bestand geschreven wordt.
  const loaded = [];
  const oibSettingIds = new Set();
  for (const entry of manifest.policies) {
    let source = null;
    if (entry.source) {
      const file = path.join(sourceRoot, entry.source);
      if (!fs.existsSync(file)) {
        console.error(`FOUT: bronbestand ontbreekt in de OIB-checkout: ${entry.source}`);
        process.exit(1);
      }
      source = readJsonFile(file);
      // Wat deze policy bewust weglaat telt niet als "OIB dekt het": anders verdwijnt een
      // instelling die naar een andere policy is verhuisd daar ook, bij de carry-regel.
      const dropped = new Set(entry.dropSettings || []);
      const kept = (source.settings || []).filter((s) => !dropped.has(s.settingInstance && s.settingInstance.settingDefinitionId));
      for (const id of collectSettingIds(kept)) oibSettingIds.add(id);
    }
    loaded.push({ entry, source });
  }

  const written = [];
  const carried = [];
  const overridden = [];
  let unchanged = 0;

  for (const { entry, source } of loaded) {
    const displayName = entry.displayName;
    const description = composeDescription(entry, assignments);

    // Bestaand template: GUID hergebruiken en, als er niets anders gezegd is, de eigen
    // extra instellingen daaruit overnemen. Dat maakt de tweede run identiek aan de eerste.
    const existing = findOurTemplate(entry.target);
    // Zonder `type` in het manifest volgt het Type uit het bestaande template. Een eigen
    // wifi- of compliancepolicy is geen Settings Catalog; die als Catalog opbouwen verplaatste
    // hem naar SettingsCatalog/ en gooide zijn inhoud weg.
    let type = entry.type || (existing && existing.type) || "Catalog";
    const carrySource = existing || (entry.carryFrom ? findOurTemplate(entry.carryFrom) : null);
    const guid = (existing && existing.inner.GUID) || (carrySource && carrySource.inner.GUID) || stableGuid(entry.target);

    let body;
    // Een eigen policy zonder bron die geen Settings Catalog is, kan niet uit overgenomen
    // settings worden opgebouwd: alleen naam en omschrijving bijwerken, net als metadataOnly.
    if (entry.metadataOnly || (!source && !entry.carryFrom && existing && existing.type !== "Catalog")) {
      // Templates die niet uit OIB komen. Alleen naam en omschrijving worden ververst; de
      // instellingen blijven onaangeroerd. Zonder deze tak zouden ze buiten het manifest
      // vallen en dus ook geen doel-zin in de tenant krijgen.
      if (!existing) {
        console.error(`FOUT: ${entry.target} staat als metadataOnly in het manifest, maar bestaat niet in IntuneTemplate/.`);
        process.exit(1);
      }
      type = existing.type;
      body = { ...existing.raw };
      if ("description" in body || type === "Catalog") body.description = description;
      if (typeof body.name === "string") body.name = displayName;
      if (typeof body.displayName === "string") body.displayName = displayName;
    } else if (!source) {
      // Geen OIB-bron: dit template bestaat puur uit overgenomen eigen instellingen.
      if (!carrySource) {
        console.error(`FOUT: ${entry.target} heeft geen source en geen bestaande carryFrom (${entry.carryFrom}).`);
        process.exit(1);
      }
      const keep = (carrySource.raw.settings || []).filter((s) => !oibSettingIds.has(s.settingInstance.settingDefinitionId));
      body = {
        name: displayName,
        description,
        settings: renumberSettings(keep),
        platforms: carrySource.raw.platforms || "windows10",
        technologies: carrySource.raw.technologies || "mdm",
        templateReference: carrySource.raw.templateReference || { templateId: "", templateFamily: "none", templateDisplayName: null, templateDisplayVersion: null },
      };
      carried.push(`${entry.target}: ${keep.length} eigen instelling(en) behouden (geen OIB-tegenhanger)`);
    } else if (type === "Catalog") {
      body = bodyForCatalog(source, entry, displayName, description);
      if (entry.carryFrom !== null && carrySource) {
        const oibIds = new Set(body.settings.map((s) => s.settingInstance.settingDefinitionId));
        // dropSettings geldt ook hier: een instelling die bewust uit deze policy is gehaald of
        // naar een andere policy is verhuisd, reist anders als "eigen" instelling mee.
        const keep = (carrySource.raw.settings || []).filter(
          (s) =>
            !oibIds.has(s.settingInstance.settingDefinitionId) &&
            !oibSettingIds.has(s.settingInstance.settingDefinitionId) &&
            !(entry.dropSettings || []).includes(s.settingInstance.settingDefinitionId)
        );
        if (keep.length > 0) {
          body.settings = renumberSettings([...body.settings, ...keep]);
          carried.push(`${entry.target}: ${keep.length} eigen instelling(en) behouden — ${keep.map((s) => s.settingInstance.settingDefinitionId).join(", ")}`);
        }
      }
      applyOverrides(body, entry, overridden);
    } else if (type === "deviceCompliancePolicies") {
      body = bodyForCompliance(source, displayName, description);
      applyVeldOverrides(body, entry, overridden);
    } else if (type === "Device") {
      body = bodyForDevice(source, displayName, description);
    } else if (type === "AppProtection") {
      body = bodyForAppProtection(source, displayName, description);
      applyVeldOverrides(body, entry, overridden);
    } else {
      console.error(`FOUT: onbekend Type "${type}" voor ${entry.target}`);
      process.exit(1);
    }

    const contents = buildTemplateFile({ guid, displayName, description, type, body, pkg: packageFor(entry, assignments[displayName]) ?? "" });
    const relPath = relativePathFor(entry.target, type);
    if (!relPath) {
      console.error(`FOUT: ${entry.target} (Type ${type}) past niet in de mapindeling — controleer de naam en het Type.`);
      process.exit(1);
    }
    const outFile = path.join(TEMPLATE_DIR, relPath);
    const before = existing && fs.existsSync(existing.filePath) ? fs.readFileSync(existing.filePath, "utf8") : null;
    const moved = existing && path.resolve(existing.filePath) !== path.resolve(outFile);

    if (before === contents && !moved) {
      unchanged += 1;
      continue;
    }
    if (!dryRun) {
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, contents);
      // Het Type kan gewijzigd zijn en daarmee de map; laat geen tweede kopie achter, die
      // zou bij de export een duplicaat opleveren.
      if (moved) fs.rmSync(existing.filePath);
    }
    const state = before === null ? "nieuw" : moved ? "verplaatst" : "bijgewerkt";
    written.push(`${state.padEnd(11)}${relPath.split(path.sep).join("/")}  (${type}${body.settings ? `, ${body.settings.length} instellingen` : ""})`);
  }

  console.log(`OIB-bron: ${sourceRoot}`);
  console.log(`Manifest: ${manifest.policies.length} policies, ${oibSettingIds.size} unieke settingDefinitionId's uit OIB\n`);
  for (const w of written) console.log("  " + w);
  console.log(`\n${written.length} geschreven, ${unchanged} ongewijzigd${dryRun ? " (--dry-run: er is niets weggeschreven)" : ""}`);
  if (carried.length > 0) {
    console.log("\nOvergenomen uit de eigen baseline (OIB kent deze instellingen niet):");
    for (const c of carried) console.log("  " + c);
  }
  if (tccFixes.length > 0) {
    console.log("\nPPPC gerepareerd (OpenIntuneBaseline issue #62 — nog open):");
    for (const f of tccFixes) console.log("  " + f);
  }
  if (overridden.length > 0) {
    console.log("\nBewust afgeweken van OIB (overrides uit het manifest):");
    for (const o of overridden) console.log("  " + o);
  }
  if (manifest.excluded && manifest.excluded.length > 0) {
    console.log(`\n${manifest.excluded.length} OIB-policy(s) bewust niet overgenomen — zie "excluded" in het manifest.`);
  }
  console.log("\nDaarna: node scripts/set-packages.js && node scripts/check-scope.js && node scripts/export-intunebackup.js && node scripts/generate-docs.js");
}

main();
