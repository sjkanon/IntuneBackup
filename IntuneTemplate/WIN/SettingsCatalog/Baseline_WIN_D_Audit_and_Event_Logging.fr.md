<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Audit_and_Event_Logging.md) · [English](Baseline_WIN_D_Audit_and_Event_Logging.en.md) · **Français**

# [Baseline] - WIN - D - Audit and Event Logging

Définit quels événements Windows enregistre et quelle est la taille des journaux — la base de toute investigation a posteriori.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-009-Auditing` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Audit and Event Logging |
| Fichier | [`Baseline_WIN_D_Audit_and_Event_Logging.json`](Baseline_WIN_D_Audit_and_Event_Logging.json) |

> 23 -> 40 paramètres ; tous les paramètres existants y figuraient déjà.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Journalisation |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>8.3 Ensure Adequate Audit Log Storage<br>8.5 Collect Detailed Audit Logs<br>8.8 Collect Command-Line Audit Logs |
| NIST CSF 2.0 | PR.PS-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 40

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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
| `device_vendor_msft_policy_config_audit_privilegeuse_auditsensitiveprivilegeuse` | 1 |
| `device_vendor_msft_policy_config_audit_system_auditipsecdriver` | 3 |
| `device_vendor_msft_policy_config_audit_system_auditothersystemevents` | 3 |
| `device_vendor_msft_policy_config_audit_system_auditsecuritystatechange` | 1 |
| `device_vendor_msft_policy_config_audit_system_auditsystemintegrity` | 3 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
