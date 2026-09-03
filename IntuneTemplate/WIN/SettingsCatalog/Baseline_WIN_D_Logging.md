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
| Bron | ISO/IEC 27001:2022 A.8.15 en A.8.16, NIS2 art. 21(2)(b), EASA Part-IS IS.I.OR.245 — instellingen uit CIS v4 Windows 11 L2 |
| Bestand | [`Baseline_WIN_D_Logging.json`](Baseline_WIN_D_Logging.json) |

> Scriptblok-logging stond al aan in [Baseline] - WIN - D - Security Hardening; die is hier bewust weggelaten om geen conflict te maken. Wat ontbrak is de transcriptie: scriptblok-logging laat zien wélke code is geladen, het transcript laat de sessie zelf zien met invoer, uitvoer en tijdstempels. ISMP13 vraagt dat laatste. Eén kanttekening: transcripties komen standaard in het profiel van de gebruiker terecht, waar diezelfde gebruiker ze kan verwijderen. ISMP13 vraagt om logs die een beheerder niet zelf kan wissen — vul outputdirectory dus met een centrale share zodra die er is.

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
