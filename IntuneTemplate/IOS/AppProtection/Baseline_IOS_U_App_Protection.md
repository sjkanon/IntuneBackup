<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - U - App Protection

Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke iPhone of iPad: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens — zonder dat het apparaat zelf beheerd wordt.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | App Protection |
| Toewijzing | All Users |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline BYOD — iOS App Protection |
| Bestand | [`Baseline_IOS_U_App_Protection.json`](Baseline_IOS_U_App_Protection.json) |

> MAM voor persoonlijke iPhones/iPads: bedrijfsdata in de Microsoft-apps krijgt een PIN, versleuteling en kopieerbeperkingen, zonder dat het apparaat zelf beheerd wordt.

## Eigenschappen — 66

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
| `minimumWarningOsVersion` | — |
| `minimumRequiredAppVersion` | — |
| `minimumWarningAppVersion` | — |
| `minimumWipeOsVersion` | — |
| `minimumWipeAppVersion` | — |
| `appActionIfDeviceComplianceRequired` | block |
| `appActionIfMaximumPinRetriesExceeded` | block |
| `pinRequiredInsteadOfBiometricTimeout` | PT12H |
| `allowedOutboundClipboardSharingExceptionLength` | 0 |
| `notificationRestriction` | blockOrganizationalData |
| `previousPinBlockCount` | 0 |
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
| `appDataEncryptionType` | whenDeviceLocked |
| `minimumRequiredSdkVersion` | — |
| `faceIdBlocked` | false |
| `minimumWipeSdkVersion` | — |
| `allowedIosDeviceModels` | — |
| `appActionIfIosDeviceModelNotAllowed` | block |
| `thirdPartyKeyboardsBlocked` | false |
| `filterOpenInToOnlyManagedApps` | false |
| `disableProtectionOfManagedOutboundOpenInData` | false |
| `protectInboundDataFromUnknownSources` | false |
| `customBrowserProtocol` |  |
| `customDialerAppProtocol` |  |
| `managedUniversalLinks` | http://*.sharepoint.com/*, http://*.sharepoint-df.com/*, http://*.yammer.com/*, http://*.onedrive.com/*, http://tasks.office.com/*, http://to-do.microsoft.com/sharing*, http://web.microsoftstream.com/video/*, http://msit.microsoftstream.com/video/*, http://*.powerbi.com/*, http://app.powerbi.cn/*, http://app.powerbigov.us/*, http://app.powerbi.de/*, http://*.service-now.com/*, http://*.appsplatform.us/*, http://*.powerapps.cn/*, http://*.powerapps.com/*, http://*.powerapps.us/*, http://*teams.microsoft.com/l/*, http://*devspaces.skype.com/l/*, http://*teams.live.com/l/*, http://*collab.apps.mil/l/*, http://*teams.microsoft.us/l/*, http://*teams-fl.microsoft.com/l/*, http://*.zoom.us/*, http://zoom.us/*, https://*.sharepoint.com/*, https://*.sharepoint-df.com/*, https://*.yammer.com/*, https://*.onedrive.com/*, https://tasks.office.com/*, https://to-do.microsoft.com/sharing*, https://web.microsoftstream.com/video/*, https://msit.microsoftstream.com/video/*, https://*.powerbi.com/*, https://app.powerbi.cn/*, https://app.powerbigov.us/*, https://app.powerbi.de/*, https://*.service-now.com/*, https://*.appsplatform.us/*, https://*.powerapps.cn/*, https://*.powerapps.com/*, https://*.powerapps.us/*, https://*teams.microsoft.com/l/*, https://*devspaces.skype.com/l/*, https://*teams.live.com/l/*, https://*collab.apps.mil/l/*, https://*teams.microsoft.us/l/*, https://*teams-fl.microsoft.com/l/*, https://*.zoom.us/*, https://zoom.us/* |
| `exemptedUniversalLinks` | http://maps.apple.com, https://maps.apple.com, http://facetime.apple.com, https://facetime.apple.com |
| `minimumWarningSdkVersion` | — |
| `exemptedAppProtocols[0].@odata.type` | #microsoft.graph.keyValuePair |
| `exemptedAppProtocols[0].name` | Default |
| `exemptedAppProtocols[0].value` | skype;app-settings;calshow;itms;itmss;itms-apps;itms-appss;itms-services; |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
