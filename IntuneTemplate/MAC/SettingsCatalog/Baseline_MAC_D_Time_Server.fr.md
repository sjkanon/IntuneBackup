<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Time_Server.md) · [English](Baseline_MAC_D_Time_Server.en.md) · **Français**

# [Baseline] - MAC - D - Time Server

Fait synchroniser l'horloge du Mac avec time.apple.com, afin que les horodatages des journaux, les tickets Kerberos et les vérifications de certificats soient corrects.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.3.2.1 (mSCP branche tahoe, ODV time.apple.com) ; forme reprise de microsoft/intune-my-macs pol-sys-100-ntp |
| Fichier | [`Baseline_MAC_D_Time_Server.json`](Baseline_MAC_D_Time_Server.json) |

> La seconde partie de CIS 2.3.2.1, imposer « régler l'heure automatiquement » (com.apple.timed TMAutomaticTimeOnlyEnabled), ne figure pas dans le settings catalog ; la valeur par défaut de macOS est déjà activée. Le fuseau horaire (com.apple.mcx timeZone) n'est volontairement pas défini : une organisation avec des personnes dans plusieurs fuseaux horaires afficherait alors une heure erronée. Phase 1 : doit recevoir une règle dans _assignments.json (allDevicesAssignmentTarget), comme les autres policies MAC - D de la phase 1.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.17 Synchronisation des horloges<br>A.8.15 Journalisation |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 8.4 Standardize Time Synchronization |
| NIST CSF 2.0 | PR.PS-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.mcx_com.apple.mcx-timeserver` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx_timeserver` | time.apple.com |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
