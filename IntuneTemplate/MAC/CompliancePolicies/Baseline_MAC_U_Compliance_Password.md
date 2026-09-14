<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - U - Compliance Password

Toetst of de Mac een wachtwoord vereist en hoe sterk die moet zijn.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | All Users |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline macOS v1.0 — Compliance - U - Password |
| Bestand | [`Baseline_MAC_U_Compliance_Password.json`](Baseline_MAC_U_Compliance_Password.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.7.7 Clear desk en clear screen<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(f) beoordeling van de doeltreffendheid<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 27

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passwordRequired` | true |
| `passwordBlockSimple` | true |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | 8 |
| `passwordMinutesOfInactivityBeforeLock` | 15 |
| `passwordPreviousPasswordBlockCount` | 1 |
| `passwordMinimumCharacterSetCount` | 1 |
| `passwordRequiredType` | alphanumeric |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `systemIntegrityProtectionEnabled` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `storageRequireEncryption` | false |
| `gatekeeperAllowedAppSource` | notConfigured |
| `firewallEnabled` | false |
| `firewallBlockAllIncoming` | false |
| `firewallEnableStealthMode` | false |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 0 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
