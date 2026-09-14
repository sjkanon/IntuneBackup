<!-- Gegenereerd door scripts/generate-compliance.js — niet met de hand bijwerken. -->

# Normenkader en verantwoording

Hoe deze baseline invulling geeft aan **ISO/IEC 27001:2022 Annex A**, **NIS2 (richtlijn 2022/2555,
art. 21 lid 2)**, **CIS Controls v8.1** en **NIST CSF 2.0** — en wat de organisatie daarnaast zelf
moet regelen. Bedoeld voor een CISO, FG of auditor. Alles hieronder is afgeleid uit het veld
`controls` in [`IntuneTemplate/_manifest.json`](IntuneTemplate/_manifest.json) en de vocabulaire in
[`IntuneTemplate/_controls.json`](IntuneTemplate/_controls.json).

**Lees dit eerst.** Dit document zegt wat de *baseline* afdwingt, niet wat een *tenant* doet. Of de
policies in een tenant staan en kloppen, toetst TEST Policies Platform met de genoemde checkId's
(bron: [`baseline/intune/baseline-v1.0.json`](baseline/intune/baseline-v1.0.json)). Een policy
zonder eigen checkId (compliance, device configuration, app protection) is aantoonbaar via de
Intune-rapportage en, waar vermeld, via een generieke check.

| Status | Betekenis |
|---|---|
| ● Afgedekt (fase 1) | minstens één policy in fase 1 dwingt de maatregel af of toetst hem |
| ◐ Alleen pilot, wacht of eigen groep | de policy bestaat, maar staat in fase 2, 3 of 4: nog niet op alle apparaten |
| ▢ Organisatorisch | niet met endpoint- of identitybeleid in te vullen: proces, mensen, fysiek of een ander technisch domein |
| ○ Geen technische maatregel in de baseline | wel technisch in te vullen, maar deze baseline doet het niet (of alleen met een alternatief in fase 5) |

> **Conditional Access is bewust niet meegenomen** (`--no-ca`). MFA (NIS2 (j)) en toegangsvoorwaarden steunen grotendeels op CA; de verantwoording daarvan staat in de CA-repo.

## Inhoud

