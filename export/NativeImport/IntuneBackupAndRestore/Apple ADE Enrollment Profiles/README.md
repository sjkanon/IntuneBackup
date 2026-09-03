# Apple ADE Enrollment Profiles

**Gegenereerd** uit `enrollment/` — niet met de hand bijwerken.

`Start-IntuneRestoreConfig` slaat deze map over: IntuneBackupAndRestore kent geen
restore-functie voor Apple ADE-enrollmentprofielen, en CIPP kent ze ook niet. Ze reizen
hier mee omdat een tenant die je uit deze export opnieuw inricht ze wél nodig heeft — een
Mac die zonder enrollmentprofiel uit Apple Business synct, faalt in de enrollment.

Terugzetten gaat per profiel, met het ABM-token erbij:

```powershell
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName <TOKEN> -Path '.\Apple ADE Enrollment Profiles\macos\ITCE-macOS-Corporate-ADE-Baseline.json' -WhatIf
```

Haal `-WhatIf` weg als het klopt. Toewijzen blijft handwerk in de portal (Enrollment
program tokens → token → Devices), en dat is bewust: een profiel op de verkeerde
serienummers levert Macs op die zonder wipe niet terug te draaien zijn.

Zie `enrollment/macos/README.md` in de repo voor wat er in het profiel staat en waarom.
