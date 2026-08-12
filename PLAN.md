# Plan: baseline herstructureren naar `[Baseline] - D/U - Item`

Doel: de 24 bestaande policies omzetten naar een expliciete device/user-scheiding, de
grootste gaten t.o.v. OpenIntuneBaseline / CIS dichten, en een aparte tenant-laag
(ScubaGear / Maester) opzetten — zonder de bestaande checkId's te breken.

Status: **fase 1 is uitgevoerd**, fase 2 en verder staan nog open.

De twee stukken hieronder — naamgeving en diagnose — zijn context, geen werk. Het werk begint
bij fase 1.

---

## Naamgeving

**Policynaam in de tenant** (`Displayname` in het CIPP-template):

```
[Baseline] - D - <Item>      device-scoped
[Baseline] - U - <Item>      user-scoped
```

**Bestandsnaam** in `IntuneTemplate/`:

```
Baseline_D_<Item>.json
Baseline_U_<Item>.json
```

De prefix `Baseline_` blijft verplicht: `generate-baseline.js`, `export-intunebackup.js`
en `Set-BaselineAssignment.ps1` filteren er alle drie op (`startsWith("Baseline_")` /
`-Filter 'Baseline_*.json'`). Een bestand dat die prefix verliest verdwijnt stilzwijgend uit
alle drie de pijplijnen.

### Wanneer D en wanneer U

Bepalend is de prefix van de `settingDefinitionId`, niet het onderwerp:

| Prefix | Scope | Assignment |
|---|---|---|
| `user_...` | U | gebruikersgroep / All Users |
| al het overige (`device_...`, `vendor_msft_...`) | D | apparaatgroep / All Devices |

**Eén policy bevat nooit beide.** Dat is de hele reden voor deze exercitie: een policy met
gemengde scope kun je niet eenduidig toewijzen, en bij troubleshooting zie je niet of een
setting niet aankomt omdat het apparaat of omdat de gebruiker buiten scope valt.

Controle vóór elke commit:

```bash
node scripts/check-scope.js
```

---

## Diagnose: wat er nu mis is

Alle 24 policies staan in `IntuneTemplate/_assignments.json` op
`allDevicesAssignmentTarget`. Drie daarvan kloppen niet:

| Policy | Device-settings | User-settings | Probleem |
|---|---|---|---|
| `[Baseline] Automatic configuration of Outlook` | 0 | 1 | volledig user-scoped, toegewezen aan All Devices |
| `[Baseline] Onedrive Silent Login` | 3 | 3 | gemengd |
| `[Baseline] Administrative Templates` | 300 | 2 | 2 verdwaalde user-settings |

De 2 verdwaalde settings in Administrative Templates:
`admx_wpn_nolockscreentoastnotification` en `internetexplorer_allowautocomplete`.

De 3 user-settings in OneDrive Silent Login:
`onedrivengscv6~...~disablefreanimation`, `onedrivengscv2~...~disablefretutorial`,
`onedrivengscv7~...~enableautostart`.

Reproduceerbaar met `node scripts/check-scope.js --report`.

---

## Fase 1 — Scriptwijzigingen ✅ gedaan

Dit moest af zijn *voordat* er één bestand hernoemd wordt, anders veroorzaakt de rename
checkId-churn en stille assignment-verliezen. Uitgevoerd; `baseline/intune/baseline-v1.0.json`
en `export/IntuneBackupAndRestore/` zijn na deze wijzigingen byte-identiek gebleven — de
refactor is vandaag bewust een no-op.

### 1a. `generate-baseline.js` — checkId-slug loskoppelen van de bestandsnaam

Voorheen gold `checkId = INTUNE-BASE-<nr>-<slugToPascalCase(bestandsnaam)>`. Bij hernoemen
verandert de suffix mee. Nieuw: `CHECK_ID_SLUGS` legt de suffix vast per hernoemd bestand, met
`slugToPascalCase` als fallback voor alles wat er niet in staat.

Daarnaast is de onderwerpstag stabiel gemaakt (`tagsFor`): de `D_`/`U_` in de bestandsnaam
telt niet mee voor de tag, anders wordt `bitlocker` ineens `d-bitlocker`. De scope komt als
losse tag `device-scope`/`user-scope` terug, zodat je er wél op kunt filteren.

### 1b. `CHECK_NUMBERS` en `HIGH_SEVERITY_FILES` omsleutelen

Beide zijn op bestandsnaam gesleuteld. Nummers blijven identiek, alleen de sleutel wijzigt.

