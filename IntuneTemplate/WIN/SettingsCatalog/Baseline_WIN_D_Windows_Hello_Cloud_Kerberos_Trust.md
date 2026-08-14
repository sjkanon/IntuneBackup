<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Hello Cloud Kerberos Trust

Laat Windows Hello werken tegen een on-prem Active Directory zonder certificaten, via een Kerberos-ticket uit Entra ID.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Windows Hello for Business - D - Cloud Kerberos Trust |
| Bestand | [`Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.json`](Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.json) |

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_kerberos_cloudkerberosticketretrievalenabled` | 1 |
| `device_vendor_msft_passportforwork_{tenantid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usecloudtrustforonpremauth` | true |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
