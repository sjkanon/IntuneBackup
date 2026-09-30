[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/

What belongs in a complete baseline but is none of the five CIPP policy types (`Catalog`,
`Admin`, `Device`, `deviceCompliancePolicies`, `AppProtection`), in a folder per platform.
Each subfolder has a README with the deployment route, prerequisites and the standards the
component covers.

**Pipeline.** `check-scope.js` and `Set-BaselineAssignment.ps1` do nothing with `extras/`. Two
folders do go into the restore export, as a sidecar: `export-intunebackup.js` copies the
macOS ADE profiles from [`macos/enrollment/`](macos/enrollment/README.en.md) and the
macOS shell scripts from [`macos/shell-scripts/`](macos/shell-scripts/README.en.md) to
`export/NativeImport/`, because a rebuild from that export would otherwise forget them. The
IntuneBackupAndRestore module does not restore them; the README next to the copy explains how.

| Platform | Subfolder | What it contains |
|---|---|---|
| [`android/`](android/README.en.md) | [`enrollment-restriction/`](android/enrollment-restriction/README.en.md) | enrollment restriction: allow Android Enterprise, block device administrator |
| | [`app-configuration/`](android/app-configuration/README.en.md) | app configuration for Outlook, Edge and Defender low-touch onboarding |
| | [`assignment-filters/`](android/assignment-filters/README.en.md) | assignment filters for personal, corporate and dedicated |
| [`ios/`](ios/README.en.md) | [`enrollment/`](ios/enrollment/README.en.md) | ADE enrollment profile (`depIOSEnrollmentProfile`); Apple Business settings and dynamic groups are in the platform README |
| | [`app-configuration/`](ios/app-configuration/README.en.md) | app configuration for Outlook, Edge and Defender |
| [`macos/`](macos/README.en.md) | [`enrollment/`](macos/enrollment/README.en.md) | ADE enrollment profile (`depMacOSEnrollmentProfile`) — sidecar in the export |
| | [`enrollment-restriction/`](macos/enrollment-restriction/README.en.md) | enrollment restriction for personal Macs |
| | [`shell-scripts/`](macos/shell-scripts/README.en.md) | Dock, Azure Files mount, screen recording nudge, Escrow Buddy for FileVault escrow of already encrypted Macs — sidecar in the export |
| | [`compliance-scripts/`](macos/compliance-scripts/README.en.md) | custom compliance check for Defender for Endpoint |
| | [`defender-onboarding/`](macos/defender-onboarding/README.en.md) | Defender for Endpoint onboarding per tenant |
| | [`apple-business/`](macos/apple-business/README.en.md) | Apple Business checklist |
| [`windows/`](windows/README.en.md) | [`app-control/`](windows/app-control/README.en.md) | App Control for Business (audit and enforce, with a script for the tenant template ids and hunting queries) |
| | [`remediations/`](windows/README.en.md) | DNS over HTTPS for Windows itself, event log sizes, checking BitLocker and LAPS escrow |
| | [`platform-scripts/`](windows/platform-scripts/README.en.md) | mounting an Azure Files drive |
| | [`win32-apps/`](windows/win32-apps/remove-mcafee/README.en.md) | Win32 app that removes the preinstalled McAfee |

**Placeholders.** Everything that differs per organisation is shown as `…-INVULLEN` (app ids, VPP token,
resolver, service desk number). Fill these in on a copy outside git — see `local/` in `.gitignore` —
and never in this repo.

**CIPP.** CIPP picks up every `.json` file in the repo. The Graph bodies here have no
`Displayname` and therefore become one nameless template row, just like the other non-policy files
(see the [main README](../README.en.md#restoring-into-a-tenant)); it does nothing and can be removed in CIPP.
