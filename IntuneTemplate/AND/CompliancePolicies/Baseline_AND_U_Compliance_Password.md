<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Compliance Password

Toetst of een Android-toestel met persoonlijk werkprofiel een schermvergrendeling van gemiddelde complexiteit heeft, of het werkprofiel daarnaast een eigen code van minimaal zes cijfers (numeriek complex, gemiddelde complexiteit) vraagt die na vijftien minuten vergrendelt, en of de opslag versleuteld is.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline-conventie voor compliance; waarden gelijkgetrokken met de PIN-eis van zes tekens in de bestaande App Protection-policy en met de Android-eis in IntuneAdmin. |
| Bestand | [`Baseline_AND_U_Compliance_Password.json`](Baseline_AND_U_Compliance_Password.json) |

> **Correctie september 2026.** De tekst zei tot nu toe dat de organisatie geen eisen stelt aan de privékant; de policy eiste toen al een toestelvergrendeling (`passwordRequired`, `requiredPasswordComplexity: medium`). De eis blijft en de tekst is rechtgezet: hij vraagt alleen dát er een vergrendeling van gemiddelde complexiteit is, niet welke code, en de organisatie ziet die code niet. Wie dat onaanvaardbaar vindt voor privétoestellen, moet ook de App Protection-eis op toestelcomplexiteit heroverwegen — anders blokkeert App Protection de apps alsnog. Bewust géén `passwordExpirationDays` (NIST SP 800-63B raadt verplichte rotatie af) en géén blokkade van een gedeelde vergrendeling voor toestel en werkprofiel (`blockUnifiedPasswordForWorkProfile`, UniFy W-11): twee codes op een privétoestel levert vooral hulpvragen op, en de toestelcode wordt hier al getoetst. Vijftien minuten is gelijkgetrokken met iOS, macOS en Windows. De instellingen zelf zet [Baseline] - AND - U - Work Profile Restrictions; deze policy toetst ze.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
