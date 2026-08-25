<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows AI

Zet Recall en Click To Do uit: Windows maakt dan geen schermopnames van wat er op het scherm gebeurt en analyseert die ook niet.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-112-DWindowsAI` |
| Bron | eigen baseline — vergelijking met IntuneAdmin/IntuneBaselines, augustus 2026 |
| Bestand | [`Baseline_WIN_D_Windows_AI.json`](Baseline_WIN_D_Windows_AI.json) |

> OIB v3.8 kent nog geen Windows AI-policy. Recall staat uit in plaats van beperkt: zolang de functie aanstaat blijven de snapshots op het apparaat staan, en dat is de kern van de DPIA-vraag. Wie Recall wél wil toestaan vervangt allowrecallenablement door de beperkende variant (bewaartermijn, opslagruimte, uitsluitingslijsten).

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
