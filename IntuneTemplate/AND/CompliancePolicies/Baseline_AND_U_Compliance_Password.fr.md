<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Compliance_Password.md) · [English](Baseline_AND_U_Compliance_Password.en.md) · **Français**

# [Baseline] - AND - U - Compliance Password

Vérifie si un appareil Android avec profil professionnel personnel dispose d'un verrouillage d'écran de complexité moyenne, si le profil professionnel exige en outre son propre code d'au moins six chiffres (numérique complexe, complexité moyenne) qui se verrouille après quinze minutes, et si le stockage est chiffré.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| checkId | aucun — le moteur de la plateforme n'a pas de correspondance pour ce type de policy |
| Source | Convention OpenIntuneBaseline pour la conformité ; valeurs alignées sur l'exigence de PIN à six caractères de la policy App Protection existante et sur l'exigence Android d'IntuneAdmin. |
| Fichier | [`Baseline_AND_U_Compliance_Password.json`](Baseline_AND_U_Compliance_Password.json) |

> **Correction septembre 2026.** Le texte indiquait jusqu'ici que l'organisation n'impose aucune exigence côté personnel ; la policy exigeait pourtant déjà un verrouillage de l'appareil (`passwordRequired`, `requiredPasswordComplexity: medium`). L'exigence est maintenue et le texte a été rectifié : elle demande seulement qu'il existe un verrouillage de complexité moyenne, pas quel code, et l'organisation ne voit pas ce code. Qui juge cela inacceptable pour des appareils personnels doit aussi reconsidérer l'exigence App Protection sur la complexité de l'appareil — sinon App Protection bloque quand même les applications. Volontairement pas de `passwordExpirationDays` (NIST SP 800-63B déconseille la rotation obligatoire) ni de blocage d'un verrouillage commun à l'appareil et au profil professionnel (`blockUnifiedPasswordForWorkProfile`, UniFy W-11) : deux codes sur un appareil personnel génèrent surtout des demandes d'assistance, et le code de l'appareil est déjà vérifié ici. Quinze minutes est aligné sur iOS, macOS et Windows. Les paramètres eux-mêmes sont définis par [Baseline] - AND - U - Work Profile Restrictions ; cette policy les vérifie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée<br>A.8.24 Utilisation de la cryptographie<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

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
