<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Firewall

Zet de Windows Firewall aan voor het domein-, privé- en openbare profiel en legt het standaardgedrag voor in- en uitgaand verkeer vast.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityFirewall) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-016-Firewall` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Windows Firewall - D - Firewall Configuration |
| Bestand | [`Baseline_WIN_D_Windows_Firewall.json`](Baseline_WIN_D_Windows_Firewall.json) |

> Alle 23 eigen instellingen zitten in OIB's 31. Let op: onze policy was een gewone Settings Catalog-policy, OIB's is een Endpoint Security-template (endpointSecurityFirewall) — in de tenant is dat geen PATCH maar een vervanging.

## Instellingen — 35

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_audit_objectaccess_auditfilteringplatformconnection` | 2 |
| `device_vendor_msft_policy_config_audit_objectaccess_auditfilteringplatformpacketdrop` | 2 |
| `vendor_msft_firewall_mdmstore_global_disablestatefulftp` | true |
| `vendor_msft_firewall_mdmstore_domainprofile_enablefirewall` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_defaultinboundaction` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_defaultoutboundaction` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_disableinboundnotifications` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_logmaxfilesize` | 16384 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_disablestealthmode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_enablelogdroppedpackets` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_enablelogsuccessconnections` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_logfilepath` | %SystemRoot%\System32\logfiles\firewall\domainfw.log |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_allowlocalpolicymerge` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_domainprofile_allowlocalipsecpolicymerge` | false |
| `vendor_msft_firewall_mdmstore_privateprofile_enablefirewall` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_disableinboundnotifications` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_defaultoutboundaction` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_logmaxfilesize` | 16384 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_defaultinboundaction` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_enablelogdroppedpackets` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_enablelogsuccessconnections` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_logfilepath` | %SystemRoot%\System32\logfiles\firewall\privatefw.log |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_allowlocalpolicymerge` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_privateprofile_allowlocalipsecpolicymerge` | false |
| `vendor_msft_firewall_mdmstore_publicprofile_enablefirewall` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_logmaxfilesize` | 16384 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_allowlocalpolicymerge` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_defaultoutboundaction` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_disableinboundnotifications` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_defaultinboundaction` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_enablelogignoredrules` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_enablelogdroppedpackets` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_enablelogsuccessconnections` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_logfilepath` | %SystemRoot%\System32\logfiles\firewall\publicfw.log |
| &nbsp;&nbsp;&nbsp;&nbsp;`vendor_msft_firewall_mdmstore_publicprofile_allowlocalipsecpolicymerge` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
