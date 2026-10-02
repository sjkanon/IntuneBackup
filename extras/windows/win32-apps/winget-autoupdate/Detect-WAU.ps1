<#
.SYNOPSIS
    Intune Win32 app detection: is Winget-AutoUpdate installed and scheduled?
.NOTES
    Deliberately not version-based: a version check would reinstall on every WAU version change
    and fight the supersedence chain. A new WAU version is a new Win32 app with supersedence.
    Intune: detected = exit 0 *with* output; not detected = exit 1 without output.
#>
$key = 'HKLM:\SOFTWARE\Romanitho\Winget-AutoUpdate'
try {
    $config = Get-ItemProperty -Path $key -ErrorAction Stop
} catch {
    exit 1
}

$script = Join-Path $config.InstallLocation 'Winget-Upgrade.ps1'
$task = Get-ScheduledTask -TaskPath '\WAU\' -TaskName 'Winget-AutoUpdate' -ErrorAction SilentlyContinue

if ((Test-Path $script) -and $task) {
    Write-Output "Winget-AutoUpdate $($config.ProductVersion) installed in $($config.InstallLocation)"
    exit 0
}
exit 1
