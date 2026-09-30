<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Legacy_Hardening.md) · [English](Baseline_WIN_D_Legacy_Hardening.en.md) · **Français**

# CXNM - Standard - WIN - D - Legacy Hardening

Les paramètres de durcissement de l'ancienne policy Administrative Templates pour lesquels OpenIntuneBaseline n'a pas d'équivalent : chemins UNC renforcés, WDigest, blocage de classes de périphériques, DNS multicast et traitement de la stratégie de registre.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | Paramètres de durcissement propres sans équivalent dans OpenIntuneBaseline |
| Fichier | [`Baseline_WIN_D_Legacy_Hardening.json`](Baseline_WIN_D_Legacy_Hardening.json) |

> Ce qui reste de l'ancienne policy Administrative Templates (008) après qu'OIB a repris le reste : hardened UNC paths, WDigest, blocage de classes de périphériques, DNS multicast, LSA custom SSP/AP, notifications MPR, comportement en veille et traitement du registre par Group Policy. Maintenu séparément pour qu'une mise à niveau d'OIB n'entraîne ni ne supprime ces paramètres sans que personne ne le remarque.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.9 Gestion de la configuration<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 25

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
