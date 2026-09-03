<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows AI Restricted

Zet Recall en Click To Do uit: Windows maakt dan geen schermopnames van wat er op het scherm gebeurt en analyseert die ook niet.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-112-DWindowsAI` |
| Bron | eigen baseline — vergelijking met IntuneAdmin/IntuneBaselines, augustus 2026 |
| Bestand | [`Baseline_WIN_D_Windows_AI_Restricted.json`](Baseline_WIN_D_Windows_AI_Restricted.json) |

> **Alternatief van [Baseline] - WIN - D - Windows AI Permitted.** Die zet dezelfde drie instellingen op de andere waarde; allebei toewijzen levert een Conflict op waarna Intune er géén toepast. Dit is de variant die de baseline standaard uitrolt.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_windowsai_allowrecallenablement` | 0 |
| `device_vendor_msft_policy_config_windowsai_disableaidataanalysis` | 1 |
| `device_vendor_msft_policy_config_windowsai_disableclicktodo` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
