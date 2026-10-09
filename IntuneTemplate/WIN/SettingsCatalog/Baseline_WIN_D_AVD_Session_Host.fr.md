<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_AVD_Session_Host.md) · [English](Baseline_WIN_D_AVD_Session_Host.en.md) · **Français**

# [Baseline] - WIN - D - AVD Session Host

Déconnecte définitivement une session interrompue sur les hôtes de session AVD après deux heures, interrompt une session inactive depuis deux heures, et désactive Storage Sense afin que Windows ne nettoie rien dans les profils attachés par FSLogix.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | Propre — la répartition dans INTUNE-BASELINE.md de l'environnement de test AVD (Storage Sense pas sur les hôtes de session) et les limites de session des Services Bureau à distance dans le Settings Catalog |
| Fichier | [`Baseline_WIN_D_AVD_Session_Host.json`](Baseline_WIN_D_AVD_Session_Host.json) |

> La redirection du fuseau horaire (ts_time_zone) n'y figure délibérément pas : [Baseline] - WIN - D - Cloud PC Session Security la définit déjà sur les hôtes de session (groupe SEC-Cloud-PC). **Chevauchement avec [Baseline] - WIN - D - Cloud PC External Access :** celle-ci définit les deux mêmes limites de session à 15 minutes. Sur un pool d'hôtes pour externes, les deux stratégies arriveraient et entreraient en conflit (Conflit : aucune des deux limites ne s'applique). Excluez donc le groupe SEC-Cloud-PC-External sur cette stratégie ; Storage Sense est alors à la valeur Windows par défaut sur ces hôtes. Les valeurs sont en millisecondes : 7200000 correspond à deux heures.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Travail à distance<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.6 Dimensionnement |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2_ts_sessions_idlelimittext` | 7200000 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2_ts_sessions_enddisconnected` | 7200000 |
| `device_vendor_msft_policy_config_storage_allowstoragesenseglobal` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
