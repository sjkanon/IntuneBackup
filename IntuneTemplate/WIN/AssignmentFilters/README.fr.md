[Nederlands](README.md) · [English](README.en.md) · **Français**

# Filtres d'affectation pour Windows

Deux corps `deviceAndAppManagementAssignmentFilter`, un par classe d'appareils dotée d'un filtre.
Un filtre affine une affectation à tous les appareils, tous les utilisateurs ou un groupe : *tous
les appareils, mais seulement les physiques*. Ici, il fait la distinction entre les appareils
physiques et les hôtes de session Azure Virtual Desktop sous Windows 11 Enterprise multisession.

| Fichier | Filtre | Règle | Classe (`doelgroep`) |
|---|---|---|---|
| `WIN-Physical.json` | `WIN - Physical` | `(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")` | **fysiek** (physique) — portables et postes de travail |
| `WIN-AVD-Multi-Session.json` | `WIN - AVD Multi-session` | `(device.operatingSystemSKU -eq "ServerRdsh")` | **avd** — hôtes de session multisession |

Les deux ne servent qu'en **inclusion**. La troisième classe, **alle** (tous), n'a pas de filtre :
ces stratégies vont à chaque appareil Windows. La classe de chaque stratégie est le `doelgroep`
dans [`_manifest.json`](../../_manifest.json), et par stratégie avec la raison dans
[docs/AVD.fr.md](../../../docs/AVD.fr.md) ; le guide de déploiement est
[docs/PLAYBOOK.fr.md](../../../docs/PLAYBOOK.fr.md).

Validés dans le tenant de test (`validateFilter` et *Preview devices*) :

- `WIN - Physical` correspond aux quatre PC physiques et QEMU, pas à l'hôte de session AVD ;
- `WIN - AVD Multi-session` correspond exactement à l'hôte de session AVD et à aucun PC physique.

**Ce qui ne relève d'aucun des deux :** un Cloud PC Windows 365 (modèle `Cloud PC …`, mono-session)
et un hôte AVD personnel (modèle `Virtual Machine`, mono-session). Ils ne reçoivent que les
stratégies de la classe *alle* — pas de BitLocker, Windows Hello ni Storage Sense, et pas de
FSLogix non plus. L'ensemble Cloud PC (`Cloud PC Session Security`, `Cloud PC External Access`)
les atteint par ses propres groupes. Une VM Hyper-V ou Azure utilisée comme PC ordinaire sort de
*fysiek* pour la même raison.

`-notStartsWith` n'existe pas dans les règles de filtre (la règle est alors invalide) ; d'où
`-notContains "Cloud PC"`.

Le filtre fonctionne aussi sur les affectations ciblant les utilisateurs, comme
`[Baseline] - WIN - U - Windows Hello for Business` : Intune évalue le filtre sur l'appareil auquel
l'utilisateur se connecte. Exclure un groupe d'appareils n'y fait rien, car l'affectation va aux
utilisateurs.

Les filtres avec `platform: windows10AndLater` ne peuvent être sélectionnés que sur des stratégies Windows.

## Déploiement

Avant la première exécution CIPP de la baseline. CIPP recherche le filtre par son nom et, s'il
n'existe pas, affecte **sans** filtre — les stratégies réservées aux appareils physiques arrivent
alors aussi sur les hôtes de session.

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<contenu du fichier>
```

Ou `scripts/Set-BaselineAssignment.ps1 -CreateFilters` (d'abord avec `-WhatIf`), ou dans le
portail : Administration du locataire → Filtres → Créer → Appareils gérés → Windows 10 et
ultérieur, et collez la règle du tableau. Vérifiez ensuite avec *Preview devices*. Un filtre ne
fait rien tant qu'il n'est pas sélectionné sur une affectation. Le nom doit correspondre
exactement : CIPP, `Set-BaselineAssignment.ps1` et l'export le recherchent par `displayName`.
