<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Lock_Screen.md) · [English](Baseline_IOS_D_Lock_Screen.en.md) · **Français**

# [Baseline] - IOS - D - Lock Screen

Affiche sur l'écran verrouillé d'un iPhone ou iPad d'entreprise un texte destiné à la personne qui le trouve, afin qu'un appareil perdu puisse être rendu à l'organisation.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-189-IOSDLockScreen` |
| Source | Payload Apple Shared Device Configuration (com.apple.shareddeviceconfiguration) dans le settings catalog iOS ; UniFy iOS/iPadOS Baseline v1.2 — SC - Lock Screen - Corporate et IntuneAdmin — Lock Screen Message. Les restrictions de l'écran verrouillé de la même policy UniFy figurent dans [Baseline] - IOS - D - Restrictions Corporate |
| Fichier | [`Baseline_IOS_D_Lock_Screen.json`](Baseline_IOS_D_Lock_Screen.json) |

> **Renseignez VERLOREN-TOESTEL-TEKST-INVULLEN** avant l'affectation, par exemple 'Trouvé ? Appelez le service desk : <numéro>' — pas de nom de personne, c'est une information utile à un voleur. Le dépôt ne dispose d'aucun jeton CIPP pour le nom de l'organisation ou le numéro de téléphone (%OrganizationId% est un GUID), d'où le texte à remplacer. Étiquette d'inventaire (assettaginformation) volontairement non définie : UniFy y utilise {{DEVICENAME}}, et je n'ai pas pu vérifier si Intune remplace ce jeton dans ce payload.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Sécurité des actifs hors des locaux<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.shareddeviceconfiguration_com.apple.shareddeviceconfiguration` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.shareddeviceconfiguration_lockscreenfootnote` | VERLOREN-TOESTEL-TEKST-INVULLEN |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
