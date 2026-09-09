# macOS shell-scripts

Intune-shellscripts (`deviceShellScripts`) staan **buiten** `IntuneTemplate/`, om dezelfde
reden als de [ADE-enrollmentprofielen](../../enrollment/macos/README.md): de pijplijnen daar
kennen vijf CIPP-policytypes en een shellscript is geen van die vijf. Het hangt onder
`deviceManagement/deviceShellScripts`, `Set-CIPPIntunePolicy` heeft er geen `TemplateType`
voor, en `Start-IntuneRestoreConfig` zet het niet terug. Een bestand hier wordt dus **niet**
opgepikt door `generate-baseline.js`, `export-intunebackup.js`, `check-scope.js` of
`Set-BaselineAssignment.ps1`, en er hoort geen `checkId` bij.

| Bestand | Wat het doet | Scope |
|---|---|---|
| `configure-dock.sh` | Richt de Dock één keer per gebruiker in en laat 'm daarna met rust | Gebruiker |
| `mount-azure-files.sh` | Mount een Azure Files-share met het Kerberos-ticket uit Platform SSO | Gebruiker |

## configure-dock.sh

Zet de bedrijfsapps in de Dock en Apple's standaardset eruit — Safari, Mail, Agenda,
Contacten, Notities, Herinneringen, Berichten, FaceTime, Foto's, Muziek, TV, Podcasts,
Kaarten, Nieuws, App Store en Freeform. Die worden niet stuk voor stuk verwijderd: het script
vervangt de héle `persistent-apps`-lijst, zodat het niet uit de pas loopt met wat Apple in een
volgende macOS-versie standaard in de Dock zet.

Van links naar rechts: Outlook, Teams, Edge, Word, Excel, PowerPoint, Windows App, OneDrive,
Bedrijfsportal, Systeeminstellingen. Finder en Prullenbak staan er niet in — die beheert macOS
zelf en zijn niet te verplaatsen.

### Instellingen in Intune

Devices → macOS → Shell scripts → Add.

| Instelling | Waarde | Waarom |
|---|---|---|
| Run script as signed-in user | **Yes** | zonder dit schrijft `defaults` naar de Dock van root en ziet de gebruiker niets |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | |
| Max number of retries | 3 | |

Toewijzen aan een **gebruikersgroep** (All Users), niet aan apparaten: de Dock is per
gebruiker, en op een gedeelde Mac hoort elke gebruiker zijn eigen inrichting te krijgen.

### "Elk uur" en "eenmalig" spreken elkaar niet tegen

Zodra de Dock staat schrijft het script een markering in
`~/Library/Application Support/Baseline/dock-configured` en stopt elke volgende run direct.
Het herhalen is er alleen voor de eerste keer: bij een nieuwe Mac draait dit script vrijwel
altijd vóórdat Intune de M365-apps heeft uitgerold. Zou je "Not configured" kiezen (één run,
nooit meer), dan houdt zo'n apparaat permanent een halve Dock.

Zolang er apps ontbreken raakt het script de Dock niet aan en probeert het het volgende uur
opnieuw. Na 30 vergeefse pogingen — ruim een dag — richt het de Dock in met wat er wél staat
en noteert het in `dock.log` welke apps ontbraken. Wachten op een app die niet komt (niet
toegewezen, installatie mislukt) levert anders een Dock op die nooit goed komt te staan.

### Daarna is de Dock van de gebruiker

Wie er iets bij wil zetten of uit wil halen mag dat. Dat is een keuze, geen tekortkoming: de
alternatieven zijn een custom `.mobileconfig` met `static-only` (Dock volledig vast, gebruiker
kan niets meer) of niets doen.

Wil je 'm alsnog vastzetten, dan is dit script het verkeerde middel — dat wordt een
Device-configuratie met een `com.apple.dock`-payload.

### Opnieuw laten draaien

