#!/usr/bin/env node
/**
 * Zet de rauwe Intune Settings Catalog-exports in IntuneTemplate/Baseline_*.json om naar
 * apps/dsc-functions/baseline/intune/baseline-v1.0.json-vormige JSON (BaselineRule-schema
 * van het TEST Policies Platform, packages/shared/src/caBaseline.ts), zodat de bestaande
 * baseline-koppeling (TPPBaselineSource) deze categorie kan lezen zonder dat het platform
 * zelf iets van dit rauwe exportformaat hoeft te weten.
 *
 * Eén rule per Baseline_*.json-bestand (niet per losse instelling — Administrative_Templates
 * alleen al heeft 300+ instellingen). Elke rule krijgt `type: "settings-catalog-match"` en
 * `params.settings`: de volledig uitgeklapte lijst van {settingDefinitionId, expectedValue}
 * die de policy moet bevatten. Het platform vergelijkt dat tegen de live tenant.
 *
 * Herbruikbaar: opnieuw draaien na een wijziging in IntuneTemplate/ regenereert het bestand
 * deterministisch (zelfde input -> zelfde output, op reviewedAt na).
 *
 * Gebruik: node scripts/generate-baseline.js
 * (vanuit de root van deze repo; verwacht IntuneTemplate/ naast scripts/)
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const OUTPUT_PATH = path.join(REPO_ROOT, "baseline", "intune", "baseline-v1.0.json");

/**
 * De 6 checks die vandaag al in sjkanon/Platform staan (device-compliance-/app-protection-
 * gebaseerd, niet Settings Catalog). Zodra deze repo de gekoppelde intune-bron wordt, stopt
 * Platform's eigen baseline/intune/baseline-v1.0.json als bron voor die categorie — zonder
 * deze kopie zouden deze 6 checks stilzwijgend verdwijnen. Bron: apps/dsc-functions/baseline
 * /intune/baseline-v1.0.json in sjkanon/Platform, checkIds 001-006, overgenomen 2026-08-10.
 */
