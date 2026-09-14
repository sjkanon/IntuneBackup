<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Event Forwarding

Stuurt Windows-gebeurtenissen door naar een centrale Windows Event Collector, zodat logboeken buiten bereik van een aanvaller op het apparaat worden bewaard.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-207-DWindowsEventForwarding` |
| Bron | Microsoft Learn — 'Use Windows Event Forwarding to help with intrusion detection' en Policy CSP ADMX_EventForwarding/SubscriptionManager; waarden geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_WIN_D_Windows_Event_Forwarding.json`](Baseline_WIN_D_Windows_Event_Forwarding.json) |

> Vul `WEC-SERVER-FQDN-INVULLEN` met de FQDN van de collector (HTTPS: poort 5986 en `IssuerCA=<thumbprint>` toevoegen). Voor het doorsturen van het **Security**-logboek moet NETWORK SERVICE leesrecht hebben op dat kanaal — dat is niet via de settings catalog te zetten; voeg het account toe aan de groep Event Log Readers (Local Administrators-achtige constructie via Account Protection) of zet de ChannelAccess-SDDL met een script. WinRM-luisteraar hoeft niet aan: Remote Access Hardening zet `allowremoteservermanagement` uit, en bron-geïnitieerd doorsturen gebruikt de uitgaande WinRM-client.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Logging<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 8.9 Centralize Audit Logs |
| NIST CSF 2.0 | PR.PS-04<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_eventforwarding_subscriptionmanager` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_eventforwarding_subscriptionmanager_subscriptionmanager_listbox` | Server=http://WEC-SERVER-FQDN-INVULLEN:5985/wsman/SubscriptionManager/WEC,Refresh=60 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
