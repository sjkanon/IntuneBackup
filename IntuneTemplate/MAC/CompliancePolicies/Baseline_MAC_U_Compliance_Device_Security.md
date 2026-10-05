<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_MAC_U_Compliance_Device_Security.en.md) · [Français](Baseline_MAC_U_Compliance_Device_Security.fr.md)

# [Baseline] - MAC - U - Compliance Device Security

Toetst of de schijf van de Mac versleuteld is, de firewall aanstaat en Gatekeeper alleen ondertekende software toelaat.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | All Users |
| Bron | OpenIntuneBaseline macOS v1.0 — Compliance - U - Device Security |
| Bestand | [`Baseline_MAC_U_Compliance_Device_Security.json`](Baseline_MAC_U_Compliance_Device_Security.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.19 Installatie van software op operationele systemen<br>A.8.20 Netwerkbeveiliging<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(f) beoordeling van de doeltreffendheid<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.5 Implement and Manage a Firewall on End-User Devices |
| NIST CSF 2.0 | DE.CM-09<br>PR.DS-01 |

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

## Eigenschappen — 27

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passwordRequired` | false |
| `passwordBlockSimple` | false |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | — |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordRequiredType` | deviceDefault |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `systemIntegrityProtectionEnabled` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `storageRequireEncryption` | true |
| `gatekeeperAllowedAppSource` | macAppStoreAndIdentifiedDevelopers |
| `firewallEnabled` | true |
| `firewallBlockAllIncoming` | false |
| `firewallEnableStealthMode` | false |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 12 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
