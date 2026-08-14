<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender for Endpoint EDR

Koppelt het apparaat aan Defender for Endpoint met het onboarding-pakket van deze tenant. Dat pakket is tenant-specifiek en moet na een restore in een andere tenant handmatig opnieuw gekoppeld worden.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityEndpointDetectionAndResponse) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-014-EDRConfiguration` |
| Bron | eigen baseline — OpenIntuneBaseline heeft geen EDR-onboardingpolicy |
| Bestand | [`Baseline_WIN_D_Defender_for_Endpoint_EDR.json`](Baseline_WIN_D_Defender_for_Endpoint_EDR.json) |

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_windowsadvancedthreatprotection_configurationtype` | autofromconnector |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_windowsadvancedthreatprotection_onboarding_fromconnector` | *(geheim — alleen geldig in de brontenant)* |
| `device_vendor_msft_windowsadvancedthreatprotection_configuration_samplesharing` | 1 |
| `device_vendor_msft_windowsadvancedthreatprotection_configuration_telemetryreportingfrequency` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
