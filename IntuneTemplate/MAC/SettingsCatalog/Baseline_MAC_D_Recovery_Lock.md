<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Recovery Lock

Zet op Macs met Apple silicon een willekeurig, door Intune beheerd wachtwoord op recoveryOS en de opstartopties, en vervangt het elke zes maanden.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-198-MACDRecoveryLock` |
| Bron | Microsoft Learn — Configure Recovery Lock using the settings catalog (juni 2026); vorm uit microsoft/intune-my-macs pol-sec-007-recovery-lock (daar maandelijkse rotatie, hier zes maanden) |
| Bestand | [`Baseline_MAC_D_Recovery_Lock.json`](Baseline_MAC_D_Recovery_Lock.json) |

> Rotatie op 6 maanden (optie _5), gelijk aan de rotatie van de FileVault-herstelsleutel in [Baseline] - MAC - D - FileVault; intune-my-macs roteert maandelijks, wat vooral servicedeskverkeer oplevert zonder dat het risico daalt — het wachtwoord wordt alleen gebruikt wie het opvraagt. Wachtwoord bekijken: Devices → apparaat → Passwords and keys → Recovery Lock Password. Dat vraagt de Intune-rechten 'Remote tasks/View macOS recovery lock password' (en voor rotatie 'Rotate macOS recovery lock password'); beperk wie die heeft, bij voorkeur via PIM. Na gebruik: device action 'Rotate recovery lock passcode'. Uitschrijven uit Intune wist het wachtwoord van de Mac; de toewijzing weghalen laat Intune het proberen te wissen. Een Mac die de organisatie verlaat dus eerst uitschrijven, dan vrijgeven in Apple Business (zie extras/macos/apple-business).

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein<br>A.8.18 Gebruik van speciale systeemhulpmiddelen<br>A.5.17 Authenticatie-informatie |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-05<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `setrecoverylock_setrecoverylock` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`setrecoverylock_enablerecoverylockpassword` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`setrecoverylock_recoverylockpasswordrotationschedule` | 5 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
