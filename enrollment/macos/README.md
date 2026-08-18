# macOS ADE-enrollmentprofielen

Apple Automated Device Enrollment-profielen (`depMacOSEnrollmentProfile`) staan **buiten**
`IntuneTemplate/`. De pijplijnen daar kennen vijf CIPP-policytypes en een enrollmentprofiel is
geen van die vijf: het hangt onder een ABM-token
(`depOnboardingSettings/{id}/enrollmentProfiles`), gaat niet door de "Import profile"-knop, en
heeft geen instellingen die de baseline-engine kan toetsen. Een bestand hier wordt dus **niet**
opgepikt door `generate-baseline.js`, `export-intunebackup.js` of `Set-BaselineAssignment.ps1`.
Uitrollen gaat via `scripts/New-MacOSEnrollmentPolicy.ps1`.

| Bestand | Token | Standaardprofiel |
|---|---|---|
| `ITCE-macOS-Corporate-ADE-Baseline.json` | `ACI_APPLE_MDM` | ja (`isDefault: true`) |

`isDefault: true` betekent dat élk apparaat dat onder dit token uit Apple Business synct dit
profiel krijgt. Dat is bewust — Microsoft raadt aan zo snel mogelijk een standaardprofiel te
hebben, want een gesynct apparaat zonder profiel dat wordt aangezet, faalt in de enrollment.

## Het schema is plat

`depMacOSEnrollmentProfile` heeft **geen** geneste `managementSettings` / `accountSettings` /
`setupAssistant`-objecten. Alle properties staan op het topniveau, en Graph accepteert geen
onbekende namen. Documentatievelden (`_meta`, `_recommendations`, `changeLog`) horen daarom in
dit bestand, niet in de JSON.

## Waarom deze waarden

### Management settings — vier die samen horen

| Property | Waarde | UI-label |
|---|---|---|
| `requiresUserAuthentication` | `true` | Enroll with user affinity |
| `enableAuthenticationViaCompanyPortal` + `configurationWebUrl` | beide `true` | Setup Assistant with modern authentication |
| `waitForDeviceConfiguredConfirmation` | `true` | Await final configuration |
| `profileRemovalDisabled` | `true` | Locked enrollment |

`profileRemovalDisabled` is **onomkeerbaar** na enrollment — wijzigen vereist een wipe.
`waitForDeviceConfiguredConfirmation` wordt sowieso afgedwongen zodra je lokale accounts
configureert, ook als je hem uit zou zetten.

### Accounts

`itceadmin` is LAPS-beheerd: Intune genereert een willekeurig wachtwoord van 15 tekens en
bewaart het versleuteld. Daarom staat `adminAccountPassword` hier niet in. Rotatie op 14 dagen
is een keuze; de Intune-standaard is zes maanden.

Openstaand, niet opgelost door dit bestand:

- **Rotatie beperkt lezen niet.** Wie het geëscroweerde wachtwoord mag opvragen regel je met
  RBAC/PIM, niet hier. Controleer wie die rol heeft.
- **`itceadmin` is tenantbreed voorspelbaar.** Voor een MSP met meerdere klanten is
  `itce-<klantcode>-adm` beter; binnen deze ene tenant maakt het niets uit.
- **Controleer dat escrow aanstaat** onder Devices → macOS → Local admin password, anders
  roteert het wachtwoord wel maar is het niet op te halen.

Het primaire account is `setPrimarySetupAccountAsRegularUser: true` — een **standaard** account,
niet admin. Dat mag omdat `itceadmin` de adminrol vult; macOS eist minstens één adminaccount.

De twee prefill-velden accepteren verschillende variabelen:

| Property | Toegestaan |
|---|---|
| `primaryAccountUserName` | `{{partialupn}}` · `{{serialNumber}}` · `{{managedDeviceName}}` · `{{OnPremisesSamAccountName}}` |
| `primaryAccountFullName` | `{{username}}` · `{{serialNumber}}` · `{{OnPremisesSamAccountName}}` |

