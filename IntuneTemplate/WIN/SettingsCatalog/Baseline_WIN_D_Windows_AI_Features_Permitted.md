<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows AI Features Permitted

Staat de generatieve AI-functies in Paint en in de Windows-instellingen uitdrukkelijk toe: Cocreator, Image Creator, Generative Fill en de Settings Agent.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-146-DWindowsAIFeaturesPermitted` |
| Bron | IntuneAdmin/IntuneBaselines — Windows 11 Benchmarks/Windows AI, waarden ongewijzigd overgenomen |
| Bestand | [`Baseline_WIN_D_Windows_AI_Features_Permitted.json`](Baseline_WIN_D_Windows_AI_Features_Permitted.json) |

> **Alternatief van [Baseline] - WIN - D - Windows AI Features Restricted.** Die zet dezelfde vier instellingen op de andere waarde; allebei toewijzen levert een Conflict op waarna Intune er géén toepast. Let op dat dit alleen de vier Paint- en Settings-functies betreft: Recall en Click To Do staan los daarvan uit via [Baseline] - WIN - D - Windows AI Restricted, en de Edge-blokkeerlijst via [Baseline] - WIN - U - AI Usage Control Restricted. Wie AI breed wil toestaan, moet ook die twee wegen.

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_windowsai_disablecocreator` | 0 |
| `device_vendor_msft_policy_config_windowsai_disableimagecreator` | 0 |
| `device_vendor_msft_policy_config_windowsai_disablegenerativefill` | 0 |
| `device_vendor_msft_policy_config_windowsai_disablesettingsagent` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
