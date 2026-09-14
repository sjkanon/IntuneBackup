<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Compliance Defender for Endpoint Risk

Maakt een apparaat niet-compliant zodra Defender for Endpoint het risiconiveau hoger dan 'gemiddeld' inschat, zodat Conditional Access een apparaat met een actieve dreiging de toegang tot bedrijfsgegevens ontzegt.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Compliance |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | IntuneAdmin/IntuneBaselines — Windows 11 Compliance, 'Microsoft Defender for Endpoint Risk score' (deviceThreatProtectionEnabled, RequiredSecurityLevel medium); body gelijkgetrokken met de OIB v4.0-compliancepolicies, velden geverifieerd tegen DCv1 |
| Bestand | [`Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.json`](Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.json) |

> Geen dubbele velden: alle negen bestaande WIN-compliancepolicies zetten `deviceThreatProtectionEnabled` op false (niet vereist) en het risiconiveau op `unavailable`. 'Gemiddeld' betekent: laag en gemiddeld zijn toegestaan, hoog niet — de waarde uit IntuneAdmin en de Microsoft-aanbeveling om fout-positieven op 'laag' niet tot blokkades te laten leiden. Respijt 0 uur, zoals de andere Defender-toetsen: het doel is juist onmiddellijk handelen. Zet in CA wel een uitzonderingsproces klaar (bijv. tijdelijk uitsluiten na onderzoek), anders zit een gebruiker vast tot het incident in Defender is opgelost. Nieuwere compliancevelden (kernel-DMA, geheugenintegriteit, VBS, firmwarebescherming) staan niet in DCv1 en zijn daarom niet toegevoegd.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.16 Monitoringactiviteiten<br>A.5.15 Toegangsbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>13.1 Centralize Security Event Alerting |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 43

Een compliance-policy heeft geen settingDefinitionId's maar vaste eigenschappen. `scheduledActionsForRule` bepaalt wat er gebeurt als een apparaat niet voldoet.

| Eigenschap | Waarde |
|---|---|
| `deviceThreatProtectionRequiredSecurityLevel` | medium |
| `passwordRequiredType` | deviceDefault |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 0 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `validOperatingSystemBuildRanges` | — |
| `wslDistributions` | — |
| `activeFirewallRequired` | false |
| `antiSpywareRequired` | false |
| `antivirusRequired` | false |
| `bitLockerEnabled` | false |
| `codeIntegrityEnabled` | false |
| `configurationManagerComplianceRequired` | false |
| `defenderEnabled` | false |
| `defenderVersion` | — |
| `deviceCompliancePolicyScript` | — |
| `deviceThreatProtectionEnabled` | true |
| `earlyLaunchAntiMalwareDriverEnabled` | false |
| `firmwareProtectionEnabled` | false |
| `kernelDmaProtectionEnabled` | false |
| `memoryIntegrityEnabled` | false |
| `mobileOsMaximumVersion` | — |
| `mobileOsMinimumVersion` | — |
| `osMaximumVersion` | — |
| `osMinimumVersion` | — |
| `passwordBlockSimple` | false |
| `passwordExpirationDays` | — |
| `passwordMinimumCharacterSetCount` | — |
| `passwordMinimumLength` | — |
| `passwordMinutesOfInactivityBeforeLock` | — |
| `passwordPreviousPasswordBlockCount` | — |
| `passwordRequired` | false |
| `passwordRequiredToUnlockFromIdle` | false |
| `requireHealthyDeviceReport` | false |
| `rtpEnabled` | false |
| `secureBootEnabled` | false |
| `signatureOutOfDate` | false |
| `storageRequireEncryption` | false |
| `tpmRequired` | false |
| `virtualizationBasedSecurityEnabled` | false |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
