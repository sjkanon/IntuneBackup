<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Corporate_AI_Restricted.md) · [English](Baseline_AND_U_Corporate_AI_Restricted.en.md) · **Français**

# [Baseline] - AND - U - Corporate AI Restricted

Empêche, sur les appareils Android fully managed et corporate-owned, que le contenu de l'écran soit transmis à une application d'assistant (comme Gemini ou Circle to Search) et que des applications proposent des fonctions à des agents d'IA.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-179-ANDUCorporateAIRestricted` |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - SC - DR - DEV - General-Settings (assistcontentpolicy) et Applications (appfunctions), Fully-Managed et Corp-Work-Profile - v1.5 |
| Fichier | [`Baseline_AND_U_Corporate_AI_Restricted.json`](Baseline_AND_U_Corporate_AI_Restricted.json) |

> **Volontairement aucune contrepartie Permitted** comme pour Windows AI : pour `assistcontentpolicy`, `_false` signifie « Intune ne change rien » et non « explicitement autorisé », donc une variante Permitted n'enregistrerait aucune décision. Qui autorise les assistants n'affecte tout simplement pas cette policy. Microsoft 365 Copilot dans les applications Microsoft n'est pas concerné ici ; il relève d'App Protection. Sur les appareils antérieurs à Android 16, `appfunctions` n'a aucun effet.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.5.34 Protection de la vie privée et des DCP<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| CIS Controls v8.1 | 3.13 Deploy a Data Loss Prevention Solution |
| NIST CSF 2.0 | PR.DS-10 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.android.devicerestrictionpolicy.assistcontentpolicy` | true |
| `com.android.devicerestrictionpolicy.appfunctions` | true |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
