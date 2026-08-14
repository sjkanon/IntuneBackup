<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Microsoft Office

Basisconfiguratie van Office op macOS.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-043-MACDMicrosoftOffice` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft Office - D - Office Configuration |
| Bestand | [`Baseline_MAC_D_Microsoft_Office.json`](Baseline_MAC_D_Microsoft_Office.json) |

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | Office Licensing Helper |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.office.licensingV2.helper |
| `com.apple.managedclient.preferences_officeautosignin` | true |
| `com.apple.managedclient.preferences_officeactivationemailaddress` | {{userprincipalname}} |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
