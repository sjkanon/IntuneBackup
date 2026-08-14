<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Defender Antivirus

Realtimebeveiliging, cloudbescherming en scangedrag van Defender op macOS.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-036-MACDDefenderAntivirus` |
| Bron | OpenIntuneBaseline macOS v1.0 — Defender Antivirus - D - Antivirus Configuration |
| Bestand | [`Baseline_MAC_D_Defender_Antivirus.json`](Baseline_MAC_D_Defender_Antivirus.json) |

## Instellingen — 26

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.managedclient.preferences_disallowedthreatactions` | allow, restore |
| `com.apple.managedclient.preferences_enforcementlevel_antivirusengine` | 2 |
| `com.apple.managedclient.preferences_exclusionsmergepolicy` | 1 |
| `com.apple.managedclient.preferences_scanafterdefinitionupdate` | true |
| `com.apple.managedclient.preferences_scanarchives` | true |
| `com.apple.managedclient.preferences_threattypesettings` | *(2 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_value` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_key` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_value` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_key` | 1 |
| `com.apple.managedclient.preferences_threattypesettingsmergepolicy` | 1 |
| `com.apple.managedclient.preferences_automaticdefinitionupdateenabled` | true |
| `com.apple.managedclient.preferences_cloudblocklevel` | 0 |
| `com.apple.managedclient.preferences_diagnosticlevel` | 0 |
| `com.apple.managedclient.preferences_automaticsamplesubmission` | true |
| `com.apple.managedclient.preferences_enabled` | true |
| `com.apple.managedclient.preferences_earlypreview` | false |
| `com.apple.managedclient.preferences_systemextensions` | 0 |
| `com.apple.managedclient.preferences_enforcementlevel` | 2 |
| `com.apple.managedclient.preferences_enforcementlevel_tamperprotection` | 2 |
| `com.apple.managedclient.preferences_exclusions_tamperprotection` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_exclusions_item_path_tamperprotection` | /Library/Intune/Microsoft Intune Agent.app/Contents/MacOS/IntuneMdmDaemon |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_exclusions_item_signingid_tamperprotection` | IntuneMdmDaemon |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_exclusions_item_teamid_tamperprotection` | UBF8T346G9 |
| `com.apple.managedclient.preferences_consumerexperience` | 1 |
| `com.apple.managedclient.preferences_hidestatusmenuicon` | false |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
