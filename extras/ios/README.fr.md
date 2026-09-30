[Nederlands](README.md) · [English](README.en.md) · **Français**

# iOS/iPadOS — ce qui n'a pas sa place dans `IntuneTemplate/`

Les pipelines CIPP transportent cinq types de stratégies (Catalog, Device, compliance, App Protection,
Admin). Une baseline iOS complète demande davantage : des paramètres de tenant dans Apple Business,
un profil d'inscription ADE, la configuration des applications et deux groupes dynamiques. Ils se trouvent ici. Rien
dans ce dossier n'est pris en compte par CIPP, `check-scope.js`, `export-intunebackup.js` ou
`Set-BaselineAssignment.ps1` ; le déploiement suit le README de chaque dossier.

| Dossier | Quoi | Déploiement |
|---|---|---|
| [`enrollment/`](enrollment/README.fr.md) | `depIOSEnrollmentProfile` pour les appareils d'entreprise via ADE | POST Graph sous le jeton ADE |
| [`app-configuration/`](app-configuration/README.fr.md) | Outlook, Edge et Microsoft Defender — managed devices et managed apps | POST Graph ou manuellement dans le portail |

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
