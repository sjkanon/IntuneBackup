<!-- Gegenereerd door scripts/check-sets.js --docs — niet met de hand bijwerken. -->

# BASELINE2/

25 Intune-policies die de uitgerolde baseline aanvullen en op alle drie de vragen ja
antwoorden: **werkt het aantoonbaar**, **hebben we het nodig** om gebruikers veilig te
stellen, en **geldt het voor élk apparaat**? Een maatregel die op één van de drie nee
scoort hoort hier niet, of hij staat er mét het voorbehoud erbij in het manifest.

De set is samengesteld door `IntuneTemplate/` op `settingDefinitionId` te vergelijken met
de 874 profielen van IntuneAdmin/IntuneBaselines (CIS v4 Windows 11 L1/L2, CIS Edge, de
Microsoft Endpoint Security-baselines, Modern Workplace en de ISO 27001- en NIS2-mappen) en
met de iOS- en Android-baselines van UniFy-Endpoint. De tien policies die tot september
2026 in `ISMSTemplate/` stonden zijn hierin opgegaan — zie [ANALYSE.md](ANALYSE.md).

**Nog geen tweede baseline.** Eigen prefix, eigen map, en nog geen enkele toewijzing:

```
IntuneTemplate/   Baseline_<PLATFORM>_<D|U>_<Item>.json     [Baseline] - WIN - D - Item     uitgerold
BASELINE2/        BASELINE2_<PLATFORM>_<D|U>_<Item>.json    [BASELINE2] - WIN - D - Item    voorstel
```

De mapindeling is dezelfde als in `IntuneTemplate/` (`<PLATFORM>/<CATEGORIE>/`). Wat
verschilt is de pijplijn: deze set komt bewust **niet** in
`baseline/intune/baseline-v1.0.json`. Een policy die nog nergens is toegewezen hoort niet
als check tegen een tenant te worden gelegd — dat levert alleen rode vinkjes op voor iets
wat niemand heeft uitgerold. Bevalt een policy na de pilot, dan verhuist hij naar
`IntuneTemplate/` onder de `Baseline_`-naam en krijgt hij daar een checkId en een
toewijzing.

## Uitrollen

Drie routes, alle drie zonder toewijzing:

- **CIPP** — leest deze map net als `IntuneTemplate/` rechtstreeks; de policies staan er onder
  `Package: "BASELINE2"`.
- **IntuneBackupAndRestore** — `node scripts/export-intunebackup.js` ververst de export, daarna:

  ```powershell
  Start-IntuneRestoreConfig -Path '<repo>\export\NativeImport\IntuneBackupAndRestore-BASELINE2'
  ```

  Géén `Start-IntuneRestoreAssignments`: de export bevat met opzet geen `Assignments/`-map.
- **Met de hand** aanmaken in Intune.

Daarna toewijzen aan een pilotgroep — niet aan All Devices, want een deel van deze
instellingen verandert gedrag dat gebruikers direct merken.

## Controles

```bash
node scripts/check-sets.js          # naam, plek, verantwoording en botsingen, alle sets
node scripts/check-sets.js BASELINE2  # alleen deze set
node scripts/check-sets.js --docs   # plus deze README opnieuw genereren
```

De belangrijkste controle is de laatste: `check-scope.js` kijkt alleen naar toegewezen policies
binnen `IntuneTemplate/` en ziet deze set dus niet. Zet een policy hier dezelfde instelling als
een tóégewezen baseline-policy, dan levert dat bij uitrol een Conflict op — waarna Intune de
instelling door géén van beide toepast en de baseline er dus op achteruit gaat. Botsingen die
bedoeld zijn, staan als `replaces` in `_manifest.json`; de rest blokkeert.

## De set

