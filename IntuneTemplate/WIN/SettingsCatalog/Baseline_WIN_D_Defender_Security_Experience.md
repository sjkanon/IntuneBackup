<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender Security Experience

Bepaalt wat de gebruiker in de Windows-beveiligingsapp ziet en zelf mag uitzetten.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-060-DDefenderSecurityExperience` |
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Defender Antivirus - D - Security Experience |
| Bestand | [`Baseline_WIN_D_Defender_Security_Experience.json`](Baseline_WIN_D_Defender_Security_Experience.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `vendor_msft_defender_configuration_tamperprotection_options` | 0 |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_disablefamilyui` | 1 |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_disableenhancednotifications` | 1 |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_hidewindowssecuritynotificationareacontrol` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
