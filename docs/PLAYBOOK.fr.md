[Nederlands](PLAYBOOK.md) · [English](PLAYBOOK.en.md) · **Français**

# Guide de déploiement : la baseline via CIPP, par classe d'appareils

Pour les ingénieurs ITCE qui mettent cette baseline en place dans un tenant client avec CIPP. Le
guide part de trois classes d'appareils Windows — commune, physique et AVD — distinguées par des
**filtres d'affectation** plutôt que par des groupes. La classe de chaque stratégie et sa raison
figurent dans [AVD.fr.md](AVD.fr.md) ; l'organisation du dépôt dans [STRUCTUUR.fr.md](STRUCTUUR.fr.md).

**Rien dans ce guide ne se fait tout seul.** La baseline dans CIPP ne se déploie que lorsque vous
lui affectez des tenants, et chaque script passe d'abord par une exécution `-WhatIf`.

## Les trois classes d'appareils

Chaque stratégie Windows a un `doelgroep` (classe cible) dans [`_manifest.json`](../IntuneTemplate/_manifest.json).
Les stratégies macOS, iOS et Android n'en ont pas : un filtre de plateforme `windows10AndLater` n'y
est pas sélectionnable.

| Classe (`doelgroep`) | Quoi | Filtre (inclusion) | Règle |
|---|---|---|---|
| `alle` (commune) | PC physiques et hôtes de session AVD, et tout ce qui ne relève d'aucun des deux filtres | aucun | — |
| `fysiek` (physique) | portables et postes de travail | `WIN - Physical` | `(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")` |
| `avd` | hôtes de session AVD sous Windows 11 Enterprise multisession | `WIN - AVD Multi-session` | `(device.operatingSystemSKU -eq "ServerRdsh")` |

Les corps se trouvent dans [`IntuneTemplate/WIN/AssignmentFilters/`](../IntuneTemplate/WIN/AssignmentFilters/README.fr.md).
Les deux ont été validés dans le tenant de test avec `validateFilter` et *Preview devices* :
`WIN - Physical` correspond aux quatre PC physiques et QEMU et pas à l'hôte AVD,
`WIN - AVD Multi-session` exactement à l'hôte AVD.

**Les Cloud PC Windows 365 et les hôtes AVD personnels** (mono-session, modèle `Cloud PC …` ou
`Virtual Machine`) ne relèvent d'**aucun** des deux filtres. Ils ne reçoivent que la classe `alle`,
plus l'ensemble Cloud PC via les groupes `SEC-Cloud-PC` et `SEC-Cloud-PC-External` (phase 4). Pas
de BitLocker, Windows Hello, Storage Sense ni `Remote Desktop and RPC` physique, et pas de FSLogix
non plus. C'est un choix, pas une erreur : chez un client Windows 365, vérifiez que l'ensemble
commun y suffit.

## Paquets

