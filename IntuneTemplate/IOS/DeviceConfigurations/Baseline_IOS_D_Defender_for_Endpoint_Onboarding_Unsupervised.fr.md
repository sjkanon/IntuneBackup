<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.md) · [English](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.en.md) · **Français**

# [Baseline] - IOS - D - Defender for Endpoint Onboarding Unsupervised

Intègre Microsoft Defender for Endpoint sans action de l'utilisateur sur les appareils inscrits non supervisés via le VPN de bouclage local de Defender, qui assure la protection web sans envoyer de trafic hors de l'appareil.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | UniFy iOS/iPadOS Baseline v1.2 — DC - Zero-Touch-Onboarding-VPN - MDE - BYOD Devices (iosVpnConfiguration : customVpn com.microsoft.scmx, serveur 127.0.0.1, SilentOnboard et SingleSignOn) ; champs vérifiés par rapport à Graph beta iosVpnConfiguration et pl4nty DCv1 |
| Fichier | [`Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.json`](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.json) |

> disableOnDemandUserOverride=true : l'utilisateur ne peut pas désactiver 'Connect On Demand'. Microsoft cite justement la désactivation comme solution pour les applications qui ne fonctionnent pas avec un VPN — un tel utilisateur ne peut alors être aidé qu'en l'excluant de cette policy. iOS ne prend en charge qu'un seul VPN actif à l'échelle de l'appareil à la fois (Microsoft Learn) ; un second profil VPN sur le même appareil alterne avec ce profil. Ne pas affecter en même temps que la variante Supervised.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.23 Filtrage web |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>9.3 Maintain and Enforce Network-Based URL Filters |
| NIST CSF 2.0 | DE.CM-09<br>DE.CM-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 33

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
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

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
