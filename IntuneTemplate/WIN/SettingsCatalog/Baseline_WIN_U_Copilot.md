<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Copilot

Bepaalt of Copilot in Windows beschikbaar is voor de gebruiker.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-097-UCopilot` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - U - Copilot |
| Bestand | [`Baseline_WIN_U_Copilot.json`](Baseline_WIN_U_Copilot.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Aanvaardbaar gebruik<br>A.8.19 Installatie van software op operationele systemen |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_windowsai_removemicrosoftcopilotapp` | 1 |
| `user_vendor_msft_policy_config_windowsai_turnoffwindowscopilot` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
