<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Administrator_Protection.md) · [English](Baseline_WIN_D_Administrator_Protection.en.md) · **Français**

# CXNM - Standard - WIN - D - Administrator Protection

Fait travailler les administrateurs sans droits élevés par défaut et leur fait demander l'autorisation pour chaque action. Windows 11 24H2 et versions ultérieures.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Administrator Protection |
| Fichier | [`Baseline_WIN_D_Administrator_Protection.json`](Baseline_WIN_D_Administrator_Protection.json) |

> Windows 11 24H2 et ultérieur ; sur les builds plus anciens, le paramètre n'a aucun effet.

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
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_typeofadminapprovalmode` | 2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
