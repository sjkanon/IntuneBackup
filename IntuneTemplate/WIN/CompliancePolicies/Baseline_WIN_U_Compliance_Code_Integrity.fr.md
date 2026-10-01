<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Compliance_Code_Integrity.md) · [English](Baseline_WIN_U_Compliance_Code_Integrity.en.md) · **Français**

# CXNM - Standard - WIN - U - Compliance Code Integrity

Vérifie que l'intégrité du code est activée, afin que Windows ne charge que des pilotes et fichiers système signés.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | All Users |
| Source | OpenIntuneBaseline Windows v4.0 — CP - Device Health - U - Code Integrity |
| Fichier | [`Baseline_WIN_U_Compliance_Code_Integrity.json`](Baseline_WIN_U_Compliance_Code_Integrity.json) |

> Depuis OIB v4.0, un contrôle par policy au lieu de quatre policies regroupées, afin que les délais de grâce et les exceptions puissent être gérés par contrôle. Avec les huit autres policies WIN - U - Compliance de la v4.0, elle remplace Compliance Device Health, Device Security et Defender for Endpoint ; Compliance Password a été supprimée (voir _renames.json).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(f) évaluation de l'efficacité |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du [dépôt CA-Policies](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/) s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| [2060 - GRANT - Mobile Apps and Desktop Clients](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2060__GRANT__Mobile_Apps_and_Desktop_Clients.fr.md) | disabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| [2090 - GRANT - Browser Access On Unmanaged Devices](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2090__GRANT__Browser_Access_On_Unmanaged_Devices.fr.md) | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| [2130 - GRANT - Admins Compliant Device](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2130__GRANT__Admins_Compliant_Device.fr.md) | enabled | Contribue à déterminer si un appareil est conforme. Si un appareil n'y satisfait pas, il devient non conforme et l'exigence d'appareil conforme de Conditional Access le bloque. |
| [2160 - GRANT - Agent Users Compliant Device](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2160__GRANT__Agent_Users_Compliant_Device.fr.md) | report-only | Détermine si le terminal depuis lequel travaille un agent user est conforme. S'il ne l'est pas, cette stratégie bloque l'agent user dès qu'elle quitte le report-only. |
| [3020 - SESSION - BYOD Persistence](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__3020__SESSION__BYOD_Persistence.fr.md) | report-only | Détermine quel appareil est considéré comme conforme et échappe donc à cette limite de session. Un appareil géré qui devient non conforme y est soumis. |
| [3040 - SESSION - Block File Downloads On Unmanaged Devices](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__3040__SESSION__Block_File_Downloads_On_Unmanaged_Devices.fr.md) | disabled | Détermine quel appareil est considéré comme conforme et peut donc télécharger. Un appareil géré qui devient non conforme n'a plus que le navigateur sans téléchargement. |

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
| `antiSpywareRequired` | false |
| `antivirusRequired` | false |
| `bitLockerEnabled` | false |
| `codeIntegrityEnabled` | true |
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
