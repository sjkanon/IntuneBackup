<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Work Profile Restrictions

Zet op een toestel met persoonlijk werkprofiel een eigen werkprofielcode (zes cijfers, gemiddelde complexiteit, vergrendelt na vijftien minuten, wist na tien pogingen alleen het werkprofiel), blokkeert kopiëren, delen en schermafdrukken van werk naar privé, en zet Play Protect aan.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - DC - DR - USR - Personal-Work-Profile - v1.5; zonder wachtwoordverloop, contact- en beller-ID-blokkades, accountblokkade en blokkade van onbekende bronnen aan de privékant; vergrendeltijd 15 in plaats van 5 minuten, gelijk aan Compliance Password |
| Bestand | [`Baseline_AND_U_Work_Profile_Restrictions.json`](Baseline_AND_U_Work_Profile_Restrictions.json) |

> Bewust níet overgenomen uit UniFy: `workProfilePasswordExpirationDays` (365 — NIST SP 800-63B raadt rotatie af), `workProfileBlockCrossProfileCallerId` en `workProfileBlockCrossProfileContactsSearch` (breken de naam bij een inkomend werkgesprek in de privé-telefoonapp), `workProfileBlockAddingAccounts` en `workProfileAccountUse: blockAll` (kan het toevoegen van het werkaccount in apps laten mislukken, UniFy W-6), `workProfileBlockPersonalAppInstallsFromUnknownSources` (een eis aan de privékant; Compliance Device Health toetst onbekende bronnen al), `workProfileBlockNotificationsWhileDeviceLocked` (App Protection verbergt organisatiegegevens in meldingen al) en `blockUnifiedPasswordForWorkProfile` (zie Compliance Password). `requiredPasswordComplexity: medium` op toestelniveau is een eis aan de privékant, maar dezelfde die Compliance Password en App Protection al stellen — zonder deze regel wordt de gebruiker niet gevraagd hem te zetten en wordt hij alleen niet-compliant. Twee velden (`requiredPasswordComplexity`, `workProfileRequiredPasswordComplexity`) staan niet in de pl4nty-definities maar wel in de Graph-export van UniFy; op Android 12+ zijn zij het die gelden, lengte en type alleen op oudere versies.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.7.7 Clear desk en clear screen<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.5 Veilige authenticatie<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>4.10 Enforce Automatic Device Lockout on Portable End-User Devices<br>4.12 Separate Enterprise Workspaces on Mobile End-User Devices<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-10<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 15

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `passwordBlockTrustAgents` | true |
| `requiredPasswordComplexity` | medium |
| `securityRequireVerifyApps` | true |
| `workProfileRequirePassword` | true |
| `workProfilePasswordRequiredType` | numericComplex |
| `workProfilePasswordMinimumLength` | 6 |
| `workProfileRequiredPasswordComplexity` | medium |
| `workProfilePasswordMinutesOfInactivityBeforeScreenTimeout` | 15 |
| `workProfilePasswordPreviousPasswordBlockCount` | 5 |
| `workProfilePasswordSignInFailureCountBeforeFactoryReset` | 10 |
| `workProfilePasswordBlockTrustAgents` | true |
| `workProfileDataSharingType` | allowPersonalToWork |
| `workProfileBlockCrossProfileCopyPaste` | true |
| `workProfileBlockScreenCapture` | true |
| `workProfileDefaultAppPermissionPolicy` | prompt |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
