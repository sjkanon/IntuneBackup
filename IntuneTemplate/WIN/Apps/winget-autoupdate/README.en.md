[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Winget-AutoUpdate

| | |
|---|---|
| **Controls** | ISO A.8.8 Management of technical vulnerabilities · NIS2 art. 21(2)(e) security in network and information systems acquisition, development and maintenance, including vulnerability handling · CIS Controls v8.1 7.4 Perform Automated Application Patch Management · NIST CSF 2.0 PR.PS-02 |
| **Phase** | 2 (pilot) |

Updates every application that winget knows, daily and without anyone having to package an
update: [Winget-AutoUpdate](https://github.com/Romanitho/Winget-AutoUpdate) (WAU, MIT licence)
as a Win32 app.

## Why this and not a policy

The baseline handles updates for Windows (update rings), Defender, Edge, Office and Chrome.
Everything else — 7-Zip, Notepad++, Adobe Reader, VLC, Zoom — is updated by no policy at all:
an Intune policy can configure winget, not run it. WAU is a scheduled task that runs
`winget upgrade`, as SYSTEM for machine installs and as the user for apps in the user profile.
The scripts live here in `IntuneTemplate/`; CIPP gets them as an application template in
[`AppTemplate/`](../../../../AppTemplate/README.en.md).

The alternative is **Intune Enterprise App Management** (Intune Suite or standalone add-on): a
Microsoft-managed catalogue with automatic updates and reporting in Intune. Whoever has that
licence uses it instead of WAU.

## The choices

| MSI property | Value | Why |
|---|---|---|
| `RUN_WAU` | `NO` | Not during Autopilot or the Enrollment Status Page; the first run is at first sign-in |
| `USERCONTEXT` | `1` | Also updates apps in the user profile (VS Code, Zoom, per-user add-ins) |
| `UPDATESATLOGON` | `1` | A device switched on in the morning is updated straight away |
| `UPDATESINTERVAL` / `UPDATESATTIME` / `UPDATESATTIMEDELAY` | `Daily` / `11:00:00` / `02:00` | Every day, at a time the device is on, spread until 13:00 so that not all devices download at once |
| `NOTIFICATIONLEVEL` | `SuccessOnly` | The user sees *what* was updated; they cannot fix an error message anyway |
| `DONOTRUNONMETERED` | `1` | Not over a shared mobile connection |
| `DISABLEWAUAUTOUPDATE` | `1` | See below |

**Why WAU does not update itself.** `WAU.msi` is not Authenticode-signed. With self-update on, WAU
fetches a new MSI from GitHub and runs it as SYSTEM without anyone having looked at it.
`New-WAUPackage.ps1` therefore pins a version with the SHA-256 from the GitHub release and refuses
a file that differs. A new WAU version is a deliberate step: change version and hash in the
script, repackage, and publish as a new Win32 app with supersedence (*Update*) on the previous one.

## What WAU does *not* update

[`excluded_apps.txt`](excluded_apps.txt) goes into the package. Note: that list **replaces** WAU's
default list, it does not add to it. It is therefore identical to the v2.12.0 default list, which
is also what this baseline needs:

| Excluded | Because |
|---|---|
| `Microsoft.Edge*`, `Google.Chrome*`, `Mozilla.Firefox*`, `Brave.Brave*`, `Opera.Opera*` | Browsers update themselves; for Edge and Chrome `Microsoft Edge Updates` and `Google Chrome Updates` enforce it, for Firefox [`firefox-policies/`](../../Remediations/firefox-policies/README.en.md) |
| `Microsoft.Office`, `Microsoft.Teams*`, `Microsoft.OneDrive` | Own update channel, driven by `Microsoft Office Updates` and the OneDrive and Teams policies |
| `Microsoft.RemoteDesktopClient`, `TeamViewer.TeamViewer*` | Own updater; an update in the middle of a session drops it |
| `Romanitho.Winget-AutoUpdate`, `KnifMelti.WAU-Settings-GUI` | WAU itself — see above |

An app an organisation wants to keep at a fixed version is added one per line (wildcards are
allowed: `Adobe.Acrobat*`). A list set through group policy under
`HKLM\SOFTWARE\Policies\Romanitho\Winget-AutoUpdate\BlackList` takes precedence over this file.

## Interplay with the baseline

- **Windows Package Manager** (phase 1) only turns off experimental features, hash override,
  local manifests and the `ms-appinstaller` protocol. The default `winget` source stays on, and
  that is what WAU uses. Restricting `EnableDefaultSource` or `AllowedSources` later stops WAU.
- **In-Box App Removal** leaves App Installer (`Microsoft.DesktopAppInstaller`, i.e. winget) alone.
- **App Control for Business** ([`app-control/`](../../EndpointSecurity/README.en.md)): WAU consists of
  unsigned PowerShell scripts running as SYSTEM. Not tested under the enforced variant; run the
  audit variant first and check the CodeIntegrity log for whether WAU or the installers it starts
  would be blocked.

## Deployment

### Through CIPP

[`AppTemplate/Winget-AutoUpdate.json`](../../../../AppTemplate/Winget-AutoUpdate.json) is a CIPP application template of the
type *Custom Application* (Win32 script app). CIPP uploads its own small placeholder package for
it and runs [`Install-WAU.ps1`](Install-WAU.ps1) as the installer: that fetches the pinned
`WAU.msi` from GitHub, checks the SHA-256, writes `excluded_apps.txt` next to it and installs
with the same MSI properties as below. Removal is [`Uninstall-WAU.ps1`](Uninstall-WAU.ps1),
detection [`Detect-WAU.ps1`](Detect-WAU.ps1). No `.intunewin` to build.

1. CIPP → **Tools → Community Repos** → this repo → `AppTemplate/Winget-AutoUpdate.json` → **Import**.
2. **Applications → Application Templates** → `CXNM - Standard - Winget-AutoUpdate` → **Deploy**:
   pick the tenants and, as assignment, the group `SEC-Baseline-Pilot` (the template itself
   assigns nothing). Or put it in a baseline with the standard *Deploy Intune Application Template*.

The device must be able to reach `github.com`; the MSI log is in `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\WAU-install.log`.

The template is generated from the scripts: `node scripts/generate-app-templates.js`. It refuses
when version, hash or product code in the scripts differ from `New-WAUPackage.ps1`, or the list in
`Install-WAU.ps1` from `excluded_apps.txt` — both routes install the same thing.

### By hand

1. Build the package — download, hash check and `.intunewin`:

   ```powershell
   .\New-WAUPackage.ps1 -IntuneWinAppUtil C:\Tools\IntuneWinAppUtil.exe
   ```

2. Intune → **Apps → Windows → Add → Windows app (Win32)**, with `WAU.intunewin`:

| Field | Value |
|---|---|
| Name | `CXNM - Standard - WIN - D - Winget-AutoUpdate` |
| Install command | `msiexec /i WAU.msi /qn RUN_WAU=NO USERCONTEXT=1 UPDATESATLOGON=1 UPDATESINTERVAL=Daily UPDATESATTIME=11:00:00 UPDATESATTIMEDELAY=02:00 NOTIFICATIONLEVEL=SuccessOnly DONOTRUNONMETERED=1 DISABLEWAUAUTOUPDATE=1` |
| Uninstall command | `msiexec /x {FB0EB14E-95AC-45D7-A951-432316FFCBD4} /qn` (v2.12.0; the script prints the code for another version) |
| Install behaviour | System |
| Device restart behaviour | No specific action |
| Operating system | 64-bit, Windows 10 22H2 or later |
| Detection rule | Custom script → [`Detect-WAU.ps1`](Detect-WAU.ps1) |
| Assignment | *Required* on the pilot group `SEC-Baseline-Pilot`, then all Windows devices |

The detection deliberately ignores the version: that would reinstall on every version change. It
checks for the registry key, `Winget-Upgrade.ps1` and the scheduled task `\WAU\Winget-AutoUpdate`.

## How to tell it works

- Log on the device: `C:\Program Files\Winget-AutoUpdate\logs\updates.log`, and as a symlink
  `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\WAU-updates.log` — the latter is
  included in *Collect diagnostics* in Intune.
- Settings: `HKLM\SOFTWARE\Romanitho\Winget-AutoUpdate`.
- Across the fleet: Defender Vulnerability Management → *Software inventory* — the number of
  devices with an outdated version of an app winget knows should drop within a few days.
