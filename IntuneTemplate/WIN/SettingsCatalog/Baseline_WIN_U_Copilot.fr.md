<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Copilot.md) · [English](Baseline_WIN_U_Copilot.en.md) · **Français**

# [Baseline] - WIN - U - Copilot

Détermine si Copilot dans Windows est disponible pour l'utilisateur.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| checkId | `INTUNE-BASE-097-UCopilot` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - U - Copilot |
| Fichier | [`Baseline_WIN_U_Copilot.json`](Baseline_WIN_U_Copilot.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_windowsai_removemicrosoftcopilotapp` | 1 |
| `user_vendor_msft_policy_config_windowsai_turnoffwindowscopilot` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
