<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Hello_for_Business.md) · [English](Baseline_WIN_D_Windows_Hello_for_Business.en.md) · **Français**

# [Baseline] - WIN - D - Windows Hello for Business

Permet aux utilisateurs de se connecter avec un PIN ou la biométrie au lieu d'un mot de passe. Exige un TPM, un PIN d'au moins six caractères et l'anti-usurpation pour la reconnaissance faciale.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Windows Hello for Business - D - WHfB Configuration |
| Fichier | [`Baseline_WIN_D_Windows_Hello_for_Business.json`](Baseline_WIN_D_Windows_Hello_for_Business.json) |

> Manquait entièrement. Exige un TPM, un code PIN d'au moins 6 caractères et l'anti-usurpation pour la reconnaissance faciale. S'applique à chaque utilisateur de l'appareil ; pour les appareils partagés, une variante distincte existe à côté (Baseline_WIN_D_Windows_Hello_for_Business_Multi_User).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Conditional Access

Ces stratégies Conditional Access du dépôt CA-Policies s'appuient sur cette policy. Avant de la modifier ou de la supprimer, vérifiez l'effet là-bas.

| Stratégie CA | State | Ce que cette policy fait pour elle |
|---|---|---|
| 2055 - GRANT - Phishing Resistant MFA for Admins | disabled | Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité. |
| 2120 - GRANT - Phishing Resistant MFA for All Users | enabled | Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité. |
| 2125 - GRANT - Phishing Resistant MFA for Rollout Groups | enabled | Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité. |
| 2155 - GRANT - Virtual Desktop Phishing Resistant MFA | report-only | Configure Windows Hello for Business : sous Windows, la manière habituelle de satisfaire à une MFA résistante au phishing. Sans WHfB, il ne reste qu'une passkey séparée ou une clé de sécurité. |

## Paramètres — 7

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_requiresecuritydevice` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_minimumpinlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usecertificateforonpremauth` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_enablepinrecovery` | true |
| `device_vendor_msft_passportforwork_biometrics_facialfeaturesuseenhancedantispoofing` | true |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
