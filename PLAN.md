# Plan: van 24 eigen policies naar een baseline op OpenIntuneBaseline

Doel: de baseline uitbreiden en actueel houden op basis van
[OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline), met een
expliciete platform- en device/user-scheiding, zonder bestaande checkId's onnodig te breken —
en met een aparte tenant-laag (ScubaGear / Maester) als sluitstuk.

Status: **fase 1, 2, 4, 5, 6 en 7 zijn uitgevoerd** (repo). Fase 3 (de tenant) en fase 8 staan
nog open. De tenant is nog niet aangeraakt.

| Fase | Wat | Risico | Status |
|---|---|---|---|
| 1 | Scriptwijzigingen (`CHECK_ID_SLUGS`, `check-scope.js`, `-Scope`, harde assignment-check) | laag | ✅ |
| 2 | D/U-hernoeming + 2 splitsingen in `IntuneTemplate/` | laag in de repo | ✅ |
| 4 | Compliance-policies (pijplijnwerk + 7 policies) | midden | ✅ |
| 5 | Hardening-gaten dichten uit OIB | midden | ✅ |
| 6 | Update-ringen | laag | ✅ |
| 7 | Administrative Templates thematisch opsplitsen | midden — breekt checkId 008 | ✅ |
| — | macOS, BYOD en de platform-as in de naamgeving | midden | ✅ |
| 3 | **Tenant-migratie** via `Rename-BaselinePolicy.ps1` | **hoog** — eerst `-WhatIf`, eerst in een pilot-tenant | open |
| 8 | Tenant-laag ScubaGear/Maester | apart traject | open |

Fase 3 staat bewust ná de rest: de repo is nu compleet en de tenant kan in één keer bij, in
plaats van twee keer achter elkaar hernoemd worden.

---

## Wat er in de repo gebeurd is

24 → 95 policies. De bron is nu `IntuneTemplate/_oib-manifest.json` plus
`scripts/import-oib.js`; zie [README.md](README.md) voor de indeling, de naamgeving en hoe je
een nieuwe OIB-versie binnenhaalt.

**Fase 1 en 2** (eerder): device/user-scheiding, hernoeming naar `[Baseline] - D/U - Item`,
`check-scope.js` als blokkerende CI-stap, `CHECK_ID_SLUGS` om checkId's een hernoeming te
laten overleven.

**Fase 4 — compliance.** Er waren er nul. Zonder compliance-policy is "vereis een compliant
apparaat" in Conditional Access betekenisloos. Er zijn er nu 7 (4 Windows, 3 macOS), met een
nieuw CIPP-`Type` `deviceCompliancePolicies` en de map `Device Compliance Policies` in de
export. Ze leveren geen eigen check op — de platform-engine heeft er geen matcher voor en de
generieke checks 001–006 dekken het af.

**Fase 5 — hardening.** De hele OIB-Windows-set is overgenomen: Windows Hello for Business,
Cloud Kerberos Trust, Credential/Device Guard, Local Administrators, Office Security (D en U),
de Edge-opsplitsing, Disable NTLM, Administrator Protection, Config Refresh, In-Box App
Removal, Delivery Optimisation, Personal Data Encryption, Windows Sandbox, WSL, Package
Manager, Script File Associations, Timezone en meer. 15 bestaande policies zijn herschreven op
OIB-inhoud; de instellingen die OIB niet kent zijn behouden (zie punt 2 in de README onder
"OpenIntuneBaseline bijwerken").

**Fase 6 — update-ringen.** Ring 1 (Pilot) en Ring 2 (UAT) erbij naast de bestaande Ring 3,
plus de drie Defender-antivirus-updateringen. Ring 1 en 2 staan bewust zonder assignment.
Driver update profiles blijven buiten scope: IntuneBackupAndRestore 4.0.1 ondersteunt ze niet.

**Fase 7 — Administrative Templates opgesplitst.** Het blok van 300 instellingen is opgegaan
in Internet Explorer Legacy (204), Security Hardening (41), Printing (13), Remote Desktop and
RPC (9) en wat kleinere. De 15 instellingen zonder OIB-tegenhanger staan in
`WIN - D - Legacy Hardening`, los gehouden zodat een OIB-upgrade ze niet meesleept of weggooit.
Kosten, zoals voorzien: checkId `008-AdministrativeTemplates` is opgeheven. Vier andere
checkId's zijn dat ook (017, 023, 025, 028) — zie de README.

