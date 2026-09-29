<#
    Removes pre-installed McAfee with MCPR, McAfee's official removal tool.

    Three things this script does on purpose:

    1. MCPR runs several times. Each round releases file locks that were still in the way of the
       previous round, so the next round gets further. Running it once almost always leaves
       remnants behind.
    2. A non-zero exit code from MCPR is not an error. "Incomplete uninstallation" means the
       removal has been deferred until the restart via PendingFileRenameOperations. So this
       script does not stop on it.
    3. The restart is the last step of the removal, not an afterthought. In Intune, set this
       app's "Device restart behavior" to *Intune will force a mandatory device restart*.
       Without that restart the device stays in a half-removed state.

    Logs to C:\Windows\Logs\Baseline\remove-mcafee.log.
#>

$LogMap = 'C:\Windows\Logs\Baseline'
$Log = Join-Path $LogMap 'remove-mcafee.log'
if (-not (Test-Path $LogMap)) { New-Item -ItemType Directory -Path $LogMap -Force | Out-Null }
function Schrijf($Tekst) {
    $Regel = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $Tekst"
    Add-Content -Path $Log -Value $Regel
    Write-Output $Regel
}

Schrijf '--- start'

$Mcpr = Join-Path $PSScriptRoot 'MCPR.exe'
if (-not (Test-Path $Mcpr)) {
    Schrijf "ERROR: MCPR.exe is not next to this script. Get it from McAfee and package it along."
    exit 1
}

for ($Ronde = 1; $Ronde -le 3; $Ronde++) {
    Schrijf "MCPR round $Ronde"
    try {
        $Proces = Start-Process -FilePath $Mcpr -ArgumentList '/quiet', '/silent' -Wait -PassThru -ErrorAction Stop
        Schrijf "  exit code $($Proces.ExitCode)"
    } catch {
        Schrijf "  round $Ronde failed: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds 30
}

# Whatever MCPR leaves behind is removed here. Only folders and Appx packages; we do not touch
# the registry, because it also holds the bookkeeping of the deferred removal.
foreach ($Map in @("${env:ProgramFiles}\McAfee", "${env:ProgramFiles(x86)}\McAfee", "$env:ProgramData\McAfee")) {
    if (Test-Path $Map) {
        Schrijf "Cleaning up leftover folder: $Map"
        Remove-Item -Path $Map -Recurse -Force -ErrorAction SilentlyContinue
    }
}

foreach ($Pakket in (Get-AppxPackage -AllUsers | Where-Object { $_.Name -match 'McAfee' })) {
    Schrijf "Removing Appx: $($Pakket.Name)"
    Remove-AppxPackage -Package $Pakket.PackageFullName -AllUsers -ErrorAction SilentlyContinue
}
foreach ($Provisioned in (Get-AppxProvisionedPackage -Online | Where-Object { $_.DisplayName -match 'McAfee' })) {
    Schrijf "Removing Appx provisioning: $($Provisioned.DisplayName)"
    Remove-AppxProvisionedPackage -Online -PackageName $Provisioned.PackageName -ErrorAction SilentlyContinue
}

Schrijf '--- done; the restart completes the removal'
exit 0
