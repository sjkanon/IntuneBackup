<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - FileVault

Versleutelt de schijf van de Mac en bewaart de herstelsleutel in Intune. De macOS-tegenhanger van BitLocker.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-038-MACDFileVault` |
| Bron | OpenIntuneBaseline macOS v1.0 — Disk Encryption - D - FileVault |
| Bestand | [`Baseline_MAC_D_FileVault.json`](Baseline_MAC_D_FileVault.json) |

> De macOS-tegenhanger van BitLocker; herstelsleutel wordt in Intune bewaard. Sinds september 2026 wordt de persoonlijke herstelsleutel expliciet aangemaakt (userecoverykey) en niet aan de gebruiker getoond (showrecoverykey), zodat hij alleen via Intune op te vragen is.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>3.11 Encrypt Sensitive Data at Rest |
| NIST CSF 2.0 | PR.DS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 10

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.mcx.filevault2_com.apple.mcx.filevault2` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_enable` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_forceenableinsetupassistant` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_recoverykeyrotationinmonths` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_userecoverykey` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_showrecoverykey` | false |
| `com.apple.mcx_com.apple.mcx-fdefilevaultoptions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx_dontallowfdedisable` | true |
| `com.apple.security.fderecoverykeyescrow_com.apple.security.fderecoverykeyescrow` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.fderecoverykeyescrow_location` | You can retrieve the personal recovery key for your macOS device from the Microsoft Intune app, Company Por… |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
