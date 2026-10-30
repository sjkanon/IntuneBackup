<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Security_Key_Sign_in.en.md) · [Français](Baseline_WIN_D_Security_Key_Sign_in.fr.md)

# [Baseline] - WIN - D - Security Key Sign-in

Laat gebruikers zich op gedeelde apparaten aanmelden met een FIDO2-beveiligingssleutel of NFC-badge, zonder wachtwoord en zonder Windows Hello for Business op het toestel in te richten.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| Bron | Eigen baseline — OMA-URI ./Device/Vendor/MSFT/PassportForWork/SecurityKey/UseSecurityKeyForSignin = 1, zoals in IntuneAdmin/IntuneBaselines (Baseline - Enables FIDO Security Keys to be used during Windows Sign In). |
| Bestand | [`Baseline_WIN_D_Security_Key_Sign_in.json`](Baseline_WIN_D_Security_Key_Sign_in.json) |

> Hoort op SEC-Shared-Devices. De gebruiker heeft een passkey nodig op een FIDO2-sleutel of badge, geregistreerd in Entra; zet de authenticatiemethode Passkey (FIDO2) daarvoor aan in de Entra-policy voor authenticatiemethoden. Een custom profiel (OMA-URI) in plaats van Settings Catalog, omdat de Settings Catalog-ID niet in een bron is na te gaan; het is dezelfde instelling als in IntuneAdmin. Werkt zonder Windows Hello for Business op het toestel: test op het eerste apparaat dat de optie Beveiligingssleutel op het aanmeldscherm staat naast [Baseline] - WIN - D - Windows Hello for Business Disabled.

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
| `omaSettings[0].displayName` | Turn on FIDO Security Keys for Windows Sign-In |
| `omaSettings[0].description` | — |
| `omaSettings[0].omaUri` | ./Device/Vendor/MSFT/PassportForWork/SecurityKey/UseSecurityKeyForSignin |
| `omaSettings[0].isEncrypted` | false |
| `omaSettings[0].value` | 1 |
| `omaSettings[0].isReadOnly` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
