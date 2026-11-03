<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_Devices_OneDrive.en.md) · [Français](Baseline_WIN_D_Shared_Devices_OneDrive.fr.md)

# [Baseline] - WIN - D - Shared Devices OneDrive

Meldt OneDrive op gedeelde apparaten stil aan met het werkaccount, zet Bureaublad, Documenten en Afbeeldingen in OneDrive en zet bestanden alleen online neer, ook die van gesynchroniseerde teamsites, zodat er niets in een profiel achterblijft dat Shared PC opruimt en de schijf niet volloopt met een kopie per gebruiker.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen baseline — dezelfde waarden als [Baseline] - WIN - D - Microsoft OneDrive voor stil aanmelden, Files On-Demand, Known Folder Move en de toegestane tenant, plus Convert synced team site files to online-only files (DehydrateSyncedTeamSites, Microsoft Learn: Use OneDrive policies to control sync settings). |
| Bestand | [`Baseline_WIN_D_Shared_Devices_OneDrive.json`](Baseline_WIN_D_Shared_Devices_OneDrive.json) |

> Hoort op SG-D-UEM-WIN-Shared, naast [Baseline] - WIN - D - Shared PC of Shared PC Domain and Guest. Een eigen template zodat de Shared Devices-baseline in CIPP-Baselines OneDrive kan uitrollen zonder [Baseline] - WIN - D - Microsoft OneDrive op een groep te zetten. De gedeelde instellingen hebben dezelfde waarden als die policy, dus samen op één toestel is geen Conflict. De Settings Catalog-ID van DehydrateSyncedTeamSites volgt het patroon van de andere OneDrive-instellingen en staat in geen bron letterlijk: weigert CIPP het template, zoek de instelling dan op in de Settings Catalog (Convert synced team site files to online-only files) en neem die ID over.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.13 Back-up van informatie<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 12

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_silentaccountconfig` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_filesondemandenabled` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_desktop_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_documents_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_pictures_checkbox` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_dropdown` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2.updates~policy~onedrivengsc_kfmoptinnowizard_kfmoptinnowizard_textbox` | %OrganizationId% |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_kfmblockoptout` | 1 |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_allowtenantlist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_allowtenantlist_allowtenantlistbox` | %OrganizationId% |
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_dehydratesyncedteamsites` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
