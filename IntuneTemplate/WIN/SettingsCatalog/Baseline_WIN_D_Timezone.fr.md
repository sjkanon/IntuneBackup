<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Timezone.md) · [English](Baseline_WIN_D_Timezone.en.md) · **Français**

# CXNM - Standard - WIN - D - Timezone

Laisse Windows déterminer automatiquement le fuseau horaire, afin que les journaux et les certificats ne soient pas à une heure erronée.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Timezone |
| Fichier | [`Baseline_WIN_D_Timezone.json`](Baseline_WIN_D_Timezone.json) |

> Synchronise l'horloge via NTP et permet aux utilisateurs de changer de fuseau horaire, mais n'active pas *Définir le fuseau horaire automatiquement* : le settings catalog n'a pas de paramètre pour cela. C'est le script de plateforme OIB Enable-AutoTimezone.ps1 dans IntuneTemplate/WIN/PlatformScripts/ qui s'en charge ; attribuez-le à tous les appareils avec cette stratégie.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.17 Synchronisation des horloges |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 8.4 Standardize Time Synchronization |
| NIST CSF 2.0 | PR.PS-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 10

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient_w32time_crosssitesyncflags` | 2 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient_w32time_ntpclienteventlogflags` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient_w32time_ntpserver` | time.windows.com |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient_w32time_resolvepeerbackoffmaxtimes` | 7 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient_w32time_resolvepeerbackoffminutes` | 15 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient_w32time_specialpollinterval` | 1024 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_w32time_w32time_policy_configure_ntpclient_w32time_type` | allsync |
| `device_vendor_msft_policy_config_admx_w32time_w32time_policy_enable_ntpclient` | 1 |
| `device_vendor_msft_policy_config_userrights_changetimezone` | *S-1-5-19, *S-1-5-32-544, *S-1-5-32-545 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
