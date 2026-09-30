<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_In_Box_App_Removal.md) · [English](Baseline_WIN_D_In_Box_App_Removal.en.md) · **Français**

# CXNM - Standard - WIN - D - In-Box App Removal

Supprime les applications grand public livrées par défaut avec Windows et qui n'ont rien à faire sur un appareil professionnel.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Windows Apps - D - In-Box App Removal |
| Fichier | [`Baseline_WIN_D_In_Box_App_Removal.json`](Baseline_WIN_D_In_Box_App_Removal.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 27

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_windowsfeedbackhub` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_microsoftofficehub` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_clipchamp` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_copilot` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_bingnews` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_photos` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_microsoftsolitairecollection` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_microsoftstickynotes` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_msteams` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_todo` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_bingweather` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_outlookforwindows` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_paint` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_quickassist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_screensketch` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_dynamicremovallist` | Microsoft.PowerAutomateDesktop_8wekyb3d8bbwe, Microsoft.Getstarted_8wekyb3d8bbwe |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_windowscalculator` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_windowscamera` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_mediaplayer` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_windowsnotepad` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_windowssoundrecorder` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_windowsterminal` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_gamingapp` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_xboxidentityprovider` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_xboxspeechtotextoverlay` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_applicationmanagement_removedefaultmicrosoftstorepackages_2_xboxtcui` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
