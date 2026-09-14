<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Screensaver

Vraagt het wachtwoord uiterlijk vijf seconden nadat de schermbeveiliging start, en start de schermbeveiliging na vijftien minuten inactiviteit — ook in het inlogvenster.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-200-MACDScreensaver` |
| Bron | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.11.1 en 2.11.2 (mSCP branch tahoe, cis_lvl1); vorm uit OpenIntuneBaseline macOS v2.0 beta — SC - Device Security - D - Screensaver, met askForPasswordDelay 5 in plaats van 60 |
| Bestand | [`Baseline_MAC_D_Screensaver.json`](Baseline_MAC_D_Screensaver.json) |

> Bewuste afwijking van OpenIntuneBaseline v2.0 beta: die zet askForPasswordDelay op 60 seconden, deze policy op 5, de CIS-waarde. Zestig seconden betekent dat wie wegloopt terwijl de schermbeveiliging net start een minuut een open Mac achterlaat; met Touch ID kost direct ontgrendelen de gebruiker bijna niets. OIB's moduleName (Flurry) is weggelaten: cosmetisch. Samenhang met [Baseline] - MAC - D - Passcode and Screen Lock: daar staat maxInactivity op 15 minuten (com.apple.mobiledevice.passwordpolicy), wat macOS vertaalt naar een maximum voor de schermbeveiliging. Hier staan idleTime (com.apple.screensaver.user) en loginWindowIdleTime (com.apple.screensaver) op 900 seconden: dezelfde 15 minuten, andere settingDefinitionId's, dus geen Intune-conflict en geen tegenstrijdige waarde. maxGracePeriod is in die policy niet gezet; askForPasswordDelay hier is daarmee de enige respijtperiode. com.apple.screensaver.user is in de settings catalog een eigen payload; microsoft/intune-my-macs (pol-sec-005) levert hem in dezelfde vorm op apparaatniveau. Controleer in de pilot met `sudo profiles show -type configuration` dat idleTime aankomt; komt hij niet aan, dan dekt maxInactivity de 15 minuten al.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.7 Clear desk en clear screen<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.screensaver_com.apple.screensaver` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver_askforpassword` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver_askforpassworddelay` | 5 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver_loginwindowidletime` | 900 |
| `com.apple.screensaver.user_com.apple.screensaver.user` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.screensaver.user_idletime` | 900 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
