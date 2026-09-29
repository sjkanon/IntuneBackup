[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/macos/

Parts of the macOS baseline that are none of the five CIPP policy types (Catalog, Device,
deviceCompliancePolicies, AppProtection, Admin). The pipelines (`generate-baseline.js`,
`export-intunebackup.js`, `check-scope.js`, `Set-BaselineAssignment.ps1`) do not pick up this folder
and there are no `checkId`s for it — just like `enrollment/macos/`, `shellscripts/macos/` and
`compliance/macos/`.

| Folder | What | How to deploy |
|---|---|---|
| [`escrow-buddy/`](escrow-buddy/README.en.md) | shell script: get the FileVault recovery key into Intune after all for Macs that were already encrypted | Devices → macOS → Shell scripts; belongs in `shellscripts/macos/` when merged |
| [`enrollment-restriction/`](enrollment-restriction/README.en.md) | advice + Graph body: do not let personal Macs enrol | Device platform restriction, via the portal or Graph |
| [`defender-onboarding/`](defender-onboarding/README.en.md) | why Defender for Endpoint on macOS cannot be onboarded generically, and the route per tenant | manually per tenant (custom profile with the onboarding package) |
| [`apple-business/`](apple-business/README.en.md) | Apple Business checklist: administrators, Managed Apple Accounts and federation, MDM server, yearly tokens | manually in Apple Business and Intune |
