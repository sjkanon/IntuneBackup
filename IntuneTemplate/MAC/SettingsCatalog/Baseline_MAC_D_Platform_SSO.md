<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Platform SSO

Koppelt het aanmelden op de Mac aan Entra ID via de Microsoft-SSO-plug-in, zodat het Mac-wachtwoord en het werkaccount samenvallen.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-045-MACDPlatformSSO` |
| Bron | OpenIntuneBaseline macOS v1.0 — Authentication - D - Platform SSO |
| Bestand | [`Baseline_MAC_D_Platform_SSO.json`](Baseline_MAC_D_Platform_SSO.json) |

> Vereist de Microsoft Enterprise SSO-plug-in (Company Portal) op het apparaat.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.16 Identiteitsbeheer<br>A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.6 Centralize Account Management<br>6.7 Centralize Access Control |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 28

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.extensiblesso_com.apple.extensiblesso` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_authenticationmethod` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata` | *(3 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | AppPrefixAllowList |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_string` | com.microsoft.,com.apple. |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | browser_sso_interaction_enabled |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_integer` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 3* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_keytobereplaced` | disable_explicit_app_prompt |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_ignored_$typepicker` | com.apple.extensiblesso_ignored_1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_generickey_integer` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensionidentifier` | com.microsoft.CompanyPortalMac.ssoextension |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_authenticationmethod` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_enableauthorization` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_enablecreateuseratlogin` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_newuserauthorizationmode` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_tokentousermapping` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_tokentousermapping_accountname` | preferred_username |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_tokentousermapping_fullname` | name |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_useshareddevicekeys` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_platformsso_userauthorizationmode` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_registrationtoken` | {{DEVICEREGISTRATION}} |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_screenlockedbehavior` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_teamidentifier` | UBF8T346G9 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_type` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_urls` | https://login.microsoftonline.com, https://login.microsoft.com, https://sts.windows.net |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
