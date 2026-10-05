**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# BaselineTemplate/

De CIPP-**baseline** als bestand: welke pakketten in welke stage uitrollen, naar wie, en
wanneer een tenant doorschuift.

| | |
|---|---|
| Bestanden | [`Baseline.json`](Baseline.json) (Intune), [`Defender-Office365.json`](Defender-Office365.json) (e-mail) en [`Windows-Updates.json`](Windows-Updates.json) (patchen) — gegenereerd door [`scripts/generate-baseline-template.js`](../scripts/generate-baseline-template.js) |
| Herkend aan | `TemplateType: "BaselineTemplate"` én de mapnaam `BaselineTemplate/` |
| Naam in CIPP | `Baseline` |

## Waarom dit hier staat

`IntuneTemplate/` levert de policies, maar in CIPP staan templates er alleen: uitrollen doet
een baseline. Dat scherm met de hand invullen is dertien keer dezelfde standard toevoegen en
dertien keer het juiste toewijzingsdoel kiezen — één misklik zet tot 70 policies (het pakket
`[Baseline] - Baseline-Devices`) op het verkeerde publiek. Dit bestand komt daarom uit dezelfde bron als de rest van de repo: het manifest.

## Wat erin staat

| Stage | Pakketten | Doorschuiven naar deze stage |
|---:|---|---|
| 1 · Nu | `[Baseline] - Baseline-Devices`, `[Baseline] - Baseline-Users`, `[Baseline] - Baseline-ADE-token` en de acht groepspakketten `[Baseline] - Baseline-SEC-*` | — stage 1 geldt altijd |
| 2 · Pilot | `[Baseline] - Baseline-Pilot` | alles uit stage 1 is compliant (`success`) **en** twee weken verstreken (`time`) |
| 3 · Wacht op voorwaarde | `[Baseline] - Baseline-Wacht` | `manual` — iemand zet 'm door |

