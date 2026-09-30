<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Edge_Search_Engine.md) · [English](Baseline_WIN_D_Microsoft_Edge_Search_Engine.en.md) · **Français**

# CXNM - Standard - WIN - D - Microsoft Edge Search Engine

Définit Google comme moteur de recherche par défaut dans Edge. Un choix de l'organisation, pas un paramètre de sécurité.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | ADMX |
| Affectation | — |
| Source | baseline propre (ADMX) |
| Fichier | [`Baseline_WIN_D_Microsoft_Edge_Search_Engine.json`](Baseline_WIN_D_Microsoft_Edge_Search_Engine.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Définitions ADMX — 5

Paramètres de stratégie de groupe classiques. Les GUID sont les identifiants fixes du
catalogue ADMX de Microsoft, donc indépendants du tenant.

| Définition | Activée | Valeurs |
|---|---|---|
| `de2c6c02-ebe2-46ee-a4fc-0c61ad011153` | oui | redirect |
| `f8324242-18c0-40bf-ae08-52db57201372` | oui | {google:baseURL}complete/search?output=chrome&q={searchTerms} |
| `5eb1769d-4cea-4bce-87b9-bb549f8288d3` | oui | Google |
| `97b941fd-4e08-4672-9aa0-db0606256a06` | oui | — |
| `8d9348dc-84f7-4e3d-8fd5-e18ce444708c` | oui | {google:baseURL}search?q={searchTerms}&{google:RLZ}{google:originalQueryForSuggestion}{google:assistedQueryStats}{google:searchFieldtrialParameter}{google:searchClient}{google:sourceId}ie={inputEncoding} |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
