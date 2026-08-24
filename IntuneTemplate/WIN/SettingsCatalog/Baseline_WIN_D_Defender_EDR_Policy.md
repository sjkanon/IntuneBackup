<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender EDR Policy

Koppelt het apparaat aan Defender for Endpoint via de Defender-connector in plaats van via een vast onboarding-pakket. Daardoor bevat het template geen tenant-specifiek token en werkt het na een restore ook in een andere tenant, mits daar de Defender-for-Endpoint-connector aanstaat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityEndpointDetectionAndResponse) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-109-DDefenderEDRPolicy` |
| Bron | CIPP-standaardtemplate |
| Bestand | [`Baseline_WIN_D_Defender_EDR_Policy.json`](Baseline_WIN_D_Defender_EDR_Policy.json) |

> Komt uit CIPP, niet uit OIB. Doet hetzelfde als [Baseline] - WIN - D - Defender for Endpoint EDR, maar cross-tenant bruikbaar: onboarding_fromconnector staat op de placeholder "Microsoft ATP connector enabled" in plaats van op een vaste tenant-GUID.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_windowsadvancedthreatprotection_configuration_samplesharing` | 1 |
| `device_vendor_msft_windowsadvancedthreatprotection_configurationtype` | autofromconnector |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_windowsadvancedthreatprotection_onboarding_fromconnector` | *(geheim — alleen geldig in de brontenant)* |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
