<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Software_Updates.md) · [English](Baseline_IOS_D_Software_Updates.en.md) · **Français**

# [Baseline] - IOS - D - Software Updates

Impose sur les iPhone et iPad inscrits la dernière version d'iOS au plus tard 14 jours après sa publication (installation à 02:00), force l'activation du téléchargement et de l'installation automatiques des mises à jour du système et de sécurité, et empêche l'utilisateur d'annuler les améliorations de sécurité.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | UniFy iOS/iPadOS Baseline v1.2 — SC - DEV - Software Update - Corporate Devices (CIS Apple iOS/iPadOS 26 Benchmark v1.0.0), comparé avec IntuneAdmin Apple iOS Benchmarks (Enforce Latest Software Update Version, Recommendation Cadence, Rapid Security Response) ; période de report volontairement omise |
| Fichier | [`Baseline_IOS_D_Software_Updates.json`](Baseline_IOS_D_Software_Updates.json) |

> Attention aux numéros d'option : pour les actions automatiques, `_0` correspond à Allowed (l'utilisateur choisit) et `_1` à AlwaysOn — ici `_1`, la même erreur que celle corrigée dans MAC - D - Software Updates. Pour enforce latest, `_0` est justement la seule option (True). Écarts par rapport à UniFy : pas de report (combinedperiodindays 14) — avec un report et une échéance de 14 jours, une mise à jour de sécurité n'apparaît que le jour où elle est imposée ; sans report, l'utilisateur peut l'installer immédiatement et le jour 14 sert de garde-fou. Inscription bêta non définie : la définition s'appelle 'Program Enrollment (Unsupported)'. Le retour arrière des Background Security Improvements est désactivé (UniFy, CIS), contrairement à MAC - D - Software Updates où il est activé. Version recommandée sur Newest, comme IntuneAdmin. Compliance Device Health reste le seuil d'accès avec osMinimumVersion ; cette policy veille à ce que les appareils restent nettement au-dessus.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques<br>A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02<br>ID.RA-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 14

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `ddm-latestsoftwareupdate_ddm-latestsoftwareupdate` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_enforcelatestsoftwareupdateversion` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_delayindays` | 14 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_installtime` | 02:00 |
| `softwareupdate_softwareupdate` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_download` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installosupdates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installsecurityupdate` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enable` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enablerollback` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_notifications` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_recommendedcadence` | 2 |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
