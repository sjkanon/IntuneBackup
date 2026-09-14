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
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Credential Management - D - Passwordless |
| Bestand | [`Baseline_WIN_D_Passwordless.json`](Baseline_WIN_D_Passwordless.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| NIST CSF 2.0 | PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
