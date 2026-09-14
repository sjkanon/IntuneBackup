<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Microsoft Edge Password Management

Bepaalt of Edge op de Mac wachtwoorden mag opslaan en tonen.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - D - Password Management |
| Bestand | [`Baseline_MAC_D_Microsoft_Edge_Password_Management.json`](Baseline_MAC_D_Microsoft_Edge_Password_Management.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.managedclient.preferences_passwordmonitorallowed` | true |
| `com.apple.managedclient.preferences_passwordprotectionwarningtrigger` | 1 |
| `com.apple.managedclient.preferences_passwordmanagerenabled` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
