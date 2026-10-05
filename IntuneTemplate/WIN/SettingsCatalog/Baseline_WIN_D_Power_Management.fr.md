<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Power_Management.md) · [English](Baseline_WIN_D_Power_Management.en.md) · **Français**

# [Baseline] - WIN - D - Power Management

Fait en sorte que la fermeture du capot et le bouton d'alimentation mettent l'appareil en veille, afin que l'exigence existante de demander un mot de passe au réveil aboutisse réellement à un écran verrouillé.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | IntuneAdmin/IntuneBaselines — Modern Workplace, Baseline - Windows Power Settings ; valeurs vérifiées par rapport aux définitions du settings catalog (1 = Sleep) |
| Fichier | [`Baseline_WIN_D_Power_Management.json`](Baseline_WIN_D_Power_Management.json) |

> Mise en veille et non arrêt : l'arrêt fait perdre du travail aux utilisateurs et génère des plaintes, et avec le mot de passe au réveil, la veille est tout aussi verrouillée. Le seuil d'économiseur d'énergie de 30 pour cent est repris de la source et n'est pas un paramètre de sécurité.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.7 Bureau propre et écran vide<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_power_selectlidcloseactiononbattery` | 1 |
| `device_vendor_msft_policy_config_power_selectlidcloseactionpluggedin` | 1 |
| `device_vendor_msft_policy_config_power_selectpowerbuttonactiononbattery` | 1 |
| `device_vendor_msft_policy_config_power_selectpowerbuttonactionpluggedin` | 1 |
| `device_vendor_msft_policy_config_power_allowhibernate` | 1 |
| `device_vendor_msft_policy_config_power_energysaverbatterythresholdonbattery` | 30 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
