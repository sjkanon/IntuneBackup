<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_U_Compliance_OS_Version.md) · [English](Baseline_MAC_U_Compliance_OS_Version.en.md) · **Français**

# [Baseline] - MAC - U - Compliance OS Version

Vérifie si le Mac exécute macOS 14 ou une version ultérieure — la version requise par la policy de mise à jour déclarative de la baseline.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| checkId | aucun — le moteur de la plateforme n'a pas de correspondance pour ce type de policy |
| Source | Policy propre ; le minimum découle de ce que la baseline exige déjà elle-même — MAC - D - Software Updates utilise une politique de mise à jour déclarative (DDM), qui requiert macOS 14 |
| Fichier | [`Baseline_MAC_U_Compliance_OS_Version.json`](Baseline_MAC_U_Compliance_OS_Version.json) |

> **Cette valeur vieillit et doit être revue.** macOS 14 est le minimum parce que le profil de mise à jour l'exige, et non parce que 14 serait encore la version la plus récente. Exécutez `node scripts/check-osversion.js` pour voir de combien il est en retard sur la version n-1 d'endoflife.date ; ce rapport ne bloque rien et ne doit pas le faire. Le relever est une décision, donc une PR — ce minimum est un plancher de capacité (voir `ondergrens`), le faire suivre automatiquement la version n-1 supprimerait justement la raison pour laquelle il est fixé à 14.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(f) évaluation de l'efficacité |
| CIS Controls v8.1 | 2.2 Ensure Authorized Software is Currently Supported |
| NIST CSF 2.0 | DE.CM-09<br>PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 27

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passwordRequired` | false |
| `passwordBlockSimple` | false |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | — |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordRequiredType` | deviceDefault |
| `osMinimumVersion` | 14.0 |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `systemIntegrityProtectionEnabled` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `storageRequireEncryption` | false |
| `gatekeeperAllowedAppSource` | notConfigured |
| `firewallEnabled` | false |
| `firewallBlockAllIncoming` | false |
| `firewallEnableStealthMode` | false |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 72 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
