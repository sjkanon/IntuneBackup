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
