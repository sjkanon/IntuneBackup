<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - App Protection

Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke Android-telefoon: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | App Protection |
| Toewijzing | All Users |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline BYOD — Android App Protection |
| Bestand | [`Baseline_AND_U_App_Protection.json`](Baseline_AND_U_App_Protection.json) |

> Sinds september 2026 waarschuwt deze policy bij Android onder 16.0 en bij een beveiligingspatch ouder dan 2026-03-01. Bewust de **warning**-variant en niet `minimumRequired*`: die laatste blokkeert de app en dat hoort een aparte beslissing te zijn, genomen nadat je in de rapportage hebt gezien hoeveel toestellen het raakt. Beide waarden verouderen — draai `node scripts/check-osversion.js` om te zien hoe ver ze achterlopen. Ze staan in `veldOverrides` omdat OIB ze leeg laat; zonder die regels draait de eerstvolgende `import-oib.js` ze stilzwijgend terug.

## Eigenschappen — 86

Een app protection-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `—` betekent niet ingesteld.

| Eigenschap | Waarde |
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
| `targetedAppManagementLevels` | unmanaged |
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

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
