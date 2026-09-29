<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Compliance_Antispyware.md) · [English](Baseline_WIN_U_Compliance_Antispyware.en.md) · **Français**

# [Baseline] - WIN - U - Compliance Antispyware

Vérifie qu'une solution anti-espion active est enregistrée dans Sécurité Windows.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | All Users |
| checkId | aucun — le moteur de la plateforme n'a pas de correspondance pour ce type de policy |
| Source | OpenIntuneBaseline Windows v4.0 — CP - Device Security - U - Antispyware |
| Fichier | [`Baseline_WIN_U_Compliance_Antispyware.json`](Baseline_WIN_U_Compliance_Antispyware.json) |

> Depuis OIB v4.0, un contrôle par policy au lieu de quatre policies regroupées, afin que les délais de grâce et les exceptions puissent être gérés par contrôle. Avec les huit autres policies WIN - U - Compliance de la v4.0, elle remplace Compliance Device Health, Device Security et Defender for Endpoint ; Compliance Password a été supprimée (voir _renames.json).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(f) évaluation de l'efficacité |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 43

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `passwordRequiredType` | deviceDefault |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 0 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `validOperatingSystemBuildRanges` | — |
| `wslDistributions` | — |
| `activeFirewallRequired` | false |
| `antiSpywareRequired` | true |
| `antivirusRequired` | false |
| `bitLockerEnabled` | false |
| `codeIntegrityEnabled` | false |
| `configurationManagerComplianceRequired` | false |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `deviceCompliancePolicyScript` | — |
| `deviceThreatProtectionEnabled` | false |
| `earlyLaunchAntiMalwareDriverEnabled` | false |
| `firmwareProtectionEnabled` | false |
| `kernelDmaProtectionEnabled` | false |
| `memoryIntegrityEnabled` | false |
| `mobileOsMaximumVersion` | — |
| `mobileOsMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumVersion` | — |
| `passwordBlockSimple` | false |
| `passwordExpirationDays` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordMinimumLength` | — |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordRequired` | false |
| `passwordRequiredToUnlockFromIdle` | false |
| `requireHealthyDeviceReport` | false |
| `rtpEnabled` | false |
| `secureBootEnabled` | false |
| `signatureOutOfDate` | false |
| `storageRequireEncryption` | false |
| `tpmRequired` | false |
| `virtualizationBasedSecurityEnabled` | false |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
