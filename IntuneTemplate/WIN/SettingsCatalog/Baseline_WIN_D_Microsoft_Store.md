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
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Store - D - Configuration |
| Bestand | [`Baseline_WIN_D_Microsoft_Store.json`](Baseline_WIN_D_Microsoft_Store.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten<br>A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