const EXISTING_RULES = [
  {
    checkId: "INTUNE-ITCE-Baseline-001-DeviceEncryptionRequired",
    severity: "high",
    tags: ["intune", "device-compliance", "encryption"],
    type: "device-encryption-required",
    what: "Vereist de Windows-compliance-policy dat BitLocker/apparaatversleuteling actief is?",
    why: "Zonder verplichte versleuteling is bedrijfsdata op een verloren of gestolen apparaat direct leesbaar.",
    source: "Microsoft Intune Security Baselines / MCSB DP-4 / buildplan sectie 7.1",
    learnMoreLinks: [
      { label: "Windows 10/11 compliance settings — Device Health (BitLocker)", url: "https://learn.microsoft.com/mem/intune/protect/compliance-policy-create-windows" },
      { label: "Update-MgDeviceManagementDeviceCompliancePolicy (Microsoft Graph PowerShell)", url: "https://learn.microsoft.com/powershell/module/microsoft.graph.devicemanagement/update-mgdevicemanagementdevicecompliancepolicy" },
    ],
  },
  {
    checkId: "INTUNE-ITCE-Baseline-002-CompliancePolicyAssigned",
    severity: "high",
    tags: ["intune", "device-compliance"],
    type: "compliance-policy-assigned",
    what: "Is er minstens één compliance-policy die daadwerkelijk aan een groep is toegewezen (geen weeskindje)?",
    why: "Een compliance-policy zonder assignment test niets — devices worden dan nergens tegen getoetst, ook al lijkt de policy zelf in orde.",
    source: "buildplan sectie 7.1",
    remediationScript: "Import-Module Microsoft.Graph.DeviceManagement\n\n# Vervang door de policy-id (uit de finding/observedValue) en de doelgroep.\n$compliancePolicyId = '<device-compliance-policy-id>'\n$targetGroupId = '<object-id-van-doelgroep>'\n\n$params = @{\n    Assignments = @(\n        @{\n            Target = @{\n                '@odata.type' = '#microsoft.graph.groupAssignmentTarget'\n                GroupId = $targetGroupId\n            }\n        }\n    )\n}\nNew-MgDeviceManagementDeviceCompliancePolicyAssignment -DeviceCompliancePolicyId $compliancePolicyId -BodyParameter $params",
    learnMoreLinks: [{ label: "Assign device compliance policies in Intune", url: "https://learn.microsoft.com/mem/intune/protect/device-compliance-get-started" }],
  },
  {
    checkId: "INTUNE-ITCE-Baseline-003-CompliancePolicyMinOsVersion",
    severity: "medium",
    tags: ["intune", "device-compliance", "patching"],
    type: "compliance-policy-min-os",
    what: "Is er een minimale OS-versie ingesteld in de Windows-compliance-policy?",
    why: "Voorkomt dat verouderde, niet meer gepatchte Windows-builds als 'compliant' worden bestempeld.",
    source: "CIS Microsoft 365 Foundations Benchmark / buildplan sectie 7.1",
    optional: true,
    learnMoreLinks: [{ label: "Windows 10/11 compliance settings — minimum OS version", url: "https://learn.microsoft.com/mem/intune/protect/compliance-policy-create-windows" }],
  },
  {
    checkId: "INTUNE-ITCE-Baseline-004-AppProtectionPolicyExists",
    severity: "medium",
    tags: ["intune", "app-protection"],
    type: "app-protection-policy-exists",
    what: "Is er minstens één app protection-policy (MAM) geconfigureerd voor mobiele apps?",
    why: "Beschermt bedrijfsdata binnen apps op onbeheerde/BYOD-apparaten (encryptie, PIN, kopieer-restricties), ook zonder volledig device-beheer.",
    source: "MCSB IM-6 / buildplan sectie 7.1",
    optional: true,
    learnMoreLinks: [{ label: "Create and assign app protection policies", url: "https://learn.microsoft.com/mem/intune/apps/app-protection-policies" }],
  },
  {
    checkId: "INTUNE-ITCE-Baseline-005-PasscodeRequired",
    severity: "high",
    tags: ["intune", "device-compliance", "authentication"],
    type: "passcode-required",
    what: "Vereist de Windows-compliance-policy een wachtwoord/PIN om het apparaat te ontgrendelen?",
    why: "Een onbeveiligd apparaat geeft directe toegang tot bedrijfsdata en actieve sessies bij verlies of diefstal — dit is het meest basale endpointvereiste, vóór encryptie of OS-versie relevant wordt.",
    source: "Microsoft Intune Security Baselines / SkipToTheEndpoint OpenIntuneBaseline / buildplan sectie 7.1",
    learnMoreLinks: [{ label: "Windows 10/11 compliance settings — System Security (password)", url: "https://learn.microsoft.com/mem/intune/protect/compliance-policy-create-windows" }],
  },
  {
    checkId: "INTUNE-ITCE-Baseline-006-DefenderEnabled",
    severity: "medium",
    tags: ["intune", "device-compliance", "endpoint-protection"],
    type: "defender-enabled",
    what: "Vereist de Windows-compliance-policy dat Microsoft Defender Antivirus actief is?",
    why: "Zonder een afgedwongen antivirusvereiste kan een apparaat als 'compliant' gelden terwijl endpointbeveiliging uitstaat.",
    source: "Microsoft Intune Security Baselines / CIS Microsoft 365 Foundations Benchmark / buildplan sectie 7.1",
    optional: true,
    learnMoreLinks: [{ label: "Windows 10/11 compliance settings — Device Health (Microsoft Defender Antimalware)", url: "https://learn.microsoft.com/mem/intune/protect/compliance-policy-create-windows" }],
  },
];

/** Bestandsnamen die duidelijk kritieker zijn dan de rest — de eigenaar kan dit vrij bijstellen. */
const HIGH_SEVERITY_FILES = new Set([
  "Baseline_Bitlocker",
  "Baseline_EDR_Configuration",
  "Baseline_Default_AV_Policy",
  "Baseline_Firewall",
  "Baseline_ASR_Default_rules",
  "Baseline_Device_Lock",
  "Baseline_Windows_LAPS_Policy",
]);

