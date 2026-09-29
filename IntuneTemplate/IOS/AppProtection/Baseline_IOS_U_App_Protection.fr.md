<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_U_App_Protection.md) · [English](Baseline_IOS_U_App_Protection.en.md) · **Français**

# [Baseline] - IOS - U - App Protection

Protège les données de l'entreprise dans les applications Microsoft sur un iPhone ou iPad personnel : PIN distinct, chiffrement, pas de copie vers les applications personnelles, et effacement à distance des seules données professionnelles — sans que l'appareil lui-même soit géré.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | App Protection |
| Affectation | All Users |
| Source | OpenIntuneBaseline BYOD — iOS App Protection |
| Fichier | [`Baseline_IOS_U_App_Protection.json`](Baseline_IOS_U_App_Protection.json) |

> MAM pour les iPhone/iPad personnels : les données de l'entreprise dans les apps Microsoft sont protégées par un PIN, le chiffrement et des restrictions de copie, sans que l'appareil lui-même soit géré. Depuis septembre 2026, cette policy avertit aussi sous iOS antérieur à 18.0. Volontairement la variante **warning** et non `minimumRequired*` : cette dernière bloque l'app, et cela doit être une décision distincte, prise après avoir vu dans les rapports combien d'appareils sont concernés. Cette valeur vieillit — exécutez `node scripts/check-osversion.js` pour voir de combien elle est en retard. Elle figure dans `veldOverrides` parce qu'OIB la laisse vide ; sans cette entrée, le prochain `import-oib.js` la réinitialise silencieusement. Depuis septembre 2026 également allowWidgetContentSync=false : les widgets des apps gérées n'affichent pas de données de l'organisation, en cohérence avec les notifications sans données de l'organisation. Volontairement pas les champs iOS 26 writingToolsConfigurationState et genmojiConfigurationState : autoriser ou non Apple Intelligence est un choix du client (voir [Baseline] - IOS - D - Apple Intelligence Restricted/Permitted pour les appareils inscrits), et cette policy s'applique à tout le monde. Pas non plus blockDataIngestionIntoOrganizationDocuments=true (UniFy L2) : avec seulement OneDrive, SharePoint et l'appareil photo comme sources, un utilisateur ne peut plus insérer une photo de sa bibliothèque dans un document de travail — le même arbitrage que pour allowedInboundDataTransferSources.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données<br>A.8.5 Authentification sécurisée<br>A.8.24 Utilisation de la cryptographie<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists<br>3.11 Encrypt Sensitive Data at Rest<br>4.11 Enforce Remote Wipe Capability on Portable End-User Devices |
| NIST CSF 2.0 | PR.DS-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 68

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
| `minimumWarningOsVersion` | 18.0 |
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
| `appDataEncryptionType` | whenDeviceLocked |
| `minimumRequiredSdkVersion` | — |
| `faceIdBlocked` | false |
| `minimumWipeSdkVersion` | — |
| `allowedIosDeviceModels` | — |
| `appActionIfIosDeviceModelNotAllowed` | block |
| `thirdPartyKeyboardsBlocked` | false |
| `filterOpenInToOnlyManagedApps` | true |
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
| `screenCaptureConfigurationState` | blocked |
| `allowWidgetContentSync` | false |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
