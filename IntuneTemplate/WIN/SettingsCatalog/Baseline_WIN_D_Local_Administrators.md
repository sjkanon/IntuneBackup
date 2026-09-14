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
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Local Group Membership - D - Local Administrators |
| Bestand | [`Baseline_WIN_D_Local_Administrators.json`](Baseline_WIN_D_Local_Administrators.json) |

> LAPS zonder beheerde administrators-groep is half werk: LAPS roteert het wachtwoord van een account dat verder niemand beheert.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts |
| NIST CSF 2.0 | PR.AA-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
