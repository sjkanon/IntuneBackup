<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Update Ring 1 Pilot

Eerste updatering: krijgt Windows-updates meteen, zodat problemen zichtbaar worden op een kleine groep.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline Windows v4.0 — WUfB - Ring 1 - Pilot |
| Bestand | [`Baseline_WIN_D_Windows_Update_Ring_1_Pilot.json`](Baseline_WIN_D_Windows_Update_Ring_1_Pilot.json) |

> Zonder assignment: ringen horen op een pilot-groep, niet op All Devices — dat zou ring 3 tegenspreken.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden<br>A.8.32 Wijzigingsbeheer |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 36

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `deliveryOptimizationMode` | userDefined |
| `prereleaseFeatures` | userDefined |
| `automaticUpdateMode` | windowsDefault |
| `microsoftUpdateServiceAllowed` | true |
| `driversExcluded` | false |
| `installationSchedule` | — |
| `qualityUpdatesDeferralPeriodInDays` | 0 |
| `featureUpdatesDeferralPeriodInDays` | 0 |
| `qualityUpdatesPaused` | false |
| `featureUpdatesPaused` | false |
| `qualityUpdatesPauseExpiryDateTime` | 0001-01-01T00:00:00Z |
| `featureUpdatesPauseExpiryDateTime` | 0001-01-01T00:00:00Z |
| `businessReadyUpdatesOnly` | userDefined |
| `skipChecksBeforeRestart` | false |
| `updateWeeks` | — |
| `qualityUpdatesPauseStartDate` | — |
| `featureUpdatesPauseStartDate` | — |
| `featureUpdatesRollbackWindowInDays` | 30 |
| `qualityUpdatesWillBeRolledBack` | false |
| `featureUpdatesWillBeRolledBack` | false |
| `qualityUpdatesRollbackStartDateTime` | 0001-01-01T00:00:00Z |
| `featureUpdatesRollbackStartDateTime` | 0001-01-01T00:00:00Z |
| `engagedRestartDeadlineInDays` | — |
| `engagedRestartSnoozeScheduleInDays` | — |
| `engagedRestartTransitionScheduleInDays` | — |
| `deadlineForFeatureUpdatesInDays` | 0 |
| `deadlineForQualityUpdatesInDays` | 0 |
| `deadlineGracePeriodInDays` | 1 |
| `postponeRebootUntilAfterDeadline` | true |
| `autoRestartNotificationDismissal` | notConfigured |
| `scheduleRestartWarningInHours` | — |
| `scheduleImminentRestartWarningInMinutes` | — |
| `userPauseAccess` | disabled |
| `userWindowsUpdateScanAccess` | enabled |
| `updateNotificationLevel` | defaultNotifications |
| `allowWindows11Upgrade` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
