<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_Devices_Passwordless.md) · [English](Baseline_WIN_D_Shared_Devices_Passwordless.en.md) · **Français**

# [Baseline] - WIN - D - Shared Devices Passwordless

Masque le champ du mot de passe sur l'écran de connexion des appareils partagés et active la connexion web, afin que les utilisateurs se connectent avec une clé FIDO2, ou avec un Temporary Access Pass tant qu'ils n'en ont pas.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — EnablePasswordlessExperience et EnableWebSignIn de [Baseline] - WIN - D - Passwordless (OpenIntuneBaseline Windows v4.0), sans la vignette de connexion par défaut. |
| Fichier | [`Baseline_WIN_D_Shared_Devices_Passwordless.json`](Baseline_WIN_D_Shared_Devices_Passwordless.json) |

> À affecter à SG-D-UEM-WIN-Shared, avec [Baseline] - WIN - D - Windows Hello for Business Disabled et [Baseline] - WIN - D - Security Key Sign-in. [Baseline] - WIN - D - Passwordless place en plus la vignette par défaut sur le code PIN de Windows Hello ; elle n'a pas sa place sur un appareil sans Windows Hello, c'est pourquoi elle n'est pas incluse ici. Ces deux paramètres ont la même valeur que dans cette stratégie, donc les deux sur un même appareil ne produisent pas de Conflit. Qui n'a pas encore de clé se connecte via le web avec un Temporary Access Pass du service desk : activez la méthode TAP dans Entra avant que cette stratégie arrive.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_authentication_enablepasswordlessexperience` | 1 |
| `device_vendor_msft_policy_config_authentication_enablewebsignin` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
