<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - D - Compliance Dedicated Device Health

Merkt een dedicated Android-toestel (kiosk of gedeeld) als niet-compliant wanneer het geroot is, Play Integrity niet hardwarematig slaagt, de Intune-app gemanipuleerd is, de opslag niet versleuteld is of de laatste beveiligingspatch ouder is dan de ondergrens.

| | |
|---|---|
| Platform | Android |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Corp-Dedicated - Kiosk en Shared - v1.5; zonder wachtwoord- en OS-versie-eisen, patchniveau toegevoegd |
| Bestand | [`Baseline_AND_D_Compliance_Dedicated_Device_Health.json`](Baseline_AND_D_Compliance_Dedicated_Device_Health.json) |

> Bewust geen toestelcode: op een kiosk met één app is die er vaak niet, en op een gedeeld toestel regelt Managed Home Screen de sessie-PIN. Bewust geen OS-ondergrens: robuuste toestellen (scanners, kassa's) blijven lang op een oudere hoofdversie maar krijgen via de fabrikant nog wel patches — de patchdatum (2026-03-01) is daar de eerlijke maat. Controleer vóór toewijzen of de vloot hardware-attestatie haalt; oude kioskhardware faalt daar soms direct op (UniFy W-18). Toestellen in Entra shared device mode krijgen daarnaast de gebruikerspolicies van wie er is aangemeld niet — Intune past op dedicated toestellen alleen apparaattoewijzingen toe.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.8 Beheer van technische kwetsbaarheden<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.1 Establish and Maintain a Secure Configuration Process<br>7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02<br>PR.DS-01<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 28

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `securityBlockJailbrokenDevices` | true |
| `securityRequireSafetyNetAttestationBasicIntegrity` | true |
| `securityRequireSafetyNetAttestationCertifiedDevice` | true |
| `osMinimumVersion` | — |
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
| `storageRequireEncryption` | true |
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
