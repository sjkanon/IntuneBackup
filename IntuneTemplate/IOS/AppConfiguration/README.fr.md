[Nederlands](README.md) · [English](README.en.md) · **Français**

# Configuration des applications iOS/iPadOS

Six corps Graph, deux par application. La configuration des applications n'est pas un type CIPP et se trouve donc ici.

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
