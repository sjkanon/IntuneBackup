<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.md) · [English](Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Edge Profiles and Sync

Détermine avec quel compte les utilisateurs se connectent à Edge et ce qui est synchronisé, afin que les données professionnelles ne partent pas vers un profil personnel.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| checkId | `INTUNE-BASE-100-UMicrosoftEdgeProfilesAndSync` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - Profiles, Sign-In and Sync |
| Fichier | [`Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.json`](Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 11

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_autoimportatfirstrun` | 0 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_browsersignin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_browsersignin_browsersignin` | 2 |
| `user_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_nonremovableprofileenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_browseraddprofileenabled` | 0 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_forceephemeralprofiles` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev86~policy~microsoft_edge_forcesync` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev148~policy~microsoft_edge~identity_m365authpopupsinworkenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev93~policy~microsoft_edge~identity_implicitsigninenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~identity_nonmicrosoftaccountsigninenabled` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev92~policy~microsoft_edge_aadwebsitessousingthisprofileenabled` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
