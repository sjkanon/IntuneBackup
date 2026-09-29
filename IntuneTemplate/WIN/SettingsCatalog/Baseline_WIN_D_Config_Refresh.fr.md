<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Config_Refresh.md) · [English](Baseline_WIN_D_Config_Refresh.en.md) · **Français**

# [Baseline] - WIN - D - Config Refresh

Rétablit périodiquement les paramètres modifiés localement à ce qu'Intune prescrit, afin que les bricolages manuels sur un appareil soient annulés automatiquement.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-058-DConfigRefresh` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Config Refresh |
| Fichier | [`Baseline_WIN_D_Config_Refresh.json`](Baseline_WIN_D_Config_Refresh.json) |

> Rétablit périodiquement les paramètres MDM modifiés localement — l'antidote aux manipulations manuelles sur un appareil.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_dmclient_provider_{providerid}` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_dmclient_provider_{providerid}_configrefresh_enabled` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_dmclient_provider_{providerid}_configrefresh_cadence` | 30 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
