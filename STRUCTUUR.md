# Structuur en koppelingen

Hoe deze repo in elkaar zit en waar hij aan vastzit: welke bronnen hem voeden, wat eruit wordt
gegenereerd, welke systemen het lezen en hoe het in een tenant belandt. Voor het *wat* per policy:
[OVERZICHT.md](OVERZICHT.md). Voor de normen: [COMPLIANCE.md](COMPLIANCE.md).

## In het kort

- **Eén bron:** `IntuneTemplate/` — 197 policies in CIPP-templateformaat, over Windows (132),
  macOS (37), iOS/iPadOS (14) en Android (14).
- **Drie bronnen erin:** OpenIntuneBaseline (94 policies), IntuneAdmin/IntuneBaselines (22) en
  eigen werk (81).
- **Drie afgeleiden eruit:** baseline-checks voor het TEST Policies Platform, een restore-export
  voor IntuneBackupAndRestore en de CIPP-baseline. CIPP leest de templates zelf rechtstreeks.
- **Twee wegen naar de tenant:** CIPP of de PowerShell-module IntuneBackupAndRestore. Toewijzen
  en hernoemen gaat met eigen scripts via Microsoft Graph.
- **Alles wat gegenereerd is, wordt niet met de hand bewerkt.** Een GitHub-workflow regenereert
  het na elke wijziging in `IntuneTemplate/` en opent daar een PR voor.

## Samenhang

```mermaid
flowchart LR
  OIB["OpenIntuneBaseline<br/>Win v4.0 · macOS v1.0 · BYOD"] -->|import-oib.js| T
  IA["IntuneAdmin<br/>IntuneBaselines"] -->|import-intuneadmin.js| T
  BK["Tenant-backup<br/>IntuneBackupAndRestore"] -->|import-intunebackup.js| T

  T["<b>IntuneTemplate/</b><br/>197 policies · _manifest.json"]

  T -->|generate-baseline.js| BL["baseline/intune/<br/>baseline-v1.0.json"]
  T -->|export-intunebackup.js| EX["export/NativeImport/<br/>IntuneBackupAndRestore/"]
  T -->|generate-baseline-template.js| BT["BaselineTemplate/<br/>Baseline.json"]
  T -->|generate-docs.js<br/>generate-compliance.js| DOC["OVERZICHT · COMPLIANCE<br/>README's"]
  CA["CA-Policies-repo<br/>ca-controls.json"] -.->|--ca| DOC

  T -.->|sync| CIPP["CIPP"]
  BT -.->|Community Repos → Import| CIPP
  BL --> PLAT["TEST Policies Platform"]
  EX -->|Start-IntuneRestoreConfig| TEN[("Intune-tenant")]
  CIPP -->|baseline-stages| TEN
  T -->|Set-BaselineAssignment.ps1<br/>Rename-BaselinePolicy.ps1| TEN
  PLAT -.->|toetst| TEN

  style T stroke-width:3px
```

Doorgetrokken pijlen schrijven; stippellijnen lezen alleen.

## Mappen

| Map | Wat erin staat | Gemaakt door | Opgepikt door |
|---|---|---|---|
| [`IntuneTemplate/`](IntuneTemplate/README.md) | De policies, per platform en policytype, plus de `_`-bestanden die ze sturen | hand + import-scripts | alle scripts, CIPP |
| [`baseline/intune/`](baseline/README.md) | `baseline-v1.0.json`: 162 checks | `generate-baseline.js` | TEST Policies Platform |
| [`export/NativeImport/`](export/README.md) | Restore-formaat, met assignments | `export-intunebackup.js` | IntuneBackupAndRestore |
| [`BaselineTemplate/`](BaselineTemplate/README.md) | De CIPP-baseline: pakketten per stage | `generate-baseline-template.js` | CIPP (handmatige import) |
| [`StandardsTemplateV2/`](StandardsTemplateV2/README.md) | CIPP-standards voor tenantinstellingen (MFA-nudge, passkey-migratie) | hand | CIPP |
| [`extras/`](extras/README.md) | Wat geen CIPP-policytype is: inschrijvingsrestricties, app-configuratie, filters, App Control, remediations | hand | niemand automatisch — uitrollen volgens README |
| [`enrollment/macos/`](enrollment/macos/README.md) | ADE-inschrijfprofiel voor Macs | hand | niemand automatisch |
| [`compliance/macos/`](compliance/macos/README.md) | Eigen compliance-check voor Defender op macOS | hand | niemand automatisch |
| [`shellscripts/macos/`](shellscripts/macos/README.md) | Dock, Azure Files-mount, screen recording-nudge | hand | niemand automatisch |
| [`platformscripts/windows/`](platformscripts/windows/README.md) | Azure Files-schijf koppelen | hand | niemand automatisch |
| [`apps/win32/`](apps/win32/remove-mcafee/README.md) | Win32-app die McAfee verwijdert | hand | niemand automatisch |
| [`scripts/`](scripts/README.md) | De pijplijn: import, controle, generatie, tenantscripts | hand | GitHub-workflow |
| `local/` | Uitrolkopieën met ingevulde geheimen en klantrapporten | hand | **niet in git** (`.gitignore`) |

