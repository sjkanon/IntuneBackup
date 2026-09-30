<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Edge_Management.md) · [English](Baseline_WIN_U_Microsoft_Edge_Management.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Edge Management

Autorise l'Edge Management Service sur les appareils gérés et fait primer la policy qui y est définie sur la policy locale et MDM, afin qu'Intune et ce service ne se contrecarrent pas.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - Management |
| Fichier | [`Baseline_WIN_U_Microsoft_Edge_Management.json`](Baseline_WIN_U_Microsoft_Edge_Management.json) |

> Nouveau dans OIB v4.0. N'oblige personne à utiliser l'Edge Management Service (admin.cloud.microsoft → Edge) ; tant que rien n'y est configuré, rien ne change. Le suivi des versions et des extensions dans ce service est un reporting gratuit qui fonctionne aussi sans autre policy. La gestion dans ce portail requiert le rôle Entra Edge Administrator.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edgev119~policy~microsoft_edge~manageability_edgemanagementuserpolicyoverridescloudmachinepolicy` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev115~policy~microsoft_edge~manageability_edgemanagementenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev115~policy~microsoft_edge~manageability_edgemanagementextensionsfeedbackenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev119~policy~microsoft_edge~manageability_edgemanagementpolicyoverridesplatformpolicy` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev89~policy~microsoft_edge~manageability_mamenabled` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
