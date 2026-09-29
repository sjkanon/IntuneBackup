<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Remote_Desktop_and_RPC.md) · [English](Baseline_WIN_D_Remote_Desktop_and_RPC.en.md) · **Français**

# [Baseline] - WIN - D - Remote Desktop and RPC

Restreint le Bureau à distance et les appels de procédure distants, deux points d'entrée souvent utilisés pour le mouvement latéral lors d'une intrusion.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-078-DRemoteDesktopAndRPC` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Remote Desktop Services and RPC |
| Fichier | [`Baseline_WIN_D_Remote_Desktop_and_RPC.json`](Baseline_WIN_D_Remote_Desktop_and_RPC.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Authentification sécurisée<br>A.8.20 Sécurité des réseaux<br>A.8.21 Sécurité des services réseau<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>12.6 Use of Secure Network Management and Communication Protocols |
| NIST CSF 2.0 | PR.IR-01<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 12

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_remoteprocedurecall_rpcendpointmapperclientauthentication` | 1 |
| `device_vendor_msft_policy_config_remoteprocedurecall_restrictunauthenticatedrpcclients` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remoteprocedurecall_restrictunauthenticatedrpcclients_rpcrestrictremoteclientslist` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_donotallowpasswordsaving` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_donotallowdriveredirection` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_promptforpassworduponconnection` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_requiresecurerpccommunication` | 1 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_security_layer_policy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_security_layer_policy_ts_security_layer` | 2 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_user_authentication_policy` | 1 |
| `device_vendor_msft_policy_config_remotedesktopservices_clientconnectionencryptionlevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_remotedesktopservices_clientconnectionencryptionlevel_ts_encryption_level` | 3 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
