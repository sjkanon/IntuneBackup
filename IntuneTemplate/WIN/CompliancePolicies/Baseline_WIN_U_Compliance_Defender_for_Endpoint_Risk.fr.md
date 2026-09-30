<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) · [English](Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.en.md) · **Français**

# [Baseline] - WIN - U - Compliance Defender for Endpoint Risk

Rend un appareil non conforme dès que Defender for Endpoint évalue le niveau de risque au-dessus de « moyen », afin que Conditional Access refuse à un appareil présentant une menace active l'accès aux données de l'entreprise.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | IntuneAdmin/IntuneBaselines — Windows 11 Compliance, 'Microsoft Defender for Endpoint Risk score' (deviceThreatProtectionEnabled, RequiredSecurityLevel medium) ; corps aligné sur les policies de conformité OIB v4.0, champs vérifiés par rapport à DCv1 |
| Fichier | [`Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.json`](Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.json) |

> Aucun champ en double : les neuf policies de conformité WIN existantes définissent toutes `deviceThreatProtectionEnabled` sur false (non exigé) et le niveau de risque sur `unavailable`. 'Moyen' signifie : faible et moyen sont autorisés, élevé ne l'est pas — la valeur d'IntuneAdmin et la recommandation de Microsoft pour éviter que des faux positifs au niveau 'faible' n'entraînent des blocages. Délai de grâce de 0 heure, comme pour les autres contrôles Defender : l'objectif est justement d'agir immédiatement. Prévoyez toutefois dans CA un processus d'exception (par ex. exclusion temporaire après analyse), sinon un utilisateur reste bloqué jusqu'à ce que l'incident soit résolu dans Defender. Les champs de conformité plus récents (DMA noyau, intégrité de la mémoire, VBS, protection du firmware) ne figurent pas dans DCv1 et n'ont donc pas été ajoutés.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.16 Activités de surveillance<br>A.5.15 Contrôle d'accès |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 43

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `deviceThreatProtectionRequiredSecurityLevel` | medium |
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
| `codeIntegrityEnabled` | false |
| `configurationManagerComplianceRequired` | false |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `deviceCompliancePolicyScript` | — |
| `deviceThreatProtectionEnabled` | true |
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
