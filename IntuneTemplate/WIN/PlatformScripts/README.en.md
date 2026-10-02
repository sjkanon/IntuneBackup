[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Windows platform scripts

Intune platform scripts (`deviceManagementScripts`) are, like the
[macOS shell scripts](../../MAC/PlatformScripts/README.en.md), none of the five CIPP policy types. A
platform script hangs under `deviceManagement/deviceManagementScripts`, `Set-CIPPIntunePolicy` has no
`TemplateType` for it, and `Start-IntuneRestoreConfig` does not restore it. So a file here is
**not** picked up by CIPP, `export-intunebackup.js`, `check-scope.js` or `Set-BaselineAssignment.ps1`.

The folder is called `PlatformScripts/` because that is what Intune calls them on Windows
(*Scripts and remediations → Platform scripts*). On macOS the portal calls them *Shell scripts*; they
live in [`MAC/PlatformScripts/`](../../MAC/PlatformScripts/README.en.md), so both platforms share the same layout.

| File | What it does | Scope |
|---|---|---|
| `Mount-AzureFilesDrive.ps1` | Maps `\\<account>.file.core.windows.net\<share>\<submap>` as `Z:` using the Entra Kerberos ticket | User |
| `Enable-AutoTimezone.ps1` | Turns on location services and *Set time zone automatically* — from OpenIntuneBaseline | Device |
| `Trigger-PostOOBEUpdates.ps1` | Right after Autopilot, starts an update of Defender definitions, Store apps and Windows Update — from OpenIntuneBaseline | User (runs as SYSTEM) |

## Mount-AzureFilesDrive.ps1

The Windows equivalent of [`mount-azure-files.sh`](../../MAC/PlatformScripts/README.en.md) on the
Mac, and the replacement for the drive maps from Group Policy Preferences.

### Why a script and not a policy

There is no drive-mapping policy. All 18,329 `settingDefinitionId`s of the settings catalog
were searched for anything that maps a network drive; it does not exist, on either
platform. What looks like it and is not:

| What you find | What it actually does |
|---|---|
| `..._userprofiles_user_home_drive_letter` | the home drive from AD, not a mapping you choose yourself |
| `..._terminalserver_ts_user_home_ts_drive_letter` | the same, but for a Terminal Server session |

Group Policy Preferences → Drive Maps is not ADMX and therefore cannot be brought into Intune
with ADMX ingestion either. A mapping is an action, not a setting, and therefore a script.

### Settings in Intune

Devices → Scripts and remediations → Platform scripts → Add → Windows 10 and later.

| Setting | Value | Why |
|---|---|---|
| Run this script using the logged on credentials | **Yes** | a network drive belongs to a user profile; as SYSTEM it lands nowhere |
| Enforce script signature check | No | |
| Run script in 64 bit PowerShell Host | Yes | |

Assign to a **user group**, not to devices: who may access the share is a property of the user,
and the share-level permissions in Azure are set on the same group.

### One run is enough

A platform script runs once per user per device, and that is sufficient here:
`New-PSDrive -Persist` writes the mapping to `HKCU\Network` and Windows restores persistent
mappings at every sign-in.

If the user removes the drive themselves afterwards, it does not come back. That is a choice and
not a shortcoming — the same line as with `configure-dock.sh`, where the Dock belongs to the user
after the initial setup. If the mapping must restore itself, this script is the wrong tool:
that becomes a **remediation** (a detection script plus a remediation script, with its own
schedule). Those require Windows Enterprise E3/E5 or Intune Plan 2.

If the chosen letter is already taken by something else, the script leaves it alone and stops
with exit 1. Pulling an existing drive out from under the user is worse than not mapping
this one.

### Share and subfolder are not the same thing

`\\<account>.file.core.windows.net\<share>\<submap>` appears in the script as three fields:
`$ShareName` is the **share**, `$ShareSubPath` a **folder inside it**. SMB has only one
share layer, and the distinction is not cosmetic — the connection and the share-level permissions
in Azure are tied to the share; the subfolder is only the point where the drive starts. Anyone
who may only access one subfolder should get that through NTFS permissions on the folder, not by
entering a different value here.

Leaving `$ShareSubPath` empty maps the whole share.

### What has to be in place outside this script

| Prerequisite | Where |
|---|---|
| `Kerberos/CloudKerberosTicketRetrievalEnabled` = 1 | **already in the baseline** — [`Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust`](../SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.en.md), all devices |
| Device is Entra joined or Entra hybrid joined | enrolment |
| `WinHttpAutoProxySvc` and `iphlpsvc` are running | **not disabled by the baseline** — the only services `Security Hardening` disables are the four Xbox services |
| Entra Kerberos enabled on the storage account, admin consent, cloud-only group support, MFA excluded for the Entra app, share-level permissions | Azure portal — the steps are written out once for the macOS counterpart, under [The Azure side](../../MAC/PlatformScripts/README.en.md#the-azure-side-a-second-storage-account-with-entra-kerberos). They apply to Windows unchanged. |

Cloud-only identities additionally require Windows 11 24H2 or later with the cumulative update
of March 2026 (KB5079391 / KB5079489); hybrid identities work from Windows 10 2004.

`HostToRealm` is **not** needed here. That mapping only exists for the case where a device
must also reach storage accounts joined to on-premises AD DS; if that is not the case, it stays out.

### If a sign-in prompt appears anyway

Then the ticket is the problem, not the mapping. In order of likelihood:

1. MFA is not excluded for the storage account's Entra app. The symptom is
   `System error 1327` on `net use`.
2. The user has no share-level permission on the share.
3. Admin consent on the storage account's service principal is missing.
4. The device does not have the policy yet: `CloudKerberosTicketRetrievalEnabled` needs a
   policy refresh or a restart.

`klist cloud_debug` shows whether the device can obtain a cloud TGT; `klist` shows whether there
is a ticket for `KERBEROS.MICROSOFTONLINE.COM` in the cache.

### Logging

`%LOCALAPPDATA%\Baseline\mount-azurefiles.log`, the same location and format as the macOS side.

## Enable-AutoTimezone.ps1

From OpenIntuneBaseline (`WINDOWS/Scripts/Enable-AutoTimezone.ps1`, v1.1), taken over
unchanged; licence GPL-3.0, the author line is in the script header.

It belongs with [`Baseline_WIN_D_Timezone`](../SettingsCatalog/Baseline_WIN_D_Timezone.en.md).
That policy syncs the clock over NTP and lets users change the time zone, but does not turn on
*Set time zone automatically*: the settings catalog has no setting for it. A laptop that travels
from Amsterdam to Lisbon then stays on Amsterdam time until the user notices — and without admin
rights that does not always work since 24H2 (OIB points to the known issue in Windows release
health).

What the script sets, in `HKLM`:

| Key | Value | Effect |
|---|---|---|
| `…\CapabilityAccessManager\ConsentStore\location` `Value` | `Allow` | location services on for the device |
| `SYSTEM\CurrentControlSet\Services\tzautoupdate` `Start` | `3` | the automatic time zone service may start |
| `…\Services\lfsvc\Service\Configuration` `Status` | `1` | the geolocation service on; then (re)started |
| `…\Sensor\Overrides\{BFA794E4-…}` `SensorPermissionState` | `1` | the location sensor on |

**Does not clash with the baseline.** [`Location and Privacy`](../SettingsCatalog/Baseline_WIN_D_Location_and_Privacy.en.md)
allows location and leaves the per-app choice to the user (`LetAppsAccessLocation` = 0);
this script only turns on the device-wide switch, so Windows itself can determine the time
zone. Which app gets the location remains the user's decision.

| Setting in Intune | Value |
|---|---|
| Run this script using the logged on credentials | No |
| Enforce script signature check | No |
| Run script in 64 bit PowerShell Host | Yes |

Assign to **all devices** — phase 1, like the Timezone policy. A platform script runs once;
if a user turns location off afterwards, it stays off.

Log: `%ProgramData%\Microsoft\IntuneManagementExtension\Logs\OIB-AutoTimezone.log`.

## Trigger-PostOOBEUpdates.ps1

From OpenIntuneBaseline (`WINDOWS/Scripts/Trigger-PosstOOBEUpdates.ps1`, v1), taken over
unchanged except for the file name: the typo *Posst* is gone. Licence GPL-3.0.

A device that has just come out of Autopilot has the definitions and Store apps from the day
the image was made. Windows fetches them by itself, but in its own time — sometimes a day
later. This script starts all three right away, one after the other:

1. `Update-MpSignature` — Defender definitions;
2. `UpdateScanMethod` on `MDM_EnterpriseModernAppManagement_AppManagement01` — Store apps;
3. `USOClient.exe StartInteractiveScan` — a Windows Update scan, with the settings from the
   device's update ring.

| Setting in Intune | Value |
|---|---|
| Run this script using the logged on credentials | **No** — it has to run as SYSTEM |
| Enforce script signature check | No |
| Run script in 64 bit PowerShell Host | Yes |

Assign to a **user group**, as OIB prescribes. Assigned to devices it would already run during
the device phase of the Enrollment Status Page, before the apps are there; through the user it
only runs at the first sign-in, and then as SYSTEM because *logged on credentials* is off.
After that once per user per device; a second run does no harm. It belongs to the Autopilot
setup and follows that phase.

Log: `%ProgramData%\Microsoft\IntuneManagementExtension\Logs\OIB-PostOOBEUpdates.log.log`
— the double extension is how the original has it.

---

Back to the [main README](../../README.en.md).
