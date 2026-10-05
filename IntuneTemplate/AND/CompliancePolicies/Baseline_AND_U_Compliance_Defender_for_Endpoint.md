<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_AND_U_Compliance_Defender_for_Endpoint.en.md) · [Français](Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md)

# [Baseline] - AND - U - Compliance Defender for Endpoint

Merkt een Android-toestel met persoonlijk werkprofiel als niet-compliant wanneer Defender for Endpoint er een risicoscore hoger dan laag aan geeft.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Defender - Personal-Devices - v1.5; vergeleken met IntuneAdmin Baseline - Personally-owned work profile - Microsoft Defender for Endpoint (niveau medium) |
| Bestand | [`Baseline_AND_U_Compliance_Defender_for_Endpoint.json`](Baseline_AND_U_Compliance_Defender_for_Endpoint.json) |

> Drie voorwaarden, anders is elk toestel niet-compliant of meet hij niets: (1) een licentie voor Defender for Endpoint (P1/P2, Business, of Microsoft 365 E5/Business Premium); (2) de Defender–Intune-connector aan, met *Connect Android devices to Microsoft Defender for Endpoint* op On; (3) de app Microsoft Defender (`com.microsoft.scmx`) als Managed Google Play-app verplicht uitgerold, bij voorkeur met de app-configuratie in IntuneTemplate/AND/Enrollment/app-configuration zodat de onboarding zonder handelingen van de gebruiker gebeurt. Bewust een aparte policy en niet in Device Health: zo kun je hem pas toewijzen als de connector staat, en blijft een ontbrekende licentie beperkt tot deze ene toets. Er is geen overlap: de Device Health-policies laten `deviceThreatProtectionEnabled` op false, wat in compliance "niet vereist" betekent — geen conflict. Wie een andere Mobile Threat Defense-partner gebruikt, zet `deviceThreatProtectionRequiredSecurityLevel` in plaats van `advancedThreatProtectionRequiredSecurityLevel`.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

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
