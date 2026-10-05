<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Update_Ring_3_Production.md) · [English](Baseline_WIN_D_Windows_Update_Ring_3_Production.en.md) · **Français**

# [Baseline] - WIN - D - Windows Update Ring 3 Production

Anneau de production pour les mises à jour Windows : installe quotidiennement à 13:00 avec un délai de report de deux jours.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | All Devices |
| Source | baseline propre — fenêtres d'installation propres au tenant |
| Fichier | [`Baseline_WIN_D_Windows_Update_Ring_3_Production.json`](Baseline_WIN_D_Windows_Update_Ring_3_Production.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques<br>A.8.32 Gestion des changements |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 41

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
