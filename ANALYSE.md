# Gapanalyse — wat missen we voor een eerste baseline?

Handgeschreven, in tegenstelling tot [`README.md`](README.md) ernaast. Dit legt vast *hoe* de
BASELINE2-set tot stand is gekomen en — belangrijker — wat er bewust **niet** in zit en waarom.
Zonder dat laatste is een volgende ronde gedoemd dezelfde 500 instellingen opnieuw te wegen.

Datum: 3 september 2026. De baseline telt 134 policies. Deze analyse beschrijft de 25 die in september 2026 zijn toegevoegd: 15 uit deze analyse en de 10 die tot deze
datum in `ISMSTemplate/` stonden en hier zijn opgegaan. Het einddoel is één baseline — deze map
is de wachtkamer, `IntuneTemplate/` de bestemming.

## De vraag

Missen we iets uit IntuneAdmin dat we echt moeten hebben voor een eerste baseline, de ISMS-set,
NIS2, ISO 27001 en andere templates op GitHub meegenomen? En zo ja: wat daarvan werkt
aantoonbaar, hebben we nodig om gebruikers veilig te stellen, en geldt voor élk apparaat?

## Bronnen

| Bron | Wat het is | Hoe gebruikt |
|---|---|---|
| [IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines) | 874 profielen: CIS v4 Windows 11 L1/L2, CIS Edge, CIS Visual Studio Code, Microsoft Endpoint Security-baselines, Modern Workplace (Fundamentals/Associate/Expert), **ISO-IEC 27001-2022**, **NIS2 2022/2555**, Apple, Android, Linux, AVD/W365 | volledig vergeleken op `settingDefinitionId` |
| [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) | Windows v3.8, macOS v1.0, BYOD | is al de bron van `IntuneTemplate/`; hier alleen gebruikt om te toetsen of iets bewust ontbrak |
| [UniFy-Endpoint/iOS-iPadOS-Intune-Baseline](https://github.com/UniFy-Endpoint/iOS-iPadOS-Intune-Baseline) | 45 profielen, CIS Apple iOS/iPadOS 26 v1.0.0, Corporate én BYOD | MAM-policy vergeleken met de onze |
| [UniFy-Endpoint/Android-Enterprise-Baseline](https://github.com/UniFy-Endpoint/Android-Enterprise-Baseline) | Android Enterprise, alle vijf de beheervormen | MAM-policy vergeleken met de onze |
| [pl4nty/intune-change-tracking](https://github.com/pl4nty/intune-change-tracking) (`DCv2/Settings/`) | mirror van de échte settings catalog-definities | elke overgenomen waarde geverifieerd: platform, toegestane opties, min/max |
| [Policy CSP op Microsoft Learn](https://learn.microsoft.com/en-us/windows/client-management/mdm/) | de normatieve documentatie | formaat, standaardwaarde en minimale Windows-versie per instelling |
| [usnistgov/macos_security](https://github.com/usnistgov/macos_security) | NIST macOS Security Compliance Project | bekeken, niet gebruikt: levert `mobileconfig`/YAML-regels, geen Intune-JSON — niet zonder handwerk over te nemen |

## Methode

Vergelijken op **`settingDefinitionId`**, nooit op profielnaam. Twee profielen die allebei
"Firewall" heten kunnen niets gemeen hebben, en twee die anders heten kunnen dezelfde instelling
op een andere waarde zetten — en dát is wat in Intune een *Conflict* oplevert.

Drie dingen die daarbij misgaan als je ze niet weet:

1. **De JSON's van IntuneAdmin staan in UTF-16LE met BOM.** Een gewone `readFileSync(f,"utf8")`
   gevolgd door `JSON.parse` faalt op alle 874.
2. **Een `GroupSettingCollection` is een container, geen instelling.** Twee policies die dezelfde
   macOS-payload gebruiken maar andere kinderen zetten, botsen niet. `flattenSettings` in
   [`scripts/lib/templates.js`](../scripts/lib/templates.js) maakt dat onderscheid al.
3. **Waarden uit een externe set zijn niet vanzelf goed.** Zie *Fouten in de bronnen* hieronder.

## Uitkomst in cijfers

Op het moment van de vergelijking zetten onze twee sets samen 1.908 instellingen
(`IntuneTemplate/` 106 policies / 1.877 instellingen, `ISMSTemplate/` 10 / 31 — die tweede is
sindsdien in deze map opgegaan). Daartegen leverde IntuneAdmin **509 `settingDefinitionId`'s op
die wij nergens zetten**. Die vallen zo uiteen:

| | Aantal | Wat ermee gebeurde |
|---|---:|---|
| Browser (Chrome, Safari, Edge) | 180 | Chrome en Safari gebruiken we niet. De Edge-instellingen zijn cosmetisch of al gedekt — zie hieronder. |
| Apple-payloads (`com.apple.*`) | 21 | grotendeels iOS-restricties voor *supervised* apparaten; wij hebben geen enrolled iOS. Eén uitzondering: de passcode-payload. |
| Visual Studio | 9 | ontwikkelaarsspecifiek, niet apparaatbreed. `WIN - D - AI Tooling` dekt de Copilot-kant al. |
| Office | 5 | al gedekt door de vier Office-policies in de baseline. |
| Overige Windows-CSP | 294 | het echte werk. Hiervan viel het overgrote deel af op *niet apparaatbreed* (kiosk, AVD, Windows 365, gedeelde apparaten), *CIS L2* (bewust: L2 breekt zaken) of *al gedekt via een andere instelling*. |
| **Overgebleven en overgenomen** | **14** | verdeeld over 8 Windows-policies in `BASELINE2/` |

Plus drie gaten die niet uit IntuneAdmin kwamen: de macOS-passcode (uit onze eigen `OVERZICHT.md`),
de drie MAM-verscherpingen (uit de UniFy-vergelijking) en de vier compliance-policies voor iOS en
Android die er helemaal niet waren.

## Wat we misten en nu hebben

| Policy | Wat er ontbrak | Waarom het de lat haalt |
|---|---|---|
| `WIN - D - Account Lockout` | **Er werd nergens geteld hoe vaak iemand mis inlogde.** De baseline dwingt wachtwoordlengte (14) en -historie (24) af, maar zonder drempel kan iemand met een gestolen laptop onbeperkt blijven proberen. | CIS, Microsoft Security Baseline en NIST SP 800-63B schrijven het alle drie voor. Geldt voor elk Windows-apparaat. |
| `WIN - D - Logon Hardening` | CTRL+ALT+DEL werd niet vereist, en het vergrendelscherm liet netwerkkeuze toe. | CTRL+ALT+DEL is de enige toetscombinatie die Windows niet aan een toepassing kan doorgeven — zonder die eis is een namaak-aanmeldscherm triviaal. CIS L1 sinds Windows NT. |
| `WIN - D - Audit Policy Enforcement` | De 40 auditinstellingen van de baseline konden stilzwijgend overruled worden door de oude categorie-instellingen. | Eén instelling die van de bestaande auditpolicy de werkelijke waarheid maakt in plaats van een voornemen. Onzichtbaar, breekt niets. |
| `WIN - D - Kernel DMA Protection` | Niets hield een DMA-capabel randapparaat tegen dat geen remapping ondersteunt. | De "evil maid": laptop even alleen, stekker erin, sleutel uit het geheugen. Microsoft zet hem in zijn eigen baseline op dezelfde waarde. |
| `WIN - U - Attachment Scanning` | De virusscanner werd niet aangeroepen op het moment dat een gedownloade bijlage werd geopend. | Een bijlage die bij binnenkomst nog onbekend was, is een dag later wél herkend. CIS L1, geen merkbare impact. |
| `WIN - D - Printing Hardening` | De printspooler stond open: gewone gebruikers mochten drivers installeren bij een gedeelde printer, en Protected Print stond uit. | Dat is precies het gat waar PrintNightmare doorheen liep. Elk Windows-apparaat heeft een spooler, ook zonder printer. |
| `WIN - D - Remote Access Hardening` | De WinRM-remoteshell (`winrs`) stond open en een inactieve SMB-sessie bleef staan. | Standaardstap in lateral movement. Werkplekken hebben geen legitieme reden inkomende remoteshells te accepteren. |
| `WIN - D - Privacy and Telemetry` | Klembord tussen apparaten, invoerpersonalisatie, activiteiten-upload en advertentie-id stonden alle vier aan. | Vier kanalen waarlangs gegevens het apparaat verlaten zonder dat iemand ze als datastroom herkent. Alle vier CIS L1. |
| `MAC - D - Passcode and Screen Lock` | **De compliance-policy eist een wachtwoord van 8 tekens en vergrendeling na 15 minuten, maar geen enkele policy stelde dat in.** | Stond al als open gat in `OVERZICHT.md`. Een Mac zonder schermvergrendeling krijgt een rood vinkje en de gebruiker kan er niets aan doen. Waarden één op één uit de compliance-policy. |
| `IOS - U - App Protection` | Het iOS-deelmenu bood nog onbeheerde apps aan, ondanks de beperking op uitgaande overdracht. Schermafdrukken waren niet geblokkeerd, PIN-hergebruik wel toegestaan. | Zie *Mobiel* hieronder. Raakt élke iPhone met bedrijfsgegevens — ook, en juist, de privétoestellen. |
| `AND - U - App Protection` | PIN-hergebruik toegestaan. | Een PIN-reset zonder historie is betekenisloos, en dat is precies het moment waarop het ertoe doet. |
| `IOS/AND - U - Compliance Device Health` en `Compliance Password` | **Er was geen enkele compliance-policy voor iOS en Android.** | "Vereis een compliant apparaat" in Conditional Access is voor die twee platformen zonder policy een lege huls. Doet vandaag nog niets — zie het voorbehoud hieronder. |

## Tweede ronde: vergelijken op profiel in plaats van op instelling

De eerste vergelijking hierboven ging per `settingDefinitionId`. Dat vindt losse gaten, maar het
mist een hele categorie: een IntuneAdmin-*profiel* waarvan elke instelling apart onbelangrijk
lijkt, terwijl het profiel als geheel iets afdekt dat wij nergens doen. Daarom is de set daarna
nog eens per profiel doorgerekend — 800 profielen met instellingen, waarvan er **322 voor 0%
gedekt** waren.

Van die 322 valt het meeste af om dezelfde redenen als eerder: 90 losse CIS-profielen van één
instelling, 89 Edge-profielen (L2 of cosmetisch), 26 iOS- en 9 Android-restricties die
inschrijving vragen, 19 profielen voor Windows 365 en AVD, 16 voor Chrome en Safari, en één voor
Defender op Linux. Wat overbleef zijn **vijf baselines die er wél toe doen**:

| Baseline | Wat wij misten | Fase |
|---|---|---:|
| `WIN - D - Power Management` | De baseline eist al een wachtwoord bij ontwaken, maar de klep dicht doen deed niets — dus bleef het scherm ontgrendeld. Dat is het moment waarop een laptop onbeheerd achterblijft. | 1 |
| `WIN - D - Storage Sense` | Een volle schijf breekt Windows Update, BitLocker-versleuteling en Defender-definitie-updates. Dat is de toestand waarin een apparaat stilletjes achterloopt. | 1 |
| `WIN - D - Enrollment Hardening` | Tijdens OOBE de netwerkstap overslaan is de bekendste manier om Autopilot te omzeilen. Eén instelling sluit hem af. | 2 |
| `WIN - D - Windows AI Features Restricted` / `Permitted` | Cocreator, Image Creator, Generative Fill en de Settings Agent sturen invoer naar een generatieve dienst. Zie *AI is een klantbesluit* hieronder. | 2 / 5 |
| `WIN - U - Microsoft Teams` | Zonder tenantbeperking kan een gebruiker in de zakelijke Teams-client inloggen op een vreemde tenant en daar bestanden naartoe slepen — een uitgaande datastroom die nergens wordt gelogd. | 3 |

Plus drie CIS L1-user rights die aan de bestaande `WIN - D - User Rights` zijn toegevoegd:
`profilesystemperformance`, `replaceprocessleveltoken` en `logonasbatchjob`. De overige
user rights uit die CIS-set staan in IntuneAdmin met een placeholder (`<YOURACT>`) omdat de
CIS-eis "niemand" is; een lege waardecollectie is in de settings catalog niet betrouwbaar te
coderen, dus die zijn bewust overgeslagen in plaats van gegokt.


### Tenant-specifieke waarden: laat CIPP ze invullen

De Teams-aanmeldbeperking vraagt een tenant-id. Dat hoeft geen handmatige stap te zijn: CIPP
vervangt bij uitrol een aantal `%tokens%` door tenant-specifieke waarden — `%tenantid%` en
`%OrganizationId%` worden de customerId, `%tenantfilter%` het standaarddomein, `%tenantname%` de
weergavenaam (zie `Get-CIPPTextReplacement` in CIPP-API; de vervanging is hoofdletterongevoelig).
De OneDrive-policies in deze baseline gebruiken die constructie al voor hun tenantlijst en voor
Known Folder Move, dus de Teams-policy doet nu hetzelfde.

Dat legde een bestaande fout bloot. De baseline-check nam die tokens tot nu toe mee als
verwachte waarde, terwijl in de tenant de ingevulde GUID staat. Vijf checks stonden daardoor
permanent rood — niet omdat de tenant afweek, maar omdat de baseline iets vergeleek wat er nooit
zo staat. Zo'n check is erger dan geen check: hij vraagt elke ronde aandacht en leert iedereen om
rood te negeren. `generate-baseline.js` slaat die instellingen nu over, met een melding per
geval, net zoals het het EDR-onboardingtoken al oversloeg.

**Let op bij de andere uitrolroute:** CIPP doet die vervanging, `Start-IntuneRestoreConfig` niet.
Wie via IntuneBackupAndRestore uitrolt houdt `%OrganizationId%` letterlijk in de policy en moet
het id met de hand invullen.


### AI is een klantbesluit, dus elke AI-policy is een paar

Of generatieve AI op de werkplek mag is geen technisch feit maar beleid, en dat verschilt per
klant. Alle drie de AI-policies bestaan daarom in twee varianten die dezelfde instellingen op de
tegenovergestelde waarde zetten. **Wijs er per paar één toe** — allebei levert in Intune een
Conflict op, waarna de betwiste instelling door géén van beide policies wordt toegepast en er dus
niets meer geregeld is. `check-scope.js` bewaakt dat.

| Paar | Restricted | Permitted |
|---|---|---|
| `WIN - D - Windows AI` (112) | Recall niet beschikbaar, geen schermafdrukken, Click To Do uit | alle drie toegestaan, expliciet vastgelegd |
| `WIN - D - Windows AI Features` (147 / 146) | Cocreator, Image Creator, Generative Fill en Settings Agent uit | dezelfde vier aan |
| `WIN - U - AI Usage Control` (139 / 149) | Edge blokkeert tien publieke AI-diensten plus de Store-website | alleen de vier Store-regels; de AI-diensten blijven bereikbaar |

Twee dingen die daarbij bewust zijn gedaan:

- **De Restricted-variant houdt het oude checkId.** 112 en 139 waren er al; die variant is de
  voortzetting van de policy zoals hij was, dus daar blijven bestaande findings aan hangen. De
  Permitted-tegenhangers kregen 148 en 149. checkId 144 — de Windows AI Features-policy vóór
  haar splitsing — is opgeheven en niet hergebruikt.
- **De Permitted-variant van AI Usage Control laat de blokkeerlijst niet vallen.** Die lijst
  bevatte vóór de AI-ronde al vier regels voor de Store-website. Ze zijn tot vier teruggebracht
  in plaats van de hele instelling weg te laten — anders had het toestaan van AI stilzwijgend ook
  de Store-blokkade opgeheven, en dat is een ander besluit.

De Permitted-varianten zijn geen aanbeveling. Ze staan in fase 5 (niet uitrollen) omdat de
baseline standaard de Restricted-kant kiest; wie de andere kant op wil, wisselt de toewijzing om.

Voor wie dat doet is er een derde policy: **`WIN - D - Windows AI Recall Boundaries`** (150,
fase 3). Recall toestaan is namelijk geen alles-of-niets. De schade van een index is niet
uniform verdeeld — één momentopname van een geopende wachtwoordkluis of van het Entra-portaal
weegt zwaarder dan duizend van een tekstverwerker. Die policy haalt precies die plekken eruit:

| Instelling | Waarde | Waarom |
|---|---|---|
| `SetDenyUriListForRecall` | negen M365-beheerportalen en aanmeldpagina's | daar staat per definitie iets op het scherm dat niet in een doorzoekbare index thuishoort |
| `SetDenyAppListForRecall` | RDP en vier wachtwoordkluizen | een RDP-sessie toont het scherm van een *ander* systeem; een kluis toont wachtwoorden |
| `SetMaximumStorageDurationForRecallSnapshots` | 30 dagen | de kortste waarde die de instelling aanbiedt; standaard verloopt er niets |
| `SetMaximumStorageSpaceForRecallSnapshots` | 10 GB | begrensd in plaats van "wat de schijf toelaat" |
| `AllowRecallExport` | uit | de exportknop is de weg waarlangs de hele index het apparaat verlaat |

De URI-lijst klopt voor elke M365-tenant. **De app-lijst is bewust onvolledig** en moet per klant
worden aangevuld met wat daar gevoelige gegevens toont: het HR-pakket, het dossiersysteem, de
bankomgeving. Namen mogen een uitvoerbaar bestand zijn (`app.exe`) of een AUMID voor Store-apps.

Eén ding blijft staan ongeacht deze begrenzing: de index valt onder dezelfde bewaartermijnen en
verwijderingsplichten als de gegevens die erin staan. Een bewaartermijn van 30 dagen is een
technische grens, geen juridisch antwoord.

**Twee sets die de vergelijking juist afwees:**

- *App and Browser Isolation* (Microsoft Defender Application Guard, 10 instellingen) staat er in
  drie IntuneAdmin-mappen. Microsoft heeft MDAG voor Edge inmiddels afgeschaft; een baseline
  bouwen op een functie die verdwijnt levert alleen onderhoud op.
- *MDE Enable file hash computation* zet de oude ADMX-variant, en nog op *Disabled* ook, terwijl
  wij de moderne Defender-CSP-variant al aan hebben staan in
  `WIN - D - Defender Additional Configuration`. Overnemen zou de zaak verslechteren.

**Derde fout in de bron.** Naast de kapotte `AccountLockoutPolicy` hierboven: de vier Windows
AI-profielen van IntuneAdmin heten "Enable Paint Cocreator", "Paint Image Creator" enzovoort en
zetten `Disable X` op *Disabled* — ze schakelen die AI-functies dus juist **in**. Voor ISMP22
moet dat andersom, dus onze policy zet ze op 1. Wie die profielen ongezien importeert krijgt het
tegenovergestelde van wat de mapnaam suggereert.

## Wat de ISO 27001- en NIS2-mappen van IntuneAdmin opleverden

Weinig, en dat is een bevinding op zich.

- De **ISO-IEC 27001-2022-map** bevat precies één profiel: Microsoft Edge. Van de 47 instellingen
  die wij daaruit niet zetten gaat het om zaken als `cryptowalletenabled`, `gamermodeenabled`,
  `aigenthemesenabled` en `browseraddprofileenabled`. Dat zijn nette Edge-instellingen, maar ze
  volgen niet uit ISO 27001 en ze zijn niet apparaatkritisch. Onze
  [`Baseline_WIN_D_Microsoft_Edge_Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.md)
  (54 instellingen) dekt de beveiligingskant al. **Geen enkele overgenomen.**
- De **NIS2-map** bevat een Edge- en een Windows 11-profiel. Het Windows 11-profiel leverde 11
  instellingen op die wij niet zetten. Daarvan zijn er **vier overgenomen** (de accountlockout-
  drempels en de audit-override); de rest viel af: `donotrequirectrlaltdel` zat er niet in maar
  wél in CIS, de NTLM-audit is al gedekt door `WIN - D - Disable NTLM`, en
  `sharesthatcanbeaccessedanonymously` gebruikt een `<empty string>`-sentinel die ik niet
  ongezien wil overnemen.

Conclusie: de norm-mappen bij IntuneAdmin zijn dun. De inhoudelijke winst zat in de CIS- en
Microsoft Endpoint Security-mappen, en de verantwoording *naar* ISO 27001 en NIS2 leggen we zelf
in `_manifest.json` — zoals `ISMSTemplate/` het ook doet.

## Mobiel: het echte gat, en waarom het geen BASELINE2-template is

iOS en Android hebben in `IntuneTemplate/` samen precies twee policies, allebei App Protection
(MAM). Beide staan op `targetedAppManagementLevels: "unmanaged"` — de telefoons zijn **niet
enrolled**. Dat heeft twee gevolgen:

**Compliance-policies voor iOS en Android doen vandaag niets.** Een compliance-policy raakt
alleen een ingeschreven apparaat, en die zijn er niet. Ze staan er toch — vier stuks, Device
Health en Password per platform — omdat het alternatief is dat de dag waarop de eerste telefoon
wordt ingeschreven een dag zonder toets is, en omdat "vereis een compliant apparaat" in
Conditional Access voor iOS en Android zonder policy een lege huls is: er is dan geen enkele regel
om aan te voldoen. Ze leveren geen rode vinkjes op zolang er niets is ingeschreven — een
compliance-policy zonder apparaten rapporteert niets. Wijs ze pas toe wanneer er daadwerkelijk
wordt ingeschreven; tot dan staan ze klaar. Dat voorbehoud staat ook per policy in het manifest.

**De MAM-policies zijn wél het enige wat elke telefoon raakt, en daar zitten drie echte gaten.**
Vergeleken met de L2-BYOD-varianten van UniFy-Endpoint is onze set op de meeste punten *strenger*
(uitgaande dataoverdracht alleen naar beheerde apps, opslaan-als geblokkeerd, afdrukken
geblokkeerd, meldingen zonder organisatiegegevens, back-up geblokkeerd, SafetyNet hardware-backed).
Wat ontbreekt:

| Instelling | Wij | Zij | Waarom het uitmaakt |
|---|---|---|---|
| `filterOpenInToOnlyManagedApps` (iOS) | `false` | `true` | **Het belangrijkste.** Uitgaande overdracht staat al op "alleen beheerde apps", maar zonder dit vinkje biedt het iOS-deelmenu nog steeds onbeheerde apps aan. De bestaande beperking is daarmee half. |
| `screenCaptureConfigurationState` (iOS) | niet gezet | `blocked` | Android blokkeert schermafdrukken al (`screenCaptureBlocked: true`); op iOS was daar tot iOS 26 geen instelling voor. Nu wel — en de asymmetrie is niet bedoeld. |
| `previousPinBlockCount` (beide) | `0` | `5` | Geen PIN-historie: een gebruiker kan bij een reset dezelfde PIN opnieuw kiezen. Geen enkele frictie om te repareren. |

Deze drie staan als `BASELINE2 - IOS/AND - U - App Protection` in deze map: een volledige kopie
van de baseline-policy met de verscherping erin. **Rol die uit in plaats van de baseline-variant,
niet ernaast.** Twee App Protection-policies op dezelfde apps stapelen niet netjes — Intune kiest
per instelling de strengste waarde, maar welke policy een instelling levert is dan niet meer af te
lezen. Uiteindelijk hoort de wijziging terug in de baseline-policy zelf; dat is een besluit over de
mét de klant afgesproken baseline, geen opruimactie, en daarom staat het hier eerst.

Bewust niet overgenomen uit de UniFy-sets: `pinRequiredInsteadOfBiometricTimeout` op 30 minuten
(wij: 12 uur — merkbare frictie, en de PIN is niet de enige beveiliging),
`allowedInboundDataTransferSources` op `managedApps` (blokkeert privéfoto's in een werkdocument;
de bronnen zijn het hier onderling ook niet eens), `contactSyncBlocked` (breekt naam-weergave bij
inkomende gesprekken) en `minimumRequiredOsVersion` (een hard versienummer sluit gebruikers buiten
en vraagt onderhoud — `minimumWarningOsVersion` is het overwegen waard).

## Bewust niet overgenomen — Windows en macOS

| Instelling / onderwerp | Waarom niet |
|---|---|
| SMB-signing "if server/client agrees" | Wij zetten al de strengere `digitallysigncommunicationsalways`, aan beide kanten. Toevoegen is dubbel onderhoud. |
| `remoteshell_allowremoteshellaccess` = 0 | CIS L1, maar breekt WinRM-gebaseerd beheer. Niet apparaatbreed veilig zonder eerst te weten wat erop leunt. |
| `printers_configurewindowsprotectedprint` | Sterke maatregel (Windows Protected Print Mode), maar laat printers met oudere drivers vallen. Vraagt eerst een inventarisatie van de printervloot. |
| `networkaccess_sharesthatcanbeaccessedanonymously` | Gebruikt een `<empty string>`-sentinel in een `SimpleSettingCollection`. Ik heb het gedrag daarvan niet kunnen verifiëren; niet ongezien overnemen. |
| `cryptography_tlsciphersuites` | Een expliciete cipher suite-volgorde veroudert en breekt stil verbindingen. Hoort bij een cryptobeleid met een eigenaar, niet in een baseline. |
| `applicationcontrol` / WDAC / AppLocker / Smart App Control | Ontbreekt volledig, en dat is de grootste inhoudelijke leemte van de hele baseline. Maar applicatiecontrole is geen instelling die je aanzet — het is een project met een inventarisatie, een audit-fase en een uitzonderingenproces. Hoort niet in een set die "dit werkt voor elk apparaat" belooft. **Wel de belangrijkste kandidaat voor de volgende ronde.** |
| DNS over HTTPS | Kwam niet in IntuneAdmin voor en staat niet in onze set. De baseline zet wel `turn_off_multicast` (LLMNR). DoH afdwingen vraagt een besluit over welke resolver, en dat is tenantspecifiek. |
| `privacy_disableadvertisingid`, `allowcrossdeviceclipboard`, `uploaduseractivities` | Privacy, geen beveiliging. Horen bij `ISMSTemplate/` onder ISDP01 als iemand ze wil. |
| CIS L2 in het algemeen | L2 is expliciet "voor omgevingen waar beveiliging boven functionaliteit gaat". Dat is de tegenovergestelde lat van deze set. Eén uitzondering die wél is overgenomen: PowerShell-transcriptie (L2), omdat die uit ISMP13 volgt. |
| macOS, verder dan de passcode | De vergelijking met IntuneAdmin én de UniFy-sets leverde voor macOS 12 instellingen op die wij niet zetten. Elf daarvan zijn Safari-instellingen die de bron juist op *toestaan* zet (`allowsafariprivatebrowsing_true`) — dat is geen hardening — en de rest zijn Kerberos-SSO-placeholders (`YOURKERBEROSREALM`). **Onze 21 macOS-policies lopen op deze bronnen vóór.** |
| iOS/Android device restrictions | De UniFy-sets hebben ze uitgebreid (App Management, Connectivity Controls, Device Pairing, Lock Screen). Allemaal settings catalog, en die bereiken alleen ingeschreven apparaten. Zelfde agenda als de compliance-policies, maar met meer keuzes — dat is een eigen ronde, geen bijvangst. |

## Fouten die we in de bronnen tegenkwamen

Beide staan hier omdat ze bij een volgende vergelijking opnieuw zullen opduiken.

1. **IntuneAdmin, NIS2 Windows 11-profiel:** `DeviceLock/AccountLockoutPolicy` staat op de kale
   waarde `"15"`. De CSP verwacht daar de drie velden als één string
   (`"AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15"`).
   Zoals het er staat doet het niets. Wij zetten de volledige string.
2. **OpenIntuneBaseline, macOS:** de verouderde PPPC-sleutel `Allowed` naast `Authorization`,
   waardoor macOS de héle TCC-payload afwijst. Al bekend en al opgelost in `import-oib.js`
   ([OIB issue #62](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/issues/62)).

## Wat er nu moet gebeuren

| # | Stap | |
|---:|---|---|
| 1 | BASELINE2 op een pilotgroep | vooral `Kernel DMA Protection` (test met de docks uit de vloot) en `Logon Hardening` (meld CTRL+ALT+DEL vooraf aan gebruikers) |
| 2 | Besluit over de drie MAM-instellingen | wijziging aan de afgesproken baseline; kan nu nog zonder migratie |
| 3 | Controleer de ISMP-koppeling in `_manifest.json` | afgeleid uit `ISMSTemplate/_manifest.json`, niet tegen de brondocumenten gelegd |
| 4 | Bevalt een policy? | verhuizen naar `IntuneTemplate/` onder de `Baseline_`-naam, met checkId en toewijzing |
| 5 | Volgende ronde | applicatiecontrole (WDAC/Smart App Control), en iOS/Android-compliance zodra er telefoons worden ingeschreven |
