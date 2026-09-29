<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_User_Rights.md) · [English](Baseline_WIN_D_User_Rights.en.md) · **Français**

# [Baseline] - WIN - D - User Rights

Définit qui a quels droits sur l'appareil : ouvrir une session en tant que service, effectuer des sauvegardes, arrêter l'appareil, charger des pilotes.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - User Rights |
| Fichier | [`Baseline_WIN_D_User_Rights.json`](Baseline_WIN_D_User_Rights.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.8.2 Droits d'accès privilégiés<br>A.8.18 Utilisation de programmes utilitaires à privilèges |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 28

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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
| `device_vendor_msft_policy_config_userrights_profilesystemperformance` | *S-1-5-32-544, *S-1-5-80-0 |
| `device_vendor_msft_policy_config_userrights_replaceprocessleveltoken` | *S-1-5-19, *S-1-5-20 |
| `device_vendor_msft_policy_config_userrights_logonasbatchjob` | *S-1-5-32-544 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
