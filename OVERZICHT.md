<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# Intune-baseline — overzicht

149 policies over 4 platformen, met
[OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) als bron.
Dit is de samenvatting; de details staan in de [hoofd-README](README.md) en per map.

| | Aantal |
|---|---:|
| Policies | 149 |
| Baseline-checks | 131 |
| Zonder toewijzing (bewust) | 51 |
| Uitgerold in de tenant | 0 |

## Wat er in zit

| Platform | Settings Catalog | ADMX | Device config | Compliance | App Protection | Totaal |
|---|---:|---:|---:|---:|---:|---:|
| [Windows](IntuneTemplate/WIN/README.md) | 102 | 1 | 6 | 5 | – | **114** |
| [macOS](IntuneTemplate/MAC/README.md) | 22 | – | 3 | 4 | – | **29** |
| [iOS/iPadOS](IntuneTemplate/IOS/README.md) | – | – | – | 2 | 1 | **3** |
| [Android](IntuneTemplate/AND/README.md) | – | – | – | 2 | 1 | **3** |

Per platform staat er een tabel met **elke policy, wat hij doet en waar hij landt**:
- [Windows](IntuneTemplate/WIN/README.md) — 114 policies
- [macOS](IntuneTemplate/MAC/README.md) — 29 policies
- [iOS/iPadOS](IntuneTemplate/IOS/README.md) — 3 policies
- [Android](IntuneTemplate/AND/README.md) — 3 policies

## Eén bron, drie afgeleiden

```mermaid
flowchart LR
  OIB["OpenIntuneBaseline"] -->|import-oib.js| T
  T["<b>IntuneTemplate/</b><br/>de bron"]
  T -->|generate-baseline.js| BL["baseline/intune/<br/>baseline-v1.0.json"]
  T -->|export-intunebackup.js| EX["export/NativeImport/<br/>IntuneBackupAndRestore/"]
  T -.->|leest rechtstreeks| CIPP[CIPP]
  BL --> PLAT["TEST Policies Platform"]
  EX -->|Start-IntuneRestoreConfig| TENANT[("Intune-tenant")]
  CIPP --> TENANT
  PLAT -.->|toetst| TENANT
  style T stroke-width:3px
```

Wijzigen doe je in `IntuneTemplate/`. De rest wordt gegenereerd en door CI opnieuw gebouwd.

## Wat er in augustus 2026 veranderde

Van 24 eigen policies naar de huidige set.

| | Aantal | |
|---|---:|---|
| Herschreven op OIB-inhoud | 15 | checkId behouden; Edge Security ging van 2 naar 54 instellingen, Defender Antivirus van 11 naar 28, Audit van 23 naar 40 |
| Nieuw | 75 | o.a. Windows Hello for Business, Credential Guard, Local Administrators, Office Security, 7 compliance-policies, 20 macOS-policies, 2 BYOD-MAM |
| Opgegaan in een andere policy | 6 | Administrative Templates (300 instellingen) uit elkaar getrokken; Network Security, System Services, Windows Search en OneDrive KFM opgeslokt |
| Ongewijzigd meegegaan | 5 | waar OIB geen tegenhanger voor heeft: EDR-onboarding, Outlook-autoconfiguratie, Edge-zoekmachine, update-ring 3, user experience |

Vijf checkId's zijn daarmee opgeheven (008, 017, 023, 025, 028) en worden niet opnieuw
uitgedeeld. Instellingen die alleen wij hadden — versleuteling van vaste en verwisselbare
schijven bijvoorbeeld — zijn bij een herschrijving behouden in plaats van stilzwijgend
weggevallen.

## Wat de vergelijking met IntuneAdmin opleverde

Eind augustus 2026 is de set naast [IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines)
gelegd — 874 profielen, vergeleken op settingDefinitionId en waarde. 654 instellingen komen in
beide sets voor, waarvan 55 met een andere waarde. Dat leverde vier nieuwe policies en drie
aanpassingen op:

