# IntuneBackup

`IntuneTemplate/` bevat de afgesproken Intune-policies (rauwe export, Table
Storage-backupformaat) — twee formaten, onderscheiden door `.Type`:
- `"Catalog"`: Settings Catalog-policy (`settings[].settingInstance`-bomen).
- `"Admin"`: klassieke ADMX-backed Group Policy Configuration (`added[].definition@odata.bind`).

`baseline/intune/baseline-v1.0.json` is daaruit gegenereerd (`scripts/generate-baseline.js`)
in het schema dat [TEST Policies Platform](https://github.com/sjkanon/Platform) leest via
zijn baseline-koppeling (Instellingen → Baseline-koppelingen, categorie `intune`). Elk
`Baseline_*.json`-bestand wordt één checkId-regel: `"Catalog"` wordt `type:
"settings-catalog-match"`, `"Admin"` wordt `type: "group-policy-definition-match"`. De
platform-engine vergelijkt de volledige instellingen-/definitieset tegen wat er in een
klanttenant staat.

**Let op bij `"Admin"`/ADMX:** de Graph-endpoint hiervoor
(`deviceManagement/groupPolicyConfigurations`) is beta-only en de fetch-/matchinglogica in
de platform-engine is nog niet tegen een echte tenant getest — zie TODO.md in
`sjkanon/Platform`. Settings Catalog-checks zijn stabieler (v1.0-endpoint, wel geverifieerd
dat de cmdlet ontbreekt maar de REST-aanroep zelf niet getest).

**Bij een wijziging in `IntuneTemplate/`:** `.github/workflows/generate-baseline.yml`
regenereert `baseline/intune/baseline-v1.0.json` automatisch en opent daar een PR voor —
controleer de diff (nieuwe/verwijderde checks, gewijzigde instellingen) vóór je merget.
Handmatig opnieuw genereren: `node scripts/generate-baseline.js`.
