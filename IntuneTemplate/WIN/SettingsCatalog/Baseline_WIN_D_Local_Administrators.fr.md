<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Local_Administrators.md) · [English](Baseline_WIN_D_Local_Administrators.en.md) · **Français**

# [Baseline] - WIN - D - Local Administrators

Détermine qui est membre du groupe local Administrators, afin que LAPS gère un groupe maîtrisé plutôt que ce qui se trouve par hasard sur l'appareil.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-071-DLocalAdministrators` |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Local Group Membership - D - Local Administrators |
| Fichier | [`Baseline_WIN_D_Local_Administrators.json`](Baseline_WIN_D_Local_Administrators.json) |

> LAPS sans groupe administrateurs géré, c'est un travail à moitié fait : LAPS fait tourner le mot de passe d'un compte que personne d'autre ne gère.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Droits d'accès privilégiés |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts |
| NIST CSF 2.0 | PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localusersandgroups_configure` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_desc` | administrators |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_action` | add_restrict |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_userselectiontype` | manual |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_localusersandgroups_configure_groupconfiguration_accessgroup_users` | WLapsAdmin |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
