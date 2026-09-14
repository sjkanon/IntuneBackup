<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Microsoft Accounts

Bepaalt of persoonlijke Microsoft-accounts op een werkapparaat gebruikt en toegevoegd mogen worden.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-073-DMicrosoftAccounts` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Accounts - D - Configuration |
| Bestand | [`Baseline_WIN_D_Microsoft_Accounts.json`](Baseline_WIN_D_Microsoft_Accounts.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.16 Identiteitsbeheer<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.6 Centralize Account Management |
| NIST CSF 2.0 | PR.AA-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_accounts_allowaddingnonmicrosoftaccountsmanually` | 0 |
| `device_vendor_msft_policy_config_accounts_allowmicrosoftaccountconnection` | 0 |
| `device_vendor_msft_policy_config_appruntime_allowmicrosoftaccountstobeoptional` | 1 |
| `device_vendor_msft_policy_config_admx_msapolicy_microsoftaccount_disableuserauth` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_accounts_blockmicrosoftaccounts` | 3 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
