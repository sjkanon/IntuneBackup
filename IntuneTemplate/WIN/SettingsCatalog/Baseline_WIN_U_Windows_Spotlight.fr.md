<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Windows_Spotlight.md) · [English](Baseline_WIN_U_Windows_Spotlight.en.md) · **Français**

# [Baseline] - WIN - U - Windows Spotlight

Désactive Windows Spotlight, les astuces et les suggestions orientées grand public, afin qu'aucune publicité ni application recommandée n'apparaisse sur un appareil professionnel.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - U - Windows Spotlight and Org Messages (partie utilisateur) |
| Fichier | [`Baseline_WIN_U_Windows_Spotlight.json`](Baseline_WIN_U_Windows_Spotlight.json) |

> La policy d'OIB est mixte (4 paramètres utilisateur et 1 paramètre appareil au niveau supérieur). Scindée parce qu'une policy mixte ne peut pas être affectée sans ambiguïté.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 11

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_experience_allowspotlightcollection` | 0 |
| `user_vendor_msft_policy_config_experience_allowwindowsspotlight` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowtailoredexperienceswithdiagnosticdata` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowthirdpartysuggestionsinwindowsspotlight` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_experience_allowwindowsconsumerfeatures` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowwindowsspotlightonactioncenter` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_allowwindowsspotlightwindowswelcomeexperience` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_experience_allowwindowstips` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_experience_configurewindowsspotlightonlockscreen` | 0 |
| `user_vendor_msft_policy_config_experience_allowwindowsspotlightonsettings` | 0 |
| `user_vendor_msft_policy_config_experience_enableorganizationalmessages` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
