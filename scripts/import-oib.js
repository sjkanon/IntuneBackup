#!/usr/bin/env node
/**
 * Zet policies uit OpenIntuneBaseline (SkipToTheEndpoint/OpenIntuneBaseline) om naar
 * IntuneTemplate/Baseline_*.json in CIPP-templateformaat, gestuurd door
 * IntuneTemplate/_oib-manifest.json.
 *
 * Waarom een importer en geen handwerk: OIB brengt een paar keer per jaar een nieuwe versie
 * uit. Handmatig overgetypte settingDefinitionId's zijn niet te reviewen en niet te
 * verversen; een manifest + importer maakt "trek OIB v3.9 binnen" een herhaalbare run met
 * een leesbare diff.
 *
 * Gebruik:
 *   git clone --depth 1 https://github.com/SkipToTheEndpoint/OpenIntuneBaseline .oib-source
 *   node scripts/import-oib.js                 # schrijft IntuneTemplate/
 *   node scripts/import-oib.js --dry-run       # toont alleen wat er zou veranderen
 *   node scripts/import-oib.js --source <pad>  # andere locatie van de OIB-checkout
 *
 * Windows-tip: OIB heeft bestandsnamen die over MAX_PATH heen gaan. Klonen met
 * `git -c core.longpaths=true clone ...` of de checkout dicht bij de schijfwortel zetten.
 *
 * Drie dingen die deze importer bewust doet:
 *
 * 1. **GUID's blijven behouden.** De RowKey/GUID van een CIPP-template identificeert de rij
 *    in Table Storage. Een bestaand template dat herschreven wordt houdt zijn GUID, anders
 *    krijgt CIPP bij de volgende sync een tweede template met dezelfde naam.
 *
 * 2. **Eigen instellingen die OIB niet kent blijven staan** (`carryFrom`). Onze BitLocker-
 *    policy dekt ook vaste en verwisselbare schijven, OIB alleen de OS-schijf; klakkeloos
 *    overschrijven zou dat stilzwijgend uitzetten. De regel is: een top-level instelling uit
 *    het oude template blijft, tenzij die settingDefinitionId érgens in de geïmporteerde
 *    OIB-set voorkomt — dan is OIB leidend en zou behouden een dubbele (dus conflicterende)
 *    instelling opleveren.
 *
 * 3. **Idempotent.** Bij een tweede run is het doelbestand zelf de `carryFrom`-bron: het
 *    bevat OIB-instellingen plus de overgenomen extra's, en die extra's zijn per definitie
 *    precies de instellingen die niet in de OIB-set zitten. Zelfde input -> zelfde output.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { relativePathFor, listTemplateFiles, readTemplate, collectSettingIds } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_oib-manifest.json");
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

/** Toewijzingsdoel in gewone taal, voor in de omschrijving. */
function assignmentText(assignment) {
  if (!assignment || assignment.length === 0) return "geen — deze policy hoort op een eigen groep, niet op iedereen";
  return assignment
    .map((a) => {
      const type = a.target["@odata.type"] || "";
      if (type.includes("allDevices")) return "alle apparaten";
      if (type.includes("allLicensedUsers")) return "alle gebruikers";
      if (type.includes("exclusionGroup")) return "uitgesloten groep";
      if (type.includes("group")) return "een groep";
      return type.replace("#microsoft.graph.", "");
    })
    .join(", ");
}

/**
 * De omschrijving die in de tenant naast de policy komt te staan. CIPP zet 'm uit het
 * Description-veld van het template, IntuneBackupAndRestore uit `description` in de body —
 * beide komen hier vandaan.
 *
 * Drie delen, omdat iemand die de policy in Intune openslaat drie dingen wil weten: wat doet
 * dit, hoort het hier te landen, en waar komt het vandaan. Het toewijzingsdoel komt uit
 * _assignments.json en niet uit een los tekstveld, zodat de omschrijving niet uit de pas kan
 * lopen met wat de export en Set-BaselineAssignment.ps1 werkelijk doen.
 */
