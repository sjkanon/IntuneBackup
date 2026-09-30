<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) · [English](Baseline_IOS_U_Compliance_Defender_for_Endpoint.en.md) · **Français**

# [Baseline] - IOS - U - Compliance Defender for Endpoint

Marque un iPhone ou iPad comme non conforme dès que Microsoft Defender for Endpoint évalue le risque de la machine au-dessus de Medium.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | IntuneAdmin — Apple iOS Compliance/Baseline - iOSiPadOS - Microsoft Defender for Endpoint et UniFy iOS/iPadOS Baseline v1.2 — CP - Compliance - MDE - BYOD Devices (tous deux Medium) ; UniFy Corporate exige Low |
| Fichier | [`Baseline_IOS_U_Compliance_Defender_for_Endpoint.json`](Baseline_IOS_U_Compliance_Defender_for_Endpoint.json) |

> Volontairement une seule policy avec Medium au lieu du Low d'UniFy pour les appareils d'entreprise : Low rend un appareil non conforme dès un risque faible, ce qui demande d'abord de l'expérience sur la fréquence à laquelle cela se produit. Une policy distincte à côté de Compliance Device Health, afin qu'un tenant sans licence MDE puisse continuer à utiliser Device Health ; les policies de conformité sont évaluées séparément et n'entrent pas en conflit. Action de blocage après 24 heures, comme les autres policies de conformité iOS. Le champ advancedThreatProtectionRequiredSecurityLevel ne figure pas dans pl4nty DCv1 pour iOS, mais bien dans Graph beta iosCompliancePolicy et dans les deux exports sources. Onboarding : [Baseline] - IOS - D - Defender for Endpoint Onboarding Supervised et … Unsupervised ; configuration de l'app dans extras/ios/app-configuration.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.16 Activités de surveillance<br>A.5.15 Contrôle d'accès |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 25

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passcodeRequired` | false |
| `passcodeBlockSimple` | false |
| `passcodeMinimumLength` | — |
| `passcodeMinutesOfInactivityBeforeLock` | — |
| `passcodeMinutesOfInactivityBeforeScreenTimeout` | — |
| `passcodeExpirationDays` | — |
| `passcodePreviousPasscodeBlockCount` | — |
| `passcodeMinimumCharacterSetCount` | — |
| `passcodeRequiredType` | deviceDefault |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `securityBlockJailbrokenDevices` | false |
| `deviceThreatProtectionEnabled` | true |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | medium |
| `managedEmailProfileRequired` | false |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
