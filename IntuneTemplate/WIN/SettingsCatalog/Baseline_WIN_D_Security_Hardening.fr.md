<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Security_Hardening.md) · [English](Baseline_WIN_D_Security_Hardening.en.md) · **Français**

# [Baseline] - WIN - D - Security Hardening

Ensemble de paramètres de durcissement divers : variantes SMB et NTLM obsolètes, exécution automatique, journalisation PowerShell et protection des composants système.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Security Hardening |
| Fichier | [`Baseline_WIN_D_Security_Hardening.json`](Baseline_WIN_D_Security_Hardening.json) |

> Reprend les anciennes policies Network Security (017), System Services (025) et la majeure partie d'Administrative Templates (008).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.9 Gestion de la configuration<br>A.8.15 Journalisation<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software<br>8.8 Collect Command-Line Audit Logs<br>10.3 Disable Autorun and Autoplay for Removable Media |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 96

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
