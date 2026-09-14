<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Edge Extensions

Bepaalt welke Edge-extensies gebruikers mogen installeren, en welke verplicht zijn.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-098-UMicrosoftEdgeExtensions` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - Extensions |
| Bestand | [`Baseline_WIN_U_Microsoft_Edge_Extensions.json`](Baseline_WIN_U_Microsoft_Edge_Extensions.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions |
| NIST CSF 2.0 | PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallallowlist` | 0 |
| `user_vendor_msft_policy_config_microsoft_edgev88~policy~microsoft_edge~extensions_blockexternalextensions` | 1 |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallforcelist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallforcelist_extensioninstallforcelistdesc` | nkbndigcebkoaejohleckhekfmcecfja, ofefcgjbeghpigppfmkologfjadafddi |
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge~extensions_extensioninstallblocklist_extensioninstallblocklistdesc` | * |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
