[Nederlands](README.md) · [English](README.en.md) · **Français**

# Inscription iOS/iPadOS : profil ADE, groupes et Apple Business

`iOS-Corporate-ADE-Baseline.json` est un `depIOSEnrollmentProfile` (Graph beta). Comme le
[profil ADE macOS](../../MAC/Enrollment/ade-profile/README.fr.md), il n'est aucun des cinq types
de stratégie CIPP : il dépend d'un jeton ADE (`depOnboardingSettings/{id}/enrollmentProfiles`) et
ne se déploie donc pas par un package CIPP.

## Pourquoi pas de modèle Settings Catalog

Intune connaît aussi une forme catalogue (`enrollmentConfiguration`, modèle
`27d20e9c-50c1-48f8-a44c-f37de4510051_1`, plateforme iOS). Ses settingDefinitionId
existent (`ade_useraffinity`, `ade_authenticationmethod`, `ade_lockedenrollment`,
`ade_modernauth_awaitfinalconfiguration`, `ade_appledevicenametemplate`,
`ade_setupassistant_*` — vérifiés dans pl4nty DCv2), mais une stratégie basée sur un modèle exige aussi, par
paramètre, un `settingInstanceTemplateId` et un `settingValueTemplateId`. Ceux-ci ne figurent pas dans
pl4nty (le fichier de modèle ne contient que des métadonnées) ni dans aucune des sources. Les inventer
produit une stratégie que Graph refuse ou — pire — qui définit d'autres écrans que prévu. Si
vous voulez la forme catalogue : créez le profil une fois dans le portail avec les valeurs ci-dessous et
exportez-le (`GET deviceManagement/configurationPolicies/{id}?$expand=settings`).

## Déploiement

`scripts/New-MacOSEnrollmentPolicy.ps1` refuse ce fichier : il vérifie la présence de
`#microsoft.graph.depMacOSEnrollmentProfile`. Tant qu'il n'existe pas de variante iOS, on passe par Graph :

```powershell
Connect-MgGraph -Scopes DeviceManagementServiceConfig.ReadWrite.All
$token = (Invoke-MgGraphRequest GET 'https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings').value |
  Where-Object tokenName -eq 'ADE-TOKEN-NAAM'
$body = Get-Content .\iOS-Corporate-ADE-Baseline.json -Raw   # remplir d'abord les placeholders
Invoke-MgGraphRequest POST "https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings/$($token.id)/enrollmentProfiles" -Body $body -ContentType 'application/json'
```

À remplir avant le POST :

| Placeholder | Provenance |
|---|---|
| `VPP-TOKEN-ID-INVULLEN` | id du jeton VPP (`GET beta/deviceAppManagement/vppTokens`) sous lequel Company Portal a été acheté avec des licences par appareil |
| `SERVICEDESK-TELEFOON-INVULLEN` | numéro du service desk — l'utilisateur le voit pendant la configuration et sous Réglages → Général → Informations |

## Pourquoi ces valeurs

Largement identiques au UniFy Corporate Deployment Guide v1.2 §7.2–7.3 et au
profil macOS de ce dépôt.

| Propriété | Valeur | Pourquoi |
|---|---|---|
| `requiresUserAuthentication` + `configurationWebUrl` + `enableAuthenticationViaCompanyPortal` | `true` | *Setup Assistant with modern authentication* : enregistrement Entra et MFA avant l'écran d'accueil. Même combinaison que le profil macOS ; vérifiez avec l'export d'un profil créé dans le portail si Graph le renvoie autrement |
| `supervisedModeEnabled` | `true` | prérequis pour `IOS - D - Restrictions Corporate`, `Lock Screen`, le content filter Defender et les mises à jour automatiques |
| `profileRemovalDisabled` | `true` | inscription verrouillée. **Irréversible** sans effacement |
| `awaitDeviceConfiguredConfirmation` / `waitForDeviceConfiguredConfirmation` | `true` | l'appareil reste dans Setup Assistant jusqu'à l'arrivée des premières stratégies — pas d'appareil d'entreprise sans code d'accès sur l'écran d'accueil |
| `iTunesPairingMode` | `disallow` | pas de synchronisation avec Finder/iTunes ; accès aux données USB et sideloading fermés |
| `deviceNameTemplate` | `{{DEVICETYPE}}-{{SERIAL}}` | nom d'inventaire prévisible, pas de nom de personne dans AirDrop/Bluetooth |
| `supportDepartment` | `IT Servicedesk` | identique au profil macOS |
| `isDefault` | `true` | chaque numéro de série sous ce jeton reçoit ce profil ; un appareil synchronisé sans profil échoue à l'activation |

