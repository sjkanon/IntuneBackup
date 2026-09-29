<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Login_and_Lock_Screen.md) · [English](Baseline_WIN_D_Login_and_Lock_Screen.en.md) · **Français**

# [Baseline] - WIN - D - Login and Lock Screen

Détermine ce qui est visible et possible sur l'écran de connexion et l'écran de verrouillage, comme le dernier utilisateur connecté et l'accès à la caméra.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-072-DLoginAndLockScreen` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Login and Lock Screen |
| Fichier | [`Baseline_WIN_D_Login_and_Lock_Screen.json`](Baseline_WIN_D_Login_and_Lock_Screen.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.7.7 Bureau propre et écran vide |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 8

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_abovelock_allowcortanaabovelock` | 0 |
| `device_vendor_msft_policy_config_abovelock_allowtoasts` | 0 |
| `device_vendor_msft_policy_config_devicelock_preventenablinglockscreencamera` | 1 |
| `device_vendor_msft_policy_config_devicelock_preventlockscreenslideshow` | 1 |
| `device_vendor_msft_policy_config_windowslogon_disablelockscreenappnotifications` | 1 |
| `device_vendor_msft_policy_config_credentialsui_disablepasswordreveal` | 1 |
| `device_vendor_msft_policy_config_authentication_allowaadpasswordreset` | 1 |
| `device_vendor_msft_policy_config_privacy_letappsactivatewithvoiceabovelock` | 2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
