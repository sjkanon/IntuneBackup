<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Enterprise_SSO.md) · [English](Baseline_IOS_D_Enterprise_SSO.en.md) · **Français**

# [Baseline] - IOS - D - Enterprise SSO

Active le plug-in Microsoft Enterprise SSO de Microsoft Authenticator, afin que les applications gérées et Safari partagent une seule connexion Entra et que l'appareil puisse s'authentifier auprès de Conditional Access.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-188-IOSDEnterpriseSSO` |
| Source | UniFy iOS/iPadOS Baseline v1.2 — SC - DEV - Microsoft Enterprise SSO - All Devices ; liste d'URL et clés alignées sur Microsoft Learn (Microsoft Enterprise SSO plug-in for Apple devices) |
| Fichier | [`Baseline_IOS_D_Enterprise_SSO.json`](Baseline_IOS_D_Enterprise_SSO.json) |

> Clés : Enable_SSO_On_All_ManagedApps=1 (uniquement les applications gérées par MDM), AppPrefixAllowList com.microsoft.,com.apple., browser_sso_interaction_enabled=1, disable_explicit_app_prompt=1 et device_registration={{DEVICEREGISTRATION}} (enregistrement Just-in-Time, documenté par Microsoft pour iOS avec Intune). La liste d'URL est la liste Microsoft complète, clouds souverains compris ; il manque login.chinacloudapi.cn chez UniFy. Aucun chevauchement avec [Baseline] - MAC - D - Platform SSO : autre plateforme, autre ID d'extension. Un proxy avec inspection TLS doit exclure app-site-association.cdn-apple.com et app-site-association.networking.apple, sinon le plug-in échoue avec des erreurs variables. Déployez Microsoft Authenticator comme application obligatoire (VPP sur les appareils d'entreprise) — voir extras/ios/README.md.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Authentification sécurisée<br>A.5.17 Informations d'authentification |
| NIS2 art. 21(2) | art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 6.7 Centralize Access Control |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 21

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.extensiblesso_com.apple.extensiblesso` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata` | *(5 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | Enable_SSO_On_All_ManagedApps |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_integer` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | AppPrefixAllowList |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_string` | com.microsoft.,com.apple. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 3* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | browser_sso_interaction_enabled |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_integer` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 4* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | disable_explicit_app_prompt |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_integer` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 5* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | device_registration |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_string` | {{DEVICEREGISTRATION}} |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensionidentifier` | com.microsoft.azureauthenticator.ssoextension |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_screenlockedbehavior` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_type` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_urls` | https://login.microsoftonline.com, https://login.microsoft.com, https://sts.windows.net, https://login.partner.microsoftonline.cn, https://login.chinacloudapi.cn, https://login.microsoftonline.us, https://login-us.microsoftonline.com |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
