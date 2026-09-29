<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_Security_Experience.md) · [English](Baseline_WIN_D_Defender_Security_Experience.en.md) · **Français**

# [Baseline] - WIN - D - Defender Security Experience

Détermine ce que l'utilisateur voit dans l'application Sécurité Windows et ce qu'il peut désactiver lui-même.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-060-DDefenderSecurityExperience` |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Defender Antivirus - D - Security Experience |
| Fichier | [`Baseline_WIN_D_Defender_Security_Experience.json`](Baseline_WIN_D_Defender_Security_Experience.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `vendor_msft_defender_configuration_tamperprotection_options` | 0 |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_disablefamilyui` | 1 |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_disableenhancednotifications` | 1 |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_hidewindowssecuritynotificationareacontrol` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
