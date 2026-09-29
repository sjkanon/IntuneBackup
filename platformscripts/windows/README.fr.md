[Nederlands](README.md) · [English](README.en.md) · **Français**

# Scripts de plateforme Windows

Les scripts de plateforme Intune (`deviceManagementScripts`) se trouvent **en dehors** de
`IntuneTemplate/`, pour la même raison que les [scripts shell macOS](../../shellscripts/macos/README.fr.md) :
les pipelines de ce dossier connaissent cinq types de stratégie CIPP et un script de plateforme
n'est aucun de ces cinq. Il dépend de `deviceManagement/deviceManagementScripts`,
`Set-CIPPIntunePolicy` n'a pas de `TemplateType` pour lui, et `Start-IntuneRestoreConfig` ne le
restaure pas. Un fichier ici n'est donc **pas** pris en compte par
`export-intunebackup.js`, `check-scope.js` ou `Set-BaselineAssignment.ps1`.

Le dossier s'appelle `platformscripts/` et non `shellscripts/` parce qu'Intune les nomme
lui-même ainsi : sous Windows, ils se trouvent sous *Scripts and remediations → Platform
scripts*, sous macOS sous *macOS → Shell scripts*. Deux noms pour la même idée, mais ainsi
quiconque cherche dans le portail les retrouve.

| Fichier | Ce qu'il fait | Portée |
|---|---|---|
| `Mount-AzureFilesDrive.ps1` | Connecte `\\<account>.file.core.windows.net\<share>\<submap>` en tant que `Z:` avec le ticket Entra Kerberos | Utilisateur |

## Mount-AzureFilesDrive.ps1

L'équivalent Windows de [`mount-azure-files.sh`](../../shellscripts/macos/README.fr.md) sur le
Mac, et le remplaçant des mappages de lecteurs des Group Policy Preferences.

### Pourquoi un script et non une stratégie

Il n'existe pas de stratégie de mappage de lecteur. Les 18 329 `settingDefinitionId` du settings
catalog ont tous été passés en revue à la recherche de quoi que ce soit qui connecte un lecteur
réseau ; cela n'existe pas, sur aucune des deux plateformes. Ce qui y ressemble sans l'être :

| Ce que vous trouvez | Ce que cela fait réellement |
|---|---|
| `..._userprofiles_user_home_drive_letter` | le lecteur de base issu d'AD, pas un mappage que vous choisissez |
| `..._terminalserver_ts_user_home_ts_drive_letter` | la même chose, mais pour une session Terminal Server |

Group Policy Preferences → Drive Maps n'est pas de l'ADMX et ne peut donc pas non plus être
amené dans Intune par ingestion ADMX. Un mappage est une action et non un paramètre, donc un
script.

### Paramètres dans Intune

Devices → Scripts and remediations → Platform scripts → Add → Windows 10 and later.

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| Run this script using the logged on credentials | **Yes** | un lecteur réseau appartient à un profil utilisateur ; en tant que SYSTEM, il n'atterrit nulle part |
| Enforce script signature check | No | |
| Run script in 64 bit PowerShell Host | Yes | |

Affecter à un **groupe d'utilisateurs**, pas aux appareils : qui a accès au partage est une
propriété de l'utilisateur, et les autorisations au niveau du partage dans Azure portent sur le
même groupe.

### Une seule exécution suffit

Un script de plateforme s'exécute une fois par utilisateur et par appareil, et cela suffit ici :
`New-PSDrive -Persist` écrit le mappage dans `HKCU\Network` et Windows rétablit les mappages
persistants à chaque ouverture de session.

Si l'utilisateur supprime ensuite lui-même le lecteur, il ne revient pas. C'est un choix et non
une lacune — la même logique que pour `configure-dock.sh`, où le Dock appartient à l'utilisateur
après la configuration initiale. Si le mappage doit se rétablir de lui-même, ce script n'est pas
le bon outil : il faut alors une **remediation** (un script de détection plus un script de
correction, avec sa propre planification). Celles-ci nécessitent Windows Enterprise E3/E5 ou
Intune Plan 2.

Si la lettre choisie est déjà occupée par autre chose, le script la laisse en place et s'arrête
avec exit 1. Retirer un lecteur existant sous les pieds de l'utilisateur est pire que de ne pas
connecter celui-ci.

### Partage et sous-dossier ne sont pas la même chose

`\\<account>.file.core.windows.net\<share>\<submap>` figure dans le script sous forme de trois
champs : `$ShareName` est le **partage**, `$ShareSubPath` un **dossier à l'intérieur**. SMB ne
connaît qu'un seul niveau de partage, et la distinction n'est pas cosmétique — la connexion et
les autorisations au niveau du partage dans Azure dépendent du partage ; le sous-dossier n'est
que le point de départ du lecteur. Quelqu'un qui ne doit accéder qu'à un seul sous-dossier doit
l'obtenir via les droits NTFS sur le dossier, pas en saisissant ici une autre valeur.

Laisser `$ShareSubPath` vide connecte l'ensemble du partage.

### Ce qui doit être en place en dehors de ce script

| Prérequis | Où |
|---|---|
| `Kerberos/CloudKerberosTicketRetrievalEnabled` = 1 | **déjà dans la baseline** — [`Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust`](../../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.fr.md), tous les appareils |
| L'appareil est Entra joined ou Entra hybrid joined | inscription |
| `WinHttpAutoProxySvc` et `iphlpsvc` sont en cours d'exécution | **non désactivés par la baseline** — les seuls services que `Security Hardening` désactive sont les quatre services Xbox |
| Entra Kerberos activé sur le compte de stockage, consentement administrateur, prise en charge des groupes cloud-only, MFA exclue pour l'application Entra, autorisations au niveau du partage | Portail Azure — les étapes sont décrites une fois pour l'équivalent macOS, sous [Le côté Azure](../../shellscripts/macos/README.fr.md#côté-azure--un-second-compte-de-stockage-avec-entra-kerberos). Elles s'appliquent telles quelles à Windows. |

Les identités cloud-only nécessitent en outre Windows 11 24H2 ou ultérieur avec la mise à jour
cumulative de mars 2026 (KB5079391 / KB5079489) ; les identités hybrides fonctionnent à partir
de Windows 10 2004.

`HostToRealm` n'est **pas** nécessaire ici. Ce mappage n'existe que pour le cas où un appareil
doit aussi accéder à des comptes de stockage reliés à un AD DS local ; si ce n'est pas le cas, il
reste absent.

### Si une fenêtre de connexion apparaît malgré tout

C'est alors le ticket qui pose problème, pas le mappage. Par ordre de probabilité :

1. La MFA n'est pas exclue pour l'application Entra du compte de stockage. Le symptôme est
   `System error 1327` lors de `net use`.
2. L'utilisateur n'a pas d'autorisation au niveau du partage sur le partage.
3. Le consentement administrateur sur le principal de service du compte de stockage manque.
4. L'appareil n'a pas encore reçu la stratégie : `CloudKerberosTicketRetrievalEnabled` nécessite
   une actualisation des stratégies ou un redémarrage.

`klist cloud_debug` indique si l'appareil peut obtenir un TGT cloud ; `klist` montre s'il y a un
ticket pour `KERBEROS.MICROSOFTONLINE.COM` dans le cache.

### Journalisation

`%LOCALAPPDATA%\Baseline\mount-azurefiles.log`, même emplacement et même format que côté macOS.

---

Retour au [README principal](../../README.fr.md).
