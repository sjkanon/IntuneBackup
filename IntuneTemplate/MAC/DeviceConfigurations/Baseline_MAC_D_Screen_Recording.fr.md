<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Screen_Recording.md) · [English](Baseline_MAC_D_Screen_Recording.en.md) · **Français**

# CXNM - Standard - MAC - D - Screen Recording

Uniquement pour les organisations qui utilisent NinjaOne ou TeamViewer. Définit l'enregistrement de l'écran pour NinjaOne Remote et TeamViewer sur AllowStandardUserToSetSystemService : un utilisateur sans droits d'administrateur peut cocher la case lui-même, sans mot de passe administrateur. L'activation reste un clic manuel — macOS ne permet pas à un MDM d'accorder l'enregistrement de l'écran.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | baseline propre — Apple n'autorise pas l'enregistrement d'écran dans la forme settings catalog de PPPC |
| Fichier | [`Baseline_MAC_D_Screen_Recording.json`](Baseline_MAC_D_Screen_Recording.json) |

> Apple ne permet pas d'accorder l'enregistrement d'écran avec "Allow" — un MDM peut seulement le refuser ou, comme ici, laisser l'utilisateur l'activer lui-même sans mot de passe administrateur. Le premier clic reste donc manuel, tout comme la reconfirmation périodique sur les versions récentes de macOS. Un profil personnalisé et non le settings catalog, parce que le mobileconfig porte la valeur littérale du schéma d'Apple plutôt qu'un enum Intune qui peut se décaler à chaque mise à jour des définitions. Les mêmes cinq bundles et les mêmes code requirements que les entrées Accessibilité de CXNM - Standard - MAC - D - Privacy Preferences ; ces deux profils ne se touchent pas car ils définissent des services TCC différents.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.18 Utilisation de programmes utilitaires à privilèges |
| NIST CSF 2.0 | PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 4

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `deploymentChannel` | deviceChannel |
| `payloadName` | Screen Recording |
| `payloadFileName` | baseline-mac-screen-recording.mobileconfig |
| `payload` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHBsaXN0IFBVQkxJQyAiLS8vQXBwbGUvL0RURCBQTEl… |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
