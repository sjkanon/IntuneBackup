<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Timezone

Laat Windows de tijdzone automatisch bepalen, zodat logboeken en certificaten niet op een verkeerde tijd staan.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-082-DTimezone` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - Timezone |
| Bestand | [`Baseline_WIN_D_Timezone.json`](Baseline_WIN_D_Timezone.json) |

## Instellingen — 10

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
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

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
