<#
.SYNOPSIS
Maps an Azure Files share as a network drive using the signed-in user's Entra Kerberos
ticket.

.DESCRIPTION
The Windows equivalent of mount-azure-files.sh on the Mac, and the replacement for the drive
maps from Group Policy Preferences.

Why a script and not a policy: there is none. All 18,329 settingDefinitionIds in the settings
catalog were searched for anything that maps a network drive — it does not exist.
`..._userprofiles_user_home_drive_letter` is about the home drive from AD, not about a mapping
you choose yourself, and GPP Drive Maps is not an ADMX, so it cannot be ingested either.

Why this script only needs to run once: `New-PSDrive -Persist` writes the mapping to
`HKCU\Network`, and Windows restores persistent mappings at every sign-in. An Intune platform
script runs once per user per device, and that is enough here. If the user removes the mapping
afterwards, it does not come back — that is a choice, not a shortcoming, the same line as with
configure-dock.sh. If you do want it to come back, this script is the wrong tool and it becomes
a remediation (detect + remediate, with its own schedule).

No -Credential is passed on purpose: the Kerberos ticket does the work. If a sign-in prompt
appears anyway, that is the symptom — see the README next to this file.

Requirements outside the scope of this script:
  - Kerberos/CloudKerberosTicketRetrievalEnabled = 1. Already in the baseline, via
    CXNM - Standard - WIN - D - Windows Hello Cloud Kerberos Trust, on all devices.
  - The device is Entra joined or Entra hybrid joined.
  - The WinHttpAutoProxySvc and iphlpsvc services are running. The baseline does not disable
    them — the only services CXNM - Standard - WIN - D - Security Hardening disables are the four
    Xbox services.
  - Entra Kerberos enabled on the storage account, admin consent granted, MFA excluded for the
    storage account's Entra app, and share-level permissions on the same group this script is
    assigned to.

.NOTES
In Intune: Devices → Scripts and remediations → Platform scripts → Add → Windows 10 and later.

  Run this script using the logged on credentials   Yes   a network drive belongs to a user
                                                          profile; as SYSTEM it ends up
                                                          nowhere
  Enforce script signature check                    No
  Run script in 64 bit PowerShell Host              Yes

Assign to a user group, not to devices.
#>

# --- The share -----------------------------------------------------------------------------
#
# \\<account>.file.core.windows.net\<share>\<subfolder>, in separate fields. SMB has only one
# share level: `<share>` is the share, `<subfolder>` is a folder inside it. That distinction is
# not cosmetic — the connection and the share-level permissions belong to the share, the
# subfolder is only the point where the drive starts.
#
# Leaving $ShareSubPath empty maps the whole share.
#
# These four are deliberately plain text in this file and not CIPP tokens: a platform script
# does not pass through Get-CIPPTextReplacement — that only works on the templates in
# IntuneTemplate/. What is here is what runs on the device.

$StorageAccount = 'STORAGE-ACCOUNT-INVULLEN'
$ShareName      = 'SHARE-NAAM-INVULLEN'
$ShareSubPath   = ''
$DriveLetter    = 'Z'

# --- Do not change anything below this line ------------------------------------------------

$ErrorActionPreference = 'Stop'

$stateDir = Join-Path $env:LOCALAPPDATA 'Baseline'
$log      = Join-Path $stateDir 'mount-azurefiles.log'
$server   = "$StorageAccount.file.core.windows.net"
$root     = "\\$server\$ShareName"
if ($ShareSubPath) { $root = Join-Path $root $ShareSubPath }

if (-not (Test-Path $stateDir)) { New-Item -ItemType Directory -Path $stateDir -Force | Out-Null }

function Write-Log {
    param([string]$Message)
    "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message | Add-Content -Path $log -Encoding UTF8
}

if ($StorageAccount -eq 'STORAGE-ACCOUNT-INVULLEN' -or $ShareName -eq 'SHARE-NAAM-INVULLEN') {
    Write-Log 'Storage account or share is still set to the placeholder - nothing done.'
    exit 1
}

# Already mapped correctly? Then there is nothing to do. If the letter points to something
# else, that is a deliberate mapping by someone else and it stays: pulling an existing drive
# out from under the user is worse than not mapping this one.
$existing = Get-PSDrive -Name $DriveLetter -PSProvider FileSystem -ErrorAction SilentlyContinue
if ($existing) {
    $current = $existing.DisplayRoot
    if ($current -eq $root) {
        Write-Log "Drive ${DriveLetter}: already points to $root."
        exit 0
    }
    Write-Log "Drive ${DriveLetter}: is in use by $current - left untouched."
    exit 1
}

# Port 445 is blocked by many providers. Without this test, the error from New-PSDrive is a
# generic network error and the helpdesk looks in the wrong place.
$tcp = New-Object System.Net.Sockets.TcpClient
try {
    $connect = $tcp.BeginConnect($server, 445, $null, $null)
    if (-not $connect.AsyncWaitHandle.WaitOne(5000, $false)) {
        Write-Log "Port 445 on $server is not reachable within 5 seconds - probably blocked by the network."
        exit 1
    }
    $tcp.EndConnect($connect)
}
catch {
    Write-Log "Port 445 on $server is not reachable: $($_.Exception.Message)"
    exit 1
}
finally {
    $tcp.Close()
}

try {
    New-PSDrive -Name $DriveLetter -PSProvider FileSystem -Root $root -Persist -Scope Global | Out-Null
    Write-Log "Mapped: ${DriveLetter}: to $root"
    exit 0
}
catch {
    Write-Log "Mapping failed: $($_.Exception.Message)"
    exit 1
}
