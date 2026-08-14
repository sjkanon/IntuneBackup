<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Security Hardening

Verzameling losse hardeningsinstellingen: verouderde SMB- en NTLM-varianten, automatisch afspelen, PowerShell-logging en het afschermen van systeemonderdelen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-080-DSecurityHardening` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - Security Hardening |
| Bestand | [`Baseline_WIN_D_Security_Hardening.json`](Baseline_WIN_D_Security_Hardening.json) |

> Neemt de oude policies Network Security (017), System Services (025) en het grootste deel van Administrative Templates (008) over.

## Instellingen — 96

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_mssecurityguide_applyuacrestrictionstolocalaccountsonnetworklogon` | 1 |
| `device_vendor_msft_policy_config_mssecurityguide_configuresmbv1clientdriver` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_mssecurityguide_configuresmbv1clientdriver_pol_secguide_smb1clientdriver` | 4 |
| `device_vendor_msft_policy_config_mssecurityguide_configuresmbv1server` | 0 |
| `device_vendor_msft_policy_config_mssecurityguide_enablestructuredexceptionhandlingoverwriteprotection` | 1 |
| `device_vendor_msft_policy_config_msslegacy_ipv6sourceroutingprotectionlevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_msslegacy_ipv6sourceroutingprotectionlevel_disableipsourceroutingipv6` | 2 |
| `device_vendor_msft_policy_config_msslegacy_ipsourceroutingprotectionlevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_msslegacy_ipsourceroutingprotectionlevel_disableipsourcerouting` | 2 |
| `device_vendor_msft_policy_config_msslegacy_allowicmpredirectstooverrideospfgeneratedroutes` | 0 |
| `device_vendor_msft_policy_config_msslegacy_allowthecomputertoignorenetbiosnamereleaserequestsexceptfromwinsservers` | 1 |
| `device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_screensavergraceperiod` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_screensavergraceperiod_screensavergraceperiod` | 0 |
| `device_vendor_msft_policy_config_connectivity_prohibitinstallationandconfigurationofnetworkbridge` | 1 |
| `device_vendor_msft_policy_config_admx_networkconnections_nc_stddomainusersetlocation` | 1 |
| `device_vendor_msft_policy_config_admx_wcm_wcm_minimizeconnections` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_wcm_wcm_minimizeconnections_wcm_minimizeconnections_options` | 3 |
| `device_vendor_msft_policy_config_windowsconnectionmanager_prohitconnectiontonondomainnetworkswhenconnectedtodomainauthenticatednetwork` | 1 |
| `device_vendor_msft_policy_config_admx_credssp_allowencryptionoracle` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_credssp_allowencryptionoracle_allowencryptionoracledrop` | 0 |
| `device_vendor_msft_policy_config_credentialsdelegation_remotehostallowsdelegationofnonexportablecredentials` | 1 |
| `device_vendor_msft_policy_config_system_bootstartdriverinitialization` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_system_bootstartdriverinitialization_selectdriverloadpolicy` | 3 |
| `device_vendor_msft_policy_config_connectivity_disabledownloadingofprintdriversoverhttp` | 1 |
| `device_vendor_msft_policy_config_connectivity_disableinternetdownloadforwebpublishingandonlineorderingwizards` | 1 |
| `device_vendor_msft_policy_config_remoteassistance_unsolicitedremoteassistance` | 0 |
| `device_vendor_msft_policy_config_remoteassistance_solicitedremoteassistance` | 0 |
| `device_vendor_msft_policy_config_autoplay_disallowautoplayfornonvolumedevices` | 1 |
| `device_vendor_msft_policy_config_autoplay_setdefaultautorunbehavior` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_autoplay_setdefaultautorunbehavior_noautorun_dropdown` | 1 |
| `device_vendor_msft_policy_config_autoplay_turnoffautoplay` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_autoplay_turnoffautoplay_autorun_box` | 255 |
| `device_vendor_msft_policy_config_credentialsui_enumerateadministrators` | 0 |
| `device_vendor_msft_policy_config_admx_windowsexplorer_enablesmartscreen` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_windowsexplorer_enablesmartscreen_enablesmartscreendropdown` | block |
| `device_vendor_msft_policy_config_fileexplorer_turnoffdataexecutionpreventionforexplorer` | 0 |
| `device_vendor_msft_policy_config_fileexplorer_turnoffheapterminationoncorruption` | 0 |
| `device_vendor_msft_policy_config_admx_sharing_disablehomegroup` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disableinternetexplorerapp_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_disableinternetexplorerapp_v2_notifydisableieoptions` | 0 |
| `device_vendor_msft_policy_config_admx_pushtoinstall_disablepushtoinstall` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disableenclosuredownloading` | 1 |
| `device_vendor_msft_policy_config_errorreporting_disablewindowserrorreporting` | 0 |
| `device_vendor_msft_policy_config_windowspowershell_turnonpowershellscriptblocklogging` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_windowspowershell_turnonpowershellscriptblocklogging_enablescriptblockinvocationlogging` | 0 |
| `device_vendor_msft_policy_config_remotemanagement_allowbasicauthentication_client` | 0 |
| `device_vendor_msft_policy_config_remotemanagement_allowunencryptedtraffic_client` | 0 |
| `device_vendor_msft_policy_config_remotemanagement_disallowdigestauthentication` | 1 |
| `device_vendor_msft_policy_config_remotemanagement_allowbasicauthentication_service` | 0 |
| `device_vendor_msft_policy_config_remotemanagement_allowunencryptedtraffic_service` | 0 |
| `device_vendor_msft_policy_config_remotemanagement_disallowstoringofrunascredentials` | 1 |
| `device_vendor_msft_policy_config_connectivity_allowphonepclinking` | 0 |
| `device_vendor_msft_policy_config_dataprotection_allowdirectmemoryaccess` | 0 |
| `device_vendor_msft_policy_config_experience_allowcortana` | 0 |
| `device_vendor_msft_policy_config_experience_allowmanualmdmunenrollment` | 0 |
| `device_vendor_msft_policy_config_games_allowadvancedgamingservices` | 0 |
| `device_vendor_msft_policy_config_kerberos_pkinithashalgorithmconfiguration` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_kerberos_pkinithashalgorithmsha1` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_kerberos_pkinithashalgorithmsha256` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_kerberos_pkinithashalgorithmsha384` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_kerberos_pkinithashalgorithmsha512` | 1 |
| `device_vendor_msft_policy_config_lanmanserver_auditclientdoesnotsupportencryption` | 1 |
| `device_vendor_msft_policy_config_lanmanserver_auditclientdoesnotsupportsigning` | 1 |
| `device_vendor_msft_policy_config_lanmanserver_auditinsecureguestlogon` | 1 |
| `device_vendor_msft_policy_config_lanmanserver_authratelimiterdelayinms` | 2000 |
| `device_vendor_msft_policy_config_lanmanserver_enableauthratelimiter` | 1 |
| `device_vendor_msft_policy_config_lanmanserver_enablemailslots` | 0 |
| `device_vendor_msft_policy_config_lanmanserver_maxsmb2dialect` | 785 |
| `device_vendor_msft_policy_config_lanmanserver_minsmb2dialect` | 768 |
| `device_vendor_msft_policy_config_lanmanworkstation_auditinsecureguestlogon` | 1 |
| `device_vendor_msft_policy_config_lanmanworkstation_auditserverdoesnotsupportencryption` | 1 |
| `device_vendor_msft_policy_config_lanmanworkstation_auditserverdoesnotsupportsigning` | 1 |
| `device_vendor_msft_policy_config_lanmanworkstation_enableinsecureguestlogons` | 0 |
| `device_vendor_msft_policy_config_lanmanworkstation_enablemailslots` | 0 |
| `device_vendor_msft_policy_config_lanmanworkstation_maxsmb2dialect` | 785 |
| `device_vendor_msft_policy_config_lanmanworkstation_minsmb2dialect` | 768 |
| `device_vendor_msft_policy_config_lanmanworkstation_requireencryption` | 0 |
| `device_vendor_msft_policy_config_privacy_disableprivacyexperience` | 1 |
| `device_vendor_msft_policy_config_security_allowaddprovisioningpackage` | 0 |
| `device_vendor_msft_policy_config_security_allowremoveprovisioningpackage` | 0 |
| `device_vendor_msft_policy_config_security_requireretrievehealthcertificateonboot` | 1 |
| `device_vendor_msft_policy_config_settings_pagevisibilitylist` | hide:gaming-gamebar;gaming-gamedvr;gaming-broadcasting;gaming-gamemode;gaming-xboxnetworking |
| `device_vendor_msft_policy_config_smartscreen_enablesmartscreeninshell` | 1 |
| `device_vendor_msft_policy_config_smartscreen_preventoverrideforfilesinshell` | 1 |
| `device_vendor_msft_policy_config_sudo_enablesudo` | 0 |
| `device_vendor_msft_policy_config_systemservices_configurexboxaccessorymanagementservicestartupmode` | 4 |
| `device_vendor_msft_policy_config_systemservices_configurexboxliveauthmanagerservicestartupmode` | 4 |
| `device_vendor_msft_policy_config_systemservices_configurexboxlivegamesaveservicestartupmode` | 4 |
| `device_vendor_msft_policy_config_systemservices_configurexboxlivenetworkingservicestartupmode` | 4 |
| `device_vendor_msft_policy_config_taskscheduler_enablexboxgamesavetask` | 0 |
| `device_vendor_msft_policy_config_wifi_allowautoconnecttowifisensehotspots` | 0 |
| `device_vendor_msft_policy_config_wifi_allowinternetsharing` | 0 |
| `device_vendor_msft_policy_config_windowsinkworkspace_allowwindowsinkworkspace` | 1 |
| `device_vendor_msft_policy_config_wirelessdisplay_allowprojectionfrompc` | 1 |
| `device_vendor_msft_policy_config_wirelessdisplay_allowprojectiontopc` | 0 |
| `device_vendor_msft_policy_config_wirelessdisplay_requirepinforpairing` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
