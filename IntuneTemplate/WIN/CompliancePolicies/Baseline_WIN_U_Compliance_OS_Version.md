<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_U_Compliance_OS_Version.en.md) · [Français](Baseline_WIN_U_Compliance_OS_Version.fr.md)

# [Baseline] - WIN - U - Compliance OS Version

Toetst of het apparaat op een Windows-versie draait die de baseline ook echt kan uitvoeren: minimaal Windows 11 22H2.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| Bron | Eigen policy; de ondergrens volgt uit wat de baseline zelf al vereist — Account Lockout vraagt 22H2 met KB5053657 of 24H2, Administrator Protection en Windows Protected Print vragen 24H2 |
| Bestand | [`Baseline_WIN_U_Compliance_OS_Version.json`](Baseline_WIN_U_Compliance_OS_Version.json) |

> **Deze waarde veroudert en moet worden nagelopen.** 10.0.22621 is Windows 11 22H2. Draai `node scripts/check-osversion.js` om te zien hoe ver hij achterloopt op de n-1-versie uit endoflife.date; dat rapport blokkeert bewust niets, want zodra een verouderde ondergrens de build rood maakt verhoogt iemand het getal om 'm groen te krijgen. Verhogen is een besluit en dus een PR — deze ondergrens is een capaciteitsvloer (zie `ondergrens`), dus hem automatisch met n-1 laten meebewegen zou juist de reden weghalen waarom hij op 22H2 staat.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden<br>A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(f) beoordeling van de doeltreffendheid |
| CIS Controls v8.1 | 2.2 Ensure Authorized Software is Currently Supported |
| NIST CSF 2.0 | DE.CM-09<br>PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de CA-Policies-repo leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| 2060 - GRANT - Mobile Apps and Desktop Clients | disabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| 2090 - GRANT - Browser Access On Unmanaged Devices | enabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| 2130 - GRANT - Admins Compliant Device | enabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| 2160 - GRANT - Agent Users Compliant Device | report-only | Bepaalt of het endpoint waarvandaan een agent-user werkt compliant is. Voldoet het daar niet aan, dan houdt deze policy de agent-user tegen zodra hij uit report-only gaat. |
| 3020 - SESSION - BYOD Persistence | report-only | Bepaalt welk apparaat als compliant telt en dus búiten deze sessiebegrenzing valt. Een beheerd apparaat dat niet-compliant wordt, valt eronder. |
| 3040 - SESSION - Block File Downloads On Unmanaged Devices | disabled | Bepaalt welk apparaat als compliant telt en dus mag downloaden. Een beheerd apparaat dat niet-compliant wordt, krijgt alleen nog de browser zonder downloads. |

## Eigenschappen — 38

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passwordRequired` | false |
| `passwordBlockSimple` | false |
| `passwordRequiredToUnlockFromIdle` | false |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordRequiredType` | deviceDefault |
| `passwordPreviousPasswordBlockCount` | — |
| `requireHealthyDeviceReport` | false |
| `osMinimumVersion` | 10.0.22621 |
| `osMaximumVersion` | — |
| `mobileOsMinimumVersion` | — |
| `mobileOsMaximumVersion` | — |
| `earlyLaunchAntiMalwareDriverEnabled` | false |
| `bitLockerEnabled` | false |
| `secureBootEnabled` | false |
| `codeIntegrityEnabled` | false |
| `storageRequireEncryption` | false |
| `activeFirewallRequired` | false |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `signatureOutOfDate` | false |
| `rtpEnabled` | false |
| `antivirusRequired` | false |
| `antiSpywareRequired` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `configurationManagerComplianceRequired` | false |
| `tpmRequired` | false |
| `deviceCompliancePolicyScript` | — |
| `validOperatingSystemBuildRanges` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 72 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
