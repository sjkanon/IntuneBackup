<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows LAPS

Roteert automatisch het wachtwoord van het lokale beheerdersaccount en bewaart het in Entra ID, zodat er geen gedeeld beheerderswachtwoord meer rondgaat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-027-WindowsLAPSPolicy` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Windows LAPS - D - LAPS Configuration (24H2+) |
| Bestand | [`Baseline_WIN_D_Windows_LAPS.json`](Baseline_WIN_D_Windows_LAPS.json) |

> De 24H2+-variant, niet de basisvariant: onze policy had het automatische accountbeheer al. De eigen administratoraccountname blijft staan.

## Instellingen — 13

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_laps_policies_backupdirectory` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_passwordagedays_aad` | 7 |
| `device_vendor_msft_laps_policies_passwordcomplexity` | 8 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_passphraselength` | 4 |
| `device_vendor_msft_laps_policies_passwordlength` | 21 |
| `device_vendor_msft_laps_policies_postauthenticationactions` | 11 |
| `device_vendor_msft_laps_policies_postauthenticationresetdelay` | 1 |
| `device_vendor_msft_laps_policies_automaticaccountmanagementenabled` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementnameorprefix` | *(leeg)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementtarget` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementenableaccount` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementrandomizename` | false |
| `device_vendor_msft_laps_policies_administratoraccountname` | localadmin |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
