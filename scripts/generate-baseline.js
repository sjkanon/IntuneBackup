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
const { readTemplates, parseBaseName, flattenSettings } = require("./lib/templates");

/**
 * De tokens die CIPP bij uitrol per tenant invult. De lijst komt uit `$ReservedVariables` en
 * `$BuiltInVars` in Get-CIPPTextReplacement (CIPP-API) en is hoofdletterongevoelig, net als
 * de `-replace` daar. Onze templates gebruiken vandaag `%OrganizationId%` in de
 * OneDrive-tenantlijst, in de KFM-instellingen en in de Teams-aanmeldbeperking.
 */
const CIPP_TOKEN_RE = /%(?:tenantid|organizationid|tenantfilter|defaultdomain|initialdomain|tenantname|partnertenantid|samappid|cippurl|cippuserschema)%/i;

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
    checkId: "INTUNE-BASE-001-DeviceEncryptionRequired",
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
    checkId: "INTUNE-BASE-002-CompliancePolicyAssigned",
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
    checkId: "INTUNE-BASE-003-CompliancePolicyMinOsVersion",
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
    checkId: "INTUNE-BASE-004-AppProtectionPolicyExists",
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
    checkId: "INTUNE-BASE-005-PasscodeRequired",
    severity: "high",
    tags: ["intune", "device-compliance", "authentication"],
    type: "passcode-required",
    what: "Vereist de Windows-compliance-policy een wachtwoord/PIN om het apparaat te ontgrendelen?",
    why: "Een onbeveiligd apparaat geeft directe toegang tot bedrijfsdata en actieve sessies bij verlies of diefstal — dit is het meest basale endpointvereiste, vóór encryptie of OS-versie relevant wordt.",
    source: "Microsoft Intune Security Baselines / SkipToTheEndpoint OpenIntuneBaseline / buildplan sectie 7.1",
    learnMoreLinks: [{ label: "Windows 10/11 compliance settings — System Security (password)", url: "https://learn.microsoft.com/mem/intune/protect/compliance-policy-create-windows" }],
  },
  {
    checkId: "INTUNE-BASE-006-DefenderEnabled",
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
  "Baseline_WIN_D_BitLocker",
  "Baseline_WIN_D_Defender_for_Endpoint_EDR",
  "Baseline_WIN_D_Defender_Antivirus",
  "Baseline_WIN_D_Windows_Firewall",
  "Baseline_WIN_D_Attack_Surface_Reduction",
  "Baseline_WIN_D_Device_Lock",
  "Baseline_WIN_D_Windows_LAPS",
  "Baseline_WIN_D_Windows_Hello_for_Business",
  "Baseline_WIN_D_Local_Administrators",
  "Baseline_WIN_D_Device_Guard_and_Credential_Guard",
  "Baseline_WIN_D_Microsoft_Office_Security",
  "Baseline_WIN_U_Microsoft_Office_Security",
  "Baseline_MAC_D_FileVault",
  "Baseline_MAC_D_Defender_Antivirus",
  "Baseline_MAC_D_Firewall_and_Gatekeeper",
]);

/**
 * Vaste bestandsnaam -> checkId-nummer. Het nummer wás de alfabetische positie, maar dan
 * verschuift één nieuw template alle checkId's erna — en een checkId is een externe
 * identifier: het platform, findings en uitzonderingen verwijzen ernaar. Nieuwe bestanden
 * krijgen daarom een nummer ná het hoogste bekende (alfabetisch), en de run meldt welk
 * nummer dat werd zodat je het hier kunt vastzetten.
 */
