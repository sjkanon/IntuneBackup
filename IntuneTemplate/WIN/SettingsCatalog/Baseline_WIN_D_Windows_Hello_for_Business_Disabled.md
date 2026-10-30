<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Windows_Hello_for_Business_Disabled.en.md) · [Français](Baseline_WIN_D_Windows_Hello_for_Business_Disabled.fr.md)

# [Baseline] - WIN - D - Windows Hello for Business Disabled

Zet Windows Hello for Business uit op gedeelde apparaten: geen PIN of biometrie per gebruiker per toestel. Gebruikers melden zich aan met een FIDO2-beveiligingssleutel of via web sign-in.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen baseline — PassportForWork CSP, UsePassportForWork = false. Microsoft raadt voor gedeelde apparaten FIDO2-beveiligingssleutels aan in plaats van Windows Hello for Business. |
| Bestand | [`Baseline_WIN_D_Windows_Hello_for_Business_Disabled.json`](Baseline_WIN_D_Windows_Hello_for_Business_Disabled.json) |

> Hoort op SEC-Shared-Devices, samen met [Baseline] - WIN - D - Security Key Sign-in: zonder die tweede policy hebben gebruikers op het toestel alleen nog web sign-in. Niet naast [Baseline] - WIN - D - Windows Hello for Business Multi User of [Baseline] - WIN - D - Windows Hello for Business op hetzelfde apparaat: dezelfde instelling met een andere waarde is een Conflict. Die laatste staat in fase 2 op de pilotgroep; zet geen gedeelde apparaten in SEC-Baseline-Pilot, en sluit SEC-Shared-Devices uit zodra hij naar fase 1 gaat. [Baseline] - WIN - U - Windows Hello for Business zet WHfB per gebruiker aan; welke van de twee wint als een gebruiker met die policy zich op een gedeeld apparaat aanmeldt, test je in de pilot. [Baseline] - WIN - D - Passwordless zet de PIN als standaard aanmeldoptie; zonder WHfB kiest de gebruiker de eerste keer zelf de sleutel of web sign-in onder Aanmeldopties.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_passportforwork_{tenantid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_passportforwork_{tenantid}_policies_usepassportforwork` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
