[Nederlands](README.md) · [English](README.en.md) · **Français**

# App Control for Business (WDAC) — point de départ générique

La plus grande lacune de fond de la baseline (ANALYSE.md, *Délibérément non repris*) :
il n'y avait aucun contrôle des applications. Voici la partie générique, identique pour chaque tenant.
Les exceptions qui suivent sont propres à chaque organisation et n'ont **pas** leur place dans ce dépôt.

| | |
|---|---|
| **Mesures** | ISO A.8.19 Installation de logiciels sur des systèmes opérationnels, A.8.7 Protection contre les programmes malveillants · NIS2 art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance, y compris les vulnérabilités · CIS Controls v8.1 2.5 Allowlist Authorized Software, 2.6 Allowlist Authorized Libraries, 2.7 Allowlist Authorized Scripts · NIST CSF 2.0 PR.PS-05 |
| **Benchmark** | CIS Controls IG2/IG3 ; ASD Essential Eight *Application control* (maturity level 1) ; Microsoft *App Control for Business design guide* |
| **Prérequis** | Windows 11 Pro/Enterprise/Education (Pro avec la mise à jour de novembre 2022 ou ultérieure), inscrit dans Intune ; en co-gestion : workload *Endpoint Protection* sur Intune. Advanced Hunting nécessite Defender for Endpoint P2 ou Business. |

## Pourquoi ce n'est pas un template dans `IntuneTemplate/`

Les stratégies App Control sont des stratégies Endpoint security basées sur le template
`d3849ba8-bf95-467c-9640-aa2334eae9e3_1` (*App Control for Business*, famille
`endpointSecurityApplicationControl` ; c'est ainsi qu'il existe dans `pl4nty/intune-change-tracking`
DCv2/Templates et ainsi que Microsoft365DSC l'utilise). Un tel corps exige pour chaque paramètre un
`settingInstanceTemplateId`. Cet id ne figure **pas** dans la source des définitions — pl4nty reproduit les
templates sans leurs `settingTemplates` — et le seul endroit où nous l'avons trouvé (un mock de test unitaire
dans Microsoft365DSC) ne constitue pas une preuve. La SPEC n'autorise que des ids vérifiables ; le corps figure donc
ici avec un placeholder et un script qui récupère l'id réel dans votre propre tenant.

Ce qui a **bien** été vérifié par rapport à `DCv2/Settings/` (id, type, `itemId` valides) :

