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

> Firewall en stealth mode aan (CIS Apple macOS 26 L1 2.2.1, 2.2.2), Gatekeeper aan met App Store en geïdentificeerde ontwikkelaars (2.6.5). 'Alle inkomende verbindingen blokkeren' staat bewust uit — dat breekt AirPlay-ontvangst en schermdeling; de compliance-policy eist het sinds september 2026 ook niet meer. Sinds september 2026 mag Gatekeeper vragen een geblokkeerd malwarebestand naar Apple te sturen (enablexprotectmalwareupload, override). Het blokkeren van de Finder-omzeiling (com.apple.systempolicy.managed DisableOverride) staat niet hier maar in [Baseline] - MAC - D - Restrictions Hardening: het is een andere payload die OIB v1.0 niet levert, en een override kan geen nieuwe payloadgroep toevoegen.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Netwerkbeveiliging<br>A.8.7 Bescherming tegen malware<br>A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.5 Implement and Manage a Firewall on End-User Devices<br>2.5 Allowlist Authorized Software<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.IR-01<br>PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.control_enablexprotectmalwareupload` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
