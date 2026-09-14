<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Time Server

Laat de Mac zijn klok gelijkzetten met time.apple.com, zodat tijdstempels in logboeken, Kerberos-tickets en certificaatcontroles kloppen.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-201-MACDTimeServer` |
| Bron | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.3.2.1 (mSCP branch tahoe, ODV time.apple.com); vorm uit microsoft/intune-my-macs pol-sys-100-ntp |
| Bestand | [`Baseline_MAC_D_Time_Server.json`](Baseline_MAC_D_Time_Server.json) |

> Het tweede deel van CIS 2.3.2.1, 'tijd automatisch instellen' afdwingen (com.apple.timed TMAutomaticTimeOnlyEnabled), staat niet in de settings catalog; de standaard in macOS is al aan. Tijdzone (com.apple.mcx timeZone) bewust niet gezet: een organisatie met mensen in meerdere tijdzones zou dan de verkeerde tijd tonen. Fase 1: hoort een regel te krijgen in _assignments.json (allDevicesAssignmentTarget), zoals de andere MAC - D-policies in fase 1.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.17 Kloksynchronisatie<br>A.8.15 Logging |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 8.4 Standardize Time Synchronization |
| NIST CSF 2.0 | PR.PS-04 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.mcx_com.apple.mcx-timeserver` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx_timeserver` | time.apple.com |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
