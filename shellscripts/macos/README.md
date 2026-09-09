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
| `nudge-screen-recording.sh` | Vraagt de gebruiker schermopname aan te zetten voor NinjaOne en TeamViewer, en opent het paneel | Gebruiker |

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
(`com.aci-europe.baseline.mount-azure-files`) en doet zelf één eerste poging.

Die agent draait **bij login en bij elke netwerkwijziging**, niet op een klok: `RunAtLoad` plus
`WatchPaths` op `resolv.conf` en de netwerkconfiguratie, met een `ThrottleInterval` van tien
seconden ertegen. Wifi-wissel, VPN erbij, uit de slaap komen — dat zijn de momenten waarop een
mount weg is of juist weer kan, en pollen om de zoveel minuten raakt die net niet.

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

### `server rejected the connection: Authentication error`

Poort 445 open, maar de mount wordt geweigerd. Dan is het netwerk in orde en ligt het bij
Kerberos. Drie oorzaken, in de volgorde waarin je ze uitsluit.

**1. Het ticket staat niet in de standaardcache.** `mount_smbfs` gebruikt via GSSAPI de
*default* credential cache. Platform SSO zet het cloud-TGT in een cache met een eigen naam, en
staat die niet als standaard, dan vindt `mount_smbfs` hem niet en weigert de server.

```bash
klist -l
```

De **`*`** vooraan een regel markeert de standaardcache. Staat die bij het
`@KERBEROS.MICROSOFTONLINE.COM`-ticket en is het niet verlopen, dan is dit niet de oorzaak —
ga door naar 2. Staat hij ergens anders, dan is het te testen met
`kswitch -p <principal>` gevolgd door de mount.

