<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Login_Window.md) · [English](Baseline_MAC_D_Login_Window.en.md) · **Français**

# CXNM - Standard - MAC - D - Login Window

Fait demander le nom de compte et le mot de passe par la fenêtre de connexion au lieu d'afficher une liste de comptes, et affiche un court message indiquant que l'appareil est réservé à un usage autorisé.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.11.3 (bannière de connexion) et 2.11.4 (demander le nom et le mot de passe), mSCP branch tahoe ; settingDefinitionId vérifiés par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_MAC_D_Login_Window.json`](Baseline_MAC_D_Login_Window.json) |

> Texte de la bannière : "Alleen voor geautoriseerd gebruik. Activiteit op dit apparaat kan worden vastgelegd. / Authorized use only. Activity on this device may be logged." — générique, sans nom d'organisation ; adaptez-le à votre propre charte d'utilisation (A.5.10) si celle-ci dit autre chose. Maximum 1 032 caractères. Chevauchement avec CXNM - Standard - MAC - D - Accounts and Login vérifié : celle-ci définit dans le même payload (com.apple.loginwindow) adminHostInfo, DisableConsoleAccess et HideAdminUsers ; cette policy SHOWFULLNAME et LoginwindowText. Clés différentes, aucun settingDefinitionId en double ; macOS fusionne les clés des deux profils. Pas placé dans Accounts and Login parce que celle-ci provient d'OpenIntuneBaseline et est en phase 1. Le compte invité est déjà désactivé via Accounts and Login (DisableGuestAccount) et n'est pas répété ici. Deux règles CIS de la même section ne peuvent pas être définies via le settings catalog : 2.11.5 indices de mot de passe (RetriesUntilHint) et 2.13.3 connexion automatique (com.apple.login.mcx.DisableAutoLoginClient) — les clés n'y existent pas. La connexion automatique est de toute façon impossible avec FileVault activé (policy FileVault). Platform SSO avec enableCreateUserAtLogin fonctionne justement mieux avec un champ nom et mot de passe : un nouvel utilisateur y saisit son compte Entra. SHOWFULLNAME remplace 'Show other users managed', qui n'est pas défini.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Authentification sécurisée<br>A.5.10 Utilisation correcte de l'information et des autres actifs associés |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(g) pratiques de base en matière de cyberhygiène et formation à la cybersécurité |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.loginwindow_com.apple.loginwindow` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_showfullname` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_loginwindowtext` | Alleen voor geautoriseerd gebruik. Activiteit op dit apparaat kan worden vastgelegd. / Authorized use only.… |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
