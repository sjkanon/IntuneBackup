<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender Antivirus

Kernconfiguratie van Defender Antivirus: realtimebeveiliging, cloudbescherming, scanschema, en wat er gebeurt bij een detectie.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-012-DefaultAVPolicy` |
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Defender Antivirus - D - AV Configuration |
| Bestand | [`Baseline_WIN_D_Defender_Antivirus.json`](Baseline_WIN_D_Defender_Antivirus.json) |

> 11 -> 28 instellingen. allowintrusionpreventionsystem blijft behouden; OIB laat 'm weg omdat Microsoft de instelling heeft uitgefaseerd. Sinds OIB v4.0 zet OIB matig en hoog zelf op quarantaine; de eigen override voor matig is daarmee overbodig geworden en weggehaald. Laag blijft een override.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>10.2 Configure Automatic Anti-Malware Signature Updates<br>10.4 Configure Automatic Anti-Malware Scanning of Removable Media<br>10.6 Centrally Manage Anti-Malware Software<br>10.7 Use Behavior-Based Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 32

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_defender_allowarchivescanning` | 1 |
| `device_vendor_msft_policy_config_defender_allowbehaviormonitoring` | 1 |
| `device_vendor_msft_policy_config_defender_allowcloudprotection` | 1 |
| `device_vendor_msft_policy_config_defender_allowemailscanning` | 1 |
| `device_vendor_msft_policy_config_defender_allowfullscanremovabledrivescanning` | 1 |
| `device_vendor_msft_policy_config_defender_allowioavprotection` | 1 |
| `device_vendor_msft_policy_config_defender_allowrealtimemonitoring` | 1 |
| `device_vendor_msft_policy_config_defender_allowscanningnetworkfiles` | 1 |
| `device_vendor_msft_policy_config_defender_allowscriptscanning` | 1 |
| `device_vendor_msft_policy_config_defender_allowuseruiaccess` | 1 |
| `device_vendor_msft_policy_config_defender_avgcpuloadfactor` | 50 |
| `device_vendor_msft_policy_config_defender_checkforsignaturesbeforerunningscan` | 1 |
| `device_vendor_msft_policy_config_defender_cloudblocklevel` | 2 |
| `device_vendor_msft_policy_config_defender_cloudextendedtimeout` | 50 |
| `device_vendor_msft_policy_config_defender_disablecatchupfullscan` | 0 |
| `device_vendor_msft_policy_config_defender_disablecatchupquickscan` | 0 |
| `device_vendor_msft_policy_config_defender_enablelowcpupriority` | 1 |
| `device_vendor_msft_policy_config_defender_enablenetworkprotection` | 1 |
| `device_vendor_msft_policy_config_defender_puaprotection` | 1 |
| `device_vendor_msft_policy_config_defender_realtimescandirection` | 0 |
| `device_vendor_msft_policy_config_defender_schedulequickscantime` | 660 |
| `device_vendor_msft_policy_config_defender_signatureupdateinterval` | 1 |
| `device_vendor_msft_policy_config_defender_submitsamplesconsent` | 1 |
| `device_vendor_msft_defender_configuration_disablelocaladminmerge` | 1 |
| `device_vendor_msft_policy_config_defender_allowonaccessprotection` | 1 |
| `device_vendor_msft_policy_config_defender_threatseveritydefaultaction` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_lowseveritythreats` | quarantine |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_highseveritythreats` | quarantine |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_moderateseveritythreats` | quarantine |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_severethreats` | remove |
| `device_vendor_msft_defender_configuration_meteredconnectionupdates` | 1 |
| `device_vendor_msft_policy_config_defender_allowintrusionpreventionsystem` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
