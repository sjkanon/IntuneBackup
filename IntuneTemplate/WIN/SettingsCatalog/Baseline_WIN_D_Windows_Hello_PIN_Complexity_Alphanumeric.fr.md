<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.md) · [English](Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.en.md) · **Français**

# [Baseline] - WIN - D - Windows Hello PIN Complexity Alphanumeric

Exige un PIN Windows Hello alphanumérique : au moins un chiffre, une minuscule, une majuscule et un caractère spécial.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-210-DWindowsHelloPINComplexityAlphanumeric` |
| Source | Choix propre, PassportForWork CSP — Policies/PINComplexity |
| Fichier | [`Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.json`](Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.json) |

> Ne définit volontairement aucune longueur minimale : elle est déjà fixée à 6 dans WIN - D - Windows Hello for Business. Deux policies affectées qui définissent le même paramètre sur une valeur différente provoquent un Conflict dans Intune, après quoi aucune n'est appliquée ; check-scope.js y veille.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| CIS Controls v8.1 | 5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_digits` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_lowercaseletters` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_uppercaseletters` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_specialcharacters` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
