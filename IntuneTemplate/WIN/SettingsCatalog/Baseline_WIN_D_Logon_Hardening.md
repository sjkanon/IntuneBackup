<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Logon Hardening

Vereist CTRL+ALT+DEL vóór het aanmelden en haalt de netwerkkeuze van het vergrendelscherm weg.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-132-DLogonHardening` |
| Bron | CIS v4 Windows 11 L1 — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definitie. |
| Bestand | [`Baseline_WIN_D_Logon_Hardening.json`](Baseline_WIN_D_Logon_Hardening.json) |

> Merkbaar voor gebruikers, dus meld het aan: na deze policy moet iedereen CTRL+ALT+DEL indrukken vóór het aanmeldscherm verschijnt. Op tablets en 2-in-1's zonder toetsenbord neemt Windows daar de Windows-knop plus aan/uit voor. De letters in de instellingsnaam zijn omgekeerd: "Do not require CTRL+ALT+DEL" op Disabled betekent dat het juist wél vereist is.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_donotrequirectrlaltdel` | 0 |
| `device_vendor_msft_policy_config_windowslogon_dontdisplaynetworkselectionui` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
