<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - U - Microsoft Edge Extensions

Bepaalt welke Edge-extensies gebruikers op de Mac mogen installeren.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - U - Extensions |
| Bestand | [`Baseline_MAC_U_Microsoft_Edge_Extensions.json`](Baseline_MAC_U_Microsoft_Edge_Extensions.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions |
| NIST CSF 2.0 | PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.managedclient.preferences_extensioninstallallowlist` | odfafepnkmbhccpbejgmiehpchacaeak |
| `com.apple.managedclient.preferences_blockexternalextensions` | true |
| `com.apple.managedclient.preferences_extensioninstallforcelist` | nkbndigcebkoaejohleckhekfmcecfja, ofefcgjbeghpigppfmkologfjadafddi |
| `com.apple.managedclient.preferences_extensioninstallblocklist` | * |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
