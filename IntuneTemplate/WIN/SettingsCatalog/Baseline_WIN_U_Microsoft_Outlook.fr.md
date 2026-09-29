<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Microsoft_Outlook.md) · [English](Baseline_WIN_U_Microsoft_Outlook.en.md) · **Français**

# [Baseline] - WIN - U - Microsoft Outlook

Configure automatiquement le profil Exchange Online de l'utilisateur, afin qu'Outlook fonctionne sans ajouter manuellement de compte.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| checkId | `INTUNE-BASE-010-AutomaticConfigurationOfOutlook` |
| Source | baseline propre |
| Fichier | [`Baseline_WIN_U_Microsoft_Outlook.json`](Baseline_WIN_U_Microsoft_Outlook.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings_l_automaticallyconfigureprofilebasedonactiveonce` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
