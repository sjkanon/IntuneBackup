<!-- Gegenereerd door scripts/check-sets.js --docs — niet met de hand bijwerken. -->

# ISMSTemplate/

10 Intune-policies die rechtstreeks uit de ISMS-documenten volgen (ISDP01–02, ISMP01–22),
voor de eisen die `IntuneTemplate/` nog niet afdwingt. Elke policy is te herleiden tot een
artikel: ISO/IEC 27001:2022 Annex A, NIS2 (richtlijn 2022/2555 art. 21), EASA Part-IS.I.OR,
en het interne ISMS-document dat het eist.

**Dit is geen tweede baseline.** De baseline staat in `IntuneTemplate/` en is uitgerold; deze
set is een voorstel dat nog op een pilotgroep moet. Daarom een eigen prefix, een eigen map en
geen enkele toewijzing:

```
IntuneTemplate/   Baseline_<PLATFORM>_<D|U>_<Item>.json    [Baseline] - WIN - D - Item    uitgerold
ISMSTemplate/     ISMS_<PLATFORM>_<D|U>_<Item>.json        [ISMS] - WIN - D - Item        pilot
```

De mapindeling binnen beide is hetzelfde (`<PLATFORM>/<CATEGORIE>/`), en `scripts/lib/templates.js`
kent beide prefixen. Wat verschilt is de pijplijn: deze set komt bewust **niet** in
`baseline/intune/baseline-v1.0.json`. Een policy die nog nergens is toegewezen hoort niet als
check tegen een tenant te worden gelegd — dat levert alleen rode vinkjes op voor iets wat
niemand heeft uitgerold.

## Uitrollen

Drie routes, alle drie zonder toewijzing:

- **CIPP** — leest deze map net als `IntuneTemplate/` rechtstreeks; de policies staan er onder
  `Package: "ISMS"`.
- **IntuneBackupAndRestore** — `node scripts/export-intunebackup.js` ververst de export, daarna:

  ```powershell
  Start-IntuneRestoreConfig -Path '<repo>\export\NativeImport\IntuneBackupAndRestore-ISMS'
  ```

  Géén `Start-IntuneRestoreAssignments`: de export bevat met opzet geen `Assignments/`-map.
- **Met de hand** aanmaken in Intune.

Daarna toewijzen aan een pilotgroep — niet aan All Devices, want een deel van deze
instellingen verandert gedrag dat gebruikers direct merken.

## Controles