| | |
|---|---|
| `WIN - D - Windows AI` | Recall en Click To Do uit. OIB v3.8 kent nog geen Windows AI-policy en wij dus ook niet. |
| `WIN - D - Removable Storage` | schrijven naar USB-opslag en WPD-apparaten geblokkeerd; verwisselbare media was nergens beperkt. |
| `WIN - U - Windows Hello for Business` | WHfB per gebruiker naast de bestaande per-apparaatpolicy. |
| `WIN - D - Windows Hello for Business Multi User` | WHfB voor gedeelde apparaten, zonder inrichting direct na het aanmelden. |
| `WIN - D - Windows Firewall` | *local policy merge* stond alleen op het openbare profiel; nu ook op domein en privé. |
| `WIN - D - Login and Lock Screen` | het wachtwoord-onthulknopje gaat uit — de enige harde CIS-L1-afwijking zonder functionele reden. |
| `WIN - D - Defender Antivirus` | lage en gemiddelde dreigingen naar quarantaine in plaats van block en remove: een fout-positief is dan terug te draaien. |

Daarnaast verloren de drie CIPP-standaardtemplates voor Defender hun toewijzing. Ze zetten
dezelfde instellingen als hun OIB-tegenhanger op een andere waarde — 19 conflicten in totaal,
waarvan 16 ASR-regels. Bij een conflict past Intune de instelling door géén van beide policies
toe, dus die 16 regels stonden feitelijk uit.

Wat bewust anders blijft dan CIS en IntuneAdmin: telemetrie op *Optioneel* (Endpoint Analytics
en Windows Update-rapportage leunen erop) en locatie aan (Apparaat zoeken, tijdzone). Beide
staan met reden in het `doel`-veld van hun policy.

## Wat de macOS-herziening opleverde

Eind augustus 2026 is de macOS-set als geheel nagelopen. Dat leverde twee nieuwe policies
en drie correcties op:

| | |
|---|---|
| `MAC - D - Enrollment Profile Administrator / Standard User Affinity` | twee ADE-inschrijfprofielen die in precies één instelling verschillen: wordt het aangemelde account beheerder of standaardgebruiker. Alternatieven van elkaar, dus geen van beide toegewezen. |
| `MAC - D - Software Updates` | van de klassieke `com.apple.softwareupdate`-payload naar declaratief updatebeleid (DDM, macOS 14+): uitstel van 7 dagen voor kleine, 14 voor grote en 21 voor systeemupdates, Rapid Security Responses aan inclusief terugdraaien. checkId 047 blijft. |
| `MAC - D - Defender for Endpoint` | de organisatienaam van het inhoudsfilter stond op *JAMF Software* — een restant uit de Jamf-profielen waar de MDE-documentatie op leunt. Die naam ziet de gebruiker in Systeeminstellingen → Netwerk → Filters. |
| `MAC - U - Compliance Device Health` en `Device Security` | droegen elkaars omschrijving. Device Health toetst System Integrity Protection; Device Security toetst de versleuteling, de firewall en Gatekeeper. |

Één gat is bewust niet gedicht: `MAC - U - Compliance Password` eist een wachtwoord van
minimaal acht tekens met vergrendeling na vijftien minuten, maar er is geen configuratiepolicy
die dat op de Mac instelt. Een Mac zonder schermvergrendeling wordt dus wel als niet-compliant
gemeld en krijgt de instelling niet opgelegd — dat vraagt een eigen passcode-policy.

## Wat er nog moet gebeuren

De repo is klaar en de controles staan groen. De tenant is niet aangeraakt: de policies
staan daar nog onder hun oude naam. De volgorde is een afhankelijkheid, geen suggestie —
stap 4 vóór stap 3 levert twee policies op die elkaar tegenspreken.

| # | Stap | |
|---:|---|---|
| 1 | Inventariseren | `Get-BaselinePolicyState.ps1` — moet nog gebouwd worden |
| 2 | Hernoemen | `Rename-BaselinePolicy.ps1 -WhatIf` eerst; PATCH, dus id en assignments blijven |
| 3 | Vervangen | Windows Firewall en Office Updates wisselen van policytype — handwerk |
| 4 | Opheffen | Network Security, Windows Search, System Services, OneDrive KFM verwijderen |
| 5 | Uitrollen | de nieuwe policies via CIPP of `Start-IntuneRestoreConfig` |
| 6 | Toewijzen | `Set-BaselineAssignment.ps1 -Scope D -AllDevices` en `-Scope U -AllUsers` nemen alleen fase 1; de pilot volgt met `-GroupName 'SEC-Baseline-Pilot'` |
| 7 | Opnieuw inventariseren | de lijst met wees-policies moet leeg zijn |