### Setup Assistant-schermen

`true` = verborgen. Zichtbaar gelaten:

| Scherm | Waarom |
|---|---|
| Location Services | nodig voor de tijdzone |
| Touch ID | gebruikers willen het, en het ondersteunt Platform SSO met Secure Enclave |
| Accessibility | verbergen zet VoiceOver uit tijdens setup — zie hieronder |
| Appearance / Choose your Look | onschuldig, één klik |

Twee schermen staan verborgen omdat de baseline die instelling al afdwingt — laat de gebruiker
niet kiezen wat beleid is:

| Scherm | Wordt afgedwongen door |
|---|---|
| FileVault | `Baseline_MAC_D_FileVault` |
| iCloud Storage (Bureaublad & Documenten) | `Baseline_MAC_U_Microsoft_OneDrive_KFM` |

De rest is consumentenruis op een bedrijfs-Mac.

## Nieuwe panes: `enabledSkipKeys`

Wallpaper, Lockdown mode, Intelligence, Terms of Address, Software update en OS Showcase hebben
**geen eigen property** in het Graph-schema. Die lopen via `enabledSkipKeys` met Apple's
SkipKeys-namen, overgenomen uit
[apple/device-management → other/skipkeys.yaml](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
(22 van de 51 keys gelden voor macOS):

| SkipKey | macOS vanaf | Scherm | Hier |
|---|---|---|---|
| `SoftwareUpdate` | 15.4 | automatische software-update | verborgen |
| `UpdateCompleted` | 26.1 | Software Update Complete | verborgen |
| `EnableLockdownMode` | 14.0 | Lockdown Mode | verborgen |
| `Intelligence` | 15.0 | Apple Intelligence | verborgen |
| `TermsOfAddress` | 13.0 | aanspreekvorm | verborgen |
| `OSShowcase` | 26.1 | OS Showcase | verborgen |
| `Wallpaper` | 14.1 | achtergrond | verborgen |
| `AppStore` | 11.1 | App Store | zichtbaar |
| `Appearance` | 10.14 | Choose your Look | zichtbaar |
| `Welcome` | 15.0 | Get Started | zichtbaar |

Zet hier **geen** keys in die al een eigen property hebben (`Accessibility`, `Biometric`,
`DisplayTone`, `FileVault`, `iCloudDiagnostics`, `iCloudStorage`, `Location`, `Payment`,
`Privacy`, `ScreenTime`, `Siri`, `UnlockWithWatch`) — dan stel je hetzelfde scherm twee keer in.

Deze namen komen van Apple; dat Intune ze één-op-één doorgeeft is aannemelijk maar niet door mij
getest. Verifieer met `-Export` nadat je één van deze schermen in de portal hebt gezet.

## Drie beslissingen die je nog kunt draaien

**1. Apple ID verborgen.** IntuneIRL houdt dit scherm zichtbaar omdat Managed Apple Accounts hun
aanmelding aan de PSSO-token hangen; de ADE-gids van MBaranekTech verbergt hem juist, om geen
privé-Apple-ID op bedrijfshardware te krijgen. Hier staat hij **verborgen**. Gebruik je Managed
Apple Accounts, zet `appleIdDisabled` dan op `false`.

**2. Accessibility zichtbaar.** Microsoft documenteert dat verbergen VoiceOver onbruikbaar maakt
tijdens setup; de ADE-gids noemt dat een toegankelijkheidsrisico. Daarom staat hij hier
zichtbaar, ook al stond hij in het aangeleverde voorstel op verborgen. Wil je hem toch weg:
`accessibilityScreenDisabled: true`.

**3. Het primaire account wordt vooraf aangemaakt.** Dat werkt op macOS 14, 15 en 26 en is wat er
nu in de tenant staat. Ga je Platform SSO tijdens Setup Assistant gebruiken, dan maakt PSSO het
account zelf aan via `EnableCreateUserAtLogin` en is vooraf aanmaken dubbelop:

```jsonc
"skipPrimarySetupAccountCreation": true,
"dontAutoPopulatePrimaryAccountInfo": true
// en primaryAccountUserName / primaryAccountFullName weglaten
```

Doe dat pas als de drie PSSO-voorwaarden staan (macOS 26+, Company Portal 5.2604+ als LOB-app,
en `Enable Registration During Setup` in `Baseline_MAC_D_Platform_SSO.json`). Zonder die drie
houd je een Mac over met alleen een verborgen adminaccount.

## Uitlijnen met Platform SSO

`Baseline_MAC_D_Platform_SSO.json` zet `TokenToUserMapping → AccountName = preferred_username`,
wat de **volledige UPN** oplevert. Dit profiel maakt alvast een account met `{{partialupn}}`, de
**korte** naam. Die twee wijzen niet naar dezelfde string. Test op één Mac of je één account
krijgt of twee.

`usePlatformSSODuringSetupAssistant` staat op `false`. Graph documenteert letterlijk: *"This
value cannot be TRUE when configurationWebUrl is TRUE."* — en `configurationWebUrl` is precies
wat moderne authenticatie aanzet. Wil je die route, bouw dat profiel dan in de portal en
exporteer het resultaat hierheen. Het script blokkeert de foute combinatie voor de POST.

## Gebruik

```powershell
# Wat zou er gebeuren
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ACI_APPLE_MDM -Path .\enrollment\macos\ITCE-macOS-Corporate-ADE-Baseline.json -WhatIf

# Aanmaken
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ACI_APPLE_MDM -Path .\enrollment\macos\ITCE-macOS-Corporate-ADE-Baseline.json

# Bestaand profiel ophalen als JSON (om handwerk in de portal vast te leggen)
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ACI_APPLE_MDM -Export -OutDir .\enrollment\macos
```

Een dynamische Entra-groep op de profielnaam scheelt handwerk bij het toewijzen van apps en
policies (niet van het enrollmentprofiel zelf — dat gaat per serienummer onder het token):

```
(device.deviceOSType -eq "MacMMP") and
(device.enrollmentProfileName -eq "ITCE - macOS Corporate ADE Baseline")
```

Toewijzen blijft handwerk in de portal: **Enrollment program tokens → token → Devices →
Assign policy**, of **Set Default Policy**.

## Wijzigingen

| Datum | Wijziging | Reden |
|---|---|---|
| 2026-08-18 | `diagnosticsDisabled`: false → true | dataminimalisatie (GDPR); geen opt-in voor Apple-diagnostiek |
| 2026-08-18 | `SoftwareUpdate` + `UpdateCompleted` naar `enabledSkipKeys` | updatecadans hoort bij centraal Intune-updatebeleid, niet bij de gebruiker tijdens OOBE |
| 2026-08-18 | `appleIdDisabled`: false → true | geen privé-Apple-ID op bedrijfshardware |
| 2026-08-18 | `enabledSkipKeys` gevuld uit Apple's schema | Lockdown mode, Intelligence, Terms of Address, OS Showcase, Wallpaper hebben geen eigen property |

`Intelligence` verbergen slaat alleen het opt-in-scherm over — het blokkeert de functie niet.
Moet Apple Intelligence echt uit, dan is dat een aparte settings catalog-policy.

## Bronnen

- [Set up automated device enrollment (ADE) for macOS](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/setup-automated-macos)
- [depMacOSEnrollmentProfile — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-enrollment-depmacosenrollmentprofile?view=graph-rest-beta)
- [Apple SkipKeys — apple/device-management](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
- [Add Platform SSO policy to ADE Profile on macOS devices](https://learn.microsoft.com/en-us/intune/device-configuration/settings-catalog/configure-platform-sso-during-enrollment)