const CHECK_NUMBERS = {
  Baseline_WIN_D_Attack_Surface_Reduction: 7,
  // 8 was Administrative Templates: die 300-instellingenpolicy is opgesplitst naar de
  // OIB-policies (Internet Explorer Legacy, Security Hardening, Printing, Remote Desktop and
  // RPC) plus Legacy Hardening voor de rest. Het nummer blijft gereserveerd — hergebruiken
  // zou een oude finding aan een andere check koppelen.
  Baseline_WIN_D_Audit_and_Event_Logging: 9,
  Baseline_WIN_U_Microsoft_Outlook: 10,
  Baseline_WIN_D_BitLocker: 11,
  Baseline_WIN_D_Defender_Antivirus: 12,
  Baseline_WIN_D_Device_Lock: 13,
  Baseline_WIN_D_Defender_for_Endpoint_EDR: 14,
  Baseline_WIN_D_Microsoft_Edge_Search_Engine: 15,
  Baseline_WIN_D_Windows_Firewall: 16,
  // 17 was Network Security (LanManWorkstation) — opgegaan in Security Hardening.
  Baseline_WIN_D_Local_Security_Policies: 18,
  Baseline_WIN_D_Microsoft_Store: 19,
  Baseline_WIN_D_Microsoft_Edge_Security: 20,
  Baseline_WIN_D_Microsoft_Office_Updates: 21,
  Baseline_WIN_D_Location_and_Privacy: 22,
  // 23 was Windows Search — opgegaan in Windows Feature Configuration.
  Baseline_WIN_D_Enhanced_Phishing_Protection: 24,
  // 25 was System Services — opgegaan in Security Hardening.
  Baseline_WIN_D_User_Rights: 26,
  Baseline_WIN_D_Windows_LAPS: 27,
  // 28 was OneDrive Known Folder Move — opgegaan in de OneDrive-policy (29).
  Baseline_WIN_D_Microsoft_OneDrive: 29,
  // Type "Device": levert vandaag geen check op, maar het nummer is gereserveerd zodat het
  // niet aan een ander template wordt uitgedeeld als de engine dit type gaat ondersteunen.
  Baseline_WIN_D_Windows_Update_Ring_3_Production: 30,

  // Uit de D/U-splitsing (PLAN.md fase 2).
  Baseline_WIN_U_Windows_User_Experience: 31,
  Baseline_WIN_U_Microsoft_OneDrive: 32,

  // 33 en hoger: de OpenIntuneBaseline-import (zie IntuneTemplate/_manifest.json).
  Baseline_AND_U_App_Protection: 33,
  Baseline_IOS_U_App_Protection: 34,
  Baseline_MAC_D_Accounts_and_Login: 35,
  Baseline_MAC_D_Defender_Antivirus: 36,
  Baseline_MAC_D_Defender_for_Endpoint: 37,
  Baseline_MAC_D_FileVault: 38,
  Baseline_MAC_D_Firewall_and_Gatekeeper: 39,
  Baseline_MAC_D_Microsoft_AutoUpdate: 40,
  Baseline_MAC_D_Microsoft_Edge_Password_Management: 41,
  Baseline_MAC_D_Microsoft_Edge_Security: 42,
  Baseline_MAC_D_Microsoft_Office: 43,
  Baseline_MAC_D_Microsoft_OneDrive: 44,
  Baseline_MAC_D_Platform_SSO: 45,
  Baseline_MAC_D_Restrictions: 46,
  Baseline_MAC_D_Software_Updates: 47,
  Baseline_MAC_U_Compliance_Device_Health: 48,
  Baseline_MAC_U_Compliance_Device_Security: 49,
  Baseline_MAC_U_Compliance_Password: 50,
  Baseline_MAC_U_Microsoft_Edge_Extensions: 51,
  Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync: 52,
  Baseline_MAC_U_Microsoft_Edge_Updates: 53,
  Baseline_MAC_U_Microsoft_OneDrive_KFM: 54,
  Baseline_WIN_D_Administrator_Protection: 55,
  Baseline_WIN_D_Automatic_Restart_Sign_On: 56,
  Baseline_WIN_D_Cloud_Optimized_Content: 57,
  Baseline_WIN_D_Config_Refresh: 58,
  Baseline_WIN_D_Defender_Additional_Configuration: 59,
  Baseline_WIN_D_Defender_Security_Experience: 60,
  Baseline_WIN_D_Defender_Update_Ring_1_Pilot: 61,
  Baseline_WIN_D_Defender_Update_Ring_2_UAT: 62,
  Baseline_WIN_D_Defender_Update_Ring_3_Production: 63,
  Baseline_WIN_D_Delivery_Optimisation: 64,
  Baseline_WIN_D_Device_Guard_and_Credential_Guard: 65,
  Baseline_WIN_D_Disable_NTLM: 66,
  Baseline_WIN_D_Endpoint_Analytics: 67,
  Baseline_WIN_D_In_Box_App_Removal: 68,
  Baseline_WIN_D_Internet_Explorer_Legacy: 69,
  Baseline_WIN_D_Legacy_Hardening: 70,
  Baseline_WIN_D_Local_Administrators: 71,
  Baseline_WIN_D_Login_and_Lock_Screen: 72,
  Baseline_WIN_D_Microsoft_Accounts: 73,
  Baseline_WIN_D_Microsoft_Edge_Updates: 74,
  Baseline_WIN_D_Microsoft_Office_Security: 75,
  Baseline_WIN_D_Passwordless: 76,
  Baseline_WIN_D_Printing: 77,
  Baseline_WIN_D_Remote_Desktop_and_RPC: 78,
  Baseline_WIN_D_Script_File_Associations: 79,
  Baseline_WIN_D_Security_Hardening: 80,
  Baseline_WIN_D_Settings_Sync: 81,
  Baseline_WIN_D_Timezone: 82,
  Baseline_WIN_D_Update_Reports_and_Telemetry: 83,
  Baseline_WIN_D_Windows_Feature_Configuration: 84,
  Baseline_WIN_D_Windows_Firewall_Rules: 85,
  Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust: 86,
  Baseline_WIN_D_Windows_Hello_for_Business: 87,
  Baseline_WIN_D_Windows_Package_Manager: 88,
  Baseline_WIN_D_Windows_Sandbox: 89,
  Baseline_WIN_D_Windows_Subsystem_for_Linux: 90,
  Baseline_WIN_D_Windows_Update_Ring_1_Pilot: 91,
  Baseline_WIN_D_Windows_Update_Ring_2_UAT: 92,
  Baseline_WIN_U_Compliance_Defender_for_Endpoint: 93,
  Baseline_WIN_U_Compliance_Device_Health: 94,
  Baseline_WIN_U_Compliance_Device_Security: 95,
  Baseline_WIN_U_Compliance_Password: 96,
  Baseline_WIN_U_Copilot: 97,
  Baseline_WIN_U_Microsoft_Edge_Extensions: 98,
  Baseline_WIN_U_Microsoft_Edge_Password_Management: 99,
  Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync: 100,
  Baseline_WIN_U_Microsoft_Edge_User_Experience: 101,
  Baseline_WIN_U_Microsoft_Office_Experience: 102,
  Baseline_WIN_U_Microsoft_Office_Security: 103,
  Baseline_WIN_U_Microsoft_Store: 104,
  Baseline_WIN_U_Personal_Data_Encryption: 105,
  Baseline_WIN_U_Windows_Spotlight: 106,

  // De drie CIPP-standaardtemplates stonden nog niet in deze map en kregen hun nummer dus
  // uit de bestandsvolgorde. Hier vastgezet op de nummers waarmee ze in baseline-v1.0.json
  // staan: een nieuw template ervoor in het alfabet zou ze anders alle drie opschuiven.
  Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode: 107,
  Baseline_WIN_D_Defender_AV_Policy: 108,
  Baseline_WIN_D_Defender_EDR_Policy: 109,

  // Eigen aanvulling op de macOS-baseline, buiten OpenIntuneBaseline om.
  Baseline_MAC_D_Privacy_Preferences: 110,

  // Uit de vergelijking met IntuneAdmin/IntuneBaselines (augustus 2026): drie gaten die
  // OpenIntuneBaseline niet dekt, plus de WHfB-varianten voor eigen en gedeelde apparaten.
  Baseline_WIN_D_Removable_Storage: 111,
  Baseline_WIN_D_Windows_AI_Restricted: 112,
  Baseline_WIN_D_Windows_Hello_for_Business_Multi_User: 113,
  Baseline_WIN_U_Windows_Hello_for_Business: 114,

  // De twee macOS-inschrijfprofielen. Alternatieven van elkaar, dus allebei zonder
  // toewijzing — zie de note bij hun regel in _manifest.json.
  Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity: 115,
  Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity: 116,

  // 117 en hoger: de samenvoeging van september 2026. De ISMS-set en BASELINE2 zijn hierin
  // opgegaan — één baseline, met `fase` in _manifest.json in plaats van drie mappen. De
  // nummers zijn vastgezet op het moment van samenvoegen; ze volgen niet uit de
  // bestandsvolgorde, want dan zou één nieuw template alles erna verschuiven.
  Baseline_AND_U_Compliance_Device_Health: 117,
  Baseline_AND_U_Compliance_Password: 118,
  Baseline_IOS_U_Compliance_Device_Health: 119,
  Baseline_IOS_U_Compliance_Password: 120,
  Baseline_MAC_D_Passcode_and_Screen_Lock: 121,
  Baseline_MAC_D_Screen_Recording: 122,
  Baseline_WIN_D_Access_Control: 123,
  Baseline_WIN_D_Account_Lockout: 124,
  Baseline_WIN_D_AI_Tooling: 125,
  Baseline_WIN_D_Audit_Policy_Enforcement: 126,
  Baseline_WIN_D_Business_Continuity: 127,
  Baseline_WIN_D_Cryptography: 128,
  Baseline_WIN_D_Data_Minimisation: 129,
  Baseline_WIN_D_Kernel_DMA_Protection: 130,
  Baseline_WIN_D_Logging: 131,
  Baseline_WIN_D_Logon_Hardening: 132,
  Baseline_WIN_D_Printing_Hardening: 133,
  Baseline_WIN_D_Privacy_and_Telemetry: 134,
  Baseline_WIN_D_Remote_Access_Hardening: 135,
  Baseline_WIN_D_Threat_Protection: 136,
  Baseline_WIN_D_Wireless_and_Peripherals: 137,
  Baseline_WIN_D_Wireless_Shared_Devices: 138,
  Baseline_WIN_U_AI_Usage_Control_Restricted: 139,
  Baseline_WIN_U_Attachment_Scanning: 140,

  // 141 en hoger: de baselines uit IntuneAdmin die nog ontbraken. Op profielniveau
  // vergeleken en niet op instellingniveau — daarmee kwamen hele sets in beeld die de
  // eerdere vergelijking miste omdat hun losse instellingen elders al gedekt leken.
  Baseline_WIN_D_Enrollment_Hardening: 141,
  Baseline_WIN_D_Power_Management: 142,
  Baseline_WIN_D_Storage_Sense: 143,
  Baseline_WIN_U_Microsoft_Teams: 145,

  // Windows AI is een klantbesluit en geen technisch feit, dus twee varianten die dezelfde
  // vier instellingen op de tegenovergestelde waarde zetten. Wijs er één toe; allebei levert
  // een Conflict op waarna Intune er géén toepast. 144 is opgeheven: dat was de policy vóór
  // de splitsing, en een oud nummer aan een andere check koppelen is erger dan een gat.
  Baseline_WIN_D_Windows_AI_Features_Permitted: 146,
  Baseline_WIN_D_Windows_AI_Features_Restricted: 147,

  // De Permitted-tegenhangers van de twee oudere AI-policies. De Restricted-variant houdt het
  // nummer dat de policy vóór de splitsing had (112 en 139) — dat is de variant die de
  // baseline uitrolt, dus daar hangen de findings aan.
  Baseline_WIN_D_Windows_AI_Permitted: 148,
  Baseline_WIN_U_AI_Usage_Control_Permitted: 149,
  // Hoort bij Windows AI Permitted: als Recall aan mag, dan in elk geval begrensd.
  Baseline_WIN_D_Windows_AI_Recall_Boundaries: 150,
};

