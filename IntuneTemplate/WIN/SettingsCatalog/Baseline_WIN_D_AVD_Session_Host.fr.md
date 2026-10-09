<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_AVD_Session_Host.md) · [English](Baseline_WIN_D_AVD_Session_Host.en.md) · **Français**

# [Baseline] - WIN - D - AVD Session Host

Ferme sur les hôtes de session AVD une session déconnectée après deux heures, déconnecte une session inactive depuis deux heures, et laisse Storage Sense nettoyer dans le profil monté (chaque jour via la cadence dans l'image) : fichiers OneDrive en ligne uniquement après sept jours, fichiers temporaires, la corbeille après quatorze et les Téléchargements après trente jours.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | Propre — les limites de session des services Bureau à distance et les paramètres Storage Sense du Settings Catalog, avec des valeurs pour les conteneurs de profils FSLogix |
| Fichier | [`Baseline_WIN_D_AVD_Session_Host.json`](Baseline_WIN_D_AVD_Session_Host.json) |

> **La cadence ne figure pas dans cette stratégie.** configstoragesenseglobalcadence n'a pas windowsMultiSession dans applicability.windowsSkus de sa définition Settings Catalog : Intune ne la fournit donc pas à un hôte multisession (les cinq autres paramètres Storage Sense, si ; vérifié sur l'hôte). Sans cadence, Storage Sense ne s'exécute que lorsque l'espace libre sur C: est faible, ce qui n'arrive jamais sur un hôte de session — Storage Sense ne s'exécuterait alors jamais. L'image AVD définit donc ConfigStorageSenseGlobalCadence = 1 (quotidien) sous HKLM\SOFTWARE\Policies\Microsoft\Windows\StorageSense (run-vdot.ps1 dans le dépôt AVD). Les Téléchargements seulement après trente jours, car c'est une vraie suppression ; la déshydratation OneDrive après sept jours, car le fichier reste en ligne. Plus besoin d'Invoke-FslShrinkDisk ni de FSLShrink chaque semaine : la compaction intégrée à la déconnexion (FSLogix 2210 et ultérieur) fait la même chose à chaque déconnexion, sans VM séparée avec des droits sur le partage et sans risque qu'un script touche un conteneur monté ; les limites de session ci-dessus garantissent que les déconnexions ont bien lieu. FSLShrink uniquement en dernier recours pour des conteneurs déjà volumineux : une seule fois, hors heures de bureau, avec les hôtes en mode drain. La redirection du fuseau horaire (ts_time_zone) n'y figure volontairement pas : [Baseline] - WIN - D - Cloud PC Session Security la définit déjà sur les hôtes de session (groupe SEC-Cloud-PC). **Chevauchement avec [Baseline] - WIN - D - Cloud PC External Access :** elle fixe les deux mêmes limites de session à 15 minutes. Sur un pool d'hôtes pour externes, les deux stratégies arrivent et entrent en conflit (Conflict : aucune des deux limites ne s'applique) ; dans le modèle par paquets, cette stratégie ne peut pas y être exclue seule — voir les points ouverts dans docs/AVD.md. Les valeurs sont en millisecondes : 7200000 correspond à deux heures.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Travail à distance<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.6 Dimensionnement |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2_ts_sessions_idlelimittext` | 7200000 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2_ts_sessions_enddisconnected` | 7200000 |
| `device_vendor_msft_policy_config_storage_allowstoragesenseglobal` | 1 |
| `device_vendor_msft_policy_config_storage_allowstoragesensetemporaryfilescleanup` | 1 |
| `device_vendor_msft_policy_config_storage_configstoragesensecloudcontentdehydrationthreshold` | 7 |
| `device_vendor_msft_policy_config_storage_configstoragesenserecyclebincleanupthreshold` | 14 |
| `device_vendor_msft_policy_config_storage_configstoragesensedownloadscleanupthreshold` | 30 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
