<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Windows_Hello_for_Business.md) · [English](Baseline_WIN_U_Windows_Hello_for_Business.en.md) · **Français**

# CXNM - Standard - WIN - U - Windows Hello for Business

Windows Hello for Business par utilisateur plutôt que par appareil : les mêmes exigences que la policy appareil — TPM obligatoire, PIN d'au moins six caractères, récupération du PIN activée — mais liées à l'utilisateur. Destinée aux utilisateurs ayant leur propre appareil ; les appareils partagés doivent en être exclus par un filtre d'appareils.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v3.8 — ES - Windows Hello for Business - D - WHfB Configuration, convertie en portée utilisateur |
| Fichier | [`Baseline_WIN_U_Windows_Hello_for_Business.json`](Baseline_WIN_U_Windows_Hello_for_Business.json) |

> La portée utilisateur du CSP PassportForWork prend en charge quatre des cinq paramètres de la policy d'appareil ; UseCertificateForOnPremAuth et les paramètres biométriques n'existent qu'en portée appareil et y restent donc. Appliquez-lui un filtre d'appareils qui exclut les appareils partagés (Set-BaselineAssignment.ps1 -FilterId), sinon elle s'y applique aussi.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du [dépôt CA-Policies](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/) s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| [2055 - GRANT - Phishing Resistant MFA for Admins](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2055__GRANT__Phishing_Resistant_MFA_for_Admins.fr.md) | disabled | Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité. |
| [2120 - GRANT - Phishing Resistant MFA for All Users](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.fr.md) | enabled | Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité. |
| [2125 - GRANT - Phishing Resistant MFA for Rollout Groups](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.fr.md) | enabled | Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité. |

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_passportforwork_{tenantid}` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_requiresecuritydevice` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_minimumpinlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_enablepinrecovery` | true |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
