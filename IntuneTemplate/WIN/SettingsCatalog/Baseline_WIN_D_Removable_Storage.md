<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Removable Storage

Blokkeert schrijven naar verwisselbare opslag: USB-sticks en externe schijven, en telefoons en camera's die zich als WPD-apparaat aanmelden. Lezen blijft mogelijk.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-111-DRemovableStorage` |
| Bron | eigen baseline — vergelijking met IntuneAdmin/IntuneBaselines, augustus 2026 |
| Bestand | [`Baseline_WIN_D_Removable_Storage.json`](Baseline_WIN_D_Removable_Storage.json) |

> OIB dekt verwisselbare media niet. Alleen schrijven wordt geblokkeerd, niet lezen: gegevens mogen naar binnen, niet naar buiten. De BitLocker-policy laat removabledrivesrequireencryption bewust uit staan — met een schrijfblokkade voegt een versleutelingseis niets toe.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.10 Opslagmedia<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| NIST CSF 2.0 | PR.DS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_storage_removablediskdenywriteaccess` | 1 |
| `device_vendor_msft_policy_config_admx_removablestorage_wpddevices_denywrite_access_2` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
