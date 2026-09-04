# Verwijder voorgeïnstalleerde McAfee

Een Win32-app die de McAfee-proefversie verwijdert die op vrijwel elke nieuwe consumentenlaptop
vanaf de fabriek meekomt.

Staat buiten [`IntuneTemplate/`](../../../IntuneTemplate/README.md), net als
[`shellscripts/macos/`](../../../shellscripts/macos/README.md) en
[`compliance/macos/`](../../../compliance/macos/README.md): een Win32-app is geen policy en past
niet in een van de vijf CIPP-policytypes. Geen `checkId`, en geen enkele pijplijn pikt deze map op.

## Waarom dit bij de baseline hoort

Niet omdat McAfee ongewenste software is, maar omdat hij **Microsoft Defender uitzet**. Windows
laat maar één actieve antivirus toe: zodra McAfee zich registreert, gaat Defender in *passive
mode*. Realtimebeveiliging stopt, en daarmee vervalt de bodem onder een flink deel van deze
baseline — de ASR-regels, Controlled Folder Access, Network Protection en de nieuwe
Remote Encryption Protection leunen allemaal op een actieve Defender-engine.

Het gemene is dat niets daarvan een fout meldt. De policies komen netjes aan, de baseline-check
staat groen, en de instellingen doen niets omdat de engine die ze zou uitvoeren op de reservebank
zit. Dat blijft zo tot de proefperiode van McAfee afloopt — en dan staat het apparaat een tijd
lang zonder werkende antivirus.

| Bestand | Wat het is |
|---|---|
| [`Detect-McAfee.ps1`](Detect-McAfee.ps1) | detectiescript: vindt resten in het register (64- én 32-bits), in Program Files en in de dienstenlijst |
| [`Remove-McAfee.ps1`](Remove-McAfee.ps1) | draait MCPR drie keer, ruimt restmappen en Appx-pakketten op |

`MCPR.exe` zit **niet** in deze repo — dat is McAfee's eigen tool en die hoort niet meegecommit.
Haal hem op bij McAfee en verpak hem samen met de twee scripts in de `.intunewin`.

## Verpakken en uitrollen

```powershell
IntuneWinAppUtil.exe -c .\apps\win32\remove-mcafee -s Remove-McAfee.ps1 -o .\uitvoer
```

In Intune → Apps → Windows → Win32-app:

| Veld | Waarde |
|---|---|
| Installatieopdracht | `powershell.exe -ExecutionPolicy Bypass -File Remove-McAfee.ps1` |
| Verwijderopdracht | `cmd.exe /c exit 0` (er valt niets terug te zetten) |
| Installatiegedrag | Systeem |
| **Gedrag bij opnieuw opstarten** | **Intune dwingt een verplichte herstart af** |
| Detectieregel | Aangepast script → `Detect-McAfee.ps1` |

> **Die herstart is geen bijzaak maar de laatste stap van de verwijdering.** MCPR stelt een deel
> van het werk uit via `PendingFileRenameOperations`; zonder herstart blijft het apparaat in een
> half verwijderde staat staan, waarin Defender nog steeds niet terugkomt. Zet deze app op de
> Enrollment Status Page als blokkerende app, zodat een nieuw apparaat de verwijdering doorloopt
> vóór de gebruiker begint.

## Hoe je weet of het gewerkt heeft

Het script logt naar `C:\Windows\Logs\Baseline\remove-mcafee.log`. Controleer daarna op het
apparaat dat Defender weer actief is en niet passief:

```powershell
Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled
```

`AMRunningMode` hoort `Normal` te zijn. Staat er `Passive` of `EDR Block Mode`, dan is er nog een
andere antivirus actief en is de verwijdering niet af.

Twee dingen die bij MCPR normaal zijn en geen fout betekenen:

- **Een niet-nul exitcode.** "Incomplete uninstallation" betekent dat het resterende werk tot de
  herstart is uitgesteld, niet dat het is mislukt. Het script stopt daar dus niet op.
- **Meerdere ronden nodig.** Elke ronde geeft bestandsvergrendelingen vrij die de vorige nog in
  de weg zaten. Eén keer draaien laat vrijwel altijd resten achter; daarom draait het script drie
  ronden met een pauze ertussen.

Bron voor de aanpak: [McAfee: the shadow IT that ships from the
factory](https://malinoski.me/2026/08/25/mcafee-the-shadow-it-that-ships-from-the-factory-and-how-to-remove-it-with-intune/).

---

Terug naar de [hoofd-README](../../../README.md).
