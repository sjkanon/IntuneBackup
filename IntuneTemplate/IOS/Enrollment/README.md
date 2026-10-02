**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# iOS/iPadOS-inschrijving: ADE-profiel, groepen en Apple Business

`iOS-Corporate-ADE-Baseline.json` is een `depIOSEnrollmentProfile` (Graph beta). Net als het
[macOS-ADE-profiel](../../MAC/Enrollment/ade-profile/README.md) is het geen van de vijf
CIPP-policytypes: het hangt onder een ADE-token (`depOnboardingSettings/{id}/enrollmentProfiles`)
en rolt dus niet uit via een CIPP-pakket.

## Waarom geen Settings Catalog-template

Intune kent ook een catalogusvorm (`enrollmentConfiguration`, template
`27d20e9c-50c1-48f8-a44c-f37de4510051_1`, platform iOS). De settingDefinitionId's daarvan
bestaan (`ade_useraffinity`, `ade_authenticationmethod`, `ade_lockedenrollment`,
`ade_modernauth_awaitfinalconfiguration`, `ade_appledevicenametemplate`,
`ade_setupassistant_*` — geverifieerd in pl4nty DCv2), maar een template-policy vraagt per
instelling ook een `settingInstanceTemplateId` en `settingValueTemplateId`. Die staan niet in
pl4nty (het templatebestand bevat alleen metadata) en in geen van de bronnen. Zelf verzinnen
levert een policy op die Graph weigert of — erger — die andere schermen zet dan bedoeld. Wil
je de catalogusvorm: bouw het profiel één keer in de portal met de waarden hieronder en
exporteer het (`GET deviceManagement/configurationPolicies/{id}?$expand=settings`).

## Uitrollen

`scripts/New-MacOSEnrollmentPolicy.ps1` weigert dit bestand: het controleert op
`#microsoft.graph.depMacOSEnrollmentProfile`. Tot er een iOS-variant is, gaat het met Graph:

```powershell
Connect-MgGraph -Scopes DeviceManagementServiceConfig.ReadWrite.All
$token = (Invoke-MgGraphRequest GET 'https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings').value |
  Where-Object tokenName -eq 'ADE-TOKEN-NAAM'
$body = Get-Content .\iOS-Corporate-ADE-Baseline.json -Raw   # eerst de placeholders invullen
Invoke-MgGraphRequest POST "https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings/$($token.id)/enrollmentProfiles" -Body $body -ContentType 'application/json'
```

Vóór de POST invullen:

| Placeholder | Waar vandaan |
|---|---|
| `VPP-TOKEN-ID-INVULLEN` | id van het VPP-token (`GET beta/deviceAppManagement/vppTokens`) waaronder Company Portal met apparaatlicenties is gekocht |
| `SERVICEDESK-TELEFOON-INVULLEN` | nummer van de servicedesk — de gebruiker ziet het tijdens de inrichting en onder Instellingen → Algemeen → Info |

## Waarom deze waarden

Grotendeels gelijk aan de UniFy Corporate Deployment Guide v1.2 §7.2–7.3 en aan het
macOS-profiel in deze repo.

| Property | Waarde | Waarom |
|---|---|---|
| `requiresUserAuthentication` + `configurationWebUrl` + `enableAuthenticationViaCompanyPortal` | `true` | *Setup Assistant with modern authentication*: Entra-registratie en MFA vóór het beginscherm. Zelfde combinatie als het macOS-profiel; verifieer met een export van een portalprofiel als Graph het anders teruggeeft |
| `supervisedModeEnabled` | `true` | voorwaarde voor `IOS - D - Restrictions Corporate`, `Lock Screen`, de Defender-content filter en automatische updates |
| `profileRemovalDisabled` | `true` | vergrendelde inschrijving. **Onomkeerbaar** zonder wipe |
| `awaitDeviceConfiguredConfirmation` / `waitForDeviceConfiguredConfirmation` | `true` | het toestel blijft in Setup Assistant tot de eerste policies er zijn — geen bedrijfstoestel zonder toegangscode op het beginscherm |
| `iTunesPairingMode` | `disallow` | geen synchronisatie met Finder/iTunes; USB-datatoegang en sideloading dicht |
| `deviceNameTemplate` | `{{DEVICETYPE}}-{{SERIAL}}` | voorspelbare inventarisnaam, geen persoonsnaam in AirDrop/Bluetooth |
| `supportDepartment` | `IT Servicedesk` | gelijk aan het macOS-profiel |
| `isDefault` | `true` | elk serienummer onder dit token krijgt dit profiel; een gesynct toestel zonder profiel faalt bij activering |

