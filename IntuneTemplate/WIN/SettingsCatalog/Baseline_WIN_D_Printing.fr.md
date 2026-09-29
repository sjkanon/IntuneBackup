<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Printing.md) · [English](Baseline_WIN_D_Printing.en.md) · **Français**

# [Baseline] - WIN - D - Printing

Durcissement contre PrintNightmare : restreint Point and Print et l'installation de pilotes d'imprimante par les utilisateurs.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Printing |
| Fichier | [`Baseline_WIN_D_Printing.json`](Baseline_WIN_D_Printing.json) |

> Durcissement PrintNightmare ; figurait auparavant sous forme de 13 paramètres dans le bloc Administrative Templates.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques<br>A.8.19 Installation de logiciels sur des systèmes opérationnels<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 20

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_trustedservers_edit` | *(vide)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_trustedforest_chk` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_trustedservers_chk` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_nowarningnoelevationoninstall_enum` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_printers_pointandprintrestrictions_pointandprint_nowarningnoelevationonupdate_enum` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
