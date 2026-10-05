<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Microsoft_OneDrive.en.md) · [Français](Baseline_WIN_D_Microsoft_OneDrive.fr.md)

# [Baseline] - WIN - D - Microsoft OneDrive

Meldt de OneDrive-client automatisch aan met het werkaccount en verplaatst Bureaublad, Documenten en Afbeeldingen naar OneDrive, zodat er niets alleen lokaal staat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft OneDrive - D - Configuration |
| Bestand | [`Baseline_WIN_D_Microsoft_OneDrive.json`](Baseline_WIN_D_Microsoft_OneDrive.json) |

> Neemt ook de Known Folder Move-policy (028) over: alle 6 instellingen daarvan zitten hierin.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken<br>A.8.13 Back-up van informatie |
| NIS2 art. 21(2) | art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de CA-Policies-repo leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| 2110 - GRANT - Token Protection | enabled | Token protection werkt alleen in client-versies die gebonden tokens ondersteunen. Een Office-app of OneDrive-sync-client op een te oude versie wordt door deze policy geblokkeerd; deze Intune-policy houdt die clients bij. |

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