| Policy | Wat het doet | Instellingen | Controls |
|---|---|---:|---|
| **AND - U - App Protection** | Dezelfde app-beveiliging als de baseline, met PIN-hergebruik dichtgezet. | 0 | A.8.1 Eindpuntapparatuur van gebruikers · A.5.17 Authenticatie-informatie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 · ISMP08 |
| **AND - U - Compliance Device Health** | Merkt een Android-toestel als niet-compliant wanneer het geroot is, USB-foutopsporing aanstaat, apps van buiten de Play Store zijn toegestaan of Play Integrity niet hardwarematig bevestigd kan worden. | 0 | A.8.1 Eindpuntapparatuur van gebruikers · A.8.7 Bescherming tegen malware · A.8.19 Installatie van software op operationele systemen · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP08 · ISMP11 |
| **AND - U - Compliance Password** | Toetst of het werkprofiel een toegangscode van minimaal zes tekens met gemiddelde complexiteit vereist, na vijftien minuten vergrendelt en of de opslag versleuteld is. | 0 | A.5.17 Authenticatie-informatie · A.8.5 Veilige authenticatie · A.8.24 Gebruik van cryptografie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · NIS2 art. 21(2)(h) cryptografie en versleuteling · ISMP02 · ISMP19 |
| **IOS - U - App Protection** | Dezelfde app-beveiliging als de baseline, met drie gaten dicht: het iOS-deelmenu biedt alleen nog beheerde apps aan, schermafdrukken van bedrijfsgegevens worden geblokkeerd en een PIN mag niet hergebruikt worden. | 0 | A.8.12 Voorkomen van datalekken · A.8.1 Eindpuntapparatuur van gebruikers · A.5.14 Informatieoverdracht · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP08 · ISMP14 |
| **IOS - U - Compliance Device Health** | Merkt een iPhone of iPad die met een jailbreak is opengebroken als niet-compliant. | 0 | A.8.1 Eindpuntapparatuur van gebruikers · A.8.7 Bescherming tegen malware · A.5.15 Toegangsbeveiliging · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP08 · ISMP11 |
| **IOS - U - Compliance Password** | Toetst of een iPhone of iPad een toegangscode van minimaal zes tekens vereist, geen eenvoudige code, en na vijftien minuten vergrendelt. | 0 | A.5.17 Authenticatie-informatie · A.8.5 Veilige authenticatie · A.8.1 Eindpuntapparatuur van gebruikers · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 · ISMP08 |
| **MAC - D - Passcode and Screen Lock** | Stelt op de Mac het wachtwoord en de schermvergrendeling in die de compliance-policy al eist: minimaal acht tekens, geen eenvoudig wachtwoord, vergrendelen na vijftien minuten. | 7 | A.5.17 Authenticatie-informatie · A.8.1 Eindpuntapparatuur van gebruikers · A.8.5 Veilige authenticatie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 |
| **WIN - D - Access Control** | Toont vóór het aanmelden een waarschuwing dat het systeem alleen voor geautoriseerde gebruikers is, en verbergt de laatst aangemelde gebruikersnaam. | 6 | A.5.15 Toegangsbeveiliging · A.5.16 Identiteitsbeheer · A.5.17 Authenticatie-informatie · A.8.5 Veilige authenticatie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · IS.I.OR.245 registratie en traceerbaarheid · ISMP02 |
| **WIN - D - Account Lockout** | Sluit een account 15 minuten af na tien mislukte aanmeldpogingen, ook dat van de ingebouwde beheerder, en zet het apparaat na tien mislukte pogingen in BitLocker-herstel. | 3 | A.5.15 Toegangsbeveiliging · A.5.17 Authenticatie-informatie · A.8.5 Veilige authenticatie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 |
| **WIN - D - AI Tooling** | Blokkeert GitHub Copilot op persoonlijke accounts in Visual Studio; de zakelijke licentie blijft werken. | 1 | A.5.10 Aanvaardbaar gebruik · A.8.1 Eindpuntapparatuur van gebruikers · ISMP22 |
| **WIN - D - Audit Policy Enforcement** | Laat de gedetailleerde auditinstellingen voorgaan op de oude categorie-instellingen, zodat de auditpolicy van de baseline daadwerkelijk bepaalt wat er wordt gelogd. | 1 | A.8.15 Logging · A.8.16 Monitoringactiviteiten · NIS2 art. 21(2)(b) incidentbehandeling · IS.I.OR.245 registratie en traceerbaarheid · ISMP13 |
| **WIN - D - Business Continuity** | Zet Quick Machine Recovery aan: een apparaat dat niet meer opstart, haalt zelf een herstelpakket op uit de cloud in plaats van op een monteur te wachten. | 4 | A.5.29 Informatiebeveiliging tijdens verstoring · A.5.30 ICT-gereedheid voor bedrijfscontinuiteit · A.8.14 Redundantie · NIS2 art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer · IS.I.OR.250 continuiteit · ISMP09 · ISMP10 |
| **WIN - D - Cryptography** | Dwingt af dat Microsoft Edge geen verbindingen onder TLS 1.2 opzet, ook niet als een server dat aanbiedt. | 2 | A.8.24 Gebruik van cryptografie · NIS2 art. 21(2)(h) cryptografie en versleuteling · ISMP19 |
| **WIN - D - Data Minimisation** | Beperkt wat er in de diagnostische gegevens meegaat: geen aanvullende logbestanden en geen geheugendumps naar Microsoft. | 2 | A.5.34 Privacy en bescherming van persoonsgegevens · A.8.11 Datamaskering · ISDP01 · ISMP13 |
| **WIN - D - Kernel DMA Protection** | Blokkeert randapparaten die rechtstreeks in het geheugen kunnen lezen en geen DMA-remapping ondersteunen. | 1 | A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein · A.8.1 Eindpuntapparatuur van gebruikers · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP14 |
| **WIN - D - Logging** | Schrijft een transcript van elke PowerShell-sessie weg, zodat achteraf te zien is wat een beheerder werkelijk heeft uitgevoerd. | 3 | A.8.15 Logging · A.8.16 Monitoringactiviteiten · NIS2 art. 21(2)(b) incidentbehandeling · IS.I.OR.245 vastlegging · IS.I.OR.220 incidentrespons · ISMP13 |
| **WIN - D - Logon Hardening** | Vereist CTRL+ALT+DEL vóór het aanmelden en haalt de netwerkkeuze van het vergrendelscherm weg. | 2 | A.5.15 Toegangsbeveiliging · A.8.5 Veilige authenticatie · A.8.20 Netwerkbeveiliging · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 |
| **WIN - D - Printing Hardening** | Zet Windows Protected Print aan, verbiedt gewone gebruikers het installeren van printerdrivers bij een gedeelde printer, en sluit printen over HTTP af. | 3 | A.8.7 Bescherming tegen malware · A.8.19 Installatie van software op operationele systemen · A.8.20 Netwerkbeveiliging · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP11 · ISMP14 |
| **WIN - D - Privacy and Telemetry** | Zet de advertentie-id uit, blokkeert het klembord tussen apparaten, stopt het uploaden van gebruikersactiviteiten en houdt wat de gebruiker typt en inspreekt op het apparaat. | 4 | A.5.34 Privacy en bescherming van persoonsgegevens · A.8.11 Datamaskering · A.8.12 Voorkomen van datalekken · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISDP01 · ISMP13 |
| **WIN - D - Remote Access Hardening** | Sluit de WinRM-remoteshell af en verbreekt een inactieve SMB-sessie na vijftien minuten. | 2 | A.8.20 Netwerkbeveiliging · A.8.21 Beveiliging van netwerkdiensten · A.5.15 Toegangsbeveiliging · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP14 · ISMP19 |
| **WIN - D - Threat Protection** | Haalt de lokale ontsnappingsroutes uit de malwarebescherming weg: gebruikers kunnen Exploit Protection niet overrulen, de cloudrapportage niet lokaal uitzetten, en DLL-kaping wordt moeilijker. | 3 | A.8.7 Bescherming tegen malware · A.8.8 Beheer van technische kwetsbaarheden · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · IS.I.OR.220 · ISMP11 |
| **WIN - D - Wireless and Peripherals** | Maakt het apparaat onzichtbaar over Bluetooth en sluit Windows Connect Now af, zodat draadloze instellingen niet buiten het beheer om van het ene apparaat naar het andere kunnen worden overgezet. Al gekoppelde apparaten blijven werken. | 7 | A.8.20 Netwerkbeveiliging · A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein · NIS2 art. 21(2)(e) beveiliging bij verwerving en onderhoud · ISMP19 · ISMP14 · ISMP08 |
| **WIN - D - Wireless Shared Devices** | Laat op gedeelde apparaten alleen de netwerken toe die via Intune zijn uitgerold. Zelf toegevoegde wifi-netwerken worden verwijderd en er kunnen er geen bij. | 1 | A.8.20 Netwerkbeveiliging · A.8.1 Eindpuntapparatuur van gebruikers · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP19 · ISMP14 · ISMP08 |
| **WIN - U - AI Usage Control** | Blokkeert in Edge de AI-diensten die het beleid niet heeft goedgekeurd. Microsoft Copilot blijft uitdrukkelijk bereikbaar. | 2 | A.5.10 Aanvaardbaar gebruik · A.5.19 Informatiebeveiliging in leveranciersrelaties · A.8.1 Eindpuntapparatuur van gebruikers · NIS2 art. 21(2)(d) toeleveringsketen · ISMP22 · ISDP01 |
| **WIN - U - Attachment Scanning** | Laat de virusscanner elke bijlage controleren op het moment dat de gebruiker hem opent, niet alleen bij het opslaan. | 1 | A.8.7 Bescherming tegen malware · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP11 |

---

### [BASELINE2] - AND - U - App Protection

Dezelfde app-beveiliging als de baseline, met PIN-hergebruik dichtgezet.

| | |
|---|---|
| Bestand | `AND/AppProtection/BASELINE2_AND_U_App_Protection.json` |
| Instellingen | 0 |
| Bron | Kopie van [Baseline] - AND - U - App Protection met één wijziging, gevonden door vergelijking met de L2-BYOD-policy van UniFy-Endpoint/Android-Enterprise-Baseline. |
| Bewezen | `previousPinBlockCount` stond op 0: een gebruiker die na een reset om een nieuwe app-PIN wordt gevraagd, kan dezelfde weer kiezen. Daarmee is de reset betekenisloos — precies de situatie die zich voordoet nadat iemand vermoedt dat zijn PIN is afgekeken. Vijf is de waarde die de UniFy L2-set en de Microsoft-documentatie aanhouden. |
| Universeel | Raakt elke Android-telefoon die bij bedrijfsgegevens komt. Geen frictie: het verschil merkt een gebruiker alleen op het moment dat hij zijn PIN wil hergebruiken. |

Instellingen:

```
```

> De rest van de Android-MAM-policy blijft ongewijzigd — en is op de meeste punten al strenger dan de UniFy L2-set (SafetyNet hardware-backed in plaats van basic, PIN-complexiteit medium in plaats van low, schermafdrukken al geblokkeerd). Net als bij iOS: rol deze uit in plaats van de baseline-variant, niet ernaast.
### [BASELINE2] - AND - U - Compliance Device Health

Merkt een Android-toestel als niet-compliant wanneer het geroot is, USB-foutopsporing aanstaat, apps van buiten de Play Store zijn toegestaan of Play Integrity niet hardwarematig bevestigd kan worden.

| | |
|---|---|
| Bestand | `AND/CompliancePolicies/BASELINE2_AND_U_Compliance_Device_Health.json` |
| Instellingen | 0 |
| Bron | OpenIntuneBaseline-conventie voor compliance, inhoud vergeleken met IntuneAdmin (Personally-owned work profile - Device Health) en UniFy-Endpoint Android BYOD. |
| Bewezen | Root, USB-foutopsporing en installatie uit onbekende bronnen zijn de drie voorwaarden waaronder de Android-sandbox niet meer houdt wat hij belooft. Play Integrity op `hardwareBacked` is daarbij het verschil dat telt: de basisvariant is in software te vervalsen, de hardware-variant leunt op de secure element van het toestel. IntuneAdmin en UniFy zetten die op `basic`; wij houden `hardwareBacked` aan, gelijk aan wat de App Protection-policy in de baseline al eist. |
| Universeel | Geldt voor elk ingeschreven Android-toestel. **Zelfde voorbehoud als bij iOS:** er zijn vandaag geen Android-inschrijvingen, dus deze toets doet nog niets. |

