<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - U - Microsoft Edge Profiles and Sync

Bepaalt met welk account gebruikers zich in Edge aanmelden en wat er gesynchroniseerd wordt.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - U - Profiles, Sign-In and Sync |
| Bestand | [`Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.json`](Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| NIST CSF 2.0 | PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.managedclient.preferences_browsersignin` | 2 |
| `com.apple.managedclient.preferences_browseraddprofileenabled` | false |
| `com.apple.managedclient.preferences_forceephemeralprofiles` | false |
| `com.apple.managedclient.preferences_forcesync` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
