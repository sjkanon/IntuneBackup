**Nederlands** · [English](PLAYBOOK.en.md) · [Français](PLAYBOOK.fr.md)

# Draaiboek: de baseline via CIPP uitrollen, per apparaatklasse

Voor ITCE-engineers die deze baseline in een klanttenant zetten met CIPP. Het draaiboek gaat uit
van drie Windows-apparaatklassen — gezamenlijk, fysiek en AVD — die met **toewijzingsfilters**
worden onderscheiden in plaats van met groepen. Welke policy in welke klasse zit en waarom, staat
in [AVD.md](AVD.md); hoe de repo in elkaar zit in [STRUCTUUR.md](STRUCTUUR.md).

**Niets in dit draaiboek gebeurt vanzelf.** De baseline in CIPP rolt pas uit als je er tenants aan
toewijst, en alle scripts hebben eerst een `-WhatIf`-run.

## De drie apparaatklassen

Elke Windows-policy heeft in [`_manifest.json`](../IntuneTemplate/_manifest.json) een `doelgroep`.
macOS-, iOS- en Android-policies hebben er geen: een filter met platform `windows10AndLater` is daar
niet te kiezen.

| Klasse (`doelgroep`) | Wat | Filter (include) | Regel |
|---|---|---|---|
| `alle` (gezamenlijk) | fysieke pc's én AVD-sessiehosts, en alles wat onder geen van beide filters valt | geen | — |
| `fysiek` | laptops en workstations | `WIN - Physical` | `(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")` |
| `avd` | AVD-sessiehosts met Windows 11 Enterprise multi-session | `WIN - AVD Multi-session` | `(device.operatingSystemSKU -eq "ServerRdsh")` |

De bodies staan in [`IntuneTemplate/WIN/AssignmentFilters/`](../IntuneTemplate/WIN/AssignmentFilters/README.md).
Beide zijn in de testtenant gevalideerd met `validateFilter` en *Preview devices*: `WIN - Physical`
matcht de vier fysieke en QEMU-pc's en niet de AVD-host, `WIN - AVD Multi-session` precies de AVD-host.

**Windows 365 Cloud PC's en persoonlijke AVD-hosts** (single-session, model `Cloud PC …` of
`Virtual Machine`) vallen onder **geen** van beide filters. Ze krijgen alleen klasse `alle`, plus de
Cloud PC-set via de groepen `SEC-Cloud-PC` en `SEC-Cloud-PC-External` (fase 4). Geen BitLocker,
Windows Hello, Storage Sense of fysieke `Remote Desktop and RPC`, en ook geen FSLogix. Dat is een
keuze, geen vergissing: controleer bij een klant met Windows 365 of de gezamenlijke set daar volstaat.

## Pakketten

Een CIPP-pakket (`Package` in het template) heeft één toewijzing en één filter voor al zijn leden.
De pijplijn maakt daarom per klasse een eigen pakket: het pakket zonder achtervoegsel voor `alle`
en niet-Windows, `-Physical` en `-AVD` voor de klassen met filter. Alleen in fase 1 en 2; fase 3
wordt niet toegewezen, fase 4 heeft een eigen groep, fase 5 rolt niet uit. Een lege klasse krijgt
geen pakket (er is geen `-Users-AVD` en geen `-Pilot-AVD`).

