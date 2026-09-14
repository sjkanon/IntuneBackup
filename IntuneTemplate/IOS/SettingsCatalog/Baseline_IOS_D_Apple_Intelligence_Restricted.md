<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Apple Intelligence Restricted

Zet op ingeschreven iPhones en iPads de generatieve Apple Intelligence-functies uit — Writing Tools, Genmoji, Image Playground, Image Wand, gepersonaliseerd handschrift, samenvattingen in Mail, Notities, Safari en Visual Intelligence — en de koppeling met externe AI-diensten zoals ChatGPT.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-184-IOSDAppleIntelligenceRestricted` |
| Bron | Declaratieve configuraties com.apple.configuration.intelligence.settings en external-intelligence.settings in de iOS settings catalog; selectie uit UniFy iOS/iPadOS Baseline v1.2 — SC - Apple Intelligence & Siri - Corporate en IntuneAdmin — Disable Apple Intelligence, met Writing Tools uit waar UniFy het toestaat. De com.apple.applicationaccess-varianten die IntuneAdmin gebruikt zijn in de catalogus als Deprecated gemarkeerd |
| Bestand | [`Baseline_IOS_D_Apple_Intelligence_Restricted.json`](Baseline_IOS_D_Apple_Intelligence_Restricted.json) |

> **Alternatief van [Baseline] - IOS - D - Apple Intelligence Permitted** — die zet dezelfde sleutels op true; allebei toewijzen levert een Conflict op, waarna geen van beide iets doet. Siri zelf blijft aan; alleen Siri op het vergrendelscherm staat uit via Restrictions Corporate. Bewust niet: allowappleintelligencereport=false (dat rapport is juist de transparantie over wat naar Private Cloud Compute ging) en forceondeviceonlydictation/-translation (geen generatieve functie). Voor toestellen zónder inschrijving bestaan in App Protection de iOS 26-velden writingToolsConfigurationState en genmojiConfigurationState; die staan bewust niet in de fase-1-policy, omdat dit een klantbesluit is en App Protection maar één policy voor iedereen is — zie RAPPORT.

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
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowwritingtools` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowgenmoji` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimageplayground` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimagewand` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowpersonalizedhandwritingresults` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowvisualintelligencesummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsmartreplies` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscription` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscriptionsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari_allowsummary` | false |
| `externalintelligencesettings_externalintelligencesettings` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`externalintelligencesettings_enabled` | false |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
