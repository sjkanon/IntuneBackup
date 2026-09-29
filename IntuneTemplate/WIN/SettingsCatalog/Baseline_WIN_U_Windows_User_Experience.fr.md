<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Windows_User_Experience.md) · [English](Baseline_WIN_U_Windows_User_Experience.en.md) · **Français**

# [Baseline] - WIN - U - Windows User Experience

Désactive les notifications sur l'écran de verrouillage et la saisie semi-automatique dans Internet Explorer.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| checkId | `INTUNE-BASE-031-UWindowsUserExperience` |
| Source | baseline propre — issue de la scission d'Administrative Templates |
| Fichier | [`Baseline_WIN_U_Windows_User_Experience.json`](Baseline_WIN_U_Windows_User_Experience.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.7.7 Bureau propre et écran vide |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_admx_wpn_nolockscreentoastnotification` | 1 |
| `user_vendor_msft_policy_config_internetexplorer_allowautocomplete` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
