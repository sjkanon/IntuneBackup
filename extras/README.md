**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# extras/

Wat bij een complete baseline hoort maar geen van de vijf CIPP-policytypes is (`Catalog`,
`Admin`, `Device`, `deviceCompliancePolicies`, `AppProtection`), per platform in een eigen map.
Elke submap heeft een README met uitrolroute, voorwaarden en de normen die het onderdeel invult.

**Pijplijn.** `check-scope.js` en `Set-BaselineAssignment.ps1` doen niets met `extras/`. Twee
mappen gaan wél mee in de restore-export, als sidecar: `export-intunebackup.js` kopieert de
macOS ADE-profielen uit [`macos/enrollment/`](macos/enrollment/README.md) en de
macOS-shellscripts uit [`macos/shell-scripts/`](macos/shell-scripts/README.md) naar
`export/NativeImport/`, omdat een herinrichting uit die export ze anders vergeet. De module
IntuneBackupAndRestore zet ze niet terug; de README naast de kopie zegt hoe dan wel.

| Platform | Submap | Wat erin staat |
|---|---|---|
| [`android/`](android/README.md) | [`enrollment-restriction/`](android/enrollment-restriction/README.md) | inschrijvingsrestrictie: Android Enterprise toestaan, device administrator blokkeren |
| | [`app-configuration/`](android/app-configuration/README.md) | app-configuratie voor Outlook, Edge en Defender low-touch onboarding |
| | [`assignment-filters/`](android/assignment-filters/README.md) | toewijzingsfilters voor persoonlijk, corporate en dedicated |
| [`ios/`](ios/README.md) | [`enrollment/`](ios/enrollment/README.md) | ADE-inschrijfprofiel (`depIOSEnrollmentProfile`); Apple Business-instellingen en dynamische groepen staan in de platform-README |
| | [`app-configuration/`](ios/app-configuration/README.md) | app-configuratie voor Outlook, Edge en Defender |
| [`macos/`](macos/README.md) | [`enrollment/`](macos/enrollment/README.md) | ADE-inschrijfprofiel (`depMacOSEnrollmentProfile`) — sidecar in de export |
| | [`enrollment-restriction/`](macos/enrollment-restriction/README.md) | inschrijvingsrestrictie voor persoonlijke Macs |
| | [`shell-scripts/`](macos/shell-scripts/README.md) | Dock, Azure Files-mount, schermopname-nudge, Escrow Buddy voor FileVault-escrow van al versleutelde Macs — sidecar in de export |
| | [`compliance-scripts/`](macos/compliance-scripts/README.md) | aangepaste compliance-check voor Defender for Endpoint |
| | [`defender-onboarding/`](macos/defender-onboarding/README.md) | Defender for Endpoint-onboarding per tenant |
| | [`apple-business/`](macos/apple-business/README.md) | Apple Business-checklist |
| [`windows/`](windows/README.md) | [`app-control/`](windows/app-control/README.md) | App Control for Business (audit en afdwingen, met script voor de tenant-template-id's en hunting-queries) |
| | [`remediations/`](windows/README.md) | DNS over HTTPS voor Windows zelf, logboekgroottes, controle van BitLocker- en LAPS-escrow |
| | [`platform-scripts/`](windows/platform-scripts/README.md) | Azure Files-schijf koppelen |
| | [`win32-apps/`](windows/win32-apps/remove-mcafee/README.md) | Win32-app die de voorgeïnstalleerde McAfee verwijdert |

**Placeholders.** Alles wat per organisatie verschilt staat als `…-INVULLEN` (app-id's, VPP-token,
resolver, servicedesknummer). Vul die in een kopie buiten git in — zie `local/` in `.gitignore` —
en nooit in deze repo.

**CIPP.** CIPP haalt elk `.json`-bestand uit de repo op. De Graph-bodies hier hebben geen
`Displayname` en worden daarom één naamloze templaterij, net als de andere niet-policybestanden
(zie de [hoofd-README](../README.md#terugzetten-in-een-tenant)); die doet niets en kan in CIPP weg.
