<#
    Detection script for the Win32 app "Office op het web".

    Exit 0 + output = installed in this version. Exit 1 without output = not (or an older
    version), so Intune runs Install-OfficeWeb.ps1. Raise $Version together with the one in
    Install-OfficeWeb.ps1 when the script changes, so devices get the new script.
#>

$Version = '1.0.1'
$Script = Join-Path $env:ProgramFiles 'OfficeWebOpen\Open-OfficeWeb.ps1'
$Installed = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\OfficeWebOpen' -Name Version -ErrorAction SilentlyContinue).Version
$Command = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\Classes\OfficeWeb.Word\shell\open\command' -ErrorAction SilentlyContinue).'(default)'

if ($Installed -eq $Version -and (Test-Path $Script) -and $Command -like "*$Script*") {
    Write-Output "Office op het web $Version"
    exit 0
}
exit 1
