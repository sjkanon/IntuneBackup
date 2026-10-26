<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_PC_Domain_Guest.md) · [English](Baseline_WIN_D_Shared_PC_Domain_Guest.en.md) · **Français**

# [Baseline] - WIN - D - Shared PC Domain and Guest

Mode PC partagé comme [Baseline] - WIN - D - Shared PC, mais avec en plus un compte invité : l'écran de connexion affiche un bouton Invité permettant à une personne sans compte de démarrer une session locale temporaire.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | Baseline propre — Intune Shared multi-user device (sharedPCConfiguration, SharedPC CSP), variante de [Baseline] - WIN - D - Shared PC avec allowedAccounts guest,domain. |
| Fichier | [`Baseline_WIN_D_Shared_PC_Domain_Guest.json`](Baseline_WIN_D_Shared_PC_Domain_Guest.json) |

> Groupe propre SG-D-UEM-WIN-SharedPC-Guest (attribué) ; voir la note de [Baseline] - WIN - D - Shared PC pour la répartition des groupes — un appareil est dans exactement un des deux groupes PC partagé. Un invité n'a pas d'identité Entra : l'accès conditionnel, la MFA et la conformité Intune ne s'appliquent pas à lui, et il ne peut pas accéder à Teams, SharePoint ou à la messagerie de l'organisation. C'est donc un appareil pour Internet et les services publics, pas pour le travail. Ce qu'un invité peut faire, c'est tout ce que l'appareil lui-même autorise : n'ouvrez pas de dossiers partagés ou d'imprimantes sensibles accessibles sans connexion. Attention à l'interaction avec [Baseline] - WIN - D - User Rights : elle refuse l'ouverture de session locale au groupe intégré Invités (*S-1-5-32-546). Microsoft ne documente pas dans quel groupe local le compte invité du PC partagé est placé ; testez dans le pilote si le bouton Invité fonctionne. Sinon, ce droit en est la cause et une copie de User Rights propre au tenant, sans ce SID, doit être affectée à SG-D-UEM-WIN-SharedPC-Guest. [Baseline] - WIN - D - Local Security Policies désactive aussi le compte Invité intégré ; c'est un autre compte que l'invité du PC partagé et il reste désactivé.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.AA-01<br>PR.DS-01<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 14

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `enabled` | true |
| `allowedAccounts` | guest,domain |
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
