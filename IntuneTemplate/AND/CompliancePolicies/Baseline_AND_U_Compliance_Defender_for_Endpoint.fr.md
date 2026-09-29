<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Compliance_Defender_for_Endpoint.md) · [English](Baseline_AND_U_Compliance_Defender_for_Endpoint.en.md) · **Français**

# [Baseline] - AND - U - Compliance Defender for Endpoint

Marque un appareil Android avec profil professionnel personnel comme non conforme lorsque Defender for Endpoint lui attribue un score de risque supérieur à faible.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Defender - Personal-Devices - v1.5 ; comparé à IntuneAdmin Baseline - Personally-owned work profile - Microsoft Defender for Endpoint (niveau medium) |
| Fichier | [`Baseline_AND_U_Compliance_Defender_for_Endpoint.json`](Baseline_AND_U_Compliance_Defender_for_Endpoint.json) |

> Trois prérequis, sinon chaque appareil est non conforme ou rien n'est mesuré : (1) une licence Defender for Endpoint (P1/P2, Business, ou Microsoft 365 E5/Business Premium) ; (2) le connecteur Defender–Intune activé, avec *Connect Android devices to Microsoft Defender for Endpoint* sur On ; (3) l'application Microsoft Defender (`com.microsoft.scmx`) déployée comme application Managed Google Play obligatoire, de préférence avec la configuration d'application de extras/android/app-configuration afin que l'intégration se fasse sans action de l'utilisateur. Volontairement une policy distincte et non dans Device Health : ainsi, vous ne pouvez l'affecter qu'une fois le connecteur en place, et une licence manquante reste limitée à cette seule vérification. Il n'y a pas de chevauchement : les policies Device Health laissent `deviceThreatProtectionEnabled` à false, ce qui signifie en conformité « non requis » — aucun conflit. Qui utilise un autre partenaire Mobile Threat Defense définit `deviceThreatProtectionRequiredSecurityLevel` au lieu de `advancedThreatProtectionRequiredSecurityLevel`.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.16 Activités de surveillance |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 9

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
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

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
