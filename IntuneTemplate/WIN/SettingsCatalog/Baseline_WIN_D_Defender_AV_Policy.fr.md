<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_AV_Policy.md) · [English](Baseline_WIN_D_Defender_AV_Policy.en.md) · **Français**

# [Baseline] - WIN - D - Defender AV Policy

Configuration de base de Defender Antivirus telle que CIPP la fournit : protection en temps réel, protection cloud, planification des analyses et ce qui se passe lors d'une détection.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Affectation | — |
| checkId | `INTUNE-BASE-108-DDefenderAVPolicy` |
| Source | Template standard CIPP |
| Fichier | [`Baseline_WIN_D_Defender_AV_Policy.json`](Baseline_WIN_D_Defender_AV_Policy.json) |

> Provient de CIPP, pas d'OIB. Chevauche [Baseline] - WIN - D - Defender Antivirus : 15 paramètres identiques, 3 avec une valeur différente (enablenetworkprotection, cloudblocklevel, avgcpuloadfactor). C'est pourquoi, depuis la comparaison avec IntuneAdmin/IntuneBaselines, elle est volontairement sans affectation : c'est l'alternative CIPP à la policy OIB, pas un complément. La version OIB est plus stricte sur les trois points (network protection sur block au lieu d'audit, cloud block level sur high au lieu de non configuré).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>10.4 Configure Automatic Anti-Malware Scanning of Removable Media<br>10.6 Centrally Manage Anti-Malware Software<br>10.7 Use Behavior-Based Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 19

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
