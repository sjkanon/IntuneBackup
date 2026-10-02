<#
    Detection script for the Win32 app "Remove pre-installed McAfee".

    Exit 0 + output on stdout = found, so still present -> Intune sees the app as
    "not installed" and runs the installation (read: the removal).
    Exit 1 without output      = nothing found any more -> done.

    Why look in several places: MCPR regularly leaves a half-removed state behind in which the
    services are gone but the registration remains. Looking at only a folder or only a service
    therefore says nothing. The 32-bit registry view is listed separately because part of the
    McAfee installations register there, even on a 64-bit system.
#>

$Sporen = @()

$RegistryPaden = @(
    'HKLM:\SOFTWARE\McAfee',
    'HKLM:\SOFTWARE\WOW6432Node\McAfee',
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall'
)

foreach ($Pad in $RegistryPaden) {
    if (-not (Test-Path $Pad)) { continue }
    if ($Pad -like '*\Uninstall') {
        $Treffers = Get-ChildItem $Pad -ErrorAction SilentlyContinue |
            ForEach-Object { $_ | Get-ItemProperty -ErrorAction SilentlyContinue } |
            Where-Object { $_.DisplayName -match 'McAfee|WebAdvisor' }
        foreach ($T in $Treffers) { $Sporen += "Uninstall: $($T.DisplayName)" }
    } else {
        $Sporen += "Registry key: $Pad"
    }
}

foreach ($Map in @("${env:ProgramFiles}\McAfee", "${env:ProgramFiles(x86)}\McAfee", "$env:ProgramData\McAfee")) {
    if (Test-Path $Map) { $Sporen += "Folder: $Map" }
}

foreach ($Dienst in (Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^mc|McAfee' })) {
    $Sporen += "Service: $($Dienst.Name)"
}

if ($Sporen.Count -gt 0) {
    Write-Output ($Sporen -join '; ')
    exit 0
}
exit 1
