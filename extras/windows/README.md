**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# extras/windows

Onderdelen van de Windows-baseline die geen van de vijf CIPP-types zijn (`Catalog`, `Device`,
`deviceCompliancePolicies`, `AppProtection`, `Admin`) en dus niet via `IntuneTemplate/` en de
pijplijn uitrollen. `check-scope.js`, `export-intunebackup.js` en `Set-BaselineAssignment.ps1`
doen niets met deze map. Elke map heeft een eigen README met uitrolinstructie, fase en de controls
waar het aan bijdraagt.

| Map | Wat | Waarom niet in IntuneTemplate/ | Fase |
|---|---|---|---:|
| [`app-control/`](app-control/README.md) | App Control for Business (WDAC) met de ingebouwde controls — auditvariant, afdwingvariant, managed installer, KQL | Endpoint security-template; de `settingInstanceTemplateId` is niet te verifiëren tegen `pl4nty/intune-change-tracking` en moet per tenant uit Graph komen | 2 (audit) / 4 (afdwingen) |
| [`remediations/dns-over-https/`](remediations/dns-over-https/README.md) | DoH voor Windows zelf: toestaan (fase 2) of vereisen (fase 5), als remediation | De Windows-DoH-instelling (`DoHPolicy`) bestaat niet in de settings catalog; alleen de Edge-variant — die staat wél als template | 2 / 5 |
| [`remediations/escrow-check/`](remediations/escrow-check/README.md) | Controleert of de BitLocker-herstelsleutel en het LAPS-wachtwoord daadwerkelijk in Entra ID staan, en herstelt de BitLocker-escrow | Remediation-scripts (Intune → Scripts and remediations), geen policy | 1 (alleen detectie) / 2 |
| [`remediations/event-log-sizes/`](remediations/event-log-sizes/README.md) | Vergroot de logboeken PowerShell/Operational, Defender/Operational en CodeIntegrity/Operational | Die kanalen hebben geen CSP voor de maximale grootte | 2 |
| [`remediations/firefox-policies/`](remediations/firefox-policies/README.md) | Firefox-tegenhanger van de Google Chrome-templates: updates, Safe Browsing en certificaatfouten niet te omzeilen, DoH en QUIC uit, geen wachtwoordmanager of Mozilla-account; extensieblokkade optioneel | Firefox staat niet in de settings catalog; een ADMX-import is per tenant. Firefox leest `HKLMSOFTWAREPoliciesMozillaFirefox` zelf | 2 |
| [`platform-scripts/`](platform-scripts/README.md) | Koppelt een Azure Files-share als schijfletter met het Entra Kerberos-ticket | Een drive mapping is geen policy; platformscripts hebben geen CIPP-`TemplateType` | wacht op een storage account met Entra Kerberos |
| [`win32-apps/remove-mcafee/`](win32-apps/remove-mcafee/README.md) | Verwijdert de voorgeïnstalleerde McAfee, die Defender in passive mode zet | Een Win32-app is geen policy | vóór de Defender-policies |
| [`win32-apps/winget-autoupdate/`](win32-apps/winget-autoupdate/README.md) | Werkt dagelijks elke app bij die winget kent (7-Zip, Adobe Reader, Zoom …), als SYSTEM en in gebruikerscontext; browsers, Office, Teams en OneDrive uitgesloten | Een Win32-app is geen policy; een policy kan winget configureren, niet laten draaien | 2 |

Alle scripts zijn generiek: geen tenant-id, geen groepen, geen domeinen. Waar iets per
organisatie moet, staat een placeholder in HOOFDLETTERS die eindigt op `-INVULLEN`.