Stand bij het schrijven, nageteld uit het manifest; de actuele, gegenereerde tabel staat in de
[`IntuneTemplate`-README](../IntuneTemplate/README.md#cipp-pakketten).

| Pakket | Toewijzing | Filter | Stage | Policies |
|---|---|---|---:|---:|
| `[Baseline] - Baseline-Devices` | alle apparaten | — | 1 | 53 |
| `[Baseline] - Baseline-Devices-Physical` | alle apparaten | `WIN - Physical` | 1 | 14 |
| `[Baseline] - Baseline-Devices-AVD` | alle apparaten | `WIN - AVD Multi-session` | 1 | 4 |
| `[Baseline] - Baseline-Users` | alle gebruikers | — | 1 | 31 |
| `[Baseline] - Baseline-Users-Physical` | alle gebruikers | `WIN - Physical` | 1 | 1 |
| `[Baseline] - Baseline-ADE-token` | niet toewijzen (ADE-token) | — | 1 | 2 |
| `[Baseline] - Baseline-SEC-<groep>` (tien pakketten) | de groep uit `faseGroep` | — | 1 | 14 |
| `[Baseline] - Baseline-Pilot` | groep `SEC-Baseline-Pilot` | — | 2 | 29 |
| `[Baseline] - Baseline-Pilot-Physical` | groep `SEC-Baseline-Pilot` | `WIN - Physical` | 2 | 13 |
| `[Baseline] - Baseline-Wacht` | niet toewijzen | — | 3 | 26 |
| `[Baseline] - Updates-Ring3-Physical` | alle apparaten behalve `SEC-Update-Ring1/2` | `WIN - Physical` | 1 (Windows-Updates) | 1 |
| `[Baseline] - Updates-SEC-Update-Ring1`, `-Ring2` | de ringgroep | — | 1 (Windows-Updates) | 2 |
| `[Baseline] - Updates-Devices` | alle apparaten | — | 1 (Windows-Updates) | 1 |
| `[Baseline] - Updates-Devices-Physical` | alle apparaten | `WIN - Physical` | 1 (Windows-Updates) | 1 |
| *(geen pakket — fase 5)* | — | — | — | 15 |

Samen 207. De `Baseline-`pakketten staan in [`BaselineTemplate/Baseline.json`](../BaselineTemplate/Baseline.json),
de `Updates-`pakketten in [`Windows-Updates.json`](../BaselineTemplate/README.md#windows-updatesjson--patchen).
Een klassepakket staat in dezelfde stage als zijn tegenhanger. In de CIPP-standard staat het filter
als **naam** (`assignmentFilter`, `assignmentFilterType: include`); CIPP zoekt het per tenant op.

## Filters of groepen?

**Filters voor de klassen**, om vier redenen:

1. **Direct bij check-in.** Intune toetst een filter op het moment dat het apparaat zich meldt.
   Een nieuwe sessiehost of laptop krijgt meteen de juiste set; met een dynamische groep wacht hij
   eerst tot Entra hem in de groep heeft gezet, en krijgt hij in die tussentijd de verkeerde of geen
   policies.
2. **Ook op gebruikerstoewijzingen.** Windows Hello for Business, Personal Data Encryption en de
   andere `U`-policies gaan naar gebruikers. Een *apparaatgroep* uitsluiten doet daar niets; een
   filter wordt wél getoetst op het apparaat waar de gebruiker zich aanmeldt. Dezelfde gebruiker
   krijgt Windows Hello op zijn laptop en niet in zijn AVD-sessie.
3. **Aanbevolen door Microsoft.** Toewijzen aan *Alle gebruikers* / *Alle apparaten* met een filter
   is sneller dan aan grote groepen: geen groepsevaluatie bij elke wijziging.
4. **Past op CIPP.** Een CIPP-pakket heeft precies één filter, en een klasse is precies één filter.
   Het vorige model — exclude-filters per policy op gemengde pakketten — kon CIPP niet uitdrukken.

**Groepen blijven nodig** waar het om een selectie gaat en niet om een soort apparaat:

- **De pilot**: `SEC-Baseline-Pilot`. Wie in de pilot zit is een keuze, geen eigenschap van het apparaat.
- **Fase 4**: `SEC-Cloud-PC`, `SEC-Cloud-PC-External`, `SEC-Shared-Devices`, de update-ringen
  `SEC-Update-Ring1/2` en de andere `faseGroep`-groepen.
- **De AVD-hostgroep `SEC-AVD-Session-Hosts`**, niet voor de baseline-pakketten maar voor de
  hostpoolinstelling *RDP SSO → target device groups*, de compliance-apparaattoewijzing op
  multi-session en rapportage.
- **Functies die een groep eisen**, zoals Windows Autopatch en andere update-diensten met hun eigen
  groepen.

**Groep én filter** kan samen: `[Baseline] - Baseline-Pilot-Physical` gaat naar de groep
`SEC-Baseline-Pilot` met include `WIN - Physical`. Zit er een sessiehost in de pilotgroep, dan
krijgt hij de gezamenlijke pilotpolicies (`Baseline-Pilot`) maar niet de fysieke.

## Naamgeving

De repo beschrijft zijn conventie in [README.md](../README.md#naamgeving) alleen voor policies en
bestanden. Afgeleid uit wat er staat, geldt voor alles:

**Wat in de tenant of in CIPP te zien is, is Engels; wat alleen in de repo staat, is Nederlands.**
Policy-, pakket-, filter- en groepsnamen zijn Engels; manifestvelden (`doel`, `fase`, `faseGroep`,
`doelgroep`) en hun waarden (`alle`, `fysiek`, `avd`) Nederlands.

| Wat | Patroon | Voorbeeld |
|---|---|---|
| Policy | `<prefix><PLATFORM> - <D\|U> - <Item>` | `[Baseline] - WIN - D - BitLocker` |
| Policybestand | `Baseline_<PLATFORM>_<D\|U>_<Item met _>.json` | `Baseline_WIN_D_BitLocker.json` |
| CIPP-pakket | `<prefix>Baseline-<doel>[-<klasse>]` | `[Baseline] - Baseline-Devices-Physical` |
| Updatepakket | `<prefix>Updates-<doel>[-<klasse>]` | `[Baseline] - Updates-Ring3-Physical` |
| Klasse-achtervoegsel | `-Physical`, `-AVD` — altijd achteraan | `[Baseline] - Baseline-Pilot-Physical` |
| Groepspakket | `<prefix>Baseline-<groepsnaam>` | `[Baseline] - Baseline-SEC-Cloud-PC` |
| CIPP-baseline | `<prefix><Onderwerp>` | `[Baseline] - Windows Updates` |
| Toewijzingsfilter | `<PLATFORM> - <Naam>`, **zonder** prefix | `WIN - Physical`, `AND - Corporate` |
| Filterbestand | `<PLATFORM>-<Naam met ->.json` in `<PLATFORM>/AssignmentFilters/` | `WIN-Physical.json` |
| Entra-groep | `SEC-<Doel-in-woorden>` met koppeltekens | `SEC-Baseline-Pilot`, `SEC-AVD-Session-Hosts` |
| CIPP custom variable | PascalCase, tussen `%` in het template | `%SecurityAlertMail%`, `%FSLogixStorageAccount%` |
| Placeholder in git | `<WAT>-INVULLEN`, in `local/` ingevuld | `DEDICATED-INSCHRIJFPROFIEL-INVULLEN` |

`<prefix>` is `[Baseline] - ` uit [`_organisation.json`](../IntuneTemplate/_organisation.json) en
wordt met `set-organisation.js` omgezet. Filters dragen het voorvoegsel bewust niet: ze zijn een
bouwsteen die ook buiten de baseline gebruikt wordt, en CIPP, `Set-BaselineAssignment.ps1` en de
export zoeken ze letterlijk op naam — een filter hernoemen is dus in de tenant én hier tegelijk.

**Afwijkingen die er al waren** (niet hernoemd, want buiten dit werk; wel om te weten):

- `[Baseline] - Baseline-Wacht` is het enige Nederlandse woord in een pakketnaam; de CIPP-stages
  heten ook Nederlands (`Nu`, `Pilot`, `Wacht op voorwaarde`, en `Melden`/`Blokkeren` bij DLP).
- Het filterbestand `WIN-AVD-Multi-Session.json` heeft een hoofdletter S, de filternaam
  `WIN - AVD Multi-session` niet. Bij de Android-filters komen bestand en naam exact overeen.
- `[Baseline] - Baseline-SEC-Baseline-Pilot` (fase 4, één policy) en `[Baseline] - Baseline-Pilot`
  (fase 2) gaan naar dezelfde groep: twee pakketten voor één doel.
- In groepsnamen staat het platform in merkspelling (`SEC-iOS-BYOD`, `SEC-Remote-Support-macOS`),
  elders als code (`IOS`, `MAC`).
- `[Baseline] Windows Hello For Business` uit de oude set staat niet in `_renames.json` (zie migratie).

## Stappen

### 0. Voorbereiding

- **Rollen**: in de klanttenant Intune Administrator (filters, toewijzingen) en voor de
  Graph-scripts `DeviceManagementConfiguration.ReadWrite.All` en `Group.Read.All`. In CIPP een rol
  die baselines en standards mag beheren.
- **Licenties**: Intune Plan 1 (zit in Business Premium, E3/E5); voor AVD Windows 11 Enterprise
  multi-session via de AVD-rechten; voor de `Defender for Endpoint`-policies Defender for Business
  of P2.
- **CIPP**: de tenant is toegevoegd (GDAP) en de template-repository wijst naar deze repo.
- **Tenantinstellingen** uit [STRUCTUUR.md](STRUCTUUR.md#tenantinstellingen-die-geen-policy-zijn):
  apparaten zonder compliancebeleid niet-compliant, Defender for Endpoint-connector aan.
- **Groepen** die de tenant nodig heeft: `SEC-Baseline-Pilot` (met een handvol fysieke pilotpc's
  en -gebruikers) en de `faseGroep`-groepen die je gebruikt. Zie de
  [BaselineTemplate-README](../BaselineTemplate/README.md#wat-je-erna-zelf-doet).

### 1. Filters aanmaken

**Vóór de eerste CIPP-run.** CIPP zoekt het filter op naam en wijst, als het niet bestaat, toe
**zonder** filter met alleen een waarschuwing in het logboek — dan landen BitLocker en Windows
Hello ook op de sessiehosts.

```powershell
.\scripts\Set-BaselineAssignment.ps1 -AllDevices -Doelgroep fysiek,avd -CreateFilters -WhatIf
```

maakt alleen ontbrekende filters aan uit de JSON-bodies (zonder `-WhatIf` ook echt) en toont wat
het zou toewijzen; je kunt na het aanmaken stoppen en de toewijzing aan CIPP laten. Of met Graph:
`POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters` met de inhoud van het
bestand. Of in de portal: Tenantbeheer → Filters → Maken → Beheerde apparaten → Windows 10 en later.

Controleer daarna elk filter met **Preview devices**: `WIN - Physical` toont de laptops en
workstations en geen sessiehost of Cloud PC; `WIN - AVD Multi-session` alleen de sessiehosts.

### 2. CIPP custom variable (alleen met AVD)

In CIPP: Settings → Custom Variables → voor deze tenant `FSLogixStorageAccount` = de naam van het
opslagaccount (zonder `.file.core.windows.net`). CIPP vervangt `%FSLogixStorageAccount%` in
`AVD FSLogix Profile Containers` en `AVD Defender FSLogix Exclusions` bij elke uitrol. **Zonder de
variabele** blijft het token letterlijk in het pad staan, en met `PreventLoginWithFailure` kan dan
niemand op de host aanmelden. Een tenant zonder AVD heeft de variabele niet nodig: de policies
landen alleen op multi-session-hosts.

### 3. Templates en baseline in CIPP

1. Templates synchroniseren: de repo-koppeling haalt `IntuneTemplate/` op. Controleer onder
   Tenant Administration → Templates dat de pakketten met `-Physical` en `-AVD` er staan.
2. Baselines importeren: **Tools → Community Repos → deze repo → `BaselineTemplate/Baseline.json`
   → Import**, en net zo `Windows-Updates.json`. De automatische sync doet dat niet. Een her-import
   werkt een bestaande baseline bij.
3. Controleer in de baseline-editor dat `Baseline-Devices-Physical`, `-Users-Physical` en
   `-Devices-AVD` in stage 1 staan en `Baseline-Pilot-Physical` in stage 2, elk met hun filter en
   *Include*.

### 4. Stage 1 toewijzen

Wijs de baseline (en `[Baseline] - Windows Updates`) toe aan de tenant. Stage 1 rolt meteen uit:
de gezamenlijke pakketten, de klassepakketten en de groepspakketten. `remediate` staat aan, en
`verifyAssignments` controleert bij elke run ook het filter.

### 5. Controleren

Per apparaat in Intune (Apparaten → het apparaat → Apparaatconfiguratie):

- elke policy *Succeeded* of *Not applicable*, **geen *Conflict***;
- een fysieke pc heeft de `-Physical`-policies (BitLocker, Windows Hello, Storage Sense) en geen
  `AVD …`-policies; een sessiehost omgekeerd;
- onder *Compliance* compliant, en in Entra ID ook.

Een policy toont per toewijzing het filter en het resultaat (*Filter evaluation*). `check-scope.js`
heeft vooraf al gecontroleerd dat er per klasse niets botst (zie
[AVD.md](AVD.md#conflictcontrole-per-klasse)); een Conflict in de tenant komt dus van iets buiten
de baseline, meestal een oude policy.

### 6. Stage 2: de pilot

CIPP schuift door naar stage 2 als alles uit stage 1 compliant is **en** er twee weken voorbij
zijn. `Baseline-Pilot` en `Baseline-Pilot-Physical` gaan dan naar `SEC-Baseline-Pilot`. Laat de
pilot groeien via de groep, niet met een extra stage.

### 7. Stage 3 met de hand

`Baseline-Wacht` wordt niet toegewezen: die policies wachten op iets dat CIPP niet meet
(eerste telefooninschrijving, een collector, een tenant-id). Zet de stage door als de voorwaarde er
is; per policy staat de voorwaarde in `faseWaarom` en in
[COMPLIANCE.md](COMPLIANCE.md#organisatiekeuzes-en-restrisicos).

## Migratie vanaf een oude set

Voorbeeld: de testtenant `kanon` heeft de oude `[Baseline] X`-policies (bijv. `[Baseline] Bitlocker`)
op *Alle apparaten* zonder filter, met met de hand gezette exclude-filters
`WIN - AVD Multi-session` op Bitlocker, Device Lock, Windows Hello For Business, `Windows 11 Update`
en Office Updates.

1. **Hernoemen in plaats van ernaast zetten.** `.\scripts\Rename-BaselinePolicy.ps1 -WhatIf`, dan
   zonder. Het script zoekt elke `previousNames` uit [`_renames.json`](../IntuneTemplate/_renames.json)
   en zet de huidige naam (PATCH: id en toewijzingen blijven). `replace` en `retire` meldt het
   alleen. Bijvoorbeeld `[Baseline] Office Updates` is `replace` (ADMX → Settings Catalog): de oude
   moet weg nadat de nieuwe er staat. `[Baseline] Windows Hello For Business` staat niet in
   `_renames.json`; zoek met de hand uit welke nieuwe policy hem vervangt.
2. **Filters aanmaken** (stap 1) en de **baseline toewijzen** (stap 4). CIPP vindt de hernoemde
   policies op naam terug, zet de inhoud gelijk en vervangt de toewijzing door die van het pakket:
   `verifyAssignments` beheert de toewijzing, dus de oude toewijzing *Alle apparaten zonder filter*
   wordt *Alle apparaten met include `WIN - Physical`*.
3. **Handmatige exclude-filters opruimen.** Op de hernoemde policies verdwijnen ze bij stap 2
   vanzelf (CIPP vervangt de toewijzing). Op oude policies die niet hernoemd zijn (`replace`,
   `retire`, of niet in `_renames.json`) staan ze nog: zet die policies uit (toewijzing weg), en
   verwijder ze pas als de nieuwe per apparaat *Succeeded* tonen.
4. **Zonder CIPP**: `Set-BaselineAssignment.ps1 -AllDevices -Replace -WhatIf` en
   `-AllUsers -Replace -WhatIf`. `-Replace` vervangt álle toewijzingen van een policy — ook
   groepen en uitsluitingen; zonder `-Replace` blijft de oude toewijzing zonder filter staan en
   waarschuwt het script.

## AVD-specifiek

Zie [AVD.md](AVD.md) voor de indeling per policy, de FSLogix-aanpak en het uitrolplan. In het kort:

- **Compliance ook op het apparaat.** Gebruikersgerichte compliance werkt niet op multi-session;
  wijs de compliancepolicies die multi-session ondersteunt óók toe aan `SEC-AVD-Session-Hosts`.
  CIPP beheert de toewijzing van `Baseline-Users` en haalt zo'n extra toewijzing bij een run weer
  weg — controleer dat na elke run tot dit in de pijplijn zit (open punt in AVD.md).
- **Sync forceren op een multi-session-host**: `deviceenroller.exe /o <enrollment-ID> /c /b`
  (het enrollment-ID staat onder `HKLM\SOFTWARE\Microsoft\Enrollments`). De geplande taak
  *PushLaunch* bestaat daar niet.
- **FSLogix: Intune én het hostscript.** Het hostscript `configure-fslogix.ps1` zet de waarden bij
  de deploy, zodat de eerste aanmelding goed gaat voordat Intune de host bereikt; de Intune-policy
  houdt ze daarna vast. Beide schrijven dezelfde registerwaarden.
- **Hostpool voor externen**: `AVD Session Host` en `Cloud PC External Access` botsen daar op twee
  sessielimieten — open punt in AVD.md.

## Controlelijst

- [ ] Filters `WIN - Physical` en `WIN - AVD Multi-session` bestaan, naam letterlijk, *Preview* klopt.
- [ ] Bij AVD: custom variable `FSLogixStorageAccount` gezet voor deze tenant.
- [ ] Groepen `SEC-Baseline-Pilot` en de gebruikte `faseGroep`-groepen bestaan; bij AVD ook `SEC-AVD-Session-Hosts`.
- [ ] Tenantinstellingen: niet-compliant zonder beleid, Defender-connector aan.
- [ ] `Baseline.json` en `Windows-Updates.json` geïmporteerd met de knop, tenant toegewezen.
- [ ] Oude policies hernoemd (`Rename-BaselinePolicy.ps1`), `replace`/`retire` met de hand afgehandeld.
- [ ] Per klasse één apparaat nagelopen: geen Conflict, compliant.
- [ ] Bij AVD: compliance-apparaattoewijzing staat, aanmelden met passkey zonder prompt, FSLogix koppelt.
- [ ] Na twee weken: stage 2 actief, pilotapparaten nagelopen.

## Probleemoplossing

| Symptoom | Oorzaak | Wat te doen |
|---|---|---|
| *Conflict* op een instelling | twee policies zetten hem anders op hetzelfde apparaat — bijna altijd een oude policy naast de nieuwe | De instelling openen in Intune toont beide policies. Oude policy uitzetten; bij twee baseline-policies is `check-scope.js` lek: melden. |
| *Not applicable* op een sessiehost | Device Configuration-templates en een deel van compliance werken niet op multi-session | Verwacht voor de policies in AVD.md; alleen een probleem bij een Settings Catalog-policy. |
| Fysieke policy op een sessiehost, of een AVD-policy nergens | filter bestond niet bij de CIPP-run (CIPP wijst dan toe zonder filter) of de naam wijkt af | CIPP-logboek op *No assignment filter found*; filter met de exacte naam aanmaken, baseline opnieuw draaien. |
| Filter matcht niet wat je verwacht | regel of apparaateigenschap anders dan gedacht (model, SKU) | *Preview devices* op het filter; per apparaat het tabblad *Filter evaluation*. |
| Een met de hand gezet filter of extra groep verdwijnt | CIPP `verifyAssignments` beheert de toewijzing van het pakket en zet hem terug | Dat is de bedoeling: wijzig het pakket in de repo (doelgroep, fase) in plaats van de tenant. |
| Sessiehost meldt zich niet bij Intune | geen PushLaunch op multi-session | `deviceenroller.exe /o <enrollment-ID> /c /b` op de host. |
| Niemand kan aanmelden op een AVD-host | `%FSLogixStorageAccount%` niet vervangen, share onbereikbaar of Kerberos-ticket mislukt | Variabele in CIPP controleren; `klist`, `frx list-redirects`; de app van het opslagaccount uitgesloten van MFA. |
