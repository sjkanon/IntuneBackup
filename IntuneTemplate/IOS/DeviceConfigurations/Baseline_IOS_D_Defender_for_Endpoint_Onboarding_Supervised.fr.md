<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.md) · [English](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.en.md) · **Français**

# CXNM - Standard - IOS - D - Defender for Endpoint Onboarding Supervised

Intègre Microsoft Defender for Endpoint sans action de l'utilisateur sur les appareils d'entreprise supervisés à l'aide d'un profil de filtre de contenu, afin que la protection web fonctionne sans VPN local.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | UniFy iOS/iPadOS Baseline v1.2 — DC - Zero-Touch-Control-Filter - MDE - Corporate Devices (iosCustomConfiguration avec le mobileconfig Control Filter de Microsoft : com.apple.webcontent-filter, plug-in com.microsoft.scmx, SilentOnboard) ; champs vérifiés par rapport à pl4nty DCv1 iOSCustomConfiguration |
| Fichier | [`Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.json`](Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.json) |

> Le fichier mobileconfig a été repris sans modification d'UniFy (Zero-Touch Control Filter de Microsoft, SilentOnboard=true dans VendorConfig) ; il ne contient aucune donnée du tenant. Selon Microsoft, la clé de configuration d'application WebProtection ne s'applique pas à ce profil — la désactivation de la protection web se fait en supprimant ce profil. Ne pas affecter en même temps que la variante Unsupervised : un même appareil recevrait alors deux voies de protection web.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.23 Filtrage web |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>9.3 Maintain and Enforce Network-Based URL Filters |
| NIST CSF 2.0 | DE.CM-09<br>DE.CM-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 3

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `payloadName` | Zero Touch Control Filter MDE |
| `payloadFileName` | Microsoft_Defender_for_Endpoint_Control_Filter_Zerotouch.mobileconfig |
| `payload` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHBsaXN0IFBVQkxJQyAiLS8vQXBwbGUvL0RURCBQTEl… |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
