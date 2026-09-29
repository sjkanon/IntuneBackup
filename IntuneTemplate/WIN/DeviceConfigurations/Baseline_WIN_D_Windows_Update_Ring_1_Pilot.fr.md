<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Update_Ring_1_Pilot.md) · [English](Baseline_WIN_D_Windows_Update_Ring_1_Pilot.en.md) · **Français**

# [Baseline] - WIN - D - Windows Update Ring 1 Pilot

Premier anneau de mise à jour : reçoit les mises à jour Windows immédiatement, afin que les problèmes apparaissent sur un petit groupe.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — WUfB - Ring 1 - Pilot |
| Fichier | [`Baseline_WIN_D_Windows_Update_Ring_1_Pilot.json`](Baseline_WIN_D_Windows_Update_Ring_1_Pilot.json) |

> Sans affectation : les anneaux doivent être affectés à un groupe pilote, pas à All Devices — cela contredirait l'anneau 3.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques<br>A.8.32 Gestion des changements |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 36

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
