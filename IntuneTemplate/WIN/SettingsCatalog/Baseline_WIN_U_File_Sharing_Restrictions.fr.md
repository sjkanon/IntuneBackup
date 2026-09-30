<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_File_Sharing_Restrictions.md) · [English](Baseline_WIN_U_File_Sharing_Restrictions.en.md) · **Français**

# [Baseline] - WIN - U - File Sharing Restrictions

Empêche un utilisateur de partager des fichiers de son propre profil avec d'autres utilisateurs ou le réseau via « Partager » dans l'Explorateur de fichiers.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS v4 Windows 11 L1 — profil CISv4 d'IntuneAdmin 'Prevent users from sharing files within their profile (User)', instance reprise sans modification |
| Fichier | [`Baseline_WIN_U_File_Sharing_Restrictions.json`](Baseline_WIN_U_File_Sharing_Restrictions.json) |

> N'affecte aucun partage existant créé par un administrateur, uniquement le menu de partage de l'utilisateur lui-même.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.3 Restriction d'accès à l'information<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists |
| NIST CSF 2.0 | PR.AA-05<br>PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_admx_sharing_noinplacesharing` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
