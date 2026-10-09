<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Cloud_PC_Session_Security.md) · [English](Baseline_WIN_D_Cloud_PC_Session_Security.en.md) · **Français**

# [Baseline] - WIN - D - Cloud PC Session Security

Sécurise la session sur un Cloud PC Windows 365 ou un hôte de session Azure Virtual Desktop : rien n'est copié du poste de travail virtuel vers l'appareil local, aucun périphérique COM, LPT ou USB n'est redirigé, la session est déconnectée au verrouillage, la capture d'écran depuis l'appareil local est bloquée et un filigrane avec l'ID de connexion couvre le bureau.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows 365 v1.0 — Device Security - D - Connectivity Settings et Resource Redirection, sans les quatre paramètres que [Baseline] - WIN - D - Remote Desktop and RPC définit déjà ; IntuneAdmin — Baseline - AVD - Enable screen capture protection et Enable watermarking |
| Fichier | [`Baseline_WIN_D_Cloud_PC_Session_Security.json`](Baseline_WIN_D_Cloud_PC_Session_Security.json) |

> Complète ce que [Baseline] - WIN - D - Remote Desktop and RPC définit déjà sur chaque appareil (demande de mot de passe à la connexion, RPC sécurisé, niveau de chiffrement élevé, pas de redirection de lecteurs) ; ces quatre paramètres ne sont volontairement pas répétés ici. Le presse-papiers du serveur vers le client est désactivé (OIB) ; du client vers le serveur, il reste autorisé. Screen capture protection sur « client » et non sur « client and server » comme chez IntuneAdmin : les données restent ainsi déjà dans le poste de travail virtuel, et l'Outil Capture d'écran dans la session continue de fonctionner pour un signalement au service desk. Conséquence : qui partage le bureau dans une réunion Teams depuis l'appareil local voit du noir — partagez depuis Teams dans la session. Windows App sur iOS et Android ne se connecte que si une app protection policy sur Windows App bloque la capture d'écran (voir IOS/AppConfiguration et AND/AppConfiguration). Le filigrane fonctionne sur un bureau complet, pas sur RemoteApp. BitLocker n'a pas sa place sur un Cloud PC : excluez SEC-Cloud-PC de [Baseline] - WIN - D - BitLocker et [Baseline] - WIN - U - Compliance BitLocker, ou affectez-les avec un filtre sur deviceModel.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Travail à distance<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 13.5 Manage Access Control for Remote Assets<br>3.3 Configure Data Access Control Lists |
| NIST CSF 2.0 | PR.AA-05<br>PR.DS-01<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 19

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_select_transport` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_select_transport_ts_select_transport_type` | 0 |
| `device_vendor_msft_policy_config_remotedesktopservices_disconnectonlockmicrosoftidentityauthn` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_audio` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_audio_capture` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_time_zone` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_com` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_lpt` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_client_pnp` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_limitservertoclientclipboardredirection` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remotedesktopservices_limitservertoclientclipboardredirection_ts_sc_clipboard_restriction_text` | 0 |
| `device_vendor_msft_policy_config_terminalserver-avdv1~policy~avd_gp_node_avd_server_screen_capture_protection` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1~policy~avd_gp_node_avd_server_screen_capture_protection_avd_server_screen_capture_protection_level` | 1 |
| `device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingheightfactor` | 180 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingopacity` | 2000 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingqrscale` | 4 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingcontent` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_terminalserver-avdv1.upadtes~policy~avd_gp_node_avd_server_watermarking_part_watermarkingwidthfactor` | 320 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
