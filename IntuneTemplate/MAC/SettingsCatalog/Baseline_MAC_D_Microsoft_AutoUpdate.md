<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Microsoft AutoUpdate

Hoe en wanneer Office, Edge en andere Microsoft-apps op de Mac zichzelf bijwerken.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-040-MACDMicrosoftAutoUpdate` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft AutoUpdate - D - MAU Configuration |
| Bestand | [`Baseline_MAC_D_Microsoft_AutoUpdate.json`](Baseline_MAC_D_Microsoft_AutoUpdate.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 16

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | MAU |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.autoupdate2 |
| `com.apple.managedclient.preferences_acknowledgeddatacollectionpolicy` | 0 |
| `com.apple.managedclient.preferences_updatedeadline.daysbeforeforcedquit` | 14 |
| `com.apple.managedclient.preferences_manifestserver` | 0 |
| `com.apple.managedclient.preferences_disableinsidercheckbox` | true |
| `com.apple.managedclient.preferences_howtocheck` | 0 |
| `com.apple.managedclient.preferences_enablecheckforupdatesbutton` | true |
| `com.apple.managedclient.preferences_guardagainstappmodification` | false |
| `com.apple.managedclient.preferences_startdaemononapplaunch` | true |
| `com.apple.managedclient.preferences_updatecache` | https://officecdn.microsoft.com/pr/C1297A47-86C4-4C1F-97FA-950631F94777/OfficeMac/ |
| `com.apple.managedclient.preferences_channelname` | 0 |
| `com.apple.managedclient.preferences_updateroptimization` | 0 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