Instellingen:

```
```

> Als `androidWorkProfileCompliancePolicy` geschreven — het persoonlijke werkprofiel, dat past bij de BYOD-inrichting die er nu is. Wordt er ooit fully managed of dedicated ingeschreven, dan is er een tweede policy nodig van het type `androidDeviceOwnerCompliancePolicy`; de instellingen heten daar anders. `hardwareBacked` sluit oudere toestellen zonder ondersteunde secure element uit — dat is bedoeld, maar controleer het tegen de vloot vóór je toewijst.
### [BASELINE2] - AND - U - Compliance Password

Toetst of het werkprofiel een toegangscode van minimaal zes tekens met gemiddelde complexiteit vereist, na vijftien minuten vergrendelt en of de opslag versleuteld is.

| | |
|---|---|
| Bestand | `AND/CompliancePolicies/BASELINE2_AND_U_Compliance_Password.json` |
| Instellingen | 0 |
| Bron | OpenIntuneBaseline-conventie voor compliance; waarden gelijkgetrokken met de PIN-eis van zes tekens in de bestaande App Protection-policy en met de Android-eis in IntuneAdmin. |
| Bewezen | Op een werkprofiel staat de bedrijfsdata; de toegangscode van dat profiel is wat die data scheidt van de privékant van hetzelfde toestel. Zonder eis is dat profiel met een veeggebaar te openen. Versleuteling van de opslag is de tweede helft: een niet-versleuteld toestel geeft zijn data prijs zodra iemand de opslag uitleest, hoe sterk de code ook is. Android versleutelt sinds versie 10 standaard, dus deze toets meldt vooral toestellen die dat om welke reden dan ook niet doen. |
| Universeel | Geldt voor elk ingeschreven Android-toestel met werkprofiel. **Zelfde voorbehoud:** er zijn vandaag geen Android-inschrijvingen. |

Instellingen:

```
```

> De eis staat op het werkprofiel, niet op het toestel als geheel — dat is bewust bij BYOD: de organisatie stelt geen eisen aan de privékant van een privétoestel. Complexiteit `medium` is de Android-term voor 'geen patroon, geen herhaalde of oplopende reeks'; dat is strenger dan een lengte-eis alleen en is wat Google zelf aanraadt.
### [BASELINE2] - IOS - U - App Protection

Dezelfde app-beveiliging als de baseline, met drie gaten dicht: het iOS-deelmenu biedt alleen nog beheerde apps aan, schermafdrukken van bedrijfsgegevens worden geblokkeerd en een PIN mag niet hergebruikt worden.

| | |
|---|---|
| Bestand | `IOS/AppProtection/BASELINE2_IOS_U_App_Protection.json` |
| Instellingen | 0 |
| Bron | Kopie van [Baseline] - IOS - U - App Protection met drie wijzigingen, gevonden door vergelijking met de L2-BYOD-policy van UniFy-Endpoint/iOS-iPadOS-Intune-Baseline (CIS Apple iOS/iPadOS 26 v1.0.0). |
| Bewezen | `filterOpenInToOnlyManagedApps` is de belangrijkste. De baseline zet uitgaande dataoverdracht al op 'alleen beheerde apps', maar zonder dit vinkje blijft het iOS-deelmenu ('Open in…', de share sheet) onbeheerde apps aanbieden — een gebruiker deelt een bedrijfsdocument dan alsnog naar WhatsApp. De bestaande beperking is daarmee half, en dat is precies het soort halve maatregel dat in een audit als dekking wordt geteld. Schermafdrukken blokkeren brengt iOS op gelijke hoogte met Android, waar de baseline `screenCaptureBlocked` al aan heeft staan. PIN-historie voorkomt dat iemand bij een reset dezelfde PIN terugkiest. |
| Universeel | Raakt elke iPhone en iPad die bij bedrijfsgegevens komt — ook, en juist, de privétoestellen. App Protection is het énige wat die apparaten raakt: ze zijn niet ingeschreven, dus configuratie- en compliance-policies bereiken ze niet. |

Instellingen:

```
```

> **Rol deze uit in plaats van de baseline-variant, niet ernaast.** Twee App Protection-policies op dezelfde apps stapelen niet netjes: Intune kiest per instelling de strengste waarde, maar welke policy een instelling levert is dan niet meer af te lezen, en bij troubleshooting kost dat een middag. Verwijder bij uitrol de toewijzing van [Baseline] - IOS - U - App Protection. Uiteindelijk hoort deze wijziging terug in die policy zelf — dat is een besluit over de afgesproken baseline, niet iets om stilzwijgend te doen.
### [BASELINE2] - IOS - U - Compliance Device Health

Merkt een iPhone of iPad die met een jailbreak is opengebroken als niet-compliant.

| | |
|---|---|
| Bestand | `IOS/CompliancePolicies/BASELINE2_IOS_U_Compliance_Device_Health.json` |
| Instellingen | 0 |
| Bron | OpenIntuneBaseline-conventie voor compliance, inhoud vergeleken met IntuneAdmin (Baseline - iOSiPadOS - Device Health) en UniFy-Endpoint iOS BYOD. |
| Bewezen | Op een apparaat met jailbreak is de sandbox weg waar de hele iOS-beveiliging op rust: elke app kan dan bij de gegevens van elke andere app, inclusief die van Outlook en Teams. Dit is de enige toets die dat detecteert, en zonder compliance-policy is 'vereis een compliant apparaat' in Conditional Access voor iOS een lege huls — er is geen enkele regel om aan te voldoen. |
| Universeel | Geldt voor elke ingeschreven iPhone en iPad. **Met één voorbehoud dat je moet kennen:** vandaag is er geen enkele iOS-inschrijving — de twee mobiele policies in de baseline zijn App Protection op `unmanaged`. Deze policy doet dus niets tot er telefoons worden ingeschreven, en meldt ook niets. Hij staat hier zodat de dag dat dat gebeurt geen dag zonder toets is. |

Instellingen:

```
```

> Blokkeeractie na 24 uur respijt, zodat een gebruiker eerst een melding krijgt. Wijs 'm pas toe wanneer er daadwerkelijk iOS-apparaten worden ingeschreven; op een tenant zonder inschrijvingen levert hij een lege rapportage op en niets anders.
### [BASELINE2] - IOS - U - Compliance Password

Toetst of een iPhone of iPad een toegangscode van minimaal zes tekens vereist, geen eenvoudige code, en na vijftien minuten vergrendelt.

| | |
|---|---|
| Bestand | `IOS/CompliancePolicies/BASELINE2_IOS_U_Compliance_Password.json` |
| Instellingen | 0 |
| Bron | OpenIntuneBaseline-conventie voor compliance; waarden gelijkgetrokken met de PIN-eis van zes tekens in de bestaande App Protection-policy. |
| Bewezen | Een toestel zonder schermvergrendeling is een toestel waarvan iedereen die het oppakt de mail kan lezen. Zes tekens en geen eenvoudige code (geen 123456, geen 111111) is de waarde die Apple zelf aanhoudt en die de App Protection-policy in de baseline al voor de app-PIN eist — deze policy trekt die eis door naar het toestel zelf. |
| Universeel | Geldt voor elke ingeschreven iPhone en iPad. **Hetzelfde voorbehoud als bij Device Health:** er zijn vandaag geen iOS-inschrijvingen, dus deze toets doet nog niets. |

Instellingen:

```
```

