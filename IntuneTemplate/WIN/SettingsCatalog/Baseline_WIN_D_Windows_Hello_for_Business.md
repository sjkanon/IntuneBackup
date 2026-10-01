<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Windows_Hello_for_Business.en.md) · [Français](Baseline_WIN_D_Windows_Hello_for_Business.fr.md)

# CXNM - Standard - WIN - D - Windows Hello for Business

Laat gebruikers aanmelden met een PIN of biometrie in plaats van een wachtwoord. Vereist een TPM, een PIN van minimaal zes tekens en anti-spoofing bij gezichtsherkenning.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Toewijzing | — |
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Windows Hello for Business - D - WHfB Configuration |
| Bestand | [`Baseline_WIN_D_Windows_Hello_for_Business.json`](Baseline_WIN_D_Windows_Hello_for_Business.json) |

> Ontbrak volledig. Vereist een TPM, PIN van minimaal 6 tekens en anti-spoofing voor gezichtsherkenning. Geldt voor élke gebruiker van het apparaat; voor gedeelde apparaten staat er een eigen variant naast (Baseline_WIN_D_Windows_Hello_for_Business_Multi_User).

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de [CA-Policies-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/) leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| [2055 - GRANT - Phishing Resistant MFA for Admins](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2055__GRANT__Phishing_Resistant_MFA_for_Admins.md) | disabled | Richt Windows Hello for Business in: op Windows de gewone manier om aan phishing-resistente MFA te voldoen. Zonder WHfB blijft daar alleen een losse passkey of beveiligingssleutel over. |
| [2120 - GRANT - Phishing Resistant MFA for All Users](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2120__GRANT__Phishing_Resistant_MFA_for_All_Users.md) | enabled | Richt Windows Hello for Business in: op Windows de gewone manier om aan phishing-resistente MFA te voldoen. Zonder WHfB blijft daar alleen een losse passkey of beveiligingssleutel over. |
| [2125 - GRANT - Phishing Resistant MFA for Rollout Groups](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2125__GRANT__Phishing_Resistant_MFA_for_Rollout_Groups.md) | enabled | Richt Windows Hello for Business in: op Windows de gewone manier om aan phishing-resistente MFA te voldoen. Zonder WHfB blijft daar alleen een losse passkey of beveiligingssleutel over. |

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
