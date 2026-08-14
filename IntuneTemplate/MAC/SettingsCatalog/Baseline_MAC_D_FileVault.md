<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - FileVault

Versleutelt de schijf van de Mac en bewaart de herstelsleutel in Intune. De macOS-tegenhanger van BitLocker.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-038-MACDFileVault` |
| Bron | OpenIntuneBaseline macOS v1.0 — Disk Encryption - D - FileVault |
| Bestand | [`Baseline_MAC_D_FileVault.json`](Baseline_MAC_D_FileVault.json) |

> De macOS-tegenhanger van BitLocker; herstelsleutel wordt in Intune bewaard.

## Instellingen — 8

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.mcx.filevault2_com.apple.mcx.filevault2` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_enable` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_forceenableinsetupassistant` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx.filevault2_recoverykeyrotationinmonths` | 6 |
| `com.apple.mcx_com.apple.mcx-fdefilevaultoptions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mcx_dontallowfdedisable` | true |
| `com.apple.security.fderecoverykeyescrow_com.apple.security.fderecoverykeyescrow` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.fderecoverykeyescrow_location` | You can retrieve the personal recovery key for your macOS device from the Microsoft Intune app, Company Por… |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
