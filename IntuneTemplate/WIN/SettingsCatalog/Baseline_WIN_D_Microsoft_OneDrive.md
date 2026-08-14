<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Microsoft OneDrive

Meldt de OneDrive-client automatisch aan met het werkaccount en verplaatst Bureaublad, Documenten en Afbeeldingen naar OneDrive, zodat er niets alleen lokaal staat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-029-OnedriveSilentLogin` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Microsoft OneDrive - D - Configuration |
| Bestand | [`Baseline_WIN_D_Microsoft_OneDrive.json`](Baseline_WIN_D_Microsoft_OneDrive.json) |

> Neemt ook de Known Folder Move-policy (028) over: alle 6 instellingen daarvan zitten hierin.

## Instellingen — 19

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
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

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
