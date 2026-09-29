<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Microsoft_Edge_Password_Management.md) · [English](Baseline_MAC_D_Microsoft_Edge_Password_Management.en.md) · **Français**

# [Baseline] - MAC - D - Microsoft Edge Password Management

Détermine si Edge sur le Mac peut enregistrer et afficher des mots de passe.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement` |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - D - Password Management |
| Fichier | [`Baseline_MAC_D_Microsoft_Edge_Password_Management.json`](Baseline_MAC_D_Microsoft_Edge_Password_Management.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.managedclient.preferences_passwordmonitorallowed` | true |
| `com.apple.managedclient.preferences_passwordprotectionwarningtrigger` | 1 |
| `com.apple.managedclient.preferences_passwordmanagerenabled` | true |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
