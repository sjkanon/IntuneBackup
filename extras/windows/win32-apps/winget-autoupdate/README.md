**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Winget-AutoUpdate

| | |
|---|---|
| **Controls** | ISO A.8.8 Beheer van technische kwetsbaarheden · NIS2 art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden · CIS Controls v8.1 7.4 Perform Automated Application Patch Management · NIST CSF 2.0 PR.PS-02 |
| **Fase** | 2 (pilot) |

Werkt elke applicatie bij die winget kent, dagelijks en zonder dat iemand een update hoeft te
verpakken: [Winget-AutoUpdate](https://github.com/Romanitho/Winget-AutoUpdate) (WAU, MIT-licentie)
als Win32-app.

## Waarom dit en geen policy

De baseline regelt updates voor Windows (update rings), Defender, Edge, Office en Chrome. Alles
daarbuiten — 7-Zip, Notepad++, Adobe Reader, VLC, Zoom — wordt door geen enkele policy
bijgewerkt: een Intune-policy kan winget configureren, niet laten draaien. WAU is een geplande
taak die `winget upgrade` uitvoert, als SYSTEM voor machine-installaties en als gebruiker voor
apps in het gebruikersprofiel. De scripts staan hier in `extras/`; CIPP krijgt ze als
applicatietemplate in [`AppTemplate/`](../../../../AppTemplate/README.md).

Het alternatief is **Intune Enterprise App Management** (Intune Suite of losse add-on): een door
Microsoft beheerde catalogus met automatische updates en rapportage in Intune. Wie die licentie
heeft, gebruikt die en niet WAU.

## De keuzes

| MSI-property | Waarde | Waarom |
|---|---|---|
| `RUN_WAU` | `NO` | Niet tijdens Autopilot of de Enrollment Status Page; de eerste run is bij de eerste aanmelding |
| `USERCONTEXT` | `1` | Werkt ook apps bij die in het gebruikersprofiel staan (VS Code, Zoom, Teams-add-ins per gebruiker) |
| `UPDATESATLOGON` | `1` | Een apparaat dat 's ochtends aangaat, wordt dan al bijgewerkt |
| `UPDATESINTERVAL` / `UPDATESATTIME` / `UPDATESATTIMEDELAY` | `Daily` / `11:00:00` / `02:00` | Elke dag, op een moment dat het apparaat aan staat, gespreid tot 13:00 zodat niet alle apparaten tegelijk downloaden |
| `NOTIFICATIONLEVEL` | `SuccessOnly` | De gebruiker ziet wát er bijgewerkt is; een foutmelding kan hij toch niet oplossen |
| `DONOTRUNONMETERED` | `1` | Niet over een gedeelde mobiele verbinding |
| `DISABLEWAUAUTOUPDATE` | `1` | Zie hieronder |

**Waarom WAU zichzelf niet bijwerkt.** `WAU.msi` is niet Authenticode-ondertekend. Met zelf-update
aan haalt WAU een nieuwe MSI van GitHub en voert die als SYSTEM uit, zonder dat iemand hem
gezien heeft. `New-WAUPackage.ps1` pint daarom een versie met de SHA-256 uit de GitHub-release
en weigert een bestand dat afwijkt. Een nieuwe WAU-versie is een bewuste stap: versie en hash
in het script aanpassen, opnieuw verpakken, als nieuwe Win32-app met supersedence (*Update*)
op de vorige.

## Wat WAU níét bijwerkt

[`excluded_apps.txt`](excluded_apps.txt) gaat mee in het pakket. Let op: die lijst **vervangt**
de standaardlijst van WAU, hij vult hem niet aan. Hij is daarom gelijk aan de standaardlijst
van v2.12.0, en dat is ook wat deze baseline nodig heeft:

| Uitgesloten | Want |
|---|---|
| `Microsoft.Edge*`, `Google.Chrome*`, `Mozilla.Firefox*`, `Brave.Brave*`, `Opera.Opera*` | Browsers werken zichzelf bij; voor Edge en Chrome dwingen `Microsoft Edge Updates` en `Google Chrome Updates` dat af, voor Firefox [`firefox-policies/`](../../remediations/firefox-policies/README.md) |
| `Microsoft.Office`, `Microsoft.Teams*`, `Microsoft.OneDrive` | Eigen updatekanaal, gestuurd door `Microsoft Office Updates` en de OneDrive- en Teams-policies |
| `Microsoft.RemoteDesktopClient`, `TeamViewer.TeamViewer*` | Eigen updater; een update midden in een sessie verbreekt die |
| `Romanitho.Winget-AutoUpdate`, `KnifMelti.WAU-Settings-GUI` | WAU zelf — zie hierboven |

Een app die een organisatie op een vaste versie wil houden, komt er per regel bij (wildcards
mogen: `Adobe.Acrobat*`). Een lijst die via groepsbeleid onder
`HKLM\SOFTWARE\Policies\Romanitho\Winget-AutoUpdate\BlackList` staat, gaat vóór dit bestand.

## Samenspel met de baseline

- **Windows Package Manager** (fase 1) zet alleen experimentele functies, hash-override,
  lokale manifests en het `ms-appinstaller`-protocol uit. De standaardbron `winget` blijft aan,
  en dat is wat WAU gebruikt. Wie later `EnableDefaultSource` of `AllowedSources` beperkt,
  zet WAU stil.
- **In-Box App Removal** laat App Installer (`Microsoft.DesktopAppInstaller`, dus winget) staan.
- **App Control for Business** ([`app-control/`](../../app-control/README.md)): WAU bestaat uit
  niet-ondertekende PowerShell-scripts die als SYSTEM draaien. Niet getest onder de afdwingvariant;
  draai eerst de auditvariant en kijk in de CodeIntegrity-log of WAU of de installers die het
  start geblokkeerd zouden worden.

## Uitrol

### Via CIPP

[`AppTemplate/Winget-AutoUpdate.json`](../../../../AppTemplate/Winget-AutoUpdate.json) is een CIPP-applicatietemplate van het
type *Custom Application* (Win32-script-app). CIPP uploadt daarvoor zijn eigen kleine
placeholderpakket en draait [`Install-WAU.ps1`](Install-WAU.ps1) als installatieprogramma: dat
haalt de vastgepinde `WAU.msi` van GitHub, controleert de SHA-256, schrijft `excluded_apps.txt`
ernaast en installeert met dezelfde MSI-properties als hieronder. Verwijderen doet
[`Uninstall-WAU.ps1`](Uninstall-WAU.ps1), detectie [`Detect-WAU.ps1`](Detect-WAU.ps1). Geen
`.intunewin` te bouwen.

1. CIPP → **Tools → Community Repos** → deze repo → `AppTemplate/Winget-AutoUpdate.json` → **Import**.
2. **Applications → Application Templates** → `CXNM - Standard - Winget-AutoUpdate` → **Deploy**:
   kies de tenants en als toewijzing de groep `SEC-Baseline-Pilot` (het template wijst zelf
   niets toe). Of zet het in een baseline met de standard *Deploy Intune Application Template*.

Het apparaat moet `github.com` kunnen bereiken; de MSI-log staat in `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\WAU-install.log`.

Het template wordt gegenereerd uit de scripts: `node scripts/generate-app-templates.js`. Dat
weigert als versie, hash of productcode in de scripts afwijken van `New-WAUPackage.ps1`, of de
lijst in `Install-WAU.ps1` van `excluded_apps.txt` — beide routes installeren hetzelfde.

### Met de hand

1. Bouw het pakket — download, hashcontrole en `.intunewin`:

   ```powershell
   .\New-WAUPackage.ps1 -IntuneWinAppUtil C:\Tools\IntuneWinAppUtil.exe
   ```

2. Intune → **Apps → Windows → Add → Windows app (Win32)**, met `WAU.intunewin`:

| Veld | Waarde |
|---|---|
| Naam | `CXNM - Standard - WIN - D - Winget-AutoUpdate` |
| Installatieopdracht | `msiexec /i WAU.msi /qn RUN_WAU=NO USERCONTEXT=1 UPDATESATLOGON=1 UPDATESINTERVAL=Daily UPDATESATTIME=11:00:00 UPDATESATTIMEDELAY=02:00 NOTIFICATIONLEVEL=SuccessOnly DONOTRUNONMETERED=1 DISABLEWAUAUTOUPDATE=1` |
| Verwijderopdracht | `msiexec /x {FB0EB14E-95AC-45D7-A951-432316FFCBD4} /qn` (v2.12.0; het script geeft de code voor een andere versie) |
| Installatiegedrag | Systeem |
| Gedrag bij opnieuw opstarten | Geen specifieke actie |
| Besturingssysteem | 64-bit, Windows 10 22H2 of nieuwer |
| Detectieregel | Aangepast script → [`Detect-WAU.ps1`](Detect-WAU.ps1) |
| Toewijzing | *Required* op de pilotgroep `SEC-Baseline-Pilot`, daarna alle Windows-apparaten |

De detectie kijkt bewust niet naar de versie: die zou bij elke versiewissel opnieuw installeren.
Ze kijkt of de registersleutel, `Winget-Upgrade.ps1` en de geplande taak `\WAU\Winget-AutoUpdate`
er zijn.

## Hoe je weet of het werkt

- Log op het apparaat: `C:\Program Files\Winget-AutoUpdate\logs\updates.log`, en als symlink
  `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\WAU-updates.log` — die laatste komt
  mee met *Collect diagnostics* in Intune.
- Instellingen: `HKLM\SOFTWARE\Romanitho\Winget-AutoUpdate`.
- Over de hele vloot: Defender Vulnerability Management → *Software inventory* — het aantal
  apparaten met een verouderde versie van een app die winget kent, hoort na een paar dagen te dalen.