Écrans (`true` = masqué). Laissés visibles : **Location Services** (fuseau horaire et
autorisations par application), **Touch ID/Face ID** (biométrie immédiatement utilisable pour Authenticator
et le code PIN d'application), **Software Update** et **Update Completed** (l'appareil démarre sur une version à jour),
**langue/région**. Masqués : **Passcode** — Microsoft documente que l'écran ne fonctionne pas
de manière fiable à partir d'iOS 14.5 ; l'exigence vient de `IOS - D - Passcode` une fois Setup Assistant terminé.
**Restore** et **Device to Device Migration** — un appareil d'entreprise démarre vierge, pas à partir
d'une sauvegarde privée. **Apple ID** — pas d'Apple Account privé sur du matériel d'entreprise. Si vous utilisez
des Managed Apple Accounts (fédération, voir `../README.md`), définissez `appleIdDisabled` sur `false`.

`enabledSkipKeys` contient les écrans sans propriété Graph propre, avec les noms d'Apple issus de
[apple/device-management `other/skipkeys.yaml`](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
(les onze qui y sont documentés pour iOS) : `ActionButton` (17.0), `AppStore` (14.3),
`CameraButton` (18.0), `EnableLockdownMode` (17.1), `Intelligence` (18.0), `Multitasking`
(26.0), `OSShowcase` (26.0), `Safety` (16.0), `SafetyAndHandling` (18.4), `TermsOfAddress`
(16.0), `WebContentFiltering` (18.2). Il est plausible qu'Intune les transmette tels quels, mais
ce n'est pas testé ; vérifiez avec un GET après la création.

Non définis : `enrollmentTimeAzureAdGroupIds` (GUID du tenant ; l'Enrollment Time Grouping peut se faire
après coup dans le portail), `carrierActivationUrl`, les champs Shared iPad et shared device mode
(autre scénario).

## Trois types d'appareils, trois niveaux de protection

| Type | Comment il arrive | Ce que fournit la baseline |
|---|---|---|
| **Sans inscription** (MAM) | L'utilisateur installe Outlook/Teams depuis l'App Store | `IOS - U - App Protection` (phase 1) — la seule couche |
| **Inscrit à titre personnel** | Company Portal (web-based device enrollment) ou account-driven user enrollment | App Protection + compliance + `Data Protection`, `Passcode`, `Enterprise SSO`, `Software Updates` (échéance), Defender via VPN |
| **Entreprise (ADE, supervisé)** | Numéro de série dans Apple Business, profil ci-dessous | tout ce qui précède + `Restrictions Corporate`, `Lock Screen`, Defender via content filter, mises à jour automatiques |

## Groupes

Deux groupes de phase 4 dans le manifeste. Créez-les comme groupes d'appareils dynamiques dans Entra ID :

| Groupe | Règle |
|---|---|
| `SEC-iOS-Corporate` | `(device.deviceOSType -in ["iPhone","iPad"]) -and (device.deviceOwnership -eq "Company")` |
| `SEC-iOS-BYOD` | `(device.deviceOSType -in ["iPhone","iPad"]) -and (device.deviceOwnership -eq "Personal")` |

Intune marque un appareil ADE comme *Company*. Avant l'affectation, vérifiez qu'il n'existe
aucun appareil non supervisé marqué manuellement comme *Company* : il recevrait les
stratégies réservées aux appareils supervisés (qu'iOS ignore alors) et pas de VPN Defender. Pour être plus strict,
utilisez pour `SEC-iOS-Corporate` `device.enrollmentProfileName -eq "iOS Corporate ADE Baseline"`.

## Apple Business (anciennement Apple Business Manager)

Une seule fois par tenant, en dehors d'Intune :

1. **Jetons et certificats — renouveler les trois chaque année.**
   - *Certificat Apple MDM Push* (Intune → Devices → iOS/iPadOS → Enrollment). Renouveler avec
     le **même** Apple Account géré que celui qui a servi à le créer ; un nouveau certificat
     sous un autre compte oblige chaque appareil inscrit à se réinscrire. Utilisez un
     compte fonctionnel, pas un compte personnel.
   - *Jeton ADE* (Enrollment program tokens). Expire au bout d'un an ; ensuite Intune ne synchronise plus
     de nouveaux numéros de série.
   - *Jeton VPP/contenu* (Tenant administration → Connectors → Apple VPP tokens). Expire au bout
     d'un an ; ensuite les applications VPP ne sont plus mises à jour ni installées.
   Programmez un rappel 30 jours avant l'expiration pour les trois, et intégrez le renouvellement
   au processus de gestion (ISO 27001 A.5.37 procédures d'exploitation documentées).
2. **Serveur MDM.** Créez dans Apple Business un serveur MDM pour Intune et affectez-lui les nouveaux achats
   par défaut (Préférences → Affectation par défaut des appareils), afin qu'un nouvel appareil n'ait pas
   à être affecté manuellement au préalable.
3. **Fédérer les Managed Apple Accounts avec Entra ID.** Apple Business → Préférences → Comptes :
   vérifier le domaine et activer la *federated authentication* avec Microsoft Entra ID. Les utilisateurs
   se connectent alors avec leur compte professionnel au lieu d'un mot de passe Apple distinct, et
   un utilisateur supprimé d'Entra perd aussi son Managed Apple Account.
4. **Managed Apple Accounts uniquement sur des appareils gérés.** Dans les paramètres de compte, limitez
   les appareils sur lesquels un Managed Apple Account peut se connecter à ceux que l'organisation gère
   (supervisés). Ainsi, les données iCloud du compte professionnel n'arrivent pas sur un iPad privé.
   Vérifiez le nom exact de l'option dans l'interface actuelle d'Apple Business ; Apple l'a
   réorganisée plusieurs fois en 2025–2026.
5. **Company Portal et Microsoft Authenticator via VPP.** Achetez les deux (gratuits) dans Apple
   Business → Apps and Books avec des **licences par appareil**, synchronisez le jeton VPP et affectez-les
   dans Intune en *required* à `SEC-iOS-Corporate`. Les licences par appareil s'installent sans
   Apple Account. Authenticator est un prérequis pour `IOS - D - Enterprise SSO` ; Company Portal
   est installé par le profil d'inscription lui-même (`companyPortalVppTokenId`) — ne créez pas
   de seconde affectation pour lui, sinon l'utilisateur reçoit une invite de connexion. Faites de même pour
   Microsoft Defender si Defender for Endpoint est utilisé.

## Paramètres de tenant Intune

- **Restriction d'inscription iOS/iPadOS** (Devices → Enrollment → Device platform restriction) :
  autoriser ou bloquer les appareils inscrits à titre personnel est une décision de l'organisation. Si vous voulez le BYOD uniquement
  via App Protection, bloquez *Personally owned* — `SEC-iOS-BYOD` et la variante VPN
  de Defender deviennent alors inutiles.
- **Connecteur Defender for Endpoint** (Endpoint security → Microsoft Defender for Endpoint) :
  *Connect iOS/iPadOS devices* activé, et pour la route MAM également *Connect iOS/iPadOS devices to
  Microsoft Defender for Endpoint for App Protection Policy evaluation*. Prérequis pour
  `IOS - U - Compliance Defender for Endpoint`.
- **Apple Configurator/host pairing** : le profil d'inscription définit `iTunesPairingMode` sur
  `disallow`. Si vous utilisez Apple Configurator, définissez-le sur `requiresCertificate` et ajoutez le
  certificat.
