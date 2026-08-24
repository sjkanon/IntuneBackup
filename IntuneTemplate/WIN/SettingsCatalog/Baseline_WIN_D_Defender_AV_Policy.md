<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender AV Policy

Kernconfiguratie van Defender Antivirus zoals CIPP die uitlevert: realtimebeveiliging, cloudbescherming, scanschema en wat er gebeurt bij een detectie.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-108-DDefenderAVPolicy` |
| Bron | CIPP-standaardtemplate |
| Bestand | [`Baseline_WIN_D_Defender_AV_Policy.json`](Baseline_WIN_D_Defender_AV_Policy.json) |

> Komt uit CIPP, niet uit OIB. Overlapt met [Baseline] - WIN - D - Defender Antivirus: 15 instellingen identiek, 3 met een andere waarde (enablenetworkprotection, cloudblocklevel, avgcpuloadfactor).

## Instellingen — 19

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_defender_allowbehaviormonitoring` | 1 |
| `device_vendor_msft_policy_config_defender_allowcloudprotection` | 1 |
| `device_vendor_msft_policy_config_defender_allowemailscanning` | 1 |
| `device_vendor_msft_policy_config_defender_allowfullscanonmappednetworkdrives` | 1 |
| `device_vendor_msft_policy_config_defender_allowfullscanremovabledrivescanning` | 1 |
| `device_vendor_msft_policy_config_defender_allowioavprotection` | 1 |
| `device_vendor_msft_policy_config_defender_allowrealtimemonitoring` | 1 |
| `device_vendor_msft_policy_config_defender_allowscanningnetworkfiles` | 1 |
| `device_vendor_msft_policy_config_defender_allowscriptscanning` | 1 |
| `device_vendor_msft_policy_config_defender_allowuseruiaccess` | 1 |
| `device_vendor_msft_policy_config_defender_checkforsignaturesbeforerunningscan` | 1 |
| `device_vendor_msft_policy_config_defender_enablelowcpupriority` | 1 |
| `device_vendor_msft_defender_configuration_meteredconnectionupdates` | 1 |
| `device_vendor_msft_defender_configuration_disablelocaladminmerge` | 1 |
| `device_vendor_msft_policy_config_defender_enablenetworkprotection` | 2 |
| `device_vendor_msft_policy_config_defender_cloudblocklevel` | 0 |
| `device_vendor_msft_policy_config_defender_allowonaccessprotection` | 1 |
| `device_vendor_msft_policy_config_defender_submitsamplesconsent` | 1 |
| `device_vendor_msft_policy_config_defender_avgcpuloadfactor` | 20 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
