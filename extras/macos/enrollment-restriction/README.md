# extras/macos/enrollment-restriction/

Advies en template: persoonlijke Macs niet laten inschrijven in Intune.

Een inschrijvingsrestrictie (`deviceEnrollmentPlatformRestrictionConfiguration`) is geen van de
vijf CIPP-policytypes en hangt onder `deviceManagement/deviceEnrollmentConfigurations`. Niet
opgepikt door de pijplijnen, geen `checkId`.

| Bestand | Wat het is |
|---|---|
| `macos-block-personal.json` | Graph-body: platform macOS toegestaan, persoonlijk eigendom geblokkeerd |

## Advies

**Blokkeer persoonlijke Macs** zodra alle bedrijfs-Macs via Apple Business binnenkomen (ADE) of
hun serienummer als corporate identifier in Intune staat.

Waarom:

- De macOS-baseline is gebouwd voor bedrijfs-Macs. Een persoonlijke Mac die zich via Company
  Portal inschrijft krijgt FileVault-escrow, Platform SSO, Restrictions en Defender opgelegd op
  een apparaat waarvan de organisatie niet de eigenaar is — met een privacy- en AVG-vraag
  (A.5.34) die niemand heeft beantwoord.
- Veel beveiliging uit deze baseline werkt alleen **supervised** (ADE): Recovery Lock, de
  declaratieve update- en schijfbeheerinstellingen, `allowUIConfigurationProfileInstallation`. Een
  handmatig ingeschreven Mac is niet supervised en valt daar stil buiten, terwijl hij wél
  compliant kan worden en dus toegang krijgt.
- Een handmatig ingeschreven Mac kan de gebruiker zelf uit beheer halen; een ADE-Mac met
  vergrendelde inschrijving niet (zie `enrollment/macos/`).

Intune rekent een Mac standaard tot **persoonlijk eigendom**. Bedrijfseigendom is hij alleen als
hij (Microsoft Learn, *Overview of enrollment restrictions*, "Blocking personal Macs"):

- is ingeschreven via Apple Automated Device Enrollment (ADE), of
- met zijn serienummer is geregistreerd als corporate identifier.

Wat er dan met een persoonlijke Mac gebeurt: geen inschrijving. Toegang tot M365 regelt
Conditional Access — webtoegang via Edge met app-enforced restrictions, of niets. De baseline in
`CA-policies` bepaalt dat; deze restrictie verandert daar niets aan.

**Let op, en zo staat het bij Microsoft:** "Enrollment restrictions are not security features.
Compromised devices can misrepresent their character." Dit voorkomt per ongeluk inschrijven; de
echte poort is Conditional Access met *require compliant device*.

Wanneer níet blokkeren: als de organisatie bewust persoonlijke Macs beheert (BYOD met volledige
inschrijving). Dan hoort daar een eigen, lichtere set policies bij — de corporate-baseline is dan
niet de juiste.

## Uitrollen

Voorbereiding: bestaande Macs die níet via ADE kwamen, eerst met serienummer toevoegen onder
Devices → Enrollment → Corporate device identifiers. Anders kan zo'n Mac na een wipe niet meer
terug.

1. Intune → Devices → Device onboarding → Enrollment → **Device platform restriction** → macOS →
   Create restriction, of via Graph:

   ```powershell
   Connect-MgGraph -Scopes DeviceManagementServiceConfig.ReadWrite.All
   $body = Get-Content .\macos-block-personal.json -Raw
   $r = Invoke-MgGraphRequest -Method POST `
       -Uri "https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations" `
       -Body $body -ContentType "application/json"
   ```

2. Toewijzen aan een **gebruikersgroep** (inschrijvingsrestricties gelden voor de gebruiker die
   inschrijft):

   ```powershell
   $assign = @{ enrollmentConfigurationAssignments = @(@{
       target = @{ "@odata.type" = "#microsoft.graph.groupAssignmentTarget"; groupId = "GROEP-ID-INVULLEN" } }) } | ConvertTo-Json -Depth 5
   Invoke-MgGraphRequest -Method POST `
       -Uri "https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations/$($r.id)/assign" `
       -Body $assign -ContentType "application/json"
   ```

   Of: pas de **standaardrestrictie** (All users, laagste prioriteit) aan en zet daar macOS
   personally owned op Block — dan geldt het voor iedereen zonder aparte toewijzing.

3. Test met een testaccount op een niet-geregistreerde Mac: Company Portal moet de inschrijving
   weigeren.

Beperking uit dezelfde Microsoft-pagina: userless ADE (zonder gebruikersaffiniteit) krijgt altijd
de **standaard**restrictie, niet een toegewezen restrictie. De ADE-profielen in deze baseline
gebruiken user affinity, dus dat raakt ze niet — maar een ADE-Mac is sowieso bedrijfseigendom.

## Normen

A.5.9 Inventarisatie van informatie en andere gerelateerde bedrijfsmiddelen, A.8.1
Eindpuntapparatuur van gebruikers; NIS2 art. 21(2)(i); CIS Controls v8.1 1.1 Establish and
Maintain Detailed Enterprise Asset Inventory en 1.2 Address Unauthorized Assets; NIST CSF 2.0
ID.AM-01.
