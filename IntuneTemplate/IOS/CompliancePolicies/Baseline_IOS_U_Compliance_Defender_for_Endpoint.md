<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - U - Compliance Defender for Endpoint

Merkt een iPhone of iPad als niet-compliant zodra Microsoft Defender for Endpoint het machinerisico hoger dan Medium inschat.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | IntuneAdmin — Apple iOS Compliance/Baseline - iOSiPadOS - Microsoft Defender for Endpoint en UniFy iOS/iPadOS Baseline v1.2 — CP - Compliance - MDE - BYOD Devices (beide Medium); UniFy Corporate eist Low |
| Bestand | [`Baseline_IOS_U_Compliance_Defender_for_Endpoint.json`](Baseline_IOS_U_Compliance_Defender_for_Endpoint.json) |

> Bewust één policy met Medium in plaats van UniFy's Low voor bedrijfstoestellen: Low maakt een toestel al bij een laag risico niet-compliant, en dat vraagt eerst ervaring met hoe vaak dat voorkomt. Een eigen policy naast Compliance Device Health, zodat een tenant zonder MDE-licentie Device Health gewoon kan blijven gebruiken; compliance-policies worden los geëvalueerd en conflicteren niet. Blokkeeractie na 24 uur, gelijk aan de andere iOS-compliancepolicies. Het veld advancedThreatProtectionRequiredSecurityLevel staat niet in pl4nty DCv1 voor iOS maar wel in Graph beta iosCompliancePolicy en in beide bronexports. Onboarding: [Baseline] - IOS - D - Defender for Endpoint Onboarding Supervised en … Unsupervised; app-configuratie in extras/ios/app-configuration.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.16 Monitoringactiviteiten<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>PR.AA-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 25

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passcodeRequired` | false |
| `passcodeBlockSimple` | false |
| `passcodeMinimumLength` | — |
| `passcodeMinutesOfInactivityBeforeLock` | — |
| `passcodeMinutesOfInactivityBeforeScreenTimeout` | — |
| `passcodeExpirationDays` | — |
| `passcodePreviousPasscodeBlockCount` | — |
| `passcodeMinimumCharacterSetCount` | — |
| `passcodeRequiredType` | deviceDefault |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `securityBlockJailbrokenDevices` | false |
| `deviceThreatProtectionEnabled` | true |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | medium |
| `managedEmailProfileRequired` | false |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
