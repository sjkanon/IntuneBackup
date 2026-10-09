<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_U_Compliance_Device_Health.md) · [English](Baseline_IOS_U_Compliance_Device_Health.en.md) · **Français**

# [Baseline] - IOS - U - Compliance Device Health

Marque comme non conforme un iPhone ou iPad qui a été jailbreaké.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | Convention OpenIntuneBaseline pour la conformité, contenu comparé avec IntuneAdmin (Baseline - iOSiPadOS - Device Health) et UniFy-Endpoint iOS BYOD. |
| Fichier | [`Baseline_IOS_U_Compliance_Device_Health.json`](Baseline_IOS_U_Compliance_Device_Health.json) |

> Action de blocage après un délai de grâce de 24 heures, afin que l'utilisateur reçoive d'abord une notification. Ne l'affectez que lorsque des appareils iOS sont réellement inscrits ; sur un tenant sans inscriptions, elle ne produit qu'un rapport vide. Depuis septembre 2026, cette policy exige aussi une version minimale de l'OS ; depuis octobre 2026, c'est 18.0, car Intune lui-même (Portail d'entreprise et app protection) demande iOS 18 ou ultérieur — un appareil en dessous ne peut de toute façon plus s'inscrire. Cette valeur vieillit : exécutez `node scripts/check-osversion.js` pour voir de combien elle est en retard sur la version n-1 d'endoflife.date. Ce rapport ne bloque rien et ne doit pas le faire — relever la valeur est une décision et donc une PR. Ce plancher est un objectif d'actualité (voir `ondergrens`) et peut donc évoluer, mais pas sans vérifier combien d'appareils se trouvent en dessous.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.7 Protection contre les programmes malveillants<br>A.5.15 Contrôle d'accès |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du dépôt CA-Policies s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| 2060 - GRANT - Mobile Apps and Desktop Clients | disabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| 2090 - GRANT - Browser Access On Unmanaged Devices | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| 2130 - GRANT - Admins Compliant Device | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| 2150 - GRANT - Cloud PC Mobile Access | enabled | L'autre façon : un appareil conforme. Contribue à déterminer si un iPhone ou un appareil Android est considéré comme conforme. |
| 3020 - SESSION - BYOD Persistence | report-only | Détermine quel appareil est considéré comme conforme et échappe donc à cette limite de session. Un appareil géré qui devient non conforme y est soumis. |
| 3040 - SESSION - Block File Downloads On Unmanaged Devices | disabled | Détermine quel appareil est considéré comme conforme et peut donc télécharger. Un appareil géré qui devient non conforme n'a plus que le navigateur sans téléchargement. |

## Propriétés — 25

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passcodeRequired` | false |
| `passcodeBlockSimple` | false |
| `passcodeMinimumLength` | — |
| `passcodeMinutesOfInactivityBeforeLock` | — |
| `passcodeMinutesOfInactivityBeforeScreenTimeout` | — |
| `passcodeExpirationDays` | — |
| `passcodePreviousPasscodeBlockCount` | — |
| `passcodeMinimumCharacterSetCount` | — |
| `passcodeRequiredType` | deviceDefault |
| `osMinimumVersion` | 18.0 |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `securityBlockJailbrokenDevices` | true |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `managedEmailProfileRequired` | false |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
