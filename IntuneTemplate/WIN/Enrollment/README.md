**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Windows Autopilot: klassiek en device preparation

Twee manieren om een nieuwe Windows-pc tijdens OOBE in te richten. Ze kunnen naast elkaar in één
tenant bestaan, maar **één apparaat doorloopt er altijd maar één**. Geen van beide is een van de
vijf CIPP-templatetypes; ze rollen dus niet uit via een CIPP-pakket. CIPP heeft er wel
drie *standards* voor; zie [Uitrollen](#uitrollen).

| Bestand | Wat | Variant |
|---|---|---|
| [`WIN-Autopilot-Deployment-Profile.json`](WIN-Autopilot-Deployment-Profile.json) | deployment profile (`azureADWindowsAutopilotDeploymentProfile`) | klassiek (v1) |
| [`WIN-Autopilot-Enrollment-Status-Page.json`](WIN-Autopilot-Enrollment-Status-Page.json) | Enrollment Status Page (`windows10EnrollmentCompletionPageConfiguration`) | klassiek (v1) |
| [`WIN-Autopilot-Device-Preparation.json`](WIN-Autopilot-Device-Preparation.json) | device preparation-policy (settings catalog, template `80d33118-…_1`) | device preparation (v2) |
| [`../../../scripts/New-WindowsAutopilotPolicy.ps1`](../../../scripts/New-WindowsAutopilotPolicy.ps1) | maakt elk van de drie aan uit de JSON, regelt de apparaatgroep voor v2, exporteert met `-Export` | beide |

## Welke variant

| Nodig | Klassiek | Device preparation |
|---|:---:|:---:|
| Microsoft Entra join | ✅ | ✅ |
| Microsoft Entra **hybrid** join | ✅ | ❌ |
| Pre-provisioning (white glove), self-deploying (kiosk), Autopilot reset | ✅ | ❌ |
| Windows 10 | ✅ | ❌ |
| Apparaat vooraf registreren (hardware-hash) | verplicht | niet nodig |
| Gebruikersfase blokkeren tot gebruikersapps en -policies er zijn | ✅ (user ESP) | ❌ |
| Win32- en LOB-apps in dezelfde uitrol | ❌ | ✅ |
| Rapport bijna realtime, met logs bij een fout | ❌ | ✅ |
| Max. apps tijdens OOBE | 100 (ESP) | 25 apps + 10 scripts |

**Welke wint.** Is een apparaat als Autopilot-apparaat geregistreerd, dan draait het klassieke
profiel, tenzij het apparaat via *device association* aan de tenant gekoppeld is: dan wint device
preparation. Wil je device preparation op een geregistreerd apparaat zonder association, dan moet
het eerst uit Autopilot worden *gederegistreerd*.

**Advies.** Device preparation voor nieuwe, Entra-joined Windows 11-laptops die rechtstreeks naar de
gebruiker gaan. Klassiek houden voor pre-provisioning door een partner, kiosk- en
vergaderruimteapparaten, hybrid join, en apparaten die de leverancier al registreert. Daarom staat
`hardwareHashExtractionEnabled` in het klassieke profiel op `false`. Op `true` registreert Intune
elk beheerd apparaat in de toegewezen groep in Autopilot, en vanaf dat moment krijgt zo'n apparaat
geen device preparation meer.

## Voorwaarden

Voor beide:

- **Entra ID → Devices → Device settings → Users may join devices to Microsoft Entra**: *All*, of
  een groep waar alle gebruikers in zitten die zelf een pc inrichten. Zonder dat stopt OOBE bij de
  aanmelding.
- **Windows automatic enrollment**: MDM user scope op *All* of op diezelfde groep.
- Een licentie met Entra ID P1 en Intune (Business Premium, E3/E5, EMS) **toegewezen aan de
  gebruiker**.
- **Company branding** in Entra ID. Zonder branding doet *verberg de opties om van account te
  wisselen* niets.
- [`Baseline_WIN_D_Enrollment_Hardening`](../SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.md)
  eist netwerk tijdens OOBE. Dat past bij beide varianten: geen van beide werkt offline.
- **Persoonlijke Windows-inschrijving geblokkeerd?** Een Autopilot-geregistreerd apparaat telt
  automatisch als bedrijfsapparaat. Voor device preparation heb je dan *corporate identifiers*
  (fabrikant, model, serienummer) of *device association* nodig, anders wordt de inschrijving
  geweigerd.

Extra voor device preparation:

- Windows 11 24H2 of later, of 22H2/23H2 met KB5035942 (installatiemedia van april 2024 of later).
  Controleer bij de leverancier welke build er op nieuwe apparaten staat.
- Een **beveiligingsgroep voor apparaten** met de service principal **Intune Provisioning Client**
  (appId `f1346770-5b25-470b-88bd-d5744ab7952c`) als eigenaar. In sommige tenants heet die
  *Intune Autopilot ConfidentialClient*; de appId is wat telt. Het script maakt beide aan met
  `-CreateDeviceGroup`.
- RBAC voor wie het beheert: *Enrollment programs → Enrollment time device membership assignment*
  bovenop de gebruikelijke rechten op device configurations.

## Klassiek: deployment profile + Enrollment Status Page

### Deployment profile

| Property | Waarde | Waarom |
|---|---|---|
| `displayName` | `[Baseline] WIN Autopilot User Driven` | **Geen koppeltekens.** Intune accepteert in een profielnaam alleen letters, cijfers, spaties en `: " ? . @ $ & _ [ ] { } \| \`. Bij een koppelteken antwoordt de service met een kale 500 zonder reden. Daarom wijkt deze naam af van de `[Baseline] - …`-conventie. |
| `outOfBoxExperienceSetting.deviceUsageType` | `singleUser` | user-driven; `shared` is self-deploying en hoort in een apart kioskprofiel |
| `outOfBoxExperienceSetting.userType` | `standard` | de gebruiker wordt geen lokale admin; adminwerk loopt via LAPS |
| `preprovisioningAllowed` | `true` | een partner of de servicedesk kan apparaten vooraf inrichten (Windows-toets 5× in OOBE). Doet niets als niemand het gebruikt. |
| `hardwareHashExtractionEnabled` | `false` | zie [Welke variant](#welke-variant) |
| `escapeLinkHidden` · `privacySettingsHidden` · `eulaHidden` | `true` | geen consumentenschermen; privacy-instellingen komen uit policy |
| `keyboardSelectionPageSkipped` | `false` | in België wisselen azerty-be, azerty-fr en qwerty per gebruiker. Wie één indeling heeft, zet dit op `true` en `locale` op een vaste taal. |
| `locale` | `os-default` | de taal van de Windows-image |
| `deviceNameTemplate` | leeg | Windows houdt de naam die het zelf kiest. Wil je een vaste naam: maximaal **15 tekens** na het invullen van de macro's (NetBIOS), `%SERIAL%` of `%RAND:x%`, bijvoorbeeld `PFX-%RAND:6%`. Het script weigert een sjabloon langer dan 15 tekens. |

Toewijzen gaat aan een **apparaatgroep** van geregistreerde apparaten. Een dynamische groep vangt
alles wat in Autopilot staat:

```
(device.devicePhysicalIDs -any (_ -startsWith "[ZTDid]"))
```

Of alleen een group tag (bijvoorbeeld voor een tweede profiel voor kiosken):

```
(device.devicePhysicalIDs -any (_ -eq "[OrderID]:KIOSK"))
```

Registreren gaat via de leverancier of reseller (partner-ID in het Microsoft 365-beheercentrum),
met `Get-WindowsAutopilotInfo -Online` op het apparaat zelf, of via CSV in **Devices → Enrollment →
Devices → Import**. CIPP kan het ook: **Endpoint → Autopilot → Add Autopilot Device**.

### Enrollment Status Page

| Property | Waarde | Waarom |
|---|---|---|
| `trackInstallProgressForAutopilotOnly` | `true` | alleen bij Autopilot; een handmatige inschrijving of een bestaand apparaat krijgt geen ESP |
| `showInstallationProgress` | `true` | zonder dit is er geen ESP |
| `selectedMobileAppIds` | leeg | blokkeert op **alle** apps die aan het apparaat zijn toegewezen. Wordt dat te veel, kies dan de essentiële apps. |
| `installProgressTimeoutInMinutes` | `90` | 60 is krap zodra de quality updates hieronder meedraaien |
| `installQualityUpdates` | `true` | het apparaat is gepatcht vóór de gebruiker het bureaublad ziet; kost 20 tot 40 minuten en soms een herstart |
| `allowDeviceUseOnInstallFailure` | `false` | geen bureaublad zonder baseline |
| `allowDeviceResetOnInstallFailure` · `allowLogCollectionOnInstallFailure` | `true` | de gebruiker kan opnieuw beginnen en logs meegeven aan de servicedesk |
| `blockDeviceSetupRetryByUser` | `false` | opnieuw proberen mag |
| `disableUserStatusTrackingAfterFirstUser` | `true` | alleen de eerste gebruiker wacht op de gebruikersfase |
| `priority` | `1` | wordt in de POST genegeerd. Het script zet hem daarna met `setPriority`. |

Toewijzen aan dezelfde apparaatgroep als het profiel. De standaard-ESP (*All users and all
devices*) blijft zoals hij is.

**Herstart tussen apparaat- en gebruikersfase.** OIB wijst Device Guard en Credential Guard aan
gebruikers toe om een herstart midden in Autopilot te vermijden. Hier zijn ze device-scoped
([`Baseline_WIN_D_Device_Guard_and_Credential_Guard`](../SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md)),
dus verwacht één herstart na de apparaatfase. De gebruiker meldt zich daarna opnieuw aan. Dat is
geen fout. Zet het wel in de overdrachtsinstructie.

## Device preparation (Autopilot v2)

Hoe het werkt:

1. De gebruiker meldt zich aan in OOBE. Intune zoekt de device preparation-policy die aan een
   **gebruikersgroep** van die gebruiker is toegewezen.
2. Het apparaat komt tijdens de inschrijving in de **apparaatgroep** uit de policy. Die koppeling
   loopt niet via de instelling `devicesecuritygroupids` in de policy, want die tekst is alleen
   wat de portal toont. Ze loopt via de aparte actie `setEnrollmentTimeDeviceMembershipTarget`.
   Een policy die alleen via de body is aangemaakt, heeft dus **geen** apparaatgroep. Het script
   roept die actie aan.
3. Tijdens OOBE wacht het apparaat **alleen** op de apps en scripts die je in de policy kiest. Die
   moeten óók aan de apparaatgroep zijn toegewezen. Al het andere (de baseline-policies, overige
   apps) komt na het bureaublad, bij de eerste sync. De Intune Management Extension synct sinds
   september 2026 direct na OOBE.

| Instelling | Waarde | Waarom |
|---|---|---|
| Deployment mode / type / join type | user-driven · single user · Entra join | de enige opties die de instellingsdefinitie kent (`_0`). CIPP biedt ook *hybrid* en *shared* aan, maar die waarden bestaan niet. |
| User account type | Standard user | zoals klassiek |
| Minutes allowed before showing installation error | `90` | ruimte voor 25 apps en de quality updates die sinds 2025 tijdens OOBE meedraaien |
| Allow users to skip setup after multiple attempts | No | geen bureaublad zonder de gekozen apps |
| Show link to diagnostics | Yes | de gebruiker kan logs meegeven; het rapport verzamelt ze bij een fout ook zelf |
| Custom error message | drietalig | één veld voor alle gebruikers |
| Device security group | leeg | per tenant, via het script of de portal |
| Allowed applications / scripts | niet in het bestand | app-id's zijn per tenant. Toevoegen in de portal nadat ze aan de apparaatgroep zijn toegewezen. |

Kandidaten voor de app-lijst uit deze repo:
[`remove-mcafee`](../Apps/remove-mcafee/README.md) (vóór Defender actief wordt), Microsoft
365 Apps, Bedrijfsportal. [`winget-autoupdate`](../Apps/winget-autoupdate/README.md) hoort er
niet in: die slaat zijn eerste run tijdens OOBE bewust over.

**BitLocker 256-bit.** Tot de Windows-update van 14 september 2026 (KB5124012) begon de
automatische apparaatversleuteling tijdens device preparation soms vóórdat de BitLocker-policy
binnen was. De OS-schijf kreeg dan de Windows-standaard XTS-AES 128 in plaats van de XTS-AES 256
uit [BitLocker](../SettingsCatalog/Baseline_WIN_D_BitLocker.md). Dat blijft zo, want de methode
ligt vast zodra de versleuteling begint. Vanaf KB5124012 wacht Windows tijdens OOBE op de policy.
Twee gevolgen:

- Test op de build die je geleverd krijgt. Een image zonder de oplossing heeft het probleem nog.
  Bij Patch My PC werkte 26200.9550 wel en 26200.9457 nog niet.
- Apparaten die al via device preparation zijn ingericht, kunnen op 128-bit staan.
  [Compliance BitLocker](../CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md) kijkt
  alleen óf de schijf versleuteld is, dus die apparaten blijven compliant. Controleer met
  `(Get-BitLockerVolume C:).EncryptionMethod`. Terug naar 256-bit kan alleen door te
  ontsleutelen en opnieuw te versleutelen.

Na de inschrijving staat de policynaam in `enrollmentProfileName`. Daarmee maak je een dynamische
groep voor alles wat via device preparation binnenkwam:

```
(device.enrollmentProfileName -eq "[Baseline] - WIN - Autopilot Device Preparation")
```

Hernoem je de policy, pas dan deze regel aan.

### Device association: wat dit bestand nog niet doet

Sinds 27 augustus 2026 kan device preparation een apparaat vóór de inschrijving aan de tenant
binden (*device association*). Dat gebeurt met een TPM-attestatie en een markering in UEFI.
Daarmee komen er instellingen bij die het klassieke profiel al had:

- taal en toetsenbord
- EULA en privacyscherm verbergen
- accountwissel verbergen
- een apparaatnaamsjabloon
- toewijzing aan het apparaat in plaats van aan de gebruiker
- het apparaat telt automatisch als bedrijfsapparaat

Voorwaarden: een fysiek apparaat met TPM 2.0, Windows 11 24H2 of 25H2 met KB5120998, en
toegang tot `ztd.dds.microsoft.com` en de `*.attest.azure.net`-endpoints uit de
[Microsoft-documentatie](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/requirements).

De settings catalog kent die instellingen (`enrollment_autopilot_dpp_language`, `_skipeula`,
`_skipexpress`, `_skipkeyboard`, `_forcedenrollment`, `_applydevicerenametemplate`, `_enablequ`,
`_enablecue`, `_allowedpolicyids`). Ze horen bij een tweede template, `70d256b3-…_1`, met 18
instellingen. De `settingInstanceTemplateId`'s van dat template staan in geen enkele openbare bron,
en een templatepolicy zonder de juiste id's wordt geweigerd. Daarom gebruikt dit bestand het
template met 12 instellingen, dat CIPP, de terraform-provider en twee andere baselines identiek
gebruiken.

Wil je association: bouw de policy één keer in de portal, haal hem op met
`New-WindowsAutopilotPolicy.ps1 -Export` en zet het resultaat (zonder groeps- en app-id's) hier
neer.

## Uitrollen

### Via CIPP

CIPP heeft voor alle drie een standard (**Tenant → Standards → Intune Standards**). Met deze
waarden komen ze overeen met de bestanden hier:

| Standard | Instelling | Waarde | Let op |
|---|---|---|---|
| **Enable Autopilot Profile** | Profile Display Name | `[Baseline] WIN Autopilot User Driven` | zonder koppeltekens; CIPP controleert dat |
| | Convert all targeted devices to Autopilot | **uit** | standaard **aan** |
| | Enable Self-deploying Mode | **uit** | standaard **aan**; aan betekent een kioskprofiel zonder gebruiker |
| | Allow White Glove OOBE | aan | |
| | Setup user as a standard user · Hide Terms · Hide Privacy · Hide Change Account | aan | Hide Change Account zet CIPP altijd aan |
| | Automatically configure keyboard | uit | zie hierboven |
| | Assign to all devices | naar keuze | *All devices* raakt alleen geregistreerde apparaten |
| **Enrollment Status Page settings** | Timeout · Install Windows quality updates | `90` · aan | |
| | Show progress · Log collection · Only show during OOBE · Block device usage · Allow reset | aan | |
| | Allow device use on failure | uit | |
| **Deploy Device Prep Profile** | Profile Display Name | `[Baseline] - WIN - Autopilot Device Preparation` | |
| | Deployment Type · Join Type · Account Type | Single user · Microsoft Entra join · Standard user | *Shared* en *hybrid* bestaan niet in de definitie |
| | Timeout · Allow skip · Allow diagnostics | `90` · uit · aan | |
| | Device Security Group Name · Create new group | de groepsnaam · aan | CIPP maakt hem met de Intune Provisioning Client als eigenaar |
| | Policy Assignment | Do not assign | toewijzen aan een gebruikersgroep in de portal; CIPP biedt alleen *All users* |

Drie verschillen met het script:

- De ESP-standard past de **standaard-ESP** aan (*All users and all devices*, prioriteit 0) in plaats
  van een aparte ESP te maken. Met *Only show during OOBE* aan merken andere inschrijvingen daar
  niets van.
- De device preparation-standard zet **geen apps of scripts** in de policy. Bij afwijkende
  instellingen **verwijdert** hij de policy en maakt hem opnieuw aan. Apps die je daarna in de
  portal hebt gekozen, zijn dan weg. Zet deze standard na de eerste uitrol op *Report* of *Alert*,
  niet op *Remediate*.
- Wijzigingen in de portal aan het klassieke profiel overschrijft CIPP bij de volgende run.

### Via het script

```powershell
# Klassiek
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Deployment-Profile.json -WhatIf
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Enrollment-Status-Page.json

# Device preparation, met apparaatgroep (wordt aangemaakt als hij ontbreekt)
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Device-Preparation.json `
    -DeviceGroupName 'WIN - Autopilot Device Preparation - Devices' -CreateDeviceGroup

# Wat er in de tenant staat, als JSON (ook wat in de portal is gebouwd)
.\scripts\New-WindowsAutopilotPolicy.ps1 -Export
```

Het script weigert een object met een naam die al bestaat, en **wijst niet toe**. Een profiel aan
de verkeerde groep verandert hoe elk nieuw apparaat wordt ingericht. Daarom gebeurt toewijzen in de
portal:

- het profiel en de ESP aan de apparaatgroep van geregistreerde apparaten;
- de device preparation-policy aan een **gebruikersgroep**.

## Fase

| Onderdeel | Fase | Wanneer verder |
|---|---:|---|
| Klassiek profiel + ESP | 2 | toewijzen aan een pilotgroep geregistreerde apparaten; na een geslaagde inrichting (inclusief de herstart) aan de dynamische `[ZTDid]`-groep |
| Device preparation | 3 | wacht op nieuwe apparaten met Windows 11 24H2+ en KB5124012 of later (BitLocker 256-bit), de apparaatgroep, en het besluit welke apparaatstroom klassiek blijft |

Geen van beide raakt bestaande apparaten. Ze gelden pas bij de volgende OOBE.

## Bronnen

- [Compare Windows Autopilot device preparation and Windows Autopilot](https://learn.microsoft.com/en-us/autopilot/device-preparation/compare)
- [Windows Autopilot device preparation requirements](https://learn.microsoft.com/en-us/autopilot/device-preparation/requirements)
- [What's new in Windows Autopilot device preparation](https://learn.microsoft.com/en-us/autopilot/device-preparation/whats-new)
- [Autopilot Device Preparation BitLocker 256-bit issue fixed — Patch My PC](https://patchmypc.com/blog/autopilot-device-preparation-bitlocker-256-bit-issue/)
- [Overview of Windows Autopilot device association](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/overview)
- [windowsAutopilotDeploymentProfile — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-enrollment-windowsautopilotdeploymentprofile?view=graph-rest-beta)
- [windows10EnrollmentCompletionPageConfiguration — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-onboarding-windows10enrollmentcompletionpageconfiguration?view=graph-rest-beta)
- Instellingsdefinities: [pl4nty/intune-change-tracking](https://github.com/pl4nty/intune-change-tracking), `DCv2/Settings/enrollment_autopilot_dpp_*.json`
- Template- en instance-id's: CIPP-API `Invoke-CIPPStandardDevicePrepProfile.ps1`, terraform-provider-microsoft365 `windows_autopilot_device_preparation_policy/constants.go`