> Bewust géén `passcodeExpirationDays`: het periodiek laten wijzigen van een toestelcode leidt aantoonbaar tot zwakkere codes, en NIST SP 800-63B raadt verplichte rotatie zonder aanleiding expliciet af. Vijftien minuten is gelijkgetrokken met de macOS- en Windows-compliancepolicies in de baseline.
### [BASELINE2] - MAC - D - Passcode and Screen Lock

Stelt op de Mac het wachtwoord en de schermvergrendeling in die de compliance-policy al eist: minimaal acht tekens, geen eenvoudig wachtwoord, vergrendelen na vijftien minuten.

| | |
|---|---|
| Bestand | `MAC/SettingsCatalog/BASELINE2_MAC_D_Passcode_and_Screen_Lock.json` |
| Instellingen | 7 |
| Bron | Apple Passcode-payload (com.apple.mobiledevice.passwordpolicy) in de macOS settings catalog — waarden één op één overgenomen uit [Baseline] - MAC - U - Compliance Password en geverifieerd tegen de settings catalog-definities (minLength max 16, maxInactivity max 15). |
| Bewezen | Dit is geen nieuwe eis maar het sluitstuk van een eis die er al staat. OVERZICHT.md benoemt het gat zelf: MAC - U - Compliance Password toetst op een wachtwoord van acht tekens met vergrendeling na vijftien minuten, maar er is geen enkele policy die dat op de Mac instelt. Een Mac zonder schermvergrendeling wordt daardoor wel als niet-compliant gemeld en krijgt de instelling niet opgelegd — de gebruiker ziet een rood vinkje en kan er zelf niets aan doen. |
| Universeel | Geldt voor elke Mac in beheer. De waarden zijn geen nieuwe keuze: ze zijn letterlijk overgenomen uit de compliance-policy die al is toegewezen aan alle gebruikers, dus na uitrol dekt de configuratie precies wat de toets vraagt. |

Instellingen:

```
com.apple.mobiledevice.passwordpolicy_forcepin = true
com.apple.mobiledevice.passwordpolicy_requirealphanumeric = true
com.apple.mobiledevice.passwordpolicy_allowsimple = false
com.apple.mobiledevice.passwordpolicy_minlength = 8
com.apple.mobiledevice.passwordpolicy_mincomplexchars = 1
com.apple.mobiledevice.passwordpolicy_pinhistory = 1
com.apple.mobiledevice.passwordpolicy_maxinactivity = 15
```

> maxInactivity kan in de settings catalog niet hoger dan 15 minuten — dat is toevallig exact de waarde die de compliance-policy vraagt. maxFailedAttempts is bewust weggelaten: op macOS leidt dat tot een oplopende wachttijd en uiteindelijk een blokkade die alleen met de FileVault-herstelsleutel te openen is, en dat is een aparte afweging. Deze policy zet géén com.apple.applicationaccess- of com.apple.screensaver-instelling en botst dus niet met MAC - D - Restrictions. Let op: gebruikers met een korter of eenvoudiger wachtwoord moeten het bij de eerstvolgende aanmelding wijzigen.
### [BASELINE2] - WIN - D - Access Control

Toont vóór het aanmelden een waarschuwing dat het systeem alleen voor geautoriseerde gebruikers is, en verbergt de laatst aangemelde gebruikersnaam.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Access_Control.json` |
| Instellingen | 6 |
| Bron | ISO/IEC 27001:2022 A.5.15 en A.8.5, NIS2 art. 21(2)(i), EASA Part-IS IS.I.OR.245 — instellingen uit CIS v4 Windows 11 L1 |
| Bewezen | De aanmeldbanner is geen technische maatregel maar een juridische: zonder expliciete waarschuwing vooraf is 'onbevoegd gebruik' bij een incident aantoonbaar moeilijker hard te maken. De andere vijf zijn dat wel — het verbergen van de laatst aangemelde gebruikersnaam haalt de helft van een aanmeldpoging (de gebruikersnaam) weg bij wie het scherm ziet, en het beeldwachtwoord, de convenience-PIN en de beveiligingsvragen zijn drie aanmeldroutes die het beleid niet als goedgekeurd noemt. Alle vijf staan in CIS v4 Windows 11 L1. |
| Universeel | Geldt voor elk Windows-apparaat. Pas wel eerst de bannertekst aan op de eigen organisatienaam — die staat er nu generiek in. |

Instellingen:

```
device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_messagetitleforusersattemptingtologon = Toegang uitsluitend voor geautoriseerde gebruikers
device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_messagetextforusersattemptingtologon = Dit systeem en de gegevens erop zijn eigendom van de organisatie en zijn uitsluitend bestemd voor geautoriseerd gebruik. | Gebruik wordt gelogd en gecontroleerd. Onbevoegd gebruik kan leiden tot disciplinaire maatregelen en strafrechtelijke vervolging. | Door verder te gaan verklaart u kennis te hebben genomen van het informatiebeveiligingsbeleid.
device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_donotdisplaylastsignedin = 1
device_vendor_msft_policy_config_credentialproviders_blockpicturepassword = 1
device_vendor_msft_policy_config_credentialproviders_allowpinlogon = 0
device_vendor_msft_policy_config_admx_credui_nolocalpasswordresetquestions = 1
```

> ISMP02 eist de eerste twee letterlijk: een algemene waarschuwing bij het aanmelden, en geen systeem- of gebruikersidentificatie vóór een geslaagde aanmelding. De banner is juridisch relevant bij misbruik; pas de tekst aan op de eigen organisatienaam vóór uitrol. Het verbergen van de laatste gebruikersnaam is merkbaar voor gebruikers — die moeten voortaan hun volledige naam typen — dus communiceer die vóór je 'm toewijst. De drie andere instellingen sluiten de aanmeldroutes af die het beleid niet noemt als goedgekeurde methode: het beeldwachtwoord, de oude convenience-PIN (níet de Windows Hello-PIN, die blijft werken) en de beveiligingsvragen voor lokale accounts — dat laatste omdat ISMP02 identiteitsverificatie bij een reset eist, en beveiligingsvragen dat juist omzeilen.
### [BASELINE2] - WIN - D - Account Lockout

Sluit een account 15 minuten af na tien mislukte aanmeldpogingen, ook dat van de ingebouwde beheerder, en zet het apparaat na tien mislukte pogingen in BitLocker-herstel.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Account_Lockout.json` |
| Instellingen | 3 |
| Bron | CIS v4 Windows 11 L1 en de Microsoft Security Baseline — waarden geverifieerd tegen Policy CSP DeviceLock (AccountLockoutPolicy, AllowAdministratorLockout) en LocalPoliciesSecurityOptions. |
| Bewezen | Dit is de oudste en best onderbouwde maatregel tegen wachtwoord-raden die er is: zonder drempel kan iemand met fysieke toegang of met een gestolen laptop onbeperkt PIN's en wachtwoorden proberen. CIS, de Microsoft Security Baseline en NIST SP 800-63B schrijven hem alle drie voor. De baseline dwingt vandaag wél wachtwoordlengte (14) en -historie (24) af, maar telt mislukte pogingen nergens — die twee samen zijn precies het gat. |
| Universeel | Geldt voor elk Windows-apparaat, ongeacht rol of gebruiker. De machine-drempel leunt op BitLocker, en die staat in de baseline aan mét verplichte escrow van de herstelsleutel naar Entra ID (osrequireactivedirectorybackup), dus een apparaat dat in herstel valt is altijd terug te halen. |

Instellingen:

```
device_vendor_msft_policy_config_devicelock_accountlockoutpolicy = AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15
device_vendor_msft_policy_config_devicelock_allowadministratorlockout = 1
device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_machineaccountlockoutthreshold = 10
```

