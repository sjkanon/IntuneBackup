<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Internet_Explorer_Legacy.md) · [English](Baseline_WIN_D_Internet_Explorer_Legacy.en.md) · **Français**

# [Baseline] - WIN - D - Internet Explorer Legacy

Durcissement du moteur Internet Explorer, qui fonctionne encore sous le mode IE d'Edge et au sein d'anciennes applications.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Internet Explorer (Legacy) - D - Security |
| Fichier | [`Baseline_WIN_D_Internet_Explorer_Legacy.json`](Baseline_WIN_D_Internet_Explorer_Legacy.json) |

> Le seul paramètre utilisateur a été omis : il figure déjà dans [Baseline] - WIN - U - Windows User Experience, et deux policies qui définissent le même paramètre produisent un conflit. Reprend 204 paramètres de l'ancien bloc Administrative Templates.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 206

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_internetexplorer_allowsoftwarewhensignatureisinvalid` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_checkservercertificaterevocation` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_checksignaturesondownloadedprograms` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_donotallowactivexcontrolsinprotectedmode` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disableencryptionsupport` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_disableencryptionsupport_advanced_wininetprotocoloptions` | 10240 |
| `device_vendor_msft_policy_config_internetexplorer_disableprocessesinenhancedprotectedmode` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_allowenhancedprotectedmode` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disableignoringcertificateerrors` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowaccesstodatasources` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowaccesstodatasources_iz_partname1406` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowcopypasteviascript` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowcopypasteviascript_iz_partname1407` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowdraganddropcopyandpastefiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowdraganddropcopyandpastefiles_iz_partname1802` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowloadingofxamlfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowloadingofxamlfiles_iz_partname2402` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowonlyapproveddomainstouseactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowonlyapproveddomainstouseactivexcontrols_iz_partname120b` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowonlyapproveddomainstousetdcactivexcontrol` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowonlyapproveddomainstousetdcactivexcontrol_iz_partname120c` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowscriptinitiatedwindows` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowscriptinitiatedwindows_iz_partname2102` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowscriptingofinternetexplorerwebbrowsercontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowscriptingofinternetexplorerwebbrowsercontrols_iz_partname1206` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowscriptlets` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowscriptlets_iz_partname1209` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowupdatestostatusbarviascript` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowupdatestostatusbarviascript_iz_partname2103` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowvbscripttorunininternetexplorer` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowvbscripttorunininternetexplorer_iz_partname140c` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowautomaticpromptingforfiledownloads` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowautomaticpromptingforfiledownloads_iz_partname2200` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonedonotrunantimalwareagainstactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonedonotrunantimalwareagainstactivexcontrols_iz_partname270c` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonedownloadsignedactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonedownloadsignedactivexcontrols_iz_partname1001` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonedownloadunsignedactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonedownloadunsignedactivexcontrols_iz_partname1004` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneenabledraggingofcontentfromdifferentdomainsacrosswindows` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneenabledraggingofcontentfromdifferentdomainsacrosswindows_iz_partname2709` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneenabledraggingofcontentfromdifferentdomainswithinwindows` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneenabledraggingofcontentfromdifferentdomainswithinwindows_iz_partname2708` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneincludelocalpathwhenuploadingfilestoserver` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneincludelocalpathwhenuploadingfilestoserver_iz_partname160a` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneinitializeandscriptactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneinitializeandscriptactivexcontrols_iz_partname1201` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonejavapermissions_iz_partname1c00` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonelaunchingapplicationsandfilesiniframe` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonelaunchingapplicationsandfilesiniframe_iz_partname1804` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonelogonoptions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonelogonoptions_iz_partname1a00` | 65536 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonenavigatewindowsandframes` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonenavigatewindowsandframes_iz_partname1607` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallownetframeworkreliantcomponents` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallownetframeworkreliantcomponents_iz_partname2004` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzonerunnetframeworkreliantcomponentssignedwithauthenticode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzonerunnetframeworkreliantcomponentssignedwithauthenticode_iz_partname2001` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneshowsecuritywarningforpotentiallyunsafefiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneshowsecuritywarningforpotentiallyunsafefiles_iz_partname1806` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneenablecrosssitescriptingfilter` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneenablecrosssitescriptingfilter_iz_partname1409` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneenableprotectedmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneenableprotectedmode_iz_partname2500` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowsmartscreenie` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowsmartscreenie_iz_partname2301` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneusepopupblocker` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneusepopupblocker_iz_partname1809` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowuserdatapersistence` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowuserdatapersistence_iz_partname1606` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_internetzoneallowlessprivilegedsites` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_internetzoneallowlessprivilegedsites_iz_partname2101` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_includeallnetworkpaths` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_intranetzonedonotrunantimalwareagainstactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_intranetzonedonotrunantimalwareagainstactivexcontrols_iz_partname270c` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_intranetzoneinitializeandscriptactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_intranetzoneinitializeandscriptactivexcontrols_iz_partname1201` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_intranetzonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_intranetzonejavapermissions_iz_partname1c00` | 65536 |
| `device_vendor_msft_policy_config_internetexplorer_localmachinezonedonotrunantimalwareagainstactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_localmachinezonedonotrunantimalwareagainstactivexcontrols_iz_partname270c` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_localmachinezonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_localmachinezonejavapermissions_iz_partname1c00` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_lockeddowninternetzoneallowsmartscreenie` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_lockeddowninternetzoneallowsmartscreenie_iz_partname2301` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_lockeddownintranetjavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_lockeddownintranetjavapermissions_iz_partname1c00` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_lockeddownlocalmachinezonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_lockeddownlocalmachinezonejavapermissions_iz_partname1c00` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_lockeddownrestrictedsiteszonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_lockeddownrestrictedsiteszonejavapermissions_iz_partname1c00` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_lockeddownrestrictedsiteszoneallowsmartscreenie` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_lockeddownrestrictedsiteszoneallowsmartscreenie_iz_partname2301` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_lockeddowntrustedsiteszonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_lockeddowntrustedsiteszonejavapermissions_iz_partname1c00` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowaccesstodatasources` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowaccesstodatasources_iz_partname1406` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowactivescripting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowactivescripting_iz_partname1400` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowbinaryandscriptbehaviors` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowbinaryandscriptbehaviors_iz_partname2000` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowcopypasteviascript` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowcopypasteviascript_iz_partname1407` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowdraganddropcopyandpastefiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowdraganddropcopyandpastefiles_iz_partname1802` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowfiledownloads` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowfiledownloads_iz_partname1803` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowloadingofxamlfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowloadingofxamlfiles_iz_partname2402` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowmetarefresh` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowmetarefresh_iz_partname1608` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowonlyapproveddomainstouseactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowonlyapproveddomainstouseactivexcontrols_iz_partname120b` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowonlyapproveddomainstousetdcactivexcontrol` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowonlyapproveddomainstousetdcactivexcontrol_iz_partname120c` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowscriptinitiatedwindows` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowscriptinitiatedwindows_iz_partname2102` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowscriptingofinternetexplorerwebbrowsercontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowscriptingofinternetexplorerwebbrowsercontrols_iz_partname1206` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowscriptlets` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowscriptlets_iz_partname1209` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowupdatestostatusbarviascript` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowupdatestostatusbarviascript_iz_partname2103` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowvbscripttorunininternetexplorer` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowvbscripttorunininternetexplorer_iz_partname140c` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowautomaticpromptingforfiledownloads` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowautomaticpromptingforfiledownloads_iz_partname2200` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonedonotrunantimalwareagainstactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonedonotrunantimalwareagainstactivexcontrols_iz_partname270c` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonedownloadsignedactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonedownloadsignedactivexcontrols_iz_partname1001` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonedownloadunsignedactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonedownloadunsignedactivexcontrols_iz_partname1004` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenabledraggingofcontentfromdifferentdomainsacrosswindows` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenabledraggingofcontentfromdifferentdomainsacrosswindows_iz_partname2709` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenabledraggingofcontentfromdifferentdomainswithinwindows` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenabledraggingofcontentfromdifferentdomainswithinwindows_iz_partname2708` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenablemimesniffing` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenablemimesniffing_iz_partname2100` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneincludelocalpathwhenuploadingfilestoserver` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneincludelocalpathwhenuploadingfilestoserver_iz_partname160a` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneinitializeandscriptactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneinitializeandscriptactivexcontrols_iz_partname1201` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonejavapermissions_iz_partname1c00` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonelaunchingapplicationsandfilesiniframe` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonelaunchingapplicationsandfilesiniframe_iz_partname1804` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonelogonoptions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonelogonoptions_iz_partname1a00` | 196608 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonenavigatewindowsandframes` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonenavigatewindowsandframes_iz_partname1607` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallownetframeworkreliantcomponents` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallownetframeworkreliantcomponents_iz_partname2004` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonerunnetframeworkreliantcomponentssignedwithauthenticode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonerunnetframeworkreliantcomponentssignedwithauthenticode_iz_partname2001` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonerunactivexcontrolsandplugins` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonerunactivexcontrolsandplugins_iz_partname1200` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonescriptactivexcontrolsmarkedsafeforscripting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonescriptactivexcontrolsmarkedsafeforscripting_iz_partname1405` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonescriptingofjavaapplets` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszonescriptingofjavaapplets_iz_partname1402` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneshowsecuritywarningforpotentiallyunsafefiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneshowsecuritywarningforpotentiallyunsafefiles_iz_partname1806` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenablecrosssitescriptingfilter` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneenablecrosssitescriptingfilter_iz_partname1409` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneturnonprotectedmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneturnonprotectedmode_iz_partname2500` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowsmartscreenie` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowsmartscreenie_iz_partname2301` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneusepopupblocker` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneusepopupblocker_iz_partname1809` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowuserdatapersistence` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowuserdatapersistence_iz_partname1606` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowlessprivilegedsites` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_restrictedsiteszoneallowlessprivilegedsites_iz_partname2101` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_trustedsiteszonedonotrunantimalwareagainstactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_trustedsiteszonedonotrunantimalwareagainstactivexcontrols_iz_partname270c` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_trustedsiteszoneinitializeandscriptactivexcontrols` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_trustedsiteszoneinitializeandscriptactivexcontrols_iz_partname1201` | 3 |
| `device_vendor_msft_policy_config_internetexplorer_trustedsiteszonejavapermissions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_trustedsiteszonejavapermissions_iz_partname1c00` | 65536 |
| `device_vendor_msft_policy_config_internetexplorer_allowcertificateaddressmismatchwarning` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disablebypassofsmartscreenwarnings` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disablebypassofsmartscreenwarningsaboutuncommonfiles` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_preventmanagingsmartscreenfilter` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_preventmanagingsmartscreenfilter_ie9safetyfilteroptions` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_preventperuserinstallationofactivexcontrols` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_removerunthistimebuttonforoutdatedactivexcontrols` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_donotblockoutdatedactivexcontrols` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_allowfallbacktossl3` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_internetexplorer_allowfallbacktossl3_advanced_enablessl3fallbackoptions` | 0 |
| `device_vendor_msft_policy_config_internetexplorer_consistentmimehandlinginternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_mimesniffingsafetyfeatureinternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_mkprotocolsecurityrestrictioninternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_notificationbarinternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_protectionfromzoneelevationinternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_restrictactivexinstallinternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_restrictfiledownloadinternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_scriptedwindowsecurityrestrictionsinternetexplorerprocesses` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_donotallowuserstoaddsites` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_donotallowuserstochangepolicies` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_securityzonesuseonlymachinesettings` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_specifyuseofactivexinstallerservice` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disablecrashdetection` | 1 |
| `device_vendor_msft_policy_config_internetexplorer_disablesecuritysettingscheck` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
