<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Administrator_Protection.md) · [English](Baseline_WIN_D_Administrator_Protection.en.md) · **Français**

# [Baseline] - WIN - D - Administrator Protection

Maintient l'UAC sur le mode d'approbation administrateur classique, afin qu'Administrator Protection ne casse pas le compte LAPS, et fixe le comportement de l'invite dès qu'Administrator Protection pourra être réactivé. Windows 11 24H2 et versions ultérieures.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0.1 — SC - Device Security - D - Administrator Protection |
| Fichier | [`Baseline_WIN_D_Administrator_Protection.json`](Baseline_WIN_D_Administrator_Protection.json) |

> Depuis novembre 2026 (OIB v4.0.1, issue #264), Type of Admin Approval Mode est sur 1 (Legacy) au lieu de 2 (Administrator protection). Depuis la mise à jour de sécurité d'octobre 2026, Administrator Protection est réellement actif, ce qui pose des problèmes avec LAPS — Microsoft le mentionne lui-même sous Troubleshooting sur Learn. Cette baseline gère le compte administrateur local avec LAPS (wlapsadmin), donc LAPS l'emporte. Revenir à 2 dès que Microsoft résout le problème LAPS ; suivre OIB #264. Windows 11 24H2 et versions ultérieures ; sur les builds plus anciens, le paramètre n'a aucun effet.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Droits d'accès privilégiés |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts |
| NIST CSF 2.0 | PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_behavioroftheelevationpromptforadministratorprotection` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_typeofadminapprovalmode` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
