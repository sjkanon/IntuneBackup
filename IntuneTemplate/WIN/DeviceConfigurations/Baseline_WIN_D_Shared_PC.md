<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_PC.en.md) · [Français](Baseline_WIN_D_Shared_PC.fr.md)

# [Baseline] - WIN - D - Shared PC

Zet gedeelde Windows-pc's in Shared PC mode met alleen Entra-accounts: profielen van gebruikers die 30 dagen niet zijn aangemeld of bij minder dan 25% vrije schijfruimte worden opgeruimd, er is geen lokale opslag buiten het profiel en onderhoud draait om 02:00.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| Bron | Eigen baseline — Intune Shared multi-user device (sharedPCConfiguration, SharedPC CSP). OpenIntuneBaseline dekt gedeelde apparaten bewust niet (WINDOWS/README.md). |
| Bestand | [`Baseline_WIN_D_Shared_PC.json`](Baseline_WIN_D_Shared_PC.json) |

> Eigen groep SG-D-UEM-WIN-SharedPC (vast), naast SEC-Shared-Devices: een gedeeld apparaat staat in SEC-Shared-Devices (WHfB Multi User, Wireless Shared Devices) én in precies één van SG-D-UEM-WIN-SharedPC of SG-D-UEM-WIN-SharedPC-Guest. Twee Shared PC-policies op één apparaat leveren in Intune een Conflict op, en dan doet geen van beide iets. Shared PC mode raakt alleen nieuwe aanmeldingen: profielen die er al stonden voordat de policy landde, ruimt het accountbeheer niet altijd op — begin bij voorkeur met een schoon apparaat (Autopilot reset). Het profiel van een gebruiker verdwijnt na 30 dagen inactiviteit of zodra de vrije ruimte onder 25% zakt; boven 50% vrije ruimte blijven profielen staan. Daarom hoort OneDrive met Known Folder Move op deze apparaten aan te staan, anders verdwijnen bestanden mee. `disableEduPolicies` staat op true: de onderwijsinstellingen van Shared PC (o.a. geen Store-apps, geen Cortana) horen hier niet thuis. Combineer met [Baseline] - WIN - D - Windows Hello for Business Disabled en [Baseline] - WIN - D - Security Key Sign-in: op een gedeeld apparaat geen WHfB per gebruiker, wel aanmelden met een sleutel.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.5.16 Identiteitsbeheer<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.6 Centralize Account Management |
| NIST CSF 2.0 | PR.AA-01<br>PR.DS-01<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Eigenschappen — 14

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `enabled` | true |
| `allowedAccounts` | domain |
| `allowLocalStorage` | false |
| `disableAccountManager` | false |
| `disableEduPolicies` | true |
| `disablePowerPolicies` | false |
| `disableSignInOnResume` | false |
| `idleTimeBeforeSleepInSeconds` | 3600 |
| `maintenanceStartTime` | 02:00:00.0000000 |
| `accountManagerPolicy.@odata.type` | #microsoft.graph.sharedPCAccountManagerPolicy |
| `accountManagerPolicy.accountDeletionPolicy` | diskSpaceThresholdOrInactiveThreshold |
| `accountManagerPolicy.cacheAccountsAboveDiskFreePercentage` | 50 |
| `accountManagerPolicy.inactiveThresholdDays` | 30 |
| `accountManagerPolicy.removeAccountsBelowDiskFreePercentage` | 25 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
