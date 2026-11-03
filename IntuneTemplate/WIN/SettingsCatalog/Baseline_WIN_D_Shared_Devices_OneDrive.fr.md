<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_Devices_OneDrive.md) · [English](Baseline_WIN_D_Shared_Devices_OneDrive.en.md) · **Français**

# [Baseline] - WIN - D - Shared Devices OneDrive

Connecte OneDrive en silence avec le compte professionnel sur les appareils partagés, place Bureau, Documents et Images dans OneDrive et garde les fichiers en ligne uniquement, y compris ceux des sites d'équipe synchronisés, afin que rien ne reste dans un profil que le PC partagé supprime et que le disque ne se remplisse pas d'une copie par utilisateur.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — les mêmes valeurs que [Baseline] - WIN - D - Microsoft OneDrive pour la connexion silencieuse, Fichiers à la demande, Known Folder Move et le tenant autorisé, plus Convert synced team site files to online-only files (DehydrateSyncedTeamSites, Microsoft Learn : Use OneDrive policies to control sync settings). |
| Fichier | [`Baseline_WIN_D_Shared_Devices_OneDrive.json`](Baseline_WIN_D_Shared_Devices_OneDrive.json) |

> À affecter à SG-D-UEM-WIN-Shared, à côté de [Baseline] - WIN - D - Shared PC ou Shared PC Domain and Guest. Un template à part, pour que la baseline Shared Devices de CIPP-Baselines puisse déployer OneDrive sans mettre [Baseline] - WIN - D - Microsoft OneDrive sur un groupe. Les paramètres communs ont les mêmes valeurs que dans cette stratégie, donc les deux sur un même appareil ne produisent pas de Conflit. L'ID Settings Catalog de DehydrateSyncedTeamSites suit le modèle des autres paramètres OneDrive et ne figure littéralement dans aucune source : si CIPP refuse le template, recherchez le paramètre dans le Settings Catalog (Convert synced team site files to online-only files) et reprenez cet ID.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.13 Sauvegarde des informations<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 12

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_silentaccountconfig` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_filesondemandenabled` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_desktop_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_documents_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_pictures_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_dropdown` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_textbox` | %OrganizationId% |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_kfmblockoptout` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_allowtenantlist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_allowtenantlist_allowtenantlistbox` | %OrganizationId% |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_dehydratesyncedteamsites` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
