<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Screensaver.md) · [English](Baseline_MAC_D_Screensaver.en.md) · **Français**

# [Baseline] - MAC - D - Screensaver

Exige le mot de passe au plus tard cinq secondes après le démarrage de l'économiseur d'écran, et démarre l'économiseur d'écran après quinze minutes d'inactivité — y compris dans la fenêtre de connexion.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-200-MACDScreensaver` |
| Source | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.11.1 et 2.11.2 (mSCP branch tahoe, cis_lvl1) ; forme issue d'OpenIntuneBaseline macOS v2.0 beta — SC - Device Security - D - Screensaver, avec askForPasswordDelay 5 au lieu de 60 |
| Fichier | [`Baseline_MAC_D_Screensaver.json`](Baseline_MAC_D_Screensaver.json) |

> Écart délibéré par rapport à OpenIntuneBaseline v2.0 beta : celle-ci fixe askForPasswordDelay à 60 secondes, cette policy à 5, la valeur CIS. Soixante secondes signifie que quelqu'un qui s'éloigne au moment où l'économiseur d'écran démarre laisse un Mac ouvert pendant une minute ; avec Touch ID, déverrouiller immédiatement ne coûte presque rien à l'utilisateur. Le moduleName d'OIB (Flurry) est omis : cosmétique. Lien avec [Baseline] - MAC - D - Passcode and Screen Lock : maxInactivity y est fixé à 15 minutes (com.apple.mobiledevice.passwordpolicy), ce que macOS traduit en un maximum pour l'économiseur d'écran. Ici, idleTime (com.apple.screensaver.user) et loginWindowIdleTime (com.apple.screensaver) sont fixés à 900 secondes : les mêmes 15 minutes, des settingDefinitionId différents, donc pas de conflit Intune ni de valeur contradictoire. maxGracePeriod n'est pas défini dans cette policy ; askForPasswordDelay est donc ici le seul délai de grâce. com.apple.screensaver.user est un payload à part entière dans le settings catalog ; microsoft/intune-my-macs (pol-sec-005) le fournit sous la même forme au niveau de l'appareil. Vérifiez lors du pilote avec `sudo profiles show -type configuration` que idleTime arrive bien ; s'il n'arrive pas, maxInactivity couvre déjà les 15 minutes.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.7 Bureau propre et écran vide<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.screensaver_com.apple.screensaver` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver_askforpassword` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver_askforpassworddelay` | 5 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver_loginwindowidletime` | 900 |
| `com.apple.screensaver.user_com.apple.screensaver.user` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver.user_idletime` | 900 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
