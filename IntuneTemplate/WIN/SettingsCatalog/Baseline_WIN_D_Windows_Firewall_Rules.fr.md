<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Firewall_Rules.md) · [English](Baseline_WIN_D_Windows_Firewall_Rules.en.md) · **Français**

# [Baseline] - WIN - D - Windows Firewall Rules

Bloque le trafic sortant des programmes Windows intégrés que les malwares utilisent pour camoufler leur trafic (calc.exe, notepad.exe, mshta.exe).

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityFirewall) |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Windows Firewall - D - Security Rules |
| Fichier | [`Baseline_WIN_D_Windows_Firewall_Rules.json`](Baseline_WIN_D_Windows_Firewall_Rules.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.5 Implement and Manage a Firewall on End-User Devices |
| NIST CSF 2.0 | PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 49

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
