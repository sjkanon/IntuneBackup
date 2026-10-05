<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Edge_User_Experience.md) · [English](Baseline_WIN_U_Microsoft_Edge_User_Experience.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Edge User Experience

L'expérience Edge au quotidien : page de démarrage, suggestions de recherche, notifications et fonctionnalités visibles.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - User Experience |
| Fichier | [`Baseline_WIN_U_Microsoft_Edge_User_Experience.json`](Baseline_WIN_U_Microsoft_Edge_User_Experience.json) |

> La liste de blocage d'URL d'OpenIntuneBaseline ne figure volontairement pas ici mais dans [Baseline] - WIN - U - AI Usage Control Restricted/Permitted (voir overgenomenVan à cet endroit) ; dropSettings l'écarte lors d'un import, sinon deux policies définiraient la même liste différemment.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 23

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edgev99~policy~microsoft_edge_allowgamesmenu` | 0 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~contentsettings_notificationsallowedforurls` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~contentsettings_notificationsallowedforurls_notificationsallowedforurlsdesc` | [*.]microsoft.com, [*.]cloud.microsoft |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~contentsettings_defaultnotificationssetting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~contentsettings_defaultnotificationssetting_defaultnotificationssetting` | 2 |
| `user_vendor_msft_policy_config_microsoft_edgev144~policy~microsoft_edge_whatsnewpageforentraprofilesenabled` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev107~policy~microsoft_edge~edgeworkspaces_edgeworkspacesenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev135~policy~microsoft_edge_addressbartrendingsuggestenabled` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev134~policy~microsoft_edge_addressbarworksearchresultsenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev132~policy~microsoft_edge~generativeai_genailocalfoundationalmodelsettings` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edgev132~policy~microsoft_edge~generativeai_genailocalfoundationalmodelsettings_genailocalfoundationalmodelsettings` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev111~policy~microsoft_edge_newpdfreaderenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev87~policy~microsoft_edge_edgeshoppingassistantenabled` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev88~policy~microsoft_edge_showmicrosoftrewards` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev111~policy~microsoft_edge_showacrobatsubscriptionbutton` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev148~policy~microsoft_edge~startup_configurentpfeedtabvisibility` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edgev148~policy~microsoft_edge~startup_configurentpfeedtabvisibility_configurentpfeedtabvisibility` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev88~policy~microsoft_edge_recommended~performance_recommended_startupboostenabled_recommended` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev88~policy~microsoft_edge_recommended~sleepingtabs_recommended_sleepingtabsenabled_recommended` | 1 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_recommended~startup_recommended_restoreonstartup_recommended` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_recommended~startup_recommended_restoreonstartup_recommended_restoreonstartup` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev79diff~policy~microsoft_edge_recommended~startup_recommended_newtabpagemanagedquicklinks_recommended` | 0 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_recommended~startup_recommended_showhomebutton_recommended` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
