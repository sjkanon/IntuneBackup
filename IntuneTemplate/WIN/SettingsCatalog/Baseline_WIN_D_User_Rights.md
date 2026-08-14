<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - User Rights

Legt vast wie welke rechten op het apparaat heeft: aanmelden als service, back-ups maken, het apparaat afsluiten, stuurprogramma's laden.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-026-UserRights` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - User Rights |
| Bestand | [`Baseline_WIN_D_User_Rights.json`](Baseline_WIN_D_User_Rights.json) |

## Instellingen — 25

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_userrights_accessfromnetwork` | *S-1-5-32-544, *S-1-5-32-555 |
| `device_vendor_msft_policy_config_userrights_allowlocallogon` | *S-1-5-32-544, *S-1-5-32-545 |
| `device_vendor_msft_policy_config_userrights_backupfilesanddirectories` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_changesystemtime` | *S-1-5-19, *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_createglobalobjects` | *S-1-5-6, *S-1-5-19, *S-1-5-20, *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_createpagefile` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_createsymboliclinks` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_debugprograms` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_denyaccessfromnetwork` | *S-1-5-113, *S-1-5-32-546 |
| `device_vendor_msft_policy_config_userrights_denylocallogon` | *S-1-5-32-546 |
| `device_vendor_msft_policy_config_userrights_denylogonasbatchjob` | *S-1-5-32-546 |
| `device_vendor_msft_policy_config_userrights_denylogonasservice` | *S-1-5-32-546 |
| `device_vendor_msft_policy_config_userrights_denyremotedesktopserviceslogon` | *S-1-5-113, *S-1-5-32-546 |
| `device_vendor_msft_policy_config_userrights_generatesecurityaudits` | *S-1-5-19, *S-1-5-20 |
| `device_vendor_msft_policy_config_userrights_impersonateclient` | *S-1-5-6, *S-1-5-19, *S-1-5-20, *S-1-5-32-544, *S-1-5-99-216390572-1995538116-3857911515-2404958512-2623887229 |
| `device_vendor_msft_policy_config_userrights_increaseschedulingpriority` | *S-1-5-32-544, *S-1-5-90-0 |
| `device_vendor_msft_policy_config_userrights_loadunloaddevicedrivers` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_manageauditingandsecuritylog` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_managevolume` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_modifyfirmwareenvironment` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_profilesingleprocess` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_remoteshutdown` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_restorefilesanddirectories` | *S-1-5-32-544 |
| `device_vendor_msft_policy_config_userrights_shutdownthesystem` | *S-1-5-32-544, *S-1-5-32-545 |
| `device_vendor_msft_policy_config_userrights_takeownership` | *S-1-5-32-544 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
