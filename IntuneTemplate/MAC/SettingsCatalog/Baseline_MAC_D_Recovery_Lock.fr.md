<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Recovery_Lock.md) · [English](Baseline_MAC_D_Recovery_Lock.en.md) · **Français**

# [Baseline] - MAC - D - Recovery Lock

Sur les Mac équipés d'Apple silicon, définit un mot de passe aléatoire géré par Intune pour recoveryOS et les options de démarrage, et le remplace tous les six mois.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Microsoft Learn — Configure Recovery Lock using the settings catalog (juin 2026) ; forme issue de microsoft/intune-my-macs pol-sec-007-recovery-lock (rotation mensuelle là-bas, six mois ici) |
| Fichier | [`Baseline_MAC_D_Recovery_Lock.json`](Baseline_MAC_D_Recovery_Lock.json) |

> Rotation tous les 6 mois (option _5), identique à la rotation de la clé de récupération FileVault dans [Baseline] - MAC - D - FileVault ; intune-my-macs effectue une rotation mensuelle, ce qui génère surtout des appels au service desk sans réduire le risque — le mot de passe n'est utilisé que par celui qui le demande. Consulter le mot de passe : Devices → appareil → Passwords and keys → Recovery Lock Password. Cela requiert les droits Intune 'Remote tasks/View macOS recovery lock password' (et pour la rotation 'Rotate macOS recovery lock password') ; limitez qui les détient, de préférence via PIM. Après utilisation : action sur l'appareil 'Rotate recovery lock passcode'. La désinscription d'Intune efface le mot de passe du Mac ; retirer l'affectation fait qu'Intune tente de l'effacer. Un Mac qui quitte l'organisation doit donc d'abord être désinscrit, puis libéré dans Apple Business (voir extras/macos/apple-business).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.7.9 Sécurité des actifs hors des locaux<br>A.8.18 Utilisation de programmes utilitaires à privilèges<br>A.5.17 Informations d'authentification |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-05<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `setrecoverylock_setrecoverylock` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`setrecoverylock_enablerecoverylockpassword` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`setrecoverylock_recoverylockpasswordrotationschedule` | 5 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