**Platform-as.** Alle policies heten nu `[Baseline] - <WIN|MAC|IOS|AND> - <D|U> - <Item>` en
staan in `IntuneTemplate/<PLATFORM>/<POLICYTYPE>/`. macOS (20 policies) en BYOD app protection
voor iOS en Android (2) zijn nieuw.

---

## Fase 3 — Tenant-migratie

Dit is het riskante deel. De policies bestaan al ónder hun oude naam in de tenant, en sommige
zijn inhoudelijk vervangen.

`IntuneTemplate/_renames.json` legt per policy vast hoe die heette (zowel de oorspronkelijke
naam als de tussenstap uit fase 2) en wat er nu bij hoort. `scripts/Rename-BaselinePolicy.ps1`
voert dat uit met een `PATCH`: naam wijzigt, id blijft, alle bestaande assignments en
toewijzingsgeschiedenis blijven intact.

**Niet opnieuw uitrollen.** `Start-IntuneRestoreConfig` maakt policies aan op naam. Onder een
nieuwe naam levert dat **duplicaten** naast de oude op — twee policies met overlappende,
mogelijk conflicterende instellingen op dezelfde apparaten. Alleen doen in een lege tenant.

Volgorde:

1. **Inventariseren** met `Get-BaselinePolicyState.ps1` (zie hieronder) — vóór je iets wijzigt.
2. `Rename-BaselinePolicy.ps1 -WhatIf` → controleer dat elke oude naam exact één keer gevonden
   wordt.
3. Hernoemen.
4. De `replace`-gevallen met de hand: `Windows Firewall` (Settings Catalog → Endpoint
   Security-template) en `Microsoft Office Updates` (ADMX → Settings Catalog). Oude weg, nieuwe
   erbij, in die volgorde.
5. De `retire`-gevallen verwijderen: Network Security, Windows Search, System Services,
   OneDrive KFM. `replacedBy` in `_renames.json` zegt waar hun instellingen nu staan.
6. De ~65 nieuwe policies uitrollen via CIPP of `Start-IntuneRestoreConfig`.
7. `Set-BaselineAssignment.ps1 -Scope D -AllDevices` en `-Scope U -AllUsers`, eerst met
   `-WhatIf`. Voor de bestaande policies moet dat "al toegewezen" melden.
8. `Invoke-IntuneRestoreAppProtectionPolicyAssignment` apart aanroepen (zie README).
9. **Opnieuw inventariseren** — de lijst met wees-policies moet leeg zijn.

Zet de policies uit "Wat je eerst in een pilot zet" (README) niet in dezelfde ronde op All
Devices.

### Wat als er nog policies met de oude naam in de tenant staan

Dat scenario is niet theoretisch: een rename die halverwege stopt, een policy die iemand
eerder handmatig hernoemde, een tweede tenant waar CIPP nog onder de oude naam uitrolde. Drie
manieren waarop dat misgaat, van vervelend naar gevaarlijk:

**1. Conflicterende instellingen.** Twee Settings Catalog-policies die dezelfde
`settingDefinitionId` met een verschillende waarde zetten leveren een *Conflict* op — de
instelling wordt dan door géén van beide toegepast. Met 95 policies is dat risico groter dan
met 24; `check-scope.js` controleert het nu binnen de repo, maar niet wat er in de tenant
achterblijft.

**2. Stille assignment-drift.** `Set-BaselineAssignment.ps1 -Scope D` filtert op de naam. Een
policy die de conventie niet volgt valt buiten élk filter en behoudt dus gewoon zijn oude All
Devices-toewijzing. Het script waarschuwt daarover — negeer die waarschuwing niet.

**3. Een groene check op de verkeerde policy.** Dit is de gevaarlijkste. De
`settings-catalog-match`-regels matchen **op inhoud, niet op naam**. Een achtergebleven
`[Baseline] Bitlocker` bevat nog steeds de settings van `INTUNE-BASE-011-Bitlocker`, dus die
check blijft groen — ook als `[Baseline] - WIN - D - BitLocker` nooit is aangemaakt, of leeg
is, of nergens is toegewezen. Het platform meldt dan niets terwijl de baseline feitelijk niet
meer landt.

