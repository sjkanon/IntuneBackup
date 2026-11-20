<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_AND_U_App_Protection.en.md) · [Français](Baseline_AND_U_App_Protection.fr.md)

# [Baseline] - AND - U - App Protection

Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke Android-telefoon: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | App Protection |
| Toewijzing | All Users |
| Bron | OpenIntuneBaseline BYOD — Android App Protection |
| Bestand | [`Baseline_AND_U_App_Protection.json`](Baseline_AND_U_App_Protection.json) |

> Sinds september 2026 waarschuwt deze policy bij Android onder 16.0 en bij een beveiligingspatch ouder dan 2026-03-01. Bewust de **warning**-variant en niet `minimumRequired*`: die laatste blokkeert de app en dat hoort een aparte beslissing te zijn, genomen nadat je in de rapportage hebt gezien hoeveel toestellen het raakt. Beide waarden verouderen — draai `node scripts/check-osversion.js` om te zien hoe ver ze achterlopen. Ze staan in `veldOverrides` omdat OIB ze leeg laat; zonder die regels draait de eerstvolgende `import-oib.js` ze stilzwijgend terug. Sinds november 2026 op OIB BYOD v2.0 (Microsoft Level 2, deels Level 3): Samsung Knox-attestatie vereist (blokkeert waar het toestel het ondersteunt), een geroot toestel wist de werkgegevens in plaats van alleen te blokkeren, selectief wissen na 30 dagen offline (was 90), biometrie na 24 uur weer door de PIN (was 12 uur), Class 3-biometrie expliciet aan, en een foto uit de bibliotheek mag een werkdocument in. Bewust níet overgenomen: 7 dagen offline voor de toegangscontrole en opslaan in de fotobibliotheek — zie veldOverrides.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.3 Beperking toegang tot informatie<br>A.8.5 Veilige authenticatie<br>A.8.12 Voorkomen van datalekken<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>4.11 Enforce Remote Wipe Capability on Portable End-User Devices<br>4.12 Separate Enterprise Workspaces on Mobile End-User Devices |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01<br>PR.DS-10 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de CA-Policies-repo leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| 2070 - GRANT - Mobile Device Access Requirements | disabled | De app protection policy waar `compliantApplication` naar vraagt. Zonder toegewezen policy voldoet geen enkele app en is de toegang op iOS en Android dicht. |
| 2150 - GRANT - Cloud PC Mobile Access | enabled | Eén van de twee manieren om aan deze policy te voldoen: de app valt onder een app protection policy. Zonder toegewezen policy blijft alleen een compliant toestel over. |

## Eigenschappen — 93

Een app protection-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `—` betekent niet ingesteld.

| Eigenschap | Waarde |
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

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
