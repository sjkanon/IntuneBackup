<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Logging

Schrijft een transcript van elke PowerShell-sessie weg, zodat achteraf te zien is wat een beheerder werkelijk heeft uitgevoerd.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-131-DLogging` |
| Bron | ISO/IEC 27001:2022 A.8.15 en A.8.16, NIS2 art. 21(2)(b) — instellingen uit CIS v4 Windows 11 L2 |
| Bestand | [`Baseline_WIN_D_Logging.json`](Baseline_WIN_D_Logging.json) |

> Scriptblok-logging stond al aan in [Baseline] - WIN - D - Security Hardening; die is hier bewust weggelaten om geen conflict te maken. Wat ontbrak is de transcriptie: scriptblok-logging laat zien wélke code is geladen, het transcript laat de sessie zelf zien met invoer, uitvoer en tijdstempels. Logbeleid vraagt meestal dat laatste. Eén kanttekening: transcripties komen standaard in het profiel van de gebruiker terecht, waar diezelfde gebruiker ze kan verwijderen. Moeten logs buiten bereik van de gebruiker blijven, vul outputdirectory dan met een centrale share zodra die er is.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Logging<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 8.5 Collect Detailed Audit Logs<br>8.8 Collect Command-Line Audit Logs |
| NIST CSF 2.0 | PR.PS-04 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_enableinvocationheader` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_outputdirectory` | *(leeg)* |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
