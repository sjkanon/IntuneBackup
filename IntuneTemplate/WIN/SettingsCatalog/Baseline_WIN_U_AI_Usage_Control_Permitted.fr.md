<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_AI_Usage_Control_Permitted.md) · [English](Baseline_WIN_U_AI_Usage_Control_Permitted.en.md) · **Français**

# [Baseline] - WIN - U - AI Usage Control Permitted

Maintient la liste de blocage Edge pour le site web du Store, mais en exclut explicitement les services d'IA.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | Pendant de la variante Restricted : la même liste de blocage sans les domaines d'IA |
| Fichier | [`Baseline_WIN_U_AI_Usage_Control_Permitted.json`](Baseline_WIN_U_AI_Usage_Control_Permitted.json) |

> **Alternative à [Baseline] - WIN - U - AI Usage Control Restricted.** Une liste de blocage d'URL est de toute façon une friction, pas une frontière : elle ne fonctionne ni sur un téléphone ni sur un appareil personnel. Qui veut réellement encadrer l'usage de l'IA le fait avec la catégorie Generative AI de Defender Web Content Filtering — elle se trouve dans le portail Defender, pas dans ce dépôt.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.5.19 Sécurité de l'information dans les relations avec les fournisseurs<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.23 Filtrage web |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc` | apps.microsoft.com, ms-windows-store://*, javascript://* |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
