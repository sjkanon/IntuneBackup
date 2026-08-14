<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Firewall and Gatekeeper

Zet de macOS-firewall aan en laat Gatekeeper alleen software toe die door een herkende ontwikkelaar is ondertekend.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-039-MACDFirewallAndGatekeeper` |
| Bron | OpenIntuneBaseline macOS v1.0 — Firewall - D - Gatekeeper |
| Bestand | [`Baseline_MAC_D_Firewall_and_Gatekeeper.json`](Baseline_MAC_D_Firewall_and_Gatekeeper.json) |

## Instellingen — 9

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.security.firewall_com.apple.security.firewall` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_blockallincoming` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_enablefirewall` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_enablelogging` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_enablestealthmode` | true |
| `com.apple.systempolicy.control_com.apple.systempolicy.control` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.control_allowidentifieddevelopers` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.control_enableassessment` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.control_enablexprotectmalwareupload` | false |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