Welke policies in welk pakket zitten staat in de
[`IntuneTemplate`-README](../IntuneTemplate/README.md#cipp-pakketten).

Stage 1 geldt altijd en latere stages stapelen erbovenop. De conditie hoort bij de stage die
je **binnengaat**, niet bij de stage die je verlaat. Fase 3 wacht op iets dat CIPP niet kan
meten — een eerste telefoon-inschrijving — dus daar is `manual` het eerlijke antwoord.

## Importeren — met de knop, niet met de automatische sync

Tools → Community Repos → deze repo → `BaselineTemplate/Baseline.json` → **Import**. CIPP
maakt er een baseline van (geen templaterij) onder Tenant Administration → Baselines.

Hij komt binnen toegewezen aan de placeholder-tenant `Exported Template`; er rolt dus niets
uit tot je zelf tenants kiest. Dat is met opzet — dezelfde placeholder die CIPP's eigen export
gebruikt.

**Die knop is de enige weg.** CIPP heeft twee codepaden die uit een gekoppelde repo lezen, en
maar één ervan kent baselines:

| Pad | Wat het doet met dit bestand |
|---|---|
| Tools → Community Repos → Import (`Invoke-ExecCommunityRepo`) | ziet `TemplateType: "BaselineTemplate"` en roept `Import-CIPPBaselineTemplate` aan — wordt een baseline |
| De geplande template-sync (`New-CIPPTemplateRun`) | haalt élk `.json` op (behalve onder `NativeImport`) en duwt het door `Import-CommunityTemplate`, zónder naar `TemplateType` te kijken |

In dat tweede pad heeft dit bestand geen `RowKey`, geen `@odata.type` en geen `settings`, dus
het valt door alle herkenning heen en landt als een **naamloze rij** in de templates-tabel —
dezelfde rij waarin de andere niet-policybestanden van deze repo terechtkomen (de ontdubbeling
matcht op een lege `Displayname`, dus het blijft bij die ene rij). Die doet niets en kun je in
CIPP verwijderen.

Gevolg voor het dagelijks gebruik: de policies in `IntuneTemplate/` komen vanzelf mee met de
koppeling, de baseline zelf haal je één keer met de knop op — en opnieuw als hij verandert,
waar de catalogus een *UpdateAvailable* bij toont. Een her-import werkt de bestaande baseline
bij op dezelfde GUID, dus de toegewezen tenants en de resultaten blijven staan.

Onder een `NativeImport`-pad zetten om die naamloze rij te vermijden kan niet: de catalogus
filtert dat woord óók weg, en dan is het bestand ook met de knop niet meer te vinden.

## Wat je erna zelf doet

- **Tenants toewijzen.** Zonder dat draait de baseline nergens.
- **De groepen laten bestaan.** `SEC-Baseline-Pilot`, `SEC-Update-Ring1`, `SEC-Update-Ring2`,
  `SEC-Shared-Devices`, `SEC-Android-Dedicated`, `SEC-iOS-BYOD`, `SEC-iOS-Corporate` en
  `SEC-Remote-Support-macOS` moeten in de tenant bestaan; CIPP zoekt ze op naam (wildcards mogen).
  Het zijn standaardnamen. Heet een groep anders, pas dan `faseGroep` in
  [`_manifest.json`](../IntuneTemplate/_manifest.json) aan — voor de pilotgroep ook `PILOT_GROUP`
  in `scripts/lib/templates.js` en `$PilotGroup` in `scripts/Set-BaselineAssignment.ps1` — en
  draai de pijplijn opnieuw. De groep alleen in CIPP wijzigen kan ook, maar een her-import van
  dit bestand zet de standaardnaam terug.
- **De ADE-profielen koppelen.** `[Baseline] - Baseline-ADE-token` wordt bewust niet toegewezen: een
  macOS-inschrijfprofiel hangt aan een ADE-token, niet aan een Entra-groep, en je kiest er per
  token één van de twee.

## Defender-Office365.json — e-mailbeveiliging

Een tweede, losse baseline (`[Baseline] - Defender for Office 365`): Safe Links, Safe
Attachments, anti-phishing, anti-spam en anti-malware, Defender voor SharePoint/OneDrive/Teams, en
de quarantainemelding aan gebruikers **elke 4 uur** — het kortste wat Exchange toestaat. Los van
`Baseline.json` omdat hij Defender for Office 365 Plan 1 vraagt (Business Premium heeft het) en
je hem dus aan andere tenants wilt kunnen toewijzen. De waarden staan met toelichting in
[`scripts/lib/defender-office.js`](../scripts/lib/defender-office.js).

**Bewust géén preset policies.** Microsofts Standard/Strict-presets zijn niet aan te passen en
CIPP kan ze niet meten — drift zie je dan niet. Deze baseline maakt met CIPP's eigen standards
custom policies op prioriteit 0 voor alle geaccepteerde domeinen, op Strict-niveau. CIS (2.1.x),
ORCA en CISA ScubaGear accepteren dat als gelijkwaardig.

| | Waarde | Afwijking van Strict |
|---|---|---|
| Quarantainemelding | elke 4 uur | — |
| Safe Links | e-mail, Teams en Office; scannen vóór aflevering; ook intern; niet doorklikken | — |
| Safe Attachments | Block; SharePoint/OneDrive/Teams aan; gebruiker krijgt melding en kan vrijgave aanvragen | Strict: alleen beheer, zonder melding |
| Spam, high confidence spam, phish | quarantaine, gebruiker krijgt melding en geeft zelf vrij | — |
| High confidence phish, malware (bijlagefilter) | quarantaine, alleen beheer | — |
| Bulk | Junk vanaf BCL 6 | Strict: quarantaine vanaf 5 — maakt de melding onleesbaar |
| Phish-drempel | 3 | Strict: 4 — veel valse positieven |
| Spoof | Junk | Strict: quarantaine; ORCA-112 adviseert Junk |
| Impersonatie, mailbox intelligence | quarantaine met melding | — |
| Bijlagefilter | 53 standaardextensies plus scripts, OneNote, VHD en SVG | ruimer dan Strict (deel van CIS 2.1.11) |
| Uitgaand | 500 / 1000 / 1000, blokkeren | Strict: 400 / 800 / 800 |
| Teams | ZAP, bestandstype- en URL-controle in chats | — |
| Meldingen aan beheer | malware van een interne afzender, uitgaande spam (met kopie), vrijgaveverzoeken — naar `%SecurityAlertMail%` | niet in Strict (CIS 2.1.3, 2.1.6) |

**Vóór de eerste run:** zet in CIPP de custom variable `SecurityAlertMail` (Settings → Custom
Variables) — globaal voor *All Tenants*, met een eigen waarde per tenant waar het anders moet.
De meldingen aan beheer gaan daarheen; zonder de variabele falen die drie standards. In de
baseline-editor accepteert het veld van `QuarantineRequestAlert` alleen een e-mailadres: bewaar
je dat veld daar opnieuw, dan wil de editor een echt adres in plaats van het token.

**Per tenant, met [`scripts/Set-DefenderOfficeTenant.ps1`](../scripts/Set-DefenderOfficeTenant.ps1)**
— twee dingen waar CIPP geen standard voor heeft:

- **Presets uit.** Een Standard- of Strict-preset gaat vóór deze policies — en CIPP rapporteert
  dan nog steeds *compliant*. Het script zet de preset-regels uit; aanzetten kan weer in Defender.
- **VIP's, alleen als de klant ze aanwijst.** Standaard heeft een tenant er geen. Met
  `-VipGroupName` komen de leden van die Entra-groep in de anti-phishingpolicy (impersonatie,
  max. 350). De groep is de bron: wie eruit gaat, gaat ook uit de lijst. CIPP vergelijkt die lijst niet en
  overschrijft hem dus ook niet. Draai het script opnieuw als de groep verandert.

**Aanpassen in CIPP kan, maar op de goede plek:**

- **Per tenant** — een ander adres, een extensie die een klant nodig heeft, een standard die daar
  niet moet: maak een *override* op die standard voor die tenant, of sluit de tenant uit. Een
  override staat los van de baseline en blijft staan als je hem opnieuw importeert.
- **Voor iedereen** — een standard aanpassen of eruit halen: doe het hier, in
  `defender-office.js`. In de CIPP-editor kan het ook (CIPP markeert de baseline dan met
  *local changes*), maar de volgende import uit deze repo zet de baseline terug op dit bestand.

Bestaat er al een `CIPP Default …`-policy, dan neemt CIPP die over in plaats van een tweede te
maken; de naam blijft dan de oude.

Importeren gaat net als bij `Baseline.json`: met de knop. Bijwerken: pas
`defender-office.js` aan en draai het script.

## Windows-Updates.json — patchen

Een derde, losse baseline (`[Baseline] - Windows Updates`) voor alles wat een
Windows-apparaat bijwerkt: Windows zelf, Edge, Microsoft 365 Apps en de overige apps via winget.
Los van `Baseline.json`, omdat patchen iets is wat elke tenant nodig heeft — ook een tenant die
(nog) niet de hele Intune-baseline krijgt. De indeling staat in
[`scripts/lib/windows-updates.js`](../scripts/lib/windows-updates.js).

| Stage | Standard | Toewijzing | Wat het doet |
|---:|---|---|---|
| 1 · Nu | `[Baseline] - Updates-Ring3` | alle apparaten, **behalve** `SEC-Update-Ring1` en `SEC-Update-Ring2` | Windows Update Ring 3 Production: installeert om 13:00, deadline twee dagen |
| 1 · Nu | `[Baseline] - Updates-SEC-Update-Ring1` | `SEC-Update-Ring1` | Ring 1 Pilot: updates meteen |
| 1 · Nu | `[Baseline] - Updates-SEC-Update-Ring2` | `SEC-Update-Ring2` | Ring 2 UAT: kwaliteitsupdates na drie dagen |
| 1 · Nu | `[Baseline] - Updates-Devices` | alle apparaten | Edge Updates (herstart verplicht, buiten werktijd) en Microsoft Office Updates (automatisch bijwerken, niet uit te zetten) |
| 2 · Winget-AutoUpdate | *Deploy Intune Application Template* | alle apparaten (Required) | Winget-AutoUpdate: werkt dagelijks elke app bij die winget kent, behalve de [uitsluitingslijst](../IntuneTemplate/WIN/Apps/winget-autoupdate/README.md) |

Stage 2 begint als alles uit stage 1 compliant is **en** er twee weken voorbij zijn — dezelfde
drempel als de pilotstage van `Baseline.json`.

**Ring 3 sluit de ringgroepen uit.** Zonder die uitsluiting krijgt een apparaat in
`SEC-Update-Ring1` twee updaterings; Intune meldt dan een Conflict en past de omstreden
instellingen (uitstel, deadline) via geen van beide toe. Een pakket deelt zijn toewijzing met al
zijn leden, daarom is Ring 3 een pakket apart en zit de uitsluiting niet op Edge en Office.

**Deze policies zijn uit `Baseline.json` gehaald.** Ze zaten in `Baseline-Devices` en
`Baseline-SEC-Update-Ring1/2`. Een tenant met `Baseline.json` heeft deze baseline dus óók nodig,
anders bewaakt niemand de updatepolicies meer (ze blijven wel staan: CIPP verwijdert niets). De
Defender-updaterings, *Update Reports and Telemetry* en *Google Chrome Updates* blijven in
`Baseline.json`.

**Winget-AutoUpdate komt binnen als app-template.** De standard kijkt alleen of er een app met die
naam bestaat en haalt de toewijzing uit het template zelf — een eigen veld heeft hij niet. Daarom
rolt hij [`AppTemplate/Winget-AutoUpdate-AllDevices.json`](../AppTemplate/Winget-AutoUpdate-AllDevices.json)
uit, dezelfde app als `Winget-AutoUpdate.json` maar toegewezen aan alle apparaten. De importknop
haalt dat template uit deze repo mee vóór de baseline zelf (`referencedTemplates`). Twee gevolgen:

- Staat WAU al in de tenant (bijvoorbeeld met de hand naar de pilotgroep), dan ziet de standard
  hem als aanwezig en verandert hij de toewijzing niet. Breid die dan zelf uit naar alle apparaten.
- Haalt iemand de toewijzing weg, dan ziet CIPP dat niet: de app bestaat nog.

**Vóór de eerste run:** de groepen `SEC-Update-Ring1` en `SEC-Update-Ring2` moeten bestaan (leeg
mag), anders kan CIPP ze niet toewijzen en ook niet uitsluiten. Licentie: alleen Intune.

Importeren gaat net als bij `Baseline.json`: met de knop. Bijwerken: een andere indeling in
`windows-updates.js`, de instellingen zelf in de policies in `IntuneTemplate/WIN/`; draai daarna
`node scripts/set-packages.js` en het script hieronder.

## Bijwerken

Niet met de hand: draai `node scripts/generate-baseline-template.js`. De pakketten en hun
toewijzing volgen uit `fase` in [`_manifest.json`](../IntuneTemplate/_manifest.json) en het
doel in [`_assignments.json`](../IntuneTemplate/_assignments.json); `--check` schrijft niets en
faalt als dit bestand achterloopt.

Pas op met opnieuw exporteren vanuit CIPP: CIPP's eigen export klapt de pakketten plat naar
losse templateverwijzingen, één per policy — een momentopname, waarna een nieuwe policy niet meer vanzelf
meekomt. Deze kant op genereren houdt de late binding intact.
