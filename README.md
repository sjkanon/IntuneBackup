# IntuneBackup

`IntuneTemplate/` bevat de afgesproken Intune Settings Catalog-policies (rauwe export,
Table Storage-backupformaat).

`baseline/intune/baseline-v1.0.json` is daaruit gegenereerd (`scripts/generate-baseline.js`)
in het schema dat [TEST Policies Platform](https://github.com/sjkanon/Platform) leest via
zijn baseline-koppeling (Instellingen → Baseline-koppelingen, categorie `intune`). Elke
`Baseline_*.json` met `"Type": "Catalog"` wordt één checkId-regel; de platform-engine
vergelijkt de volledige instellingen-set tegen wat er in een klanttenant staat.

**Bij een wijziging in `IntuneTemplate/`:** `.github/workflows/generate-baseline.yml`
regenereert `baseline/intune/baseline-v1.0.json` automatisch en opent daar een PR voor —
controleer de diff (nieuwe/verwijderde checks, gewijzigde instellingen) vóór je merget.
Handmatig opnieuw genereren: `node scripts/generate-baseline.js`.

**Nog niet ondersteund:** bestanden met `"Type": "Admin"` (`Edge_Standard_search_engine__Google`,
`Office_Updates`) — klassieke ADMX-backed Group Policy Configuration, een andere Graph-API
(`groupPolicyConfigurations`) dan Settings Catalog. Het script slaat ze zichtbaar over in
plaats van een foutieve check te genereren.
