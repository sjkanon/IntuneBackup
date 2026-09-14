<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender for Endpoint EDR

Koppelt het apparaat aan Defender for Endpoint met een vast onboarding-pakket. Dat pakket is tenant-specifiek; in een andere tenant moet het opnieuw gekoppeld worden.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityEndpointDetectionAndResponse) |
| Toewijzing | — |
| checkId | `INTUNE-BASE-014-EDRConfiguration` |
| Bron | eigen baseline — OpenIntuneBaseline heeft geen EDR-onboardingpolicy |
| Bestand | [`Baseline_WIN_D_Defender_for_Endpoint_EDR.json`](Baseline_WIN_D_Defender_for_Endpoint_EDR.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting<br>13.2 Deploy a Host-Based Intrusion Detection Solution |
| NIST CSF 2.0 | DE.CM-09<br>DE.AE-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
