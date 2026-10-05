<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_U_Compliance_Password.md) · [English](Baseline_IOS_U_Compliance_Password.en.md) · **Français**

# [Baseline] - IOS - U - Compliance Password

Vérifie si un iPhone ou iPad exige un code d'accès d'au moins six caractères, sans code simple, et se verrouille après quinze minutes.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | Convention OpenIntuneBaseline pour la conformité ; valeurs alignées sur l'exigence d'un PIN de six caractères de la policy App Protection existante. |
| Fichier | [`Baseline_IOS_U_Compliance_Password.json`](Baseline_IOS_U_Compliance_Password.json) |

> Volontairement pas de `passcodeExpirationDays` : imposer un changement périodique du code de l'appareil conduit manifestement à des codes plus faibles, et NIST SP 800-63B déconseille explicitement la rotation obligatoire sans motif. Quinze minutes est aligné sur les policies de conformité macOS et Windows de la baseline.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03 |

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
| `passcodeRequired` | true |
| `passcodeBlockSimple` | true |
| `passcodeMinimumLength` | 6 |
| `passcodeMinutesOfInactivityBeforeLock` | 15 |
| `passcodeMinutesOfInactivityBeforeScreenTimeout` | 15 |
| `passcodeExpirationDays` | — |
| `passcodePreviousPasscodeBlockCount` | — |
| `passcodeMinimumCharacterSetCount` | — |
| `passcodeRequiredType` | deviceDefault |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `securityBlockJailbrokenDevices` | false |
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
