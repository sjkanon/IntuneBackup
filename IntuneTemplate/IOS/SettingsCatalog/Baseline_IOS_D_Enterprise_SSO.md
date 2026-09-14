<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Enterprise SSO

Zet de Microsoft Enterprise SSO-plug-in van Microsoft Authenticator aan, zodat beheerde apps en Safari één Entra-aanmelding delen en het apparaat zich bij Conditional Access kan bewijzen.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-188-IOSDEnterpriseSSO` |
| Bron | UniFy iOS/iPadOS Baseline v1.2 — SC - DEV - Microsoft Enterprise SSO - All Devices; URL-lijst en sleutels gelijkgetrokken met Microsoft Learn (Microsoft Enterprise SSO plug-in for Apple devices) |
| Bestand | [`Baseline_IOS_D_Enterprise_SSO.json`](Baseline_IOS_D_Enterprise_SSO.json) |

> Sleutels: Enable_SSO_On_All_ManagedApps=1 (alleen MDM-beheerde apps), AppPrefixAllowList com.microsoft.,com.apple., browser_sso_interaction_enabled=1, disable_explicit_app_prompt=1 en device_registration={{DEVICEREGISTRATION}} (Just-in-Time-registratie, door Microsoft voor iOS met Intune gedocumenteerd). De URL-lijst is de volledige Microsoft-lijst inclusief soevereine clouds; UniFy mist login.chinacloudapi.cn. Geen overlap met [Baseline] - MAC - D - Platform SSO: ander platform, andere extensie-ID. Een proxy met TLS-inspectie moet app-site-association.cdn-apple.com en app-site-association.networking.apple uitzonderen, anders faalt de plug-in met wisselende fouten. Rol Microsoft Authenticator uit als vereiste app (VPP op bedrijfstoestellen) — zie extras/ios/README.md.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.5.17 Authenticatie-informatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 6.7 Centralize Access Control |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 21

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.extensiblesso_com.apple.extensiblesso` | *(groep)* |
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

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
