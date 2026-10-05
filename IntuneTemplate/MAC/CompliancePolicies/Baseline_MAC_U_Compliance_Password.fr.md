<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_U_Compliance_Password.md) · [English](Baseline_MAC_U_Compliance_Password.en.md) · **Français**

# [Baseline] - MAC - U - Compliance Password

Vérifie si le Mac exige un mot de passe et quelle doit être sa robustesse.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | All Users |
| Source | OpenIntuneBaseline macOS v1.0 — Compliance - U - Password |
| Fichier | [`Baseline_MAC_U_Compliance_Password.json`](Baseline_MAC_U_Compliance_Password.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.7.7 Bureau propre et écran vide<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(f) évaluation de l'efficacité<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du dépôt CA-Policies s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| 2060 - GRANT - Mobile Apps and Desktop Clients | disabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| 2090 - GRANT - Browser Access On Unmanaged Devices | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| 2130 - GRANT - Admins Compliant Device | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| 2160 - GRANT - Agent Users Compliant Device | report-only | Détermine si le terminal depuis lequel travaille un agent user est conforme. S'il ne l'est pas, cette stratégie bloque l'agent user dès qu'elle quitte le report-only. |
| 3020 - SESSION - BYOD Persistence | report-only | Détermine quel appareil est considéré comme conforme et échappe donc à cette limite de session. Un appareil géré qui devient non conforme y est soumis. |
| 3040 - SESSION - Block File Downloads On Unmanaged Devices | disabled | Détermine quel appareil est considéré comme conforme et peut donc télécharger. Un appareil géré qui devient non conforme n'a plus que le navigateur sans téléchargement. |

## Propriétés — 27

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passwordRequired` | true |
| `passwordBlockSimple` | true |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | 8 |
| `passwordMinutesOfInactivityBeforeLock` | 15 |
| `passwordPreviousPasswordBlockCount` | 1 |
| `passwordMinimumCharacterSetCount` | 1 |
| `passwordRequiredType` | alphanumeric |
| `osMinimumVersion` | — |
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
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 0 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