> Drempel 10 en niet 5: bij 5 tikt een gebruiker die zich vergist zichzelf er te makkelijk uit, en 10 is de waarde van de Microsoft Security Baseline. De accountvergrendeling heft zichzelf na 15 minuten op — daar hoeft niemand voor gebeld te worden. De machine-drempel (InteractiveLogon MachineAccountLockoutThreshold) doet iets anders: die zet het apparaat ná tien mislukte pogingen in BitLocker-herstel, en dán is de herstelsleutel nodig. Dat is bedoeld voor een gestolen laptop, niet voor een vergeetachtige gebruiker, maar reken op een enkele helpdeskvraag. AccountLockoutPolicy vraagt Windows 11 22H2 met KB5053657 of 24H2; oudere apparaten negeren de instelling stil. LET OP: IntuneAdmin zet deze instelling in zijn NIS2-profiel op de kale waarde "15" — de CSP verwacht de drie velden als één string ("AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15"), dus die waarde is daar stuk. Neem hem niet over.
### [BASELINE2] - WIN - D - AI Tooling

Blokkeert GitHub Copilot op persoonlijke accounts in Visual Studio; de zakelijke licentie blijft werken.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_AI_Tooling.json` |
| Instellingen | 1 |
| Bron | ISO/IEC 27001:2022 A.5.10 en A.8.1 — instelling uit de Visual Studio-benchmark van IntuneAdmin |
| Bewezen | Zonder deze instelling koppelt een ontwikkelaar zijn privé-GitHub-account aan Visual Studio en verlaat bedrijfscode de goedgekeurde route zonder dat iemand het ziet. De zakelijke Copilot-licentie blijft gewoon werken; alleen de persoonlijke variant wordt geblokkeerd. |
| Universeel | Geldt níet voor elk apparaat in de zin dat het overal effect heeft: alleen apparaten met Visual Studio merken er iets van. Maar hij is wél overal veilig toe te wijzen — op een apparaat zonder Visual Studio doet de instelling niets en veroorzaakt ze niets. |

Instellingen:

```
device_vendor_msft_policy_config_visualstudiov4~policy~visualstudio~copilotsettings_disablecopilotforindividuals = 1
```

> ISMP22 staat GitHub Copilot toe, maar uitsluitend voor softwareontwikkeling en uitsluitend via de goedgekeurde licentie. Zonder deze instelling kan een ontwikkelaar zijn privéaccount koppelen, en dan verlaat bedrijfscode de goedgekeurde route zonder dat iemand het ziet.
### [BASELINE2] - WIN - D - Audit Policy Enforcement

Laat de gedetailleerde auditinstellingen voorgaan op de oude categorie-instellingen, zodat de auditpolicy van de baseline daadwerkelijk bepaalt wat er wordt gelogd.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Audit_Policy_Enforcement.json` |
| Instellingen | 1 |
| Bron | CIS v4 Windows 11 L1 en de Microsoft Security Baseline — instelling overgenomen uit het NIS2-profiel van IntuneAdmin, waarde geverifieerd tegen de settings catalog-definitie. |
| Bewezen | Windows kent twee auditsystemen naast elkaar: de negen oude categorieën en de ruim vijftig subcategorieën. Staat deze schakelaar niet aan, dan kan een oude categorie-instelling — uit een GPO, een image of een restant — de subcategorieën overrulen, en dan logt het apparaat iets anders dan de policy zegt. Dit is de instelling die van [Baseline] - WIN - D - Audit and Event Logging (40 instellingen) de werkelijke waarheid maakt in plaats van een voornemen. |
| Universeel | Geldt voor elk Windows-apparaat, is onzichtbaar voor gebruikers en breekt niets. Zonder deze instelling is de bestaande auditpolicy op een deel van de vloot mogelijk niet effectief — en dát merk je pas als je na een incident de logs nodig hebt. |

Instellingen:

```
device_vendor_msft_policy_config_localpoliciessecurityoptions_audit_forceauditpolicysubcategorysettingstooverrideauditpolicycategorysettings = 1
```

> Eén instelling, maar de goedkoopste van de hele set: hij voegt zelf niets toe en zorgt alleen dat wat er al staat ook echt geldt. Draai na uitrol op een testapparaat `auditpol /get /category:*` en vergelijk met de baseline-policy.
### [BASELINE2] - WIN - D - Business Continuity

Zet Quick Machine Recovery aan: een apparaat dat niet meer opstart, haalt zelf een herstelpakket op uit de cloud in plaats van op een monteur te wachten.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Business_Continuity.json` |
| Instellingen | 4 |
| Bron | ISO/IEC 27001:2022 A.5.29, A.5.30 en A.8.14, NIS2 art. 21(2)(c) — instellingen uit de Modern Workplace-set van IntuneAdmin |
| Bewezen | Quick Machine Recovery haalt een apparaat dat niet meer opstart zelf uit de brand: het start in WinRE, haalt een herstelpakket op uit de cloud en repareert zichzelf. De aanleiding is bekend — bij de CrowdStrike-storing van juli 2024 moest elk getroffen apparaat fysiek worden aangeraakt. Microsoft heeft de functie daar expliciet op gebouwd. |
| Universeel | Geldt voor elk Windows-apparaat en is onzichtbaar tot het moment dat het misgaat. |

Instellingen:

```
device_vendor_msft_remoteremediation_cloudremediationsettings_enablecloudremediation = true
device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_enableautoremediation = true
device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_setretryinterval = 30
device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_settimetoreboot = 180
```

> ISMP09 en ISMP10 gaan over continuïteit maar hebben op de werkplek zelf geen enkele technische maatregel. Dit is de goedkoopste die er is. De Wi-Fi-gegevens uit het bronprofiel zijn bewust weggelaten: die zijn tenant-specifiek en horen niet in een gedeelde baseline. Zonder die gegevens werkt het herstel over een bekabelde verbinding; heb je een vloot zonder ethernet, vul ze dan aan vóór uitrol.
### [BASELINE2] - WIN - D - Cryptography

Dwingt af dat Microsoft Edge geen verbindingen onder TLS 1.2 opzet, ook niet als een server dat aanbiedt.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Cryptography.json` |
| Instellingen | 2 |
| Bron | ISO/IEC 27001:2022 A.8.24, NIS2 art. 21(2)(h) — instelling uit CIS v3 Microsoft Edge L1 |
| Bewezen | Edge accepteerde tot nu toe wat de server aanbood, TLS 1.0 en 1.1 inbegrepen. Die twee zijn sinds 2021 door alle browserleveranciers afgeschaft en zijn met bekende aanvallen (BEAST, POODLE) te breken. De WinINet-stack stond al goed via Internet Explorer Legacy; Edge zelf niet. |
| Universeel | Geldt voor elk apparaat met Edge — dat zijn ze allemaal. **Voorbehoud:** een intern systeem dat alleen TLS 1.0/1.1 spreekt wordt hierdoor onbereikbaar. Dat is precies de bedoeling, maar het moet wel bekend zijn vóór uitrol. |

Instellingen:

```
device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin = 1
device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin_sslversionmin = tls1.2
```

> ISMP19 eist TLS 1.2 of hoger voor web- en clouddiensten. De WinINet-stack staat al goed (Internet Explorer Legacy), maar Edge zelf accepteerde tot nu toe wat de server aanbood. Let op: interne systemen die alleen TLS 1.0/1.1 spreken worden hierdoor onbereikbaar — dat is precies waarom dit een pilotpolicy is.
### [BASELINE2] - WIN - D - Data Minimisation

