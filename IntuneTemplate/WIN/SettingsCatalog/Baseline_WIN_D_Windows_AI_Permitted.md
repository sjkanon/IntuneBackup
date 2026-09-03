<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows AI Permitted

Staat Recall en Click To Do uitdrukkelijk toe, inclusief het bewaren van schermafdrukken.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-148-DWindowsAIPermitted` |
| Bron | Tegenhanger van de Restricted-variant; waarden zijn de Windows-standaarden, expliciet vastgelegd |
| Bestand | [`Baseline_WIN_D_Windows_AI_Permitted.json`](Baseline_WIN_D_Windows_AI_Permitted.json) |

> **Alternatief van [Baseline] - WIN - D - Windows AI Restricted.** Weeg vóór je deze kiest of de gevolgen bekend zijn: Recall bewaart doorzoekbare schermafdrukken op de schijf, en die index valt onder dezelfde bewaartermijnen en verwijderingsplichten als de gegevens die erin staan. Overweeg dan ook de Recall-uitsluitingslijsten (setdenyapplistforrecall, setdenyurilistforrecall) en een bewaartermijn — die staan bewust niet in deze policy omdat ze per klant verschillen.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_windowsai_allowrecallenablement` | 1 |
| `device_vendor_msft_policy_config_windowsai_disableaidataanalysis` | 0 |
| `device_vendor_msft_policy_config_windowsai_disableclicktodo` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