| settingDefinitionId | Valeur audit | Valeur application |
|---|---|---|
| `device_vendor_msft_policy_config_applicationcontrolv2_buildoptions` | `…_built_in_controls_selected` | idem |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_auditmode` | `…_auditmode_enabled` | `…_auditmode_disabled` |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_trustappswithgoodreputation` | `…_enabled` | `…_enabled` |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_trustappsfrommanagedinstaller` | `…_enabled` | `…_enabled` |

L'ancienne variante basée sur le template `4321b946-b76b-4450-8afd-769c08b16ffc_1`
(`applicationcontrol_policies_{policyguid}_policiesoptions` → `built_in_controls` →
`enable_app_control` + `trust_apps`) existe toujours, mais Microsoft365DSC et le portail actuel
utilisent les ids v2. Ne l'ajoutez pas à côté de celle-ci.

## Fichiers

| Fichier | Quoi |
|---|---|
| `AppControl_BuiltIn_Audit.graph.json` | `POST /beta/deviceManagement/configurationPolicies` — composants Windows + applications du Store approuvés, ISG (bonne réputation) et managed installer approuvés, **mode audit**. Nom `[Baseline] - WIN - D - App Control Audit`. |
| `AppControl_BuiltIn_Enforce.graph.json` | Même corps, **application**. Nom `[Baseline] - WIN - D - App Control Enforced`. Jamais en même temps que la stratégie d'audit sur le même appareil. |
| `Set-AppControlTemplateIds.ps1` | Récupère le `settingInstanceTemplateId` (et le `settingValueTemplateId`) via `GET /beta/deviceManagement/configurationPolicyTemplates('d3849ba8-bf95-467c-9640-aa2334eae9e3_1')/settingTemplates`, les renseigne dans les deux corps et crée éventuellement les stratégies (`-Create`, sans affectation). |
| `hunting-queries.kql` | Requêtes Advanced Hunting pour la phase d'audit et la surveillance après application. |

## Le processus

Le contrôle des applications n'est pas un paramètre mais un projet. L'ordre ci-dessous est celui de la
documentation Microsoft, transposé dans les phases de cette baseline.

### 0. Activer le managed installer — maintenant, sans conséquences

Intune admin center → **Endpoint security → App Control for Business → Managed installer →
Create**, *Enable Intune Managed Extension as Managed Installer* = **Enabled**, affecter à
tous les appareils Windows.

- À partir de ce moment, **chaque application installée par Intune** (Win32, LOB, Store via IME) reçoit
  l'étiquette managed installer. L'étiquette ne fait rien en soi : seule une stratégie App Control avec
  *Trust apps from managed installers* en fait une autorisation.
- **Pas de manière rétroactive.** Ce qui est déjà installé n'a pas d'étiquette. C'est précisément pourquoi
  on commence par ceci, puis des semaines d'audit, et seulement ensuite l'application.
- Intune déploie pour cela une stratégie AppLocker avec une règle factice. S'il existe déjà une stratégie AppLocker
  avec une RuleCollection *NotConfigured* vide, cette fusion peut tout bloquer
  (jusqu'à l'ouverture de session) — supprimez ces collections au préalable. Si AppLocker n'est utilisé nulle part,
  il n'y a aucun problème.
- Depuis août 2025, Microsoft décrit ceci comme une stratégie par groupe plutôt qu'un seul
  paramètre de tenant ; Graph ne connaît pas de type stable et documenté pour cela que CIPP prend en charge —
  d'où une étape manuelle.

### 1. Audit — phase 2, groupe pilote, puis tous les appareils

Créez `AppControl_BuiltIn_Audit.graph.json` (voir *Déploiement*) et affectez-la au groupe pilote
(`SEC-Baseline-Pilot`), puis au bout d'une semaine à tous les appareils Windows. En mode audit, tout continue
de fonctionner ; Windows journalise pour chaque fichier ce qui **aurait** été bloqué :

| Événement | Journal | Advanced Hunting `ActionType` |
|---|---|---|
| 3076 — aurait été bloqué (audit) | Microsoft-Windows-CodeIntegrity/Operational | `AppControlCodeIntegrityPolicyAudited` |
| 3077 — bloqué (application) | idem | `AppControlCodeIntegrityPolicyBlocked` |
| 3089 — informations de signature pour 3076/3077 | idem | `AppControlCodeIntegritySigningInformation` |
| 3090/3091/3092 — autorisé/audité/bloqué sur la base de l'ISG ou du managed installer | idem | `AppControlCodeIntegrityOrigin*` |
| 8028/8029 — script/MSI audité/bloqué | Microsoft-Windows-AppLocker/MSI and Script | `AppControlCIScriptAudited` / `…Blocked` |
| 3099 — stratégie chargée | CodeIntegrity/Operational | `AppControlCodeIntegrityPolicyLoaded` |

Laissez l'audit tourner au moins **30 jours**, y compris une clôture mensuelle : sinon, les outils périodiques
(paie, clôture annuelle, pilotes d'imprimante) n'apparaissent qu'après l'application.
Agrandissez au préalable le journal CodeIntegrity avec `../event-log-sizes/`.

### 2. Exceptions — par organisation

Les requêtes 2 et 3 de `hunting-queries.kql` donnent pour chaque fichier : chemin, éditeur, hash, nombre
d'appareils. Une décision par ligne :

1. **(Ré)installer via Intune** — la solution privilégiée. Reçoit l'étiquette managed installer et est
   automatiquement couvert par la stratégie de base. Concerne surtout les applications déployées avant l'étape 0.
2. **Supplemental policy** — pour ce qui ne passe pas par Intune (outils de développement mis à jour par l'utilisateur,
   applications portables de fournisseurs). Créez le XML avec le
   [App Control Policy Wizard](https://webapp-wdac-wizard.azurewebsites.net/) ou
   `New-CIPolicy -Level Publisher -Fallback Hash`, définissez `BasePolicyID` sur le PolicyID de la
   combinaison de contrôles intégrés, et déployez via **Create Policy → Enter xml data** avec la même
   affectation que la stratégie de base. Pour audit + ISG + managed installer, ce PolicyID est
   `{2DA0F72D-1688-4097-847D-C42C39E631BC}` (Microsoft Learn, *Manage App Control*). Préférence :
   règles d'éditeur plutôt que règles de hash (les hashes cassent à chaque mise à jour), jamais de règles de chemin sur
   des chemins accessibles en écriture aux utilisateurs.
3. **Supprimer** — les logiciels qui n'ont rien à faire là. L'audit a alors déjà porté ses fruits.

Ces exceptions sont propres à chaque organisation et ont leur place dans votre propre tenant, pas dans ce dépôt.

### 3. Application — phase 4

Seulement lorsque la requête 2 ne montre plus rien d'inconnu sur sept jours : affectez
`AppControl_BuiltIn_Enforce.graph.json` à un groupe `SEC-AppControl-Enforced` et
**retirez ce groupe de l'affectation de la stratégie d'audit**. Les deux stratégies ont le même
PolicyID ; sur un même appareil, elles entrent en conflit. Étendez par service, pas en une seule fois.

L'application ne nécessite pas de redémarrage (rebootless base policy). En revanche :

- **Retour arrière :** réaffectez d'abord la stratégie d'audit (ou une stratégie `AllowAll`), et seulement ensuite
  supprimez la stratégie d'application. Une stratégie App Control supprimée reste active jusqu'au prochain redémarrage ;
  Microsoft met en outre en garde contre des problèmes de démarrage lors de la suppression ou de la désinscription
  d'appareils avec des stratégies appliquées — suivez *Remove App Control policies causing boot stop
  failures* sur Microsoft Learn.
- **Surveillance :** requêtes 1 et 4 quotidiennement ; chaque 3077 est un utilisateur qui n'a pas pu lancer quelque chose.

## Déploiement

```powershell
Connect-MgGraph -Scopes DeviceManagementConfiguration.ReadWrite.All
./Set-AppControlTemplateIds.ps1              # renseigne les placeholders, écrit *.resolved.json
./Set-AppControlTemplateIds.ps1 -Create      # idem, et crée les deux stratégies sans affectation
```

Via CIPP : renseignez d'abord les ids avec le script, puis importez le `*.resolved.json` comme
template Endpoint security dans votre propre instance CIPP ; le type `IntuneTemplate` de CIPP conserve le
bloc `templateReference`.

## Ce que ceci ne couvre *pas*

- **Smart App Control** — uniquement sur des appareils installés à neuf, non gérable de manière centralisée
  et se désactive de lui-même sur les appareils gérés. Pas une alternative à ce projet.
- **Profils AppLocker** sous Attack surface reduction — abandonnés par Microsoft au profit
  du CSP ApplicationControl.
- **Pilotes** — la Microsoft vulnerable driver blocklist est déjà activée via HVCI
  (Device Guard and Credential Guard) et la règle ASR *Block abuse of exploited vulnerable signed
  drivers*.
