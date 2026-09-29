<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Edge_Password_Management.md) · [English](Baseline_WIN_U_Microsoft_Edge_Password_Management.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Edge Password Management

Détermine si Edge peut enregistrer et afficher des mots de passe, afin que les mots de passe professionnels ne se retrouvent pas dans un profil de navigateur.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| checkId | `INTUNE-BASE-099-UMicrosoftEdgePasswordManagement` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - Password Management |
| Fichier | [`Baseline_WIN_U_Microsoft_Edge_Password_Management.json`](Baseline_WIN_U_Microsoft_Edge_Password_Management.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edgev85diff~policy~microsoft_edge~passwordmanager_passwordmonitorallowed` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev93~policy~microsoft_edge~passwordmanager_passwordgeneratorenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev93.1~policy~microsoft_edge~passwordmanager_primarypasswordsetting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edgev93.1~policy~microsoft_edge~passwordmanager_primarypasswordsetting_primarypasswordsetting` | 1 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~passwordmanager_passwordmanagerenabled` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
