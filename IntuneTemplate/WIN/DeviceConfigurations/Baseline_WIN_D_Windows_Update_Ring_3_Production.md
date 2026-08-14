<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Update Ring 3 Production

Productiering voor Windows-updates: installeert dagelijks om 13:00 met een uitsteltermijn van twee dagen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | All Devices |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | eigen baseline — tenant-specifieke installatievensters |
| Bestand | [`Baseline_WIN_D_Windows_Update_Ring_3_Production.json`](Baseline_WIN_D_Windows_Update_Ring_3_Production.json) |

## Eigenschappen — 41

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `engagedRestartSnoozeScheduleInDays` | — |
| `featureUpdatesRollbackStartDateTime` | 0001-01-01T00:00:00Z |
| `deviceManagementApplicabilityRuleOsEdition` | — |
| `allowWindows11Upgrade` | true |
| `userWindowsUpdateScanAccess` | enabled |
| `skipChecksBeforeRestart` | false |
| `deviceManagementApplicabilityRuleDeviceMode` | — |
| `deadlineForQualityUpdatesInDays` | 2 |
| `qualityUpdatesPauseExpiryDateTime` | 0001-01-01T00:00:00Z |
| `featureUpdatesDeferralPeriodInDays` | 0 |
| `installationSchedule.scheduledInstallDay` | everyday |
| `installationSchedule.scheduledInstallTime` | 13:00:00.0000000 |
| `installationSchedule.@odata.type` | #microsoft.graph.windowsUpdateScheduledInstall |
| `automaticUpdateMode` | autoInstallAndRebootAtScheduledTime |
| `scheduleRestartWarningInHours` | — |
| `autoRestartNotificationDismissal` | notConfigured |
| `userPauseAccess` | disabled |
| `deadlineForFeatureUpdatesInDays` | 2 |
| `updateWeeks` | everyWeek |
| `engagedRestartDeadlineInDays` | — |
| `driversExcluded` | false |
| `featureUpdatesPauseStartDate` | — |
| `deviceManagementApplicabilityRuleOsVersion` | — |
| `updateNotificationLevel` | restartWarningsOnly |
| `postponeRebootUntilAfterDeadline` | false |
| `featureUpdatesRollbackWindowInDays` | 10 |
| `deliveryOptimizationMode` | userDefined |
| `scheduleImminentRestartWarningInMinutes` | — |
| `prereleaseFeatures` | userDefined |
| `qualityUpdatesRollbackStartDateTime` | 0001-01-01T00:00:00Z |
| `qualityUpdatesDeferralPeriodInDays` | 0 |
| `featureUpdatesPaused` | false |
| `engagedRestartTransitionScheduleInDays` | — |
| `qualityUpdatesWillBeRolledBack` | — |
| `businessReadyUpdatesOnly` | userDefined |
| `qualityUpdatesPauseStartDate` | — |
| `microsoftUpdateServiceAllowed` | true |
| `featureUpdatesPauseExpiryDateTime` | 0001-01-01T00:00:00Z |
| `deadlineGracePeriodInDays` | 2 |
| `qualityUpdatesPaused` | false |
| `featureUpdatesWillBeRolledBack` | — |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
