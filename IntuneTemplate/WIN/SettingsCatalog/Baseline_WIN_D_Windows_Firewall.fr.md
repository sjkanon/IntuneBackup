<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Firewall.md) · [English](Baseline_WIN_D_Windows_Firewall.en.md) · **Français**

# CXNM - Standard - WIN - D - Windows Firewall

Active le Pare-feu Windows pour les profils domaine, privé et public et définit le comportement par défaut pour le trafic entrant et sortant.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityFirewall) |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Windows Firewall - D - Firewall Configuration |
| Fichier | [`Baseline_WIN_D_Windows_Firewall.json`](Baseline_WIN_D_Windows_Firewall.json) |

> Les 23 paramètres propres figurent tous parmi les 31 d'OIB. Attention : la policy propre était une policy Settings Catalog ordinaire, celle d'OIB est un template Endpoint Security (endpointSecurityFirewall) — dans le tenant, il ne s'agit pas d'un PATCH mais d'un remplacement.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Journalisation<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.5 Implement and Manage a Firewall on End-User Devices<br>8.2 Collect Audit Logs |
| NIST CSF 2.0 | PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 35

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
