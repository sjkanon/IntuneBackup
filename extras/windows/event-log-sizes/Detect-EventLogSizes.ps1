<#
.SYNOPSIS
    Intune-remediation (detectie): hebben de operationele beveiligingslogboeken minstens de gewenste grootte?
.NOTES
    Exit 0 = alle kanalen groot genoeg · exit 1 = herstel nodig. Houd $Channels gelijk aan het herstelscript.
#>
$Channels = [ordered]@{
    'Microsoft-Windows-PowerShell/Operational'       = 256MB
    'Microsoft-Windows-Windows Defender/Operational' = 64MB
    'Microsoft-Windows-CodeIntegrity/Operational'    = 64MB
}

$tooSmall = foreach ($name in $Channels.Keys) {
    $log = Get-WinEvent -ListLog $name -ErrorAction SilentlyContinue
    if (-not $log) { continue }  # kanaal bestaat niet op dit apparaat
    if ($log.MaximumSizeInBytes -lt $Channels[$name]) { "$name = $([math]::Round($log.MaximumSizeInBytes / 1MB)) MB" }
}

if ($tooSmall) {
    Write-Output "Te klein: $($tooSmall -join '; ')"
    exit 1
}
Write-Output 'Alle logboeken hebben de gewenste grootte.'
exit 0
