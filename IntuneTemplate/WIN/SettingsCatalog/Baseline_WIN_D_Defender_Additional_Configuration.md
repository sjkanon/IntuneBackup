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
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Defender Antivirus - D - Additional Configuration |
| Bestand | [`Baseline_WIN_D_Defender_Additional_Configuration.json`](Baseline_WIN_D_Defender_Additional_Configuration.json) |

> Instellingen die niet in het Endpoint Security-antivirustemplate passen en dus een losse Settings Catalog-policy vereisen.

## Instellingen — 9

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_defender_configuration_enableconvertwarntoblock` | 1 |
| `device_vendor_msft_defender_configuration_reporting_enabledynamicsignaturedroppedeventreporting` | 1 |
| `device_vendor_msft_defender_configuration_enablefilehashcomputation` | 1 |
| `device_vendor_msft_defender_configuration_hideexclusionsfromlocaladmins` | 1 |
| `device_vendor_msft_defender_configuration_hideexclusionsfromlocalusers` | 1 |
| `device_vendor_msft_defender_configuration_oobeenablertpandsigupdate` | 1 |
| `device_vendor_msft_defender_configuration_passiveremediation` | 1 |
| `device_vendor_msft_defender_configuration_quickscanincludeexclusions` | 1 |
| `device_vendor_msft_defender_configuration_supportloglocation` | %ProgramData%\Microsoft\IntuneManagementExtension\Logs |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
