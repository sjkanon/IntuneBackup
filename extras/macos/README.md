# extras/macos/

Onderdelen van de macOS-baseline die geen van de vijf CIPP-policytypes zijn (Catalog, Device,
deviceCompliancePolicies, AppProtection, Admin). De pijplijnen (`generate-baseline.js`,
`export-intunebackup.js`, `check-scope.js`, `Set-BaselineAssignment.ps1`) pikken deze map niet op
en er horen geen `checkId`'s bij — net als `enrollment/macos/`, `shellscripts/macos/` en
`compliance/macos/`.

| Map | Wat | Hoe uitrollen |
|---|---|---|
| [`escrow-buddy/`](escrow-buddy/README.md) | shellscript: FileVault-herstelsleutel alsnog in Intune voor Macs die al versleuteld waren | Devices → macOS → Shell scripts; hoort bij samenvoegen in `shellscripts/macos/` |
| [`enrollment-restriction/`](enrollment-restriction/README.md) | advies + Graph-body: persoonlijke Macs niet laten inschrijven | Device platform restriction, via portal of Graph |
| [`defender-onboarding/`](defender-onboarding/README.md) | waarom Defender for Endpoint op macOS niet generiek is aan te melden, en de route per tenant | handmatig per tenant (custom profile met het aanmeldpakket) |
| [`apple-business/`](apple-business/README.md) | checklist Apple Business: beheerders, Managed Apple Accounts en federatie, MDM-server, jaarlijkse tokens | handmatig in Apple Business en Intune |
