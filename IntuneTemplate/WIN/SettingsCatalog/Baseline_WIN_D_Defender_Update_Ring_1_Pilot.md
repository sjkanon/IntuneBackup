<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender Update Ring 1 Pilot

Haalt nieuwe Defender-definities en engineversies als eerste binnen, zodat je een slechte update opmerkt vóór de rest van de organisatie 'm krijgt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Toewijzing | — |
| checkId | `INTUNE-BASE-061-DDefenderUpdateRing1Pilot` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Defender Antivirus Updates - Ring 1 - Pilot |
| Bestand | [`Baseline_WIN_D_Defender_Update_Ring_1_Pilot.json`](Baseline_WIN_D_Defender_Update_Ring_1_Pilot.json) |

> Ringen zetten dezelfde drie instellingen met andere waarden. Alleen ring 3 staat op All Devices; ring 1 en 2 horen op een pilot-/UAT-groep en hebben daarom geen assignment.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_defender_configuration_engineupdateschannel` | 3 |
| `device_vendor_msft_defender_configuration_platformupdateschannel` | 3 |
| `device_vendor_msft_defender_configuration_securityintelligenceupdateschannel` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
