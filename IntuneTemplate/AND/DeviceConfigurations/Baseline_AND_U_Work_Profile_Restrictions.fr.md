<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Work_Profile_Restrictions.md) · [English](Baseline_AND_U_Work_Profile_Restrictions.en.md) · **Français**

# [Baseline] - AND - U - Work Profile Restrictions

Sur un appareil avec profil professionnel personnel, définit un code propre au profil professionnel (six chiffres, complexité moyenne, verrouillage après quinze minutes, effacement du seul profil professionnel après dix tentatives), bloque la copie, le partage et les captures d'écran du professionnel vers le personnel, et active Play Protect.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Device config |
| Affectation | — |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - DC - DR - USR - Personal-Work-Profile - v1.5 ; sans expiration du mot de passe, blocages des contacts et de l'identification de l'appelant, blocage des comptes ni blocage des sources inconnues côté personnel ; délai de verrouillage de 15 au lieu de 5 minutes, comme Compliance Password |
| Fichier | [`Baseline_AND_U_Work_Profile_Restrictions.json`](Baseline_AND_U_Work_Profile_Restrictions.json) |

> Volontairement non repris d'UniFy : `workProfilePasswordExpirationDays` (365 — NIST SP 800-63B déconseille la rotation), `workProfileBlockCrossProfileCallerId` et `workProfileBlockCrossProfileContactsSearch` (empêchent l'affichage du nom lors d'un appel professionnel entrant dans l'application téléphone personnelle), `workProfileBlockAddingAccounts` et `workProfileAccountUse: blockAll` (peuvent faire échouer l'ajout du compte professionnel dans les applications, UniFy W-6), `workProfileBlockPersonalAppInstallsFromUnknownSources` (une exigence côté personnel ; Compliance Device Health vérifie déjà les sources inconnues), `workProfileBlockNotificationsWhileDeviceLocked` (App Protection masque déjà les données de l'organisation dans les notifications) et `blockUnifiedPasswordForWorkProfile` (voir Compliance Password). `requiredPasswordComplexity: medium` au niveau de l'appareil est une exigence côté personnel, mais la même que celle déjà imposée par Compliance Password et App Protection — sans cette ligne, l'utilisateur n'est pas invité à la définir et devient simplement non conforme. Deux champs (`requiredPasswordComplexity`, `workProfileRequiredPasswordComplexity`) ne figurent pas dans les définitions pl4nty mais bien dans l'export Graph d'UniFy ; sur Android 12+, ce sont eux qui s'appliquent, la longueur et le type uniquement sur les versions plus anciennes.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.7.7 Bureau propre et écran vide<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.5 Authentification sécurisée<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>4.10 Enforce Automatic Device Lockout on Portable End-User Devices<br>4.12 Separate Enterprise Workspaces on Mobile End-User Devices<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-10<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 15

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `passwordBlockTrustAgents` | true |
| `requiredPasswordComplexity` | medium |
| `securityRequireVerifyApps` | true |
| `workProfileRequirePassword` | true |
| `workProfilePasswordRequiredType` | numericComplex |
| `workProfilePasswordMinimumLength` | 6 |
| `workProfileRequiredPasswordComplexity` | medium |
| `workProfilePasswordMinutesOfInactivityBeforeScreenTimeout` | 15 |
| `workProfilePasswordPreviousPasswordBlockCount` | 5 |
| `workProfilePasswordSignInFailureCountBeforeFactoryReset` | 10 |
| `workProfilePasswordBlockTrustAgents` | true |
| `workProfileDataSharingType` | allowPersonalToWork |
| `workProfileBlockCrossProfileCopyPaste` | true |
| `workProfileBlockScreenCapture` | true |
| `workProfileDefaultAppPermissionPolicy` | prompt |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
