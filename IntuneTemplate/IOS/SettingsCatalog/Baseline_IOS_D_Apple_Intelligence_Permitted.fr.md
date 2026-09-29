<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Apple_Intelligence_Permitted.md) · [English](Baseline_IOS_D_Apple_Intelligence_Permitted.en.md) · **Français**

# [Baseline] - IOS - D - Apple Intelligence Permitted

Autorise explicitement, sur les iPhone et iPad inscrits, les fonctionnalités génératives d'Apple Intelligence et l'intégration avec des services d'IA externes.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Contrepartie de [Baseline] - IOS - D - Apple Intelligence Restricted ; les mêmes clés déclaratives sur la valeur par défaut d'Apple, définies explicitement |
| Fichier | [`Baseline_IOS_D_Apple_Intelligence_Permitted.json`](Baseline_IOS_D_Apple_Intelligence_Permitted.json) |

> **Alternative à [Baseline] - IOS - D - Apple Intelligence Restricted.** Avant de choisir celle-ci, tenez compte du fait que l'intégration ChatGPT (externalintelligencesettings_enabled) envoie des données à un tiers externe ; qui veut uniquement autoriser les fonctions sur l'appareil définit externalintelligencesettings_enabled sur false dans cette policy. La restriction par espace de travail (allowedworkspaceids) n'y figure volontairement pas : elle requiert un ID de tenant ou d'espace de travail.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.8.12 Prévention de la fuite de données<br>A.5.34 Protection de la vie privée et des DCP |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 18

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `intelligencesettings_intelligencesettings` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowwritingtools` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowgenmoji` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimageplayground` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowimagewand` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowpersonalizedhandwritingresults` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_allowvisualintelligencesummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_mail_allowsmartreplies` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscription` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_notes_allowtranscriptionsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intelligencesettings_apps_safari_allowsummary` | true |
| `externalintelligencesettings_externalintelligencesettings` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`externalintelligencesettings_enabled` | true |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