/**
 * Nummers die bij een opgeheven policy hoorden. Ze worden niet opnieuw uitgedeeld: een
 * checkId is een externe identifier, en 017 hergebruiken voor een nieuwe policy zou oude
 * findings en uitzonderingen aan iets anders koppelen dan waar ze over gingen.
 */
const RETIRED_CHECK_NUMBERS = {
  8: "Administrative Templates — vervangen door Internet Explorer Legacy, Security Hardening, Printing, Remote Desktop and RPC en Legacy Hardening",
  17: "Network Security (LanManWorkstation) — opgegaan in Security Hardening",
  23: "Windows Search — opgegaan in Windows Feature Configuration",
  25: "System Services — opgegaan in Security Hardening",
  28: "OneDrive Known Folder Move — opgegaan in Microsoft OneDrive (029)",
  144: "Windows AI Features — gesplitst in een Restricted- (147) en een Permitted-variant (146), omdat het toestaan van generatieve AI een klantbesluit is",
};

/**
 * Vaste checkId-suffix per bestandsnaam, voor bestanden die hernoemd zijn.
 *
 * De suffix komt normaal uit slugToPascalCase(bestandsnaam). Bij de D/U-hernoeming zou dat
 * elke checkId meeveranderen — Baseline_Bitlocker -> Baseline_D_BitLocker maakt van
 * INTUNE-BASE-011-Bitlocker een INTUNE-BASE-011-DBitLocker. Een checkId is een externe
 * identifier: het platform, findings en uitzonderingen verwijzen ernaar, dus die moet de
 * hernoeming overleven. Alleen hernoemde bestanden staan hier; nieuwe policies krijgen
 * gewoon hun eigen slug uit de bestandsnaam.
 */
