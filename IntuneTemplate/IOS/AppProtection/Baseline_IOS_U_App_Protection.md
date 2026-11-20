<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_IOS_U_App_Protection.en.md) · [Français](Baseline_IOS_U_App_Protection.fr.md)

# [Baseline] - IOS - U - App Protection

Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke iPhone of iPad: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens — zonder dat het apparaat zelf beheerd wordt.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | App Protection |
| Toewijzing | All Users |
| Bron | OpenIntuneBaseline BYOD — iOS App Protection |
| Bestand | [`Baseline_IOS_U_App_Protection.json`](Baseline_IOS_U_App_Protection.json) |

> MAM voor persoonlijke iPhones/iPads: bedrijfsdata in de Microsoft-apps krijgt een PIN, versleuteling en kopieerbeperkingen, zonder dat het apparaat zelf beheerd wordt. Sinds september 2026 waarschuwt deze policy ook bij iOS onder 18.0. Bewust de **warning**-variant en niet `minimumRequired*`: die laatste blokkeert de app en dat hoort een aparte beslissing te zijn, genomen nadat je in de rapportage hebt gezien hoeveel toestellen het raakt. Die waarde veroudert — draai `node scripts/check-osversion.js` om te zien hoe ver hij achterloopt. Hij staat in `veldOverrides` omdat OIB hem leeg laat; zonder die regel draait de eerstvolgende `import-oib.js` hem stilzwijgend terug. Sinds september 2026 ook allowWidgetContentSync=false: widgets van beheerde apps tonen geen organisatiegegevens, in lijn met meldingen zonder organisatiegegevens. De iOS 26-velden writingToolsConfigurationState en genmojiConfigurationState staan sinds OIB BYOD v2.0 op notBlocked, en dat is de standaardwaarde: deze policy beslist dus niets over Apple Intelligence. Toestaan of niet blijft een organisatiebesluit (zie [Baseline] - IOS - D - Apple Intelligence Restricted/Permitted voor ingeschreven toestellen), en deze policy is er één voor iedereen. Sinds november 2026 op OIB BYOD v2.0 (Microsoft Level 2, deels Level 3): een gejailbreakt toestel wist de werkgegevens in plaats van alleen te blokkeren, selectief wissen na 30 dagen offline (was 90), biometrie na 24 uur weer door de PIN (was 12 uur), delen via Open-In/Share alleen naar beheerde apps, en een foto uit de bibliotheek mag een werkdocument in. Bewust níet overgenomen: 7 dagen offline voor de toegangscontrole en opslaan in de fotobibliotheek — zie veldOverrides. Ook niet blockDataIngestionIntoOrganizationDocuments=true (UniFy L2): met alleen OneDrive, SharePoint en camera als bron kan een gebruiker geen foto uit zijn bibliotheek meer in een werkdocument zetten — dezelfde afweging als bij allowedInboundDataTransferSources.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken<br>A.8.5 Veilige authenticatie<br>A.8.24 Gebruik van cryptografie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists<br>3.11 Encrypt Sensitive Data at Rest<br>4.11 Enforce Remote Wipe Capability on Portable End-User Devices |
| NIST CSF 2.0 | PR.DS-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de CA-Policies-repo leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| 2070 - GRANT - Mobile Device Access Requirements | disabled | De app protection policy waar `compliantApplication` naar vraagt. Zonder toegewezen policy voldoet geen enkele app en is de toegang op iOS en Android dicht. |
| 2150 - GRANT - Cloud PC Mobile Access | enabled | Eén van de twee manieren om aan deze policy te voldoen: de app valt onder een app protection policy. Zonder toegewezen policy blijft alleen een compliant toestel over. |

## Eigenschappen — 74

Een app protection-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `—` betekent niet ingesteld.

