<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Defender for Endpoint Onboarding Unsupervised

Onboardt Microsoft Defender for Endpoint zonder gebruikersactie op niet-supervised ingeschreven toestellen via Defender's lokale loopback-VPN, die webbescherming levert zonder verkeer van het toestel te sturen.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy iOS/iPadOS Baseline v1.2 — DC - Zero-Touch-Onboarding-VPN - MDE - BYOD Devices (iosVpnConfiguration: customVpn com.microsoft.scmx, server 127.0.0.1, SilentOnboard en SingleSignOn); velden geverifieerd tegen Graph beta iosVpnConfiguration en pl4nty DCv1 |
| Bestand | [`Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.json`](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.json) |

> disableOnDemandUserOverride=true: de gebruiker kan 'Connect On Demand' niet uitzetten. Microsoft noemt uitzetten juist als oplossing voor apps die niet met een VPN samenwerken — zo'n gebruiker is dan alleen te helpen door hem van deze policy uit te sluiten. iOS ondersteunt maar één actieve apparaatbrede VPN tegelijk (Microsoft Learn); een tweede VPN-profiel op hetzelfde toestel wisselt met dit profiel. Niet samen toewijzen met de Supervised-variant.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.23 Webfiltering |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>9.3 Maintain and Enforce Network-Based URL Filters |
| NIST CSF 2.0 | DE.CM-09<br>DE.CM-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 33

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `connectionName` | Microsoft Defender |
| `connectionType` | customVpn |
| `identifier` | com.microsoft.scmx |
| `authenticationMethod` | usernameAndPassword |
| `enableSplitTunneling` | false |
| `enablePerApp` | false |
| `server.@odata.type` | #microsoft.graph.vpnServer |
| `server.description` | server |
| `server.address` | 127.0.0.1 |
| `server.isDefaultServer` | true |
| `customData[0].@odata.type` | #microsoft.graph.keyValue |
| `customData[0].key` | SilentOnboard |
| `customData[0].value` | True |
| `customData[1].@odata.type` | #microsoft.graph.keyValue |
| `customData[1].key` | SingleSignOn |
| `customData[1].value` | True |
| `customKeyValueData[0].@odata.type` | #microsoft.graph.keyValuePair |
| `customKeyValueData[0].name` | SilentOnboard |
| `customKeyValueData[0].value` | True |
| `customKeyValueData[1].@odata.type` | #microsoft.graph.keyValuePair |
| `customKeyValueData[1].name` | SingleSignOn |
| `customKeyValueData[1].value` | True |
| `onDemandRules[0].@odata.type` | #microsoft.graph.vpnOnDemandRule |
| `onDemandRules[0].ssids` | — |
| `onDemandRules[0].dnsSearchDomains` | — |
| `onDemandRules[0].probeUrl` | — |
| `onDemandRules[0].action` | connect |
| `onDemandRules[0].domainAction` | connectIfNeeded |
| `onDemandRules[0].domains` | — |
| `onDemandRules[0].probeRequiredUrl` | — |
| `onDemandRules[0].interfaceTypeMatch` | notConfigured |
| `onDemandRules[0].dnsServerAddressMatch` | — |
| `disableOnDemandUserOverride` | true |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
