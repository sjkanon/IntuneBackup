<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# IntuneTemplate — 138 policies

De bron van deze repo: de afgesproken Intune-policies in CIPP-templateformaat. Alles wat
in `baseline/` en `export/` staat is hieruit afgeleid en wordt gegenereerd.

| Platform | Settings Catalog | ADMX | Device config | Compliance | App Protection | Totaal |
|---|---:|---:|---:|---:|---:|---:|
| [Windows](WIN/README.md) | 98 | 1 | 4 | 4 | – | **107** |
| [macOS](MAC/README.md) | 21 | – | 1 | 3 | – | **25** |
| [iOS/iPadOS](IOS/README.md) | – | – | – | 2 | 1 | **3** |
| [Android](AND/README.md) | – | – | – | 2 | 1 | **3** |
| **Totaal** | **119** | **1** | **5** | **11** | **2** | **138** |

## Indeling

```mermaid
flowchart LR
  T[IntuneTemplate/] --> WIN[WIN/]
  T --> MAC[MAC/]
  T --> IOS[IOS/]
  T --> AND[AND/]
  WIN --> WSC[SettingsCatalog/]
  WIN --> WAT[AdministrativeTemplates/]
  WIN --> WDC[DeviceConfigurations/]
  WIN --> WCP[CompliancePolicies/]
  MAC --> MSC[SettingsCatalog/]
  MAC --> MCP[CompliancePolicies/]
  IOS --> IAP[AppProtection/]
  AND --> AAP[AppProtection/]
```

De map volgt uit de bestandsnaam (platform) en het CIPP-`Type` (policytype) en draagt dus
geen informatie die niet ook in het bestand staat. `check-scope.js` controleert dat elk
bestand op zijn plek staat.

## De drie `_`-bestanden

| Bestand | Wat het vastlegt | Gelezen door |
|---|---|---|
| [`_assignments.json`](_assignments.json) | het toewijzingsdoel per policy | `export-intunebackup.js`, `check-scope.js` |
| [`_manifest.json`](_manifest.json) | welke OIB-policy waar landt, en waarom er afgeweken wordt | `import-oib.js` |
| [`_renames.json`](_renames.json) | hoe policies in de tenant heetten en wat er nu bij hoort | `Rename-BaselinePolicy.ps1`, `check-scope.js` |

Assignments staan bewust niet in het template zelf: CIPP wijst apart toe, maar
IntuneBackupAndRestore heeft ze wél nodig om compleet terug te kunnen zetten.

Ze hebben geen `RowKey` en geen `Displayname`, dus CIPP maakt er bij een repo-sync één
naamloze rij van. Die doet niets — zie de [hoofd-README](../README.md#terugzetten-in-een-tenant).

## Per platform

- [Windows](WIN/README.md) — 107 policies
- [macOS](MAC/README.md) — 25 policies
- [iOS/iPadOS](IOS/README.md) — 3 policies
- [Android](AND/README.md) — 3 policies

Zie de [hoofd-README](../README.md) voor de naamconventie, de controles en hoe je een
nieuwe OpenIntuneBaseline-versie binnenhaalt.
