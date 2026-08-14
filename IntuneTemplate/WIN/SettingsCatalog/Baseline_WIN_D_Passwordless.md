<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Passwordless

Verbergt het wachtwoordveld bij het aanmelden, zodat gebruikers Windows Hello of een beveiligingssleutel gebruiken in plaats van hun wachtwoord in te typen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-076-DPasswordless` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Credential Management - D - Passwordless |
| Bestand | [`Baseline_WIN_D_Passwordless.json`](Baseline_WIN_D_Passwordless.json) |

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_credentialproviders_defaultcredentialprovider` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_credentialproviders_defaultcredentialprovider_defaultcredentialprovider_message` | {D6886603-9D2F-4EB2-B667-1971041FA96B} |
| `device_vendor_msft_policy_config_authentication_enablepasswordlessexperience` | 1 |
| `device_vendor_msft_policy_config_authentication_enablewebsignin` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
