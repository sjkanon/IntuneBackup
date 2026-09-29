<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Update_Reports_and_Telemetry.md) · [English](Baseline_WIN_D_Update_Reports_and_Telemetry.en.md) · **Français**

# [Baseline] - WIN - D - Update Reports and Telemetry

Envoie les données de diagnostic dont Windows Update for Business Reports a besoin pour montrer quels appareils sont en retard.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-083-DUpdateReportsAndTelemetry` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Windows Update for Business - D - Reports and Telemetry |
| Fichier | [`Baseline_WIN_D_Update_Reports_and_Telemetry.json`](Baseline_WIN_D_Update_Reports_and_Telemetry.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(f) évaluation de l'efficacité |
| NIST CSF 2.0 | DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_system_allowdevicenameindiagnosticdata` | 1 |
| `device_vendor_msft_policy_config_system_allowtelemetry` | 3 |
| `device_vendor_msft_policy_config_system_configuretelemetryoptinchangenotification` | 1 |
| `device_vendor_msft_policy_config_system_configuretelemetryoptinsettingsux` | 1 |
| `device_vendor_msft_policy_config_update_allowtemporaryenterprisefeaturecontrol` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
