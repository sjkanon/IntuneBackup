<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Automatic Restart Sign-On

Meldt de gebruiker na een herstart voor updates automatisch en vergrendeld weer aan, zodat opstartprogramma's draaien zonder dat het apparaat onbeheerd ontgrendeld staat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-056-DAutomaticRestartSignOn` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - D - Automatic Restart Sign-On |
| Bestand | [`Baseline_WIN_D_Automatic_Restart_Sign_On.json`](Baseline_WIN_D_Automatic_Restart_Sign_On.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_windowslogon_configautomaticrestartsignon` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_windowslogon_configautomaticrestartsignon_configautomaticrestartsignondescription` | 0 |
| `device_vendor_msft_policy_config_windowslogon_allowautomaticrestartsignon` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
