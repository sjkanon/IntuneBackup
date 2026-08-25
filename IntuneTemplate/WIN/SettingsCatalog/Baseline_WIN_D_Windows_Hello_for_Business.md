<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Hello for Business

Laat gebruikers aanmelden met een PIN of biometrie in plaats van een wachtwoord. Vereist een TPM, een PIN van minimaal zes tekens en anti-spoofing bij gezichtsherkenning.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-087-DWindowsHelloForBusiness` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Windows Hello for Business - D - WHfB Configuration |
| Bestand | [`Baseline_WIN_D_Windows_Hello_for_Business.json`](Baseline_WIN_D_Windows_Hello_for_Business.json) |

> Ontbrak volledig. Vereist een TPM, PIN van minimaal 6 tekens en anti-spoofing voor gezichtsherkenning. Geldt voor élke gebruiker van het apparaat; voor gedeelde apparaten staat er een eigen variant naast (Baseline_WIN_D_Windows_Hello_for_Business_Multi_User).

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_requiresecuritydevice` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_minimumpinlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usecertificateforonpremauth` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_enablepinrecovery` | true |
| `device_vendor_msft_passportforwork_biometrics_facialfeaturesuseenhancedantispoofing` | true |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
