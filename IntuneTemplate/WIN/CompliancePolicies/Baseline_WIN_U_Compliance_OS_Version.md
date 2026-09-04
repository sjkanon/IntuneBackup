<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Compliance OS Version

Toetst of het apparaat op een Windows-versie draait die de baseline ook echt kan uitvoeren: minimaal Windows 11 22H2.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | Eigen policy; de ondergrens volgt uit wat de baseline zelf al vereist — Account Lockout vraagt 22H2 met KB5053657 of 24H2, Administrator Protection en Windows Protected Print vragen 24H2 |
| Bestand | [`Baseline_WIN_U_Compliance_OS_Version.json`](Baseline_WIN_U_Compliance_OS_Version.json) |

> **Deze waarde veroudert en moet worden nagelopen.** 10.0.22621 is Windows 11 22H2; verhoog hem zodra de vloot verder is. Dat handmatig bijhouden over alle platformen is precies wat te automatiseren valt — zie de aanpak van Sander Burgerhout, die osMinimumVersion via Graph op een n-1-basislijn zet uit endoflife.date. Zolang dat er niet is: zet het in de agenda bij elke grote OS-release.

## Eigenschappen — 38

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passwordRequired` | false |
| `passwordBlockSimple` | false |
| `passwordRequiredToUnlockFromIdle` | false |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordRequiredType` | deviceDefault |
| `passwordPreviousPasswordBlockCount` | — |
| `requireHealthyDeviceReport` | false |
| `osMinimumVersion` | 10.0.22621 |
| `osMaximumVersion` | — |
| `mobileOsMinimumVersion` | — |
| `mobileOsMaximumVersion` | — |
| `earlyLaunchAntiMalwareDriverEnabled` | false |
| `bitLockerEnabled` | false |
| `secureBootEnabled` | false |
| `codeIntegrityEnabled` | false |
| `storageRequireEncryption` | false |
| `activeFirewallRequired` | false |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `signatureOutOfDate` | false |
| `rtpEnabled` | false |
| `antivirusRequired` | false |
| `antiSpywareRequired` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `configurationManagerComplianceRequired` | false |
| `tpmRequired` | false |
| `deviceCompliancePolicyScript` | — |
| `validOperatingSystemBuildRanges` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 72 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
