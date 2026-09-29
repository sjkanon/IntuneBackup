<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Edge_Extensions.md) · [English](Baseline_WIN_U_Microsoft_Edge_Extensions.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Edge Extensions

Détermine quelles extensions Edge les utilisateurs peuvent installer, et lesquelles sont obligatoires.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - Extensions |
| Fichier | [`Baseline_WIN_U_Microsoft_Edge_Extensions.json`](Baseline_WIN_U_Microsoft_Edge_Extensions.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions |
| NIST CSF 2.0 | PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallallowlist` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev88~policy~microsoft_edge~extensions_blockexternalextensions` | 1 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallforcelist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallforcelist_extensioninstallforcelistdesc` | nkbndigcebkoaejohleckhekfmcecfja, ofefcgjbeghpigppfmkologfjadafddi |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallblocklist_extensioninstallblocklistdesc` | * |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
