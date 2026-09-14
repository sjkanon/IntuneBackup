<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Hello for Business

Laat gebruikers aanmelden met een PIN of biometrie in plaats van een wachtwoord. Vereist een TPM, een PIN van minimaal zes tekens en anti-spoofing bij gezichtsherkenning.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Toewijzing | — |
| checkId | `INTUNE-BASE-087-DWindowsHelloForBusiness` |
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Windows Hello for Business - D - WHfB Configuration |
| Bestand | [`Baseline_WIN_D_Windows_Hello_for_Business.json`](Baseline_WIN_D_Windows_Hello_for_Business.json) |

> Ontbrak volledig. Vereist een TPM, PIN van minimaal 6 tekens en anti-spoofing voor gezichtsherkenning. Geldt voor élke gebruiker van het apparaat; voor gedeelde apparaten staat er een eigen variant naast (Baseline_WIN_D_Windows_Hello_for_Business_Multi_User).

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
