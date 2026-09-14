<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Update Reports and Telemetry

Stuurt de diagnostische gegevens die Windows Update for Business Reports nodig heeft om te laten zien welke apparaten achterlopen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-083-DUpdateReportsAndTelemetry` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Windows Update for Business - D - Reports and Telemetry |
| Bestand | [`Baseline_WIN_D_Update_Reports_and_Telemetry.json`](Baseline_WIN_D_Update_Reports_and_Telemetry.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(f) beoordeling van de doeltreffendheid |
| NIST CSF 2.0 | DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_system_allowdevicenameindiagnosticdata` | 1 |
| `device_vendor_msft_policy_config_system_allowtelemetry` | 3 |
| `device_vendor_msft_policy_config_system_configuretelemetryoptinchangenotification` | 1 |
| `device_vendor_msft_policy_config_system_configuretelemetryoptinsettingsux` | 1 |
| `device_vendor_msft_policy_config_update_allowtemporaryenterprisefeaturecontrol` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
