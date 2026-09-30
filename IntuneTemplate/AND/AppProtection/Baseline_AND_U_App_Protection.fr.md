<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_App_Protection.md) · [English](Baseline_AND_U_App_Protection.en.md) · **Français**

# CXNM - Standard - AND - U - App Protection

Protège les données de l'entreprise dans les applications Microsoft sur un téléphone Android personnel : PIN distinct, chiffrement, pas de copie vers les applications personnelles, et effacement à distance des seules données professionnelles.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | App Protection |
| Affectation | All Users |
| Source | OpenIntuneBaseline BYOD — Android App Protection |
| Fichier | [`Baseline_AND_U_App_Protection.json`](Baseline_AND_U_App_Protection.json) |

> Depuis septembre 2026, cette policy émet un avertissement pour Android antérieur à 16.0 et pour un correctif de sécurité antérieur au 2026-03-01. Volontairement la variante **warning** et non `minimumRequired*` : cette dernière bloque l'application, ce qui doit faire l'objet d'une décision distincte, prise après avoir constaté dans les rapports combien d'appareils sont concernés. Les deux valeurs vieillissent — exécutez `node scripts/check-osversion.js` pour voir de combien elles sont en retard. Elles figurent dans `veldOverrides` parce qu'OIB les laisse vides ; sans ces lignes, le prochain `import-oib.js` les rétablit silencieusement.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.3 Restriction d'accès à l'information<br>A.8.5 Authentification sécurisée<br>A.8.12 Prévention de la fuite de données<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.11 Enforce Remote Wipe Capability on Portable End-User Devices<br>4.12 Separate Enterprise Workspaces on Mobile End-User Devices |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01<br>PR.DS-10 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 86

Une policy de protection d'application n'a pas de settingDefinitionId mais des propriétés fixes. `—` signifie non configuré.

| Propriété | Valeur |
|---|---|
| `periodOfflineBeforeAccessCheck` | PT12H |
| `periodOnlineBeforeAccessCheck` | PT30M |
| `allowedInboundDataTransferSources` | allApps |
| `allowedOutboundDataTransferDestinations` | managedApps |
| `organizationalCredentialsRequired` | false |
| `allowedOutboundClipboardSharingLevel` | managedAppsWithPasteIn |
| `dataBackupBlocked` | true |
| `deviceComplianceRequired` | true |
| `managedBrowserToOpenLinksRequired` | true |
| `saveAsBlocked` | true |
| `periodOfflineBeforeWipeIsEnforced` | P90D |
| `pinRequired` | true |
| `maximumPinRetries` | 5 |
| `simplePinBlocked` | true |
| `minimumPinLength` | 6 |
| `pinCharacterSet` | numeric |
| `periodBeforePinReset` | PT0S |
| `allowedDataStorageLocations` | oneDriveForBusiness, sharePoint |
| `contactSyncBlocked` | false |
| `printBlocked` | true |
| `fingerprintBlocked` | false |
| `disableAppPinIfDevicePinIsSet` | false |
| `maximumRequiredOsVersion` | — |
| `maximumWarningOsVersion` | — |
| `maximumWipeOsVersion` | — |
| `minimumRequiredOsVersion` | — |
| `minimumWarningOsVersion` | 16.0 |
| `minimumRequiredAppVersion` | — |
| `minimumWarningAppVersion` | — |
| `minimumWipeOsVersion` | — |
| `minimumWipeAppVersion` | — |
| `appActionIfDeviceComplianceRequired` | block |
| `appActionIfMaximumPinRetriesExceeded` | block |
| `pinRequiredInsteadOfBiometricTimeout` | PT12H |
| `allowedOutboundClipboardSharingExceptionLength` | 0 |
| `notificationRestriction` | blockOrganizationalData |
| `previousPinBlockCount` | 5 |
| `managedBrowser` | microsoftEdge |
| `maximumAllowedDeviceThreatLevel` | notConfigured |
| `mobileThreatDefenseRemediationAction` | block |
| `mobileThreatDefensePartnerPriority` | — |
| `blockDataIngestionIntoOrganizationDocuments` | false |
| `allowedDataIngestionLocations` | oneDriveForBusiness, sharePoint, camera |
| `appActionIfUnableToAuthenticateUser` | block |
| `dialerRestrictionLevel` | allApps |
| `gracePeriodToBlockAppsDuringOffClockHours` | — |
| `targetedAppManagementLevels` | unspecified |
| `appGroupType` | allMicrosoftApps |
| `screenCaptureBlocked` | true |
| `disableAppEncryptionIfDeviceEncryptionIsEnabled` | false |
| `encryptAppData` | true |
| `minimumRequiredPatchVersion` | 0000-00-00 |
| `minimumWarningPatchVersion` | 2026-03-01 |
| `minimumWipePatchVersion` | 0000-00-00 |
| `allowedAndroidDeviceManufacturers` | — |
| `appActionIfAndroidDeviceManufacturerNotAllowed` | block |
| `requiredAndroidSafetyNetDeviceAttestationType` | basicIntegrityAndDeviceCertification |
| `appActionIfAndroidSafetyNetDeviceAttestationFailed` | block |
| `requiredAndroidSafetyNetAppsVerificationType` | enabled |
| `appActionIfAndroidSafetyNetAppsVerificationFailed` | block |
| `customBrowserPackageId` |  |
| `customBrowserDisplayName` |  |
| `minimumRequiredCompanyPortalVersion` | — |
| `minimumWarningCompanyPortalVersion` | — |
| `minimumWipeCompanyPortalVersion` | — |
| `keyboardsRestricted` | false |
| `allowedAndroidDeviceModels` | — |
| `appActionIfAndroidDeviceModelNotAllowed` | block |
| `customDialerAppPackageId` |  |
| `customDialerAppDisplayName` |  |
| `biometricAuthenticationBlocked` | false |
| `requiredAndroidSafetyNetEvaluationType` | hardwareBacked |
| `blockAfterCompanyPortalUpdateDeferralInDays` | 0 |
| `warnAfterCompanyPortalUpdateDeferralInDays` | 0 |
| `wipeAfterCompanyPortalUpdateDeferralInDays` | 0 |
| `deviceLockRequired` | false |
| `appActionIfDeviceLockNotSet` | block |
| `connectToVpnOnLaunch` | false |
| `appActionIfDevicePasscodeComplexityLessThanLow` | — |
| `appActionIfDevicePasscodeComplexityLessThanMedium` | block |
| `appActionIfDevicePasscodeComplexityLessThanHigh` | — |
| `requireClass3Biometrics` | true |
| `requirePinAfterBiometricChange` | true |
| `fingerprintAndBiometricEnabled` | — |
| `exemptedAppPackages` | — |
| `approvedKeyboards` | — |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
