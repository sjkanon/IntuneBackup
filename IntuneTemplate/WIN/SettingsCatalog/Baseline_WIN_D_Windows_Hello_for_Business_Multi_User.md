<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Hello for Business Multi User

Windows Hello for Business voor gedeelde apparaten waar meerdere gebruikers op inloggen. Zelfde eisen als de gewone apparaatpolicy, maar zonder inrichting direct na het aanmelden: op een gedeeld apparaat zou elke gebruiker anders bij de eerste aanmelding door de PIN-inrichting worden geleid.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-113-DWindowsHelloForBusinessMultiUser` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Windows Hello for Business - D - WHfB Configuration, aangevuld met DisablePostLogonProvisioning |
| Bestand | [`Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.json`](Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.json) |

> Bewust zonder toewijzing: hoort op een groep met gedeelde apparaten. Geen Endpoint Security-template maar een gewone Settings Catalog-policy, omdat DisablePostLogonProvisioning niet in het Account Protection-template zit. De vier overlappende instellingen staan op dezelfde waarde als in de apparaatpolicy, dus naast elkaar op hetzelfde apparaat levert dat geen conflict op — deze policy voegt alleen DisablePostLogonProvisioning toe.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_requiresecuritydevice` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_pincomplexity_minimumpinlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_enablepinrecovery` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_disablepostlogonprovisioning` | true |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
