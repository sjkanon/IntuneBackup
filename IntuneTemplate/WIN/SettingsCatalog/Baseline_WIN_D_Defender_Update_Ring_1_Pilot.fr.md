<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_Update_Ring_1_Pilot.md) · [English](Baseline_WIN_D_Defender_Update_Ring_1_Pilot.en.md) · **Français**

# [Baseline] - WIN - D - Defender Update Ring 1 Pilot

Récupère en premier les nouvelles définitions et versions de moteur Defender, afin de repérer une mauvaise mise à jour avant que le reste de l'organisation ne la reçoive.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Defender Antivirus Updates - Ring 1 - Pilot |
| Fichier | [`Baseline_WIN_D_Defender_Update_Ring_1_Pilot.json`](Baseline_WIN_D_Defender_Update_Ring_1_Pilot.json) |

> Les anneaux définissent les trois mêmes paramètres avec des valeurs différentes. Seul l'anneau 3 est sur All Devices ; les anneaux 1 et 2 doivent aller sur un groupe pilote/UAT et n'ont donc pas d'affectation.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.8 Gestion des vulnérabilités techniques<br>A.8.32 Gestion des changements |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.2 Configure Automatic Anti-Malware Signature Updates |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_defender_configuration_engineupdateschannel` | 3 |
| `device_vendor_msft_defender_configuration_platformupdateschannel` | 3 |
| `device_vendor_msft_defender_configuration_securityintelligenceupdateschannel` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
