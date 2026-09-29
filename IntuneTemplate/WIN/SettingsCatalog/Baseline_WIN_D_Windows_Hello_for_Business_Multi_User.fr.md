<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md) · [English](Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.en.md) · **Français**

# [Baseline] - WIN - D - Windows Hello for Business Multi User

Windows Hello for Business pour les appareils partagés sur lesquels plusieurs utilisateurs se connectent. Mêmes exigences que la policy appareil ordinaire, mais sans configuration immédiatement après la connexion : sur un appareil partagé, chaque utilisateur serait sinon guidé dans la configuration du PIN à sa première connexion.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-113-DWindowsHelloForBusinessMultiUser` |
| Source | OpenIntuneBaseline Windows v3.8 — ES - Windows Hello for Business - D - WHfB Configuration, complétée par DisablePostLogonProvisioning |
| Fichier | [`Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.json`](Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.json) |

> Volontairement sans affectation : elle doit être affectée à un groupe d'appareils partagés. Il ne s'agit pas d'un template Endpoint Security mais d'une policy Settings Catalog ordinaire, car DisablePostLogonProvisioning ne figure pas dans le template Account Protection. Les quatre paramètres qui se recoupent ont la même valeur que dans la policy d'appareil ; côte à côte sur le même appareil, ils ne provoquent donc pas de conflit — cette policy ajoute uniquement DisablePostLogonProvisioning.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_requiresecuritydevice` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_minimumpinlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_enablepinrecovery` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_disablepostlogonprovisioning` | true |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
