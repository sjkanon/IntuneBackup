<#
.SYNOPSIS
    Intune Win32 install script for Winget-AutoUpdate, for the CIPP application template.
.DESCRIPTION
    CIPP's custom application (Win32 script app) uploads a placeholder package and runs this
    script as the installer, so the script fetches WAU.msi itself: the pinned release, checked
    against its SHA-256 before it runs as SYSTEM. WAU.msi is not Authenticode-signed; the hash
    is the only check that the file is the published release.
    The MSI picks up excluded_apps.txt from its own folder, so the list is written next to it.
    Version, hash and product code match New-WAUPackage.ps1, and the list matches
    excluded_apps.txt — scripts/generate-app-templates.js refuses to build the template otherwise.
.NOTES
    No percent-sign variables in this file: CIPP replaces those per tenant before upload.
#>
$ErrorActionPreference = 'Stop'

# Pinned release. A new version changes all three together, deliberately.
$Version = 'v2.12.0'
$Sha256 = 'f5ab2303fdf82fbfcb2248cca4f96479fe17d74584a528b0f86b3dbe9f9e9718'

$ExcludedApps = @'
Brave.Brave*
Google.Chrome*
Microsoft.Edge*
Microsoft.Office
Microsoft.OneDrive
Microsoft.RemoteDesktopClient
Microsoft.Teams*
Mozilla.Firefox*
Opera.Opera*
TeamViewer.TeamViewer*
Romanitho.Winget-AutoUpdate
KnifMelti.WAU-Settings-GUI
'@

$MsiProperties = @(
    'RUN_WAU=NO'
    'USERCONTEXT=1'
    'UPDATESATLOGON=1'
    'UPDATESINTERVAL=Daily'
    'UPDATESATTIME=11:00:00'
    'UPDATESATTIMEDELAY=02:00'
    'NOTIFICATIONLEVEL=SuccessOnly'
    'DONOTRUNONMETERED=1'
    'DISABLEWAUAUTOUPDATE=1'
)

# The IME log folder comes along with Collect diagnostics in Intune.
$LogFolder = Join-Path $env:ProgramData 'Microsoft\IntuneManagementExtension\Logs'
$MsiLog = Join-Path $LogFolder 'WAU-install.log'

$Staging = Join-Path ([IO.Path]::GetTempPath()) "WAU-$([guid]::NewGuid())"
New-Item -ItemType Directory -Force -Path $Staging | Out-Null
try {
    $Msi = Join-Path $Staging 'WAU.msi'
    $Url = "https://github.com/Romanitho/Winget-AutoUpdate/releases/download/$Version/WAU.msi"
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
    Write-Output "Downloading $Url"
    Invoke-WebRequest -Uri $Url -OutFile $Msi -UseBasicParsing

    $Actual = (Get-FileHash -Path $Msi -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($Actual -ne $Sha256) {
        Write-Output "SHA-256 mismatch for WAU.msi ${Version}: expected $Sha256, got $Actual"
        exit 1
    }

    # Written without BOM, one entry per line, as WAU reads it.
    [IO.File]::WriteAllText((Join-Path $Staging 'excluded_apps.txt'), ($ExcludedApps.Trim() -replace "`r`n", "`n") + "`n")

    $Arguments = @('/i', "`"$Msi`"", '/qn', '/L*v', "`"$MsiLog`"") + $MsiProperties
    $Process = Start-Process -FilePath 'msiexec.exe' -ArgumentList $Arguments -Wait -PassThru
    Write-Output "msiexec exit code $($Process.ExitCode); log in $MsiLog"
    exit $Process.ExitCode
} catch {
    Write-Output "Installing Winget-AutoUpdate failed: $($_.Exception.Message)"
    exit 1
} finally {
    Remove-Item -Path $Staging -Recurse -Force -ErrorAction SilentlyContinue
}
