<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.en.md) · [Français](Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.fr.md)

# [Baseline] - WIN - D - AVD Defender FSLogix Exclusions

Sluit op de AVD-sessiehosts de FSLogix-containers op het share, de tijdelijke VHD(X)-bestanden, de FSLogix-mappen en -stuurprogramma's en de twee FSLogix-diensten uit van de Defender-scan, zoals Microsoft voor FSLogix voorschrijft.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | Microsoft Learn — Prerequisites for FSLogix, Configure Antivirus file and folder exclusions (geraadpleegd op 9 oktober 2026) |
| Bestand | [`Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.json`](Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.json) |

> Het opslagaccount staat als CIPP-variabele %FSLogixStorageAccount% in het pad: zet die per tenant in CIPP (Settings → Custom Variables) op de naam van het opslagaccount, vóór de eerste run. Wie met IntuneBackupAndRestore uitrolt vult de naam met de hand in (in local/). Dezelfde variabele als in [Baseline] - WIN - D - AVD FSLogix Profile Containers. Uit de lijst van Microsoft staan hier niet in: de registersleutels HKLM\SOFTWARE\FSLogix en HKLM\SOFTWARE\Policies\FSLogix (Defender kent geen registeruitsluitingen; die regel is voor andere beveiligings- en DLP-software) en de koppelpunten van de containers (geen vast pad). C:\Users\%username%\AppData\Local\FSLogix staat er als C:\Users\*\AppData\Local\FSLogix in, omdat Defender geen gebruikersvariabelen kent. %TEMP% legt Defender uit in de systeemcontext; de regel staat er toch, zoals Microsoft hem noemt. Als procesuitsluiting noemt Microsoft alleen frxsvc.exe en frxccds.exe; frxccd.exe en frxrobocopy.exe vallen onder de mapuitsluiting van %ProgramFiles%\FSLogix\Apps. Geen andere policy in de baseline zet excludedpaths of excludedprocesses, dus er is geen conflict. Komen er later uitsluitingen voor alle toestellen bij, dan zet een tweede Settings Catalog-policy dezelfde instelling met een andere lijst: dat is een Conflict. [Baseline] - WIN - D - Defender Additional Configuration verbergt de uitsluitingen voor lokale beheerders.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.9 Configuratiebeheer |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_defender_excludedpaths` | %TEMP%\*\*.VHD, %TEMP%\*\*.VHDX, %Windir%\TEMP\*\*.VHD, %Windir%\TEMP\*\*.VHDX, %ProgramData%\FSLogix\Cache\*, %ProgramData%\FSLogix\Proxy\*, %ProgramFiles%\FSLogix\Apps, %ProgramData%\FSLogix, C:\Users\*\AppData\Local\FSLogix, %ProgramFiles%\FSLogix\Apps\frxdrv.sys, %ProgramFiles%\FSLogix\Apps\frxdrvvt.sys, %ProgramFiles%\FSLogix\Apps\frxccd.sys, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHD, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHD.lock, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHD.meta, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHD.metadata, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHDX, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHDX.lock, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHDX.meta, \\%FSLogixStorageAccount%.file.core.windows.net\profiles\*\*.VHDX.metadata |
| `device_vendor_msft_policy_config_defender_excludedprocesses` | %ProgramFiles%\FSLogix\Apps\frxsvc.exe, %ProgramFiles%\FSLogix\Apps\frxccds.exe |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
