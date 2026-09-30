<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_U_Compliance_Device_Security.md) · [English](Baseline_MAC_U_Compliance_Device_Security.en.md) · **Français**

# CXNM - Standard - MAC - U - Compliance Device Security

Vérifie si le disque du Mac est chiffré, si le pare-feu est activé et si Gatekeeper n'autorise que les logiciels signés.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | All Users |
| Source | OpenIntuneBaseline macOS v1.0 — Compliance - U - Device Security |
| Fichier | [`Baseline_MAC_U_Compliance_Device_Security.json`](Baseline_MAC_U_Compliance_Device_Security.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.19 Installation de logiciels sur des systèmes opérationnels<br>A.8.20 Sécurité des réseaux<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(f) évaluation de l'efficacité<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.5 Implement and Manage a Firewall on End-User Devices |
| NIST CSF 2.0 | DE.CM-09<br>PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 27

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passwordRequired` | false |
| `passwordBlockSimple` | false |
| `passwordExpirationDays` | — |
| `passwordMinimumLength` | — |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordRequiredType` | deviceDefault |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `systemIntegrityProtectionEnabled` | false |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `storageRequireEncryption` | true |
| `gatekeeperAllowedAppSource` | macAppStoreAndIdentifiedDevelopers |
| `firewallEnabled` | true |
| `firewallBlockAllIncoming` | false |
| `firewallEnableStealthMode` | false |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 12 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
