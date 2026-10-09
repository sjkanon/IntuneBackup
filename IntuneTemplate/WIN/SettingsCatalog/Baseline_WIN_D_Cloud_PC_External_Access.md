<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Cloud_PC_External_Access.en.md) · [Français](Baseline_WIN_D_Cloud_PC_External_Access.fr.md)

# [Baseline] - WIN - D - Cloud PC External Access

Sluit op sessiehosts en Cloud PC's voor persoonlijke toestellen en externen het klembord, printers en camera af, en verbreekt een sessie na 15 minuten zonder activiteit en meldt hem 15 minuten later af: wat op de virtuele werkplek staat blijft daar.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | IntuneAdmin — Baseline - Win365 - Do not allow Clipboard redirection, Do not allow client printer redirection en Do not allow video capture redirection; CIS Microsoft Intune for Windows 11 v4 L2 — Set time limit for active but idle Remote Desktop Services sessions (15 minuten) en Set time limit for disconnected sessions (15 minuten in plaats van 1) |
| Bestand | [`Baseline_WIN_D_Cloud_PC_External_Access.json`](Baseline_WIN_D_Cloud_PC_External_Access.json) |

> Hoort samen met [Baseline] - WIN - D - Cloud PC Session Security op dezelfde hosts: deze policy zet geen enkele instelling die daar ook in staat. Zet dezelfde beperkingen ook in de RDP-eigenschappen van de hostpool (redirectclipboard:i:0, redirectprinters:i:0, camerastoredirect:s:, drivestoredirect:s:, usbdevicestoredirect:s:); de strengste instelling wint. De sessie wordt na 15 minuten zonder activiteit verbroken en 15 minuten daarna afgemeld; niet-opgeslagen werk is dan weg. Audio en microfoon blijven werken voor Teams.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Werken op afstand<br>A.8.12 Voorkomen van datalekken<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.DS-01<br>PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_clipboard` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_printer` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_camera_redirection` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2_ts_sessions_idlelimittext` | 900000 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2_ts_sessions_enddisconnected` | 900000 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
