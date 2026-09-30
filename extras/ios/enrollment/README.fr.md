[Nederlands](README.md) · [English](README.en.md) · **Français**

# Profil d'inscription ADE iOS/iPadOS

`iOS-Corporate-ADE-Baseline.json` est un `depIOSEnrollmentProfile` (Graph beta). Comme
`extras/macos/enrollment/`, il se trouve en dehors de `IntuneTemplate/` : il dépend d'un jeton ADE
(`depOnboardingSettings/{id}/enrollmentProfiles`) et n'est aucun des cinq types CIPP.

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