Verwijder de markering; de eerstvolgende run richt de Dock opnieuw in:

```bash
rm -f ~/Library/Application\ Support/Baseline/dock-configured \
      ~/Library/Application\ Support/Baseline/dock-attempts
```

### Waarom geen Settings Catalog

De Settings Catalog hééft Dock-instellingen, maar die zijn bij méér dan één app stuk: Intune
formatteert de lijst verkeerd en de payload komt niet op het apparaat aan. Zie
[Microsoft Q&A 1164432](https://learn.microsoft.com/en-us/answers/questions/1164432/macos-settings-catalog-user-experience-dock-persis)
— nog open, en in 2026 nog steeds gemeld. Met één app werkt het wel, dus wie het probeert
krijgt makkelijk de indruk dat het goed zit.

### Regeleindes

`.gitattributes` dwingt LF af voor `*.sh`. Deze repo wordt op Windows onderhouden met
`core.autocrlf=true`; zonder die regel krijgt dit script bij checkout CRLF en faalt het op de
Mac met `bad interpreter: /bin/bash^M`. Controleer dat na een upload met `file` of `cat -A` —
Intune slikt het script gewoon en de fout blijkt pas op het apparaat.

## mount-azure-files.sh

Mount een Azure Files-share in `/Volumes` met het Kerberos-ticket dat Platform SSO
uitgeeft, zodat de gebruiker geen wachtwoord hoeft in te vullen en de share in de
Finder-zijbalk staat. Het macOS-equivalent van een drive mapping, en de tegenhanger van
[`Mount-AzureFilesDrive.ps1`](../../platformscripts/windows/README.md) op Windows.

### Waarom een script en geen configuratieprofiel

Er is geen drive-mapping-payload. Alle 18.329 `settingDefinitionId`'s van de settings catalog
zijn nagezocht op iets dat een netwerkschijf koppelt; dat bestaat niet, op geen van beide
platformen. Apple heeft `com.apple.finder_showmountedserversondesktop` — of een al gemounte
share op het bureaublad staat — en verder niets. Mounten is een handeling en geen instelling.

### Waarom er een LaunchAgent bij zit

Een mount overleeft geen uitloggen. Een Intune-shellscript dat elk uur draait zou de share
dus pas een uur ná het inloggen terugzetten, en dat is precies het moment waarop iemand hem
nodig heeft. Dit script installeert daarom een LaunchAgent
(`com.aci-europe.baseline.mount-azure-files`) die bij login draait en daarna elke vijf
minuten, en doet zelf één eerste poging.

Het script kopieert zichzelf naar `~/Library/Application Support/Baseline/` en laat de agent
díe kopie aanroepen. Eén bestand met de instellingen erin, dus de agent kan niet uit de pas
lopen met wat Intune uitrolt: verandert het script in Intune, dan wordt de kopie bij de
volgende run vervangen en de agent opnieuw geladen.

### Instellingen in Intune

Devices → macOS → Shell scripts → Add.

| Instelling | Waarde | Waarom |
|---|---|---|
| Run script as signed-in user | **Yes** | een mount hoort bij een sessie; als root landt hij in een sessie die niemand ziet |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | houdt de LaunchAgent en de kopie bij |
| Max number of retries | 3 | |

Toewijzen aan een **gebruikersgroep**, niet aan apparaten: wie bij de share mag is een
eigenschap van de gebruiker, en de share-level permissions in Azure staan op dezelfde groep.

### Wat er buiten dit script moet staan

[`Baseline_MAC_D_Azure_Files_Cloud_Kerberos`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.md)
moet zijn uitgerold — zonder dat profiel is er geen ticket voor het
`KERBEROS.MICROSOFTONLINE.COM`-realm en vraagt de mount alsnog om een wachtwoord. Dat profiel
staat vandaag in **fase 3**: toegang tot Azure Files via het Platform SSO-ticket is een
limited preview waarvoor Microsoft je moet aanzetten, en het vraagt macOS Tahoe 26.5. Zolang
die voorwaarden er niet zijn, mount dit script niets en zegt de log waarom.

De tenantkant (Entra Kerberos op het storage account, admin consent, MFA uitgesloten voor de
Entra-app, share-level permissions, en de `CIFS/` → `cifs/`-correctie op de identifier URI van
bestaande shares) staat in de note bij dat profiel.

### Share en submap zijn niet hetzelfde

`smb://acisafiles.file.core.windows.net/data/Public` staat in het script als drie velden:
`data` is de **share**, `Public` een **map daarin**. SMB kent maar één sharelaag, en dat
onderscheid is niet cosmetisch — de mount en de share-level permissions in Azure hangen aan
`data`, de submap is alleen het punt waar je binnenkomt. Wie alleen bij `Public` mag hoort dat
via de rechten op die map te krijgen, niet door hier een andere waarde in te vullen.

`SHARE_SUBPATH` leeg laten mount de hele share.

De controle op "staat hij al?" kijkt daarom naar de **share** en niet naar de submap of het
mountpad: NetFS bepaalt zelf of het de mount op `/Volumes/Public` of op `/Volumes/data` zet,
en als /Volumes die naam al kent hangt macOS er een cijfer achter. Een strengere controle zou
zijn eigen mount niet herkennen en elke ronde opnieuw mounten.

### Zichtbaar in Finder

De share landt in `/Volumes` en verschijnt in de Finder-zijbalk onder **Locaties**, met een
uitwerpknop — hetzelfde als wanneer je hem via *Ga → Verbind met server* had gekoppeld.

Dat is de reden dat het script `osascript -e 'mount volume "smb://…"'` gebruikt en niet
`mount_smbfs`. Die twee mounten allebei, maar niet hetzelfde:

| | `mount_smbfs` | `mount volume` (NetFS) |
|---|---|---|
| Waar | een map die je zelf aanmaakt, bijvoorbeeld in de thuismap | `/Volumes/` |
| In de Finder-zijbalk | nee — Finder ziet zo'n mount niet als server | ja, onder Locaties |
| Uitwerpen | alleen met `umount` | met de knop in Finder |
| Rechten op /Volumes | een gewone gebruiker mag daar niets aanmaken | NetFS regelt dat |

Een icoon op het **bureaublad** krijg je er niet automatisch bij: dat staat standaard uit en
zit los van de zijbalk. Wil je dat wel, dan is dat één instelling in de settings catalog —
`com.apple.finder_showmountedserversondesktop` — en dus een policy, geen scriptwijziging.

De **Favorieten** bovenin de zijbalk zijn iets anders dan Locaties. Daar kan een script niets
zinnigs mee: die lijst is een bookmarkblob in `com.apple.sidebarlists.plist` en Apple heeft de
API ervoor afgeschaft. De gebruiker kan de share er zelf naartoe slepen.

### Geen ticket, geen poging

Zonder Kerberos-ticket mount het script niet. Dat is bewust: NetFS zet bij een mislukte
Kerberos-mount een aanmeldvenster op het scherm, en dat elke vijf minuten uit een
achtergrondagent is erger dan een ontbrekende share. Het script controleert `klist` op een
ticket voor `KERBEROS.MICROSOFTONLINE.COM` en noteert in de log waarom het niets deed.

Handmatig testen, mét dialoog, kan met `--force`:

```bash
~/Library/Application\ Support/Baseline/mount-azure-files.sh --force
```

### Opnieuw laten draaien

```bash
launchctl bootout gui/$(id -u)/com.aci-europe.baseline.mount-azure-files
rm -f ~/Library/LaunchAgents/com.aci-europe.baseline.mount-azure-files.plist
```

De eerstvolgende run van het Intune-script zet beide terug. De log staat in
`~/Library/Application Support/Baseline/mount-azure-files.log`.