Omdat fase 1 vóór fase 2 landt, staan **oude en nieuwe sleutel er tijdelijk allebei in**: een
bestand moet tijdens de overgang onder beide namen zijn nummer terugvinden. Een gemiste
sleutel is niet fataal maar wél stil — het script deelt dan een nieuw nummer uit en meldt dat
pas achteraf. Ruim de oude sleutels op zodra fase 2 gemerged is, en controleer dat de run géén
"Nieuwe templates kregen een nummer" meldt voor bestaande policies.

Nummers 31 en 32 zijn alvast gereserveerd voor de twee splitsingen uit fase 2.

### 1c. `export-intunebackup.js` — assignment-verlies hard maken

`assignments[inner.Displayname]` matcht op naam. Na de rename mist elke niet-bijgewerkte
sleutel, en dat telde alleen op in `withoutAssignment`. Nu is een sleutel in
`_assignments.json` die bij geen enkele policy hoort een **fout** (exit 1).

De controle draait vóór `rmDirContents`, niet erna: afbreken mag de bestaande export niet half
gesloopt achterlaten. Daarvoor worden de templates eerst ingelezen en pas daarna weggeschreven.

Geverifieerd door een sleutel tijdelijk te hernoemen: script faalt, `export/` blijft intact.

### 1d. Nieuw: `scripts/check-scope.js`

Faalt (exit 1) bij een template dat zowel device- als user-scoped settings bevat, bij een
bestands- of policynaam die de `D`/`U`-conventie niet volgt, en als de aangekondigde scope niet
overeenkomt met wat er werkelijk in de settings staat. `--report` print alleen het overzicht.

De scope volgt uit de `settingDefinitionId`: alles met prefix `user_` is user-scoped, de rest
device-scoped. Let op de derde vorm die in deze repo voorkomt — Firewall gebruikt ids die met
`vendor_msft_` beginnen, zonder device-prefix. Voor Type `Admin` (ADMX) en `Device` is de scope
niet uit het bestand af te leiden; die worden alleen op naamconventie gecontroleerd.

Staat in `.github/workflows/generate-baseline.yml` als eerste stap, voorlopig met `--report`
zodat CI niet rood staat op de nog openstaande migratie. **Haal `--report` weg bij fase 2.**

### 1e. `Set-BaselineAssignment.ps1` — per-scope toewijzen

`-Scope D|U|Both` toegevoegd (standaard `Both` = ongewijzigd gedrag), filtert de policylijst op
de `- D -`/`- U -` in de naam. Policies die de conventie nog niet volgen vallen daarmee buiten
élk scope-filter; het script waarschuwt daar expliciet over in plaats van ze stil over te
slaan — anders wijs je na een halve migratie ongemerkt de helft van de baseline niet meer toe.
Levert het filter niets op, dan volgt een foutmelding die naar fase 2 verwijst.

```powershell
.\scripts\Set-BaselineAssignment.ps1 -Scope D -AllDevices
.\scripts\Set-BaselineAssignment.ps1 -Scope U -AllUsers
```

---

## Fase 2 — De rename

Splitsen doen we in deze fase **alleen waar de scope gemengd is** — thematisch opknippen
komt in fase 7, zodat de diff van deze fase te reviewen blijft.

