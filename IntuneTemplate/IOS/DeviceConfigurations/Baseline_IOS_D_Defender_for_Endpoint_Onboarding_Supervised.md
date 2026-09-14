<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Defender for Endpoint Onboarding Supervised

Onboardt Microsoft Defender for Endpoint zonder gebruikersactie op supervised bedrijfstoestellen met een content filter-profiel, zodat webbescherming werkt zonder lokale VPN.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | UniFy iOS/iPadOS Baseline v1.2 — DC - Zero-Touch-Control-Filter - MDE - Corporate Devices (iosCustomConfiguration met Microsoft's Control Filter-mobileconfig: com.apple.webcontent-filter, plug-in com.microsoft.scmx, SilentOnboard); velden geverifieerd tegen pl4nty DCv1 iOSCustomConfiguration |
| Bestand | [`Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.json`](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.json) |

> Het mobileconfig-bestand is ongewijzigd overgenomen uit UniFy (Microsoft's Zero-Touch Control Filter, SilentOnboard=true in VendorConfig); het bevat geen tenantgegevens. De app-configuratiesleutel WebProtection geldt volgens Microsoft niet voor dit profiel — webbescherming uitzetten gaat door dit profiel te verwijderen. Niet samen toewijzen met de Unsupervised-variant: dan krijgt één toestel twee webbeschermingsroutes.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.23 Webfiltering |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>9.3 Maintain and Enforce Network-Based URL Filters |
| NIST CSF 2.0 | DE.CM-09<br>DE.CM-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Eigenschappen — 3

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `payloadName` | Zero Touch Control Filter MDE |
| `payloadFileName` | Microsoft_Defender_for_Endpoint_Control_Filter_Zerotouch.mobileconfig |
| `payload` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHBsaXN0IFBVQkxJQyAiLS8vQXBwbGUvL0RURCBQTEl… |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
