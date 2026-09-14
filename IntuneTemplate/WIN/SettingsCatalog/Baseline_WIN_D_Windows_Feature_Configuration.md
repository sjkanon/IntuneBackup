<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Feature Configuration

Zet Windows-functies uit die bedrijfsdata naar buiten kunnen brengen of ruis opleveren, zoals zoeken op internet vanuit het startmenu.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-084-DWindowsFeatureConfiguration` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - D - Feature Configuration |
| Bestand | [`Baseline_WIN_D_Windows_Feature_Configuration.json`](Baseline_WIN_D_Windows_Feature_Configuration.json) |

> Neemt de oude Windows Search-policy (023) over.

## Instellingen — 10

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_filesystem_enabledevdrive` | 0 |
| `device_vendor_msft_policy_config_experience_configurechaticon` | 3 |
| `device_vendor_msft_policy_config_experience_disableshareapppromotions` | 1 |
| `device_vendor_msft_policy_config_search_allowcloudsearch` | 1 |
| `device_vendor_msft_policy_config_search_allowindexingencryptedstoresoritems` | 0 |
| `device_vendor_msft_policy_config_search_disableremovabledriveindexing` | 1 |
| `device_vendor_msft_policy_config_search_donotusewebresults` | 0 |
| `device_vendor_msft_policy_config_newsandinterests_allownewsandinterests` | 0 |
| `device_vendor_msft_policy_config_deviceinstallation_preventdevicemetadatafromnetwork` | 1 |
| `device_vendor_msft_policy_config_privacy_allowcrossdeviceclipboard` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
