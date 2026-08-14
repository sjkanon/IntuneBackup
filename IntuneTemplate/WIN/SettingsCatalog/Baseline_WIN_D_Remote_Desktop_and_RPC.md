<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Remote Desktop and RPC

Beperkt Remote Desktop en externe procedure-aanroepen, twee ingangen die bij een inbraak vaak voor zijwaartse beweging worden gebruikt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-078-DRemoteDesktopAndRPC` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - Remote Desktop Services and RPC |
| Bestand | [`Baseline_WIN_D_Remote_Desktop_and_RPC.json`](Baseline_WIN_D_Remote_Desktop_and_RPC.json) |

## Instellingen — 12

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_remoteprocedurecall_rpcendpointmapperclientauthentication` | 1 |
| `device_vendor_msft_policy_config_remoteprocedurecall_restrictunauthenticatedrpcclients` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remoteprocedurecall_restrictunauthenticatedrpcclients_rpcrestrictremoteclientslist` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_donotallowpasswordsaving` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_donotallowdriveredirection` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_promptforpassworduponconnection` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_requiresecurerpccommunication` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_security_layer_policy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_security_layer_policy_ts_security_layer` | 2 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_user_authentication_policy` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_clientconnectionencryptionlevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remotedesktopservices_clientconnectionencryptionlevel_ts_encryption_level` | 3 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
