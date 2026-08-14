<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Audit and Event Logging

Legt vast welke gebeurtenissen Windows registreert en hoe groot de logboeken zijn — de basis voor onderzoek achteraf.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-009-Auditing` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - Audit and Event Logging |
| Bestand | [`Baseline_WIN_D_Audit_and_Event_Logging.json`](Baseline_WIN_D_Audit_and_Event_Logging.json) |

> 23 -> 40 instellingen; alle bestaande zaten er al in.

## Instellingen — 40

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_auditsettings_includecmdline` | 1 |
| `device_vendor_msft_policy_config_eventlogservice_controleventlogbehavior` | 0 |
| `device_vendor_msft_policy_config_eventlogservice_specifymaximumfilesizeapplicationlog` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_eventlogservice_specifymaximumfilesizeapplicationlog_channel_logmaxsize` | 32768 |
| `device_vendor_msft_policy_config_admx_eventlog_channel_log_retention_2` | 0 |
| `device_vendor_msft_policy_config_eventlogservice_specifymaximumfilesizesecuritylog` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_eventlogservice_specifymaximumfilesizesecuritylog_channel_logmaxsize` | 196608 |
| `device_vendor_msft_policy_config_admx_eventlog_channel_log_retention_3` | 0 |
| `device_vendor_msft_policy_config_admx_eventlog_channel_logmaxsize_3` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_eventlog_channel_logmaxsize_3_channel_logmaxsize` | 32768 |
| `device_vendor_msft_policy_config_admx_eventlog_channel_log_retention_4` | 0 |
| `device_vendor_msft_policy_config_eventlogservice_specifymaximumfilesizesystemlog` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_eventlogservice_specifymaximumfilesizesystemlog_channel_logmaxsize` | 32768 |
| `device_vendor_msft_policy_config_audit_accountlogon_auditcredentialvalidation` | 3 |
| `device_vendor_msft_policy_config_audit_accountlogonlogoff_auditaccountlockout` | 2 |
| `device_vendor_msft_policy_config_audit_accountlogonlogoff_auditgroupmembership` | 1 |
| `device_vendor_msft_policy_config_audit_accountlogonlogoff_auditlogoff` | 1 |
| `device_vendor_msft_policy_config_audit_accountlogonlogoff_auditlogon` | 3 |
| `device_vendor_msft_policy_config_audit_accountmanagement_auditapplicationgroupmanagement` | 3 |
| `device_vendor_msft_policy_config_audit_policychange_auditauthenticationpolicychange` | 1 |
| `device_vendor_msft_policy_config_audit_policychange_auditauthorizationpolicychange` | 1 |
| `device_vendor_msft_policy_config_audit_policychange_auditpolicychange` | 1 |
| `device_vendor_msft_policy_config_audit_objectaccess_auditfileshare` | 3 |
| `device_vendor_msft_policy_config_audit_accountlogonlogoff_auditotherlogonlogoffevents` | 3 |
| `device_vendor_msft_policy_config_audit_accountmanagement_auditsecuritygroupmanagement` | 1 |
| `device_vendor_msft_policy_config_audit_system_auditsecuritysystemextension` | 1 |
| `device_vendor_msft_policy_config_audit_accountlogonlogoff_auditspeciallogon` | 1 |
| `device_vendor_msft_policy_config_audit_accountmanagement_audituseraccountmanagement` | 3 |
| `device_vendor_msft_policy_config_audit_detailedtracking_auditpnpactivity` | 1 |
| `device_vendor_msft_policy_config_audit_detailedtracking_auditprocesscreation` | 1 |
| `device_vendor_msft_policy_config_audit_objectaccess_auditdetailedfileshare` | 2 |
| `device_vendor_msft_policy_config_audit_objectaccess_auditotherobjectaccessevents` | 3 |
| `device_vendor_msft_policy_config_audit_objectaccess_auditremovablestorage` | 3 |
| `device_vendor_msft_policy_config_audit_policychange_auditmpssvcrulelevelpolicychange` | 3 |
| `device_vendor_msft_policy_config_audit_policychange_auditotherpolicychangeevents` | 2 |
| `device_vendor_msft_policy_config_audit_privilegeuse_auditsensitiveprivilegeuse` | 3 |
| `device_vendor_msft_policy_config_audit_system_auditipsecdriver` | 3 |
| `device_vendor_msft_policy_config_audit_system_auditothersystemevents` | 3 |
| `device_vendor_msft_policy_config_audit_system_auditsecuritystatechange` | 1 |
| `device_vendor_msft_policy_config_audit_system_auditsystemintegrity` | 3 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
