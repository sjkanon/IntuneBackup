<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Teams.md) · [English](Baseline_WIN_U_Microsoft_Teams.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Teams

Limite la connexion à Teams au tenant de l'organisation et empêche Teams de se lancer automatiquement juste après l'installation.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-145-UMicrosoftTeams` |
| Source | IntuneAdmin/IntuneBaselines — Windows 11 Benchmarks/Microsoft Teams |
| Fichier | [`Baseline_WIN_U_Microsoft_Teams.json`](Baseline_WIN_U_Microsoft_Teams.json) |

> L'id du tenant figure sous la forme `%OrganizationId%` dans le template. Lors du déploiement, CIPP le remplace par le customerId du tenant (voir Get-CIPPTextReplacement) ; `%tenantid%` fait de même. Les policies OneDrive utilisent déjà la même construction pour leur liste de tenants. Si vous déployez avec IntuneBackupAndRestore au lieu de CIPP, ce remplacement n'a pas lieu et vous devez renseigner l'id à la main. Séparez plusieurs tenants par une virgule. Le second paramètre relève du confort, pas de la sécurité : Teams ne démarre pas immédiatement après l'installation.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.14 Transfert des informations<br>A.5.15 Contrôle d'accès<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.AA-05<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_teamsv3~policy~l_teams_string_teams_signinrestriction_policy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_teamsv3~policy~l_teams_string_teams_signinrestriction_policy_restrictteamssignintoaccountsfromtenantlist` | %OrganizationId% |
| `user_vendor_msft_policy_config_teamsv2~policy~l_teams_teams_preventfirstlaunchafterinstall_policy` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
