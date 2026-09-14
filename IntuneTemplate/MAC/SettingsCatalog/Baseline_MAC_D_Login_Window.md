<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Login Window

Laat het inlogvenster om accountnaam én wachtwoord vragen in plaats van een lijst met accounts te tonen, en toont een korte melding dat het apparaat alleen voor geautoriseerd gebruik is.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-197-MACDLoginWindow` |
| Bron | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.11.3 (inlogbanner) en 2.11.4 (naam en wachtwoord vragen), mSCP branch tahoe; settingDefinitionId's geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_MAC_D_Login_Window.json`](Baseline_MAC_D_Login_Window.json) |

> Bannertekst: "Alleen voor geautoriseerd gebruik. Activiteit op dit apparaat kan worden vastgelegd. / Authorized use only. Activity on this device may be logged." — generiek, zonder organisatienaam; pas hem aan aan het eigen gebruiksreglement (A.5.10) als dat iets anders zegt. Maximaal 1.032 tekens. Overlap met [Baseline] - MAC - D - Accounts and Login gecontroleerd: die zet in dezelfde payload (com.apple.loginwindow) adminHostInfo, DisableConsoleAccess en HideAdminUsers; deze policy SHOWFULLNAME en LoginwindowText. Andere sleutels, geen dubbele settingDefinitionId; macOS voegt de sleutels uit beide profielen samen. Niet in Accounts and Login gezet omdat die uit OpenIntuneBaseline komt en in fase 1 staat. Het gastaccount staat al uit via Accounts and Login (DisableGuestAccount) en is hier niet herhaald. Twee CIS-regels uit dezelfde sectie kunnen niet via de settings catalog: 2.11.5 wachtwoordhints (RetriesUntilHint) en 2.13.3 automatische aanmelding (com.apple.login.mcx.DisableAutoLoginClient) — de sleutels bestaan daar niet. Automatische aanmelding is met FileVault aan (FileVault-policy) sowieso onmogelijk. Platform SSO met enableCreateUserAtLogin werkt juist beter met een naam-en-wachtwoordveld: een nieuwe gebruiker typt daar zijn Entra-account. SHOWFULLNAME overschrijft 'Show other users managed', die niet is gezet.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.5.10 Aanvaardbaar gebruik |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(g) basispraktijken cyberhygiene en training |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.loginwindow_com.apple.loginwindow` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_showfullname` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.loginwindow_loginwindowtext` | Alleen voor geautoriseerd gebruik. Activiteit op dit apparaat kan worden vastgelegd. / Authorized use only.… |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
