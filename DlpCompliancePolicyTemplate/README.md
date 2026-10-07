**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# DlpCompliancePolicyTemplate/

CIPP-**DLP-templates**: Microsoft Purview Data Loss Prevention voor Exchange, SharePoint en
OneDrive. Uitgerold door de baselines [`Purview-DLP.json`](../BaselineTemplate/README.md#purview-dlpjson--gegevenslekken).

| Bestand | Policy | Stage |
|---|---|---|
| [`DLP_Personal_Data_NL_Notify.json`](DLP_Personal_Data_NL_Notify.json) | `[Baseline] - DLP - Personal Data NL - Notify` | 1 · Melden |
| [`DLP_Personal_Data_BE_Notify.json`](DLP_Personal_Data_BE_Notify.json) | `[Baseline] - DLP - Personal Data BE - Notify` | 1 · Melden |
| [`DLP_Financial_Notify.json`](DLP_Financial_Notify.json) | `[Baseline] - DLP - Financial - Notify` | 1 · Melden |
| [`DLP_Personal_Data_NL_Block.json`](DLP_Personal_Data_NL_Block.json) | `[Baseline] - DLP - Personal Data NL - Block` | 2 · Blokkeren |
| [`DLP_Personal_Data_BE_Block.json`](DLP_Personal_Data_BE_Block.json) | `[Baseline] - DLP - Personal Data BE - Block` | 2 · Blokkeren |
| [`DLP_Financial_Block.json`](DLP_Financial_Block.json) | `[Baseline] - DLP - Financial - Block` | 2 · Blokkeren |
| [`DLP_Aviation_Travel_Documents_Notify.json`](DLP_Aviation_Travel_Documents_Notify.json) | `[Baseline] - DLP - Aviation - Travel Documents - Notify` | 1 · Melden (Aviation) |
| [`DLP_Aviation_Documents_Notify.json`](DLP_Aviation_Documents_Notify.json) | `[Baseline] - DLP - Aviation - Documents - Notify` | 1 · Melden (Aviation) |

Elk bestand is een CIPP-tabelrij (`PartitionKey: DlpCompliancePolicyTemplate`), gegenereerd door
[`scripts/generate-dlp-templates.js`](../scripts/generate-dlp-templates.js) uit
[`scripts/lib/purview-dlp.js`](../scripts/lib/purview-dlp.js). Wijzigen doe je daar, niet hier.

## Wat erin zit, en waarvandaan

| Gevoelig informatietype | Betrouwbaarheid | "Enkele" | "Bulk" |
|---|---|---|---|
| Netherlands Citizen's Service (BSN) Number | High | 1–4 | 5+ |
| Netherlands Passport Number | Medium | 1–9 | 10+ |
| Netherlands Driver's License Number | Medium | 1–9 | 10+ |
| Netherlands Tax Identification Number | High | 1–9 | 10+ |
| Belgium National Number | Medium | 1–4 | 5+ |
| Belgium Passport Number | Medium | 1–9 | 10+ |
| Belgium Driver's License Number | Medium | 1–9 | 10+ |
| Credit Card Number | High | 1–9 | 10+ |
| EU Debit Card Number | High | 1–9 | 10+ |
| International Banking Account Number (IBAN) | High | — | 20+ |

- **Structuur van Microsoft.** Elk ingebouwd financieel of privacytemplate in Purview heeft een
  regel voor 1–9 treffers (melden) en een voor 10+ (blokkeren en rapporteren), beide op "gedeeld
  buiten de organisatie". Een Nederlands of Belgisch template bestaat niet; die typen zitten alleen
  in *GDPR Enhanced*, samen met 27 EU-adrestypen en trainbare classificaties — voor een klein
  bedrijf veel te veel ruis.
- **`maxcount -1` in plaats van Microsofts 500**, zoals in
  [kingsrule50/m365-purview-data-protection](https://github.com/kingsrule50/m365-purview-data-protection):
  anders mist een bestand met 501 kaartnummers de bulkregel.
- **Betrouwbaarheid volgens de definitie van elk type.** Een BSN wordt alleen herkend met de
  elfproef én een trefwoord als *bsn* of *burgerservicenummer*; paspoort en rijbewijs halen
  hooguit Medium, dus High zou nooit afgaan. Een IBAN is al High op de controlesom alleen — elke
  factuur heeft er een — dus IBAN telt alleen in bulk (een salaris- of SEPA-export). Het btw-nummer
  (en het Belgische ondernemingsnummer) ontbreekt bewust: dat staat wettelijk op elke factuur.
- **De drie Belgische typen halen hooguit Medium.** Het rijksregisternummer is pas Medium met de
  controlesom én een trefwoord (*identiteitskaart*, *numéro national*, *national number* …); alleen de
  controlesom geeft Low, en dat is te los voor een nummer dat begint met een geboortedatum. Let op:
  *rijksregisternummer* zelf staat niet in Microsofts trefwoordenlijst; een Vlaams document dat
  alleen dat woord gebruikt, wordt dus niet herkend.
- **BSN al vanaf 5 in bulk**: de Autoriteit Persoonsgegevens behandelt het BSN strenger dan de
  andere nummers. Het **rijksregisternummer** krijgt dezelfde drempel: het is in België ook het
  fiscale en het socialezekerheidsnummer, dus het nummer dat alles opent.
- **Belgische tips zijn tweetalig** (nl / fr): in Belgische tenants zitten beide taalgroepen.
  De Financial-tips zijn alleen Nederlands.

Niet gevonden: een publieke repo, van een MVP of anders, die DLP met Nederlandse of Belgische typen uitrolt.
De structuur komt van Microsoft, de drempels zijn hierboven verantwoord.

## Luchtvaart

De twee `Aviation`-templates horen bij de losse baseline
[`Purview-DLP-Aviation.json`](../BaselineTemplate/README.md#purview-dlp-aviationjson--luchtvaart)
en melden alleen.

| Gevoelig informatietype / voorwaarde | Betrouwbaarheid | Drempel |
|---|---|---|
| Paspoortnummers NL, BE, German, France, Spain, Italy, Portugal, U.S. / U.K. | Medium | 10+ per type |
| Bestandsnaam: security, export control, medical (drie lijsten) | — | 1 |
| International Classification of Diseases (ICD-10-CM) | High | 3+ |

- **10+ paspoorten per type.** Een DLP-regel telt per type: 10 Nederlandse paspoorten raken
  hem, 5 Nederlandse plus 5 Duitse niet. Manifesten worden gedomineerd door één of twee
  nationaliteiten, en een crewlijst van zes naar een hotel hoort stil te blijven. Medium is het
  aanbevolen niveau van elk van deze typen (nummer plus trefwoord als *passport*).
- **Bestandsnaam, één lijst per regel.** Voorwaarden van verschillende soort binnen één regel
  zijn EN, dus elke lijst is een eigen regel. `DocumentNameMatchesWords` zoekt hele woorden:
  *ITAR* raakt niet midden in een ander woord.
- **ICD-10-CM is Engelstalig.** Het vangt Engelse AME-rapporten en medische dossiers; Nederlandse
  en Franse komen binnen via de bestandsnaamregel.

## Los uitrollen

1. CIPP → **Tools → Community Repos** → deze repo → het bestand → **Import** (of de gewone
   template-sync: deze bestanden hebben een `RowKey` en worden direct weggeschreven).
2. **Security → Compliance → DLP Templates** → het template → **Deploy**.

Een tenant zonder de baseline kan dus ook alleen de Notify-policies krijgen.
