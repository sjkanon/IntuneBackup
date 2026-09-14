<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Software Updates

Hoe en wanneer macOS zijn eigen updates ophaalt en installeert.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-047-MACDSoftwareUpdates` |
| Bron | eigen baseline — declaratief softwarebeleid (DDM); uitgebreid met Software Update Enforce Latest en beta-uit uit OpenIntuneBaseline macOS v2.0 beta (SC - Updates - D - Update Configuration) en microsoft/intune-my-macs (pol-sys-103, pol-sys-106), met eigen termijn; CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 1.1–1.6 |
| Bestand | [`Baseline_MAC_D_Software_Updates.json`](Baseline_MAC_D_Software_Updates.json) |

> Declaratieve variant (DDM) in plaats van de com.apple.softwareupdate-instellingen die OpenIntuneBaseline v1.0 levert. Uitstel: 7 dagen voor kleine updates, 14 voor grote, 21 voor systeemupdates; Rapid Security Responses (Background Security Improvements) aan inclusief terugdraaien door de gebruiker (Apple-standaard, laat een kapotte update ongedaan maken zonder IT); meldingen aan; standaardgebruikers mogen zelf een OS-update installeren. De drie automatische acties staan op AlwaysOn (`_1`); tot september 2026 stonden ze op `_0` (Allowed), en dan werd er niets afgedwongen.
>
> **Enforce Latest (september 2026).** Delay in Days 30, Install Time 12:30. Microsoft: de vertraging telt vanaf de publicatiedatum van de update (of het aanmaken van de policy) en 'only determines the target enforcement date and not the date that the update is offered to users'. 30 is bewust groter dan elk uitstel hierboven (7/14/21): met OIB's 3 dagen zou de deadline vallen vóórdat een grote update door het uitstel van 14 dagen zichtbaar is. 30 dagen is ook de CIS-grens (1.1, 1.6) en het maximum van de instelling. 12:30 omdat een Mac overdag aanstaat; 's nachts slaapt hij en installeert hij pas bij het openen. Enforce Latest dwingt de nieuwste versie voor dat model af, **inclusief een nieuwe hoofdversie**: macOS 27 wordt 14 dagen na uitgave zichtbaar en na 30 dagen afgedwongen. Wil een klant hoofdversies zelf vrijgeven, haal dan deze groep weg en gebruik een policy met een doelversie. Microsoft Learn: 'When an update enforcement is assigned, the device ignores software update settings, including automatic update actions' — zolang er een deadline openstaat bepaalt die het gedrag; de automatische acties werken daarbuiten.
>
> **Beta** (softwareupdate_beta ProgramEnrollment AlwaysOff): geen AppleSeed/beta-builds op bedrijfs-Macs; macOS 15.4+, supervised.
>
> **App-updates en configuratiedata** via twee sleutels uit de klassieke com.apple.SoftwareUpdate-payload (AutomaticallyInstallAppUpdates, ConfigDataInstall), omdat de DDM-declaratie daar geen tegenhanger voor heeft — mSCP (branch tahoe) koppelt precies deze twee CIS-regels ook alleen aan de profielsleutels. Beide zijn in macOS al standaard aan; de policy maakt ze niet meer uitschakelbaar. De andere sleutels uit die payload zijn bewust niet gezet, omdat DDM ze dekt.
>
> Open punt: of SystemPeriodInDays (21) ook XProtect- en configuratiedata vertraagt, is niet in Apple's schema vastgelegd. Blijkt dat zo, verlaag hem dan.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden<br>A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management<br>7.4 Perform Automated Application Patch Management |
| NIST CSF 2.0 | PR.PS-02<br>ID.RA-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 23

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `softwareupdate_softwareupdate` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_allowstandarduserosupdates` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_download` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installosupdates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installsecurityupdate` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enable` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enablerollback` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_majorperiodindays` | 14 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_minorperiodindays` | 7 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_systemperiodindays` | 21 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_notifications` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_beta` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_beta_programenrollment` | 2 |
| `ddm-latestsoftwareupdate_ddm-latestsoftwareupdate` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_enforcelatestsoftwareupdateversion` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_delayindays` | 30 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_installtime` | 12:30 |
| `com.apple.softwareupdate_com.apple.softwareupdate` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.softwareupdate_automaticallyinstallappupdates` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.softwareupdate_configdatainstall` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
