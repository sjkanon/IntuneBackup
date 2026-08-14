# baseline/

**Gegenereerd — niet met de hand bijwerken.** `intune/baseline-v1.0.json` is de bron voor de
`intune`-categorie in de baseline-koppeling van het TEST Policies Platform (Instellingen →
Baseline-koppelingen). Wijzig je hier iets, dan is het bij de volgende
`node scripts/generate-baseline.js` weer weg — pas `IntuneTemplate/` aan.

```mermaid
flowchart LR
  T["IntuneTemplate/"] -->|generate-baseline.js| B["baseline/intune/baseline-v1.0.json<br/>88 rules"]
  B --> P["TEST Policies Platform"]
  P -->|vergelijkt op inhoud| TEN["live tenant"]
```

## Wat erin zit

88 regels: 6 die uit het platform zelf komen (checkId 001–006, device-compliance- en
app-protection-checks) plus 82 gegenereerd uit `IntuneTemplate/`.

| `type` | Aantal | Uit |
|---|---:|---|
| `settings-catalog-match` | 81 | elke Settings Catalog-policy, Windows én macOS |
| `group-policy-definition-match` | 1 | de enige overgebleven ADMX-policy |
| `device-encryption-required` e.a. | 6 | overgenomen uit het platform (001–006) |

Niet elk policytype levert een check op. `Device`, `deviceCompliancePolicies` en
`AppProtection` hebben geen matcher in de engine; een regel met een onbekend type is een check
die stilzwijgend niets test. Voor compliance en app protection dekken 001–006 het generiek af.

## Twee dingen om te weten bij het lezen van een finding

**De checks matchen op inhoud, niet op naam.** Een policy die de klant anders genoemd heeft
telt gewoon mee — dat is bewust. Keerzijde: een achtergebleven policy onder een óude naam
houdt zijn check groen, ook als de nieuwe nooit is aangemaakt. De baseline is daarom geen
vangnet voor een naamsmigratie; zie [PLAN.md](../PLAN.md#fase-3--tenant-migratie).

**checkId's zijn externe identifiers.** Het platform, findings en uitzonderingen verwijzen
ernaar, dus ze veranderen niet als een bestand hernoemd wordt. Vijf nummers zijn opgeheven
(008, 017, 023, 025, 028) en worden niet opnieuw uitgedeeld — zie de
[hoofd-README](../README.md#vijf-checkids-zijn-opgeheven).

Per-tenant waarden worden overgeslagen: het EDR-onboardingtoken is een `encryptedValueToken`
die alleen in de brontenant betekenis heeft en hoort niet als vaste verwachte waarde in een
gedeelde baseline.
