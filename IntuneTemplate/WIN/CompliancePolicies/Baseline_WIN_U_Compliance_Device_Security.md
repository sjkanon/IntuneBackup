<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Compliance Device Security

Toetst de beveiligingsstand van het apparaat: firewall, antivirus en beveiligingsonderdelen die aan horen te staan.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | All Users |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline Windows v3.8 — Compliance - U - Device Security |
| Bestand | [`Baseline_WIN_U_Compliance_Device_Security.json`](Baseline_WIN_U_Compliance_Device_Security.json) |

## Eigenschappen — 42

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
| `activeFirewallRequired` | true |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `signatureOutOfDate` | false |
| `rtpEnabled` | false |
| `antivirusRequired` | true |
| `antiSpywareRequired` | true |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `configurationManagerComplianceRequired` | false |
| `tpmRequired` | true |
| `deviceCompliancePolicyScript` | — |
| `validOperatingSystemBuildRanges` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 6 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
