<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Microsoft Store

Beperkt de Microsoft Store, zodat gebruikers geen willekeurige apps kunnen installeren.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-019-MicrosoftAppStore` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Microsoft Store - D - Configuration |
| Bestand | [`Baseline_WIN_D_Microsoft_Store.json`](Baseline_WIN_D_Microsoft_Store.json) |

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_applicationmanagement_allowalltrustedapps` | 1 |
| `device_vendor_msft_policy_config_applicationmanagement_allowappstoreautoupdate` | 1 |
| `device_vendor_msft_policy_config_applicationmanagement_allowdeveloperunlock` | 0 |
| `device_vendor_msft_policy_config_applicationmanagement_allowgamedvr` | 0 |
| `device_vendor_msft_policy_config_applicationmanagement_blocknonadminuserinstall` | 1 |
| `device_vendor_msft_policy_config_applicationmanagement_msiallowusercontroloverinstall` | 0 |
| `device_vendor_msft_policy_config_applicationmanagement_msialwaysinstallwithelevatedprivileges` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
