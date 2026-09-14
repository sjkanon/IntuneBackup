<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Login and Lock Screen

Bepaalt wat er op het aanmeld- en vergrendelscherm zichtbaar en mogelijk is, zoals de laatst aangemelde gebruiker en camera-toegang.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-072-DLoginAndLockScreen` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Login and Lock Screen |
| Bestand | [`Baseline_WIN_D_Login_and_Lock_Screen.json`](Baseline_WIN_D_Login_and_Lock_Screen.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.7.7 Clear desk en clear screen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 8

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_abovelock_allowcortanaabovelock` | 0 |
| `device_vendor_msft_policy_config_abovelock_allowtoasts` | 0 |
| `device_vendor_msft_policy_config_devicelock_preventenablinglockscreencamera` | 1 |
| `device_vendor_msft_policy_config_devicelock_preventlockscreenslideshow` | 1 |
| `device_vendor_msft_policy_config_windowslogon_disablelockscreenappnotifications` | 1 |
| `device_vendor_msft_policy_config_credentialsui_disablepasswordreveal` | 1 |
| `device_vendor_msft_policy_config_authentication_allowaadpasswordreset` | 1 |
| `device_vendor_msft_policy_config_privacy_letappsactivatewithvoiceabovelock` | 2 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
