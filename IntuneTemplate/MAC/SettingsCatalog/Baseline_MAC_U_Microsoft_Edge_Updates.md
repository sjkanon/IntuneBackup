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

> Aangevuld tot hetzelfde gedrag als de Windows-tegenhanger. relaunchnotification stond al op Required (bij macOS is 1 = Required en 0 = Recommended, omgekeerd aan wat je zou verwachten), maar zonder periode eindigt die melding nergens. Nu relaunchnotificationperiod op 259200000 milliseconden, 3 dagen en daarmee gelijk aan Windows, en relaunchfastifoutdated op 7 dagen. Een herstartvenster kent de macOS-catalogus niet (com.apple.managedclient.preferences_relaunchwindow bestaat daar niet), dus dat ene verschil met Windows blijft staan.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management<br>9.1 Ensure Use of Only Fully Supported Browsers and Email Clients |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 9

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
| `com.apple.managedclient.preferences_relaunchnotificationperiod` | 259200000 |
| `com.apple.managedclient.preferences_relaunchfastifoutdated` | 7 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
