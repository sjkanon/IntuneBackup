<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Administrator Protection

Laat beheerders standaard zonder verhoogde rechten werken en per handeling om toestemming vragen. Windows 11 24H2 en hoger.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-055-DAdministratorProtection` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Administrator Protection |
| Bestand | [`Baseline_WIN_D_Administrator_Protection.json`](Baseline_WIN_D_Administrator_Protection.json) |

> Windows 11 24H2 en hoger; op oudere builds doet de instelling niets.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts |
| NIST CSF 2.0 | PR.AA-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_behavioroftheelevationpromptforadministratorprotection` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_typeofadminapprovalmode` | 2 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
