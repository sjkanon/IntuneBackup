<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.en.md) · [Français](Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.fr.md)

# [Baseline] - WIN - D - Windows Hello Passkey PIN Complexity Numeric

Legt de numerieke PIN voor de Windows Hello for Business-passkey expliciet vast: cijfers vereist, letters en leestekens geblokkeerd.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen keuze, PassportForWork CSP — Policies/PINComplexity |
| Bestand | [`Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.json`](Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.json) |

> Dit is ook het gedrag van Windows zonder beleid. Expliciet vastleggen maakt het toetsbaar — 'niet ingesteld' en 'ingesteld op de standaard' zien er in een tenantexport hetzelfde uit — en het overleeft een standaardwijziging van Microsoft.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Conditional Access

Deze Conditional Access-policies uit de CA-Policies-repo leunen op deze policy. Wijzig of verwijder je hem, kijk dan eerst wat dat daar doet.

| CA-policy | State | Wat deze policy ervoor doet |
|---|---|---|
| 2190 - GRANT - Windows Hello Passkeys | report-only | Bepaalt de PIN van de Windows Hello-passkey die deze CA-policy eist. Strenger dan de gebruiker gewend is, en registreren gaat pas als de PIN aan de eis voldoet. |

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_digits` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_lowercaseletters` | 2 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_uppercaseletters` | 2 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_specialcharacters` | 2 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
