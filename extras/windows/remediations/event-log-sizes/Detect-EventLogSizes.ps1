<#
.SYNOPSIS
    Intune remediation (detection): are the operational security event logs at least the desired size?
.NOTES
    Exit 0 = all channels large enough · exit 1 = remediation needed. Keep $Channels identical to the remediation script.
#>
$Channels = [ordered]@{
    'Microsoft-Windows-PowerShell/Operational'       = 256MB
    'Microsoft-Windows-Windows Defender/Operational' = 64MB
    'Microsoft-Windows-CodeIntegrity/Operational'    = 64MB
}

$tooSmall = foreach ($name in $Channels.Keys) {
    $log = Get-WinEvent -ListLog $name -ErrorAction SilentlyContinue
    if (-not $log) { continue }  # channel does not exist on this device
    if ($log.MaximumSizeInBytes -lt $Channels[$name]) { "$name = $([math]::Round($log.MaximumSizeInBytes / 1MB)) MB" }
}

if ($tooSmall) {
    Write-Output "Too small: $($tooSmall -join '; ')"
    exit 1
}
Write-Output 'All event logs have the desired size.'
exit 0
