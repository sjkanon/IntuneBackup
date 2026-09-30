[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Apple ADE Enrollment Profiles

**Generated** from `extras/macos/enrollment/` — do not edit by hand.

`Start-IntuneRestoreConfig` skips this folder: IntuneBackupAndRestore has no restore
function for Apple ADE enrolment profiles, and CIPP does not know them either. They travel
along here because a tenant you rebuild from this export does need them — a Mac that
syncs from Apple Business without an enrolment profile fails enrolment.

Restoring is done per profile, with the ABM token:

```powershell
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName <TOKEN> -Path '.\Apple ADE Enrollment Profiles\macos\macOS-Corporate-ADE-Baseline.json' -WhatIf
```

Remove `-WhatIf` once it is correct. Assigning remains manual work in the portal (Enrollment
program tokens → token → Devices), and that is deliberate: a profile on the wrong
serial numbers produces Macs that cannot be reverted without a wipe.

See `extras/macos/enrollment/README.en.md` in the repo for what the profile contains and why.