Beperkt wat er in de diagnostische gegevens meegaat: geen aanvullende logbestanden en geen geheugendumps naar Microsoft.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Data_Minimisation.json` |
| Instellingen | 2 |
| Bron | ISO/IEC 27001:2022 A.5.34 en A.8.11, AVG art. 5(1)(c) dataminimalisatie — instellingen uit CIS v4 Windows 11 L1 |
| Bewezen | De baseline zet telemetrie bewust op Optioneel omdat Endpoint Analytics en Windows Update-rapportage erop leunen. Deze twee instellingen halen daar de scherpe kant af zonder die rapportage te breken: aanvullende diagnostische logbestanden en geheugendumps — waar gebruikersgegevens in kunnen zitten — gaan niet mee. Dat is het antwoord op de vraag die een FG of auditor hier stelt. |
| Universeel | Geldt voor elk Windows-apparaat en is voor gebruikers onmerkbaar. |

Instellingen:

```
device_vendor_msft_policy_config_system_limitdiagnosticlogcollection = 1
device_vendor_msft_policy_config_system_limitdumpcollection = 1
```

> De baseline zet telemetrie bewust op Optioneel omdat Endpoint Analytics en Windows Update-rapportage erop leunen. Dat is een verdedigbare keuze, maar hij staat op gespannen voet met ISDP01. Deze twee instellingen halen de scherpe kant eraf zonder de rapportage te breken: het niveau blijft staan, maar aanvullende diagnostische logbestanden en geheugendumps — waar gebruikersgegevens in kunnen zitten — gaan niet mee. Dat is het antwoord op de vraag die een FG of auditor hier stelt.
### [BASELINE2] - WIN - D - Kernel DMA Protection

Blokkeert randapparaten die rechtstreeks in het geheugen kunnen lezen en geen DMA-remapping ondersteunen.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Kernel_DMA_Protection.json` |
| Instellingen | 1 |
| Bron | Microsoft Security Baseline (Windows 365 / Endpoint Security) via IntuneAdmin — waarde geverifieerd tegen Policy CSP DmaGuard/DeviceEnumerationPolicy. |
| Bewezen | Een Thunderbolt- of PCIe-apparaat kan buiten het besturingssysteem om in het werkgeheugen lezen en schrijven. Dat is de bekende "evil maid"-aanval: laptop even alleen laten, stekker erin, BitLocker-sleutel uit het geheugen. Kernel DMA Protection isoleert zulke apparaten via de IOMMU; deze instelling zet de enumeratie op Block all voor apparaten die díe isolatie niet ondersteunen. Microsoft zet hem in zijn eigen security baseline op dezelfde waarde. |
| Universeel | Geldt voor elk apparaat met poorten — en dat zijn ze allemaal. Een apparaat waarvan de firmware Kernel DMA Protection niet ondersteunt negeert de instelling zonder foutmelding, dus er is geen vloot waarop hij schade doet; hij doet daar alleen niets. |

Instellingen:

```
device_vendor_msft_policy_config_dmaguard_deviceenumerationpolicy = 0
```

> De enige echte impact: een oud dock, een externe grafische kaart of een PCIe-kaart zonder DMA-remapping werkt niet meer. Het apparaat zelf blijft gewoon werken — het randapparaat wordt niet opgestart. Test daarom met de docks die in de vloot zitten vóór je breed toewijst. Vraagt een herstart om actief te worden, en geldt niet voor 1394-, PCMCIA- en ExpressCard-apparaten.
### [BASELINE2] - WIN - D - Logging

Schrijft een transcript van elke PowerShell-sessie weg, zodat achteraf te zien is wat een beheerder werkelijk heeft uitgevoerd.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Logging.json` |
| Instellingen | 3 |
| Bron | ISO/IEC 27001:2022 A.8.15 en A.8.16, NIS2 art. 21(2)(b), EASA Part-IS IS.I.OR.245 — instellingen uit CIS v4 Windows 11 L2 |
| Bewezen | Scriptblok-logging stond al aan en laat zien wélke code is geladen; het transcript laat de sessie zelf zien met invoer, uitvoer en tijdstempels. Bij het onderzoeken van een incident is dat het verschil tussen weten dat er iets is uitgevoerd en weten wat er is gebeurd. CIS v4 Windows 11 L2. |
| Universeel | Geldt voor elk Windows-apparaat. **Voorbehoud:** transcripties komen standaard in het profiel van de gebruiker terecht, waar diezelfde gebruiker ze kan verwijderen. Vul `outputdirectory` met een centrale share zodra die er is — anders is de maatregel tegen een kwaadwillende beheerder niet effectief. |

Instellingen:

```
device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting = 1
device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_enableinvocationheader = 0
device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_outputdirectory = 
```

> Scriptblok-logging stond al aan in [Baseline] - WIN - D - Security Hardening; die is hier bewust weggelaten om geen conflict te maken. Wat ontbrak is de transcriptie: scriptblok-logging laat zien wélke code is geladen, het transcript laat de sessie zelf zien met invoer, uitvoer en tijdstempels. ISMP13 vraagt dat laatste. Eén kanttekening: transcripties komen standaard in het profiel van de gebruiker terecht, waar diezelfde gebruiker ze kan verwijderen. ISMP13 vraagt om logs die een beheerder niet zelf kan wissen — vul outputdirectory dus met een centrale share zodra die er is.
### [BASELINE2] - WIN - D - Logon Hardening

Vereist CTRL+ALT+DEL vóór het aanmelden en haalt de netwerkkeuze van het vergrendelscherm weg.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Logon_Hardening.json` |
| Instellingen | 2 |
| Bron | CIS v4 Windows 11 L1 — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definitie. |
| Bewezen | CTRL+ALT+DEL is de enige toetscombinatie die Windows niet aan een gewone toepassing kan doorgeven: hij dwingt de Secure Attention Sequence af en daarmee het echte aanmeldscherm. Zonder die eis kan een programma een namaak-aanmeldscherm tonen en het wachtwoord meelezen — de klassieke credential-harvest, en de reden dat CIS hem al sinds Windows NT voorschrijft. De netwerkkeuze op het vergrendelscherm is de tweede: die laat iemand zonder aan te melden het apparaat op een ander netwerk zetten. |
| Universeel | Beide gelden voor elk Windows-apparaat en raken geen enkele toepassing. De enige zichtbare verandering is dat de gebruiker één keer extra een toetscombinatie indrukt. |

Instellingen:

```
device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_donotrequirectrlaltdel = 0
device_vendor_msft_policy_config_windowslogon_dontdisplaynetworkselectionui = 1
```

> Merkbaar voor gebruikers, dus meld het aan: na deze policy moet iedereen CTRL+ALT+DEL indrukken vóór het aanmeldscherm verschijnt. Op tablets en 2-in-1's zonder toetsenbord neemt Windows daar de Windows-knop plus aan/uit voor. De letters in de instellingsnaam zijn omgekeerd: "Do not require CTRL+ALT+DEL" op Disabled betekent dat het juist wél vereist is.
### [BASELINE2] - WIN - D - Printing Hardening

Zet Windows Protected Print aan, verbiedt gewone gebruikers het installeren van printerdrivers bij een gedeelde printer, en sluit printen over HTTP af.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Printing_Hardening.json` |
| Instellingen | 3 |
| Bron | CIS v4 Windows 11 L1 en de Microsoft Security Baseline — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definities. |
| Bewezen | De printspooler is al jaren de meest misbruikte weg naar SYSTEM-rechten op Windows: PrintNightmare (CVE-2021-34527) werkte precies doordat een gewone gebruiker een printerdriver mocht installeren bij het verbinden met een gedeelde printer. Windows Protected Print draait de spooler in een beperkte modus die alleen nog Mopria-drivers gebruikt en de hele klasse aanvallen wegneemt; Microsoft noemt het zelf de opvolger van de losse mitigaties. Onze baseline heeft wel een Printing-policy, maar die zet deze drie niet. |
| Universeel | Elk Windows-apparaat heeft een printspooler, ook een apparaat dat nooit print. Dat is nu juist het punt: de dienst draait en is aanvalbaar ongeacht of er een printer is. |

Instellingen:

```
device_vendor_msft_policy_config_printers_configurewindowsprotectedprint = 1
device_vendor_msft_policy_config_localpoliciessecurityoptions_devices_preventusersfrominstallingprinterdriverswhenconnectingtosharedprinters = 1
device_vendor_msft_policy_config_connectivity_diableprintingoverhttp = 1
```

> Windows Protected Print vraagt Windows 11 24H2 of hoger en laat printers vallen die geen Mopria-driver hebben — dat zijn in de praktijk oudere netwerkprinters en labelprinters. Inventariseer de printervloot vóór je dit breed toewijst; op een vloot zonder eigen printers is het gratis. De andere twee instellingen zijn onvoorwaardelijk veilig.
### [BASELINE2] - WIN - D - Privacy and Telemetry

Zet de advertentie-id uit, blokkeert het klembord tussen apparaten, stopt het uploaden van gebruikersactiviteiten en houdt wat de gebruiker typt en inspreekt op het apparaat.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Privacy_and_Telemetry.json` |
| Instellingen | 4 |
| Bron | CIS v4 Windows 11 L1 — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definities. |
| Bewezen | Dit zijn vier kanalen waarlangs bedrijfsgegevens het apparaat verlaten zonder dat iemand het als datastroom herkent. Het klembord tussen apparaten synchroniseert alles wat een gebruiker kopieert — wachtwoorden inbegrepen — naar de cloud en naar zijn andere apparaten, ook privéapparaten. Invoerpersonalisatie stuurt getypte en ingesproken tekst naar Microsoft om het woordenboek te verbeteren. Gebruikersactiviteiten uploaden doet hetzelfde met welke bestanden en apps iemand gebruikt. Alle vier staan in CIS L1 en alle vier zijn met één instelling dicht. |
| Universeel | Geldt voor elk apparaat en elke gebruiker. Sluit aan op de keuze die de baseline al maakte om telemetrie op Optioneel te laten staan voor Endpoint Analytics: het niveau blijft, maar deze vier persoonsgebonden stromen gaan eruit. |