> **De baseline-check is hier geen vangnet.** De checks vergelijken op inhoud, niet op naam.
> Een achtergebleven policy onder de óude naam houdt zijn check dus groen, ook als de nieuwe
> nooit is aangemaakt of nergens is toegewezen.

## Eerst in een pilot

Fase 2 in `_manifest.json`. Deze policies rollen via het pakket `Baseline-Pilot` uit naar
`SEC-Baseline-Pilot`, en pas naar iedereen als ze naar fase 1 gaan — een PR, want dat
verandert naar wie ze uitrollen. Het waarom per policy is de `faseWaarom` uit het manifest.

| Policy | Waarom |
|---|---|
| `WIN - D - Access Control` | Gebruikers moeten hun volledige naam typen in plaats van te klikken, en zien een banner. Pas de bannertekst eerst aan op de eigen organisatienaam. |
| `WIN - D - Account Lockout` | De machine-drempel zet een apparaat na tien mislukte pogingen in BitLocker-herstel. Dat is recoverable (de sleutel staat in Entra ID) maar levert een helpdeskvraag op; kijk in de pilot hoe vaak het gebeurt. |
| `WIN - D - Administrator Protection` | Verandert hoe een beheerder werkt: geen permanent verhoogde rechten meer, maar per handeling een bevestiging. Scripts en tools die stil op beheerdersrechten leunen merken dat. Windows 11 24H2 en hoger; op oudere builds doet hij niets. |
| `WIN - D - Cryptography` | Een intern systeem dat alleen TLS 1.0/1.1 spreekt wordt onbereikbaar. Dat is de bedoeling, maar het moet bekend zijn. |
| `WIN - D - Device Guard and Credential Guard` | Vraagt een herstart, en geheugenintegriteit (HVCI) laadt geen stuurprogramma's die er niet op gebouwd zijn — denk aan oude VPN-, printer- en dockdrivers. Kijk in de pilot of alles nog start. |
| `WIN - D - Disable NTLM` | Weigert alle NTLM, inkomend en uitgaand. Wat niet via Kerberos kan breekt: toepassingen die op IP-adres verbinden, apparaten buiten het domein, en shares waarvoor het apparaat geen Kerberos-ticket krijgt — een Entra-joined apparaat dat een share op Entra Domain Services opent valt terug op NTLM. Lees vóór de pilot op een paar Windows 11 24H2-apparaten Microsoft-Windows-NTLM/Operational (4020/4021 uitgaand, 4022/4023 inkomend): die logging staat daar standaard aan en laat zien wat er zou breken. |
| `WIN - D - Enrollment Hardening` | Raakt de eerste installatie van een apparaat, niet een draaiend apparaat. Test op één Autopilot-toestel: zonder netwerk komt de gebruiker niet verder, en dat is de bedoeling — maar het moet wel kloppen met hoe apparaten bij jullie worden uitgerold. |
| `WIN - D - In-Box App Removal` | Verwijdert ingebouwde apps, ook van apparaten die al in gebruik zijn. Kijk in de pilot of iemand er een mist. |
| `WIN - D - Kernel DMA Protection` | Een dock of eGPU zonder DMA-remapping werkt niet meer. Test met de docks die in de vloot zitten. |
| `WIN - D - Logon Hardening` | Gebruikers moeten voortaan CTRL+ALT+DEL indrukken vóór het aanmeldscherm. Communiceer dat vóór de brede uitrol. |
| `WIN - D - Printing Hardening` | Windows Protected Print laat printers vallen die geen Mopria-driver hebben. Inventariseer de printervloot eerst. |
| `WIN - D - Remote Access Hardening` | Controleer of geen beheerscript of monitoringtool op winrs leunt. Enter-PSSession en Invoke-Command blijven werken, winrs niet. |
| `WIN - D - Removable Storage` | Schrijven naar USB-sticks, externe schijven en telefoons wordt geblokkeerd, en dat merkt een gebruiker meteen. Let op: tot deze policy breed uitrolt is verwisselbare opslag nergens beperkt — BitLocker laat removabledrivesrequireencryption bewust uit, omdat deze blokkade dat afdekt. |
| `WIN - D - Script File Associations` | Dubbelklikken op een .js-, .vbs- of .hta-bestand opent voortaan Kladblok. Een inlog- of installatiescript dat zo gestart wordt doet dan niets meer; kijk in de pilot of er zulke scripts in omloop zijn. |
| `WIN - D - Windows AI Features Restricted` | Gebruikers zien de AI-knoppen in Paint verdwijnen. Dat is de bedoeling, maar het is zichtbaar en verdient een aankondiging. Kies per klant tussen deze en de Permitted-variant — nooit allebei toewijzen. |
| `WIN - D - Windows Hello for Business` | Elke gebruiker wordt bij de eerstvolgende aanmelding door de PIN-inrichting geleid, en een apparaat zonder TPM krijgt WHfB niet. Gaat samen met WIN - U - Windows Hello for Business de pilot in: de een in de pilot en de ander op iedereen maakt de pilot zinloos. |
| `WIN - U - AI Usage Control Restricted` | Neemt de Edge-URL-blokkeerlijst over van Microsoft Edge User Experience — die instelling is daar al weggehaald. Controleer in de pilot dat er geen legitieme site geblokkeerd wordt. Kies per klant tussen deze en de Permitted-variant; nooit allebei toewijzen. |
| `WIN - U - Compliance OS Version` | Een apparaat onder de ondergrens wordt niet-compliant en verliest daarmee toegang via Conditional Access. Kijk eerst in de rapportage hoeveel apparaten dat raakt — het antwoord hoort nul te zijn, maar dat moet je gezien hebben en niet aannemen. Respijt staat op 72 uur. |
| `WIN - U - Microsoft Outlook Cached Mode Managed` | Raakt elk bestaand profiel: Outlook bouwt het OST opnieuw op en een gedeelde mailbox in het profiel gaat van gecachet naar online. Dat is zichtbaar — de eerste synchronisatie kost tijd en bandbreedte, en wie gewend is offline in een gedeelde mailbox te werken merkt het meteen. Eerst op de pilotgroep, en kijk daar hoeveel profielen een gedeelde mailbox hebben. |
| `WIN - U - Microsoft Teams` | Blokkeert aanmelden met een account uit een andere tenant. Dat is de bedoeling, maar wie een tweede werkaccount in Teams gebruikt merkt het meteen — kijk in de pilot of dat voorkomt. |
| `WIN - U - Windows Hello for Business` | Hoort bij WIN - D - Windows Hello for Business en gaat samen met die de pilot in — op alle gebruikers zou hij WHfB alsnog op elk apparaat inrichten, en dan test de pilot niets. |
| `MAC - D - FileVault` | Versleutelt de schijf en vraagt de gebruiker daarbij om mee te werken. Controleer in de pilot dat de herstelsleutel ook echt in Intune verschijnt voordat je breed uitrolt. |
| `MAC - D - Passcode and Screen Lock` | Gebruikers met een korter of eenvoudiger wachtwoord moeten het bij de eerstvolgende aanmelding wijzigen. |
| `MAC - D - Software Updates` | Declaratief updatebeleid (DDM) vraagt macOS 14 of hoger; oudere Macs krijgen het profiel niet. De drie automatische acties staan op de eerste keuze uit de catalogus — controleer in de pilot of dat "Standaard" of "Altijd aan" is. |
| `MAC - U - Compliance OS Version` | Een Mac onder macOS 14 wordt niet-compliant en verliest toegang via Conditional Access. OVERZICHT.md noemt al dat oudere Macs het updateprofiel niet krijgen; deze policy maakt dat zichtbaar in plaats van stil. Kijk eerst hoeveel Macs het raakt. Respijt staat op 72 uur. |

Zonder toewijzing staan er 51: de 25 hierboven, 10 die op een voorwaarde
wachten, 9 voor een eigen groep en 7 die niet uitrollen. Die laatste twee zijn een
*alternatief* voor een policy die wél is toegewezen, niet een aanvulling erop: de update-ringen
1 en 2 voor Windows en Defender zetten dezelfde instellingen als ring 3 met andere waarden, de
drie CIPP-standaardtemplates voor Defender doen hetzelfde als hun OIB-tegenhanger, de
WHfB-variant voor gedeelde apparaten hoort op een groep met gedeelde apparaten, en de twee
macOS-inschrijfprofielen verschillen in precies één instelling. Allemaal op All Devices zou
een conflict opleveren, waarna Intune de betwiste instelling door géén van beide policies
toepast; die horen op een eigen groep.
