<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# Android — 1 policies

Alle policies heten `[Baseline] - AND - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `AppProtection/` | 1 |

## User-scoped (U) — 1

Toewijzen aan gebruikersgroepen.

| Policy | Type | Instellingen | checkId | Toewijzing | Bron |
|---|---|---:|---|---|---|
| `App Protection` | App Protection | — | — | All Users | OIB |

---

Kolom **Bron**: `OIB` komt uit [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) via
[`_oib-manifest.json`](../_oib-manifest.json); `eigen` staat alleen in deze baseline.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
