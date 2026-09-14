<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Script File Associations

Laat .js-, .vbs- en .hta-bestanden openen in Kladblok in plaats van in de scripthost, zodat dubbelklikken op zo'n bijlage niets uitvoert.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-079-DScriptFileAssociations` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Script File Associations |
| Bestand | [`Baseline_WIN_D_Script_File_Associations.json`](Baseline_WIN_D_Script_File_Associations.json) |

> Opent .js/.vbs/.hta met Kladblok in plaats van de scripthost — dubbelklikken op een bijlage voert dan niets uit.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 9.6 Block Unnecessary File Types |
| NIST CSF 2.0 | PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_applicationdefaults_defaultassociationsconfiguration` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxEZWZhdWx0QXNzb2NpYXRpb25zPg0KICA8QXNzb2NpYXRpb24gSWR… |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
