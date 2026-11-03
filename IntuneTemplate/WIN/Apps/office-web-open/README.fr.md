[Nederlands](README.md) · [English](README.en.md) · **Français**

# Office op het web

Une application Win32 pour les appareils partagés sans Office : un double-clic sur un fichier
Word, Excel ou PowerPoint dans un dossier OneDrive ou SharePoint synchronisé ouvre le fichier dans
Office pour le web, dans Edge.

Une application Win32 n'est pas une stratégie ni l'un des cinq types de stratégie CIPP. CIPP,
`check-scope.js`, `export-intunebackup.js` et `Set-BaselineAssignment.ps1` n'utilisent pas ce
dossier ; vous empaquetez l'application et la chargez à la main. La stratégie qui en fait
l'application par défaut se trouve dans la baseline :
`[Baseline] - WIN - D - Shared Devices Office Web File Associations`.

## Pourquoi c'est nécessaire

Windows ne peut pas associer un type de fichier à une application web. Sans Word sur l'appareil,
Windows demande à chaque double-clic sur un `.docx` avec quelle application l'ouvrir. Ce qui
fonctionne, c'est un clic droit sur le fichier dans l'Explorateur puis *Afficher en ligne* :
OneDrive l'ouvre alors dans Word pour le web. Cette application fait exactement cela lors d'un
double-clic.

L'élément de menu porte un nom différent dans chaque langue. Le script prend les noms dans
OneDrive lui-même : `FileSync.LocalizedResources.dll` contient une traduction par langue
(94 langues dans OneDrive 26.x). La liste est construite une fois par version de OneDrive puis
conservée, donc une mise à jour de OneDrive fonctionne d'elle-même. Comme c'est OneDrive qui ouvre
le fichier, cela fonctionne aussi pour les raccourcis vers d'autres bibliothèques
(*Ajouter un raccourci à Mes fichiers*).

Si un fichier n'est pas dans un dossier synchronisé (Téléchargements, une clé USB), l'utilisateur
reçoit un message en néerlandais, français, allemand ou anglais : le placer d'abord dans OneDrive.

L'idée vient de [M365-Bridge](https://github.com/Fireant456/M365-Bridge). Celui-ci cherche
l'élément de menu par son nom anglais et ne fonctionne donc pas sur un Windows néerlandais ou
français.

| Fichier | Ce que c'est |
|---|---|
| [`Open-OfficeWeb.ps1`](Open-OfficeWeb.ps1) | s'exécute au double-clic, en tant qu'utilisateur : trouve *Afficher en ligne* dans le menu du fichier et l'exécute |
| [`Install-OfficeWeb.ps1`](Install-OfficeWeb.ps1) | place le script dans `%ProgramFiles%\OfficeWebOpen`, enregistre les ProgId `OfficeWeb.Word`, `OfficeWeb.Excel` et `OfficeWeb.PowerPoint` et construit la liste des noms à l'avance |
| [`Detect-OfficeWeb.ps1`](Detect-OfficeWeb.ps1) | règle de détection : version, script et association présents |
| [`Uninstall-OfficeWeb.ps1`](Uninstall-OfficeWeb.ps1) | supprime tout |

Types de fichiers : `.docx`, `.docm`, `.doc`, `.dotx`, `.xlsx`, `.xlsm`, `.xlsb`, `.xls`,
`.pptx`, `.pptm`, `.ppt`, `.ppsx`. Office pour le web ouvre les anciens formats en lecture seule
ou après conversion ; l'utilisateur fait ce choix sur place.

## Empaqueter et déployer

```powershell
IntuneWinAppUtil.exe -c .\IntuneTemplate\WIN\Apps\office-web-open -s Install-OfficeWeb.ps1 -o .\sortie
```

Dans Intune → Applications → Windows → Application Win32 :

| Champ | Valeur |
|---|---|
| Commande d'installation | `powershell.exe -ExecutionPolicy Bypass -File Install-OfficeWeb.ps1` |
| Commande de désinstallation | `powershell.exe -ExecutionPolicy Bypass -File Uninstall-OfficeWeb.ps1` |
| Comportement d'installation | Système |
| Comportement de redémarrage | Aucune action spécifique |
| Règle de détection | Script personnalisé → `Detect-OfficeWeb.ps1` |
| Affectation | Obligatoire sur `SG-D-UEM-WIN-Shared` |

Affectez aussi `[Baseline] - WIN - D - Shared Devices Office Web File Associations` au même
groupe. Elle fait de l'application l'application par défaut à chaque connexion : un programme
d'installation n'en a pas le droit, Windows protège l'application par défaut par utilisateur. Si
vous affectez la stratégie sans l'application, les associations pointent vers un ProgId qui
n'existe pas et Windows les ignore.

Si vous modifiez un script, augmentez `$Version` dans `Install-OfficeWeb.ps1` et dans
`Detect-OfficeWeb.ps1`. Sinon Intune considère l'ancienne version comme installée.

## Comment savoir si cela a fonctionné

- Double-cliquez sur un `.docx` dans le dossier OneDrive de l'Explorateur : un onglet avec Word
  pour le web s'ouvre. Le premier fichier d'un nouveau profil prend quelques secondes.
- *Paramètres → Applications → Applications par défaut* affiche *Office op het web* pour `.docx`.
- Journaux : `C:\Windows\Logs\Baseline\office-web-open.log` (installation) et
  `%LOCALAPPDATA%\OfficeWebOpen\open.log` (par utilisateur, à chaque ouverture de fichier).
- Sans rien ouvrir : `& "$env:ProgramFiles\OfficeWebOpen\Open-OfficeWeb.ps1" <fichier> -WhatIf`
  indique quel élément de menu le script exécuterait.

## Limites

- Ne fonctionne que pour les fichiers d'un dossier OneDrive ou SharePoint synchronisé ; OneDrive
  doit être en cours d'exécution. `[Baseline] - WIN - D - Shared Devices OneDrive` s'en charge et,
  pour un dossier d'équipe fixe, `[Baseline] - WIN - D - Shared Devices SharePoint Team Sites`.
- Le fichier s'ouvre dans le navigateur par défaut ; sous Windows 11, c'est Edge.
- Testé : la liste des noms (140 variantes dans 94 langues) et l'ouverture d'un fichier
  synchronisé sur un appareil avec OneDrive 26.198. Le programme d'installation et la stratégie
  d'association n'ont pas encore été testés sur un appareil partagé.
