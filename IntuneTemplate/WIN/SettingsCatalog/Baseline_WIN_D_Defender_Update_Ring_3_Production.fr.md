<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_Update_Ring_3_Production.md) · [English](Baseline_WIN_D_Defender_Update_Ring_3_Production.en.md) · **Français**

# [Baseline] - WIN - D - Defender Update Ring 3 Production

Anneau de production pour les mises à jour Defender : ne reçoit les définitions et versions de moteur qu'après que les anneaux 1 et 2 les ont exécutées sans problème.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Defender Antivirus Updates - Ring 3 - Production |
| Fichier | [`Baseline_WIN_D_Defender_Update_Ring_3_Production.json`](Baseline_WIN_D_Defender_Update_Ring_3_Production.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.8 Gestion des vulnérabilités techniques<br>A.8.32 Gestion des changements |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.2 Configure Automatic Anti-Malware Signature Updates |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_defender_configuration_engineupdateschannel` | 5 |
| `device_vendor_msft_defender_configuration_platformupdateschannel` | 5 |
| `device_vendor_msft_defender_configuration_securityintelligenceupdateschannel` | 5 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
