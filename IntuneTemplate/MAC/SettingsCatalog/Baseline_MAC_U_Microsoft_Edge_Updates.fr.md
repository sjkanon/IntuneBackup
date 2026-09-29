<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_U_Microsoft_Edge_Updates.md) · [English](Baseline_MAC_U_Microsoft_Edge_Updates.en.md) · **Français**

# [Baseline] - MAC - U - Microsoft Edge Updates

Comment et quand Edge se met à jour sur le Mac.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - U - Updates |
| Fichier | [`Baseline_MAC_U_Microsoft_Edge_Updates.json`](Baseline_MAC_U_Microsoft_Edge_Updates.json) |

> Complétée pour obtenir le même comportement que son équivalent Windows. relaunchnotification était déjà sur Required (sur macOS 1 = Required et 0 = Recommended, l'inverse de ce qu'on attendrait), mais sans période cette notification ne prend jamais fin. Désormais relaunchnotificationperiod est à 259200000 millisecondes, soit 3 jours et donc identique à Windows, et relaunchfastifoutdated à 7 jours. Le catalogue macOS ne connaît pas de fenêtre de redémarrage (com.apple.managedclient.preferences_relaunchwindow n'y existe pas), cette unique différence avec Windows subsiste donc.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management<br>9.1 Ensure Use of Only Fully Supported Browsers and Email Clients |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | Edge Updater |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.EdgeUpdater |
| `com.apple.managedclient.preferences_componentupdatesenabled` | true |
| `com.apple.managedclient.preferences_relaunchnotification` | 1 |
| `com.apple.managedclient.preferences_relaunchnotificationperiod` | 259200000 |
| `com.apple.managedclient.preferences_relaunchfastifoutdated` | 7 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
