<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_for_Endpoint_EDR.md) · [English](Baseline_WIN_D_Defender_for_Endpoint_EDR.en.md) · **Français**

# [Baseline] - WIN - D - Defender for Endpoint EDR

Connecte l'appareil à Defender for Endpoint avec un paquet d'onboarding fixe. Ce paquet est propre au tenant ; dans un autre tenant, il faut refaire la connexion.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityEndpointDetectionAndResponse) |
| Affectation | — |
| Source | baseline propre — OpenIntuneBaseline n'a pas de policy d'onboarding EDR |
| Fichier | [`Baseline_WIN_D_Defender_for_Endpoint_EDR.json`](Baseline_WIN_D_Defender_for_Endpoint_EDR.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.16 Activités de surveillance |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting<br>13.2 Deploy a Host-Based Intrusion Detection Solution |
| NIST CSF 2.0 | DE.CM-09<br>DE.AE-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_windowsadvancedthreatprotection_configurationtype` | autofromconnector |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_windowsadvancedthreatprotection_onboarding_fromconnector` | *(secret — valable uniquement dans le tenant source)* |
| `device_vendor_msft_windowsadvancedthreatprotection_configuration_samplesharing` | 1 |
| `device_vendor_msft_windowsadvancedthreatprotection_configuration_telemetryreportingfrequency` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
