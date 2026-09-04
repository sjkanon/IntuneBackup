# Baselinetoetsing FlyingGroup

Handgeschreven rapport, 3 september 2026. Toetst de tenant **flyinggroup.aero** tegen drie
maatstaven tegelijk: de afgesproken Conditional Access-baseline, de Intune-baseline in deze
repository, en de tweeëntwintig ISMS-beleidsdocumenten van FlyingGroup zelf.

| Bron | Wat het is |
|---|---|
| `flyinggroup.aero_2026-09-02-0817.json` | CIPP `ScheduledBackup` van 2 september 2026 — 16 CA-policies, 28 Intune-configuratiepolicies, 4 compliancepolicies, 6 app protection-policies, 908 gebruikers, 651 groepen |
| [sjkanon/CA-Policies](https://github.com/sjkanon/CA-Policies/tree/main/CATemplate) | 33 CA-templates, genummerd `1xxx` BLOCK / `2xxx` GRANT / `3xxx` SESSION |
| [`IntuneTemplate/`](IntuneTemplate/) | 138 policies, 1.967 instellingen over vier platformen |
| 24 ISMS-documenten | ISDP.01–02 en ISMP.01–22, revisie 1, ingangsdatum 11 mei 2026 |

## In cijfers

| | |
|---|---|
| CA-baselinepolicies met een **afgedwongen** tegenhanger | **3 van 33** — drie andere staan alleen in report-only |
| Intune-instellingen die de baseline zet en de tenant ook | **82 van 1.967** (4,2%) |
| Baselinepolicies met **nul** overlap | **103 van 138** |
| Instellingen die beide zetten, op een **andere waarde** | **17** — elk daarvan levert bij uitrol een Conflict op |
| Harde ISMS-eisen die technisch **niet** zijn afgedwongen | **11** |

## Verantwoording

**Conditional Access.** De 33 templates zijn ontleed tot hun structurele opzet — `clientAppTypes`,
platforms, applicaties, risiconiveaus, grant- en session-controls, rollen, groepen en named
locations — en gelegd naast de 16 policies in de tenant. Individuele gebruikersuitsluitingen
tellen niet mee. `state` telt niet mee voor de match maar wél voor het oordeel: een structureel
kloppende policy op report-only dwingt niets af.

**Intune.** Vergeleken op `settingDefinitionId`, nooit op profielnaam — twee profielen die allebei
"Firewall" heten kunnen niets gemeen hebben, en twee die anders heten kunnen dezelfde instelling
op een andere waarde zetten. Dat laatste is precies wat een Conflict oplevert. Beide sets zijn
uitgeklapt met dezelfde `flattenSettings` uit [`scripts/lib/templates.js`](scripts/lib/templates.js),
zodat een `GroupSettingCollection` als container geldt en niet als instelling.

**ISMS.** Uit de 24 documenten zijn de harde, technisch toetsbare eisen gelicht — eisen met een
getal of een afdwingbaar mechanisme erin, geen intenties. Die zijn teruggezocht in zowel de
baseline als de tenant.

> **Voorbehoud.** De CIPP-backup bevat de policies en hun inhoud, maar **niet hun toewijzingen**.
> Een policy die in de tenant staat maar aan niemand is toegewezen ziet er in deze vergelijking
> hetzelfde uit als een policy die overal geldt. Waar dat het oordeel raakt staat het erbij. De
> vier legacy Device-profielen (Windows Update, Wi-Fi, Windows Hello, certificaat) zijn beoordeeld
> op de eigenschappen van hun profieltype, niet op `settingDefinitionId` — die kennen ze niet.

---

# Bevindingen

Veertien punten, op volgorde van urgentie. Elke bevinding noemt het bewijs uit de export en, waar
van toepassing, de bepaling uit het beleid die er niet mee wordt gehaald.

## 1. Een vast lokaal-adminwachtwoord staat leesbaar in een OMA-URI-profiel — kritiek

Het profiel **9. FYG - GEN - Create local admin account for ITCE** zet via een custom OMA-URI een
lokaal beheerdersaccount met een vast wachtwoord. De waarde staat als `omaSettingString` in het
profiel — onversleuteld, dus ook onversleuteld in de backup en in elke kopie daarvan. Het is één
woordcombinatie van 17 tekens, en hij is op élk apparaat identiek: wie hem op één toestel afleest,
is lokaal beheerder op alle.

```
./Device/Vendor/MSFT/Accounts/Users/itceadmin/Password        = "<REDACTED — zie de export>"
./Device/Vendor/MSFT/Accounts/Users/itceadmin/LocalUserGroup  = 2
```

Daar komt bij dat **9. FYG - GEN - Windows LAPS - ITCE Localadmin** hetzelfde account beheert en
het wachtwoord elke 7 dagen roteert. Twee policies die hetzelfde wachtwoord zetten, elk op hun
eigen moment — LAPS roteert, het OMA-URI-profiel zet bij de volgende sync de vaste waarde terug.
De rotatie is daarmee geen bescherming maar een venster.

**ISMP.02** eist voor bevoorrechte accounts: minimaal 12 tekens, geen woordenboekwoorden, nooit
gedeeld, opgeslagen in een goedgekeurde password manager, en *"credentials for service accounts
with privileged access must be unique per service"*. Alle vijf niet gehaald.

**Herstel.** Verwijder het OMA-URI-profiel en laat LAPS het account alleen beheren. Roteer daarna
handmatig één keer op alle apparaten — het huidige wachtwoord moet als gecompromitteerd gelden.
Behandel de backup zelf als vertrouwelijk.

## 2. De blokkade op privéapparaten geldt voor één gebruiker — kritiek

**06 -01 | CA | Block Personal Devices** staat op `enabled` en ziet er goed uit: een device-filter
op `deviceOwnership -eq "Personal"`, alle apps, Windows en macOS. Maar het bereik is niet "alle
gebruikers" — het is één account.

```json
"users": { "includeUsers": ["Itce OPS"], "excludeUsers": ["ITCE|admin"],
           "includeGroups": [], "excludeGroups": ["FYG-D-BYOD"] }
```

Voor de 908 andere gebruikers blokkeert deze policy niets. De uitzonderingsgroep `FYG-D-BYOD`
suggereert een uitgewerkt ontwerp — maar het ontwerp is nooit op de organisatie gezet.

**ISMP.08:** *"Devices that are not enrolled, not compliant, or not supported by Intune are
strictly prohibited from accessing FlyingGroup systems and data."*

**Herstel.** `includeUsers` op `All`, met `FYG-D-BYOD` plus break-glass als uitzondering. Eerst
report-only: dit raakt iedereen die vandaag vanaf een niet-ingeschreven laptop werkt.

## 3. Toegang vanaf privéapparaten vraagt alleen MFA — kritiek

**06 -02 | CA | Allow Access from Personal Devices** laat de groep `FYG-D-BYOD` bij alle
applicaties met browser en desktopclients, en eist daarvoor één ding: MFA, met een
sessiefrequentie van 3 uur. Geen `compliantDevice`, geen `compliantApplication`, geen app
protection-eis, geen beperking op downloads.

```json
"grantControls": { "operator": "OR", "builtInControls": ["mfa"] }
"applications":  { "includeApplications": ["All"] }
```

De BYOD-route is daarmee in de praktijk: authenticeer met MFA en je hebt vanaf een onbeheerd
toestel toegang tot alles. De baseline lost dit in drie policies op — **2060** (compliant device
voor desktopclients), **2090** (browsertoegang alleen vanaf beheerde apparaten) en **3040** (geen
downloads op onbeheerde apparaten). Geen van drieën bestaat hier.

**ISMP.08:** *"Conditional Access controls must be enforced to restrict access to compliant
devices only"* en *"Access from unmanaged devices is only permitted through an approved Virtual
Desktop environment where no data is stored locally."*

**Herstel.** Kies één van de twee lijnen die het beleid toestaat: apparaten inschrijven en
compliant eisen, óf onbeheerde toegang naar de AVD-omgeving leiden en 06-02 intrekken. De huidige
derde weg staat niet in het beleid.

## 4. Er is geen enkele risicogebaseerde CA-policy — kritiek

Vier baselinepolicies vertalen het signaal van Identity Protection naar een besluit. Alle vier
ontbreken, en geen enkele tenantpolicy zet `signInRiskLevels` of `userRiskLevels`.

| Baseline | Wat het doet | Tenant |
|---|---|---|
| **1090** BLOCK High-Risk Sign-Ins | blokkeert een aanmelding met risico *high* | ontbreekt |
| **1100** BLOCK High-Risk Users | blokkeert een gebruiker met risico *high* | ontbreekt |
| **2010** GRANT Medium-Risk Sign-ins | MFA bij elke aanmelding, risico *medium* | ontbreekt |
| **2020** GRANT Medium-Risk Users | MFA bij elke aanmelding, risico *medium* | ontbreekt |

Een gestolen sessietoken of een aanmelding vanaf een bekend botnet-IP levert vandaag wél een
risicoscore op in Entra, maar geen enkele reactie.

**ISMP.02:** *"Authentication interfaces are hardened to prevent information leakage or
brute-force attacks"* en *"Raise a security event if a potential attempted or successful breach of
log-on controls is detected"*.

**Herstel.** 1090 en 2010 (aanmeldrisico) direct, 1100 en 2020 (gebruikersrisico) na een week
report-only. Vereist Entra ID P2.

## 5. Legacy authenticatie wordt niet geblokkeerd — hoog

Twee policies gaan hierover, en samen doen ze niets.

```
00-02 | BLOCK | LegacyAuth    state: enabledForReportingButNotEnforced
Exchange ActiveSync-OFF       state: enabled
                              "applications": { "includeApplications": ["None"] }
```

De eerste rapporteert alleen. De tweede is afgedwongen maar heeft geen enkele applicatie
geselecteerd en grijpt dus nergens op aan. Legacy authenticatie — `exchangeActiveSync` en `other`,
de protocollen zonder MFA-ondersteuning — staat daarmee open.

Dit is onderdeel van een breder patroon: **6 van de 16** CA-policies staan op report-only, en het
zijn precies de zes uit het genummerde `00-`/`02-`/`03-`/`05-`-ontwerp. Er is een doordacht nieuw
CA-model gebouwd en klaargezet, maar nooit scherp gezet. Ondertussen doet het oude model (Default
MFA Policy, Blocked countries, MFA - Directory Roles) het werk.

**Herstel.** Selecteer in **Exchange ActiveSync-OFF** alle cloud-apps, of zet **00-02** op enabled
en trek de andere in. Twee policies voor één besluit is hier de oorzaak van de fout.

## 6. Geen accountvergrendeling en geen schermvergrendeling — hoog

| ISMS-eis | Baseline zet | Tenant |
|---|---|---|
| Lock after 6 failed attempts (ISMP.02) | `devicelock_accountlockoutpolicy` — drempel **10**, duur 15 min | niets |
| Re-authenticate after 15 minutes of inactivity (ISMP.02, ISMP.07) | `interactivelogon_machineinactivitylimit_v2` = **900** | niets |
| Wachtwoord ≥ 10 tekens, historie 4 (ISMP.02) | lengte **14**, historie **24** | niets |

Met een gestolen laptop kan iemand onbeperkt blijven proberen, en een onbeheerd toestel blijft
ontgrendeld staan. De baselinepolicies `WIN_D_Account_Lockout`, `WIN_D_Device_Lock` en
`WIN_D_Local_Security_Policies` dekken alle drie en staan alle drie op 0%.

> **De baseline wijkt hier zelf af van het beleid.** ISMP.02 eist vergrendeling na **6** mislukte
> pogingen; de baseline staat op **10**, met als onderbouwing dat 5 gebruikers te makkelijk
> buitensluit en 10 de waarde van de Microsoft Security Baseline is. Verdedigbaar, maar niet wat
> het beleidsdocument zegt. Kies bewust: baseline naar 6, of de afwijking vastleggen als
> goedgekeurde uitzondering bij de CISO.

## 7. Auditlogging op het endpoint staat niet aan — hoog

ISMP.13 somt op wat een logregel moet bevatten: gebruikers-ID's, aan- en afmeldtijden,
apparaat-ID's en IP-adressen, geslaagde én mislukte toegangspogingen, gebruik van privileges en
systeemhulpprogramma's, bestandstoegang, wijzigingen in systeemconfiguratie. Op Windows komt dat
uit de geavanceerde auditcategorieën — en die staan op de standaardwaarde.

```
WIN - D - Audit and Event Logging    40 instellingen    dekking 0%
WIN - D - Audit Policy Enforcement    1 instelling      dekking 0%
WIN - D - Logging                     3 instellingen    dekking 0%
```

Zonder *Audit Policy Enforcement* kunnen de subcategorie-instellingen bovendien stilzwijgend
overruled worden door de oude categorie-instellingen: de audit staat dan wel geconfigureerd, maar
geldt niet.

ISMP.13 eist ook 12 maanden logbewaring. Dat vraagt naast de auditinstellingen een doorvoer naar
Sentinel of gelijkwaardig — buiten het bereik van Intune, maar wel onderdeel van dezelfde eis.

## 8. De Windows Firewall is nergens geconfigureerd — hoog

**WIN - D - Windows Firewall** (35 instellingen) en **WIN - D - Windows Firewall Rules** (48
regels) hebben geen enkele tegenhanger. Geen profielconfiguratie voor domein, privé of openbaar,
geen regelset, geen instelling voor *local policy merge*.

**ISMP.14** — netwerkbeheer volgens least privilege met gehardde eindpunten. **ISMP.11** —
*"Removing or disabling unnecessary ports, services, and applications"*.

**Herstel.** Firewall vóór de regelset, en de regelset op een pilotgroep beginnen: 48 regels op
een werkplek met branchesoftware die van een netwerkshare draait vraagt om verificatie.

## 9. De patchdeadline haalt de eigen termijn voor kritieke kwetsbaarheden niet — hoog

ISMP.21 legt vier termijnen vast: kritiek binnen 7 dagen, belangrijk binnen 30, gemiddeld binnen
70, laag op beoordeling. Het profiel **FYG Windows Update Policy** telt in het slechtste geval op
tot 19 dagen.

```
qualityUpdatesDeferralPeriodInDays  5
deadlineForQualityUpdatesInDays     7
deadlineGracePeriodInDays           7
                                   --
                                   19 dagen tot afgedwongen herstart
```

Twee dingen daarnaast. `updateNotificationLevel` staat op `disableAllNotifications`: de gebruiker
ziet niets aankomen en wordt door de deadline overvallen. En `allowWindows11Upgrade` staat op
`false`, terwijl er een feature-updateprofiel klaarstaat dat **Windows 11, version 24H2** uitrolt
met einde support op 12 oktober 2027 — die twee werken tegen elkaar.

**Herstel.** Deferral naar 0, deadline naar 3, grace naar 1 voor de productiering; en
`allowWindows11Upgrade` op true of het feature-updateprofiel intrekken. De baseline heeft drie
ringen (pilot / UAT / productie) waarmee de 7-dagentermijn ruim gehaald wordt.

## 10. Defender laat lichte en gemiddelde dreigingen aan de gebruiker — hoog

| Instelling | Tenant | Baseline |
|---|---|---|
| Lage dreigingen | **userdefined** | quarantine |
| Gemiddelde dreigingen | **userdefined** | quarantine |
| PUA-bescherming | **audit** (2) | block (1) |
| Interval definitie-update | **8 uur** | 1 uur |

*userdefined* betekent dat de eindgebruiker beslist wat er met een gevonden dreiging gebeurt.
*audit* bij PUA betekent dat ongewenste software wordt gelogd maar niet tegengehouden.

**ISMP.11** eist dat antivirus *"automatically quarantine or repair infected files"* en *"cannot be
disabled or modified by end users"*. Bij *userdefined* geldt geen van beide.

> **Waar de tenant strénger is.** Vier ASR-regels staan hier op *block* terwijl de baseline ze op
> *warn* of *audit* zet. Dat is de betere keuze — neem die vier waarden over in de baseline in
> plaats van andersom. Tamper Protection staat aan, wat de "cannot be disabled" uit ISMP.11 wél
> afdekt.

## 11. Geen enkele compliancepolicy buiten Windows eist versleuteling — hoog

| Policy | Wat het eist | Versleuteling |
|---|---|---|
| **Windows 10 Default Policy** | BitLocker, storage encryption, Defender, RTP, signature up-to-date | ja |
| **MacOS Default Policy** | alleen System Integrity Protection | nee |
| **FYG iOS compliance policy** | jailbreak-detectie, MDE low | nee |
| **FYG Android Compliancy** | root-detectie, SafetyNet *basic* | nee |

Geen van de vier stelt een wachtwoord- of toegangscode-eis: alle vier staan op
`passwordRequiredType: deviceDefault` zonder `passwordRequired`. De macOS-policy eist geen
FileVault. De Android-policy staat op SafetyNet *basic* in plaats van *hardwareBacked*, en op
wachtwoordcomplexiteit *none*.

**ISMP.19:** *"Mobile devices, laptops, and removable storage… must implement full disk
encryption"* en *"Encryption must never be disabled"*. **ISMP.08:** mobiele apparaten moeten
*"Encryption enabled (e.g., AES-256)"* en *"password/PIN and auto-lock functionality"* hebben.

**Herstel.** De baseline heeft elf compliancepolicies, gesplitst per onderwerp (Device Health /
Device Security / Password) zodat een gebruiker in het bericht ziet wát er mis is. Let op de
volgorde: een compliancepolicy die versleuteling eist zonder een configuratiepolicy die
versleuteling inschakelt, zet gebruikers op rood zonder dat ze er iets aan kunnen doen.
FileVault- en BitLocker-policy eerst.

## 12. App protection laat bedrijfsdata naar privéapps stromen — hoog

| Instelling | Tenant | Baseline |
|---|---|---|
| Uitgaande gegevensoverdracht | **allApps** | managedApps |
| Klembord | **allApps** | managedAppsWithPasteIn |
| Minimale PIN-lengte | **4** | 6 |
| PIN-hergebruik | **toegestaan** | laatste 5 geblokkeerd |
| Meldingen op vergrendelscherm | **allow** | blockOrganizationalData |
| Schermafdruk | **niet geblokkeerd** | geblokkeerd |
| Beheerde browser | **notConfigured** | Edge, verplicht |
| Back-up van appgegevens | **toegestaan** | geblokkeerd |

**ISMP.04** — vertrouwelijke informatie vraagt *"Access controls, including password or MFA
protection"* en versleuteling. **ISMP.15** — informatieoverdracht buiten beheerde kanalen vereist
goedkeuring en logging; een klembordkopie naar een privéapp is precies zo'n overdracht.

**Herstel.** `IOS_U_App_Protection` en `AND_U_App_Protection` vervangen de defaults één op één.
Verwachte gebruikersimpact: PIN van 4 naar 6 cijfers en geen kopiëren meer naar privéapps — dat
merken mensen, dus aankondigen.

## 13. Het AI-beleid verbiedt alles behalve Copilot, maar niets houdt dat tegen — middel

ISMP.22 is expliciet: alleen Microsoft Copilot, Copilot Pro en GitHub Copilot (alleen voor
ontwikkeling) zijn toegestaan; *"All other AI tools are prohibited"*, en AI mag niet worden
gebruikt in HR- en juridische processen of om medewerkersgegevens te analyseren. In de tenant
staat geen enkele instelling die dit ondersteunt.

Alle acht AI-policies in de baseline staan op 0% dekking: `WIN_D_AI_Tooling`,
`WIN_D_Windows_AI_Restricted` / `_Permitted`, `WIN_D_Windows_AI_Features_Restricted` /
`_Permitted`, `WIN_D_Windows_AI_Recall_Boundaries`, `WIN_U_Copilot`,
`WIN_U_AI_Usage_Control_Restricted` / `_Permitted`.

Concreet: Windows Recall en Click To Do staan niet uit. Recall maakt periodiek schermafdrukken van
alles wat op het scherm staat — inclusief passagiersgegevens en onderhoudslogs, die onder ISMP.04
dezelfde classificatie krijgen als het origineel.

**Herstel.** Gegeven de AI Usage Table is de variant *Permitted* de passende: Copilot mag, de rest
niet, Recall begrensd. Rol niet beide varianten uit — dat levert een Conflict op.

## 14. Verwisselbare media onbeperkt, lokale beheerdersgroep niet dichtgezet — middel

**USB-opslag.** Geen enkele policy beperkt schrijven naar verwisselbare opslag. ISMP.06 staat
alleen *"company-issued and encrypted mobile storage devices"* toe, geautoriseerd door CIO of CISO
en geregistreerd in het Asset Register; ISMP.15 herhaalt dat voor gegevensoverdracht. Technisch
dwingt niets dat af. `WIN_D_Removable_Storage` blokkeert schrijven en laat lezen toe — gegevens
mogen naar binnen, niet naar buiten.

**Lokale beheerders.** **FYG-MAINTENANCE-ADMINS** gebruikt `add_update` waar de baseline
`add_restrict` gebruikt.

```
TENANT    localusersandgroups…accessgroup_action = add_update
BASELINE  localusersandgroups…accessgroup_action = add_restrict
```

*add_update* voegt toe en laat bestaande leden staan; *add_restrict* maakt de groep gelijk aan de
opgegeven lijst en verwijdert de rest. Wie ooit lokaal beheerder is geworden — bij een migratie,
een leverancier, een oude image — blijft dat.

**ISMP.02:** *"Access control is governed by the principle of least privilege"* en *"A privileged
access register is maintained and reviewed"*. Zonder `add_restrict` is dat register niet af te
dwingen.

**Herstel.** `add_restrict` pas ná het opschonen van de huidige groepsleden, anders sluit je
iemand buiten die nog nodig is.

---

# Conditional Access — 33 tegenover 16

Gematcht op structuur, niet op naam.

| Baselinepolicy | Tegenhanger in de tenant | Oordeel |
|---|---|---|
| **1010** BLOCK Legacy Authentication | 00-02 \| BLOCK \| LegacyAuth + Exchange ActiveSync-OFF | report-only / zonder apps |
| **1020** BLOCK Device Code Auth Flow | — | ontbreekt *(baseline zelf disabled)* |
| **1030** BLOCK Unsupported Device Platforms | — | ontbreekt *(baseline zelf disabled)* |
| **1040** BLOCK Countries not Allowed | 00-01 \| BLOCK \| AllCountries | report-only |
| **1050** BLOCK High-Risk Countries | Blocked countries | **afgedwongen** |
| **1060** BLOCK Service Accounts | 03-01 \| MFA \| SMTP | report-only |
| **1070** BLOCK Explicitly Blocked Cloud Apps | — | ontbreekt *(klantkeuze)* |
| **1080** BLOCK Guest Access to Sensitive Apps | — | ontbreekt |
| **1090** BLOCK High-Risk Sign-Ins | — | ontbreekt |
| **1100** BLOCK High-Risk Users | — | ontbreekt |
| **1110** BLOCK Unlicensed Users | — | ontbreekt |
| **1120** BLOCK Guest Access Outside Approved Apps | — | ontbreekt |
| **1130** BLOCK Admins From Untrusted Locations | — | ontbreekt |
| **1140** BLOCK Managed Identities At Risk | — | ontbreekt |
| **2010** GRANT Medium-Risk Sign-ins | — | ontbreekt |
| **2020** GRANT Medium-Risk Users | — | ontbreekt |
| **2050** GRANT MFA for All Users | Default MFA Policy | **afgedwongen** — zwakker, zie onder |
| **2055** GRANT Phishing Resistant MFA for Admins | — | ontbreekt |
| **2060** GRANT Mobile Apps and Desktop Clients | — | ontbreekt |
| **2070** GRANT Mobile Device Access Requirements | 05-01 (groep) · 05-02 (report-only) | deels |
| **2080** GRANT MFA For Device Registration | — | ontbreekt |
| **2090** GRANT Browser Access On Unmanaged Devices | 06 -01 \| Block Personal Devices | één gebruiker |
| **2100** GRANT MFA For Admin Portals | Microsoft-managed: MFA for admins… | **afgedwongen** |
| **2110** GRANT Token Protection | — | ontbreekt |
| **2120** GRANT Phishing Resistant MFA for All Users | — | ontbreekt |
| **2130** GRANT Admins Compliant Device | — | ontbreekt |
| **2150** GRANT Cloud PC Mobile Access | — | ontbreekt |
| **3010** SESSION Admin Persistence | — | ontbreekt |
| **3020** SESSION BYOD Persistence | 06 -02 \| Allow Access from Personal Devices | deels |
| **3030** SESSION Register Security Info Requirements | — | ontbreekt |
| **3040** SESSION Block File Downloads On Unmanaged Devices | — | ontbreekt |
| **3050** SESSION Continuous Access Evaluation | — | ontbreekt |
| **3060** SESSION Defender for Cloud Apps | — | ontbreekt *(licentie)* |

## Waar de aanwezige policies afwijken

**Default MFA Policy** dekt 2050, met drie verzwakkingen: hij sluit `AllTrusted`-locaties uit (MFA
vervalt op vertrouwde IP-adressen), hij sluit de groep `FYG-MFA-OFF` uit, en hij gebruikt de
ingebouwde control `mfa` in plaats van de authenticatiesterkte *Multifactor authentication*. De
sessiefrequentie staat op 30 dagen. ISMP.02 eist MFA voor *"aviation-critical or remote systems"* —
een locatie-uitzondering is verdedigbaar voor kantoorlocaties, `FYG-MFA-OFF` niet zonder
vastgelegde uitzondering.

**MFA - Directory Roles** heeft geen tegenhanger in de baseline en is een aanwinst: MFA op tien
beheerdersrollen, met alleen de AVD-NAT-gateway uitgezonderd. Wel op `mfa` en niet op
phishing-bestendig — dat is wat 2055 toevoegt.

**Het AVD-ontwerp** — *MFA op AVD verplicht (persistent)*, de NAT-gateway als named location, de
zes klantlocaties — is tenant-eigen en komt in de baseline niet voor. Dat hoort zo te blijven;
neem het niet weg bij het uitrollen van de baseline, en overweeg het als klantuitzondering vast te
leggen.

## Voorwaarde vóór uitrol

De baselinetemplates verwijzen naar **zes groepen die in deze tenant geen van alle bestaan**:

```
Excluded from Conditional Access
Conditional Access Service Accounts
Licensed Users
Excluded from Legacy Authentication Block
Excluded from Device Code Auth Flow Block
Excluded from Country Block List
```

Ook de named locations `High-Risk Countries`, `Allowed Countries` en
`Service Accounts Trusted IPs` ontbreken — de tenant heeft eigen varianten onder andere namen
(`Countries-Blocked (Bad Countries)`, `Countries-Allowed (Benelux + FR + MT)`,
`Countries-Rest of the World`, `Countries-Travellers`, zes `Customer-FYG-*`-locaties en
`Azure-AVD (NAT Gateway)`).

Zonder die groepen en locaties is een baselinepolicy niet uitrolbaar, en erger: **een
uitsluitingsgroep die niet bestaat, sluit niemand uit**. Maak ze eerst aan, of pas de templates
aan op de bestaande `FYG-`-namen.

---

# Intune — 74 instellingen tegenover 1.967

28 configuratiepolicies in de tenant, waarvan 15 Settings Catalog. Daarnaast vier legacy
Device-profielen, één ADMX-profiel, twee updateprofielen en een certificaatprofiel.

| Baselinegebied | Instellingen | Gedekt |
|---|---:|---:|
| Attack Surface Reduction | 19 | 16 (84%) |
| Defender Antivirus | 31 | 18 (58%) |
| Windows LAPS | 13 | 5 (38%) |
| BitLocker | 36 | 3 (8%) |
| Microsoft Edge Security | 54 | 1 (2%) |
| Office Security (device + user) | 430 | 0 |
| Security Hardening | 96 | 0 |
| Windows Firewall + regels | 83 | 0 |
| Audit en Event Logging | 44 | 0 |
| macOS — alle 21 policies | 332 | 0 |
| User Rights | 28 | 0 |
| Device Lock · Login and Lock Screen · Account Lockout | 26 | 0 |
| AI-policies (8 stuks) | 25 | 0 |
| overige 90 policies | 750 | 39 |

Optellingen per gebied; een instelling die in meerdere baselinepolicies staat telt in beide mee.
Netto: **82 van 1.967** baseline-instellingen staan ook in de tenant, en **103 van de 138**
baselinepolicies hebben nul overlap.

## De 17 conflicten

Instellingen die beide sets zetten, maar verschillend. Zolang beide policies zijn toegewezen wordt
de betwiste instelling door **géén van beide** toegepast — Intune meldt Conflict en laat de waarde
ongemoeid.

| Instelling | Tenant | Baseline | Wie is strenger |
|---|---|---|---|
| LAPS — accountnaam | `itceadmin` | `localadmin` | naamkeuze |
| LAPS — wachtwoordlengte | 12 | 21 | baseline |
| LAPS — complexiteit | 4 | 8 | baseline |
| ASR — prevalence/age criterion | block | audit | **tenant** |
| ASR — obfuscated scripts | block | warn | **tenant** |
| ASR — Office communication child processes | block | warn | **tenant** |
| ASR — PSExec en WMI | block | warn | **tenant** |
| Defender — PUA-bescherming | audit (2) | block (1) | baseline |
| Defender — quickscan-tijd | 600 | 660 | gelijkwaardig |
| Defender — interval definitie-update | 8 uur | 1 uur | baseline |
| Defender — lage dreigingen | userdefined | quarantine | baseline |
| Defender — gemiddelde dreigingen | userdefined | quarantine | baseline |
| Credential Guard — lsacfgflags | 2 *(aan, zonder UEFI-lock)* | 1 *(aan, met lock)* | baseline |
| Lokale admins — actie | add_update | add_restrict | baseline |
| Lokale admins — leden | SID `S-1-12-1-1016720197…` | `WLapsAdmin` | tenantkeuze |
| Lokale admins — selectietype | users | manual | volgt uit het vorige |
| Privacy — apps toegang tot locatie | 1 *(toegestaan)* | 0 *(uit)* | **tenant heeft reden** |

Vier van de zeventien vallen in het voordeel van de tenant uit. De vier ASR-regels op *block* zijn
strenger dan de baseline en horen in de baseline te worden overgenomen. De locatietoegang is
bewust aan gezet voor automatische tijdzone (**FYG - GEN - Allow Apps to use Location services**) —
voor een bedrijf dat in meerdere tijdzones vliegt een legitieme reden om van de baseline af te
wijken; leg dat vast als uitzondering in plaats van hem stil te laten conflicteren.

## Wat alleen de tenant heeft

19 instellingen die de baseline niet kent. Bijna allemaal tenant-eigen en terecht — ze mogen bij
een uitrol niet verdwijnen.

- **Autopilot Device Preparation** — tien instellingen (deploymentmode, jointype, toegestane
  scripts, foutmelding *"Contact ITCE SD for help."*, timeout 30). Volledig tenant-specifiek.
- **ASR-uitsluitingen voor FlyingSoft** — tien paden, waaronder twee UNC-shares op
  `\\10.170.13.7`. Nodig om de branchesoftware te laten draaien, maar het zijn brede
  uitsluitingen met wildcards; laat ze meegaan en zet ze op de agenda voor een periodieke
  herbeoordeling.
- **Edge `browsersignin` en `forcesync`** — drie ADMX-instellingen die de baseline via de Settings
  Catalog anders regelt. Controleer op overlap bij uitrol van `WIN_U_Microsoft_Edge_Profiles_and_Sync`.
- **Defender scanschema** — dag 6, tijd 900, 5 dagen bewaartermijn opgeruimde malware.
- **Voorkeurstenantdomein** `@flyinggroup.aero` voor web sign-in.

## Drie profielen die niets doen

- **iOS/iPadOS - Device restrictions** en **macOS - Device restrictions** — elk honderden
  eigenschappen, allemaal op `false` of `notConfigured`. Ze configureren niets, maar bezetten wel
  de naamruimte en wekken de indruk dat er restricties zijn.
- **9. FYG - GEN - Enable Local Windows Autopilot Reset** — een `windows10GeneralConfiguration`
  waarin elke Edge-, Bluetooth- en proxy-eigenschap op `false` staat. Als er ooit één instelling in
  stond, is die niet meer te herkennen tussen de standaardwaarden.
- **FYG-D Windows Hello \*\*** zet `securityDeviceRequired: false` — Windows Hello mag dus zonder
  TPM worden ingericht, en de PIN mag 6 tekens zijn zonder complexiteit. De baseline regelt WHfB
  via de Settings Catalog met TPM verplicht; die twee botsen niet op `settingDefinitionId`, maar
  wel in effect.

Opruimen vóór de uitrol. Een leeg profiel dat blijft staan wordt bij de volgende toetsing opnieuw
als bestaande control geteld.

---

# ISMS-conformiteit

Alleen eisen met een getal of een afdwingbaar mechanisme. Beleidsuitspraken over processen,
registers en training vallen buiten deze technische toetsing — die zijn niet in de tenant te meten.

| Document | Eis | Baseline | Tenant |
|---|---|---|---|
| **ISMP.02** | Vergrendeling na 6 mislukte aanmeldpogingen | drempel 10 | **niets** |
| **ISMP.02** | Herauthenticatie na 15 minuten inactiviteit | 900 s | **niets** |
| **ISMP.02** | Wachtwoord ≥ 10 tekens, historie 4 | 14 / 24 | **niets** |
| **ISMP.02** | Bevoorrecht wachtwoord ≥ 12 tekens, uniek per service, nooit gedeeld | LAPS 21 | **vast wachtwoord in OMA-URI** |
| **ISMP.02** | Wachtwoord niet zichtbaar bij invoer | `disablepasswordreveal` | **niets** |
| **ISMP.02** | Least privilege op lokale beheerdersgroep | `add_restrict` | `add_update` |
| **ISMP.06** | Alleen bedrijfseigen, versleutelde verwisselbare media | schrijven geblokkeerd | **onbeperkt** |
| **ISMP.08** | BYOD alleen ingeschreven én compliant, anders via AVD | 2060 · 2090 · 3040 | **alleen MFA** |
| **ISMP.08 / .19** | Full disk encryption op mobiel en laptop, AES-256 | BitLocker · FileVault · compliance | alleen Windows |
| **ISMP.11** | Infectie automatisch in quarantaine of hersteld | quarantine | **userdefined** |
| **ISMP.11** | AV niet uitschakelbaar door gebruiker | tamper protection | tamper protection aan ✓ |
| **ISMP.13** | Logging van aanmelding, privilegegebruik, bestandstoegang, configuratiewijziging | 44 instellingen | **niets** |
| **ISMP.13** | Klok gesynchroniseerd op één vertrouwde bron | `WIN - D - Timezone` | niets |
| **ISMP.19** | Wi-Fi met WPA2/WPA3 en AES | — | `wpa2Personal` ✓ — 802.1X niet gebruikt |
| **ISMP.21** | Kritieke patch binnen 7 dagen | 3 ringen | **tot 19 dagen** |
| **ISMP.22** | Alleen Copilot toegestaan, alle andere AI verboden | 8 policies | **niets** |

**Twee kanttekeningen bij de baseline zelf.** De accountvergrendeling staat op 10 waar ISMP.02 6
eist — dat moet een besluit worden, geen stilzwijgende afwijking. En ISMP.19 eist
802.1X-authenticatie op draadloos *"where technically feasible"*, terwijl het Wi-Fi-profiel in de
tenant WPA2-Personal met een gedeelde sleutel gebruikt; de baseline dekt Wi-Fi helemaal niet, dus
daar is geen alternatief om naar te wijzen. Beide horen in de risicoregistratie of in een
herziening van het beleid.

---

# In welke volgorde dit werkt

De baseline is niet in één keer uit te rollen: 17 conflicten en zes ontbrekende
uitzonderingsgroepen zitten ertussen.

## Nu — wat geen voorbereiding vraagt

Vier ingrepen die de tenant direct veiliger maken en niemand hinderen. Geen van vieren raakt de
baseline-uitrol.

- Het OMA-URI-profiel met het vaste adminwachtwoord verwijderen, LAPS het account laten beheren,
  en één keer geforceerd roteren.
- **Exchange ActiveSync-OFF** op alle cloud-apps zetten, of intrekken ten gunste van **00-02** op
  enabled. Legacy auth is dan werkelijk dicht.
- Defender: lage en gemiddelde dreigingen op *quarantine*, PUA op *block*, definitie-interval op
  1 uur.
- De drie lege profielen opruimen (iOS/macOS Device restrictions, Autopilot Reset).

## Stap 2 — de randvoorwaarden voor de baseline

Zonder dit is de baseline niet uitrolbaar, en half uitgerold gedraagt hij zich anders dan bedoeld.

- De zes uitzonderingsgroepen aanmaken, of de templates aanpassen op de bestaande `FYG-`-namen.
- De ontbrekende named locations aanmaken, of de bestaande `Countries-`-varianten in de templates
  opnemen.
- De 17 conflicten beslechten. Voor dertien wint de baseline; voor de vier ASR-regels en de
  locatietoegang wint de tenant — neem die over in de baseline.
- De afwijking op de vergrendelingsdrempel (10 versus 6) laten vaststellen door de CISO, of de
  baseline aanpassen.

## Stap 3 — onzichtbaar voor de gebruiker

Alles wat de lat verhoogt zonder dat iemand het merkt. Het grootste deel van de baseline, en het
kan in één golf.

- Audit and Event Logging, Audit Policy Enforcement, Logging — met de logbestemming afgestemd.
- Account Lockout, Device Lock, Login and Lock Screen, Local Security Policies.
- Windows Firewall (niet de 48 regels — die in stap 4 op pilot).
- Security Hardening, Legacy Hardening, User Rights, Kernel DMA Protection, Printing Hardening,
  Remote Access Hardening.
- De elf compliancepolicies, maar pas **ná** de bijbehorende configuratiepolicies — eerst
  FileVault en BitLocker inschakelen, dan pas op compliance toetsen.

## Stap 4 — wat mensen merken

Eerst op een pilotgroep, met aankondiging.

- **BYOD dichtzetten** — 06-01 naar alle gebruikers, 06-02 aanvullen met een
  compliant-device-eis of vervangen door de AVD-route. De grootste ingreep, en de enige die het
  beleid letterlijk eist.
- **App protection** — PIN van 4 naar 6, geen kopiëren naar privéapps meer, Edge als verplichte
  browser.
- **Removable Storage** — schrijven naar USB geblokkeerd, na inventarisatie van wie het gebruikt.
- **Windows AI Permitted** — Recall begrensd, Copilot behouden conform de AI Usage Table.
- **De vier risicopolicies** (1090, 1100, 2010, 2020) — twee weken report-only voordat ze scherp
  gaan.
- **Windows Firewall-regels** — 48 regels naast branchesoftware die van een netwerkshare draait.
