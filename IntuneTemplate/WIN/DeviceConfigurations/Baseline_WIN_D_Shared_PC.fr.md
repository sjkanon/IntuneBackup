<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_PC.md) · [English](Baseline_WIN_D_Shared_PC.en.md) · **Français**

# [Baseline] - WIN - D - Shared PC

Place les PC Windows partagés en mode PC partagé avec uniquement des comptes Entra : les profils des utilisateurs qui ne se sont pas connectés depuis 30 jours, ou lorsque l'espace disque libre passe sous 25 %, sont supprimés, il n'y a pas de stockage local en dehors du profil et la maintenance s'exécute à 02:00.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | Baseline propre — Intune Shared multi-user device (sharedPCConfiguration, SharedPC CSP). OpenIntuneBaseline ne couvre volontairement pas les appareils partagés (WINDOWS/README.md). |
| Fichier | [`Baseline_WIN_D_Shared_PC.json`](Baseline_WIN_D_Shared_PC.json) |

> Groupe propre SG-D-UEM-WIN-SharedPC (attribué), à côté de SEC-Shared-Devices : un appareil partagé est dans SEC-Shared-Devices (WHfB Multi User, Wireless Shared Devices) et dans exactement un de SG-D-UEM-WIN-SharedPC ou SG-D-UEM-WIN-SharedPC-Guest. Deux stratégies PC partagé sur un même appareil produisent un Conflit dans Intune, et alors aucune des deux ne fait rien. Le mode PC partagé n'agit que sur les nouvelles connexions : les profils qui existaient avant l'arrivée de la stratégie ne sont pas toujours supprimés par le gestionnaire de comptes — commencez de préférence avec un appareil propre (Autopilot reset). Le profil d'un utilisateur disparaît après 30 jours d'inactivité ou dès que l'espace libre passe sous 25 % ; au-dessus de 50 % d'espace libre, les profils sont conservés. C'est pourquoi OneDrive avec Known Folder Move doit être activé sur ces appareils, sinon les fichiers disparaissent avec le profil. `disableEduPolicies` est à true : les paramètres éducation du PC partagé (notamment pas d'applications Store, pas de Cortana) n'ont pas leur place ici. À combiner avec [Baseline] - WIN - D - Windows Hello for Business Disabled et [Baseline] - WIN - D - Security Key Sign-in : sur un appareil partagé, pas de WHfB par utilisateur, mais une connexion avec une clé.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.5.16 Gestion des identités<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 5.6 Centralize Account Management |
| NIST CSF 2.0 | PR.AA-01<br>PR.DS-01<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 14

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `enabled` | true |
| `allowedAccounts` | domain |
| `allowLocalStorage` | false |
| `disableAccountManager` | false |
| `disableEduPolicies` | true |
| `disablePowerPolicies` | false |
| `disableSignInOnResume` | false |
| `idleTimeBeforeSleepInSeconds` | 3600 |
| `maintenanceStartTime` | 02:00:00.0000000 |
| `accountManagerPolicy.@odata.type` | #microsoft.graph.sharedPCAccountManagerPolicy |
| `accountManagerPolicy.accountDeletionPolicy` | diskSpaceThresholdOrInactiveThreshold |
| `accountManagerPolicy.cacheAccountsAboveDiskFreePercentage` | 50 |
| `accountManagerPolicy.inactiveThresholdDays` | 30 |
| `accountManagerPolicy.removeAccountsBelowDiskFreePercentage` | 25 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
