<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Edge_Updates.md) · [English](Baseline_WIN_D_Microsoft_Edge_Updates.en.md) · **Français**

# [Baseline] - WIN - D - Microsoft Edge Updates

Comment et quand Edge se met à jour, et le fait qu'un utilisateur ne peut pas le reporter.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - D - Updates |
| Fichier | [`Baseline_WIN_D_Microsoft_Edge_Updates.json`](Baseline_WIN_D_Microsoft_Edge_Updates.json) |

> Deux paramètres ajoutés que OpenIntuneBaseline ne définit pas, car sans eux une mise à jour d'Edge en attente n'a pas d'échéance ferme : la fenêtre de redémarrage (relaunchwindow, 17:00 plus 780 minutes, soit de 17:00 à 06:00) et le redémarrage accéléré pour une version gravement obsolète (relaunchfastifoutdated, 7 jours, la valeur la plus basse que la définition autorise). La notification était déjà sur Required avec une période de 3 jours ; la fenêtre garantit que le redémarrage forcé a lieu en dehors des heures de travail. Attention : un appareil éteint la nuit ne redémarre que dans la fenêtre suivante. Ces deux paramètres se trouvent dans le catalogue dans leur propre espace de noms de version (microsoft_edgev93 pour la fenêtre, microsoft_edgev141 pour la version obsolète), alors que le reste de cette policy est sur microsoft_edge et updatev87/v94/v95 ; ids vérifiés par rapport aux définitions dans DCv2/Settings.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management<br>9.1 Ensure Use of Only Fully Supported Browsers and Email Clients |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 26

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_componentupdatesenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_relaunchnotification` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_relaunchnotification_relaunchnotification` | 2 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_relaunchnotificationperiod` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_relaunchnotificationperiod_relaunchnotificationperiod` | 259200000 |
| `device_vendor_msft_policy_config_updateupdates.1~policy~cat_edgeupdate~cat_applications~cat_microsoftedge_pol_allowinstallationmicrosoftedge` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_updateupdates.1~policy~cat_edgeupdate~cat_applications~cat_microsoftedge_pol_allowinstallationmicrosoftedge_part_installpolicy` | 5 |
| `device_vendor_msft_policy_config_update~policy~cat_google~cat_googleupdate~cat_applications~cat_microsoftedge_pol_allowinstallationmicrosoftedge` | 1 |
| `device_vendor_msft_policy_config_updatev83diff~policy~cat_edgeupdate~cat_applications~cat_microsoftedge_pol_createdesktopshortcutmicrosoftedge` | 1 |
| `device_vendor_msft_policy_config_updatev95~policy~cat_edgeupdate~cat_applications~cat_microsoftedge_pol_targetchannelmicrosoftedge` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_updatev95~policy~cat_edgeupdate~cat_applications~cat_microsoftedge_pol_targetchannelmicrosoftedge_part_targetchannel` | stable |
| `device_vendor_msft_policy_config_update~policy~cat_google~cat_googleupdate~cat_applications~cat_microsoftedge_pol_updatepolicymicrosoftedge` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_update~policy~cat_google~cat_googleupdate~cat_applications~cat_microsoftedge_pol_updatepolicymicrosoftedge_part_updatepolicy` | 1 |
| `device_vendor_msft_policy_config_updatev94~policy~cat_edgeupdate_pol_ecscontrol` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_updatev94~policy~cat_edgeupdate_pol_ecscontrol_part_ecscontrol` | 0 |
| `device_vendor_msft_policy_config_updatev87~policy~cat_edgeupdate~cat_webview_pol_allowinstallationmicrosoftedgewebview` | 1 |
| `device_vendor_msft_policy_config_updatev87~policy~cat_edgeupdate~cat_webview_pol_updatepolicymicrosoftedgewebview` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_updatev87~policy~cat_edgeupdate~cat_webview_pol_updatepolicymicrosoftedgewebview_part_updatepolicy` | 1 |
| `device_vendor_msft_policy_config_updatev87.updates.1~policy~cat_edgeupdate~cat_webview_pol_allowinstallationmicrosoftedgewebview` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_updatev87.updates.1~policy~cat_edgeupdate~cat_webview_pol_allowinstallationmicrosoftedgewebview_part_installpolicy` | 5 |
| `device_vendor_msft_policy_config_update~policy~cat_google~cat_googleupdate~cat_preferences_pol_autoupdatecheckperiod` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_update~policy~cat_google~cat_googleupdate~cat_preferences_pol_autoupdatecheckperiod_part_autoupdatecheckperiod` | 240 |
| `device_vendor_msft_policy_config_microsoft_edgev93~policy~microsoft_edge_relaunchwindow` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev93~policy~microsoft_edge_relaunchwindow_relaunchwindow` | {"entries":[{"duration_mins":780,"start":{"hour":17,"minute":0}}]} |
| `device_vendor_msft_policy_config_microsoft_edgev141~policy~microsoft_edge_relaunchfastifoutdated` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev141~policy~microsoft_edge_relaunchfastifoutdated_relaunchfastifoutdated` | 7 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
