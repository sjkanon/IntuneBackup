<!-- Gegenereerd door scripts/check-sets.js --docs — niet met de hand bijwerken. -->

# BASELINE2/

6 Intune-policies die de uitgerolde baseline aanvullen en op alle drie de vragen ja
antwoorden: **werkt het aantoonbaar**, **hebben we het nodig** om gebruikers veilig te
stellen, en **geldt het voor élk apparaat**? Een maatregel die op één van de drie nee
scoort hoort hier niet — die hoort in `ISMSTemplate/` (verantwoording vanuit een norm) of
nergens.

De set is samengesteld door `IntuneTemplate/` en `ISMSTemplate/` op `settingDefinitionId`
te vergelijken met de 874 profielen van IntuneAdmin/IntuneBaselines (CIS v4 Windows 11
L1/L2, CIS Edge, de Microsoft Endpoint Security-baselines, Modern Workplace en de ISO
27001- en NIS2-mappen). Elke instelling hier ontbrak in beide eigen sets.

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
| **MAC - D - Passcode and Screen Lock** | Stelt op de Mac het wachtwoord en de schermvergrendeling in die de compliance-policy al eist: minimaal acht tekens, geen eenvoudig wachtwoord, vergrendelen na vijftien minuten. | 7 | A.5.17 Authenticatie-informatie · A.8.1 Eindpuntapparatuur van gebruikers · A.8.5 Veilige authenticatie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 |
| **WIN - D - Account Lockout** | Sluit een account 15 minuten af na tien mislukte aanmeldpogingen, ook dat van de ingebouwde beheerder, en zet het apparaat na tien mislukte pogingen in BitLocker-herstel. | 3 | A.5.15 Toegangsbeveiliging · A.5.17 Authenticatie-informatie · A.8.5 Veilige authenticatie · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 |
| **WIN - D - Audit Policy Enforcement** | Laat de gedetailleerde auditinstellingen voorgaan op de oude categorie-instellingen, zodat de auditpolicy van de baseline daadwerkelijk bepaalt wat er wordt gelogd. | 1 | A.8.15 Logging · A.8.16 Monitoringactiviteiten · NIS2 art. 21(2)(b) incidentbehandeling · IS.I.OR.245 registratie en traceerbaarheid · ISMP13 |
| **WIN - D - Kernel DMA Protection** | Blokkeert randapparaten die rechtstreeks in het geheugen kunnen lezen en geen DMA-remapping ondersteunen. | 1 | A.7.9 Beveiliging van bedrijfsmiddelen buiten het terrein · A.8.1 Eindpuntapparatuur van gebruikers · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP14 |
| **WIN - D - Logon Hardening** | Vereist CTRL+ALT+DEL vóór het aanmelden en haalt de netwerkkeuze van het vergrendelscherm weg. | 2 | A.5.15 Toegangsbeveiliging · A.8.5 Veilige authenticatie · A.8.20 Netwerkbeveiliging · NIS2 art. 21(2)(i) toegangsbeleid en authenticatie · ISMP02 |
| **WIN - U - Attachment Scanning** | Laat de virusscanner elke bijlage controleren op het moment dat de gebruiker hem opent, niet alleen bij het opslaan. | 1 | A.8.7 Bescherming tegen malware · NIS2 art. 21(2)(e) beveiliging van netwerk- en informatiesystemen · ISMP11 |

---

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
