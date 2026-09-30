<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Compliance_OS_Version.md) · [English](Baseline_WIN_U_Compliance_OS_Version.en.md) · **Français**

# CXNM - Standard - WIN - U - Compliance OS Version

Vérifie que l'appareil exécute une version de Windows capable d'appliquer réellement la baseline : au minimum Windows 11 22H2.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | Policy propre ; le seuil minimal découle de ce que la baseline exige déjà elle-même — Account Lockout nécessite 22H2 avec KB5053657 ou 24H2, Administrator Protection et Windows Protected Print nécessitent 24H2 |
| Fichier | [`Baseline_WIN_U_Compliance_OS_Version.json`](Baseline_WIN_U_Compliance_OS_Version.json) |

> **Cette valeur vieillit et doit être revue.** 10.0.22621 correspond à Windows 11 22H2. Exécutez `node scripts/check-osversion.js` pour voir de combien elle est en retard sur la version n-1 d'endoflife.date ; ce rapport ne bloque volontairement rien, car dès qu'un seuil minimal obsolète fait passer le build au rouge, quelqu'un augmente le nombre pour le repasser au vert. L'augmenter est une décision et donc une PR — ce seuil minimal est un plancher de capacités (voir `ondergrens`) ; le laisser suivre automatiquement la version n-1 supprimerait justement la raison pour laquelle il est fixé à 22H2.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(f) évaluation de l'efficacité |
| CIS Controls v8.1 | 2.2 Ensure Authorized Software is Currently Supported |
| NIST CSF 2.0 | DE.CM-09<br>PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 38

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passwordRequired` | false |
| `passwordBlockSimple` | false |
| `passwordRequiredToUnlockFromIdle` | false |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordRequiredType` | deviceDefault |
| `passwordPreviousPasswordBlockCount` | — |
| `requireHealthyDeviceReport` | false |
| `osMinimumVersion` | 10.0.22621 |
| `osMaximumVersion` | — |
| `mobileOsMinimumVersion` | — |
| `mobileOsMaximumVersion` | — |
| `earlyLaunchAntiMalwareDriverEnabled` | false |
| `bitLockerEnabled` | false |
| `secureBootEnabled` | false |
| `codeIntegrityEnabled` | false |
| `storageRequireEncryption` | false |
| `activeFirewallRequired` | false |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `signatureOutOfDate` | false |
| `rtpEnabled` | false |
| `antivirusRequired` | false |
| `antiSpywareRequired` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `configurationManagerComplianceRequired` | false |
| `tpmRequired` | false |
| `deviceCompliancePolicyScript` | — |
| `validOperatingSystemBuildRanges` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 72 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