```bash
node scripts/check-sets.js          # naam, plek, verantwoording en botsingen, alle sets
node scripts/check-sets.js ISMS       # alleen deze set
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
| **WIN - D - Access Control** | Toont vóór het aanmelden een waarschuwing dat het systeem alleen voor geautoriseerde gebruikers is, en verbergt de laatst aangemelde gebruikersnaam. | 6 | A.5.15 Toegangsbeveiliging · A.5.16 Identiteitsbeheer · A.5.17 Authenticatie-informatie · A.8.5 Veilige authenticatie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · IS.I.OR.245 registratie en traceerbaarheid · ISMP02 |
| **WIN - D - AI Tooling** | Blokkeert GitHub Copilot op persoonlijke accounts in Visual Studio; de zakelijke licentie blijft werken. | 1 | A.5.10 Aanvaardbaar gebruik · A.8.1 Eindpuntapparatuur van gebruikers · ISMP22 |
| **WIN - D - Business Continuity** | Zet Quick Machine Recovery aan: een apparaat dat niet meer opstart, haalt zelf een herstelpakket op uit de cloud in plaats van op een monteur te wachten. | 4 | A.5.29 Informatiebeveiliging tijdens verstoring · A.5.30 ICT-gereedheid voor bedrijfscontinuiteit · A.8.14 Redundantie · NIS2 art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer · IS.I.OR.250 continuiteit · ISMP09 · ISMP10 |
| **WIN - D - Cryptography** | Dwingt af dat Microsoft Edge geen verbindingen onder TLS 1.2 opzet, ook niet als een server dat aanbiedt. | 2 | A.8.24 Gebruik van cryptografie · NIS2 art. 21(2)(h) cryptografie en versleuteling · ISMP19 |
| **WIN - D - Data Minimisation** | Beperkt wat er in de diagnostische gegevens meegaat: geen aanvullende logbestanden en geen geheugendumps naar Microsoft. | 2 | A.5.34 Privacy en bescherming van persoonsgegevens · A.8.11 Datamaskering · ISDP01 · ISMP13 |
| **WIN - D - Logging** | Schrijft een transcript van elke PowerShell-sessie weg, zodat achteraf te zien is wat een beheerder werkelijk heeft uitgevoerd. | 3 | A.8.15 Logging · A.8.16 Monitoringactiviteiten · NIS2 art. 21(2)(b) incidentbehandeling · IS.I.OR.245 vastlegging · IS.I.OR.220 incidentrespons · ISMP13 |
| **WIN - D - Threat Protection** | Haalt de lokale ontsnappingsroutes uit de malwarebescherming weg: gebruikers kunnen Exploit Protection niet overrulen, de cloudrapportage niet lokaal uitzetten, en DLL-kaping wordt moeilijker. | 3 | A.8.7 Bescherming tegen malware · A.8.8 Beheer van technische kwetsbaarheden · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · IS.I.OR.220 · ISMP11 |
| **WIN - D - Wireless and Peripherals** | Maakt het apparaat onzichtbaar over Bluetooth en sluit Windows Connect Now af, zodat draadloze instellingen niet buiten het beheer om van het ene apparaat naar het andere kunnen worden overgezet. Al gekoppelde apparaten blijven werken. | 7 | A.8.20 Netwerkbeveiliging · A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein · NIS2 art. 21(2)(e) beveiliging bij verwerving en onderhoud · ISMP19 · ISMP14 · ISMP08 |
| **WIN - D - Wireless Shared Devices** | Laat op gedeelde apparaten alleen de netwerken toe die via Intune zijn uitgerold. Zelf toegevoegde wifi-netwerken worden verwijderd en er kunnen er geen bij. | 1 | A.8.20 Netwerkbeveiliging · A.8.1 Eindpuntapparatuur van gebruikers · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP19 · ISMP14 · ISMP08 |
| **WIN - U - AI Usage Control** | Blokkeert in Edge de AI-diensten die het beleid niet heeft goedgekeurd. Microsoft Copilot blijft uitdrukkelijk bereikbaar. | 2 | A.5.10 Aanvaardbaar gebruik · A.5.19 Informatiebeveiliging in leveranciersrelaties · A.8.1 Eindpuntapparatuur van gebruikers · NIS2 art. 21(2)(d) toeleveringsketen · ISMP22 · ISDP01 |

---

### [ISMS] - WIN - D - Access Control

Toont vóór het aanmelden een waarschuwing dat het systeem alleen voor geautoriseerde gebruikers is, en verbergt de laatst aangemelde gebruikersnaam.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Access_Control.json` |
| Instellingen | 6 |
| Bron | ISO/IEC 27001:2022 A.5.15 en A.8.5, NIS2 art. 21(2)(i), EASA Part-IS IS.I.OR.245 — instellingen uit CIS v4 Windows 11 L1 |

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
### [ISMS] - WIN - D - AI Tooling

Blokkeert GitHub Copilot op persoonlijke accounts in Visual Studio; de zakelijke licentie blijft werken.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_AI_Tooling.json` |
| Instellingen | 1 |
| Bron | ISO/IEC 27001:2022 A.5.10 en A.8.1 — instelling uit de Visual Studio-benchmark van IntuneAdmin |

Instellingen:

```
device_vendor_msft_policy_config_visualstudiov4~policy~visualstudio~copilotsettings_disablecopilotforindividuals = 1
```

> ISMP22 staat GitHub Copilot toe, maar uitsluitend voor softwareontwikkeling en uitsluitend via de goedgekeurde licentie. Zonder deze instelling kan een ontwikkelaar zijn privéaccount koppelen, en dan verlaat bedrijfscode de goedgekeurde route zonder dat iemand het ziet.
### [ISMS] - WIN - D - Business Continuity

Zet Quick Machine Recovery aan: een apparaat dat niet meer opstart, haalt zelf een herstelpakket op uit de cloud in plaats van op een monteur te wachten.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Business_Continuity.json` |
| Instellingen | 4 |
| Bron | ISO/IEC 27001:2022 A.5.29, A.5.30 en A.8.14, NIS2 art. 21(2)(c) — instellingen uit de Modern Workplace-set van IntuneAdmin |

Instellingen:

```
device_vendor_msft_remoteremediation_cloudremediationsettings_enablecloudremediation = true
device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_enableautoremediation = true
device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_setretryinterval = 30
device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_settimetoreboot = 180
```

> ISMP09 en ISMP10 gaan over continuïteit maar hebben op de werkplek zelf geen enkele technische maatregel. Dit is de goedkoopste die er is. De Wi-Fi-gegevens uit het bronprofiel zijn bewust weggelaten: die zijn tenant-specifiek en horen niet in een gedeelde baseline. Zonder die gegevens werkt het herstel over een bekabelde verbinding; heb je een vloot zonder ethernet, vul ze dan aan vóór uitrol.
### [ISMS] - WIN - D - Cryptography

