<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_AND_U_Compliance_Device_Health.en.md) · [Français](Baseline_AND_U_Compliance_Device_Health.fr.md)

# [Baseline] - AND - U - Compliance Device Health

Merkt een Android-toestel met persoonlijk werkprofiel als niet-compliant wanneer het geroot is, USB-foutopsporing aanstaat, apps van buiten de Play Store zijn toegestaan, Play Integrity niet hardwarematig bevestigd kan worden, of de laatste beveiligingspatch ouder is dan de ondergrens.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| Bron | OpenIntuneBaseline-conventie voor compliance, inhoud vergeleken met IntuneAdmin (Personally-owned work profile - Device Health) en UniFy-Endpoint Android BYOD. |
| Bestand | [`Baseline_AND_U_Compliance_Device_Health.json`](Baseline_AND_U_Compliance_Device_Health.json) |

> Als `androidWorkProfileCompliancePolicy` geschreven — het persoonlijke werkprofiel. `hardwareBacked` sluit oudere toestellen zonder ondersteunde hardware-attestatie uit — dat is bedoeld, maar controleer het tegen de vloot vóór je toewijst. Sinds september 2026 eist deze policy ook een beveiligingspatch van 2026-03-01 of later (zes maanden terug, gelijk aan de waarschuwing in App Protection); toestellen van fabrikanten die per kwartaal patchen blijven daarmee ruim binnen. De OS-ondergrens (12.0) en de patchdatum verouderen: draai `node scripts/check-osversion.js` om te zien hoe ver ze achterlopen. Beide zijn actualiteitsdoelen (zie `ondergrens`) en mogen meebewegen, maar niet zonder te kijken hoeveel toestellen eronder zitten. Defender for Endpoint staat bewust in een aparte policy (Compliance Defender for Endpoint), omdat die een licentie en connector vraagt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.7 Bescherming tegen malware<br>A.8.8 Beheer van technische kwetsbaarheden<br>A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 2.3 Address Unauthorized Software<br>4.1 Establish and Maintain a Secure Configuration Process<br>7.3 Perform Automated Operating System Patch Management<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-02<br>PR.PS-05<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de CA-Policies-repo leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| 2060 - GRANT - Mobile Apps and Desktop Clients | disabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| 2090 - GRANT - Browser Access On Unmanaged Devices | enabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| 2130 - GRANT - Admins Compliant Device | enabled | Bepaalt mee of een apparaat compliant is. Voldoet een apparaat hier niet aan, dan wordt het niet-compliant en houdt de compliant-eis van Conditional Access het tegen. |
| 2150 - GRANT - Cloud PC Mobile Access | enabled | De andere manier: een compliant toestel. Bepaalt mee of een iPhone of Android-toestel als compliant telt. |
| 3020 - SESSION - BYOD Persistence | report-only | Bepaalt welk apparaat als compliant telt en dus búiten deze sessiebegrenzing valt. Een beheerd apparaat dat niet-compliant wordt, valt eronder. |
| 3040 - SESSION - Block File Downloads On Unmanaged Devices | disabled | Bepaalt welk apparaat als compliant telt en dus mag downloaden. Een beheerd apparaat dat niet-compliant wordt, krijgt alleen nog de browser zonder downloads. |

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
| `minAndroidSecurityPatchLevel` | 2026-03-01 |
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
