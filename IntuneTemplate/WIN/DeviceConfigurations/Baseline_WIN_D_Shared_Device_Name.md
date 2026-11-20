<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_Device_Name.en.md) · [Français](Baseline_WIN_D_Shared_Device_Name.fr.md)

# [Baseline] - WIN - D - Shared Device Name

Geeft gedeelde Windows-apparaten een herkenbare naam: de klantafkorting, SHR en het serienummer, bijvoorbeeld BC-SHR-7HQ2KX3. Geldt na de volgende herstart.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| Bron | Eigen baseline — Accounts CSP, Domain/ComputerName = %CustomerShort%-SHR-%SERIAL%. %CustomerShort% is een CIPP-variabele per klant; %SERIAL% vult Windows in. |
| Bestand | [`Baseline_WIN_D_Shared_Device_Name.json`](Baseline_WIN_D_Shared_Device_Name.json) |

> Hoort op SG-D-UEM-WIN-Shared. Zet eerst de CIPP-variabele CustomerShort voor de klant (maximaal 3 letters, alleen letters en cijfers): zonder variabele krijgt het apparaat letterlijk %CustomerShort% in de naam en weigert Windows hem. Windows houdt de naam op 15 tekens (NetBIOS) door het serienummer aan de voorkant in te korten: BC-SHR- laat 8 tekens van het serienummer over, ABC-SHR- 7. De nieuwe naam geldt pas na een herstart; Intune herstart niet zelf. Niet voor hybrid joined apparaten (de Accounts CSP ondersteunt dat niet). Een andere naam later kiezen hernoemt elk gedeeld apparaat opnieuw bij de volgende herstart.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.9 Inventarisatie van informatie en andere gerelateerde bedrijfsmiddelen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| NIST CSF 2.0 | ID.AM-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Eigenschappen — 7

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `omaSettings[0].@odata.type` | #microsoft.graph.omaSettingString |
| `omaSettings[0].displayName` | Computer name |
| `omaSettings[0].description` | %CustomerShort% is a CIPP custom variable (max. 3 letters); %SERIAL% is expanded by Windows and cut from th… |
| `omaSettings[0].omaUri` | ./Device/Vendor/MSFT/Accounts/Domain/ComputerName |
| `omaSettings[0].isEncrypted` | false |
| `omaSettings[0].value` | %CustomerShort%-SHR-%SERIAL% |
| `omaSettings[0].isReadOnly` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
