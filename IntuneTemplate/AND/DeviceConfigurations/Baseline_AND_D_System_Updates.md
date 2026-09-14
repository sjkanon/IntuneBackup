<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - D - System Updates

Installeert Android-systeemupdates op toestellen van de organisatie automatisch in een onderhoudsvenster tussen 00:00 en 06:00.

| | |
|---|---|
| Platform | Android |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - DC - DR - DEV - Additional-Settings - Fully-Managed - v1.5, alleen de drie systemUpdate-velden |
| Bestand | [`Baseline_AND_D_System_Updates.json`](Baseline_AND_D_System_Updates.json) |

> Alleen de systemUpdate-velden van `androidDeviceOwnerGeneralDeviceConfiguration`; de Settings Catalog kent geen systeemupdate-instelling. Een toestel dat 's nachts uit staat of geen update in het venster kan afronden, installeert pas bij een volgende gelegenheid (UniFy W-15) — daarom toetst de compliance de patchdatum. Geen `systemUpdateFreezePeriods`: een bevriezingsperiode (bijv. rond een jaarafsluiting) is een klantbesluit. Dedicated toestellen in 24-uursgebruik: kies een ander venster in een eigen kopie, niet in deze policy. Geen andere velden van dit type gezet, dus geen overlap met een eventuele kiosk- of Additional Settings-policy — mits die de systemUpdate-velden leeg laat.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 3

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `systemUpdateInstallType` | windowed |
| `systemUpdateWindowStartMinutesAfterMidnight` | 0 |
| `systemUpdateWindowEndMinutesAfterMidnight` | 360 |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
