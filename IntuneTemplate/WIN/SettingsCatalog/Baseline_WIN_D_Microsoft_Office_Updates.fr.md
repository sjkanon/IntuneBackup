<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Office_Updates.md) · [English](Baseline_WIN_D_Microsoft_Office_Updates.en.md) · **Français**

# [Baseline] - WIN - D - Microsoft Office Updates

Le canal de mise à jour d'Office et la rapidité d'installation des mises à jour.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-021-OfficeUpdates` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Office - D - Updates |
| Fichier | [`Baseline_WIN_D_Microsoft_Office_Updates.json`](Baseline_WIN_D_Microsoft_Office_Updates.json) |

> Remplace la variante ADMX classique (Type Admin). Ce endpoint est uniquement en beta et n'a jamais été testé sur un vrai tenant ; Settings Catalog est plus stable. Dans le tenant, il ne s'agit pas d'un renommage mais d'un remplacement — supprimez l'ancienne policy ADMX, sinon les deux définissent les mêmes valeurs de registre.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_office16v5~policy~l_microsoftofficemachine~l_updates_l_preventbinginstall` | 1 |
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_enableautomaticupdates` | 1 |
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_hideenabledisableupdates` | 1 |
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_onlinerepair` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_onlinerepair_l_localodtpath` | *(vide)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_onlinerepair_l_fallbacktocdn` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
