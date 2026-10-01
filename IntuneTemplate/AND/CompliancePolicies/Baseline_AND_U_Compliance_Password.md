<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_AND_U_Compliance_Password.en.md) · [Français](Baseline_AND_U_Compliance_Password.fr.md)

# CXNM - Standard - AND - U - Compliance Password

Toetst of een Android-toestel met persoonlijk werkprofiel een schermvergrendeling van gemiddelde complexiteit heeft, of het werkprofiel daarnaast een eigen code van minimaal zes cijfers (numeriek complex, gemiddelde complexiteit) vraagt die na vijftien minuten vergrendelt, en of de opslag versleuteld is.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| Bron | OpenIntuneBaseline-conventie voor compliance; waarden gelijkgetrokken met de PIN-eis van zes tekens in de bestaande App Protection-policy en met de Android-eis in IntuneAdmin. |
| Bestand | [`Baseline_AND_U_Compliance_Password.json`](Baseline_AND_U_Compliance_Password.json) |

> **Correctie september 2026.** De tekst zei tot nu toe dat de organisatie geen eisen stelt aan de privékant; de policy eiste toen al een toestelvergrendeling (`passwordRequired`, `requiredPasswordComplexity: medium`). De eis blijft en de tekst is rechtgezet: hij vraagt alleen dát er een vergrendeling van gemiddelde complexiteit is, niet welke code, en de organisatie ziet die code niet. Wie dat onaanvaardbaar vindt voor privétoestellen, moet ook de App Protection-eis op toestelcomplexiteit heroverwegen — anders blokkeert App Protection de apps alsnog. Bewust géén `passwordExpirationDays` (NIST SP 800-63B raadt verplichte rotatie af) en géén blokkade van een gedeelde vergrendeling voor toestel en werkprofiel (`blockUnifiedPasswordForWorkProfile`, UniFy W-11): twee codes op een privétoestel levert vooral hulpvragen op, en de toestelcode wordt hier al getoetst. Vijftien minuten is gelijkgetrokken met iOS, macOS en Windows. De instellingen zelf zet CXNM - Standard - AND - U - Work Profile Restrictions; deze policy toetst ze.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01 |

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
