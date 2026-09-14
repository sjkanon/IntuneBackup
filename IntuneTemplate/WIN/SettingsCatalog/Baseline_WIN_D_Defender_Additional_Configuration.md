<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender Additional Configuration

Defender-instellingen die niet in het Endpoint Security-template passen en daarom een losse policy vereisen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-059-DDefenderAdditionalConfiguration` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Defender Antivirus - D - Additional Configuration |
| Bestand | [`Baseline_WIN_D_Defender_Additional_Configuration.json`](Baseline_WIN_D_Defender_Additional_Configuration.json) |

> Instellingen die niet in het Endpoint Security-antivirustemplate passen en dus een losse Settings Catalog-policy vereisen. Sinds OIB v4.0: 'Disallow Exploit Protection Override' aan (gebruikers konden wel exploit-protectioninstellingen maken maar ze zonder beheerrechten niet meer weghalen), en 'Hide Exclusions From Local Users' eruit omdat 'Hide Exclusions From Local Admins' die al impliceert.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>10.5 Enable Anti-Exploitation Features<br>10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 9

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_defender_configuration_enableconvertwarntoblock` | 1 |
| `device_vendor_msft_defender_configuration_reporting_enabledynamicsignaturedroppedeventreporting` | 1 |
| `device_vendor_msft_defender_configuration_enablefilehashcomputation` | 1 |
| `device_vendor_msft_defender_configuration_hideexclusionsfromlocaladmins` | 1 |
| `device_vendor_msft_defender_configuration_oobeenablertpandsigupdate` | 1 |
| `device_vendor_msft_defender_configuration_passiveremediation` | 1 |
| `device_vendor_msft_defender_configuration_quickscanincludeexclusions` | 1 |
| `device_vendor_msft_defender_configuration_supportloglocation` | %ProgramData%\Microsoft\IntuneManagementExtension\Logs |
| `device_vendor_msft_policy_config_windowsdefendersecuritycenter_disallowexploitprotectionoverride` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
