<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.md) · [English](Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.en.md) · **Français**

# [Baseline] - MAC - U - Microsoft Edge Profiles and Sync

Détermine avec quel compte les utilisateurs se connectent à Edge et ce qui est synchronisé.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| checkId | `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync` |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - U - Profiles, Sign-In and Sync |
| Fichier | [`Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.json`](Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.managedclient.preferences_browsersignin` | 2 |
| `com.apple.managedclient.preferences_browseraddprofileenabled` | false |
| `com.apple.managedclient.preferences_forceephemeralprofiles` | false |
| `com.apple.managedclient.preferences_forcesync` | true |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
