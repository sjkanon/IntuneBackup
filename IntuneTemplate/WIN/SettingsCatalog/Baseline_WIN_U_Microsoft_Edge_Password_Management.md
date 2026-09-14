<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Edge Password Management

Bepaalt of Edge wachtwoorden mag opslaan en tonen, zodat werkwachtwoorden niet in een browserprofiel belanden.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-099-UMicrosoftEdgePasswordManagement` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - Password Management |
| Bestand | [`Baseline_WIN_U_Microsoft_Edge_Password_Management.json`](Baseline_WIN_U_Microsoft_Edge_Password_Management.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edgev85diff~policy~microsoft_edge~passwordmanager_passwordmonitorallowed` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev93~policy~microsoft_edge~passwordmanager_passwordgeneratorenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev93.1~policy~microsoft_edge~passwordmanager_primarypasswordsetting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edgev93.1~policy~microsoft_edge~passwordmanager_primarypasswordsetting_primarypasswordsetting` | 1 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~passwordmanager_passwordmanagerenabled` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
