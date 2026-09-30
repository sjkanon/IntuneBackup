**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# extras/macos/

Onderdelen van de macOS-baseline die geen van de vijf CIPP-policytypes zijn (Catalog, Device,
deviceCompliancePolicies, AppProtection, Admin). `check-scope.js` en
`Set-BaselineAssignment.ps1` doen niets met deze map; `export-intunebackup.js` kopieert alleen
`enrollment/` en `shell-scripts/` als sidecar mee in de restore-export.

| Map | Wat | Hoe uitrollen |
|---|---|---|
| [`enrollment/`](enrollment/README.md) | ADE-inschrijfprofiel (`depMacOSEnrollmentProfile`) met vergrendelde inschrijving en een beheerd lokaal beheerdersaccount | `scripts/New-MacOSEnrollmentPolicy.ps1` onder het ABM-token; sidecar in de export |
| [`shell-scripts/`](shell-scripts/README.md) | shellscripts: Dock, Azure Files-mount, schermopname-nudge, en [Escrow Buddy](shell-scripts/README.md#escrow-buddysh) voor de FileVault-herstelsleutel van Macs die al versleuteld waren | Devices → macOS → Shell scripts; sidecar in de export |
| [`compliance-scripts/`](compliance-scripts/README.md) | aangepaste compliance-check: draait Defender for Endpoint en is hij gezond | Devices → Compliance → Scripts, daarna een compliance-policy |
| [`enrollment-restriction/`](enrollment-restriction/README.md) | advies + Graph-body: persoonlijke Macs niet laten inschrijven | Device platform restriction, via portal of Graph |
| [`defender-onboarding/`](defender-onboarding/README.md) | waarom Defender for Endpoint op macOS niet generiek is aan te melden, en de route per tenant | handmatig per tenant (custom profile met het aanmeldpakket) |
| [`apple-business/`](apple-business/README.md) | checklist Apple Business: beheerders, Managed Apple Accounts en federatie, MDM-server, jaarlijkse tokens | handmatig in Apple Business en Intune |
