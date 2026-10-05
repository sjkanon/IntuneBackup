<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Kernel_DMA_Protection.md) · [English](Baseline_WIN_D_Kernel_DMA_Protection.en.md) · **Français**

# [Baseline] - WIN - D - Kernel DMA Protection

Bloque les périphériques qui peuvent lire directement la mémoire et ne prennent pas en charge le remappage DMA.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Microsoft Security Baseline (Windows 365 / Endpoint Security) via IntuneAdmin — valeur vérifiée par rapport à Policy CSP DmaGuard/DeviceEnumerationPolicy. |
| Fichier | [`Baseline_WIN_D_Kernel_DMA_Protection.json`](Baseline_WIN_D_Kernel_DMA_Protection.json) |

> Le seul impact réel : une ancienne station d'accueil, une carte graphique externe ou une carte PCIe sans remappage DMA ne fonctionne plus. L'appareil lui-même continue de fonctionner normalement — le périphérique n'est simplement pas démarré. Testez donc avec les stations d'accueil présentes dans la flotte avant d'affecter largement. Nécessite un redémarrage pour prendre effet, et ne s'applique pas aux périphériques 1394, PCMCIA et ExpressCard.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Sécurité des actifs hors des locaux<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_dmaguard_deviceenumerationpolicy` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
