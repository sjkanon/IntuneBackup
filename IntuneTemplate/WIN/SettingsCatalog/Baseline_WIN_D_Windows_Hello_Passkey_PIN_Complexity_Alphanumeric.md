<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.en.md) · [Français](Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.fr.md)

# CXNM - Standard - WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric

Eist een alfanumerieke PIN voor de Windows Hello for Business-passkey: minstens een cijfer, een kleine letter, een hoofdletter en een leesteken.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen keuze, PassportForWork CSP — Policies/PINComplexity |
| Bestand | [`Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.json`](Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.json) |

> De naam zegt waar hij over gaat: dit is de PIN van de WHfB-passkey, niet die van een FIDO2-beveiligingssleutel — die staat op de sleutel zelf. Zet bewust geen minimumlengte: die staat al op 6 in WIN - D - Windows Hello for Business, en een tweede policy met een andere waarde zou daar een Conflict mee geven.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de [CA-Policies-repo](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/) leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| [2190 - GRANT - Windows Hello Passkeys](https://github.com/ConXioN-ITCE/CIPP-Templates-ConditionalAccess/blob/main/CATemplate/CXNM__STANDARD__2190__GRANT__Windows_Hello_Passkeys.md) | report-only | Bepaalt de PIN van de Windows Hello-passkey die deze CA-policy eist. Strenger dan de gebruiker gewend is, en registreren gaat pas als de PIN aan de eis voldoet. |

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_digits` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_lowercaseletters` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_uppercaseletters` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_specialcharacters` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