const CHECK_ID_SLUGS = {
  // De AI-splitsing van september 2026: het toestaan van generatieve AI is een klantbesluit,
  // dus elke AI-policy heeft een Restricted- en een Permitted-variant. De Restricted-variant
  // is de voortzetting van de policy die er al was en houdt daarom zijn suffix — anders zou
  // een bestaande finding aan een andere checkId gaan hangen.
  Baseline_WIN_D_Windows_AI_Restricted: "DWindowsAI",
  Baseline_WIN_U_AI_Usage_Control_Restricted: "UAIUsageControl",
  Baseline_WIN_D_Attack_Surface_Reduction: "ASRDefaultRules",
  Baseline_WIN_D_Audit_and_Event_Logging: "Auditing",
  Baseline_WIN_U_Microsoft_Outlook: "AutomaticConfigurationOfOutlook",
  Baseline_WIN_D_BitLocker: "Bitlocker",
  Baseline_WIN_D_Defender_Antivirus: "DefaultAVPolicy",
  Baseline_WIN_D_Device_Lock: "DeviceLock",
  Baseline_WIN_D_Defender_for_Endpoint_EDR: "EDRConfiguration",
  Baseline_WIN_D_Microsoft_Edge_Search_Engine: "EdgeStandardSearchEngineGoogle",
  Baseline_WIN_D_Windows_Firewall: "Firewall",
  Baseline_WIN_D_Local_Security_Policies: "LocalPoliciesSecurityOptions",
  Baseline_WIN_D_Microsoft_Store: "MicrosoftAppStore",
  Baseline_WIN_D_Microsoft_Edge_Security: "MicrosoftEdge",
  Baseline_WIN_D_Microsoft_Office_Updates: "OfficeUpdates",
  Baseline_WIN_D_Location_and_Privacy: "Privacy",
  // De opvolger van de SmartScreen-policy houdt checkId 024 én zijn slug: het nummer is de
  // identifier, de slug hoort daar vast bij te blijven staan.
  Baseline_WIN_D_Enhanced_Phishing_Protection: "Smartscreen",
  Baseline_WIN_D_User_Rights: "UserRights",
  Baseline_WIN_D_Windows_LAPS: "WindowsLAPSPolicy",
  Baseline_WIN_D_Microsoft_OneDrive: "OnedriveSilentLogin",
};

