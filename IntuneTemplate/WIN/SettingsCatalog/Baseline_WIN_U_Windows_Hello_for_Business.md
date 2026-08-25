<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Windows Hello for Business

Windows Hello for Business per gebruiker in plaats van per apparaat: dezelfde eisen als de apparaatpolicy — TPM verplicht, PIN van minimaal zes tekens, PIN-herstel aan — maar dan gebonden aan de gebruiker. Bedoeld voor gebruikers met een eigen apparaat; gedeelde apparaten horen hier met een apparaatfilter buiten te vallen.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-114-UWindowsHelloForBusiness` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Windows Hello for Business - D - WHfB Configuration, omgezet naar user-scope |
| Bestand | [`Baseline_WIN_U_Windows_Hello_for_Business.json`](Baseline_WIN_U_Windows_Hello_for_Business.json) |

> De user-scope van de PassportForWork-CSP kent vier van de vijf instellingen uit de apparaatpolicy; UseCertificateForOnPremAuth en de biometrie-instellingen bestaan alleen device-scoped en blijven dus daar. Zet er een apparaatfilter op dat gedeelde apparaten uitsluit (Set-BaselineAssignment.ps1 -FilterId), anders geldt hij ook daar.

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_passportforwork_{tenantid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_requiresecuritydevice` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_minimumpinlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_passportforwork_{tenantid}_policies_enablepinrecovery` | true |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
