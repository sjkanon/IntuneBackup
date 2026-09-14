# extras/

Wat bij een complete baseline hoort maar geen van de vijf CIPP-policytypes is (`Catalog`,
`Admin`, `Device`, `deviceCompliancePolicies`, `AppProtection`). Niets hier wordt opgepikt door
`check-scope.js`, `generate-baseline.js`, `export-intunebackup.js` of `Set-BaselineAssignment.ps1`,
en er hoort geen `checkId` bij. Elke map heeft een eigen README met uitrolroute, voorwaarden en de
normen die het onderdeel invult.

Zelfde lijn als [`enrollment/macos/`](../enrollment/macos/README.md),
[`compliance/macos/`](../compliance/macos/README.md), [`shellscripts/macos/`](../shellscripts/macos/README.md)
en [`platformscripts/windows/`](../platformscripts/windows/README.md), die al eerder buiten
`IntuneTemplate/` stonden.

| Map | Wat erin staat |
|---|---|
| [`android/`](android/README.md) | inschrijvingsrestrictie (Android Enterprise, persoonlijk werkprofiel), app-configuratie voor Outlook, Edge en Defender low-touch onboarding, toewijzingsfilters voor persoonlijk, corporate en dedicated |
| [`ios/`](ios/README.md) | Apple Business-instellingen en dynamische groepen, ADE-inschrijfprofiel (`depIOSEnrollmentProfile`), app-configuratie voor Outlook, Edge en Defender |
| [`macos/`](macos/README.md) | Apple Business-checklist, Defender for Endpoint-onboarding per tenant, inschrijvingsrestrictie voor persoonlijke Macs, Escrow Buddy voor FileVault-escrow van al versleutelde Macs |
| [`windows/`](windows/README.md) | App Control for Business (audit en afdwingen, met script voor de tenant-template-id's en hunting-queries), DNS over HTTPS voor Windows zelf, logboekgroottes, remediations die BitLocker- en LAPS-escrow controleren |

**Placeholders.** Alles wat per organisatie verschilt staat als `…-INVULLEN` (app-id's, VPP-token,
resolver, servicedesknummer). Vul die in een kopie buiten git in — zie `local/` in `.gitignore` —
en nooit in deze repo.

**CIPP.** CIPP haalt elk `.json`-bestand uit de repo op. De Graph-bodies hier hebben geen
`Displayname` en worden daarom één naamloze templaterij, net als de andere niet-policybestanden
(zie de hoofd-README); die doet niets en kan in CIPP weg.
