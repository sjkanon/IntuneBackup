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
