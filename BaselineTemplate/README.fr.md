[Nederlands](README.md) · [English](README.en.md) · **Français**

# BaselineTemplate/

La **baseline** CIPP sous forme de fichier : quels paquets se déploient à quelle étape, vers qui,
et quand un tenant passe à l'étape suivante.

| | |
|---|---|
| Fichiers | [`Baseline.json`](Baseline.json) (Intune) et [`Defender-Office365.json`](Defender-Office365.json) (e-mail) — générés par [`scripts/generate-baseline-template.js`](../scripts/generate-baseline-template.js) |
| Reconnu à | `TemplateType: "BaselineTemplate"` et au nom de dossier `BaselineTemplate/` |
| Nom dans CIPP | `Baseline` |

## Pourquoi ce fichier est ici

`IntuneTemplate/` fournit les stratégies, mais dans CIPP les templates ne font que s'y trouver :
c'est une baseline qui déploie. Remplir cet écran à la main, c'est ajouter treize fois le même
standard et choisir treize fois la bonne cible d'affectation — un seul faux clic place jusqu'à 70
stratégies (le paquet `CXNM - Standard - Baseline-Devices`) sur le mauvais public. Ce fichier provient donc de la même source que le reste du
dépôt : le manifeste.

## Contenu

| Étape | Paquets | Passage à cette étape |
|---:|---|---|
| 1 · Immédiat | `CXNM - Standard - Baseline-Devices`, `CXNM - Standard - Baseline-Users`, `CXNM - Standard - Baseline-ADE-token` et les huit paquets de groupe `CXNM - Standard - Baseline-SEC-*` | — l'étape 1 s'applique toujours |
| 2 · Pilote | `CXNM - Standard - Baseline-Pilot` | tout ce qui relève de l'étape 1 est conforme (`success`) **et** deux semaines se sont écoulées (`time`) |
| 3 · En attente d'un prérequis | `CXNM - Standard - Baseline-Wacht` | `manual` — quelqu'un la fait avancer |

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
  `SEC-Update-Ring2`, `SEC-Shared-Devices`, `SEC-Android-Dedicated`, `SEC-iOS-BYOD`,
  `SEC-iOS-Corporate` et `SEC-Remote-Support-macOS` doivent exister dans le tenant ; CIPP les
  recherche par nom (les caractères génériques sont autorisés). Ce sont des noms par défaut. Si un
  groupe s'appelle autrement, modifiez `faseGroep` dans
  [`_manifest.json`](../IntuneTemplate/_manifest.json) — pour le groupe pilote aussi `PILOT_GROUP`
  dans `scripts/lib/templates.js` et `$PilotGroup` dans `scripts/Set-BaselineAssignment.ps1` — et
  relancez le pipeline. Modifier le groupe uniquement dans CIPP fonctionne aussi, mais une
  réimportation de ce fichier remet le nom par défaut.
- **Lier les profils ADE.** `CXNM - Standard - Baseline-ADE-token` n'est volontairement pas affecté : un profil
  d'inscription macOS dépend d'un jeton ADE, pas d'un groupe Entra, et vous choisissez l'un des
  deux par jeton.

## Defender-Office365.json — protection de la messagerie

Une deuxième baseline, distincte (`CXNM - Standard - Defender for Office 365`) : Safe Links, Safe
Attachments, anti-hameçonnage, anti-spam et anti-malware, Defender pour SharePoint/OneDrive/Teams,
et la notification de quarantaine aux utilisateurs **toutes les 4 heures** — le plus court
qu'Exchange permette. Séparée de `Baseline.json` car elle exige Defender for Office 365 Plan 1
(inclus dans Business Premium) : on veut pouvoir l'affecter à d'autres tenants. Les valeurs et
leur justification se trouvent dans
[`scripts/lib/defender-office.js`](../scripts/lib/defender-office.js).

**Volontairement pas de preset policies.** Les presets Standard/Strict de Microsoft ne sont pas
modifiables et CIPP ne peut pas les mesurer — la dérive passe alors inaperçue. Cette baseline crée,
avec les standards de CIPP, des policies personnalisées en priorité 0 pour tous les domaines
acceptés, au niveau Strict. CIS (2.1.x), ORCA et CISA ScubaGear l'acceptent comme équivalent.

| | Valeur | Écart par rapport à Strict |
|---|---|---|
| Notification de quarantaine | toutes les 4 heures | — |
| Safe Links | e-mail, Teams et Office ; analyse avant remise ; aussi en interne ; pas de clic direct | — |
| Safe Attachments | Block ; SharePoint/OneDrive/Teams activés | — |
| Spam, spam à haut niveau de confiance, hameçonnage | quarantaine, l'utilisateur est notifié et libère lui-même | — |
| Hameçonnage à haut niveau de confiance, malware | quarantaine, administrateurs uniquement | — |
| Bulk | Courrier indésirable dès BCL 6 | Strict : quarantaine dès 5 — rend la notification illisible |
| Seuil d'hameçonnage | 3 | Strict : 4 — beaucoup de faux positifs |
| Usurpation (spoof) | Courrier indésirable | Strict : quarantaine ; ORCA-112 recommande Junk |
| Usurpation d'identité, mailbox intelligence | quarantaine avec notification | — |
| Filtre de pièces jointes | 53 extensions par défaut plus scripts, OneNote, VHD et SVG | plus large que Strict (partie de CIS 2.1.11) |
| Sortant | 500 / 1000 / 1000, blocage | Strict : 400 / 800 / 800 |
| Teams | ZAP, contrôle des types de fichiers et des URL dans les chats | — |

**Dans le tenant :**

- **N'affectez pas de preset.** Un preset Standard ou Strict passe avant ces policies — et CIPP
  indique toujours *compliant*. Désactivez-les dans Defender → Email & collaboration → Policies →
  Preset security policies.
- **Ajoutez les VIP** à la policy anti-hameçonnage (usurpation d'identité, max. 350) — c'est par
  tenant.
- **Les notifications qui exigent une adresse** sont désactivées, car l'adresse diffère par tenant :
  notification admin en cas de malware, spam sortant (CIS 2.1.6) et la `QuarantineRequestAlert`
  pour les demandes de libération. Activez-les par tenant dans CIPP.
- Si une policy `CIPP Default …` existe déjà, CIPP la reprend au lieu d'en créer une seconde ; elle
  garde son ancien nom.

L'import se fait comme pour `Baseline.json` : avec le bouton. Mise à jour : modifiez
`defender-office.js` et lancez le script.

## Mise à jour

Pas à la main : exécutez `node scripts/generate-baseline-template.js`. Les paquets et leur
affectation découlent de `fase` dans [`_manifest.json`](../IntuneTemplate/_manifest.json) et de la
cible dans [`_assignments.json`](../IntuneTemplate/_assignments.json) ; `--check` n'écrit rien et
échoue lorsque ce fichier est en retard.

Attention en réexportant depuis CIPP : l'export propre de CIPP aplatit les paquets en
références de template distinctes, une par stratégie — un instantané, après lequel une nouvelle stratégie n'est
plus incluse automatiquement. Générer dans ce sens préserve la liaison tardive.
