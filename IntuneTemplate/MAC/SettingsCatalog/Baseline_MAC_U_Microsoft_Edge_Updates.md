<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - U - Microsoft Edge Updates

Hoe en wanneer Edge op de Mac zichzelf bijwerkt.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - U - Updates |
| Bestand | [`Baseline_MAC_U_Microsoft_Edge_Updates.json`](Baseline_MAC_U_Microsoft_Edge_Updates.json) |

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | Edge Updater |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.EdgeUpdater |
| `com.apple.managedclient.preferences_componentupdatesenabled` | true |
| `com.apple.managedclient.preferences_relaunchnotification` | 1 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
