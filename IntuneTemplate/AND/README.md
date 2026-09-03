<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# Android — 3 policies

Alle policies heten `[Baseline] - AND - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `AppProtection/` | 1 |
| `CompliancePolicies/` | 2 |

## User-scoped (U) — 3

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**App Protection**](AppProtection/Baseline_AND_U_App_Protection.md) | Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke Android-telefoon: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens. | App Protection | — | All Users | — |
| [**Compliance Device Health**](CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) | Merkt een Android-toestel als niet-compliant wanneer het geroot is, USB-foutopsporing aanstaat, apps van buiten de Play Store zijn toegestaan of Play Integrity niet hardwarematig bevestigd kan worden. | Compliance | — | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_AND_U_Compliance_Password.md) | Toetst of het werkprofiel een toegangscode van minimaal zes tekens met gemiddelde complexiteit vereist, na vijftien minuten vergrendelt en of de opslag versleuteld is. | Compliance | — | — | — |

---

**Wat het doet** komt uit `doel` in [`_manifest.json`](../_manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
