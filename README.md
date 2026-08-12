# IntuneBackup

`IntuneTemplate/` is de bron: de afgesproken Intune-policies in CIPP-templateformaat (Table
Storage-rij met een genestelde `JSON`/`RAWJson`-string). Drie formaten, onderscheiden door
`.Type`:
- `"Catalog"`: Settings Catalog-policy (`settings[].settingInstance`-bomen).
- `"Admin"`: klassieke ADMX-backed Group Policy Configuration (`added[].definition@odata.bind`).
- `"Device"`: klassieke deviceConfiguration (bv. `windowsUpdateForBusinessConfiguration`).

`IntuneTemplate/_assignments.json` houdt per policy de assignment-targets bij. Die staan
niet in het CIPP-template zelf (CIPP wijst apart toe), maar zijn wél nodig om via
IntuneBackupAndRestore compleet terug te zetten.

## Twee afgeleiden uit één bron

| Doel | Pad | Script |
|---|---|---|
| Baseline-checks voor TEST Policies Platform | `baseline/intune/baseline-v1.0.json` | `node scripts/generate-baseline.js` |
| Restore-formaat voor IntuneBackupAndRestore | `export/IntuneBackupAndRestore/` | `node scripts/export-intunebackup.js` |

CIPP gebruikt `IntuneTemplate/` rechtstreeks — daar is geen conversie voor nodig.

**Terugzetten met IntuneBackupAndRestore** (getest tegen module 4.0.1):

```powershell
Start-IntuneRestoreConfig     -Path '<repo>\export\IntuneBackupAndRestore'
Start-IntuneRestoreAssignments -Path '<repo>\export\IntuneBackupAndRestore' -RestoreById $false
```

`-RestoreById $false` is verplicht: de export bevat bewust geen tenant-id's, dus de module
moet op policynaam matchen. Dat is ook de enige modus die cross-tenant klopt — een id uit
tenant A wijst in tenant B nergens naar.

## Device- en user-scope

Een policy hoort óf device-scoped óf user-scoped te zijn, nooit allebei — een gemengde policy
kun je niet eenduidig toewijzen, en bij troubleshooting zie je niet of een instelling niet
aankomt omdat het apparaat of omdat de gebruiker buiten scope valt. De scope volgt uit de
`settingDefinitionId` (alles met prefix `user_` is user-scoped, de rest device-scoped), niet
uit het onderwerp.

```bash
node scripts/check-scope.js            # faalt bij gemengde scope of naamafwijking
node scripts/check-scope.js --report   # alleen het overzicht
```

De naamconventie is `[Baseline] - D - Item` / `[Baseline] - U - Item`, met bestandsnaam
`Baseline_D_Item.json` / `Baseline_U_Item.json`. De prefix `Baseline_` blijft verplicht:
`generate-baseline.js`, `export-intunebackup.js` en `Set-BaselineAssignment.ps1` filteren er
alle drie op.

Die omzetting is nog niet gedaan — zie [PLAN.md](PLAN.md). `check-scope.js` meldt vandaag dus
terecht 24 openstaande policies en 2 gemengde.

## Toewijzen in een tenant

```powershell
.\scripts\Set-BaselineAssignment.ps1 -AllDevices -WhatIf     # dry run, wijzigt niets
.\scripts\Set-BaselineAssignment.ps1 -AllDevices
.\scripts\Set-BaselineAssignment.ps1 -AllUsers
.\scripts\Set-BaselineAssignment.ps1 -GroupName 'SEC-Baseline-Pilot'
.\scripts\Set-BaselineAssignment.ps1 -GroupId '<object-id>' -Exclude

.\scripts\Set-BaselineAssignment.ps1 -Scope D -AllDevices    # na de hernoeming
.\scripts\Set-BaselineAssignment.ps1 -Scope U -AllUsers
```

`-Scope D`/`-Scope U` filtert de policylijst op de `- D -`/`- U -` in de naam. Policies die de
conventie nog niet volgen vallen daarmee buiten élk scope-filter; het script waarschuwt daar
expliciet over in plaats van ze stil over te slaan. Zonder `-Scope` (standaard `Both`) blijft
het gedrag ongewijzigd.

Zet in één keer een assignment op alle baseline-policies, over de drie policytypes heen
(Settings Catalog, ADMX en Device Configurations hebben elk hun eigen Graph-endpoint).