1. [Samenvatting](#samenvatting)
2. [ISO/IEC 27001:2022 Annex A](#isoiec-270012022-annex-a)
3. [NIS2 art. 21 lid 2](#nis2-art-21-lid-2)
4. [CIS Controls v8.1](#cis-controls-v81)
5. [NIST CSF 2.0](#nist-csf-20)
6. [Klantkeuzes en restrisico's](#klantkeuzes-en-restrisicos)
7. [Verklaring van toepasselijkheid — startpunt](#verklaring-van-toepasselijkheid--startpunt)
8. [Controle van de mapping](#controle-van-de-mapping)

## Samenvatting

### Policies per fase — 193 Intune-policies

Alleen fase 1 is op alle apparaten of gebruikers toegewezen en telt als afgedwongen. De rest is
bewust nog niet uitgerold; waarom staat per policy in [Klantkeuzes en restrisico's](#klantkeuzes-en-restrisicos).

| Fase | Windows | macOS | iOS/iPadOS | Android | Totaal |
|---|---:|---:|---:|---:|---:|
| 1 — Nu | 80 | 19 | 1 | 1 | **101** |
| 2 — Pilot | 27 | 9 | – | 2 | **38** |
| 3 — Wacht op voorwaarde | 5 | 3 | 8 | 10 | **26** |
| 4 — Eigen groep | 7 | 4 | 4 | 1 | **16** |
| 5 — Niet uitrollen | 9 | 2 | 1 | – | **12** |
| **Totaal** | **128** | **37** | **14** | **14** | **193** |

Toegewezen volgens `_assignments.json`: 101 (hoort gelijk te zijn aan fase 1: 101).


### ISO/IEC 27001:2022 Annex A — 93 controls

Kolommen: of de control volgens de vocabulaire met endpoint-/identitybeleid in te vullen is.

| Status | Technisch (10) | Deels (37) | Organisatorisch (46) | Totaal |
|---|---:|---:|---:|---:|
| ● Afgedekt (fase 1) | 10 | 21 | 0 | **31** |
| ◐ Alleen pilot, wacht of eigen groep | 0 | 3 | 1 | **4** |
| ▢ Organisatorisch | 0 | 0 | 45 | **45** |
| ○ Geen technische maatregel in de baseline | 0 | 13 | 0 | **13** |

### NIS2 art. 21(2)

Aantal policies dat het punt technisch invult. Geen enkel punt is met techniek alleen af: zie per punt wat organisatorisch nodig is.

| Punt | Intune fase 1 | CA actief | Pilot, wacht, eigen groep |
|---|---:|---:|---:|
| [(a)](#art-212a-risicoanalyse-en-beveiligingsbeleid-voor-informatiesystemen) risicoanalyse en beveiligingsbeleid voor informatiesystemen | 0 | n.v.t. | 0 |
| [(b)](#art-212b-incidentbehandeling) incidentbehandeling | 8 | n.v.t. | 6 |
| [(c)](#art-212c-bedrijfscontinuiteit-en-crisisbeheer) bedrijfscontinuiteit en crisisbeheer | 6 | n.v.t. | 2 |
| [(d)](#art-212d-beveiliging-van-de-toeleveringsketen) beveiliging van de toeleveringsketen | 2 | n.v.t. | 5 |
| [(e)](#art-212e-beveiliging-bij-verwerving-ontwikkeling-en-onderhoud-incl-kwetsbaarheden) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden | 48 | n.v.t. | 35 |
| [(f)](#art-212f-beoordeling-van-de-doeltreffendheid) beoordeling van de doeltreffendheid | 13 | n.v.t. | 2 |
| [(g)](#art-212g-basispraktijken-cyberhygiene-en-training) basispraktijken cyberhygiene en training | 1 | n.v.t. | 2 |
| [(h)](#art-212h-cryptografie-en-versleuteling) cryptografie en versleuteling | 8 | n.v.t. | 7 |
| [(i)](#art-212i-personeelsbeveiliging-toegangsbeleid-en-beheer-van-bedrijfsmiddelen) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen | 22 | n.v.t. | 37 |
| [(j)](#art-212j-multifactorauthenticatie-en-beveiligde-communicatie) multifactorauthenticatie en beveiligde communicatie | 3 | n.v.t. | 6 |

### CIS Controls v8.1 en NIST CSF 2.0

CIS-safeguards die technisch in te vullen zijn (proces-, documentatie- en trainingssafeguards niet meegeteld): **IG1 16 van 36** afgedekt, **IG1+IG2 36 van 94**, **IG1–IG3 37 van 111**.

| NIST CSF 2.0-functie | Afgedekt | Alleen voorbereid | Relevante subcategorieën |
|---|---:|---:|---:|
| GV Govern (besturen) | 0 | 0 | 8 |
| ID Identify (identificeren) | 0 | 2 | 7 |
| PR Protect (beschermen) | 15 | 0 | 18 |
| DE Detect (detecteren) | 2 | 1 | 6 |
| RS Respond (reageren) | 1 | 0 | 7 |
| RC Recover (herstellen) | 1 | 0 | 5 |

## ISO/IEC 27001:2022 Annex A

Norm: ISO/IEC 27001:2022 Annex A — NEN-EN-ISO/IEC 27001:2023 (+A1:2024 wijzigt Annex A niet). De titels zijn die van de Nederlandse norm. **Invulbaar** zegt of de
control met endpoint- of identitybeleid in te vullen is; **Status** zegt wat deze baseline er vandaag mee doet.

### 5 Organisatorische beheersmaatregelen

| Control | Invulbaar | Status | Fase 1 | Overig | Wat organisatorisch nodig blijft |
|---|---|---|---:|---:|---|
| **A.5.1** Beleidsregels voor informatiebeveiliging | organisatorisch | ▢ Organisatorisch | – | – | Informatiebeveiligingsbeleid en onderwerpspecifiek beleid (o.a. endpoint-, toegangs- en AI-beleid) vaststellen, laten goedkeuren door het management en periodiek herzien. |
| **A.5.2** Rollen en verantwoordelijkheden bij informatiebeveiliging | organisatorisch | ▢ Organisatorisch | – | – | Eigenaar van de baseline, CISO en beheerrollen (Intune-, Entra-, Defender-beheer) benoemen en vastleggen. |
| **A.5.3** Functiescheiding | deels | ○ Geen technische maatregel in de baseline | – | – | Scheiding tussen wie policies wijzigt, wie ze goedkeurt (PR-review) en wie uitzonderingen verleent; Entra/Intune-RBAC en PIM inrichten — valt buiten deze baseline. |
| **A.5.4** Managementverantwoordelijkheden | organisatorisch | ▢ Organisatorisch | – | – | Management stuurt aantoonbaar op naleving (NIS2 art. 20: bestuurders keuren maatregelen goed en volgen training). |
| **A.5.5** Contact met overheidsinstanties | organisatorisch | ▢ Organisatorisch | – | – | Contactpunten met CSIRT/NCSC, toezichthouder en AP vastleggen, inclusief meldtermijnen. |
| **A.5.6** Contact met speciale belangengroepen | organisatorisch | ▢ Organisatorisch | – | – | Deelname aan ISAC's, sectorale overleggen en leveranciersadviezen organiseren. |
| **A.5.7** Informatie en analyses over dreigingen | deels | ○ Geen technische maatregel in de baseline | – | – | Dreigingsinformatie (Defender, Entra ID Protection, NCSC) laten beoordelen en vertalen naar aanpassingen van de baseline. |
| **A.5.8** Informatiebeveiliging in projectmanagement | organisatorisch | ▢ Organisatorisch | – | – | Beveiligingseisen opnemen in projecten, bijvoorbeeld bij de uitrol van nieuwe apparaten of platformen. |
| [**A.5.9** Inventarisatie van informatie en andere gerelateerde bedrijfsmiddelen](#a59-inventarisatie-van-informatie-en-andere-gerelateerde-bedrijfsmiddelen) | deels | ◐ Alleen pilot, wacht of eigen groep | – | 3 | Intune levert de apparaatinventaris; eigenaarschap, informatie-inventaris en periodieke controle op volledigheid zijn organisatorisch. |
| [**A.5.10** Aanvaardbaar gebruik van informatie en andere gerelateerde bedrijfsmiddelen](#a510-aanvaardbaar-gebruik-van-informatie-en-andere-gerelateerde-bedrijfsmiddelen) | deels | ● Afgedekt (fase 1) | 3 | 11 | Gebruiksregels (incl. AI en privégebruik) vaststellen en communiceren; techniek dwingt alleen een deel af. |
| **A.5.11** Retourneren van bedrijfsmiddelen | deels | ○ Geen technische maatregel in de baseline | – | – | Uitdienstproces: inleveren van apparaten, retire/wipe in Intune, account blokkeren. |
| **A.5.12** Classificeren van informatie | organisatorisch | ▢ Organisatorisch | – | – | Classificatieschema vaststellen; technische labels (Purview) vallen buiten deze baseline. |
| **A.5.13** Labelen van informatie | organisatorisch | ▢ Organisatorisch | – | – | Labelprocedure en -hulpmiddelen (Purview-gevoeligheidslabels) — buiten deze baseline. |
| [**A.5.14** Overdragen van informatie](#a514-overdragen-van-informatie) | deels | ● Afgedekt (fase 1) | 1 | 1 | Regels voor informatieoverdracht met externen (mail, deelkoppelingen, gastaccounts); techniek beperkt kanalen op het apparaat. |
| [**A.5.15** Toegangsbeveiliging](#a515-toegangsbeveiliging) | technisch | ● Afgedekt (fase 1) | 3 | 9 | Toegangsbeleid vaststellen (wie mag waarbij, onder welke voorwaarden); Conditional Access en apparaatbeleid dwingen het af. |
| [**A.5.16** Identiteitsbeheer](#a516-identiteitsbeheer) | deels | ● Afgedekt (fase 1) | 2 | – | Levenscyclus van identiteiten (in-, door-, uitstroom) koppelen aan HR; gedeelde en serviceaccounts registreren. |
| [**A.5.17** Authenticatie-informatie](#a517-authenticatie-informatie) | technisch | ● Afgedekt (fase 1) | 12 | 15 | Gebruikers instrueren over omgang met wachtwoorden, pincodes en herstelcodes; uitgifteproces voor tijdelijke toegangscodes. |
| **A.5.18** Toegangsrechten | deels | ○ Geen technische maatregel in de baseline | – | – | Toekennen, periodiek beoordelen (access reviews) en intrekken van rechten; CA dwingt voorwaarden af maar beoordeelt geen rechten. |
| [**A.5.19** Informatiebeveiliging in leveranciersrelaties](#a519-informatiebeveiliging-in-leveranciersrelaties) | organisatorisch | ◐ Alleen pilot, wacht of eigen groep | – | 2 | Leveranciersbeleid en risicobeoordeling (incl. Microsoft, AI-diensten, remote-supporttools); techniek kan alleen niet-goedgekeurde diensten blokkeren. |
| **A.5.20** Adresseren van informatiebeveiliging in leveranciersovereenkomsten | organisatorisch | ▢ Organisatorisch | – | – | Beveiligingseisen, verwerkersovereenkomsten en auditrechten in contracten opnemen. |
| **A.5.21** Beheren van informatiebeveiliging in de ICT-toeleveringsketen | organisatorisch | ▢ Organisatorisch | – | – | Eisen aan ICT-producten en -diensten in de keten; herkomst van software en updates beoordelen. |
| **A.5.22** Monitoren, beoordelen en het beheren van wijzigingen van leveranciersdiensten | organisatorisch | ▢ Organisatorisch | – | – | Wijzigingen bij Microsoft/leveranciers volgen (Message Center, roadmaps) en periodiek beoordelen. |
| **A.5.23** Informatiebeveiliging voor het gebruik van clouddiensten | deels | ○ Geen technische maatregel in de baseline | – | – | Proces voor aanschaf, gebruik en beëindiging van clouddiensten; CA en tenantbeperkingen dwingen een deel af. |
| **A.5.24** Plannen en voorbereiden van het beheer van informatiebeveiligingsincidenten | organisatorisch | ▢ Organisatorisch | – | – | Incidentresponsplan met rollen, draaiboeken (o.a. apparaat isoleren, account intrekken) en meldplicht (NIS2 art. 23). |
| **A.5.25** Beoordelen van en besluiten over informatiebeveiligingsgebeurtenissen | deels | ○ Geen technische maatregel in de baseline | – | – | Triageproces en criteria voor 'incident'; Defender levert de signalen. |
| **A.5.26** Reageren op informatiebeveiligingsincidenten | deels | ○ Geen technische maatregel in de baseline | – | – | Uitvoeren van het responsplan; technische acties (isoleren, wissen, sessies intrekken) moeten geoefend zijn. |
| **A.5.27** Leren van informatiebeveiligingsincidenten | organisatorisch | ▢ Organisatorisch | – | – | Evaluaties na incidenten en vertaling naar baseline-wijzigingen. |
| **A.5.28** Verzamelen van bewijsmateriaal | deels | ○ Geen technische maatregel in de baseline | – | – | Forensische procedure en bewaartermijnen; logging en EDR leveren het materiaal, borging van de keten is organisatorisch. |
| [**A.5.29** Informatiebeveiliging tijdens een verstoring](#a529-informatiebeveiliging-tijdens-een-verstoring) | deels | ● Afgedekt (fase 1) | 2 | – | Beveiligingsniveau tijdens calamiteiten plannen (noodprocedures, break-glass-accounts). |
| [**A.5.30** ICT-gereedheid voor bedrijfscontinuïteit](#a530-ict-gereedheid-voor-bedrijfscontinuïteit) | deels | ● Afgedekt (fase 1) | 2 | – | BIA, hersteldoelen (RTO/RPO) en periodieke continuïteitstests. |
| **A.5.31** Wettelijke, statutaire, regelgevende en contractuele eisen | organisatorisch | ▢ Organisatorisch | – | – | Register van toepasselijke wet- en regelgeving (NIS2/Cyberbeveiligingswet, AVG) bijhouden. |
| **A.5.32** Intellectuele-eigendomsrechten | organisatorisch | ▢ Organisatorisch | – | – | Licentiebeheer en regels voor gebruik van software en content. |
| [**A.5.33** Beschermen van registraties](#a533-beschermen-van-registraties) | deels | ◐ Alleen pilot, wacht of eigen groep | – | 1 | Bewaartermijnen en bescherming van registraties vastleggen (retentiebeleid, logbewaring). |
| [**A.5.34** Privacy en bescherming van persoonsgegevens](#a534-privacy-en-bescherming-van-persoonsgegevens) | deels | ● Afgedekt (fase 1) | 4 | 10 | AVG-verantwoording: verwerkingsregister, DPIA voor telemetrie, monitoring en AI-functies, afstemming met FG en OR. |
| **A.5.35** Onafhankelijke beoordeling van informatiebeveiliging | organisatorisch | ▢ Organisatorisch | – | – | Interne audit of externe beoordeling op geplande tussenpozen. |
| **A.5.36** Naleving van beleid, regels en normen voor informatiebeveiliging | deels | ○ Geen technische maatregel in de baseline | – | – | Naleving periodiek beoordelen; compliance-policies en baseline-checks leveren de meting, de beoordeling en opvolging zijn organisatorisch. |
| **A.5.37** Gedocumenteerde bedieningsprocedures | organisatorisch | ▢ Organisatorisch | – | – | Beheerprocedures documenteren (uitrol, uitzonderingen, herstel); de gegenereerde documentatie in deze repo is een deel daarvan. |

### 6 Mensgerichte beheersmaatregelen

| Control | Invulbaar | Status | Fase 1 | Overig | Wat organisatorisch nodig blijft |
|---|---|---|---:|---:|---|
| **A.6.1** Screening | organisatorisch | ▢ Organisatorisch | – | – | Antecedentenonderzoek (VOG) naar risico van de functie. |
| **A.6.2** Arbeidsovereenkomst | organisatorisch | ▢ Organisatorisch | – | – | Beveiligingsverplichtingen opnemen in arbeidsvoorwaarden. |
| **A.6.3** Bewustwording van, opleiding en training in informatiebeveiliging | organisatorisch | ▢ Organisatorisch | – | – | Bewustwordingsprogramma en training (phishing, wachtwoorden, AI-gebruik); ook voor bestuurders (NIS2 art. 20(2)). |
| **A.6.4** Disciplinaire procedure | organisatorisch | ▢ Organisatorisch | – | – | Formele procedure bij schending van het beleid. |
| **A.6.5** Verantwoordelijkheden na beëindiging of wijziging van het dienstverband | deels | ○ Geen technische maatregel in de baseline | – | – | Uitdienstproces: toegang intrekken, apparaat terug of selectief wissen, geheimhouding na vertrek. |
| **A.6.6** Vertrouwelijkheids- of geheimhoudingsovereenkomsten | organisatorisch | ▢ Organisatorisch | – | – | Geheimhoudingsovereenkomsten opstellen en laten tekenen. |
| **A.6.7** Werken op afstand | deels | ○ Geen technische maatregel in de baseline | – | – | Thuiswerkbeleid (locatie, schermen, netwerken); techniek beschermt het apparaat en de toegang. |
| **A.6.8** Melden van informatiebeveiligingsgebeurtenissen | organisatorisch | ▢ Organisatorisch | – | – | Meldkanaal voor medewerkers inrichten en bekendmaken. |

### 7 Fysieke beheersmaatregelen

| Control | Invulbaar | Status | Fase 1 | Overig | Wat organisatorisch nodig blijft |
|---|---|---|---:|---:|---|
| **A.7.1** Fysieke beveiligingszones | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein: fysieke zones definiëren. |
| **A.7.2** Fysieke toegangsbeveiliging | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein: toegangscontrole tot gebouwen en ruimten. |
| **A.7.3** Beveiligen van kantoren, ruimten en faciliteiten | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein. |
| **A.7.4** Monitoren van de fysieke beveiliging | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein: camerabewaking, alarmopvolging. |
| **A.7.5** Beschermen tegen fysieke en omgevingsdreigingen | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein. |
| **A.7.6** Werken in beveiligde zones | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein. |
| [**A.7.7** 'Clear desk' en 'clear screen'](#a77-clear-desk-en-clear-screen) | technisch | ● Afgedekt (fase 1) | 5 | 5 | Clear-desk-regels voor papier en media vaststellen; clear screen wordt technisch afgedwongen. |
| **A.7.8** Plaatsen en beschermen van apparatuur | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein. |
| [**A.7.9** Beveiligen van bedrijfsmiddelen buiten het terrein](#a79-beveiligen-van-bedrijfsmiddelen-buiten-het-terrein) | deels | ● Afgedekt (fase 1) | 2 | 5 | Regels voor meenemen, onbeheerd achterlaten en melden van verlies; versleuteling en wissen op afstand zijn technisch. |
| [**A.7.10** Opslagmedia](#a710-opslagmedia) | deels | ● Afgedekt (fase 1) | 1 | 3 | Beleid voor verwisselbare media en veilige vernietiging. |
| **A.7.11** Nutsvoorzieningen | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein. |
| **A.7.12** Beveiligen van bekabeling | organisatorisch | ▢ Organisatorisch | – | – | Buiten het endpoint-/identitydomein. |
| **A.7.13** Onderhoud van apparatuur | organisatorisch | ▢ Organisatorisch | – | – | Onderhoud en reparatie door bevoegden, met afspraken over gegevens op het apparaat. |
| **A.7.14** Veilig verwijderen of hergebruiken van apparatuur | deels | ○ Geen technische maatregel in de baseline | – | – | Procedure voor afvoer en hergebruik (wipe/Autopilot Reset, certificaat van vernietiging). |

### 8 Technologische beheersmaatregelen

| Control | Invulbaar | Status | Fase 1 | Overig | Wat organisatorisch nodig blijft |
|---|---|---|---:|---:|---|
| [**A.8.1** 'User endpoint devices'](#a81-user-endpoint-devices) | technisch | ● Afgedekt (fase 1) | 19 | 34 | Beleid voor zakelijke en privéapparaten (BYOD), registratie en gebruiksregels. |
| [**A.8.2** Speciale toegangsrechten](#a82-speciale-toegangsrechten) | technisch | ● Afgedekt (fase 1) | 6 | 3 | Proces voor toekennen en periodiek beoordelen van beheerrechten (PIM, access reviews). |
| [**A.8.3** Beperking toegang tot informatie](#a83-beperking-toegang-tot-informatie) | deels | ● Afgedekt (fase 1) | 1 | 1 | Autorisatiematrix en rechten op data (SharePoint/Teams) — grotendeels buiten deze baseline. |
| **A.8.4** Toegangsbeveiliging op broncode | organisatorisch | ▢ Organisatorisch | – | – | Alleen bij eigen softwareontwikkeling: toegang tot repositories en ontwikkeltools beheren. |
| [**A.8.5** Beveiligde authenticatie](#a85-beveiligde-authenticatie) | technisch | ● Afgedekt (fase 1) | 10 | 19 | Authenticatiebeleid vaststellen (welke methoden, uitzonderingen, break-glass). |
| [**A.8.6** Capaciteitsbeheer](#a86-capaciteitsbeheer) | deels | ● Afgedekt (fase 1) | 3 | – | Capaciteitsplanning voor netwerk, licenties en opslag. |
| [**A.8.7** Bescherming tegen malware](#a87-bescherming-tegen-malware) | technisch | ● Afgedekt (fase 1) | 26 | 18 | Gebruikersbewustzijn en opvolging van detecties (de norm noemt beide expliciet). |
| [**A.8.8** Beheer van technische kwetsbaarheden](#a88-beheer-van-technische-kwetsbaarheden) | deels | ● Afgedekt (fase 1) | 11 | 13 | Kwetsbaarhedenproces: bronnen volgen, risico beoordelen, termijnen voor herstel, uitzonderingen registreren. |
| [**A.8.9** Configuratiebeheer](#a89-configuratiebeheer) | deels | ● Afgedekt (fase 1) | 18 | 10 | Deze repo is de vastgelegde configuratie; wijzigingen reviewen (PR) en afwijkingen in de tenant opvolgen blijft een proces. |
| **A.8.10** Wissen van informatie | deels | ○ Geen technische maatregel in de baseline | – | – | Bewaar- en verwijderbeleid; selectief wissen en wipe zijn technische hulpmiddelen. |
| [**A.8.11** Maskeren van gegevens](#a811-maskeren-van-gegevens) | deels | ◐ Alleen pilot, wacht of eigen groep | – | 1 | Beleid wanneer gegevens gemaskeerd of gepseudonimiseerd worden — grotendeels applicatieniveau. |
| [**A.8.12** Voorkomen van gegevenslekken (data leakage prevention)](#a812-voorkomen-van-gegevenslekken-data-leakage-prevention) | deels | ● Afgedekt (fase 1) | 13 | 13 | DLP-beleid en classificatie; Purview DLP valt buiten deze baseline, apparaat- en app-beperkingen dragen bij. |
| [**A.8.13** Back-up van informatie](#a813-back-up-van-informatie) | deels | ● Afgedekt (fase 1) | 3 | – | Back-upbeleid voor M365-data en periodieke hersteltests; OneDrive-synchronisatie is geen volledige back-up. |
| **A.8.14** Redundantie van informatieverwerkende faciliteiten | organisatorisch | ▢ Organisatorisch | – | – | Redundantie van diensten en infrastructuur — buiten het endpoint-/identitydomein. |
| [**A.8.15** Logging](#a815-logging) | deels | ● Afgedekt (fase 1) | 6 | 2 | Logbestanden centraal verzamelen, beschermen, bewaren en analyseren (SIEM/Defender XDR); de baseline regelt alleen wat het apparaat logt. |
| [**A.8.16** Monitoren van activiteiten](#a816-monitoren-van-activiteiten) | deels | ● Afgedekt (fase 1) | 4 | 8 | 24/7- of kantoortijdenopvolging van alerts, met escalatiecriteria. |
| [**A.8.17** Kloksynchronisatie](#a817-kloksynchronisatie) | technisch | ● Afgedekt (fase 1) | 2 | 1 | Goedgekeurde tijdbron vastleggen. |
| [**A.8.18** Gebruik van speciale systeemhulpmiddelen](#a818-gebruik-van-speciale-systeemhulpmiddelen) | deels | ● Afgedekt (fase 1) | 1 | 3 | Register van toegestane beheer- en remote-supporttools en wie ze mag gebruiken. |
| [**A.8.19** Installeren van software op operationele systemen](#a819-installeren-van-software-op-operationele-systemen) | technisch | ● Afgedekt (fase 1) | 10 | 8 | Proces voor goedkeuren en aanbieden van software (Company Portal-catalogus). |
| [**A.8.20** Beveiliging netwerkcomponenten](#a820-beveiliging-netwerkcomponenten) | deels | ● Afgedekt (fase 1) | 13 | 13 | Netwerkinfrastructuur (firewalls, wifi, VPN) valt grotendeels buiten deze baseline. |
| [**A.8.21** Beveiliging van netwerkdiensten](#a821-beveiliging-van-netwerkdiensten) | deels | ● Afgedekt (fase 1) | 1 | 5 | Eisen aan netwerkdiensten en -leveranciers vastleggen en monitoren. |
| **A.8.22** Netwerksegmentatie | organisatorisch | ▢ Organisatorisch | – | – | Netwerksegmentatie is infrastructuur, niet via endpoint-/identitybeleid in te richten. |
| [**A.8.23** Toepassen van webfilters](#a823-toepassen-van-webfilters) | technisch | ● Afgedekt (fase 1) | 3 | 4 | Categorieën en uitzonderingen vaststellen (Defender Web Content Filtering in het Defender-portaal). |
| [**A.8.24** Gebruik van cryptografie](#a824-gebruik-van-cryptografie) | deels | ● Afgedekt (fase 1) | 9 | 8 | Cryptografiebeleid en sleutelbeheer (wie heeft toegang tot herstelsleutels, rotatie). |
| **A.8.25** Beveiligen tijdens de ontwikkelcyclus | organisatorisch | ▢ Organisatorisch | – | – | Alleen bij eigen ontwikkeling. |
| **A.8.26** Toepassingsbeveiligingseisen | organisatorisch | ▢ Organisatorisch | – | – | Beveiligingseisen bij ontwikkelen of aanschaffen van toepassingen. |
| **A.8.27** Veilige systeemarchitectuur en technische uitgangspunten | organisatorisch | ▢ Organisatorisch | – | – | Architectuurprincipes (zero trust) vastleggen. |
| **A.8.28** Veilig coderen | organisatorisch | ▢ Organisatorisch | – | – | Alleen bij eigen ontwikkeling. |
| **A.8.29** Testen van de beveiliging tijdens ontwikkeling en acceptatie | organisatorisch | ▢ Organisatorisch | – | – | Alleen bij eigen ontwikkeling; voor de baseline zelf: de pilotfase (fase 2). |
| **A.8.30** Uitbestede systeemontwikkeling | organisatorisch | ▢ Organisatorisch | – | – | Alleen bij uitbestede ontwikkeling. |
| **A.8.31** Scheiding van ontwikkel-, test- en productieomgevingen | organisatorisch | ▢ Organisatorisch | – | – | Test-tenant of pilotgroep naast productie. |
| [**A.8.32** Wijzigingsbeheer](#a832-wijzigingsbeheer) | deels | ● Afgedekt (fase 1) | 2 | 4 | Wijzigingsprocedure (PR-review, pilotfase, communicatie) vastleggen en volgen; update-ringen zijn de technische kant. |
| **A.8.33** Testgegevens | organisatorisch | ▢ Organisatorisch | – | – | Alleen bij eigen ontwikkeling of testen. |
| **A.8.34** Bescherming van informatiesystemen tijdens audits | organisatorisch | ▢ Organisatorisch | – | – | Audits en pentests plannen en afstemmen met het verantwoordelijke management. |

### Maatregelen per control

Alle policies per control, met checkId en fase. Fase 5 is een alternatief dat niet uitrolt en telt niet mee voor de status.

#### A.5.9 Inventarisatie van informatie en andere gerelateerde bedrijfsmiddelen

- [`WIN - D - Enrollment Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.md) (fase 2) — `INTUNE-BASE-141-DEnrollmentHardening`
- [`MAC - D - Enrollment Profile Administrator User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md) (fase 4) — `INTUNE-BASE-115-MACDEnrollmentProfileAdministratorUserAffinity`
- [`MAC - D - Enrollment Profile Standard User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) (fase 4) — `INTUNE-BASE-116-MACDEnrollmentProfileStandardUserAffinity`

#### A.5.10 Aanvaardbaar gebruik van informatie en andere gerelateerde bedrijfsmiddelen

- [`WIN - D - AI Tooling`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.md) (fase 1) — `INTUNE-BASE-125-DAITooling`
- [`WIN - D - Windows AI Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.md) (fase 1) — `INTUNE-BASE-112-DWindowsAI`
- [`WIN - U - Copilot`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Copilot.md) (fase 1) — `INTUNE-BASE-097-UCopilot`
- [`AND - U - Corporate AI Restricted`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.md) (fase 2) — `INTUNE-BASE-179-ANDUCorporateAIRestricted`
- [`MAC - D - Apple Intelligence Restricted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.md) (fase 2) — `INTUNE-BASE-195-MACDAppleIntelligenceRestricted`
- [`MAC - D - Login Window`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.md) (fase 2) — `INTUNE-BASE-197-MACDLoginWindow`
- [`WIN - D - Windows AI Features Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.md) (fase 2) — `INTUNE-BASE-147-DWindowsAIFeaturesRestricted`
- [`WIN - U - AI Usage Control Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.md) (fase 2) — `INTUNE-BASE-139-UAIUsageControl`
- [`IOS - D - Apple Intelligence Restricted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.md) (fase 3) — `INTUNE-BASE-184-IOSDAppleIntelligenceRestricted`
- [`IOS - D - Apple Intelligence Permitted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.md) (fase 5) — `INTUNE-BASE-183-IOSDAppleIntelligencePermitted`
- [`MAC - D - Apple Intelligence Permitted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.md) (fase 5) — `INTUNE-BASE-194-MACDAppleIntelligencePermitted`
- [`WIN - D - Windows AI Features Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.md) (fase 5) — `INTUNE-BASE-146-DWindowsAIFeaturesPermitted`
- [`WIN - D - Windows AI Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.md) (fase 5) — `INTUNE-BASE-148-DWindowsAIPermitted`
- [`WIN - U - AI Usage Control Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.md) (fase 5) — `INTUNE-BASE-149-UAIUsageControlPermitted`

#### A.5.14 Overdragen van informatie

- [`MAC - D - Restrictions`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.md) (fase 1) — `INTUNE-BASE-046-MACDRestrictions`
- [`WIN - U - Microsoft Teams`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.md) (fase 2) — `INTUNE-BASE-145-UMicrosoftTeams`

#### A.5.15 Toegangsbeveiliging

- [`MAC - D - Accounts and Login`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.md) (fase 1) — `INTUNE-BASE-035-MACDAccountsAndLogin`
- [`WIN - D - Microsoft Accounts`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.md) (fase 1) — `INTUNE-BASE-073-DMicrosoftAccounts`
- [`WIN - D - User Rights`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.md) (fase 1) — `INTUNE-BASE-026-UserRights`
- [`WIN - D - Access Control`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.md) (fase 2) — `INTUNE-BASE-123-DAccessControl`
- [`WIN - D - Account Lockout`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.md) (fase 2) — `INTUNE-BASE-124-DAccountLockout`
- [`WIN - D - Enrollment Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.md) (fase 2) — `INTUNE-BASE-141-DEnrollmentHardening`
- [`WIN - D - Logon Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.md) (fase 2) — `INTUNE-BASE-132-DLogonHardening`
- [`WIN - D - Remote Access Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.md) (fase 2) — `INTUNE-BASE-135-DRemoteAccessHardening`
- [`WIN - U - Microsoft Teams`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.md) (fase 2) — `INTUNE-BASE-145-UMicrosoftTeams`
- [`IOS - U - Compliance Defender for Endpoint`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - U - Compliance Device Health`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender for Endpoint Risk`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`

#### A.5.16 Identiteitsbeheer

- [`MAC - D - Platform SSO`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) (fase 1) — `INTUNE-BASE-045-MACDPlatformSSO`
- [`WIN - D - Microsoft Accounts`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.md) (fase 1) — `INTUNE-BASE-073-DMicrosoftAccounts`

#### A.5.17 Authenticatie-informatie

- [`MAC - D - Microsoft Edge Password Management`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.md) (fase 1) — `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement`
- [`MAC - D - Platform SSO`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) (fase 1) — `INTUNE-BASE-045-MACDPlatformSSO`
- [`MAC - U - Compliance Password`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Device Lock`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.md) (fase 1) — `INTUNE-BASE-013-DeviceLock`
- [`WIN - D - Enhanced Phishing Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.md) (fase 1) — `INTUNE-BASE-024-Smartscreen`
- [`WIN - D - Legacy Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.md) (fase 1) — `INTUNE-BASE-070-DLegacyHardening`
- [`WIN - D - Login and Lock Screen`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.md) (fase 1) — `INTUNE-BASE-072-DLoginAndLockScreen`
- [`WIN - D - Passwordless`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.md) (fase 1) — `INTUNE-BASE-076-DPasswordless`
- [`WIN - D - Settings Sync`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.md) (fase 1) — `INTUNE-BASE-081-DSettingsSync`
- [`WIN - D - Windows LAPS`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.md) (fase 1) — `INTUNE-BASE-027-WindowsLAPSPolicy`
- [`WIN - U - Microsoft Edge Password Management`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Password_Management.md) (fase 1) — `INTUNE-BASE-099-UMicrosoftEdgePasswordManagement`
- [`WIN - U - Windows User Experience`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.md) (fase 1) — `INTUNE-BASE-031-UWindowsUserExperience`
- [`MAC - D - Passcode and Screen Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) (fase 2) — `INTUNE-BASE-121-MACDPasscodeAndScreenLock`
- [`MAC - D - Recovery Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.md) (fase 2) — `INTUNE-BASE-198-MACDRecoveryLock`
- [`WIN - D - Access Control`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.md) (fase 2) — `INTUNE-BASE-123-DAccessControl`
- [`WIN - D - Account Lockout`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.md) (fase 2) — `INTUNE-BASE-124-DAccountLockout`
- [`WIN - D - Device Guard and Credential Guard`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) (fase 2) — `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard`
- [`WIN - D - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-087-DWindowsHelloForBusiness`
- [`WIN - U - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-114-UWindowsHelloForBusiness`
- [`AND - U - Compliance Corporate Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`AND - U - Work Profile Restrictions`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) (fase 3)
- [`IOS - D - Enterprise SSO`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) (fase 3) — `INTUNE-BASE-188-IOSDEnterpriseSSO`
- [`IOS - D - Passcode`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.md) (fase 3) — `INTUNE-BASE-190-IOSDPasscode`
- [`IOS - U - Compliance Password`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Windows Hello for Business Multi User`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md) (fase 4) — `INTUNE-BASE-113-DWindowsHelloForBusinessMultiUser`

#### A.5.19 Informatiebeveiliging in leveranciersrelaties

- [`WIN - U - AI Usage Control Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.md) (fase 2) — `INTUNE-BASE-139-UAIUsageControl`
- [`WIN - U - AI Usage Control Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.md) (fase 5) — `INTUNE-BASE-149-UAIUsageControlPermitted`

#### A.5.29 Informatiebeveiliging tijdens een verstoring

- [`WIN - D - Business Continuity`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.md) (fase 1) — `INTUNE-BASE-127-DBusinessContinuity`
- [`WIN - D - Defender Ransomware Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.md) (fase 1) — `INTUNE-BASE-153-DDefenderRansomwareProtection`

#### A.5.30 ICT-gereedheid voor bedrijfscontinuïteit

- [`WIN - D - Business Continuity`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.md) (fase 1) — `INTUNE-BASE-127-DBusinessContinuity`
- [`WIN - D - Storage Sense`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.md) (fase 1) — `INTUNE-BASE-143-DStorageSense`

#### A.5.33 Beschermen van registraties

- [`WIN - D - Windows AI Recall Boundaries`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.md) (fase 3) — `INTUNE-BASE-150-DWindowsAIRecallBoundaries`

#### A.5.34 Privacy en bescherming van persoonsgegevens

- [`WIN - D - Data Minimisation`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Data_Minimisation.md) (fase 1) — `INTUNE-BASE-129-DDataMinimisation`
- [`WIN - D - Location and Privacy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Location_and_Privacy.md) (fase 1) — `INTUNE-BASE-022-Privacy`
- [`WIN - D - Privacy and Telemetry`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Privacy_and_Telemetry.md) (fase 1) — `INTUNE-BASE-134-DPrivacyAndTelemetry`
- [`WIN - D - Windows AI Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.md) (fase 1) — `INTUNE-BASE-112-DWindowsAI`
- [`AND - U - Corporate AI Restricted`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.md) (fase 2) — `INTUNE-BASE-179-ANDUCorporateAIRestricted`
- [`MAC - D - Apple Intelligence Restricted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.md) (fase 2) — `INTUNE-BASE-195-MACDAppleIntelligenceRestricted`
- [`MAC - D - Restrictions Hardening`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.md) (fase 2) — `INTUNE-BASE-199-MACDRestrictionsHardening`
- [`WIN - D - Windows AI Features Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.md) (fase 2) — `INTUNE-BASE-147-DWindowsAIFeaturesRestricted`
- [`IOS - D - Apple Intelligence Restricted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.md) (fase 3) — `INTUNE-BASE-184-IOSDAppleIntelligenceRestricted`
- [`WIN - D - Windows AI Recall Boundaries`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.md) (fase 3) — `INTUNE-BASE-150-DWindowsAIRecallBoundaries`
- [`IOS - D - Apple Intelligence Permitted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.md) (fase 5) — `INTUNE-BASE-183-IOSDAppleIntelligencePermitted`
- [`MAC - D - Apple Intelligence Permitted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.md) (fase 5) — `INTUNE-BASE-194-MACDAppleIntelligencePermitted`
- [`WIN - D - Windows AI Features Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.md) (fase 5) — `INTUNE-BASE-146-DWindowsAIFeaturesPermitted`
- [`WIN - D - Windows AI Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.md) (fase 5) — `INTUNE-BASE-148-DWindowsAIPermitted`

#### A.7.7 'Clear desk' en 'clear screen'

- [`MAC - U - Compliance Password`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Device Lock`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.md) (fase 1) — `INTUNE-BASE-013-DeviceLock`
- [`WIN - D - Login and Lock Screen`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.md) (fase 1) — `INTUNE-BASE-072-DLoginAndLockScreen`
- [`WIN - D - Power Management`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.md) (fase 1) — `INTUNE-BASE-142-DPowerManagement`
- [`WIN - U - Windows User Experience`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.md) (fase 1) — `INTUNE-BASE-031-UWindowsUserExperience`
- [`MAC - D - Passcode and Screen Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) (fase 2) — `INTUNE-BASE-121-MACDPasscodeAndScreenLock`
- [`MAC - D - Screensaver`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.md) (fase 2) — `INTUNE-BASE-200-MACDScreensaver`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`AND - U - Work Profile Restrictions`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) (fase 3)
- [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) (fase 4) — `INTUNE-BASE-191-IOSDRestrictionsCorporate`

#### A.7.9 Beveiligen van bedrijfsmiddelen buiten het terrein

- [`WIN - D - BitLocker`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.md) (fase 1) — `INTUNE-BASE-011-Bitlocker`
- [`WIN - D - Wireless and Peripherals`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.md) (fase 1) — `INTUNE-BASE-137-DWirelessAndPeripherals`
- [`AND - U - Corporate Data Protection`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.md) (fase 2) — `INTUNE-BASE-180-ANDUCorporateDataProtection`
- [`MAC - D - FileVault`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.md) (fase 2) — `INTUNE-BASE-038-MACDFileVault`
- [`MAC - D - Recovery Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.md) (fase 2) — `INTUNE-BASE-198-MACDRecoveryLock`
- [`WIN - D - Kernel DMA Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.md) (fase 2) — `INTUNE-BASE-130-DKernelDMAProtection`
- [`IOS - D - Lock Screen`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.md) (fase 4) — `INTUNE-BASE-189-IOSDLockScreen`

#### A.7.10 Opslagmedia

- [`WIN - D - BitLocker`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.md) (fase 1) — `INTUNE-BASE-011-Bitlocker`
- [`WIN - D - Removable Storage`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.md) (fase 2) — `INTUNE-BASE-111-DRemovableStorage`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`MAC - D - External Storage Read Only`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.md) (fase 5) — `INTUNE-BASE-196-MACDExternalStorageReadOnly`

#### A.8.1 'User endpoint devices'

- [`AND - U - App Protection`](IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`IOS - U - App Protection`](IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`MAC - D - Restrictions`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.md) (fase 1) — `INTUNE-BASE-046-MACDRestrictions`
- [`MAC - U - Compliance Device Health`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Compliance Device Security`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Compliance Password`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - AI Tooling`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.md) (fase 1) — `INTUNE-BASE-125-DAITooling`
- [`WIN - D - BitLocker`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.md) (fase 1) — `INTUNE-BASE-011-Bitlocker`
- [`WIN - D - Device Lock`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.md) (fase 1) — `INTUNE-BASE-013-DeviceLock`
- [`WIN - D - Power Management`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.md) (fase 1) — `INTUNE-BASE-142-DPowerManagement`
- [`WIN - D - Windows AI Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.md) (fase 1) — `INTUNE-BASE-112-DWindowsAI`
- [`WIN - U - Compliance Antispyware`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Antivirus`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance BitLocker`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md) (fase 1) — `INTUNE-BASE-001-DeviceEncryptionRequired`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Code Integrity`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Firewall`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Secure Boot`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance TPM`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Personal Data Encryption`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.md) (fase 1) — `INTUNE-BASE-105-UPersonalDataEncryption`
- [`AND - U - Corporate Data Protection`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.md) (fase 2) — `INTUNE-BASE-180-ANDUCorporateDataProtection`
- [`MAC - D - FileVault`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.md) (fase 2) — `INTUNE-BASE-038-MACDFileVault`
- [`MAC - D - Passcode and Screen Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) (fase 2) — `INTUNE-BASE-121-MACDPasscodeAndScreenLock`
- [`MAC - D - Recovery Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.md) (fase 2) — `INTUNE-BASE-198-MACDRecoveryLock`
- [`MAC - D - Screensaver`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.md) (fase 2) — `INTUNE-BASE-200-MACDScreensaver`
- [`WIN - D - Device Guard and Credential Guard`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) (fase 2) — `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard`
- [`WIN - D - Enrollment Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.md) (fase 2) — `INTUNE-BASE-141-DEnrollmentHardening`
- [`WIN - D - Kernel DMA Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.md) (fase 2) — `INTUNE-BASE-130-DKernelDMAProtection`
- [`WIN - D - Windows AI Features Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.md) (fase 2) — `INTUNE-BASE-147-DWindowsAIFeaturesRestricted`
- [`WIN - D - Windows Component Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.md) (fase 2) — `INTUNE-BASE-206-DWindowsComponentHardening`
- [`WIN - U - AI Usage Control Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.md) (fase 2) — `INTUNE-BASE-139-UAIUsageControl`
- [`AND - U - Compliance Block Device Administrator`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Corporate Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`AND - U - Work Profile Restrictions`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) (fase 3)
- [`IOS - D - Data Protection`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.md) (fase 3) — `INTUNE-BASE-185-IOSDDataProtection`
- [`IOS - D - Passcode`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.md) (fase 3) — `INTUNE-BASE-190-IOSDPasscode`
- [`IOS - U - Compliance Device Health`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - U - Compliance Password`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - D - Wifi Corporate`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.md) (fase 3)
- [`WIN - D - Wifi Corporate`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.md) (fase 3)
- [`AND - D - Compliance Dedicated Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) (fase 4) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Lock Screen`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.md) (fase 4) — `INTUNE-BASE-189-IOSDLockScreen`
- [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) (fase 4) — `INTUNE-BASE-191-IOSDRestrictionsCorporate`
- [`MAC - D - Enrollment Profile Administrator User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md) (fase 4) — `INTUNE-BASE-115-MACDEnrollmentProfileAdministratorUserAffinity`
- [`MAC - D - Enrollment Profile Standard User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) (fase 4) — `INTUNE-BASE-116-MACDEnrollmentProfileStandardUserAffinity`
- [`WIN - D - Wireless Shared Devices`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.md) (fase 4) — `INTUNE-BASE-138-DWirelessSharedDevices`
- [`MAC - D - Apple Intelligence Permitted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.md) (fase 5) — `INTUNE-BASE-194-MACDAppleIntelligencePermitted`
- [`WIN - D - Windows AI Features Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.md) (fase 5) — `INTUNE-BASE-146-DWindowsAIFeaturesPermitted`
- [`WIN - D - Windows AI Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.md) (fase 5) — `INTUNE-BASE-148-DWindowsAIPermitted`
- [`WIN - U - AI Usage Control Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.md) (fase 5) — `INTUNE-BASE-149-UAIUsageControlPermitted`
- [`WIN - U - Microsoft Outlook Cached Mode Off`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.md) (fase 5) — `INTUNE-BASE-161-UMicrosoftOutlookCachedModeOff`

#### A.8.2 Speciale toegangsrechten

- [`WIN - D - Local Administrators`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Administrators.md) (fase 1) — `INTUNE-BASE-071-DLocalAdministrators`
- [`WIN - D - Local Security Policies`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.md) (fase 1) — `INTUNE-BASE-018-LocalPoliciesSecurityOptions`
- [`WIN - D - Microsoft Store`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.md) (fase 1) — `INTUNE-BASE-019-MicrosoftAppStore`
- [`WIN - D - User Rights`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.md) (fase 1) — `INTUNE-BASE-026-UserRights`
- [`WIN - D - Windows LAPS`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.md) (fase 1) — `INTUNE-BASE-027-WindowsLAPSPolicy`
- [`WIN - U - Microsoft Store`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.md) (fase 1) — `INTUNE-BASE-104-UMicrosoftStore`
- [`WIN - D - Administrator Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.md) (fase 2) — `INTUNE-BASE-055-DAdministratorProtection`
- [`MAC - D - Enrollment Profile Administrator User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md) (fase 4) — `INTUNE-BASE-115-MACDEnrollmentProfileAdministratorUserAffinity`
- [`MAC - D - Enrollment Profile Standard User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) (fase 4) — `INTUNE-BASE-116-MACDEnrollmentProfileStandardUserAffinity`

#### A.8.3 Beperking toegang tot informatie

- [`AND - U - App Protection`](IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`WIN - U - File Sharing Restrictions`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.md) (fase 2) — `INTUNE-BASE-209-UFileSharingRestrictions`

#### A.8.5 Beveiligde authenticatie

- [`AND - U - App Protection`](IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`IOS - U - App Protection`](IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`MAC - D - Accounts and Login`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.md) (fase 1) — `INTUNE-BASE-035-MACDAccountsAndLogin`
- [`MAC - D - Platform SSO`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) (fase 1) — `INTUNE-BASE-045-MACDPlatformSSO`
- [`MAC - U - Compliance Password`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Device Lock`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.md) (fase 1) — `INTUNE-BASE-013-DeviceLock`
- [`WIN - D - Local Security Policies`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.md) (fase 1) — `INTUNE-BASE-018-LocalPoliciesSecurityOptions`
- [`WIN - D - Passwordless`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.md) (fase 1) — `INTUNE-BASE-076-DPasswordless`
- [`WIN - D - Remote Desktop and RPC`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) (fase 1) — `INTUNE-BASE-078-DRemoteDesktopAndRPC`
- [`WIN - D - Windows Hello Cloud Kerberos Trust`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.md) (fase 1) — `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust`
- [`MAC - D - Login Window`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.md) (fase 2) — `INTUNE-BASE-197-MACDLoginWindow`
- [`MAC - D - Passcode and Screen Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) (fase 2) — `INTUNE-BASE-121-MACDPasscodeAndScreenLock`
- [`MAC - D - Screensaver`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.md) (fase 2) — `INTUNE-BASE-200-MACDScreensaver`
- [`WIN - D - Access Control`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.md) (fase 2) — `INTUNE-BASE-123-DAccessControl`
- [`WIN - D - Account Lockout`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.md) (fase 2) — `INTUNE-BASE-124-DAccountLockout`
- [`WIN - D - Disable NTLM`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.md) (fase 2) — `INTUNE-BASE-066-DDisableNTLM`
- [`WIN - D - Logon Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.md) (fase 2) — `INTUNE-BASE-132-DLogonHardening`
- [`WIN - D - Network Authentication Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.md) (fase 2) — `INTUNE-BASE-204-DNetworkAuthenticationHardening`
- [`WIN - D - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-087-DWindowsHelloForBusiness`
- [`WIN - U - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-114-UWindowsHelloForBusiness`
- [`AND - U - Compliance Corporate Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`AND - U - Work Profile Restrictions`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) (fase 3)
- [`IOS - D - Enterprise SSO`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) (fase 3) — `INTUNE-BASE-188-IOSDEnterpriseSSO`
- [`IOS - D - Passcode`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.md) (fase 3) — `INTUNE-BASE-190-IOSDPasscode`
- [`IOS - U - Compliance Password`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - D - Azure Files Cloud Kerberos`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.md) (fase 3) — `INTUNE-BASE-154-MACDAzureFilesCloudKerberos`
- [`WIN - D - Windows Hello for Business Multi User`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md) (fase 4) — `INTUNE-BASE-113-DWindowsHelloForBusinessMultiUser`

#### A.8.6 Capaciteitsbeheer

- [`WIN - D - Delivery Optimisation`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Delivery_Optimisation.md) (fase 1) — `INTUNE-BASE-064-DDeliveryOptimisation`
- [`WIN - D - Endpoint Analytics`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Endpoint_Analytics.md) (fase 1)
- [`WIN - D - Storage Sense`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.md) (fase 1) — `INTUNE-BASE-143-DStorageSense`

#### A.8.7 Bescherming tegen malware

- [`MAC - D - Defender Antivirus`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.md) (fase 1) — `INTUNE-BASE-036-MACDDefenderAntivirus`
- [`MAC - D - Defender for Endpoint`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md) (fase 1) — `INTUNE-BASE-037-MACDDefenderForEndpoint`
- [`MAC - D - Firewall and Gatekeeper`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.md) (fase 1) — `INTUNE-BASE-039-MACDFirewallAndGatekeeper`
- [`MAC - D - Microsoft Edge Security`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity`
- [`MAC - U - Compliance Device Health`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Attack Surface Reduction`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.md) (fase 1) — `INTUNE-BASE-007-ASRDefaultRules`
- [`WIN - D - Defender Additional Configuration`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Additional_Configuration.md) (fase 1) — `INTUNE-BASE-059-DDefenderAdditionalConfiguration`
- [`WIN - D - Defender Antivirus`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Antivirus.md) (fase 1) — `INTUNE-BASE-012-DefaultAVPolicy`
- [`WIN - D - Defender EDR Policy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.md) (fase 1) — `INTUNE-BASE-109-DDefenderEDRPolicy`
- [`WIN - D - Defender Ransomware Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.md) (fase 1) — `INTUNE-BASE-153-DDefenderRansomwareProtection`
- [`WIN - D - Defender Security Experience`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Security_Experience.md) (fase 1) — `INTUNE-BASE-060-DDefenderSecurityExperience`
- [`WIN - D - Defender Update Ring 3 Production`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.md) (fase 1) — `INTUNE-BASE-063-DDefenderUpdateRing3Production`
- [`WIN - D - Internet Explorer Legacy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.md) (fase 1) — `INTUNE-BASE-069-DInternetExplorerLegacy`
- [`WIN - D - Microsoft Edge Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-020-MicrosoftEdge`
- [`WIN - D - Microsoft Office Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.md) (fase 1) — `INTUNE-BASE-075-DMicrosoftOfficeSecurity`
- [`WIN - D - Security Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.md) (fase 1) — `INTUNE-BASE-080-DSecurityHardening`
- [`WIN - D - Threat Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.md) (fase 1) — `INTUNE-BASE-136-DThreatProtection`
- [`WIN - D - Windows Firewall Rules`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.md) (fase 1) — `INTUNE-BASE-085-DWindowsFirewallRules`
- [`WIN - U - Attachment Scanning`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Attachment_Scanning.md) (fase 1) — `INTUNE-BASE-140-UAttachmentScanning`
- [`WIN - U - Compliance Antispyware`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Antivirus`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Code Integrity`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender Real Time Protection`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.md) (fase 1) — `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender Security Intelligence`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.md) (fase 1) — `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Secure Boot`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Microsoft Office Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.md) (fase 1) — `INTUNE-BASE-103-UMicrosoftOfficeSecurity`
- [`WIN - D - Device Guard and Credential Guard`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) (fase 2) — `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard`
- [`WIN - D - Printing Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.md) (fase 2) — `INTUNE-BASE-133-DPrintingHardening`
- [`WIN - D - Script File Associations`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.md) (fase 2) — `INTUNE-BASE-079-DScriptFileAssociations`
- [`AND - U - Compliance Corporate Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Corporate Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`IOS - U - Compliance Defender for Endpoint`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - U - Compliance Device Health`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender for Endpoint Risk`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Defender for Endpoint Onboarding Supervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.md) (fase 4)
- [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.md) (fase 4)
- [`WIN - D - Defender ASR Policy Audit Mode`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.md) (fase 4) — `INTUNE-BASE-107-DDefenderASRPolicyAuditMode`
- [`WIN - D - Defender Update Ring 1 Pilot`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.md) (fase 4) — `INTUNE-BASE-061-DDefenderUpdateRing1Pilot`
- [`WIN - D - Defender Update Ring 2 UAT`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.md) (fase 4) — `INTUNE-BASE-062-DDefenderUpdateRing2UAT`
- [`WIN - D - Defender AV Policy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_AV_Policy.md) (fase 5) — `INTUNE-BASE-108-DDefenderAVPolicy`
- [`WIN - D - Defender for Endpoint EDR`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.md) (fase 5) — `INTUNE-BASE-014-EDRConfiguration`

#### A.8.8 Beheer van technische kwetsbaarheden

- [`MAC - D - Microsoft AutoUpdate`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.md) (fase 1) — `INTUNE-BASE-040-MACDMicrosoftAutoUpdate`
- [`MAC - U - Microsoft Edge Updates`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.md) (fase 1) — `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates`
- [`WIN - D - Attack Surface Reduction`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.md) (fase 1) — `INTUNE-BASE-007-ASRDefaultRules`
- [`WIN - D - Automatic Restart Sign-On`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Automatic_Restart_Sign_On.md) (fase 1) — `INTUNE-BASE-056-DAutomaticRestartSignOn`
- [`WIN - D - Defender Update Ring 3 Production`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.md) (fase 1) — `INTUNE-BASE-063-DDefenderUpdateRing3Production`
- [`WIN - D - Microsoft Edge Updates`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Updates.md) (fase 1) — `INTUNE-BASE-074-DMicrosoftEdgeUpdates`
- [`WIN - D - Microsoft Office Updates`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.md) (fase 1) — `INTUNE-BASE-021-OfficeUpdates`
- [`WIN - D - Printing`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.md) (fase 1) — `INTUNE-BASE-077-DPrinting`
- [`WIN - D - Threat Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.md) (fase 1) — `INTUNE-BASE-136-DThreatProtection`
- [`WIN - D - Update Reports and Telemetry`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.md) (fase 1) — `INTUNE-BASE-083-DUpdateReportsAndTelemetry`
- [`WIN - D - Windows Update Ring 3 Production`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.md) (fase 1)
- [`MAC - D - Software Updates`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.md) (fase 2) — `INTUNE-BASE-047-MACDSoftwareUpdates`
- [`MAC - U - Compliance OS Version`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance OS Version`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-003-CompliancePolicyMinOsVersion`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - D - System Updates`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_D_System_Updates.md) (fase 3)
- [`AND - U - Compliance Corporate Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`IOS - D - Software Updates`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.md) (fase 3) — `INTUNE-BASE-192-IOSDSoftwareUpdates`
- [`AND - D - Compliance Dedicated Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) (fase 4) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Defender Update Ring 1 Pilot`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.md) (fase 4) — `INTUNE-BASE-061-DDefenderUpdateRing1Pilot`
- [`WIN - D - Defender Update Ring 2 UAT`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.md) (fase 4) — `INTUNE-BASE-062-DDefenderUpdateRing2UAT`
- [`WIN - D - Windows Update Ring 1 Pilot`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.md) (fase 4)
- [`WIN - D - Windows Update Ring 2 UAT`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.md) (fase 4)

#### A.8.9 Configuratiebeheer

- [`MAC - D - Microsoft Office`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Office.md) (fase 1) — `INTUNE-BASE-043-MACDMicrosoftOffice`
- [`MAC - D - Microsoft OneDrive`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_OneDrive.md) (fase 1) — `INTUNE-BASE-044-MACDMicrosoftOneDrive`
- [`WIN - D - Cloud Optimized Content`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_Optimized_Content.md) (fase 1) — `INTUNE-BASE-057-DCloudOptimizedContent`
- [`WIN - D - Config Refresh`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Config_Refresh.md) (fase 1) — `INTUNE-BASE-058-DConfigRefresh`
- [`WIN - D - Internet Explorer Legacy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.md) (fase 1) — `INTUNE-BASE-069-DInternetExplorerLegacy`
- [`WIN - D - Legacy Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.md) (fase 1) — `INTUNE-BASE-070-DLegacyHardening`
- [`WIN - D - Local Security Policies`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.md) (fase 1) — `INTUNE-BASE-018-LocalPoliciesSecurityOptions`
- [`WIN - D - Microsoft Edge Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-020-MicrosoftEdge`
- [`WIN - D - Microsoft Office Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.md) (fase 1) — `INTUNE-BASE-075-DMicrosoftOfficeSecurity`
- [`WIN - D - Security Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.md) (fase 1) — `INTUNE-BASE-080-DSecurityHardening`
- [`WIN - D - Windows Feature Configuration`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Feature_Configuration.md) (fase 1) — `INTUNE-BASE-084-DWindowsFeatureConfiguration`
- [`WIN - D - Windows Sandbox`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Sandbox.md) (fase 1) — `INTUNE-BASE-089-DWindowsSandbox`
- [`WIN - D - Windows Subsystem for Linux`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.md) (fase 1) — `INTUNE-BASE-090-DWindowsSubsystemForLinux`
- [`WIN - U - Microsoft Edge User Experience`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_User_Experience.md) (fase 1) — `INTUNE-BASE-101-UMicrosoftEdgeUserExperience`
- [`WIN - U - Microsoft Office Experience`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Experience.md) (fase 1) — `INTUNE-BASE-102-UMicrosoftOfficeExperience`
- [`WIN - U - Microsoft Office Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.md) (fase 1) — `INTUNE-BASE-103-UMicrosoftOfficeSecurity`
- [`WIN - U - Microsoft Outlook`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook.md) (fase 1) — `INTUNE-BASE-010-AutomaticConfigurationOfOutlook`
- [`WIN - U - Windows Spotlight`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Spotlight.md) (fase 1) — `INTUNE-BASE-106-UWindowsSpotlight`
- [`MAC - D - Restrictions Hardening`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.md) (fase 2) — `INTUNE-BASE-199-MACDRestrictionsHardening`
- [`WIN - D - Windows Component Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.md) (fase 2) — `INTUNE-BASE-206-DWindowsComponentHardening`
- [`WIN - U - Microsoft Edge Management`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Management.md) (fase 2) — `INTUNE-BASE-171-UMicrosoftEdgeManagement`
- [`WIN - U - Microsoft Outlook Cached Mode Managed`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.md) (fase 2) — `INTUNE-BASE-160-UMicrosoftOutlookCachedModeManaged`
- [`AND - U - Compliance Block Device Administrator`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Software Updates`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.md) (fase 3) — `INTUNE-BASE-192-IOSDSoftwareUpdates`
- [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) (fase 4) — `INTUNE-BASE-191-IOSDRestrictionsCorporate`
- [`WIN - D - Microsoft Edge Search Engine`](IntuneTemplate/WIN/AdministrativeTemplates/Baseline_WIN_D_Microsoft_Edge_Search_Engine.md) (fase 5) — `INTUNE-BASE-015-EdgeStandardSearchEngineGoogle`
- [`WIN - U - Microsoft Outlook Cached Mode Default`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.md) (fase 5) — `INTUNE-BASE-159-UMicrosoftOutlookCachedModeDefault`
- [`WIN - U - Microsoft Outlook Cached Mode Off`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.md) (fase 5) — `INTUNE-BASE-161-UMicrosoftOutlookCachedModeOff`

#### A.8.11 Maskeren van gegevens

- [`WIN - D - Windows AI Recall Boundaries`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.md) (fase 3) — `INTUNE-BASE-150-DWindowsAIRecallBoundaries`

#### A.8.12 Voorkomen van gegevenslekken (data leakage prevention)

- [`AND - U - App Protection`](IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`IOS - U - App Protection`](IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`MAC - D - Restrictions`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.md) (fase 1) — `INTUNE-BASE-046-MACDRestrictions`
- [`MAC - U - Microsoft Edge Profiles and Sync`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.md) (fase 1) — `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync`
- [`MAC - U - Microsoft OneDrive KFM`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.md) (fase 1) — `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM`
- [`WIN - D - AI Tooling`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.md) (fase 1) — `INTUNE-BASE-125-DAITooling`
- [`WIN - D - Microsoft Accounts`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.md) (fase 1) — `INTUNE-BASE-073-DMicrosoftAccounts`
- [`WIN - D - Microsoft OneDrive`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.md) (fase 1) — `INTUNE-BASE-029-OnedriveSilentLogin`
- [`WIN - D - Privacy and Telemetry`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Privacy_and_Telemetry.md) (fase 1) — `INTUNE-BASE-134-DPrivacyAndTelemetry`
- [`WIN - D - Windows AI Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.md) (fase 1) — `INTUNE-BASE-112-DWindowsAI`
- [`WIN - D - Windows Feature Configuration`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Feature_Configuration.md) (fase 1) — `INTUNE-BASE-084-DWindowsFeatureConfiguration`
- [`WIN - U - Microsoft Edge Profiles and Sync`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.md) (fase 1) — `INTUNE-BASE-100-UMicrosoftEdgeProfilesAndSync`
- [`WIN - U - Microsoft OneDrive`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_OneDrive.md) (fase 1) — `INTUNE-BASE-032-UMicrosoftOneDrive`
- [`AND - U - Corporate AI Restricted`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.md) (fase 2) — `INTUNE-BASE-179-ANDUCorporateAIRestricted`
- [`AND - U - Corporate Data Protection`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.md) (fase 2) — `INTUNE-BASE-180-ANDUCorporateDataProtection`
- [`MAC - D - Apple Intelligence Restricted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.md) (fase 2) — `INTUNE-BASE-195-MACDAppleIntelligenceRestricted`
- [`WIN - D - Removable Storage`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.md) (fase 2) — `INTUNE-BASE-111-DRemovableStorage`
- [`WIN - U - File Sharing Restrictions`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.md) (fase 2) — `INTUNE-BASE-209-UFileSharingRestrictions`
- [`WIN - U - Microsoft Teams`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.md) (fase 2) — `INTUNE-BASE-145-UMicrosoftTeams`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`AND - U - Work Profile Restrictions`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) (fase 3)
- [`IOS - D - Apple Intelligence Restricted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.md) (fase 3) — `INTUNE-BASE-184-IOSDAppleIntelligenceRestricted`
- [`IOS - D - Data Protection`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.md) (fase 3) — `INTUNE-BASE-185-IOSDDataProtection`
- [`WIN - D - Windows AI Recall Boundaries`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.md) (fase 3) — `INTUNE-BASE-150-DWindowsAIRecallBoundaries`
- [`IOS - D - Apple Intelligence Permitted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.md) (fase 5) — `INTUNE-BASE-183-IOSDAppleIntelligencePermitted`
- [`MAC - D - External Storage Read Only`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.md) (fase 5) — `INTUNE-BASE-196-MACDExternalStorageReadOnly`

#### A.8.13 Back-up van informatie

- [`MAC - U - Microsoft OneDrive KFM`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.md) (fase 1) — `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM`
- [`WIN - D - Microsoft OneDrive`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.md) (fase 1) — `INTUNE-BASE-029-OnedriveSilentLogin`
- [`WIN - D - Settings Sync`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.md) (fase 1) — `INTUNE-BASE-081-DSettingsSync`

#### A.8.15 Logging

- [`MAC - D - Time Server`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Time_Server.md) (fase 1) — `INTUNE-BASE-201-MACDTimeServer`
- [`WIN - D - Audit and Event Logging`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_and_Event_Logging.md) (fase 1) — `INTUNE-BASE-009-Auditing`
- [`WIN - D - Audit Policy Enforcement`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.md) (fase 1) — `INTUNE-BASE-126-DAuditPolicyEnforcement`
- [`WIN - D - Logging`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.md) (fase 1) — `INTUNE-BASE-131-DLogging`
- [`WIN - D - Security Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.md) (fase 1) — `INTUNE-BASE-080-DSecurityHardening`
- [`WIN - D - Windows Firewall`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.md) (fase 1) — `INTUNE-BASE-016-Firewall`
- [`WIN - D - Security Log Monitoring`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.md) (fase 2) — `INTUNE-BASE-205-DSecurityLogMonitoring`
- [`WIN - D - Windows Event Forwarding`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.md) (fase 3) — `INTUNE-BASE-207-DWindowsEventForwarding`

#### A.8.16 Monitoren van activiteiten

- [`MAC - D - Defender for Endpoint`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md) (fase 1) — `INTUNE-BASE-037-MACDDefenderForEndpoint`
- [`WIN - D - Audit Policy Enforcement`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.md) (fase 1) — `INTUNE-BASE-126-DAuditPolicyEnforcement`
- [`WIN - D - Defender EDR Policy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.md) (fase 1) — `INTUNE-BASE-109-DDefenderEDRPolicy`
- [`WIN - D - Logging`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.md) (fase 1) — `INTUNE-BASE-131-DLogging`
- [`WIN - D - Security Log Monitoring`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.md) (fase 2) — `INTUNE-BASE-205-DSecurityLogMonitoring`
- [`AND - U - Compliance Corporate Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - U - Compliance Defender for Endpoint`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Windows Event Forwarding`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.md) (fase 3) — `INTUNE-BASE-207-DWindowsEventForwarding`
- [`WIN - U - Compliance Defender for Endpoint Risk`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Defender ASR Policy Audit Mode`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.md) (fase 4) — `INTUNE-BASE-107-DDefenderASRPolicyAuditMode`
- [`WIN - D - Defender for Endpoint EDR`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.md) (fase 5) — `INTUNE-BASE-014-EDRConfiguration`

#### A.8.17 Kloksynchronisatie

- [`MAC - D - Time Server`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Time_Server.md) (fase 1) — `INTUNE-BASE-201-MACDTimeServer`
- [`WIN - D - Timezone`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Timezone.md) (fase 1) — `INTUNE-BASE-082-DTimezone`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`

#### A.8.18 Gebruik van speciale systeemhulpmiddelen

- [`WIN - D - User Rights`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.md) (fase 1) — `INTUNE-BASE-026-UserRights`
- [`MAC - D - Recovery Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.md) (fase 2) — `INTUNE-BASE-198-MACDRecoveryLock`
- [`MAC - D - Privacy Preferences`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.md) (fase 4) — `INTUNE-BASE-110-MACDPrivacyPreferences`
- [`MAC - D - Screen Recording`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Screen_Recording.md) (fase 4)

#### A.8.19 Installeren van software op operationele systemen

- [`MAC - D - Firewall and Gatekeeper`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.md) (fase 1) — `INTUNE-BASE-039-MACDFirewallAndGatekeeper`
- [`MAC - U - Compliance Device Security`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Microsoft Edge Extensions`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.md) (fase 1) — `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions`
- [`WIN - D - Microsoft Store`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.md) (fase 1) — `INTUNE-BASE-019-MicrosoftAppStore`
- [`WIN - D - Printing`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.md) (fase 1) — `INTUNE-BASE-077-DPrinting`
- [`WIN - D - Windows Package Manager`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Package_Manager.md) (fase 1) — `INTUNE-BASE-088-DWindowsPackageManager`
- [`WIN - D - Windows Subsystem for Linux`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.md) (fase 1) — `INTUNE-BASE-090-DWindowsSubsystemForLinux`
- [`WIN - U - Copilot`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Copilot.md) (fase 1) — `INTUNE-BASE-097-UCopilot`
- [`WIN - U - Microsoft Edge Extensions`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Extensions.md) (fase 1) — `INTUNE-BASE-098-UMicrosoftEdgeExtensions`
- [`WIN - U - Microsoft Store`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.md) (fase 1) — `INTUNE-BASE-104-UMicrosoftStore`
- [`MAC - D - Restrictions Hardening`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.md) (fase 2) — `INTUNE-BASE-199-MACDRestrictionsHardening`
- [`MAC - D - Software Updates`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.md) (fase 2) — `INTUNE-BASE-047-MACDSoftwareUpdates`
- [`MAC - U - Compliance OS Version`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - In-Box App Removal`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.md) (fase 2) — `INTUNE-BASE-068-DInBoxAppRemoval`
- [`WIN - D - Printing Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.md) (fase 2) — `INTUNE-BASE-133-DPrintingHardening`
- [`WIN - U - Compliance OS Version`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-003-CompliancePolicyMinOsVersion`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) (fase 4) — `INTUNE-BASE-191-IOSDRestrictionsCorporate`

#### A.8.20 Beveiliging netwerkcomponenten

- [`MAC - D - Firewall and Gatekeeper`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.md) (fase 1) — `INTUNE-BASE-039-MACDFirewallAndGatekeeper`
- [`MAC - D - Microsoft Edge Security`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity`
- [`MAC - U - Compliance Device Security`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Defender Ransomware Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.md) (fase 1) — `INTUNE-BASE-153-DDefenderRansomwareProtection`
- [`WIN - D - Legacy Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.md) (fase 1) — `INTUNE-BASE-070-DLegacyHardening`
- [`WIN - D - Local Security Policies`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.md) (fase 1) — `INTUNE-BASE-018-LocalPoliciesSecurityOptions`
- [`WIN - D - Printing`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.md) (fase 1) — `INTUNE-BASE-077-DPrinting`
- [`WIN - D - Remote Desktop and RPC`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) (fase 1) — `INTUNE-BASE-078-DRemoteDesktopAndRPC`
- [`WIN - D - Security Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.md) (fase 1) — `INTUNE-BASE-080-DSecurityHardening`
- [`WIN - D - Windows Firewall`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.md) (fase 1) — `INTUNE-BASE-016-Firewall`
- [`WIN - D - Windows Firewall Rules`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.md) (fase 1) — `INTUNE-BASE-085-DWindowsFirewallRules`
- [`WIN - D - Wireless and Peripherals`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.md) (fase 1) — `INTUNE-BASE-137-DWirelessAndPeripherals`
- [`WIN - U - Compliance Firewall`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Logon Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.md) (fase 2) — `INTUNE-BASE-132-DLogonHardening`
- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.md) (fase 2) — `INTUNE-BASE-202-DMicrosoftEdgeDNSOverHTTPSAutomatic`
- [`WIN - D - Network Authentication Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.md) (fase 2) — `INTUNE-BASE-204-DNetworkAuthenticationHardening`
- [`WIN - D - Printing Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.md) (fase 2) — `INTUNE-BASE-133-DPrintingHardening`
- [`WIN - D - Remote Access Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.md) (fase 2) — `INTUNE-BASE-135-DRemoteAccessHardening`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`MAC - D - Wifi Corporate`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.md) (fase 3)
- [`MAC - D - Wifi Guest`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.md) (fase 3)
- [`WIN - D - Wifi Corporate`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.md) (fase 3)
- [`WIN - D - Wifi Guest`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.md) (fase 3)
- [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) (fase 4) — `INTUNE-BASE-191-IOSDRestrictionsCorporate`
- [`WIN - D - Wireless Shared Devices`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.md) (fase 4) — `INTUNE-BASE-138-DWirelessSharedDevices`
- [`WIN - D - Microsoft Edge DNS over HTTPS Secure`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.md) (fase 5) — `INTUNE-BASE-203-DMicrosoftEdgeDNSOverHTTPSSecure`

#### A.8.21 Beveiliging van netwerkdiensten

- [`WIN - D - Remote Desktop and RPC`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) (fase 1) — `INTUNE-BASE-078-DRemoteDesktopAndRPC`
- [`WIN - D - Remote Access Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.md) (fase 2) — `INTUNE-BASE-135-DRemoteAccessHardening`
- [`MAC - D - Wifi Corporate`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.md) (fase 3)
- [`MAC - D - Wifi Guest`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.md) (fase 3)
- [`WIN - D - Wifi Corporate`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.md) (fase 3)
- [`WIN - D - Wifi Guest`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.md) (fase 3)

#### A.8.23 Toepassen van webfilters

- [`MAC - D - Microsoft Edge Security`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity`
- [`WIN - D - Enhanced Phishing Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.md) (fase 1) — `INTUNE-BASE-024-Smartscreen`
- [`WIN - D - Microsoft Edge Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-020-MicrosoftEdge`
- [`WIN - U - AI Usage Control Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.md) (fase 2) — `INTUNE-BASE-139-UAIUsageControl`
- [`IOS - D - Defender for Endpoint Onboarding Supervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.md) (fase 4)
- [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.md) (fase 4)
- [`WIN - U - AI Usage Control Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.md) (fase 5) — `INTUNE-BASE-149-UAIUsageControlPermitted`

#### A.8.24 Gebruik van cryptografie

- [`AND - U - App Protection`](IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`IOS - U - App Protection`](IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`MAC - U - Compliance Device Security`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - BitLocker`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.md) (fase 1) — `INTUNE-BASE-011-Bitlocker`
- [`WIN - D - Microsoft Edge Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-020-MicrosoftEdge`
- [`WIN - D - Remote Desktop and RPC`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) (fase 1) — `INTUNE-BASE-078-DRemoteDesktopAndRPC`
- [`WIN - U - Compliance BitLocker`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md) (fase 1) — `INTUNE-BASE-001-DeviceEncryptionRequired`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance TPM`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Personal Data Encryption`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.md) (fase 1) — `INTUNE-BASE-105-UPersonalDataEncryption`
- [`MAC - D - FileVault`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.md) (fase 2) — `INTUNE-BASE-038-MACDFileVault`
- [`WIN - D - Cryptography`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.md) (fase 2) — `INTUNE-BASE-128-DCryptography`
- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.md) (fase 2) — `INTUNE-BASE-202-DMicrosoftEdgeDNSOverHTTPSAutomatic`
- [`AND - U - Compliance Corporate Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Data Protection`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.md) (fase 3) — `INTUNE-BASE-185-IOSDDataProtection`
- [`AND - D - Compliance Dedicated Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) (fase 4) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Microsoft Edge DNS over HTTPS Secure`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.md) (fase 5) — `INTUNE-BASE-203-DMicrosoftEdgeDNSOverHTTPSSecure`

#### A.8.32 Wijzigingsbeheer

- [`WIN - D - Defender Update Ring 3 Production`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.md) (fase 1) — `INTUNE-BASE-063-DDefenderUpdateRing3Production`
- [`WIN - D - Windows Update Ring 3 Production`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.md) (fase 1)
- [`WIN - D - Defender Update Ring 1 Pilot`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.md) (fase 4) — `INTUNE-BASE-061-DDefenderUpdateRing1Pilot`
- [`WIN - D - Defender Update Ring 2 UAT`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.md) (fase 4) — `INTUNE-BASE-062-DDefenderUpdateRing2UAT`
- [`WIN - D - Windows Update Ring 1 Pilot`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.md) (fase 4)
- [`WIN - D - Windows Update Ring 2 UAT`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.md) (fase 4)

## NIS2 art. 21 lid 2

Bron: Richtlijn (EU) 2022/2555 (NIS2), art. 21 lid 2; uitgewerkt in Uitvoeringsverordening (EU) 2024/2690, bijlage. Per punt: wat de baseline technisch doet, welke policies dat zijn,
hoe het aantoonbaar is, en wat de organisatie zelf moet regelen. Artikel 21 vraagt maatregelen die
*passend en evenredig* zijn op basis van een risicoanalyse; deze baseline is een onderbouwde invulling
van het technische deel, geen vervanging van die afweging.

### art. 21(2)(a) risicoanalyse en beveiligingsbeleid voor informatiesystemen

*Beleid inzake risicoanalyse en beveiliging van informatiesystemen* — uitgewerkt in bijlage §1–2 van de uitvoeringsverordening.

**Technische invulling.** Deze baseline is een uitwerking van het beveiligingsbeleid voor apparaten en toegang, maar geen risicoanalyse.

**Intune, fase 1 (0)**

- geen

**Bewijsroute.** Geen technische maatregel in fase 1, dus ook geen technische bewijsroute.

**Organisatorisch nodig**

- Risicoanalyse (bijvoorbeeld een BIA en risicoregister) die de keuze van maatregelen onderbouwt
- Beleid voor netwerk- en informatiebeveiliging, goedgekeurd door het bestuur (art. 20)
- Periodieke herziening van beleid en risicoanalyse
- Registratie van geaccepteerde restrisico's en klantkeuzes (zie Klantkeuzes in dit document)

### art. 21(2)(b) incidentbehandeling

*Incidentenbehandeling* — uitgewerkt in bijlage §3 van de uitvoeringsverordening.

**Technische invulling.** EDR-onboarding, auditlogging, PowerShell-logging en de risicogebaseerde CA-policies leveren detectie en de middelen om in te grijpen.

**Intune, fase 1 (8)**

- [`MAC - D - Defender for Endpoint`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md) (fase 1) — `INTUNE-BASE-037-MACDDefenderForEndpoint`
- [`MAC - D - Time Server`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Time_Server.md) (fase 1) — `INTUNE-BASE-201-MACDTimeServer`
- [`WIN - D - Audit and Event Logging`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_and_Event_Logging.md) (fase 1) — `INTUNE-BASE-009-Auditing`
- [`WIN - D - Audit Policy Enforcement`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.md) (fase 1) — `INTUNE-BASE-126-DAuditPolicyEnforcement`
- [`WIN - D - Defender EDR Policy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.md) (fase 1) — `INTUNE-BASE-109-DDefenderEDRPolicy`
- [`WIN - D - Logging`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.md) (fase 1) — `INTUNE-BASE-131-DLogging`
- [`WIN - D - Security Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.md) (fase 1) — `INTUNE-BASE-080-DSecurityHardening`
- [`WIN - D - Timezone`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Timezone.md) (fase 1) — `INTUNE-BASE-082-DTimezone`

**Voorbereid — pilot, wacht of eigen groep (6)**

- [`WIN - D - Security Log Monitoring`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.md) (fase 2) — `INTUNE-BASE-205-DSecurityLogMonitoring`
- [`AND - U - Compliance Corporate Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - U - Compliance Defender for Endpoint`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Windows Event Forwarding`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.md) (fase 3) — `INTUNE-BASE-207-DWindowsEventForwarding`
- [`WIN - U - Compliance Defender for Endpoint Risk`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`

**Alternatief, niet uitgerold (1)**: `WIN - D - Defender for Endpoint EDR`

**Bewijsroute.** TEST Policies Platform toetst 8 checkId's: `INTUNE-BASE-009-Auditing`, `INTUNE-BASE-037-MACDDefenderForEndpoint`, `INTUNE-BASE-080-DSecurityHardening`, `INTUNE-BASE-082-DTimezone`, `INTUNE-BASE-109-DDefenderEDRPolicy`, `INTUNE-BASE-126-DAuditPolicyEnforcement`, `INTUNE-BASE-131-DLogging`, `INTUNE-BASE-201-MACDTimeServer`.

**Organisatorisch nodig**

- Incidentresponsplan met rollen en draaiboeken
- Meldprocedure richting CSIRT/toezichthouder binnen 24 uur (vroegtijdige waarschuwing), 72 uur en 1 maand (art. 23)
- Opvolging van alerts (wie kijkt wanneer, escalatie)
- Centrale logopslag en bewaartermijnen
- Evaluatie na incidenten

### art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer

*Bedrijfscontinuïteit, zoals back-upbeheer en noodvoorzieningen, en crisisbeheer* — uitgewerkt in bijlage §4 van de uitvoeringsverordening.

**Technische invulling.** OneDrive Known Folder Move, Windows-back-up, Quick Machine Recovery en een terugvalnetwerk dragen bij; ze vervangen geen back-up van M365-data.

**Intune, fase 1 (6)**

- [`MAC - U - Microsoft OneDrive KFM`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.md) (fase 1) — `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM`
- [`WIN - D - Business Continuity`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.md) (fase 1) — `INTUNE-BASE-127-DBusinessContinuity`
- [`WIN - D - Defender Ransomware Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.md) (fase 1) — `INTUNE-BASE-153-DDefenderRansomwareProtection`
- [`WIN - D - Microsoft OneDrive`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.md) (fase 1) — `INTUNE-BASE-029-OnedriveSilentLogin`
- [`WIN - D - Settings Sync`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.md) (fase 1) — `INTUNE-BASE-081-DSettingsSync`
- [`WIN - D - Storage Sense`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.md) (fase 1) — `INTUNE-BASE-143-DStorageSense`

**Voorbereid — pilot, wacht of eigen groep (2)**

- [`MAC - D - Wifi Guest`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.md) (fase 3)
- [`WIN - D - Wifi Guest`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.md) (fase 3)

**Bewijsroute.** TEST Policies Platform toetst 6 checkId's: `INTUNE-BASE-029-OnedriveSilentLogin`, `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM`, `INTUNE-BASE-081-DSettingsSync`, `INTUNE-BASE-127-DBusinessContinuity`, `INTUNE-BASE-143-DStorageSense`, `INTUNE-BASE-153-DDefenderRansomwareProtection`.

**Organisatorisch nodig**

- Bedrijfscontinuïteits- en herstelplan met RTO/RPO
- Back-upbeleid voor M365- en applicatiedata, met periodieke hersteltests
- Crisisorganisatie en communicatieplan
- Break-glass-procedure voor de tenant

### art. 21(2)(d) beveiliging van de toeleveringsketen

*Beveiliging van de toeleveringsketen, met inbegrip van beveiligingsaspecten van de relaties met leveranciers* — uitgewerkt in bijlage §5 van de uitvoeringsverordening.

**Technische invulling.** Technisch alleen het blokkeren van niet-goedgekeurde diensten en softwarebronnen (AI-diensten, extensies, softwarebronnen).

**Intune, fase 1 (2)**

- [`WIN - D - AI Tooling`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.md) (fase 1) — `INTUNE-BASE-125-DAITooling`
- [`WIN - D - Windows AI Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.md) (fase 1) — `INTUNE-BASE-112-DWindowsAI`

**Voorbereid — pilot, wacht of eigen groep (5)**

- [`AND - U - Corporate AI Restricted`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.md) (fase 2) — `INTUNE-BASE-179-ANDUCorporateAIRestricted`
- [`MAC - D - Apple Intelligence Restricted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.md) (fase 2) — `INTUNE-BASE-195-MACDAppleIntelligenceRestricted`
- [`WIN - D - Windows AI Features Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.md) (fase 2) — `INTUNE-BASE-147-DWindowsAIFeaturesRestricted`
- [`WIN - U - AI Usage Control Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.md) (fase 2) — `INTUNE-BASE-139-UAIUsageControl`
- [`IOS - D - Apple Intelligence Restricted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.md) (fase 3) — `INTUNE-BASE-184-IOSDAppleIntelligenceRestricted`

**Alternatief, niet uitgerold (5)**: `IOS - D - Apple Intelligence Permitted`, `MAC - D - Apple Intelligence Permitted`, `WIN - D - Windows AI Features Permitted`, `WIN - D - Windows AI Permitted`, `WIN - U - AI Usage Control Permitted`

**Bewijsroute.** TEST Policies Platform toetst 2 checkId's: `INTUNE-BASE-112-DWindowsAI`, `INTUNE-BASE-125-DAITooling`.

**Organisatorisch nodig**

- Leveranciersregister met risicoclassificatie
- Beveiligingseisen in contracten en verwerkersovereenkomsten
- Periodieke beoordeling van kritieke leveranciers (Microsoft, MSP, remote-supporttools)
- Besluit welke AI- en clouddiensten zijn toegestaan

### art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden

*Beveiliging bij het verwerven, ontwikkelen en onderhouden van netwerk- en informatiesystemen, met inbegrip van de behandeling en bekendmaking van kwetsbaarheden* — uitgewerkt in bijlage §6 van de uitvoeringsverordening.

**Technische invulling.** Het zwaartepunt van de baseline: configuratiebeheer, patchbeheer (update-ringen), hardening, malwarebescherming, netwerkbeveiliging op het apparaat en OS-ondergrenzen.

**Intune, fase 1 (48)**

- [`MAC - D - Defender Antivirus`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.md) (fase 1) — `INTUNE-BASE-036-MACDDefenderAntivirus`
- [`MAC - D - Defender for Endpoint`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md) (fase 1) — `INTUNE-BASE-037-MACDDefenderForEndpoint`
- [`MAC - D - Firewall and Gatekeeper`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.md) (fase 1) — `INTUNE-BASE-039-MACDFirewallAndGatekeeper`
- [`MAC - D - Microsoft AutoUpdate`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.md) (fase 1) — `INTUNE-BASE-040-MACDMicrosoftAutoUpdate`
- [`MAC - D - Microsoft Edge Security`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity`
- [`MAC - U - Compliance Device Health`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Compliance Device Security`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Microsoft Edge Extensions`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.md) (fase 1) — `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions`
- [`MAC - U - Microsoft Edge Updates`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.md) (fase 1) — `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates`
- [`WIN - D - Attack Surface Reduction`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.md) (fase 1) — `INTUNE-BASE-007-ASRDefaultRules`
- [`WIN - D - Automatic Restart Sign-On`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Automatic_Restart_Sign_On.md) (fase 1) — `INTUNE-BASE-056-DAutomaticRestartSignOn`
- [`WIN - D - Config Refresh`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Config_Refresh.md) (fase 1) — `INTUNE-BASE-058-DConfigRefresh`
- [`WIN - D - Defender Additional Configuration`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Additional_Configuration.md) (fase 1) — `INTUNE-BASE-059-DDefenderAdditionalConfiguration`
- [`WIN - D - Defender Antivirus`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Antivirus.md) (fase 1) — `INTUNE-BASE-012-DefaultAVPolicy`
- [`WIN - D - Defender Ransomware Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.md) (fase 1) — `INTUNE-BASE-153-DDefenderRansomwareProtection`
- [`WIN - D - Defender Security Experience`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Security_Experience.md) (fase 1) — `INTUNE-BASE-060-DDefenderSecurityExperience`
- [`WIN - D - Defender Update Ring 3 Production`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.md) (fase 1) — `INTUNE-BASE-063-DDefenderUpdateRing3Production`
- [`WIN - D - Internet Explorer Legacy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.md) (fase 1) — `INTUNE-BASE-069-DInternetExplorerLegacy`
- [`WIN - D - Legacy Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.md) (fase 1) — `INTUNE-BASE-070-DLegacyHardening`
- [`WIN - D - Local Security Policies`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.md) (fase 1) — `INTUNE-BASE-018-LocalPoliciesSecurityOptions`
- [`WIN - D - Microsoft Edge Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-020-MicrosoftEdge`
- [`WIN - D - Microsoft Edge Updates`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Updates.md) (fase 1) — `INTUNE-BASE-074-DMicrosoftEdgeUpdates`
- [`WIN - D - Microsoft Office Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.md) (fase 1) — `INTUNE-BASE-075-DMicrosoftOfficeSecurity`
- [`WIN - D - Microsoft Office Updates`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.md) (fase 1) — `INTUNE-BASE-021-OfficeUpdates`
- [`WIN - D - Microsoft Store`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.md) (fase 1) — `INTUNE-BASE-019-MicrosoftAppStore`
- [`WIN - D - Printing`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.md) (fase 1) — `INTUNE-BASE-077-DPrinting`
- [`WIN - D - Remote Desktop and RPC`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) (fase 1) — `INTUNE-BASE-078-DRemoteDesktopAndRPC`
- [`WIN - D - Security Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.md) (fase 1) — `INTUNE-BASE-080-DSecurityHardening`
- [`WIN - D - Threat Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.md) (fase 1) — `INTUNE-BASE-136-DThreatProtection`
- [`WIN - D - Update Reports and Telemetry`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.md) (fase 1) — `INTUNE-BASE-083-DUpdateReportsAndTelemetry`
- [`WIN - D - Windows Firewall`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.md) (fase 1) — `INTUNE-BASE-016-Firewall`
- [`WIN - D - Windows Firewall Rules`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.md) (fase 1) — `INTUNE-BASE-085-DWindowsFirewallRules`
- [`WIN - D - Windows Package Manager`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Package_Manager.md) (fase 1) — `INTUNE-BASE-088-DWindowsPackageManager`
- [`WIN - D - Windows Sandbox`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Sandbox.md) (fase 1) — `INTUNE-BASE-089-DWindowsSandbox`
- [`WIN - D - Windows Subsystem for Linux`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.md) (fase 1) — `INTUNE-BASE-090-DWindowsSubsystemForLinux`
- [`WIN - D - Windows Update Ring 3 Production`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.md) (fase 1)
- [`WIN - D - Wireless and Peripherals`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.md) (fase 1) — `INTUNE-BASE-137-DWirelessAndPeripherals`
- [`WIN - U - Attachment Scanning`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Attachment_Scanning.md) (fase 1) — `INTUNE-BASE-140-UAttachmentScanning`
- [`WIN - U - Compliance Antispyware`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Antivirus`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Code Integrity`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender Real Time Protection`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.md) (fase 1) — `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender Security Intelligence`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.md) (fase 1) — `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Firewall`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Secure Boot`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Microsoft Edge Extensions`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Extensions.md) (fase 1) — `INTUNE-BASE-098-UMicrosoftEdgeExtensions`
- [`WIN - U - Microsoft Office Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.md) (fase 1) — `INTUNE-BASE-103-UMicrosoftOfficeSecurity`
- [`WIN - U - Microsoft Store`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.md) (fase 1) — `INTUNE-BASE-104-UMicrosoftStore`

**Voorbereid — pilot, wacht of eigen groep (35)**

- [`MAC - D - Restrictions Hardening`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.md) (fase 2) — `INTUNE-BASE-199-MACDRestrictionsHardening`
- [`MAC - D - Software Updates`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.md) (fase 2) — `INTUNE-BASE-047-MACDSoftwareUpdates`
- [`MAC - U - Compliance OS Version`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Device Guard and Credential Guard`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) (fase 2) — `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard`
- [`WIN - D - In-Box App Removal`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.md) (fase 2) — `INTUNE-BASE-068-DInBoxAppRemoval`
- [`WIN - D - Kernel DMA Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.md) (fase 2) — `INTUNE-BASE-130-DKernelDMAProtection`
- [`WIN - D - Network Authentication Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.md) (fase 2) — `INTUNE-BASE-204-DNetworkAuthenticationHardening`
- [`WIN - D - Printing Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.md) (fase 2) — `INTUNE-BASE-133-DPrintingHardening`
- [`WIN - D - Remote Access Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.md) (fase 2) — `INTUNE-BASE-135-DRemoteAccessHardening`
- [`WIN - D - Script File Associations`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.md) (fase 2) — `INTUNE-BASE-079-DScriptFileAssociations`
- [`WIN - D - Windows Component Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.md) (fase 2) — `INTUNE-BASE-206-DWindowsComponentHardening`
- [`WIN - U - Compliance OS Version`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-003-CompliancePolicyMinOsVersion`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - D - System Updates`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_D_System_Updates.md) (fase 3)
- [`AND - U - Compliance Corporate Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Corporate Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`IOS - D - Software Updates`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.md) (fase 3) — `INTUNE-BASE-192-IOSDSoftwareUpdates`
- [`IOS - U - Compliance Defender for Endpoint`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - U - Compliance Device Health`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - D - Wifi Corporate`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.md) (fase 3)
- [`MAC - D - Wifi Guest`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.md) (fase 3)
- [`WIN - D - Wifi Corporate`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.md) (fase 3)
- [`WIN - D - Wifi Guest`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.md) (fase 3)
- [`AND - D - Compliance Dedicated Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) (fase 4) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Defender for Endpoint Onboarding Supervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.md) (fase 4)
- [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.md) (fase 4)
- [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) (fase 4) — `INTUNE-BASE-191-IOSDRestrictionsCorporate`
- [`WIN - D - Defender ASR Policy Audit Mode`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.md) (fase 4) — `INTUNE-BASE-107-DDefenderASRPolicyAuditMode`
- [`WIN - D - Defender Update Ring 1 Pilot`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.md) (fase 4) — `INTUNE-BASE-061-DDefenderUpdateRing1Pilot`
- [`WIN - D - Defender Update Ring 2 UAT`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.md) (fase 4) — `INTUNE-BASE-062-DDefenderUpdateRing2UAT`
- [`WIN - D - Windows Update Ring 1 Pilot`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.md) (fase 4)
- [`WIN - D - Windows Update Ring 2 UAT`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.md) (fase 4)
- [`WIN - D - Wireless Shared Devices`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.md) (fase 4) — `INTUNE-BASE-138-DWirelessSharedDevices`

**Alternatief, niet uitgerold (1)**: `WIN - D - Defender AV Policy`

**Bewijsroute.** TEST Policies Platform toetst 40 checkId's: `INTUNE-BASE-002-CompliancePolicyAssigned`, `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-007-ASRDefaultRules`, `INTUNE-BASE-012-DefaultAVPolicy`, `INTUNE-BASE-016-Firewall`, `INTUNE-BASE-018-LocalPoliciesSecurityOptions`, `INTUNE-BASE-019-MicrosoftAppStore`, `INTUNE-BASE-020-MicrosoftEdge`, `INTUNE-BASE-021-OfficeUpdates`, `INTUNE-BASE-036-MACDDefenderAntivirus`, `INTUNE-BASE-037-MACDDefenderForEndpoint`, `INTUNE-BASE-039-MACDFirewallAndGatekeeper`, `INTUNE-BASE-040-MACDMicrosoftAutoUpdate`, `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity`, `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions`, `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates`, `INTUNE-BASE-056-DAutomaticRestartSignOn`, `INTUNE-BASE-058-DConfigRefresh`, `INTUNE-BASE-059-DDefenderAdditionalConfiguration`, `INTUNE-BASE-060-DDefenderSecurityExperience`, `INTUNE-BASE-063-DDefenderUpdateRing3Production`, `INTUNE-BASE-069-DInternetExplorerLegacy`, `INTUNE-BASE-070-DLegacyHardening`, `INTUNE-BASE-074-DMicrosoftEdgeUpdates`, `INTUNE-BASE-075-DMicrosoftOfficeSecurity`, `INTUNE-BASE-077-DPrinting`, `INTUNE-BASE-078-DRemoteDesktopAndRPC`, `INTUNE-BASE-080-DSecurityHardening`, `INTUNE-BASE-083-DUpdateReportsAndTelemetry`, `INTUNE-BASE-085-DWindowsFirewallRules`, `INTUNE-BASE-088-DWindowsPackageManager`, `INTUNE-BASE-089-DWindowsSandbox`, `INTUNE-BASE-090-DWindowsSubsystemForLinux`, `INTUNE-BASE-098-UMicrosoftEdgeExtensions`, `INTUNE-BASE-103-UMicrosoftOfficeSecurity`, `INTUNE-BASE-104-UMicrosoftStore`, `INTUNE-BASE-136-DThreatProtection`, `INTUNE-BASE-137-DWirelessAndPeripherals`, `INTUNE-BASE-140-UAttachmentScanning`, `INTUNE-BASE-153-DDefenderRansomwareProtection`. Zonder eigen check (aantoonbaar via de Intune-rapportage): `WIN - D - Windows Update Ring 3 Production`.

**Organisatorisch nodig**

- Kwetsbaarhedenbeheerproces met hersteltermijnen en uitzonderingsregistratie
- Wijzigingsbeheer voor de baseline (PR-review, pilot)
- Beveiligingseisen bij aanschaf van ICT-producten en -diensten
- Beleid voor gecoördineerde bekendmaking van kwetsbaarheden (CVD)

### art. 21(2)(f) beoordeling van de doeltreffendheid

*Beleid en procedures om de effectiviteit van cyberbeveiligingsrisicobeheersmaatregelen te beoordelen* — uitgewerkt in bijlage §7 van de uitvoeringsverordening.

**Technische invulling.** Compliance-policies en de baseline-checks in TEST Policies Platform meten of de maatregelen daadwerkelijk staan; dat is bewijs, geen beoordeling.

**Intune, fase 1 (13)**

- [`MAC - U - Compliance Device Health`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Compliance Device Security`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Compliance Password`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - Update Reports and Telemetry`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.md) (fase 1) — `INTUNE-BASE-083-DUpdateReportsAndTelemetry`
- [`WIN - U - Compliance Antispyware`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Antivirus`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance BitLocker`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md) (fase 1) — `INTUNE-BASE-001-DeviceEncryptionRequired`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Code Integrity`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender Real Time Protection`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.md) (fase 1) — `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Defender Security Intelligence`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.md) (fase 1) — `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Firewall`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance Secure Boot`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance TPM`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`

**Voorbereid — pilot, wacht of eigen groep (2)**

- [`MAC - U - Compliance OS Version`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance OS Version`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md) (fase 2) — `INTUNE-BASE-003-CompliancePolicyMinOsVersion`, `INTUNE-BASE-002-CompliancePolicyAssigned`

**Bewijsroute.** TEST Policies Platform toetst 4 checkId's: `INTUNE-BASE-001-DeviceEncryptionRequired`, `INTUNE-BASE-002-CompliancePolicyAssigned`, `INTUNE-BASE-006-DefenderEnabled`, `INTUNE-BASE-083-DUpdateReportsAndTelemetry`.

**Organisatorisch nodig**

- Vastgesteld beoordelingsprogramma (interne audit, pentest, managementreview)
- KPI's en rapportage aan het bestuur
- Opvolging van afwijkingen uit de baseline-checks en compliance-rapportage
- Periodieke herijking van deze baseline tegen nieuwe dreigingen

### art. 21(2)(g) basispraktijken cyberhygiene en training

*Basispraktijken op het gebied van cyberhygiëne en opleiding op het gebied van cyberbeveiliging* — uitgewerkt in bijlage §8 van de uitvoeringsverordening.

**Technische invulling.** Technisch alleen waarschuwingen in de context (phishingbescherming, aanmeldbanner); de rest van de baseline is de hygiëne zelf.

**Intune, fase 1 (1)**

- [`WIN - D - Enhanced Phishing Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.md) (fase 1) — `INTUNE-BASE-024-Smartscreen`

**Voorbereid — pilot, wacht of eigen groep (2)**

- [`MAC - D - Login Window`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.md) (fase 2) — `INTUNE-BASE-197-MACDLoginWindow`
- [`MAC - D - Restrictions Hardening`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.md) (fase 2) — `INTUNE-BASE-199-MACDRestrictionsHardening`

**Bewijsroute.** TEST Policies Platform toetst 1 checkId's: `INTUNE-BASE-024-Smartscreen`.

**Organisatorisch nodig**

- Bewustwordingsprogramma voor alle medewerkers
- Training voor bestuurders (art. 20(2))
- Specifieke training voor beheerders
- Periodieke phishing-simulaties en evaluatie

### art. 21(2)(h) cryptografie en versleuteling

*Beleid en procedures rond het gebruik van cryptografie en, in voorkomend geval, encryptie* — uitgewerkt in bijlage §9 van de uitvoeringsverordening.

**Technische invulling.** BitLocker, FileVault, Personal Data Encryption, app-versleuteling (MAM), TLS-ondergrens en versleutelde beheerprotocollen.

**Intune, fase 1 (8)**

- [`AND - U - App Protection`](IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`IOS - U - App Protection`](IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`MAC - U - Compliance Device Security`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - D - BitLocker`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.md) (fase 1) — `INTUNE-BASE-011-Bitlocker`
- [`WIN - D - Remote Desktop and RPC`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) (fase 1) — `INTUNE-BASE-078-DRemoteDesktopAndRPC`
- [`WIN - U - Compliance BitLocker`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md) (fase 1) — `INTUNE-BASE-001-DeviceEncryptionRequired`, `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Compliance TPM`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`WIN - U - Personal Data Encryption`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.md) (fase 1) — `INTUNE-BASE-105-UPersonalDataEncryption`

**Voorbereid — pilot, wacht of eigen groep (7)**

- [`MAC - D - FileVault`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.md) (fase 2) — `INTUNE-BASE-038-MACDFileVault`
- [`WIN - D - Cryptography`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.md) (fase 2) — `INTUNE-BASE-128-DCryptography`
- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.md) (fase 2) — `INTUNE-BASE-202-DMicrosoftEdgeDNSOverHTTPSAutomatic`
- [`AND - U - Compliance Corporate Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Data Protection`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.md) (fase 3) — `INTUNE-BASE-185-IOSDDataProtection`
- [`AND - D - Compliance Dedicated Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) (fase 4) — `INTUNE-BASE-002-CompliancePolicyAssigned`

**Alternatief, niet uitgerold (1)**: `WIN - D - Microsoft Edge DNS over HTTPS Secure`

**Bewijsroute.** TEST Policies Platform toetst 6 checkId's: `INTUNE-BASE-001-DeviceEncryptionRequired`, `INTUNE-BASE-002-CompliancePolicyAssigned`, `INTUNE-BASE-004-AppProtectionPolicyExists`, `INTUNE-BASE-011-Bitlocker`, `INTUNE-BASE-078-DRemoteDesktopAndRPC`, `INTUNE-BASE-105-UPersonalDataEncryption`.

**Organisatorisch nodig**

- Cryptografiebeleid (algoritmen, sleutellengtes)
- Sleutelbeheer: wie mag herstelsleutels opvragen, logging daarvan
- Periodieke controle op versleutelingsstatus en uitzonderingen

### art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen

*Beveiligingsaspecten ten aanzien van personeel, toegangsbeleid en beheer van activa* — uitgewerkt in bijlage §10–12 van de uitvoeringsverordening.

**Technische invulling.** Schermvergrendeling, wachtwoord- en PIN-eisen, beheerde lokale beheerders, LAPS, verwisselbare opslag, inschrijving en compliance als toegangsvoorwaarde.

**Intune, fase 1 (22)**

- [`AND - U - App Protection`](IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`IOS - U - App Protection`](IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.md) (fase 1) — `INTUNE-BASE-004-AppProtectionPolicyExists`
- [`MAC - D - Accounts and Login`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.md) (fase 1) — `INTUNE-BASE-035-MACDAccountsAndLogin`
- [`MAC - D - Microsoft Edge Password Management`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.md) (fase 1) — `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement`
- [`MAC - D - Platform SSO`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) (fase 1) — `INTUNE-BASE-045-MACDPlatformSSO`
- [`MAC - D - Restrictions`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.md) (fase 1) — `INTUNE-BASE-046-MACDRestrictions`
- [`MAC - U - Compliance Password`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) (fase 1) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - U - Microsoft Edge Profiles and Sync`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.md) (fase 1) — `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync`
- [`WIN - D - Device Lock`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.md) (fase 1) — `INTUNE-BASE-013-DeviceLock`
- [`WIN - D - Enhanced Phishing Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.md) (fase 1) — `INTUNE-BASE-024-Smartscreen`
- [`WIN - D - Local Administrators`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Administrators.md) (fase 1) — `INTUNE-BASE-071-DLocalAdministrators`
- [`WIN - D - Local Security Policies`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.md) (fase 1) — `INTUNE-BASE-018-LocalPoliciesSecurityOptions`
- [`WIN - D - Login and Lock Screen`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.md) (fase 1) — `INTUNE-BASE-072-DLoginAndLockScreen`
- [`WIN - D - Microsoft Accounts`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.md) (fase 1) — `INTUNE-BASE-073-DMicrosoftAccounts`
- [`WIN - D - Passwordless`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.md) (fase 1) — `INTUNE-BASE-076-DPasswordless`
- [`WIN - D - Power Management`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.md) (fase 1) — `INTUNE-BASE-142-DPowerManagement`
- [`WIN - D - User Rights`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.md) (fase 1) — `INTUNE-BASE-026-UserRights`
- [`WIN - D - Windows Hello Cloud Kerberos Trust`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.md) (fase 1) — `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust`
- [`WIN - D - Windows LAPS`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.md) (fase 1) — `INTUNE-BASE-027-WindowsLAPSPolicy`
- [`WIN - U - Microsoft Edge Password Management`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Password_Management.md) (fase 1) — `INTUNE-BASE-099-UMicrosoftEdgePasswordManagement`
- [`WIN - U - Microsoft Edge Profiles and Sync`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.md) (fase 1) — `INTUNE-BASE-100-UMicrosoftEdgeProfilesAndSync`
- [`WIN - U - Windows User Experience`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.md) (fase 1) — `INTUNE-BASE-031-UWindowsUserExperience`

**Voorbereid — pilot, wacht of eigen groep (37)**

- [`AND - U - Corporate Data Protection`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.md) (fase 2) — `INTUNE-BASE-180-ANDUCorporateDataProtection`
- [`MAC - D - Login Window`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.md) (fase 2) — `INTUNE-BASE-197-MACDLoginWindow`
- [`MAC - D - Passcode and Screen Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) (fase 2) — `INTUNE-BASE-121-MACDPasscodeAndScreenLock`
- [`MAC - D - Recovery Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.md) (fase 2) — `INTUNE-BASE-198-MACDRecoveryLock`
- [`MAC - D - Screensaver`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.md) (fase 2) — `INTUNE-BASE-200-MACDScreensaver`
- [`WIN - D - Access Control`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.md) (fase 2) — `INTUNE-BASE-123-DAccessControl`
- [`WIN - D - Account Lockout`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.md) (fase 2) — `INTUNE-BASE-124-DAccountLockout`
- [`WIN - D - Administrator Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.md) (fase 2) — `INTUNE-BASE-055-DAdministratorProtection`
- [`WIN - D - Device Guard and Credential Guard`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) (fase 2) — `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard`
- [`WIN - D - Disable NTLM`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.md) (fase 2) — `INTUNE-BASE-066-DDisableNTLM`
- [`WIN - D - Enrollment Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.md) (fase 2) — `INTUNE-BASE-141-DEnrollmentHardening`
- [`WIN - D - Logon Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.md) (fase 2) — `INTUNE-BASE-132-DLogonHardening`
- [`WIN - D - Removable Storage`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.md) (fase 2) — `INTUNE-BASE-111-DRemovableStorage`
- [`WIN - D - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-087-DWindowsHelloForBusiness`
- [`WIN - U - File Sharing Restrictions`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.md) (fase 2) — `INTUNE-BASE-209-UFileSharingRestrictions`
- [`WIN - U - Microsoft Teams`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.md) (fase 2) — `INTUNE-BASE-145-UMicrosoftTeams`
- [`WIN - U - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-114-UWindowsHelloForBusiness`
- [`AND - U - Compliance Block Device Administrator`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Corporate Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Corporate Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Compliance Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) (fase 3) — `INTUNE-BASE-181-ANDUCorporateDeviceSecurity`
- [`AND - U - Work Profile Restrictions`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) (fase 3)
- [`IOS - D - Data Protection`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.md) (fase 3) — `INTUNE-BASE-185-IOSDDataProtection`
- [`IOS - D - Enterprise SSO`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) (fase 3) — `INTUNE-BASE-188-IOSDEnterpriseSSO`
- [`IOS - D - Passcode`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.md) (fase 3) — `INTUNE-BASE-190-IOSDPasscode`
- [`IOS - U - Compliance Device Health`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - U - Compliance Password`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`MAC - D - Azure Files Cloud Kerberos`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.md) (fase 3) — `INTUNE-BASE-154-MACDAzureFilesCloudKerberos`
- [`WIN - U - Compliance Defender for Endpoint Risk`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) (fase 3) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`AND - D - Compliance Dedicated Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) (fase 4) — `INTUNE-BASE-002-CompliancePolicyAssigned`
- [`IOS - D - Lock Screen`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.md) (fase 4) — `INTUNE-BASE-189-IOSDLockScreen`
- [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) (fase 4) — `INTUNE-BASE-191-IOSDRestrictionsCorporate`
- [`MAC - D - Enrollment Profile Administrator User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md) (fase 4) — `INTUNE-BASE-115-MACDEnrollmentProfileAdministratorUserAffinity`
- [`MAC - D - Enrollment Profile Standard User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) (fase 4) — `INTUNE-BASE-116-MACDEnrollmentProfileStandardUserAffinity`
- [`WIN - D - Windows Hello for Business Multi User`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md) (fase 4) — `INTUNE-BASE-113-DWindowsHelloForBusinessMultiUser`

**Alternatief, niet uitgerold (1)**: `MAC - D - External Storage Read Only`

**Bewijsroute.** TEST Policies Platform toetst 21 checkId's: `INTUNE-BASE-002-CompliancePolicyAssigned`, `INTUNE-BASE-004-AppProtectionPolicyExists`, `INTUNE-BASE-013-DeviceLock`, `INTUNE-BASE-018-LocalPoliciesSecurityOptions`, `INTUNE-BASE-024-Smartscreen`, `INTUNE-BASE-026-UserRights`, `INTUNE-BASE-027-WindowsLAPSPolicy`, `INTUNE-BASE-031-UWindowsUserExperience`, `INTUNE-BASE-035-MACDAccountsAndLogin`, `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement`, `INTUNE-BASE-045-MACDPlatformSSO`, `INTUNE-BASE-046-MACDRestrictions`, `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync`, `INTUNE-BASE-071-DLocalAdministrators`, `INTUNE-BASE-072-DLoginAndLockScreen`, `INTUNE-BASE-073-DMicrosoftAccounts`, `INTUNE-BASE-076-DPasswordless`, `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust`, `INTUNE-BASE-099-UMicrosoftEdgePasswordManagement`, `INTUNE-BASE-100-UMicrosoftEdgeProfilesAndSync`, `INTUNE-BASE-142-DPowerManagement`.

**Organisatorisch nodig**

- HR-beveiliging: screening, geheimhouding, uitdienstproces
- Toegangsbeleid en periodieke beoordeling van rechten
- Inventaris van bedrijfsmiddelen met eigenaar
- Beleid voor privéapparaten en verwisselbare media

### art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie

*Het gebruik van multifactorauthenticatie of continue authenticatie, beveiligde spraak-, video- en tekstcommunicatie en beveiligde noodcommunicatiesystemen* — uitgewerkt in bijlage §11.7 van de uitvoeringsverordening.

**Technische invulling.** Intune levert de sterke authenticatiemethoden (Windows Hello for Business, wachtwoordloos aanmelden); het afdwingen van MFA gebeurt in Conditional Access.

**Intune, fase 1 (3)**

- [`MAC - D - Microsoft Edge Security`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) (fase 1) — `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity`
- [`WIN - D - Passwordless`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.md) (fase 1) — `INTUNE-BASE-076-DPasswordless`
- [`WIN - D - Windows Hello Cloud Kerberos Trust`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.md) (fase 1) — `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust`

**Voorbereid — pilot, wacht of eigen groep (6)**

- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.md) (fase 2) — `INTUNE-BASE-202-DMicrosoftEdgeDNSOverHTTPSAutomatic`
- [`WIN - D - Network Authentication Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.md) (fase 2) — `INTUNE-BASE-204-DNetworkAuthenticationHardening`
- [`WIN - D - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-087-DWindowsHelloForBusiness`
- [`WIN - U - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) (fase 2) — `INTUNE-BASE-114-UWindowsHelloForBusiness`
- [`IOS - D - Enterprise SSO`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) (fase 3) — `INTUNE-BASE-188-IOSDEnterpriseSSO`
- [`WIN - D - Windows Hello for Business Multi User`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md) (fase 4) — `INTUNE-BASE-113-DWindowsHelloForBusinessMultiUser`

**Alternatief, niet uitgerold (1)**: `WIN - D - Microsoft Edge DNS over HTTPS Secure`

**Bewijsroute.** TEST Policies Platform toetst 3 checkId's: `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity`, `INTUNE-BASE-076-DPasswordless`, `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust`.

**Organisatorisch nodig**

- Besluit over toegestane MFA-methoden en uitzonderingen
- Registratieproces voor authenticatiemethoden (TAP-uitgifte)
- Beveiligde noodcommunicatie buiten de eigen tenant (bijvoorbeeld bij tenantuitval)

## CIS Controls v8.1

CIS Controls v8.1 (juni 2024). IG is de laagste Implementation Group waarin de safeguard zit (IG2 omvat IG1).
Benchmark-verwijzingen (CIS Microsoft Windows 11, Apple macOS, iOS, Android) staan per policy in `bron` en `bewijs`.

### 1 Inventory and Control of Enterprise Assets

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **1.1** Establish and Maintain Detailed Enterprise Asset Inventory | IG1 | technisch | ◐ Alleen pilot, wacht of eigen groep | `WIN - D - Enrollment Hardening`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **1.2** Address Unauthorized Assets | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **1.3** Utilize an Active Discovery Tool | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **1.4** Use Dynamic Host Configuration Protocol (DHCP) Logging to Update Enterprise Asset Inventory | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **1.5** Use a Passive Asset Discovery Tool | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 2 Inventory and Control of Software Assets

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **2.1** Establish and Maintain a Software Inventory | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **2.2** Ensure Authorized Software is Currently Supported | IG1 | technisch | ◐ Alleen pilot, wacht of eigen groep | `MAC - U - Compliance OS Version`, `WIN - U - Compliance OS Version` |
| **2.3** Address Unauthorized Software | IG1 | technisch | ◐ Alleen pilot, wacht of eigen groep | `WIN - D - Printing Hardening`, `AND - U - Compliance Device Health` |
| **2.4** Utilize Automated Software Inventory Tools | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **2.5** Allowlist Authorized Software | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Firewall and Gatekeeper`, `MAC - D - Restrictions Hardening`, `IOS - D - Restrictions Corporate` |
| **2.6** Allowlist Authorized Libraries | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **2.7** Allowlist Authorized Scripts | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 3 Data Protection

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **3.1** Establish and Maintain a Data Management Process | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **3.2** Establish and Maintain a Data Inventory | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **3.3** Configure Data Access Control Lists | IG1 | technisch | ● Afgedekt (fase 1) | `IOS - U - App Protection`, `WIN - U - File Sharing Restrictions`, `IOS - D - Data Protection`, `MAC - D - External Storage Read Only` |
| **3.4** Enforce Data Retention | IG1 | technisch | ◐ Alleen pilot, wacht of eigen groep | `WIN - D - Windows AI Recall Boundaries` |
| **3.5** Securely Dispose of Data | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **3.6** Encrypt Data on End-User Devices | IG1 | technisch | ● Afgedekt (fase 1) | `AND - U - App Protection`, `MAC - U - Compliance Device Security`, `WIN - D - BitLocker`, `WIN - U - Compliance BitLocker`, `WIN - U - Personal Data Encryption`, `MAC - D - FileVault` en 3 meer |
| **3.7** Establish and Maintain a Data Classification Scheme | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **3.8** Document Data Flows | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **3.9** Encrypt Data on Removable Media | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **3.10** Encrypt Sensitive Data in Transit | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Microsoft Edge Security`, `WIN - D - Cryptography`, `WIN - D - Microsoft Edge DNS over HTTPS Automatic`, `WIN - D - Microsoft Edge DNS over HTTPS Secure` |
| **3.11** Encrypt Sensitive Data at Rest | IG2 | technisch | ● Afgedekt (fase 1) | `IOS - U - App Protection`, `WIN - D - BitLocker`, `WIN - U - Personal Data Encryption`, `MAC - D - FileVault`, `IOS - D - Data Protection` |
| **3.12** Segment Data Processing and Storage Based on Sensitivity | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **3.13** Deploy a Data Loss Prevention Solution | IG3 | technisch | ◐ Alleen pilot, wacht of eigen groep | `AND - U - Corporate AI Restricted`, `AND - U - Corporate Data Protection` |
| **3.14** Log Sensitive Data Access | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 4 Secure Configuration of Enterprise Assets and Software

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **4.1** Establish and Maintain a Secure Configuration Process | IG1 | organisatorisch | ● Afgedekt (fase 1) | `WIN - D - Config Refresh`, `WIN - D - Internet Explorer Legacy`, `WIN - D - Legacy Hardening`, `WIN - D - Local Security Policies`, `WIN - D - Login and Lock Screen`, `WIN - D - Microsoft Edge Security` en 24 meer |
| **4.2** Establish and Maintain a Secure Configuration Process for Network Infrastructure | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **4.3** Configure Automatic Session Locking on Enterprise Assets | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - U - Compliance Password`, `WIN - D - Device Lock`, `WIN - D - Power Management`, `MAC - D - Passcode and Screen Lock`, `MAC - D - Screensaver`, `AND - U - Compliance Corporate Password` en 5 meer |
| **4.4** Implement and Manage a Firewall on Servers | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **4.5** Implement and Manage a Firewall on End-User Devices | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - D - Firewall and Gatekeeper`, `MAC - U - Compliance Device Security`, `WIN - D - Windows Firewall`, `WIN - D - Windows Firewall Rules`, `WIN - U - Compliance Firewall` |
| **4.6** Securely Manage Enterprise Assets and Software | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **4.7** Manage Default Accounts on Enterprise Assets and Software | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - D - Accounts and Login`, `WIN - D - Local Security Policies`, `WIN - D - Windows LAPS`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **4.8** Uninstall or Disable Unnecessary Services on Enterprise Assets and Software | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Restrictions`, `WIN - D - Legacy Hardening`, `WIN - D - Privacy and Telemetry`, `WIN - D - Security Hardening`, `WIN - D - Windows Feature Configuration`, `WIN - D - Windows Sandbox` en 12 meer |
| **4.9** Configure Trusted DNS Servers on Enterprise Assets | IG2 | technisch | ◐ Alleen pilot, wacht of eigen groep | `WIN - D - Microsoft Edge DNS over HTTPS Automatic`, `WIN - D - Microsoft Edge DNS over HTTPS Secure` |
| **4.10** Enforce Automatic Device Lockout on Portable End-User Devices | IG2 | technisch | ◐ Alleen pilot, wacht of eigen groep | `WIN - D - Account Lockout`, `AND - U - Corporate Device Security`, `AND - U - Work Profile Restrictions`, `IOS - D - Passcode` |
| **4.11** Enforce Remote Wipe Capability on Portable End-User Devices | IG2 | technisch | ● Afgedekt (fase 1) | `AND - U - App Protection`, `IOS - U - App Protection` |
| **4.12** Separate Enterprise Workspaces on Mobile End-User Devices | IG3 | technisch | ● Afgedekt (fase 1) | `AND - U - App Protection`, `AND - U - Corporate Device Security`, `AND - U - Work Profile Restrictions` |

### 5 Account Management

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **5.1** Establish and Maintain an Inventory of Accounts | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **5.2** Use Unique Passwords | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - D - Microsoft Edge Password Management`, `WIN - D - Windows LAPS`, `WIN - U - Microsoft Edge Password Management`, `MAC - D - Recovery Lock` |
| **5.3** Disable Dormant Accounts | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **5.4** Restrict Administrator Privileges to Dedicated Administrator Accounts | IG1 | technisch | ● Afgedekt (fase 1) | `WIN - D - Local Administrators`, `WIN - D - Administrator Protection`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **5.5** Establish and Maintain an Inventory of Service Accounts | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **5.6** Centralize Account Management | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Platform SSO`, `WIN - D - Microsoft Accounts` |

### 6 Access Control Management

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **6.1** Establish an Access Granting Process | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **6.2** Establish an Access Revoking Process | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **6.3** Require MFA for Externally-Exposed Applications | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **6.4** Require MFA for Remote Network Access | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **6.5** Require MFA for Administrative Access | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **6.6** Establish and Maintain an Inventory of Authentication and Authorization Systems | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **6.7** Centralize Access Control | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Platform SSO`, `IOS - D - Enterprise SSO`, `MAC - D - Azure Files Cloud Kerberos` |
| **6.8** Define and Maintain Role-Based Access Control | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 7 Continuous Vulnerability Management

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **7.1** Establish and Maintain a Vulnerability Management Process | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **7.2** Establish and Maintain a Remediation Process | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **7.3** Perform Automated Operating System Patch Management | IG1 | technisch | ● Afgedekt (fase 1) | `WIN - D - Automatic Restart Sign-On`, `WIN - D - Windows Update Ring 3 Production`, `MAC - D - Software Updates`, `AND - D - System Updates`, `AND - U - Compliance Corporate Device Health`, `AND - U - Compliance Device Health` en 4 meer |
| **7.4** Perform Automated Application Patch Management | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - D - Microsoft AutoUpdate`, `MAC - U - Microsoft Edge Updates`, `WIN - D - Microsoft Edge Updates`, `WIN - D - Microsoft Office Updates`, `MAC - D - Software Updates`, `AND - U - Corporate Device Security` |
| **7.5** Perform Automated Vulnerability Scans of Internal Enterprise Assets | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **7.6** Perform Automated Vulnerability Scans of Externally-Exposed Enterprise Assets | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **7.7** Remediate Detected Vulnerabilities | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |

### 8 Audit Log Management

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **8.1** Establish and Maintain an Audit Log Management Process | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **8.2** Collect Audit Logs | IG1 | technisch | ● Afgedekt (fase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Audit Policy Enforcement`, `WIN - D - Windows Firewall`, `WIN - D - Security Log Monitoring` |
| **8.3** Ensure Adequate Audit Log Storage | IG1 | technisch | ● Afgedekt (fase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Security Log Monitoring` |
| **8.4** Standardize Time Synchronization | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Time Server`, `WIN - D - Timezone` |
| **8.5** Collect Detailed Audit Logs | IG2 | technisch | ● Afgedekt (fase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Audit Policy Enforcement`, `WIN - D - Logging` |
| **8.6** Collect DNS Query Audit Logs | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **8.7** Collect URL Request Audit Logs | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **8.8** Collect Command-Line Audit Logs | IG2 | technisch | ● Afgedekt (fase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Logging`, `WIN - D - Security Hardening`, `WIN - D - Security Log Monitoring` |
| **8.9** Centralize Audit Logs | IG2 | technisch | ◐ Alleen pilot, wacht of eigen groep | `WIN - D - Windows Event Forwarding` |
| **8.10** Retain Audit Logs | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **8.11** Conduct Audit Log Reviews | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **8.12** Collect Service Provider Logs | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 9 Email and Web Browser Protections

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **9.1** Ensure Use of Only Fully Supported Browsers and Email Clients | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - U - Microsoft Edge Updates`, `WIN - D - Microsoft Edge Updates` |
| **9.2** Use DNS Filtering Services | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **9.3** Maintain and Enforce Network-Based URL Filters | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Microsoft Edge Security`, `IOS - D - Defender for Endpoint Onboarding Supervised`, `IOS - D - Defender for Endpoint Onboarding Unsupervised` |
| **9.4** Restrict Unnecessary or Unauthorized Browser and Email Client Extensions | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - U - Microsoft Edge Extensions`, `WIN - U - Microsoft Edge Extensions` |
| **9.5** Implement DMARC | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **9.6** Block Unnecessary File Types | IG2 | technisch | ● Afgedekt (fase 1) | `WIN - D - Microsoft Edge Security`, `WIN - U - Microsoft Office Security`, `WIN - D - Script File Associations` |
| **9.7** Deploy and Maintain Email Server Anti-Malware Protections | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 10 Malware Defenses

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **10.1** Deploy and Maintain Anti-Malware Software | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - D - Defender Antivirus`, `MAC - D - Defender for Endpoint`, `MAC - D - Firewall and Gatekeeper`, `MAC - D - Microsoft Edge Security`, `WIN - D - Defender Additional Configuration`, `WIN - D - Defender Antivirus` en 14 meer |
| **10.2** Configure Automatic Anti-Malware Signature Updates | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - D - Defender Antivirus`, `WIN - D - Defender Antivirus`, `WIN - D - Defender Update Ring 3 Production`, `WIN - U - Compliance Defender Security Intelligence`, `WIN - D - Defender Update Ring 1 Pilot`, `WIN - D - Defender Update Ring 2 UAT` |
| **10.3** Disable Autorun and Autoplay for Removable Media | IG1 | technisch | ● Afgedekt (fase 1) | `WIN - D - Security Hardening` |
| **10.4** Configure Automatic Anti-Malware Scanning of Removable Media | IG2 | technisch | ● Afgedekt (fase 1) | `WIN - D - Defender Antivirus`, `WIN - D - Defender AV Policy` |
| **10.5** Enable Anti-Exploitation Features | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - U - Compliance Device Health`, `WIN - D - Attack Surface Reduction`, `WIN - D - Defender Additional Configuration`, `WIN - D - Microsoft Edge Security`, `WIN - D - Microsoft Office Security`, `WIN - D - Threat Protection` en 5 meer |
| **10.6** Centrally Manage Anti-Malware Software | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Defender Antivirus`, `WIN - D - Defender Additional Configuration`, `WIN - D - Defender Antivirus`, `WIN - D - Defender Security Experience`, `WIN - D - Threat Protection`, `WIN - D - Defender AV Policy` |
| **10.7** Use Behavior-Based Anti-Malware Software | IG2 | technisch | ● Afgedekt (fase 1) | `WIN - D - Defender Antivirus`, `WIN - D - Defender Ransomware Protection`, `WIN - D - Defender AV Policy` |

### 11 Data Recovery

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **11.1** Establish and Maintain a Data Recovery Process | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **11.2** Perform Automated Backups | IG1 | technisch | ● Afgedekt (fase 1) | `MAC - U - Microsoft OneDrive KFM`, `WIN - D - Microsoft OneDrive`, `WIN - D - Settings Sync` |
| **11.3** Protect Recovery Data | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **11.4** Establish and Maintain an Isolated Instance of Recovery Data | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **11.5** Test Data Recovery | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |

### 12 Network Infrastructure Management

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **12.1** Ensure Network Infrastructure is Up-to-Date | IG1 | technisch | ○ Geen technische maatregel in de baseline | — |
| **12.2** Establish and Maintain a Secure Network Architecture | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **12.3** Securely Manage Network Infrastructure | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **12.4** Establish and Maintain Architecture Diagram(s) | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **12.5** Centralize Network Authentication, Authorization, and Auditing (AAA) | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **12.6** Use of Secure Network Management and Communication Protocols | IG2 | technisch | ● Afgedekt (fase 1) | `WIN - D - Remote Desktop and RPC` |
| **12.7** Ensure Remote Devices Utilize a VPN and are Connecting to an Enterprise's AAA Infrastructure | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **12.8** Establish and Maintain Dedicated Computing Resources for All Administrative Work | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 13 Network Monitoring and Defense

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **13.1** Centralize Security Event Alerting | IG2 | technisch | ● Afgedekt (fase 1) | `WIN - D - Defender EDR Policy`, `WIN - U - Compliance Defender for Endpoint Risk`, `WIN - D - Defender for Endpoint EDR` |
| **13.2** Deploy a Host-Based Intrusion Detection Solution | IG2 | technisch | ● Afgedekt (fase 1) | `MAC - D - Defender for Endpoint`, `WIN - D - Defender EDR Policy`, `WIN - D - Defender for Endpoint EDR` |
| **13.3** Deploy a Network Intrusion Detection Solution | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.4** Perform Traffic Filtering Between Network Segments | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.5** Manage Access Control for Remote Assets | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.6** Collect Network Traffic Flow Logs | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.7** Deploy a Host-Based Intrusion Prevention Solution | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.8** Deploy a Network Intrusion Prevention Solution | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.9** Deploy Port-Level Access Control | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.10** Perform Application Layer Filtering | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |
| **13.11** Tune Security Event Alerting Thresholds | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 14 Security Awareness and Skills Training

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **14.1** Establish and Maintain a Security Awareness Program | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.2** Train Workforce Members to Recognize Social Engineering Attacks | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.3** Train Workforce Members on Authentication Best Practices | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.4** Train Workforce on Data Handling Best Practices | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.5** Train Workforce Members on Causes of Unintentional Data Exposure | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.6** Train Workforce Members on Recognizing and Reporting Security Incidents | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.7** Train Workforce on How to Identify and Report if Their Enterprise Assets are Missing Security Updates | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.8** Train Workforce on the Dangers of Connecting to and Transmitting Enterprise Data Over Insecure Networks | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **14.9** Conduct Role-Specific Security Awareness and Skills Training | IG2 | organisatorisch | ▢ Organisatorisch | — |

### 16 Application Software Security

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **16.1** Establish and Maintain a Secure Application Development Process | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **16.2** Establish and Maintain a Process to Accept and Address Software Vulnerabilities | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **16.3** Perform Root Cause Analysis on Security Vulnerabilities | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.4** Establish and Manage an Inventory of Third-Party Software Components | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.5** Use Up-to-Date and Trusted Third-Party Software Components | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.6** Establish and Maintain a Severity Rating System and Process for Application Vulnerabilities | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **16.7** Use Standard Hardening Configuration Templates for Application Infrastructure | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.8** Separate Production and Non-Production Systems | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.9** Train Developers in Application Security Concepts and Secure Coding | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.10** Apply Secure Design Principles in Application Architectures | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.11** Leverage Vetted Modules or Services for Application Security Components | IG2 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.12** Implement Code-Level Security Checks | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.13** Conduct Application Penetration Testing | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |
| **16.14** Conduct Threat Modeling | IG3 | technisch | ○ Geen technische maatregel in de baseline | — |

### 17 Incident Response Management

| Safeguard | IG | Soort | Status | Policies |
|---|---|---|---|---|
| **17.1** Designate Personnel to Manage Incident Handling | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **17.2** Establish and Maintain Contact Information for Reporting Security Incidents | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **17.3** Establish and Maintain an Enterprise Process for Reporting Incidents | IG1 | organisatorisch | ▢ Organisatorisch | — |
| **17.4** Establish and Maintain an Incident Response Process | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **17.5** Assign Key Roles and Responsibilities | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **17.6** Define Mechanisms for Communicating During Incident Response | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **17.7** Conduct Routine Incident Response Exercises | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **17.8** Conduct Post-Incident Reviews | IG2 | organisatorisch | ▢ Organisatorisch | — |
| **17.9** Establish and Maintain Security Incident Thresholds | IG3 | organisatorisch | ▢ Organisatorisch | — |

## NIST CSF 2.0

NIST Cybersecurity Framework 2.0 (februari 2024). Alleen de subcategorieën die voor endpoint en identiteit relevant zijn. Govern
is per definitie organisatorisch: geen policy vult het in, deze baseline is hooguit een uitvoering ervan.

### GV — Govern (besturen)

| Subcategorie | Omschrijving | Status | Policies |
|---|---|---|---|
| **GV.OC-03** | Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed | ▢ Organisatorisch | — |
| **GV.RM-01** | Risk management objectives are established and agreed to by organizational stakeholders | ▢ Organisatorisch | — |
| **GV.RR-02** | Roles, responsibilities, and authorities related to cybersecurity risk management are established and communicated | ▢ Organisatorisch | — |
| **GV.PO-01** | Policy for managing cybersecurity risks is established, communicated, and enforced | ▢ Organisatorisch | — |
| **GV.PO-02** | Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced | ▢ Organisatorisch | — |
| **GV.OV-01** | Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy | ▢ Organisatorisch | — |
| **GV.SC-01** | A cybersecurity supply chain risk management program is established and agreed to | ▢ Organisatorisch | — |
| **GV.SC-05** | Requirements to address cybersecurity risks in supply chains are established and integrated into contracts | ▢ Organisatorisch | — |

### ID — Identify (identificeren)

| Subcategorie | Omschrijving | Status | Policies |
|---|---|---|---|
| **ID.AM-01** | Inventories of hardware managed by the organization are maintained | ◐ Alleen pilot, wacht of eigen groep | `WIN - D - Enrollment Hardening`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **ID.AM-02** | Inventories of software, services, and systems managed by the organization are maintained | ○ Geen technische maatregel in de baseline | — |
| **ID.AM-08** | Systems, hardware, software, services, and data are managed throughout their life cycles | ○ Geen technische maatregel in de baseline | — |
| **ID.RA-01** | Vulnerabilities in assets are identified, validated, and recorded | ◐ Alleen pilot, wacht of eigen groep | `MAC - D - Software Updates`, `IOS - D - Software Updates` |
| **ID.RA-02** | Cyber threat intelligence is received from information sharing forums and sources | ○ Geen technische maatregel in de baseline | — |
| **ID.RA-07** | Changes and exceptions are managed, assessed for risk impact, recorded, and tracked | ○ Geen technische maatregel in de baseline | — |
| **ID.IM-01** | Improvements are identified from evaluations | ○ Geen technische maatregel in de baseline | — |

### PR — Protect (beschermen)

| Subcategorie | Omschrijving | Status | Policies |
|---|---|---|---|
| **PR.AA-01** | Identities and credentials for authorized users, services, and hardware are managed | ● Afgedekt (fase 1) | `MAC - D - Microsoft Edge Password Management`, `MAC - D - Platform SSO`, `WIN - D - Enhanced Phishing Protection`, `WIN - D - Microsoft Accounts`, `WIN - D - Windows LAPS`, `WIN - U - Microsoft Edge Password Management` en 5 meer |
| **PR.AA-02** | Identities are proofed and bound to credentials based on the context of interactions | ○ Geen technische maatregel in de baseline | — |
| **PR.AA-03** | Users, services, and hardware are authenticated | ● Afgedekt (fase 1) | `AND - U - App Protection`, `IOS - U - App Protection`, `MAC - D - Accounts and Login`, `MAC - D - Platform SSO`, `MAC - U - Compliance Password`, `WIN - D - Device Lock` en 21 meer |
| **PR.AA-04** | Identity assertions are protected, conveyed, and verified | ● Afgedekt (fase 1) | `WIN - D - Windows Hello Cloud Kerberos Trust`, `WIN - D - Disable NTLM`, `MAC - D - Azure Files Cloud Kerberos` |
| **PR.AA-05** | Access permissions, entitlements, and authorizations are defined, managed, enforced, and reviewed (least privilege, separation of duties) | ● Afgedekt (fase 1) | `WIN - D - Local Administrators`, `WIN - D - Local Security Policies`, `WIN - D - User Rights`, `WIN - D - Windows LAPS`, `MAC - D - Recovery Lock`, `WIN - D - Administrator Protection` en 6 meer |
| **PR.AT-01** | Personnel are provided with awareness and training | ○ Geen technische maatregel in de baseline | — |
| **PR.DS-01** | The confidentiality, integrity, and availability of data-at-rest are protected | ● Afgedekt (fase 1) | `AND - U - App Protection`, `IOS - U - App Protection`, `MAC - U - Compliance Device Security`, `WIN - D - BitLocker`, `WIN - D - Windows AI Restricted`, `WIN - U - Compliance BitLocker` en 12 meer |
| **PR.DS-02** | The confidentiality, integrity, and availability of data-in-transit are protected | ● Afgedekt (fase 1) | `MAC - D - Restrictions`, `MAC - U - Microsoft Edge Profiles and Sync`, `WIN - D - AI Tooling`, `WIN - D - Data Minimisation`, `WIN - D - Privacy and Telemetry`, `WIN - D - Remote Desktop and RPC` en 13 meer |
| **PR.DS-10** | The confidentiality, integrity, and availability of data-in-use are protected | ● Afgedekt (fase 1) | `AND - U - App Protection`, `AND - U - Corporate AI Restricted`, `AND - U - Corporate Data Protection`, `AND - U - Work Profile Restrictions` |
| **PR.DS-11** | Backups of data are created, protected, maintained, and tested | ● Afgedekt (fase 1) | `MAC - U - Microsoft OneDrive KFM`, `WIN - D - Microsoft OneDrive`, `WIN - D - Settings Sync` |
| **PR.PS-01** | Configuration management practices are established and applied | ● Afgedekt (fase 1) | `MAC - D - Accounts and Login`, `MAC - D - Microsoft Edge Security`, `MAC - D - Microsoft Office`, `MAC - D - Microsoft OneDrive`, `MAC - D - Restrictions`, `WIN - D - Cloud Optimized Content` en 53 meer |
| **PR.PS-02** | Software is maintained, replaced, and removed commensurate with risk | ● Afgedekt (fase 1) | `MAC - D - Microsoft AutoUpdate`, `MAC - U - Microsoft Edge Updates`, `WIN - D - Automatic Restart Sign-On`, `WIN - D - Defender Update Ring 3 Production`, `WIN - D - Microsoft Edge Updates`, `WIN - D - Microsoft Office Updates` en 16 meer |
| **PR.PS-03** | Hardware is maintained, replaced, and removed commensurate with risk | ○ Geen technische maatregel in de baseline | — |
| **PR.PS-04** | Log records are generated and made available for continuous monitoring | ● Afgedekt (fase 1) | `MAC - D - Time Server`, `WIN - D - Audit and Event Logging`, `WIN - D - Audit Policy Enforcement`, `WIN - D - Logging`, `WIN - D - Security Hardening`, `WIN - D - Timezone` en 2 meer |
| **PR.PS-05** | Installation and execution of unauthorized software are prevented | ● Afgedekt (fase 1) | `MAC - D - Firewall and Gatekeeper`, `MAC - U - Microsoft Edge Extensions`, `WIN - D - Attack Surface Reduction`, `WIN - D - Microsoft Edge Security`, `WIN - D - Microsoft Office Security`, `WIN - D - Microsoft Store` en 9 meer |
| **PR.IR-01** | Networks and environments are protected from unauthorized logical access and usage | ● Afgedekt (fase 1) | `MAC - D - Firewall and Gatekeeper`, `WIN - D - Remote Desktop and RPC`, `WIN - D - Windows Firewall`, `WIN - D - Windows Firewall Rules`, `WIN - D - Wireless and Peripherals`, `WIN - D - Network Authentication Hardening` en 4 meer |
| **PR.IR-03** | Mechanisms are implemented to achieve resilience requirements in normal and adverse situations | ● Afgedekt (fase 1) | `WIN - D - Business Continuity`, `MAC - D - Wifi Guest`, `WIN - D - Wifi Guest` |
| **PR.IR-04** | Adequate resource capacity to ensure availability is maintained | ● Afgedekt (fase 1) | `WIN - D - Delivery Optimisation`, `WIN - D - Endpoint Analytics`, `WIN - D - Storage Sense` |

### DE — Detect (detecteren)

| Subcategorie | Omschrijving | Status | Policies |
|---|---|---|---|
| **DE.CM-01** | Networks and network services are monitored to find potentially adverse events | ◐ Alleen pilot, wacht of eigen groep | `IOS - D - Defender for Endpoint Onboarding Supervised`, `IOS - D - Defender for Endpoint Onboarding Unsupervised` |
| **DE.CM-03** | Personnel activity and technology usage are monitored to find potentially adverse events | ○ Geen technische maatregel in de baseline | — |
| **DE.CM-09** | Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events | ● Afgedekt (fase 1) | `MAC - D - Defender Antivirus`, `MAC - D - Defender for Endpoint`, `MAC - D - Microsoft Edge Security`, `MAC - U - Compliance Device Health`, `MAC - U - Compliance Device Security`, `MAC - U - Compliance Password` en 34 meer |
| **DE.AE-02** | Potentially adverse events are analyzed to better understand associated activities | ● Afgedekt (fase 1) | `WIN - D - Defender EDR Policy`, `WIN - D - Defender for Endpoint EDR` |
| **DE.AE-03** | Information is correlated from multiple sources | ○ Geen technische maatregel in de baseline | — |
| **DE.AE-06** | Information on adverse events is provided to authorized staff and tools | ○ Geen technische maatregel in de baseline | — |

### RS — Respond (reageren)

| Subcategorie | Omschrijving | Status | Policies |
|---|---|---|---|
| **RS.MA-01** | The incident response plan is executed in coordination with relevant third parties once an incident is declared | ○ Geen technische maatregel in de baseline | — |
| **RS.MA-02** | Incident reports are triaged and validated | ○ Geen technische maatregel in de baseline | — |
| **RS.AN-03** | Analysis is performed to establish what has taken place during an incident and the root cause | ○ Geen technische maatregel in de baseline | — |
| **RS.AN-07** | Incident data and metadata are collected, and their integrity and provenance are preserved | ○ Geen technische maatregel in de baseline | — |
| **RS.CO-02** | Internal and external stakeholders are notified of incidents | ○ Geen technische maatregel in de baseline | — |
| **RS.MI-01** | Incidents are contained | ● Afgedekt (fase 1) | `WIN - D - Defender Antivirus`, `WIN - D - Defender Ransomware Protection`, `AND - U - Compliance Corporate Defender for Endpoint`, `AND - U - Compliance Defender for Endpoint`, `WIN - U - Compliance Defender for Endpoint Risk` |
| **RS.MI-02** | Incidents are eradicated | ○ Geen technische maatregel in de baseline | — |

### RC — Recover (herstellen)

| Subcategorie | Omschrijving | Status | Policies |
|---|---|---|---|
| **RC.RP-01** | The recovery portion of the incident response plan is executed once initiated from the incident response process | ○ Geen technische maatregel in de baseline | — |
| **RC.RP-02** | Recovery actions are selected, scoped, prioritized, and performed | ● Afgedekt (fase 1) | `WIN - D - Business Continuity` |
| **RC.RP-03** | The integrity of backups and other restoration assets is verified before using them for restoration | ○ Geen technische maatregel in de baseline | — |
| **RC.RP-05** | The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed | ○ Geen technische maatregel in de baseline | — |
| **RC.CO-03** | Recovery activities and progress in restoring operational capabilities are communicated to designated stakeholders | ○ Geen technische maatregel in de baseline | — |

## Klantkeuzes en restrisico's

Wat een managementbesluit vraagt vóór de baseline volledig staat. Elke regel komt uit `faseWaarom`
in het manifest; een besluit hier is een wijziging van de fase in een PR, zodat het besluit en de
uitrol op één plek terug te vinden zijn.

### A. Kies een variant — fase 5, niet uitrollen (12)

Alternatieven voor een policy die wél uitrolt, of klantkeuzes zonder technisch juist antwoord. Twee
varianten tegelijk toewijzen levert in Intune een Conflict op, waarna géén van beide wordt toegepast.

| Policy | Waarom niet uitgerold · samenhang | Normen (ISO) |
|---|---|---|
| [`IOS - D - Apple Intelligence Permitted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.md) | Alternatief van de Restricted-variant, voor een klant die Apple Intelligence op bedrijfstoestellen toestaat. Wijs er één toe, nooit allebei. Samenhang: `IOS - D - Apple Intelligence Restricted`. | A.5.10, A.5.34, A.8.12 |
| [`MAC - D - Apple Intelligence Permitted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.md) | Alternatief van de Restricted-variant, voor een klant die Apple Intelligence op de werkplek toestaat. Wijs er één toe, nooit allebei. Samenhang: `MAC - D - Restrictions`, `MAC - D - Apple Intelligence Restricted`. | A.5.10, A.5.34, A.8.1 |
| [`MAC - D - External Storage Read Only`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.md) | Klantkeuze. Pariteit met [Baseline] - WIN - D - Removable Storage (fase 2, schrijven geblokkeerd, lezen toegestaan) is op macOS niet te maken: bij ReadOnly koppelt macOS lees-schrijfmedia niet alsnog als alleen-lezen — Apple: 'external storage that is read-write will not be mounted read-only'. In de praktijk blokkeert dit dus vrijwel alle USB-sticks en externe schijven, ook om te lezen. Dat is een ander besluit dan op Windows, en daarom geen fase 2. Samenhang: `WIN - D - Removable Storage`. | A.7.10, A.8.12 |
| [`WIN - D - Defender AV Policy`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_AV_Policy.md) | Het CIPP-standaardtemplate naast de OIB-versie, op drie punten losser. De OIB-versie is strenger — deze hoort nergens. Samenhang: `WIN - D - Defender Antivirus`. | A.8.7 |
| [`WIN - D - Defender for Endpoint EDR`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.md) | Draagt het onboarding-token van de tenant waaruit het template is geëxporteerd en werkt dus alleen daar. Voor elke andere tenant is [Baseline] - WIN - D - Defender EDR Policy de policy die uitrolt: zelfde onboarding, via de Defender-connector. Samenhang: `WIN - D - Defender EDR Policy`. | A.8.7, A.8.16 |
| [`WIN - D - Microsoft Edge DNS over HTTPS Secure`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.md) | Alternatief voor de Automatic-variant, alleen voor een organisatie met een eigen of gecontracteerde DoH-resolver (bijvoorbeeld een DNS-filterdienst) die interne namen kan oplossen. Vraagt een tenantspecifieke resolver-URL. Samenhang: `WIN - D - Microsoft Edge DNS over HTTPS Automatic`. | A.8.20, A.8.24 |
| [`WIN - D - Microsoft Edge Search Engine`](IntuneTemplate/WIN/AdministrativeTemplates/Baseline_WIN_D_Microsoft_Edge_Search_Engine.md) | Een klantkeuze, geen beveiligingsinstelling: welke zoekmachine standaard is hoort niet in een generieke baseline. Wijs hem alleen toe als de organisatie dat zo besloten heeft. | A.8.9 |
| [`WIN - D - Windows AI Features Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.md) | Alternatief van de Restricted-variant, voor een klant die generatieve AI op de werkplek toestaat. Wijs er één toe, nooit allebei. Samenhang: `WIN - D - Windows AI Features Restricted`, `WIN - D - Windows AI Restricted`, `WIN - U - AI Usage Control Restricted`. | A.5.10, A.5.34, A.8.1 |
| [`WIN - D - Windows AI Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.md) | Alternatief van de Restricted-variant, voor een klant die Recall en Click To Do toestaat. Wijs er één toe, nooit allebei. Samenhang: `WIN - D - Windows AI Restricted`. | A.5.10, A.5.34, A.8.1 |
| [`WIN - U - AI Usage Control Permitted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.md) | Alternatief van de Restricted-variant, voor een klant die publieke AI-diensten toestaat. Wijs er één toe, nooit allebei. Samenhang: `WIN - U - AI Usage Control Restricted`. | A.5.10, A.5.19, A.8.1, A.8.23 |
| [`WIN - U - Microsoft Outlook Cached Mode Default`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.md) | Alternatief van de Managed-variant, voor een klant die gedeelde mailboxen wél gecachet wil hebben. Wijs er één toe, nooit twee — ze zetten dezelfde instelling en leveren samen een Conflict op. | A.8.9 |
| [`WIN - U - Microsoft Outlook Cached Mode Off`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.md) | Alternatief van de Managed-variant, voor gedeelde apparaten zonder bewaard profiel. Wijs er één toe, nooit twee — ze zetten dezelfde instelling met een andere waarde en leveren samen een Conflict op, waarna géén van beide wordt toegepast. | A.8.1, A.8.9 |

### B. Eigen groep — fase 4 (16)

Hoort op een specifieke groep. Besluit: bestaat die groep, wie zit erin, en wie beheert het lidmaatschap.

| Policy | Groep · waarom | Normen (ISO) |
|---|---|---|
| [`AND - D - Compliance Dedicated Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) | **SEC-Android-Dedicated (dynamische apparaatgroep op het enrollmentProfileName van de dedicated inschrijfprofielen, of een toewijzing met filter — zie extras/android/assignment-filters)** — Dedicated toestellen hebben geen gebruiker; een gebruikerstoewijzing bereikt ze niet. Hoort op een apparaatgroep met alleen dedicated toestellen. | A.8.1, A.8.8, A.8.24 |
| [`IOS - D - Defender for Endpoint Onboarding Supervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.md) | **SEC-iOS-Corporate (dynamische apparaatgroep: iPhone/iPad met deviceOwnership Company, via ADE ingeschreven en supervised — regel in extras/ios/README.md)** — Alleen supervised toestellen; niet-supervised toestellen krijgen de VPN-variant. Vraagt daarnaast een Defender for Endpoint-licentie, de connector en de Defender-app als vereiste (VPP-)app. | A.8.7, A.8.23 |
| [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.md) | **SEC-iOS-BYOD (dynamische apparaatgroep: ingeschreven iPhone/iPad met deviceOwnership Personal, dus niet supervised — regel in extras/ios/README.md)** — Alleen niet-supervised (persoonlijk ingeschreven) toestellen; supervised toestellen krijgen het content filter. Vraagt daarnaast een Defender for Endpoint-licentie, de connector en de Defender-app. | A.8.7, A.8.23 |
| [`IOS - D - Lock Screen`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.md) | **SEC-iOS-Corporate (dynamische apparaatgroep: iPhone/iPad met deviceOwnership Company, via ADE ingeschreven en supervised — regel in extras/ios/README.md)** — Alleen voor bedrijfstoestellen, en de tekst moet per organisatie worden ingevuld vóór toewijzing (placeholder VERLOREN-TOESTEL-TEKST-INVULLEN). | A.7.9, A.8.1 |
| [`IOS - D - Restrictions Corporate`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) | **SEC-iOS-Corporate (dynamische apparaatgroep: iPhone/iPad met deviceOwnership Company, via ADE ingeschreven en supervised — regel in extras/ios/README.md)** — Vrijwel alle instellingen vragen een supervised toestel (ADE); op een persoonlijk toestel zijn ze ongepast of doen ze niets. Na toewijzing kan de gebruiker het toestel niet meer zelf wissen — terugzetten gaat via Intune. | A.7.7, A.8.1, A.8.9, A.8.19, A.8.20 |
| [`MAC - D - Enrollment Profile Administrator User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md) | **ADE-token (kies één van de twee profielen per token — een macOS-inschrijfprofiel wordt aan een ADE-token gekoppeld, niet aan een Entra-groep)** — Alternatief van het standaard-inschrijfprofiel; ze verschillen in precies één instelling. Vergrendelde inschrijving is achteraf alleen met een wipe terug te draaien. | A.5.9, A.8.1, A.8.2 |
| [`MAC - D - Enrollment Profile Standard User Affinity`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) | **ADE-token (kies één van de twee profielen per token — een macOS-inschrijfprofiel wordt aan een ADE-token gekoppeld, niet aan een Entra-groep)** — Alternatief van het beheerders-inschrijfprofiel; ze verschillen in precies één instelling. | A.5.9, A.8.1, A.8.2 |
| [`MAC - D - Privacy Preferences`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.md) | **SEC-Remote-Support-macOS (Macs waarop NinjaOne of TeamViewer draait)** — Hoort bij twee specifieke remote-supporttools, NinjaOne en TeamViewer, en niet bij elke organisatie. Toewijzen op een Mac zonder die tools doet niets; toewijzen waar een andere TeamViewer-installatie staat geeft die wél rechten zonder dat iemand iets goedkeurt. Gebruikt de organisatie andere tools, vervang dan de bundle-id's en code requirements in plaats van deze policy toe te wijzen. | A.8.18 |
| [`MAC - D - Screen Recording`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Screen_Recording.md) | **SEC-Remote-Support-macOS (Macs waarop NinjaOne of TeamViewer draait)** — Hoort bij twee specifieke remote-supporttools, NinjaOne en TeamViewer, en niet bij elke organisatie. Toewijzen op een Mac zonder die tools doet niets; toewijzen waar een andere TeamViewer-installatie staat geeft die wél rechten zonder dat iemand iets goedkeurt. Gebruikt de organisatie andere tools, vervang dan de bundle-id's en code requirements in plaats van deze policy toe te wijzen. | A.8.18 |
| [`WIN - D - Defender ASR Policy Audit Mode`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.md) | **SEC-Baseline-Pilot** — Pilotgroep, en dan zónder de blokkerende ASR-policy — dezelfde zestien regels op audit in plaats van block. | A.8.7, A.8.16 |
| [`WIN - D - Defender Update Ring 1 Pilot`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.md) | **SEC-Update-Ring1** — Pilotgroep voor Defender-updates. | A.8.7, A.8.8, A.8.32 |
| [`WIN - D - Defender Update Ring 2 UAT`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.md) | **SEC-Update-Ring2** — UAT-groep voor Defender-updates. | A.8.7, A.8.8, A.8.32 |
| [`WIN - D - Windows Hello for Business Multi User`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md) | **SEC-Shared-Devices** — Gedeelde apparaten. De enige die je náást zijn tegenhanger kunt toewijzen: de vier overlappende instellingen staan op dezelfde waarde. | A.5.17, A.8.5 |
| [`WIN - D - Windows Update Ring 1 Pilot`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.md) | **SEC-Update-Ring1** — Pilotgroep voor Windows-updates. | A.8.8, A.8.32 |
| [`WIN - D - Windows Update Ring 2 UAT`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.md) | **SEC-Update-Ring2** — UAT-groep voor Windows-updates. | A.8.8, A.8.32 |
| [`WIN - D - Wireless Shared Devices`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.md) | **SEC-Shared-Devices** — Gedeelde apparaten. Op een laptop van één gebruiker maakt dit thuiswerken en hotels onmogelijk. | A.8.1, A.8.20 |

### C. Wacht op een voorwaarde — fase 3 (26)

Klaar, maar doet pas iets als aan de voorwaarde is voldaan. Besluit: wie zorgt daarvoor en wanneer.

| Policy | Voorwaarde | Normen (ISO) |
|---|---|---|
| [`AND - D - System Updates`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_D_System_Updates.md) | Wacht op de eerste fully managed-, corporate-owned work profile- of dedicated inschrijving. Wijs toe aan een apparaatgroep of met een filter op eigendom Corporate; op een pilotgroep eerst zien of toestellen 's nachts aan en geladen blijven. | A.8.8 |
| [`AND - U - Compliance Block Device Administrator`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md) | Doet alleen iets op een tenant waar nog device administrator-toestellen staan of waar die inschrijving niet is geblokkeerd. Zie extras/android/enrollment-restrictions voor het dichtzetten van die inschrijving; deze policy ruimt op wat er al staat. | A.8.1, A.8.9 |
| [`AND - U - Compliance Corporate Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md) | Wacht op een fully managed- of corporate-owned work profile-inschrijving én op een Defender for Endpoint-licentie, de connector met Android aan en de Defender-app via Managed Google Play. | A.8.7, A.8.16 |
| [`AND - U - Compliance Corporate Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md) | Wacht op de eerste fully managed- of corporate-owned work profile-inschrijving; het type `androidDeviceOwnerCompliancePolicy` raakt geen enkel ander toestel. | A.8.1, A.8.7, A.8.8 |
| [`AND - U - Compliance Corporate Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md) | Wacht op de eerste fully managed- of corporate-owned work profile-inschrijving. | A.5.17, A.8.5, A.8.24 |
| [`AND - U - Compliance Defender for Endpoint`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md) | Wacht op drie voorwaarden: een Defender for Endpoint-licentie, de Defender–Intune-connector met Android aan, en de Defender-app uitgerold via Managed Google Play. Zonder die drie wordt elk toestel niet-compliant. | A.8.7, A.8.16 |
| [`AND - U - Compliance Device Health`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) | Wacht op de eerste inschrijving met persoonlijk werkprofiel. Een compliance-policy raakt alleen een ingeschreven toestel; zolang Android alleen via App Protection zonder inschrijving loopt, doet hij niets. | A.8.1, A.8.7, A.8.8, A.8.19 |
| [`AND - U - Compliance Password`](IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.md) | Wacht op de eerste Android-inschrijving. | A.5.17, A.8.1, A.8.5, A.8.24 |
| [`AND - U - Corporate Device Security`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) | Wacht op de eerste fully managed- of corporate-owned work profile-inschrijving. Daarna eerst op een pilotgroep: gebruikers krijgen een nieuwe code, externe opslag en 2G-netwerken zijn weg, en een bestaande Private Space wordt verwijderd. | A.5.17, A.7.7, A.7.10, A.8.1, A.8.5, A.8.7, A.8.8, A.8.12, A.8.17, A.8.20 |
| [`AND - U - Work Profile Restrictions`](IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) | Wacht op de eerste inschrijving met persoonlijk werkprofiel. Daarna eerst op een pilotgroep: gebruikers krijgen bij de eerste keer een extra code voor het werkprofiel en kunnen niet meer kopiëren van werk- naar privé-apps. | A.5.17, A.7.7, A.8.1, A.8.5, A.8.12 |
| [`IOS - D - Apple Intelligence Restricted`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.md) | Wacht op de eerste iOS-inschrijving. Daarnaast een klantbesluit: kies tussen deze en de Permitted-variant, nooit allebei. | A.5.10, A.5.34, A.8.12 |
| [`IOS - D - Data Protection`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.md) | Wacht op de eerste iOS-inschrijving. Gebruikers merken dat 'Openen in' vanuit beheerde apps geen privé-apps meer aanbiedt. | A.8.1, A.8.12, A.8.24 |
| [`IOS - D - Enterprise SSO`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) | Wacht op de eerste iOS-inschrijving én op Microsoft Authenticator op het toestel: Apple accepteert de SSO-extensie alleen via MDM, en zonder Authenticator is er geen plug-in die hem uitvoert. | A.5.17, A.8.5 |
| [`IOS - D - Passcode`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.md) | Wacht op de eerste iOS-inschrijving. Let bij de eerste uitrol op: een gebruiker met een code van vier cijfers of een eenvoudige code moet die bij het volgende ontgrendelen wijzigen. | A.5.17, A.8.1, A.8.5 |
| [`IOS - D - Software Updates`](IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.md) | Wacht op de eerste iOS-inschrijving. Na de deadline installeert het toestel de update zelf om 02:00 en herstart — kondig dat aan en kijk bij de eerste toestellen hoe het valt. | A.8.8, A.8.9 |
| [`IOS - U - Compliance Defender for Endpoint`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) | Wacht op drie voorwaarden: een Defender for Endpoint-licentie voor de gebruiker, de Intune-connector voor Defender for Endpoint met iOS/iPadOS aan, en de Defender-app op het toestel. Wijs hem pas toe als die er zijn — een toestel zonder risicosignaal kan anders, afhankelijk van de connectorinstelling, als niet-compliant uitkomen. | A.5.15, A.8.7, A.8.16 |
| [`IOS - U - Compliance Device Health`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md) | Wacht op de eerste iOS-inschrijving. Een compliance-policy raakt alleen een ingeschreven apparaat; zolang iOS alleen via App Protection zonder inschrijving loopt, doet hij niets. | A.5.15, A.8.1, A.8.7 |
| [`IOS - U - Compliance Password`](IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) | Wacht op de eerste iOS-inschrijving. | A.5.17, A.8.1, A.8.5 |
| [`MAC - D - Azure Files Cloud Kerberos`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.md) | Wacht op een storage account met Entra Kerberos als identity source. Een account dat al op Microsoft Entra Domain Services of AD DS staat — bijvoorbeeld omdat een AVD-omgeving eraan hangt — kan dat niet tegelijk hebben, en omzetten raakt alles wat al op dat account draait. Op een Mac met een geldig cloud-TGT levert zo'n account AADSTS700016 op — de KDC kent geen toepassing voor die fileservice. Het profiel zelf is af en account-onafhankelijk: `Hosts` staat op `.windows.net` en dekt dus elk storage account. Zodra er één is met Entra Kerberos kan dit naar fase 1, met als tweede voorwaarde dat Microsoft de tenant voor de macOS-preview aanzet (azurefiles@microsoft.com). | A.8.5 |
| [`MAC - D - Wifi Corporate`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.md) | SSID en PSK staan op een placeholder. Toewijzen voordat die zijn ingevuld levert een profiel op dat nergens verbinding maakt. Zet de fase op 1 zodra de echte waarden erin staan. | A.8.1, A.8.20, A.8.21 |
| [`MAC - D - Wifi Guest`](IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.md) | SSID en PSK staan op een placeholder. Toewijzen voordat die zijn ingevuld levert een profiel op dat nergens verbinding maakt. Zet de fase op 1 zodra de echte waarden erin staan, en niet eerder dan Wifi Corporate. | A.8.20, A.8.21 |
| [`WIN - D - Wifi Corporate`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.md) | SSID en PSK staan op een placeholder. Toewijzen voordat die zijn ingevuld levert een profiel op dat nergens verbinding maakt. Zet de fase op 1 zodra de echte waarden erin staan. | A.8.1, A.8.20, A.8.21 |
| [`WIN - D - Wifi Guest`](IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.md) | SSID en PSK staan op een placeholder. Toewijzen voordat die zijn ingevuld levert een profiel op dat nergens verbinding maakt. Zet de fase op 1 zodra de echte waarden erin staan, en niet eerder dan Wifi Corporate. | A.8.20, A.8.21 |
| [`WIN - D - Windows AI Recall Boundaries`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.md) | Hoort bij [Baseline] - WIN - D - Windows AI Permitted en doet niets zonder die policy: staat Recall uit, dan valt er ook niets te begrenzen. Wijs hem pas toe als de klant Recall toestaat, en vul dan eerst de app-lijst aan met de programma's die in die omgeving gevoelige gegevens tonen. | A.5.33, A.5.34, A.8.11, A.8.12 |
| [`WIN - D - Windows Event Forwarding`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.md) | Doet niets zonder een Windows Event Collector met bron-geïnitieerde abonnementen die vanaf de apparaten bereikbaar is (VPN, Always On VPN of intern netwerk). Wie logs via Defender for Endpoint, Microsoft Sentinel of de Azure Monitor Agent centraliseert, heeft deze policy niet nodig. | A.8.15, A.8.16 |
| [`WIN - U - Compliance Defender for Endpoint Risk`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) | Wacht op de Microsoft Defender for Endpoint-connector in Intune (Endpoint security → Microsoft Defender for Endpoint → 'Connect Windows devices … to Defender for Endpoint' aan) en op een Defender for Endpoint P1/P2- of Business-licentie. Zonder connector rapporteert elk apparaat 'niet-compliant' of 'niet beschikbaar' op deze toets. | A.5.15, A.8.7, A.8.16 |

### D. Pilot — fase 2 (38)

Merkbaar voor gebruikers of kan iets breken. Besluit: gevolgen accepteren na de pilot en naar fase 1 brengen.
Tot dat besluit is de control die de policy invult niet afgedekt.

| Policy | Gevolg dat geaccepteerd moet worden | Normen (ISO) |
|---|---|---|
| [`AND - U - Corporate AI Restricted`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.md) | Gebruikers verliezen Circle to Search en de schermcontext van Gemini op het werkprofiel of het hele toestel. Of dat past is een klantbesluit over generatieve AI, net als bij Windows AI Restricted; eerst op een pilotgroep, en niet toewijzen bij een klant die deze assistenten toestaat. | A.5.10, A.5.34, A.8.12 |
| [`AND - U - Corporate Data Protection`](IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.md) | Gebruikers merken het meteen: geen schermafdrukken, geen bestanden via Bluetooth, en een fully managed toestel kan niet meer zelf gereset worden — IT moet wissen. Eerst op een pilotgroep; zonder fully managed- of corporate-owned work profile-inschrijving doet hij niets. | A.7.9, A.8.1, A.8.12 |
| [`MAC - D - Apple Intelligence Restricted`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.md) | Gebruikers zien Writing Tools, samenvattingen, Genmoji, Image Playground en de ChatGPT-integratie verdwijnen. Dat is de bedoeling, maar het is zichtbaar en verdient een aankondiging. Kies per klant tussen deze en de Permitted-variant — nooit allebei toewijzen. | A.5.10, A.5.34, A.8.12 |
| [`MAC - D - FileVault`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.md) | Versleutelt de schijf en vraagt de gebruiker daarbij om mee te werken. Controleer in de pilot dat de herstelsleutel ook echt in Intune verschijnt voordat je breed uitrolt. | A.7.9, A.8.1, A.8.24 |
| [`MAC - D - Login Window`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.md) | Gebruikers moeten bij het inlogvenster hun accountnaam typen in plaats van hun naam aan te klikken. Aankondigen. Na een herstart ziet de gebruiker nog steeds de accountlijst van het FileVault-ontgrendelscherm; deze instelling geldt voor het inlogvenster daarna (afmelden, gebruikers wisselen). | A.5.10, A.8.5 |
| [`MAC - D - Passcode and Screen Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) | Gebruikers met een korter of eenvoudiger wachtwoord moeten het bij de eerstvolgende aanmelding wijzigen. | A.5.17, A.7.7, A.8.1, A.8.5 |
| [`MAC - D - Recovery Lock`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.md) | Wie recoveryOS nodig heeft — macOS opnieuw installeren, Schijfhulpprogramma vanuit herstel, een andere opstartschijf — moet voortaan het wachtwoord bij de servicedesk opvragen. Controleer in de pilot dat het wachtwoord in Intune zichtbaar is voordat je breed uitrolt. | A.5.17, A.7.9, A.8.1, A.8.18 |
| [`MAC - D - Restrictions Hardening`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.md) | Een niet-ondertekende app via rechtsklik → Open starten kan niet meer, en een gebruiker kan geen profiel of certificaat meer met de hand installeren (bijvoorbeeld van een VPN-leverancier, een testomgeving of een wifi-portaal). Inventariseer in de pilot wie dat nu doet; die installaties horen voortaan via Intune. | A.5.34, A.8.9, A.8.19 |
| [`MAC - D - Screensaver`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.md) | Wie gewend is het scherm binnen een minuut na de schermbeveiliging zonder wachtwoord terug te krijgen, moet nu direct wachtwoord of Touch ID gebruiken. Merkbaar, niet breekbaar; eerst pilot en aankondigen. | A.7.7, A.8.1, A.8.5 |
| [`MAC - D - Software Updates`](IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.md) | Updates worden automatisch geïnstalleerd en uiterlijk 30 dagen na uitgave afgedwongen met een herstart om 12:30 — ook voor een nieuwe hoofdversie van macOS. Kijk in de pilot hoe het herstartmoment valt en of bedrijfsapps de nieuwe hoofdversie aankunnen. Beta-inschrijving is niet meer mogelijk. | A.8.8, A.8.19 |
| [`MAC - U - Compliance OS Version`](IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md) | Een Mac onder macOS 14 wordt niet-compliant en verliest toegang via Conditional Access. OVERZICHT.md noemt al dat oudere Macs het updateprofiel niet krijgen; deze policy maakt dat zichtbaar in plaats van stil. Kijk eerst hoeveel Macs het raakt. Respijt staat op 72 uur. | A.8.8, A.8.19 |
| [`WIN - D - Access Control`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.md) | Gebruikers moeten hun volledige naam typen in plaats van te klikken, en zien een banner. Pas de bannertekst eerst aan op de eigen organisatienaam. | A.5.15, A.5.17, A.8.5 |
| [`WIN - D - Account Lockout`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.md) | De machine-drempel zet een apparaat na tien mislukte pogingen in BitLocker-herstel. Dat is recoverable (de sleutel staat in Entra ID) maar levert een helpdeskvraag op; kijk in de pilot hoe vaak het gebeurt. | A.5.15, A.5.17, A.8.5 |
| [`WIN - D - Administrator Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.md) | Verandert hoe een beheerder werkt: geen permanent verhoogde rechten meer, maar per handeling een bevestiging. Scripts en tools die stil op beheerdersrechten leunen merken dat. Windows 11 24H2 en hoger; op oudere builds doet hij niets. | A.8.2 |
| [`WIN - D - Cryptography`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.md) | Een intern systeem dat alleen TLS 1.0/1.1 spreekt wordt onbereikbaar. Dat is de bedoeling, maar het moet bekend zijn. | A.8.24 |
| [`WIN - D - Device Guard and Credential Guard`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) | Vraagt een herstart, en geheugenintegriteit (HVCI) laadt geen stuurprogramma's die er niet op gebouwd zijn — denk aan oude VPN-, printer- en dockdrivers. Kijk in de pilot of alles nog start. | A.5.17, A.8.1, A.8.7 |
| [`WIN - D - Disable NTLM`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.md) | Weigert alle NTLM, inkomend en uitgaand. Wat niet via Kerberos kan breekt: toepassingen die op IP-adres verbinden, apparaten buiten het domein, en shares waarvoor het apparaat geen Kerberos-ticket krijgt — een Entra-joined apparaat dat een share op Entra Domain Services opent valt terug op NTLM. Lees vóór de pilot op een paar Windows 11 24H2-apparaten Microsoft-Windows-NTLM/Operational (4020/4021 uitgaand, 4022/4023 inkomend): die logging staat daar standaard aan en laat zien wat er zou breken. | A.8.5 |
| [`WIN - D - Enrollment Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.md) | Raakt de eerste installatie van een apparaat, niet een draaiend apparaat. Test op één Autopilot-toestel: zonder netwerk komt de gebruiker niet verder, en dat is de bedoeling — maar het moet wel kloppen met hoe apparaten bij jullie worden uitgerold. | A.5.9, A.5.15, A.8.1 |
| [`WIN - D - In-Box App Removal`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.md) | Verwijdert ingebouwde apps, ook van apparaten die al in gebruik zijn. Kijk in de pilot of iemand er een mist. | A.8.19 |
| [`WIN - D - Kernel DMA Protection`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.md) | Een dock of eGPU zonder DMA-remapping werkt niet meer. Test met de docks die in de vloot zitten. | A.7.9, A.8.1 |
| [`WIN - D - Logon Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.md) | Gebruikers moeten voortaan CTRL+ALT+DEL indrukken vóór het aanmeldscherm. Communiceer dat vóór de brede uitrol. | A.5.15, A.8.5, A.8.20 |
| [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.md) | Automatisch is de standaard van Edge, maar vastgelegd kan de gebruiker het niet meer uitzetten of een eigen resolver kiezen. Test op de pilotgroep of interne namen en een eventuele webproxy/DNS-filter blijven werken. | A.8.20, A.8.24 |
| [`WIN - D - Network Authentication Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.md) | PKU2U dichtzetten breekt Remote Desktop naar een ander Entra-joined apparaat met Entra-referenties via de oude aanmeldmethode, en P-node breekt NetBIOS-naamresolutie via broadcast in een netwerk zonder DNS of WINS. Eerst op de pilotgroep. | A.8.5, A.8.20 |
| [`WIN - D - Printing Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.md) | Windows Protected Print laat printers vallen die geen Mopria-driver hebben. Inventariseer de printervloot eerst. | A.8.7, A.8.19, A.8.20 |
| [`WIN - D - Remote Access Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.md) | Controleer of geen beheerscript of monitoringtool op winrs leunt. Enter-PSSession en Invoke-Command blijven werken, winrs niet. | A.5.15, A.8.20, A.8.21 |
| [`WIN - D - Removable Storage`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.md) | Schrijven naar USB-sticks, externe schijven en telefoons wordt geblokkeerd, en dat merkt een gebruiker meteen. Let op: tot deze policy breed uitrolt is verwisselbare opslag nergens beperkt — BitLocker laat removabledrivesrequireencryption bewust uit, omdat deze blokkade dat afdekt. | A.7.10, A.8.12 |
| [`WIN - D - Script File Associations`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.md) | Dubbelklikken op een .js-, .vbs- of .hta-bestand opent voortaan Kladblok. Een inlog- of installatiescript dat zo gestart wordt doet dan niets meer; kijk in de pilot of er zulke scripts in omloop zijn. | A.8.7 |
| [`WIN - D - Security Log Monitoring`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.md) | Module-logging voor alle modules (*) levert veel gebeurtenis 4103 op in Microsoft-Windows-PowerShell/Operational. Eerst op de pilotgroep kijken wat dat met de logomvang en een eventuele SIEM-ingest doet; zie extras/windows/event-log-sizes voor de logboekgrootte. | A.8.15, A.8.16 |
| [`WIN - D - Windows AI Features Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.md) | Gebruikers zien de AI-knoppen in Paint verdwijnen. Dat is de bedoeling, maar het is zichtbaar en verdient een aankondiging. Kies per klant tussen deze en de Permitted-variant — nooit allebei toewijzen. | A.5.10, A.5.34, A.8.1 |
| [`WIN - D - Windows Component Hardening`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.md) | Merkbaar op twee punten: 'Doorgaan op dit apparaat' (Continue experiences) verdwijnt, en een kioskapparaat dat met AutoAdminLogon werkt meldt niet meer vanzelf aan. Eerst op de pilotgroep; kiosken buiten deze policy houden. | A.8.1, A.8.9 |
| [`WIN - D - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md) | Elke gebruiker wordt bij de eerstvolgende aanmelding door de PIN-inrichting geleid, en een apparaat zonder TPM krijgt WHfB niet. Gaat samen met WIN - U - Windows Hello for Business de pilot in: de een in de pilot en de ander op iedereen maakt de pilot zinloos. | A.5.17, A.8.5 |
| [`WIN - U - AI Usage Control Restricted`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.md) | Neemt de Edge-URL-blokkeerlijst over van Microsoft Edge User Experience — die instelling is daar al weggehaald. Controleer in de pilot dat er geen legitieme site geblokkeerd wordt. Kies per klant tussen deze en de Permitted-variant; nooit allebei toewijzen. | A.5.10, A.5.19, A.8.1, A.8.23 |
| [`WIN - U - Compliance OS Version`](IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md) | Een apparaat onder de ondergrens wordt niet-compliant en verliest daarmee toegang via Conditional Access. Kijk eerst in de rapportage hoeveel apparaten dat raakt — het antwoord hoort nul te zijn, maar dat moet je gezien hebben en niet aannemen. Respijt staat op 72 uur. | A.8.8, A.8.19 |
| [`WIN - U - File Sharing Restrictions`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.md) | Een gebruiker die gewend is een map uit zijn profiel via Verkenner te delen, ziet die optie verdwijnen. Delen via OneDrive en Teams blijft werken. | A.8.3, A.8.12 |
| [`WIN - U - Microsoft Edge Management`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Management.md) | Draait de voorrang om: beleid uit de Edge Management Service wint daarna van het Edge-beleid uit deze baseline. Wie de rol Edge Administrator heeft kan dan dus instellingen uit Microsoft Edge Security en User Experience overschrijven. Leg eerst vast wie die rol heeft voordat dit breed uitrolt. | A.8.9 |
| [`WIN - U - Microsoft Outlook Cached Mode Managed`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.md) | Raakt elk bestaand profiel: Outlook bouwt het OST opnieuw op en een gedeelde mailbox in het profiel gaat van gecachet naar online. Dat is zichtbaar — de eerste synchronisatie kost tijd en bandbreedte, en wie gewend is offline in een gedeelde mailbox te werken merkt het meteen. Eerst op de pilotgroep, en kijk daar hoeveel profielen een gedeelde mailbox hebben. | A.8.9 |
| [`WIN - U - Microsoft Teams`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.md) | Blokkeert aanmelden met een account uit een andere tenant. Dat is de bedoeling, maar wie een tweede werkaccount in Teams gebruikt merkt het meteen — kijk in de pilot of dat voorkomt. | A.5.14, A.5.15, A.8.12 |
| [`WIN - U - Windows Hello for Business`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) | Hoort bij WIN - D - Windows Hello for Business en gaat samen met die de pilot in — op alle gebruikers zou hij WHfB alsnog op elk apparaat inrichten, en dan test de pilot niets. | A.5.17, A.8.5 |

### Restrisico's

**ISO-controls die technisch in te vullen zijn maar vandaag niet door fase 1 worden afgedekt (16).**
Accepteer het risico expliciet, vul het in buiten deze baseline, of breng de voorbereide policy naar fase 1.

| Control | Invulbaar | Voorbereid in de baseline |
|---|---|---|
| **A.5.3** Functiescheiding | deels | — |
| **A.5.7** Informatie en analyses over dreigingen | deels | — |
| **A.5.9** Inventarisatie van informatie en andere gerelateerde bedrijfsmiddelen | deels | `WIN - D - Enrollment Hardening`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **A.5.11** Retourneren van bedrijfsmiddelen | deels | — |
| **A.5.18** Toegangsrechten | deels | — |
| **A.5.23** Informatiebeveiliging voor het gebruik van clouddiensten | deels | — |
| **A.5.25** Beoordelen van en besluiten over informatiebeveiligingsgebeurtenissen | deels | — |
| **A.5.26** Reageren op informatiebeveiligingsincidenten | deels | — |
| **A.5.28** Verzamelen van bewijsmateriaal | deels | — |
| **A.5.33** Beschermen van registraties | deels | `WIN - D - Windows AI Recall Boundaries` |
| **A.5.36** Naleving van beleid, regels en normen voor informatiebeveiliging | deels | — |
| **A.6.5** Verantwoordelijkheden na beëindiging of wijziging van het dienstverband | deels | — |
| **A.6.7** Werken op afstand | deels | — |
| **A.7.14** Veilig verwijderen of hergebruiken van apparatuur | deels | — |
| **A.8.10** Wissen van informatie | deels | — |
| **A.8.11** Maskeren van gegevens | deels | `WIN - D - Windows AI Recall Boundaries` |

**NIS2-punten zonder enige technische maatregel in fase 1:** (a). Voor deze punten rust de naleving volledig op de organisatorische maatregelen.

Alle policies hebben een normverwijzing.

## Verklaring van toepasselijkheid — startpunt

Een voorstel per Annex A-control voor de VvT (Statement of Applicability). **Toepasselijkheid is een
besluit van de organisatie op basis van haar risicoanalyse**; deze kolommen zijn een startpunt, geen
uitkomst. Kolom *NIS2* noemt de punten die de policies bij deze control raken.

| Control | Toegepast (voorstel) | Reden | Maatregel | NIS2 |
|---|---|---|---|---|
| **A.5.1** Beleidsregels voor informatiebeveiliging | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Informatiebeveiligingsbeleid en onderwerpspecifiek beleid (o.a. endpoint-, toegangs- en AI-beleid) vaststellen, laten goedkeuren door het management en periodiek herzien. | — |
| **A.5.2** Rollen en verantwoordelijkheden bij informatiebeveiliging | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Eigenaar van de baseline, CISO en beheerrollen (Intune-, Entra-, Defender-beheer) benoemen en vastleggen. | — |
| **A.5.3** Functiescheiding | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Scheiding tussen wie policies wijzigt, wie ze goedkeurt (PR-review) en wie uitzonderingen verleent; Entra/Intune-RBAC en PIM inrichten — valt buiten deze baseline. | — |
| **A.5.4** Managementverantwoordelijkheden | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Management stuurt aantoonbaar op naleving (NIS2 art. 20: bestuurders keuren maatregelen goed en volgen training). | — |
| **A.5.5** Contact met overheidsinstanties | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Contactpunten met CSIRT/NCSC, toezichthouder en AP vastleggen, inclusief meldtermijnen. | — |
| **A.5.6** Contact met speciale belangengroepen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Deelname aan ISAC's, sectorale overleggen en leveranciersadviezen organiseren. | — |
| **A.5.7** Informatie en analyses over dreigingen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Dreigingsinformatie (Defender, Entra ID Protection, NCSC) laten beoordelen en vertalen naar aanpassingen van de baseline. | — |
| **A.5.8** Informatiebeveiliging in projectmanagement | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Beveiligingseisen opnemen in projecten, bijvoorbeeld bij de uitrol van nieuwe apparaten of platformen. | — |
| **A.5.9** Inventarisatie van informatie en andere gerelateerde bedrijfsmiddelen | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch voorbereid: 3 policies in pilot, wacht of eigen groep. Organisatorisch: Intune levert de apparaatinventaris; eigenaarschap, informatie-inventaris en periodieke controle op volledigheid zijn organisatorisch. | (i) |
| **A.5.10** Aanvaardbaar gebruik van informatie en andere gerelateerde bedrijfsmiddelen | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 3 policies in fase 1, 6 voorbereid. Organisatorisch: Gebruiksregels (incl. AI en privégebruik) vaststellen en communiceren; techniek dwingt alleen een deel af. | (d) (g) (i) |
| **A.5.11** Retourneren van bedrijfsmiddelen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Uitdienstproces: inleveren van apparaten, retire/wipe in Intune, account blokkeren. | — |
| **A.5.12** Classificeren van informatie | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Classificatieschema vaststellen; technische labels (Purview) vallen buiten deze baseline. | — |
| **A.5.13** Labelen van informatie | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Labelprocedure en -hulpmiddelen (Purview-gevoeligheidslabels) — buiten deze baseline. | — |
| **A.5.14** Overdragen van informatie | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 1 policy in fase 1, 1 voorbereid. Organisatorisch: Regels voor informatieoverdracht met externen (mail, deelkoppelingen, gastaccounts); techniek beperkt kanalen op het apparaat. | (i) |
| **A.5.15** Toegangsbeveiliging | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 3 policies in fase 1, 9 voorbereid. Organisatorisch: Toegangsbeleid vaststellen (wie mag waarbij, onder welke voorwaarden); Conditional Access en apparaatbeleid dwingen het af. | (b) (e) (i) |
| **A.5.16** Identiteitsbeheer | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 2 policies in fase 1. Organisatorisch: Levenscyclus van identiteiten (in-, door-, uitstroom) koppelen aan HR; gedeelde en serviceaccounts registreren. | (i) |
| **A.5.17** Authenticatie-informatie | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 12 policies in fase 1, 15 voorbereid. Organisatorisch: Gebruikers instrueren over omgang met wachtwoorden, pincodes en herstelcodes; uitgifteproces voor tijdelijke toegangscodes. | (c) (e) (f) (g) (h) (i) (j) |
| **A.5.18** Toegangsrechten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Toekennen, periodiek beoordelen (access reviews) en intrekken van rechten; CA dwingt voorwaarden af maar beoordeelt geen rechten. | — |
| **A.5.19** Informatiebeveiliging in leveranciersrelaties | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch voorbereid: 1 policy in pilot, wacht of eigen groep. Organisatorisch: Leveranciersbeleid en risicobeoordeling (incl. Microsoft, AI-diensten, remote-supporttools); techniek kan alleen niet-goedgekeurde diensten blokkeren. | (d) |
| **A.5.20** Adresseren van informatiebeveiliging in leveranciersovereenkomsten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Beveiligingseisen, verwerkersovereenkomsten en auditrechten in contracten opnemen. | — |
| **A.5.21** Beheren van informatiebeveiliging in de ICT-toeleveringsketen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Eisen aan ICT-producten en -diensten in de keten; herkomst van software en updates beoordelen. | — |
| **A.5.22** Monitoren, beoordelen en het beheren van wijzigingen van leveranciersdiensten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Wijzigingen bij Microsoft/leveranciers volgen (Message Center, roadmaps) en periodiek beoordelen. | — |
| **A.5.23** Informatiebeveiliging voor het gebruik van clouddiensten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Proces voor aanschaf, gebruik en beëindiging van clouddiensten; CA en tenantbeperkingen dwingen een deel af. | — |
| **A.5.24** Plannen en voorbereiden van het beheer van informatiebeveiligingsincidenten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Incidentresponsplan met rollen, draaiboeken (o.a. apparaat isoleren, account intrekken) en meldplicht (NIS2 art. 23). | — |
| **A.5.25** Beoordelen van en besluiten over informatiebeveiligingsgebeurtenissen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Triageproces en criteria voor 'incident'; Defender levert de signalen. | — |
| **A.5.26** Reageren op informatiebeveiligingsincidenten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Uitvoeren van het responsplan; technische acties (isoleren, wissen, sessies intrekken) moeten geoefend zijn. | — |
| **A.5.27** Leren van informatiebeveiligingsincidenten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Evaluaties na incidenten en vertaling naar baseline-wijzigingen. | — |
| **A.5.28** Verzamelen van bewijsmateriaal | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Forensische procedure en bewaartermijnen; logging en EDR leveren het materiaal, borging van de keten is organisatorisch. | — |
| **A.5.29** Informatiebeveiliging tijdens een verstoring | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 2 policies in fase 1. Organisatorisch: Beveiligingsniveau tijdens calamiteiten plannen (noodprocedures, break-glass-accounts). | (c) (e) |
| **A.5.30** ICT-gereedheid voor bedrijfscontinuïteit | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 2 policies in fase 1. Organisatorisch: BIA, hersteldoelen (RTO/RPO) en periodieke continuïteitstests. | (c) |
| **A.5.31** Wettelijke, statutaire, regelgevende en contractuele eisen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Register van toepasselijke wet- en regelgeving (NIS2/Cyberbeveiligingswet, AVG) bijhouden. | — |
| **A.5.32** Intellectuele-eigendomsrechten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Licentiebeheer en regels voor gebruik van software en content. | — |
| **A.5.33** Beschermen van registraties | ja | basisbeveiliging; bevestigen met de risicoanalyse | Technisch voorbereid: 1 policy in pilot, wacht of eigen groep. Organisatorisch: Bewaartermijnen en bescherming van registraties vastleggen (retentiebeleid, logbewaring). | — |
| **A.5.34** Privacy en bescherming van persoonsgegevens | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 4 policies in fase 1, 6 voorbereid. Organisatorisch: AVG-verantwoording: verwerkingsregister, DPIA voor telemetrie, monitoring en AI-functies, afstemming met FG en OR. | (d) (e) (g) |
| **A.5.35** Onafhankelijke beoordeling van informatiebeveiliging | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Interne audit of externe beoordeling op geplande tussenpozen. | — |
| **A.5.36** Naleving van beleid, regels en normen voor informatiebeveiliging | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Naleving periodiek beoordelen; compliance-policies en baseline-checks leveren de meting, de beoordeling en opvolging zijn organisatorisch. | — |
| **A.5.37** Gedocumenteerde bedieningsprocedures | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Beheerprocedures documenteren (uitrol, uitzonderingen, herstel); de gegenereerde documentatie in deze repo is een deel daarvan. | — |
| **A.6.1** Screening | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Antecedentenonderzoek (VOG) naar risico van de functie. | — |
| **A.6.2** Arbeidsovereenkomst | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Beveiligingsverplichtingen opnemen in arbeidsvoorwaarden. | — |
| **A.6.3** Bewustwording van, opleiding en training in informatiebeveiliging | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Bewustwordingsprogramma en training (phishing, wachtwoorden, AI-gebruik); ook voor bestuurders (NIS2 art. 20(2)). | — |
| **A.6.4** Disciplinaire procedure | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Formele procedure bij schending van het beleid. | — |
| **A.6.5** Verantwoordelijkheden na beëindiging of wijziging van het dienstverband | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Uitdienstproces: toegang intrekken, apparaat terug of selectief wissen, geheimhouding na vertrek. | — |
| **A.6.6** Vertrouwelijkheids- of geheimhoudingsovereenkomsten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Geheimhoudingsovereenkomsten opstellen en laten tekenen. | — |
| **A.6.7** Werken op afstand | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Thuiswerkbeleid (locatie, schermen, netwerken); techniek beschermt het apparaat en de toegang. | — |
| **A.6.8** Melden van informatiebeveiligingsgebeurtenissen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Meldkanaal voor medewerkers inrichten en bekendmaken. | — |
| **A.7.1** Fysieke beveiligingszones | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein: fysieke zones definiëren. | — |
| **A.7.2** Fysieke toegangsbeveiliging | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein: toegangscontrole tot gebouwen en ruimten. | — |
| **A.7.3** Beveiligen van kantoren, ruimten en faciliteiten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein. | — |
| **A.7.4** Monitoren van de fysieke beveiliging | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein: camerabewaking, alarmopvolging. | — |
| **A.7.5** Beschermen tegen fysieke en omgevingsdreigingen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein. | — |
| **A.7.6** Werken in beveiligde zones | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein. | — |
| **A.7.7** 'Clear desk' en 'clear screen' | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 5 policies in fase 1, 5 voorbereid. Organisatorisch: Clear-desk-regels voor papier en media vaststellen; clear screen wordt technisch afgedwongen. | (e) (f) (i) |
| **A.7.8** Plaatsen en beschermen van apparatuur | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein. | — |
| **A.7.9** Beveiligen van bedrijfsmiddelen buiten het terrein | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 2 policies in fase 1, 5 voorbereid. Organisatorisch: Regels voor meenemen, onbeheerd achterlaten en melden van verlies; versleuteling en wissen op afstand zijn technisch. | (e) (h) (i) |
| **A.7.10** Opslagmedia | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 1 policy in fase 1, 2 voorbereid. Organisatorisch: Beleid voor verwisselbare media en veilige vernietiging. | (e) (h) (i) |
| **A.7.11** Nutsvoorzieningen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein. | — |
| **A.7.12** Beveiligen van bekabeling | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Buiten het endpoint-/identitydomein. | — |
| **A.7.13** Onderhoud van apparatuur | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Onderhoud en reparatie door bevoegden, met afspraken over gegevens op het apparaat. | — |
| **A.7.14** Veilig verwijderen of hergebruiken van apparatuur | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Procedure voor afvoer en hergebruik (wipe/Autopilot Reset, certificaat van vernietiging). | — |
| **A.8.1** 'User endpoint devices' | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 19 policies in fase 1, 29 voorbereid. Organisatorisch: Beleid voor zakelijke en privéapparaten (BYOD), registratie en gebruiksregels. | (d) (e) (f) (h) (i) |
| **A.8.2** Speciale toegangsrechten | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 6 policies in fase 1, 3 voorbereid. Organisatorisch: Proces voor toekennen en periodiek beoordelen van beheerrechten (PIM, access reviews). | (e) (i) |
| **A.8.3** Beperking toegang tot informatie | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 1 policy in fase 1, 1 voorbereid. Organisatorisch: Autorisatiematrix en rechten op data (SharePoint/Teams) — grotendeels buiten deze baseline. | (h) (i) |
| **A.8.4** Toegangsbeveiliging op broncode | afhankelijk | alleen van toepassing bij eigen software- of scriptontwikkeling | Organisatorisch: Alleen bij eigen softwareontwikkeling: toegang tot repositories en ontwikkeltools beheren. | — |
| **A.8.5** Beveiligde authenticatie | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 10 policies in fase 1, 19 voorbereid. Organisatorisch: Authenticatiebeleid vaststellen (welke methoden, uitzonderingen, break-glass). | (e) (f) (g) (h) (i) (j) |
| **A.8.6** Capaciteitsbeheer | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 3 policies in fase 1. Organisatorisch: Capaciteitsplanning voor netwerk, licenties en opslag. | (c) |
| **A.8.7** Bescherming tegen malware | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 26 policies in fase 1, 16 voorbereid. Organisatorisch: Gebruikersbewustzijn en opvolging van detecties (de norm noemt beide expliciet). | (b) (c) (e) (f) (i) (j) |
| **A.8.8** Beheer van technische kwetsbaarheden | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 11 policies in fase 1, 13 voorbereid. Organisatorisch: Kwetsbaarhedenproces: bronnen volgen, risico beoordelen, termijnen voor herstel, uitzonderingen registreren. | (e) (f) (h) (i) |
| **A.8.9** Configuratiebeheer | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 18 policies in fase 1, 7 voorbereid. Organisatorisch: Deze repo is de vastgelegde configuratie; wijzigingen reviewen (PR) en afwijkingen in de tenant opvolgen blijft een proces. | (b) (e) (g) (i) |
| **A.8.10** Wissen van informatie | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Bewaar- en verwijderbeleid; selectief wissen en wipe zijn technische hulpmiddelen. | — |
| **A.8.11** Maskeren van gegevens | ja | basisbeveiliging; bevestigen met de risicoanalyse | Technisch voorbereid: 1 policy in pilot, wacht of eigen groep. Organisatorisch: Beleid wanneer gegevens gemaskeerd of gepseudonimiseerd worden — grotendeels applicatieniveau. | — |
| **A.8.12** Voorkomen van gegevenslekken (data leakage prevention) | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 13 policies in fase 1, 11 voorbereid. Organisatorisch: DLP-beleid en classificatie; Purview DLP valt buiten deze baseline, apparaat- en app-beperkingen dragen bij. | (c) (d) (e) (h) (i) |
| **A.8.13** Back-up van informatie | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 3 policies in fase 1. Organisatorisch: Back-upbeleid voor M365-data en periodieke hersteltests; OneDrive-synchronisatie is geen volledige back-up. | (c) |
| **A.8.14** Redundantie van informatieverwerkende faciliteiten | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Redundantie van diensten en infrastructuur — buiten het endpoint-/identitydomein. | — |
| **A.8.15** Logging | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 6 policies in fase 1, 2 voorbereid. Organisatorisch: Logbestanden centraal verzamelen, beschermen, bewaren en analyseren (SIEM/Defender XDR); de baseline regelt alleen wat het apparaat logt. | (b) (e) |
| **A.8.16** Monitoren van activiteiten | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 4 policies in fase 1, 7 voorbereid. Organisatorisch: 24/7- of kantoortijdenopvolging van alerts, met escalatiecriteria. | (b) (e) (i) |
| **A.8.17** Kloksynchronisatie | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 2 policies in fase 1, 1 voorbereid. Organisatorisch: Goedgekeurde tijdbron vastleggen. | (b) (e) (i) |
| **A.8.18** Gebruik van speciale systeemhulpmiddelen | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 1 policy in fase 1, 3 voorbereid. Organisatorisch: Register van toegestane beheer- en remote-supporttools en wie ze mag gebruiken. | (i) |
| **A.8.19** Installeren van software op operationele systemen | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 10 policies in fase 1, 8 voorbereid. Organisatorisch: Proces voor goedkeuren en aanbieden van software (Company Portal-catalogus). | (e) (f) (g) (h) (i) |
| **A.8.20** Beveiliging netwerkcomponenten | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 13 policies in fase 1, 12 voorbereid. Organisatorisch: Netwerkinfrastructuur (firewalls, wifi, VPN) valt grotendeels buiten deze baseline. | (b) (c) (e) (f) (h) (i) (j) |
| **A.8.21** Beveiliging van netwerkdiensten | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 1 policy in fase 1, 5 voorbereid. Organisatorisch: Eisen aan netwerkdiensten en -leveranciers vastleggen en monitoren. | (c) (e) (h) |
| **A.8.22** Netwerksegmentatie | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Netwerksegmentatie is infrastructuur, niet via endpoint-/identitybeleid in te richten. | — |
| **A.8.23** Toepassen van webfilters | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 3 policies in fase 1, 3 voorbereid. Organisatorisch: Categorieën en uitzonderingen vaststellen (Defender Web Content Filtering in het Defender-portaal). | (d) (e) (g) (i) (j) |
| **A.8.24** Gebruik van cryptografie | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 9 policies in fase 1, 7 voorbereid. Organisatorisch: Cryptografiebeleid en sleutelbeheer (wie heeft toegang tot herstelsleutels, rotatie). | (e) (f) (h) (i) (j) |
| **A.8.25** Beveiligen tijdens de ontwikkelcyclus | afhankelijk | alleen van toepassing bij eigen softwareontwikkeling | Organisatorisch: Alleen bij eigen ontwikkeling. | — |
| **A.8.26** Toepassingsbeveiligingseisen | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Beveiligingseisen bij ontwikkelen of aanschaffen van toepassingen. | — |
| **A.8.27** Veilige systeemarchitectuur en technische uitgangspunten | afhankelijk | alleen van toepassing bij eigen systeemontwikkeling | Organisatorisch: Architectuurprincipes (zero trust) vastleggen. | — |
| **A.8.28** Veilig coderen | afhankelijk | alleen van toepassing bij eigen softwareontwikkeling | Organisatorisch: Alleen bij eigen ontwikkeling. | — |
| **A.8.29** Testen van de beveiliging tijdens ontwikkeling en acceptatie | afhankelijk | alleen van toepassing bij eigen softwareontwikkeling | Organisatorisch: Alleen bij eigen ontwikkeling; voor de baseline zelf: de pilotfase (fase 2). | — |
| **A.8.30** Uitbestede systeemontwikkeling | afhankelijk | alleen van toepassing bij uitbestede ontwikkeling | Organisatorisch: Alleen bij uitbestede ontwikkeling. | — |
| **A.8.31** Scheiding van ontwikkel-, test- en productieomgevingen | afhankelijk | alleen van toepassing bij eigen ontwikkeling of een eigen testomgeving | Organisatorisch: Test-tenant of pilotgroep naast productie. | — |
| **A.8.32** Wijzigingsbeheer | ja | basisbeveiliging en invulling van NIS2 art. 21(2); bevestigen met de risicoanalyse | Technisch: 2 policies in fase 1, 4 voorbereid. Organisatorisch: Wijzigingsprocedure (PR-review, pilotfase, communicatie) vastleggen en volgen; update-ringen zijn de technische kant. | (e) |
| **A.8.33** Testgegevens | afhankelijk | alleen van toepassing bij eigen ontwikkeling of testen | Organisatorisch: Alleen bij eigen ontwikkeling of testen. | — |
| **A.8.34** Bescherming van informatiesystemen tijdens audits | ja | basisbeveiliging; bevestigen met de risicoanalyse | Organisatorisch: Audits en pentests plannen en afstemmen met het verantwoordelijke management. | — |

## Controle van de mapping

| | Aantal |
|---|---:|
| Intune-policies met controls | 193 van 193 |
| Labels buiten de vocabulaire | 0 |
| Labels met een afwijkende schrijfwijze (wel meegeteld) | 0 |

Map alleen wat een policy werkelijk afdwingt of toetst. `check-scope.js` weigert een policy zonder
controls en labels die niet exact in `IntuneTemplate/_controls.json` staan.

---

Terug naar de [hoofd-README](README.md) · [OVERZICHT.md](OVERZICHT.md)
