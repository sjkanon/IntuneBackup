<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Printing Hardening

Zet Windows Protected Print aan, verbiedt gewone gebruikers het installeren van printerdrivers bij een gedeelde printer, en sluit printen over HTTP af.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-133-DPrintingHardening` |
| Bron | CIS v4 Windows 11 L1 en de Microsoft Security Baseline — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definities. |
| Bestand | [`Baseline_WIN_D_Printing_Hardening.json`](Baseline_WIN_D_Printing_Hardening.json) |

> Windows Protected Print vraagt Windows 11 24H2 of hoger en laat printers vallen die geen Mopria-driver hebben — dat zijn in de praktijk oudere netwerkprinters en labelprinters. Inventariseer de printervloot vóór je dit breed toewijst; op een vloot zonder eigen printers is het gratis. De andere twee instellingen zijn onvoorwaardelijk veilig.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_printers_configurewindowsprotectedprint` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_devices_preventusersfrominstallingprinterdriverswhenconnectingtosharedprinters` | 1 |
| `device_vendor_msft_policy_config_connectivity_diableprintingoverhttp` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