`.oib-source/` en `.intuneadmin-source/` zijn lokale checkouts van de externe bronnen en staan ook
niet in git.

### Binnen `IntuneTemplate/`

```
IntuneTemplate/
  _manifest.json      per policy: doel, herkomst, fase, normen, afwijkingen van de bron
  _assignments.json   toewijzingsdoel per fase-1-policy
  _controls.json      vocabulaire voor ISO 27001, NIS2, CIS en NIST CSF
  _licenties.json     welke controls met een licentie in te vullen zijn
  _renames.json       vroegere namen in de tenant
  WIN/  SettingsCatalog/  AdministrativeTemplates/  DeviceConfigurations/  CompliancePolicies/
  MAC/  SettingsCatalog/  DeviceConfigurations/  CompliancePolicies/
  IOS/  SettingsCatalog/  DeviceConfigurations/  CompliancePolicies/  AppProtection/
  AND/  SettingsCatalog/  DeviceConfigurations/  CompliancePolicies/  AppProtection/
```

Naast elk `.json`-template staat een gegenereerde `.md` met élke instelling die hij zet.

## De bestanden die alles sturen

| Bestand | Bepaalt | Gelezen door |
|---|---|---|
| `_manifest.json` | Per policy: `doel`, `herkomst` (oib · intuneadmin · eigen), `fase` + `faseWaarom`, `controls`, `overrides` op de bron, uitgesloten bronpolicies | alle Node-scripts behalve `check-osversion.js`, `Set-BaselineAssignment.ps1` |
| `_assignments.json` | Naar wie een fase-1-policy gaat (alle apparaten, alle gebruikers) | `set-packages.js`, `check-scope.js`, `export-intunebackup.js`, de generatiescripts, `Set-BaselineAssignment.ps1` |
| `_controls.json` | Welke normlabels bestaan en wat ze betekenen | `generate-compliance.js`, `generate-docs.js`, `check-scope.js` |
| `_licenties.json` | Welke lege controls met een SKU op te lossen zijn in plaats van met een proces | `generate-compliance.js` |
| `_renames.json` | Hoe policies in de tenant heetten: `rename`, `replace` of `retire` | `Rename-BaselinePolicy.ps1`, `check-scope.js`, `generate-docs.js` |
| `Package` (veld in elk template) | In welk CIPP-pakket de policy uitrolt | CIPP, bewaakt door `check-scope.js` |

## Fases en CIPP-pakketten

De fase in `_manifest.json` bepaalt of en hoe een policy uitrolt. `set-packages.js` vertaalt die
naar het CIPP-pakket; `check-scope.js` bewaakt dat fase, toewijzing en pakket kloppen.

| Fase | Betekenis | Policies | CIPP-pakket | CIPP-stage |
|---:|---|---:|---|---:|
| 1 | Nu uitrollen | 101 | `Baseline-Devices`, `Baseline-Users`, `Baseline-ADE-token` | 1 |
| 2 | Eerst pilot | 39 | `Baseline-Pilot` → groep `SEC-Baseline-Pilot` | 2 |
| 3 | Wacht op voorwaarde (bijv. eerste inschrijving) | 26 | `Baseline-Wacht`, niet toegewezen | 3 |
| 4 | Eigen groep (`faseGroep`) | 16 | `Baseline-SEC-<groep>` | 1 |
| 5 | Niet uitrollen — alternatief voor een andere policy | 15 | geen | – |

Doorschuiven naar stage 2 gebeurt als alles uit stage 1 compliant is **en** er twee weken voorbij
zijn. Stage 3 zet iemand met de hand door.

## Scripts en volgorde

| Stap | Script | Leest | Schrijft |
|---:|---|---|---|
| – | `import-oib.js` | `.oib-source/`, `_manifest.json` | `IntuneTemplate/` |
| – | `import-intuneadmin.js` | `.intuneadmin-source/`, `_manifest.json` | `IntuneTemplate/` |
| – | `import-intunebackup.js` | een tenant-backup | `IntuneTemplate/` |
| 1 | `set-packages.js` | `_manifest.json`, `_assignments.json` | `Package` in elk template |
| 2 | `check-scope.js` | alles in `IntuneTemplate/` | niets — faalt bij fouten |
| 3 | `generate-baseline.js` | `IntuneTemplate/` | `baseline/intune/baseline-v1.0.json` |
| 4 | `export-intunebackup.js` | `IntuneTemplate/`, `_assignments.json` | `export/NativeImport/…` |
| 5 | `generate-baseline-template.js` | `_manifest.json`, `_assignments.json` | `BaselineTemplate/Baseline.json` |
| 6 | `generate-docs.js` | `IntuneTemplate/`, baseline | `OVERZICHT.md`, README's, `.md` per policy |
| 7 | `generate-compliance.js` | `_manifest.json`, `_controls.json`, `_licenties.json`, baseline | `COMPLIANCE.md` |
| – | `check-osversion.js` | OS-ondergrenzen, endoflife.date | alleen een rapport |
| – | `Set-BaselineAssignment.ps1` | `_manifest.json`, `_assignments.json` | toewijzingen in de tenant |
| – | `Rename-BaselinePolicy.ps1` | `_renames.json` | policynamen in de tenant |

