**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# iOS/iPadOS app-configuratie

Zes Graph-bodies, twee per app, en twee voor Windows App (onderaan). App-configuratie is geen CIPP-type en staat daarom hier.

| Bestand | Graph-type | Endpoint (beta) | Voor |
|---|---|---|---|
| `outlook-managed-devices.json` | `iosMobileAppConfiguration` | `deviceAppManagement/mobileAppConfigurations` | ingeschreven toestellen |
| `outlook-managed-apps.json` | `targetedManagedAppConfiguration` | `deviceAppManagement/targetedManagedAppConfigurations` | elk toestel (MAM) |
| `edge-managed-devices.json` | `iosMobileAppConfiguration` | idem | ingeschreven |
| `edge-managed-apps.json` | `targetedManagedAppConfiguration` | idem | elk toestel |
| `defender-managed-devices.json` | `iosMobileAppConfiguration` | idem | ingeschreven |
| `defender-managed-apps.json` | `targetedManagedAppConfiguration` | idem | elk toestel |

## Uitrollen

**Managed devices.** Vervang `APP-ID-OUTLOOK-INVULLEN`, `APP-ID-EDGE-INVULLEN` en
`APP-ID-DEFENDER-INVULLEN` door het Intune-app-id (`GET beta/deviceAppManagement/mobileApps`
— de VPP- of store-app die je aan de toestellen toewijst), POST de body, en wijs toe aan de
gebruikers of toestellen die de app krijgen. Een app die als VPP-app én als store-app bestaat
heeft twee id's: configureer beide of kies één.

**Managed apps.** POST de body en koppel daarna de app met de `targetApps`-actie:

```json
POST beta/deviceAppManagement/targetedManagedAppConfigurations/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.iosMobileAppIdentifier", "bundleId": "com.microsoft.Office.Outlook" } } ] }
```

Bundle-id's: Outlook `com.microsoft.Office.Outlook`, Edge `com.microsoft.msedge`, Defender
`com.microsoft.scmx`. Wijs toe aan alle gebruikers — dezelfde doelgroep als
`IOS - U - App Protection`.

## Waarom deze sleutels

Alleen sleutels die de leverancier documenteert; waarden zijn bewust beperkt tot wat
beveiliging raakt. UniFy v1.2 zet er meer (Focused Inbox, Suggested Replies, homepage,
zoekmachine) — dat is voorkeur, geen baseline.

**Outlook** — [Microsoft Learn: Outlook for iOS and Android app configuration](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/outlook-for-ios-and-android/outlook-for-ios-and-android-configuration-with-microsoft-intune)

| Sleutel | Waarde | Waarom |
|---|---|---|
| `com.microsoft.outlook.EmailProfile.AccountType` / `EmailAddress` / `EmailUPN` | `ModernAuth`, `{{mail}}`, `{{userprincipalname}}` | account vooraf ingevuld; geen verkeerd getypt adres, geen basisauthenticatie |
| `IntuneMAMAllowedAccountsOnly` + `IntuneMAMUPN` | `Enabled`, `{{userprincipalname}}` | alleen het werkaccount in de beheerde app; Microsoft: alleen via managed devices |
| `com.microsoft.outlook.Mail.ExternalRecipientsToolTipEnabled` | `true` | waarschuwing bij een externe ontvanger — de goedkoopste maatregel tegen per ongeluk verstuurde mail |
| `com.microsoft.outlook.Contacts.LocalSyncEnabled` | `true` | naam van de beller zichtbaar; werkt samen met `allowmanagedtowriteunmanagedcontacts=true` in `IOS - D - Data Protection`. Alleen managed devices: op een onbeheerd toestel blijft dit een keuze van de gebruiker |

