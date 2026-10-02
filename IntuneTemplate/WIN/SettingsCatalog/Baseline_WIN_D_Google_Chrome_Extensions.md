<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Google_Chrome_Extensions.en.md) · [Français](Baseline_WIN_D_Google_Chrome_Extensions.fr.md)

# CXNM - Standard - WIN - D - Google Chrome Extensions

Blokkeert extensies in Google Chrome, zoals Microsoft Edge Extensions dat in Edge doet.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Google Chrome-beleid in de settings catalog (chromeintunev1, chromeintunev141) — waarden gekozen naar de Edge-tegenhanger in deze baseline; ids, opties en bereik geverifieerd tegen DCv2/Settings in pl4nty/intune-change-tracking |
| Bestand | [`Baseline_WIN_D_Google_Chrome_Extensions.json`](Baseline_WIN_D_Google_Chrome_Extensions.json) |

> Apart van Google Chrome Security omdat dit de policy is die het vaakst een uitzondering vraagt: zo kan de rest van de Chrome-hardening uitrollen terwijl de extensie-inventaris nog loopt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions |
| NIST CSF 2.0 | PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~extensions_extensioninstallblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~extensions_extensioninstallblocklist_extensioninstallblocklistdesc` | * |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
