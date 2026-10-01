<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Compliance_Password.md) · [English](Baseline_AND_U_Compliance_Password.en.md) · **Français**

# CXNM - Standard - AND - U - Compliance Password

Vérifie si un appareil Android avec profil professionnel personnel dispose d'un verrouillage d'écran de complexité moyenne, si le profil professionnel exige en outre son propre code d'au moins six chiffres (numérique complexe, complexité moyenne) qui se verrouille après quinze minutes, et si le stockage est chiffré.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | Convention OpenIntuneBaseline pour la conformité ; valeurs alignées sur l'exigence de PIN à six caractères de la policy App Protection existante et sur l'exigence Android d'IntuneAdmin. |
| Fichier | [`Baseline_AND_U_Compliance_Password.json`](Baseline_AND_U_Compliance_Password.json) |

> **Correction septembre 2026.** Le texte indiquait jusqu'ici que l'organisation n'impose aucune exigence côté personnel ; la policy exigeait pourtant déjà un verrouillage de l'appareil (`passwordRequired`, `requiredPasswordComplexity: medium`). L'exigence est maintenue et le texte a été rectifié : elle demande seulement qu'il existe un verrouillage de complexité moyenne, pas quel code, et l'organisation ne voit pas ce code. Qui juge cela inacceptable pour des appareils personnels doit aussi reconsidérer l'exigence App Protection sur la complexité de l'appareil — sinon App Protection bloque quand même les applications. Volontairement pas de `passwordExpirationDays` (NIST SP 800-63B déconseille la rotation obligatoire) ni de blocage d'un verrouillage commun à l'appareil et au profil professionnel (`blockUnifiedPasswordForWorkProfile`, UniFy W-11) : deux codes sur un appareil personnel génèrent surtout des demandes d'assistance, et le code de l'appareil est déjà vérifié ici. Quinze minutes est aligné sur iOS, macOS et Windows. Les paramètres eux-mêmes sont définis par CXNM - Standard - AND - U - Work Profile Restrictions ; cette policy les vérifie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée<br>A.8.24 Utilisation de la cryptographie<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du [dépôt CA-Policies](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/) s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| [2060 - GRANT - Mobile Apps and Desktop Clients](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2060__GRANT__Mobile_Apps_and_Desktop_Clients.fr.md) | disabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| [2090 - GRANT - Browser Access On Unmanaged Devices](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2090__GRANT__Browser_Access_On_Unmanaged_Devices.fr.md) | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| [2130 - GRANT - Admins Compliant Device](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2130__GRANT__Admins_Compliant_Device.fr.md) | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| [2150 - GRANT - Cloud PC Mobile Access](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2150__GRANT__Cloud_PC_Mobile_Access.fr.md) | enabled | L'autre façon : un appareil conforme. Contribue à déterminer si un iPhone ou un appareil Android est considéré comme conforme. |
| [3020 - SESSION - BYOD Persistence](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__3020__SESSION__BYOD_Persistence.fr.md) | report-only | Détermine quel appareil est considéré comme conforme et échappe donc à cette limite de session. Un appareil géré qui devient non conforme y est soumis. |
| [3040 - SESSION - Block File Downloads On Unmanaged Devices](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.fr.md) | disabled | Détermine quel appareil est considéré comme conforme et peut donc télécharger. Un appareil géré qui devient non conforme n'a plus que le navigateur sans téléchargement. |

## Propriétés — 37

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passwordRequired` | true |
| `passwordMinimumLength` | — |
| `passwordRequiredType` | deviceDefault |
| `requiredPasswordComplexity` | medium |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordSignInFailureCountBeforeFactoryReset` | — |
| `workProfileRequirePassword` | true |
| `workProfilePasswordMinimumLength` | 6 |
| `workProfileInactiveBeforeScreenLockInMinutes` | 15 |
| `workProfilePasswordRequiredType` | numericComplex |
| `workProfileRequiredPasswordComplexity` | medium |
| `securityPreventInstallAppsFromUnknownSources` | false |
| `securityDisableUsbDebugging` | false |
| `securityRequireVerifyApps` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `securityBlockJailbrokenDevices` | false |
| `securityRequireSafetyNetAttestationBasicIntegrity` | false |
| `securityRequireSafetyNetAttestationCertifiedDevice` | false |
| `securityRequireGooglePlayServices` | false |
| `securityRequireUpToDateSecurityProviders` | false |
| `securityRequireCompanyPortalAppIntegrity` | false |
| `securityRequiredAndroidSafetyNetEvaluationType` | basic |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | — |
| `storageRequireEncryption` | true |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
