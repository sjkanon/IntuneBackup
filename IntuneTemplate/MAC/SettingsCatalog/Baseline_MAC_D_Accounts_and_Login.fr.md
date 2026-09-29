<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Accounts_and_Login.md) · [English](Baseline_MAC_D_Accounts_and_Login.en.md) · **Français**

# [Baseline] - MAC - D - Accounts and Login

Détermine ce qui est visible à la connexion et quels comptes un Mac peut avoir.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-035-MACDAccountsAndLogin` |
| Source | OpenIntuneBaseline macOS v1.0 — Device Security - D - Accounts and Login |
| Fichier | [`Baseline_MAC_D_Accounts_and_Login.json`](Baseline_MAC_D_Accounts_and_Login.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.7 Manage Default Accounts on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 8

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.mcx_com.apple.mcx-accounts` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx_disableguestaccount` | true |
| `com.apple.loginwindow_com.apple.loginwindow` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_adminhostinfo` | HostName |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_disableconsoleaccess` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_hideadminusers` | false |
| `loginwindow_loginwindow` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`loginwindow_disableloginitemssuppression` | true |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