Un paquet CIPP (`Package` dans le template) a une affectation et un filtre pour tous ses membres.
Le pipeline crée donc un paquet par classe : le paquet sans suffixe pour `alle` et le non-Windows,
`-Physical` et `-AVD` pour les classes avec filtre. Uniquement en phases 1 et 2 ; la phase 3 n'est
pas affectée, la phase 4 a son propre groupe, la phase 5 ne se déploie pas. Une classe vide n'a pas
de paquet (il n'y a ni `-Users-AVD` ni `-Pilot-AVD`).

État au moment de la rédaction, recompté depuis le manifeste ; le tableau actuel, généré, figure
dans le [README d'`IntuneTemplate`](../IntuneTemplate/README.fr.md#packages-cipp).

| Paquet | Affectation | Filtre | Étape | Stratégies |
|---|---|---|---:|---:|
| `[Baseline] - Baseline-Devices` | tous les appareils | — | 1 | 53 |
| `[Baseline] - Baseline-Devices-Physical` | tous les appareils | `WIN - Physical` | 1 | 14 |
| `[Baseline] - Baseline-Devices-AVD` | tous les appareils | `WIN - AVD Multi-session` | 1 | 4 |
| `[Baseline] - Baseline-Users` | tous les utilisateurs | — | 1 | 31 |
| `[Baseline] - Baseline-Users-Physical` | tous les utilisateurs | `WIN - Physical` | 1 | 1 |
| `[Baseline] - Baseline-ADE-token` | ne pas affecter (jeton ADE) | — | 1 | 2 |
| `[Baseline] - Baseline-SEC-<groupe>` (dix paquets) | le groupe de `faseGroep` | — | 1 | 14 |
| `[Baseline] - Baseline-Pilot` | groupe `SEC-Baseline-Pilot` | — | 2 | 29 |
| `[Baseline] - Baseline-Pilot-Physical` | groupe `SEC-Baseline-Pilot` | `WIN - Physical` | 2 | 13 |
| `[Baseline] - Baseline-Wacht` | ne pas affecter | — | 3 | 26 |
| `[Baseline] - Updates-Ring3-Physical` | tous les appareils sauf `SEC-Update-Ring1/2` | `WIN - Physical` | 1 (Windows-Updates) | 1 |
| `[Baseline] - Updates-SEC-Update-Ring1`, `-Ring2` | le groupe d'anneau | — | 1 (Windows-Updates) | 2 |
| `[Baseline] - Updates-Devices` | tous les appareils | — | 1 (Windows-Updates) | 1 |
| `[Baseline] - Updates-Devices-Physical` | tous les appareils | `WIN - Physical` | 1 (Windows-Updates) | 1 |
| *(aucun paquet — phase 5)* | — | — | — | 15 |

207 au total. Les paquets `Baseline-` sont dans [`BaselineTemplate/Baseline.json`](../BaselineTemplate/Baseline.json),
les paquets `Updates-` dans [`Windows-Updates.json`](../BaselineTemplate/README.fr.md#windows-updatesjson--correctifs).
Un paquet de classe est dans la même étape que son équivalent. Le standard CIPP contient le filtre
sous forme de **nom** (`assignmentFilter`, `assignmentFilterType: include`) ; CIPP le recherche
dans chaque tenant.

## Filtres ou groupes ?

**Des filtres pour les classes**, pour quatre raisons :

1. **Dès le check-in.** Intune évalue un filtre au moment où l'appareil se signale. Un nouvel hôte
   de session ou portable reçoit tout de suite le bon ensemble ; avec un groupe dynamique, il attend
   d'abord qu'Entra l'ait placé dans le groupe, et reçoit entre-temps de mauvaises stratégies ou aucune.
2. **Aussi sur les affectations utilisateur.** Windows Hello for Business, Personal Data Encryption
   et les autres stratégies `U` vont aux utilisateurs. Exclure un *groupe d'appareils* n'y fait
   rien ; un filtre est, lui, évalué sur l'appareil auquel l'utilisateur se connecte. Le même
   utilisateur reçoit Windows Hello sur son portable et pas dans sa session AVD.
3. **Recommandé par Microsoft.** Affecter à *Tous les utilisateurs* / *Tous les appareils* avec un
   filtre est plus rapide qu'à de grands groupes : pas d'évaluation de groupe à chaque modification.
4. **Adapté à CIPP.** Un paquet CIPP a exactement un filtre, et une classe est exactement un filtre.
   L'ancien modèle — des filtres d'exclusion par stratégie sur des paquets mixtes — n'était pas
   exprimable dans CIPP.

**Les groupes restent nécessaires** lorsqu'il s'agit d'une sélection et non d'un type d'appareil :

- **Le pilote** : `SEC-Baseline-Pilot`. Faire partie du pilote est un choix, pas une propriété de l'appareil.
- **La phase 4** : `SEC-Cloud-PC`, `SEC-Cloud-PC-External`, `SEC-Shared-Devices`, les anneaux de
  mise à jour `SEC-Update-Ring1/2` et les autres groupes `faseGroep`.
- **Le groupe d'hôtes AVD `SEC-AVD-Session-Hosts`**, non pour les paquets de la baseline mais pour
  le paramètre du pool d'hôtes *RDP SSO → target device groups*, l'affectation de conformité aux
  appareils en multisession et les rapports.
- **Les fonctions qui exigent un groupe**, comme Windows Autopatch et d'autres services de mise à
  jour avec leurs propres groupes.

**Groupe et filtre** se combinent : `[Baseline] - Baseline-Pilot-Physical` va au groupe
`SEC-Baseline-Pilot` avec inclusion `WIN - Physical`. Si un hôte de session est dans le groupe
pilote, il reçoit les stratégies pilotes communes (`Baseline-Pilot`) mais pas les physiques.

## Nommage

Le dépôt ne décrit sa convention que pour les stratégies et les fichiers, dans
[README.fr.md](../README.fr.md#nommage). Déduite de l'existant, elle s'applique à tout :

**Ce qui est visible dans le tenant ou dans CIPP est en anglais ; ce qui ne vit que dans le dépôt
est en néerlandais.** Les noms de stratégies, paquets, filtres et groupes sont en anglais ; les
champs du manifeste (`doel`, `fase`, `faseGroep`, `doelgroep`) et leurs valeurs (`alle`, `fysiek`,
`avd`) en néerlandais.

| Quoi | Modèle | Exemple |
|---|---|---|
| Stratégie | `<prefix><PLATFORM> - <D\|U> - <Item>` | `[Baseline] - WIN - D - BitLocker` |
| Fichier de stratégie | `Baseline_<PLATFORM>_<D\|U>_<Item avec _>.json` | `Baseline_WIN_D_BitLocker.json` |
| Paquet CIPP | `<prefix>Baseline-<cible>[-<classe>]` | `[Baseline] - Baseline-Devices-Physical` |
| Paquet de mises à jour | `<prefix>Updates-<cible>[-<classe>]` | `[Baseline] - Updates-Ring3-Physical` |
| Suffixe de classe | `-Physical`, `-AVD` — toujours en dernier | `[Baseline] - Baseline-Pilot-Physical` |
| Paquet de groupe | `<prefix>Baseline-<nom du groupe>` | `[Baseline] - Baseline-SEC-Cloud-PC` |
| Baseline CIPP | `<prefix><Sujet>` | `[Baseline] - Windows Updates` |
| Filtre d'affectation | `<PLATFORM> - <Nom>`, **sans** préfixe | `WIN - Physical`, `AND - Corporate` |
| Fichier de filtre | `<PLATFORM>-<Nom avec ->.json` dans `<PLATFORM>/AssignmentFilters/` | `WIN-Physical.json` |
| Groupe Entra | `SEC-<But-en-mots>` avec traits d'union | `SEC-Baseline-Pilot`, `SEC-AVD-Session-Hosts` |
| Custom variable CIPP | PascalCase, entre `%` dans le template | `%SecurityAlertMail%`, `%FSLogixStorageAccount%` |
| Espace réservé dans git | `<QUOI>-INVULLEN`, renseigné dans `local/` | `DEDICATED-INSCHRIJFPROFIEL-INVULLEN` |

`<prefix>` est `[Baseline] - ` de [`_organisation.json`](../IntuneTemplate/_organisation.json) et se
modifie avec `set-organisation.js`. Les filtres ne portent volontairement pas le préfixe : ce sont
des briques utilisées aussi hors de la baseline, et CIPP, `Set-BaselineAssignment.ps1` et l'export
les recherchent littéralement par leur nom — renommer un filtre, c'est donc le tenant et ce dépôt
en même temps.

**Écarts déjà présents** (non renommés, car hors de ce travail ; bons à savoir) :

- `[Baseline] - Baseline-Wacht` est le seul mot néerlandais dans un nom de paquet ; les étapes CIPP
  ont aussi des noms néerlandais (`Nu`, `Pilot`, `Wacht op voorwaarde`, et `Melden`/`Blokkeren` pour la DLP).
- Le fichier de filtre `WIN-AVD-Multi-Session.json` a un S majuscule, le nom du filtre
  `WIN - AVD Multi-session` non. Pour les filtres Android, fichier et nom correspondent exactement.
- `[Baseline] - Baseline-SEC-Baseline-Pilot` (phase 4, une stratégie) et `[Baseline] - Baseline-Pilot`
  (phase 2) vont au même groupe : deux paquets pour une cible.
- Les noms de groupes écrivent la plateforme selon la marque (`SEC-iOS-BYOD`,
  `SEC-Remote-Support-macOS`), ailleurs sous forme de code (`IOS`, `MAC`).
- `[Baseline] Windows Hello For Business` de l'ancien ensemble ne figure pas dans `_renames.json` (voir la migration).

## Étapes

### 0. Préparation

- **Rôles** : dans le tenant client Intune Administrator (filtres, affectations) et, pour les
  scripts Graph, `DeviceManagementConfiguration.ReadWrite.All` et `Group.Read.All`. Dans CIPP un
  rôle autorisé à gérer les baselines et les standards.
- **Licences** : Intune Plan 1 (inclus dans Business Premium, E3/E5) ; pour AVD, Windows 11
  Enterprise multisession via les droits AVD ; pour les stratégies `Defender for Endpoint`,
  Defender for Business ou P2.
- **CIPP** : le tenant est ajouté (GDAP) et le dépôt de templates pointe vers ce dépôt.
- **Paramètres du tenant** de [STRUCTUUR.fr.md](STRUCTUUR.fr.md#paramètres-du-tenant-qui-ne-sont-pas-une-stratégie) :
  appareils sans stratégie de conformité non conformes, connecteur Defender for Endpoint activé.
- **Groupes** nécessaires : `SEC-Baseline-Pilot` (avec quelques PC et utilisateurs pilotes
  physiques) et les groupes `faseGroep` utilisés. Voir le
  [README de BaselineTemplate](../BaselineTemplate/README.fr.md).

### 1. Créer les filtres

**Avant la première exécution CIPP.** CIPP recherche le filtre par son nom et, s'il n'existe pas,
affecte **sans** filtre avec un simple avertissement dans le journal — BitLocker et Windows Hello
arrivent alors aussi sur les hôtes de session.

```powershell
.\scripts\Set-BaselineAssignment.ps1 -AllDevices -Doelgroep fysiek,avd -CreateFilters -WhatIf
```

ne crée que les filtres manquants à partir des corps JSON (réellement sans `-WhatIf`) et montre ce
qu'il affecterait ; vous pouvez vous arrêter après la création et laisser l'affectation à CIPP. Ou
avec Graph : `POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters` avec le
contenu du fichier. Ou dans le portail : Administration du locataire → Filtres → Créer → Appareils
gérés → Windows 10 et ultérieur.

Vérifiez ensuite chaque filtre avec **Preview devices** : `WIN - Physical` montre les portables et
postes de travail, aucun hôte de session ni Cloud PC ; `WIN - AVD Multi-session` uniquement les
hôtes de session.

### 2. Custom variable CIPP (uniquement avec AVD)

Dans CIPP : Settings → Custom Variables → pour ce tenant `FSLogixStorageAccount` = le nom du
compte de stockage (sans `.file.core.windows.net`). CIPP remplace `%FSLogixStorageAccount%` dans
`AVD FSLogix Profile Containers` et `AVD Defender FSLogix Exclusions` à chaque déploiement.
**Sans la variable**, le jeton reste tel quel dans le chemin et, avec `PreventLoginWithFailure`,
personne ne peut se connecter à l'hôte. Un tenant sans AVD n'a pas besoin de la variable : les
stratégies n'arrivent que sur des hôtes multisession.

### 3. Templates et baseline dans CIPP

1. Synchroniser les templates : la liaison au dépôt récupère `IntuneTemplate/`. Vérifiez sous
   Tenant Administration → Templates que les paquets `-Physical` et `-AVD` sont présents.
2. Importer les baselines : **Tools → Community Repos → ce dépôt → `BaselineTemplate/Baseline.json`
   → Import**, et de même `Windows-Updates.json`. La synchronisation automatique ne le fait pas.
   Une réimportation met à jour une baseline existante.
3. Vérifiez dans l'éditeur de baseline que `Baseline-Devices-Physical`, `-Users-Physical` et
   `-Devices-AVD` sont à l'étape 1 et `Baseline-Pilot-Physical` à l'étape 2, chacun avec son filtre
   et *Include*.

### 4. Affecter l'étape 1

Affectez la baseline (et `[Baseline] - Windows Updates`) au tenant. L'étape 1 se déploie tout de
suite : les paquets communs, les paquets de classe et les paquets de groupe. `remediate` est
activé, et `verifyAssignments` contrôle aussi le filtre à chaque exécution.

### 5. Vérifier

Par appareil dans Intune (Appareils → l'appareil → Configuration de l'appareil) :

- chaque stratégie *Succeeded* ou *Not applicable*, **aucun *Conflict*** ;
- un PC physique a les stratégies `-Physical` (BitLocker, Windows Hello, Storage Sense) et aucune
  stratégie `AVD …` ; un hôte de session l'inverse ;
- conforme sous *Conformité*, et dans Entra ID aussi.

Une stratégie montre par affectation le filtre et son résultat (*Filter evaluation*).
`check-scope.js` a déjà vérifié au préalable que rien n'entre en conflit au sein d'une classe (voir
[AVD.fr.md](AVD.fr.md#contrôle-des-conflits-par-classe)) ; un Conflict dans le tenant vient donc
de quelque chose hors de la baseline, le plus souvent une ancienne stratégie.

### 6. Étape 2 : le pilote

CIPP passe à l'étape 2 quand tout ce qui relève de l'étape 1 est conforme **et** que deux semaines
se sont écoulées. `Baseline-Pilot` et `Baseline-Pilot-Physical` vont alors à `SEC-Baseline-Pilot`.
Élargissez le pilote par le groupe, pas avec une étape supplémentaire.

### 7. Étape 3 à la main

`Baseline-Wacht` n'est pas affecté : ces stratégies attendent quelque chose que CIPP ne mesure pas
(première inscription d'un téléphone, un collecteur, un id de tenant). Faites avancer l'étape
quand le prérequis est là ; par stratégie, le prérequis figure dans `faseWaarom` et dans
[COMPLIANCE.fr.md](COMPLIANCE.fr.md).

## Migration depuis un ancien ensemble

Exemple : le tenant de test `kanon` a les anciennes stratégies `[Baseline] X` (p. ex.
`[Baseline] Bitlocker`) sur *Tous les appareils* sans filtre, avec des filtres d'exclusion
`WIN - AVD Multi-session` posés à la main sur Bitlocker, Device Lock, Windows Hello For Business,
`Windows 11 Update` et Office Updates.

1. **Renommer plutôt que mettre à côté.** `.\scripts\Rename-BaselinePolicy.ps1 -WhatIf`, puis sans.
   Le script recherche chaque `previousNames` de [`_renames.json`](../IntuneTemplate/_renames.json)
   et pose le nom actuel (PATCH : l'id et les affectations restent). `replace` et `retire`, il ne
   fait que les signaler. Par exemple `[Baseline] Office Updates` est `replace` (ADMX → Settings
   Catalog) : l'ancienne doit partir une fois la nouvelle en place. `[Baseline] Windows Hello For
   Business` ne figure pas dans `_renames.json` ; déterminez à la main quelle nouvelle stratégie la
   remplace.
2. **Créer les filtres** (étape 1) et **affecter la baseline** (étape 4). CIPP retrouve les
   stratégies renommées par leur nom, aligne le contenu et remplace l'affectation par celle du
   paquet : `verifyAssignments` gère l'affectation, donc l'ancienne *Tous les appareils sans
   filtre* devient *Tous les appareils avec inclusion `WIN - Physical`*.
3. **Nettoyer les filtres d'exclusion posés à la main.** Sur les stratégies renommées, ils
   disparaissent d'eux-mêmes à l'étape 2 (CIPP remplace l'affectation). Sur les anciennes
   stratégies non renommées (`replace`, `retire`, ou absentes de `_renames.json`), ils sont
   toujours là : retirez l'affectation de ces stratégies et ne les supprimez que lorsque les
   nouvelles affichent *Succeeded* par appareil.
4. **Sans CIPP** : `Set-BaselineAssignment.ps1 -AllDevices -Replace -WhatIf` et
   `-AllUsers -Replace -WhatIf`. `-Replace` remplace *toutes* les affectations d'une stratégie —
   groupes et exclusions compris ; sans `-Replace`, l'ancienne affectation sans filtre reste et le
   script avertit.

## Spécificités AVD

Voir [AVD.fr.md](AVD.fr.md) pour la répartition par stratégie, l'approche FSLogix et le plan de
déploiement. En bref :

- **Conformité aussi sur l'appareil.** La conformité ciblant les utilisateurs ne fonctionne pas en
  multisession ; affectez *aussi* les stratégies de conformité prises en charge à
  `SEC-AVD-Session-Hosts`. CIPP gère l'affectation de `Baseline-Users` et retire une telle
  affectation supplémentaire lors d'une exécution — vérifiez-le après chaque exécution tant que ce
  n'est pas dans le pipeline (point ouvert dans AVD.fr.md).
- **Forcer une synchronisation sur un hôte multisession** : `deviceenroller.exe /o <enrollment-ID> /c /b`
  (l'ID d'inscription se trouve sous `HKLM\SOFTWARE\Microsoft\Enrollments`). La tâche planifiée
  *PushLaunch* n'y existe pas.
- **FSLogix : Intune et le script d'hôte.** Le script d'hôte `configure-fslogix.ps1` définit les
  valeurs au déploiement, pour que la première connexion fonctionne avant qu'Intune n'atteigne
  l'hôte ; la stratégie Intune les maintient ensuite. Les deux écrivent les mêmes valeurs de registre.
- **Pool d'hôtes pour externes** : `AVD Session Host` et `Cloud PC External Access` y entrent en
  conflit sur deux limites de session — point ouvert dans AVD.fr.md.

## Liste de contrôle

- [ ] Les filtres `WIN - Physical` et `WIN - AVD Multi-session` existent, nom exact, *Preview* correct.
- [ ] Avec AVD : custom variable `FSLogixStorageAccount` définie pour ce tenant.
- [ ] Les groupes `SEC-Baseline-Pilot` et les groupes `faseGroep` utilisés existent ; avec AVD aussi `SEC-AVD-Session-Hosts`.
- [ ] Paramètres du tenant : non conforme sans stratégie, connecteur Defender activé.
- [ ] `Baseline.json` et `Windows-Updates.json` importés avec le bouton, tenant affecté.
- [ ] Anciennes stratégies renommées (`Rename-BaselinePolicy.ps1`), `replace`/`retire` traités à la main.
- [ ] Un appareil par classe vérifié : aucun Conflict, conforme.
- [ ] Avec AVD : affectation de conformité aux appareils en place, connexion par passkey sans invite, FSLogix se monte.
- [ ] Après deux semaines : étape 2 active, appareils pilotes vérifiés.

## Dépannage

| Symptôme | Cause | Que faire |
|---|---|---|
| *Conflict* sur un paramètre | deux stratégies le définissent différemment sur le même appareil — presque toujours une ancienne stratégie à côté de la nouvelle | Ouvrir le paramètre dans Intune montre les deux stratégies. Retirer l'affectation de l'ancienne ; avec deux stratégies de la baseline, `check-scope.js` a une faille : la signaler. |
| *Not applicable* sur un hôte de session | les modèles Device Configuration et une partie de la conformité ne fonctionnent pas en multisession | Attendu pour les stratégies d'AVD.fr.md ; un problème seulement pour une stratégie Settings Catalog. |
| Stratégie physique sur un hôte de session, ou stratégie AVD nulle part | le filtre n'existait pas lors de l'exécution CIPP (CIPP affecte alors sans filtre) ou le nom diffère | Journal CIPP : *No assignment filter found* ; créer le filtre avec le nom exact, relancer la baseline. |
| Le filtre ne correspond pas à ce qui est attendu | règle ou propriété d'appareil différente de ce qui est supposé (modèle, SKU) | *Preview devices* sur le filtre ; par appareil l'onglet *Filter evaluation*. |
| Un filtre ou un groupe ajouté à la main disparaît | `verifyAssignments` de CIPP gère l'affectation du paquet et la rétablit | C'est voulu : modifiez le paquet dans le dépôt (classe, phase) plutôt que le tenant. |
| L'hôte de session ne se signale pas à Intune | pas de PushLaunch en multisession | `deviceenroller.exe /o <enrollment-ID> /c /b` sur l'hôte. |
| Personne ne peut se connecter à un hôte AVD | `%FSLogixStorageAccount%` non remplacé, partage injoignable ou ticket Kerberos en échec | Vérifier la variable dans CIPP ; `klist`, `frx list-redirects` ; l'application du compte de stockage exclue de la MFA. |
