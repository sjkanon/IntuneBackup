<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_AI_Permitted.md) · [English](Baseline_WIN_D_Windows_AI_Permitted.en.md) · **Français**

# [Baseline] - WIN - D - Windows AI Permitted

Autorise explicitement Recall et Click To Do, y compris la conservation des captures d'écran.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-148-DWindowsAIPermitted` |
| Source | Pendant de la variante Restricted ; les valeurs sont les valeurs par défaut de Windows, fixées explicitement |
| Fichier | [`Baseline_WIN_D_Windows_AI_Permitted.json`](Baseline_WIN_D_Windows_AI_Permitted.json) |

> **Alternative à [Baseline] - WIN - D - Windows AI Restricted.** Avant de la choisir, vérifiez que les conséquences sont bien comprises : Recall conserve sur le disque des captures d'écran consultables par recherche, et cet index est soumis aux mêmes durées de conservation et obligations de suppression que les données qu'il contient. Envisagez alors aussi les listes d'exclusion de Recall (setdenyapplistforrecall, setdenyurilistforrecall) et une durée de conservation — elles ne figurent volontairement pas dans cette policy car elles varient d'un client à l'autre.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.5.34 Protection de la vie privée et des DCP<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_windowsai_allowrecallenablement` | 1 |
| `device_vendor_msft_policy_config_windowsai_disableaidataanalysis` | 0 |
| `device_vendor_msft_policy_config_windowsai_disableclicktodo` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
