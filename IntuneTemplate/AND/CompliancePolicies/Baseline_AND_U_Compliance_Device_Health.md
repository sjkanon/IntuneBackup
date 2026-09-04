<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Compliance Device Health

Merkt een Android-toestel als niet-compliant wanneer het geroot is, USB-foutopsporing aanstaat, apps van buiten de Play Store zijn toegestaan of Play Integrity niet hardwarematig bevestigd kan worden.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline-conventie voor compliance, inhoud vergeleken met IntuneAdmin (Personally-owned work profile - Device Health) en UniFy-Endpoint Android BYOD. |
| Bestand | [`Baseline_AND_U_Compliance_Device_Health.json`](Baseline_AND_U_Compliance_Device_Health.json) |

> Als `androidWorkProfileCompliancePolicy` geschreven — het persoonlijke werkprofiel, dat past bij de BYOD-inrichting die er nu is. Wordt er ooit fully managed of dedicated ingeschreven, dan is er een tweede policy nodig van het type `androidDeviceOwnerCompliancePolicy`; de instellingen heten daar anders. `hardwareBacked` sluit oudere toestellen zonder ondersteunde secure element uit — dat is bedoeld, maar controleer het tegen de vloot vóór je toewijst. Sinds september 2026 eist deze policy ook een minimale OS-versie (12.0); die waarde veroudert en hoort bij elke grote release te worden nagelopen.

## Eigenschappen — 37

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passwordRequired` | false |
| `passwordMinimumLength` | — |
| `passwordRequiredType` | deviceDefault |
| `requiredPasswordComplexity` | none |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordSignInFailureCountBeforeFactoryReset` | — |
| `workProfileRequirePassword` | false |
| `workProfilePasswordMinimumLength` | — |
| `workProfileInactiveBeforeScreenLockInMinutes` | — |
| `workProfilePasswordRequiredType` | deviceDefault |
| `workProfileRequiredPasswordComplexity` | none |
| `securityPreventInstallAppsFromUnknownSources` | true |
| `securityDisableUsbDebugging` | true |
| `securityRequireVerifyApps` | true |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `securityBlockJailbrokenDevices` | true |
| `securityRequireSafetyNetAttestationBasicIntegrity` | true |
| `securityRequireSafetyNetAttestationCertifiedDevice` | true |
| `securityRequireGooglePlayServices` | true |
| `securityRequireUpToDateSecurityProviders` | true |
| `securityRequireCompanyPortalAppIntegrity` | true |
| `securityRequiredAndroidSafetyNetEvaluationType` | hardwareBacked |
| `osMinimumVersion` | 12.0 |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | — |
| `storageRequireEncryption` | false |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
