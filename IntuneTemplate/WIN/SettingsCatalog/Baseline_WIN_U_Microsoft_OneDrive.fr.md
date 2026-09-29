<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_OneDrive.md) · [English](Baseline_WIN_U_Microsoft_OneDrive.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft OneDrive

Le volet utilisateur de OneDrive : quels écrans et notifications l'utilisateur voit.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft OneDrive - U - Configuration |
| Fichier | [`Baseline_WIN_U_Microsoft_OneDrive.json`](Baseline_WIN_U_Microsoft_OneDrive.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_enableholdthefile` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablefretutorial` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot_disablecustomrootlist` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot_disablecustomrootlist_key` | %OrganizationId% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot_disablecustomrootlist_value` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablepersonalsync` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv7~policy~onedrivengsc_enableautostart` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv6~policy~onedrivengsc_disablefreanimation` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
