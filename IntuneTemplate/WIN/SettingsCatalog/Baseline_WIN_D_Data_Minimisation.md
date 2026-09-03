<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Data Minimisation

Beperkt wat er in de diagnostische gegevens meegaat: geen aanvullende logbestanden en geen geheugendumps naar Microsoft.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-129-DDataMinimisation` |
| Bron | ISO/IEC 27001:2022 A.5.34 en A.8.11, AVG art. 5(1)(c) dataminimalisatie — instellingen uit CIS v4 Windows 11 L1 |
| Bestand | [`Baseline_WIN_D_Data_Minimisation.json`](Baseline_WIN_D_Data_Minimisation.json) |

> De baseline zet telemetrie bewust op Optioneel omdat Endpoint Analytics en Windows Update-rapportage erop leunen. Dat is een verdedigbare keuze, maar hij staat op gespannen voet met ISDP01. Deze twee instellingen halen de scherpe kant eraf zonder de rapportage te breken: het niveau blijft staan, maar aanvullende diagnostische logbestanden en geheugendumps — waar gebruikersgegevens in kunnen zitten — gaan niet mee. Dat is het antwoord op de vraag die een FG of auditor hier stelt.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_system_limitdiagnosticlogcollection` | 1 |
| `device_vendor_msft_policy_config_system_limitdumpcollection` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
