[Nederlands](ANALYSE.md) · [English](ANALYSE.en.md) · **Français**

# Analyse des écarts — que nous manque-t-il pour une première baseline ?

> **Instantané du 3 septembre 2026.** `BASELINE2/` et `ISMSTemplate/` ont depuis été
> fusionnés dans `IntuneTemplate/` ; ce que faisaient les dossiers séparés, c'est désormais le champ
> `fase` de `_manifest.json` qui le fait. Les nombres et noms de dossiers ci-dessous sont ceux de
> l'époque. Les itérations suivantes figurent en bas, chacune avec sa propre date.

Rédigé à la main, contrairement au [`README.md`](../README.fr.md) voisin. Ce document consigne *comment*
l'ensemble BASELINE2 a vu le jour et — plus important — ce qui n'y figure délibérément **pas** et pourquoi.
Sans ce dernier point, la prochaine itération est condamnée à réévaluer les mêmes 500 paramètres.

Date : 3 septembre 2026. La baseline compte 134 stratégies. Cette analyse décrit les 25 ajoutées en septembre 2026 : 15 issues de cette analyse et les 10 qui, jusqu'à cette
date, se trouvaient dans `ISMSTemplate/` et y ont été fusionnées. L'objectif final était une baseline unique — le
dossier `BASELINE2/` de l'époque était la salle d'attente, `IntuneTemplate/` la destination.

## La question

Nous manque-t-il quelque chose d'IntuneAdmin dont nous avons réellement besoin pour une première baseline, compte tenu de l'ensemble ISMS,
de NIS2, d'ISO 27001 et d'autres modèles sur GitHub ? Et si oui : qu'est-ce qui, parmi cela, fonctionne
de manière démontrable, est nécessaire pour protéger les utilisateurs, et s'applique à *chaque* appareil ?

## Sources

