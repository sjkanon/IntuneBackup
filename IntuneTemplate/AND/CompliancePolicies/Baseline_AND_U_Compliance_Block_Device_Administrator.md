<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Compliance Block Device Administrator

Merkt elk Android-toestel dat nog met het verouderde device administrator wordt beheerd als niet-compliant, zodat het naar Android Enterprise moet.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | Intune-compliance voor Android device administrator (`securityBlockDeviceAdministratorManagedDevices`); aanbeveling uit UniFy Android Enterprise Baseline v1.5.1, gids 9 (Enrollment Restrictions) |
| Bestand | [`Baseline_AND_U_Compliance_Block_Device_Administrator.json`](Baseline_AND_U_Compliance_Block_Device_Administrator.json) |

> De enige manier om met device administrator nog in te schrijven is een toestel zonder Google Mobile Services (bijv. bepaalde markten); ook daar is AOSP-beheer de opvolger. Na toewijzing krijgt de gebruiker in de Bedrijfsportal de melding dat het toestel naar een werkprofiel moet. App Protection blijft werken, dus Outlook en Teams via Conditional Access 2070 (compliant toestel óf beschermde app) blijven bereikbaar.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.9 Configuratiebeheer |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 7

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `securityBlockDeviceAdministratorManagedDevices` | true |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
