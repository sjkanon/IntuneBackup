[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/macos/

Parts of the macOS baseline that are none of the five CIPP policy types (Catalog, Device,
deviceCompliancePolicies, AppProtection, Admin). `check-scope.js` and
`Set-BaselineAssignment.ps1` do nothing with this folder; `export-intunebackup.js` only copies
`enrollment/` and `shell-scripts/` into the restore export as a sidecar.

| Folder | What | How to deploy |
|---|---|---|
| [`enrollment/`](enrollment/README.en.md) | ADE enrollment profile (`depMacOSEnrollmentProfile`) with locked enrollment and a managed local administrator account | `scripts/New-MacOSEnrollmentPolicy.ps1` under the ABM token; sidecar in the export |
| [`shell-scripts/`](shell-scripts/README.en.md) | shell scripts: Dock, Azure Files mount, screen recording nudge, and [Escrow Buddy](shell-scripts/README.en.md#escrow-buddysh) for the FileVault recovery key of Macs that were already encrypted | Devices → macOS → Shell scripts; sidecar in the export |
| [`compliance-scripts/`](compliance-scripts/README.en.md) | custom compliance check: is Defender for Endpoint running and is it healthy | Devices → Compliance → Scripts, then a compliance policy |
| [`enrollment-restriction/`](enrollment-restriction/README.en.md) | advice + Graph body: do not let personal Macs enrol | Device platform restriction, via the portal or Graph |
| [`defender-onboarding/`](defender-onboarding/README.en.md) | why Defender for Endpoint on macOS cannot be onboarded generically, and the route per tenant | manually per tenant (custom profile with the onboarding package) |
| [`apple-business/`](apple-business/README.en.md) | Apple Business checklist: administrators, Managed Apple Accounts and federation, MDM server, yearly tokens | manually in Apple Business and Intune |
