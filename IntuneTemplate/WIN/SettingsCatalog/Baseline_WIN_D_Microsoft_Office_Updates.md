<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Microsoft Office Updates

Op welk updatekanaal Office zit en hoe snel updates worden geïnstalleerd.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-021-OfficeUpdates` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Microsoft Office - D - Updates |
| Bestand | [`Baseline_WIN_D_Microsoft_Office_Updates.json`](Baseline_WIN_D_Microsoft_Office_Updates.json) |

> Vervangt de klassieke ADMX-variant (Type Admin). Dat endpoint is beta-only en nooit tegen een echte tenant getest; Settings Catalog is stabieler. In de tenant is dit geen hernoeming maar een vervanging — verwijder de oude ADMX-policy, anders zetten beide dezelfde registerwaarden.

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_office16v5~policy~l_microsoftofficemachine~l_updates_l_preventbinginstall` | 1 |
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_enableautomaticupdates` | 1 |
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_hideenabledisableupdates` | 1 |
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_onlinerepair` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_onlinerepair_l_localodtpath` | *(leeg)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_updates_l_onlinerepair_l_fallbacktocdn` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
