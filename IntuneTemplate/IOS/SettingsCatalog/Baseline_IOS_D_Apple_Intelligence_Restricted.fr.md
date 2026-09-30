<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Apple_Intelligence_Restricted.md) · [English](Baseline_IOS_D_Apple_Intelligence_Restricted.en.md) · **Français**

# [Baseline] - IOS - D - Apple Intelligence Restricted

Désactive, sur les iPhone et iPad inscrits, les fonctionnalités génératives d'Apple Intelligence — Writing Tools, Genmoji, Image Playground, Image Wand, écriture manuscrite personnalisée, résumés dans Mail, Notes, Safari et Visual Intelligence — ainsi que l'intégration avec des services d'IA externes comme ChatGPT.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Configurations déclaratives com.apple.configuration.intelligence.settings et external-intelligence.settings dans le settings catalog iOS ; sélection issue d'UniFy iOS/iPadOS Baseline v1.2 — SC - Apple Intelligence & Siri - Corporate et d'IntuneAdmin — Disable Apple Intelligence, avec Writing Tools désactivé là où UniFy l'autorise. Les variantes com.apple.applicationaccess qu'utilise IntuneAdmin sont marquées Deprecated dans le catalogue |
| Fichier | [`Baseline_IOS_D_Apple_Intelligence_Restricted.json`](Baseline_IOS_D_Apple_Intelligence_Restricted.json) |

> **Alternative à [Baseline] - IOS - D - Apple Intelligence Permitted** — qui définit les mêmes clés sur true ; affecter les deux produit un Conflict, après quoi aucune des deux n'a d'effet. Siri lui-même reste activé ; seul Siri sur l'écran verrouillé est désactivé via Restrictions Corporate. Volontairement pas : allowappleintelligencereport=false (ce rapport assure justement la transparence sur ce qui a été envoyé à Private Cloud Compute) ni forceondeviceonlydictation/-translation (pas une fonction générative). Pour les appareils sans inscription, App Protection dispose des champs iOS 26 writingToolsConfigurationState et genmojiConfigurationState ; ils ne figurent volontairement pas dans la policy de phase 1, car il s'agit d'un choix de l'organisation et App Protection n'est qu'une seule policy pour tout le monde — voir RAPPORT.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.8.12 Prévention de la fuite de données<br>A.5.34 Protection de la vie privée et des DCP |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 18

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `intelligencesettings_intelligencesettings` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowwritingtools` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowgenmoji` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimageplayground` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimagewand` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowpersonalizedhandwritingresults` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowvisualintelligencesummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsmartreplies` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscription` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscriptionsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari_allowsummary` | false |
| `externalintelligencesettings_externalintelligencesettings` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`externalintelligencesettings_enabled` | false |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
