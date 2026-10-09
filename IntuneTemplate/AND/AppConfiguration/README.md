**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# App-configuratie voor Android (ingeschreven toestellen)

Drie `androidManagedStoreAppConfiguration`-bodies: de app-configuratie die Managed Google Play
bij de installatie aan de app meegeeft. Ze werken alleen op een **ingeschreven** Android
Enterprise-toestel en alleen voor een app die via Managed Google Play is uitgerold.
`profileApplicability: default` betekent: elk profieltype (persoonlijk werkprofiel,
corporate-owned work profile, fully managed, dedicated) — één policy per app is genoeg.

| Bestand | App | Wat het doet | Placeholder |
|---|---|---|---|
| `AND-Outlook-Managed-Devices.json` | Outlook (`com.microsoft.office.outlook`) | werkaccount vooraf ingevuld met moderne authenticatie, alleen het organisatieaccount toegestaan, waarschuwing bij externe ontvangers | `OUTLOOK-APP-ID-INVULLEN` |
| `AND-Edge-Managed-Devices.json` | Edge (`com.microsoft.emmx`) | alleen het organisatieaccount toegestaan | `EDGE-APP-ID-INVULLEN` |
| `AND-Defender-Low-Touch-Onboarding.json` | Microsoft Defender (`com.microsoft.scmx`) | onboarding zonder gebruikershandeling, webbescherming en anti-phishing aan, privacy voor het persoonlijke profiel | `DEFENDER-APP-ID-INVULLEN` |

## Waarom deze sleutels

`payloadJson` is base64. Uitgepakt:

**Outlook** — `com.microsoft.outlook.EmailProfile.AccountType` = `ModernAuth`,
`…EmailUPN` = `{{userprincipalname}}`, `…EmailAddress` = `{{mail}}`,
`IntuneMAMAllowedAccountsOnly` = `Enabled`, `com.microsoft.intune.mam.AllowedAccountUPNs` =
`{{userprincipalname}}`, `com.microsoft.outlook.Mail.ExternalRecipientsToolTipEnabled` = `true`.

*Organization allowed accounts* (de twee MAM-sleutels) is het belangrijkste: zonder die regel
kan een gebruiker in de beheerde Outlook ook een privéaccount toevoegen, en App Protection kan
data tussen twee accounts in dezelfde app niet scheiden. De UniFy-bron zet daarnaast Focused
Inbox, standaardhandtekening, conversatieweergave en voorgestelde antwoorden uit — dat is
gebruikersvoorkeur en is weggelaten.

**Edge** — alleen de twee account-sleutels, om dezelfde reden: links uit Outlook en Teams openen
verplicht in Edge (App Protection), en die moeten in het werkprofiel van Edge landen, niet in
een privéaccount. Sleutels als startpagina, zoekmachine, SmartScreen en uitgeschakelde functies
zijn bewust weggelaten: hun Android-typen konden niet tegen een Android-export worden
geverifieerd, en de meeste zijn een organisatiekeuze.

**Defender** — ongewijzigd uit UniFy: `EnableLowTouchOnboarding` en `UserUPN` voor onboarding
zonder handelingen, `DefenderNetworkProtectionEnable`, `antiphishing` en `vpn` voor
webbescherming, en de `-PP`-sleutels (*personal profile*) die op een persoonlijk toestel de
apps en URL's van de privékant uit de rapportage houden. De `permissionActions` geven Defender
vooraf de opslag-, locatie- en meldingsrechten die hij voor scannen en netwerkbescherming nodig
heeft. Webbescherming loopt via een lokale VPN; met een andere always-on VPN op het toestel
botst dat — kies dan in overleg met de netwerkbeheerder.

## Uitrollen

1. Keur de app goed in Managed Google Play en zoek in Intune het app-id op:
   `GET https://graph.microsoft.com/beta/deviceAppManagement/mobileApps?$filter=isof('microsoft.graph.androidManagedStoreApp')`
   → het `id` van de app met het juiste `packageId`.
2. Vervang de placeholder in `targetedMobileApps` door dat id.
3. `POST https://graph.microsoft.com/beta/deviceAppManagement/mobileAppConfigurations` met de
   inhoud van het bestand.
4. Toewijzen aan dezelfde gebruikersgroepen als de app zelf
   (`POST …/mobileAppConfigurations/{id}/assign`), of in de portal onder Apps → App-configuratie.

## Niet in deze map: MAM zonder inschrijving

App-configuratie voor telefoons **zonder** inschrijving (`targetedManagedAppConfiguration`,
*Managed apps* in de portal) staat er bewust niet in. Voor dat type is in deze ronde geen
bron-export gevonden om de body tegen te verifiëren, en pl4nty kent voor Edge wel
Settings Catalog-definities (`com.microsoft.edge.mamedgeappconfigsettings.*`) maar geen
voorbeeld van de body die ze gebruikt. Een ongeverifieerde body importeert in het beste geval
niet en in het slechtste geval stil zonder effect. Richt die policy tot dan met de hand in:
Apps → App-configuratie → Toevoegen → *Managed apps*, dezelfde twee account-sleutels, gericht op
Outlook en Edge.

Uitzondering: Windows App, hieronder. Daarvoor documenteert Microsoft de sleutels en de waarden zelf.

## Windows App (Azure Virtual Desktop en Windows 365)

Twee Graph-bodies voor Windows App, ook op een toestel zonder inschrijving:

| Bestand | Graph-type | Wat het doet |
|---|---|---|
| `AND-Windows-App-App-Protection.json` | `androidManagedAppProtection` | PIN, geen klembord tussen de virtuele werkplek en lokale apps, `screenCaptureBlocked` = `true`, minimaal Windows App 11.0.0.94, Play Integrity hardwarematig, gejailbreakte of geroote toestellen geblokkeerd |
| `AND-Windows-App-Managed-Apps.json` | `targetedManagedAppConfiguration` | `redirectclipboard` = `0` en `drivestoredirect` = `0`: geen klembord en geen bestanden van de telefoon naar de sessie |

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
POST https://graph.microsoft.com/beta/deviceAppManagement/androidManagedAppProtections
<inhoud van AND-Windows-App-App-Protection.json>

POST https://graph.microsoft.com/beta/deviceAppManagement/androidManagedAppProtections/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.androidMobileAppIdentifier", "packageId": "com.microsoft.rdc.androidx" } } ] }
```

Voor `AND-Windows-App-Managed-Apps.json` hetzelfde via `targetedManagedAppConfigurations`. Wijs beide toe aan de gebruikers van
Azure Virtual Desktop of Windows 365. Company Portal moet in hetzelfde profiel staan als Windows App.

**Niet getest in een tenant.** Controleer na het toewijzen in de portal of Windows App niet ook
onder `[Baseline] - AND - U - App Protection` valt: twee app protection policies op dezelfde app
voor dezelfde gebruiker leveren een conflict op.
