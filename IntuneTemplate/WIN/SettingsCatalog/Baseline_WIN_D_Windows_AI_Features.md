<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows AI Features

Zet de generatieve AI-functies in Paint en in de Windows-instellingen uit: Cocreator, Image Creator, Generative Fill en de Settings Agent.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-144-DWindowsAIFeatures` |
| Bron | IntuneAdmin/IntuneBaselines — Windows 11 Benchmarks/Windows AI, maar met de waarde omgedraaid: die set zet de functies juist aan |
| Bestand | [`Baseline_WIN_D_Windows_AI_Features.json`](Baseline_WIN_D_Windows_AI_Features.json) |

> Dit gaat alleen over de AI-functies in Windows en Paint. Microsoft Copilot zelf blijft bereikbaar, zoals ISMP22 het toestaat. Recall en Click To Do staan al uit via [Baseline] - WIN - D - Windows AI; deze policy vult die aan en botst er niet mee.

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_windowsai_disablecocreator` | 1 |
| `device_vendor_msft_policy_config_windowsai_disableimagecreator` | 1 |
| `device_vendor_msft_policy_config_windowsai_disablegenerativefill` | 1 |
| `device_vendor_msft_policy_config_windowsai_disablesettingsagent` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
