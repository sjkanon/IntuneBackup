<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Windows Spotlight

Zet Windows Spotlight, tips en consumentgerichte suggesties uit, zodat er geen advertenties en aanbevolen apps op een werkapparaat verschijnen.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-106-UWindowsSpotlight` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - U - Windows Spotlight and Org Messages (user-deel) |
| Bestand | [`Baseline_WIN_U_Windows_Spotlight.json`](Baseline_WIN_U_Windows_Spotlight.json) |

> OIB's policy is gemengd (4 user- en 1 device-instelling op topniveau). Gesplitst omdat een gemengde policy niet eenduidig toe te wijzen is.

## Instellingen — 11

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_experience_allowspotlightcollection` | 0 |
| `user_vendor_msft_policy_config_experience_allowwindowsspotlight` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowtailoredexperienceswithdiagnosticdata` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowthirdpartysuggestionsinwindowsspotlight` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_experience_allowwindowsconsumerfeatures` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowwindowsspotlightonactioncenter` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowwindowsspotlightwindowswelcomeexperience` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_experience_allowwindowstips` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_configurewindowsspotlightonlockscreen` | 0 |
| `user_vendor_msft_policy_config_experience_allowwindowsspotlightonsettings` | 0 |
| `user_vendor_msft_policy_config_experience_enableorganizationalmessages` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
