<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Firewall Rules

Blokkeert uitgaand verkeer van ingebouwde Windows-programma's die malware gebruikt om verkeer te camoufleren (calc.exe, notepad.exe, mshta.exe).

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityFirewall) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-085-DWindowsFirewallRules` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Windows Firewall - D - Security Rules |
| Bestand | [`Baseline_WIN_D_Windows_Firewall_Rules.json`](Baseline_WIN_D_Windows_Firewall_Rules.json) |

## Instellingen — 49

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}` | *(6 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_name` | LOLBIN Security - Block 32-bit calc.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_action_type` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_direction` | out |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_enabled` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_interfacetypes` | all |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_app_filepath` | %systemroot%\SysWOW64\calc.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_profiles` | 2147483647 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_description` | LOLBIN Security - Block 32-bit calc.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_name` | LOLBIN Security - Block 64-bit calc.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_action_type` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_direction` | out |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_enabled` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_interfacetypes` | all |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_app_filepath` | %systemroot%\System32\calc.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_profiles` | 2147483647 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_description` | LOLBIN Security - Block 64-bit calc.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 3* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_name` | LOLBIN Security - Block 32-bit notepad.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_action_type` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_direction` | out |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_enabled` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_interfacetypes` | all |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_app_filepath` | %systemroot%\SysWOW64\notepad.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_profiles` | 2147483647 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_description` | LOLBIN Security - Block 32-bit notepad.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 4* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_name` | LOLBIN Security - Block 64-bit notepad.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_action_type` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_direction` | out |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_enabled` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_interfacetypes` | all |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_app_filepath` | %systemroot%\System32\notepad.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_profiles` | 2147483647 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_description` | LOLBIN Security - Block 64-bit notepad.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 5* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_name` | LOLBIN Security - Block 32-bit mshta.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_action_type` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_direction` | out |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_enabled` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_interfacetypes` | all |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_app_filepath` | %systemroot%\SysWOW64\mshta.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_profiles` | 2147483647 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_description` | LOLBIN Security - Block 32-bit mshta.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 6* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_name` | LOLBIN Security - Block 64-bit mshta.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_action_type` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_direction` | out |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_enabled` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_interfacetypes` | all |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_app_filepath` | %systemroot%\System32\mshta.exe |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_profiles` | 2147483647 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_firewallrules_{firewallrulename}_description` | LOLBIN Security - Block 64-bit mshta.exe |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
