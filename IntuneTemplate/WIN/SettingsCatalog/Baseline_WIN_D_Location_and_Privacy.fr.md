<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Location_and_Privacy.md) · [English](Baseline_WIN_D_Location_and_Privacy.en.md) · **Français**

# [Baseline] - WIN - D - Location and Privacy

Détermine quelles données sensibles pour la vie privée les applications peuvent demander, comme la localisation et la voix.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-022-Privacy` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Location and Privacy |
| Fichier | [`Baseline_WIN_D_Location_and_Privacy.json`](Baseline_WIN_D_Location_and_Privacy.json) |

> Le seul paramètre propre (letappsactivatewithvoiceabovelock) se trouve chez OIB dans Login and Lock Screen et n'est donc pas perdu.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.34 Protection de la vie privée et des DCP |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_privacy_letappsaccesslocation` | 0 |
| `device_vendor_msft_policy_config_privacy_letappsaccesslocation_forceallowtheseapps` | windows.immersivecontrolpanel_cw5n1h2txyewy, Microsoft.OutlookForWindows_8wekyb3d8bbwe |
| `device_vendor_msft_policy_config_system_allowlocation` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
