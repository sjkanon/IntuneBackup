**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Office op het web

Een Win32-app voor gedeelde apparaten zonder Office: een dubbelklik op een Word-, Excel- of
PowerPoint-bestand in een gesynchroniseerde OneDrive- of SharePoint-map opent het bestand in
Office voor het web, in Edge.

Een Win32-app is geen policy en geen van de vijf CIPP-policytypes. CIPP, `check-scope.js`,
`export-intunebackup.js` en `Set-BaselineAssignment.ps1` doen niets met deze map; de app pak je in
en upload je met de hand. De policy die hem standaard maakt, staat wel in de baseline:
`[Baseline] - WIN - D - Shared Devices Office Web File Associations`.

## Waarom dit nodig is

Windows kan een bestandstype niet aan een webapp koppelen. Zonder Word op het toestel vraagt
Windows bij elke dubbelklik op een `.docx` met welke app het moet openen. Wat wel werkt, is in
Verkenner rechtsklikken op het bestand en *Online weergeven* kiezen: OneDrive opent het dan in
Word voor het web. Deze app doet precies dat bij een dubbelklik.

Het menu-item heet in elke taal anders. Het script haalt de namen uit OneDrive zelf:
`FileSync.LocalizedResources.dll` heeft een vertaling per taal (94 talen in OneDrive 26.x). De
lijst wordt per OneDrive-versie één keer opgebouwd en bewaard, dus een update van OneDrive gaat
vanzelf goed. Omdat OneDrive zelf het bestand opent, werkt het ook voor snelkoppelingen naar
andere bibliotheken (*Snelkoppeling toevoegen aan Mijn bestanden*).

Staat een bestand niet in een gesynchroniseerde map (Downloads, een USB-stick), dan krijgt de
gebruiker een melding in het Nederlands, Frans, Duits of Engels: eerst in OneDrive zetten.