De policylijst komt uit `IntuneTemplate/`, niet uit een naamfilter op `[Baseline]`: "Windows
11 Update" hoort wél bij de baseline maar heeft die prefix niet en zou anders stilzwijgend
worden overgeslagen. Met `-Name` geef je een eigen lijst op.

Assignments worden **aangevuld**, niet vervangen. Graph's `/assign` overschrijft altijd de
volledige lijst, dus het script leest eerst de bestaande assignments en POST't de
samenvoeging; een target dat er al op staat wordt herkend en levert geen duplicaat op.
Met `-Replace` gooi je de bestaande assignments juist weg. Optioneel `-FilterId` +
`-FilterType` voor een assignmentfilter.

Policies die niet in de tenant staan worden gemeld, niet aangemaakt — rol ze eerst uit via
CIPP of `Start-IntuneRestoreConfig`.

## Een backup uit een tenant terugbrengen naar de bron

```powershell
node scripts/import-intunebackup.js "C:\Temp\BaselineIntuneBackup" [--overwrite] [--dry-run]
```

Zet een IntuneBackupAndRestore-export om naar `IntuneTemplate/`. Standaard worden alleen
policies toegevoegd die er nog niet zijn; bestaande templates blijven staan tenzij je
`--overwrite` meegeeft. Een export uit een tenant is namelijk niet automatisch verser dan
wat hier ligt — met blind overschrijven draai je een baselinewijziging stilzwijgend terug.

De importer weigert bovendien afgekapte Settings Catalog-exports (`settingCount` wijkt af van
het aantal geëxporteerde settings). Dat gebeurt echt: Graph pagineert de settings-
navigatieproperty standaard op 25, en een export die dat niet volgt levert een policy op die
bij restore het grootste deel van zijn instellingen mist.

## checkId's

`checkId`-nummers komen uit `CHECK_NUMBERS` in `scripts/generate-baseline.js`, niet uit de
alfabetische bestandsvolgorde — anders verschuift één nieuw template alle ID's erna, terwijl
het platform, findings en uitzonderingen ernaar verwijzen. Een nieuw bestand krijgt
automatisch het eerstvolgende vrije nummer en de run meldt welk; zet dat vast in de map.

Om dezelfde reden bestaat `CHECK_ID_SLUGS`: de suffix achter het nummer komt normaal uit de
bestandsnaam, dus zonder die map zou hernoemen naar `Baseline_D_BitLocker` van
`INTUNE-BASE-011-Bitlocker` een `INTUNE-BASE-011-DBitLocker` maken. Alleen hernoemde bestanden
staan erin; nieuwe policies krijgen gewoon hun slug uit de bestandsnaam. `CHECK_NUMBERS` en
`HIGH_SEVERITY_FILES` bevatten tijdens de migratie zowel de oude als de nieuwe bestandsnaam.

`"Catalog"` wordt `type: "settings-catalog-match"`, `"Admin"` wordt
`type: "group-policy-definition-match"`. `"Device"` levert **geen** check op: de
platform-engine heeft er geen matcher voor, en een rule met een onbekend type is een check
die stilzwijgend niets test. Die policies zijn wel gewoon uitrolbaar via CIPP en
IntuneBackupAndRestore.

**Let op bij `"Admin"`/ADMX:** de Graph-endpoint hiervoor
(`deviceManagement/groupPolicyConfigurations`) is beta-only en de fetch-/matchinglogica in
de platform-engine is nog niet tegen een echte tenant getest — zie TODO.md in
`sjkanon/Platform`. Settings Catalog-checks zijn stabieler (v1.0-endpoint, wel geverifieerd
dat de cmdlet ontbreekt maar de REST-aanroep zelf niet getest).

**Per-tenant waarden:** het EDR-onboarding-token in `Baseline_EDR_Configuration` is een
`encryptedValueToken` die alleen in de brontenant betekenis heeft. De baselinegenerator slaat
'm over; bij een restore in een andere tenant moet je die instelling handmatig opnieuw
koppelen.

**Bij een wijziging in `IntuneTemplate/`:** `.github/workflows/generate-baseline.yml`
regenereert `baseline/intune/baseline-v1.0.json` én `export/IntuneBackupAndRestore/`
automatisch en opent daar een PR voor — controleer de diff (nieuwe/verwijderde checks,
gewijzigde instellingen) vóór je merget.
