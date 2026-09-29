<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_Additional_Configuration.md) · [English](Baseline_WIN_D_Defender_Additional_Configuration.en.md) · **Français**

# [Baseline] - WIN - D - Defender Additional Configuration

Paramètres Defender qui ne rentrent pas dans le modèle Endpoint Security et nécessitent donc une policy distincte.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Defender Antivirus - D - Additional Configuration |
| Fichier | [`Baseline_WIN_D_Defender_Additional_Configuration.json`](Baseline_WIN_D_Defender_Additional_Configuration.json) |

> Paramètres qui n'entrent pas dans le template antivirus d'Endpoint Security et nécessitent donc une policy Settings Catalog distincte. Depuis OIB v4.0 : 'Disallow Exploit Protection Override' activé (les utilisateurs pouvaient créer des paramètres de protection contre les exploits mais ne pouvaient plus les supprimer sans droits d'administrateur), et 'Hide Exclusions From Local Users' retiré car 'Hide Exclusions From Local Admins' l'implique déjà.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>10.5 Enable Anti-Exploitation Features<br>10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_defender_configuration_enableconvertwarntoblock` | 1 |
| `device_vendor_msft_defender_configuration_reporting_enabledynamicsignaturedroppedeventreporting` | 1 |
| `device_vendor_msft_defender_configuration_enablefilehashcomputation` | 1 |
| `device_vendor_msft_defender_configuration_hideexclusionsfromlocaladmins` | 1 |
| `device_vendor_msft_defender_configuration_oobeenablertpandsigupdate` | 1 |
| `device_vendor_msft_defender_configuration_passiveremediation` | 1 |
| `device_vendor_msft_defender_configuration_quickscanincludeexclusions` | 1 |
| `device_vendor_msft_defender_configuration_supportloglocation` | %ProgramData%\Microsoft\IntuneManagementExtension\Logs |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_disallowexploitprotectionoverride` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
