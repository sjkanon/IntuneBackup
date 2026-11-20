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

> MAM pour iPhone/iPad personnels : les données d'entreprise dans les applications Microsoft reçoivent un code PIN, un chiffrement et des restrictions de copie, sans que l'appareil lui-même soit géré. Depuis septembre 2026, cette stratégie avertit aussi sous iOS 18.0. Volontairement la variante **warning** et non `minimumRequired*` : cette dernière bloque l'application, et cela doit être une décision distincte, prise après avoir vu dans les rapports combien d'appareils sont concernés. Cette valeur vieillit — exécutez `node scripts/check-osversion.js` pour voir son retard. Elle figure dans `veldOverrides` car OIB la laisse vide ; sans cette règle, le prochain `import-oib.js` l'annule silencieusement. Depuis septembre 2026 aussi allowWidgetContentSync=false : les widgets des applications gérées n'affichent aucune donnée de l'organisation, dans la ligne des notifications sans données de l'organisation. Les champs iOS 26 writingToolsConfigurationState et genmojiConfigurationState sont sur notBlocked depuis OIB BYOD v2.0, ce qui est la valeur par défaut : cette stratégie ne décide donc rien sur Apple Intelligence. L'autoriser ou non reste une décision de l'organisation (voir [Baseline] - IOS - D - Apple Intelligence Restricted/Permitted pour les appareils inscrits), et cette stratégie s'applique à tous. Depuis novembre 2026 sur OIB BYOD v2.0 (niveau 2 de Microsoft, en partie niveau 3) : un appareil jailbreaké efface les données professionnelles au lieu de seulement bloquer, effacement sélectif après 30 jours hors ligne (au lieu de 90), la biométrie repasse par le code PIN après 24 heures (au lieu de 12), partage via Open-In/Share uniquement vers des applications gérées, et une photo de la bibliothèque peut entrer dans un document professionnel. Volontairement non repris : 7 jours hors ligne avant la vérification d'accès, et l'enregistrement dans la photothèque — voir veldOverrides. Pas non plus blockDataIngestionIntoOrganizationDocuments=true (UniFy L2) : avec seulement OneDrive, SharePoint et l'appareil photo comme sources, un utilisateur ne peut plus insérer une photo de sa bibliothèque dans un document professionnel — le même arbitrage que pour allowedInboundDataTransferSources.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données<br>A.8.5 Authentification sécurisée<br>A.8.24 Utilisation de la cryptographie<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists<br>3.11 Encrypt Sensitive Data at Rest<br>4.11 Enforce Remote Wipe Capability on Portable End-User Devices |
| NIST CSF 2.0 | PR.DS-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du dépôt CA-Policies s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| 2070 - GRANT - Mobile Device Access Requirements | disabled | L'app protection policy que demande `compliantApplication`. Sans stratégie affectée, aucune app ne satisfait et l'accès sur iOS et Android est fermé. |
| 2150 - GRANT - Cloud PC Mobile Access | enabled | L'une des deux façons de satisfaire à cette stratégie : l'app est couverte par une app protection policy. Sans stratégie affectée, il ne reste qu'un appareil conforme. |

## Propriétés — 74

Une policy de protection d'application n'a pas de settingDefinitionId mais des propriétés fixes. `—` signifie non configuré.

| Propriété | Valeur |
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

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
