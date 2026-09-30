<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.md) · [English](Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.en.md) · **Français**

# CXNM - Standard - WIN - D - Windows Hello Cloud Kerberos Trust

Permet à Windows Hello de fonctionner avec un Active Directory on-prem sans certificats, via un ticket Kerberos émis par Entra ID.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Windows Hello for Business - D - Cloud Kerberos Trust |
| Fichier | [`Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.json`](Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_kerberos_cloudkerberosticketretrievalenabled` | 1 |
| `device_vendor_msft_passportforwork_{tenantid}` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usecloudtrustforonpremauth` | true |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