Stap 1 t/m 7 draait [`.github/workflows/generate-baseline.yml`](.github/workflows/generate-baseline.yml)
na elke wijziging in `IntuneTemplate/`. Alle Node-scripts delen `scripts/lib/templates.js`.
Details: [scripts/README.md](scripts/README.md).

## Externe koppelingen

| Systeem | Richting | Hoe | Let op |
|---|---|---|---|
| [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) | bron → repo | `import-oib.js` op een lokale clone | Windows v4.0 overgenomen van branch op commit `f247604`; opnieuw importeren zodra de tag er is |
| [IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines) | bron → repo | `import-intuneadmin.js` | JSON's in UTF-16LE |
| [CA-Policies](https://github.com/sjkanon/CA-Policies) | repo ← CA | `generate-compliance.js --ca ../CA-Policies/controls/ca-controls.json` | Git bevat de `--no-ca`-versie; CI ziet de andere repo niet |
| CIPP | repo → CIPP | template-repository-sync op deze repo | `BaselineTemplate/Baseline.json` komt alleen mee via Tools → Community Repos → Import |
| TEST Policies Platform | repo → platform | haalt `baseline/intune/baseline-v1.0.json` op | pad niet verplaatsen |
| [IntuneBackupAndRestore](https://github.com/jseerden/IntuneBackupAndRestore) | repo → tenant | `Start-IntuneRestoreConfig` en `…Assignments` met `-RestoreById $false` | App Protection-assignments apart terugzetten |
| Microsoft Graph | repo → tenant | `Set-BaselineAssignment.ps1`, `Rename-BaselinePolicy.ps1` | eerst `-WhatIf` |
| endoflife.date | bron → rapport | `check-osversion.js` | faalt nooit, alleen signaal |
| GitHub Actions | repo → repo | `generate-baseline.yml` opent een PR | de enige workflow |

### Twee dingen die CIPP anders doet dan je verwacht

- **`NativeImport` in een pad sluit het uit van de sync.** Daarom staat de restore-export onder
  `export/NativeImport/`. Zonder dat woord maakt CIPP van elke policy een tweede template.
- **Elk ander `.json` wordt één naamloze templaterij.** Dat geldt voor de `_`-bestanden, de
  baseline, het ADE-profiel en `extras/`. Die rij doet niets en mag in CIPP weg.

## Tenantinstellingen die geen policy zijn

Zet deze twee vóór het toewijzen, anders doet een deel van de baseline niets:

1. **Apparaten zonder compliancebeleid → Niet-compliant** (Intune → Compliancebeleid →
   Nalevingsbeleidsinstellingen).
2. **Defender for Endpoint-connector** aan (Intune → Endpoint Security → Microsoft Defender for
   Endpoint).

## Afspraken

- **Naamgeving:** `[Baseline] - <WIN|MAC|IOS|AND> - <D|U> - <Item>` in de tenant,
  `Baseline_<PLATFORM>_<D|U>_<Item>.json` als bestand. Zonder `Baseline_`-prefix verdwijnt een
  bestand stil uit alle pijplijnen.
- **D of U:** bij Windows Settings Catalog volgt het uit de `settingDefinitionId` (`user_` = U).
  Elders is het een keuze over het toewijzingsdoel.
- **GUID's blijven gelijk** bij elke import; anders maakt CIPP een tweede template.
- **Afwijken van OpenIntuneBaseline** gaat via `overrides` in `_manifest.json`, met een reden.
- **Geheimen nooit in git.** De repo is publiek; placeholders heten `…-INVULLEN` en worden in
  `local/` ingevuld.
- **Gegenereerd, niet met de hand bewerken:** `baseline/`, `export/`, `BaselineTemplate/Baseline.json`,
  `OVERZICHT.md`, `COMPLIANCE.md`, de README's in `IntuneTemplate/` en de `.md` per policy.

## Verder lezen

| Document | Voor |
|---|---|
| [README.md](README.md) | Volledige uitleg: import, restore, toewijzen, CIPP |
| [OVERZICHT.md](OVERZICHT.md) | Samenvatting om te delen |
| [COMPLIANCE.md](COMPLIANCE.md) | CISO of auditor |
| [ANALYSE.md](ANALYSE.md) | Waarom wat wel en niet in de baseline zit |
| [PLAN.md](PLAN.md) | Wat nog open staat, o.a. de tenant-migratie |
