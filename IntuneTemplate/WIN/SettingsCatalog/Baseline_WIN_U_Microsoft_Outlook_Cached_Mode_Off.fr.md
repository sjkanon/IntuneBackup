<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.md) · [English](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Outlook Cached Mode Off

Met Outlook en mode Online et interdit la création d'un fichier OST, afin qu'aucun contenu de boîte aux lettres n'atterrisse sur le disque de l'appareil.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-161-UMicrosoftOutlookCachedModeOff` |
| Source | baseline propre |
| Fichier | [`Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.json`](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.json) |

> Pour un appareil partagé ou en mode kiosque dont le profil n'est pas conservé, et pour qui ne veut aucun contenu de messagerie sur le disque. Le prix est élevé : sans OST, Outlook ne fonctionne pas hors connexion, la recherche est une requête serveur et l'utilisateur ressent chaque à-coup de la connexion. Cette variante n'a pas sa place sur un ordinateur portable. S'applique uniquement à Outlook classique (l'application Win32 de Microsoft 365 Apps) ; le nouvel Outlook pour Windows ne lit pas ces paramètres ADMX et n'a pas d'OST. Le curseur bien connu **quantité de courrier à conserver hors connexion** (3 mois / 12 mois / tout, valeur de registre `SyncWindowSetting`) ne figure *pas* dans le settings catalog : l'ADMX `outlk16v2` ingérée compte dix-huit paramètres sous *Cached Exchange Mode* et ce curseur n'en fait pas partie. Qui veut le définir ne peut le faire que via un import ADMX personnalisé ou l'Office Cloud Policy Service — donc en dehors de cette baseline.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_configurecachedexchangemode` | 0 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings_l_ostcreation` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
