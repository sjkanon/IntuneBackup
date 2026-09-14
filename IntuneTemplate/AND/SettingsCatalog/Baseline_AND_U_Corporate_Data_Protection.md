<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Corporate Data Protection

Blokkeert op fully managed en corporate-owned Android-toestellen schermafdrukken, delen van bestanden via Bluetooth en het terugzetten naar fabrieksinstellingen door de gebruiker.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-180-ANDUCorporateDataProtection` |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - SC - DR - DEV - General-Settings en Connectivity (Fully-Managed en Corp-Work-Profile) - v1.5 |
| Bestand | [`Baseline_AND_U_Corporate_Data_Protection.json`](Baseline_AND_U_Corporate_Data_Protection.json) |

> Bluetooth-headsets, auto's en wearables blijven werken: `bluetoothblocksharing` blokkeert alleen het delen van bestanden, niet koppelen. Wie schermafdrukken voor supportdoeleinden nodig heeft (bijv. een helpdesk die screenshots vraagt), wijst deze policy niet toe of maakt een uitzonderingsgroep. Een fabrieksreset via herstelmodus blijft technisch mogelijk; daarna voorkomt Factory Reset Protection met het beheerdersaccount pas misbruik als `factoryResetDeviceAdministratorEmails` is ingevuld — dat is tenantspecifiek en staat daarom niet in deze policy. Het blokkeren van assistent- en AI-functies staat los hiervan in Corporate AI Restricted.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 3.13 Deploy a Data Loss Prevention Solution<br>4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.DS-01<br>PR.DS-10<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.android.devicerestrictionpolicy.screencaptureblocked` | true |
| `com.android.devicerestrictionpolicy.bluetoothblocksharing` | disallowed |
| `com.android.devicerestrictionpolicy.factoryresetblocked` | true |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
