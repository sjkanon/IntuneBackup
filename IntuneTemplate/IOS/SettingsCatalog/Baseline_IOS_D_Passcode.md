<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Passcode

Stelt op ingeschreven iPhones en iPads de toegangscode in die de compliance-policy toetst: minimaal zes tekens, geen eenvoudige code, direct vergrendelen, automatisch vergrendelen na hoogstens vijf minuten, en wissen pas na tien foute pogingen.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-190-IOSDPasscode` |
| Bron | Apple Passcode-payload (com.apple.mobiledevice.passwordpolicy) in de iOS settings catalog, zelfde payload als UniFy iOS/iPadOS Baseline v1.2 — SC - Device Security - BYOD/Corporate; waarden gelijkgetrokken met [Baseline] - IOS - U - Compliance Password, inactiviteit volgens CIS Apple iOS/iPadOS 26 Benchmark |
| Bestand | [`Baseline_IOS_D_Passcode.json`](Baseline_IOS_D_Passcode.json) |

> Keuze voor de klassieke payload en niet voor de declaratieve passcode-configuratie (passcode_*). Beide gelden voor iOS en geen van beide vraagt supervisie, maar DDM kent geen 'geen eenvoudige code': alleen RequireComplexPasscode, dat volgens de definitie ook een teken buiten cijfers en letters eist en daarmee de numerieke code van zes cijfers onmogelijk maakt. De payload hier is dezelfde als in [Baseline] - MAC - D - Passcode and Screen Lock en in beide UniFy-sets. Vijf minuten inactiviteit is strenger dan de vijftien minuten die Compliance Password toetst; een toestel met deze policy is dus altijd compliant. Bewust geen maxpinageindays (NIST SP 800-63B: geen rotatie zonder aanleiding) en geen pinhistory. UniFy Corporate zet 1 minuut en 5 pogingen; een wipe na vijf pogingen is strijdig met de normregel van deze baseline.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>4.10 Enforce Automatic Device Lockout on Portable End-User Devices |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.mobiledevice.passwordpolicy_com.apple.mobiledevice.passwordpolicy` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_forcepin` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_allowsimple` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_minlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxgraceperiod` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxinactivity` | 5 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxfailedattempts` | 10 |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
