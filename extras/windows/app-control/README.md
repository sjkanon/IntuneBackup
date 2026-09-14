# App Control for Business (WDAC) — generiek startpunt

De grootste inhoudelijke leemte van de baseline (ANALYSE.md, *Bewust niet overgenomen*):
er was geen applicatiecontrole. Dit is het generieke deel dat voor elke tenant hetzelfde is.
De uitzonderingen die daarna volgen zijn per organisatie en horen **niet** in deze repo.

| | |
|---|---|
| **Controls** | ISO A.8.19 Installatie van software op operationele systemen, A.8.7 Bescherming tegen malware · NIS2 art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden · CIS Controls v8.1 2.5 Allowlist Authorized Software, 2.6 Allowlist Authorized Libraries, 2.7 Allowlist Authorized Scripts · NIST CSF 2.0 PR.PS-05 |
| **Benchmark** | CIS Controls IG2/IG3; ASD Essential Eight *Application control* (maturity level 1); Microsoft *App Control for Business design guide* |
| **Voorwaarden** | Windows 11 Pro/Enterprise/Education (Pro met de update van november 2022 of later), ingeschreven in Intune; co-managed: workload *Endpoint Protection* op Intune. Advanced Hunting vraagt Defender for Endpoint P2 of Business. |

## Waarom dit geen template in `IntuneTemplate/` is

App Control-policies zijn Endpoint security-policies op template
`d3849ba8-bf95-467c-9640-aa2334eae9e3_1` (*App Control for Business*, family
`endpointSecurityApplicationControl`; zo bestaat hij in `pl4nty/intune-change-tracking`
DCv2/Templates en zo gebruikt Microsoft365DSC hem). Zo'n body vraagt per instelling een
`settingInstanceTemplateId`. Die id staat **niet** in de definitiebron — pl4nty spiegelt de
templates zonder hun `settingTemplates` — en de enige vindplaats die we hadden (een unit-test-mock
in Microsoft365DSC) is geen bewijs. De SPEC staat alleen verifieerbare ids toe, dus de body staat
hier met een placeholder en een script dat de echte id uit de eigen tenant haalt.

