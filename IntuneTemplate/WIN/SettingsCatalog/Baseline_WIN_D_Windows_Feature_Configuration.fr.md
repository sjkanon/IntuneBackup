<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Feature_Configuration.md) · [English](Baseline_WIN_D_Windows_Feature_Configuration.en.md) · **Français**

# [Baseline] - WIN - D - Windows Feature Configuration

Désactive les fonctionnalités Windows susceptibles de faire sortir des données de l'entreprise ou de générer du bruit, comme la recherche web depuis le menu Démarrer.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-084-DWindowsFeatureConfiguration` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - D - Feature Configuration |
| Fichier | [`Baseline_WIN_D_Windows_Feature_Configuration.json`](Baseline_WIN_D_Windows_Feature_Configuration.json) |

> Reprend l'ancienne policy Windows Search (023).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration<br>A.8.12 Prévention de la fuite de données |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 10

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_filesystem_enabledevdrive` | 0 |
| `device_vendor_msft_policy_config_deviceinstallation_preventdevicemetadatafromnetwork` | 1 |
| `device_vendor_msft_policy_config_experience_configurechaticon` | 3 |
| `device_vendor_msft_policy_config_experience_disableshareapppromotions` | 1 |
| `device_vendor_msft_policy_config_privacy_allowcrossdeviceclipboard` | 0 |
| `device_vendor_msft_policy_config_search_allowcloudsearch` | 1 |
| `device_vendor_msft_policy_config_search_allowindexingencryptedstoresoritems` | 0 |
| `device_vendor_msft_policy_config_search_disableremovabledriveindexing` | 1 |
| `device_vendor_msft_policy_config_search_donotusewebresults` | 0 |
| `device_vendor_msft_policy_config_newsandinterests_allownewsandinterests` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
