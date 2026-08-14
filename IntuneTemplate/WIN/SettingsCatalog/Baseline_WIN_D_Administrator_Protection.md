<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Administrator Protection

Laat beheerders standaard zonder verhoogde rechten werken en per handeling om toestemming vragen. Windows 11 24H2 en hoger.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-055-DAdministratorProtection` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - Administrator Protection |
| Bestand | [`Baseline_WIN_D_Administrator_Protection.json`](Baseline_WIN_D_Administrator_Protection.json) |

> Windows 11 24H2 en hoger; op oudere builds doet de instelling niets.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_behavioroftheelevationpromptforadministratorprotection` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_typeofadminapprovalmode` | 2 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
