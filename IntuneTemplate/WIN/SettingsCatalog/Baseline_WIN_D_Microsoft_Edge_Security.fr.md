<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Edge_Security.md) · [English](Baseline_WIN_D_Microsoft_Edge_Security.en.md) · **Français**

# [Baseline] - WIN - D - Microsoft Edge Security

Les paramètres de sécurité d'Edge : SmartScreen, contrôle des téléchargements, comportement des certificats et sites autorisés à charger du contenu non sécurisé.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-020-MicrosoftEdge` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - D - Security |
| Fichier | [`Baseline_WIN_D_Microsoft_Edge_Security.json`](Baseline_WIN_D_Microsoft_Edge_Security.json) |

> 2 -> 54 paramètres.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.9 Gestion de la configuration<br>A.8.23 Filtrage web<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>9.6 Block Unnecessary File Types<br>10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 59

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_adssettingforintrusiveadssites` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_adssettingforintrusiveadssites_adssettingforintrusiveadssites` | 2 |
| `device_vendor_msft_policy_config_microsoft_edgeupdates.2~policy~microsoft_edge_downloadrestrictions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgeupdates.2~policy~microsoft_edge_downloadrestrictions_downloadrestrictions` | 4 |
| `device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_importbrowsersettings` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_importhistory` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_importhomepage` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_importpaymentinfo` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_importsavedpasswords` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_importsearchengine` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_enterprisehardwareplatformapienabled` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev80diff~policy~microsoft_edge_personalizationreportingenabled` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_browsernetworktimequeriesenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev92~policy~microsoft_edge_internetexplorerintegrationreloadiniemodeallowed` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslerroroverrideallowed` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev80diff~policy~microsoft_edge_paymentmethodqueryenabled` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev117~policy~microsoft_edge_internetexplorerintegrationzoneidentifiermhtfileallowed` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_trackingprevention` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_trackingprevention_trackingprevention` | 2 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~googlecast_enablemediarouter` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge_clearbrowsingdataonexit` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_clearcachedimagesandfilesonexit` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev104~policy~microsoft_edge_browsercodeintegritysetting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev104~policy~microsoft_edge_browsercodeintegritysetting_browsercodeintegritysetting` | 2 |
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_configureshare` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_experimentationandconfigurationservicecontrol` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_experimentationandconfigurationservicecontrol_experimentationandconfigurationservicecontrol` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev80diff~policy~microsoft_edge_dnsinterceptionchecksenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev128~policy~microsoft_edge_dynamiccodesettings` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev128~policy~microsoft_edge_dynamiccodesettings_dynamiccodesettings` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev96~policy~microsoft_edge~typosquattingchecker_typosquattingcheckerenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev128.1~policy~microsoft_edge_applicationboundencryptionenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_autofilladdressenabled` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_autofillcreditcardenabled` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev95~policy~microsoft_edge_browserlegacyextensionpointsblockingenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_networkpredictionoptions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_networkpredictionoptions_networkpredictionoptions` | 2 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_processisolationenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev96~policy~microsoft_edge_rendererappcontainerenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_siteperprocess` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev102~policy~microsoft_edge_networkservicesandboxenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev98.1~policy~microsoft_edge_enhancesecuritymode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev98.1~policy~microsoft_edge_enhancesecuritymode_enhancesecuritymode` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev93~policy~microsoft_edge~experimentation_featureflagoverridescontrol` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev93~policy~microsoft_edge~experimentation_featureflagoverridescontrol_featureflagoverridescontrol` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev80diff~policy~microsoft_edge_hidefirstrunexperience` | 1 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~httpauthentication_authschemes` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~httpauthentication_authschemes_authschemes` | ntlm,negotiate |
| `device_vendor_msft_policy_config_microsoft_edgev90~policy~microsoft_edge~httpauthentication_windowshelloforhttpauthenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev98~policy~microsoft_edge_microsoftedgeinsiderpromotionenabled` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~nativemessaging_nativemessaginguserlevelhosts` | 0 |
| `device_vendor_msft_policy_config_microsoft_edgev134~policy~microsoft_edge~scarewareblocker_scarewareblockerprotectionenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev96~policy~microsoft_edge_internetexplorermodetoolbarbuttonenabled` | 0 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~smartscreen_smartscreenenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev80diff~policy~microsoft_edge~smartscreen_smartscreenpuaenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev97~policy~microsoft_edge~smartscreen_smartscreendnsrequestsenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edgev78diff~policy~microsoft_edge~smartscreen_smartscreenfortrusteddownloadsenabled` | 1 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~smartscreen_preventsmartscreenpromptoverride` | 1 |
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~smartscreen_preventsmartscreenpromptoverrideforfiles` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
