<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_AVD_Start_and_Search.en.md) · [Français](Baseline_WIN_D_AVD_Start_and_Search.fr.md)

# [Baseline] - WIN - D - AVD Start and Search

Laat Start en Zoeken op de AVD-sessiehosts niets meer uit de cloud of het web ophalen bij het openen: geen zoeken in cloudbronnen (OneDrive, SharePoint), geen zoekhighlights en geen lijst met recent toegevoegde apps.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | Eigen — de Search- en Start-instellingen uit de Settings Catalog (Policy CSP), alle drie met windowsMultiSession in de applicability |
| Bestand | [`Baseline_WIN_D_AVD_Start_and_Search.json`](Baseline_WIN_D_AVD_Start_and_Search.json) |

> Webresultaten in Zoeken (donotusewebresults) staan hier niet in: [Baseline] - WIN - D - Windows Feature Configuration (doelgroep alle) zet die al uit op elk Windows-apparaat — optie 0, *Not allowed*, de dubbele ontkenning van Do Not Use Web Results. Zoeken in cloudbronnen (allowcloudsearch) komt hier wel uit die policy: daar is hij weggehaald, anders zou hij op de sessiehost botsen. De Start-instelling HideRecommendedSection (de hele Aanbevolen-sectie verbergen) bestaat in de Settings Catalog van de testtenant niet; alleen HideRecentlyAddedApps is via Intune te zetten. Zoekhighlights (allowsearchhighlights) is een gewone integer, 0 = uit.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_search_allowcloudsearch` | 0 |
| `device_vendor_msft_policy_config_search_allowsearchhighlights` | 0 |
| `device_vendor_msft_policy_config_start_hiderecentlyaddedapps` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
