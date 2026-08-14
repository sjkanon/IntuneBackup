<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Legacy Hardening

De hardeningsinstellingen uit de oude Administrative Templates-policy waar OpenIntuneBaseline geen tegenhanger voor heeft: hardened UNC-paden, WDigest, blokkade van apparaatklassen, multicast-DNS en het verwerken van registerbeleid.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-070-DLegacyHardening` |
| Bron | Eigen hardening-instellingen zonder tegenhanger in OpenIntuneBaseline |
| Bestand | [`Baseline_WIN_D_Legacy_Hardening.json`](Baseline_WIN_D_Legacy_Hardening.json) |

> Wat er van de oude Administrative Templates-policy (008) overblijft nadat OIB de rest heeft overgenomen: hardened UNC paths, WDigest, blokkade van apparaatklassen, multicast-DNS, LSA custom SSP/AP, MPR-notificaties, standby-gedrag en Group Policy-registerverwerking. Los gehouden zodat een OIB-upgrade deze instellingen niet stilzwijgend meesleept of weggooit.

## Instellingen — 25

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_mssecurityguide_wdigestauthentication` | 0 |
| `device_vendor_msft_policy_config_admx_dnsclient_turn_off_multicast` | 1 |
| `device_vendor_msft_policy_config_admx_networkconnections_nc_showsharedaccessui` | 1 |
| `device_vendor_msft_policy_config_connectivity_hardeneduncpaths` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_connectivity_hardeneduncpaths_pol_hardenedpaths` | *(2 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_connectivity_hardeneduncpaths_pol_hardenedpaths_key` | \\*\SYSVOL |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_connectivity_hardeneduncpaths_pol_hardenedpaths_value` | RequireMutualAuthentication=1,RequireIntegrity=1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_connectivity_hardeneduncpaths_pol_hardenedpaths_key` | \\*\NETLOGON |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_connectivity_hardeneduncpaths_pol_hardenedpaths_value` | RequireMutualAuthentication=1,RequireIntegrity=1 |
| `device_vendor_msft_policy_config_deviceinstallation_preventinstallationofmatchingdevicesetupclasses` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_deviceinstallation_preventinstallationofmatchingdevicesetupclasses_deviceinstall_classes_deny_retroactive` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_deviceinstallation_preventinstallationofmatchingdevicesetupclasses_deviceinstall_classes_deny_list` |  {d48179be-ec20-11d1-b6b8-00c04fa372a7} |
| `device_vendor_msft_policy_config_admx_grouppolicy_cse_registry` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_grouppolicy_cse_registry_cse_nobackground10` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_grouppolicy_cse_registry_cse_nochanges10` | 1 |
| `device_vendor_msft_policy_config_localsecurityauthority_allowcustomsspsaps` | 0 |
| `device_vendor_msft_policy_config_power_allowstandbystateswhensleepingonbattery` | 0 |
| `device_vendor_msft_policy_config_power_allowstandbywhensleepingpluggedin` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowautomaticpromptingforactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowautomaticpromptingforactivexcontrols_iz_partname2201` | 3 |
| `device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_disableblockatfirstseen` | 1 |
| `device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_realtimeprotection_disablescanonrealtimeenable` | 1 |
| `device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_scan_disablepackedexescanning` | 1 |
| `device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_disableroutinelytakingaction` | 0 |
| `device_vendor_msft_policy_config_windowslogon_enablemprnotifications` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
