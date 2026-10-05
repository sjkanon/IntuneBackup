<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_U_Compliance_Antivirus.en.md) · [Français](Baseline_WIN_U_Compliance_Antivirus.fr.md)

# [Baseline] - WIN - U - Compliance Antivirus

Toetst of er een actieve antivirusoplossing in Windows-beveiliging geregistreerd staat.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | All Users |
| Bron | OpenIntuneBaseline Windows v4.0 — CP - Device Security - U - Antivirus |
| Bestand | [`Baseline_WIN_U_Compliance_Antivirus.json`](Baseline_WIN_U_Compliance_Antivirus.json) |

> Sinds OIB v4.0 één toets per policy in plaats van vier gebundelde policies, zodat respijt en uitzonderingen per toets te regelen zijn. Samen met de acht andere WIN - U - Compliance-policies uit v4.0 de vervanger van Compliance Device Health, Device Security en Defender for Endpoint; Compliance Password is vervallen (zie _renames.json).

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.7 Bescherming tegen malware |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(f) beoordeling van de doeltreffendheid |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09 |

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

## Eigenschappen — 43

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `passwordRequiredType` | deviceDefault |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 0 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `validOperatingSystemBuildRanges` | — |
| `wslDistributions` | — |
| `activeFirewallRequired` | false |
| `antiSpywareRequired` | false |
| `antivirusRequired` | true |
| `bitLockerEnabled` | false |
| `codeIntegrityEnabled` | false |
| `configurationManagerComplianceRequired` | false |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `deviceCompliancePolicyScript` | — |
| `deviceThreatProtectionEnabled` | false |
| `earlyLaunchAntiMalwareDriverEnabled` | false |
| `firmwareProtectionEnabled` | false |
| `kernelDmaProtectionEnabled` | false |
| `memoryIntegrityEnabled` | false |
| `mobileOsMaximumVersion` | — |
| `mobileOsMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumVersion` | — |
| `passwordBlockSimple` | false |
| `passwordExpirationDays` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordMinimumLength` | — |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordRequired` | false |
| `passwordRequiredToUnlockFromIdle` | false |
| `requireHealthyDeviceReport` | false |
| `rtpEnabled` | false |
| `secureBootEnabled` | false |
| `signatureOutOfDate` | false |
| `storageRequireEncryption` | false |
| `tpmRequired` | false |
| `virtualizationBasedSecurityEnabled` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
