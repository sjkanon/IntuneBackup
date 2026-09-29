<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_AI_Features_Restricted.md) · [English](Baseline_WIN_D_Windows_AI_Features_Restricted.en.md) · **Français**

# [Baseline] - WIN - D - Windows AI Features Restricted

Désactive les fonctions d'IA générative dans Paint et dans les Paramètres Windows : Cocreator, Image Creator, Generative Fill et le Settings Agent.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | IntuneAdmin/IntuneBaselines — Windows 11 Benchmarks/Windows AI, mais avec la valeur inversée : cet ensemble active justement les fonctionnalités |
| Fichier | [`Baseline_WIN_D_Windows_AI_Features_Restricted.json`](Baseline_WIN_D_Windows_AI_Features_Restricted.json) |

> Cela ne concerne que les fonctionnalités d'IA de Windows et de Paint. Microsoft Copilot lui-même reste accessible. Recall et Click To Do sont déjà désactivés via [Baseline] - WIN - D - Windows AI Restricted. **Alternative à [Baseline] - WIN - D - Windows AI Features Permitted** — celle-ci définit les quatre mêmes paramètres sur la valeur opposée. Affecter les deux provoque un Conflict, et aucune des deux n'a alors d'effet.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.5.34 Protection de la vie privée et des DCP<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_windowsai_disablecocreator` | 1 |
| `device_vendor_msft_policy_config_windowsai_disableimagecreator` | 1 |
| `device_vendor_msft_policy_config_windowsai_disablegenerativefill` | 1 |
| `device_vendor_msft_policy_config_windowsai_disablesettingsagent` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
