<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Compliance Corporate Device Health

Merkt een fully managed of corporate-owned Android-toestel als niet-compliant wanneer het geroot is, Play Integrity niet hardwarematig slaagt, de Intune-app gemanipuleerd is, het onder Android 16 draait of de laatste beveiligingspatch ouder is dan de ondergrens.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Fully-Managed en Corp-Work-Profile - v1.5 (gezondheidsdeel), vergeleken met IntuneAdmin Baseline - Android Enterprise - Device Health; OS-ondergrens van 13.0 naar n-1 (16.0) en patchniveau toegevoegd |
| Bestand | [`Baseline_AND_U_Compliance_Corporate_Device_Health.json`](Baseline_AND_U_Compliance_Corporate_Device_Health.json) |

> OS-ondergrens 16.0 is n-1 (Android 17 verscheen op 16 juni 2026): een toestel op de vorige hoofdversie blijft compliant, Android 15 niet. Dat is strenger dan UniFy (13.0) en dan de werkprofielvariant (12.0), en bewust: de organisatie kiest deze hardware zelf. Kijk vóór toewijzen in het Intune-rapport hoeveel corporate toestellen onder 16 zitten; zijn dat er veel, zet de waarde tijdelijk op 15.0 in plaats van de policy niet toe te wijzen. Patchdatum 2026-03-01, gelijk aan de rest van de Android-set. Beide verouderen: `node scripts/check-osversion.js`. Blokkeeractie na 24 uur respijt, gelijk aan de andere compliancepolicies in de baseline (UniFy stuurt daarnaast direct een pushmelding). Wachtwoord en versleuteling staan in Compliance Corporate Password, Defender in Compliance Corporate Defender for Endpoint.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.7 Bescherming tegen malware<br>A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-02<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 28

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `securityBlockJailbrokenDevices` | true |
| `securityRequireSafetyNetAttestationBasicIntegrity` | true |
| `securityRequireSafetyNetAttestationCertifiedDevice` | true |
| `osMinimumVersion` | 16.0 |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | 2026-03-01 |
| `passwordRequired` | false |
| `passwordMinimumLength` | — |
| `passwordMinimumLetterCharacters` | — |
| `passwordMinimumLowerCaseCharacters` | — |
| `passwordMinimumNonLetterCharacters` | — |
| `passwordMinimumNumericCharacters` | — |
| `passwordMinimumSymbolCharacters` | — |
| `passwordMinimumUpperCaseCharacters` | — |
| `passwordRequiredType` | deviceDefault |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordCountToBlock` | — |
| `storageRequireEncryption` | false |
| `securityRequireIntuneAppIntegrity` | true |
| `requireNoPendingSystemUpdates` | — |
| `securityRequiredAndroidSafetyNetEvaluationType` | hardwareBacked |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
