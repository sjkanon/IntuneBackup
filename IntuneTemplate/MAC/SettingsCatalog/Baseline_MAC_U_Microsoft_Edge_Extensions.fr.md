<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_U_Microsoft_Edge_Extensions.md) · [English](Baseline_MAC_U_Microsoft_Edge_Extensions.en.md) · **Français**

# [Baseline] - MAC - U - Microsoft Edge Extensions

Détermine quelles extensions Edge les utilisateurs peuvent installer sur le Mac.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - U - Extensions |
| Fichier | [`Baseline_MAC_U_Microsoft_Edge_Extensions.json`](Baseline_MAC_U_Microsoft_Edge_Extensions.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions |
| NIST CSF 2.0 | PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.managedclient.preferences_extensioninstallallowlist` | odfafepnkmbhccpbejgmiehpchacaeak |
| `com.apple.managedclient.preferences_blockexternalextensions` | true |
| `com.apple.managedclient.preferences_extensioninstallforcelist` | nkbndigcebkoaejohleckhekfmcecfja, ofefcgjbeghpigppfmkologfjadafddi |
| `com.apple.managedclient.preferences_extensioninstallblocklist` | * |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