Schermen (`true` = verborgen). Zichtbaar gelaten: **Location Services** (tijdzone en
per-app-toestemmingen), **Touch ID/Face ID** (biometrie meteen bruikbaar voor Authenticator
en app-PIN), **Software Update** en **Update Completed** (toestel start op een actuele versie),
**taal/regio**. Verborgen: **Passcode** — Microsoft documenteert dat het scherm vanaf iOS 14.5
niet betrouwbaar werkt; de eis komt uit `IOS - D - Passcode` na afronden van Setup Assistant.
**Restore** en **Device to Device Migration** — een bedrijfstoestel start schoon, niet vanuit
een privéback-up. **Apple ID** — geen privé-Apple Account op bedrijfshardware. Gebruik je
Managed Apple Accounts (federatie, zie `../README.md`), zet `appleIdDisabled` dan op `false`.

`enabledSkipKeys` bevat de schermen zonder eigen Graph-property, met Apple's namen uit
[apple/device-management `other/skipkeys.yaml`](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
(alle elf daar voor iOS gedocumenteerd): `ActionButton` (17.0), `AppStore` (14.3),
`CameraButton` (18.0), `EnableLockdownMode` (17.1), `Intelligence` (18.0), `Multitasking`
(26.0), `OSShowcase` (26.0), `Safety` (16.0), `SafetyAndHandling` (18.4), `TermsOfAddress`
(16.0), `WebContentFiltering` (18.2). Dat Intune ze één-op-één doorgeeft is aannemelijk maar
niet getest; controleer met een GET na aanmaken.

Niet gezet: `enrollmentTimeAzureAdGroupIds` (tenant-GUID; Enrollment Time Grouping kan
achteraf in de portal), `carrierActivationUrl`, Shared iPad- en shared device mode-velden
(ander scenario).

## Drie toestelsoorten, drie beschermingsniveaus

| Soort | Hoe het binnenkomt | Wat de baseline levert |
|---|---|---|
| **Zonder inschrijving** (MAM) | Gebruiker installeert Outlook/Teams uit de App Store | `IOS - U - App Protection` (fase 1) — de enige laag |
| **Persoonlijk ingeschreven** | Company Portal (web-based device enrollment) of account-driven user enrollment | App Protection + compliance + `Data Protection`, `Passcode`, `Enterprise SSO`, `Software Updates` (deadline), Defender via VPN |
| **Bedrijf (ADE, supervised)** | Serienummer in Apple Business, profiel hieronder | alles hierboven + `Restrictions Corporate`, `Lock Screen`, Defender via content filter, automatische updates |

## Groepen

Twee fase 4-groepen in het manifest. Maak ze als dynamische apparaatgroep in Entra ID:

| Groep | Regel |
|---|---|
| `SEC-iOS-Corporate` | `(device.deviceOSType -in ["iPhone","iPad"]) -and (device.deviceOwnership -eq "Company")` |
| `SEC-iOS-BYOD` | `(device.deviceOSType -in ["iPhone","iPad"]) -and (device.deviceOwnership -eq "Personal")` |

Een ADE-toestel wordt door Intune als *Company* gemarkeerd. Controleer vóór toewijzing of er
geen handmatig als *Company* gemarkeerde, niet-supervised toestellen zijn: die zouden de
supervised-only policies krijgen (die iOS dan negeert) en géén Defender-VPN. Wie strakker wil,
gebruikt voor `SEC-iOS-Corporate` `device.enrollmentProfileName -eq "iOS Corporate ADE Baseline"`.

## Apple Business (voorheen Apple Business Manager)

Eenmalig per tenant, buiten Intune:

1. **Tokens en certificaten — alle drie jaarlijks vernieuwen.**
   - *Apple MDM Push-certificaat* (Intune → Devices → iOS/iPadOS → Enrollment). Vernieuwen met
     **hetzelfde** beheerde Apple Account waarmee het is aangemaakt; een nieuw certificaat
     onder een ander account laat elk ingeschreven toestel opnieuw inschrijven. Gebruik een
     functioneel account, geen persoonlijk.
   - *ADE-token* (Enrollment program tokens). Verloopt na een jaar; daarna synct Intune geen
     nieuwe serienummers meer.
   - *VPP/content token* (Tenant administration → Connectors → Apple VPP tokens). Verloopt na
     een jaar; daarna worden VPP-apps niet meer bijgewerkt of geïnstalleerd.
   Zet op alle drie een herinnering 30 dagen vóór verloop, en maak het vernieuwen onderdeel
   van het beheerproces (ISO 27001 A.5.37 gedocumenteerde bedieningsprocedures).
2. **MDM-server.** Maak in Apple Business een MDM-server voor Intune en wijs nieuwe aankopen er
   standaard aan toe (Voorkeuren → Standaard apparaattoewijzing), zodat een nieuw toestel niet
   eerst handmatig moet worden toegewezen.
3. **Managed Apple Accounts federeren met Entra ID.** Apple Business → Voorkeuren → Accounts:
   domein verifiëren en *federated authentication* met Microsoft Entra ID aanzetten. Gebruikers
   melden zich daarna met hun werkaccount aan in plaats van met een apart Apple-wachtwoord, en
   een uit Entra verwijderde gebruiker verliest ook zijn Managed Apple Account.
4. **Managed Apple Accounts alleen op beheerde toestellen.** Beperk in de accountinstellingen
   waar een Managed Apple Account mag aanmelden tot toestellen die de organisatie beheert
   (supervised). Zo komt iCloud-data van het werkaccount niet op een privé-iPad terecht.
   Controleer de exacte naam van de optie in de actuele Apple Business-interface; Apple heeft
   die in 2025–2026 meermaals herschikt.
5. **Company Portal en Microsoft Authenticator via VPP.** Koop beide (gratis) in Apple
   Business → Apps and Books met **apparaatlicenties**, synchroniseer het VPP-token, en wijs ze
   in Intune als *required* toe aan `SEC-iOS-Corporate`. Apparaatlicenties installeren zonder
   Apple Account. Authenticator is voorwaarde voor `IOS - D - Enterprise SSO`; Company Portal
   wordt door het inschrijfprofiel zelf geïnstalleerd (`companyPortalVppTokenId`) — maak daar
   geen tweede toewijzing voor, dan krijgt de gebruiker een aanmeldprompt. Doe hetzelfde voor
   Microsoft Defender als Defender for Endpoint in gebruik is.

## Intune-tenantinstellingen

- **Inschrijvingsrestrictie iOS/iPadOS** (Devices → Enrollment → Device platform restriction):
  persoonlijk ingeschreven toestellen toestaan of blokkeren is een organisatiebesluit. Wie BYOD alleen
  via App Protection wil, blokkeert *Personally owned* — dan zijn `SEC-iOS-BYOD` en de VPN-variant
  van Defender overbodig.
- **Defender for Endpoint-connector** (Endpoint security → Microsoft Defender for Endpoint):
  *Connect iOS/iPadOS devices* aan, en voor de MAM-route ook *Connect iOS/iPadOS devices to
  Microsoft Defender for Endpoint for App Protection Policy evaluation*. Voorwaarde voor
  `IOS - U - Compliance Defender for Endpoint`.
- **Apple Configurator/host pairing**: het inschrijfprofiel zet `iTunesPairingMode` op
  `disallow`. Wie Apple Configurator gebruikt, zet hem op `requiresCertificate` en voegt het
  certificaat toe.