**Edge** — [Microsoft Learn: Manage Microsoft Edge on iOS and Android with Intune](https://learn.microsoft.com/intune/app-management/configuration/configure-edge-ios-android)

| Sleutel | Waarde | Waarom |
|---|---|---|
| `com.microsoft.intune.mam.managedbrowser.SmartScreenEnabled` | `true` | Defender SmartScreen tegen phishing en malware-downloads; standaard aan, hier vastgelegd |
| `com.microsoft.intune.mam.managedbrowser.SSLErrorOverrideAllowed` | `false` | een gebruiker kan een certificaatfout niet wegklikken — de Edge-tegenhanger van `allowuntrustedtlsprompt=false` |
| `IntuneMAMAllowedAccountsOnly` + `IntuneMAMUPN` | alleen managed devices | alleen het werkprofiel |

Bewust niet: `disabledFeatures` (password|inprivate|autofill). Wachtwoordbeheer in Edge uitzetten
is een keuze die bij de macOS/Windows Edge-policies hoort te passen; niet hier los beslissen.

**Microsoft Defender** — [Microsoft Learn: Configure Defender for Endpoint on iOS features](https://learn.microsoft.com/defender-endpoint/ios-configure-features)

| Sleutel | Waarde | Waarom |
|---|---|---|
| `issupervised` | `{{issupervised}}` | Defender weet of het toestel supervised is; op supervised toestellen vervalt de privacygoedkeuring voor app-inventaris |
| `WebProtection` | `true` | anti-phishing via lokale VPN; standaard aan, hier vastgelegd. Geldt niet voor de content filter-route |
| `DefenderNetworkProtectionEnable` | `true` | detectie van onveilige wifi en certificaten |
| `DefenderOpenNetworkDetection` | `2` | open netwerken melden aan de gebruiker (0 uit, 1 audit, 2 aan) |
| `DisableSignOut` | `true` | gebruiker kan zich niet afmelden in de app en zo de risicoscore laten verdwijnen |

Bewust niet: `DefenderTVMPrivacyMode=false` (volledige app-inventaris van een persoonlijk
toestel is een privacybesluit; op supervised toestellen is het niet nodig) en
`SuppressOSUpdateNotification` (vervalt volgens Microsoft per juli 2026).

De schema's zijn geverifieerd tegen Graph beta (`iosMobileAppConfiguration` zoals geëxporteerd
door UniFy v1.2; `targetedManagedAppConfiguration.customSettings` op Microsoft Learn), niet
tegen een tenant getest.

## Windows App (Azure Virtual Desktop en Windows 365)

Twee Graph-bodies voor Windows App, ook op een toestel zonder inschrijving:

| Bestand | Graph-type | Wat het doet |
|---|---|---|
| `windows-app-app-protection.json` | `iosManagedAppProtection` | PIN, geen klembord tussen de virtuele werkplek en lokale apps, `screenCaptureConfigurationState` = `blocked`, `allowedOutboundDataTransferDestinations` = `none`, minimaal Windows App 11.2.4, geen toetsenborden van derden, gejailbreakte of geroote toestellen geblokkeerd |
| `windows-app-managed-apps.json` | `targetedManagedAppConfiguration` | `redirectclipboard` = `0` en `drivestoredirect` = `0`: geen klembord en geen bestanden van de telefoon naar de sessie |

**Waarom.** Conditional Access `2150` laat Windows App op iOS en Android alleen toe met een app
protection policy of een compliant toestel. Een policy op *alle Microsoft-apps* telt daarvoor niet:
Microsoft laat Windows App expliciet kiezen. Zonder deze policy komt een onbeheerde telefoon dus
nooit binnen. Daarnaast weigert een Cloud PC of sessiehost met screen capture protection
(`[Baseline] - WIN - D - Cloud PC Session Security`) de verbinding als Windows App schermopname
niet blokkeert; dat kan pas vanaf de genoemde versie. De app-configuratie is een tweede laag naast
de instellingen op de sessiehost; de strengste van de twee wint, en Microsoft zegt uitdrukkelijk
dat hij die niet vervangt.

**Waarom geen CIPP-template.** CIPP haalt bij een app protection-template de lijst `apps` weg
voordat hij de policy aanmaakt. Een policy die alleen voor Windows App bedoeld is, kan daarom niet
via CIPP; hij staat hier als Graph-body.

**Uitrollen.**

```http
POST https://graph.microsoft.com/beta/deviceAppManagement/iosManagedAppProtections
<inhoud van windows-app-app-protection.json>

POST https://graph.microsoft.com/beta/deviceAppManagement/iosManagedAppProtections/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.iosMobileAppIdentifier", "bundleId": "com.microsoft.rdc.ios" } } ] }
```

Voor `windows-app-managed-apps.json` hetzelfde via `targetedManagedAppConfigurations`. Wijs beide toe aan de gebruikers van
Azure Virtual Desktop of Windows 365. Op een ingeschreven iPhone moet Windows App als store-app in Intune staan; Intune geeft de MAM-sleutels sinds release 2409 zelf mee.

**Niet getest in een tenant.** Controleer na het toewijzen in de portal of Windows App niet ook
onder `[Baseline] - IOS - U - App Protection` valt: twee app protection policies op dezelfde app
voor dezelfde gebruiker leveren een conflict op.
