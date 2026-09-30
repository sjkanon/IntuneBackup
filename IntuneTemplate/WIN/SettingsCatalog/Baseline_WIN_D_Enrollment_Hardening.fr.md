<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Enrollment_Hardening.md) · [English](Baseline_WIN_D_Enrollment_Hardening.en.md) · **Français**

# [Baseline] - WIN - D - Enrollment Hardening

Exige une connexion réseau lors de la première installation, afin qu'un appareil ne puisse pas contourner l'inscription et échapper à la gestion.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | IntuneAdmin/IntuneBaselines — Modern Workplace Expert, Baseline - Require Network In OOBE (CSP TenantLockdown) |
| Fichier | [`Baseline_WIN_D_Enrollment_Hardening.json`](Baseline_WIN_D_Enrollment_Hardening.json) |

> Fonctionne via le CSP TenantLockdown et s'applique à partir de la prochaine installation propre. Veillez à ce qu'une connexion filaire ou Wi-Fi soit disponible pendant l'OOBE — avec une flotte sans Ethernet et sans profil Wi-Fi préconfiguré, l'utilisateur reste bloqué.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.9 Inventaire des informations et autres actifs associés<br>A.5.15 Contrôle d'accès<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 1.1 Establish and Maintain Detailed Enterprise Asset Inventory |
| NIST CSF 2.0 | ID.AM-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `vendor_msft_tenantlockdown_requirenetworkinoobe` | true |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
