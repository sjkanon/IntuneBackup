<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - External Storage Read Only

Laat macOS alleen externe opslag koppelen die zelf alleen-lezen is. Gewone USB-sticks en externe schijven — die lees-schrijf zijn — worden helemaal niet gekoppeld.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-196-MACDExternalStorageReadOnly` |
| Bron | Apple declaratief beheer, com.apple.configuration.diskmanagement.settings (apple/device-management: macOS 15.0, alleen supervised); settingDefinitionId's en opties geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_MAC_D_External_Storage_Read_Only.json`](Baseline_MAC_D_External_Storage_Read_Only.json) |

> Wie de Windows-lijn wil — lezen mag, schrijven niet — heeft op macOS Microsoft Defender for Endpoint Device Control nodig (removable media-beleid met alleen leesrechten). Dat vraagt een aangemelde Defender-agent (extras/macos/defender-onboarding) en een apart JSON-beleid, en zit niet in deze ronde. Ook een externe Time Machine-schijf wordt met deze policy niet meer gekoppeld; back-up hoort in deze baseline via OneDrive (KFM) te lopen. Kiest een klant hiervoor, rol dan eerst uit op een pilotgroep en behandel het daarna als fase 2. Geen overlap: geen ander template zet diskmanagement_*.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.10 Opslagmedia<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists |
| NIST CSF 2.0 | PR.DS-01<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `diskmanagement_diskmanagement` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`diskmanagement_restrictions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`diskmanagement_restrictions_externalstorage` | 1 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
