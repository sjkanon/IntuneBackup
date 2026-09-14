<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Printing

Hardening tegen PrintNightmare: beperkt Point and Print en het installeren van printerdrivers door gebruikers.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-077-DPrinting` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Printing |
| Bestand | [`Baseline_WIN_D_Printing.json`](Baseline_WIN_D_Printing.json) |

> PrintNightmare-hardening; zat eerder als 13 instellingen in de Administrative Templates-blok.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden<br>A.8.19 Installatie van software op operationele systemen<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 20

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_printing2_registerspoolerremoterpcendpoint` | 0 |
| `device_vendor_msft_policy_config_printers_configureredirectionguardpolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_configureredirectionguardpolicy_redirectionguardpolicy_enum` | 1 |
| `device_vendor_msft_policy_config_printers_configurerpcconnectionpolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_configurerpcconnectionpolicy_rpcconnectionprotocol_enum` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_configurerpcconnectionpolicy_rpcconnectionauthentication_enum` | 0 |
| `device_vendor_msft_policy_config_printers_configurerpclistenerpolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_configurerpclistenerpolicy_rpcauthenticationprotocol_enum` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_configurerpclistenerpolicy_rpclistenerprotocols_enum` | 5 |
| `device_vendor_msft_policy_config_printers_configurerpctcpport` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_configurerpctcpport_rpctcpport` | 0 |
| `device_vendor_msft_policy_config_printers_restrictdriverinstallationtoadministrators` | 1 |
| `device_vendor_msft_policy_config_printers_configurecopyfilespolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_configurecopyfilespolicy_copyfilespolicy_enum` | 1 |
| `device_vendor_msft_policy_config_printers_pointandprintrestrictions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_trustedservers_edit` | *(leeg)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_trustedforest_chk` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_trustedservers_chk` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_nowarningnoelevationoninstall_enum` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_nowarningnoelevationonupdate_enum` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
