<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Package Manager

Beperkt winget, zodat gebruikers geen software van willekeurige bronnen kunnen installeren.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-088-DWindowsPackageManager` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Windows Package Manager |
| Bestand | [`Baseline_WIN_D_Windows_Package_Manager.json`](Baseline_WIN_D_Windows_Package_Manager.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_desktopappinstaller_enableexperimentalfeatures` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablehashoverride` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablelocalmanifestfiles` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablemsappinstallerprotocol` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablesettings` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
