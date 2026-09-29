<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_FileVault.md) · [English](Baseline_MAC_D_FileVault.en.md) · **Français**

# [Baseline] - MAC - D - FileVault

Chiffre le disque du Mac et stocke la clé de récupération dans Intune. L'équivalent macOS de BitLocker.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-038-MACDFileVault` |
| Source | OpenIntuneBaseline macOS v1.0 — Disk Encryption - D - FileVault |
| Fichier | [`Baseline_MAC_D_FileVault.json`](Baseline_MAC_D_FileVault.json) |

> L'équivalent macOS de BitLocker ; la clé de récupération est conservée dans Intune. Depuis septembre 2026, la clé de récupération personnelle est explicitement créée (userecoverykey) et n'est pas affichée à l'utilisateur (showrecoverykey), de sorte qu'elle ne peut être obtenue que via Intune.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Sécurité des actifs hors des locaux<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>3.11 Encrypt Sensitive Data at Rest |
| NIST CSF 2.0 | PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 10

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.mcx.filevault2_com.apple.mcx.filevault2` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_enable` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_forceenableinsetupassistant` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_recoverykeyrotationinmonths` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_userecoverykey` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_showrecoverykey` | false |
| `com.apple.mcx_com.apple.mcx-fdefilevaultoptions` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx_dontallowfdedisable` | true |
| `com.apple.security.fderecoverykeyescrow_com.apple.security.fderecoverykeyescrow` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.fderecoverykeyescrow_location` | You can retrieve the personal recovery key for your macOS device from the Microsoft Intune app, Company Por… |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
