<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# macOS — 20 policies

Alle policies heten `[Baseline] - MAC - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 17 |
| `CompliancePolicies/` | 3 |

## Device-scoped (D) — 13

Toewijzen aan apparaatgroepen.

| Policy | Type | Instellingen | checkId | Toewijzing | Bron |
|---|---|---:|---|---|---|
| `Accounts and Login` | Settings Catalog | 5 | `INTUNE-BASE-035-MACDAccountsAndLogin` | All Devices | OIB |
| `Defender Antivirus` | Settings Catalog | 24 | `INTUNE-BASE-036-MACDDefenderAntivirus` | All Devices | OIB |
| `Defender for Endpoint` | Settings Catalog | 55 | `INTUNE-BASE-037-MACDDefenderForEndpoint` | All Devices | OIB |
| `FileVault` | Settings Catalog | 5 | `INTUNE-BASE-038-MACDFileVault` | All Devices | OIB |
| `Firewall and Gatekeeper` | Settings Catalog | 7 | `INTUNE-BASE-039-MACDFirewallAndGatekeeper` | All Devices | OIB |
| `Microsoft AutoUpdate` | Settings Catalog | 14 | `INTUNE-BASE-040-MACDMicrosoftAutoUpdate` | All Devices | OIB |
| `Microsoft Edge Password Management` | Settings Catalog | 3 | `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement` | All Devices | OIB |
| `Microsoft Edge Security` | Settings Catalog | 29 | `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity` | All Devices | OIB |
| `Microsoft Office` | Settings Catalog | 5 | `INTUNE-BASE-043-MACDMicrosoftOffice` | All Devices | OIB |
| `Microsoft OneDrive` | Settings Catalog | 14 | `INTUNE-BASE-044-MACDMicrosoftOneDrive` | All Devices | OIB |
| `Platform SSO` | Settings Catalog | 24 | `INTUNE-BASE-045-MACDPlatformSSO` | All Devices | OIB |
| `Restrictions` | Settings Catalog | 37 | `INTUNE-BASE-046-MACDRestrictions` | All Devices | OIB |
| `Software Updates` | Settings Catalog | 7 | `INTUNE-BASE-047-MACDSoftwareUpdates` | All Devices | OIB |

## User-scoped (U) — 7

Toewijzen aan gebruikersgroepen.

| Policy | Type | Instellingen | checkId | Toewijzing | Bron |
|---|---|---:|---|---|---|
| `Compliance Device Health` | Compliance | — | — | All Users | OIB |
| `Compliance Device Security` | Compliance | — | — | All Users | OIB |
| `Compliance Password` | Compliance | — | — | All Users | OIB |
| `Microsoft Edge Extensions` | Settings Catalog | 4 | `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions` | All Users | OIB |
| `Microsoft Edge Profiles and Sync` | Settings Catalog | 4 | `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync` | All Users | OIB |
| `Microsoft Edge Updates` | Settings Catalog | 5 | `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates` | All Users | OIB |
| `Microsoft OneDrive KFM` | Settings Catalog | 15 | `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM` | All Users | OIB |

---

Kolom **Bron**: `OIB` komt uit [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) via
[`_oib-manifest.json`](../_oib-manifest.json); `eigen` staat alleen in deze baseline.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
