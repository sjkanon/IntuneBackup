<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Office Security

De gebruikerskant van de Office-beveiliging: macrogedrag, vertrouwde locaties en beveiligde weergave.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-103-UMicrosoftOfficeSecurity` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Microsoft Office - U - Security |
| Bestand | [`Baseline_WIN_U_Microsoft_Office_Security.json`](Baseline_WIN_U_Microsoft_Office_Security.json) |

## Instellingen — 221

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_access16v2~policy~l_microsoftofficeaccess~l_applicationsettings~l_security~l_trustcenter_l_blockmacroexecutionfrominternet` | 1 |
| `user_vendor_msft_policy_config_access16v2~policy~l_microsoftofficeaccess~l_applicationsettings~l_security~l_trustcenter_l_disabletrustbarnotificationforunsigned` | 1 |
| `user_vendor_msft_policy_config_access16v2~policy~l_microsoftofficeaccess~l_applicationsettings~l_security~l_trustcenter_l_requirethatapplicationextensionsaresigned` | 1 |
| `user_vendor_msft_policy_config_access16v2~policy~l_microsoftofficeaccess~l_applicationsettings~l_security~l_trustcenter~l_trustedlocations_l_allowtrustedlocationsonthenetwork` | 0 |
| `user_vendor_msft_policy_config_access16v2~policy~l_microsoftofficeaccess~l_applicationsettings~l_security~l_trustcenter_l_vbawarningspolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_access16v2~policy~l_microsoftofficeaccess~l_applicationsettings~l_security~l_trustcenter_l_vbawarningspolicy_l_empty` | 3 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_datarecovery_l_donotshowdataextractionoptionswhenopeningcorruptworkbooks` | 1 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_advanced_l_asktoupdateautomaticlinks` | 1 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_advanced~l_weboptions~l_general_l_loadpicturesfromwebpagesnotcreatedinexcel` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_save_l_disableautorepublish` | 1 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_save_l_donotshowautorepublishwarningalert` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security_l_forcefileextenstionstomatch` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security_l_forcefileextenstionstomatch_l_empty` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security_l_determinewhethertoforceencryptedexcel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security_l_determinewhethertoforceencryptedexcel_l_determinewhethertoforceencryptedexceldropid` | 0 |
| `user_vendor_msft_policy_config_excel16v8~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_blockxllfrominternet` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v8~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_blockxllfrominternet_l_blockxllfrominternetenum` | 1 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_blockmacroexecutionfrominternet` | 1 |
| `user_vendor_msft_policy_config_excel16v3~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_externalcontent_l_enableblockunsecurequeryfiles` | 1 |
| `user_vendor_msft_policy_config_excel16v3~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_externalcontent_l_disableddeserverlaunch` | 1 |
| `user_vendor_msft_policy_config_excel16v3~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_externalcontent_l_disableddeserverlookup` | 1 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_dbaseiiiandivfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_dbaseiiiandivfiles_l_dbaseiiiandivfilesdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_difandsylkfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_difandsylkfiles_l_difandsylkfilesdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel2macrosheetsandaddinfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel2macrosheetsandaddinfiles_l_excel2macrosheetsandaddinfilesdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel2worksheets` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel2worksheets_l_excel2worksheetsdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel3macrosheetsandaddinfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel3macrosheetsandaddinfiles_l_excel3macrosheetsandaddinfilesdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel3worksheets` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel3worksheets_l_excel3worksheetsdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel4macrosheetsandaddinfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel4macrosheetsandaddinfiles_l_excel4macrosheetsandaddinfilesdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel4workbooks` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel4workbooks_l_excel4workbooksdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel4worksheets` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel4worksheets_l_excel4worksheetsdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel95workbooks` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel95workbooks_l_excel95workbooksdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel9597workbooksandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel9597workbooksandtemplates_l_excel9597workbooksandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel972003workbooksandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_excel972003workbooksandtemplates_l_excel972003workbooksandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_setdefaultfileblockbehavior` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_setdefaultfileblockbehavior_l_setdefaultfileblockbehaviordropid` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_fileblocksettings_l_webpagesandexcel2003xmlspreadsheets` | 0 |
| `user_vendor_msft_policy_config_excel16v6~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_xl4killswitchpolicy` | 1 |
| `user_vendor_msft_policy_config_excel16v3~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_protectedview_l_enabledatabasefileprotectedview` | 1 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_protectedview_l_donotopenfilesfromtheinternetzoneinprotectedview` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_protectedview_l_donotopenfilesinunsafelocationsinprotectedview` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails_l_setdocumentbehavioriffilevalidationfailsdropid` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails_l_setdocumentbehavioriffilevalidationfailsstr3` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_protectedview_l_turnoffprotectedviewforattachmentsopenedfromoutlook` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_requirethatapplicationextensionsaresigned` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_disabletrustbarnotificationforunsigned_v2` | 1 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter~l_trustedlocations_l_allowtrustedlocationsonthenetwork` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_vbawarningspolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security~l_trustcenter_l_vbawarningspolicy_l_empty4` | 3 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security_l_turnofffilevalidation` | 0 |
| `user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security_l_webcontentwarninglevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_excel16v2~policy~l_microsoftofficeexcel~l_exceloptions~l_security_l_webcontentwarninglevel_l_webcontentwarninglevelvalue` | 1 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicyaccess` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicyexcel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicyinfopath` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicyoutlook` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicypowerpoint` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicyproject` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicypublisher` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicyvisio` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_gloabloptions~l_customize_l_noextensibilitycustomizationfromdocumentpolicy_l_noextensibilitycustomizationfromdocumentpolicyword` | 1 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_activexcontrolinitialization` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_activexcontrolinitialization_l_activexcontrolinitializationcolon` | 6 |
| `user_vendor_msft_policy_config_office16v12~policy~l_microsoftofficesystem~l_securitysettings_l_basicauthproxybehavior` | 0 |
| `user_vendor_msft_policy_config_office16v6~policy~l_microsoftofficesystem~l_securitysettings_l_allowvbaintranetrefs` | 0 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_automationsecurity` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_automationsecurity_l_settheautomationsecuritylevel` | 2 |
| `user_vendor_msft_policy_config_office16v5~policy~l_microsoftofficesystem~l_securitysettings_l_authenticationfbabehavior` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v5~policy~l_microsoftofficesystem~l_securitysettings_l_authenticationfbabehavior_l_authenticationfbabehaviorenum` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v5~policy~l_microsoftofficesystem~l_securitysettings_l_authenticationfbabehavior_l_authenticationfbaenabledhostsid` | *(leeg)* |
| `user_vendor_msft_policy_config_office16v6~policy~l_microsoftofficesystem~l_securitysettings_l_disablestrictvbarefssecuritypolicy` | 0 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_disablealltrustbarnotificationsfor` | 0 |
| `user_vendor_msft_policy_config_office16v14~policy~l_microsoftofficesystem~l_securitysettings_l_encryptiontypeforirm` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v14~policy~l_microsoftofficesystem~l_securitysettings_l_encryptiontypeforirm_l_encryptiontypeforirmcolon` | 1 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_encryptiontypeforpasswordprotectedoffice972003` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_encryptiontypeforpasswordprotectedoffice972003_l_encryptiontypecolon318` | Microsoft Enhanced RSA and AES Cryptographic Provider,AES 256,256 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_encryptiontypeforpasswordprotectedofficeopen` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_encryptiontypeforpasswordprotectedofficeopen_l_encryptiontypecolon` | Microsoft Enhanced RSA and AES Cryptographic Provider,AES 256,256 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_loadcontrolsinforms3` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_loadcontrolsinforms3_l_loadcontrolsinforms3colon` | 1 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_macroruntimescanscope` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_macroruntimescanscope_l_macroruntimescanscopeenum` | 2 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings_l_protectdocumentmetadataforrightsmanaged` | 1 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_securitysettings~l_trustcenter241_l_allowmixofpolicyanduserlocations` | 0 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_serversettings_l_disabletheofficeclientfrompolling` | 1 |
| `user_vendor_msft_policy_config_office16v2~policy~l_microsoftofficesystem~l_smartdocumentswordexcel_l_disablesmartdocumentsuseofmanifests` | 1 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings_l_outlooksecuritymode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security_l_allowactivexoneoffforms_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security_l_allowactivexoneoffforms_v2_l_empty29` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_trustcenter_l_enablelinksinemailmessages_v2` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_misccustomformsettings_l_enablescriptsinoneoffforms_v2` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_miscattachmentsettings_l_allowuserstolowerattachments_v2` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v6~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings_l_authenticationwithexchangeserver_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v6~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings_l_authenticationwithexchangeserver_v2_l_selecttheauthenticationwithexchangeserver` | 16 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomaddressbook_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomaddressbook_v2_l_oomaddressbook_setting` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomformula_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomformula_v2_l_oomformula_setting` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomsaveas_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomsaveas_v2_l_oomsaveas_setting` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomaddressaccess_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomaddressaccess_v2_l_oomaddressaccess_setting` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oommeetingtaskrequest_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oommeetingtaskrequest_v2_l_oommeetingtaskrequest_setting` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomsend_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_programmaticsettings_l_oomsend_v2_l_oomsend_setting` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_miscattachmentsettings_l_level1attachments_v2` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_outlookoptions~l_other~l_advanced_l_disableoutlookobjectmodelscriptsforpublicfolders_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_outlookoptions~l_other~l_advanced_l_disableoutlookobjectmodelscripts_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings_l_enablerpcencryption_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_automaticpicturedownloadsettings_l_blockinternet_v2` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_cryptography_l_minimumencryptionsettings_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_cryptography_l_minimumencryptionsettings_v2_l_minimumkeysizeinbits` | 168 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings_l_outlooksecuritymode_l_outlooksecuritypolicy` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security_l_preventusersfromcustomizingattachmentsecuritysettings_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_miscattachmentsettings_l_level1removefilepolicy_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_miscattachmentsettings_l_level1removefilepolicy_v2_l_removedextensions` | *(leeg)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_miscattachmentsettings_l_level2removefilepolicy_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_miscattachmentsettings_l_level2removefilepolicy_v2_l_removedextensions25` | *(leeg)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_cryptography~l_signaturestatusdialog_l_retrievingcrlscertificaterevocationlists_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_cryptography~l_signaturestatusdialog_l_retrievingcrlscertificaterevocationlists_v2_l_empty31` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_trustcenter_l_securityleveloutlook_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_trustcenter_l_securityleveloutlook_v2_l_securitylevel` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_misccustomformsettings_l_onexecutecustomactionoom_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_securityformsettings~l_misccustomformsettings_l_onexecutecustomactionoom_v2_l_onexecutecustomactionoom_setting` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_cryptography_l_signaturewarning_v2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_security~l_cryptography_l_signaturewarning_v2_l_signaturewarning30` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_outlookoptions~l_other~l_advanced_l_msgunicodeformatwhendraggingtofilesystem_v2` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security_l_runprograms` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security_l_runprograms_l_empty` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security_l_determinewhethertoforceencryptedppt` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security_l_determinewhethertoforceencryptedppt_l_determinewhethertoforceencryptedpptdropid` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter_l_blockmacroexecutionfrominternet` | 1 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_ppt~l_powerpointoptions~l_security~l_trustcenter~l_fileblocksettings_l_powerpoint972003presentationsshowstemplatesandaddinfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_ppt~l_powerpointoptions~l_security~l_trustcenter~l_fileblocksettings_l_powerpoint972003presentationsshowstemplatesandaddinfiles_l_powerpoint972003presentationsshowstemplatesandaddinfilesdropid` | 2 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_fileblocksettings_l_setdefaultfileblockbehavior` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_fileblocksettings_l_setdefaultfileblockbehavior_l_setdefaultfileblockbehaviordropid` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_protectedview_l_donotopenfilesfromtheinternetzoneinprotectedview` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_protectedview_l_donotopenfilesinunsafelocationsinprotectedview` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails_l_setdocumentbehavioriffilevalidationfailsdropid` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails_l_setdocumentbehavioriffilevalidationfailsstr3` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_protectedview_l_turnoffprotectedviewforattachmentsopenedfromoutlook` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter_l_requirethatapplicationextensionsaresigned` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter_l_disabletrustbarnotificationforunsigned_v2` | 1 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter~l_trustedlocations_l_allowtrustedlocationsonthenetwork` | 0 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter_l_vbawarningspolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security~l_trustcenter_l_vbawarningspolicy_l_empty3` | 3 |
| `user_vendor_msft_policy_config_ppt16v2~policy~l_microsoftofficepowerpoint~l_powerpointoptions~l_security_l_turnofffilevalidation` | 0 |
| `user_vendor_msft_policy_config_proj16v2~policy~l_proj~l_projectoptions~l_security~l_trustcenter_l_allowtrustedlocationsonthenetwork` | 0 |
| `user_vendor_msft_policy_config_proj16v3~policy~l_proj~l_projectoptions~l_security~l_trustcenter_l_blockmacroexecutionfrominternet` | 1 |
| `user_vendor_msft_policy_config_proj16v2~policy~l_proj~l_projectoptions~l_security~l_trustcenter_l_requirethatapplicationextensionsaresigned` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_proj16v2~policy~l_proj~l_projectoptions~l_security~l_trustcenter_l_disabletrustbarnotificationforunsigned_v2` | 1 |
| `user_vendor_msft_policy_config_proj16v2~policy~l_proj~l_projectoptions~l_security~l_trustcenter_l_vbawarningspolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_proj16v2~policy~l_proj~l_projectoptions~l_security~l_trustcenter_l_vbawarningspolicy_l_empty` | 3 |
| `user_vendor_msft_policy_config_pub16v2~policy~l_microsoftofficepublisher~l_security_l_publisherautomationsecuritylevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_pub16v2~policy~l_microsoftofficepublisher~l_security_l_publisherautomationsecuritylevel_l_empty` | 2 |
| `user_vendor_msft_policy_config_pub16v3~policy~l_microsoftofficepublisher~l_security~l_trustcenter_l_blockmacroexecutionfrominternet` | 1 |
| `user_vendor_msft_policy_config_pub16v2~policy~l_microsoftofficepublisher~l_security~l_trustcenter_l_requirethatapplicationextensionsaresigned` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_pub16v2~policy~l_microsoftofficepublisher~l_security~l_trustcenter_l_disabletrustbarnotificationforunsigned_v2` | 1 |
| `user_vendor_msft_policy_config_pub16v2~policy~l_microsoftofficepublisher~l_security~l_trustcenter_l_vbawarningspolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_pub16v2~policy~l_microsoftofficepublisher~l_security~l_trustcenter_l_vbawarningspolicy_l_empty0` | 3 |
| `user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter_l_allowtrustedlocationsonthenetwork` | 0 |
| `user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter_l_blockmacroexecutionfrominternet` | 1 |
| `user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter~l_fileblocksettings_l_visio2000files` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter~l_fileblocksettings_l_visio2000files_l_visio2000filesdropid` | 2 |
| `user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter~l_fileblocksettings_l_visio2003files` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter~l_fileblocksettings_l_visio2003files_l_visio2003filesdropid` | 2 |
| `user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter~l_fileblocksettings_l_visio50andearlierfiles` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter~l_fileblocksettings_l_visio50andearlierfiles_l_visio50andearlierfilesdropid` | 2 |
| `user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter_l_requirethatapplicationextensionsaresigned` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter_l_disabletrustbarnotificationforunsigned_v2` | 1 |
| `user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter_l_vbawarningspolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_visio16v2~policy~l_microsoftvisio~l_visiooptions~l_security~l_trustcenter_l_vbawarningspolicy_l_empty` | 3 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_blockmacroexecutionfrominternet` | 1 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_allowdde` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_setdefaultfileblockbehavior` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_setdefaultfileblockbehavior_l_setdefaultfileblockbehaviordropid` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2andearlierbinarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2andearlierbinarydocumentsandtemplates_l_word2andearlierbinarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2000binarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2000binarydocumentsandtemplates_l_word2000binarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2003binarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2003binarydocumentsandtemplates_l_word2003binarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2007andlaterbinarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word2007andlaterbinarydocumentsandtemplates_l_word2007andlaterbinarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word6pt0binarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word6pt0binarydocumentsandtemplates_l_word6pt0binarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word95binarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word95binarydocumentsandtemplates_l_word95binarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word97binarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_word97binarydocumentsandtemplates_l_word97binarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_wordxpbinarydocumentsandtemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_fileblocksettings_l_wordxpbinarydocumentsandtemplates_l_wordxpbinarydocumentsandtemplatesdropid` | 2 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_protectedview_l_donotopenfilesfromtheinternetzoneinprotectedview` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_protectedview_l_donotopenfilesinunsafelocationsinprotectedview` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails_l_setdocumentbehavioriffilevalidationfailsdropid` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_protectedview_l_setdocumentbehavioriffilevalidationfails_l_setdocumentbehavioriffilevalidationfailsstr3` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_protectedview_l_turnoffprotectedviewforattachmentsopenedfromoutlook` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_requirethatapplicationextensionsaresigned` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_disabletrustbarnotificationforunsigned_v2` | 1 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_determinewhethertoforceencryptedword` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_determinewhethertoforceencryptedword_l_determinewhethertoforceencryptedworddropid` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter~l_trustedlocations_l_allowtrustedlocationsonthenetwork` | 0 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_vbawarningspolicy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security~l_trustcenter_l_vbawarningspolicy_l_empty19` | 3 |
| `user_vendor_msft_policy_config_word16v2~policy~l_microsoftofficeword~l_wordoptions~l_security_l_turnofffilevalidation` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
