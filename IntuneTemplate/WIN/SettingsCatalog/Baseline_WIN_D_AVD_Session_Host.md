<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_AVD_Session_Host.en.md) · [Français](Baseline_WIN_D_AVD_Session_Host.fr.md)

# [Baseline] - WIN - D - AVD Session Host

Meldt op de AVD-sessiehosts een verbroken sessie na twee uur af, verbreekt een sessie die twee uur niets doet, en zet Storage Sense uit zodat Windows niets opruimt in profielen die FSLogix gekoppeld heeft.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | Eigen — de indeling in INTUNE-BASELINE.md van de AVD-testomgeving (Storage Sense niet op sessiehosts) en de sessielimieten van Remote Desktop Services in de Settings Catalog |
| Bestand | [`Baseline_WIN_D_AVD_Session_Host.json`](Baseline_WIN_D_AVD_Session_Host.json) |

> Tijdzone-redirectie (ts_time_zone) staat hier bewust niet in: [Baseline] - WIN - D - Cloud PC Session Security zet hem al op de sessiehosts (groep SEC-Cloud-PC). **Overlap met [Baseline] - WIN - D - Cloud PC External Access:** die zet dezelfde twee sessielimieten op 15 minuten. Op een hostpool voor externen zouden beide policies landen en botsen (Conflict: dan geldt geen van beide limieten). Sluit de groep SEC-Cloud-PC-External daarom uit bij deze policy; Storage Sense staat op die hosts dan op de Windows-standaard. De waarden staan in milliseconden: 7200000 is twee uur.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Werken op afstand<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.6 Capaciteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-04 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2_ts_sessions_idlelimittext` | 7200000 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2_ts_sessions_enddisconnected` | 7200000 |
| `device_vendor_msft_policy_config_storage_allowstoragesenseglobal` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
