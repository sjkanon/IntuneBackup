<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.en.md) · [Français](Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.fr.md)

# [Baseline] - WIN - D - Shared Devices SharePoint Team Sites

Synchroniseert op gedeelde apparaten één SharePoint-bibliotheek van de klant automatisch voor elke gebruiker, als bestanden die alleen online staan, zodat iedereen de gedeelde map in Verkenner heeft zonder die zelf toe te voegen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen baseline — Configure team site libraries to sync automatically (AutoMountTeamSites, Microsoft Learn: Use OneDrive policies to control sync settings). Naam en bibliotheek-ID uit de CIPP-variabelen %SharedTeamSiteName% en %SharedTeamSiteLibraryId%. |
| Bestand | [`Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.json`](Baseline_WIN_D_Shared_Devices_SharePoint_Team_Sites.json) |

> Hoort op SG-D-UEM-WIN-Shared, samen met [Baseline] - WIN - D - Shared Devices OneDrive (Files On-Demand is vereist). Leg in CIPP per tenant de variabelen %SharedTeamSiteName% (de naam in Verkenner) en %SharedTeamSiteLibraryId% vast. De bibliotheek-ID haal je in SharePoint: open de bibliotheek, Synchroniseren, annuleer de OneDrive-vraag en kies Bibliotheek-id kopiëren. Microsoft raadt het af voor bibliotheken met meer dan 5.000 bestanden of mappen en voor meer dan 1.000 toestellen per bibliotheek. OneDrive koppelt de bibliotheek binnen acht uur na de aanmelding; op een gedeeld toestel met steeds nieuwe profielen kan een gebruiker daar dus de eerste keer op moeten wachten. De Settings Catalog-ID's volgen het patroon van de andere OneDrive-instellingen en staan in geen bron letterlijk: weigert CIPP het template, neem dan de ID's over uit de Settings Catalog (Configure team site libraries to sync automatically).

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.13 Back-up van informatie<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites_automountteamsiteslistbox` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites_automountteamsiteslistbox_key` | %SharedTeamSiteName% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_automountteamsites_automountteamsiteslistbox_value` | %SharedTeamSiteLibraryId% |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
