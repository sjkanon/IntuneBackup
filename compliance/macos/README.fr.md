[Nederlands](README.md) · [English](README.en.md) · **Français**

# compliance/macos/

Un contrôle de conformité personnalisé pour macOS : Microsoft Defender for Endpoint
s'exécute-t-il sur ce Mac, et est-il en bonne santé ?

Ces deux fichiers se trouvent volontairement **en dehors** de
[`IntuneTemplate/`](../../IntuneTemplate/README.fr.md), pour la même raison que
[`shellscripts/macos/`](../../shellscripts/macos/README.fr.md) et
[`enrollment/macos/`](../../enrollment/macos/README.fr.md) : dans Graph, un script de conformité
est une ressource à part (`deviceManagement/deviceComplianceScripts`) et n'entre dans aucun des
cinq types de stratégie CIPP. Les pipelines ne prennent pas en compte ce dossier, et il n'y a
donc pas de `checkId`.

| Fichier | Description |
|---|---|
| [`defender-health.sh`](defender-health.sh) | s'exécute sur le Mac et écrit une seule ligne JSON avec cinq booléens |
| [`defender-health.json`](defender-health.json) | indique quelle valeur est correcte, et ce que l'utilisateur voit dans Portail d'entreprise en cas d'échec |

## Pourquoi c'est nécessaire

La baseline déploie Defender for Endpoint sur macOS
([`MAC - D - Defender for Endpoint`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.fr.md)
et [`MAC - D - Defender Antivirus`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.fr.md)),
mais ne vérifiait nulle part que cela avait réussi. Windows dispose bien de ce contrôle —
`WIN - U - Compliance Defender Real Time Protection` et `Defender Security Intelligence` vérifient
que Defender est activé, que la protection en temps réel est active et que les définitions sont
à jour. Sur macOS, l'équivalent manquait.

`macOSCompliancePolicy` connaît bien `deviceThreatProtectionEnabled`, mais cela vérifie autre
chose : le **score de risque** que Defender attribue à l'appareil. Un Mac sur lequel l'agent n'a
jamais été installé, ou dont le processus d'arrière-plan s'est arrêté, ne produit aucun score de
risque — et passe donc ce contrôle comme « aucun problème ». Précisément l'appareil que vous
vouliez trouver échappe à la mesure. Un script est le seul moyen de vérifier que l'agent est
bien là.

## Ce qu'il contrôle

| Booléen | Comment |
|---|---|
| `DefenderInstalled` | l'application et `/usr/local/bin/mdatp` existent — l'application seule ne dit rien d'un agent fonctionnel, et l'outil seul subsiste aussi après une suppression partielle |
| `DefenderRunning` | le processus `wdavdaemon` tourne ; l'application peut être fermée |
| `DefenderHealthy` | `mdatp health --field healthy` |
| `DefenderRealtimeProtection` | `mdatp health --field real_time_protection_enabled` |
| `DefenderDefinitionsCurrent` | `mdatp health --field definitions_status` vaut `up_to_date` |

Les cinq doivent valoir `true`. Les appels health n'ont lieu que si le démon tourne : sans cette
vérification préalable, `mdatp health` reste bloqué jusqu'à ce qu'Intune interrompe le script,
et il n'y a alors aucune sortie, donc aucun verdict.

## Déploiement

1. **Intune** → Appareils → Stratégies de conformité → **Scripts** → Ajouter → macOS.
   Collez `defender-health.sh`. Laissez *Exécuter en tant qu'utilisateur connecté* **désactivé** —
   le contrôle doit porter sur tout l'appareil et `mdatp` n'a pas besoin de contexte utilisateur.
2. Créez une stratégie de conformité macOS, réglez **Conformité personnalisée** sur *Exiger*,
   choisissez le script de l'étape 1 et chargez `defender-health.json`.
3. Affectez-la à tous les utilisateurs, comme les autres stratégies de conformité macOS.

> Il n'y a volontairement **aucun** template de stratégie de conformité pour cela dans
> `IntuneTemplate/`. Une telle stratégie référence via `deviceCompliancePolicyScript` l'id du
> script de l'étape 1, et cet id n'apparaît que dans le tenant. Un template avec un id vide ou
> étranger ne s'importe pas, ou pire : s'importe et ne contrôle rien.

## En cas de problème

Le script journalise dans `/Library/Logs/Microsoft/IntuneScripts/Compliance/defender-health.log`,
avec pour chaque exécution les cinq résultats et la valeur brute de `definitions_status` si
elle n'était pas correcte.

Deux choses qui tournent souvent mal avec un contrôle de conformité personnalisé :

- **Toute sortie supplémentaire sur stdout invalide l'évaluation entière.** Intune attend
  exactement une ligne JSON. C'est pourquoi tout ce que ce script signale d'autre va dans le
  fichier journal et non sur stdout.
- **`DefenderHealthy` à `false` alors que le reste est correct** indique généralement une
  autorisation manquante sous Réglages Système → Confidentialité et sécurité, le plus souvent
  Accès complet au disque. La baseline la définit via
  [`MAC - D - Privacy Preferences`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.fr.md) ;
  si cette stratégie n'arrive pas, c'est ici que vous le remarquez en premier.

Source de l'approche : [Custom compliance for Defender on macOS](https://www.oddsandendpoints.co.uk/posts/macos-custom-defender-compliance/)
(Odds and Endpoints).

---

Retour au [README principal](../../README.fr.md).
