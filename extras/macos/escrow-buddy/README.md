# extras/macos/escrow-buddy/

FileVault-herstelsleutel alsnog in Intune krijgen voor een Mac die al versleuteld was.

Staat buiten `IntuneTemplate/` om dezelfde reden als [`shellscripts/macos/`](../../../shellscripts/macos/README.md):
een shellscript (`deviceShellScripts`) is geen van de vijf CIPP-policytypes. Wordt niet opgepikt
door `generate-baseline.js`, `export-intunebackup.js`, `check-scope.js` of
`Set-BaselineAssignment.ps1`, en krijgt geen `checkId`. Hoort bij de samenvoeging in
`shellscripts/macos/` thuis.

| Bestand | Wat het doet | Scope |
|---|---|---|
| `escrow-buddy.sh` | installeert Escrow Buddy (vaste versie, handtekening gecontroleerd) en vraagt één keer een nieuwe herstelsleutel aan | Apparaat |

## Het gat

[`MAC - D - FileVault`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.md)
bewaart de herstelsleutel in Intune, maar macOS escrowt alleen een sleutel die wordt
**aangemaakt** terwijl het escrow-profiel (`com.apple.security.FDERecoveryKeyEscrow`) op de Mac
staat. Drie situaties vallen daardoor buiten de boot:

- de gebruiker had FileVault zelf al aangezet voordat de Mac werd ingeschreven;
- een Mac is via Company Portal ingeschreven nadat hij al versleuteld was;
- het profiel kwam pas binnen nadat Setup Assistant de schijf al had versleuteld.

Intune toont dan bij het apparaat geen herstelsleutel, en de rotatie uit de FileVault-policy
(`recoverykeyrotationinmonths`) werkt alleen op een sleutel die Intune al kent. Een vergeten
wachtwoord betekent in die situatie een verloren schijf.

## Hoe het werkt

[Escrow Buddy](https://github.com/macadmins/escrow-buddy) (Apache 2.0, Mac Admins Open Source,
oorspronkelijk Netflix) is een authorization plugin. Het pakket zet het mechanisme
`Escrow Buddy:Invoke,privileged` in `system.login.console`, vlak voor `loginwindow:done`. Staat
`GenerateNewKey` in `/Library/Preferences/com.netflix.Escrow-Buddy.plist` op true, dan maakt de
plugin bij de eerstvolgende aanmelding van een FileVault-gebruiker met het ingetypte wachtwoord
een nieuwe persoonlijke herstelsleutel aan. macOS stuurt die via het escrow-profiel naar Intune.
De gebruiker merkt niets; er verschijnt geen dialoog.

Het script:

1. stopt als FileVault uit staat (dan regelt de FileVault-policy versleuteling én escrow);
2. stopt als het al eerder een sleutel heeft aangevraagd (markering in
   `/Library/Application Support/Baseline/escrow-buddy-requested`);
3. wacht als het escrow-profiel er nog niet staat — een nieuwe sleutel zonder escrow maakt
   het erger, want de oude persoonlijke sleutel is dan ook weg;
4. downloadt Escrow Buddy **1.0.0** van de GitHub-release en installeert alleen als het pakket
   door Apple is genotariseerd (`spctl --assess --type install`) én is ondertekend met
   *Developer ID Installer* van team **T4SK8ZXCXG** (Mac Admins Open Source — de identiteit uit
   `.github/workflows/build_main.yml` van het project). Een andere ondertekenaar: niet
   installeren, ondertekening in de log;
5. controleert dat het mechanisme echt in de authorization database staat;
6. zet `GenerateNewKey`.

Log: `/Library/Logs/Baseline/escrow-buddy.log`.

Het kan geen kwaad dat het script ook draait op een Mac waarvan Intune de sleutel wél al had:
de sleutel wordt dan één keer vervangen en opnieuw ge-escrowd, precies wat de rotatie in de
FileVault-policy ook doet. Daarom is er geen poging om vanaf de Mac te raden of Intune een
sleutel heeft — dat kan de Mac niet zien.

## Instellingen in Intune

Devices → macOS → Shell scripts → Add.

| Instelling | Waarde | Waarom |
|---|---|---|
| Run script as signed-in user | **No** | installeren en `authorizationdb` wijzigen vraagt root |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 day** | het script wacht op het escrow-profiel; na de markering doet het niets meer |
| Max number of retries | 3 | |

Toewijzen aan dezelfde **apparaatgroep** als `MAC - D - FileVault`, en pas nadat die policy op de
Mac staat. Fase: gelijk aan FileVault (pilot eerst).

## Controleren

- Op de Mac, na aanmelden: `sudo profiles show -type configuration | grep -i escrow` toont het
  profiel, en de log eindigt met "GenerateNewKey gezet". Na de volgende aanmelding staat
  `GenerateNewKey` weer op false (`defaults read /Library/Preferences/com.netflix.Escrow-Buddy.plist`).
- In Intune: Devices → het apparaat → **Recovery keys** toont een sleutel.

## Nieuwe versie

`EB_VERSION` bijwerken, en vóór het uitrollen op één Mac nagaan dat
`pkgutil --check-signature` nog steeds `Developer ID Installer: Mac Admins Open Source (T4SK8ZXCXG)`
toont. Verandert de ondertekenaar, dan stopt het script bewust — pas `EB_TEAM_ID` alleen aan na
controle bij het project.

**Open punt:** release 1.0.0 dateert van juni 2023, de ondertekening van die release is niet
vanaf deze werkplek op een Mac geverifieerd. Het script faalt veilig als de team-id niet klopt;
controleer dat op de eerste pilot-Mac in de log.

## Verwijderen

```bash
sudo "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle/Contents/Resources/AuthDBTeardown.sh"
sudo rm -rf "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle"
sudo pkgutil --forget com.netflix.Escrow-Buddy
```

Dat is wat `scripts/uninstall.sh` van het project ook doet. Laat de plugin niet staan op een Mac
die uit beheer gaat: een mechanisme in `system.login.console` waarvan de bundle ontbreekt
blokkeert het aanmelden.

## Regeleindes

LF, zoals alle `*.sh` in deze repo (`.gitattributes`).
