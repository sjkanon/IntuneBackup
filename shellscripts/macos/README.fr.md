[Nederlands](README.md) · [English](README.en.md) · **Français**

# Scripts shell macOS

Les scripts shell Intune (`deviceShellScripts`) se trouvent **en dehors** de `IntuneTemplate/`, pour la même
raison que les [profils d'inscription ADE](../../enrollment/macos/README.fr.md) : les pipelines de ce dossier
connaissent cinq types de stratégies CIPP, et un script shell n'en fait pas partie. Il se situe sous
`deviceManagement/deviceShellScripts`, `Set-CIPPIntunePolicy` n'a pas de `TemplateType` pour lui,
et `Start-IntuneRestoreConfig` ne le restaure pas. Un fichier placé ici n'est donc **pas**
pris en compte par `generate-baseline.js`, `export-intunebackup.js`, `check-scope.js` ou
`Set-BaselineAssignment.ps1`, et il n'a pas de `checkId`.

| Fichier | Ce qu'il fait | Portée |
|---|---|---|
| `configure-dock.sh` | Configure le Dock une fois par utilisateur, puis n'y touche plus | Utilisateur |
| `mount-azure-files.sh` | Installe un LaunchAgent qui monte le partage Azure Files dans la session de l'utilisateur | Appareil |
| `nudge-screen-recording.sh` | Demande à l'utilisateur d'activer l'enregistrement de l'écran pour les outils d'assistance à distance (NinjaOne et TeamViewer par défaut), et ouvre le panneau | Utilisateur |

## configure-dock.sh

Place les applications de l'entreprise dans le Dock et en retire la sélection par défaut d'Apple — Safari, Mail, Calendrier,
Contacts, Notes, Rappels, Messages, FaceTime, Photos, Musique, TV, Podcasts,
Plans, News, App Store et Freeform. Elles ne sont pas retirées une par une : le script
remplace la liste `persistent-apps` *entière*, afin de ne pas se désynchroniser de ce qu'Apple
placera par défaut dans le Dock dans une future version de macOS.

De gauche à droite : Outlook, Teams, Edge, Word, Excel, PowerPoint, Windows App, OneDrive,
Portail d'entreprise, Réglages Système. Finder et la Corbeille n'y figurent pas — macOS les gère
lui-même et ils ne peuvent pas être déplacés.

### Paramètres dans Intune

Devices → macOS → Shell scripts → Add.

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| Run script as signed-in user | **Yes** | sans cela, `defaults` écrit dans le Dock de root et l'utilisateur ne voit rien |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | |
| Max number of retries | 3 | |

Affecter à un **groupe d'utilisateurs** (All Users), pas aux appareils : le Dock est propre à chaque
utilisateur, et sur un Mac partagé chaque utilisateur doit recevoir sa propre configuration.

### « Toutes les heures » et « une seule fois » ne se contredisent pas

Dès que le Dock est en place, le script écrit un marqueur dans
`~/Library/Application Support/Baseline/dock-configured` et chaque exécution suivante s'arrête immédiatement.
La répétition ne sert que pour la première fois : sur un nouveau Mac, ce script s'exécute presque
toujours avant qu'Intune n'ait déployé les applications M365. Si vous choisissiez « Not configured » (une exécution,
plus jamais), un tel appareil garderait définitivement un Dock à moitié configuré.

Tant que des applications manquent, le script ne touche pas au Dock et réessaie l'heure
suivante. Après 30 tentatives infructueuses — un peu plus d'une journée — il configure le Dock avec ce qui *est*
présent et note dans `dock.log` les applications manquantes. Sinon, attendre une application qui n'arrive jamais
(non affectée, installation échouée) donne un Dock qui ne sera jamais correct.

### Ensuite, le Dock appartient à l'utilisateur

Qui veut y ajouter ou en retirer quelque chose peut le faire. C'est un choix, pas une lacune : les
alternatives sont un `.mobileconfig` personnalisé avec `static-only` (Dock entièrement verrouillé, l'utilisateur
ne peut plus rien faire) ou ne rien faire.

Si vous voulez tout de même le verrouiller, ce script n'est pas le bon outil — il faut alors une
configuration d'appareil avec une charge utile `com.apple.dock`.

### Relancer

Supprimez le marqueur ; la prochaine exécution reconfigure le Dock :

```bash
rm -f ~/Library/Application\ Support/Baseline/dock-configured \
      ~/Library/Application\ Support/Baseline/dock-attempts
```

### Pourquoi pas le Settings Catalog

Le Settings Catalog *possède* bien des paramètres de Dock, mais ils sont défaillants dès qu'il y a plus d'une application : Intune
formate mal la liste et la charge utile n'arrive jamais sur l'appareil. Voir
[Microsoft Q&A 1164432](https://learn.microsoft.com/en-us/answers/questions/1164432/macos-settings-catalog-user-experience-dock-persis)
— toujours ouvert, et encore signalé en 2026. Avec une seule application cela fonctionne, si bien que qui fait l'essai
a facilement l'impression que tout va bien.

### Fins de ligne

`.gitattributes` impose LF pour `*.sh`. Ce dépôt est maintenu sous Windows avec
`core.autocrlf=true` ; sans cette règle, ce script reçoit des CRLF lors du checkout et échoue sur le
Mac avec `bad interpreter: /bin/bash^M`. Vérifiez-le après un envoi avec `file` ou `cat -A` —
Intune accepte le script sans broncher et l'erreur n'apparaît que sur l'appareil.

## mount-azure-files.sh

Monte un partage Azure Files dans `/Volumes` avec le ticket Kerberos délivré par Platform SSO,
de sorte que l'utilisateur n'a pas à saisir de mot de passe et que le partage apparaît dans la
barre latérale du Finder. L'équivalent macOS d'un mappage de lecteur, et le pendant de
[`Mount-AzureFilesDrive.ps1`](../../platformscripts/windows/README.fr.md) sous Windows.

### Pourquoi un script et pas un profil de configuration

Il n'existe pas de charge utile de mappage de lecteur. Les 18 329 `settingDefinitionId` du settings catalog
ont tous été examinés à la recherche de quoi que ce soit qui connecte un lecteur réseau ; cela n'existe pas, sur aucune des
deux plateformes. Apple dispose de `com.apple.finder_showmountedserversondesktop` — qui indique si un partage déjà monté
apparaît sur le bureau — et de rien d'autre. Monter est une action, pas un paramètre.

### Côté Azure : un second compte de stockage avec Entra Kerberos

S'applique aux **deux** plateformes — `Mount-AzureFilesDrive.ps1` sous Windows a exactement les mêmes
prérequis. La limitation à une seule source d'identité s'applique par compte de stockage et non par tenant,
donc un second compte à côté de l'existant résout le problème sans toucher à ce qui tourne déjà sur le premier
compte (par exemple un environnement AVD sur Entra Domain Services).

Un **nouveau** compte est en outre plus simple qu'un compte existant : la correction `CIFS/` → `cifs/`
sur l'identifier URI n'est nécessaire que pour les partages qui existaient déjà.

1. **Créez le compte de stockage** dans la même région que les utilisateurs, avec un partage de fichiers.
2. **Activez Entra Kerberos.** Dans le portail via *Data storage* → *File shares* →
   *Identity-based access* → *Microsoft Entra Kerberos* → *Set up*, ou :

   ```powershell
   Set-AzStorageAccount -ResourceGroupName "<rg>" -Name "<account>" `
       -EnableAzureActiveDirectoryKerberosForFile $true
   ```

   Azure enregistre alors automatiquement une application `[Storage Account] <account>.file.core.windows.net`.
3. **Accordez le consentement administrateur** sur cette application : Entra ID → Inscriptions d'applications → Toutes les applications → l'application
   portant le nom du compte de stockage → *Autorisations d'API* → *Accorder un consentement d'administrateur*.
   Sans cette étape, l'application existe mais rien ne se passe.
4. **Activez la prise en charge des groupes cloud-only.** Obligatoire dès que vous utilisez des identités cloud-only,
   et facile à oublier : un ticket Kerberos transporte au maximum 1 010 SID de groupe, et
   sans les bons `Tags` dans le manifeste de l'application, l'authentification échoue. Voir
   [Group SID limit in Entra Kerberos](https://learn.microsoft.com/en-us/entra/identity/authentication/kerberos#group-sid-limit-in-entra-kerberos-preview).
5. **Excluez l'application de la MFA.** Entra Kerberos ne gère pas la MFA. Si une
   stratégie Conditional Access s'applique à toutes les applications, celle-ci doit figurer dans la liste d'exclusion — recherchez
   `[Storage Account] <account>.file.core.windows.net`. Si vous l'oubliez, le symptôme est
   `System error 1327` lors d'un `net use`.
6. **Attribuez les autorisations au niveau du partage** (share-level permissions) au même groupe d'utilisateurs que celui auquel vous affectez
   le script. Ensuite, les droits NTFS dans le partage déterminent le reste.
7. **Renseignez le nom du compte** dans `shellscripts/macos/mount-azure-files.sh` et
   `platformscripts/windows/Mount-AzureFilesDrive.ps1`, et faites passer cette stratégie de la phase 3 à la
   phase 1.

Côté client : l'appareil doit être Entra joined ou Entra hybrid joined. Windows fonctionne alors
immédiatement — Entra Kerberos y est en disponibilité générale. Pour **macOS**, l'accès
à Azure Files via le ticket Platform SSO reste une préversion limitée que Microsoft doit activer
pour le tenant (azurefiles@microsoft.com) ; vous pouvez envoyer ce courriel dès maintenant, indépendamment du reste,
car c'est le maillon le plus lent.

Ce profil n'a **pas** besoin d'être modifié pour un autre compte de stockage : `Hosts` vaut
`.windows.net` et couvre ainsi tous les comptes dans Azure.

### Ce que font les autres, et ce qu'ils sacrifient

Il n'existe pas de solution élégante à ce problème ; il existe trois solutions qui sacrifient chacune
quelque chose de différent. Bon à savoir avant de commencer à bricoler cette construction.

| Approche | Qui | Ce que cela coûte |
|---|---|---|
| **Raccourci dans le Dock**, pas de montage | [Oktay Sari](https://allthingscloud.blog/revamping-network-drive-mappings-on-macos-with-intune/) (MVP) — `defaults write com.apple.dock persistent-others` avec une URL `smb://` | Ne résout pas l'authentification. Un clic affiche une fenêtre de connexion, sauf si Kerberos est en place séparément. |
| **Clé du compte de stockage dans le script** | [Llewellyn Hughes](https://www.llewellynhughes.co.uk/post/azure-map-drive-mac/) — `mount_smbfs -d 777 -f 777 //account:KEY@…` | La clé figure en clair dans le script et donne accès à tout le compte de stockage. Pas d'identité par utilisateur, pas de droits par personne. |
| **Kerberos, avec mot de passe en secours** | [42Loris/macOS_DriveMapping](https://github.com/42Loris/macOS_DriveMapping) — `mount_smbfs -N`, sinon un assistant trousseau | Rien côté sécurité, mais cela exige une source Kerberos fonctionnelle. Exige en outre un certificat Developer ID pour l'assistant. |

Cette baseline applique la troisième. Comme le côté Kerberos bloque dès que le compte de stockage a déjà
une autre source d'identité (AD DS ou Entra Domain Services), et qu'on ne la change pas comme ça, la
deuxième a été ajoutée comme **solution de secours** — voir ci-dessous.

### La clé du compte de stockage en secours

`STORAGE_KEY` en haut du script. La laisser vide signifie Kerberos uniquement ; si une clé est renseignée,
le script tente d'abord un ticket puis se rabat sur la clé. La clé est insérée dans l'URL
encodée en pourcentage, vous la collez donc telle qu'Azure la fournit.

Ce que vous sacrifiez ainsi, et c'est plus qu'il n'y paraît :

- **La clé ouvre tout le compte de stockage**, pas seulement ce partage. Si autre chose tourne sur le même
  compte, comme un environnement AVD, ces données sont donc également concernées.
- **Pas d'identité par utilisateur.** Quiconque monte le partage est le même « utilisateur ». Les droits par
  personne et la traçabilité dans les journaux n'existent pas, et les share-level permissions dans Azure
  ne servent plus à rien.
- **Quiconque peut lire le script possède la clé** — dans Intune, et sur l'appareil.

C'est pourquoi ce fichier contient un espace réservé vide et non la clé elle-même. **Ne la renseignez jamais
dans le dépôt.** La copie que vous envoyez dans Intune porte la vraie valeur ; ce qui est dans git reste
vide. Une clé qui a figuré une seule fois dans git y reste pour toujours, même après un commit qui
la supprime, et la rotation est alors la seule issue — avec tout ce qui en dépend.

Faites de toute façon une rotation de la clé dès que la voie Kerberos fonctionne, et plus tôt si elle est
passée par un endroit où elle n'a pas sa place : portail Azure → le compte de stockage → *Clés d'accès* →
*Effectuer une rotation de la clé*. Utilisez key2 pour le déploiement et gardez key1 en réserve, ainsi vous pouvez faire la rotation
sans tout casser d'un coup.

La clé apparaît brièvement dans la table des processus parce que `mount_smbfs` la reçoit en argument. Ce
n'est pas élégant, mais ce n'est pas le maillon le plus faible : la même clé figure de toute façon dans le script sur chaque
appareil. L'alternative est le trousseau, et sous macOS celui-ci affiche une boîte de dialogue d'autorisation
à moins que le même programme signé ne l'écrive et ne le lise — précisément la raison pour laquelle 42Loris
construit un assistant Swift dédié avec un certificat Developer ID.

### Pourquoi il y a un LaunchAgent

Un montage doit se faire dans la **session graphique de l'utilisateur**, et le processus que lance l'agent Intune
n'en fait pas partie. C'est l'explication du phénomène sur lequel nous sommes longtemps restés bloqués : le montage
à la main fonctionnait, et via Intune rien ne se passait.

C'est pourquoi le script Intune ne monte plus rien lui-même. La répartition des tâches :

| | fait quoi | s'exécute en tant que |
|---|---|---|
| Script Intune | installe l'assistant et le LaunchAgent dans `/Library` | **root** |
| LaunchAgent | monte, à la connexion et lors d'un changement de réseau | l'utilisateur connecté |

macOS charge un LaunchAgent situé dans `/Library/LaunchAgents/` **automatiquement pour chaque utilisateur à
chaque connexion**. Cela évite les complications de `launchctl bootstrap` depuis une session dans laquelle vous n'êtes
pas, et cela fonctionne immédiatement pour la personne suivante sur cet appareil. Pour la personne qui l'utilise *maintenant*,
le script d'installation charge aussi l'agent, pour ne pas avoir à se déconnecter.

Un montage ne survit pas non plus à une déconnexion, et un script Intune qui s'exécute toutes les heures ne
rétablirait le partage qu'une heure après la connexion — exactement au moment où l'on en a besoin.

Cet agent a **trois** déclencheurs, et tous trois sont nécessaires :

| | quand |
|---|---|
| `RunAtLoad` | à la connexion, et lors du chargement depuis le script d'installation |
| `WatchPaths` | dès que le réseau change — changement de Wi-Fi, connexion VPN, sortie de veille |
| `StartInterval` | toutes les cinq minutes, comme filet de sécurité |

J'avais d'abord omis ce dernier, parce qu'interroger périodiquement est laid à côté de `WatchPaths`. C'était une erreur : un
montage SMB se perd aussi **sans** que rien ne change sur le réseau — après une mise en veille, ou lorsque
le serveur coupe la connexion. `WatchPaths` ne se déclenche alors pas et le partage reste absent jusqu'à la
connexion suivante. C'est exactement ce qui s'est produit pendant les tests : monté à 08:41, disparu huit minutes plus tard,
et rien pour le rétablir.

Cinq minutes ne coûtent rien. Si le partage est toujours là, le script s'arrête aussitôt, et avec `QUIET`
il n'écrit rien à ce sujet dans le journal. Un `ThrottleInterval` de dix secondes garde l'agent
calme lorsque plusieurs déclencheurs arrivent coup sur coup.

Le script Intune **génère** l'assistant dans `/Library/Scripts/Baseline/` : il y écrit les
paramètres du haut du fichier (avec `printf %q`, pour qu'une clé contenant des espaces ou
des guillemets reste intacte) et y ajoute la logique de montage telle quelle. Un seul endroit pour les
paramètres, et l'agent ne peut pas se désynchroniser de ce qu'Intune déploie.

Au début, le script se copiait *lui-même* avec `cp "$0"`. Cela a mal tourné : avec l'agent Intune,
`$0` ne pointe pas vers le texte du script, si bien qu'un **fichier binaire** s'est retrouvé dans `/Library/Scripts` et
que le LaunchAgent est mort avec `exit 126 — cannot execute binary file`. La génération ne fait aucune
hypothèse sur la manière dont le fichier est appelé, et un `bash -n` vérifie désormais
l'assistant avant sa mise en service.

### Plus d'un partage, ou plus d'un groupe

En haut du script figurent deux champs qui déterminent ensemble ce que fait ce déploiement :

```bash
SET_NAAM="public"
SHARES=(
  "algemeen"
)
```

**Plusieurs partages pour le même groupe ?** Listez-les les uns sous les autres dans `SHARES`. Un assistant, un
LaunchAgent, un journal.

**Des groupes différents, des partages différents ?** Déployez alors ce fichier **deux fois** avec un
`SET_NAAM` différent, et affectez chaque déploiement à son propre groupe. `SET_NAAM` rend l'assistant,
le libellé du LaunchAgent et le journal uniques :

| `SET_NAAM` | assistant | libellé |
|---|---|---|
| `public` | `/Library/Scripts/Baseline/mount-azure-files-public.sh` | `…baseline.mount-azure-files-public` |
| `media` | `/Library/Scripts/Baseline/mount-azure-files-media.sh` | `…baseline.mount-azure-files-media` |

Sans cette distinction, deux déploiements écrasent mutuellement leur assistant et se disputent le même
libellé — le dernier exécuté l'emporte, et l'autre groupe perd son lecteur sans que personne
ne voie pourquoi.

Ce qu'il ne faut **pas** faire, c'est copier le script et modifier la copie. Chaque correctif doit alors être fait deux
fois, et un jour cela tourne mal.

#### Ce qu'une affectation de groupe règle, et ce qu'elle ne règle pas

Avec la **clé en secours**, l'affectation détermine seulement qui *reçoit* le partage monté — pas qui
*peut y accéder*. Cette clé ouvre tout le compte de stockage, donc quelqu'un avec un Mac d'un groupe
peut tout aussi bien monter à la main le partage de l'autre groupe.

Une véritable séparation par groupe n'est possible qu'avec **Kerberos** : la share-level permission dans
Azure s'applique alors, et le KDC ne délivre tout simplement pas de ticket pour un partage auquel vous n'avez pas accès. Tant que la clé
est en jeu, la répartition en groupes est une commodité et non une frontière.

### Paramètres dans Intune

Devices → macOS → Shell scripts → Add.

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| Run script as signed-in user | **No** | le script ne fait qu'installer, et écrit dans `/Library` — seul root le peut |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | maintient l'assistant et le LaunchAgent à jour |
| Max number of retries | 3 | |

Affecter à un **groupe d'appareils**. Le LaunchAgent que le script installe fonctionne ensuite pour
chaque utilisateur de cet appareil ; un groupe d'utilisateurs ne servirait que la première personne.

Qui *a le droit* d'accéder au partage reste une propriété de l'utilisateur — ce sont les share-level
permissions dans Azure qui le règlent. Sauf avec la clé en secours : celle-ci ne connaît pas d'identité par utilisateur,
et dans ce cas c'est bien l'affectation qui détermine qui peut y accéder.

### Ce qui doit être en place en dehors de ce script

[`Baseline_MAC_D_Azure_Files_Cloud_Kerberos`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.fr.md)
doit être déployé — sans ce profil, il n'y a pas de ticket pour le realm
`KERBEROS.MICROSOFTONLINE.COM` et le montage demande quand même un mot de passe. Ce profil
est aujourd'hui en **phase 3** : l'accès à Azure Files via le ticket Platform SSO est une
préversion limitée que Microsoft doit activer pour vous, et il requiert macOS Tahoe 26.5. Tant que
ces prérequis ne sont pas remplis, ce script ne monte rien et le journal indique pourquoi.

Le côté tenant (Entra Kerberos sur le compte de stockage, consentement administrateur, exclusion de la MFA pour
l'application Entra, share-level permissions, et la correction `CIFS/` → `cifs/` sur l'identifier URI des
partages existants) est décrit dans la note de ce profil.

### `server rejected the connection: Authentication error`

Le port 445 est ouvert, mais le montage est refusé. Le réseau est donc en ordre et le problème vient de
Kerberos. Trois causes, dans l'ordre où vous les éliminez.

**1. Le ticket n'est pas dans le cache par défaut.** `mount_smbfs` utilise via GSSAPI le cache
d'identifiants *par défaut*. Platform SSO place le TGT cloud dans un cache portant son propre nom, et
si celui-ci n'est pas le cache par défaut, `mount_smbfs` ne le trouve pas et le serveur refuse.

```bash
klist -l
```

L'**`*`** en début de ligne marque le cache par défaut. S'il se trouve à côté du ticket
`@KERBEROS.MICROSOFTONLINE.COM` et que celui-ci n'a pas expiré, ce n'est pas la cause —
passez au point 2. S'il se trouve ailleurs, vous pouvez le tester avec
`kswitch -p <principal>` suivi du montage.

**2. L'identifier URI est en `CIFS/` majuscules.** Pour un partage qui existait déjà avant
l'activation d'Entra Kerberos, Azure enregistre l'application avec `CIFS/<account>.file.core.windows.net`.
macOS monte exclusivement sur `cifs/` en minuscules et n'obtient sinon pas d'accès au service. Visible
dans Entra ID → Inscriptions d'applications → Toutes les applications → le compte de stockage → Manifeste.
La correction se fait avec [`updateappmanifestazurefiles.ps1`](https://github.com/Azure-Samples/azure-files-samples/blob/master/update-app-manifest/updateappmanifestazurefiles.ps1)
d'azure-files-samples.

**3. L'autorisation derrière.** Consentement administrateur sur le principal de service du compte de stockage,
MFA exclue pour cette application Entra, et une share-level permission pour cet utilisateur sur ce
partage. S'il en manque un, un ticket est *bien* délivré mais le serveur le refuse quand même.

**Distinguer 2 et 3 en un seul test.** Demandez directement au KDC le
ticket de service, deux fois, en faisant attention à la différence de casse :

```bash
kgetcred cifs/<account>.file.core.windows.net@KERBEROS.MICROSOFTONLINE.COM ; echo "klein: $?"
kgetcred CIFS/<account>.file.core.windows.net@KERBEROS.MICROSOFTONLINE.COM ; echo "groot: $?"
```

Les principaux Kerberos sont sensibles à la casse, et c'est précisément là que cela coince.

| Résultat | Ce que cela signifie |
|---|---|
| minuscules échoue, majuscules réussit | **Cause 2.** Le SPN est enregistré en `CIFS/` et macOS demande `cifs/`. Corrigez l'identifier URI. |
| les deux échouent avec **AADSTS700016** | Il n'y a pas d'application pour ce compte de stockage dans ce tenant. Voir ci-dessous — c'est la cause la plus fréquente. |
| minuscules réussit, le montage échoue quand même | **Cause 3.** Le ticket est délivré ; le serveur refuse l'autorisation. Vérifiez le consentement, l'exclusion MFA et la share-level permission. |

#### AADSTS700016 — l'application n'existe pas

```
kgetcred: krb5_get_creds: Error from KDC: AADSTS700016: Application with identifier 'cifs'
was not found in the directory '<tenant-id>'. This can happen if the application has not been
installed by the administrator of the tenant or consented to by any user in the tenant.
```

Si cette erreur apparaît pour les **deux** graphies, il n'y a aucune casse à corriger : le
KDC ne connaît aucune application pour ce service de fichiers. L'activation d'Entra Kerberos crée
automatiquement cette inscription d'application (`[Storage Account] <account>.file.core.windows.net`) ;
tant qu'elle n'existe pas, il n'y a rien à délivrer.

**Regardez d'abord la source d'identité du compte de stockage**, car c'est la cause la plus
fréquente. Portail Azure → le compte de stockage → *Data storage* → *File shares* →
*Identity-based access*. Si **Microsoft Entra Kerberos** et **AD DS** y sont grisés avec
*« Another access method is already configured »*, une autre source a déjà été choisie — par exemple
Microsoft Entra Domain Services. Microsoft est catégorique à ce sujet :

> Your Azure storage account can't authenticate with both Microsoft Entra ID and a second
> method like AD DS or Microsoft Entra Domain Services. If you already chose another identity
> source for your storage account, you must disable it before enabling Microsoft Entra
> Kerberos.

Une source d'identité par compte de stockage, et c'est un choix qui va au-delà des Mac : tout
le trafic existant vers ces partages en dépend. Le changement se fait selon
[Change the identity source for Azure file shares](https://learn.microsoft.com/en-us/azure/storage/files/change-identity-source)
et ce n'est pas un paramètre que l'on bascule en passant.

**Pourquoi Entra DS ne fonctionne quand même pas avec ce profil.** Kerberos vers un partage Entra DS passe
par les contrôleurs de domaine de ce domaine managé, avec le domaine lui-même comme realm — et non par le
KDC cloud sur `KERBEROS.MICROSOFTONLINE.COM`. Platform SSO ne délivre que deux tickets :
`tgt_cloud` pour Entra Kerberos, et `tgt_ad` pour un AD local via Cloud Kerberos Trust.
Entra DS n'est ni l'un ni l'autre — c'est un domaine managé qui se synchronise *depuis* Entra ID et
ne participe pas à Cloud Kerberos Trust. Il n'y a donc jamais de TGT pour ce realm.

Qui veut malgré tout rester sur Entra DS a besoin sur le Mac d'une configuration Kerberos SSO classique :
realm et `Hosts` du domaine managé, visibilité réseau sur les contrôleurs de domaine dans le VNet (donc
VPN ou ExpressRoute) et un utilisateur qui tape son mot de passe. Cela fonctionne, mais c'est une
autre solution que celle-ci — le montage sans connexion n'en fait alors pas partie.

**Entra ID et Entra Domain Services ne sont pas la même chose**, et cette confusion de noms est ici le
cœur du problème. Entra ID est l'annuaire cloud sur lequel reposent Intune, Platform SSO et Conditional Access ;
il parle OAuth2 et OIDC et n'a pas de Kerberos classique. Entra DS est un **domaine AD
managé sur des VM dans votre propre VNet**, avec LDAP, NTLM et Kerberos ordinaire, qui se synchronise dans un seul sens
depuis Entra ID. Les mêmes utilisateurs, un autre annuaire, un autre realm, ses propres
contrôleurs de domaine sur des adresses privées. Le fait que vos utilisateurs et appareils soient « dans Azure AD » ne dit
donc rien sur leur capacité à accéder à Entra DS.

Cela ne vaut pas seulement pour les Mac. Microsoft pose comme prérequis pour Entra DS :

> To access an Azure file share by using Microsoft Entra credentials from a VM, your VM must be
> domain-joined to Microsoft Entra Domain Services. […] Non-domain-joined VMs can access Azure
> file shares using Microsoft Entra Domain Services authentication only if the VM has
> unimpeded network connectivity to the domain controllers […] Usually this connectivity
> requires either site-to-site or point-to-site VPN.

#### Pourquoi cela fonctionne avec un appareil joint au domaine

Trois mondes Kerberos sont en jeu, et le malentendu réside dans l'hypothèse qu'ils
se raccordent les uns aux autres.

| | Qui est le KDC | Ce qu'est le compte de stockage là-bas |
|---|---|---|
| **AD classique** (AD DS local ou Entra DS) | de vrais contrôleurs de domaine | un compte dans *ce* domaine, avec le SPN `cifs/<naam>.file.core.windows.net` |
| **Entra Kerberos** | Entra ID lui-même, via un proxy KDC sur HTTPS, realm `KERBEROS.MICROSOFTONLINE.COM` | une inscription d'application avec l'identifiant `cifs/<naam>.file.core.windows.net` |

Un appareil **joint au domaine** fonctionne dans le premier monde : il est membre de ce domaine, trouve les
contrôleurs de domaine, y obtient son TGT et demande au même contrôleur le ticket `cifs/`.
Celui-ci le connaît, car l'utilisateur et le compte de stockage sont dans le même annuaire. Que l'appareil
soit *aussi* Entra joined n'y change rien — c'est l'appartenance au domaine qui fait le travail.

Un **appareil Entra joined sous Intune** possède un ticket du deuxième monde, et le compte de
stockage fait confiance au premier. Autre realm, autre KDC, et aucune relation d'approbation entre eux.
D'où `AADSTS700016` : vous demandez au KDC cloud un service dont il n'a jamais entendu parler.

Et l'objection évidente — Entra ID *peut* bien délivrer des tickets locaux, c'est
`tgt_ad` — est juste, mais uniquement pour un *véritable* AD DS local, où vous placez avec
`Set-AzureADKerberosServer` un objet d'approbation dans ce domaine. Sur un domaine managé, ce
n'est pas possible ; Microsoft à ce sujet, à la question de savoir si Cloud Kerberos Trust fonctionne avec Entra DS :

> No, that wouldnt work, the trust is with Azure AD, not the Azure AD DS managed domain.

Et même *si* c'était possible : Cloud Kerberos Trust supprime le contrôleur de domaine lors de la **connexion**,
pas lors de l'accès à une ressource. Pour le ticket `cifs/`, il faut quand même atteindre un
contrôleur de domaine. L'exigence de VPN demeure donc de toute façon.

Un portable Entra joined géré par Intune n'est pas joint au domaine et n'a, depuis
internet, aucune visibilité sur ces contrôleurs de domaine. Avec Entra DS comme source d'identité, un
compte de stockage ne sert donc en pratique que des VM dans ou connectées à ce VNet — aucun portable de la
flotte, ni Windows ni macOS. macOS ne figure d'ailleurs même pas parmi les clients pris en charge
sur cette page.

Si Entra Kerberos *est* activé et que cette erreur apparaît quand même, il reste deux possibilités. Le
**consentement administrateur** sur le nouveau principal de service peut manquer — Entra ID → Inscriptions d'applications →
Toutes les applications → l'application portant le nom du compte de stockage → *Autorisations d'API* →
*Accorder un consentement d'administrateur*. Ou le compte de stockage appartient à un **autre annuaire** que
celui auquel le Mac est connecté ; le message d'erreur indique l'ID de tenant dans lequel la recherche a eu lieu, et Entra
Kerberos ne fonctionne pas entre tenants.

Tant que cette erreur est présente, il est inutile de bricoler le profil, la liste `Hosts` ou le script.
Ce côté-là est manifestement en ordre : il y a un TGT valide dans le cache par défaut, le port
445 est ouvert, et le KDC répond poliment — pour dire qu'il n'a rien à donner.

Si le Mac ne connaît pas `kgetcred`, vous pouvez lire la même chose après un montage échoué avec
`klist | grep -i cifs` : s'il y a une ligne `cifs/`, le KDC a délivré le ticket (3) ; s'il n'y a
rien, on n'en est même pas arrivé là (2).

### La petite clé dans la barre des menus n'est pas un diagnostic

L'icône de l'extension Kerberos dans la barre des menus peut afficher « Not signed in » ou « Network not available »
alors que tout fonctionne. Microsoft écrit à ce sujet :

> Users don't need to interact with the menu bar extra for Kerberos SSO to work. SSO
> functionality operates correctly even if the menu bar extra reports "Not signed in". You can
> instruct users to ignore the menu bar extra.

Avec cette configuration, c'est d'ailleurs logique. Avec `usePlatformSSOTGT` à true, l'extension ne récupère
**aucun ticket propre** — elle utilise le TGT que Platform SSO a déjà importé. L'extension
n'établit donc elle-même jamais de connexion avec un KDC, et ce que l'icône signale au sujet de cette
connexion ne dit rien sur le bon fonctionnement.

La seule source qui compte vraiment est :

```bash
app-sso platform -s
```

Sous `kerberosStatus` doit figurer une entrée avec `"realm": "KERBEROS.MICROSOFTONLINE.COM"`,
`"ticketKeyPath": "tgt_cloud"` et `"importSuccessful": true`. Si elle est présente, le côté
Platform SSO est prêt et un montage échoué relève du côté Azure.

**Avant de fouiller dans le profil**, vérifiez tout de même que le jeton a été remplacé — c'est un
vrai piège, simplement pas celui que désigne cette icône. Dans le modèle, l'URL du KDC figure
sous la forme `kkdcp://login.microsoftonline.com/%OrganizationId%/kerberos`, et CIPP la complète lors du
déploiement. Si vous déployez avec IntuneBackupAndRestore ou via un import JSON direct, cela n'a pas lieu :

```bash
sudo profiles show -output /tmp/profielen.plist
grep -A3 preferredKDCs /tmp/profielen.plist
```

Un GUID doit y figurer, pas `%OrganizationId%`.

### Partage et sous-dossier ne sont pas la même chose

`smb://<account>.file.core.windows.net/<share>/<submap>` figure dans le script sous la forme
`STORAGE_ACCOUNT` plus une entrée dans `SHARES` : `<share>` est le **partage**, `<submap>` un **dossier
à l'intérieur**. SMB ne connaît qu'un seul niveau de partage, et cette distinction n'est pas cosmétique — le montage et les
share-level permissions dans Azure dépendent de `<share>`, le sous-dossier n'est que le point
d'entrée. Qui n'a accès qu'à un seul sous-dossier doit l'obtenir via les droits sur ce dossier, et non
en saisissant ici une autre valeur.

Laisser `SHARE_SUBPATH` vide monte le partage entier.

La vérification « est-il déjà là ? » porte donc sur le **partage** et non sur le sous-dossier ou le
chemin de montage : NetFS décide lui-même s'il place le montage sur `/Volumes/<submap>` ou sur `/Volumes/<share>`,
et si /Volumes connaît déjà ce nom, macOS y ajoute un chiffre. Une vérification plus stricte ne
reconnaîtrait pas son propre montage et remonterait à chaque passage.

### Visible dans le Finder

Le partage arrive dans `/Volumes` et apparaît dans la barre latérale du Finder sous **Emplacements**, avec un
bouton d'éjection — comme si vous l'aviez connecté via *Aller → Se connecter au serveur*.

Ce qui compte pour cela, c'est **où** le partage arrive, pas quelle commande l'a monté. Tout ce qui se trouve dans
`/Volumes` est placé par le Finder dans la barre latérale ; un montage dans un dossier du dossier de départ n'est pas vu par le Finder
comme un serveur et n'apparaît nulle part.

Le script utilise `mount_smbfs -N`, et expressément **pas** `osascript -e 'mount volume'` :

| | `mount_smbfs -N` | `mount volume` (NetFS) |
|---|---|---|
| Point de montage dans `/Volumes` | le crée lui-même, même en tant qu'utilisateur standard | créé par NetFS |
| Kerberos | utilise le TGT présent | idem |
| Si le ticket n'est pas accepté | le montage échoue, avec un message d'erreur | **affiche une fenêtre de connexion à l'écran et attend** |

Cette dernière ligne fait toute la différence. Depuis un LaunchAgent, personne ne répond à cette boîte de dialogue :
le script reste bloqué jusqu'à ce que l'agent Intune l'interrompe au bout de 60 minutes et signale « Failed »,
sans une seule ligne de sortie. C'est exactement ce qui s'est produit ici. `-N`, par définition, ne demande rien.

[`42Loris/macOS_DriveMapping`](https://github.com/42Loris/macOS_DriveMapping) fait le même arbitrage,
avec dans le script la remarque qu'`osascript` provoque cette boîte de dialogue « continue » pour une URL
sans identifiants.

#### Si /Volumes ne fonctionne pas

`mount_smbfs` crée son propre point de montage dans `/Volumes`, mais pas toujours : s'il reste là un
dossier d'une tentative précédente appartenant à `root`, *chaque* montage suivant renvoie
**`Operation not permitted`**. C'est autre chose que `Authentication error` — il ne s'agit alors pas
de la clé ou du ticket mais du point de montage, et qui confond les deux cherche pendant des jours au
mauvais endroit.

Le script nettoie lui-même un tel résidu vide et se rabat sinon sur `~/<share>`. Ce repli
fonctionne toujours, mais ne produit pas d'entrée sous *Emplacements* ; le journal l'indique quand cela se produit.
Le nettoyage manuel se fait avec `sudo rmdir /Volumes/<naam>`.

#### Favoris impossible, Emplacements oui

Le partage arrive dans `/Volumes` et apparaît donc automatiquement dans la barre latérale du Finder sous
**Emplacements**, avec un bouton d'éjection. C'est cela, la barre latérale.

Les **Favoris** en haut de cette barre latérale sont autre chose, et un script ne peut pas les remplir sous macOS 26.
`sfltool` — l'outil d'Apple lui-même — ne connaît que :

```
csinfo | dumpbtm | archive | clear | resetbtm | resetlist | list | list-info
```

Il n'y a pas d'`add-item`. Des sources plus anciennes mentionnent bien cette commande ; cette version de macOS ne l'accepte pas et
se contente d'écrire son usage dans le journal. Le script vérifie désormais d'abord si la sous-commande
existe et l'ignore sinon silencieusement — car une ligne de journal indiquant « In de Finder-favorieten gezet »
alors que rien ne s'est passé est pire que pas de ligne du tout.

Si vous voulez tout de même un favori permanent, [`mysides`](https://github.com/mosen/mysides) est le seul
outil qui fonctionne : un binaire tiers que vous devez déployer et signer vous-même. La
différence que vous obtenez : Emplacements disparaît à l'éjection, un favori reste.

### Pas de ticket, pas de tentative

Sans ticket Kerberos, le script ne monte rien. C'est voulu : en cas d'échec d'un montage Kerberos,
NetFS affiche une fenêtre de connexion à l'écran, et cela toutes les cinq minutes depuis un
agent en arrière-plan est pire qu'un partage manquant. Le script vérifie avec `klist` la présence d'un
ticket pour `KERBEROS.MICROSOFTONLINE.COM` et note dans le journal pourquoi il n'a rien fait.

La vérification utilise `klist -l` **et** un `klist` nu, car les deux ne voient pas la
même chose. Platform SSO place le TGT cloud dans un cache portant son propre nom et un `klist` nu
n'affiche que le cache par défaut. Ce qui est réellement présent se voit le plus sûrement chez Microsoft lui-même :

```bash
app-sso platform -s
```

Sous `kerberosStatus` doit figurer une entrée avec `"realm": "KERBEROS.MICROSOFTONLINE.COM"`,
`"ticketKeyPath": "tgt_cloud"` et `"importSuccessful": true`. Si elle est présente, le côté
Platform SSO est en ordre et un montage échoué relève du côté Azure.

Un test manuel, *avec* boîte de dialogue, est possible avec `--force` :

```bash
~/Library/Application\ Support/Baseline/mount-azure-files.sh --force
```

### Quand Intune signale « Failed »

Dans une exécution Intune, le script se termine **toujours** par exit 0, même s'il n'y avait rien à monter.
C'est voulu : tant que la préversion Azure Files n'est pas activée, aucun Mac n'a de ticket,
et chaque appareil serait alors en rouge en permanence pour quelque chose qui se déroule comme prévu. Ce qui s'est
*réellement* passé, le script l'écrit sur stdout, et Intune conserve cette sortie avec l'appareil.

« Failed » signifie donc que le script n'est pas lui-même arrivé jusqu'au bout. Trois causes, par
ordre de probabilité :

1. **Le montage s'est bloqué sur une fenêtre de connexion.** Si le Mac a bien un ticket Kerberos mais
   que le partage ne l'accepte pas, NetFS se rabat sur une boîte de dialogue et attend que quelqu'un la
   remplisse. Depuis un LaunchAgent, cela n'arrive jamais ; le script reste bloqué et l'agent Intune
   l'interrompt. Depuis le délai d'expiration de 60 secondes, cela ne se produit plus — le script note
   alors `hung and was aborted after 60s` et continue.
2. **Une ancienne version se trouve dans Intune.** La vérification de l'espace réservé est le seul autre chemin
   qui renvoie exit 1. Le journal indique alors littéralement `is still set to the placeholder`.
3. **Le script n'a jamais démarré.** Des fins de ligne ou un BOM provenant d'un éditeur Windows transforment
   la première ligne en `#!/bin/bash^M` et rien ne démarre. Voir *Fins de ligne* ci-dessus.

La distinction entre 2 et 3 se voit dans le journal : s'il contient une ligne `Started as …`, le
script s'est exécuté et l'erreur est dans la logique ; s'il n'y a pas de fichier journal, il n'a jamais
démarré.

### « Failed » reste affiché, même quand tout va bien depuis longtemps

Trois éléments de
[la documentation de Microsoft sur les scripts shell](https://learn.microsoft.com/en-us/intune/intune-service/apps/macos-shell-scripts)
qui expliquent pourquoi le portail peut donner une image erronée, et qu'il faut connaître avant d'envoyer une
nouvelle version :

- **L'agent récupère les scripts toutes les 8 heures**, indépendamment de la synchronisation MDM. Une nouvelle version
  n'est donc pas immédiatement sur l'appareil. L'utilisateur peut forcer la chose : ouvrir le Portail d'entreprise, choisir
  l'appareil, **Check settings**.
- **Le statut n'est signalé que lorsqu'il change.** S'il reste identique, Intune ne met à jour
  que l'horodatage — tous les 7 jours. Un ancien « Failed » peut donc encore être affiché alors que
  plus rien ne se passe mal entre-temps.
- **Un script en échec n'est pas réexécuté** sauf si *Max number of times to retry* est
  configuré. S'il est sur *Not configured*, un seul échec est définitif jusqu'à ce que vous modifiiez le script
  ou redémarriez l'appareil.

Utile à savoir pour la cause 1 ci-dessus : l'agent n'interrompt un script qu'au bout de **60 minutes**.
Un montage qui attend une fenêtre de connexion atteint donc facilement cette limite.

```bash
cat ~/Library/Logs/Baseline/mount-azure-files.log
```

Et sans toucher au Mac : **Devices → Scripts and remediations → Platform scripts →**
le script **→ Device status →** choisissez l'appareil **→ Collect logs**, avec les chemins séparés par
un point-virgule et *sans* espaces entre eux :

```
/Users/<gebruiker>/Library/Logs/Baseline/mount-azure-files.log;/Users/<gebruiker>/Library/Logs/Baseline/screen-recording.log
```

*Voilà* pourquoi ces journaux se trouvent dans `~/Library/Logs/Baseline/` et non à côté des marqueurs dans
`Application Support` : ce nom de dossier contient un espace et ne peut donc pas être collecté. L'agent
Intune fournit toujours ses propres journaux, depuis `/Library/Logs/Microsoft/Intune/` et
`~/Library/Logs/Microsoft/Intune/`.

### Relancer

```bash
launchctl bootout gui/$(id -u)/com.baseline.mount-azure-files-<SET_NAAM>
sudo rm -f /Library/LaunchAgents/com.baseline.mount-azure-files-<SET_NAAM>.plist
```

La prochaine exécution du script Intune rétablit les deux. Le journal se trouve dans
`~/Library/Logs/Baseline/mount-azure-files.log`.

## nudge-screen-recording.sh

Demande à l'utilisateur d'activer l'enregistrement de l'écran pour les applications avec lesquelles le support technique voit l'écran,
et ouvre directement le bon panneau. S'arrête dès que c'est réglé.

### Pourquoi une stratégie ne suffit pas

L'enregistrement de l'écran est la seule mesure de cette baseline qu'un MDM ne peut pas imposer, et ce n'est
pas une lacune de la baseline mais une décision d'Apple. Extrait du schéma d'Apple lui-même pour la
charge utile PPPC ([`apple/device-management`](https://github.com/apple/device-management/blob/main/mdm/profiles/com.apple.TCC.configuration-profile-policy.yaml),
à la clé `ScreenCapture`) :

> Access to the contents can't be given in a profile; it can only be denied.

La même formulation figure pour `Camera`, `Microphone` et `ListenEvent`. Selon ce même schéma, la valeur
`AllowStandardUserToSetSystemService` n'existe **que** pour
`ListenEvent` et `ScreenCapture` — Apple l'a créée précisément *parce que* ces deux-là ne peuvent pas être
accordés.

Que le settings catalog d'Intune propose aussi `Allow` pour `Authorization` ne signifie rien : cette
liste est générique pour les 24 services TCC. Si vous la réglez ici sur `Allow`, Intune accepte
le profil et macOS ignore la valeur.

[`Baseline_MAC_D_Screen_Recording`](../../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Screen_Recording.fr.md)
obtient donc le maximum : un **utilisateur standard** peut basculer l'interrupteur lui-même, sans
mot de passe administrateur. Sans ce profil, un non-administrateur ne le peut plus du tout depuis Big Sur.
Le clic reste celui de l'utilisateur ; ce script veille à ce qu'il le fasse.

### Cinq interrupteurs, pas un seul

Par défaut, le profil couvre cinq bundles, de NinjaOne et TeamViewer. Si l'organisation utilise
d'autres outils, remplacez-les dans le profil *et* dans `BUNDLES` dans le script :

```
com.ninjarmm.ncstreamer
com.teamviewer.TeamViewer
com.teamviewer.TeamViewerHost
com.teamviewer.Desktop
com.teamviewer.TeamViewerQS
```

Seules les applications installées apparaissent dans le panneau, et chaque application a sa propre case. Le
script ne demande donc que ce qui se trouve sur *cet* appareil — sinon il continuerait à réclamer
un interrupteur qui n'existe pas.

### Comment il sait si c'est déjà en place

Il essaie de lire la base de données TCC de l'utilisateur
(`~/Library/Application Support/com.apple.TCC/TCC.db`, colonne `auth_value`, ou `allowed` sur les
versions plus anciennes). Si cela réussit, le script en est certain et ne demande rien.

Cette base de données est protégée : sans Accès complet au disque, personne ne peut la lire. Si la lecture échoue,
ce n'est pas une erreur — la question est alors posée à l'utilisateur, avec un bouton **Déjà activé**
qui arrête le script. Mieux vaut demander une fois de trop qu'inventer un état d'autorisation.

### Dans la langue de l'utilisateur

La boîte de dialogue suit la préférence de langue de l'utilisateur connecté (la première langue de
`AppleLanguages`, sinon `AppleLocale`) : néerlandais, français, et anglais dans tous les autres cas.
Les boutons sont alors **Later** / **Staat al aan** / **Open instellingen**, **Plus tard** /
**Déjà activé** / **Ouvrir les réglages** ou **Later** / **Already on** / **Open Settings**.
`ORG_NAAM` en haut du script est vide par défaut ; le texte indique alors « de IT-afdeling »,
« le service informatique » ou « the IT department ». Si vous indiquez un nom, il apparaît tel quel
dans chaque langue. Le journal est toujours en anglais.

### Il finit par s'arrêter

Après 96 tentatives — à raison d'une exécution par heure, cela fait quatre jours — il ne demande plus rien et note
dans le journal ce qui manque encore. Insister plus longtemps transforme un rappel en agacement, et
alors quelqu'un le ferme sans le lire. Ce qui manque encore à ce stade relève d'une conversation, pas d'une
boîte de dialogue.

### Paramètres dans Intune

Devices → macOS → Shell scripts → Add.

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| Run script as signed-in user | **Yes** | il s'agit des droits de *cet* utilisateur, et personne ne voit une boîte de dialogue lancée par root |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | |
| Max number of retries | 3 | |

Affecter à un **groupe d'utilisateurs**. Pas à un groupe d'appareils : sur un Mac partagé, chaque
utilisateur a sa propre base de données TCC et donc son propre clic.

### Redemander

```bash
rm -f ~/Library/Application\ Support/Baseline/screen-recording-ok \
      ~/Library/Application\ Support/Baseline/screen-recording-pogingen
```

Le journal se trouve dans `~/Library/Logs/Baseline/screen-recording.log`.