Instellingen:

```
device_vendor_msft_policy_config_privacy_disableadvertisingid = 1
device_vendor_msft_policy_config_privacy_allowcrossdeviceclipboard = 0
device_vendor_msft_policy_config_privacy_uploaduseractivities = 0
device_vendor_msft_policy_config_privacy_allowinputpersonalization = 0
```

> Merkbaar op één punt: het klembord werkt niet meer tussen apparaten (plakken binnen hetzelfde apparaat blijft gewoon werken) en de tekstsuggesties worden na verloop van tijd minder persoonlijk. Vult `[ISMS] - WIN - D - Data Minimisation` aan zonder ermee te botsen — die beperkt wat er in de diagnostische gegevens meegaat, deze zet vier aparte kanalen uit.
### [BASELINE2] - WIN - D - Remote Access Hardening

Sluit de WinRM-remoteshell af en verbreekt een inactieve SMB-sessie na vijftien minuten.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Remote_Access_Hardening.json` |
| Instellingen | 2 |
| Bron | CIS v4 Windows 11 L1 — instellingen overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definities. |
| Bewezen | `AllowRemoteShellAccess` op Disabled sluit `winrs` af: het opstarten van een interactieve opdrachtshell op afstand via WinRM. Dat is een standaardstap in lateral movement — het staat in vrijwel elk aanvalsdraaiboek, van PsExec-vervangers tot Cobalt Strike. De inactieve SMB-sessie is de tweede: een sessie die open blijft staan is een sessie die iemand anders kan overnemen zodra het apparaat onbeheerd is. |
| Universeel | Beide gelden voor elk Windows-apparaat. Werkplekken hebben geen legitieme reden om inkomende remoteshells te accepteren; beheer op afstand loopt via Intune, NinjaOne en Defender, en geen daarvan gebruikt winrs. |

Instellingen:

```
device_vendor_msft_policy_config_remoteshell_allowremoteshellaccess = 0
device_vendor_msft_policy_config_localpoliciessecurityoptions_microsoftnetworkserver_amountofidletimerequiredbeforesuspendingsession = 15
```

> LET OP vóór je toewijst: controleer of er geen beheerscript of monitoringtool op WinRM leunt. `Enter-PSSession` en `Invoke-Command` blijven werken — die gebruiken de PowerShell-endpoint, niet de remoteshell — maar `winrs` en alles wat daarop bouwt niet meer. Op een vloot met on-prem beheertooling is dit de enige policy in deze set die iets kan breken dat je niet direct ziet.
### [BASELINE2] - WIN - D - Threat Protection

Haalt de lokale ontsnappingsroutes uit de malwarebescherming weg: gebruikers kunnen Exploit Protection niet overrulen, de cloudrapportage niet lokaal uitzetten, en DLL-kaping wordt moeilijker.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Threat_Protection.json` |
| Instellingen | 3 |
| Bron | ISO/IEC 27001:2022 A.8.7 en A.8.8, NIS2 art. 21(2)(e) — instellingen uit CIS v4 Windows 11 L1 |
| Bewezen | Drie plekken waar een eindgebruiker de malwarebescherming lokaal kon overrulen: Exploit Protection overschrijven, de cloudrapportage lokaal uitzetten, en de DLL-zoekvolgorde. SafeDllSearchMode is de oudste van de drie en nog steeds de goedkoopste verdediging tegen DLL-kaping — een techniek die nog wekelijks in actieve campagnes voorkomt. CIS v4 Windows 11 L1. |
| Universeel | Geldt voor elk Windows-apparaat en is voor gebruikers onmerkbaar, tenzij iemand gewend was Defender-instellingen lokaal aan te passen. |

Instellingen:

```
device_vendor_msft_policy_config_windowsdefendersecuritycenter_disallowexploitprotectionoverride = 1
device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_spynet_localsettingoverridespynetreporting = 0
device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_safedllsearchmode = 1
```

> LSA-bescherming stond al in [Baseline] - WIN - D - Device Guard and Credential Guard; wat ontbrak zijn de lokale overrides. ISMP11 eist dat de malwarebescherming niet door de eindgebruiker te wijzigen is, en dit zijn precies de drie plekken waar dat tot nu toe wél kon. SafeDllSearchMode is de oudste van de drie en nog steeds de goedkoopste verdediging tegen DLL-kaping.
### [BASELINE2] - WIN - D - Wireless and Peripherals

