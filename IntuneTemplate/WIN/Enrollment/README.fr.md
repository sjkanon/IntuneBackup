[Nederlands](README.md) · [English](README.en.md) · **Français**

# Windows Autopilot : classique et device preparation

Deux façons de préparer un nouveau PC Windows pendant l'OOBE. Les deux peuvent coexister dans un
même tenant, mais **un appareil donné n'en exécute jamais qu'une seule**. Aucune n'est l'un des
cinq types de template CIPP ; elles ne se déploient donc pas par un package CIPP.
CIPP propose en revanche trois *standards* pour elles ; voir [Déploiement](#déploiement).

| Fichier | Quoi | Variante |
|---|---|---|
| [`WIN-Autopilot-Deployment-Profile.json`](WIN-Autopilot-Deployment-Profile.json) | profil de déploiement (`azureADWindowsAutopilotDeploymentProfile`) | classique (v1) |
| [`WIN-Autopilot-Enrollment-Status-Page.json`](WIN-Autopilot-Enrollment-Status-Page.json) | Enrollment Status Page (`windows10EnrollmentCompletionPageConfiguration`) | classique (v1) |
| [`WIN-Autopilot-Device-Preparation.json`](WIN-Autopilot-Device-Preparation.json) | stratégie device preparation (settings catalog, template `80d33118-…_1`) | device preparation (v2) |
| [`../../../scripts/New-WindowsAutopilotPolicy.ps1`](../../../scripts/New-WindowsAutopilotPolicy.ps1) | crée chacun des trois à partir de son JSON, gère le groupe d'appareils pour la v2, exporte avec `-Export` | les deux |

## Quelle variante

| Besoin | Classique | Device preparation |
|---|:---:|:---:|
| Jonction Microsoft Entra | ✅ | ✅ |
| Jonction **hybride** Microsoft Entra | ✅ | ❌ |
| Pré-provisionnement (white glove), auto-déploiement (kiosque), Autopilot reset | ✅ | ❌ |
| Windows 10 | ✅ | ❌ |
| Enregistrer l'appareil à l'avance (hachage matériel) | obligatoire | pas nécessaire |
| Bloquer la phase utilisateur jusqu'à ce que les apps et stratégies utilisateur soient en place | ✅ (ESP utilisateur) | ❌ |
| Apps Win32 et LOB dans le même déploiement | ❌ | ✅ |
| Rapport quasi en temps réel, avec journaux en cas d'échec | ❌ | ✅ |
| Max. d'apps pendant l'OOBE | 100 (ESP) | 25 apps + 10 scripts |

**Laquelle l'emporte.** Si un appareil est enregistré comme appareil Autopilot, c'est le profil
classique qui s'exécute, sauf si l'appareil est lié au tenant par *device association* : dans ce
cas device preparation l'emporte. Pour utiliser device preparation sur un appareil enregistré sans
association, il faut d'abord le *désenregistrer* d'Autopilot.

**Recommandation.** Device preparation pour les nouveaux portables Windows 11 joints à Entra qui
partent directement chez l'utilisateur. Garder le classique pour le pré-provisionnement par un
partenaire, les appareils kiosque et de salle de réunion, la jonction hybride, et les appareils
que le fournisseur enregistre déjà. C'est pourquoi `hardwareHashExtractionEnabled` est à `false`
dans le profil classique. À `true`, Intune enregistre dans Autopilot chaque appareil géré du groupe
affecté, et à partir de là un tel appareil ne reçoit plus device preparation.

## Prérequis

Pour les deux :

- **Entra ID → Devices → Device settings → Users may join devices to Microsoft Entra** : *All*, ou
  un groupe contenant tous les utilisateurs qui préparent eux-mêmes un PC. Sans cela, l'OOBE
  s'arrête à la connexion.
- **Windows automatic enrollment** : MDM user scope sur *All* ou sur ce même groupe.
- Une licence avec Entra ID P1 et Intune (Business Premium, E3/E5, EMS) **attribuée à
  l'utilisateur**.
- **Company branding** dans Entra ID. Sans personnalisation, *masquer les options de changement de
  compte* n'a aucun effet.
- [`Baseline_WIN_D_Enrollment_Hardening`](../SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.fr.md)
  exige un réseau pendant l'OOBE. Cela convient aux deux variantes : aucune ne fonctionne hors
  ligne.
- **Inscription Windows personnelle bloquée ?** Un appareil enregistré dans Autopilot compte
  automatiquement comme appareil d'entreprise. Device preparation nécessite alors des *corporate
  identifiers* (fabricant, modèle, numéro de série) ou la *device association*, sinon l'inscription
  est refusée.

En plus pour device preparation :

- Windows 11 24H2 ou ultérieur, ou 22H2/23H2 avec KB5035942 (média d'installation d'avril 2024 ou
  ultérieur). Vérifiez auprès du fournisseur quelle build est livrée sur les nouveaux appareils.
- Un **groupe de sécurité pour les appareils** dont le principal de service **Intune Provisioning
  Client** (appId `f1346770-5b25-470b-88bd-d5744ab7952c`) est propriétaire. Dans certains tenants
  il s'appelle *Intune Autopilot ConfidentialClient* ; c'est l'appId qui compte. Le script crée les
  deux avec `-CreateDeviceGroup`.
- RBAC pour qui le gère : *Enrollment programs → Enrollment time device membership assignment* en
  plus des droits habituels sur les device configurations.

## Classique : profil de déploiement + Enrollment Status Page

### Profil de déploiement

| Propriété | Valeur | Pourquoi |
|---|---|---|
| `displayName` | `CXNM Standard WIN Autopilot User Driven` | **Pas de tirets.** Intune n'accepte dans un nom de profil que des lettres, des chiffres, des espaces et `: " ? . @ $ & _ [ ] { } \| \`. Un tiret provoque une erreur 500 brute, sans motif. C'est pourquoi ce nom s'écarte de la convention `CXNM - Standard - …`. |
| `outOfBoxExperienceSetting.deviceUsageType` | `singleUser` | piloté par l'utilisateur ; `shared` correspond à l'auto-déploiement et relève d'un profil kiosque distinct |
| `outOfBoxExperienceSetting.userType` | `standard` | l'utilisateur ne devient pas administrateur local ; le travail d'administration passe par LAPS |
| `preprovisioningAllowed` | `true` | un partenaire ou le service desk peut pré-provisionner les appareils (touche Windows 5× dans l'OOBE). Sans effet si personne ne l'utilise. |
| `hardwareHashExtractionEnabled` | `false` | voir [Quelle variante](#quelle-variante) |
| `escapeLinkHidden` · `privacySettingsHidden` · `eulaHidden` | `true` | pas d'écrans grand public ; les paramètres de confidentialité viennent des stratégies |
| `keyboardSelectionPageSkipped` | `false` | en Belgique, azerty-be, azerty-fr et qwerty varient selon l'utilisateur. Avec une seule disposition, mettez-le à `true` et `locale` sur une langue fixe. |
| `locale` | `os-default` | la langue de l'image Windows |
| `deviceNameTemplate` | vide | Windows garde le nom qu'il choisit lui-même. Pour un nom fixe : **15 caractères** au maximum une fois les macros remplacées (NetBIOS), `%SERIAL%` ou `%RAND:x%`, par exemple `PFX-%RAND:6%`. Le script refuse un modèle de plus de 15 caractères. |

À affecter à un **groupe d'appareils** enregistrés. Un groupe dynamique capte tout ce qui est dans
Autopilot :

```
(device.devicePhysicalIDs -any (_ -startsWith "[ZTDid]"))
```

Ou un seul group tag (par exemple pour un second profil kiosque) :

```
(device.devicePhysicalIDs -any (_ -eq "[OrderID]:KIOSK"))
```

L'enregistrement passe par le fournisseur ou le revendeur (ID partenaire dans le centre
d'administration Microsoft 365), par `Get-WindowsAutopilotInfo -Online` sur l'appareil lui-même,
ou par CSV dans **Devices → Enrollment → Devices → Import**. CIPP le fait aussi : **Endpoint →
Autopilot → Add Autopilot Device**.

### Enrollment Status Page

| Propriété | Valeur | Pourquoi |
|---|---|---|
| `trackInstallProgressForAutopilotOnly` | `true` | uniquement avec Autopilot ; une inscription manuelle ou un appareil existant n'a pas d'ESP |
| `showInstallationProgress` | `true` | sans cela, pas d'ESP |
| `selectedMobileAppIds` | vide | bloque sur **toutes** les apps affectées à l'appareil. Si cela devient trop, choisissez les apps essentielles. |
| `installProgressTimeoutInMinutes` | `90` | 60 est juste dès que les mises à jour qualité ci-dessous s'exécutent aussi |
| `installQualityUpdates` | `true` | l'appareil est à jour avant que l'utilisateur ne voie le bureau ; coûte 20 à 40 minutes et parfois un redémarrage |
| `allowDeviceUseOnInstallFailure` | `false` | pas de bureau sans la baseline |
| `allowDeviceResetOnInstallFailure` · `allowLogCollectionOnInstallFailure` | `true` | l'utilisateur peut recommencer et transmettre les journaux au service desk |
| `blockDeviceSetupRetryByUser` | `false` | réessayer est permis |
| `disableUserStatusTrackingAfterFirstUser` | `true` | seul le premier utilisateur attend la phase utilisateur |
| `priority` | `1` | ignorée dans le POST. Le script la définit ensuite avec `setPriority`. |

À affecter au même groupe d'appareils que le profil. L'ESP par défaut (*All users and all
devices*) reste inchangée.

**Redémarrage entre la phase appareil et la phase utilisateur.** OIB affecte Device Guard et
Credential Guard aux utilisateurs pour éviter un redémarrage au milieu d'Autopilot. Ici ils sont au
niveau appareil
([`Baseline_WIN_D_Device_Guard_and_Credential_Guard`](../SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md)),
attendez-vous donc à un redémarrage après la phase appareil. L'utilisateur se reconnecte ensuite.
Ce n'est pas une erreur. Mentionnez-le dans les instructions de remise.

## Device preparation (Autopilot v2)

Fonctionnement :

1. L'utilisateur se connecte pendant l'OOBE. Intune cherche la stratégie device preparation
   affectée à un **groupe d'utilisateurs** de cet utilisateur.
2. Pendant l'inscription, l'appareil rejoint le **groupe d'appareils** de la stratégie. Ce lien ne
   passe pas par le paramètre `devicesecuritygroupids` de la stratégie, car ce texte n'est que ce
   qu'affiche le portail. Il passe par l'action distincte `setEnrollmentTimeDeviceMembershipTarget`.
   Une stratégie créée uniquement à partir du corps n'a donc **aucun** groupe d'appareils. Le script
   appelle cette action.
3. Pendant l'OOBE, l'appareil n'attend **que** les apps et scripts choisis dans la stratégie. Ils
   doivent *aussi* être affectés au groupe d'appareils. Tout le reste (les stratégies de la
   baseline, les autres apps) arrive après le bureau, à la première synchronisation. Depuis
   septembre 2026, l'Intune Management Extension se synchronise juste après l'OOBE.

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| Deployment mode / type / join type | user-driven · single user · Entra join | les seules options que connaît la définition du paramètre (`_0`). CIPP propose aussi *hybrid* et *shared*, mais ces valeurs n'existent pas. |
| User account type | Standard user | comme en classique |
| Minutes allowed before showing installation error | `90` | de la marge pour 25 apps et les mises à jour qualité qui s'exécutent pendant l'OOBE depuis 2025 |
| Allow users to skip setup after multiple attempts | No | pas de bureau sans les apps choisies |
| Show link to diagnostics | Yes | l'utilisateur peut transmettre les journaux ; le rapport les collecte aussi lui-même en cas d'échec |
| Custom error message | trilingue | un seul champ pour tous les utilisateurs |
| Device security group | vide | par tenant, via le script ou le portail |
| Allowed applications / scripts | pas dans le fichier | les id d'apps sont propres au tenant. À ajouter dans le portail une fois affectées au groupe d'appareils. |

Candidates pour la liste d'apps dans ce dépôt :
[`remove-mcafee`](../Apps/remove-mcafee/README.fr.md) (avant que Defender ne devienne
actif), Microsoft 365 Apps, Portail d'entreprise.
[`winget-autoupdate`](../Apps/winget-autoupdate/README.fr.md) n'y a pas sa place : il saute
volontairement sa première exécution pendant l'OOBE.

**BitLocker 256 bits.** Jusqu'à la mise à jour Windows du 14 septembre 2026 (KB5124012), le
chiffrement automatique de l'appareil démarrait parfois pendant device preparation avant
l'arrivée de la stratégie BitLocker. Le disque de l'OS recevait alors la valeur par défaut de
Windows, XTS-AES 128, au lieu du XTS-AES 256 de
[BitLocker](../SettingsCatalog/Baseline_WIN_D_BitLocker.fr.md). Cela reste ainsi, car la méthode
est figée dès que le chiffrement commence. À partir de KB5124012, Windows attend la stratégie
pendant l'OOBE. Deux conséquences :

- Testez sur la build qui vous est livrée. Une image sans le correctif a encore le problème.
  Chez Patch My PC, 26200.9550 fonctionnait et 26200.9457 pas encore.
- Les appareils déjà provisionnés via device preparation peuvent être en 128 bits.
  [Compliance BitLocker](../CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.fr.md) vérifie
  seulement si le disque est chiffré, donc ces appareils restent conformes. Vérifiez avec
  `(Get-BitLockerVolume C:).EncryptionMethod`. Revenir à 256 bits impose de déchiffrer puis de
  chiffrer à nouveau.

Après l'inscription, le nom de la stratégie figure dans `enrollmentProfileName`. Utilisez-le pour
un groupe dynamique de tout ce qui est arrivé par device preparation :

```
(device.enrollmentProfileName -eq "CXNM - Standard - WIN - Autopilot Device Preparation")
```

Si vous renommez la stratégie, adaptez cette règle.

### Device association : ce que ce fichier ne fait pas encore

Depuis le 27 août 2026, device preparation peut lier un appareil au tenant avant l'inscription
(*device association*). Cela utilise une attestation TPM et un marqueur dans l'UEFI. Cela apporte
des paramètres que le profil classique avait déjà :

- langue et clavier
- masquer le CLUF et l'écran de confidentialité
- masquer les options de changement de compte
- un modèle de nom d'appareil
- l'affectation à l'appareil plutôt qu'à l'utilisateur
- l'appareil compte automatiquement comme appareil d'entreprise

Prérequis : un appareil physique avec TPM 2.0, Windows 11 24H2 ou 25H2 avec KB5120998, et l'accès à
`ztd.dds.microsoft.com` et aux points de terminaison `*.attest.azure.net` de la
[documentation Microsoft](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/requirements).

Le settings catalog connaît ces paramètres (`enrollment_autopilot_dpp_language`, `_skipeula`,
`_skipexpress`, `_skipkeyboard`, `_forcedenrollment`, `_applydevicerenametemplate`, `_enablequ`,
`_enablecue`, `_allowedpolicyids`). Ils appartiennent à un second template, `70d256b3-…_1`, avec
18 paramètres. Les `settingInstanceTemplateId` de ce template ne figurent dans aucune source
publique, et une stratégie de template sans les bons id est refusée. C'est pourquoi ce fichier
utilise le template à 12 paramètres, que CIPP, le provider terraform et deux autres baselines
utilisent de façon identique.

Si vous voulez l'association : créez la stratégie une fois dans le portail, récupérez-la avec
`New-WindowsAutopilotPolicy.ps1 -Export` et placez le résultat ici (sans id de groupe ni d'app).

## Déploiement

### Via CIPP

CIPP a un standard pour chacun des trois (**Tenant → Standards → Intune Standards**). Avec ces
valeurs, ils correspondent aux fichiers d'ici :

| Standard | Paramètre | Valeur | Attention |
|---|---|---|---|
| **Enable Autopilot Profile** | Profile Display Name | `CXNM Standard WIN Autopilot User Driven` | sans tirets ; CIPP le vérifie |
| | Convert all targeted devices to Autopilot | **désactivé** | **activé** par défaut |
| | Enable Self-deploying Mode | **désactivé** | **activé** par défaut ; activé signifie un profil kiosque sans utilisateur |
| | Allow White Glove OOBE | activé | |
| | Setup user as a standard user · Hide Terms · Hide Privacy · Hide Change Account | activé | CIPP active toujours Hide Change Account |
| | Automatically configure keyboard | désactivé | voir plus haut |
| | Assign to all devices | au choix | *All devices* ne touche que les appareils enregistrés |
| **Enrollment Status Page settings** | Timeout · Install Windows quality updates | `90` · activé | |
| | Show progress · Log collection · Only show during OOBE · Block device usage · Allow reset | activé | |
| | Allow device use on failure | désactivé | |
| **Deploy Device Prep Profile** | Profile Display Name | `CXNM - Standard - WIN - Autopilot Device Preparation` | |
| | Deployment Type · Join Type · Account Type | Single user · Microsoft Entra join · Standard user | *Shared* et *hybrid* n'existent pas dans la définition |
| | Timeout · Allow skip · Allow diagnostics | `90` · désactivé · activé | |
| | Device Security Group Name · Create new group | le nom du groupe · activé | CIPP le crée avec l'Intune Provisioning Client comme propriétaire |
| | Policy Assignment | Do not assign | affecter à un groupe d'utilisateurs dans le portail ; CIPP ne propose que *All users* |

Trois différences avec le script :

- Le standard ESP modifie l'**ESP par défaut** (*All users and all devices*, priorité 0) au lieu de
  créer une ESP distincte. Avec *Only show during OOBE* activé, les autres inscriptions ne s'en
  aperçoivent pas.
- Le standard device preparation ne met **aucune app ni aucun script** dans la stratégie. En cas
  d'écart des paramètres, il **supprime** la stratégie et la recrée. Les apps choisies ensuite dans
  le portail disparaissent alors. Après le premier déploiement, passez ce standard en *Report* ou
  *Alert*, pas en *Remediate*.
- CIPP écrase lors de son exécution suivante les modifications faites dans le portail au profil
  classique.

### Via le script

```powershell
# Classique
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Deployment-Profile.json -WhatIf
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Enrollment-Status-Page.json

# Device preparation, avec groupe d'appareils (créé s'il manque)
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Device-Preparation.json `
    -DeviceGroupName 'WIN - Autopilot Device Preparation - Devices' -CreateDeviceGroup

# Ce qui se trouve dans le tenant, en JSON (y compris ce qui a été créé dans le portail)
.\scripts\New-WindowsAutopilotPolicy.ps1 -Export
```

Le script refuse un objet dont le nom existe déjà et **n'affecte rien**. Un profil sur le mauvais
groupe change la façon dont chaque nouvel appareil est préparé. C'est pourquoi l'affectation se
fait dans le portail :

- le profil et l'ESP au groupe d'appareils enregistrés ;
- la stratégie device preparation à un **groupe d'utilisateurs**.

## Phase

| Élément | Phase | Quand avancer |
|---|---:|---|
| Profil classique + ESP | 2 | affecter à un groupe pilote d'appareils enregistrés ; après une préparation réussie (redémarrage compris), au groupe dynamique `[ZTDid]` |
| Device preparation | 3 | attend de nouveaux appareils sous Windows 11 24H2+ avec KB5124012 ou ultérieur (BitLocker 256 bits), le groupe d'appareils, et la décision sur le flux d'appareils qui reste en classique |

Aucun des deux ne touche les appareils existants. Ils ne s'appliquent qu'au prochain OOBE.

## Sources

- [Compare Windows Autopilot device preparation and Windows Autopilot](https://learn.microsoft.com/en-us/autopilot/device-preparation/compare)
- [Windows Autopilot device preparation requirements](https://learn.microsoft.com/en-us/autopilot/device-preparation/requirements)
- [What's new in Windows Autopilot device preparation](https://learn.microsoft.com/en-us/autopilot/device-preparation/whats-new)
- [Autopilot Device Preparation BitLocker 256-bit issue fixed — Patch My PC](https://patchmypc.com/blog/autopilot-device-preparation-bitlocker-256-bit-issue/)
- [Overview of Windows Autopilot device association](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/overview)
- [windowsAutopilotDeploymentProfile — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-enrollment-windowsautopilotdeploymentprofile?view=graph-rest-beta)
- [windows10EnrollmentCompletionPageConfiguration — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-onboarding-windows10enrollmentcompletionpageconfiguration?view=graph-rest-beta)
- Définitions des paramètres : [pl4nty/intune-change-tracking](https://github.com/pl4nty/intune-change-tracking), `DCv2/Settings/enrollment_autopilot_dpp_*.json`
- Id de template et d'instance : CIPP-API `Invoke-CIPPStandardDevicePrepProfile.ps1`, terraform-provider-microsoft365 `windows_autopilot_device_preparation_policy/constants.go`
