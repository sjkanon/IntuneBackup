<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Compliance Password

Toetst of het apparaat een wachtwoord of PIN vereist en hoe sterk die moet zijn.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | All Users |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline Windows v3.8 — Compliance - U - Password |
| Bestand | [`Baseline_WIN_U_Compliance_Password.json`](Baseline_WIN_U_Compliance_Password.json) |

## Eigenschappen — 42

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passwordRequired` | true |
| `passwordBlockSimple` | true |
| `passwordRequiredToUnlockFromIdle` | false |
| `passwordMinutesOfInactivityBeforeLock` | 15 |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | 8 |
| `passwordMinimumCharacterSetCount` | — |
| `passwordRequiredType` | numeric |
| `passwordPreviousPasswordBlockCount` | — |
| `requireHealthyDeviceReport` | false |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `mobileOsMinimumVersion` | — |
| `mobileOsMaximumVersion` | — |
| `earlyLaunchAntiMalwareDriverEnabled` | false |
| `bitLockerEnabled` | false |
| `secureBootEnabled` | false |
| `codeIntegrityEnabled` | false |
| `memoryIntegrityEnabled` | false |
| `kernelDmaProtectionEnabled` | false |
| `virtualizationBasedSecurityEnabled` | false |
| `firmwareProtectionEnabled` | false |
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
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 0 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
