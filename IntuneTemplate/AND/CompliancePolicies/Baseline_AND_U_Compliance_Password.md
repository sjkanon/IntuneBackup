<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Compliance Password

Toetst of het werkprofiel een toegangscode van minimaal zes tekens met gemiddelde complexiteit vereist, na vijftien minuten vergrendelt en of de opslag versleuteld is.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline-conventie voor compliance; waarden gelijkgetrokken met de PIN-eis van zes tekens in de bestaande App Protection-policy en met de Android-eis in IntuneAdmin. |
| Bestand | [`Baseline_AND_U_Compliance_Password.json`](Baseline_AND_U_Compliance_Password.json) |

> De eis staat op het werkprofiel, niet op het toestel als geheel — dat is bewust bij BYOD: de organisatie stelt geen eisen aan de privékant van een privétoestel. Complexiteit `medium` is de Android-term voor 'geen patroon, geen herhaalde of oplopende reeks'; dat is strenger dan een lengte-eis alleen en is wat Google zelf aanraadt.

## Eigenschappen — 37

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passwordRequired` | true |
| `passwordMinimumLength` | — |
| `passwordRequiredType` | deviceDefault |
| `requiredPasswordComplexity` | medium |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordSignInFailureCountBeforeFactoryReset` | — |
| `workProfileRequirePassword` | true |
| `workProfilePasswordMinimumLength` | 6 |
| `workProfileInactiveBeforeScreenLockInMinutes` | 15 |
| `workProfilePasswordRequiredType` | numericComplex |
| `workProfileRequiredPasswordComplexity` | medium |
| `securityPreventInstallAppsFromUnknownSources` | false |
| `securityDisableUsbDebugging` | false |
| `securityRequireVerifyApps` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `securityBlockJailbrokenDevices` | false |
| `securityRequireSafetyNetAttestationBasicIntegrity` | false |
| `securityRequireSafetyNetAttestationCertifiedDevice` | false |
| `securityRequireGooglePlayServices` | false |
| `securityRequireUpToDateSecurityProviders` | false |
| `securityRequireCompanyPortalAppIntegrity` | false |
| `securityRequiredAndroidSafetyNetEvaluationType` | basic |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | — |
| `storageRequireEncryption` | true |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
