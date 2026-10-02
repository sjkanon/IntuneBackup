[Nederlands](README.md) · [English](README.en.md) · **Français**

# Winget-AutoUpdate

| | |
|---|---|
| **Mesures** | ISO A.8.8 Gestion des vulnérabilités techniques · NIS2 art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités · CIS Controls v8.1 7.4 Perform Automated Application Patch Management · NIST CSF 2.0 PR.PS-02 |
| **Phase** | 2 (pilote) |

Met à jour chaque application connue de winget, chaque jour et sans que personne n'ait à
empaqueter une mise à jour : [Winget-AutoUpdate](https://github.com/Romanitho/Winget-AutoUpdate)
(WAU, licence MIT) en tant qu'application Win32.

## Pourquoi ceci et pas une stratégie

La baseline gère les mises à jour de Windows (anneaux de mise à jour), Defender, Edge, Office et
Chrome. Tout le reste — 7-Zip, Notepad++, Adobe Reader, VLC, Zoom — n'est mis à jour par aucune
stratégie : une stratégie Intune peut configurer winget, pas l'exécuter. WAU est une tâche
planifiée qui exécute `winget upgrade`, en tant que SYSTEM pour les installations machine et en
tant qu'utilisateur pour les applications du profil utilisateur. Une application n'est pas un
template CIPP, d'où sa place dans `extras/`.

L'alternative est **Intune Enterprise App Management** (Intune Suite ou module complémentaire) : un
catalogue géré par Microsoft avec mises à jour automatiques et rapports dans Intune. Qui dispose
de cette licence l'utilise à la place de WAU.

## Les choix

| Propriété MSI | Valeur | Pourquoi |
|---|---|---|
| `RUN_WAU` | `NO` | Pas pendant Autopilot ni la page d'état d'inscription ; la première exécution a lieu à la première connexion |
| `USERCONTEXT` | `1` | Met aussi à jour les applications du profil utilisateur (VS Code, Zoom, compléments par utilisateur) |
| `UPDATESATLOGON` | `1` | Un appareil allumé le matin est mis à jour immédiatement |
| `UPDATESINTERVAL` / `UPDATESATTIME` / `UPDATESATTIMEDELAY` | `Daily` / `11:00:00` / `02:00` | Chaque jour, à une heure où l'appareil est allumé, étalé jusqu'à 13 h pour que tous les appareils ne téléchargent pas en même temps |
| `NOTIFICATIONLEVEL` | `SuccessOnly` | L'utilisateur voit *ce qui* a été mis à jour ; il ne peut de toute façon pas corriger un message d'erreur |
| `DONOTRUNONMETERED` | `1` | Pas sur une connexion mobile partagée |
| `DISABLEWAUAUTOUPDATE` | `1` | Voir ci-dessous |

**Pourquoi WAU ne se met pas à jour lui-même.** `WAU.msi` n'est pas signé Authenticode. Avec
l'auto-mise à jour activée, WAU récupère un nouveau MSI sur GitHub et l'exécute en tant que SYSTEM
sans que personne ne l'ait examiné. `New-WAUPackage.ps1` épingle donc une version avec le SHA-256
de la release GitHub et refuse un fichier différent. Une nouvelle version de WAU est une étape
délibérée : modifier version et hash dans le script, réempaqueter, et publier une nouvelle
application Win32 avec remplacement (*Update*) de la précédente.

## Ce que WAU ne met *pas* à jour

[`excluded_apps.txt`](excluded_apps.txt) est inclus dans le paquet. Attention : cette liste
**remplace** la liste par défaut de WAU, elle ne la complète pas. Elle est donc identique à la
liste par défaut de la v2.12.0, ce qui correspond aussi aux besoins de cette baseline :

| Exclu | Parce que |
|---|---|
| `Microsoft.Edge*`, `Google.Chrome*`, `Mozilla.Firefox*`, `Brave.Brave*`, `Opera.Opera*` | Les navigateurs se mettent à jour eux-mêmes ; pour Edge et Chrome, `Microsoft Edge Updates` et `Google Chrome Updates` l'imposent, pour Firefox [`firefox-policies/`](../../remediations/firefox-policies/README.fr.md) |
| `Microsoft.Office`, `Microsoft.Teams*`, `Microsoft.OneDrive` | Canal de mise à jour propre, piloté par `Microsoft Office Updates` et les stratégies OneDrive et Teams |
| `Microsoft.RemoteDesktopClient`, `TeamViewer.TeamViewer*` | Programme de mise à jour propre ; une mise à jour en pleine session la coupe |
| `Romanitho.Winget-AutoUpdate`, `KnifMelti.WAU-Settings-GUI` | WAU lui-même — voir ci-dessus |

Une application qu'une organisation veut garder à une version fixe s'ajoute ligne par ligne
(caractères génériques autorisés : `Adobe.Acrobat*`). Une liste définie par stratégie de groupe
sous `HKLM\SOFTWARE\Policies\Romanitho\Winget-AutoUpdate\BlackList` prime sur ce fichier.

## Interaction avec la baseline

- **Windows Package Manager** (phase 1) ne désactive que les fonctions expérimentales, le
  contournement du hash, les manifestes locaux et le protocole `ms-appinstaller`. La source par
  défaut `winget` reste active, et c'est celle qu'utilise WAU. Restreindre plus tard
  `EnableDefaultSource` ou `AllowedSources` arrête WAU.
- **In-Box App Removal** conserve App Installer (`Microsoft.DesktopAppInstaller`, donc winget).
- **App Control for Business** ([`app-control/`](../../app-control/README.fr.md)) : WAU se compose
  de scripts PowerShell non signés exécutés en tant que SYSTEM. Non testé avec la variante en
  mode application ; exécutez d'abord la variante d'audit et vérifiez dans le journal
  CodeIntegrity si WAU ou les installateurs qu'il lance seraient bloqués.

## Déploiement

1. Construisez le paquet — téléchargement, contrôle du hash et `.intunewin` :

   ```powershell
   .\New-WAUPackage.ps1 -IntuneWinAppUtil C:\Tools\IntuneWinAppUtil.exe
   ```

2. Intune → **Apps → Windows → Add → Windows app (Win32)**, avec `WAU.intunewin` :

| Champ | Valeur |
|---|---|
| Nom | `CXNM - Standard - WIN - D - Winget-AutoUpdate` |
| Commande d'installation | `msiexec /i WAU.msi /qn RUN_WAU=NO USERCONTEXT=1 UPDATESATLOGON=1 UPDATESINTERVAL=Daily UPDATESATTIME=11:00:00 UPDATESATTIMEDELAY=02:00 NOTIFICATIONLEVEL=SuccessOnly DONOTRUNONMETERED=1 DISABLEWAUAUTOUPDATE=1` |
| Commande de désinstallation | `msiexec /x {FB0EB14E-95AC-45D7-A951-432316FFCBD4} /qn` (v2.12.0 ; le script indique le code d'une autre version) |
| Comportement d'installation | Système |
| Comportement de redémarrage | Aucune action spécifique |
| Système d'exploitation | 64 bits, Windows 10 22H2 ou ultérieur |
| Règle de détection | Script personnalisé → [`Detect-WAU.ps1`](Detect-WAU.ps1) |
| Affectation | *Required* sur le groupe pilote `SEC-Baseline-Pilot`, puis tous les appareils Windows |

La détection ignore volontairement la version : cela réinstallerait à chaque changement de
version. Elle vérifie la clé de registre, `Winget-Upgrade.ps1` et la tâche planifiée
`\WAU\Winget-AutoUpdate`.

## Comment savoir si cela fonctionne

- Journal sur l'appareil : `C:\Program Files\Winget-AutoUpdate\logs\updates.log`, et en lien
  symbolique `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\WAU-updates.log` — ce
  dernier est inclus dans *Collect diagnostics* d'Intune.
- Paramètres : `HKLM\SOFTWARE\Romanitho\Winget-AutoUpdate`.
- Sur l'ensemble du parc : Defender Vulnerability Management → *Software inventory* — le nombre
  d'appareils avec une version obsolète d'une application connue de winget doit baisser en
  quelques jours.
