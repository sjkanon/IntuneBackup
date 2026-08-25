<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Microsoft OneDrive

Meldt de OneDrive-client op de Mac automatisch aan met het werkaccount en geeft 'm de toegangsrechten die macOS eist.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-044-MACDMicrosoftOneDrive` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft OneDrive - D - Service and Access |
| Bestand | [`Baseline_MAC_D_Microsoft_OneDrive.json`](Baseline_MAC_D_Microsoft_OneDrive.json) |

## Instellingen — 20

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(2 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | OneDrive (Standalone) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.OneDrive |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | OneDrive Launcher |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.OneDriveLauncher |
| `com.apple.tcc.configuration-profile-policy_com.apple.tcc.configuration-profile-policy` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | com.microsoft.OneDrive |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |
| `com.apple.system-extension-policy_com.apple.system-extension-policy` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions_generickey` | com.microsoft.OneDrive.FinderSync |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions_generickey_keytobereplaced` | UBF8T346G9 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
