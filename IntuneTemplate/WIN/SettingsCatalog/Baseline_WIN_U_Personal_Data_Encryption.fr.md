<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Personal_Data_Encryption.md) · [English](Baseline_WIN_U_Personal_Data_Encryption.en.md) · **Français**

# [Baseline] - WIN - U - Personal Data Encryption

Chiffre les dossiers personnels de l'utilisateur avec une clé liée à sa connexion Windows Hello, afin que les données restent chiffrées même sur un appareil allumé.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog (endpointSecurityDiskEncryption) |
| Affectation | All Users |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Encryption - U - Personal Data Encryption |
| Fichier | [`Baseline_WIN_U_Personal_Data_Encryption.json`](Baseline_WIN_U_Personal_Data_Encryption.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>3.11 Encrypt Sensitive Data at Rest |
| NIST CSF 2.0 | PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_pde_enablepersonaldataencryption` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_pde_protectfolders_protectpictures` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_pde_protectfolders_protectdocuments` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_pde_protectfolders_protectdesktop` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
