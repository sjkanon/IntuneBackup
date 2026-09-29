<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_Antivirus.md) · [English](Baseline_WIN_D_Defender_Antivirus.en.md) · **Français**

# [Baseline] - WIN - D - Defender Antivirus

Configuration de base de Defender Antivirus : protection en temps réel, protection cloud, planification des analyses et ce qui se passe lors d'une détection.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-012-DefaultAVPolicy` |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Defender Antivirus - D - AV Configuration |
| Fichier | [`Baseline_WIN_D_Defender_Antivirus.json`](Baseline_WIN_D_Defender_Antivirus.json) |

> 11 -> 28 paramètres. allowintrusionpreventionsystem est conservé ; OIB l'omet car Microsoft a abandonné ce paramètre. Depuis OIB v4.0, OIB règle lui-même les niveaux modéré et élevé sur quarantaine ; le remplacement propre pour modéré est de ce fait devenu superflu et a été retiré. Faible reste un remplacement.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>10.2 Configure Automatic Anti-Malware Signature Updates<br>10.4 Configure Automatic Anti-Malware Scanning of Removable Media<br>10.6 Centrally Manage Anti-Malware Software<br>10.7 Use Behavior-Based Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 32

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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
| `device_vendor_msft_policy_config_defender_threatseveritydefaultaction` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_lowseveritythreats` | quarantine |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_highseveritythreats` | quarantine |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_moderateseveritythreats` | quarantine |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_threatseveritydefaultaction_severethreats` | remove |
| `device_vendor_msft_defender_configuration_meteredconnectionupdates` | 1 |
| `device_vendor_msft_policy_config_defender_allowintrusionpreventionsystem` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
