<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Subsystem_for_Linux.md) · [English](Baseline_WIN_D_Windows_Subsystem_for_Linux.en.md) · **Français**

# [Baseline] - WIN - D - Windows Subsystem for Linux

Restreint le Sous-système Windows pour Linux, qui ouvre sinon un second environnement complet à côté de Windows où la plupart des contrôles de sécurité ne s'appliquent pas.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-090-DWindowsSubsystemForLinux` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Windows Subsystem for Linux |
| Fichier | [`Baseline_WIN_D_Windows_Subsystem_for_Linux.json`](Baseline_WIN_D_Windows_Subsystem_for_Linux.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 10

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_wslv1~policy~wsl_customkernelusersettingconfigurable` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_customnetworkingusersettingconfigurable` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_customsystemdistrousersettingconfigurable` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_customkernelcommandlineusersettingconfigurable` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_kerneldebugusersettingconfigurable` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_nestedvirtualizationusersettingconfigurable` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_allowdebugshell` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_allowinboxwsl` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_firewallusersettingconfigurable` | 0 |
| `device_vendor_msft_policy_config_wslv1~policy~wsl_allowwsl1` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