Dwingt af dat Microsoft Edge geen verbindingen onder TLS 1.2 opzet, ook niet als een server dat aanbiedt.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Cryptography.json` |
| Instellingen | 2 |
| Bron | ISO/IEC 27001:2022 A.8.24, NIS2 art. 21(2)(h) — instelling uit CIS v3 Microsoft Edge L1 |

Instellingen:

```
device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin = 1
device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin_sslversionmin = tls1.2
```

> ISMP19 eist TLS 1.2 of hoger voor web- en clouddiensten. De WinINet-stack staat al goed (Internet Explorer Legacy), maar Edge zelf accepteerde tot nu toe wat de server aanbood. Let op: interne systemen die alleen TLS 1.0/1.1 spreken worden hierdoor onbereikbaar — dat is precies waarom dit een pilotpolicy is.
### [ISMS] - WIN - D - Data Minimisation

Beperkt wat er in de diagnostische gegevens meegaat: geen aanvullende logbestanden en geen geheugendumps naar Microsoft.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Data_Minimisation.json` |
| Instellingen | 2 |
| Bron | ISO/IEC 27001:2022 A.5.34 en A.8.11, AVG art. 5(1)(c) dataminimalisatie — instellingen uit CIS v4 Windows 11 L1 |

Instellingen:

```
device_vendor_msft_policy_config_system_limitdiagnosticlogcollection = 1
device_vendor_msft_policy_config_system_limitdumpcollection = 1
```

> De baseline zet telemetrie bewust op Optioneel omdat Endpoint Analytics en Windows Update-rapportage erop leunen. Dat is een verdedigbare keuze, maar hij staat op gespannen voet met ISDP01. Deze twee instellingen halen de scherpe kant eraf zonder de rapportage te breken: het niveau blijft staan, maar aanvullende diagnostische logbestanden en geheugendumps — waar gebruikersgegevens in kunnen zitten — gaan niet mee. Dat is het antwoord op de vraag die een FG of auditor hier stelt.
### [ISMS] - WIN - D - Logging

Schrijft een transcript van elke PowerShell-sessie weg, zodat achteraf te zien is wat een beheerder werkelijk heeft uitgevoerd.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Logging.json` |
| Instellingen | 3 |
| Bron | ISO/IEC 27001:2022 A.8.15 en A.8.16, NIS2 art. 21(2)(b), EASA Part-IS IS.I.OR.245 — instellingen uit CIS v4 Windows 11 L2 |

Instellingen:

```
device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting = 1
device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_enableinvocationheader = 0
device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_outputdirectory = 
```

> Scriptblok-logging stond al aan in [Baseline] - WIN - D - Security Hardening; die is hier bewust weggelaten om geen conflict te maken. Wat ontbrak is de transcriptie: scriptblok-logging laat zien wélke code is geladen, het transcript laat de sessie zelf zien met invoer, uitvoer en tijdstempels. ISMP13 vraagt dat laatste. Eén kanttekening: transcripties komen standaard in het profiel van de gebruiker terecht, waar diezelfde gebruiker ze kan verwijderen. ISMP13 vraagt om logs die een beheerder niet zelf kan wissen — vul outputdirectory dus met een centrale share zodra die er is.
### [ISMS] - WIN - D - Threat Protection

Haalt de lokale ontsnappingsroutes uit de malwarebescherming weg: gebruikers kunnen Exploit Protection niet overrulen, de cloudrapportage niet lokaal uitzetten, en DLL-kaping wordt moeilijker.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Threat_Protection.json` |
| Instellingen | 3 |
| Bron | ISO/IEC 27001:2022 A.8.7 en A.8.8, NIS2 art. 21(2)(e) — instellingen uit CIS v4 Windows 11 L1 |

Instellingen:

```
device_vendor_msft_policy_config_windowsdefendersecuritycenter_disallowexploitprotectionoverride = 1
device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_spynet_localsettingoverridespynetreporting = 0
device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_safedllsearchmode = 1
```

> LSA-bescherming stond al in [Baseline] - WIN - D - Device Guard and Credential Guard; wat ontbrak zijn de lokale overrides. ISMP11 eist dat de malwarebescherming niet door de eindgebruiker te wijzigen is, en dit zijn precies de drie plekken waar dat tot nu toe wél kon. SafeDllSearchMode is de oudste van de drie en nog steeds de goedkoopste verdediging tegen DLL-kaping.
### [ISMS] - WIN - D - Wireless and Peripherals

