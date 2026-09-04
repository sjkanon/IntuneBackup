# Drie assen — volledig rapport FlyingGroup

3 september 2026. Een baseline kan op drie manieren tekortschieten: hij kan onvolledig zijn,
hij kan het verkeerde afdwingen, of hij kan gewoon niet uitgerold zijn. Dit rapport meet alle
drie — en laat zien dat alleen de derde het echte probleem is.

| Bron | Wat het is |
|---|---|
| `flyinggroup.aero_2026-09-02-0817.json` | CIPP-backup, 2 september 2026 — 16 CA-policies, 28 Intune-configuratiepolicies, 4 compliance, 6 app protection |
| [`IntuneTemplate/`](IntuneTemplate/) | 138 policies, 1.967 instellingen |
| [sjkanon/CA-Policies](https://github.com/sjkanon/CA-Policies) `CATemplate/` | 33 templates |
| 24 ISMS-documenten | ISDP.01–02 en ISMP.01–22, revisie 1, ingangsdatum 11 mei 2026 |

```
   Externe standaarden ──AS 1──┐
   MCSB · CIS · OIB            │
   · IntuneAdmin               ├──▶  DE BASELINE  ──AS 3──▶  DE TENANT
                               │     IntuneTemplate 138      38 Intune-policies
   ISMS-beleid ────────AS 2────┘     CATemplate 33           16 CA-policies
   24 documenten

   AS 1  compleet?    AS 2  het juiste?    AS 3  uitgerold?
```

| As | Vraag | Uitkomst |
|---|---|---|
| **1** | Is de baseline compleet? | **2 openstaand.** Intune: 509 kandidaten → 14, alle verwerkt. CA: 14 van 15 kandidaten gebouwd. |
| **2** | Dwingt hij het juiste af? | **4 gaten, 2 afwijkingen.** Van 41 technisch afdwingbare eisen dekt de baseline er 35. |
| **3** | Staat het in de tenant? | **4,2%.** 82 van 1.967 instellingen; 3 van 33 CA-policies afgedwongen. |

De eerste twee assen zijn in orde. De derde niet. Dat onderscheid bepaalt waar het werk zit —
en waar níét.

---

# Nulmeting — wat beschermt de tenant vandaag?

Vóór elke gapanalyse: wat staat er nú, en werkt het? Voor Conditional Access is dat hard te
zeggen — `state` zit in de backup. Voor Intune niet: de backup bevat geen toewijzingen,
behalve bij app protection.

## Conditional Access — 9 van 16 staan aan, 7 doen werk

| Policy | State | Wat het vandaag doet |
|---|---|---|
| **Default MFA Policy** | actief | MFA voor alle gebruikers — **behalve** vanaf de 7 vertrouwde locaties en behalve de groep `FYG-MFA-OFF`. Sessie 30 dagen. |
| **MFA - Directory Roles** | actief | MFA op 10 beheerdersrollen, overal behalve de AVD-gateway. |
| **Microsoft-managed: MFA admin portals** | actief | MFA op de beheerportalen voor 14 rollen. |
| **Blocked countries** | actief | Blokkeert 20 landen. Onbekende landen **niet** meegerekend. |
| **05-01 \| MDM \| Mobile Apps** | actief | Compliant apparaat vereist — alleen voor de groep `FYG-MFA-MOBILE-APP-MDM`. |
| **06 -02 \| Allow Personal Devices** | actief | Groep `FYG-D-BYOD` bij alle apps op alleen MFA, sessie 3 uur. |
| **MFA op AVD verplicht** | actief | MFA + geen persistente browser voor `FYG-U-AVD-FIN` op de AVD-gateway. |
| **Exchange ActiveSync-OFF** | **schijn** | Staat aan, maar `includeApplications: ["None"]` — grijpt op geen enkele applicatie aan. |
| **06 -01 \| Block Personal Devices** | **schijn** | Staat aan, maar `includeUsers: ["Itce OPS"]` — geldt voor één account van de 908. |

**6 policies op report-only:** 00-01 landenblokkade, 00-02 legacy auth, 02-01 en 02-02
geografisch gelaagde MFA, 03-01 SMTP, 05-02 mobiel. Ze rapporteren, ze dwingen niets af.
**1 policy uit:** Microsoft-managed per-user MFA.

### MFA geldt niet op zes klantlocaties en op AVD

De zeven named locations staan alle zeven op `isTrusted: true`, en **Default MFA Policy** sluit
`AllTrusted` uit. Vanaf ANR-HQ, BRU landside en airside, KTK, LUX, Malta, AirBP en de AVD
NAT-gateway is de tenantbrede MFA-eis dus niet van kracht — bovenop de uitzondering voor de
groep `FYG-MFA-OFF`.

Dat is een verdedigbare keuze voor een kantoornetwerk, maar hij is nergens vastgelegd, en hij
stapelt: wie op een klantlocatie zit én in `FYG-MFA-OFF`, heeft geen enkele MFA-eis. ISMP.02
eist MFA voor aviation-critical en remote systemen zonder locatie-uitzondering te noemen.

### De landenblokkade laat onbekende herkomst door — en blokkeert Taiwan en Israël

`Countries-Blocked (Bad Countries)` telt 20 landen:
`AF CN CO ET HK IL IQ IR KH NE NP RU SD SY TW UG XK YE ZM ZW`.

- **Onbekende landen worden niet meegerekend** (`includeUnknownCountriesAndRegions: false`).
  Een aanmelding vanaf een IP dat Entra niet aan een land kan koppelen — precies wat een
  anonimiserende proxy oplevert — passeert deze blokkade.
- **TW en IL staan op de lijst.** Voor een zakelijke luchtvaartoperatie met internationale
  klandizie waarschijnlijk niet bedoeld. Controleren en onderbouwen, of eruit halen.

## Intune — wat er staat, met de toewijzing als onbekende

Voor de 28 configuratie- en 4 compliancepolicies bevat de backup **geen toewijzing**. Ze
bestaan; of ze op apparaten landen is hiermee niet vast te stellen. **Dit is de eerste vraag om
in de portal te beantwoorden** — een policy zonder toewijzing doet niets.

| Wat er actief kán zijn | Waar het vandaan komt | Oordeel |
|---|---|---|
| **Attack Surface Reduction** — 16 regels op *block* | FYG-SecurityRestrictions | strenger dan onze baseline |
| **Tamper Protection** | FYG-TamperProtection | dekt ISMP.11 |
| **Defender Antivirus** — 21 instellingen | FYG - GEN - Microsoft Defender Antivirus | dreigingen op `userdefined` |
| **BitLocker** — 3 instellingen | FYG-BitLocker_Policy | geen escrow-eis, geen methodekeuze |
| **Windows LAPS** — 12 tekens, rotatie 7 dagen | 9. FYG - GEN - Windows LAPS | ondergraven door het OMA-URI-profiel |
| **Defender for Endpoint** — onboarding | FYG - GEN - Default EDR policy | gedekt |
| **Credential Guard** — aan, zonder UEFI-lock | FYG-SecurityRestrictions | baseline eist lock |
| **Windows Update** — deferral 5, deadline 7, grace 7 | FYG Windows Update Policy | tot 19 dagen; ISMP.21 eist 7 |
| **Windows Hello** — PIN 6–8, geen TPM vereist | FYG-D Windows Hello ** | zwakker dan de baseline |
| **Compliance Windows** — BitLocker, Defender, RTP | Windows 10 Default Policy | het enige platform met versleutelingseis |
| **Compliance iOS / Android / macOS** | 3 policies | geen versleuteling, geen toegangscode |
| **App protection** — 5 van 6 toegewezen | `isAssigned` staat wél in de backup | defaults laten data naar privéapps |

**Eén app protection-policy is niet toegewezen:** *Outlook app Android policies*
(`isAssigned: false`). Hij staat er wel, doet niets, en overlapt inhoudelijk met de twee die
wél zijn toegewezen. Opruimen of toewijzen — nu is onduidelijk welke van de drie
Android-policies de bedoeling is.

---

# As 1 — Is de baseline compleet?

**Intune, augustus 2026.** De set is gelegd naast
[IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines) — 874 profielen
met CIS v4, ISO 27001, NIS2 en de Microsoft Endpoint Security-baselines. Dat leverde 509
instellingen op die zij zetten en wij niet. Daarvan haalden er **14** de lat; de rest viel af
op browser (180), Apple-payloads voor supervised toestellen (21), CIS L2, of dekking langs een
andere weg. Een tweede ronde per profiel voegde er 5 toe. Alles verwerkt — zie
[`ANALYSE.md`](ANALYSE.md).

**Conditional Access, vandaag.** Er lag al een vergelijking met drie frameworks (Chronlund,
van Surksum, Verlinden) van 13 augustus, in `docs/ca-baseline-gap.md` in sjkanon/Platform. Van
de vijftien kandidaten die die aandroeg zijn er **veertien gebouwd**. Deze ronde toetste
daarom aan de normatieve bronnen:

| Bron | Dekking |
|---|---|
| MCSB Identity Management, IM-7 (zeven CA-toepassingen) | **7 van 7** |
| CIS Microsoft 365 Foundations 5.2.2, inclusief de vijf uit v7.0.0 | 3 van 5 nieuw gedekt, 1 half |
| Microsofts eigen CA-templatecategorieën | **5 van 6** |

**Wat er nog bij moet:** periodieke herauthenticatie voor alle gebruikers (CIS 5.2.2.13 — nu
alleen beheerders en BYOD) en insider risk als `optional`. Agent-identiteiten heroverwegen
zodra Entra Agent ID breed beschikbaar is. Volledige onderbouwing in
[`ANALYSE.md`](../CA-Policies/ANALYSE.md) in de CA-repo.

## Maar de CA-set zelf mankeert iets

Drie eigenschappen die met geen policyvergelijking te vinden zijn. Ze verklaren mede waarom
as 3 er zo slecht voorstaat.

**A. De randvoorwaarden worden niet meegeleverd.** De templates verwijzen naar zes groepen en
vier named locations die de repo nergens definieert. Bij deze tenant bestond **geen van de
zes**.

```
Excluded from Conditional Access            <- de break-glass-uitsluiting
Conditional Access Service Accounts         Allowed Countries
Licensed Users                              High-Risk Countries
Excluded from Legacy Authentication Block   Service Accounts Trusted IPs
Excluded from Device Code Auth Flow Block   AllTrusted
Excluded from Country Block List
```

Het probleem is niet dat uitrol faalt — het is dat hij *slaagt*: een uitzonderingsgroep die
niet bestaat sluit niemand uit, dus de policy wordt strenger dan bedoeld. 33 policies
uitrollen waarvan de break-glass-groep niet bestaat is de klassieke manier om een tenant
volledig buiten te sluiten.

**B. Twaalf van de 33 templates kunnen nooit een `pass` opleveren.** Elf staan op `disabled`,
één op report-only; nergens staat welke of waarom. Twee gevallen spreken zichzelf tegen:
`2055` (phishing-resistant MFA voor beheerders) staat uit terwijl `2120` (voor álle
gebruikers) aan staat — de eerste stap uitgeleverd, het einddoel aan. En `1090` staat aan
terwijl `1100` uit staat, beide risicopolicies, zonder reden.

**C. Vijf P2-afhankelijke templates zijn niet als `optional` gemarkeerd.** `1090`, `1100`,
`2010`, `2020` en `2110` vereisen Entra ID P2 maar staan niet in `OPTIONAL_TEMPLATES`.
Aantoonbaar onbedoeld: de checks die ze vervingen (`CA-BASE-004`/`005`) dragen wél
`requiresEntraIdP2: true`.

---

# As 2 — Dwingt de baseline af wat het beleid eist?

Deze vraag was nog nooit systematisch gesteld. Alle 24 documenten zijn doorgelezen; daaruit
zijn de eisen gelicht met een getal of een afdwingbaar mechanisme erin — 41 stuks.

## Wat elk document opleverde

| Document | Eisen | Wat het opleverde |
|---|---:|---|
| **ISMP.02** Access Control | 10 | het zwaarste document: wachtwoorden, vergrendeling, inactiviteit, bevoorrechte accounts, MFA |
| **ISMP.11** Malware and Antivirus | 7 | AV-gedrag, hardening, filtering — plus FIM en IDS die buiten Intune vallen |
| **ISMP.13** Logging and Monitoring | 6 | auditgebeurtenissen, kloksynchronisatie, logbescherming, 12-maandsbewaring |
| **ISMP.19** Cryptographic Control | 5 | AES-256, TLS 1.2+, Wi-Fi-encryptie, versleuteling nooit uit |
| **ISMP.08** Mobile and Teleworking | 5 | BYOD-eisen, remote wipe, encryptie op mobiel, de AVD-route |
| **ISMP.15** Information Transfer | 4 | OneDrive en Teams als kanaal, virusscan bij overdracht, removable media |
| **ISMP.06** Acceptable Use | 3 | verwisselbare media, software-installatie, apparaatvergrendeling |
| **ISMP.21** Patch Management | 2 | de vier patchtermijnen en continue compliancemeting |
| **ISMP.14** Network Security | 2 | deny-by-default op het eindpunt; segmentatie valt buiten Intune |
| **ISMP.10** Backup | 2 | mobiele back-up; versleutelde back-ups (buiten Intune) |
| **ISMP.18** Cryptographic Key Management | 2 | hardware-backed sleutelopslag; geen sleutels in platte tekst |
| **ISMP.22** AI Technology | 1 | de AI Usage Table — alleen Copilot toegestaan |
| **ISMP.07** Clear Desk and Clear Screen | 1 | schermvergrendeling — verwijst door naar ISMP.02 |
| **ISMP.16** Physical and Environmental | 1 | opnameapparatuur in secure areas — fysiek, niet technisch |
| **ISMP.03** Asset Management | 1 | geen ongeautoriseerde software of hardware |

**Negen documenten leverden geen technisch toetsbare eis op:** ISDP.01 Data Protection,
ISDP.02 Data Retention, ISMP.01 Information Security, ISMP.04 Classification and Handling,
ISMP.05 Awareness and Training, ISMP.09 Business Continuity, ISMP.12 Third Party Supplier,
ISMP.17 Cloud Services, ISMP.20 Significant Incident and Evidence.

Deze negen stellen eisen aan processen, registers, contracten, classificatie en meldtermijnen —
bindend, maar niet af te dwingen met een Intune-instelling of een CA-conditie. ISMP.04 raakt
de baseline het dichtst: classificatie bepaalt hoe informatie opgeslagen en verzonden mag
worden, en dat is Purview-werk, geen endpointwerk.

## De matrix

Legenda: **gedekt** · **strenger** dan het beleid · **afwijking** · **deels** · **gat** ·
*niet technisch* (buiten Intune en CA).

### Identiteit en toegang

| Bron | Eis | Baselinecontrole | Oordeel |
|---|---|---|---|
| ISMP.02 | MFA voor aviation-critical en remote systemen | CA `2050` · `2100` · `2120` | gedekt |
| ISMP.02 | Vergrendeling na **6** mislukte pogingen | `devicelock_accountlockoutpolicy` — drempel **10** | **afwijking** |
| ISMP.02 · 07 | Herauthenticatie na 15 min inactiviteit | `machineinactivitylimit_v2` = 900 | gedekt |
| ISMP.02 | Wachtwoord ≥ 10 tekens, historie 4 | Device Lock — lengte 14, historie 24 | **strenger** |
| ISMP.02 | Bevoorrecht wachtwoord ≥ 12, geen woordenboek, uniek per service | Windows LAPS — 21 tekens, complexiteit 8 | **strenger** |
| ISMP.02 | Wachtwoord niet zichtbaar bij invoer | `credentialsui_disablepasswordreveal` | gedekt |
| ISMP.02 | Least privilege op lokale beheerdersgroep | Local Administrators — `add_restrict` | gedekt |
| ISMP.02 | Bescherming tegen brute force | Account Lockout + CA-risicopolicies | gedekt |
| ISMP.02 | Inactieve sessies beëindigen, zeker op afstand | CA `3010` (beheerders) · `3020` (BYOD) | **gat** |
| ISMP.18 | Hardware-backed sleutelopslag waar beschikbaar | TPM verplicht — Device Guard, WHfB | gedekt |

### Apparaat en versleuteling

| Bron | Eis | Baselinecontrole | Oordeel |
|---|---|---|---|
| ISMP.08 · 19 | Full disk encryption, AES-256 | BitLocker XTS-AES 256 · FileVault, beide met sleutelescrow | gedekt |
| ISMP.19 | Versleuteling nooit uit te schakelen | `requiredeviceencryption` + Tamper Protection | gedekt |
| ISMP.06 · 15 | Alleen bedrijfseigen versleutelde verwisselbare media | Removable Storage — schrijven geblokkeerd | andere weg |
| ISMP.08 | Password/PIN en auto-lock op mobiel | Compliance Password (4 platformen) + MAM | gedekt |
| ISMP.08 | Remote wipe ingeschakeld vóór toegang | MAM selectieve wipe; volledige wipe vraagt inschrijving | deels |
| ISMP.10 | Mobiel niet centraal gebackupt, lokale back-up beveiligd | MAM `dataBackupBlocked` + OneDrive KFM | gedekt |
| ISMP.16 | Camera's en opnameapparatuur beperkt in secure areas | — | *niet technisch* |

### Malware en hardening

| Bron | Eis | Baselinecontrole | Oordeel |
|---|---|---|---|
| ISMP.11 | Definities automatisch bijgewerkt | Defender — interval 1 uur | gedekt |
| ISMP.11 | Niet uitschakelbaar door eindgebruiker | Tamper Protection | gedekt |
| ISMP.11 | Scan bij openen, uitvoeren en wijzigen | Defender realtime + Attachment Scanning | gedekt |
| ISMP.11 | Infectie automatisch in quarantaine of hersteld | `threatseveritydefaultaction` = quarantine | gedekt |
| ISMP.11 | Onnodige poorten, diensten en applicaties verwijderd | In-Box App Removal · System Services · Legacy Hardening | gedekt |
| ISMP.11 | Internetverkeer gefilterd op reputatie, deny/allow-lijst | Network Protection · SmartScreen · Enhanced Phishing Protection | gedekt |
| ISMP.11 | File Integrity Monitoring | — | *buiten Intune* |
| ISMP.11 | HIDS/NIDS | — | *buiten Intune* |
| ISMP.11 | In- en uitgaande e-mail gescand | — | *Exchange Online* |

### Logging

| Bron | Eis | Baselinecontrole | Oordeel |
|---|---|---|---|
| ISMP.13 | Aanmelding, privilegegebruik, bestandstoegang, configuratiewijziging | Audit and Event Logging — 40 instellingen | gedekt |
| ISMP.13 | Auditconfiguratie niet te overrulen | Audit Policy Enforcement | gedekt |
| ISMP.13 | Logs beschermd tegen overschrijven | Logging — logbestandsgroottes | deels |
| ISMP.13 | Beheerders kunnen eigen logregels niet wissen | — | *vraagt doorvoer* |
| ISMP.13 | Klok gesynchroniseerd op één vertrouwde NTP-bron | Timezone — `w32time_policy_enable_ntpclient` | gedekt |
| ISMP.13 | Logs 12 maanden bewaard | — | *vraagt SIEM* |

### Netwerk en overdracht

| Bron | Eis | Baselinecontrole | Oordeel |
|---|---|---|---|
| ISMP.19 | TLS 1.2 of hoger | Cryptography — `edge_sslversionmin` | gedekt |
| ISMP.19 | Wi-Fi met WPA2/WPA3 en AES, 802.1X waar haalbaar | — | **gat** |
| ISMP.14 | Deny-by-default op het eindpunt | Windows Firewall + Firewall Rules | gedekt |
| ISMP.14 | Netwerksegmentatie, VLAN's, gateways | — | *buiten Intune* |
| ISMP.15 | Bestanden gescand vóór en na overdracht | Defender realtime | gedekt |
| ISMP.15 | OneDrive als voorkeurskanaal | Microsoft OneDrive + Known Folder Move | gedekt |
| ISMP.15 | Teams als voorkeursplatform, tenantbeperkt | Microsoft Teams — aanmeldbeperking op tenant-id | gedekt |
| ISMP.15 · 19 | Vertrouwelijke informatie versleuteld per e-mail | — | *Purview* |

### Beheer, patchen en AI

| Bron | Eis | Baselinecontrole | Oordeel |
|---|---|---|---|
| ISMP.21 | Kritieke patch binnen 7 dagen | Update Ring 3 — deadline 2 dagen | **strenger** |
| ISMP.21 | Patchcompliance continu gemonitord | Compliancepolicies + Update Reports and Telemetry | gedekt |
| ISMP.06 · 03 | Geen ongeautoriseerde software-installatie | Local Administrators · Microsoft Store · Package Manager | gedekt |
| ISMP.22 | Alleen Copilot toegestaan, alle andere AI verboden | 8 AI-policies; blokkeerlijst in Edge | deels |
| ISMP.08 | Onbeheerde toegang alleen via AVD | CA `2090` blokkeert; routeert niet naar AVD | **gat** |

## Wat dit oplevert

**De baseline doet het goed.** Van de 30 eisen die Intune of CA technisch kán afdwingen, dekt
de baseline er 26 volledig, waarvan vier *strenger* dan het beleid vraagt. Dat is geen
toeval: elf baselinepolicies verwijzen in hun eigen documentatie al expliciet naar een
ISMP-nummer.

**Vier echte gaten.**

- **Wi-Fi** — de baseline heeft geen enkel Wi-Fi-profiel, terwijl ISMP.19 WPA2/WPA3 met AES
  eist en 802.1X waar haalbaar.
- **Sessieduur voor gewone gebruikers** — alleen beheerders en BYOD zijn gedekt. Dit is
  dezelfde toevoeging die as 1 vanuit CIS 5.2.2.13 aandroeg; twee assen wijzen naar hetzelfde
  gat.
- **De AVD-route** — ISMP.08 schrijft voor dat onbeheerde toegang alleen via een AVD-omgeving
  mag. De baseline blokkeert wel, maar biedt het voorgeschreven alternatief niet.
- **De AI-blokkade is een URL-lijst in Edge** — frictie, geen grens. Hij werkt niet op een
  telefoon en niet op een privéapparaat. De robuustere variant is Defender Web Content
  Filtering, categorie Generative AI; dat staat in het Defender-portaal, niet in deze repo.

**Eén afwijking die een besluit vraagt.** ISMP.02 eist vergrendeling na zes mislukte
pogingen; de baseline staat op tien, met als onderbouwing dat vijf gebruikers te makkelijk
buitensluit en tien de waarde van de Microsoft Security Baseline is. Verdedigbaar, maar niet
wat het beleidsdocument zegt. Kies: baseline naar 6, of de afwijking vastleggen als
goedgekeurde uitzondering bij de CISO.

**De mapping wordt niet bijgehouden.** Elf van de 138 policies noemen een ISMP-nummer —
precies de elf die uit de oude `ISMSTemplate/`-set komen. De andere 127 dekken aantoonbaar
beleidseisen af zonder dat ergens vast te leggen. Bij de volgende beleidsherziening is er dus
geen manier om te zien wat er meebeweegt. Een veld `isms` in `_manifest.json` lost dat op, en
`check-scope.js` kan het bewaken zoals het nu de fasen bewaakt.

---

# As 3 — Staat het in de tenant?

> **4,2% is geen veiligheidscijfer.** Het meet hoeveel van ónze baseline in de tenant staat,
> niet hoe veilig de tenant is. Die twee lopen hier uiteen: de tenant zet zestien ASR-regels op
> *block* waar de baseline er vier op *warn* zet, heeft Tamper Protection aan, en dwingt MFA af
> op alle gebruikers en op tien beheerdersrollen. Er staat een fundament. Het percentage zegt
> dat het dun is en dat het meeste van wat de baseline toevoegt ontbreekt — niet dat er niets is.

| Domein | Baseline | Tenant | Dekking | Opmerking |
|---|---:|---:|---|---|
| Conditional Access | 33 templates | 16 policies | **3 afgedwongen** | 3 andere report-only; 24 zonder tegenhanger |
| Intune-instellingen | 1.967 | 74 | **4,2%** | 103 van 138 policies hebben nul overlap |
| Conflicten | — | 17 | — | 4 in het voordeel van de tenant |
| Compliancepolicies | 11 | 4 | — | alleen Windows eist versleuteling |
| App protection | 2 | 6 | — | defaults laten data naar privéapps |

## De vier kritieke bevindingen

**01 — Een vast lokaal-adminwachtwoord staat leesbaar in een OMA-URI-profiel.**
`9. FYG - GEN - Create local admin account for ITCE` zet een lokaal beheerdersaccount met een
vast wachtwoord, onversleuteld, op élk apparaat identiek.

```
./Device/Vendor/MSFT/Accounts/Users/itceadmin/Password        = "<geredigeerd>"
./Device/Vendor/MSFT/Accounts/Users/itceadmin/LocalUserGroup  = 2
```

`9. FYG - GEN - Windows LAPS` beheert hetzelfde account en roteert elke 7 dagen; het
OMA-URI-profiel zet bij de volgende sync de vaste waarde terug. De rotatie is daarmee geen
bescherming maar een venster. ISMP.02 eist ≥12 tekens, geen woordenboekwoorden, nooit gedeeld,
in een password manager, uniek per service — alle vijf niet gehaald. ISMP.18 voegt toe:
sleutelmateriaal nooit in platte tekst.

**02 — De blokkade op privéapparaten geldt voor één gebruiker.** `06 -01 | CA | Block Personal
Devices` heeft een correct device-filter maar `includeUsers: ["Itce OPS"]`. Voor de 908 andere
gebruikers blokkeert de policy niets.

**03 — Toegang vanaf privéapparaten vraagt alleen MFA.** `06 -02` laat `FYG-D-BYOD` bij alle
applicaties en eist uitsluitend MFA. Geen compliant device, geen app protection, geen
downloadbeperking. ISMP.08 is expliciet: niet-ingeschreven of niet-compliant apparaten zijn
*strictly prohibited*.

**04 — Er is geen enkele risicogebaseerde CA-policy.** Geen tenantpolicy zet
`signInRiskLevels` of `userRiskLevels`. De vier baselinepolicies daarvoor — `1090`, `1100`,
`2010`, `2020` — ontbreken alle vier.

Tien verdere bevindingen — legacy auth open, geen accountvergrendeling, geen auditlogging,
geen firewall, patchdeadline tot 19 dagen, Defender op `userdefined`, compliance zonder
versleuteling, app protection naar privéapps, geen AI-controles, USB onbeperkt — staan met
bewijs in [`RAPPORT-FLYINGGROUP.md`](RAPPORT-FLYINGGROUP.md).

---

# Wat CA en Intune kunnen verbeteren voor het ISMS

As 2 keek per beleidseis. Dit kijkt de andere kant op: per policyset, welke template of policy
moet erbij of anders om de pdf's te halen. Elf punten — en het opvallendste is dat er al een
leeg template klaarstaat voor het lastigste hoofdstuk.

## Conditional Access — vijf verbeteringen

| ISMS | Wat er nu is | Wat er moet gebeuren |
|---|---|---|
| **ISMP.22 · 17**<br>alleen Copilot; niet-goedgekeurde clouddiensten verboden | `1070 BLOCK Explicitly Blocked Cloud Apps` staat op `disabled` met `includeApplications: ["None"]` — leeg en uit | **Het template bestaat al; het is nooit gevuld.** Vul het met de app-id's van de verboden AI- en clouddiensten en zet het aan. Dit is de enige maatregel die AI-gebruik werkelijk bij de voordeur blokkeert — de Edge-URL-lijst is frictie, geen grens. **Grootste winst van deze lijst, en de goedkoopste.** |
| **ISMP.02**<br>inactieve sessies beëindigen, zeker op risicovolle locaties | sessieduur alleen in `3010` (beheerders) en `3020` (BYOD) | Nieuw SESSION-template met sign-in frequency voor alle gebruikers. Dekt tegelijk **CIS 5.2.2.13** — twee bronnen wijzen naar hetzelfde gat. |
| **ISMP.08**<br>onbeheerde toegang alleen via een AVD-omgeving | `2090` blokkeert browsertoegang op onbeheerde apparaten; niets wijst de AVD-route aan | Nieuw GRANT-template: op een niet-compliant apparaat alleen de AVD- en Cloud PC-apps toestaan, de rest blokkeren. Nu is het beleid half uitgevoerd — wel de blokkade, niet het voorgeschreven alternatief. |
| **ISMP.02**<br>MFA voor aviation-critical en remote systemen | `2050` sluit `AllTrusted` uit | Het ISMS noemt geen locatie-uitzondering. Óf een variant zonder de uitzondering, óf de uitzondering vastleggen als goedgekeurd besluit. Bij deze tenant geen theorie: het zet MFA uit op zes klantlocaties en op AVD. |
| **ISMP.12**<br>derdepartij-toegang met sterke authenticatie | `1080` en `1120` blokkeren gasten; geen GRANT-template voor gasten | Gasten vallen nu onder `2050`. Dat werkt, maar maakt onzichtbaar dat het ISMS een aparte eis voor derden stelt. Een expliciet gasttemplate met authenticatiesterkte, óf vastleggen dat `2050` het dekt. |

**Niet implementeerbaar.** ISMP.02 vraagt om *"restrict connection times to provide additional
security for high-risk applications"*. Conditional Access kent geen tijdsconditie; het veld
`times` staat in het schema maar is nooit geïmplementeerd. Vastleggen als bekende beperking in
plaats van als openstaand punt.

## Intune — zes verbeteringen

| ISMS | Wat er nu is | Wat er moet gebeuren |
|---|---|---|
| **ISMP.19**<br>Wi-Fi met WPA2/WPA3 en AES, 802.1X waar haalbaar | **niets** — geen enkel Wi-Fi-profiel in de baseline | Nieuw Wi-Fi-profiel per platform. **Het enige ISMS-onderwerp waar de baseline nul dekking heeft**, en een waar de tenant vandaag WPA2-Personal met een gedeelde sleutel gebruikt. |
| **ISMP.11 · 03**<br>alleen goedgekeurde, gelicentieerde en ondersteunde software | Local Administrators, Microsoft Store en Package Manager vormen een drempel, geen lijst. Device Guard zet HVCI — kernelcode, geen gebruikersmodus-allowlist | **App Control for Business (WDAC) ontbreekt.** De enige maatregel die "alleen goedgekeurde software" letterlijk afdwingt in plaats van moeilijk maakt. Beginnen in audit-modus; met FlyingSoft dat van een netwerkshare draait geen kleine stap, wel de juiste. |
| **ISMP.02**<br>vergrendeling na 6 mislukte pogingen | drempel **10**, onderbouwd met de Microsoft Security Baseline | Waarde naar 6, óf de afwijking laten vaststellen door de CISO. Het gaat niet om welke waarde beter is — het gaat erom dat de baseline iets anders zegt dan het beleid zonder dat iemand dat besloot. |
| **ISMP.22**<br>alle AI behalve Copilot verboden | URL-blokkeerlijst in Edge | Werkt niet op een telefoon, niet op een privéapparaat en niet in een andere browser. Aanvullen met Defender Web Content Filtering, categorie Generative AI, én CA-template `1070`. **De baselinedocumentatie zegt dit zelf al** — het is alleen nooit belegd. |
| **ISMP.06**<br>alleen bedrijfseigen versleutelde verwisselbare media | Removable Storage blokkeert *álle* schrijfacties | Strenger dan het beleid — maar het maakt de werkwijze die het beleid uitdrukkelijk toestaat onmogelijk. Geeft FlyingGroup versleutelde USB-sticks uit, dan is een variant met BitLocker To Go-eis nodig. Keuze maken en vastleggen. |
| **ISMP.13**<br>logs 12 maanden bewaard; beheerders wissen geen eigen regels | logbestandsgroottes in `WIN - D - Logging` | Intune kán dit niet dekken, en dat hoort geen open eind te zijn. Leg de doorvoer naar Sentinel vast als de eigenaar van deze eis. |

## Het patroon achter deze elf punten

Drie vragen echt iets nieuws: een Wi-Fi-profiel, App Control, en de AVD-route. De andere acht
zijn **bestaande onderdelen die af moeten** — een leeg template vullen, een waarde
rechttrekken, een keuze vastleggen, een eigenaar aanwijzen.

Dat is dezelfde vorm als de conclusie van het hele rapport. De baseline is niet onvolledig; hij
is niet afgemaakt. En het onderdeel dat het meest oplevert — CA-template `1070` voor het AI- en
clouddienstenbeleid — staat er al, leeg en uitgeschakeld, sinds de dag dat het is aangemaakt.

---

# Elf eisen die geen endpointbaseline kan dekken

De nuttigste uitkomst van as 2. Deze controles staan in het beleid, zijn bindend, en vallen
buiten Intune én Conditional Access. Vandaag is van geen ervan vastgelegd wie hem uitvoert.

| Eis | Bron | Waar hij thuishoort |
|---|---|---|
| In- en uitgaande e-mail gescand op malware en phishing | ISMP.11 | Exchange Online Protection / Defender for Office 365 |
| Vertrouwelijke informatie versleuteld per e-mail | ISMP.15 · 19 | Purview Message Encryption of S/MIME |
| File Integrity Monitoring op systeemkritieke bestanden | ISMP.11 | Defender for Endpoint / server-tooling |
| HIDS/NIDS op systemen met vertrouwelijke data | ISMP.11 | Defender for Endpoint / netwerkleverancier |
| Logs 12 maanden bewaard en tegen wissen beschermd | ISMP.13 | Sentinel of gelijkwaardige logdoorvoer |
| Beheerders kunnen hun eigen logregels niet wissen | ISMP.13 | logdoorvoer met scheiding van rollen |
| Dagelijkse review van beveiligingslogs | ISMP.13 | ITCE als beheerpartij, onder CIO/CISO |
| Netwerksegmentatie, VLAN's, gateways, deny-by-default | ISMP.14 | netwerkbeheer |
| Back-ups versleuteld, FIPS 140-2/3, hersteltest jaarlijks | ISMP.10 · 19 | Azure Backup / M365-retentie |
| Remote access via VPN met MFA, auto-disconnect | ISMP.02 · 08 | VPN-leverancier + CA voor de identiteitshelft |
| Camera's en opnameapparatuur beperkt in secure areas | ISMP.16 | fysieke beveiliging, niet techniek |

Twee daarvan zijn deels te dekken met licenties die FlyingGroup mogelijk al heeft:
e-mailscanning en -versleuteling zitten in Microsoft 365 E3/E5 respectievelijk Purview. De
andere negen vragen een expliciete eigenaar.

**Dit is geen bevinding over de baseline maar over het controleraamwerk eromheen** — en het is
precies het soort gat dat bij een Part-IS-audit naar boven komt, omdat het beleid de eis stelt
en niemand kan aanwijzen waar hij wordt uitgevoerd.

---

# Eén plan

Alle drie de assen samengevoegd, op volgorde.

## Direct, zonder voorbereiding

1. **Het vaste adminwachtwoord weg.** OMA-URI-profiel verwijderen, LAPS het account laten
   beheren, één keer geforceerd roteren op alle apparaten. Het huidige wachtwoord geldt als
   gecompromitteerd. *(tenant)*
2. **Legacy authenticatie werkelijk dichtzetten.** `Exchange ActiveSync-OFF` selecteert geen
   enkele applicatie en grijpt nergens op aan; `00-02` staat report-only. Eén van beide
   repareren, de andere intrekken. *(tenant)*
3. **Defender scherp zetten en lege profielen opruimen.** Lage en gemiddelde dreigingen op
   *quarantine*, PUA op *block*, definitie-interval op 1 uur. De drie profielen die niets
   configureren verwijderen. *(tenant)*

## Voorwaarde vóór uitrol

4. **De randvoorwaarden van de CA-baseline bouwen.** Zes uitzonderingsgroepen en vier named
   locations aanmaken, of de templates aanpassen op de bestaande `FYG-`-namen. Zonder dit is
   uitrol een lock-outrisico. *(baseline + tenant)*
5. **De 17 conflicten beslechten.** Voor dertien wint de baseline. Voor de vier ASR-regels en
   de locatietoegang wint de tenant — neem die over in de baseline. *(baseline)*
6. **De CA-baseline opschonen.** `OPTIONAL_TEMPLATES` aanvullen met de vijf P2-templates; een
   verplichte reden bij elke niet-`enabled` state; `2055` aanzetten en de `1090`/`1100`-
   tegenstrijdigheid oplossen. *(baseline)*
7. **De vier ISMS-gaten dichten.** Wi-Fi-profiel met WPA2/WPA3 en 802.1X; sessieduur voor alle
   gebruikers (dekt ook CIS 5.2.2.13); een AVD-route voor onbeheerde toegang; en de
   vergrendelingsdrempel 10-of-6 laten vaststellen. *(baseline · besluit CISO)*

## Uitrol

8. **Wat niemand merkt.** Auditlogging, accountvergrendeling, schermvergrendeling, firewall,
   hardening, user rights. Daarna de compliancepolicies — maar pas **ná** de
   configuratiepolicies die versleuteling inschakelen. *(tenant, één golf)*
9. **Wat mensen merken.** BYOD dichtzetten, app protection verscherpen, USB-schrijven
   blokkeren, Windows AI begrenzen, de vier risicopolicies. Eerst pilot, met aankondiging.
   *(tenant, met pilot)*

## Eigenaarschap en proces

10. **De elf controles buiten de baseline beleggen.** Per eis een eigenaar aanwijzen. Twee
    ervan zitten al in bestaande licenties. *(CIO / CISO)*
11. **De mapping bijhouden.** Een veld `isms` in `_manifest.json`, bewaakt door
    `check-scope.js`. En `npm run ca-baseline-gap` koppelen aan wijzigingen in `CATemplate/`,
    zodat de analyse niet opnieuw drie weken achterloopt. *(baseline · proces)*

## Elke wijziging in de tenant, van nu naar doel

| Wat | Nu | Doel | Stap |
|---|---|---|---:|
| **Identiteit** | | | |
| Lokaal beheerderswachtwoord | vast, leesbaar in OMA-URI, overal gelijk | alleen LAPS, 21 tekens, na geforceerde rotatie | 1 |
| Exchange ActiveSync-OFF | enabled, `includeApplications: None` | alle cloud-apps, óf intrekken en 00-02 aanzetten | 2 |
| 06-01 Block Personal Devices | `includeUsers: ["Itce OPS"]` | `All`, met BYOD en break-glass uitgezonderd | 9 |
| 06-02 Allow Personal Devices | alleen `mfa` | + compliant device of app protection, óf AVD-route | 9 |
| MFA op vertrouwde locaties | uitgezonderd via `AllTrusted` | keuze vastleggen, of uitzondering intrekken | 7 |
| Risicopolicies | geen enkele | 1090, 1100, 2010, 2020 — na 2 weken report-only | 9 |
| Landenblokkade | 20 landen, onbekende herkomst toegestaan | onbekende landen meerekenen; TW en IL heroverwegen | 2 |
| De 6 report-only policies | rapporteren, dwingen niets af | per stuk: aanzetten of intrekken | 4 |
| **Apparaat** | | | |
| Defender — lage en gemiddelde dreigingen | `userdefined` | `quarantine` | 3 |
| Defender — PUA | `audit` | `block` | 3 |
| Defender — definitie-interval | 8 uur | 1 uur | 3 |
| Windows Update | tot 19 dagen tot herstart | 3 ringen; productie deadline 2 dagen | 8 |
| Accountvergrendeling | geen | drempel 6 of 10 — CISO beslist — duur 15 min | 8 |
| Schermvergrendeling | geen | 900 seconden inactiviteit | 8 |
| Auditlogging | standaardwaarden | 44 instellingen + Audit Policy Enforcement | 8 |
| Windows Firewall | niet geconfigureerd | 3 profielen; regelset op pilot | 8 |
| Lokale beheerders | `add_update` | `add_restrict`, ná opschonen van de groep | 8 |
| Credential Guard | `lsacfgflags = 2` | `1` — met UEFI-lock | 8 |
| USB-opslag | onbeperkt | schrijven geblokkeerd, lezen toegestaan | 9 |
| Windows AI en Recall | geen enkele controle | variant *Permitted* — Copilot mag, Recall begrensd | 9 |
| **Compliance en mobiel** | | | |
| macOS-compliance | alleen SIP | + FileVault, wachtwoord, firewall — ná de FileVault-policy | 8 |
| iOS- en Android-compliance | geen versleuteling, geen toegangscode | de 4 baselinepolicies per platform | 8 |
| App protection — PIN | 4 cijfers, hergebruik toegestaan | 6 cijfers, laatste 5 geblokkeerd | 9 |
| App protection — datastroom | `allApps` | `managedApps`; klembord beperkt; Edge verplicht | 9 |
| Outlook app Android policies | `isAssigned: false` | toewijzen of verwijderen | 3 |
| **Opruimen en vaststellen** | | | |
| iOS/macOS Device restrictions | honderden velden, alle op `false` | verwijderen | 3 |
| Autopilot Reset-profiel | alleen standaardwaarden | verwijderen of herstellen | 3 |
| Toewijzingen van 32 policies | onbekend | in de portal vaststellen vóór stap 8 | 4 |
| ASR-uitsluitingen FlyingSoft | 10 brede paden met wildcards | behouden, met een herbeoordelingsdatum | 10 |

Dertig wijzigingen. Zeven daarvan kunnen vandaag — stap 1 tot en met 3 — en die vragen geen
pilot, geen groep en geen besluit.

---

De CIPP-backup bevat geen toewijzingen. Een policy die in de tenant staat maar aan niemand is
toegewezen ziet er in deze vergelijking hetzelfde uit als een policy die overal geldt; waar
dat het oordeel raakt staat het bij de bevinding. Instellingen zijn uitgeklapt met
`flattenSettings` uit [`scripts/lib/templates.js`](scripts/lib/templates.js), zodat beide sets
op dezelfde manier zijn behandeld.

Detailrapporten: [de tenanttoetsing](RAPPORT-FLYINGGROUP.md) en
[de CA-gapanalyse](../CA-Policies/ANALYSE.md).
