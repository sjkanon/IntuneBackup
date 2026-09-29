<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_OneDrive.md) · [English](Baseline_WIN_D_Microsoft_OneDrive.en.md) · **Français**

# [Baseline] - WIN - D - Microsoft OneDrive

Connecte automatiquement le client OneDrive avec le compte professionnel et déplace Bureau, Documents et Images vers OneDrive, afin que rien ne soit stocké uniquement en local.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft OneDrive - D - Configuration |
| Fichier | [`Baseline_WIN_D_Microsoft_OneDrive.json`](Baseline_WIN_D_Microsoft_OneDrive.json) |

> Reprend aussi la policy Known Folder Move (028) : ses 6 paramètres y figurent tous.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données<br>A.8.13 Sauvegarde des informations |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 19

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_allowtenantlist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_allowtenantlist_allowtenantlistbox` | %OrganizationId% |
| `device_vendor_msft_policy_config_onedrivengscv6~policy~onedrivengsc_enablefeedbackandsupport` | 0 |
| `device_vendor_msft_policy_config_onedrivengscv3~policy~onedrivengsc_enableautomaticuploadbandwidthmanagement` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv6~policy~onedrivengsc_enablesyncadminreports` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv4~policy~onedrivengsc_enableodignorelistfromgpo` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv4~policy~onedrivengsc_enableodignorelistfromgpo_enableodignorelistfromgpolistbox` | *.accdb, *.appx, *.bat, *.cmd, *.exe, *.img, *.iso, *.jar, *.lnk, *.mdb, *.msi, *.pst, *.reg, *.vbs, *.vhd, *.vhdx, *.vmdk |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_kfmblockoptout` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_gposetupdatering` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_gposetupdatering_gposetupdatering_dropdown` | 5 |
| `device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_desktop_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_documents_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_pictures_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_dropdown` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_textbox` | %OrganizationId% |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_silentaccountconfig` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_filesondemandenabled` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv4~policy~onedrivengsc_disablefirstdeletedialog` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
