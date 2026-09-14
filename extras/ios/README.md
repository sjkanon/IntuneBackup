# iOS/iPadOS — wat níet in `IntuneTemplate/` past

De CIPP-pijplijnen dragen vijf policytypes (Catalog, Device, compliance, App Protection,
Admin). Voor een complete iOS-baseline is meer nodig: tenantinstellingen in Apple Business,
een ADE-inschrijfprofiel, app-configuratie en twee dynamische groepen. Die staan hier. Niets
in deze map wordt opgepikt door `generate-baseline.js`, `export-intunebackup.js` of
`Set-BaselineAssignment.ps1`.

| Map | Wat | Uitrollen |
|---|---|---|
| [`enrollment/`](enrollment/README.md) | `depIOSEnrollmentProfile` voor bedrijfstoestellen via ADE | Graph-POST onder het ADE-token |
| [`app-configuration/`](app-configuration/README.md) | Outlook, Edge en Microsoft Defender — managed devices en managed apps | Graph-POST of handmatig in de portal |

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
  persoonlijk ingeschreven toestellen toestaan of blokkeren is een klantbesluit. Wie BYOD alleen
  via App Protection wil, blokkeert *Personally owned* — dan zijn `SEC-iOS-BYOD` en de VPN-variant
  van Defender overbodig.
- **Defender for Endpoint-connector** (Endpoint security → Microsoft Defender for Endpoint):
  *Connect iOS/iPadOS devices* aan, en voor de MAM-route ook *Connect iOS/iPadOS devices to
  Microsoft Defender for Endpoint for App Protection Policy evaluation*. Voorwaarde voor
  `IOS - U - Compliance Defender for Endpoint`.
- **Apple Configurator/host pairing**: het inschrijfprofiel zet `iTunesPairingMode` op
  `disallow`. Wie Apple Configurator gebruikt, zet hem op `requiresCertificate` en voegt het
  certificaat toe.
