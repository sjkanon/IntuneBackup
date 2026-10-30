<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Passkey_Access.en.md) · [Français](Baseline_WIN_D_Passkey_Access.fr.md)

# [Baseline] - WIN - D - Passkey Access

Geeft apps op Windows toegang tot passkeys, zodat aanmelden met een passkey werkt in apps en in een externe sessie (Windows App, Azure Virtual Desktop) zonder dat de gebruiker de privacy-instelling zelf moet aanzetten.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | All Devices |
| Bron | Eigen baseline — OMA-URI ./Device/Vendor/MSFT/Policy/Config/Privacy/LetAppsAccessPasskeys = 1 (Force allow), Policy CSP Privacy. |
| Bestand | [`Baseline_WIN_D_Passkey_Access.json`](Baseline_WIN_D_Passkey_Access.json) |

> Custom profiel (OMA-URI): de instelling staat nog niet in de Settings Catalog. Microsoft documenteert hem voor Windows Insider Preview; kent een build hem niet, dan meldt Intune een fout voor deze instelling en verandert er niets. Force allow zet ook de lijst per app vast; wie één app toch wil weigeren, gebruikt LetAppsAccessPasskeys_ForceDenyTheseApps.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| NIST CSF 2.0 | PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Eigenschappen — 7

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `omaSettings[0].@odata.type` | #microsoft.graph.omaSettingInteger |
| `omaSettings[0].displayName` | Let apps access passkeys (Force allow) |
| `omaSettings[0].description` | — |
| `omaSettings[0].omaUri` | ./Device/Vendor/MSFT/Policy/Config/Privacy/LetAppsAccessPasskeys |
| `omaSettings[0].isEncrypted` | false |
| `omaSettings[0].value` | 1 |
| `omaSettings[0].isReadOnly` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
