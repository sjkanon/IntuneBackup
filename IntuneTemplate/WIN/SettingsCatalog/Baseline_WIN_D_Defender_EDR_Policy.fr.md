<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_EDR_Policy.md) · [English](Baseline_WIN_D_Defender_EDR_Policy.en.md) · **Français**

# CXNM - Standard - WIN - D - Defender EDR Policy

Connecte l'appareil à Defender for Endpoint via le connecteur Defender au lieu d'un paquet d'onboarding fixe. De ce fait, le modèle ne contient aucun jeton propre au tenant et fonctionne aussi dans un autre tenant après une restauration, à condition que le connecteur Defender for Endpoint y soit activé.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityEndpointDetectionAndResponse) |
| Affectation | All Devices |
| Source | Template standard CIPP |
| Fichier | [`Baseline_WIN_D_Defender_EDR_Policy.json`](Baseline_WIN_D_Defender_EDR_Policy.json) |

> Provient de CIPP, pas d'OIB. Utilisable entre tenants : onboarding_fromconnector est défini sur le placeholder "Microsoft ATP connector enabled" au lieu d'un GUID de tenant fixe. Depuis septembre 2026, c'est la variante déployée ; CXNM - Standard - WIN - D - Defender for Endpoint EDR est en phase 5 comme variante en double. Nécessite que le connecteur Defender for Endpoint soit activé dans Intune.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.16 Activités de surveillance |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 13.1 Centralize Security Event Alerting<br>13.2 Deploy a Host-Based Intrusion Detection Solution |
| NIST CSF 2.0 | DE.CM-09<br>DE.AE-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_windowsadvancedthreatprotection_configuration_samplesharing` | 1 |
| `device_vendor_msft_windowsadvancedthreatprotection_configurationtype` | autofromconnector |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_windowsadvancedthreatprotection_onboarding_fromconnector` | *(secret — valable uniquement dans le tenant source)* |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
