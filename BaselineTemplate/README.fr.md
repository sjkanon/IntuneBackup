[Nederlands](README.md) · [English](README.en.md) · **Français**

# BaselineTemplate/

La **baseline** CIPP sous forme de fichier : quels paquets se déploient à quelle étape, vers qui,
et quand un tenant passe à l'étape suivante.

| | |
|---|---|
| Fichier | [`Baseline.json`](Baseline.json) — généré par [`scripts/generate-baseline-template.js`](../scripts/generate-baseline-template.js) |
| Reconnu à | `TemplateType: "BaselineTemplate"` et au nom de dossier `BaselineTemplate/` |
| Nom dans CIPP | `Baseline` |

## Pourquoi ce fichier est ici

`IntuneTemplate/` fournit les stratégies, mais dans CIPP les templates ne font que s'y trouver :
c'est une baseline qui déploie. Remplir cet écran à la main, c'est ajouter neuf fois le même
standard et choisir neuf fois la bonne cible d'affectation — un seul faux clic place 80
stratégies sur le mauvais public. Ce fichier provient donc de la même source que le reste du
dépôt : le manifeste.

## Contenu

| Étape | Paquets | Passage à cette étape |
|---:|---|---|
| 1 · Immédiat | `Baseline-Devices`, `Baseline-Users`, `Baseline-ADE-token` et les trois paquets de groupe | — l'étape 1 s'applique toujours |
| 2 · Pilote | `Baseline-Pilot` | tout ce qui relève de l'étape 1 est conforme (`success`) **et** deux semaines se sont écoulées (`time`) |
| 3 · En attente d'un prérequis | `Baseline-Wacht` | `manual` — quelqu'un la fait avancer |

Les stratégies contenues dans chaque paquet sont listées dans le
[README d'`IntuneTemplate`](../IntuneTemplate/README.fr.md#packages-cipp).

L'étape 1 s'applique toujours et les étapes suivantes s'y superposent. La condition appartient à
l'étape dans laquelle vous **entrez**, pas à celle que vous quittez. La phase 3 attend quelque
chose que CIPP ne peut pas mesurer — une première inscription de téléphone — donc `manual` est
la réponse honnête.

## Importer — avec le bouton, pas avec la synchronisation automatique

Tools → Community Repos → ce dépôt → `BaselineTemplate/Baseline.json` → **Import**. CIPP en
fait une baseline (pas une ligne de template) sous Tenant Administration → Baselines.

Elle arrive affectée au tenant fictif `Exported Template` ; rien ne se déploie donc tant que
vous n'avez pas choisi de tenants. C'est voulu — c'est le même tenant fictif qu'utilise l'export
propre de CIPP.

**Ce bouton est la seule voie.** CIPP possède deux chemins de code qui lisent un dépôt lié, et
un seul des deux connaît les baselines :

| Chemin | Ce qu'il fait de ce fichier |
|---|---|
| Tools → Community Repos → Import (`Invoke-ExecCommunityRepo`) | voit `TemplateType: "BaselineTemplate"` et appelle `Import-CIPPBaselineTemplate` — devient une baseline |
| La synchronisation planifiée des templates (`New-CIPPTemplateRun`) | récupère chaque `.json` (sauf sous `NativeImport`) et le fait passer par `Import-CommunityTemplate`, sans regarder `TemplateType` |

Dans ce second chemin, ce fichier n'a ni `RowKey`, ni `@odata.type`, ni `settings` ; il échappe
donc à toute détection et atterrit comme **ligne sans nom** dans la table des templates — la
même ligne que celle où finissent les autres fichiers non-stratégie de ce dépôt (la
déduplication se fait sur un `Displayname` vide, cela reste donc cette seule ligne). Elle ne
fait rien et vous pouvez la supprimer dans CIPP.

Conséquence au quotidien : les stratégies de `IntuneTemplate/` arrivent automatiquement avec la
liaison ; la baseline elle-même, vous la récupérez une fois avec le bouton — et de nouveau
lorsqu'elle change, ce que le catalogue signale par *UpdateAvailable*. Une réimportation met à
jour la baseline existante sur le même GUID ; les tenants affectés et les résultats sont donc
conservés.

La placer sous un chemin `NativeImport` pour éviter cette ligne sans nom ne fonctionne pas : le
catalogue filtre également ce mot, et le fichier devient alors introuvable, même avec le bouton.

## Ce que vous faites ensuite vous-même

- **Affecter des tenants.** Sans cela, la baseline ne s'exécute nulle part.
- **Veiller à ce que les groupes existent.** `SEC-Baseline-Pilot`, `SEC-Update-Ring1`,
  `SEC-Update-Ring2` et `SEC-Shared-Devices` doivent exister dans le tenant ; CIPP les recherche
  par nom (les caractères génériques sont autorisés).
- **Lier les profils ADE.** `Baseline-ADE-token` n'est volontairement pas affecté : un profil
  d'inscription macOS dépend d'un jeton ADE, pas d'un groupe Entra, et vous choisissez l'un des
  deux par jeton.

## Mise à jour

Pas à la main : exécutez `node scripts/generate-baseline-template.js`. Les paquets et leur
affectation découlent de `fase` dans [`_manifest.json`](../IntuneTemplate/_manifest.json) et de la
cible dans [`_assignments.json`](../IntuneTemplate/_assignments.json) ; `--check` échoue en CI
lorsque ce fichier est en retard.

Attention en réexportant depuis CIPP : l'export propre de CIPP aplatit les paquets en 141
références de template distinctes — un instantané, après lequel une nouvelle stratégie n'est
plus incluse automatiquement. Générer dans ce sens préserve la liaison tardive.
