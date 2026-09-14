<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Lock Screen

Toont op het vergrendelscherm van een bedrijfs-iPhone of -iPad een tekst voor de vinder, zodat een verloren toestel terug kan naar de organisatie.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-189-IOSDLockScreen` |
| Bron | Apple Shared Device Configuration-payload (com.apple.shareddeviceconfiguration) in de iOS settings catalog; UniFy iOS/iPadOS Baseline v1.2 — SC - Lock Screen - Corporate en IntuneAdmin — Lock Screen Message. De vergrendelscherm-restricties uit dezelfde UniFy-policy staan in [Baseline] - IOS - D - Restrictions Corporate |
| Bestand | [`Baseline_IOS_D_Lock_Screen.json`](Baseline_IOS_D_Lock_Screen.json) |

> **Vul VERLOREN-TOESTEL-TEKST-INVULLEN in** vóór toewijzing, bijvoorbeeld 'Gevonden? Bel de servicedesk: <nummer>' — geen persoonsnaam, dat is informatie voor een dief. De repo kent geen CIPP-token voor organisatienaam of telefoonnummer (%OrganizationId% is een GUID), vandaar de placeholder. Assettag (assettaginformation) bewust niet gezet: UniFy gebruikt daar {{DEVICENAME}}, en of Intune dat token in deze payload vervangt heb ik niet kunnen verifiëren.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.shareddeviceconfiguration_com.apple.shareddeviceconfiguration` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.shareddeviceconfiguration_lockscreenfootnote` | VERLOREN-TOESTEL-TEKST-INVULLEN |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
