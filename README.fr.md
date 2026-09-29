[Nederlands](README.md) · [English](README.en.md) · **Français**

# IntuneBackup

`IntuneTemplate/` est la source : les stratégies Intune convenues au format de modèle CIPP (une ligne
Table Storage avec une chaîne `JSON`/`RAWJson` imbriquée). Depuis août 2026, le contenu provient
en grande partie d'[OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline)
(Windows v4.0, macOS v1.0, BYOD), complété par ce que cette baseline couvre en plus. Windows v4.0 a été
repris avant la publication officielle — voir [`ANALYSE.md`](ANALYSE.fr.md#itération-oib-windows-v40-14-septembre-2026).

197 stratégies sur quatre plateformes :

| | Settings Catalog | ADMX | Device config | Compliance | App Protection | total |
|---|---|---|---|---|---|---|
| [Windows](IntuneTemplate/WIN/README.fr.md) | 114 | 1 | 6 | 11 | – | **132** |
| [macOS](IntuneTemplate/MAC/README.fr.md) | 30 | – | 3 | 4 | – | **37** |
| [iOS](IntuneTemplate/IOS/README.fr.md) | 8 | – | 2 | 3 | 1 | **14** |
| [Android](IntuneTemplate/AND/README.fr.md) | 3 | – | 2 | 8 | 1 | **14** |

```mermaid
flowchart LR
  OIB["OpenIntuneBaseline<br/>Win v4.0 · macOS v1.0 · BYOD"]
  T["<b>IntuneTemplate/</b><br/>197 stratégies<br/><i>la source</i>"]
  EX["export/NativeImport/<br/>IntuneBackupAndRestore/"]
  TENANT[("Tenant Intune")]

  OIB -->|import-oib.js| T
  T -->|export-intunebackup.js| EX
  T -.->|lit directement| CIPP[CIPP]
  EX -->|Start-IntuneRestoreConfig| TENANT
  CIPP --> TENANT

  IA["IntuneAdmin/IntuneBaselines<br/>874 profils"] -->|import-intuneadmin.js| T

  style T stroke-width:3px
```

**[OVERZICHT.md](OVERZICHT.fr.md)** est le résumé à partager : ce qu'il contient, ce qui a changé
et ce qui reste à faire dans le tenant.

**[STRUCTUUR.md](STRUCTUUR.fr.md)** est le plan : quel dossier contient quoi, quel script lit et
écrit quoi, et à quels systèmes le dépôt est lié.

**[COMPLIANCE.md](COMPLIANCE.fr.md)** est la justification destinée à un RSSI ou à un auditeur : pour chaque mesure
de l'annexe A de l'ISO/IEC 27001:2022, chaque mesure NIS2 (art. 21, par. 2), chaque safeguard CIS Controls v8.1 et chaque
sous-catégorie NIST CSF 2.0, quelles stratégies la mettent en œuvre techniquement, dans quelle phase — et ce qui
reste organisationnel. Généré par `scripts/generate-compliance.js` à partir des `controls` de
`_manifest.json` et du vocabulaire de `IntuneTemplate/_controls.json` ; `check-scope.js` refuse une
stratégie sans étiquette ou avec une étiquette inconnue. Ce qui est dans git ne concerne qu'Intune ; les 41
stratégies Conditional Access de [CA-Policies](https://github.com/sjkanon/CA-Policies) s'y ajoutent avec
`--ca ../CA-Policies/controls/ca-controls.json` — nécessaire pour une image honnête de NIS2 (j), car la MFA
dépend presque entièrement de ce dépôt. Voir [`scripts/README.md`](scripts/README.fr.md#le-volet-ca-de-compliancemd).

**[`extras/`](extras/README.fr.md)** contient ce qui fait partie d'une baseline complète sans relever d'aucun des cinq
types de stratégie CIPP : restrictions d'inscription, configuration d'applications, filtres d'affectation, App Control for
Business, remédiations et scripts — par plateforme, avec des instructions de déploiement.

Chaque dossier possède un README avec les détails : [`IntuneTemplate/`](IntuneTemplate/README.fr.md) (avec
un tableau par plateforme), [`scripts/`](scripts/README.fr.md) et [`export/`](export/README.fr.md).

Cinq sortes de configuration n'entrent pas dans les cinq types de stratégie CIPP et se trouvent donc en dehors de
`IntuneTemplate/`, chacune avec son propre README : les profils d'inscription ADE macOS dans
[`enrollment/macos/`](enrollment/macos/README.fr.md), les scripts shell macOS dans
[`shellscripts/macos/`](shellscripts/macos/README.fr.md), les scripts de plateforme Windows dans
[`platformscripts/windows/`](platformscripts/windows/README.fr.md), le contrôle de conformité personnalisé
pour Defender sur macOS dans [`compliance/macos/`](compliance/macos/README.fr.md) et l'application Win32 qui
supprime le McAfee préinstallé dans
[`apps/win32/remove-mcafee/`](apps/win32/remove-mcafee/README.fr.md). Aucun des
pipelines ne les prend en compte.

Les deux dossiers de scripts font la même chose sous deux formes : un **mappage de lecteur n'est pas une stratégie**. Aucun
des 18 329 settingDefinitionId du settings catalog ne mappe un lecteur réseau, et Group
Policy Preferences → Drive Maps n'est pas de l'ADMX et ne peut donc pas être ingéré. Pour fournir un partage à un
groupe d'utilisateurs, on utilise un script en contexte utilisateur affecté à un
groupe d'utilisateurs.

Le dernier élément figure ici pour une seule raison : McAfee met **Microsoft Defender en mode passif**. Les
règles ASR, Controlled Folder Access, Network Protection et Remote Encryption Protection de cette
baseline reposent toutes sur un moteur Defender actif. Si elles arrivent sur un appareil avec McAfee,
Intune les indique comme réussies alors que rien n'est appliqué.

## Deux paramètres du tenant qui ne sont pas des stratégies

La baseline ne peut pas les définir et `check-scope.js` ne les voit pas, mais sans ces deux-là une
partie du reste ne fait rien. Définissez-les avant de commencer les affectations.

| Paramètre | Où | Pourquoi |
|---|---|---|
| **Marquer les appareils sans stratégie de conformité affectée comme → Non conforme** | Intune → Appareils → Conformité → Paramètres de stratégie de conformité | Vaut *Conforme* par défaut. Un appareil qui échappe à *toute* affectation à cause d'un filtre, d'un groupe d'exclusion ou d'un utilisateur principal manquant compte alors comme conforme et passe Conditional Access sans problème. Les stratégies de conformité de cette baseline n'y changent rien — elles ne sont évaluées qu'une fois qu'une est affectée. Voir [Rozemuller](https://rozemuller.com/why-does-this-intune-device-have-no-compliance-policy-assigned/). |
| **Connecteur Defender for Endpoint** | Intune → Endpoint Security → Microsoft Defender for Endpoint | Nécessaire pour l'intégration via `WIN - D - Defender EDR Policy` et pour un contrôle du score de risque de Defender. Ce contrôle ne figure volontairement pas dans la baseline — OpenIntuneBaseline v4.0 ne l'a pas non plus ; `WIN - U - Compliance Defender Real Time Protection` et `Defender Security Intelligence` contrôlent ce qui se trouve *sur* l'appareil et fonctionnent sans connecteur. Si vous voulez malgré tout prendre en compte le score de risque, activez d'abord le connecteur : sans lui, le score n'arrive jamais et le contrôle reste muet, sans verdict. |

Sur macOS, le volet Defender est un troisième cas : ce contrôle n'existe pas en tant que paramètre et nécessite un
script — voir [`compliance/macos/`](compliance/macos/README.fr.md).

À côté de chaque modèle se trouve un fichier markdown listant **chaque paramètre que cette stratégie définit** — par exemple
[Windows Hello for Business](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md).
Également généré, il ne peut donc pas diverger du JSON voisin.

**Une seule baseline.** Jusqu'en septembre 2026, trois ensembles coexistaient — `IntuneTemplate/`,
`ISMSTemplate/` et `BASELINE2/`. Ils ont été fusionnés : tout se trouve désormais dans `IntuneTemplate/`
sous le préfixe `Baseline_`. Ce que faisaient les dossiers séparés, c'est maintenant le champ `fase` de
[`_manifest.json`](IntuneTemplate/_manifest.json) qui le fait.

| Phase | Signification | Nombre |
|---:|---|---:|
| 1 | **Immédiat** — déployer dès que la baseline est dans le tenant. Aucun effet perceptible, ou des effets qui ne demandent aucune préparation. | 101 |
| 2 | **Pilote** — d'abord sur un groupe pilote. Modifie quelque chose que l'utilisateur remarque, ou peut casser quelque chose que vous voulez voir d'abord. | 39 |
| 3 | **En attente d'un prérequis** — prête, mais ne fait rien aujourd'hui. Les stratégies de conformité iOS et Android attendent la première inscription. | 26 |
| 4 | **Groupe dédié** — destinée à un groupe spécifique, pas à tous les appareils. `faseGroep` indique lequel. | 16 |
| 5 | **Ne pas déployer** — alternative à une stratégie qui, elle, *est* déployée. L'affecter provoque un Conflict. | 15 |

Seule la phase 1 figure dans `_assignments.json`. `check-scope.js` veille à ce que les deux ne
divergent pas : une stratégie de phase 1 sans affectation n'est silencieusement pas déployée, et une
stratégie de phase 5 *avec* affectation provoque un Conflict, après quoi le paramètre contesté n'est appliqué par aucune
des deux stratégies. Toute stratégie au-delà de la phase 1 a un `faseWaarom` obligatoire.

La phase détermine aussi le **paquet CIPP** d'une stratégie — le champ `Package` du modèle,
sur lequel CIPP regroupe ses baselines. Voir [déployer via une baseline CIPP](#déployer-via-une-baseline-cipp).

**[`ANALYSE.md`](ANALYSE.fr.md)** consigne comment le complément de septembre 2026 a vu le jour :
quelles sources ont été comparées, les 509 paramètres qu'IntuneAdmin définit en plus des nôtres, pourquoi
14 d'entre eux ont été retenus, et — surtout — ce qui n'y figure volontairement *pas* et pourquoi.

## Organisation

```
IntuneTemplate/
  _assignments.json     cible d'affectation par stratégie
  _manifest.json        pourquoi chaque stratégie existe, d'où elle vient et dans quelle phase
  _renames.json         nom des stratégies dans le tenant (source pour Rename-BaselinePolicy.ps1)
  WIN/  SettingsCatalog/ AdministrativeTemplates/ DeviceConfigurations/ CompliancePolicies/
  MAC/  SettingsCatalog/ CompliancePolicies/
  IOS/  AppProtection/
  AND/  AppProtection/
```

Le dossier se déduit du nom de fichier (plateforme) et du `Type` CIPP (type de stratégie) et ne
porte donc aucune information qui ne figure pas aussi dans le fichier. C'est voulu : le dossier sert à
parcourir et à filtrer par plateforme, pas à constituer une seconde vérité susceptible de
diverger. `check-scope.js` vérifie que chaque fichier est à sa place.

Cinq types de stratégie, distingués par `.Type` dans le modèle :

| `.Type` | Dossier | Endpoint Graph | Dossier IntuneBackupAndRestore |
|---|---|---|---|
| `Catalog` | `SettingsCatalog` | `deviceManagement/configurationPolicies` | `Settings Catalog` |
| `Admin` | `AdministrativeTemplates` | `deviceManagement/groupPolicyConfigurations` | `Administrative Templates` |
| `Device` | `DeviceConfigurations` | `deviceManagement/deviceConfigurations` | `Device Configurations` |
| `deviceCompliancePolicies` | `CompliancePolicies` | `deviceManagement/deviceCompliancePolicies` | `Device Compliance Policies` |
| `AppProtection` | `AppProtection` | `deviceAppManagement/managedAppPolicies` | `App Protection Policies` |

## Nommage

```
[Baseline] - <WIN|MAC|IOS|AND> - <D|U> - <Item>      nom de la stratégie dans le tenant
Baseline_<WIN|MAC|IOS|AND>_<D|U>_<Item>.json         nom de fichier
```

Le préfixe `Baseline_` reste obligatoire : `export-intunebackup.js`, `generate-docs.js` et
`Set-BaselineAssignment.ps1` filtrent tous trois dessus. Un fichier qui perd ce préfixe
disparaît silencieusement des trois pipelines.

**Quand D et quand U.** Pour le Settings Catalog Windows, la portée découle du
`settingDefinitionId`, pas du sujet : tout ce qui porte le préfixe `user_` est de portée utilisateur, le
reste de portée appareil (attention aux ids `vendor_msft_` sans préfixe device — ils sont de portée appareil).
Une stratégie ne contient jamais les deux au niveau supérieur. Une stratégie mixte ne peut pas être affectée
sans ambiguïté, et lors du dépannage on ne voit pas si un paramètre n'arrive pas parce que
l'appareil ou parce que l'utilisateur est hors portée.

Pour macOS, iOS, Android et les autres types de stratégie, le settingDefinitionId ne dit rien de la
portée (`com.apple.*`), ou le fichier ne contient aucun paramètre. Là, D/U est un
choix quant à la cible d'affectation — comme OpenIntuneBaseline utilise aussi ces lettres — et
`check-scope.js` ne contrôle que la convention de nommage.

Deux conséquences, toutes deux visibles dans `_manifest.json` :

- *Device Guard, Credential Guard and HVCI*, *Power and Device Lock* et *Windows
  Sandbox* d'OIB y portent `U` parce qu'OIB les affecte aux utilisateurs (entre autres pour éviter un redémarrage en plein
  Autopilot). Leurs paramètres sont de portée appareil, ici ce sont donc des `D`.
- *Windows Spotlight and Org Messages* d'OIB est mixte et a été scindé ici en
  `WIN - U - Windows Spotlight` et `WIN - D - Cloud Optimized Content`.

Une exception qui ne contredit pas la règle : Intune place certains paramètres comme **enfant**
sous un parent de l'autre portée (`allowwindowsconsumerfeatures` et `allowwindowstips`
se trouvent sous « Allow Windows Spotlight », de portée utilisateur). Ils ne peuvent pas être configurés séparément et
suivent leur parent ; `check-scope.js` les signale et les laisse en place.

## Contrôles

```bash
node scripts/check-scope.js            # échoue en cas de problème de portée, de nom, de dossier ou de conflit
node scripts/check-scope.js --report   # uniquement la synthèse
```

Six contrôles : portée mixte, convention de nommage, nom de fichier vs nom de stratégie, emplacement dans le
bon dossier, concordance du champ `Package` avec la phase et l'affectation, et — nouveau depuis
l'import OIB — si deux stratégies *affectées* définissent le même paramètre
sur une valeur **différente**. Ce dernier cas provoque un *Conflict* dans Intune, après quoi le
paramètre n'est appliqué par aucune des deux stratégies. La même valeur issue de deux stratégies n'est
pas un conflit mais une double maintenance, et est signalée à part. Pour macOS, on signale seulement que
plusieurs stratégies fournissent le même payload : Apple fusionne les profils, c'est normal là-bas.

S'exécute comme première étape de `.github/workflows/generate-baseline.yml` et est bloquant.

## Trois dérivés d'une seule source

| Cible | Chemin | Script |
|---|---|---|
| Format de restauration pour IntuneBackupAndRestore | `export/NativeImport/IntuneBackupAndRestore/` | `node scripts/export-intunebackup.js` |
| Idem pour chaque ensemble supplémentaire | `export/NativeImport/IntuneBackupAndRestore-<SET>/` | le même script |
| Baseline CIPP (stages et paquets) | `BaselineTemplate/Baseline.json` | `node scripts/generate-baseline-template.js` |
| CIPP | *aucune conversion* — CIPP lit `IntuneTemplate/` directement | |

**En cas de modification dans `IntuneTemplate/` :** `.github/workflows/generate-baseline.yml`
régénère `export/NativeImport/IntuneBackupAndRestore/`, `BaselineTemplate/Baseline.json` et la
documentation générée automatiquement et ouvre une PR à cet effet — vérifiez le diff (stratégies
nouvelles ou supprimées, paramètres modifiés) avant de fusionner.

## Mettre à jour OpenIntuneBaseline

```bash
git -c core.longpaths=true clone --depth 1 https://github.com/SkipToTheEndpoint/OpenIntuneBaseline .oib-source
node scripts/import-oib.js --dry-run
node scripts/import-oib.js
```

> **Depuis le 14 septembre 2026, l'importeur est de nouveau idempotent :** une deuxième exécution n'écrit rien. Le
> travail manuel qu'une exécution complète annulait auparavant figure désormais dans le manifeste (`dropSettings`,
> `veldOverrides`, aussi avec `toevoegen` pour les champs que la source ne fournit pas), les stratégies sans source
> et sans `type` conservent leur propre Type, et `auditRuleInformation` issu d'exports plus récents est supprimé.
> Relisez néanmoins le `--dry-run` à chaque nouvelle version d'OIB.

`IntuneTemplate/_manifest.json` détermine où atterrit chaque stratégie OIB, avec pour chaque stratégie la
raison en cas d'écart. `.oib-source/` est dans le gitignore : les modèles générés sont le
résultat, et une seconde copie d'un dépôt externe ne ferait que vieillir ici.

`core.longpaths=true` est nécessaire sous Windows — OIB a des noms de fichiers qui dépassent MAX_PATH.

Cinq choses que l'importeur fait délibérément :

1. **Les GUID sont conservés.** Le RowKey/GUID identifie la ligne de modèle CIPP ; un
   modèle réécrit qui recevrait un nouveau GUID produirait, à la synchronisation suivante, un
   second modèle portant le même nom.
2. **Nos propres paramètres inconnus d'OIB sont conservés.** Notre stratégie BitLocker couvre aussi
   les lecteurs fixes et amovibles, OIB seulement le lecteur du système ; écraser aveuglément désactiverait
   cela silencieusement. La règle : un paramètre de premier niveau de l'ancien modèle est conservé,
   sauf si ce settingDefinitionId apparaît *quelque part* dans l'ensemble OIB importé. L'exécution indique
   précisément ce qui a été repris.
3. **Les écarts volontaires par rapport à OIB sont conservés.** Le point 2 ne sauve que les paramètres qu'OIB
   ne connaît *pas*. Une *valeur* différente sur un paramètre qu'OIB définit *bien* — l'œil de révélation du mot de passe,
   l'action Defender en cas de menace faible — serait annulée silencieusement à chaque import. Ils
   figurent donc comme `overrides` dans le manifeste, avec un `reason` obligatoire :

   ```json
   "overrides": [
     {
       "settingDefinitionId": "device_vendor_msft_policy_config_credentialsui_disablepasswordreveal",
       "value": "device_vendor_msft_policy_config_credentialsui_disablepasswordreveal_1",
       "reason": "CIS L1; het onthulknopje maakt meekijken triviaal."
     },
     {
       "parent": "vendor_msft_firewall_mdmstore_domainprofile_enablefirewall",
       "settingDefinitionId": "vendor_msft_firewall_mdmstore_domainprofile_allowlocalpolicymerge",
       "value": "vendor_msft_firewall_mdmstore_domainprofile_allowlocalpolicymerge_false",
       "reason": "OIB zet local policy merge alleen op het openbare profiel."
     }
   ]
   ```

   Sans `parent`, le paramètre doit déjà figurer dans la source OIB et seule la valeur est
   remplacée ; *avec* `parent`, il est ajouté comme enfant. Si le point d'ancrage disparaît d'une
   nouvelle version d'OIB, **l'import s'arrête avec une erreur** au lieu de laisser l'override tomber
   silencieusement — ce dernier cas est le plus dangereux, car le fichier semble toujours correct
   alors que la raison a disparu. L'exécution énumère chaque override appliqué.
4. **La clé PPPC obsolète `Allowed` est supprimée.** Le payload TCC d'Apple comporte deux
   clés pour la même décision : `Allowed` (macOS 10.14) et `Authorization` (macOS 11+).
   Elles ne peuvent pas figurer ensemble dans une même règle. OIB fournit les deux, et macOS rejette alors le
   payload TCC **entier** : Intune signale `10022` sur chaque champ de cette règle et l'application n'obtient
   aucun droit — pas même celui qui était correctement défini. Cela touchait nos stratégies macOS pour
   OneDrive et Defender for Endpoint. Voir [OpenIntuneBaseline issue
   #62](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/issues/62) ; elle est toujours
   ouverte, donc cela se produit à chaque import plutôt qu'une seule fois dans les modèles.
   L'exécution indique ce qui a été supprimé.
5. **Idempotent.** Lors d'une deuxième exécution, le fichier cible lui-même est la source de ces paramètres
   repris, donc même entrée → même sortie.

Six stratégies OIB n'ont volontairement pas été reprises (variantes d'audit, alternatives 24H2, driver
update profiles, Windows 365) — avec leur raison, dans `"excluded"` du manifeste.

## Restaurer dans un tenant

**Via CIPP :** faites pointer le dépôt de modèles vers ce dépôt. Les cinq valeurs de `.Type`
correspondent toutes à un `TemplateType` du `Set-CIPPIntunePolicy` de CIPP. Après la synchronisation, les 141
modèles figurent dans CIPP sous Tenant Administration → Templates.

### Déployer via une baseline CIPP

Dans CIPP, les modèles ne font qu'être présents ; le déploiement est l'affaire d'une **baseline** (Tenant Administration →
Baselines). Une baseline se compose de *standards*, et le standard qui déploie nos stratégies s'appelle
**Intune Template Package** : il déploie en une fois *chaque* modèle portant la même valeur `Package`,
et redétermine cette appartenance à chaque exécution. Une nouvelle stratégie dans ce dépôt
entre donc d'elle-même dans la baseline — rien n'est à cliquer dans CIPP.

Les options de déploiement d'un tel standard sont copiées telles quelles sur chaque membre : **un paquet égale une
cible d'affectation**. C'est pourquoi tous les modèles ne portent pas le même `Package`. La répartition découle de la
phase et de la cible d'affectation et figure dans le [README d'`IntuneTemplate`](IntuneTemplate/README.fr.md#packages-cipp) ;
`set-packages.js` écrit le champ, `check-scope.js` le surveille.

Toute cette organisation se trouve dans le dépôt sous forme de fichier : [`BaselineTemplate/Baseline.json`](BaselineTemplate/Baseline.json).
Il arrive affecté au tenant fictif `Exported Template`, donc rien n'est déployé
tant que vous n'avez pas choisi vous-même des tenants. Voir le [README de BaselineTemplate](BaselineTemplate/README.fr.md). Si vous
préférez la construire à la main : ajoutez un *Intune Template Package* par paquet avec l'affectation
de ce tableau.

**Attention — ce fichier n'est pas repris par la liaison automatique.** La synchronisation planifiée
(`New-CIPPTemplateRun`) récupère chaque `.json` et le fait passer par `Import-CommunityTemplate`, sans
regarder `TemplateType` ; seul le bouton Import de **Tools → Community Repos** connaît
l'aiguillage vers l'import de baseline. Les stratégies de `IntuneTemplate/` arrivent donc d'elles-mêmes,
la baseline elle-même se récupère une fois avec ce bouton — et à nouveau lorsqu'elle change, ce que le
catalogue signale par un *UpdateAvailable*. Entre-temps, la synchronisation automatique en fait la même
ligne de modèle sans nom que pour les autres fichiers non-stratégie ; celle-ci ne fait rien et peut être supprimée dans
CIPP.

Les stages qu'elle contient :

| Stage | Paquets | Passage à *ce* stage |
|---:|---|---|
| 1 · Immédiat | `Baseline-Devices`, `Baseline-Users`, `Baseline-ADE-token` et les trois paquets de groupe | — le stage 1 s'applique toujours |
| 2 · Pilote | `Baseline-Pilot` | `success` (tout le stage 1 est conforme) **et** `time` de deux semaines |
| 3 · En attente d'un prérequis | `Baseline-Wacht` | `manual` — quelqu'un le fait avancer |

Les stages suivants s'empilent sur le stage 1, et la condition appartient au stage dans lequel un tenant
**entre**, pas à celui qu'il quitte. CIPP en connaît cinq : `time`, `variable`,
`group`, `success` et `manual`. Placez un paquet dans exactement un stage : le même modèle deux
fois avec une cible d'affectation différente se heurte à la détection de conflits de CIPP. Faites donc
grandir le pilote via le **groupe** `SEC-Baseline-Pilot` et non via un stage supplémentaire.

Notez où se trouve l'export de restauration : `export/**NativeImport**/IntuneBackupAndRestore/`. Ce
mot dans le chemin n'est pas une description mais une exclusion. CIPP récupère la liste des fichiers avec
`git/trees?recursive=1` et ignore exactement deux choses : les fichiers qui ne se terminent pas par `.json`,
et les chemins contenant `NativeImport`. Il n'existe pas de paramètre de sous-dossier. Sans ce mot,
CIPP importerait *aussi* ces 219 fichiers — les mêmes 122 stratégies plus leurs affectations et le
profil ADE embarqué, mais sans `RowKey`, dont CIPP ferait alors un **second** modèle
portant le même nom et son propre GUID.
OpenIntuneBaseline utilise le même dossier pour la même raison.

`BaselineTemplate/Baseline.json` fait aussi partie de cette liste, mais uniquement pour la synchronisation *automatique* :
celle-ci ne regarde pas `TemplateType` et en fait donc aussi une ligne sans nom. Via Tools →
Community Repos → Import, il *est* reconnu comme baseline. Voir
[ci-dessous](#déployer-via-une-baseline-cipp).

Ce qui reste : six fichiers sont bien des `.json` mais pas des stratégies — les trois fichiers `_` de
`IntuneTemplate/`, les deux `_manifest.json` et le profil ADE macOS dans `enrollment/macos/`. CIPP
en fait une seule ligne sans nom et sans type (ils se confondent parce que la
déduplication se fait sur `Displayname`, vide pour les six). Cette ligne ne fait rien ;
on peut la nettoyer en la supprimant dans CIPP. Les placer sous un chemin `NativeImport` n'est pas possible :
ils sont lus par les scripts à côté de leur propre dossier.

**Via IntuneBackupAndRestore** (testé avec le module 4.0.1) :

```powershell
Start-IntuneRestoreConfig      -Path '<repo>\export\NativeImport\IntuneBackupAndRestore'
Start-IntuneRestoreAssignments -Path '<repo>\export\NativeImport\IntuneBackupAndRestore' -RestoreById $false
Invoke-IntuneRestoreAppProtectionPolicyAssignment -Path '<repo>\export\NativeImport\IntuneBackupAndRestore' -RestoreById $false
```

`-RestoreById $false` est obligatoire : l'export ne contient volontairement aucun id de tenant, le module
doit donc faire la correspondance sur le nom de la stratégie. C'est aussi le seul mode qui fonctionne entre tenants — un id du
tenant A ne pointe vers rien dans le tenant B.

La troisième ligne n'est pas un oubli : dans la 4.0.1, `Start-IntuneRestoreAssignments` appelle bien les
affectations du Settings Catalog, de l'ADMX, des device configurations et de la conformité, mais **pas**
celles d'App Protection. Sans cet appel séparé, les deux stratégies MAM sont bien présentes, mais
sans affectation — et elles ne protègent alors rien.

Pas de `Start-IntuneRestoreAssignments` à la suite : cet export ne contient volontairement pas de dossier
`Assignments/`. Après la restauration, les stratégies doivent être affectées à la main à un groupe pilote, pas à All
Devices — voir les phases ci-dessus. Et deux dossiers au lieu d'un, parce que
`Start-IntuneRestoreConfig` restaure tout ce qui se trouve sous le chemin indiqué : réunis dans un seul dossier,
quiconque restaure la baseline déploierait à son insu l'ensemble pilote avec elle.

L'exporteur écrit les affectations d'app protection sous la forme attendue par le module :
nom de fichier `<guid> - <policynaam>.json` (le module lit comme nom tout ce qui suit le premier
` - `) et la liste dans une propriété `value` au lieu d'un tableau nu. Pour les autres
types de stratégie, le nom de fichier est le nom de la stratégie et le contenu *est* un tableau nu.

**Valeurs propres au tenant :** le jeton d'intégration EDR dans `Baseline_WIN_D_Defender_for_Endpoint_EDR`
est un `encryptedValueToken` qui n'a de sens que dans le tenant source. C'est pourquoi, depuis
septembre 2026, c'est la variante connecteur `Baseline_WIN_D_Defender_EDR_Policy` qui est déployée et
celle-ci est en phase 5. Lors d'une restauration dans un autre tenant, ce paramètre doit être relié à
nouveau manuellement.

## Affecter dans un tenant

```powershell
.\scripts\Set-BaselineAssignment.ps1 -Scope D -AllDevices -WhatIf   # simulation
.\scripts\Set-BaselineAssignment.ps1 -Scope D -AllDevices
.\scripts\Set-BaselineAssignment.ps1 -Scope U -AllUsers
.\scripts\Set-BaselineAssignment.ps1 -Platform MAC -Scope D -AllDevices
.\scripts\Set-BaselineAssignment.ps1 -GroupName 'SEC-Baseline-Pilot'
.\scripts\Set-BaselineAssignment.ps1 -GroupId '<object-id>' -Exclude
```

Pose en une fois une affectation sur les stratégies de baseline correspondant à cette cible, à travers les cinq
types de stratégie (chacun avec son propre endpoint Graph). Lesquelles découle de la phase, comme
pour les paquets CIPP : `-AllDevices` et `-AllUsers` prennent la phase 1 avec cette cible dans
`_assignments.json`, `-GroupName 'SEC-Baseline-Pilot'` prend le pilote, et un groupe de
`faseGroep` prend les stratégies de phase 4 de ce groupe. Le script n'affecte jamais de lui-même les phases 3 et 5
— jusqu'en septembre 2026, `-AllDevices` le faisait, alternatives et pilote compris.
`-IgnoreFase` prend tout malgré tout, pour un tenant de test ; `-Exclude` s'applique toujours à toutes les stratégies.

`-Scope D|U` filtre ensuite sur la portée indiquée dans le nom, `-Platform` sur la plateforme. Les stratégies qui
ne suivent pas la convention de nommage échappent à *tout* filtre ; le script le signale explicitement
au lieu de les ignorer silencieusement.

App Protection est un cas à part : on trouve les stratégies via `managedAppPolicies`, mais
l'affectation n'est possible que via la collection propre à la plateforme (`iosManagedAppProtections` /
`androidManagedAppProtections`). Le script fait cette traduction à partir du `@odata.type`.

Les affectations sont **complétées**, pas remplacées. Le `/assign` de Graph écrase toujours la
liste complète, donc le script lit d'abord les affectations existantes et envoie (POST) la
fusion ; une cible déjà présente ne crée pas de doublon. Avec `-Replace`, vous
supprimez au contraire les existantes. En option, `-FilterId` + `-FilterType` pour un filtre d'affectation.

Les stratégies absentes du tenant sont signalées, pas créées — déployez-les d'abord via
CIPP ou `Start-IntuneRestoreConfig`.

### Neuf stratégies sont volontairement sans affectation

Chacune d'elles est une *alternative* à une stratégie qui, elle, *est* affectée, et non un complément
à celle-ci. Deux stratégies affectées qui définissent le même paramètre sur une valeur différente provoquent dans
Intune un Conflict, après quoi le paramètre n'est appliqué par aucune des deux — c'est
pire que de n'avoir aucune des deux stratégies. `check-scope.js` y veille.

| Stratégie | Alternative à | Destinée à |
|---|---|---|
| `WIN - D - Windows Update Ring 1 Pilot` | anneau de mise à jour 3 | groupe pilote |
| `WIN - D - Windows Update Ring 2 UAT` | anneau de mise à jour 3 | groupe UAT |
| `WIN - D - Defender Update Ring 1 Pilot` | anneau Defender 3 | groupe pilote |
| `WIN - D - Defender Update Ring 2 UAT` | anneau Defender 3 | groupe UAT |
| `WIN - D - Defender ASR Policy Audit Mode` | `Attack Surface Reduction` — les mêmes 16 règles en audit au lieu de block | groupe pilote, et alors *sans* la stratégie bloquante |
| `WIN - D - Defender AV Policy` | `Defender Antivirus` — le modèle CIPP à côté de la version OIB, plus permissif sur trois points | rien ; la version OIB est plus stricte |
| `WIN - D - Defender for Endpoint EDR` | `Defender EDR Policy` — même intégration, mais avec le jeton d'intégration fixe d'un seul tenant au lieu du connecteur | uniquement le tenant d'où provient ce jeton |
| `WIN - D - Microsoft Edge Search Engine` | aucune — Google comme moteur de recherche par défaut est un choix du client, pas un paramètre de sécurité | uniquement une organisation qui l'a décidé |
| `WIN - D - Windows Hello for Business Multi User` | `Windows Hello for Business` — mêmes exigences, mais sans provisionnement juste après la connexion | groupe avec des appareils partagés |

```powershell
.\scripts\Set-BaselineAssignment.ps1 -Name '[Baseline] - WIN - D - Windows Update Ring 1 Pilot' -GroupName 'SEC-Update-Ring1'
.\scripts\Set-BaselineAssignment.ps1 -Name '[Baseline] - WIN - D - Windows Hello for Business Multi User' -GroupName 'SEC-Shared-Devices'
```

La variante WHfB pour appareils partagés est la seule que l'on peut affecter *à côté* de son pendant :
les quatre paramètres qui se recoupent y ont la même valeur, il n'y a donc rien qui puisse
entrer en conflit — elle ajoute seulement `DisablePostLogonProvisioning`.

### Ce qu'il faut d'abord mettre en pilote

Le reste de la baseline est prudent sur le fond, mais ces stratégies modifient un comportement qui
touche directement les utilisateurs ou les anciens systèmes. OpenIntuneBaseline dit la même chose : c'est un
point de départ, pas une configuration de production clé en main.

C'est la phase 2, et la liste — avec pour chaque stratégie le pourquoi — se trouve dans
[OVERZICHT.md](OVERZICHT.fr.md#dabord-en-pilote). Elle est générée à partir de `faseWaarom` dans le
manifeste. Jusqu'en septembre 2026, une liste distincte figurait ici, et elle a divergé : neuf des
stratégies qui y figuraient étaient en phase 1 et étaient tout simplement déployées sur tous les appareils via `Baseline-Devices`.
Windows Hello for Business entre en pilote en tant que paire, device *et* user — l'une en
pilote et l'autre pour tout le monde rend le pilote inutile.

## Ramener une sauvegarde d'un tenant vers la source

```powershell
node scripts/import-intunebackup.js "C:\Temp\BaselineIntuneBackup" [--overwrite] [--dry-run]
```

Convertit un export IntuneBackupAndRestore vers `IntuneTemplate/`. Par défaut, seules
les stratégies qui n'existent pas encore sont ajoutées ; les modèles existants sont conservés sauf si vous passez
`--overwrite`. Un export d'un tenant n'est en effet pas automatiquement plus récent que ce qui se trouve
ici — écraser aveuglément annule silencieusement une modification de la baseline.

Une stratégie qui existe déjà ici conserve son chemin et son GUID ; les nouvelles stratégies sont classées par
plateforme et type de stratégie d'après leur nom. Les noms qui ne suivent pas la convention sont signalés, pas
devinés.

L'importeur refuse en outre les exports Settings Catalog tronqués (`settingCount` diffère du
nombre de paramètres exportés). Cela arrive réellement : Graph pagine par défaut la
propriété de navigation settings à 25, et un export qui n'en tient pas compte produit une stratégie
à laquelle, lors de la restauration, manque la plus grande partie de ses paramètres.

## Mettre à jour le tenant

Les stratégies figurent encore dans le tenant sous leur ancien nom. `IntuneTemplate/_renames.json` consigne
comment elles s'appelaient et ce qui leur correspond aujourd'hui :

```powershell
.\scripts\Rename-BaselinePolicy.ps1 -WhatIf     # première exécution obligatoire
.\scripts\Rename-BaselinePolicy.ps1
```

Le renommage se fait par un `PATCH` : l'id de la stratégie, les affectations et l'historique d'affectation
restent intacts. `Start-IntuneRestoreConfig` crée les stratégies par nom et placerait un doublon sous le nouveau
nom à côté de l'ancien.

Trois règles de `_renames.json` exigent un travail manuel et sont seulement signalées par le script :

- **replace** — le type de stratégie change, un PATCH est donc impossible. `Windows Firewall` est devenu un
  modèle Endpoint Security et `Microsoft Office Updates` est passé de l'ADMX au Settings
  Catalog. L'ancienne stratégie doit disparaître avant que la nouvelle soit ajoutée.
- **retire** — disparaît entièrement ; `replacedBy` indique où se trouvent désormais les paramètres.
- **doublon / les deux présents** (`DUPLICATE` / `BOTH PRESENT` dans la sortie) — l'ancien et le nouveau nom existent tous deux. Déterminer d'abord lequel
  est le vrai.