Die naam-onafhankelijkheid is bewust en op zichzelf juist (een klant mag zijn policies anders
noemen), maar het betekent dat de baseline-check **geen** vangnet is voor deze migratie. Dat
vangnet moet apart.

### Nog te bouwen: `scripts/Get-BaselinePolicyState.ps1`

Tenant-zijdige tegenhanger van `check-scope.js`. Leest over de vijf policytypes heen en meldt:

| Bevinding | Betekenis |
|---|---|
| policy in `IntuneTemplate/` maar niet in de tenant | nog niet uitgerold |
| policy in de tenant onder een naam uit `_renames.json` | wees — hernoemen of verwijderen |
| naam komt meer dan één keer voor | duplicaat |
| `- D -`-policy met een user-target (of omgekeerd) | scope en assignment lopen uiteen |
| policy zonder enige assignment | rolt nergens uit |
| dezelfde `settingDefinitionId` met een andere waarde in twee toegewezen policies | conflict |

Draaien vóór én na fase 3, en daarna periodiek. Read-only, geen `-WhatIf` nodig.

---

## Fase 8 — Tenant-laag: ScubaGear en Maester

Niet verwarren met het bovenstaande: **ScubaGear kijkt niet naar Intune device-policies.** Het
toetst tenant-configuratie voor Entra ID, Exchange Online, Defender, SharePoint/OneDrive,
Teams en Power Platform. Maester bundelt EIDSCA, CISA SCuBA, CIS Microsoft 365 Foundations en
ORCA, en heeft daarnaast een handvol Intune-checks (LAPS, ASR, App Control for Business,
Managed Installer).

Aanpak:

- **Aparte baseline, niet mengen.** `baseline/tenant/baseline-v1.0.json` naast
  `baseline/intune/baseline-v1.0.json`. De matchers verschillen fundamenteel (Graph device
  management vs. Entra/Exchange/Teams-API's); één bestand met twee werelden erin levert checks
  op die stil niets testen — dezelfde valkuil als `Type: "Device"` vandaag.
- **Eigen checkId-reeks**, bv. `TENANT-BASE-001-...`, zodat de nummerruimte van
  `INTUNE-BASE-*` ongemoeid blijft.
- Volgorde: eerst ScubaGear draaien voor een nulmeting, dan Maester inrichten als de
  doorlopende controle, dan pas de bevindingen omzetten naar baseline-regels.

De vier Intune-checks van Maester overlappen met deze repo. Die zijn de natuurlijke koppeling
tussen beide lagen — begin daar.

---

## Wat we bewust níét doen

- **AppLocker / WDAC / App Control for Business** — OIB laat dit expliciet weg wegens
  omgevingsafhankelijkheid, en terecht: dit is een project, geen policy. Let op dat Maester
  hier wél op test (fase 8) — die check zal rood staan, dat is een bewuste keuze en hoort als
  uitzondering vastgelegd, niet als openstaande bevinding.
- **Driver update profiles** — IntuneBackupAndRestore 4.0.1 ondersteunt ze niet. Via CIPP zou
  het kunnen, maar dan lopen de twee restore-routes uiteen.
- **Windows 365** — OIB heeft er policies voor; Cloud PC's zijn hier nog niet in scope.
- Afwijkingen van CIS die OIB gemotiveerd maakt (built-in Administrator aan t.b.v. LAPS,
  UAC-promptgedrag t.b.v. helpdesk) — overgenomen inclusief motivatie, zie
  `OIBvsCIS-Rationale.csv` in OIB.

---

## Bronnen

- [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) — [WINDOWS](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/WINDOWS), [MACOS](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/MACOS), [BYOD](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/BYOD)
- [OIBvsCIS-Rationale.csv](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/blob/main/WINDOWS/OIBvsCIS-Rationale.csv)
- [OIB FAQ — waarom D en U in de naam](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/blob/main/FAQ.md#why-do-policies-have-d-and-u-in-their-name)
- [cisagov/ScubaGear](https://github.com/cisagov/ScubaGear)
- [Maester — CISA-tests](https://maester.dev/docs/tests/cisa/) · [CIS-benchmarktests](https://maester.dev/docs/tests/cis/)
