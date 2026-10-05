**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Firefox-policies

| | |
|---|---|
| **Controls** | ISO A.8.7 Bescherming tegen malware, A.8.8 Beheer van technische kwetsbaarheden, A.8.12 Voorkomen van datalekken, A.8.19 Installatie van software op operationele systemen · NIS2 art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden · CIS Controls v8.1 7.4 Perform Automated Application Patch Management, 9.1 Ensure Use of Only Fully Supported Browsers and Email Clients, 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions · NIST CSF 2.0 PR.PS-02, PR.PS-05 |
| **Fase** | 2 (pilot) · extensieblokkade apart, ook fase 2 |

De Firefox-tegenhanger van drie templates in `IntuneTemplate/WIN/SettingsCatalog/`:
`Google Chrome Security`, `Google Chrome Updates` en `Google Chrome Extensions`.

## Waarom een script en geen template

Chrome en Edge staan in de settings catalog, Firefox niet: `pl4nty/intune-change-tracking` heeft
geen enkele Mozilla-definitie. Wat Mozilla als "Windows (Intune)" documenteert is een
OMA-URI met ADMX-ingestie, of een ADMX-import per tenant — dat laatste levert
`groupPolicyConfigurations` met definitie-id's die per tenant verschillen, en dat type (`Admin`)
vermijdt deze baseline. Firefox leest zijn policies echter zelf uit
`HKLM\SOFTWARE\Policies\Mozilla\Firefox`, zonder ADMX. Een remediation die die waarden zet werkt
dus in elke tenant, en meldt via de detectie ook wanneer iemand ze terugdraait.

## Wat er gezet wordt

Alle waarden volgens de [Mozilla policy templates](https://mozilla.github.io/policy-templates/)
(v8.3, september 2026). De keuzes zijn die van de Chrome-templates.

| Waarde | Wat | Chrome-tegenhanger |
|---|---|---|
| `DisableAppUpdate` = 0, `AppAutoUpdate` = 1, `BackgroundAppUpdate` = 1 | Firefox werkt zichzelf bij, ook als hij niet draait | Google Chrome Updates |
| `DisableSecurityBypass\InvalidCertificate` = 1 | Geen uitzondering toevoegen bij een ongeldig certificaat | `SSLErrorOverrideAllowed` = 0 |
| `DisableSecurityBypass\SafeBrowsing` = 1 | Een Safe Browsing-waarschuwing is niet weg te klikken | `DisableSafeBrowsingProceedAnyway` = 1 |
| `DNSOverHTTPS\Enabled` = 0, `Locked` = 1 | DoH uit en vergrendeld | `DnsOverHttpsMode` = off |
| `Preferences`: `network.http.http3.enable` = false, locked | QUIC/HTTP3 uit | `QuicAllowed` = 0 |
| `PasswordManagerEnabled` = 0 | Geen wachtwoordmanager; Edge is de beheerde | `PasswordManagerEnabled` = 0 |
| `DisableFirefoxAccounts` = 1 | Geen Mozilla-account en dus geen sync naar een persoonlijk account | `BrowserSignin` = 0, `SyncDisabled` = 1 |
| `DisableTelemetry` = 1 | Geen telemetrie naar Mozilla | — |
| `ExtensionSettings`: `"*"` = blocked — alleen met `$BlockExtensions = $true` | Alle extensies geblokkeerd | Google Chrome Extensions |

DoH en QUIC gaan uit om dezelfde reden als in Chrome: Defender Network Protection kan verkeer van
een browser van derden alleen via DNS en TLS inspecteren, en Microsoft adviseert beide uit te
zetten (zie [`dns-over-https/`](../dns-over-https/README.md#samenspel-met-defender-network-protection)).

## Let op vóór uitrol

- **Wachtwoorden.** Anders dan in Chrome blokkeert `PasswordManagerEnabled` = 0 in Firefox ook
  `about:logins`, het overzicht van al opgeslagen wachtwoorden. Laat gebruikers ze eerst
  exporteren of in Edge importeren.
- **Extensies.** `"installation_mode": "blocked"` op `"*"` blokkeert nieuwe extensies **en
  verwijdert de extensies die al geïnstalleerd zijn**. Daarom staat het achter `$BlockExtensions`,
  standaard uit. Eerst inventariseren (Defender Vulnerability Management → Browser extensions),
  dan een allowlist maken door per extensie-id `"installation_mode": "allowed"` toe te voegen aan
  de JSON in beide scripts.
- **Bestaande `Preferences`.** Een organisatie die al via groepsbeleid of `policies.json`
  Firefox-voorkeuren zet, moet die JSON samenvoegen met die van deze scripts: de waarde
  `Preferences` wordt in zijn geheel overschreven.
- **Firefox ESR.** Dezelfde sleutel geldt voor ESR. Pas `AppAutoUpdate` niet aan voor een
  organisatie die ESR-updates zelf verpakt; zet dan `DisableAppUpdate` op 1 in beide scripts.

## Uitrol

Intune admin center → **Devices → Scripts and remediations → Create**:

| Veld | Waarde |
|---|---|
| Naam | `[Baseline] - WIN - D - Mozilla Firefox Policies` |
| Detectiescript | `Detect-FirefoxPolicies.ps1` |
| Herstelscript | `Remediate-FirefoxPolicies.ps1` — `$Policies` en `$BlockExtensions` gelijk aan het detectiescript |
| Uitvoeren met aanmeldingsreferenties | Nee (SYSTEM) |
| 64-bits PowerShell | Ja |
| Schema | Dagelijks |
| Toewijzing | Pilotgroep `SEC-Baseline-Pilot`, daarna alle Windows-apparaten. Op een apparaat zonder Firefox schrijft hij alleen registerwaarden. |

Een draaiende Firefox neemt de policies over na een herstart. Controleer met `about:policies`.

Terugdraaien: verwijder `HKLM\SOFTWARE\Policies\Mozilla\Firefox` en herstart Firefox.
