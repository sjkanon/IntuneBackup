# BaselineTemplate/

De CIPP-**baseline** als bestand: welke pakketten in welke stage uitrollen, naar wie, en
wanneer een tenant doorschuift.

| | |
|---|---|
| Bestand | [`Baseline.json`](Baseline.json) — gegenereerd door [`scripts/generate-baseline-template.js`](../scripts/generate-baseline-template.js) |
| Herkend aan | `TemplateType: "BaselineTemplate"` én de mapnaam `BaselineTemplate/` |
| Naam in CIPP | `Baseline` |

## Waarom dit hier staat

`IntuneTemplate/` levert de policies, maar in CIPP staan templates er alleen: uitrollen doet
een baseline. Dat scherm met de hand invullen is negen keer dezelfde standard toevoegen en
negen keer het juiste toewijzingsdoel kiezen — één misklik zet 80 policies op het verkeerde
publiek. Dit bestand komt daarom uit dezelfde bron als de rest van de repo: het manifest.

## Wat erin staat

| Stage | Pakketten | Doorschuiven naar deze stage |
|---:|---|---|
| 1 · Nu | `Baseline-Devices`, `Baseline-Users`, `Baseline-ADE-token` en de drie groepspakketten | — stage 1 geldt altijd |
| 2 · Pilot | `Baseline-Pilot` | alles uit stage 1 is compliant (`success`) **en** twee weken verstreken (`time`) |
| 3 · Wacht op voorwaarde | `Baseline-Wacht` | `manual` — iemand zet 'm door |

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
- **De groepen laten bestaan.** `SEC-Baseline-Pilot`, `SEC-Update-Ring1`, `SEC-Update-Ring2` en
  `SEC-Shared-Devices` moeten in de tenant bestaan; CIPP zoekt ze op naam (wildcards mogen).
- **De ADE-profielen koppelen.** `Baseline-ADE-token` wordt bewust niet toegewezen: een
  macOS-inschrijfprofiel hangt aan een ADE-token, niet aan een Entra-groep, en je kiest er per
  token één van de twee.

## Bijwerken

Niet met de hand: draai `node scripts/generate-baseline-template.js`. De pakketten en hun
toewijzing volgen uit `fase` in [`_manifest.json`](../IntuneTemplate/_manifest.json) en het
doel in [`_assignments.json`](../IntuneTemplate/_assignments.json); `--check` faalt in CI als
dit bestand achterloopt.

Pas op met opnieuw exporteren vanuit CIPP: CIPP's eigen export klapt de pakketten plat naar
141 losse templateverwijzingen — een momentopname, waarna een nieuwe policy niet meer vanzelf
meekomt. Deze kant op genereren houdt de late binding intact.
