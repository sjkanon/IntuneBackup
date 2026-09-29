<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_D_Compliance_Dedicated_Device_Health.md) · [English](Baseline_AND_D_Compliance_Dedicated_Device_Health.en.md) · **Français**

# [Baseline] - AND - D - Compliance Dedicated Device Health

Marque un appareil Android dédié (kiosque ou partagé) comme non conforme lorsqu'il est rooté, que Play Integrity ne réussit pas avec attestation matérielle, que l'application Intune a été manipulée, que le stockage n'est pas chiffré ou que le dernier correctif de sécurité est plus ancien que le seuil minimal.

| | |
|---|---|
| Platform | Android |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Compliance |
| Affectation | — |
| checkId | aucun — le moteur de la plateforme n'a pas de correspondance pour ce type de policy |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Corp-Dedicated - Kiosk et Shared - v1.5 ; sans exigences de mot de passe ni de version d'OS, niveau de correctif ajouté |
| Fichier | [`Baseline_AND_D_Compliance_Dedicated_Device_Health.json`](Baseline_AND_D_Compliance_Dedicated_Device_Health.json) |

> Volontairement aucun code d'appareil : un kiosque à application unique n'en a souvent pas, et sur un appareil partagé Managed Home Screen gère le PIN de session. Volontairement aucun seuil d'OS : les appareils durcis (scanners, caisses) restent longtemps sur une version majeure plus ancienne mais reçoivent encore des correctifs du fabricant — la date du correctif (2026-03-01) y est la mesure honnête. Avant d'affecter, vérifiez si le parc réussit l'attestation matérielle ; le matériel de kiosque ancien y échoue parfois immédiatement (UniFy W-18). Par ailleurs, les appareils en Entra shared device mode ne reçoivent pas les policies utilisateur de la personne connectée — sur les appareils dédiés, Intune n'applique que les affectations d'appareils.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.8 Gestion des vulnérabilités techniques<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.1 Establish and Maintain a Secure Configuration Process<br>7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02<br>PR.DS-01<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 28

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `securityBlockJailbrokenDevices` | true |
| `securityRequireSafetyNetAttestationBasicIntegrity` | true |
| `securityRequireSafetyNetAttestationCertifiedDevice` | true |
| `osMinimumVersion` | — |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | 2026-03-01 |
| `passwordRequired` | false |
| `passwordMinimumLength` | — |
| `passwordMinimumLetterCharacters` | — |
| `passwordMinimumLowerCaseCharacters` | — |
| `passwordMinimumNonLetterCharacters` | — |
| `passwordMinimumNumericCharacters` | — |
| `passwordMinimumSymbolCharacters` | — |
| `passwordMinimumUpperCaseCharacters` | — |
| `passwordRequiredType` | deviceDefault |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordCountToBlock` | — |
| `storageRequireEncryption` | true |
| `securityRequireIntuneAppIntegrity` | true |
| `requireNoPendingSystemUpdates` | — |
| `securityRequiredAndroidSafetyNetEvaluationType` | hardwareBacked |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
