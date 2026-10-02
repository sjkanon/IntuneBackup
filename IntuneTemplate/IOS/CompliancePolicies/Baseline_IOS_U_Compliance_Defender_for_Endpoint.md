<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_IOS_U_Compliance_Defender_for_Endpoint.en.md) · [Français](Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md)

# CXNM - Standard - IOS - U - Compliance Defender for Endpoint

Merkt een iPhone of iPad als niet-compliant zodra Microsoft Defender for Endpoint het machinerisico hoger dan Medium inschat.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| Bron | IntuneAdmin — Apple iOS Compliance/Baseline - iOSiPadOS - Microsoft Defender for Endpoint en UniFy iOS/iPadOS Baseline v1.2 — CP - Compliance - MDE - BYOD Devices (beide Medium); UniFy Corporate eist Low |
| Bestand | [`Baseline_IOS_U_Compliance_Defender_for_Endpoint.json`](Baseline_IOS_U_Compliance_Defender_for_Endpoint.json) |

> Bewust één policy met Medium in plaats van UniFy's Low voor bedrijfstoestellen: Low maakt een toestel al bij een laag risico niet-compliant, en dat vraagt eerst ervaring met hoe vaak dat voorkomt. Een eigen policy naast Compliance Device Health, zodat een tenant zonder MDE-licentie Device Health gewoon kan blijven gebruiken; compliance-policies worden los geëvalueerd en conflicteren niet. Blokkeeractie na 24 uur, gelijk aan de andere iOS-compliancepolicies. Het veld advancedThreatProtectionRequiredSecurityLevel staat niet in pl4nty DCv1 voor iOS maar wel in Graph beta iosCompliancePolicy en in beide bronexports. Onboarding: CXNM - Standard - IOS - D - Defender for Endpoint Onboarding Supervised en … Unsupervised; app-configuratie in IntuneTemplate/IOS/AppConfiguration.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.16 Monitoringactiviteiten<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>PR.AA-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de [CA-Policies-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/) leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| [2060 - GRANT - Mobile Apps and Desktop Clients](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2060__GRANT__Mobile_Apps_and_Desktop_Clients.md) | disabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| [2090 - GRANT - Browser Access On Unmanaged Devices](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2090__GRANT__Browser_Access_On_Unmanaged_Devices.md) | enabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| [2130 - GRANT - Admins Compliant Device](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2130__GRANT__Admins_Compliant_Device.md) | enabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| [2150 - GRANT - Cloud PC Mobile Access](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.md) | enabled | De andere manier: een compliant toestel. Bepaalt mee of een iPhone of Android-toestel als compliant telt. |
| [3020 - SESSION - BYOD Persistence](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__3020__SESSION__BYOD_Persistence.md) | report-only | Bepaalt welk apparaat als compliant telt en dus búiten deze sessiebegrenzing valt. Een beheerd apparaat dat niet-compliant wordt, valt eronder. |
| [3040 - SESSION - Block File Downloads On Unmanaged Devices](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.md) | disabled | Bepaalt welk apparaat als compliant telt en dus mag downloaden. Een beheerd apparaat dat niet-compliant wordt, krijgt alleen nog de browser zonder downloads. |

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
