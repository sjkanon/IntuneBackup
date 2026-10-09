<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Cloud_PC_Session_Security.en.md) · [Français](Baseline_WIN_D_Cloud_PC_Session_Security.fr.md)

# [Baseline] - WIN - D - Cloud PC Session Security

Beveiligt de sessie op een Windows 365 Cloud PC of Azure Virtual Desktop-sessiehost: niets kopiëren van de virtuele werkplek naar het lokale toestel, geen COM-, LPT- of USB-apparaten doorsturen, de sessie verbreken bij vergrendelen, schermopname vanaf het lokale toestel blokkeren en een watermerk met het verbindings-ID over het bureaublad.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | OpenIntuneBaseline Windows 365 v1.0 — Device Security - D - Connectivity Settings en Resource Redirection, zonder de vier instellingen die [Baseline] - WIN - D - Remote Desktop and RPC al zet; IntuneAdmin — Baseline - AVD - Enable screen capture protection en Enable watermarking |
| Bestand | [`Baseline_WIN_D_Cloud_PC_Session_Security.json`](Baseline_WIN_D_Cloud_PC_Session_Security.json) |

> Vul aan wat [Baseline] - WIN - D - Remote Desktop and RPC al op elk toestel zet (wachtwoordprompt bij verbinden, secure RPC, encryptieniveau Hoog, geen schijfredirectie); die vier staan hier bewust niet nog eens in. Klembord van server naar client staat uit (OIB); van client naar server blijft toegestaan. Screen capture protection op 'client' en niet op 'client and server' zoals IntuneAdmin: data blijft daarmee al in de virtuele werkplek, en het knipprogramma in de sessie zelf blijft werken voor een melding aan de servicedesk. Gevolg: wie het bureaublad in een Teams-vergadering vanaf het lokale toestel deelt ziet zwart — deel vanuit Teams in de sessie zelf. Windows App op iOS en Android verbindt alleen nog als een app protection policy op Windows App schermopname blokkeert (zie IOS/AppConfiguration en AND/AppConfiguration). Het watermerk werkt op een volledig bureaublad, niet op RemoteApp. BitLocker hoort niet op een Cloud PC: sluit SEC-Cloud-PC uit bij [Baseline] - WIN - D - BitLocker en [Baseline] - WIN - U - Compliance BitLocker, of wijs die toe met een filter op deviceModel.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Werken op afstand<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets<br>3.3 Configure Data Access Control Lists |
| NIST CSF 2.0 | PR.AA-05<br>PR.DS-01<br>PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 19

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_select_transport` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_select_transport_ts_select_transport_type` | 0 |
| `device_vendor_msft_policy_config_remotedesktopservices_disconnectonlockmicrosoftidentityauthn` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_audio` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_audio_capture` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_time_zone` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_com` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_lpt` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_pnp` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_limitservertoclientclipboardredirection` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remotedesktopservices_limitservertoclientclipboardredirection_ts_sc_clipboard_restriction_text` | 0 |
| `device_vendor_msft_policy_config_terminalserver-avdv1~policy~avd_gp_node_avd_server_screen_capture_protection` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1~policy~avd_gp_node_avd_server_screen_capture_protection_avd_server_screen_capture_protection_level` | 1 |
| `device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingheightfactor` | 180 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingopacity` | 2000 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingqrscale` | 4 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingcontent` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingwidthfactor` | 320 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