**2. De identifier URI staat op `CIFS/` in hoofdletters.** Bij een share die al bestond vóór
Entra Kerberos werd aangezet, registreert Azure de app met `CIFS/<account>.file.core.windows.net`.
macOS mount uitsluitend op `cifs/` in kleine letters en krijgt anders geen servicetoegang. Te
zien in Entra ID → App-registraties → Alle toepassingen → het storage account → Manifest.
Corrigeren gaat met [`updateappmanifestazurefiles.ps1`](https://github.com/Azure-Samples/azure-files-samples/blob/master/update-app-manifest/updateappmanifestazurefiles.ps1)
uit azure-files-samples.

**3. De autorisatie erachter.** Admin consent op de service principal van het storage account,
MFA uitgesloten voor die Entra-app, en een share-level permission voor deze gebruiker op deze
share. Ontbreekt er één, dan komt er wél een ticket maar weigert de server het alsnog.

**Het onderscheid tussen 2 en 3 in één test.** Vraag de KDC rechtstreeks om het
servicecertificaat, twee keer, en let op het verschil in hoofdletters:

```bash
kgetcred cifs/<account>.file.core.windows.net@KERBEROS.MICROSOFTONLINE.COM ; echo "klein: $?"
kgetcred CIFS/<account>.file.core.windows.net@KERBEROS.MICROSOFTONLINE.COM ; echo "groot: $?"
```

Kerberos-principals zijn hoofdlettergevoelig, en dat is precies waar dit misgaat.

| Uitkomst | Wat het betekent |
|---|---|
| klein mislukt, groot lukt | **Oorzaak 2.** De SPN staat als `CIFS/` geregistreerd en macOS vraagt om `cifs/`. Corrigeer de identifier URI. |
| allebei mislukt met **AADSTS700016** | Er is in deze tenant geen app voor dit storage account. Zie hieronder — dit hebben we in de praktijk geraakt. |
| klein lukt, mount mislukt alsnog | **Oorzaak 3.** Het ticket komt er wel; de server weigert de autorisatie. Kijk naar consent, de MFA-uitzondering en de share-level permission. |

#### AADSTS700016 — de app bestaat niet

```
kgetcred: krb5_get_creds: Error from KDC: AADSTS700016: Application with identifier 'cifs'
was not found in the directory '<tenant-id>'. This can happen if the application has not been
installed by the administrator of the tenant or consented to by any user in the tenant.
```

Komt deze bij **beide** schrijfwijzen, dan is er niets om hoofdletters van te corrigeren: de
KDC kent überhaupt geen toepassing voor deze fileservice. Aanzetten van Entra Kerberos maakt
die app-registratie (`[Storage Account] <account>.file.core.windows.net`) automatisch aan;
zolang die er niet is, valt er niets uit te geven.

**Kijk eerst naar de identity source van het storage account**, want dat is wat wij hier
tegenkwamen. Azure-portal → het storage account → *Data storage* → *File shares* →
*Identity-based access*. Staan **Microsoft Entra Kerberos** en **AD DS** daar grijs met
*"Another access method is already configured"*, dan is er al een andere bron gekozen — bij ons
Microsoft Entra Domain Services. Microsoft is daar stellig over:

> Your Azure storage account can't authenticate with both Microsoft Entra ID and a second
> method like AD DS or Microsoft Entra Domain Services. If you already chose another identity
> source for your storage account, you must disable it before enabling Microsoft Entra
> Kerberos.

Eén identity source per storage account, en dat is een keuze die verder reikt dan de Macs: al
het bestaande verkeer naar die shares hangt eraan. Omzetten gaat volgens
[Change the identity source for Azure file shares](https://learn.microsoft.com/en-us/azure/storage/files/change-identity-source)
en is geen instelling die je even omklapt.

**Waarom Entra DS niet alsnog werkt met dit profiel.** Kerberos tegen een Entra DS-share loopt
via de domeincontrollers van dat beheerde domein, met het domein zelf als realm — niet via de
cloud-KDC op `KERBEROS.MICROSOFTONLINE.COM`. Platform SSO geeft maar twee tickets uit:
`tgt_cloud` voor Entra Kerberos, en `tgt_ad` voor een on-premises AD via Cloud Kerberos Trust.
Entra DS is geen van beide — het is een beheerd domein dat *uit* Entra ID synchroniseert en
niet meedoet aan Cloud Kerberos Trust. Er komt dus nooit een TGT voor dat realm.

Wie tóch bij Entra DS wil blijven, heeft op de Mac een klassieke Kerberos SSO-opstelling nodig:
realm en `Hosts` van het beheerde domein, netwerkzicht op de domeincontrollers in de VNet (dus
VPN of ExpressRoute) en een gebruiker die zijn wachtwoord intypt. Dat werkt, maar het is een
andere oplossing dan deze — de aanmeldloze mount is er dan niet bij.

**Entra ID en Entra Domain Services zijn niet hetzelfde**, en die naamsverwarring is hier de
kern. Entra ID is de clouddirectory waar Intune, Platform SSO en Conditional Access op draaien;
die spreekt OAuth2 en OIDC en heeft geen klassieke Kerberos. Entra DS is een **beheerd
AD-domein op VM's in je eigen VNet**, met LDAP, NTLM en gewone Kerberos, dat in één richting
uit Entra ID synchroniseert. Dezelfde gebruikers, een andere directory, een ander realm, eigen
domeincontrollers op privé-adressen. Dat je gebruikers en apparaten "in Azure AD" zitten zegt
dus niets over of ze bij Entra DS kunnen.

Dat geldt niet alleen voor Macs. Microsoft stelt bij Entra DS als voorwaarde:

> To access an Azure file share by using Microsoft Entra credentials from a VM, your VM must be
> domain-joined to Microsoft Entra Domain Services. […] Non-domain-joined VMs can access Azure
> file shares using Microsoft Entra Domain Services authentication only if the VM has
> unimpeded network connectivity to the domain controllers […] Usually this connectivity
> requires either site-to-site or point-to-site VPN.

Een Entra-joined laptop die door Intune wordt beheerd is niet domain-joined en heeft vanaf
internet geen zicht op die domeincontrollers. Met Entra DS als identity source bedient een
storage account dus in de praktijk alleen VM's in of aan die VNet — geen enkele laptop uit de
vloot, Windows noch macOS. macOS staat in de ondersteunde clients van die pagina trouwens
helemaal niet genoemd.

Staat er wél Entra Kerberos aan en komt deze fout tóch, dan zijn er nog twee mogelijkheden. De
**admin consent** op de nieuwe service principal kan ontbreken — Entra ID → App-registraties →
Alle toepassingen → de app met de naam van het storage account → *API-machtigingen* →
*Verleen beheerderstoestemming*. Of het storage account hoort bij een **andere directory** dan
die waarop de Mac is aangemeld; de foutmelding noemt het tenant-id waarin gezocht is, en Entra
Kerberos werkt niet over tenants heen.

Zolang deze fout er staat heeft het geen zin om aan het profiel, de `Hosts`-lijst of het script
te sleutelen. Die kant is aantoonbaar in orde: er is een geldig TGT in de standaardcache, poort
445 is open, en de KDC antwoordt keurig — met de mededeling dat er niets te geven valt.

Kent de Mac `kgetcred` niet, dan kun je hetzelfde na een mislukte mount aflezen met
`klist | grep -i cifs`: staat er een `cifs/`-regel, dan gaf de KDC het ticket (3); staat er
niets, dan kwam het daar niet eens toe (2).

### Het sleuteltje in de menubalk is geen diagnose

Het menubalkicoon van de Kerberos-extensie kan "Not signed in" of "Network not available"
melden terwijl alles werkt. Microsoft schrijft daarover:

> Users don't need to interact with the menu bar extra for Kerberos SSO to work. SSO
> functionality operates correctly even if the menu bar extra reports "Not signed in". You can
> instruct users to ignore the menu bar extra.

Dat is bij deze opstelling ook logisch. Met `usePlatformSSOTGT` op true haalt de extensie
**geen eigen ticket** op — ze gebruikt het TGT dat Platform SSO al heeft geïmporteerd. De
extensie legt dus zelf nooit een verbinding met een KDC, en wat het icoontje over die
verbinding meldt zegt daarom niets over of het werkt.

De enige bron die wél telt is:

```bash
app-sso platform -s
```

Onder `kerberosStatus` hoort een regel met `"realm": "KERBEROS.MICROSOFTONLINE.COM"`,
`"ticketKeyPath": "tgt_cloud"` en `"importSuccessful": true`. Staat die er, dan is de
Platform SSO-kant klaar en ligt een mislukte mount aan de Azure-kant.

**Voordat je in het profiel gaat zoeken**, controleer wel of het token is vervangen — dat is een
echte valkuil, alleen niet degene die dit icoontje aanwijst. In het template staat de KDC-URL
als `kkdcp://login.microsoftonline.com/%OrganizationId%/kerberos`, en CIPP vult dat bij uitrol
in. Rol je uit met IntuneBackupAndRestore of via een directe JSON-import, dan gebeurt dat niet:

```bash
sudo profiles show -output /tmp/profielen.plist
grep -A3 preferredKDCs /tmp/profielen.plist
```

Daar hoort een GUID te staan, niet `%OrganizationId%`.

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

Wat daarvoor telt is **waar** de share landt, niet welk commando hem mountte. Alles wat in
`/Volumes` staat zet Finder in de zijbalk; een mount in een map in de thuismap ziet Finder niet
als server en verschijnt nergens.

Het script gebruikt `mount_smbfs -N`, en uitdrukkelijk **niet** `osascript -e 'mount volume'`:

| | `mount_smbfs -N` | `mount volume` (NetFS) |
|---|---|---|
| Mountpunt in `/Volumes` | maakt hij zelf aan, ook als gewone gebruiker | maakt NetFS aan |
| Kerberos | gebruikt het TGT dat er is | idem |
| Als het ticket niet wordt geaccepteerd | mount mislukt, met een foutmelding | **zet een aanmeldvenster op het scherm en wacht** |

Die laatste regel is het hele verschil. Uit een LaunchAgent beantwoordt niemand die dialoog:
het script blijft staan tot de Intune-agent het na 60 minuten afbreekt en "Failed" meldt,
zonder één regel uitvoer. Dat is precies wat hier gebeurde. `-N` vraagt per definitie niets.

Dezelfde afweging maakt [`42Loris/macOS_DriveMapping`](https://github.com/42Loris/macOS_DriveMapping),
met in het script de opmerking dat `osascript` bij een URL zonder inloggegevens die
"continue"-dialoog uitlokt.

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

De controle kijkt met `klist -l` **en** met een kale `klist`, want die twee zien niet
hetzelfde. Platform SSO zet het cloud-TGT in een cache met een eigen naam en een kale `klist`
toont alleen de standaardcache. Wat er echt is, zie je het betrouwbaarst bij Microsoft zelf:

```bash
app-sso platform -s
```

Onder `kerberosStatus` hoort een regel te staan met `"realm": "KERBEROS.MICROSOFTONLINE.COM"`,
`"ticketKeyPath": "tgt_cloud"` en `"importSuccessful": true`. Staat die er, dan is de
Platform SSO-kant in orde en ligt een mislukte mount aan de Azure-kant.

Handmatig testen, mét dialoog, kan met `--force`:

```bash
~/Library/Application\ Support/Baseline/mount-azure-files.sh --force
```

### Als Intune "Failed" meldt

Het script eindigt in een Intune-run **altijd** met exit 0, ook als er niets te mounten viel.
Dat is bewust: zolang de Azure Files-preview niet aanstaat heeft geen enkele Mac een ticket,
en dan zou elk toestel permanent rood staan voor iets dat volgens plan verloopt. Wat er wél
gebeurde schrijft het script naar stdout, en die uitvoer bewaart Intune bij het apparaat.

"Failed" betekent dus dat het script niet zélf tot het einde is gekomen. Drie oorzaken, in
volgorde van waarschijnlijkheid:

1. **De mount liep vast op een aanmeldvenster.** Heeft de Mac wel een Kerberos-ticket maar
   accepteert de share het niet, dan valt NetFS terug op een dialoog en wacht tot iemand het
   invult. Uit een LaunchAgent gebeurt dat nooit; het script blijft hangen en de Intune-agent
   breekt het af. Sinds de timeout van 30 seconden gebeurt dat niet meer — het script noteert
   dan `Mount liep vast … afgebroken` en gaat verder.
2. **Er staat een oudere versie in Intune.** De placeholdercontrole is het enige andere pad
   dat exit 1 geeft. In de log staat dan letterlijk `staat nog op de placeholder`.
3. **Het script is nooit begonnen.** Regeleindes of een BOM uit een Windows-editor maken van
   de eerste regel `#!/bin/bash^M` en dan start er niets. Zie *Regeleindes* hierboven.

Het onderscheid tussen 2 en 3 zie je aan de log: staat er een `Gestart als …`-regel, dan heeft
het script gedraaid en zit de fout in de logica; is er geen logbestand, dan is het nooit
begonnen.

### "Failed" blijft staan, ook als het al lang goed gaat

Drie dingen uit
[Microsoft's documentatie over shellscripts](https://learn.microsoft.com/en-us/intune/intune-service/apps/macos-shell-scripts)
die verklaren waarom de portal een verkeerd beeld kan geven, en die je moet kennen vóór je een
nieuwe versie uploadt:

- **De agent haalt scripts elke 8 uur op**, en dat staat los van de MDM-sync. Een nieuwe versie
  is dus niet meteen op het toestel. Forceren kan de gebruiker zelf: Bedrijfsportal openen, het
  apparaat kiezen, **Check settings**.
- **De status wordt alleen gemeld als hij verandert.** Blijft hij hetzelfde, dan werkt Intune
  alleen de tijdstempel bij — elke 7 dagen. Een oude "Failed" kan er dus nog staan terwijl er
  intussen niets meer misgaat.
- **Een gefaald script wordt niet opnieuw gedraaid** tenzij *Max number of times to retry* is
  ingesteld. Staat dat op *Not configured*, dan is één mislukking definitief tot je het script
  wijzigt of het toestel herstart.

Nuttig om te weten bij oorzaak 1 hierboven: de agent breekt een script pas na **60 minuten**
af. Een mount die op een aanmeldvenster wacht haalt die grens dus makkelijk.

```bash
cat ~/Library/Logs/Baseline/mount-azure-files.log
```

En zonder de Mac aan te raken: **Devices → Scripts and remediations → Platform scripts →**
het script **→ Device status →** kies het toestel **→ Collect logs**, met paden gescheiden door
een puntkomma en zónder spaties ertussen:

```
/Users/<gebruiker>/Library/Logs/Baseline/mount-azure-files.log;/Users/<gebruiker>/Library/Logs/Baseline/screen-recording.log
```

Dáárom staan deze logs in `~/Library/Logs/Baseline/` en niet naast de markeringen in
`Application Support`: die mapnaam heeft een spatie en is daarmee niet op te halen. De agent
van Intune levert zijn eigen logs altijd mee, uit `/Library/Logs/Microsoft/Intune/` en
`~/Library/Logs/Microsoft/Intune/`.

### Opnieuw laten draaien

```bash
launchctl bootout gui/$(id -u)/com.aci-europe.baseline.mount-azure-files
rm -f ~/Library/LaunchAgents/com.aci-europe.baseline.mount-azure-files.plist
```

De eerstvolgende run van het Intune-script zet beide terug. De log staat in
`~/Library/Logs/Baseline/mount-azure-files.log`.

## nudge-screen-recording.sh

Vraagt de gebruiker om schermopname aan te zetten voor de apps waarmee de helpdesk meekijkt,
en opent daarbij meteen het juiste paneel. Stopt zodra het geregeld is.

### Waarom dit niet met een policy kan

Schermopname is de enige maatregel in deze baseline die een MDM niet kan afdwingen, en dat is
geen tekortkoming van de baseline maar een besluit van Apple. Uit Apple's eigen schema voor de
PPPC-payload ([`apple/device-management`](https://github.com/apple/device-management/blob/main/mdm/profiles/com.apple.TCC.configuration-profile-policy.yaml),
bij de key `ScreenCapture`):

> Access to the contents can't be given in a profile; it can only be denied.

Dezelfde formulering staat bij `Camera`, `Microphone` en `ListenEvent`. De waarde
`AllowStandardUserToSetSystemService` bestaat volgens datzelfde schema **alleen** voor
`ListenEvent` en `ScreenCapture` — Apple heeft die gemaakt omdát deze twee niet te verlenen
zijn.

Dat de Intune-settings catalog bij `Authorization` ook `Allow` aanbiedt, betekent niets: die
lijst is generiek over alle 24 TCC-diensten. Zet je hem hier op `Allow`, dan accepteert Intune
het profiel en negeert macOS de waarde.

[`Baseline_MAC_D_Screen_Recording`](../../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Screen_Recording.md)
haalt dus het maximum: een **standaardgebruiker** mag de schakelaar zelf omzetten, zonder
beheerderswachtwoord. Zonder dat profiel kan een niet-admin het sinds Big Sur helemaal niet.
De klik blijft van de gebruiker; dit script zorgt dat hij hem ook doet.

### Vijf schakelaars, niet één

Het profiel dekt vijf bundles:

```
com.ninjarmm.ncstreamer
com.teamviewer.TeamViewer
com.teamviewer.TeamViewerHost
com.teamviewer.Desktop
com.teamviewer.TeamViewerQS
```

Alleen geïnstalleerde apps verschijnen in het paneel, en elke app is een eigen vinkje. Het
script vraagt daarom alleen naar wat er op dít toestel staat — anders zou het blijven vragen om
een schakelaar die er niet is.

### Hoe het weet of het al goed staat

Het probeert de TCC-database van de gebruiker te lezen
(`~/Library/Application Support/com.apple.TCC/TCC.db`, kolom `auth_value`, of `allowed` op
oudere versies). Lukt dat, dan weet het script het zeker en vraagt het niets.

Die database is beschermd: zonder Volledige Schijftoegang mag niemand hem lezen. Lukt het niet,
dan is dat geen fout — dan wordt het aan de gebruiker gevraagd, met een knop **Staat al aan**
die het script laat stoppen. Beter één keer te veel vragen dan een rechtenstatus verzinnen.

### Het houdt een keer op

Na 96 pogingen — bij een run per uur is dat vier dagen — vraagt het niets meer en noteert het
in de log wat er nog ontbreekt. Langer doorvragen verandert een herinnering in een ergernis, en
dan klikt iemand hem weg zonder te lezen. Wat er dan nog mist hoort in een gesprek, niet in een
dialoog.

### Instellingen in Intune

Devices → macOS → Shell scripts → Add.

| Instelling | Waarde | Waarom |
|---|---|---|
| Run script as signed-in user | **Yes** | het gaat om de rechten van déze gebruiker, en een dialoog uit root ziet niemand |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | |
| Max number of retries | 3 | |

Toewijzen aan een **gebruikersgroep**. Geen apparaatgroep: op een gedeelde Mac heeft elke
gebruiker zijn eigen TCC-database en dus zijn eigen klik.

### Opnieuw laten vragen

```bash
rm -f ~/Library/Application\ Support/Baseline/screen-recording-ok \
      ~/Library/Application\ Support/Baseline/screen-recording-pogingen
```

De log staat in `~/Library/Logs/Baseline/screen-recording.log`.
