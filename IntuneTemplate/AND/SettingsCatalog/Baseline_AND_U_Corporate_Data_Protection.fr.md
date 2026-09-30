<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Corporate_Data_Protection.md) · [English](Baseline_AND_U_Corporate_Data_Protection.en.md) · **Français**

# [Baseline] - AND - U - Corporate Data Protection

Bloque, sur les appareils Android fully managed et corporate-owned, les captures d'écran, le partage de fichiers via Bluetooth et la réinitialisation aux paramètres d'usine par l'utilisateur.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - SC - DR - DEV - General-Settings et Connectivity (Fully-Managed et Corp-Work-Profile) - v1.5 |
| Fichier | [`Baseline_AND_U_Corporate_Data_Protection.json`](Baseline_AND_U_Corporate_Data_Protection.json) |

> Les casques Bluetooth, voitures et objets connectés continuent de fonctionner : `bluetoothblocksharing` bloque uniquement le partage de fichiers, pas l'appairage. Qui a besoin de captures d'écran à des fins d'assistance (par ex. un helpdesk qui demande des captures d'écran) n'affecte pas cette policy ou crée un groupe d'exception. Une réinitialisation aux paramètres d'usine via le mode de récupération reste techniquement possible ; ensuite, Factory Reset Protection avec le compte administrateur n'empêche les abus que si `factoryResetDeviceAdministratorEmails` est renseigné — ce paramètre est propre au tenant et ne figure donc pas dans cette policy. Le blocage des fonctions d'assistant et d'IA est traité séparément dans Corporate AI Restricted.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Sécurité des actifs hors des locaux<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 3.13 Deploy a Data Loss Prevention Solution<br>4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.DS-01<br>PR.DS-10<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.android.devicerestrictionpolicy.screencaptureblocked` | true |
| `com.android.devicerestrictionpolicy.bluetoothblocksharing` | disallowed |
| `com.android.devicerestrictionpolicy.factoryresetblocked` | true |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
