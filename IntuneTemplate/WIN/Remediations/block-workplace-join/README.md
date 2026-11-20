**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Geen werkaccounts van andere organisaties op Windows

| | |
|---|---|
| **Controls** | ISO A.5.15 Toegangsbeveiliging, A.8.1 Eindpuntapparatuur van gebruikers, A.8.9 Configuratiebeheer · NIS2 art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen · CIS Controls v8.1 4.1 Establish and Maintain a Secure Configuration Process · NIST CSF 2.0 PR.AA-01, PR.PS-01 |
| **Fase** | 2 (pilot), daarna alle fysieke Windows-apparaten |
| **Bron** | IntuneAdmin/IntuneBaselines, *Modern Work Detect and Remediation* (oktober 2026); eigen scripts |

## Wat het tegenhoudt

Op een apparaat van de organisatie kan een gebruiker onder *Instellingen → Accounts → Toegang tot
werk of school* een werkaccount van **een andere tenant** toevoegen. Office doet hetzelfde
ongevraagd: na aanmelden met een ander werkaccount staat er een vinkje *Toestaan dat mijn
organisatie mijn apparaat beheert*. Het apparaat wordt dan óók in die andere tenant geregistreerd
(Entra registered). Gevolg:

- de andere organisatie kan haar Conditional Access en soms haar MAM- of MDM-beleid op dit apparaat
  zetten;
- tokens van die andere tenant staan in de WAM-cache van een apparaat dat wij beheren, en
  gegevens van ons kunnen via apps die met dat account aangemeld zijn naar de andere tenant;
- in Entra ID van de andere tenant verschijnt ons apparaat — niet te zien en niet op te ruimen vanuit
  deze tenant.

`BlockAADWorkplaceJoin = 1` (`HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin`) blokkeert die
registratie. Het eigen werkaccount, waarmee het apparaat Entra joined is, raakt het niet.

## Waarom een script en geen template

De instelling staat niet in de settings catalog (`pl4nty/intune-change-tracking` kent geen
`workplacejoin`-definitie) en niet in een ingebouwde ADMX. Daarom, net als
[`dns-over-https/`](../dns-over-https/README.md), een remediation.

## Waar je op moet letten

- **Consultants en gedeelde medewerkers** die voor een tweede organisatie werken met een account
  van díe tenant, lopen hier tegenaan. Gasttoegang (B2B) met het eigen account — Teams wisselen naar
  een andere organisatie, een gedeelde SharePoint-site — gebruikt geen tweede werkaccount en blijft
  werken. Controleer in de pilot of iemand een tweede werkaccount gebruikt in de desktop-apps; zo
  iemand gaat via de browser in een eigen profiel werken, of krijgt een uitzondering (een
  uitsluitingsgroep op de toewijzing).
- **Bestaande registraties blijven staan.** Het script voorkomt nieuwe; wat er al is zie je met
  `dsregcmd /status` (sectie *Work Account*) of onder *Toegang tot werk of school*. Opruimen doet de
  gebruiker of de servicedesk via *Verbinding verbreken*.
- **Gedeelde apparaten en AVD**: daar is het net zo zinvol, maar op multi-session ook overbodig als
  gebruikers geen instellingen-app hebben. Begin met fysieke apparaten.

## Uitrol

Intune admin center → **Devices → Scripts and remediations → Create**:

| Veld | Waarde |
|---|---|
| Naam | `[Baseline] - WIN - D - Block Workplace Join` |
| Detectiescript | `Detect-BlockWorkplaceJoin.ps1` |
| Herstelscript | `Remediate-BlockWorkplaceJoin.ps1` |
| Uitvoeren met aanmeldingsreferenties | Nee (SYSTEM) |
| 64-bits PowerShell | Ja |
| Schema | Dagelijks |
| Toewijzing | pilotgroep, daarna alle fysieke Windows-apparaten |

Terugdraaien: verwijder de waarde `BlockAADWorkplaceJoin`. Daarna kan een gebruiker weer een
werkaccount van een andere organisatie toevoegen.
