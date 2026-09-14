<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Compliance Corporate Password

Toetst of een fully managed of corporate-owned Android-toestel een numeriek complexe code van minimaal zes cijfers heeft, na vijftien minuten vergrendelt, de laatste vijf codes niet hergebruikt en versleuteld is.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Fully-Managed en Corp-Work-Profile - v1.5 (wachtwoorddeel); zonder verloop na 365 dagen, vergrendeltijd 15 in plaats van 5 minuten |
| Bestand | [`Baseline_AND_U_Compliance_Corporate_Password.json`](Baseline_AND_U_Compliance_Corporate_Password.json) |

> Bewust géén `passwordExpirationDays` (UniFy: 365): NIST SP 800-63B raadt verplichte rotatie af. Vijftien minuten in plaats van UniFy's vijf, gelijk aan iOS, macOS, Windows en het werkprofiel; CIS noemt ≤ 2 minuten, UniFy wijkt daar ook bewust van af. De instellingen zelf zet [Baseline] - AND - U - Corporate Device Security; zonder die policy wordt de gebruiker niet gevraagd een code te kiezen die hier aan voldoet.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 28

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `securityBlockJailbrokenDevices` | false |
| `securityRequireSafetyNetAttestationBasicIntegrity` | false |
| `securityRequireSafetyNetAttestationCertifiedDevice` | false |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | — |
| `passwordRequired` | true |
| `passwordMinimumLength` | 6 |
| `passwordMinimumLetterCharacters` | — |
| `passwordMinimumLowerCaseCharacters` | — |
| `passwordMinimumNonLetterCharacters` | — |
| `passwordMinimumNumericCharacters` | — |
| `passwordMinimumSymbolCharacters` | — |
| `passwordMinimumUpperCaseCharacters` | — |
| `passwordRequiredType` | numericComplex |
| `passwordMinutesOfInactivityBeforeLock` | 15 |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordCountToBlock` | 5 |
| `storageRequireEncryption` | true |
| `securityRequireIntuneAppIntegrity` | false |
| `requireNoPendingSystemUpdates` | — |
| `securityRequiredAndroidSafetyNetEvaluationType` | basic |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
