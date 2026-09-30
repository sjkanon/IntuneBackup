[Nederlands](README.md) · [English](README.en.md) · **Français**

# Profils d'inscription ADE macOS

Les profils Apple Automated Device Enrollment (`depMacOSEnrollmentProfile`) se trouvent **en dehors**
de `IntuneTemplate/`. Les pipelines de ce dossier connaissent cinq types de stratégies CIPP et un
profil d'inscription n'en fait pas partie : il dépend d'un token ABM
(`depOnboardingSettings/{id}/enrollmentProfiles`) et ne passe pas par le bouton « Import profile ».
Un fichier placé ici n'est donc **pas** repris par `export-intunebackup.js` ou
`Set-BaselineAssignment.ps1`.
Le déploiement se fait via `scripts/New-MacOSEnrollmentPolicy.ps1`.

| Fichier | Token | Profil par défaut |
|---|---|---|
| `macOS-Corporate-ADE-Baseline.json` | `ADE-TOKEN-NAAM` | oui (`isDefault: true`) |

`isDefault: true` signifie que chaque appareil synchronisé depuis Apple Business sous ce token reçoit
ce profil. C'est voulu — Microsoft recommande d'avoir un profil par défaut le plus tôt possible, car un
appareil synchronisé sans profil que l'on allume échoue à l'inscription.

## Le schéma est plat

`depMacOSEnrollmentProfile` n'a **pas** d'objets imbriqués `managementSettings` / `accountSettings` /
`setupAssistant`. Toutes les propriétés sont au niveau racine, et Graph n'accepte pas de noms
inconnus. Les champs de documentation (`_meta`, `_recommendations`, `changeLog`) ont donc leur place
dans ce fichier, pas dans le JSON.

## Pourquoi ces valeurs

### Management settings — quatre qui vont ensemble

| Propriété | Valeur | Libellé de l'interface |
|---|---|---|
| `requiresUserAuthentication` | `true` | Enroll with user affinity |
| `enableAuthenticationViaCompanyPortal` + `configurationWebUrl` | les deux `true` | Setup Assistant with modern authentication |
| `waitForDeviceConfiguredConfirmation` | `true` | Await final configuration |
| `profileRemovalDisabled` | `true` | Locked enrollment |

`profileRemovalDisabled` est **irréversible** après l'inscription — le modifier exige un effacement.
`waitForDeviceConfiguredConfirmation` est de toute façon imposé dès que vous configurez des comptes
locaux, même si vous le désactiviez.

### Comptes

`mlapsadmin` est géré par LAPS : Intune génère un mot de passe aléatoire de 15 caractères et le
conserve chiffré. C'est pourquoi `adminAccountPassword` n'y figure pas. La rotation tous les 14 jours
est un choix ; la valeur par défaut d'Intune est de six mois.

En suspens, non résolu par ce fichier :

- **La rotation ne restreint pas la lecture.** Qui peut consulter le mot de passe séquestré se règle
  avec RBAC/PIM, pas ici. Vérifiez qui détient ce rôle.
- **`mlapsadmin` est prévisible à l'échelle du tenant.** Pour un administrateur gérant plusieurs
  clients, un nom par client (`<prefix>-<codeclient>-adm`) est préférable.
- **`supportPhoneNumber` vaut `SERVICEDESK-TELEFOON-INVULLEN`.** L'utilisateur voit ce numéro pendant
  la configuration ; renseignez-le pour chaque organisation avant de créer le profil.
- **Vérifiez que le séquestre est activé** sous Devices → macOS → Local admin password, sinon le mot
  de passe change bien mais ne peut pas être récupéré.

Le compte principal est `setPrimarySetupAccountAsRegularUser: true` — un compte **standard**, pas
administrateur. C'est possible parce que `mlapsadmin` remplit le rôle d'administrateur ; macOS exige au
moins un compte administrateur.

Les deux champs de préremplissage acceptent des variables différentes :

| Propriété | Autorisé |
|---|---|
| `primaryAccountUserName` | `{{partialupn}}` · `{{serialNumber}}` · `{{managedDeviceName}}` · `{{OnPremisesSamAccountName}}` |
| `primaryAccountFullName` | `{{username}}` · `{{serialNumber}}` · `{{OnPremisesSamAccountName}}` |

### Écrans du Setup Assistant

`true` = masqué. Laissés visibles :

| Écran | Pourquoi |
|---|---|
| Location Services | nécessaire pour le fuseau horaire |
| Touch ID | les utilisateurs le veulent, et il prend en charge Platform SSO avec Secure Enclave |
| Accessibility | le masquer désactive VoiceOver pendant la configuration — voir ci-dessous |
| Appearance / Choose your Look | inoffensif, un clic |