| Source | Ce que c'est | Utilisation |
|---|---|---|
| [IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines) | 874 profils : CIS v4 Windows 11 L1/L2, CIS Edge, CIS Visual Studio Code, baselines Microsoft Endpoint Security, Modern Workplace (Fundamentals/Associate/Expert), **ISO-IEC 27001-2022**, **NIS2 2022/2555**, Apple, Android, Linux, AVD/W365 | comparé intégralement sur `settingDefinitionId` |
| [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) | Windows v3.8, macOS v1.0, BYOD | déjà la source d'`IntuneTemplate/` ; utilisé ici uniquement pour vérifier si quelque chose avait été omis délibérément |
| [UniFy-Endpoint/iOS-iPadOS-Intune-Baseline](https://github.com/UniFy-Endpoint/iOS-iPadOS-Intune-Baseline) | 45 profils, CIS Apple iOS/iPadOS 26 v1.0.0, Corporate et BYOD | stratégie MAM comparée à la nôtre |
| [UniFy-Endpoint/Android-Enterprise-Baseline](https://github.com/UniFy-Endpoint/Android-Enterprise-Baseline) | Android Enterprise, les cinq modes de gestion | stratégie MAM comparée à la nôtre |
| [pl4nty/intune-change-tracking](https://github.com/pl4nty/intune-change-tracking) (`DCv2/Settings/`) | miroir des *véritables* définitions du settings catalog | chaque valeur reprise vérifiée : plateforme, options autorisées, min/max |
| [Policy CSP sur Microsoft Learn](https://learn.microsoft.com/en-us/windows/client-management/mdm/) | la documentation normative | format, valeur par défaut et version minimale de Windows par paramètre |
| [usnistgov/macos_security](https://github.com/usnistgov/macos_security) | NIST macOS Security Compliance Project | examiné, non utilisé : fournit des règles `mobileconfig`/YAML, pas du JSON Intune — impossible à reprendre sans travail manuel |

## Méthode

Comparer sur **`settingDefinitionId`**, jamais sur le nom du profil. Deux profils qui s'appellent tous deux
« Firewall » peuvent n'avoir rien en commun, et deux profils aux noms différents peuvent définir le même paramètre
à une valeur différente — et c'est *cela* qui produit un *Conflict* dans Intune.

Trois pièges si on ne les connaît pas :

1. **Les JSON d'IntuneAdmin sont en UTF-16LE avec BOM.** Un simple `readFileSync(f,"utf8")`
   suivi de `JSON.parse` échoue sur les 874.
2. **Un `GroupSettingCollection` est un conteneur, pas un paramètre.** Deux stratégies qui utilisent le même
   payload macOS mais définissent des enfants différents n'entrent pas en conflit. `flattenSettings` dans
   [`scripts/lib/templates.js`](../scripts/lib/templates.js) fait déjà cette distinction.
3. **Les valeurs d'un ensemble externe ne sont pas correctes d'office.** Voir *Erreurs dans les sources* ci-dessous.

## Résultat en chiffres

Au moment de la comparaison, nos deux ensembles définissaient ensemble 1 908 paramètres
(`IntuneTemplate/` 106 stratégies / 1 877 paramètres, `ISMSTemplate/` 10 / 31 — ce dernier a
depuis été fusionné dans le dossier `BASELINE2/` de l'époque). Face à cela, IntuneAdmin a fourni **509 `settingDefinitionId`
que nous ne définissons nulle part**. Ils se répartissent ainsi :

| | Nombre | Ce qu'il en est advenu |
|---|---:|---|
| Navigateur (Chrome, Safari, Edge) | 180 | Chrome et Safari relèvent d'une décision distincte sur les navigateurs. Les paramètres Edge sont cosmétiques ou déjà couverts — voir ci-dessous. |
| Payloads Apple (`com.apple.*`) | 21 | principalement des restrictions iOS pour appareils *supervisés* ; elles exigent des appareils iOS inscrits. Une exception : le payload de code d'accès. |
| Visual Studio | 9 | spécifique aux développeurs, pas à l'échelle de l'appareil. `WIN - D - AI Tooling` couvre déjà le volet Copilot. |
| Office | 5 | déjà couvert par les quatre stratégies Office de la baseline. |
| Autres CSP Windows | 294 | le vrai travail. La grande majorité a été écartée car *pas à l'échelle de l'appareil* (kiosque, AVD, Windows 365, appareils partagés), *CIS L2* (délibérément : L2 casse des choses) ou *déjà couvert par un autre paramètre*. |
| **Restants et repris** | **14** | répartis sur 8 stratégies Windows dans `BASELINE2/` |

S'y ajoutent trois lacunes qui ne venaient pas d'IntuneAdmin : le code d'accès macOS (issu de notre propre `OVERZICHT.md`),
les trois durcissements MAM (issus de la comparaison UniFy) et les quatre stratégies de conformité pour iOS et
Android qui n'existaient pas du tout.

## Ce qui nous manquait et que nous avons maintenant

| Stratégie | Ce qui manquait | Pourquoi elle atteint le seuil |
|---|---|---|
| `WIN - D - Account Lockout` | **Rien ne comptait combien de fois quelqu'un échouait à se connecter.** La baseline impose la longueur (14) et l'historique (24) du mot de passe, mais sans seuil, quelqu'un disposant d'un portable volé peut essayer indéfiniment. | CIS, la Microsoft Security Baseline et NIST SP 800-63B l'exigent tous les trois. S'applique à chaque appareil Windows. |
| `WIN - D - Logon Hardening` | CTRL+ALT+DEL n'était pas exigé, et l'écran de verrouillage permettait de choisir un réseau. | CTRL+ALT+DEL est la seule combinaison de touches que Windows ne peut pas transmettre à une application — sans cette exigence, un faux écran de connexion est trivial. CIS L1 depuis Windows NT. |
| `WIN - D - Audit Policy Enforcement` | Les 40 paramètres d'audit de la baseline pouvaient être discrètement écrasés par les anciens paramètres par catégorie. | Un seul paramètre qui fait de la stratégie d'audit existante une réalité plutôt qu'une intention. Invisible, ne casse rien. |
| `WIN - D - Kernel DMA Protection` | Rien n'arrêtait un périphérique capable de DMA qui ne prend pas en charge le remappage. | L'« evil maid » : portable laissé seul un instant, on branche, la clé sort de la mémoire. Microsoft le définit à la même valeur dans sa propre baseline. |
| `WIN - U - Attachment Scanning` | L'antivirus n'était pas appelé au moment de l'ouverture d'une pièce jointe téléchargée. | Une pièce jointe encore inconnue à son arrivée *est* reconnue un jour plus tard. CIS L1, aucun impact perceptible. |
| `WIN - D - Printing Hardening` | Le spouleur d'impression était ouvert : les utilisateurs ordinaires pouvaient installer des pilotes pour une imprimante partagée, et Protected Print était désactivé. | C'est exactement la brèche par laquelle PrintNightmare est passé. Chaque appareil Windows a un spouleur, même sans imprimante. |
| `WIN - D - Remote Access Hardening` | Le shell distant WinRM (`winrs`) était ouvert et une session SMB inactive restait ouverte. | Étape classique du mouvement latéral. Les postes de travail n'ont aucune raison légitime d'accepter des shells distants entrants. |
| `WIN - D - Privacy and Telemetry` | Presse-papiers entre appareils, personnalisation de la saisie, envoi des activités et identifiant publicitaire étaient tous les quatre activés. | Quatre canaux par lesquels des données quittent l'appareil sans que personne ne les identifie comme flux de données. Tous les quatre CIS L1. |
| `MAC - D - Passcode and Screen Lock` | **La stratégie de conformité exige un mot de passe de 8 caractères et un verrouillage après 15 minutes, mais aucune stratégie ne le configurait.** | Figurait déjà comme lacune ouverte dans `OVERZICHT.md`. Un Mac sans verrouillage d'écran reçoit une coche rouge et l'utilisateur ne peut rien y faire. Valeurs reprises telles quelles de la stratégie de conformité. |
| `IOS - U - App Protection` | Le menu de partage iOS proposait encore des applications non gérées, malgré la restriction sur le transfert sortant. Les captures d'écran n'étaient pas bloquées, la réutilisation du PIN était autorisée. | Voir *Mobile* ci-dessous. Touche *chaque* iPhone contenant des données d'entreprise — y compris, et surtout, les appareils personnels. |
| `AND - U - App Protection` | Réutilisation du PIN autorisée. | Une réinitialisation du PIN sans historique n'a aucun sens, et c'est précisément le moment où cela compte. |
| `IOS/AND - U - Compliance Device Health` et `Compliance Password` | **Il n'existait aucune stratégie de conformité pour iOS et Android.** | « Exiger un appareil conforme » dans Conditional Access est une coquille vide pour ces deux plateformes sans stratégie. Ne fait encore rien aujourd'hui — voir la réserve ci-dessous. |

## Deuxième itération : comparer par profil plutôt que par paramètre

La première comparaison ci-dessus procédait par `settingDefinitionId`. Cela trouve des lacunes isolées, mais
passe à côté de toute une catégorie : un *profil* IntuneAdmin dont chaque paramètre semble anodin pris
isolément, alors que le profil dans son ensemble couvre quelque chose que nous ne faisons nulle part. L'ensemble a donc
été recalculé par profil — 800 profils avec paramètres, dont **322 couverts à
0 %**.

Sur ces 322, la plupart sont écartés pour les mêmes raisons qu'auparavant : 90 profils CIS isolés
d'un seul paramètre, 89 profils Edge (L2 ou cosmétiques), 26 restrictions iOS et 9 Android qui exigent
une inscription, 19 profils pour Windows 365 et AVD, 16 pour Chrome et Safari, et un pour
Defender sur Linux. Il reste **cinq baselines qui comptent vraiment** :

| Baseline | Ce qui nous manquait | Phase |
|---|---|---:|
| `WIN - D - Power Management` | La baseline exige déjà un mot de passe à la sortie de veille, mais fermer le capot ne faisait rien — l'écran restait donc déverrouillé. C'est le moment où un portable reste sans surveillance. | 1 |
| `WIN - D - Storage Sense` | Un disque plein casse Windows Update, le chiffrement BitLocker et les mises à jour de définitions Defender. C'est l'état dans lequel un appareil prend silencieusement du retard. | 1 |
| `WIN - D - Enrollment Hardening` | Sauter l'étape réseau pendant l'OOBE est la manière la plus connue de contourner Autopilot. Un paramètre suffit à la fermer. | 2 |
| `WIN - D - Windows AI Features Restricted` / `Permitted` | Cocreator, Image Creator, Generative Fill et le Settings Agent envoient des entrées à un service génératif. Voir *L'IA est une décision de l'organisation* ci-dessous. | 2 / 5 |
| `WIN - U - Microsoft Teams` | Sans restriction de tenant, un utilisateur peut se connecter à un tenant étranger dans le client Teams professionnel et y glisser des fichiers — un flux de données sortant qui n'est journalisé nulle part. | 3 |

S'y ajoutent trois droits utilisateur CIS L1 ajoutés à la stratégie existante `WIN - D - User Rights` :
`profilesystemperformance`, `replaceprocessleveltoken` et `logonasbatchjob`. Les autres
droits utilisateur de cet ensemble CIS figurent dans IntuneAdmin avec un espace réservé (`<YOURACT>`) parce que
l'exigence CIS est « personne » ; une collection de valeurs vide ne peut pas être encodée de manière fiable dans le settings catalog,
ils ont donc été délibérément ignorés plutôt que devinés.


### Valeurs propres au tenant : laisser CIPP les renseigner

La restriction de connexion Teams demande un identifiant de tenant. Cela n'a pas besoin d'être une étape manuelle : lors du déploiement, CIPP
remplace un certain nombre de `%tokens%` par des valeurs propres au tenant — `%tenantid%` et
`%OrganizationId%` deviennent le customerId, `%tenantfilter%` le domaine par défaut, `%tenantname%` le
nom d'affichage (voir `Get-CIPPTextReplacement` dans CIPP-API ; le remplacement ne tient pas compte de la casse).
Les stratégies OneDrive de cette baseline utilisent déjà cette construction pour leur liste de tenants et pour
Known Folder Move, la stratégie Teams fait donc désormais de même.

**Attention avec l'autre voie de déploiement :** CIPP effectue ce remplacement, `Start-IntuneRestoreConfig` non.
Qui déploie via IntuneBackupAndRestore conserve `%OrganizationId%` littéralement dans la stratégie et doit
renseigner l'identifiant à la main.


### L'IA est une décision de l'organisation, donc chaque stratégie IA forme une paire

Autoriser ou non l'IA générative sur le poste de travail n'est pas un fait technique mais une politique, et cela diffère d'une
organisation à l'autre. Les trois stratégies IA existent donc en deux variantes qui définissent les mêmes paramètres à la
valeur opposée. **Affectez-en une par paire** — les deux à la fois produisent dans Intune un
Conflict, après quoi le paramètre disputé n'est appliqué par *aucune* des deux stratégies et plus
rien n'est donc réglé. `check-scope.js` y veille.

| Paire | Restricted | Permitted |
|---|---|---|
| `WIN - D - Windows AI` | Recall indisponible, pas de captures d'écran, Click To Do désactivé | les trois autorisés, définis explicitement |
| `WIN - D - Windows AI Features` | Cocreator, Image Creator, Generative Fill et Settings Agent désactivés | les quatre mêmes activés |
| `WIN - U - AI Usage Control` | Edge bloque dix services d'IA publics plus le site du Store | uniquement les quatre règles du Store ; les services d'IA restent accessibles |

**La variante Permitted d'AI Usage Control ne supprime délibérément pas la liste de blocage.** Avant
l'itération IA, cette liste contenait déjà quatre règles pour le site du Store. Elle a été ramenée à ces quatre
plutôt que de supprimer tout le paramètre — sinon autoriser l'IA aurait aussi levé discrètement
le blocage du Store, et c'est une autre décision.

Les variantes Permitted ne sont pas une recommandation. Elles sont en phase 5 (ne pas déployer) parce que la
baseline choisit par défaut le côté Restricted ; qui veut l'autre côté inverse l'affectation.

Pour ceux qui le font, il existe une troisième stratégie : **`WIN - D - Windows AI Recall Boundaries`** (phase
3). Autoriser Recall n'est en effet pas du tout-ou-rien. Le préjudice d'un index n'est pas
réparti uniformément — un seul instantané d'un coffre de mots de passe ouvert ou du portail Entra
pèse plus lourd que mille d'un traitement de texte. Cette stratégie retire précisément ces endroits :

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| `SetDenyUriListForRecall` | neuf portails d'administration M365 et pages de connexion | par définition, ils affichent à l'écran quelque chose qui n'a pas sa place dans un index consultable |
| `SetDenyAppListForRecall` | RDP et quatre coffres de mots de passe | une session RDP affiche l'écran d'un *autre* système ; un coffre affiche des mots de passe |
| `SetMaximumStorageDurationForRecallSnapshots` | 30 jours | la valeur la plus courte proposée par le paramètre ; par défaut rien n'expire |
| `SetMaximumStorageSpaceForRecallSnapshots` | 10 Go | plafonné plutôt que « ce que le disque permet » |
| `AllowRecallExport` | désactivé | le bouton d'export est la voie par laquelle l'index entier quitte l'appareil |

La liste d'URI est valable pour tout tenant M365. **La liste d'applications est délibérément incomplète** et doit
être complétée pour chaque organisation avec ce qui y affiche des données sensibles : le logiciel RH, le système de dossiers, l'environnement
bancaire. Les noms peuvent être un exécutable (`app.exe`) ou un AUMID pour les applications du Store.

Un point demeure quelle que soit cette délimitation : l'index est soumis aux mêmes durées de conservation et
obligations de suppression que les données qu'il contient. Une durée de conservation de 30 jours est une
limite technique, pas une réponse juridique.

**Deux ensembles que la comparaison a justement rejetés :**

- *App and Browser Isolation* (Microsoft Defender Application Guard, 10 paramètres) figure dans
  trois dossiers IntuneAdmin. Microsoft a entre-temps abandonné MDAG pour Edge ; bâtir une baseline
  sur une fonctionnalité en voie de disparition ne produit que de la maintenance.
- *MDE Enable file hash computation* définit l'ancienne variante ADMX, et qui plus est sur *Disabled*, alors que
  nous avons déjà activé la variante moderne du CSP Defender dans
  `WIN - D - Defender Additional Configuration`. La reprendre dégraderait la situation.

**Troisième erreur dans la source.** Outre le `AccountLockoutPolicy` défectueux ci-dessus : les quatre profils Windows
AI d'IntuneAdmin s'appellent « Enable Paint Cocreator », « Paint Image Creator », etc., et
définissent `Disable X` sur *Disabled* — ils **activent** donc justement ces fonctionnalités d'IA. Pour une
politique d'IA qui restreint ces fonctionnalités, il faut l'inverse ; notre variante Restricted les définit donc à 1. Qui importe ces profils sans les examiner obtient
l'inverse de ce que suggère le nom du dossier.

## Ce qu'ont apporté les dossiers ISO 27001 et NIS2 d'IntuneAdmin

Peu de chose, et c'est un constat en soi.

- Le **dossier ISO-IEC 27001-2022** contient exactement un profil : Microsoft Edge. Parmi les 47 paramètres
  que nous n'en reprenons pas, il s'agit de choses comme `cryptowalletenabled`, `gamermodeenabled`,
  `aigenthemesenabled` et `browseraddprofileenabled`. Ce sont des paramètres Edge soignés, mais ils ne
  découlent pas d'ISO 27001 et ne sont pas critiques pour l'appareil. Notre
  [`Baseline_WIN_D_Microsoft_Edge_Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.fr.md)
  (54 paramètres) couvre déjà le volet sécurité. **Aucun repris.**
- Le **dossier NIS2** contient un profil Edge et un profil Windows 11. Le profil Windows 11 a fourni 11
  paramètres que nous ne définissons pas. Parmi eux, **quatre ont été repris** (les seuils de
  verrouillage de compte et le forçage de l'audit) ; le reste a été écarté : `donotrequirectrlaltdel` n'y figurait pas mais
  *bien* dans CIS, l'audit NTLM est déjà couvert par `WIN - D - Disable NTLM`, et
  `sharesthatcanbeaccessedanonymously` utilise une sentinelle `<empty string>` que je ne veux pas reprendre
  sans l'avoir examinée.

Conclusion : les dossiers normatifs d'IntuneAdmin sont minces. Le gain réel se trouvait dans les dossiers CIS et
Microsoft Endpoint Security, et la justification *vis-à-vis* d'ISO 27001 et de NIS2, nous la consignons nous-mêmes
dans `_manifest.json` — comme le fait aussi `ISMSTemplate/`.

## Mobile : la vraie lacune, et pourquoi ce n'est pas un modèle BASELINE2

iOS et Android ont ensemble exactement deux stratégies dans `IntuneTemplate/`, toutes deux App Protection
(MAM). Les deux sont sur `targetedAppManagementLevels: "unmanaged"` — les téléphones ne sont **pas
inscrits**. Cela a deux conséquences :

**Les stratégies de conformité pour iOS et Android ne font rien aujourd'hui.** Une stratégie de conformité ne touche
qu'un appareil inscrit, et il n'y en a pas. Elles sont là malgré tout — quatre, Device
Health et Password par plateforme — parce que l'alternative est que le jour où le premier téléphone
est inscrit soit un jour sans contrôle, et parce que « exiger un appareil conforme » dans
Conditional Access pour iOS et Android sans stratégie est une coquille vide : il n'y a alors aucune règle
à respecter. Elles ne produisent aucune coche rouge tant que rien n'est inscrit — une
stratégie de conformité sans appareils ne signale rien. Ne les affectez que lorsque des appareils sont effectivement
inscrits ; d'ici là, elles sont prêtes. Cette réserve figure aussi pour chaque stratégie dans le manifeste.

**Les stratégies MAM sont en revanche la seule chose qui touche chaque téléphone, et elles présentent trois vraies lacunes.**
Comparé aux variantes L2 BYOD d'UniFy-Endpoint, notre ensemble est *plus strict* sur la plupart des points
(transfert de données sortant uniquement vers des applications gérées, enregistrer-sous bloqué, impression
bloquée, notifications sans données de l'organisation, sauvegarde bloquée, SafetyNet hardware-backed).
Ce qui manque :

| Paramètre | Nous | Eux | Pourquoi c'est important |
|---|---|---|---|
| `filterOpenInToOnlyManagedApps` (iOS) | `false` | `true` | **Le plus important.** Le transfert sortant est déjà sur « applications gérées uniquement », mais sans cette case le menu de partage iOS propose toujours des applications non gérées. La restriction existante n'est ainsi qu'à moitié effective. |
| `screenCaptureConfigurationState` (iOS) | non défini | `blocked` | Android bloque déjà les captures d'écran (`screenCaptureBlocked: true`) ; sur iOS, il n'existait pas de paramètre avant iOS 26. Il existe désormais — et l'asymétrie n'est pas voulue. |
| `previousPinBlockCount` (les deux) | `0` | `5` | Pas d'historique de PIN : lors d'une réinitialisation, un utilisateur peut choisir à nouveau le même PIN. Aucune friction à corriger. |

Ces trois points figuraient dans le dossier `BASELINE2/` de l'époque sous `BASELINE2 - IOS/AND - U - App Protection` : une copie complète
de la stratégie de baseline avec le durcissement intégré. **Déployez-la à la place de la variante de baseline,
pas à côté.** Deux stratégies App Protection sur les mêmes applications ne s'empilent pas proprement — Intune choisit
la valeur la plus stricte par paramètre, mais on ne peut alors plus lire quelle stratégie fournit un paramètre.
À terme, la modification doit revenir dans la stratégie de baseline elle-même ; c'est une décision sur la
baseline convenue *avec* l'organisation, pas un nettoyage, et c'est pourquoi elle figure d'abord ici.

Délibérément non repris des ensembles UniFy : `pinRequiredInsteadOfBiometricTimeout` à 30 minutes
(nous : 12 heures — friction perceptible, et le PIN n'est pas la seule protection),
`allowedInboundDataTransferSources` sur `managedApps` (bloque les photos personnelles dans un document professionnel ;
les sources ne s'accordent pas non plus entre elles sur ce point), `contactSyncBlocked` (casse l'affichage du nom lors
des appels entrants) et `minimumRequiredOsVersion` (un numéro de version strict exclut des utilisateurs
et exige de la maintenance — `minimumWarningOsVersion` mérite d'être envisagé).

## Délibérément non repris — Windows et macOS

| Paramètre / sujet | Pourquoi pas |
|---|---|
| Signature SMB « if server/client agrees » | Nous définissons déjà le plus strict `digitallysigncommunicationsalways`, des deux côtés. L'ajouter serait une double maintenance. |
| `remoteshell_allowremoteshellaccess` = 0 | CIS L1, mais casse la gestion basée sur WinRM. Pas sûr à l'échelle de l'appareil sans savoir d'abord ce qui en dépend. |
| `printers_configurewindowsprotectedprint` | Mesure forte (Windows Protected Print Mode), mais laisse tomber les imprimantes avec des pilotes plus anciens. Exige d'abord un inventaire du parc d'imprimantes. |
| `networkaccess_sharesthatcanbeaccessedanonymously` | Utilise une sentinelle `<empty string>` dans un `SimpleSettingCollection`. Je n'ai pas pu vérifier son comportement ; ne pas reprendre sans examen. |
| `cryptography_tlsciphersuites` | Un ordre explicite de suites de chiffrement vieillit et casse silencieusement des connexions. Relève d'une politique cryptographique avec un responsable, pas d'une baseline. |
| `applicationcontrol` / WDAC / AppLocker / Smart App Control | Totalement absent, et c'est la plus grande lacune de fond de toute la baseline. Mais le contrôle des applications n'est pas un paramètre qu'on active — c'est un projet avec un inventaire, une phase d'audit et un processus d'exceptions. N'a pas sa place dans un ensemble qui promet « cela fonctionne pour chaque appareil ». **C'est toutefois le principal candidat pour la prochaine itération.** |
| DNS over HTTPS | N'apparaissait pas dans IntuneAdmin et ne figure pas dans notre ensemble. La baseline définit bien `turn_off_multicast` (LLMNR). Imposer DoH exige une décision sur le résolveur, et celle-ci est propre au tenant. |
| `privacy_disableadvertisingid`, `allowcrossdeviceclipboard`, `uploaduseractivities` | Vie privée, pas sécurité. Relèvent d'une décision de l'organisation en matière de vie privée, pas d'une baseline de sécurité. (Depuis OIB v4.0, OpenIntuneBaseline désactive lui-même `allowcrossdeviceclipboard`, dans Windows Feature Configuration.) |
| CIS L2 en général | L2 est explicitement « pour les environnements où la sécurité prime sur la fonctionnalité ». C'est le seuil opposé à celui de cet ensemble. Une exception qui *a* été reprise : la transcription PowerShell (L2), parce que les politiques de journalisation exigent généralement cet enregistrement des sessions. |
| macOS, au-delà du code d'accès | La comparaison avec IntuneAdmin et les ensembles UniFy a fourni 12 paramètres macOS que nous ne définissons pas. Onze sont des paramètres Safari que la source met justement sur *autoriser* (`allowsafariprivatebrowsing_true`) — ce n'est pas du durcissement — et le reste sont des espaces réservés Kerberos SSO (`YOURKERBEROSREALM`). **Nos 21 stratégies macOS sont en avance sur ces sources.** |
| Restrictions d'appareils iOS/Android | Les ensembles UniFy les ont en détail (App Management, Connectivity Controls, Device Pairing, Lock Screen). Tout en settings catalog, qui n'atteint que des appareils inscrits. Même calendrier que les stratégies de conformité, mais avec plus de choix — c'est une itération à part entière, pas une prise accessoire. |

## Erreurs rencontrées dans les sources

Les deux figurent ici parce qu'elles réapparaîtront lors d'une prochaine comparaison.

1. **IntuneAdmin, profil NIS2 Windows 11 :** `DeviceLock/AccountLockoutPolicy` est défini sur la valeur
   brute `"15"`. Le CSP y attend les trois champs sous forme d'une seule chaîne
   (`"AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15"`).
   Tel quel, cela ne fait rien. Nous définissons la chaîne complète.
2. **OpenIntuneBaseline, macOS :** la clé PPPC obsolète `Allowed` à côté d'`Authorization`,
   ce qui fait rejeter à macOS l'*intégralité* du payload TCC. Déjà connu et déjà corrigé dans `import-oib.js`
   ([OIB issue #62](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/issues/62)).


## Bilan : 874 profils face à 141 stratégies

Ces deux nombres ne comparent rien. Dans ses dossiers CIS, IntuneAdmin utilise souvent **un profil par
paramètre** — 380 profils distincts pour Windows 11 à lui seul — alors que cette baseline regroupe les paramètres
en une stratégie gérable. La comparaison honnête se fait sur `settingDefinitionId` :

| | IntuneAdmin | Cette baseline |
|---|---:|---:|
| Fichiers / stratégies | 874 | 141 |
| Profils avec paramètres | 808 | — |
| **settingDefinitionId uniques** | **1 193** | **1 747** |

Sur leurs 1 193 paramètres, nous en définissons **729 (61 %)**. À l'inverse, nous définissons **1 018
paramètres qu'IntuneAdmin n'a pas du tout** — principalement le contenu d'OpenIntuneBaseline
pour Windows et macOS, où IntuneAdmin est beaucoup plus mince.

Les 464 restants, après trois itérations de comparaison :

| Catégorie | Nombre | Ce qu'il en advient |
|---|---:|---|
| Microsoft Edge | 133 | notre stratégie Edge Security en définit déjà 54 ; le reste est CIS L2 ou cosmétique |
| Windows, autres | 76 | la dernière itération en est issue ; ce qui reste a été évalué un par un et écarté |
| Google Chrome | 34 | pertinent uniquement là où Chrome est un navigateur géré ; ne fait pas partie de cet ensemble |
| AVD / Windows 365 / RDS | 34 | relève d'un ensemble distinct pour les Cloud PC et les hôtes de session |
| Restrictions Apple et Android | 40 | exigent une inscription ; à l'ordre du jour dès le premier téléphone inscrit |
| Reliquats hérités/ADMX | 30 | Windows Media Player, Aide et support, minuteries MSS |
| Variantes de profils de pare-feu | 29 | notre stratégie de pare-feu définit déjà les trois profils ; ce sont des variantes Hyper-V/WSL |
| Defender | 22 | principalement App Guard (abandonné) et des paramètres d'analyse que nous définissons déjà autrement |
| Linux | 15 | pas de Linux |
| Autres | 51 | masquage de l'interface Defender, Visual Studio, OneDrive, Office, WSL, Teams |

Ce que la dernière itération a encore apporté figure ci-dessous. Ensuite, le fond de cette source est atteint :
ce qui reste n'est pas applicable, fait doublon, ou est abandonné.

| Ajout | Pourquoi |
|---|---|
| `WIN - D - Defender Ransomware Protection` | Les rançongiciels modernes ne chiffrent pas l'appareil sur lequel ils arrivent mais les partages qui l'entourent. Toute la baseline regardait ce qui se passe *sur* l'appareil ; celle-ci est la première à regarder ce que l'appareil fait *aux autres*. Blocage au niveau Low : uniquement à 100 % de certitude, car un faux positif touche ici un outil de sauvegarde ou de synchronisation. |
| `Attachment Scanning` + Mark of the Web | Les informations de zone d'un fichier téléchargé sont conservées. C'est sur ce marquage que s'appuient le Mode protégé d'Office et SmartScreen ; s'il disparaît, un téléchargement s'ouvre comme s'il venait du disque local. |
| `Logon Hardening` + deux | L'adresse e-mail de l'utilisateur n'apparaît plus sur l'écran de connexion, et les utilisateurs connectés ne sont pas énumérés. |
| `Privacy and Telemetry` + six | Emplacement de recherche, synchronisation des SMS, contenu grand public, astuces en ligne, fournisseurs de polices et partage des données d'applications entre utilisateurs. Tous les six CIS L1. |
| `Remote Access Hardening` + gestion du serveur WinRM | La variante plus large à côté du shell distant : plus aucune connexion WinRM entrante. |
| `Audit Policy Enforcement` + audit OneSettings | Windows journalise le moment où il récupère la configuration auprès du service OneSettings. |

Délibérément *non* repris lors de cette itération : les paramètres d'analyse d'IntuneAdmin (notre
stratégie Defender définit déjà une analyse rapide quotidienne à 11:00 — leur planification viendrait
la contrecarrer), le blocage de l'accès en lecture aux supports amovibles (nous bloquons l'écriture ; bloquer la lecture
casse trop de choses), et les sept droits utilisateur CIS qui doivent être sur « personne » — une collection
de valeurs vide ne peut pas être encodée de manière fiable dans le settings catalog et IntuneAdmin les remplit lui-même
avec un espace réservé.

## Ce qu'il faut faire maintenant

| # | Étape | |
|---:|---|---|
| 1 | ~~BASELINE2 sur un groupe pilote~~ | fait : ces stratégies sont désormais dans `IntuneTemplate/` en phase 2 et sont déployées via `CXNM - Standard - Baseline-Pilot` vers `SEC-Baseline-Pilot` — `Kernel DMA Protection` et `Logon Hardening` compris |
| 2 | ~~Décision sur les trois paramètres MAM~~ | fait : le durcissement se trouve dans les stratégies de baseline elles-mêmes (`Baseline_IOS_U_App_Protection`, `Baseline_AND_U_App_Protection`) |
| 3 | ~~Vérifier le rattachement ISMP dans `_manifest.json`~~ | caduc : le rattachement aux documents ISMS d'une seule organisation a été retiré du manifeste en septembre 2026, afin que la baseline soit générique. ISO 27001, NIS2 et Part-IS y figurent toujours |
| 4 | ~~Une stratégie donne satisfaction ?~~ | fait : tous les ensembles ont été fusionnés dans `IntuneTemplate/` sous le nom `Baseline_` ; l'affectation découle de `fase` |
| 5 | Prochaine itération | contrôle des applications (WDAC/Smart App Control), et conformité iOS/Android dès que des téléphones sont inscrits |

# Itération OIB Windows v4.0 (14 septembre 2026)

OpenIntuneBaseline Windows v4.0 (« 26H2 Edition ») a été repris de la branche `windows-v4.0` au
commit `f247604` (9 septembre 2026). **Cette version n'était pas encore publiée** — le CHANGELOG
indique encore la date `2026-09-xx`. Dès que le tag existe : pointer `.oib-source` sur ce tag et repasser
le diff. macOS (v1.0) et BYOD n'ont pas changé.

**Publiée le 30 septembre 2026** sous le tag `windows-v4.0` (commit `1cc71a9`). Le 2 octobre,
`.oib-source` a été pointé sur ce tag et le diff avec `f247604` repassé. Trois policies ont changé
après la beta ; seules celles-ci ont été reprises, tous nos propres ajustements sont restés :

| Policy | Ce qui a changé | Chez nous |
|---|---|---|
| Security Hardening | « Allow Custom SSPs and APs to be loaded into LSASS » désactivé ; Lanman Server et Workstation au minimum SMB 3.1.1 (au lieu de 3.0.0) | repris. Le paramètre LSASS figurait déjà dans Legacy Hardening avec la même valeur et y a été retiré, pour qu'il ne vienne pas de deux policies |
| Microsoft Edge Updates | les anciens paramètres « Allow Installation » en double pour Edge et WebView2 retirés (ils causaient un conflit, OIB #254) | repris via `dropSettings` ; sinon l'importeur les gardait comme paramètre propre |
| Microsoft Edge User Experience | liste de blocage d'URL : le site web du Store en une seule règle `apps.microsoft.com`, plus `ms-windows-store://*` (OIB #253) et `javascript://*` contre ClickFix (OIB #250) | cette liste se trouve chez nous dans les deux variantes AI Usage Control ; mise à jour là, les domaines IA sont restés |

Deux de nos propres ajustements étaient annulés en silence par l'importeur et sont désormais fixés
dans le manifeste : `wlapsadmin` en minuscules dans Local Administrators (un `override`, qui gère
désormais aussi les valeurs de liste) et les quatre policies Windows Hello PIN Complexity
(`metadataOnly` : leurs paramètres `{tenantid}` figurent aussi dans la policy WHfB d'OIB, si bien que
la règle de report les supprimait).

## Comment, et pourquoi pas avec `import-oib.js`

Une exécution complète d'`import-oib.js` annule actuellement du travail manuel apporté aux modèles
après des importations précédentes : la liste de blocage d'URL déplacée d'Edge User Experience vers AI Usage Control,
trois valeurs App Protection (`previousPinBlockCount`, `screenCaptureConfigurationState`,
`filterOpenInToOnlyManagedApps`) qui ne figurent pas comme `veldOverrides` dans le manifeste, et les stratégies
sans `source` ni `type` (wifi, OS Version, conformité iOS/Android), que l'importateur traite comme
Settings Catalog et déplace dans le mauvais dossier. C'est pourquoi les différences entre
v3.x et v4.0 ont été appliquées paramètre par paramètre aux modèles existants : ce qu'OIB a supprimé retiré, ce qu'OIB
a ajouté ajouté, et une valeur modifiée uniquement si notre modèle avait encore l'ancienne valeur OIB (plus
nos overrides). Ces trois points doivent être consignés dans le manifeste avant que l'importateur
puisse de nouveau être exécuté sans risque.

**Résolu le 14 septembre 2026.** La liste de blocage d'URL figure comme `dropSettings` dans Edge User
Experience (et ne compte plus comme « OIB le couvre », de sorte qu'AI Usage Control la conserve), les
valeurs App Protection figurent comme `veldOverrides` (`screenCaptureConfigurationState` avec
`toevoegen`, car la source ne fournit pas ce champ), les stratégies sans `source` ni `type` conservent le
Type de leur modèle existant, `dropSettings` s'applique aussi aux paramètres propres repris,
`auditRuleInformation` est supprimé et les modèles se terminent par un saut de ligne comme
`set-packages.js` les écrit. Une exécution complète n'a ensuite corrigé que des descriptions et
l'ordre des paramètres ; une deuxième exécution n'écrit rien.

## Ce qui a changé

| | |
|---|---|
| **Conformité** | Quatre stratégies groupées (Device Health, Device Security, Defender for Endpoint, Password) deviennent neuf stratégies distinctes : TPM, Firewall, Antivirus, Antispyware, Secure Boot, Code Integrity, BitLocker, Defender Security Intelligence et Defender Real Time Protection. Password disparaît : ces exigences passent par le moteur EAS, sont imposées plutôt que contrôlées et ne touchent que les comptes locaux. Le verrouillage après 15 minutes figure désormais dans Device Lock. `_renames.json` indique pour chaque ancienne stratégie ce qu'elle est devenue. |
| **Local Security Policies / LAPS** | Les variantes 24H2+ sont les seules. Pour LAPS, rien ne change sur le fond ; Local Security Policies désactive désormais le compte Administrateur intégré. LAPS gère son propre compte, cela n'affecte donc pas la récupération. |
| **Defender** | Modéré et élevé en quarantaine (auparavant suppression) ; overrides de la protection contre les exploits par les utilisateurs bloqués ; notifications étendues de Sécurité Windows désactivées (moins de notifications superflues). |
| **Edge** | Cinq paramètres de sécurité de la baseline Edge v151 (process isolation, renderer app container, network service sandbox, code integrity guard) ; pas de connexion avec des comptes non Microsoft ; pas de téléchargement automatique de modèles d'IA locaux ; nouvelle stratégie **Microsoft Edge Management** (phase 2). |
| **Office** | Six paramètres de la baseline M365 Apps 2512. |
| **Autres** | In-Box App Removal vers la variante liste ; presse-papiers entre appareils désactivé ; sensitive privilege use uniquement sur Success ; mode IE TLS 1.2 et 1.3 ; mise en veille sur secteur après 30 minutes. |

## Où nous divergeons délibérément

| Paramètre | OIB v4.0 | Nous | Pourquoi |
|---|---|---|---|
| `submitsamplesconsent` | tous les échantillons automatiquement | échantillons sûrs automatiquement | « tous les échantillons » envoie aussi à Microsoft, sans demander, des documents contenant des données personnelles |
| Délai de grâce Defender Security Intelligence | immédiat (dans l'export) | 6 heures | le CHANGELOG indique lui-même 0,25 jour ; « immédiat » rend brièvement non conforme chaque portable qui sort de veille |
| Microsoft Edge Management | — | phase 2 | inverse la priorité : la stratégie issue d'Edge Management Service l'emporte sur la stratégie Edge de cette baseline |

## Doublons supprimés

Quatre de nos propres paramètres sont désormais définis par OIB lui-même, avec la même valeur. Ils ont été retirés de notre stratégie
afin qu'ils ne proviennent pas de deux stratégies : `machineinactivitylimit_v2` (Local Security Policies → Device
Lock), `disallowexploitprotectionoverride` (Threat Protection → Defender Additional Configuration),
`preventdevicemetadatafromnetwork` (Wireless and Peripherals → Windows Feature Configuration) et
`allowcrossdeviceclipboard` (Privacy and Telemetry → Windows Feature Configuration). Les deux règles
`apps.microsoft.com` nues qu'OIB a retirées de la liste de blocage d'URL ont aussi été retirées des deux variantes d'AI Usage
Control.

## Générique

La baseline portait les traces d'une seule organisation : la numérotation de ses documents ISMS
(`controls.isms` et références ISMP dans les explications), un compte de stockage et un label LaunchAgent
dans les scripts de montage, le compte administrateur dans les profils d'inscription macOS, et deux rapports de tenant.
Ils ont été supprimés ou remplacés par des espaces réservés ; les rapports se trouvent dans `local/`, ignoré par git.
Attention : ils figurent toujours dans l'historique git.

# Réparations macOS (14 septembre 2026)

Trois erreurs dans des stratégies existantes, trouvées lors de la comparaison avec OpenIntuneBaseline
macOS v2.0 beta, UniFy et intune-my-macs :

| Stratégie | Ce qui n'allait pas | Désormais |
|---|---|---|
| `MAC - U - Compliance Device Security` | exigeait *bloquer toutes les connexions entrantes*, alors que `MAC - D - Firewall and Gatekeeper` met ce paramètre à false — un Mac qui suivait exactement la baseline était non conforme | exigence à false, en tant que `veldOverride` ; pare-feu et mode furtif restent exigés |
| `MAC - D - Software Updates` | les trois actions automatiques étaient sur `_0`, soit *Allowed* : l'utilisateur choisit, rien n'était imposé | AlwaysOn (`_1`) |
| `MAC - D - FileVault` | la clé de récupération personnelle n'était pas créée explicitement et son affichage n'était pas désactivé | `userecoverykey` à true et `showrecoverykey` à false, en tant qu'overrides avec `parent` |

# Les téléphones inscrits conservent l'accès (14 septembre 2026)

Les stratégies App Protection pour iOS et Android étaient sur `targetedAppManagementLevels:
unmanaged`. Un téléphone qui s'inscrivait sortait donc du champ d'App Protection, et Conditional
Access 2070 — qui exige une application conforme pour iOS et Android — n'autorisait alors plus Outlook et Teams sur cet
appareil. Les deux stratégies sont désormais sur `unspecified` : elles s'appliquent à chaque appareil,
inscrit ou non. 2070 accepte désormais un appareil conforme *ou* une application conforme, et
exclut l'application Intune Enrollment afin que l'inscription elle-même ne se bloque pas (voir l'itération 4 dans
`docs/ANALYSE.md` du dépôt CA-Policies).

Parallèlement, trois valeurs durcies à la main après l'importation OIB figurent désormais dans le manifeste comme
`veldOverrides` : `previousPinBlockCount` (iOS et Android),
`screenCaptureConfigurationState` et `filterOpenInToOnlyManagedApps` (iOS). Une prochaine exécution
d'`import-oib.js` ne les annule donc plus.


# Itération référentiel de conformité : ISO 27001, NIS2, CIS et NIST CSF (14 septembre 2026)

La question : rendre la baseline suffisamment complète et étayée pour qu'un RSSI puisse s'en servir pour justifier ISO/IEC 27001:2022, NIS2,
CIS Controls v8.1 et NIST CSF 2.0 — pour les quatre plateformes et pour
Conditional Access. Réalisé sous forme de six lots de travail selon une spécification unique ; chaque paramètre a été
vérifié par rapport aux définitions Intune (pl4nty/intune-change-tracking, Graph) avant d'être
intégré, et le tout a été fusionné avec `check-scope.js` au vert.

## Ce qui a été ajouté

38 nouvelles stratégies ; la baseline en compte désormais 193 (contre 155). Les nouvelles stratégies sont presque toutes
en phase 2 à 5 : elles existent, mais ne sont déployées qu'après un pilote, un prérequis (un appareil
inscrit, une licence, un connecteur) ou une décision de l'organisation.

| Plateforme | Nouvelles | Stratégies |
|---|---:|---|
| Android | 11 | `AND - U - Work Profile Restrictions` (phase 3), `AND - U - Compliance Corporate Device Health` (phase 3), `AND - U - Compliance Corporate Password` (phase 3), `AND - D - System Updates` (phase 3), `AND - U - Corporate Device Security` (phase 3), `AND - U - Corporate Data Protection` (phase 2), `AND - U - Corporate AI Restricted` (phase 2), `AND - U - Compliance Block Device Administrator` (phase 3), `AND - U - Compliance Defender for Endpoint` (phase 3), `AND - U - Compliance Corporate Defender for Endpoint` (phase 3), `AND - D - Compliance Dedicated Device Health` (phase 4) |
| iOS/iPadOS | 11 | `IOS - D - Enterprise SSO` (phase 3), `IOS - D - Passcode` (phase 3), `IOS - D - Software Updates` (phase 3), `IOS - D - Restrictions Corporate` (phase 4), `IOS - D - Data Protection` (phase 3), `IOS - D - Apple Intelligence Restricted` (phase 3), `IOS - D - Apple Intelligence Permitted` (phase 5), `IOS - D - Lock Screen` (phase 4), `IOS - U - Compliance Defender for Endpoint` (phase 3), `IOS - D - Defender for Endpoint Onboarding Supervised` (phase 4), `IOS - D - Defender for Endpoint Onboarding Unsupervised` (phase 4) |
| macOS | 8 | `MAC - D - Screensaver` (phase 2), `MAC - D - Apple Intelligence Restricted` (phase 2), `MAC - D - Apple Intelligence Permitted` (phase 5), `MAC - D - Restrictions Hardening` (phase 2), `MAC - D - Recovery Lock` (phase 2), `MAC - D - Login Window` (phase 2), `MAC - D - Time Server` (phase 1), `MAC - D - External Storage Read Only` (phase 5) |
| Windows | 8 | `WIN - D - Network Authentication Hardening` (phase 2), `WIN - D - Windows Component Hardening` (phase 2), `WIN - U - File Sharing Restrictions` (phase 2), `WIN - D - Security Log Monitoring` (phase 2), `WIN - D - Windows Event Forwarding` (phase 3), `WIN - D - Microsoft Edge DNS over HTTPS Automatic` (phase 2), `WIN - D - Microsoft Edge DNS over HTTPS Secure` (phase 5), `WIN - U - Compliance Defender for Endpoint Risk` (phase 3) |


En outre :

- **Corrections de stratégies existantes** : Android Compliance Password (le texte contredisait le JSON),
  Android Device Health (niveau de correctif minimal), iOS App Protection (synchronisation des widgets désactivée), macOS Software
  Updates (Enforce Latest après 30 jours, bêta désactivée), Firewall and Gatekeeper (envoi XProtect après demande),
  Edge Security sur macOS (pas de contournement des erreurs SSL).
- **Autres éléments par plateforme** (sous *Autres éléments* dans chaque README de plateforme de [`IntuneTemplate/`](../IntuneTemplate/README.fr.md)) : ce qui n'est pas un type CIPP — restrictions d'inscription, configuration d'applications,
  filtres d'affectation, App Control for Business, DNS over HTTPS pour Windows, remédiations pour
  l'escrow BitLocker/LAPS, Escrow Buddy, listes de contrôle Apple Business.
- **Référentiel de conformité** : chaque stratégie a des `controls` (iso, nis2, cis, nistcsf) issus du vocabulaire de
  `IntuneTemplate/_controls.json`. `check-scope.js` refuse une stratégie sans label ou avec un label inconnu ;
  `scripts/generate-compliance.js` en génère [`COMPLIANCE.md`](COMPLIANCE.fr.md) : matrice Annexe A,
  NIS2 par mesure avec voie de preuve, couverture CIS et CSF, choix de l'organisation et point de départ pour la
  Déclaration d'applicabilité. Sur les 38 rattachements existants, 34 ont été normalisés ou
  corrigés.
- **Conditional Access** (itération 5 dans `docs/ANALYSE.md` du dépôt CA-Policies) : `2060` exclut iOS/Android, les modèles P2 et
  token protection sont optionnels, `1100` activé à côté de `1090`, `2055`/`2120` en report-only,
  `2180` exclut les invités, nouveau `1190` insider risk, et `controls/ca-controls.json` avec un test.
- **`import-oib.js`** est de nouveau idempotent (voir la section sur OIB v4.0 ci-dessus).

## Couverture des benchmarks

| Benchmark | État |
|---|---|
| CIS Microsoft Windows 11 Enterprise L1 | 329 sur 378 paramètres uniques (87 %) ; le reste est couvert via les anneaux de mise à jour, la valeur par défaut, ou délibérément pas (règles de mot de passe NIST, droits utilisateur « personne », signature SMB « if agrees », ESS) |
| CIS Apple macOS 26 L1 | 38 sur 97 règles (contre 21) ; parmi les règles avec une clé MDM, 30 sur 50. 47 règles ne sont réalisables que par script ou manuellement |
| CIS Microsoft 365 Foundations 5.2.2 (CA) | 11 sur 17 couverts, 5 partiellement, 1 délibérément pas (5.2.2.10 casse l'enregistrement WHfB et Autopilot) |
| CIS iOS/iPadOS et Android | restrictions corporate et BYOD, code d'accès, mises à jour et conformité présents ; en phase 3/4 jusqu'à ce qu'il y ait des appareils inscrits |

## Ce qui n'a délibérément pas été fait

- **App Control for Business comme modèle** : le `settingInstanceTemplateId` ne peut pas être vérifié de façon générique ;
  il se trouve dans `IntuneTemplate/WIN/EndpointSecurity/` avec un script qui récupère les id depuis votre propre tenant.
- **Intégration Defender for Endpoint sur macOS** : exige le XML d'intégration propre au tenant ; procédure dans
  `IntuneTemplate/MAC/EndpointSecurity/`.
- **Exiger le chiffrement SMB et imposer le Kerberos armoring** : cassent des choses sans inventaire.
- **Stockage externe en lecture seule sur macOS** est en phase 5 : macOS ne monte alors plus du tout un disque USB ordinaire,
  la lecture disparaît donc aussi.
- **Profil d'inscription iOS Enterprise comme modèle Catalog** : id de modèle impossibles à vérifier ; sous forme de
  corps Graph dans `IntuneTemplate/IOS/Enrollment/`.

## Points ouverts

1. **Id de modèle dans les profils d'inscription macOS** (`Baseline_MAC_D_Enrollment_Profile_*`, depuis le
   27 août 2026) présentent un motif étrangement régulier et ne sont vérifiables nulle part. Les comparer une
   fois à un export d'un tenant.
2. **Labels ISO** : 16 labels suivent la forme usuelle de ce manifeste et non littéralement le titre NEN
   (que COMPLIANCE.md affiche bien). La conversion représente une modification dans `_controls.json` plus le manifeste.
   Les titres NEN proviennent d'une DdA publique, pas de la norme elle-même ; les titres CSF et les paragraphes du
   règlement d'exécution (UE) 2024/2690 n'ont pas été vérifiés mot pour mot.
3. **COMPLIANCE.md sans CA** : `CA-Policies/controls/ca-controls.json` existe depuis le 15 septembre 2026
   (41 stratégies CA, même vocabulaire que `_controls.json`), une version avec CA est donc désormais disponible :
   `node scripts/generate-compliance.js --strict --ca ../CA-Policies/controls/ca-controls.json`.
   Ce qui est dans git est délibérément la version `--no-ca`, car c'est celle que le workflow régénère — l'autre
   ligne ouvrirait à chaque exécution CI une PR qui l'annule. La différence est surtout sensible pour NIS2 (j) :
   3 stratégies Intune sans CA, 13 avec. Il reste possible de choisir une seule ligne, et alors celle-ci : renseigner
   `secrets.CA_POLICIES_TOKEN` et retirer le commentaire sur le checkout CA dans
   `.github/workflows/generate-baseline.yml` (y renseigner `<owner>/CA-Policies`), et remplacer
   dans ce même workflow `--no-ca` par `--ca .ca-policies/controls/ca-controls.json`.
4. **OIB macOS v2.0** : lors de cette importation, les Restrictions d'OIB définiront elles-mêmes des id Apple Intelligence et de durcissement ;
   la paire Restricted/Permitted et Restrictions Hardening devront alors être de nouveau comparées à la source.
5. **CA** : vérifier si CIPP transmet `insiderRiskLevels` (sinon `1190` bloque tout le monde) ; décision
   sur `3010` à 4 heures (CIS).
6. **Non testé sur de vrais appareils** : les nouvelles stratégies macOS, iOS et Android et les scripts dans
   `IntuneTemplate/`. D'abord un appareil pilote par plateforme.
