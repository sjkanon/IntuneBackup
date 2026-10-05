<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Google_Chrome_Updates.en.md) · [Français](Baseline_WIN_D_Google_Chrome_Updates.fr.md)

# [Baseline] - WIN - D - Google Chrome Updates

Zorgt dat een Chrome-update binnen drie dagen actief wordt: herstartmelding verplicht, gedwongen herstart buiten werktijd, en versneld bij een sterk verouderde versie.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | Google Chrome-beleid in de settings catalog (chromeintunev1, chromeintunev141) — waarden gekozen naar de Edge-tegenhanger in deze baseline; ids, opties en bereik geverifieerd tegen DCv2/Settings in pl4nty/intune-change-tracking |
| Bestand | [`Baseline_WIN_D_Google_Chrome_Updates.json`](Baseline_WIN_D_Google_Chrome_Updates.json) |

> Google Update zelf (updatebeleid, kanaal) staat niet in de settings catalog: de `update~policy~cat_google~cat_googleupdate`-definities die er wel zijn horen bij de Edge-updater, waarvan de ADMX een fork van Google Update is met de oude categorienamen. Zolang niemand updates via Google Update uitzet, werkt Chrome zichzelf bij; deze policy zorgt dat die updates ook ingaan. RelaunchFastIfOutdated staat in de namespace chromeintunev141, de rest op chromeintunev1. Een apparaat dat 's nachts uit staat, herstart pas in het eerstvolgende venster.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management<br>9.1 Ensure Use of Only Fully Supported Browsers and Email Clients |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 9

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_componentupdatesenabled` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotification` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotification_relaunchnotification` | 2 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotificationperiod` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotificationperiod_relaunchnotificationperiod` | 259200000 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchwindow` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchwindow_relaunchwindow` | {"entries":[{"duration_mins":780,"start":{"hour":17,"minute":0}}]} |
| `device_vendor_msft_policy_config_chromeintunev141~policy~googlechrome_relaunchfastifoutdated` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev141~policy~googlechrome_relaunchfastifoutdated_relaunchfastifoutdated` | 7 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
