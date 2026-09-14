<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Passcode and Screen Lock

Stelt op de Mac het wachtwoord en de schermvergrendeling in die de compliance-policy al eist: minimaal acht tekens, geen eenvoudig wachtwoord, vergrendelen na vijftien minuten.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-121-MACDPasscodeAndScreenLock` |
| Bron | Apple Passcode-payload (com.apple.mobiledevice.passwordpolicy) in de macOS settings catalog — waarden één op één overgenomen uit [Baseline] - MAC - U - Compliance Password en geverifieerd tegen de settings catalog-definities (minLength max 16, maxInactivity max 15). |
| Bestand | [`Baseline_MAC_D_Passcode_and_Screen_Lock.json`](Baseline_MAC_D_Passcode_and_Screen_Lock.json) |

> maxInactivity kan in de settings catalog niet hoger dan 15 minuten — dat is toevallig exact de waarde die de compliance-policy vraagt. maxFailedAttempts is bewust weggelaten: op macOS leidt dat tot een oplopende wachttijd en uiteindelijk een blokkade die alleen met de FileVault-herstelsleutel te openen is, en dat is een aparte afweging. Deze policy zet géén com.apple.applicationaccess- of com.apple.screensaver-instelling en botst dus niet met MAC - D - Restrictions. Let op: gebruikers met een korter of eenvoudiger wachtwoord moeten het bij de eerstvolgende aanmelding wijzigen. Sinds september 2026 zet [Baseline] - MAC - D - Screensaver de com.apple.screensaver-sleutels: wachtwoord vragen 5 seconden na het starten van de schermbeveiliging en de schermbeveiliging na 900 seconden, ook in het inlogvenster. Dat zijn dezelfde 15 minuten als maxInactivity hier, met andere settingDefinitionId's — geen conflict, en samen pas een Mac die na 15 minuten écht een wachtwoord vraagt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.7.7 Clear desk en clear screen<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 8

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.mobiledevice.passwordpolicy_com.apple.mobiledevice.passwordpolicy` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_forcepin` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_requirealphanumeric` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_allowsimple` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_minlength` | 8 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_mincomplexchars` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_pinhistory` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxinactivity` | 15 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
