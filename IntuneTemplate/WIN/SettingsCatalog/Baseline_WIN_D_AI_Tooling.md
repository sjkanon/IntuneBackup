<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - AI Tooling

Blokkeert GitHub Copilot op persoonlijke accounts in Visual Studio; de zakelijke licentie blijft werken.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-125-DAITooling` |
| Bron | ISO/IEC 27001:2022 A.5.10 en A.8.1 — instelling uit de Visual Studio-benchmark van IntuneAdmin |
| Bestand | [`Baseline_WIN_D_AI_Tooling.json`](Baseline_WIN_D_AI_Tooling.json) |

> Bedoeld voor een AI-beleid dat GitHub Copilot alleen toestaat voor softwareontwikkeling en alleen via de licentie van de organisatie. Zonder deze instelling kan een ontwikkelaar zijn privéaccount koppelen, en dan verlaat bedrijfscode de goedgekeurde route zonder dat iemand het ziet.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Aanvaardbaar gebruik<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(d) beveiliging van de toeleveringsketen |
| NIST CSF 2.0 | PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_visualstudiov4~policy~visualstudio~copilotsettings_disablecopilotforindividuals` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
