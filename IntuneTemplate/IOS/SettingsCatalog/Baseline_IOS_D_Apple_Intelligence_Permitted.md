<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Apple Intelligence Permitted

Staat op ingeschreven iPhones en iPads de generatieve Apple Intelligence-functies en de koppeling met externe AI-diensten uitdrukkelijk toe.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-183-IOSDAppleIntelligencePermitted` |
| Bron | Tegenhanger van [Baseline] - IOS - D - Apple Intelligence Restricted; dezelfde declaratieve sleutels op de Apple-standaardwaarde, expliciet vastgelegd |
| Bestand | [`Baseline_IOS_D_Apple_Intelligence_Permitted.json`](Baseline_IOS_D_Apple_Intelligence_Permitted.json) |

> **Alternatief van [Baseline] - IOS - D - Apple Intelligence Restricted.** Weeg vóór je deze kiest mee dat de ChatGPT-integratie (externalintelligencesettings_enabled) gegevens naar een externe partij stuurt; wie alleen de functies op het toestel wil toestaan, zet in deze policy externalintelligencesettings_enabled op false. De per-workspace-beperking (allowedworkspaceids) staat er bewust niet in: die vraagt een tenant- of workspace-ID.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Aanvaardbaar gebruik<br>A.8.12 Voorkomen van datalekken<br>A.5.34 Privacy en bescherming van persoonsgegevens |
| NIS2 art. 21(2) | art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 18

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `intelligencesettings_intelligencesettings` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowwritingtools` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowgenmoji` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimageplayground` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimagewand` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowpersonalizedhandwritingresults` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowvisualintelligencesummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsmartreplies` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscription` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscriptionsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari_allowsummary` | true |
| `externalintelligencesettings_externalintelligencesettings` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`externalintelligencesettings_enabled` | true |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
