<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_AI_Features_Permitted.md) · [English](Baseline_WIN_D_Windows_AI_Features_Permitted.en.md) · **Français**

# [Baseline] - WIN - D - Windows AI Features Permitted

Autorise explicitement les fonctions d'IA générative dans Paint et dans les Paramètres Windows : Cocreator, Image Creator, Generative Fill et le Settings Agent.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | IntuneAdmin/IntuneBaselines — Windows 11 Benchmarks/Windows AI, valeurs reprises sans modification |
| Fichier | [`Baseline_WIN_D_Windows_AI_Features_Permitted.json`](Baseline_WIN_D_Windows_AI_Features_Permitted.json) |

> **Alternative à [Baseline] - WIN - D - Windows AI Features Restricted.** Celle-ci définit les quatre mêmes paramètres sur la valeur opposée ; affecter les deux provoque un Conflict, après quoi Intune n'en applique aucune. Notez que cela ne concerne que les quatre fonctionnalités de Paint et des Paramètres : Recall et Click To Do sont désactivés séparément via [Baseline] - WIN - D - Windows AI Restricted, et la liste de blocage Edge via [Baseline] - WIN - U - AI Usage Control Restricted. Qui veut autoriser l'IA de manière large doit aussi réexaminer ces deux-là.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.5.34 Protection de la vie privée et des DCP<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_windowsai_disablecocreator` | 0 |
| `device_vendor_msft_policy_config_windowsai_disableimagecreator` | 0 |
| `device_vendor_msft_policy_config_windowsai_disablegenerativefill` | 0 |
| `device_vendor_msft_policy_config_windowsai_disablesettingsagent` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
