<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft OneDrive

De gebruikerskant van OneDrive: welke schermen en meldingen de gebruiker ziet.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-032-UMicrosoftOneDrive` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft OneDrive - U - Configuration |
| Bestand | [`Baseline_WIN_U_Microsoft_OneDrive.json`](Baseline_WIN_U_Microsoft_OneDrive.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken |
| NIST CSF 2.0 | PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 9

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_enableholdthefile` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablefretutorial` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot_disablecustomrootlist` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot_disablecustomrootlist_key` | %OrganizationId% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablecustomroot_disablecustomrootlist_value` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv2~policy~onedrivengsc_disablepersonalsync` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv7~policy~onedrivengsc_enableautostart` | 1 |
| `user_vendor_msft_policy_config_onedrivengscv6~policy~onedrivengsc_disablefreanimation` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