Wat wél geverifieerd is tegen `DCv2/Settings/` (id, type, geldige `itemId`'s):

| settingDefinitionId | Waarde audit | Waarde afdwingen |
|---|---|---|
| `device_vendor_msft_policy_config_applicationcontrolv2_buildoptions` | `…_built_in_controls_selected` | idem |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_auditmode` | `…_auditmode_enabled` | `…_auditmode_disabled` |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_trustappswithgoodreputation` | `…_enabled` | `…_enabled` |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_trustappsfrommanagedinstaller` | `…_enabled` | `…_enabled` |

De oudere variant op template `4321b946-b76b-4450-8afd-769c08b16ffc_1`
(`applicationcontrol_policies_{policyguid}_policiesoptions` → `built_in_controls` →
`enable_app_control` + `trust_apps`) bestaat nog, maar Microsoft365DSC en de huidige portal
gebruiken de v2-ids. Neem die niet naast deze op.

## Bestanden

| Bestand | Wat |
|---|---|
| `AppControl_BuiltIn_Audit.graph.json` | `POST /beta/deviceManagement/configurationPolicies` — Windows-onderdelen + Store-apps vertrouwd, ISG (goede reputatie) en managed installer vertrouwd, **auditmodus**. Naam `[Baseline] - WIN - D - App Control Audit`. |
| `AppControl_BuiltIn_Enforce.graph.json` | Zelfde body, **afdwingen**. Naam `[Baseline] - WIN - D - App Control Enforced`. Nooit tegelijk met de audit-policy op hetzelfde apparaat. |
| `Set-AppControlTemplateIds.ps1` | Haalt de `settingInstanceTemplateId` (en `settingValueTemplateId`) uit `GET /beta/deviceManagement/configurationPolicyTemplates('d3849ba8-bf95-467c-9640-aa2334eae9e3_1')/settingTemplates`, vult ze in beide bodies in en maakt desgewenst de policies aan (`-Create`, geen toewijzing). |
| `hunting-queries.kql` | Advanced Hunting-queries voor de auditfase en de bewaking na afdwingen. |

## Het proces

Applicatiecontrole is geen instelling maar een project. De volgorde hieronder is die van de
Microsoft-documentatie, vertaald naar de fases van deze baseline.

### 0. Managed installer aanzetten — nu, zonder gevolgen

Intune admin center → **Endpoint security → App Control for Business → Managed installer →
Create**, *Enable Intune Managed Extension as Managed Installer* = **Enabled**, toewijzen aan
alle Windows-apparaten.

- Vanaf dat moment krijgt **elke app die Intune installeert** (Win32, LOB, Store via IME) het
  managed-installer-label. Het label doet op zichzelf niets: pas een App Control-policy met
  *Trust apps from managed installers* maakt er een toestemming van.
- **Niet met terugwerkende kracht.** Wat al geïnstalleerd is, heeft geen label. Juist daarom
  eerst dit, dan weken audit, dan pas afdwingen.
- Intune zet hiervoor een AppLocker-policy met een dummy-regel neer. Staat er al AppLocker-beleid
  met een lege *NotConfigured* RuleCollection, dan kan die samenvoeging alles blokkeren
  (tot en met aanmelden) — verwijder zulke collecties vooraf. Staat AppLocker nergens, dan is
  er niets aan de hand.
- Microsoft beschrijft dit sinds augustus 2025 als policy per groep in plaats van één
  tenantinstelling; Graph kent er geen stabiel, gedocumenteerd type voor dat CIPP draagt —
  vandaar een handmatige stap.

### 1. Audit — fase 2, pilotgroep, daarna alle apparaten

Maak `AppControl_BuiltIn_Audit.graph.json` aan (zie *Uitrol*) en wijs toe aan de pilotgroep
(`SEC-Baseline-Pilot`), na een week aan alle Windows-apparaten. In auditmodus draait alles
door; Windows logt per bestand dat **zou** zijn geblokkeerd:

| Gebeurtenis | Logboek | Advanced Hunting `ActionType` |
|---|---|---|
| 3076 — zou geblokkeerd zijn (audit) | Microsoft-Windows-CodeIntegrity/Operational | `AppControlCodeIntegrityPolicyAudited` |
| 3077 — geblokkeerd (afdwingen) | idem | `AppControlCodeIntegrityPolicyBlocked` |
| 3089 — handtekeninginformatie bij 3076/3077 | idem | `AppControlCodeIntegritySigningInformation` |
| 3090/3091/3092 — toegestaan/geaudit/geblokkeerd op ISG of managed installer | idem | `AppControlCodeIntegrityOrigin*` |
| 8028/8029 — script/MSI geaudit/geblokkeerd | Microsoft-Windows-AppLocker/MSI and Script | `AppControlCIScriptAudited` / `…Blocked` |
| 3099 — policy geladen | CodeIntegrity/Operational | `AppControlCodeIntegrityPolicyLoaded` |

Laat de audit minstens **30 dagen** lopen, inclusief een maandafsluiting: periodieke tools
(salarisverwerking, jaarafsluiting, printerdrivers) verschijnen anders pas na afdwingen.
Vergroot vooraf het CodeIntegrity-logboek met `../event-log-sizes/`.

### 2. Uitzonderingen — per organisatie

Query 2 en 3 in `hunting-queries.kql` geven per bestand: pad, uitgever, hash, hoeveel
apparaten. Per regel een besluit:

1. **Via Intune (her)installeren** — de voorkeur. Krijgt het managed-installer-label en valt
   vanzelf onder de basispolicy. Geldt vooral voor apps die vóór stap 0 zijn uitgerold.
2. **Supplemental policy** — voor wat niet via Intune komt (door de gebruiker bijgewerkte
   ontwikkeltools, portable apps van leveranciers). Maak XML met de
   [App Control Policy Wizard](https://webapp-wdac-wizard.azurewebsites.net/) of
   `New-CIPolicy -Level Publisher -Fallback Hash`, zet `BasePolicyID` op het PolicyID van de
   ingebouwde-controls-combinatie, en rol uit via **Create Policy → Enter xml data** met dezelfde
   toewijzing als de basispolicy. Voor audit + ISG + managed installer is dat PolicyID
   `{2DA0F72D-1688-4097-847D-C42C39E631BC}` (Microsoft Learn, *Manage App Control*). Voorkeur:
   uitgeverregels boven hashregels (hashes breken bij elke update), nooit padregels op
   door gebruikers beschrijfbare paden.
3. **Weghalen** — software die er niet hoort. Dan is de audit al de winst.

Deze uitzonderingen zijn organisatiespecifiek en horen in de eigen tenant, niet in deze repo.

### 3. Afdwingen — fase 4

Pas als query 2 over zeven dagen niets onbekends meer toont: wijs
`AppControl_BuiltIn_Enforce.graph.json` toe aan een groep `SEC-AppControl-Enforced` en
**haal die groep uit de toewijzing van de audit-policy**. Beide policies hebben hetzelfde
PolicyID; op één apparaat botsen ze. Uitbreiden per afdeling, niet in één keer.

Afdwingen vraagt geen herstart (rebootless base policy). Wel:

- **Terugdraaien:** eerst de audit-policy weer toewijzen (of een `AllowAll`-policy), pas daarna
  de afdwing-policy verwijderen. Een verwijderde App Control-policy blijft tot de volgende herstart
  actief; Microsoft waarschuwt daarnaast voor opstartproblemen bij het verwijderen of uitschrijven
  van apparaten met afgedwongen policies — volg *Remove App Control policies causing boot stop
  failures* op Microsoft Learn.
- **Bewaken:** query 1 en 4 dagelijks; elke 3077 is een gebruiker die iets niet kon starten.

## Uitrol

```powershell
Connect-MgGraph -Scopes DeviceManagementConfiguration.ReadWrite.All
./Set-AppControlTemplateIds.ps1              # vult de placeholders in, schrijft *.resolved.json
./Set-AppControlTemplateIds.ps1 -Create      # idem, en maakt beide policies aan zonder toewijzing
```

Via CIPP: vul eerst de ids in met het script, en importeer de `*.resolved.json` als
Endpoint security-template in de eigen CIPP-instantie; CIPP's `IntuneTemplate`-type draagt het
`templateReference`-blok mee.

## Wat dit níet dekt

- **Smart App Control** — alleen op schoon geïnstalleerde apparaten, niet centraal te beheren
  en schakelt zichzelf uit op beheerde toestellen. Geen alternatief voor dit project.
- **AppLocker-profielen** onder Attack surface reduction — door Microsoft uitgefaseerd ten gunste
  van de ApplicationControl-CSP.
- **Stuurprogramma's** — de Microsoft vulnerable driver blocklist staat al aan via HVCI
  (Device Guard and Credential Guard) en de ASR-regel *Block abuse of exploited vulnerable signed
  drivers*.
