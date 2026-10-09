[Nederlands](README.md) · [English](README.en.md) · **Français**

# Configuration des applications iOS/iPadOS

Six corps Graph, deux par application, et deux pour Windows App (en bas). La configuration des applications n'est pas un type CIPP et se trouve donc ici.

| Fichier | Type Graph | Endpoint (beta) | Pour |
|---|---|---|---|
| `outlook-managed-devices.json` | `iosMobileAppConfiguration` | `deviceAppManagement/mobileAppConfigurations` | appareils inscrits |
| `outlook-managed-apps.json` | `targetedManagedAppConfiguration` | `deviceAppManagement/targetedManagedAppConfigurations` | tout appareil (MAM) |
| `edge-managed-devices.json` | `iosMobileAppConfiguration` | idem | inscrits |
| `edge-managed-apps.json` | `targetedManagedAppConfiguration` | idem | tout appareil |
| `defender-managed-devices.json` | `iosMobileAppConfiguration` | idem | inscrits |
| `defender-managed-apps.json` | `targetedManagedAppConfiguration` | idem | tout appareil |

## Déploiement

**Managed devices.** Remplacez `APP-ID-OUTLOOK-INVULLEN`, `APP-ID-EDGE-INVULLEN` et
`APP-ID-DEFENDER-INVULLEN` par l'id d'application Intune (`GET beta/deviceAppManagement/mobileApps`
— l'application VPP ou store que vous affectez aux appareils), envoyez le corps en POST et affectez-le aux
utilisateurs ou appareils qui reçoivent l'application. Une application qui existe à la fois comme application VPP et comme application store
a deux id : configurez les deux ou choisissez-en un.

**Managed apps.** Envoyez le corps en POST, puis liez l'application avec l'action `targetApps` :

```json
POST beta/deviceAppManagement/targetedManagedAppConfigurations/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.iosMobileAppIdentifier", "bundleId": "com.microsoft.Office.Outlook" } } ] }
```

Bundle id : Outlook `com.microsoft.Office.Outlook`, Edge `com.microsoft.msedge`, Defender
`com.microsoft.scmx`. Affectez à tous les utilisateurs — le même public que
`IOS - U - App Protection`.

## Pourquoi ces clés

Uniquement des clés documentées par l'éditeur ; les valeurs sont volontairement limitées à ce qui touche
la sécurité. UniFy v1.2 en définit davantage (Focused Inbox, Suggested Replies, page d'accueil,
moteur de recherche) — c'est une préférence, pas une baseline.

**Outlook** — [Microsoft Learn: Outlook for iOS and Android app configuration](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/outlook-for-ios-and-android/outlook-for-ios-and-android-configuration-with-microsoft-intune)

| Clé | Valeur | Pourquoi |
|---|---|---|
| `com.microsoft.outlook.EmailProfile.AccountType` / `EmailAddress` / `EmailUPN` | `ModernAuth`, `{{mail}}`, `{{userprincipalname}}` | compte prérempli ; pas d'adresse mal saisie, pas d'authentification de base |
| `IntuneMAMAllowedAccountsOnly` + `IntuneMAMUPN` | `Enabled`, `{{userprincipalname}}` | uniquement le compte professionnel dans l'application gérée ; Microsoft : uniquement via managed devices |
| `com.microsoft.outlook.Mail.ExternalRecipientsToolTipEnabled` | `true` | avertissement en cas de destinataire externe — la mesure la moins coûteuse contre un e-mail envoyé par erreur |
| `com.microsoft.outlook.Contacts.LocalSyncEnabled` | `true` | nom de l'appelant visible ; fonctionne avec `allowmanagedtowriteunmanagedcontacts=true` dans `IOS - D - Data Protection`. Uniquement managed devices : sur un appareil non géré, cela reste le choix de l'utilisateur |

**Edge** — [Microsoft Learn: Manage Microsoft Edge on iOS and Android with Intune](https://learn.microsoft.com/intune/app-management/configuration/configure-edge-ios-android)

| Clé | Valeur | Pourquoi |
|---|---|---|
| `com.microsoft.intune.mam.managedbrowser.SmartScreenEnabled` | `true` | Defender SmartScreen contre le phishing et les téléchargements malveillants ; activé par défaut, figé ici |
| `com.microsoft.intune.mam.managedbrowser.SSLErrorOverrideAllowed` | `false` | un utilisateur ne peut pas ignorer une erreur de certificat — l'équivalent Edge de `allowuntrustedtlsprompt=false` |
| `IntuneMAMAllowedAccountsOnly` + `IntuneMAMUPN` | uniquement managed devices | uniquement le profil professionnel |

Volontairement non défini : `disabledFeatures` (password|inprivate|autofill). Désactiver la gestion des mots de passe dans Edge
est un choix qui doit correspondre aux stratégies Edge macOS/Windows ; à ne pas décider isolément ici.

**Microsoft Defender** — [Microsoft Learn: Configure Defender for Endpoint on iOS features](https://learn.microsoft.com/defender-endpoint/ios-configure-features)

| Clé | Valeur | Pourquoi |
|---|---|---|
| `issupervised` | `{{issupervised}}` | Defender sait si l'appareil est supervisé ; sur les appareils supervisés, le consentement de confidentialité pour l'inventaire des applications n'est plus nécessaire |
| `WebProtection` | `true` | anti-phishing via VPN local ; activé par défaut, figé ici. Ne s'applique pas à la route content filter |
| `DefenderNetworkProtectionEnable` | `true` | détection de Wi-Fi et de certificats non sûrs |
| `DefenderOpenNetworkDetection` | `2` | signaler les réseaux ouverts à l'utilisateur (0 désactivé, 1 audit, 2 activé) |
| `DisableSignOut` | `true` | l'utilisateur ne peut pas se déconnecter de l'application et faire ainsi disparaître le score de risque |

Volontairement non défini : `DefenderTVMPrivacyMode=false` (un inventaire complet des applications d'un appareil
personnel est une décision de confidentialité ; sur les appareils supervisés, ce n'est pas nécessaire) et
`SuppressOSUpdateNotification` (supprimé à partir de juillet 2026 selon Microsoft).

Les schémas ont été vérifiés par rapport à Graph beta (`iosMobileAppConfiguration` tel qu'exporté
par UniFy v1.2 ; `targetedManagedAppConfiguration.customSettings` sur Microsoft Learn), pas
testés sur un tenant.

## Windows App (Azure Virtual Desktop et Windows 365)

Deux corps Graph pour Windows App, y compris sur un appareil non inscrit :

| Fichier | Type Graph | Ce qu'il fait |
|---|---|---|
| `windows-app-app-protection.json` | `iosManagedAppProtection` | PIN, pas de presse-papiers entre le poste de travail virtuel et les apps locales, `screenCaptureConfigurationState` = `blocked`, `allowedOutboundDataTransferDestinations` = `none`, au moins Windows App 11.2.4, pas de claviers tiers, appareils jailbreakés ou rootés bloqués |
| `windows-app-managed-apps.json` | `targetedManagedAppConfiguration` | `redirectclipboard` = `0` et `drivestoredirect` = `0` : ni presse-papiers ni fichiers du téléphone vers la session |

**Pourquoi.** L'accès conditionnel `2150` n'admet Windows App sur iOS et Android qu'avec une app
protection policy ou un appareil conforme. Une stratégie sur *toutes les apps Microsoft* ne compte
pas : Microsoft fait sélectionner Windows App explicitement. Sans cette stratégie, un téléphone non
géré n'entre donc jamais. En outre, un Cloud PC ou un hôte de session avec screen capture protection
(`[Baseline] - WIN - D - Cloud PC Session Security`) refuse la connexion si Windows App ne bloque pas
la capture d'écran ; cela n'est possible qu'à partir de la version indiquée. La configuration de
l'app est une seconde couche à côté des paramètres de l'hôte de session ; le plus restrictif des
deux l'emporte, et Microsoft précise qu'elle ne les remplace pas.

**Pourquoi pas un template CIPP.** CIPP retire la liste `apps` d'un template d'app protection
avant de créer la stratégie. Une stratégie destinée uniquement à Windows App ne peut donc pas passer
par CIPP ; elle figure ici comme corps Graph.

**Déploiement.**

```http
POST https://graph.microsoft.com/beta/deviceAppManagement/iosManagedAppProtections
<contenu de windows-app-app-protection.json>

POST https://graph.microsoft.com/beta/deviceAppManagement/iosManagedAppProtections/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.iosMobileAppIdentifier", "bundleId": "com.microsoft.rdc.ios" } } ] }
```

Pour `windows-app-managed-apps.json`, de même via `targetedManagedAppConfigurations`. Affectez les deux aux utilisateurs
d'Azure Virtual Desktop ou de Windows 365. Sur un iPhone inscrit, Windows App doit figurer dans Intune comme app du store ; depuis la version 2409, Intune transmet lui-même les clés MAM.

**Non testé dans un tenant.** Après l'affectation, vérifiez dans le portail que Windows App n'est
pas aussi couverte par `[Baseline] - IOS - U - App Protection` : deux app protection policies sur
la même app pour le même utilisateur produisent un conflit.
