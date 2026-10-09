<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_AVD_Start_and_Search.md) · [English](Baseline_WIN_D_AVD_Start_and_Search.en.md) · **Français**

# [Baseline] - WIN - D - AVD Start and Search

Empêche Démarrer et Rechercher, sur les hôtes de session AVD, de récupérer quoi que ce soit dans le cloud ou sur le web à l'ouverture : pas de recherche dans les sources cloud (OneDrive, SharePoint), pas de points forts de la recherche et pas de liste des applications récemment ajoutées.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | Propre — les paramètres Search et Start du Settings Catalog (Policy CSP), tous trois avec windowsMultiSession dans leur applicabilité |
| Fichier | [`Baseline_WIN_D_AVD_Start_and_Search.json`](Baseline_WIN_D_AVD_Start_and_Search.json) |

> Les résultats web dans Rechercher (donotusewebresults) n'y figurent pas : [Baseline] - WIN - D - Windows Feature Configuration (classe alle) les désactive déjà sur chaque appareil Windows — option 0, *Not allowed*, la double négation de Do Not Use Web Results. La recherche dans les sources cloud (allowcloudsearch) vient bien de cette stratégie : elle y a été retirée, sinon elle serait en conflit sur l'hôte de session. Le paramètre Start HideRecommendedSection (masquer toute la section Recommandé) n'existe pas dans le Settings Catalog du tenant de test ; seul HideRecentlyAddedApps peut être défini via Intune. Les points forts de la recherche (allowsearchhighlights) sont un simple entier, 0 = désactivé.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_search_allowcloudsearch` | 0 |
| `device_vendor_msft_policy_config_search_allowsearchhighlights` | 0 |
| `device_vendor_msft_policy_config_start_hiderecentlyaddedapps` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
