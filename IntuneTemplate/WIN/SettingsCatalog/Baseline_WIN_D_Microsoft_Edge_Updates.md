<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Microsoft_Edge_Updates.en.md) · [Français](Baseline_WIN_D_Microsoft_Edge_Updates.fr.md)

# [Baseline] - WIN - D - Microsoft Edge Updates

Hoe en wanneer Edge zichzelf bijwerkt, en dat een gebruiker dat niet kan uitstellen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-074-DMicrosoftEdgeUpdates` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - D - Updates |
| Bestand | [`Baseline_WIN_D_Microsoft_Edge_Updates.json`](Baseline_WIN_D_Microsoft_Edge_Updates.json) |

> Twee instellingen erbij die OpenIntuneBaseline niet zet, want zonder die twee heeft een openstaande Edge-update geen harde einddatum: het herstartvenster (relaunchwindow, 17:00 plus 780 minuten, dus 17:00 tot 06:00) en versneld herstarten bij een ernstig verouderde versie (relaunchfastifoutdated, 7 dagen, de laagste waarde die de definitie toestaat). De melding stond al op Required met een periode van 3 dagen; het venster zorgt dat de gedwongen herstart buiten werktijd valt. Let op: een apparaat dat nachts uit staat, herstart pas in het eerstvolgende venster. Die twee staan in de catalogus in een eigen versienamespace (microsoft_edgev93 voor het venster, microsoft_edgev141 voor de verouderde versie), waar de rest van deze policy op microsoft_edge en updatev87/v94/v95 staat; ids geverifieerd tegen de definities in DCv2/Settings.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management<br>9.1 Ensure Use of Only Fully Supported Browsers and Email Clients |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 26

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
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

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
