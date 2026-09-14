<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Compliance Defender for Endpoint

Merkt een Android-toestel met persoonlijk werkprofiel als niet-compliant wanneer Defender for Endpoint er een risicoscore hoger dan laag aan geeft.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Defender - Personal-Devices - v1.5; vergeleken met IntuneAdmin Baseline - Personally-owned work profile - Microsoft Defender for Endpoint (niveau medium) |
| Bestand | [`Baseline_AND_U_Compliance_Defender_for_Endpoint.json`](Baseline_AND_U_Compliance_Defender_for_Endpoint.json) |

> Drie voorwaarden, anders is elk toestel niet-compliant of meet hij niets: (1) een licentie voor Defender for Endpoint (P1/P2, Business, of Microsoft 365 E5/Business Premium); (2) de Defender–Intune-connector aan, met *Connect Android devices to Microsoft Defender for Endpoint* op On; (3) de app Microsoft Defender (`com.microsoft.scmx`) als Managed Google Play-app verplicht uitgerold, bij voorkeur met de app-configuratie in extras/android/app-configuration zodat de onboarding zonder handelingen van de gebruiker gebeurt. Bewust een aparte policy en niet in Device Health: zo kun je hem pas toewijzen als de connector staat, en blijft een ontbrekende licentie beperkt tot deze ene toets. Er is geen overlap: de Device Health-policies laten `deviceThreatProtectionEnabled` op false, wat in compliance "niet vereist" betekent — geen conflict. Wie een andere Mobile Threat Defense-partner gebruikt, zet `deviceThreatProtectionRequiredSecurityLevel` in plaats van `advancedThreatProtectionRequiredSecurityLevel`.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 9

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `deviceThreatProtectionEnabled` | true |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | low |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
