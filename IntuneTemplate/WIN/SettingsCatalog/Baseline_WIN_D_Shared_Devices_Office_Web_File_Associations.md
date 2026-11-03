<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.en.md) · [Français](Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.fr.md)

# [Baseline] - WIN - D - Shared Devices Office Web File Associations

Maakt op gedeelde apparaten de app Office op het web standaard voor Word-, Excel- en PowerPoint-bestanden, zodat een dubbelklik op een bestand in OneDrive of SharePoint het opent in Office voor het web, en opent scripts zoals .js, .vbs en .hta met Kladblok.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen baseline — Policy CSP ApplicationDefaults/DefaultAssociationsConfiguration met de ProgIds van de Win32-app IntuneTemplate/WIN/Apps/office-web-open, plus de koppelingen van [Baseline] - WIN - D - Script File Associations. |
| Bestand | [`Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.json`](Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.json) |

> Hoort op SG-D-UEM-WIN-Shared, samen met de Win32-app Office op het web (IntuneTemplate/WIN/Apps/office-web-open) op dezelfde groep. Zonder die app wijst de koppeling naar een ProgId die niet bestaat en negeert Windows hem. Bevat ook de scriptkoppelingen van [Baseline] - WIN - D - Script File Associations: twee policies met Default Associations Configuration op één toestel zijn een Conflict. Die policy staat in fase 2 op de pilot, waar gedeelde apparaten niet in horen; sluit SG-D-UEM-WIN-Shared uit zodra hij naar fase 1 gaat, en neem een wijziging aan zijn lijst hier over. Windows past de koppelingen toe bij het aanmelden.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer<br>A.8.19 Installatie van software op operationele systemen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_applicationdefaults_defaultassociationsconfiguration` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPERlZmF1bHRBc3NvY2lhdGlvbnM+CiAgPEFzc29jaWF0aW9uIElkZW5… |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
