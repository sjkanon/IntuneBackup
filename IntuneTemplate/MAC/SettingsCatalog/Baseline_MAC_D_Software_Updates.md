<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Software Updates

Hoe en wanneer macOS zijn eigen updates ophaalt en installeert.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-047-MACDSoftwareUpdates` |
| Bron | eigen baseline — declaratief softwarebeleid (DDM); OpenIntuneBaseline macOS v1.0 gebruikt nog het klassieke com.apple.softwareupdate-profiel |
| Bestand | [`Baseline_MAC_D_Software_Updates.json`](Baseline_MAC_D_Software_Updates.json) |

> Declaratieve variant (DDM, macOS 14+) in plaats van de com.apple.softwareupdate-payload die OpenIntuneBaseline levert: uitstel van 7 dagen voor kleine updates, 14 voor grote en 21 voor systeemupdates, Rapid Security Responses aan inclusief terugdraaien, meldingen aan, en standaardgebruikers mogen zelf een OS-update installeren. De drie automatische acties (downloaden, OS-updates, beveiligingsupdates) staan op de eerste keuze uit de catalogus — controleer in de portal of dat "Standaard" of "Altijd aan" is vóór je 'm uitrolt.

## Instellingen — 14

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `softwareupdate_softwareupdate` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_allowstandarduserosupdates` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_download` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installosupdates` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installsecurityupdate` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enable` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enablerollback` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_majorperiodindays` | 14 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_minorperiodindays` | 7 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_systemperiodindays` | 21 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_notifications` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
