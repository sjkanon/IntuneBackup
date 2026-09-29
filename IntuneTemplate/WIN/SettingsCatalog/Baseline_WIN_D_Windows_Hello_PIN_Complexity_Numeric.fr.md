<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.md) · [English](Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.en.md) · **Français**

# [Baseline] - WIN - D - Windows Hello PIN Complexity Numeric

Fixe explicitement le PIN Windows Hello numérique : chiffres exigés, lettres et caractères spéciaux bloqués.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Choix propre, PassportForWork CSP — Policies/PINComplexity |
| Fichier | [`Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.json`](Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.json) |

> C'est aussi le comportement de Windows sans policy. Le fixer explicitement le rend vérifiable — 'non configuré' et 'défini sur la valeur par défaut' apparaissent de la même façon dans un export du tenant — et il résiste à un changement de valeur par défaut de la part de Microsoft.

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
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_lowercaseletters` | 2 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_uppercaseletters` | 2 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_specialcharacters` | 2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
