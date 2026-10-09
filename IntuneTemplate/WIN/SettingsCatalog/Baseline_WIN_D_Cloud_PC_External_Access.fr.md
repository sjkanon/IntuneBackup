<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Cloud_PC_External_Access.md) · [English](Baseline_WIN_D_Cloud_PC_External_Access.en.md) · **Français**

# [Baseline] - WIN - D - Cloud PC External Access

Sur les hôtes de session et les Cloud PC destinés aux appareils personnels et aux externes, coupe le presse-papiers, les imprimantes et la caméra, déconnecte une session après 15 minutes d'inactivité et la ferme 15 minutes plus tard : ce qui se trouve sur le poste de travail virtuel y reste.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | IntuneAdmin — Baseline - Win365 - Do not allow Clipboard redirection, Do not allow client printer redirection et Do not allow video capture redirection ; CIS Microsoft Intune for Windows 11 v4 L2 — Set time limit for active but idle Remote Desktop Services sessions (15 minutes) et Set time limit for disconnected sessions (15 minutes au lieu de 1) |
| Fichier | [`Baseline_WIN_D_Cloud_PC_External_Access.json`](Baseline_WIN_D_Cloud_PC_External_Access.json) |

> Va sur les mêmes hôtes que [Baseline] - WIN - D - Cloud PC Session Security : cette stratégie ne définit aucun paramètre qui figure aussi dans celle-là. Définissez les mêmes restrictions dans les propriétés RDP du pool d'hôtes (redirectclipboard:i:0, redirectprinters:i:0, camerastoredirect:s:, drivestoredirect:s:, usbdevicestoredirect:s:) ; le paramètre le plus restrictif l'emporte. La session est déconnectée après 15 minutes d'inactivité et fermée 15 minutes plus tard ; le travail non enregistré est alors perdu. L'audio et le microphone continuent de fonctionner pour Teams.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Travail à distance<br>A.8.12 Prévention de la fuite de données<br>A.5.15 Contrôle d'accès |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets<br>4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.DS-01<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 7

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_clipboard` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_printer` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_camera_redirection` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2_ts_sessions_idlelimittext` | 900000 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2_ts_sessions_enddisconnected` | 900000 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
