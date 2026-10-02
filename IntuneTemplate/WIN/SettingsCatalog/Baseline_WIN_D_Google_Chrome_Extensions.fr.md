<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Google_Chrome_Extensions.md) · [English](Baseline_WIN_D_Google_Chrome_Extensions.en.md) · **Français**

# CXNM - Standard - WIN - D - Google Chrome Extensions

Bloque les extensions dans Google Chrome, comme Microsoft Edge Extensions le fait dans Edge.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Stratégie Google Chrome dans le catalogue de paramètres (chromeintunev1, chromeintunev141) — valeurs choisies d'après l'équivalent Edge de cette baseline ; ids, options et plages vérifiés par rapport à DCv2/Settings dans pl4nty/intune-change-tracking |
| Fichier | [`Baseline_WIN_D_Google_Chrome_Extensions.json`](Baseline_WIN_D_Google_Chrome_Extensions.json) |

> Séparée de Google Chrome Security car c'est la stratégie qui demande le plus souvent une exception : le reste du durcissement de Chrome peut être déployé pendant que l'inventaire des extensions est en cours.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions |
| NIST CSF 2.0 | PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~extensions_extensioninstallblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~extensions_extensioninstallblocklist_extensioninstallblocklistdesc` | * |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
