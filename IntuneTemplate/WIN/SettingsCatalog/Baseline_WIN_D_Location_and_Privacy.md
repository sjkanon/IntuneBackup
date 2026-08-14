<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Location and Privacy

Bepaalt welke privacygevoelige gegevens apps mogen opvragen, zoals locatie en spraak.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-022-Privacy` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - Location and Privacy |
| Bestand | [`Baseline_WIN_D_Location_and_Privacy.json`](Baseline_WIN_D_Location_and_Privacy.json) |

> De enige eigen instelling (letappsactivatewithvoiceabovelock) staat bij OIB in Login and Lock Screen en gaat dus niet verloren.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_privacy_letappsaccesslocation` | 0 |
| `device_vendor_msft_policy_config_privacy_letappsaccesslocation_forceallowtheseapps` | windows.immersivecontrolpanel_cw5n1h2txyewy, Microsoft.OutlookForWindows_8wekyb3d8bbwe |
| `device_vendor_msft_policy_config_system_allowlocation` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
