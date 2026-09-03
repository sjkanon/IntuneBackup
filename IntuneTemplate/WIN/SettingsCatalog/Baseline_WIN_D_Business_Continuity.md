<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Business Continuity

Zet Quick Machine Recovery aan: een apparaat dat niet meer opstart, haalt zelf een herstelpakket op uit de cloud in plaats van op een monteur te wachten.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-127-DBusinessContinuity` |
| Bron | ISO/IEC 27001:2022 A.5.29, A.5.30 en A.8.14, NIS2 art. 21(2)(c) — instellingen uit de Modern Workplace-set van IntuneAdmin |
| Bestand | [`Baseline_WIN_D_Business_Continuity.json`](Baseline_WIN_D_Business_Continuity.json) |

> ISMP09 en ISMP10 gaan over continuïteit maar hebben op de werkplek zelf geen enkele technische maatregel. Dit is de goedkoopste die er is. De Wi-Fi-gegevens uit het bronprofiel zijn bewust weggelaten: die zijn tenant-specifiek en horen niet in een gedeelde baseline. Zonder die gegevens werkt het herstel over een bekabelde verbinding; heb je een vloot zonder ethernet, vul ze dan aan vóór uitrol.

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_remoteremediation_cloudremediationsettings_enablecloudremediation` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_enableautoremediation` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_setretryinterval` | 30 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_settimetoreboot` | 180 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
