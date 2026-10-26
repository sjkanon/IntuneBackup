<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_PC_Domain_Guest.en.md) · [Français](Baseline_WIN_D_Shared_PC_Domain_Guest.fr.md)

# [Baseline] - WIN - D - Shared PC Domain and Guest

Shared PC mode zoals [Baseline] - WIN - D - Shared PC, maar met daarnaast een gastaccount: op het aanmeldscherm staat een knop Gast waarmee iemand zonder account een tijdelijke lokale sessie start.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| Bron | Eigen baseline — Intune Shared multi-user device (sharedPCConfiguration, SharedPC CSP), variant van [Baseline] - WIN - D - Shared PC met allowedAccounts guest,domain. |
| Bestand | [`Baseline_WIN_D_Shared_PC_Domain_Guest.json`](Baseline_WIN_D_Shared_PC_Domain_Guest.json) |

> Eigen groep SG-D-UEM-WIN-SharedPC-Guest (vast); zie de toelichting bij [Baseline] - WIN - D - Shared PC voor de indeling in groepen — een apparaat staat in precies één van de twee Shared PC-groepen. Een gast heeft geen Entra-identiteit: Conditional Access, MFA en Intune-compliance gelden niet voor hem, en hij kan niet bij Teams, SharePoint of mail van de organisatie. Daarmee is dit een apparaat voor internet en openbare diensten, niet voor werk. Wat een gast wél kan, is alles wat het apparaat zelf toelaat: zet geen gevoelige gedeelde mappen of printers open die zonder aanmelding bereikbaar zijn. Let op de samenloop met [Baseline] - WIN - D - User Rights: die weigert lokaal aanmelden voor de ingebouwde groep Gasten (*S-1-5-32-546). Microsoft documenteert niet in welke lokale groep het Shared PC-gastaccount landt; test in de pilot of de knop Gast werkt. Werkt hij niet, dan is dat recht de oorzaak en hoort er een tenantspecifieke kopie van User Rights zonder die SID op SEC-Shared-PC-Guest. Ook [Baseline] - WIN - D - Local Security Policies zet het ingebouwde Guest-account uit; dat is een ander account dan de Shared PC-gast en blijft gewoon uit.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Toegangsbeveiliging<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| NIST CSF 2.0 | PR.AA-01<br>PR.DS-01<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Eigenschappen — 14

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `enabled` | true |
| `allowedAccounts` | guest,domain |
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