/**
 * Deelt nummers uit: bekend uit CHECK_NUMBERS, anders oplopend na het hoogste bekende.
 * Opgeheven nummers liggen per definitie onder dat maximum en komen dus nooit opnieuw aan
 * bod — daarom staat RETIRED_CHECK_NUMBERS ook in de berekening, ook al is dat vandaag geen
 * verschil: zodra iemand een nieuw nummer bovenaan opheft, klopt het nog steeds.
 */
function assignCheckNumbers(baseNames) {
  let next = Math.max(0, ...Object.values(CHECK_NUMBERS), ...Object.keys(RETIRED_CHECK_NUMBERS).map(Number)) + 1;
  const assigned = new Map();
  const fresh = [];
  for (const name of baseNames) {
    if (CHECK_NUMBERS[name] !== undefined) {
      assigned.set(name, CHECK_NUMBERS[name]);
    } else {
      assigned.set(name, next);
      fresh.push(`  ${name}: ${next},`);
      next += 1;
    }
  }
  if (fresh.length > 0) {
    console.log("\nNieuwe templates kregen een nummer — zet ze vast in CHECK_NUMBERS in dit script:");
    console.log(fresh.join("\n"));
  }
  return assigned;
}

function pascalCase(text) {
  return text
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * De checkId-suffix. Vast voor bestanden die uit een hernoeming komen (CHECK_ID_SLUGS),
 * anders afgeleid: scope + onderwerp, met het platform ervoor als het niet Windows is.
 *
 * De scope zit erin omdat er D/U-paren van hetzelfde onderwerp bestaan (Microsoft Store,
 * Microsoft Office Security) — zonder die letter zouden die twee dezelfde checkId krijgen.
 * Windows blijft zonder platformmarkering, zodat de checkId's die er al waren niet alsnog
 * veranderen.
 */
function checkIdSuffix(baseName) {
  if (CHECK_ID_SLUGS[baseName]) return CHECK_ID_SLUGS[baseName];
  const parsed = parseBaseName(baseName);
  if (!parsed) return pascalCase(baseName.replace(/^Baseline_/, ""));
  const platformPart = parsed.platform === "WIN" ? "" : parsed.platform;
  return `${platformPart}${parsed.scope}${pascalCase(parsed.item)}`;
}

/**
 * Onderwerpstag, stabiel over de hernoemingen heen: platform- en scopeprefix tellen niet mee,
 * want anders wordt "bitlocker" ineens "win-d-bitlocker" en breekt filteren op tag. Platform
 * en scope komen als losse tags terug, zodat je er wél op kunt filteren zonder de
 * onderwerpstag te vervuilen.
 */
function tagsFor(baseName, extra) {
  const parsed = parseBaseName(baseName);
  const topic = (parsed ? parsed.item : baseName.replace(/^Baseline_/, "")).toLowerCase().replace(/_+/g, "-");
  const platformTag = parsed ? { WIN: "windows", MAC: "macos", IOS: "ios", AND: "android" }[parsed.platform] : null;
  const scopeTag = parsed ? (parsed.scope === "D" ? "device-scope" : "user-scope") : null;
  return ["intune", extra, topic, platformTag, scopeTag].filter(Boolean);
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

  const checkId = `INTUNE-BASE-${String(checkNumber).padStart(3, "0")}-${checkIdSuffix(baseName)}`;

  return {
    rule: {
      checkId,
      severity: "medium",
      tags: tagsFor(baseName, "group-policy-definition"),
      type: "group-policy-definition-match",
      what: `Bevat de tenant een Group Policy-configuratieprofiel (ADMX) dat overeenkomt met de afgesproken baseline-policy "${policyDisplayName || baseName}"?`,
      why: "Onderdeel van de met de klant afgesproken, Defender-gebaseerde Intune-baseline (bron: IntuneBackup/IntuneTemplate). Klassiek ADMX-backed (Type: \"Admin\"), niet Settings Catalog — de engine leest dit via de beta-only groupPolicyConfigurations-API, nog niet tegen een echte tenant geverifieerd.",
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
 * Vijf formaten komen voor in IntuneTemplate/, onderscheiden door `.Type`:
 * - "Catalog": Settings Catalog-policy (`settings[].settingInstance`-bomen), Windows én macOS.
 * - "Admin": klassieke ADMX-backed Group Policy Configuration — zie convertAdminTemplateFile.
 * - "Device": klassieke deviceConfiguration (bv. windowsUpdateForBusinessConfiguration).
 * - "deviceCompliancePolicies": compliance-policy.
 * - "AppProtection": MAM-policy voor iOS/Android.
 *
 * De laatste drie leveren géén check op. CIPP en IntuneBackupAndRestore rollen ze prima uit,
 * maar de platform-engine heeft er geen matcher voor — er is geen `device-configuration-
 * match`. Een rule genereren die de engine niet kent levert een check op die stilzwijgend
 * niets test. Voor compliance en app protection dekken de generieke checks 001–006 dit
 * vandaag af (bestaat er een compliance-policy, is die toegewezen, vereist die encryptie).
 */
const TYPES_WITHOUT_MATCHER = ["Device", "deviceCompliancePolicies", "AppProtection"];

function convertTemplate(template, checkNumber) {
  const { baseName, inner, raw: policy } = template;

  if (TYPES_WITHOUT_MATCHER.includes(inner.Type)) {
    return { unsupportedType: inner.Type, settingCount: 0 };
  }

  if (inner.Type === "Admin") {
    return convertAdminTemplateFile(policy, baseName, checkNumber, inner.Displayname);
  }

  const { settings: alleSettings, warnings } = flattenSettings(policy.settings);

  // CIPP vervangt %-tokens bij uitrol door een tenant-specifieke waarde: %OrganizationId% en
  // %tenantid% worden de customerId, %tenantfilter% het standaarddomein (zie
  // Get-CIPPTextReplacement in CIPP-API). In de tenant staat dus de GUID en niet het token,
  // en een check die het token als verwachte waarde meeneemt is per definitie rood — niet
  // omdat de tenant afwijkt, maar omdat de baseline iets vergelijkt wat er nooit zo staat.
  // Zo'n check is erger dan geen check: hij vraagt elke ronde aandacht en leert iedereen om
  // rood te negeren. Dezelfde reden waarom flattenSettings het EDR-onboardingtoken overslaat.
  const settings = alleSettings.filter((s) => {
    const token = CIPP_TOKEN_RE.exec(JSON.stringify(s.expectedValue ?? ""));
    if (!token) return true;
    warnings.push(`CIPP-token ${token[0]} overgeslagen voor ${s.settingDefinitionId} (wordt bij uitrol per tenant vervangen, dus niet als vaste waarde te toetsen)`);
    return false;
  });

  const checkId = `INTUNE-BASE-${String(checkNumber).padStart(3, "0")}-${checkIdSuffix(baseName)}`;
  const severity = HIGH_SEVERITY_FILES.has(baseName) ? "high" : "medium";

  return {
    rule: {
      checkId,
      severity,
      tags: tagsFor(baseName, "settings-catalog"),
      type: "settings-catalog-match",
      what: `Bevat de tenant een Settings Catalog-policy die overeenkomt met de afgesproken baseline-policy "${policy.name || baseName}"?`,
      why: "Onderdeel van de met de klant afgesproken, Defender-gebaseerde Intune-baseline (bron: IntuneBackup/IntuneTemplate). Een tenant die hiervan afwijkt voldoet niet (meer) aan de afgesproken beveiligingsstandaard, ook al kan de policy op naam anders heten.",
      source: `IntuneBackup/IntuneTemplate/${path.relative(TEMPLATE_DIR, template.filePath).split(path.sep).join("/")} (afgesproken baseline, Defender-gebaseerd)`,
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

  const templates = readTemplates(TEMPLATE_DIR);
  if (templates.length === 0) {
    console.error("Geen Baseline_*.json-bestanden gevonden in IntuneTemplate/");
    process.exit(1);
  }

  const generatedRules = [];
  const skippedFiles = [];
  const checkNumbers = assignCheckNumbers(templates.map((t) => t.baseName));
  let hadWarnings = false;

  for (const template of templates) {
    const file = template.baseName + ".json";
    const checkNumber = checkNumbers.get(template.baseName);
    const { rule, warnings, settingCount, unsupportedType } = convertTemplate(template, checkNumber);
    if (unsupportedType) {
      console.log(`${file}: Type "${unsupportedType}" — geen baseline-check (engine heeft er geen matcher voor), wel uitrolbaar via CIPP/IntuneBackupAndRestore.`);
      skippedFiles.push({ file, reason: `Type "${unsupportedType}" wordt niet door de platform-engine ondersteund` });
      continue;
    }
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
  }

  // Op checkId sorteren: de volgorde in het bestand volgt zo het nummer, niet de
  // alfabetische bestandsvolgorde — anders springt een later toegevoegd template met een
  // hoog nummer midden in de lijst en oogt de diff groter dan hij is.
  generatedRules.sort((a, b) => a.checkId.localeCompare(b.checkId));

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
