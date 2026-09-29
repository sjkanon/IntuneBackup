[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/

What belongs in a complete baseline but is none of the five CIPP policy types (`Catalog`,
`Admin`, `Device`, `deviceCompliancePolicies`, `AppProtection`). Nothing here is picked up by
`check-scope.js`, `generate-baseline.js`, `export-intunebackup.js` or `Set-BaselineAssignment.ps1`,
and there is no `checkId` for it. Each folder has its own README with the deployment route, prerequisites
and the standards the component covers.

Same approach as [`enrollment/macos/`](../enrollment/macos/README.en.md),
[`compliance/macos/`](../compliance/macos/README.en.md), [`shellscripts/macos/`](../shellscripts/macos/README.en.md)
and [`platformscripts/windows/`](../platformscripts/windows/README.en.md), which already lived outside
`IntuneTemplate/`.

| Folder | What it contains |
|---|---|
| [`android/`](android/README.en.md) | enrollment restriction (Android Enterprise, personal work profile), app configuration for Outlook, Edge and Defender low-touch onboarding, assignment filters for personal, corporate and dedicated |
| [`ios/`](ios/README.en.md) | Apple Business settings and dynamic groups, ADE enrollment profile (`depIOSEnrollmentProfile`), app configuration for Outlook, Edge and Defender |
| [`macos/`](macos/README.en.md) | Apple Business checklist, Defender for Endpoint onboarding per tenant, enrollment restriction for personal Macs, Escrow Buddy for FileVault escrow of already encrypted Macs |
| [`windows/`](windows/README.en.md) | App Control for Business (audit and enforce, with a script for the tenant template ids and hunting queries), DNS over HTTPS for Windows itself, event log sizes, remediations that check BitLocker and LAPS escrow |

**Placeholders.** Everything that differs per organisation is shown as `…-INVULLEN` (app ids, VPP token,
resolver, service desk number). Fill these in on a copy outside git — see `local/` in `.gitignore` —
and never in this repo.

**CIPP.** CIPP picks up every `.json` file in the repo. The Graph bodies here have no
`Displayname` and therefore become one nameless template row, just like the other non-policy files
(see the main README); it does nothing and can be removed in CIPP.
