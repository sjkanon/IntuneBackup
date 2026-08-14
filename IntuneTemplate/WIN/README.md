<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# Windows — 73 policies

Alle policies heten `[Baseline] - WIN - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 64 |
| `DeviceConfigurations/` | 4 |
| `AdministrativeTemplates/` | 1 |
| `CompliancePolicies/` | 4 |

## Device-scoped (D) — 56

Toewijzen aan apparaatgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| **Administrator Protection** | Laat beheerders standaard zonder verhoogde rechten werken en per handeling om toestemming vragen. Windows 11 24H2 en hoger. | Settings Catalog | 2 | All Devices | `INTUNE-BASE-055-DAdministratorProtection` |
| **Attack Surface Reduction** | Blokkeert de aanvalstechnieken uit Defender's Attack Surface Reduction-regels: macro's die processen starten, uitvoerbare inhoud uit e-mail en USB, misbruik van Office- en scriptmotoren, en het uitlezen van inloggegevens uit LSASS. | Settings Catalog | 19 | All Devices | `INTUNE-BASE-007-ASRDefaultRules` |
| **Audit and Event Logging** | Legt vast welke gebeurtenissen Windows registreert en hoe groot de logboeken zijn — de basis voor onderzoek achteraf. | Settings Catalog | 40 | All Devices | `INTUNE-BASE-009-Auditing` |
| **Automatic Restart Sign On** | Meldt de gebruiker na een herstart voor updates automatisch en vergrendeld weer aan, zodat opstartprogramma's draaien zonder dat het apparaat onbeheerd ontgrendeld staat. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-056-DAutomaticRestartSignOn` |
| **BitLocker** | Versleutelt de OS-schijf en, via de behouden eigen instellingen, ook vaste en verwisselbare schijven. Herstelsleutels worden in Entra ID bewaard. | Settings Catalog | 36 | All Devices | `INTUNE-BASE-011-Bitlocker` |
| **Cloud Optimized Content** | Zet de cloudgestuurde inhoudsaanbevelingen van Windows uit — het apparaatdeel van dezelfde OIB-policy als Windows Spotlight. | Settings Catalog | 1 | All Devices | `INTUNE-BASE-057-DCloudOptimizedContent` |
| **Config Refresh** | Zet lokaal gewijzigde instellingen periodiek terug naar wat Intune voorschrijft, zodat handmatig geknoei op een apparaat vanzelf ongedaan wordt gemaakt. | Settings Catalog | 2 | All Devices | `INTUNE-BASE-058-DConfigRefresh` |
| **Defender Additional Configuration** | Defender-instellingen die niet in het Endpoint Security-template passen en daarom een losse policy vereisen. | Settings Catalog | 9 | All Devices | `INTUNE-BASE-059-DDefenderAdditionalConfiguration` |
| **Defender Antivirus** | Kernconfiguratie van Defender Antivirus: realtimebeveiliging, cloudbescherming, scanschema, en wat er gebeurt bij een detectie. | Settings Catalog | 31 | All Devices | `INTUNE-BASE-012-DefaultAVPolicy` |
| **Defender for Endpoint EDR** | Koppelt het apparaat aan Defender for Endpoint met het onboarding-pakket van deze tenant. Dat pakket is tenant-specifiek en moet na een restore in een andere tenant handmatig opnieuw gekoppeld worden. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-014-EDRConfiguration` |
| **Defender Security Experience** | Bepaalt wat de gebruiker in de Windows-beveiligingsapp ziet en zelf mag uitzetten. | Settings Catalog | 4 | All Devices | `INTUNE-BASE-060-DDefenderSecurityExperience` |
| **Defender Update Ring 1 Pilot** | Haalt nieuwe Defender-definities en engineversies als eerste binnen, zodat je een slechte update opmerkt vóór de rest van de organisatie 'm krijgt. | Settings Catalog | 3 | — | `INTUNE-BASE-061-DDefenderUpdateRing1Pilot` |
| **Defender Update Ring 2 UAT** | Tweede ring voor Defender-updates: loopt achter op de pilot en voor op productie. | Settings Catalog | 3 | — | `INTUNE-BASE-062-DDefenderUpdateRing2UAT` |
| **Defender Update Ring 3 Production** | Productiering voor Defender-updates: krijgt definities en engineversies pas nadat ring 1 en 2 ze zonder problemen hebben gedraaid. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-063-DDefenderUpdateRing3Production` |
| **Delivery Optimisation** | Laat apparaten updates onderling uitwisselen in plaats van ze allemaal apart van internet te halen, en begrenst hoeveel bandbreedte dat mag kosten. | Settings Catalog | 12 | All Devices | `INTUNE-BASE-064-DDeliveryOptimisation` |
| **Device Guard and Credential Guard** | Zet virtualisatie-gebaseerde beveiliging, Credential Guard en geheugenintegriteit aan, zodat inloggegevens in een afgeschermd deel van het geheugen staan. Vraagt een herstart en kan oude stuurprogramma's blokkeren. | Settings Catalog | 8 | All Devices | `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard` |
| **Device Lock** | Bepaalt wanneer het scherm vergrendelt en welke eisen aan de toegangscode gelden, plus het gedrag bij dichtklappen en stroom. | Settings Catalog | 15 | All Devices | `INTUNE-BASE-013-DeviceLock` |
| **Disable NTLM** | Zet de verouderde NTLM-authenticatie uit ten gunste van Kerberos. Breekt oude on-prem toepassingen en apparaten die geen Kerberos spreken — eerst testen. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-066-DDisableNTLM` |
| **Endpoint Analytics** | Stuurt opstart- en prestatiegegevens naar Endpoint Analytics, zodat trage apparaten zichtbaar worden vóór gebruikers erover bellen. | Device config | — | All Devices | — |
| **Enhanced Phishing Protection** | Waarschuwt zodra een gebruiker zijn werkwachtwoord intypt op een phishingsite, hergebruikt in een app of opslaat in een tekstbestand. | Settings Catalog | 4 | All Devices | `INTUNE-BASE-024-Smartscreen` |
| **In Box App Removal** | Verwijdert de consumenten-apps die standaard in Windows zitten en op een werkapparaat niets te zoeken hebben. | Settings Catalog | 26 | All Devices | `INTUNE-BASE-068-DInBoxAppRemoval` |
| **Internet Explorer Legacy** | Hardening van de Internet Explorer-engine, die nog steeds draait onder de IE-modus van Edge en binnen oude toepassingen. | Settings Catalog | 206 | All Devices | `INTUNE-BASE-069-DInternetExplorerLegacy` |
| **Legacy Hardening** | De hardeningsinstellingen uit de oude Administrative Templates-policy waar OpenIntuneBaseline geen tegenhanger voor heeft: hardened UNC-paden, WDigest, blokkade van apparaatklassen, multicast-DNS en het verwerken van registerbeleid. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-070-DLegacyHardening` |
| **Local Administrators** | Bepaalt wie er lid is van de lokale groep Administrators, zodat LAPS een beheerde groep beheert in plaats van wat er toevallig op het apparaat staat. | Settings Catalog | 4 | All Devices | `INTUNE-BASE-071-DLocalAdministrators` |
| **Local Security Policies** | De lokale beveiligingsopties van Windows: anonieme toegang, het netwerkauthenticatieniveau, het gedrag van gebruikersaccountbeheer en het vergrendelen na inactiviteit. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-018-LocalPoliciesSecurityOptions` |
| **Location and Privacy** | Bepaalt welke privacygevoelige gegevens apps mogen opvragen, zoals locatie en spraak. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-022-Privacy` |
| **Login and Lock Screen** | Bepaalt wat er op het aanmeld- en vergrendelscherm zichtbaar en mogelijk is, zoals de laatst aangemelde gebruiker en camera-toegang. | Settings Catalog | 8 | All Devices | `INTUNE-BASE-072-DLoginAndLockScreen` |
| **Microsoft Accounts** | Bepaalt of persoonlijke Microsoft-accounts op een werkapparaat gebruikt en toegevoegd mogen worden. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-073-DMicrosoftAccounts` |
| **Microsoft Edge Search Engine** | Zet Google als standaardzoekmachine in Edge. Een klantkeuze, geen beveiligingsinstelling. | ADMX | 5 | All Devices | `INTUNE-BASE-015-EdgeStandardSearchEngineGoogle` |
| **Microsoft Edge Security** | De beveiligingsinstellingen van Edge: SmartScreen, downloadcontrole, certificaatgedrag en welke sites onbeveiligde inhoud mogen laden. | Settings Catalog | 54 | All Devices | `INTUNE-BASE-020-MicrosoftEdge` |
| **Microsoft Edge Updates** | Hoe en wanneer Edge zichzelf bijwerkt, en dat een gebruiker dat niet kan uitstellen. | Settings Catalog | 22 | All Devices | `INTUNE-BASE-074-DMicrosoftEdgeUpdates` |
| **Microsoft Office Security** | De macrobeveiliging van Office: blokkeert macro's in bestanden uit internet, beperkt ActiveX en oude bestandsformaten. Het zwaartepunt van deze baseline voor phishing via bijlagen. | Settings Catalog | 209 | All Devices | `INTUNE-BASE-075-DMicrosoftOfficeSecurity` |
| **Microsoft Office Updates** | Op welk updatekanaal Office zit en hoe snel updates worden geïnstalleerd. | Settings Catalog | 6 | All Devices | `INTUNE-BASE-021-OfficeUpdates` |
| **Microsoft OneDrive** | Meldt de OneDrive-client automatisch aan met het werkaccount en verplaatst Bureaublad, Documenten en Afbeeldingen naar OneDrive, zodat er niets alleen lokaal staat. | Settings Catalog | 19 | All Devices | `INTUNE-BASE-029-OnedriveSilentLogin` |
| **Microsoft Store** | Beperkt de Microsoft Store, zodat gebruikers geen willekeurige apps kunnen installeren. | Settings Catalog | 7 | All Devices | `INTUNE-BASE-019-MicrosoftAppStore` |
| **Passwordless** | Verbergt het wachtwoordveld bij het aanmelden, zodat gebruikers Windows Hello of een beveiligingssleutel gebruiken in plaats van hun wachtwoord in te typen. | Settings Catalog | 4 | All Devices | `INTUNE-BASE-076-DPasswordless` |
| **Printing** | Hardening tegen PrintNightmare: beperkt Point and Print en het installeren van printerdrivers door gebruikers. | Settings Catalog | 20 | All Devices | `INTUNE-BASE-077-DPrinting` |
| **Remote Desktop and RPC** | Beperkt Remote Desktop en externe procedure-aanroepen, twee ingangen die bij een inbraak vaak voor zijwaartse beweging worden gebruikt. | Settings Catalog | 12 | All Devices | `INTUNE-BASE-078-DRemoteDesktopAndRPC` |
| **Script File Associations** | Laat .js-, .vbs- en .hta-bestanden openen in Kladblok in plaats van in de scripthost, zodat dubbelklikken op zo'n bijlage niets uitvoert. | Settings Catalog | 1 | All Devices | `INTUNE-BASE-079-DScriptFileAssociations` |
| **Security Hardening** | Verzameling losse hardeningsinstellingen: verouderde SMB- en NTLM-varianten, automatisch afspelen, PowerShell-logging en het afschermen van systeemonderdelen. | Settings Catalog | 96 | All Devices | `INTUNE-BASE-080-DSecurityHardening` |
| **Settings Sync** | Bepaalt welke Windows-instellingen tussen apparaten gesynchroniseerd worden. | Settings Catalog | 4 | All Devices | `INTUNE-BASE-081-DSettingsSync` |
| **Timezone** | Laat Windows de tijdzone automatisch bepalen, zodat logboeken en certificaten niet op een verkeerde tijd staan. | Settings Catalog | 10 | All Devices | `INTUNE-BASE-082-DTimezone` |
| **Update Reports and Telemetry** | Stuurt de diagnostische gegevens die Windows Update for Business Reports nodig heeft om te laten zien welke apparaten achterlopen. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-083-DUpdateReportsAndTelemetry` |
| **User Rights** | Legt vast wie welke rechten op het apparaat heeft: aanmelden als service, back-ups maken, het apparaat afsluiten, stuurprogramma's laden. | Settings Catalog | 25 | All Devices | `INTUNE-BASE-026-UserRights` |
| **Windows Feature Configuration** | Zet Windows-functies uit die bedrijfsdata naar buiten kunnen brengen of ruis opleveren, zoals zoeken op internet vanuit het startmenu. | Settings Catalog | 8 | All Devices | `INTUNE-BASE-084-DWindowsFeatureConfiguration` |
| **Windows Firewall Rules** | Blokkeert uitgaand verkeer van ingebouwde Windows-programma's die malware gebruikt om verkeer te camoufleren (calc.exe, notepad.exe, mshta.exe). | Settings Catalog | 48 | All Devices | `INTUNE-BASE-085-DWindowsFirewallRules` |
| **Windows Firewall** | Zet de Windows Firewall aan voor het domein-, privé- en openbare profiel en legt het standaardgedrag voor in- en uitgaand verkeer vast. | Settings Catalog | 31 | All Devices | `INTUNE-BASE-016-Firewall` |
| **Windows Hello Cloud Kerberos Trust** | Laat Windows Hello werken tegen een on-prem Active Directory zonder certificaten, via een Kerberos-ticket uit Entra ID. | Settings Catalog | 2 | All Devices | `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust` |
| **Windows Hello for Business** | Laat gebruikers aanmelden met een PIN of biometrie in plaats van een wachtwoord. Vereist een TPM, een PIN van minimaal zes tekens en anti-spoofing bij gezichtsherkenning. | Settings Catalog | 6 | All Devices | `INTUNE-BASE-087-DWindowsHelloForBusiness` |
| **Windows LAPS** | Roteert automatisch het wachtwoord van het lokale beheerdersaccount en bewaart het in Entra ID, zodat er geen gedeeld beheerderswachtwoord meer rondgaat. | Settings Catalog | 13 | All Devices | `INTUNE-BASE-027-WindowsLAPSPolicy` |
| **Windows Package Manager** | Beperkt winget, zodat gebruikers geen software van willekeurige bronnen kunnen installeren. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-088-DWindowsPackageManager` |
| **Windows Sandbox** | Beperkt Windows Sandbox, dat anders een wegwerp-Windows opent met toegang tot het netwerk en het klembord van de host. | Settings Catalog | 6 | All Devices | `INTUNE-BASE-089-DWindowsSandbox` |
| **Windows Subsystem for Linux** | Beperkt het Windows-subsysteem voor Linux, dat anders een volledige tweede omgeving naast Windows opent waar de meeste beveiligingscontroles niet gelden. | Settings Catalog | 10 | All Devices | `INTUNE-BASE-090-DWindowsSubsystemForLinux` |
| **Windows Update Ring 1 Pilot** | Eerste updatering: krijgt Windows-updates meteen, zodat problemen zichtbaar worden op een kleine groep. | Device config | — | — | — |
| **Windows Update Ring 2 UAT** | Tweede updatering: krijgt Windows-updates na de pilot en vóór productie. | Device config | — | — | — |
| **Windows Update Ring 3 Production** | Productiering voor Windows-updates: installeert dagelijks om 13:00 met een uitsteltermijn van twee dagen. | Device config | — | All Devices | — |

## User-scoped (U) — 17

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| **Compliance Defender for Endpoint** | Toetst het risiconiveau dat Defender for Endpoint aan het apparaat toekent. Vereist een werkende koppeling met Defender for Endpoint in Intune. | Compliance | — | All Users | — |
| **Compliance Device Health** | Toetst of het apparaat versleuteld is en veilig opstart (BitLocker, Secure Boot, code-integriteit). Zonder deze toets is 'vereis een compliant apparaat' in Conditional Access betekenisloos. | Compliance | — | All Users | — |
| **Compliance Device Security** | Toetst de beveiligingsstand van het apparaat: firewall, antivirus en beveiligingsonderdelen die aan horen te staan. | Compliance | — | All Users | — |
| **Compliance Password** | Toetst of het apparaat een wachtwoord of PIN vereist en hoe sterk die moet zijn. | Compliance | — | All Users | — |
| **Copilot** | Bepaalt of Copilot in Windows beschikbaar is voor de gebruiker. | Settings Catalog | 2 | All Users | `INTUNE-BASE-097-UCopilot` |
| **Microsoft Edge Extensions** | Bepaalt welke Edge-extensies gebruikers mogen installeren, en welke verplicht zijn. | Settings Catalog | 6 | All Users | `INTUNE-BASE-098-UMicrosoftEdgeExtensions` |
| **Microsoft Edge Password Management** | Bepaalt of Edge wachtwoorden mag opslaan en tonen, zodat werkwachtwoorden niet in een browserprofiel belanden. | Settings Catalog | 5 | All Users | `INTUNE-BASE-099-UMicrosoftEdgePasswordManagement` |
| **Microsoft Edge Profiles and Sync** | Bepaalt met welk account gebruikers zich in Edge aanmelden en wat er gesynchroniseerd wordt, zodat werkgegevens niet naar een privéprofiel lopen. | Settings Catalog | 9 | All Users | `INTUNE-BASE-100-UMicrosoftEdgeProfilesAndSync` |
| **Microsoft Edge User Experience** | De dagelijkse Edge-ervaring: startpagina, zoeksuggesties, meldingen en welke functies zichtbaar zijn. | Settings Catalog | 20 | All Users | `INTUNE-BASE-101-UMicrosoftEdgeUserExperience` |
| **Microsoft Office Experience** | De Office-ervaring per gebruiker: eerste-keer-schermen, aangesloten diensten en welke functies zichtbaar zijn. | Settings Catalog | 29 | All Users | `INTUNE-BASE-102-UMicrosoftOfficeExperience` |
| **Microsoft Office Security** | De gebruikerskant van de Office-beveiliging: macrogedrag, vertrouwde locaties en beveiligde weergave. | Settings Catalog | 221 | All Users | `INTUNE-BASE-103-UMicrosoftOfficeSecurity` |
| **Microsoft OneDrive** | De gebruikerskant van OneDrive: welke schermen en meldingen de gebruiker ziet. | Settings Catalog | 8 | All Users | `INTUNE-BASE-032-UMicrosoftOneDrive` |
| **Microsoft Outlook** | Configureert het Exchange Online-profiel van de gebruiker automatisch, zodat Outlook werkt zonder handmatig een account toe te voegen. | Settings Catalog | 1 | All Users | `INTUNE-BASE-010-AutomaticConfigurationOfOutlook` |
| **Microsoft Store** | De gebruikerskant van de Store-beperkingen. | Settings Catalog | 3 | All Users | `INTUNE-BASE-104-UMicrosoftStore` |
| **Personal Data Encryption** | Versleutelt de persoonlijke mappen van de gebruiker met een sleutel die aan hun Windows Hello-aanmelding hangt, zodat de data ook op een aanstaand apparaat versleuteld blijft. | Settings Catalog | 4 | All Users | `INTUNE-BASE-105-UPersonalDataEncryption` |
| **Windows Spotlight** | Zet Windows Spotlight, tips en consumentgerichte suggesties uit, zodat er geen advertenties en aanbevolen apps op een werkapparaat verschijnen. | Settings Catalog | 11 | All Users | `INTUNE-BASE-106-UWindowsSpotlight` |
| **Windows User Experience** | Zet meldingen op het vergrendelscherm en automatisch aanvullen in Internet Explorer uit. | Settings Catalog | 2 | All Users | `INTUNE-BASE-031-UWindowsUserExperience` |

---

**Wat het doet** komt uit `doel` in [`_oib-manifest.json`](../_oib-manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
