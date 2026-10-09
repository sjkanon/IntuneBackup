[Nederlands](README.md) · [English](README.en.md) · **Français**

# Configuration d'applications pour Android (appareils inscrits)

Trois corps `androidManagedStoreAppConfiguration` : la configuration d'application que Managed Google Play
transmet à l'application lors de l'installation. Ils ne fonctionnent que sur un appareil Android
Enterprise **inscrit** et uniquement pour une application déployée via Managed Google Play.
`profileApplicability: default` signifie : chaque type de profil (profil professionnel personnel,
corporate-owned work profile, fully managed, dedicated) — une stratégie par application suffit.

| Fichier | Application | Ce qu'il fait | Placeholder |
|---|---|---|---|
| `AND-Outlook-Managed-Devices.json` | Outlook (`com.microsoft.office.outlook`) | compte professionnel prérempli avec authentification moderne, seul le compte de l'organisation autorisé, avertissement pour les destinataires externes | `OUTLOOK-APP-ID-INVULLEN` |
| `AND-Edge-Managed-Devices.json` | Edge (`com.microsoft.emmx`) | seul le compte de l'organisation autorisé | `EDGE-APP-ID-INVULLEN` |
| `AND-Defender-Low-Touch-Onboarding.json` | Microsoft Defender (`com.microsoft.scmx`) | onboarding sans action de l'utilisateur, protection web et anti-phishing activés, confidentialité pour le profil personnel | `DEFENDER-APP-ID-INVULLEN` |

## Pourquoi ces clés

`payloadJson` est en base64. Décodé :

**Outlook** — `com.microsoft.outlook.EmailProfile.AccountType` = `ModernAuth`,
`…EmailUPN` = `{{userprincipalname}}`, `…EmailAddress` = `{{mail}}`,
`IntuneMAMAllowedAccountsOnly` = `Enabled`, `com.microsoft.intune.mam.AllowedAccountUPNs` =
`{{userprincipalname}}`, `com.microsoft.outlook.Mail.ExternalRecipientsToolTipEnabled` = `true`.

*Organization allowed accounts* (les deux clés MAM) est le plus important : sans cette règle,
un utilisateur peut aussi ajouter un compte privé dans l'Outlook géré, et App Protection ne peut pas
séparer les données entre deux comptes dans la même application. La source UniFy désactive en outre Focused
Inbox, la signature par défaut, l'affichage en conversation et les réponses suggérées — cela relève
des préférences de l'utilisateur et a été omis.

**Edge** — seulement les deux clés de compte, pour la même raison : les liens depuis Outlook et Teams s'ouvrent
obligatoirement dans Edge (App Protection), et ils doivent aboutir dans le profil professionnel d'Edge, pas dans
un compte privé. Les clés comme la page d'accueil, le moteur de recherche, SmartScreen et les fonctionnalités désactivées
ont été délibérément omises : leurs types Android n'ont pas pu être vérifiés par rapport à un export Android,
et la plupart relèvent d'un choix de l'organisation.

**Defender** — inchangé par rapport à UniFy : `EnableLowTouchOnboarding` et `UserUPN` pour un onboarding
sans intervention, `DefenderNetworkProtectionEnable`, `antiphishing` et `vpn` pour la
protection web, et les clés `-PP` (*personal profile*) qui, sur un appareil personnel, excluent du reporting les
applications et URL du côté privé. Les `permissionActions` accordent d'emblée à Defender
les autorisations de stockage, de localisation et de notification dont il a besoin pour l'analyse et la protection réseau.
La protection web passe par un VPN local ; cela entre en conflit avec un autre VPN always-on sur
l'appareil — choisissez alors en concertation avec l'administrateur réseau.

## Déploiement

1. Approuvez l'application dans Managed Google Play et recherchez l'id de l'application dans Intune :
   `GET https://graph.microsoft.com/beta/deviceAppManagement/mobileApps?$filter=isof('microsoft.graph.androidManagedStoreApp')`
   → l'`id` de l'application avec le bon `packageId`.
2. Remplacez le placeholder dans `targetedMobileApps` par cet id.
3. `POST https://graph.microsoft.com/beta/deviceAppManagement/mobileAppConfigurations` avec le
   contenu du fichier.
4. Affectez-la aux mêmes groupes d'utilisateurs que l'application elle-même
   (`POST …/mobileAppConfigurations/{id}/assign`), ou dans le portail sous Applications → Configuration d'applications.

## Pas dans ce dossier : MAM sans inscription

La configuration d'applications pour les téléphones **sans** inscription (`targetedManagedAppConfiguration`,
*Managed apps* dans le portail) n'y figure délibérément pas. Pour ce type, aucun
export source n'a été trouvé lors de cette itération pour vérifier le corps, et pl4nty connaît bien pour Edge des
définitions Settings Catalog (`com.microsoft.edge.mamedgeappconfigsettings.*`) mais aucun
exemple du corps qui les utilise. Un corps non vérifié, dans le meilleur des cas, ne s'importe pas
et, dans le pire, s'importe silencieusement sans effet. D'ici là, configurez cette stratégie manuellement :
Applications → Configuration d'applications → Ajouter → *Managed apps*, les deux mêmes clés de compte, ciblant
Outlook et Edge.

Exception : Windows App, ci-dessous. Pour cette app, Microsoft documente lui-même les clés et les valeurs.

## Windows App (Azure Virtual Desktop et Windows 365)

Deux corps Graph pour Windows App, y compris sur un appareil non inscrit :

| Fichier | Type Graph | Ce qu'il fait |
|---|---|---|
| `AND-Windows-App-App-Protection.json` | `androidManagedAppProtection` | PIN, pas de presse-papiers entre le poste de travail virtuel et les apps locales, `screenCaptureBlocked` = `true`, au moins Windows App 11.0.0.94, Play Integrity matériel, appareils jailbreakés ou rootés bloqués |
| `AND-Windows-App-Managed-Apps.json` | `targetedManagedAppConfiguration` | `redirectclipboard` = `0` et `drivestoredirect` = `0` : ni presse-papiers ni fichiers du téléphone vers la session |

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
POST https://graph.microsoft.com/beta/deviceAppManagement/androidManagedAppProtections
<contenu de AND-Windows-App-App-Protection.json>

POST https://graph.microsoft.com/beta/deviceAppManagement/androidManagedAppProtections/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.androidMobileAppIdentifier", "packageId": "com.microsoft.rdc.androidx" } } ] }
```

Pour `AND-Windows-App-Managed-Apps.json`, de même via `targetedManagedAppConfigurations`. Affectez les deux aux utilisateurs
d'Azure Virtual Desktop ou de Windows 365. Le Portail d'entreprise doit se trouver dans le même profil que Windows App.

**Non testé dans un tenant.** Après l'affectation, vérifiez dans le portail que Windows App n'est
pas aussi couverte par `[Baseline] - AND - U - App Protection` : deux app protection policies sur
la même app pour le même utilisateur produisent un conflit.
