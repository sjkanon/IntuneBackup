<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.en.md) · [Français](Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.fr.md)

# [Baseline] - WIN - D - Shared Devices Start and Taskbar

Zet op gedeelde apparaten Microsoft Edge en Windows App vast op de taakbalk en in Start, zodat elke gebruiker bij de eerste aanmelding meteen de browser en de externe werkplek vindt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen baseline — Policy CSP Start/ConfigureStartPins (Start-indeling van Windows 11) en Start/StartLayout met een CustomTaskbarLayoutCollection (taakbalk), Microsoft Learn: Customize the Start layout en Customize the Taskbar on Windows 11. |
| Bestand | [`Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.json`](Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.json) |

> Hoort op SG-D-UEM-WIN-Shared. De taakbalk krijgt Edge en Windows App achter de standaardpictogrammen van Windows; dat gebeurt bij de eerste aanmelding van een profiel, en dat is op een Shared PC elke nieuwe gebruiker. Start krijgt Edge, Windows App, Verkenner en Instellingen; dat vervangt de hele lijst met vastgemaakte apps en gebruikers kunnen hem niet aanpassen. Windows App moet op het toestel staan: rol hem uit als Store-app (9N1F85V9T8BN) via CIPP of Intune, anders blijft de plek leeg. Een snelkoppeling op het bureaublad kan niet met een policy: Edge zet er zelf een neer, voor Windows App is een script nodig. Alleen Windows 11. De app-ID van Windows App (MicrosoftCorporationII.Windows365_8wekyb3d8bbwe!Windows365) controleer je op een toestel met Get-StartApps.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_start_configurestartpins` | {"pinnedList":[{"desktopAppLink":"%ALLUSERSPROFILE%\\Microsoft\\Windows\\Start Menu\\Programs\\Microsoft Ed… |
| `device_vendor_msft_policy_config_start_startlayout` | <?xml version="1.0" encoding="utf-8"?>
<LayoutModificationTemplate xmlns="http://schemas.microsoft.com/Star… |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