Het idee komt van [M365-Bridge](https://github.com/Fireant456/M365-Bridge). Die zoekt het
menu-item op de Engelse naam en werkt daarom niet op een Nederlandse of Franse Windows.

| Bestand | Wat het is |
|---|---|
| [`Open-OfficeWeb.ps1`](Open-OfficeWeb.ps1) | draait bij de dubbelklik, als de gebruiker: zoekt *Online weergeven* in het menu van het bestand en voert het uit |
| [`Install-OfficeWeb.ps1`](Install-OfficeWeb.ps1) | zet het script in `%ProgramFiles%\OfficeWebOpen`, registreert de ProgIds `OfficeWeb.Word`, `OfficeWeb.Excel` en `OfficeWeb.PowerPoint` en bouwt de namenlijst vooraf |
| [`Detect-OfficeWeb.ps1`](Detect-OfficeWeb.ps1) | detectieregel: versie, script en koppeling aanwezig |
| [`Uninstall-OfficeWeb.ps1`](Uninstall-OfficeWeb.ps1) | haalt alles weer weg |
| [`OfficeWeb-PlatformScript.ps1`](OfficeWeb-PlatformScript.ps1) | alles in één bestand, om in CIPP te plakken (gegenereerd door [`New-OfficeWebPlatformScript.ps1`](New-OfficeWebPlatformScript.ps1)) |

Bestandstypen: `.docx`, `.docm`, `.doc`, `.dotx`, `.xlsx`, `.xlsm`, `.xlsb`, `.xls`, `.pptx`,
`.pptm`, `.ppt`, `.ppsx`. De oudere formaten opent Office voor het web alleen-lezen of na
omzetten; die keuze krijgt de gebruiker daar.

## Verpakken en uitrollen

```powershell
IntuneWinAppUtil.exe -c .\IntuneTemplate\WIN\Apps\office-web-open -s Install-OfficeWeb.ps1 -o .\uitvoer
```

In Intune → Apps → Windows → Win32-app:

| Veld | Waarde |
|---|---|
| Installatieopdracht | `powershell.exe -ExecutionPolicy Bypass -File Install-OfficeWeb.ps1` |
| Verwijderopdracht | `powershell.exe -ExecutionPolicy Bypass -File Uninstall-OfficeWeb.ps1` |
| Installatiegedrag | Systeem |
| Gedrag bij opnieuw opstarten | Geen specifieke actie |
| Detectieregel | Aangepast script → `Detect-OfficeWeb.ps1` |
| Toewijzing | Vereist op `SG-D-UEM-WIN-Shared` |

Wijs daarnaast `[Baseline] - WIN - D - Shared Devices Office Web File Associations` aan dezelfde
groep toe. Die maakt de app bij elke aanmelding standaard: een installer mag dat niet, Windows
beschermt de standaard-app per gebruiker. Zet je de policy zonder de app, dan wijzen de
koppelingen naar een ProgId die niet bestaat en negeert Windows ze.

Pas je een script aan, verhoog dan `$Version` in `Install-OfficeWeb.ps1` én in
`Detect-OfficeWeb.ps1`. Anders ziet Intune de oude versie als geïnstalleerd.

## Via CIPP, zonder Win32-app

[`OfficeWeb-PlatformScript.ps1`](OfficeWeb-PlatformScript.ps1) is `Install-OfficeWeb.ps1` met
`Open-OfficeWeb.ps1` erin, in één bestand van 14 KB. Plak de inhoud als PowerShell-script in CIPP
(Intune-scripts) of in Intune → Apparaten → Scripts en herstelacties → Platformscripts:

| Veld | Waarde |
|---|---|
| Script uitvoeren met de referenties van de aangemelde gebruiker | Nee |
| Handtekeningcontrole afdwingen | Nee |
| Script uitvoeren in 64-bits PowerShell-host | **Ja** (anders komen de koppelingen in het 32-bits register) |
| Toewijzing | `SG-D-UEM-WIN-Shared` |

Het script downloadt niets: alles wat het toestel uitvoert, staat in het bestand dat je plakt.
Een platformscript draait één keer per toestel. Na een wijziging: `New-OfficeWebPlatformScript.ps1`
opnieuw draaien, `$Version` verhogen en de nieuwe inhoud in CIPP plakken; Intune voert een
gewijzigd script opnieuw uit. Verwijderen gaat met `Uninstall-OfficeWeb.ps1`, ook als platformscript.

## Hoe je weet of het gewerkt heeft

- Dubbelklik in Verkenner op een `.docx` in de OneDrive-map: er opent een tabblad met Word voor
  het web. Het eerste bestand van een nieuw profiel duurt een paar seconden.
- *Instellingen → Apps → Standaard-apps* toont *Office op het web* voor `.docx`.
- Logboeken: `C:\Windows\Logs\Baseline\office-web-open.log` (installatie) en
  `%LOCALAPPDATA%\OfficeWebOpen\open.log` (per gebruiker, elke keer dat een bestand opent).
- Zonder iets te openen: `& "$env:ProgramFiles\OfficeWebOpen\Open-OfficeWeb.ps1" <bestand> -WhatIf`
  toont welk menu-item het script zou uitvoeren.

## Grenzen

- Werkt alleen voor bestanden in een gesynchroniseerde OneDrive- of SharePoint-map; OneDrive moet
  draaien. Dat regelen `[Baseline] - WIN - D - Shared Devices OneDrive` en, voor een vaste
  teammap, `[Baseline] - WIN - D - Shared Devices SharePoint Team Sites`.
- Het bestand opent in de standaardbrowser; op Windows 11 is dat Edge.
- Getest: de namenlijst (140 varianten in 94 talen) en het openen van een gesynchroniseerd bestand
  op een toestel met OneDrive 26.198. De installer en de koppelingspolicy zijn nog niet op een
  gedeeld apparaat getest.
