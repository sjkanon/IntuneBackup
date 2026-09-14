<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Windows User Experience

Zet meldingen op het vergrendelscherm en automatisch aanvullen in Internet Explorer uit.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-031-UWindowsUserExperience` |
| Bron | eigen baseline — uit de splitsing van Administrative Templates |
| Bestand | [`Baseline_WIN_U_Windows_User_Experience.json`](Baseline_WIN_U_Windows_User_Experience.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.7.7 Clear desk en clear screen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_admx_wpn_nolockscreentoastnotification` | 1 |
| `user_vendor_msft_policy_config_internetexplorer_allowautocomplete` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
