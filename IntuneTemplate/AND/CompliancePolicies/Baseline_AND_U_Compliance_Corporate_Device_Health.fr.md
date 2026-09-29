<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Compliance_Corporate_Device_Health.md) · [English](Baseline_AND_U_Compliance_Corporate_Device_Health.en.md) · **Français**

# [Baseline] - AND - U - Compliance Corporate Device Health

Marque un appareil Android fully managed ou corporate-owned comme non conforme lorsqu'il est rooté, que Play Integrity ne réussit pas avec attestation matérielle, que l'application Intune a été manipulée, qu'il fonctionne sous une version antérieure à Android 16 ou que le dernier correctif de sécurité est plus ancien que le seuil minimal.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - CP - DEV - Fully-Managed et Corp-Work-Profile - v1.5 (partie santé), comparé à IntuneAdmin Baseline - Android Enterprise - Device Health ; seuil d'OS relevé de 13.0 à n-1 (16.0) et niveau de correctif ajouté |
| Fichier | [`Baseline_AND_U_Compliance_Corporate_Device_Health.json`](Baseline_AND_U_Compliance_Corporate_Device_Health.json) |

> Le seuil d'OS 16.0 correspond à n-1 (Android 17 est sorti le 16 juin 2026) : un appareil sur la version majeure précédente reste conforme, Android 15 non. C'est plus strict qu'UniFy (13.0) et que la variante profil professionnel (12.0), et c'est voulu : l'organisation choisit elle-même ce matériel. Avant d'affecter, vérifiez dans le rapport Intune combien d'appareils d'entreprise sont en dessous de 16 ; s'ils sont nombreux, définissez temporairement la valeur sur 15.0 plutôt que de ne pas affecter la policy. Date de correctif 2026-03-01, identique au reste de l'ensemble Android. Les deux vieillissent : `node scripts/check-osversion.js`. Action de blocage après un délai de grâce de 24 heures, comme les autres policies de conformité de la baseline (UniFy envoie en outre immédiatement une notification push). Le mot de passe et le chiffrement figurent dans Compliance Corporate Password, Defender dans Compliance Corporate Defender for Endpoint.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.7 Protection contre les programmes malveillants<br>A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-02<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 28

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `securityBlockJailbrokenDevices` | true |
| `securityRequireSafetyNetAttestationBasicIntegrity` | true |
| `securityRequireSafetyNetAttestationCertifiedDevice` | true |
| `osMinimumVersion` | 16.0 |
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
| `storageRequireEncryption` | false |
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
