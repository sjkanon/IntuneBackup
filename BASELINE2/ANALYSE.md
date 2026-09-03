# Gapanalyse — wat missen we voor een eerste baseline?

Handgeschreven, in tegenstelling tot [`README.md`](README.md) ernaast. Dit legt vast *hoe* de
BASELINE2-set tot stand is gekomen en — belangrijker — wat er bewust **niet** in zit en waarom.
Zonder dat laatste is een volgende ronde gedoemd dezelfde 500 instellingen opnieuw te wegen.

Datum: 3 september 2026.

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

Onze twee bestaande sets zetten samen 1.908 instellingen (`IntuneTemplate/` 106 policies /
1.877 instellingen, `ISMSTemplate/` 10 / 31). Daartegen leverde IntuneAdmin **509
`settingDefinitionId`'s op die wij nergens zetten**. Die vallen zo uiteen:

| | Aantal | Wat ermee gebeurde |
|---|---:|---|
| Browser (Chrome, Safari, Edge) | 180 | Chrome en Safari gebruiken we niet. De Edge-instellingen zijn cosmetisch of al gedekt — zie hieronder. |
| Apple-payloads (`com.apple.*`) | 21 | grotendeels iOS-restricties voor *supervised* apparaten; wij hebben geen enrolled iOS. Eén uitzondering: de passcode-payload. |
| Visual Studio | 9 | ontwikkelaarsspecifiek, niet apparaatbreed. `ISMSTemplate/` dekt de Copilot-kant al. |
| Office | 5 | al gedekt door de vier Office-policies in de baseline. |
| Overige Windows-CSP | 294 | het echte werk. Hiervan viel het overgrote deel af op *niet apparaatbreed* (kiosk, AVD, Windows 365, gedeelde apparaten), *CIS L2* (bewust: L2 breekt zaken) of *al gedekt via een andere instelling*. |
| **Overgebleven en overgenomen** | **8** | verdeeld over 5 Windows-policies in `BASELINE2/` |

Plus één gat dat niet uit IntuneAdmin kwam maar uit onze eigen documentatie: de macOS-passcode.
Totaal 6 policies, 15 instellingen.

## Wat we misten en nu hebben

| Policy | Wat er ontbrak | Waarom het de lat haalt |
|---|---|---|
| `WIN - D - Account Lockout` | **Er werd nergens geteld hoe vaak iemand mis inlogde.** De baseline dwingt wachtwoordlengte (14) en -historie (24) af, maar zonder drempel kan iemand met een gestolen laptop onbeperkt blijven proberen. | CIS, Microsoft Security Baseline en NIST SP 800-63B schrijven het alle drie voor. Geldt voor elk Windows-apparaat. |
| `WIN - D - Logon Hardening` | CTRL+ALT+DEL werd niet vereist, en het vergrendelscherm liet netwerkkeuze toe. | CTRL+ALT+DEL is de enige toetscombinatie die Windows niet aan een toepassing kan doorgeven — zonder die eis is een namaak-aanmeldscherm triviaal. CIS L1 sinds Windows NT. |
| `WIN - D - Audit Policy Enforcement` | De 40 auditinstellingen van de baseline konden stilzwijgend overruled worden door de oude categorie-instellingen. | Eén instelling die van de bestaande auditpolicy de werkelijke waarheid maakt in plaats van een voornemen. Onzichtbaar, breekt niets. |
| `WIN - D - Kernel DMA Protection` | Niets hield een DMA-capabel randapparaat tegen dat geen remapping ondersteunt. | De "evil maid": laptop even alleen, stekker erin, sleutel uit het geheugen. Microsoft zet hem in zijn eigen baseline op dezelfde waarde. |
| `WIN - U - Attachment Scanning` | De virusscanner werd niet aangeroepen op het moment dat een gedownloade bijlage werd geopend. | Een bijlage die bij binnenkomst nog onbekend was, is een dag later wél herkend. CIS L1, geen merkbare impact. |
| `MAC - D - Passcode and Screen Lock` | **De compliance-policy eist een wachtwoord van 8 tekens en vergrendeling na 15 minuten, maar geen enkele policy stelde dat in.** | Stond al als open gat in `OVERZICHT.md`. Een Mac zonder schermvergrendeling krijgt een rood vinkje en de gebruiker kan er niets aan doen. Waarden één op één uit de compliance-policy. |

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

**Compliance-policies voor iOS en Android zijn zinloos zolang dat zo is.** IntuneAdmin en de
UniFy-sets hebben ze ruim (iOS Device Health/Properties/MDE, Android Enterprise en
Personally-owned work profile), maar een compliance-policy raakt alleen een enrolled apparaat.
Toevoegen zou een set rode vinkjes opleveren voor apparaten die er niet zijn. Dit wordt pas een
gat op het moment dat er telefoons worden ingeschreven — zet het dan op de agenda, niet eerder.

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

Deze drie staan **niet** als BASELINE2-template in deze map, en dat is opzet. Een tweede
MAM-policy naast de bestaande op dezelfde apps is niet hoe App Protection stapelt, en het zou een
onduidelijke situatie opleveren. De juiste ingreep is een wijziging in
`Baseline_IOS_U_App_Protection` en `Baseline_AND_U_App_Protection` zelf. Die twee zijn nog niet
in de tenant uitgerold (`OVERZICHT.md`: uitgerold = 0), dus dat kan nu nog zonder migratie —
maar het is een wijziging aan de mét de klant afgesproken baseline, en dat is een besluit, geen
opruimactie.

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
| CIS L2 in het algemeen | L2 is expliciet "voor omgevingen waar beveiliging boven functionaliteit gaat". Dat is de tegenovergestelde lat van deze set. |

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
