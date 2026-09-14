# iOS/iPadOS ADE-inschrijfprofiel

`iOS-Corporate-ADE-Baseline.json` is een `depIOSEnrollmentProfile` (Graph beta). Net als
`enrollment/macos/` staat het buiten `IntuneTemplate/`: het hangt onder een ADE-token
(`depOnboardingSettings/{id}/enrollmentProfiles`) en is geen van de vijf CIPP-types.

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