function slugToPascalCase(filenameWithoutExt) {
  const withoutPrefix = filenameWithoutExt.replace(/^Baseline_/, "");
  return withoutPrefix
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Klapt één settingInstance-boom recursief uit naar platte {settingDefinitionId,
 * expectedValue}-paren. Vier instance-vormen komen voor in de 20 templates (2026-08-10,
 * bevestigd tegen alle bestanden): Choice (met optionele children), Simple (scalaire
 * waarde), GroupSettingCollection (herhaalde child-groepen, bv. losse ASR-regels) en
 * SimpleSettingCollection (lijst van platte waarden, bv. User Rights Assignment-SID's).
 * Secret-waarden (bv. het EDR-onboarding-token) worden bewust overgeslagen: die zijn
 * per-tenant en horen niet als vaste verwachte waarde in een gedeelde baseline te staan.
 */
function flattenInstance(instance, out, warnings) {
  if (!instance || typeof instance !== "object") return;
  const odataType = instance["@odata.type"] || "";
  const settingDefinitionId = instance.settingDefinitionId;

  if (odataType.endsWith("ChoiceSettingInstance")) {
    const csv = instance.choiceSettingValue || {};
    out.push({ settingDefinitionId, expectedValue: csv.value });
    for (const child of csv.children || []) flattenInstance(child, out, warnings);
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

/** Haalt de GUID uit een `.../groupPolicyDefinitions('<guid>')`- of `.../presentations('<guid>')`-odata.bind-URL. */
function extractGuidFromODataBind(bindUrl, resourceName) {
  const m = bindUrl && bindUrl.match(new RegExp(`${resourceName}\\('([^']+)'\\)`));
  return m ? m[1] : null;
}

/**
 * "Admin"-formaat: klassieke ADMX-backed Group Policy Configuration
 * (`added[].definition@odata.bind` naar `groupPolicyDefinitions`, met optionele
 * `presentationValues[]`) — andere Graph-API dan Settings Catalog
 * (`deviceManagement/groupPolicyConfigurations`, niet `configurationPolicies`).
 * definitionId/presentationId zijn de GUID's uit de odata.bind-URL's — net als
 * settingDefinitionId bij Settings Catalog zijn dit Microsoft's vaste, tenant-
 * onafhankelijke ADMX-catalogus-GUID's, dus rechtstreeks vergelijkbaar tussen tenants.
 *
 * LET OP: deze Graph-endpoint is beta-only en nooit tegen een echte tenant getest
 * (zie TODO.md in sjkanon/Platform) — hoger risico dan Settings Catalog.
 */
function convertAdminTemplateFile(rawJsonPolicy, baseName, checkNumber, policyDisplayName) {
  const definitions = [];
  const warnings = [];
  for (const item of rawJsonPolicy.added || []) {
    const definitionId = extractGuidFromODataBind(item["definition@odata.bind"], "groupPolicyDefinitions");
    if (!definitionId) {
      warnings.push(`Kon geen definitionId uit definition@odata.bind halen: ${item["definition@odata.bind"]}`);
      continue;
    }
    const presentationValues = [];
    for (const pv of item.presentationValues || []) {
      const presentationId = extractGuidFromODataBind(pv["presentation@odata.bind"], "presentations");
      if (!presentationId) {
        warnings.push(`Kon geen presentationId uit presentation@odata.bind halen: ${pv["presentation@odata.bind"]}`);
        continue;
      }
      presentationValues.push({ presentationId, value: pv.value });
    }
    definitions.push({ definitionId, enabled: !!item.enabled, presentationValues });
  }

  const pascalName = slugToPascalCase(baseName);
  const checkId = `INTUNE-ITCE-Baseline-${String(checkNumber).padStart(3, "0")}-${pascalName}`;

  return {
    rule: {
      checkId,
      severity: "medium",
      tags: ["intune", "group-policy-definition", baseName.replace(/^Baseline_/, "").toLowerCase().replace(/_+/g, "-")],
      type: "group-policy-definition-match",
      what: `Bevat de tenant een Group Policy-configuratieprofiel (ADMX) dat overeenkomt met de afgesproken baseline-policy "${policyDisplayName || baseName}"?`,
      why: "Onderdeel van de tussen ITCE en de klant afgesproken, Defender-gebaseerde Intune-baseline (bron: IntuneBackup/IntuneTemplate). Klassiek ADMX-backed (Type: \"Admin\"), niet Settings Catalog — de engine leest dit via de beta-only groupPolicyConfigurations-API, nog niet tegen een echte tenant geverifieerd.",
      source: `IntuneBackup/IntuneTemplate/${baseName}.json (afgesproken baseline, Defender-gebaseerd, ADMX)`,
      params: { definitions },
      learnMoreLinks: [
        { label: "Group Policy analytics and Administrative Templates in Microsoft Intune", url: "https://learn.microsoft.com/mem/intune/configuration/administrative-templates-windows" },
      ],
    },
    warnings,
    settingCount: definitions.length,
  };
}

/**
 * Twee formaten komen voor in IntuneTemplate/, onderscheiden door `.Type`:
 * - "Catalog": Settings Catalog-policy (`settings[].settingInstance`-bomen).
 * - "Admin": klassieke ADMX-backed Group Policy Configuration — zie convertAdminTemplateFile.
 */
function convertTemplateFile(filePath, checkNumber) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const inner = JSON.parse(raw.JSON);
  const baseName = path.basename(filePath, ".json");

  if (inner.Type === "Admin") {
    const rawJsonPolicy = JSON.parse(inner.RAWJson);
    return convertAdminTemplateFile(rawJsonPolicy, baseName, checkNumber, inner.Displayname);
  }

  const policy = JSON.parse(inner.RAWJson);

  const settings = [];
  const warnings = [];
  for (const s of policy.settings || []) {
    flattenInstance(s.settingInstance, settings, warnings);
  }

  const pascalName = slugToPascalCase(baseName);
  const checkId = `INTUNE-ITCE-Baseline-${String(checkNumber).padStart(3, "0")}-${pascalName}`;
  const severity = HIGH_SEVERITY_FILES.has(baseName) ? "high" : "medium";

  return {
    rule: {
      checkId,
      severity,
      tags: ["intune", "settings-catalog", baseName.replace(/^Baseline_/, "").toLowerCase().replace(/_+/g, "-")],
      type: "settings-catalog-match",
      what: `Bevat de tenant een Settings Catalog-policy die overeenkomt met de afgesproken baseline-policy "${policy.name || baseName}"?`,
      why: "Onderdeel van de tussen ITCE en de klant afgesproken, Defender-gebaseerde Intune-baseline (bron: IntuneBackup/IntuneTemplate). Een tenant die hiervan afwijkt voldoet niet (meer) aan de afgesproken beveiligingsstandaard, ook al kan de policy op naam anders heten.",
      source: `IntuneBackup/IntuneTemplate/${baseName}.json (afgesproken baseline, Defender-gebaseerd)`,
      params: { settings },
      learnMoreLinks: [
        { label: "Settings Catalog in Microsoft Intune", url: "https://learn.microsoft.com/mem/intune/configuration/settings-catalog" },
      ],
    },
    warnings,
    settingCount: settings.length,
  };
}

function main() {
  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`IntuneTemplate/ niet gevonden op ${TEMPLATE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(TEMPLATE_DIR)
    .filter((f) => f.startsWith("Baseline_") && f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.error("Geen Baseline_*.json-bestanden gevonden in IntuneTemplate/");
    process.exit(1);
  }

  const generatedRules = [];
  const skippedFiles = [];
  let checkNumber = EXISTING_RULES.length + 1;
  let hadWarnings = false;

  for (const file of files) {
    const filePath = path.join(TEMPLATE_DIR, file);
    const { rule, warnings, settingCount } = convertTemplateFile(filePath, checkNumber);
    if (settingCount === 0) {
      console.error(`FOUT: ${file} leverde 0 instellingen op — wordt overgeslagen, controleer het bestand handmatig.`);
      skippedFiles.push({ file, reason: "0 instellingen na flatten" });
      hadWarnings = true;
      continue;
    }
    for (const w of warnings) {
      console.warn(`  [${file}] ${w}`);
      hadWarnings = true;
    }
    generatedRules.push(rule);
    console.log(`${rule.checkId} <- ${file} (${settingCount} instellingen)`);
    checkNumber += 1;
  }

  const output = {
    category: "intune",
    version: "baseline-v1.0",
    reviewedAt: new Date().toISOString().slice(0, 10),
    rules: [...EXISTING_RULES, ...generatedRules],
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(`\nGeschreven: ${OUTPUT_PATH} (${output.rules.length} rules: ${EXISTING_RULES.length} bestaand + ${generatedRules.length} nieuw)`);
  if (skippedFiles.length > 0) {
    console.log(`\n${skippedFiles.length} bestand(en) overgeslagen (geen check voor gegenereerd):`);
    for (const { file, reason } of skippedFiles) console.log(`  - ${file}: ${reason}`);
  }
  if (hadWarnings) {
    console.log("Er waren waarschuwingen hierboven — controleer die vóór je commit.");
  }
}

main();
