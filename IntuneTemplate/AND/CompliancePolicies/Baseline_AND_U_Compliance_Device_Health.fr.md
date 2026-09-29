<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Compliance_Device_Health.md) · [English](Baseline_AND_U_Compliance_Device_Health.en.md) · **Français**

# [Baseline] - AND - U - Compliance Device Health

Marque un appareil Android avec profil professionnel personnel comme non conforme lorsqu'il est rooté, que le débogage USB est activé, que les applications hors du Play Store sont autorisées, que Play Integrity ne peut pas être confirmé avec attestation matérielle, ou que le dernier correctif de sécurité est plus ancien que le seuil minimal.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| checkId | aucun — le moteur de la plateforme n'a pas de correspondance pour ce type de policy |
| Source | Convention OpenIntuneBaseline pour la conformité, contenu comparé à IntuneAdmin (Personally-owned work profile - Device Health) et à UniFy-Endpoint Android BYOD. |
| Fichier | [`Baseline_AND_U_Compliance_Device_Health.json`](Baseline_AND_U_Compliance_Device_Health.json) |

> Rédigée comme `androidWorkProfileCompliancePolicy` — le profil professionnel personnel. `hardwareBacked` exclut les appareils plus anciens sans attestation matérielle prise en charge — c'est voulu, mais vérifiez-le par rapport au parc avant d'affecter. Depuis septembre 2026, cette policy exige aussi un correctif de sécurité du 2026-03-01 ou plus récent (six mois en arrière, comme l'avertissement dans App Protection) ; les appareils des fabricants qui publient des correctifs trimestriels restent largement dans les limites. Le seuil d'OS (12.0) et la date de correctif vieillissent : exécutez `node scripts/check-osversion.js` pour voir de combien ils sont en retard. Ce sont tous deux des objectifs d'actualité (voir `ondergrens`) qui peuvent évoluer, mais pas sans vérifier combien d'appareils se situent en dessous. Defender for Endpoint figure volontairement dans une policy distincte (Compliance Defender for Endpoint), car il nécessite une licence et un connecteur.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.7 Protection contre les programmes malveillants<br>A.8.8 Gestion des vulnérabilités techniques<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 2.3 Address Unauthorized Software<br>4.1 Establish and Maintain a Secure Configuration Process<br>7.3 Perform Automated Operating System Patch Management<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-02<br>PR.PS-05<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 37

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `passwordRequired` | false |
| `passwordMinimumLength` | — |
| `passwordRequiredType` | deviceDefault |
| `requiredPasswordComplexity` | none |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordExpirationDays` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordSignInFailureCountBeforeFactoryReset` | — |
| `workProfileRequirePassword` | false |
| `workProfilePasswordMinimumLength` | — |
| `workProfileInactiveBeforeScreenLockInMinutes` | — |
| `workProfilePasswordRequiredType` | deviceDefault |
| `workProfileRequiredPasswordComplexity` | none |
| `securityPreventInstallAppsFromUnknownSources` | true |
| `securityDisableUsbDebugging` | true |
| `securityRequireVerifyApps` | true |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `securityBlockJailbrokenDevices` | true |
| `securityRequireSafetyNetAttestationBasicIntegrity` | true |
| `securityRequireSafetyNetAttestationCertifiedDevice` | true |
| `securityRequireGooglePlayServices` | true |
| `securityRequireUpToDateSecurityProviders` | true |
| `securityRequireCompanyPortalAppIntegrity` | true |
| `securityRequiredAndroidSafetyNetEvaluationType` | hardwareBacked |
| `osMinimumVersion` | 12.0 |
| `osMaximumVersion` | — |
| `minAndroidSecurityPatchLevel` | 2026-03-01 |
| `storageRequireEncryption` | false |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
