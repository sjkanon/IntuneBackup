<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Local Administrators

Bepaalt wie er lid is van de lokale groep Administrators, zodat LAPS een beheerde groep beheert in plaats van wat er toevallig op het apparaat staat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-071-DLocalAdministrators` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Local Group Membership - D - Local Administrators |
| Bestand | [`Baseline_WIN_D_Local_Administrators.json`](Baseline_WIN_D_Local_Administrators.json) |

> LAPS zonder beheerde administrators-groep is half werk: LAPS roteert het wachtwoord van een account dat verder niemand beheert.

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localusersandgroups_configure` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_desc` | administrators |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_action` | add_restrict |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_userselectiontype` | manual |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_users` | WLapsAdmin |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
