<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Settings Sync

Bepaalt welke Windows-instellingen tussen apparaten gesynchroniseerd worden.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-081-DSettingsSync` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - D - Settings Sync |
| Bestand | [`Baseline_WIN_D_Settings_Sync.json`](Baseline_WIN_D_Settings_Sync.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.13 Back-up van informatie |
| NIS2 art. 21(2) | art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_settingsync_disablecredentialssettingsync` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_settingsync_disablecredentialssettingsync_checkbox_useroverride` | 0 |
| `device_vendor_msft_policy_config_settingssync_enablewindowsbackup` | 1 |
| `device_vendor_msft_windowsbackupandrestore_enablewindowsrestore` | true |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
