<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.md) · [English](Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.en.md) · **Français**

# [Baseline] - WIN - D - Shared Devices SharePoint Team Sites

Synchronise automatiquement une bibliothèque SharePoint du client pour chaque utilisateur des appareils partagés, en fichiers en ligne uniquement, afin que chacun ait le dossier partagé dans l'Explorateur sans l'ajouter lui-même.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — Configure team site libraries to sync automatically (AutoMountTeamSites, Microsoft Learn : Use OneDrive policies to control sync settings). Nom et ID de bibliothèque depuis les variables CIPP %SharedTeamSiteName% et %SharedTeamSiteLibraryId%. |
| Fichier | [`Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.json`](Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.json) |

> À affecter à SG-D-UEM-WIN-Shared, avec [Baseline] - WIN - D - Shared Devices OneDrive (Fichiers à la demande est requis). Définissez par tenant dans CIPP les variables %SharedTeamSiteName% (le nom dans l'Explorateur) et %SharedTeamSiteLibraryId%. L'ID de bibliothèque se trouve dans SharePoint : ouvrez la bibliothèque, Synchroniser, annulez la demande de OneDrive et choisissez Copier l'ID de bibliothèque. Microsoft le déconseille pour les bibliothèques de plus de 5 000 fichiers ou dossiers et pour plus de 1 000 appareils par bibliothèque. OneDrive monte la bibliothèque dans les huit heures suivant la connexion ; sur un appareil partagé avec des profils toujours nouveaux, un utilisateur peut donc devoir attendre la première fois. Les ID Settings Catalog suivent le modèle des autres paramètres OneDrive et ne figurent littéralement dans aucune source : si CIPP refuse le template, reprenez les ID du Settings Catalog (Configure team site libraries to sync automatically).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.13 Sauvegarde des informations<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites_automountteamsiteslistbox` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites_automountteamsiteslistbox_key` | %SharedTeamSiteName% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites_automountteamsiteslistbox_value` | %SharedTeamSiteLibraryId% |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
