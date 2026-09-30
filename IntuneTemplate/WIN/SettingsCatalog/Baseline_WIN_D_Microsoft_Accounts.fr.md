<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Accounts.md) · [English](Baseline_WIN_D_Microsoft_Accounts.en.md) · **Français**

# CXNM - Standard - WIN - D - Microsoft Accounts

Détermine si des comptes Microsoft personnels peuvent être utilisés et ajoutés sur un appareil professionnel.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Accounts - D - Configuration |
| Fichier | [`Baseline_WIN_D_Microsoft_Accounts.json`](Baseline_WIN_D_Microsoft_Accounts.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.5.16 Gestion des identités<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 5.6 Centralize Account Management |
| NIST CSF 2.0 | PR.AA-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_accounts_allowaddingnonmicrosoftaccountsmanually` | 0 |
| `device_vendor_msft_policy_config_accounts_allowmicrosoftaccountconnection` | 0 |
| `device_vendor_msft_policy_config_appruntime_allowmicrosoftaccountstobeoptional` | 1 |
| `device_vendor_msft_policy_config_admx_msapolicy_microsoftaccount_disableuserauth` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_accounts_blockmicrosoftaccounts` | 3 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
