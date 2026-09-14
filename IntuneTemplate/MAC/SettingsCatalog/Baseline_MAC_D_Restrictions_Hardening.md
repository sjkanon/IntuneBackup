<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Restrictions Hardening

Vult de macOS-restricties aan met vijf maatregelen die OpenIntuneBaseline macOS v1.0 niet zet: geen handmatig geïnstalleerde configuratieprofielen of certificaten, geen Gatekeeper-omzeiling via de Finder, geen diagnostische gegevens naar Apple, geen internetresultaten in Spotlight en geen contentcaching.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-199-MACDRestrictionsHardening` |
| Bron | OpenIntuneBaseline macOS v2.0 beta — SC - Device Security - D - Restrictions en D - Gatekeeper (zelfde waarden); CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.6.3.1 (diagnostische gegevens) |
| Bestand | [`Baseline_MAC_D_Restrictions_Hardening.json`](Baseline_MAC_D_Restrictions_Hardening.json) |

> Eigen policy en geen uitbreiding van [Baseline] - MAC - D - Restrictions of Firewall and Gatekeeper, omdat die uit OpenIntuneBaseline v1.0 komen: extra ids daar blijven bij een import wel staan, maar een aparte policy maakt zichtbaar welke keuze eigen is en kan een eigen fase krijgen. Geen van de vijf ids staat in een ander template. com.apple.applicationaccess wordt daardoor in twee profielen geleverd; macOS combineert restrictie-payloads en de strengste waarde wint — geen conflict, en check-scope.js meldt het bij Apple bewust niet. Wordt OpenIntuneBaseline macOS v2.0 geïmporteerd, dan zet OIB deze vijf zelf in Restrictions en Gatekeeper; haal ze dan hier weg, anders staan ze dubbel. enablexprotectmalwareupload (Gatekeeper mag vragen een geblokkeerd malwarebestand naar Apple te sturen) staat niet hier maar als override in Firewall and Gatekeeper, omdat OIB v1.0 die instelling al zet. Bewust níet overgenomen uit OIB v2.0 beta Restrictions: allowFindMyDevice, allowTimeMachineBackup=false, allowPasswordAutoFill=false en de andere keuzes die de eerdere analyse al afwees.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer<br>A.8.19 Installatie van software op operationele systemen<br>A.5.34 Privacy en bescherming van persoonsgegevens |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>2.5 Allowlist Authorized Software<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcontentcaching` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowdiagnosticsubmission` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowspotlightinternetresults` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowuiconfigurationprofileinstallation` | false |
| `com.apple.systempolicy.managed_com.apple.systempolicy.managed` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.managed_disableoverride` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
