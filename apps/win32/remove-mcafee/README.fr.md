[Nederlands](README.md) · [English](README.en.md) · **Français**

# Supprimer McAfee préinstallé

Une application Win32 qui supprime la version d'essai de McAfee livrée d'usine sur presque tous
les nouveaux ordinateurs portables grand public.

Se trouve en dehors de [`IntuneTemplate/`](../../../IntuneTemplate/README.fr.md), tout comme
[`shellscripts/macos/`](../../../shellscripts/macos/README.fr.md) et
[`compliance/macos/`](../../../compliance/macos/README.fr.md) : une application Win32 n'est pas une
stratégie et n'entre dans aucun des cinq types de stratégie CIPP. Pas de `checkId`, et aucun
pipeline ne prend en compte ce dossier.

## Pourquoi cela fait partie de la baseline

Non pas parce que McAfee est un logiciel indésirable, mais parce qu'il **désactive Microsoft
Defender**. Windows n'autorise qu'un seul antivirus actif : dès que McAfee s'enregistre, Defender
passe en *mode passif*. La protection en temps réel s'arrête, et avec elle disparaît le socle
d'une bonne partie de cette baseline — les règles ASR, Controlled Folder Access, Network
Protection et la nouvelle Remote Encryption Protection reposent toutes sur un moteur Defender
actif.

Le plus sournois, c'est que rien de tout cela ne signale d'erreur. Les stratégies arrivent
correctement, le contrôle de la baseline est au vert, et les paramètres ne font rien parce que
le moteur censé les appliquer est sur le banc de touche. Cela reste ainsi jusqu'à l'expiration de
l'essai McAfee — et l'appareil reste alors un certain temps sans antivirus fonctionnel.

| Fichier | Description |
|---|---|
| [`Detect-McAfee.ps1`](Detect-McAfee.ps1) | script de détection : trouve des restes dans le registre (64 et 32 bits), dans Program Files et dans la liste des services |
| [`Remove-McAfee.ps1`](Remove-McAfee.ps1) | exécute MCPR trois fois, nettoie les dossiers restants et les paquets Appx |

`MCPR.exe` ne se trouve **pas** dans ce dépôt — c'est l'outil propre de McAfee et il n'a pas à
être commité. Récupérez-le auprès de McAfee et empaquetez-le avec les deux scripts dans le
`.intunewin`.

## Empaqueter et déployer

```powershell
IntuneWinAppUtil.exe -c .\apps\win32\remove-mcafee -s Remove-McAfee.ps1 -o .\uitvoer
```

Dans Intune → Apps → Windows → application Win32 :

| Champ | Valeur |
|---|---|
| Commande d'installation | `powershell.exe -ExecutionPolicy Bypass -File Remove-McAfee.ps1` |
| Commande de désinstallation | `cmd.exe /c exit 0` (il n'y a rien à restaurer) |
| Comportement d'installation | Système |
| **Comportement de redémarrage de l'appareil** | **Intune force un redémarrage obligatoire** |
| Règle de détection | Script personnalisé → `Detect-McAfee.ps1` |

> **Ce redémarrage n'est pas accessoire, c'est la dernière étape de la suppression.** MCPR
> reporte une partie du travail via `PendingFileRenameOperations` ; sans redémarrage, l'appareil
> reste dans un état à moitié désinstallé, dans lequel Defender ne revient toujours pas. Placez
> cette application sur l'Enrollment Status Page comme application bloquante, afin qu'un nouvel
> appareil effectue la suppression avant que l'utilisateur ne commence.

## Comment savoir si cela a fonctionné

Le script journalise dans `C:\Windows\Logs\Baseline\remove-mcafee.log`. Vérifiez ensuite sur
l'appareil que Defender est de nouveau actif et non passif :

```powershell
Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled
```

`AMRunningMode` doit valoir `Normal`. S'il indique `Passive` ou `EDR Block Mode`, un autre
antivirus est encore actif et la suppression n'est pas terminée.

Deux choses normales avec MCPR qui ne signifient pas une erreur :

- **Un code de sortie non nul.** « Incomplete uninstallation » signifie que le travail restant a
  été reporté jusqu'au redémarrage, pas qu'il a échoué. Le script ne s'arrête donc pas là-dessus.
- **Plusieurs passes nécessaires.** Chaque passe libère des verrous de fichiers qui gênaient
  encore la précédente. Une seule exécution laisse presque toujours des restes ; c'est pourquoi
  le script effectue trois passes avec une pause entre elles.

Source de l'approche : [McAfee: the shadow IT that ships from the
factory](https://malinoski.me/2026/08/25/mcafee-the-shadow-it-that-ships-from-the-factory-and-how-to-remove-it-with-intune/).

---

Retour au [README principal](../../../README.fr.md).
