<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Defender for Endpoint

Geeft Defender de systeemrechten die macOS eist voordat het kan werken: systeemextensie, netwerkfilter en volledige schijftoegang. Zonder deze policy blijft Defender op een Mac half geïnstalleerd.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-037-MACDDefenderForEndpoint` |
| Bron | OpenIntuneBaseline macOS v1.0 — Defender Antivirus - D - MDE Configuration |
| Bestand | [`Baseline_MAC_D_Defender_for_Endpoint.json`](Baseline_MAC_D_Defender_for_Endpoint.json) |

## Instellingen — 64

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(2 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.fresno |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.dlp |
| `com.apple.managedclient.preferences_applicationssystem` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_applicationssystem_applications_microsoft defender.app` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_applicationssystem_applications_microsoft defender.app_application id` | WDAV00 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_applicationssystem_applications_microsoft defender.app_lcid` | 1033 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_applicationssystem_applications_microsoft defender.app_manifestserver` | 0 |
| `com.apple.tcc.configuration-profile-policy_com.apple.tcc.configuration-profile-policy` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | identifier "com.microsoft.dlp.daemon" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.microsoft.dlp.daemon |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_bluetoothalways` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_bluetoothalways_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_bluetoothalways_item_coderequirement` | identifier "com.microsoft.dlp.daemon" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_bluetoothalways_item_identifier` | com.microsoft.dlp.daemon |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_bluetoothalways_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_bluetoothalways_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles` | *(3 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier "com.microsoft.wdav" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] … |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | com.microsoft.wdav |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier "com.microsoft.wdav.epsext" and anchor apple generic and certificate 1[field.1.2.840.113635.100.… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | com.microsoft.wdav.epsext |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 3* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier "com.microsoft.dlp.daemon" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | com.microsoft.dlp.daemon |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |
| `com.apple.system-extension-policy_com.apple.system-extension-policy` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions_generickey` | com.microsoft.wdav.epsext, com.microsoft.wdav.netext |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions_generickey_keytobereplaced` | UBF8T346G9 |
| `com.apple.notificationsettings_com.apple.notificationsettings` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_alerttype` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_badgesenabled` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_bundleidentifier` | com.microsoft.wdav.tray |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_criticalalertenabled` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_notificationsenabled` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_showinlockscreen` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_showinnotificationcenter` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.notificationsettings_notificationsettings_item_soundsenabled` | true |
| `com.apple.webcontent-filter_com.apple.webcontent-filter` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_filterdataproviderbundleidentifier` | com.microsoft.wdav.netext |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_filterdataproviderdesignatedrequirement` | identifier "com.microsoft.wdav.netext" and anchor apple generic and certificate 1[field.1.2.840.113635.100.… |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_filtergrade` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_filterpackets` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_filtersockets` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_organization` | ITCE |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_pluginbundleid` | com.microsoft.wdav |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.webcontent-filter_userdefinedname` | Microsoft Defender Content Filter |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
