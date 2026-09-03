<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Privacy and Telemetry

Zet de advertentie-id uit, blokkeert het klembord tussen apparaten, stopt het uploaden van gebruikersactiviteiten en houdt wat de gebruiker typt en inspreekt op het apparaat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-134-DPrivacyAndTelemetry` |
| Bron | CIS v4 Windows 11 L1 — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definities. |
| Bestand | [`Baseline_WIN_D_Privacy_and_Telemetry.json`](Baseline_WIN_D_Privacy_and_Telemetry.json) |

> Merkbaar op één punt: het klembord werkt niet meer tussen apparaten (plakken binnen hetzelfde apparaat blijft gewoon werken) en de tekstsuggesties worden na verloop van tijd minder persoonlijk. Vult `[ISMS] - WIN - D - Data Minimisation` aan zonder ermee te botsen — die beperkt wat er in de diagnostische gegevens meegaat, deze zet vier aparte kanalen uit.

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_privacy_allowcrossdeviceclipboard` | 0 |
| `device_vendor_msft_policy_config_privacy_disableadvertisingid` | 1 |
| `device_vendor_msft_policy_config_privacy_uploaduseractivities` | 0 |
| `device_vendor_msft_policy_config_privacy_allowinputpersonalization` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
