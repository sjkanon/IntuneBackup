<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Microsoft Edge Search Engine

Zet Google als standaardzoekmachine in Edge. Een klantkeuze, geen beveiligingsinstelling.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | ADMX |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-015-EdgeStandardSearchEngineGoogle` |
| Bron | eigen baseline (ADMX) |
| Bestand | [`Baseline_WIN_D_Microsoft_Edge_Search_Engine.json`](Baseline_WIN_D_Microsoft_Edge_Search_Engine.json) |

## ADMX-definities — 5

Klassieke Group Policy-instellingen. De GUID's zijn Microsoft's vaste
ADMX-catalogus-id's en dus tenant-onafhankelijk.

| Definitie | Ingeschakeld | Waarden |
|---|---|---|
| `de2c6c02-ebe2-46ee-a4fc-0c61ad011153` | ja | redirect |
| `f8324242-18c0-40bf-ae08-52db57201372` | ja | {google:baseURL}complete/search?output=chrome&q={searchTerms} |
| `5eb1769d-4cea-4bce-87b9-bb549f8288d3` | ja | Google |
| `97b941fd-4e08-4672-9aa0-db0606256a06` | ja | — |
| `8d9348dc-84f7-4e3d-8fd5-e18ce444708c` | ja | {google:baseURL}search?q={searchTerms}&{google:RLZ}{google:originalQueryForSuggestion}{google:assistedQueryStats}{google:searchFieldtrialParameter}{google:searchClient}{google:sourceId}ie={inputEncoding} |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
