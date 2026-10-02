[Nederlands](README.md) · [English](README.en.md) · **Français**

# AppTemplate/

**Templates d'application** CIPP : des applications Win32 que CIPP installe lui-même dans un
tenant, sans que personne n'ait à téléverser un `.intunewin`.

| Fichier | Application | Source |
|---|---|---|
| [`Winget-AutoUpdate.json`](Winget-AutoUpdate.json) | `CXNM - Standard - WIN - D - Winget-AutoUpdate` | [`IntuneTemplate/WIN/Apps/winget-autoupdate/`](../IntuneTemplate/WIN/Apps/winget-autoupdate/README.fr.md) |
| [`Winget-AutoUpdate-AllDevices.json`](Winget-AutoUpdate-AllDevices.json) | la même application, affectée à tous les appareils — pour la baseline [`Windows-Updates.json`](../BaselineTemplate/README.fr.md#windows-updatesjson--correctifs) | idem |

## Fonctionnement

CIPP ne peut pas mettre en template votre propre paquet d'installation, mais bien une *Custom
Application* (application Win32 par script) : CIPP téléverse son propre petit paquet de
substitution et exécute un script PowerShell comme programme d'installation. Le script
d'installation récupère donc lui-même l'installeur — épinglé et avec contrôle du hash. Le template
ne contient que des scripts.

Chaque fichier est une ligne de table CIPP (`PartitionKey: AppTemplate`) générée par
[`scripts/generate-app-templates.js`](../scripts/generate-app-templates.js) à partir des scripts de
[`IntuneTemplate/WIN/Apps/`](../IntuneTemplate/WIN/Apps/winget-autoupdate/README.fr.md). Les modifications se font là, pas ici.

## Déploiement

1. CIPP → **Tools → Community Repos** → ce dépôt → le fichier → **Import**.
2. **Applications → Application Templates** → le template → **Deploy**, avec les tenants et
   l'affectation. Ou dans une baseline avec le standard *Deploy Intune Application Template*.

Les templates n'affectent rien eux-mêmes : l'affectation se choisit au déploiement, car une
application en phase 2 va d'abord au groupe pilote.
