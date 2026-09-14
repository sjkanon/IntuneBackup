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
geverifieerd, en de meeste zijn een klantkeuze.

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
