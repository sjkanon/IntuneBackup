<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Hello_for_Business_Disabled.md) · [English](Baseline_WIN_D_Windows_Hello_for_Business_Disabled.en.md) · **Français**

# [Baseline] - WIN - D - Windows Hello for Business Disabled

Désactive Windows Hello for Business sur les appareils partagés : pas de code PIN ni de biométrie par utilisateur et par appareil. Les utilisateurs se connectent avec une clé de sécurité FIDO2 ou via la connexion web.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — CSP PassportForWork, UsePassportForWork = false. Pour les appareils partagés, Microsoft recommande des clés de sécurité FIDO2 plutôt que Windows Hello for Business. |
| Fichier | [`Baseline_WIN_D_Windows_Hello_for_Business_Disabled.json`](Baseline_WIN_D_Windows_Hello_for_Business_Disabled.json) |

> Se place sur SEC-Shared-Devices, avec [Baseline] - WIN - D - Security Key Sign-in : sans cette seconde stratégie, les utilisateurs n'ont plus que la connexion web sur l'appareil. Pas à côté de [Baseline] - WIN - D - Windows Hello for Business Multi User ou de [Baseline] - WIN - D - Windows Hello for Business sur le même appareil : le même paramètre avec une autre valeur est un Conflit. Cette dernière est en phase 2 sur le groupe pilote ; ne mettez pas d'appareils partagés dans SEC-Baseline-Pilot, et excluez SEC-Shared-Devices dès qu'elle passe en phase 1. [Baseline] - WIN - U - Windows Hello for Business active WHfB par utilisateur ; laquelle des deux l'emporte quand un utilisateur avec cette stratégie se connecte sur un appareil partagé est à tester dans le pilote. [Baseline] - WIN - D - Passwordless définit le code PIN comme option de connexion par défaut ; sans WHfB, l'utilisateur choisit la première fois la clé ou la connexion web sous Options de connexion.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | false |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
