# extras/windows

Onderdelen van de Windows-baseline die geen van de vijf CIPP-types zijn (`Catalog`, `Device`,
`deviceCompliancePolicies`, `AppProtection`, `Admin`) en dus niet via `IntuneTemplate/` en de
pijplijn uitrollen. Elke map heeft een eigen README met uitrolinstructie, fase en de controls
waar het aan bijdraagt.

| Map | Wat | Waarom niet in IntuneTemplate/ | Fase |
|---|---|---|---:|
| [`app-control/`](app-control/README.md) | App Control for Business (WDAC) met de ingebouwde controls — auditvariant, afdwingvariant, managed installer, KQL | Endpoint security-template; de `settingInstanceTemplateId` is niet te verifiëren tegen `pl4nty/intune-change-tracking` en moet per tenant uit Graph komen | 2 (audit) / 4 (afdwingen) |
| [`dns-over-https/`](dns-over-https/README.md) | DoH voor Windows zelf: toestaan (fase 2) of vereisen (fase 5), als remediation | De Windows-DoH-instelling (`DoHPolicy`) bestaat niet in de settings catalog; alleen de Edge-variant — die staat wél als template | 2 / 5 |
| [`remediations/escrow-check/`](remediations/escrow-check/README.md) | Controleert of de BitLocker-herstelsleutel en het LAPS-wachtwoord daadwerkelijk in Entra ID staan, en herstelt de BitLocker-escrow | Remediation-scripts (Intune → Scripts and remediations), geen policy | 1 (alleen detectie) / 2 |
| [`event-log-sizes/`](event-log-sizes/README.md) | Vergroot de logboeken PowerShell/Operational, Defender/Operational en CodeIntegrity/Operational | Die kanalen hebben geen CSP voor de maximale grootte | 2 |

Alle scripts zijn generiek: geen tenant-id, geen groepen, geen domeinen. Waar iets per
organisatie moet, staat een placeholder in HOOFDLETTERS die eindigt op `-INVULLEN`.
