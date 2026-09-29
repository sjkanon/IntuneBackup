<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Microsoft_AutoUpdate.md) · [English](Baseline_MAC_D_Microsoft_AutoUpdate.en.md) · **Français**

# [Baseline] - MAC - D - Microsoft AutoUpdate

Comment et quand Office, Edge et les autres applications Microsoft sur le Mac se mettent à jour.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft AutoUpdate - D - MAU Configuration |
| Fichier | [`Baseline_MAC_D_Microsoft_AutoUpdate.json`](Baseline_MAC_D_Microsoft_AutoUpdate.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 16

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | MAU |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.autoupdate2 |
| `com.apple.managedclient.preferences_acknowledgeddatacollectionpolicy` | 0 |
| `com.apple.managedclient.preferences_updatedeadline.daysbeforeforcedquit` | 14 |
| `com.apple.managedclient.preferences_manifestserver` | 0 |
| `com.apple.managedclient.preferences_disableinsidercheckbox` | true |
| `com.apple.managedclient.preferences_howtocheck` | 0 |
| `com.apple.managedclient.preferences_enablecheckforupdatesbutton` | true |
| `com.apple.managedclient.preferences_guardagainstappmodification` | false |
| `com.apple.managedclient.preferences_startdaemononapplaunch` | true |
| `com.apple.managedclient.preferences_updatecache` | https://officecdn.microsoft.com/pr/C1297A47-86C4-4C1F-97FA-950631F94777/OfficeMac/ |
| `com.apple.managedclient.preferences_channelname` | 0 |
| `com.apple.managedclient.preferences_updateroptimization` | 0 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
