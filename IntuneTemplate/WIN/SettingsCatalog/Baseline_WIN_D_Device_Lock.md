<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Device Lock

Bepaalt wanneer het scherm vergrendelt en welke eisen aan de toegangscode gelden, plus het gedrag bij dichtklappen en stroom.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-013-DeviceLock` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - U - Power and Device Lock |
| Bestand | [`Baseline_WIN_D_Device_Lock.json`](Baseline_WIN_D_Device_Lock.json) |

> OIB noemt deze policy U omdat zij 'm aan gebruikers toewijst; alle 12 instellingen zijn device-scoped, dus hier is het D (zie check-scope.js). De drie eigen wachtwoordinstellingen blijven staan.

## Instellingen — 15

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_power_requirepasswordwhencomputerwakesonbattery` | 1 |
| `device_vendor_msft_policy_config_power_requirepasswordwhencomputerwakespluggedin` | 1 |
| `device_vendor_msft_policy_config_power_standbytimeoutonbattery` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_standbytimeoutonbattery_enterdcstandbytimeout` | 600 |
| `device_vendor_msft_policy_config_power_standbytimeoutpluggedin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_standbytimeoutpluggedin_enteracstandbytimeout` | 900 |
| `device_vendor_msft_policy_config_power_displayofftimeoutonbattery` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_displayofftimeoutonbattery_entervideodcpowerdowntimeout` | 300 |
| `device_vendor_msft_policy_config_power_displayofftimeoutpluggedin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_displayofftimeoutpluggedin_entervideoacpowerdowntimeout` | 600 |
| `device_vendor_msft_policy_config_power_unattendedsleeptimeoutonbattery` | 600 |
| `device_vendor_msft_policy_config_power_unattendedsleeptimeoutpluggedin` | 900 |
| `device_vendor_msft_policy_config_devicelock_devicepasswordenabled` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_devicelock_devicepasswordhistory` | 24 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_devicelock_mindevicepasswordlength` | 14 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
