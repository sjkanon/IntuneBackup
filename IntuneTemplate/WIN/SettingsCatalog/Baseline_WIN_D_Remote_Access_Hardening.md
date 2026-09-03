<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Remote Access Hardening

Sluit de WinRM-remoteshell af en verbreekt een inactieve SMB-sessie na vijftien minuten.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-135-DRemoteAccessHardening` |
| Bron | CIS v4 Windows 11 L1 — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definities. |
| Bestand | [`Baseline_WIN_D_Remote_Access_Hardening.json`](Baseline_WIN_D_Remote_Access_Hardening.json) |

> LET OP vóór je toewijst: controleer of er geen beheerscript of monitoringtool op WinRM leunt. `Enter-PSSession` en `Invoke-Command` blijven werken — die gebruiken de PowerShell-endpoint, niet de remoteshell — maar `winrs` en alles wat daarop bouwt niet meer. Op een vloot met on-prem beheertooling is dit de enige policy in deze set die iets kan breken dat je niet direct ziet.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_remoteshell_allowremoteshellaccess` | 0 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_microsoftnetworkserver_amountofidletimerequiredbeforesuspendingsession` | 15 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
