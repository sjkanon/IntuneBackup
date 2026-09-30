[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Windows platform scripts

Intune platform scripts (`deviceManagementScripts`) live **outside** `IntuneTemplate/`, for
the same reason as the [macOS shell scripts](../../macos/shell-scripts/README.en.md): the pipelines
there know five CIPP policy types and a platform script is none of those five. It hangs under
`deviceManagement/deviceManagementScripts`, `Set-CIPPIntunePolicy` has no `TemplateType` for
it, and `Start-IntuneRestoreConfig` does not restore it. So a file here is **not** picked up by
CIPP, `export-intunebackup.js`, `check-scope.js` or `Set-BaselineAssignment.ps1`.

The folder is called `platform-scripts/` and not `shell-scripts/` because that is what Intune
itself calls them: on Windows they are under *Scripts and remediations → Platform scripts*, on
macOS under *macOS → Shell scripts*. Two names for the same idea, but this way anyone searching
the portal finds them again.

| File | What it does | Scope |
|---|---|---|
| `Mount-AzureFilesDrive.ps1` | Maps `\\<account>.file.core.windows.net\<share>\<submap>` as `Z:` using the Entra Kerberos ticket | User |

## Mount-AzureFilesDrive.ps1

The Windows equivalent of [`mount-azure-files.sh`](../../macos/shell-scripts/README.en.md) on the
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
| `Kerberos/CloudKerberosTicketRetrievalEnabled` = 1 | **already in the baseline** — [`Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust`](../../../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.en.md), all devices |
| Device is Entra joined or Entra hybrid joined | enrolment |
| `WinHttpAutoProxySvc` and `iphlpsvc` are running | **not disabled by the baseline** — the only services `Security Hardening` disables are the four Xbox services |
| Entra Kerberos enabled on the storage account, admin consent, cloud-only group support, MFA excluded for the Entra app, share-level permissions | Azure portal — the steps are written out once for the macOS counterpart, under [The Azure side](../../macos/shell-scripts/README.en.md#the-azure-side-a-second-storage-account-with-entra-kerberos). They apply to Windows unchanged. |

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

---

Back to the [main README](../../README.en.md).
