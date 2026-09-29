<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.md) · [English](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Outlook Cached Mode Managed

Active le mode Exchange mis en cache pour la boîte aux lettres de l'utilisateur et en exclut tout ce qui est partagé : les dossiers de courrier partagés, les calendriers partagés et les Public Folder Favorites ne sont pas copiés dans le fichier OST.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | baseline propre |
| Fichier | [`Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.json`](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.json) |

> L'une des trois variantes sur le même axe — affectez-en une, jamais deux : celle-ci, Cached Mode Default (uniquement le mode mis en cache activé) ou Cached Mode Off (mode en ligne). La boîte aux lettres de l'utilisateur est mise en cache, de sorte qu'Outlook fonctionne hors connexion et que la recherche est locale. Ce qui y est rattaché ne l'est pas : une boîte aux lettres partagée ajoutée au profil est la principale cause des fichiers OST de plusieurs dizaines de gigaoctets, et la lire en ligne n'est pas une perte pratique. Attention à la polarité des deux paramètres de dossiers partagés, qui vont en sens inverse : *Disable shared mail folder caching* sur **Enabled** écrit `cacheothersmail=0`, et *Download shared non-mail folders* sur **Disabled** écrit `downloadsharedfolders=0`. Les deux zéros signifient pas de mise en cache. S'applique uniquement à Outlook classique (l'application Win32 de Microsoft 365 Apps) ; le nouvel Outlook pour Windows ne lit pas ces paramètres ADMX et n'a pas d'OST. Le curseur bien connu **quantité de courrier à conserver hors connexion** (3 mois / 12 mois / tout, valeur de registre `SyncWindowSetting`) ne figure *pas* dans le settings catalog : l'ADMX `outlk16v2` ingérée compte dix-huit paramètres sous *Cached Exchange Mode* et ce curseur n'en fait pas partie. Qui veut le définir ne peut le faire que via un import ADMX personnalisé ou l'Office Cloud Policy Service — donc en dehors de cette baseline.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_configurecachedexchangemode` | 1 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_cachedexchangemodefilecachedexchangemode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_cachedexchangemodefilecachedexchangemode_l_selectcachedexchangemodefornewprofiles` | 2 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_outlookoptions~l_delegates_l_cacheothersmail` | 1 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_downloadshardnonmailfolders` | 0 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_downloadpublicfolderfavorites` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
