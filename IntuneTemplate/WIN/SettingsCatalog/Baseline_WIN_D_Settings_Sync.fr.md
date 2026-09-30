<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Settings_Sync.md) · [English](Baseline_WIN_D_Settings_Sync.en.md) · **Français**

# CXNM - Standard - WIN - D - Settings Sync

Détermine quels paramètres Windows sont synchronisés entre appareils.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - D - Settings Sync |
| Fichier | [`Baseline_WIN_D_Settings_Sync.json`](Baseline_WIN_D_Settings_Sync.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.13 Sauvegarde des informations |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_settingsync_disablecredentialssettingsync` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_settingsync_disablecredentialssettingsync_checkbox_useroverride` | 0 |
| `device_vendor_msft_policy_config_settingssync_enablewindowsbackup` | 1 |
| `device_vendor_msft_windowsbackupandrestore_enablewindowsrestore` | true |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
