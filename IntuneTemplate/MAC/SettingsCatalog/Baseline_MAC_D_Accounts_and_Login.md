<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Accounts and Login

Bepaalt wat er bij het aanmelden zichtbaar is en welke accounts een Mac mag hebben.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-035-MACDAccountsAndLogin` |
| Bron | OpenIntuneBaseline macOS v1.0 — Device Security - D - Accounts and Login |
| Bestand | [`Baseline_MAC_D_Accounts_and_Login.json`](Baseline_MAC_D_Accounts_and_Login.json) |

## Instellingen — 8

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.mcx_com.apple.mcx-accounts` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx_disableguestaccount` | true |
| `com.apple.loginwindow_com.apple.loginwindow` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_adminhostinfo` | HostName |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_disableconsoleaccess` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_hideadminusers` | false |
| `loginwindow_loginwindow` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`loginwindow_disableloginitemssuppression` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