| # | Nu | Straks | Scope | checkId blijft |
|---|---|---|---|---|
| 7 | `[Baseline] ASR Default rules` | `[Baseline] - D - Attack Surface Reduction` | D | `007-ASRDefaultRules` |
| 8 | `[Baseline] Administrative Templates` | `[Baseline] - D - Administrative Templates` | D | `008-AdministrativeTemplates` |
| 9 | `[Baseline] Auditing` | `[Baseline] - D - Audit and Event Logging` | D | `009-Auditing` |
| 10 | `[Baseline] Automatic configuration of Outlook` | `[Baseline] - U - Microsoft Outlook` | **U** | `010-AutomaticConfigurationOfOutlook` |
| 11 | `[Baseline] Bitlocker` | `[Baseline] - D - BitLocker` | D | `011-Bitlocker` |
| 12 | `[Baseline] Default AV Policy` | `[Baseline] - D - Defender Antivirus` | D | `012-DefaultAVPolicy` |
| 13 | `[Baseline] Device Lock` | `[Baseline] - D - Device Lock` | D | `013-DeviceLock` |
| 14 | `[Baseline] EDR Configuration` | `[Baseline] - D - Defender for Endpoint EDR` | D | `014-EDRConfiguration` |
| 15 | `[Baseline] Edge Standard search engine - Google` | `[Baseline] - D - Microsoft Edge Search Engine` | D | `015-EdgeStandardSearchEngineGoogle` |
| 16 | `[Baseline] Firewall` | `[Baseline] - D - Windows Firewall` | D | `016-Firewall` |
| 17 | `[Baseline] LanManWorkstation` | `[Baseline] - D - Network Security` | D | `017-LanManWorkstation` |
| 18 | `[Baseline] Local Policies Security Options` | `[Baseline] - D - Local Security Policies` | D | `018-LocalPoliciesSecurityOptions` |
| 19 | `[Baseline] Microsoft App Store` | `[Baseline] - D - Microsoft Store` | D | `019-MicrosoftAppStore` |
| 20 | `[Baseline] Microsoft Edge` | `[Baseline] - D - Microsoft Edge Security` | D | `020-MicrosoftEdge` |
| 21 | `[Baseline] Office Updates` | `[Baseline] - D - Microsoft Office Updates` | D | `021-OfficeUpdates` |
| 22 | `[Baseline] Privacy` | `[Baseline] - D - Location and Privacy` | D | `022-Privacy` |
| 23 | `[Baseline] Search` | `[Baseline] - D - Windows Search` | D | `023-Search` |
| 24 | `[Baseline] Smartscreen` | `[Baseline] - D - SmartScreen` | D | `024-Smartscreen` |
| 25 | `[Baseline] System Services` | `[Baseline] - D - System Services` | D | `025-SystemServices` |
| 26 | `[Baseline] User Rights` | `[Baseline] - D - User Rights` | D | `026-UserRights` |
| 27 | `[Baseline] Windows LAPS Policy` | `[Baseline] - D - Windows LAPS` | D | `027-WindowsLAPSPolicy` |
| 28 | `[Baseline] Onedrive - Known Folder Move` | `[Baseline] - D - Microsoft OneDrive KFM` | D | `028-OnedriveKnownFolderMove` |
| 29 | `[Baseline] Onedrive Silent Login` | `[Baseline] - D - Microsoft OneDrive` | D | `029-OnedriveSilentLogin` |
| 30 | `Windows 11 Update` | `[Baseline] - D - Windows Update Ring 3 Production` | D | *(Type `Device`, geen check)* |

### Nieuwe policies uit de splitsing

| # | Nieuw | Scope | Herkomst |
|---|---|---|---|
| 31 | `[Baseline] - U - Windows User Experience` | U | 2 user-settings uit Administrative Templates |
| 32 | `[Baseline] - U - Microsoft OneDrive` | U | 3 user-settings uit OneDrive Silent Login |

### Bijbehorende `_assignments.json`

| Scope | Target |
|---|---|
| alle `- D -` | `#microsoft.graph.allDevicesAssignmentTarget` |
| alle `- U -` | `#microsoft.graph.allLicensedUsersAssignmentTarget` |

### Afronding van fase 2

- oude sleutels uit `CHECK_NUMBERS` en `HIGH_SEVERITY_FILES` verwijderen
- `--report` weghalen uit de `check-scope`-stap in de workflow
- `node scripts/generate-baseline.js` moet dezelfde checkId's opleveren als vóór de rename

---

## Fase 3 — Tenant-migratie

Dit is het riskante deel. De policies bestaan al ónder hun oude naam in de tenant. Er zijn
twee routes:

**A. Hernoemen (aanbevolen).** PATCH op de bestaande policy, naam wijzigt, id blijft, alle
bestaande assignments en toewijzingsgeschiedenis blijven intact.

Nieuw script `scripts/Rename-BaselinePolicy.ps1`:
- leest de oude→nieuwe naamtabel uit fase 2
- zoekt per policytype (`configurationPolicies`, `groupPolicyConfigurations`,
  `deviceConfigurations`) op de oude naam
- `PATCH` met alleen het naamveld (`name` voor Settings Catalog, `displayName` voor de
  andere twee — dezelfde valkuil als in `Set-BaselineAssignment.ps1`)
- `-WhatIf` verplicht als eerste run

**B. Opnieuw uitrollen.** `Start-IntuneRestoreConfig` maakt policies aan op naam. Onder een
nieuwe naam levert dat **duplicaten** naast de oude op — twee policies met overlappende,
mogelijk conflicterende settings op dezelfde devices. Alleen doen in een lege tenant.

