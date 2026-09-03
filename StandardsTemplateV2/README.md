# StandardsTemplateV2/

Eén CIPP **standards**-template. Dat is iets anders dan alles in `IntuneTemplate/`,
`ISMSTemplate/` en `BASELINE2/`: die gaan over Intune-policies op apparaten, dit gaat over
tenantinstellingen die CIPP zelf bewaakt en herstelt.

| | |
|---|---|
| Bestand | `Standard.json` |
| `PartitionKey` | `StandardsTemplateV2` — daar herkent CIPP het aan, niet aan de mapnaam |
| Naam in CIPP | `Standard` |

## Wat er in staat

| Standaard | Actie | Instelling |
|---|---|---|
| `NudgeMFA` | Remediate | uit (`state: disabled`, `snoozeDurationInDays: 0`) |
| `PasskeyDynamicMigrationOptOut` | Remediate | aan |

`isDriftTemplate` staat gevuld, dus CIPP kan dit als driftbewaking gebruiken: wijkt de tenant
af, dan zet CIPP hem terug.

## Waarom hier en niet in een van de policysets

De pijplijnen in `scripts/` kennen vijf CIPP-policytypes (`Catalog`, `Admin`, `Device`,
`deviceCompliancePolicies`, `AppProtection`) en een standards-template is geen van die vijf.
Dit bestand wordt dus **niet** opgepikt door `check-scope.js`, `check-sets.js`,
`generate-baseline.js` of `export-intunebackup.js`, en er hoort geen `checkId` bij. Het heeft
ook geen naamconventie met platform en scope — die slaat nergens op voor een tenantinstelling.

CIPP leest het wél rechtstreeks, net als de policysets: het bestand eindigt op `.json` en zit
niet onder een `NativeImport`-pad. Zie de [hoofd-README](../README.md#terugzetten-in-een-tenant)
voor hoe die scan werkt.

## Bijwerken

Exporteer het template opnieuw uit CIPP (Tenant Administration → Standards → template →
Export) en vervang `Standard.json`. Met de hand bijwerken kan, maar let op: de hele
configuratie zit als **string** in `.JSON`, dus een aanpassing daarin moet je binnen die string
maken en correct escapen.