Deux écrans sont masqués parce que la baseline impose déjà ce paramètre — ne laissez pas
l'utilisateur choisir ce qui relève de la stratégie :

| Écran | Imposé par |
|---|---|
| FileVault | `Baseline_MAC_D_FileVault` |
| iCloud Storage (Bureau et Documents) | `Baseline_MAC_U_Microsoft_OneDrive_KFM` |

Le reste est du bruit grand public sur un Mac d'entreprise.

## Nouveaux volets : `enabledSkipKeys`

Wallpaper, Lockdown mode, Intelligence, Terms of Address, Software update et OS Showcase n'ont
**pas de propriété propre** dans le schéma Graph. Ils passent par `enabledSkipKeys` avec les noms
SkipKeys d'Apple, repris de
[apple/device-management → other/skipkeys.yaml](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
(22 des 51 clés s'appliquent à macOS) :

| SkipKey | À partir de macOS | Écran | Ici |
|---|---|---|---|
| `SoftwareUpdate` | 15.4 | mise à jour logicielle automatique | masqué |
| `UpdateCompleted` | 26.1 | Software Update Complete | masqué |
| `EnableLockdownMode` | 14.0 | Lockdown Mode | masqué |
| `Intelligence` | 15.0 | Apple Intelligence | masqué |
| `TermsOfAddress` | 13.0 | forme d'adresse | masqué |
| `OSShowcase` | 26.1 | OS Showcase | masqué |
| `Wallpaper` | 14.1 | fond d'écran | masqué |
| `AppStore` | 11.1 | App Store | visible |
| `Appearance` | 10.14 | Choose your Look | visible |
| `Welcome` | 15.0 | Get Started | visible |

N'ajoutez **pas** ici de clés qui ont déjà leur propre propriété (`Accessibility`, `Biometric`,
`DisplayTone`, `FileVault`, `iCloudDiagnostics`, `iCloudStorage`, `Location`, `Payment`,
`Privacy`, `ScreenTime`, `Siri`, `UnlockWithWatch`) — vous configureriez alors le même écran deux fois.

Ces noms viennent d'Apple ; qu'Intune les transmette tels quels est plausible mais je ne l'ai pas
testé. Vérifiez avec `-Export` après avoir défini l'un de ces écrans dans le portail.

## Trois décisions encore réversibles

**1. Apple ID masqué.** IntuneIRL garde cet écran visible parce que les Managed Apple Accounts lient
leur connexion au token PSSO ; le guide ADE de MBaranekTech le masque au contraire, pour éviter un
Apple ID personnel sur du matériel d'entreprise. Ici, il est **masqué**. Si vous utilisez des Managed
Apple Accounts, mettez `appleIdDisabled` à `false`.

**2. Accessibility visible.** Microsoft documente que le masquer rend VoiceOver inutilisable pendant
la configuration ; le guide ADE qualifie cela de risque d'accessibilité. C'est pourquoi il est visible
ici, même si la proposition reçue le masquait. Si vous voulez tout de même le retirer :
`accessibilityScreenDisabled: true`.

**3. Le compte principal est créé à l'avance.** Cela fonctionne sur macOS 14, 15 et 26 et correspond
à ce qui est actuellement dans le tenant. Si vous comptez utiliser Platform SSO pendant le Setup
Assistant, PSSO crée lui-même le compte via `EnableCreateUserAtLogin` et le créer à l'avance fait
double emploi :

```jsonc
"skipPrimarySetupAccountCreation": true,
"dontAutoPopulatePrimaryAccountInfo": true
// et omettre primaryAccountUserName / primaryAccountFullName
```

Ne le faites qu'une fois les trois prérequis PSSO en place (macOS 26+, Company Portal 5.2604+ en tant
qu'application LOB, et `Enable Registration During Setup` dans `Baseline_MAC_D_Platform_SSO.json`).
Sans ces trois éléments, vous vous retrouvez avec un Mac qui n'a qu'un compte administrateur masqué.

## Alignement avec Platform SSO

`Baseline_MAC_D_Platform_SSO.json` définit `TokenToUserMapping → AccountName = preferred_username`,
ce qui donne l'**UPN complet**. Ce profil crée déjà un compte avec `{{partialupn}}`, le nom
**court**. Ces deux-là ne désignent pas la même chaîne. Testez sur un Mac si vous obtenez un compte
ou deux.

`usePlatformSSODuringSetupAssistant` vaut `false`. Graph documente littéralement : *"This
value cannot be TRUE when configurationWebUrl is TRUE."* — et `configurationWebUrl` est précisément
ce qui active l'authentification moderne. Si vous voulez cette voie, construisez ce profil dans le
portail et exportez le résultat ici. Le script bloque la mauvaise combinaison avant le POST.

## Utilisation

```powershell
# Ce qui se passerait
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Path .\enrollment\macos\macOS-Corporate-ADE-Baseline.json -WhatIf

# Créer
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Path .\enrollment\macos\macOS-Corporate-ADE-Baseline.json

# Récupérer un profil existant en JSON (pour consigner le travail manuel fait dans le portail)
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Export -OutDir .\enrollment\macos
```

Un groupe Entra dynamique sur le nom du profil épargne du travail manuel lors de l'affectation
d'applications et de stratégies (pas du profil d'inscription lui-même — celui-ci s'affecte par numéro
de série sous le token) :

