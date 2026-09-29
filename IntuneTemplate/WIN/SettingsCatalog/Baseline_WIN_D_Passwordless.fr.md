<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Passwordless.md) · [English](Baseline_WIN_D_Passwordless.en.md) · **Français**

# [Baseline] - WIN - D - Passwordless

Masque le champ du mot de passe à la connexion, afin que les utilisateurs utilisent Windows Hello ou une clé de sécurité au lieu de saisir leur mot de passe.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Credential Management - D - Passwordless |
| Fichier | [`Baseline_WIN_D_Passwordless.json`](Baseline_WIN_D_Passwordless.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_credentialproviders_defaultcredentialprovider` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_credentialproviders_defaultcredentialprovider_defaultcredentialprovider_message` | {D6886603-9D2F-4EB2-B667-1971041FA96B} |
| `device_vendor_msft_policy_config_authentication_enablepasswordlessexperience` | 1 |
| `device_vendor_msft_policy_config_authentication_enablewebsignin` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