Maakt het apparaat onzichtbaar over Bluetooth en sluit Windows Connect Now af, zodat draadloze instellingen niet buiten het beheer om van het ene apparaat naar het andere kunnen worden overgezet. Al gekoppelde apparaten blijven werken.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Wireless_and_Peripherals.json` |
| Instellingen | 7 |
| Bron | ISO/IEC 27001:2022 A.8.20 en A.7.9, NIS2 art. 21(2)(e) — instellingen uit de Endpoint Security-set van IntuneAdmin |

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
### [ISMS] - WIN - D - Wireless Shared Devices

Laat op gedeelde apparaten alleen de netwerken toe die via Intune zijn uitgerold. Zelf toegevoegde wifi-netwerken worden verwijderd en er kunnen er geen bij.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_D_Wireless_Shared_Devices.json` |
| Instellingen | 1 |
| Bron | ISO/IEC 27001:2022 A.8.20 en A.8.1, NIS2 art. 21(2)(e) — Policy CSP Wifi/AllowManualWiFiConfiguration |

Instellingen:

```
device_vendor_msft_policy_config_wifi_allowmanualwificonfiguration = 0
```

> ALLEEN voor gedeelde apparaten. Windows maakt van een netwerk dat een gebruiker zelf toevoegt standaard een all-user-profiel: elke andere gebruiker van dat apparaat ziet die SSID in de lijst staan en kan er verbinding mee maken. Het wachtwoord uitlezen lukt alleen als lokale beheerder, en dat is bij ons beperkt tot WLapsAdmin — maar de SSID-lijst zelf verraadt al waar een collega is geweest. Per-gebruiker-profielen bestaan in Windows wel (netsh wlan add profile user=current), maar de interface maakt ze nooit zo aan en er is geen MDM- of Settings Catalog-instelling die dat afdwingt: de bijbehorende GPO zit in Wireless Network (IEEE 802.11) Policies en is domeingebonden. Wat wel kan is de andere kant op: alleen nog netwerken uit Intune toestaan. TWEE VOORWAARDEN. Rol eerst een wifi-profiel uit via Intune, anders staat het apparaat na toepassing offline. En zet deze policy nooit op laptops: thuis- en hotelnetwerken werken dan niet meer, en ISMP08 staat teleworking uitdrukkelijk toe. Microsoft waarschuwt bovendien dat bestaande, door gebruikers aangemaakte profielen bij toepassing worden verwijderd — dat is hier de bedoeling, maar meld het vooraf.
### [ISMS] - WIN - U - AI Usage Control

Blokkeert in Edge de AI-diensten die het beleid niet heeft goedgekeurd. Microsoft Copilot blijft uitdrukkelijk bereikbaar.

| | |
|---|---|
| Bestand | `WIN/SettingsCatalog/ISMS_WIN_U_AI_Usage_Control.json` |
| Instellingen | 2 |
| Bron | ISO/IEC 27001:2022 A.5.10, A.5.19 en A.8.1, NIS2 art. 21(2)(d) — mechanisme uit de bestaande Edge-policy |

Instellingen:

```
user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist = 1
user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc = https://apps.microsoft.com | https://apps.microsoft.com/* | apps.microsoft.com | apps.microsoft.com/* | chatgpt.com | chat.openai.com | gemini.google.com | claude.ai | perplexity.ai | chat.deepseek.com | chat.mistral.ai | grok.com | poe.com | character.ai
```

> ISMP22 verbiedt alle AI-tools behalve Microsoft Copilot, Copilot Pro en GitHub Copilot voor ontwikkelaars; op dit moment houdt niets een gebruiker tegen. LET OP bij uitrol: [Baseline] - WIN - U - Microsoft Edge User Experience zet dezelfde blokkeerlijst. Twee toegewezen policies met een verschillende lijst leveren een conflict op, waarna Intune er géén toepast. Neem deze lijst dus over in die policy, of haal 'm daar weg — niet allebei toewijzen. De vier bestaande regels voor de Store-website staan hier al in, zodat deze lijst compleet is. Een URL-blokkeerlijst is bovendien frictie, geen grens: hij werkt niet op een telefoon en niet op een privéapparaat. De robuustere variant is de categorie Generative AI in Defender Web Content Filtering; dat staat in het Defender-portaal, niet in deze repo.

**Vervangt** in `IntuneTemplate/`: `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist` uit *[Baseline] - WIN - U - Microsoft Edge User Experience*, `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc` uit *[Baseline] - WIN - U - Microsoft Edge User Experience*. Niet allebei toewijzen.

---

Terug naar de [hoofd-README](../README.md).