function composeDescription(entry, assignments) {
  const parts = [];
  if (entry.doel) parts.push(entry.doel);
  parts.push(`Toewijzing volgens baseline: ${assignmentText(assignments[entry.displayName])}.`);
  if (entry.bron) parts.push(`Bron: ${entry.bron}.`);
  return parts.join(" ");
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

/** CIPP-template: Table Storage-rij met een genestelde JSON-string, zie README. */
function buildTemplateFile({ guid, displayName, description, type, body }) {
  const inner = {
    Displayname: displayName,
    Description: description,
    RAWJson: JSON.stringify(body),
    Type: type,
    GUID: guid,
    ReusableSettings: [],
  };
  return JSON.stringify({
    PartitionKey: "IntuneTemplate",
    RowKey: guid,
    GUID: guid,
    JSON: JSON.stringify(inner),
    Package: "Baseline",
  });
}

/** Settings-array normaliseren naar {id, settingInstance} met oplopende id's. */
function renumberSettings(settings) {
  return settings.map((s, i) => ({ id: String(i), settingInstance: s.settingInstance }));
}

function bodyForCatalog(source, entry, displayName, description) {
  const cleaned = stripODataAnnotations(source);
  let settings = (cleaned.settings || []).map((s) => ({ settingInstance: s.settingInstance }));

  if (entry.dropSettings && entry.dropSettings.length > 0) {
    settings = settings.filter((s) => !entry.dropSettings.includes(s.settingInstance.settingDefinitionId));
  }
  if (entry.splitScope) {
    settings = settings.filter((s) => scopeOfSettingId(s.settingInstance.settingDefinitionId) === entry.splitScope);
  }

  return {
    name: displayName,
    description,
    settings: renumberSettings(settings),
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
    else {
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
    console.error("Zonder die zin staat de policy straks naamloos in de tenant. Vul 'm aan in _oib-manifest.json.");
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
      for (const id of collectSettingIds(source.settings || [])) oibSettingIds.add(id);
    }
    loaded.push({ entry, source });
  }

  const written = [];
  const carried = [];
  const overridden = [];
  let unchanged = 0;

  for (const { entry, source } of loaded) {
    let type = entry.type || "Catalog";
    const displayName = entry.displayName;
    const description = composeDescription(entry, assignments);

    // Bestaand template: GUID hergebruiken en, als er niets anders gezegd is, de eigen
    // extra instellingen daaruit overnemen. Dat maakt de tweede run identiek aan de eerste.
    const existing = findOurTemplate(entry.target);
    const carrySource = existing || (entry.carryFrom ? findOurTemplate(entry.carryFrom) : null);
    const guid = (existing && existing.inner.GUID) || (carrySource && carrySource.inner.GUID) || stableGuid(entry.target);

    let body;
    if (entry.metadataOnly) {
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
        const keep = (carrySource.raw.settings || []).filter(
          (s) => !oibIds.has(s.settingInstance.settingDefinitionId) && !oibSettingIds.has(s.settingInstance.settingDefinitionId)
        );
        if (keep.length > 0) {
          body.settings = renumberSettings([...body.settings, ...keep]);
          carried.push(`${entry.target}: ${keep.length} eigen instelling(en) behouden — ${keep.map((s) => s.settingInstance.settingDefinitionId).join(", ")}`);
        }
      }
      applyOverrides(body, entry, overridden);
    } else if (type === "deviceCompliancePolicies") {
      body = bodyForCompliance(source, displayName, description);
    } else if (type === "Device") {
      body = bodyForDevice(source, displayName, description);
    } else if (type === "AppProtection") {
      body = bodyForAppProtection(source, displayName, description);
    } else {
      console.error(`FOUT: onbekend Type "${type}" voor ${entry.target}`);
      process.exit(1);
    }

    const contents = buildTemplateFile({ guid, displayName, description, type, body });
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
  if (overridden.length > 0) {
    console.log("\nBewust afgeweken van OIB (overrides uit het manifest):");
    for (const o of overridden) console.log("  " + o);
  }
  if (manifest.excluded && manifest.excluded.length > 0) {
    console.log(`\n${manifest.excluded.length} OIB-policy(s) bewust niet overgenomen — zie "excluded" in het manifest.`);
  }
  console.log("\nDaarna: node scripts/check-scope.js && node scripts/generate-baseline.js && node scripts/export-intunebackup.js");
}

main();
