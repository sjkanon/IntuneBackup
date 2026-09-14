<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - U - Compliance Password

Toetst of een iPhone of iPad een toegangscode van minimaal zes tekens vereist, geen eenvoudige code, en na vijftien minuten vergrendelt.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline-conventie voor compliance; waarden gelijkgetrokken met de PIN-eis van zes tekens in de bestaande App Protection-policy. |
| Bestand | [`Baseline_IOS_U_Compliance_Password.json`](Baseline_IOS_U_Compliance_Password.json) |

> Bewust géén `passcodeExpirationDays`: het periodiek laten wijzigen van een toestelcode leidt aantoonbaar tot zwakkere codes, en NIST SP 800-63B raadt verplichte rotatie zonder aanleiding expliciet af. Vijftien minuten is gelijkgetrokken met de macOS- en Windows-compliancepolicies in de baseline.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 25

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passcodeRequired` | true |
| `passcodeBlockSimple` | true |
| `passcodeMinimumLength` | 6 |
| `passcodeMinutesOfInactivityBeforeLock` | 15 |
| `passcodeMinutesOfInactivityBeforeScreenTimeout` | 15 |
| `passcodeExpirationDays` | — |
| `passcodePreviousPasscodeBlockCount` | — |
| `passcodeMinimumCharacterSetCount` | — |
| `passcodeRequiredType` | deviceDefault |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `securityBlockJailbrokenDevices` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
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
