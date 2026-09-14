<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Outlook

Configureert het Exchange Online-profiel van de gebruiker automatisch, zodat Outlook werkt zonder handmatig een account toe te voegen.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-010-AutomaticConfigurationOfOutlook` |
| Bron | eigen baseline |
| Bestand | [`Baseline_WIN_U_Microsoft_Outlook.json`](Baseline_WIN_U_Microsoft_Outlook.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings_l_automaticallyconfigureprofilebasedonactiveonce` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
