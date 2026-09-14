<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Software Updates

Dwingt op ingeschreven iPhones en iPads de nieuwste iOS-versie af uiterlijk 14 dagen na uitgave (installatie om 02:00), zet automatisch downloaden en installeren van OS- en beveiligingsupdates vast aan, en laat de gebruiker beveiligingsverbeteringen niet terugdraaien.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-192-IOSDSoftwareUpdates` |
| Bron | UniFy iOS/iPadOS Baseline v1.2 — SC - DEV - Software Update - Corporate Devices (CIS Apple iOS/iPadOS 26 Benchmark v1.0.0), vergeleken met IntuneAdmin Apple iOS Benchmarks (Enforce Latest Software Update Version, Recommendation Cadence, Rapid Security Response); uitstelperiode bewust weggelaten |
| Bestand | [`Baseline_IOS_D_Software_Updates.json`](Baseline_IOS_D_Software_Updates.json) |

> Let op de optienummers: bij de automatische acties is `_0` Allowed (de gebruiker kiest) en `_1` AlwaysOn — hier `_1`, dezelfde fout die in MAC - D - Software Updates is hersteld. Bij enforce latest is `_0` juist de enige optie (True). Afwijkingen van UniFy: geen uitstel (combinedperiodindays 14) — met uitstel én een deadline van 14 dagen verschijnt een beveiligingsupdate pas op de dag dat hij wordt afgedwongen; zonder uitstel kan de gebruiker hem meteen installeren en is dag 14 de vangrail. Beta-inschrijving niet gezet: de definitie heet 'Program Enrollment (Unsupported)'. Terugdraaien van Background Security Improvements staat uit (UniFy, CIS), anders dan in MAC - D - Software Updates waar het aan staat. Aanbevolen versie op Newest, gelijk aan IntuneAdmin. Compliance Device Health blijft met osMinimumVersion de toegangsgrens; deze policy zorgt dat toestellen daar ruim boven blijven.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden<br>A.8.9 Configuratiebeheer |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02<br>ID.RA-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 14

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `ddm-latestsoftwareupdate_ddm-latestsoftwareupdate` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_enforcelatestsoftwareupdateversion` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_delayindays` | 14 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_installtime` | 02:00 |
| `softwareupdate_softwareupdate` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_download` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installosupdates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installsecurityupdate` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enable` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enablerollback` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_notifications` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_recommendedcadence` | 2 |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
