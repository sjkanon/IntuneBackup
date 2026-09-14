<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Security Log Monitoring

Waarschuwt in het systeemlogboek zodra het beveiligingslogboek voor 90% vol is en logt de pijplijnuitvoering van alle PowerShell-modules, zodat het logboek bij een incident niet ongemerkt is overschreven en PowerShell-activiteit volledig herleidbaar is.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-205-DSecurityLogMonitoring` |
| Bron | CIS v4 Windows 11 L1 (MSS WarningLevel, IntuneAdmin CISv4-profiel) en de Microsoft-aanbeveling voor PowerShell-logging ('PowerShell ♥ the Blue Team') — waarden geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_WIN_D_Security_Log_Monitoring.json`](Baseline_WIN_D_Security_Log_Monitoring.json) |

> Geen overlap: `turnonpowershellscriptblocklogging` (Security Hardening) en `enabletranscripting` (Logging) zijn andere ids. De grootte van het PowerShell/Operational-logboek is niet via de settings catalog in te stellen — daarvoor staat een remediation in extras/windows/event-log-sizes.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Logging<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>8.3 Ensure Adequate Audit Log Storage<br>8.8 Collect Command-Line Audit Logs |
| NIST CSF 2.0 | PR.PS-04<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_warninglevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_warninglevel_warninglevel` | 90 |
| `device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enablemodulelogging` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enablemodulelogging_listbox_modulenames` | * |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
