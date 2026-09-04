# compliance/macos/

Een aangepaste compliance-check voor macOS: draait Microsoft Defender for Endpoint op deze Mac,
en is hij gezond?

Deze twee bestanden staan bewust **buiten** [`IntuneTemplate/`](../../IntuneTemplate/README.md),
om dezelfde reden als [`shellscripts/macos/`](../../shellscripts/macos/README.md) en
[`enrollment/macos/`](../../enrollment/macos/README.md): een compliance-script is in Graph een
eigen resource (`deviceManagement/deviceComplianceScripts`) en past niet in een van de vijf
CIPP-policytypes. De pijplijnen pikken deze map niet op, en er hoort dus ook geen `checkId` bij.

| Bestand | Wat het is |
|---|---|
| [`defender-health.sh`](defender-health.sh) | draait op de Mac en schrijft één regel JSON met vijf booleans |
| [`defender-health.json`](defender-health.json) | zegt welke waarde goed is, en wat de gebruiker in Bedrijfsportal te zien krijgt als het fout is |

## Waarom dit nodig is

De baseline rolt Defender for Endpoint uit op macOS
([`MAC - D - Defender for Endpoint`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md)
en [`MAC - D - Defender Antivirus`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.md)),
maar controleerde nergens of dat ook is gelukt. Windows heeft die controle wél —
`WIN - U - Compliance Defender for Endpoint` toetst de risicoscore. Op macOS ontbrak de
tegenhanger.

`macOSCompliancePolicy` kent wel `deviceThreatProtectionEnabled`, maar dat toetst iets anders:
de **risicoscore** die Defender aan het apparaat toekent. Een Mac waarop de agent nooit is
geïnstalleerd, of waar het achtergrondproces is gestopt, levert helemaal geen risicoscore — en
komt daarmee als "geen probleem" door die toets heen. Precies het apparaat dat je wilde vinden,
valt dus buiten de meting. Een script is de enige manier om te toetsen dat de agent er ís.

## Wat het controleert

| Boolean | Hoe |
|---|---|
| `DefenderInstalled` | de app én `/usr/local/bin/mdatp` bestaan — alleen de app zegt niets over een werkende agent, en alleen de tool blijft ook na een halve verwijdering staan |
| `DefenderRunning` | het proces `wdavdaemon` draait; de app kan dicht staan |
| `DefenderHealthy` | `mdatp health --field healthy` |
| `DefenderRealtimeProtection` | `mdatp health --field real_time_protection_enabled` |
| `DefenderDefinitionsCurrent` | `mdatp health --field definitions_status` is `up_to_date` |

Alle vijf moeten `true` zijn. De health-aanroepen gebeuren alleen als de daemon draait: zonder
die controle vooraf blijft `mdatp health` hangen tot Intune het script afbreekt, en dan is er
geen uitvoer en dus geen oordeel.

## Uitrollen

1. **Intune** → Apparaten → Compliancebeleid → **Scripts** → Toevoegen → macOS.
   Plak `defender-health.sh`. Laat *Uitvoeren als aangemelde gebruiker* **uit** — de check hoort
   apparaatbreed te zijn en `mdatp` heeft geen gebruikerscontext nodig.
2. Maak een macOS-compliancebeleid, zet **Aangepaste compliance** op *Vereisen*, kies het script
   uit stap 1 en upload `defender-health.json`.
3. Wijs toe aan alle gebruikers, net als de andere macOS-compliancepolicies.

> Er staat met opzet **geen** compliancebeleid-template voor in `IntuneTemplate/`. Zo'n beleid
> verwijst met `deviceCompliancePolicyScript` naar het id van het script uit stap 1, en dat id
> ontstaat pas in de tenant. Een template met een leeg of vreemd id importeert niet, of erger:
> importeert wel en toetst niets.

## Bij problemen

Het script logt naar `/Library/Logs/Microsoft/IntuneScripts/Compliance/defender-health.log`, met
per run de vijf uitkomsten en de ruwe `definitions_status` als die niet goed stond.

Twee dingen die vaak misgaan bij een aangepaste compliance-check:

- **Extra uitvoer op stdout maakt de hele evaluatie ongeldig.** Intune verwacht precies één regel
  JSON. Daarom gaat alles wat dit script verder meldt naar het logbestand en niet naar stdout.
- **`DefenderHealthy` op `false` terwijl de rest goed staat** wijst meestal op een ontbrekende
  toestemming onder Systeeminstellingen → Privacy en beveiliging, meestal Volledige schijftoegang.
  De baseline zet die via
  [`MAC - D - Privacy Preferences`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.md);
  komt die policy niet aan, dan is dat hier het eerste dat je merkt.

Bron voor de aanpak: [Custom compliance for Defender on macOS](https://www.oddsandendpoints.co.uk/posts/macos-custom-defender-compliance/)
(Odds and Endpoints).

---

Terug naar de [hoofd-README](../../README.md).
