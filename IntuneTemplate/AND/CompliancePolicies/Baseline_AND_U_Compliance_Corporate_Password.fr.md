<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Compliance_Corporate_Password.md) · [English](Baseline_AND_U_Compliance_Corporate_Password.en.md) · **Français**

# [Baseline] - AND - U - Compliance Corporate Password

Vérifie si un appareil Android fully managed ou corporate-owned dispose d'un code numérique complexe d'au moins six chiffres, se verrouille après quinze minutes, ne réutilise pas les cinq derniers codes et est chiffré.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Fully-Managed et Corp-Work-Profile - v1.5 (partie mot de passe) ; sans expiration après 365 jours, délai de verrouillage de 15 au lieu de 5 minutes |
| Fichier | [`Baseline_AND_U_Compliance_Corporate_Password.json`](Baseline_AND_U_Compliance_Corporate_Password.json) |

> Volontairement pas de `passwordExpirationDays` (UniFy : 365) : NIST SP 800-63B déconseille la rotation obligatoire. Quinze minutes au lieu des cinq d'UniFy, comme pour iOS, macOS, Windows et le profil professionnel ; CIS indique ≤ 2 minutes, et UniFy s'en écarte également volontairement. Les paramètres eux-mêmes sont définis par [Baseline] - AND - U - Corporate Device Security ; sans cette policy, l'utilisateur n'est pas invité à choisir un code conforme à ces exigences.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01 |

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

## Propriétés — 28

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `securityBlockJailbrokenDevices` | false |
| `securityRequireSafetyNetAttestationBasicIntegrity` | false |
| `securityRequireSafetyNetAttestationCertifiedDevice` | false |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | — |
| `passwordRequired` | true |
| `passwordMinimumLength` | 6 |
| `passwordMinimumLetterCharacters` | — |
| `passwordMinimumLowerCaseCharacters` | — |
| `passwordMinimumNonLetterCharacters` | — |
| `passwordMinimumNumericCharacters` | — |
| `passwordMinimumSymbolCharacters` | — |
| `passwordMinimumUpperCaseCharacters` | — |
| `passwordRequiredType` | numericComplex |
| `passwordMinutesOfInactivityBeforeLock` | 15 |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordCountToBlock` | 5 |
| `storageRequireEncryption` | true |
| `securityRequireIntuneAppIntegrity` | false |
| `requireNoPendingSystemUpdates` | — |
| `securityRequiredAndroidSafetyNetEvaluationType` | basic |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
