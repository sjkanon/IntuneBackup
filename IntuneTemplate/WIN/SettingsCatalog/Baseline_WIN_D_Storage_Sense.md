<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Storage Sense

Ruimt automatisch tijdelijke bestanden, de prullenbak en oude downloads op zodra de schijf vol dreigt te raken, en maakt lokaal gecachte OneDrive-bestanden weer online-only.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-143-DStorageSense` |
| Bron | IntuneAdmin/IntuneBaselines — Modern Workplace, Baseline - Storage Sense |
| Bestand | [`Baseline_WIN_D_Storage_Sense.json`](Baseline_WIN_D_Storage_Sense.json) |

> Cadans 0 betekent: alleen als de vrije schijfruimte laag is, niet op een vast schema. Downloads en prullenbak worden opgeruimd na 30 dagen; OneDrive-bestanden die 30 dagen niet zijn geopend worden weer online-only — het bestand blijft bestaan, alleen de lokale kopie gaat weg.

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_storage_allowstoragesenseglobal` | 1 |
| `device_vendor_msft_policy_config_storage_allowstoragesensetemporaryfilescleanup` | 1 |
| `device_vendor_msft_policy_config_storage_configstoragesenseglobalcadence` | 0 |
| `device_vendor_msft_policy_config_storage_configstoragesenserecyclebincleanupthreshold` | 30 |
| `device_vendor_msft_policy_config_storage_configstoragesensedownloadscleanupthreshold` | 30 |
| `device_vendor_msft_policy_config_storage_configstoragesensecloudcontentdehydrationthreshold` | 30 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