| Eigenschap | Waarde |
|---|---|
| `allowedDataIngestionLocations` | oneDriveForBusiness, sharePoint, camera, photoLibrary |
| `allowedDataStorageLocations` | oneDriveForBusiness, sharePoint |
| `allowedInboundDataTransferSources` | allApps |
| `allowedOutboundClipboardSharingLevel` | managedAppsWithPasteIn |
| `allowedOutboundDataTransferDestinations` | managedApps |
| `appActionIfDeviceComplianceRequired` | wipe |
| `appActionIfIosDeviceModelNotAllowed` | block |
| `appActionIfMaximumPinRetriesExceeded` | block |
| `appActionIfUnableToAuthenticateUser` | block |
| `appDataEncryptionType` | whenDeviceLocked |
| `appGroupType` | allMicrosoftApps |
| `dialerRestrictionLevel` | allApps |
| `exemptedAppProtocols[0].@odata.type` | #microsoft.graph.keyValuePair |
| `exemptedAppProtocols[0].name` | Default |
| `exemptedAppProtocols[0].value` | skype;app-settings;calshow;itms;itmss;itms-apps;itms-appss;itms-services; |
| `exemptedUniversalLinks` | http://facetime.apple.com, http://maps.apple.com, https://facetime.apple.com, https://maps.apple.com |
| `genmojiConfigurationState` | notBlocked |
| `managedBrowser` | microsoftEdge |
| `managedUniversalLinks` | http://*.appsplatform.us/*, http://*.onedrive.com/*, http://*.powerapps.cn/*, http://*.powerapps.com/*, http://*.powerapps.us/*, http://*.powerbi.com/*, http://*.service-now.com/*, http://*.sharepoint-df.com/*, http://*.sharepoint.com/*, http://*.yammer.com/*, http://*.zoom.us/*, http://*collab.apps.mil/l/*, http://*devspaces.skype.com/l/*, http://*teams-fl.microsoft.com/l/*, http://*teams.live.com/l/*, http://*teams.microsoft.com/l/*, http://*teams.microsoft.com/meet/*, http://*teams.microsoft.us/l/*, http://app.powerbi.cn/*, http://app.powerbi.de/*, http://app.powerbigov.us/*, http://msit.microsoftstream.com/video/*, http://tasks.office.com/*, http://to-do.microsoft.com/sharing*, http://web.microsoftstream.com/video/*, http://zoom.us/*, https://*.appsplatform.us/*, https://*.onedrive.com/*, https://*.powerapps.cn/*, https://*.powerapps.com/*, https://*.powerapps.us/*, https://*.powerbi.com/*, https://*.service-now.com/*, https://*.sharepoint-df.com/*, https://*.sharepoint.com/*, https://*.yammer.com/*, https://*.zoom.us/*, https://*collab.apps.mil/l/*, https://*devspaces.skype.com/l/*, https://*teams-fl.microsoft.com/l/*, https://*teams.live.com/l/*, https://*teams.microsoft.com/l/*, https://*teams.microsoft.com/meet/*, https://*teams.microsoft.us/l/*, https://app.powerbi.cn/*, https://app.powerbi.de/*, https://app.powerbigov.us/*, https://msit.microsoftstream.com/video/*, https://tasks.office.com/*, https://to-do.microsoft.com/sharing*, https://web.microsoftstream.com/video/*, https://zoom.us/* |
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
| `screenCaptureConfigurationState` | blocked |
| `targetedAppManagementLevels` | unspecified |
| `writingToolsConfigurationState` | notBlocked |
| `allowedIosDeviceModels` | — |
| `allowedOutboundClipboardSharingExceptionLength` | 0 |
| `allowWidgetContentSync` | false |
| `appActionIfAccountIsClockedOut` | — |
| `blockDataIngestionIntoOrganizationDocuments` | false |
| `contactSyncBlocked` | false |
| `customBrowserProtocol` |  |
| `customDialerAppProtocol` |  |
| `dataBackupBlocked` | true |
| `deviceComplianceRequired` | true |
| `disableAppPinIfDevicePinIsSet` | false |
| `disableProtectionOfManagedOutboundOpenInData` | false |
| `faceIdBlocked` | false |
| `filterOpenInToOnlyManagedApps` | true |
| `fingerprintBlocked` | false |
| `gracePeriodToBlockAppsDuringOffClockHours` | — |
| `managedBrowserToOpenLinksRequired` | true |
| `maximumPinRetries` | 5 |
| `maximumRequiredOsVersion` | — |
| `maximumWarningOsVersion` | — |
| `maximumWipeOsVersion` | — |
| `messagingRedirectAppUrlScheme` |  |
| `minimumPinLength` | 6 |
| `minimumRequiredAppVersion` | — |
| `minimumRequiredOsVersion` | — |
| `minimumRequiredSdkVersion` | — |
| `minimumWarningAppVersion` | — |
| `minimumWarningOsVersion` | 18.0 |
| `minimumWarningSdkVersion` | — |
| `minimumWipeAppVersion` | — |
| `minimumWipeOsVersion` | — |
| `minimumWipeSdkVersion` | — |
| `mobileThreatDefensePartnerPriority` | — |
| `organizationalCredentialsRequired` | false |
| `pinRequired` | true |
| `previousPinBlockCount` | 5 |
| `printBlocked` | true |
| `protectInboundDataFromUnknownSources` | false |
| `saveAsBlocked` | true |
| `simplePinBlocked` | true |
| `thirdPartyKeyboardsBlocked` | false |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
