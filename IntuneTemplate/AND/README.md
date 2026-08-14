<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# Android — 1 policy

Alle policies heten `[Baseline] - AND - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `AppProtection/` | 1 |

## User-scoped (U) — 1

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| **App Protection** | Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke Android-telefoon: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens. | App Protection | — | All Users | — |

---

**Wat het doet** komt uit `doel` in [`_oib-manifest.json`](../_oib-manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
