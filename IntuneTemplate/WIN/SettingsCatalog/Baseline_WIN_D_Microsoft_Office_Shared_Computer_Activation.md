<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.en.md) · [Français](Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.fr.md)

# [Baseline] - WIN - D - Microsoft Office Shared Computer Activation

Laat Microsoft 365 Apps op gedeelde apparaten per aangemelde gebruiker activeren in plaats van één keer per toestel, zodat iedereen Office met de eigen licentie gebruikt en het toestel niet meetelt voor de installatielimiet van één gebruiker.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen baseline — Office-ADMX, Microsoft Office 2016 (Machine) > Licensing Settings > Use shared computer activation (L_SharedComputerLicensing = 1). Microsoft schrijft dit voor bij Microsoft 365 Apps op toestellen die meerdere mensen gebruiken. |
| Bestand | [`Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.json`](Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.json) |

> Hoort op SG-D-UEM-WIN-Shared, naast [Baseline] - WIN - D - Shared PC of [Baseline] - WIN - D - Shared PC Domain and Guest. Het licentietoken staat in het gebruikersprofiel en gaat mee weg als Shared PC het profiel opruimt; bij de volgende aanmelding haalt Office een nieuw token op, dus de eerste keer Office openen vraagt een internetverbinding. Elke gebruiker heeft een licentie nodig die Shared Computer Activation ondersteunt. Een Shared PC-gast heeft geen Entra-account en dus geen Office-licentie. Is Office op het toestel al per apparaat geactiveerd, dan blijft die activering staan: begin bij voorkeur met een schoon apparaat (Autopilot reset), net als bij Shared PC.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.32 Intellectuele-eigendomsrechten<br>A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_licensingsettings_l_sharedcomputerlicensing` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