```
(device.deviceOSType -eq "MacMMP") and
(device.enrollmentProfileName -eq "macOS Corporate ADE Baseline")
```

L'affectation reste un travail manuel dans le portail : **Enrollment program tokens → token → Devices →
Assign policy**, ou **Set Default Policy**.

## Modifications

| Date | Modification | Raison |
|---|---|---|
| 2026-08-18 | `diagnosticsDisabled` : false → true | minimisation des données (RGPD) ; pas d'opt-in pour les diagnostics Apple |
| 2026-08-18 | `SoftwareUpdate` + `UpdateCompleted` vers `enabledSkipKeys` | la cadence des mises à jour relève de la stratégie de mise à jour centrale d'Intune, pas de l'utilisateur pendant l'OOBE |
| 2026-08-18 | `appleIdDisabled` : false → true | pas d'Apple ID personnel sur du matériel d'entreprise |
| 2026-08-18 | `enabledSkipKeys` rempli à partir du schéma d'Apple | Lockdown mode, Intelligence, Terms of Address, OS Showcase, Wallpaper n'ont pas de propriété propre |

Masquer `Intelligence` ne fait que sauter l'écran d'opt-in — cela ne bloque pas la fonctionnalité.
Si Apple Intelligence doit vraiment être désactivé, c'est une stratégie settings catalog distincte.

## Sources

- [Set up automated device enrollment (ADE) for macOS](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/setup-automated-macos)
- [depMacOSEnrollmentProfile — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-enrollment-depmacosenrollmentprofile?view=graph-rest-beta)
- [Apple SkipKeys — apple/device-management](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
- [Add Platform SSO policy to ADE Profile on macOS devices](https://learn.microsoft.com/en-us/intune/device-configuration/settings-catalog/configure-platform-sso-during-enrollment)

## Le Portail d'entreprise demande une configuration alors que le Mac est déjà inscrit

`requiresUserAuthentication`, `enableAuthenticationViaCompanyPortal` et `configurationWebUrl`
valent tous trois `true` — *Setup Assistant with modern authentication*. Le Mac s'inscrit pendant le
Setup Assistant, et le Portail d'entreprise finalise ensuite l'affinité utilisateur. Que le portail
demande pour cela une configuration est normal en soi.

**Mais il continue parfois à la demander alors que l'inscription est terminée depuis longtemps.** Sur
un Mac de test, tout était correct et le portail affichait *malgré tout* *Install management profile*.
Vérifiez donc d'abord ce qui est réellement en place, avant de toucher à ce bouton :

```bash
profiles status -type enrollment
ls -ld "/Library/Intune/Microsoft Intune Agent.app"
```

Si l'on voit `Enrolled via DEP: Yes` avec `MDM enrollment: Yes (User Approved)` et que l'agent est
présent, l'inscription est terminée et l'invite n'a aucun sens. **Ne cliquez alors pas sur *Download
profile*.** Cela lance le flux d'inscription manuelle sur un Mac déjà géré, ce qui produit un second
enregistrement d'appareil avec deux canaux MDM qui se contrarient.

S'il manque réellement quelque chose, c'est cela qu'il faut régler en premier, et non le script :

- Sans inscription achevée, le **Microsoft Intune management agent** ne s'installe pas, et il est
  nécessaire pour chaque script shell.
- Sans affinité utilisateur, tout ce qui est lié à un **groupe d'utilisateurs** reste bloqué.

Dans le portail, les deux cas apparaissent comme `Result: NotRun`, ce qui sonne comme « encore un peu
de patience » alors que, structurellement, rien ne va se passer. C'est pourquoi ces deux commandes
passent avant tout diagnostic de script.

Si tout est en ordre et que `NotRun` s'affiche malgré tout, il suffit d'attendre l'agent : il
récupère les scripts **toutes les 8 heures**, indépendamment de la synchronisation MDM.

Comme le clic pour l'enregistrement d'écran (voir [`shellscripts/macos/`](../../shellscripts/macos/README.fr.md)),
l'affinité utilisateur est une action par Mac qu'aucune stratégie ne peut reprendre. Les deux font
partie de la remise d'un nouvel appareil.
