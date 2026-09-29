[Nederlands](README.md) · [English](README.en.md) · **Français**

# StandardsTemplateV2/

Un unique template de **standards** CIPP. C'est autre chose que tout ce qui se trouve dans
`IntuneTemplate/` : celui-ci concerne les stratégies Intune sur les appareils, ceci concerne
les paramètres du tenant que CIPP surveille et rétablit lui-même.

| | |
|---|---|
| Fichier | `Standard.json` |
| `PartitionKey` | `StandardsTemplateV2` — c'est à cela que CIPP le reconnaît, pas au nom du dossier |
| Nom dans CIPP | `Standard` |

## Contenu

| Standard | Action | Paramètre |
|---|---|---|
| `NudgeMFA` | Remediate | désactivé (`state: disabled`, `snoozeDurationInDays: 0`) |
| `PasskeyDynamicMigrationOptOut` | Remediate | activé |

`isDriftTemplate` est renseigné ; CIPP peut donc l'utiliser pour surveiller la dérive : si le
tenant s'en écarte, CIPP le rétablit.

## Pourquoi ici et pas dans l'un des jeux de stratégies

Les pipelines de `scripts/` connaissent cinq types de stratégie CIPP (`Catalog`, `Admin`,
`Device`, `deviceCompliancePolicies`, `AppProtection`) et un template de standards n'est aucun
de ces cinq. Ce fichier n'est donc **pas** pris en compte par `check-scope.js`,
`check-sets.js` ou `export-intunebackup.js`.
Il ne suit pas non plus de convention de nommage avec plateforme et portée — cela n'a aucun sens
pour un paramètre de tenant.

CIPP le lit en revanche directement, comme les jeux de stratégies : le fichier se termine par
`.json` et ne se trouve pas sous un chemin `NativeImport`. Voir le
[README principal](../README.fr.md#restaurer-dans-un-tenant) pour le fonctionnement de ce
balayage.

## Mise à jour

Réexportez le template depuis CIPP (Tenant Administration → Standards → template →
Export) et remplacez `Standard.json`. Une mise à jour manuelle est possible, mais attention :
toute la configuration est stockée sous forme de **chaîne** dans `.JSON` ; une modification doit
donc être faite à l'intérieur de cette chaîne et correctement échappée.
