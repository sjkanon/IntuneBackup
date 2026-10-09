<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.en.md) · [Français](Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.fr.md)

# [Baseline] - WIN - D - AVD Remote Desktop and RPC

Beperkt Remote Desktop en externe procedure-aanroepen op de AVD-sessiehosts zoals [Baseline] - WIN - D - Remote Desktop and RPC dat op fysieke toestellen doet, maar zonder de wachtwoordprompt bij elke verbinding, die eenmalige aanmelding met Entra ID breekt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Remote Desktop Services and RPC, zonder Prompt for password upon connection |
| Bestand | [`Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.json`](Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.json) |

> Wijs nooit beide toe aan dezelfde host: de fysieke variant zet de wachtwoordprompt aan en die geldt dan alsnog. Daarom doelgroep fysiek (include-filter WIN - Physical) op de fysieke en doelgroep avd (include-filter WIN - AVD Multi-session) op deze. Dit is een kopie met acht van de negen instellingen: wijzigt OIB de fysieke variant, neem de wijziging hier met de hand over (herkomst eigen, geen importscript raakt hem). Windows 365 Cloud PC's en persoonlijke AVD-hosts vallen onder geen van beide filters en krijgen dus geen van beide varianten.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.8.20 Netwerkbeveiliging<br>A.8.21 Beveiliging van netwerkdiensten<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>12.6 Use of Secure Network Management and Communication Protocols |
| NIST CSF 2.0 | PR.IR-01<br>PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 11

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_remoteprocedurecall_rpcendpointmapperclientauthentication` | 1 |
| `device_vendor_msft_policy_config_remoteprocedurecall_restrictunauthenticatedrpcclients` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remoteprocedurecall_restrictunauthenticatedrpcclients_rpcrestrictremoteclientslist` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_donotallowpasswordsaving` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_donotallowdriveredirection` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_requiresecurerpccommunication` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_security_layer_policy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_security_layer_policy_ts_security_layer` | 2 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_user_authentication_policy` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_clientconnectionencryptionlevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remotedesktopservices_clientconnectionencryptionlevel_ts_encryption_level` | 3 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