Maakt het apparaat onzichtbaar over Bluetooth en sluit Windows Connect Now af, zodat draadloze instellingen niet buiten het beheer om van het ene apparaat naar het andere kunnen worden overgezet. Al gekoppelde apparaten blijven werken.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Wireless_and_Peripherals.json` |
| Instellingen | 7 |
| Bron | ISO/IEC 27001:2022 A.8.20 en A.7.9, NIS2 art. 21(2)(e) — instellingen uit de Endpoint Security-set van IntuneAdmin |
| Bewezen | Windows Connect Now is de vergeten route: daarmee kan een gebruiker draadloze instellingen — inclusief het netwerkwachtwoord — via WPS of een USB-stick van het ene apparaat naar het andere overzetten, buiten elk beheer om. De vier Bluetooth-instellingen maken het apparaat onvindbaar en onbenaderbaar voor een onbekende; bestaande koppelingen blijven werken. |
| Universeel | Geldt voor elk apparaat met Bluetooth of wifi. Koptelefoons, muizen en toetsenborden die al gekoppeld zijn blijven werken — nieuw koppelen vanaf de andere kant lukt niet meer, wat bij een muis in een vergaderzaal kan opvallen. |

Instellingen:

```
device_vendor_msft_policy_config_bluetooth_allowadvertising = 0
device_vendor_msft_policy_config_bluetooth_allowdiscoverablemode = 0
device_vendor_msft_policy_config_bluetooth_allowprepairing = 0
device_vendor_msft_policy_config_bluetooth_allowpromptedproximalconnections = 0
device_vendor_msft_policy_config_deviceinstallation_preventdevicemetadatafromnetwork = 1
device_vendor_msft_policy_config_admx_windowsconnectnow_wcn_enableregistrar = 0
device_vendor_msft_policy_config_admx_windowsconnectnow_wcn_disablewcnui_2 = 1
```

> Windows Connect Now is de vergeten route: daarmee kan een gebruiker draadloze instellingen — inclusief het netwerkwachtwoord — via WPS of een USB-stick van het ene apparaat naar het andere overzetten, buiten elk beheer om. Beide instellingen sluiten dat af. Over de vraag wie elkaars wifi-profielen kan zien: profielen die via Intune of GPO worden uitgerold zijn apparaatbreed en dus voor elke gebruiker van dat apparaat zichtbaar, en wie zelf een netwerk toevoegt kan met netsh het bijbehorende wachtwoord in leesbare tekst opvragen. Zolang het bedrijfsnetwerk op een gedeeld wachtwoord (PSK) draait, kent iedere gebruiker die ooit verbonden heeft dat wachtwoord dus — daar helpt geen enkele policy tegen. De maatregel die dat wél oplost staat in ISMP19 zelf: 802.1X met certificaten, want dan is er geen gedeeld geheim om uit te lezen. Handmatige wifi-configuratie helemaal blokkeren (AllowManualWiFiConfiguration) is bewust weggelaten: dat maakt thuiswerken en hotels onmogelijk, en ISMP08 staat teleworking uitdrukkelijk toe. ISMP19 gaat verder en zegt dat alle Bluetooth-profielen behalve Serial Port Profile uit moeten. Letterlijk uitvoeren breekt koptelefoons, muizen en toetsenborden; dat vraagt eerst een besluit. Deze vier instellingen zijn de verdedigbare tussenstap: het apparaat is niet meer te ontdekken of te benaderen door een onbekende, bestaande koppelingen blijven werken. ServicesAllowedList is bewust weggelaten — die vraagt om GUID's per profiel en zet er zonder zorgvuldige lijst meer uit dan bedoeld.
### [BASELINE2] - WIN - D - Wireless Shared Devices

Laat op gedeelde apparaten alleen de netwerken toe die via Intune zijn uitgerold. Zelf toegevoegde wifi-netwerken worden verwijderd en er kunnen er geen bij.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_D_Wireless_Shared_Devices.json` |
| Instellingen | 1 |
| Bron | ISO/IEC 27001:2022 A.8.20 en A.8.1, NIS2 art. 21(2)(e) — Policy CSP Wifi/AllowManualWiFiConfiguration |
| Bewezen | Alleen door Intune uitgerolde netwerken toestaan sluit de route af waarbij een gebruiker een gedeeld apparaat aan een eigen hotspot of een onbekend netwerk hangt. Op een gedeeld apparaat is dat een reëel risico, omdat wifi-profielen daar apparaatbreed zijn en dus voor de volgende gebruiker blijven staan. |
| Universeel | **Nee — dit is de enige policy in de set die niet voor elk apparaat geldt.** Hij hoort op gedeelde apparaten. Op een laptop van één gebruiker maakt hij thuiswerken en hotels onmogelijk, en ISMP08 staat teleworking uitdrukkelijk toe. Wijs hem toe aan een groep met gedeelde apparaten, niet aan All Devices. |

Instellingen:

```
device_vendor_msft_policy_config_wifi_allowmanualwificonfiguration = 0
```

> ALLEEN voor gedeelde apparaten. Windows maakt van een netwerk dat een gebruiker zelf toevoegt standaard een all-user-profiel: elke andere gebruiker van dat apparaat ziet die SSID in de lijst staan en kan er verbinding mee maken. Het wachtwoord uitlezen lukt alleen als lokale beheerder, en dat is bij ons beperkt tot WLapsAdmin — maar de SSID-lijst zelf verraadt al waar een collega is geweest. Per-gebruiker-profielen bestaan in Windows wel (netsh wlan add profile user=current), maar de interface maakt ze nooit zo aan en er is geen MDM- of Settings Catalog-instelling die dat afdwingt: de bijbehorende GPO zit in Wireless Network (IEEE 802.11) Policies en is domeingebonden. Wat wel kan is de andere kant op: alleen nog netwerken uit Intune toestaan. TWEE VOORWAARDEN. Rol eerst een wifi-profiel uit via Intune, anders staat het apparaat na toepassing offline. En zet deze policy nooit op laptops: thuis- en hotelnetwerken werken dan niet meer, en ISMP08 staat teleworking uitdrukkelijk toe. Microsoft waarschuwt bovendien dat bestaande, door gebruikers aangemaakte profielen bij toepassing worden verwijderd — dat is hier de bedoeling, maar meld het vooraf.
### [BASELINE2] - WIN - U - AI Usage Control

Blokkeert in Edge de AI-diensten die het beleid niet heeft goedgekeurd. Microsoft Copilot blijft uitdrukkelijk bereikbaar.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_U_AI_Usage_Control.json` |
| Instellingen | 2 |
| Bron | ISO/IEC 27001:2022 A.5.10, A.5.19 en A.8.1, NIS2 art. 21(2)(d) — mechanisme uit de bestaande Edge-policy |
| Bewezen | ISMP22 verbiedt alle AI-tools behalve Microsoft Copilot, Copilot Pro en GitHub Copilot voor ontwikkelaars; op dit moment houdt niets een gebruiker tegen. Een URL-blokkeerlijst is daarbij frictie, geen grens — hij werkt niet op een telefoon en niet op een privéapparaat — maar hij maakt de regel zichtbaar en houdt het gemakzuchtige gebruik tegen. |
| Universeel | Geldt voor elke gebruiker op elk apparaat met Edge. De robuustere variant is de categorie Generative AI in Defender Web Content Filtering; die staat in het Defender-portaal, niet in deze repo. |

Instellingen:

```
user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist = 1
user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc = https://apps.microsoft.com | https://apps.microsoft.com/* | apps.microsoft.com | apps.microsoft.com/* | chatgpt.com | chat.openai.com | gemini.google.com | claude.ai | perplexity.ai | chat.deepseek.com | chat.mistral.ai | grok.com | poe.com | character.ai
```

> ISMP22 verbiedt alle AI-tools behalve Microsoft Copilot, Copilot Pro en GitHub Copilot voor ontwikkelaars; op dit moment houdt niets een gebruiker tegen. LET OP bij uitrol: [Baseline] - WIN - U - Microsoft Edge User Experience zet dezelfde blokkeerlijst. Twee toegewezen policies met een verschillende lijst leveren een conflict op, waarna Intune er géén toepast. Neem deze lijst dus over in die policy, of haal 'm daar weg — niet allebei toewijzen. De vier bestaande regels voor de Store-website staan hier al in, zodat deze lijst compleet is. Een URL-blokkeerlijst is bovendien frictie, geen grens: hij werkt niet op een telefoon en niet op een privéapparaat. De robuustere variant is de categorie Generative AI in Defender Web Content Filtering; dat staat in het Defender-portaal, niet in deze repo.

**Vervangt** in `IntuneTemplate/`: `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist` uit *[Baseline] - WIN - U - Microsoft Edge User Experience*, `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc` uit *[Baseline] - WIN - U - Microsoft Edge User Experience*. Niet allebei toewijzen.
### [BASELINE2] - WIN - U - Attachment Scanning

Laat de virusscanner elke bijlage controleren op het moment dat de gebruiker hem opent, niet alleen bij het opslaan.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/BASELINE2_WIN_U_Attachment_Scanning.json` |
| Instellingen | 1 |
| Bron | CIS v4 Windows 11 L1 — instelling overgenomen uit IntuneAdmin, waarde geverifieerd tegen de settings catalog-definitie. |
| Bewezen | Windows merkt gedownloade bestanden met de Mark of the Web. Deze instelling zorgt dat de Attachment Manager de virusscanner aanroept op het moment dat zo'n bestand wordt geopend. Dat is het moment waarop het ertoe doet: een bijlage die bij binnenkomst nog onbekend was, is een dag later wél herkend. De baseline heeft Defender volledig ingericht maar laat dit aanroeppunt vandaag ongemoeid. |
| Universeel | Geldt voor elke gebruiker op elk apparaat. Kost een fractie van een seconde bij het openen van een gedownload bestand en verandert verder niets. |

Instellingen:

```
user_vendor_msft_policy_config_attachmentmanager_notifyantivirusprograms = 1
```

> User-scoped, dus toewijzen aan gebruikers en niet aan apparaten. Werkt met Defender en met elke andere scanner die zich als antivirusprovider registreert.

---

Terug naar de [hoofd-README](../README.md).
