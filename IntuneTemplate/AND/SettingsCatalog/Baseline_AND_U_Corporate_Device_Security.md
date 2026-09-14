<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Corporate Device Security

Hardt fully managed en corporate-owned Android-toestellen: code van zes cijfers (numeriek complex) die na tien pogingen wist, dagelijks één keer de code in plaats van alleen biometrie, scherm hoogstens vijftien minuten aan, Play Protect en automatische app-updates aan, geen bestandsoverdracht via USB of externe opslag, geen 2G, geen handmatige tijd, geen Private Space en geen delen van werk naar privé.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-181-ANDUCorporateDeviceSecurity` |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - SC - DR - DEV - Device-Password, System-Security, Applications, Connectivity, General-Settings en Data-Sharing-Controls (Fully-Managed en Corp-Work-Profile) - v1.5; USB-toegang op bestandsoverdracht in plaats van alle data, zonder wachtwoordverloop, schermtime-out 15 minuten |
| Bestand | [`Baseline_AND_U_Corporate_Device_Security.json`](Baseline_AND_U_Corporate_Device_Security.json) |

> Bewust `usbdataaccess_disallowusbfiletransfer` en niet `disallowusbdatatransfer` (UniFy): die laatste blokkeert álle USB-data, dus ook bedrade headsets, docks en Android Auto. Niet overgenomen uit de UniFy-corporate set: `airplanemodeblocked` (vliegtuigmodus onmogelijk), `minimumwifisecuritylevel_personalnetworksecurity` (open en gastnetwerken zoals in hotels en treinen werken niet meer), `cellularblockwifitethering`, `wifidirectsettings_disallowed`, `ultrawidebandblocked`, `vpnconfigblocked`, `mobilenetworksconfigblocked`, `networkresetblocked` en `cellbroadcastsconfigblocked` (breken thuiswerken of reizen, of zijn geen beveiligingswinst), `accountsblockmodification` en `certificatecredentialconfigurationdisabled` (vragen eerst automatische accountinrichting en een SCEP/PKCS-profiel, UniFy W-5/W-6), `locationmode_enforced` (locatie altijd aan is een privacybesluit), `securitycommoncriteriamodeenabled` (alleen Samsung, W-25), `passwordexpirationdays` (NIST SP 800-63B), `bluetoothblockcontactsharing` (geen bellernaam meer in de auto) en `passwordblockkeyguard_true` (dat is *Disable lock screen* — in UniFy FM een fout). Ook niet: `appsallowinstallfromunknownsources_false` en `securitydevelopersettingsenabled_false` — bij deze Android-instellingen betekent `_false` "niet geconfigureerd", en voor device owner-toestellen staan beide al standaard dicht. Het schermtime-out (`screentimeout`, 900 seconden) begrenst hoe lang het scherm aan blijft; de vergrendeltijd zelf wordt door Compliance Corporate Password getoetst. 2G-blokkade: in regio's met alleen 2G-dekking is er geen mobiel bereik meer; noodoproepen blijven werken. App-updates op `always` werken ook over mobiele data; wie line-of-business-apps eerst wil testen kiest `wifionly` of een eigen updatebeleid (UniFy W-9).

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.7.7 Clear desk en clear screen<br>A.7.10 Opslagmedia<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.5 Veilige authenticatie<br>A.8.7 Bescherming tegen malware<br>A.8.8 Beheer van technische kwetsbaarheden<br>A.8.12 Voorkomen van datalekken<br>A.8.17 Kloksynchronisatie<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.3 Configure Automatic Session Locking on Enterprise Assets<br>4.10 Enforce Automatic Device Lockout on Portable End-User Devices<br>4.12 Separate Enterprise Workspaces on Mobile End-User Devices<br>7.4 Perform Automated Application Patch Management<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01<br>PR.PS-01<br>PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 14

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.android.devicerestrictionpolicy.passwordrequiredtype` | numericcomplex |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.android.devicerestrictionpolicy.passwordminimumlength` | 6 |
| `com.android.devicerestrictionpolicy.passwordsigninfailurecountbeforefactoryreset` | 10 |
| `com.android.devicerestrictionpolicy.passwordpreviouspasswordcounttoblock` | 5 |
| `com.android.devicerestrictionpolicy.passwordrequireunlock` | requiredpasswordunlockdailyoption |
| `com.android.devicerestrictionpolicy.screentimeout` | 900 |
| `com.android.devicerestrictionpolicy.securityrequireverifyapps` | true |
| `com.android.devicerestrictionpolicy.appsautoupdatepolicy` | always |
| `com.android.devicerestrictionpolicy.usbdataaccess` | disallowusbfiletransfer |
| `com.android.devicerestrictionpolicy.storageblockexternalmedia` | true |
| `com.android.devicerestrictionpolicy.cellulartwogblocked` | true |
| `com.android.devicerestrictionpolicy.datetimeconfigurationblocked` | true |
| `com.android.devicerestrictionpolicy.privatespacepolicy` | disallowed |
| `com.android.devicerestrictionpolicy.crossprofilepoliciesallowdatasharing` | datasharingfromworktopersonalblocked |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