Volgorde bij route A:
1. **Inventariseren** met `Get-BaselinePolicyState.ps1` (zie hieronder) — vóór je iets wijzigt
2. `Rename-BaselinePolicy.ps1 -WhatIf` → controleer dat elke oude naam exact één keer gevonden wordt
3. Hernoemen
4. Splitsingen (#31, #32) apart uitrollen via `Start-IntuneRestoreConfig`
5. De 5 verhuisde user-settings **verwijderen** uit de oude policies — anders staan ze dubbel
6. `Set-BaselineAssignment.ps1 -Scope U -AllUsers`
7. `Set-BaselineAssignment.ps1 -Scope D -AllDevices -WhatIf` → moet "al toegewezen" melden voor alles
8. **Opnieuw inventariseren** — de lijst met wees-policies moet leeg zijn

### Wat als er nog policies met de oude naam in de tenant staan

Dit is het scenario dat de rest van het plan stilzwijgend aannam dat niet gebeurt, en dat is
niet houdbaar: een rename die halverwege stopt, een policy die iemand eerder handmatig
hernoemde, een tweede tenant waar CIPP nog onder de oude naam uitrolde, of route B die
duplicaten maakte. Drie manieren waarop dat misgaat, van vervelend naar gevaarlijk:

**1. Conflicterende settings.** Twee Settings Catalog-policies die dezelfde
`settingDefinitionId` met een verschillende waarde zetten leveren in Intune een *Conflict* op —
de instelling wordt dan door géén van beide toegepast. Zetten ze dezelfde waarde, dan is het
alleen ruis. De splitsing uit fase 2 maakt dit concreet: laat je de 5 verhuisde user-settings
in de oude policy staan, dan staan ze dubbel.

**2. Stille assignment-drift.** `Set-BaselineAssignment.ps1 -Scope D` filtert op de
`- D -`/`- U -` in de naam. Een policy die de conventie niet volgt valt buiten élk scope-filter
en behoudt dus gewoon zijn oude All Devices-toewijzing. Het script waarschuwt daar sinds fase 1
expliciet over — negeer die waarschuwing niet.

**3. Een groene check op de verkeerde policy.** Dit is de gevaarlijkste. De
`settings-catalog-match`-regels matchen **op inhoud, niet op naam** — zie de `why`-tekst in
`generate-baseline.js`: *"ook al kan de policy op naam anders heten"*. Een achtergebleven
`[Baseline] Bitlocker` bevat nog steeds precies de settings van `INTUNE-BASE-011-Bitlocker`,
dus die check blijft groen — ook als `[Baseline] - D - BitLocker` nooit is aangemaakt, of leeg
is, of nergens is toegewezen. Het platform meldt dan niets terwijl de baseline feitelijk niet
meer landt.

Die naam-onafhankelijkheid is bewust en op zichzelf juist (een klant mag zijn policies anders
noemen), maar het betekent dat de baseline-check **geen** vangnet is voor deze migratie. Dat
vangnet moet apart.

### Nieuw: `scripts/Get-BaselinePolicyState.ps1`

Tenant-zijdige tegenhanger van `check-scope.js`. Leest over de drie policytypes heen en meldt:

| Bevinding | Betekenis |
|---|---|
| policy in `IntuneTemplate/` maar niet in de tenant | nog niet uitgerold |
| policy in de tenant onder een **oude** baseline-naam | wees — hernoemen of verwijderen |
| naam komt meer dan één keer voor | duplicaat, waarschijnlijk route B |
| `- D -`-policy met een user-target (of omgekeerd) | scope en assignment lopen uiteen |
| policy zonder enige assignment | rolt nergens uit |
| dezelfde `settingDefinitionId` in twee toegewezen policies | conflictrisico |

Draaien vóór én na fase 3, en daarna periodiek — dit is ook het script dat een tweede tenant
die achterliep aan het licht brengt. Read-only, geen `-WhatIf` nodig.

De lijst met oude namen komt uit de tabel in fase 2; die moet dus in het script (of in een
`_renames.json` naast `_assignments.json`) blijven staan nadat fase 2 gemerged is — anders
weet niemand over een half jaar meer waar `[Baseline] Bitlocker` vandaan kwam.

---

## Fase 4 — Compliance policies

Er zijn er nu **nul**. Zonder compliance policy is "vereis een compliant apparaat" in
Conditional Access betekenisloos. Maar: de huidige pijplijn kan ze niet aan.

Benodigd vóór de policies zelf:
- nieuw CIPP-`Type` (bv. `"Compliance"`) in `generate-baseline.js`
- mapping naar map `Device Compliance Policies` in `export-intunebackup.js`
- de platform-engine heeft geen matcher — checks 001–006 in `EXISTING_RULES` dekken dit
  vandaag generiek af, dus voorlopig **geen** per-policy check genereren (zelfde afweging als
  bij `Type: "Device"`)

Daarna, naar OIB-model:

| # | Policy | Scope |
|---|---|---|
| 33 | `[Baseline] - D - Compliance - Device Health` | D |
| 34 | `[Baseline] - D - Compliance - Device Security` | D |
| 35 | `[Baseline] - D - Compliance - Password` | D |
| 36 | `[Baseline] - D - Compliance - Defender for Endpoint` | D |

---

## Fase 5 — Hardening-gaten

Settings Catalog, past in de huidige pijplijn. Volgorde op impact.

| # | Policy | Scope | Waarom |
|---|---|---|---|
| 37 | `[Baseline] - D - Device Guard, Credential Guard and HVCI` | D | nu 0 settings; grootste enkele hardening-winst, CIS L1 |
| 38 | `[Baseline] - U - Device Guard, Credential Guard and HVCI` | U | user-deel van hetzelfde |
| 39 | `[Baseline] - D - Windows Hello for Business` | D | ontbreekt volledig |
| 40 | `[Baseline] - D - Windows Hello Cloud Kerberos Trust` | D | |
| 41 | `[Baseline] - D - Local Administrators` | D | LAPS zonder beheerde admin-groep is half werk |
| 42 | `[Baseline] - D - Microsoft Office Security` | D | macro-blokkade, CIS-kernitem |
| 43 | `[Baseline] - U - Microsoft Office Security` | U | |
| 44 | `[Baseline] - D - Microsoft Edge Updates` | D | |
| 45 | `[Baseline] - U - Microsoft Edge Extensions` | U | |
| 46 | `[Baseline] - U - Microsoft Edge Password Management` | U | |
| 47 | `[Baseline] - U - Microsoft Edge Profiles and Sync` | U | |
| 48 | `[Baseline] - D - Disable NTLM` | D | |
| 49 | `[Baseline] - D - Script File Associations` | D | |
| 50 | `[Baseline] - D - Enhanced Phishing Protection` | D | samenvoegen met #24 overwegen |
| 51 | `[Baseline] - D - Config Refresh` | D | |
| 52 | `[Baseline] - D - Administrator Protection` | D | Windows 11 24H2+ |
| 53 | `[Baseline] - D - In-Box App Removal` | D | |
| 54 | `[Baseline] - D - Delivery Optimisation` | D | |
| 55 | `[Baseline] - U - Personal Data Encryption` | U | |
| 56 | `[Baseline] - U - Windows Sandbox` | U | |
| 57 | `[Baseline] - D - Windows Subsystem for Linux` | D | |
| 58 | `[Baseline] - D - Windows Package Manager` | D | |
| 59 | `[Baseline] - D - Microsoft Accounts` | D | |
| 60 | `[Baseline] - U - Microsoft Store` | U | user-tegenhanger van #19 |

---

## Fase 6 — Update-ringen

`Type: "Device"` (`windowsUpdateForBusinessConfiguration`) — past al in de pijplijn, levert
geen check op. #30 wordt Ring 3; daarnaast:

| # | Policy |
|---|---|
| 61 | `[Baseline] - D - Windows Update Ring 1 Pilot` |
| 62 | `[Baseline] - D - Windows Update Ring 2 UAT` |

Defender AV update-ringen (3) zijn Settings Catalog en passen wel gewoon.
**Driver update profiles** (`windowsDriverUpdateProfiles`) worden door
IntuneBackupAndRestore 4.0.1 niet ondersteund — buiten scope, handmatig of via CIPP.

---

## Fase 7 — Administrative Templates thematisch opsplitsen (optioneel)

`[Baseline] - D - Administrative Templates` is met 300 settings een blok waarin niemand meer
iets terugvindt. OIB splitst dit in losse policies. Voorgestelde opdeling:

| Nieuw | Settings uit Administrative Templates |
|---|---|
| `[Baseline] - D - Internet Explorer Legacy` | `internetexplorer_*` (208) |
| `[Baseline] - D - Printing` | `printers_*` (13) |
| `[Baseline] - D - Remote Desktop and RPC` | `remotedesktopservices_*`, `remoteprocedurecall_*`, `remotemanagement_*`, `remoteassistance_*` (15) |
| `[Baseline] - D - Security Hardening` | `mssecurityguide_*`, `msslegacy_*`, `connectivity_*`, `system_*`, `autoplay_*`, `fileexplorer_*`, `credentials*`, `localsecurityauthority_*`, `appruntime_*` (rest) |
| `[Baseline] - D - Audit and Event Logging` | `eventlogservice_*`, `windowspowershell_*` → samenvoegen met #9 |

Kosten: dit breekt checkId `008-AdministrativeTemplates` op in vijf nieuwe checks. Doe het
alleen als bewuste stap, met de oude checkId als gedeprecieerd gemarkeerd — niet stilzwijgend.
Daarom ná fase 5, niet ertussendoor.

---

## Fase 8 — Tenant-laag: ScubaGear en Maester

Belangrijk om niet te verwarren met het bovenstaande: **ScubaGear kijkt niet naar Intune
device-policies.** Het toetst tenant-configuratie voor Entra ID, Exchange Online, Defender,
SharePoint/OneDrive, Teams en Power Platform. Maester bundelt EIDSCA, CISA SCuBA,
CIS Microsoft 365 Foundations en ORCA, en heeft daarnaast een handvol Intune-checks
(LAPS, ASR, App Control for Business, Managed Installer).

Aanpak:

- **Aparte baseline, niet mengen.** `baseline/tenant/baseline-v1.0.json` naast
  `baseline/intune/baseline-v1.0.json`. De matchers verschillen fundamenteel (Graph device
  management vs. Entra/Exchange/Teams-API's); één bestand met twee werelden erin levert
  checks op die stil niets testen — dezelfde valkuil als `Type: "Device"` vandaag.
- **Eigen checkId-reeks**, bv. `TENANT-BASE-001-...`, zodat de nummerruimte van
  `INTUNE-BASE-*` ongemoeid blijft.
- Volgorde: eerst ScubaGear draaien voor een nulmeting, dan Maester inrichten als de
  doorlopende controle, dan pas de bevindingen omzetten naar baseline-regels.

De vier Intune-checks van Maester overlappen met deze repo. Die zijn de natuurlijke
koppeling tussen beide lagen — begin daar.

---

## Wat we bewust níét doen

- **AppLocker / WDAC / App Control for Business** — OIB laat dit expliciet weg wegens
  omgevingsafhankelijkheid, en terecht: dit is een project, geen policy. Let op dat Maester
  hier wél op test (fase 8) — die check zal rood staan, dat is een bewuste keuze en hoort als
  uitzondering vastgelegd, niet als openstaande bevinding.
- Afwijkingen van CIS die OIB gemotiveerd maakt (built-in Administrator aan t.b.v. LAPS,
  UAC-promptgedrag t.b.v. helpdesk) — overnemen inclusief motivatie, zie
  `OIBvsCIS-Rationale.csv` in OIB.

---

## Uitvoeringsvolgorde

| Fase | Wat | Risico | Status |
|---|---|---|---|
| 1 | Scripts aanpassen (`CHECK_ID_SLUGS`, `check-scope.js`, `-Scope`, harde assignment-check) | laag, geen tenant-impact | ✅ gedaan |
| 2 | Rename + 2 splitsingen in `IntuneTemplate/` | laag in de repo | open |
| 3 | Tenant-migratie via `Rename-BaselinePolicy.ps1`, met `Get-BaselinePolicyState.ps1` ervoor en erna | **hoog** — eerst `-WhatIf`, eerst in pilot-tenant | open |
| 4 | Compliance policies (pijplijnwerk + 4 policies) | midden | open |
| 5 | Hardening-gaten, te beginnen bij #37 Credential Guard en #39 WHfB | midden | open |
| 6 | Update-ringen | laag | open |
| 7 | Administrative Templates thematisch opsplitsen | midden — breekt een checkId | open |
| 8 | Tenant-laag ScubaGear/Maester | apart traject | open |

Fase 2 en 3 horen in één PR met een `-WhatIf`-log erbij: de repo-rename en de tenant-rename
mogen niet uit elkaar lopen, anders vindt `Set-BaselineAssignment.ps1` niets meer terug.

---

## Bronnen

- [OpenIntuneBaseline — WINDOWS](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/WINDOWS)
- [OIBvsCIS-Rationale.csv](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/blob/main/WINDOWS/OIBvsCIS-Rationale.csv)
- [cisagov/ScubaGear](https://github.com/cisagov/ScubaGear)
- [Maester — CISA-tests](https://maester.dev/docs/tests/cisa/)
- [Maester — CIS-benchmarktests](https://maester.dev/docs/tests/cis/)
