<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - U - Compliance Device Health

Merkt een iPhone of iPad die met een jailbreak is opengebroken als niet-compliant.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | OpenIntuneBaseline-conventie voor compliance, inhoud vergeleken met IntuneAdmin (Baseline - iOSiPadOS - Device Health) en UniFy-Endpoint iOS BYOD. |
| Bestand | [`Baseline_IOS_U_Compliance_Device_Health.json`](Baseline_IOS_U_Compliance_Device_Health.json) |

> Blokkeeractie na 24 uur respijt, zodat een gebruiker eerst een melding krijgt. Wijs 'm pas toe wanneer er daadwerkelijk iOS-apparaten worden ingeschreven; op een tenant zonder inschrijvingen levert hij een lege rapportage op en niets anders. Sinds september 2026 eist deze policy ook een minimale OS-versie (16.0). Die waarde veroudert: draai `node scripts/check-osversion.js` om te zien hoe ver hij achterloopt op de n-1-versie uit endoflife.date. Dat rapport blokkeert niets en hoort dat ook niet te doen — verhogen is een besluit en dus een PR. Deze ondergrens is een actualiteitsdoel (zie `ondergrens`) en mag dus meebewegen, maar niet zonder te kijken hoeveel toestellen eronder zitten.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.7 Bescherming tegen malware<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 25

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `passcodeRequired` | false |
| `passcodeBlockSimple` | false |
| `passcodeMinimumLength` | — |
| `passcodeMinutesOfInactivityBeforeLock` | — |
| `passcodeMinutesOfInactivityBeforeScreenTimeout` | — |
| `passcodeExpirationDays` | — |
| `passcodePreviousPasscodeBlockCount` | — |
| `passcodeMinimumCharacterSetCount` | — |
| `passcodeRequiredType` | deviceDefault |
| `osMinimumVersion` | 16.0 |
| `osMaximumVersion` | — |
| `osMinimumBuildVersion` | — |
| `osMaximumBuildVersion` | — |
| `securityBlockJailbrokenDevices` | true |
| `deviceThreatProtectionEnabled` | false |
| `deviceThreatProtectionRequiredSecurityLevel` | unavailable |
| `advancedThreatProtectionRequiredSecurityLevel` | unavailable |
| `managedEmailProfileRequired` | false |
| `restrictedApps` | — |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
