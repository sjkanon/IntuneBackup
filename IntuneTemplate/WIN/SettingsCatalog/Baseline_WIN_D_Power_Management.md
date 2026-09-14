<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Power Management

Laat het dichtklappen van de klep en de aan/uit-knop het apparaat in slaapstand zetten, zodat de bestaande eis om een wachtwoord te vragen bij ontwaken ook echt tot een vergrendeld scherm leidt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-142-DPowerManagement` |
| Bron | IntuneAdmin/IntuneBaselines — Modern Workplace, Baseline - Windows Power Settings; waarden geverifieerd tegen de settings catalog-definities (1 = Sleep) |
| Bestand | [`Baseline_WIN_D_Power_Management.json`](Baseline_WIN_D_Power_Management.json) |

> Slaapstand en niet afsluiten: afsluiten kost gebruikers werk en levert klachten op, en met wachtwoord-bij-ontwaken is slaapstand net zo goed vergrendeld. De energiebesparingsdrempel van 30 procent is uit de bron overgenomen en is geen beveiligingsinstelling.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.7 Clear desk en clear screen<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_power_selectlidcloseactiononbattery` | 1 |
| `device_vendor_msft_policy_config_power_selectlidcloseactionpluggedin` | 1 |
| `device_vendor_msft_policy_config_power_selectpowerbuttonactiononbattery` | 1 |
| `device_vendor_msft_policy_config_power_selectpowerbuttonactionpluggedin` | 1 |
| `device_vendor_msft_policy_config_power_allowhibernate` | 1 |
| `device_vendor_msft_policy_config_power_energysaverbatterythresholdonbattery` | 30 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
