<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_App_Protection.md) · [English](Baseline_AND_U_App_Protection.en.md) · **Français**

# [Baseline] - AND - U - App Protection

Protège les données de l'entreprise dans les applications Microsoft sur un téléphone Android personnel : PIN distinct, chiffrement, pas de copie vers les applications personnelles, et effacement à distance des seules données professionnelles.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | App Protection |
| Affectation | All Users |
| Source | OpenIntuneBaseline BYOD — Android App Protection |
| Fichier | [`Baseline_AND_U_App_Protection.json`](Baseline_AND_U_App_Protection.json) |

> Depuis septembre 2026, cette stratégie avertit sous Android 16.0 et pour un correctif de sécurité antérieur au 2026-03-01. Volontairement la variante **warning** et non `minimumRequired*` : cette dernière bloque l'application, et cela doit être une décision distincte, prise après avoir vu dans les rapports combien d'appareils sont concernés. Les deux valeurs vieillissent — exécutez `node scripts/check-osversion.js` pour voir leur retard. Elles figurent dans `veldOverrides` car OIB les laisse vides ; sans ces règles, le prochain `import-oib.js` les annule silencieusement. Depuis novembre 2026 sur OIB BYOD v2.0 (niveau 2 de Microsoft, en partie niveau 3) : attestation Samsung Knox exigée (bloque là où l'appareil la prend en charge), un appareil rooté efface les données professionnelles au lieu de seulement bloquer, effacement sélectif après 30 jours hors ligne (au lieu de 90), la biométrie repasse par le code PIN après 24 heures (au lieu de 12), biométrie de classe 3 explicitement activée, et une photo de la bibliothèque peut entrer dans un document professionnel. Volontairement non repris : 7 jours hors ligne avant la vérification d'accès, et l'enregistrement dans la photothèque — voir veldOverrides.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.3 Restriction d'accès à l'information<br>A.8.5 Authentification sécurisée<br>A.8.12 Prévention de la fuite de données<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.11 Enforce Remote Wipe Capability on Portable End-User Devices<br>4.12 Separate Enterprise Workspaces on Mobile End-User Devices |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01<br>PR.DS-10 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du dépôt CA-Policies s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| 2070 - GRANT - Mobile Device Access Requirements | disabled | L'app protection policy que demande `compliantApplication`. Sans stratégie affectée, aucune app ne satisfait et l'accès sur iOS et Android est fermé. |
| 2150 - GRANT - Cloud PC Mobile Access | enabled | L'une des deux façons de satisfaire à cette stratégie : l'app est couverte par une app protection policy. Sans stratégie affectée, il ne reste qu'un appareil conforme. |

## Propriétés — 93

Une policy de protection d'application n'a pas de settingDefinitionId mais des propriétés fixes. `—` signifie non configuré.

| Propriété | Valeur |
|---|---|
| `allowedAndroidDeviceModels` | — |
| `allowedDataIngestionLocations` | oneDriveForBusiness, sharePoint, camera, photoLibrary |
| `allowedDataStorageLocations` | oneDriveForBusiness, sharePoint |
| `allowedInboundDataTransferSources` | allApps |
| `allowedOutboundClipboardSharingLevel` | managedAppsWithPasteIn |
| `allowedOutboundDataTransferDestinations` | managedApps |
| `appActionIfAndroidDeviceManufacturerNotAllowed` | block |
| `appActionIfAndroidDeviceModelNotAllowed` | block |
| `appActionIfAndroidSafetyNetAppsVerificationFailed` | block |
| `appActionIfAndroidSafetyNetDeviceAttestationFailed` | block |
| `appActionIfDeviceComplianceRequired` | wipe |
| `appActionIfDeviceLockNotSet` | block |
| `appActionIfDevicePasscodeComplexityLessThanMedium` | block |
| `appActionIfMaximumPinRetriesExceeded` | block |
| `appActionIfSamsungKnoxAttestationRequired` | blockWhenSettingIsSupported |
| `appActionIfUnableToAuthenticateUser` | block |
| `appGroupType` | allMicrosoftApps |
| `approvedKeyboards` | — |
| `dialerRestrictionLevel` | allApps |
| `exemptedAppPackages` | — |
| `managedBrowser` | microsoftEdge |
| `maximumAllowedDeviceThreatLevel` | notConfigured |
| `mobileThreatDefenseRemediationAction` | block |
| `notificationRestriction` | blockOrganizationalData |
| `periodBeforePinReset` | PT0S |
| `periodOfflineBeforeAccessCheck` | PT12H |
| `periodOfflineBeforeWipeIsEnforced` | P30D |
| `periodOnlineBeforeAccessCheck` | PT30M |
| `pinCharacterSet` | numeric |
| `pinRequiredInsteadOfBiometricTimeout` | P1D |
| `protectedMessagingRedirectAppType` | anyApp |
| `purviewContentEvaluationRequired` | notRequired |
| `requiredAndroidSafetyNetAppsVerificationType` | enabled |
| `requiredAndroidSafetyNetDeviceAttestationType` | basicIntegrityAndDeviceCertification |
| `requiredAndroidSafetyNetEvaluationType` | hardwareBacked |
| `targetedAppManagementLevels` | unspecified |
| `allowedAndroidDeviceManufacturers` | — |
| `allowedOutboundClipboardSharingExceptionLength` | 0 |
| `appActionIfAccountIsClockedOut` | — |
| `appActionIfDeveloperOptionsEnabled` | — |
| `appActionIfDevicePasscodeComplexityLessThanHigh` | — |
| `appActionIfDevicePasscodeComplexityLessThanLow` | — |
| `biometricAuthenticationBlocked` | false |
| `blockAfterCompanyPortalUpdateDeferralInDays` | 0 |
| `blockDataIngestionIntoOrganizationDocuments` | false |
| `connectToVpnOnLaunch` | false |
| `contactSyncBlocked` | false |
| `customBrowserDisplayName` |  |
| `customBrowserPackageId` |  |
| `customDialerAppDisplayName` |  |
| `customDialerAppPackageId` |  |
| `dataBackupBlocked` | true |
| `deviceComplianceRequired` | true |
| `deviceLockRequired` | false |
| `disableAppEncryptionIfDeviceEncryptionIsEnabled` | false |
| `disableAppPinIfDevicePinIsSet` | false |
| `encryptAppData` | true |
| `fingerprintAndBiometricEnabled` | true |
| `fingerprintBlocked` | false |
| `gracePeriodToBlockAppsDuringOffClockHours` | — |
| `keyboardsRestricted` | false |
| `managedBrowserToOpenLinksRequired` | true |
| `maximumPinRetries` | 5 |
| `maximumRequiredOsVersion` | — |
| `maximumWarningOsVersion` | — |
| `maximumWipeOsVersion` | — |
| `messagingRedirectAppDisplayName` |  |
| `messagingRedirectAppPackageId` |  |
| `minimumPinLength` | 6 |
| `minimumRequiredAppVersion` | — |
| `minimumRequiredCompanyPortalVersion` | — |
| `minimumRequiredOsVersion` | — |
| `minimumRequiredPatchVersion` | — |
| `minimumWarningAppVersion` | — |
| `minimumWarningCompanyPortalVersion` | — |
| `minimumWarningOsVersion` | 16.0 |
| `minimumWarningPatchVersion` | 2026-03-01 |
| `minimumWipeAppVersion` | — |
| `minimumWipeCompanyPortalVersion` | — |
| `minimumWipeOsVersion` | — |
| `minimumWipePatchVersion` | — |
| `mobileThreatDefensePartnerPriority` | — |
| `organizationalCredentialsRequired` | false |
| `pinRequired` | true |
| `previousPinBlockCount` | 5 |
| `printBlocked` | true |
| `requireClass3Biometrics` | true |
| `requirePinAfterBiometricChange` | true |
| `saveAsBlocked` | true |
| `screenCaptureBlocked` | true |
| `simplePinBlocked` | true |
| `warnAfterCompanyPortalUpdateDeferralInDays` | 0 |
| `wipeAfterCompanyPortalUpdateDeferralInDays` | 0 |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
