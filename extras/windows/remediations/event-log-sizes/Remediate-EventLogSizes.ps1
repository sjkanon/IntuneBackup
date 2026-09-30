<#
.SYNOPSIS
    Intune remediation (remediate): enlarges the operational security event logs. Never shrinks them.
#>
$Channels = [ordered]@{
    'Microsoft-Windows-PowerShell/Operational'       = 256MB
    'Microsoft-Windows-Windows Defender/Operational' = 64MB
    'Microsoft-Windows-CodeIntegrity/Operational'    = 64MB
}

$failed = $false
foreach ($name in $Channels.Keys) {
    try {
        $log = Get-WinEvent -ListLog $name -ErrorAction Stop
        if ($log.MaximumSizeInBytes -lt $Channels[$name]) {
            $log.MaximumSizeInBytes = $Channels[$name]
            $log.SaveChanges()
            Write-Output "$name -> $([math]::Round($Channels[$name] / 1MB)) MB"
        }
    } catch {
        Write-Output "Error on ${name}: $($_.Exception.Message)"
        $failed = $true
    }
}
exit ([int]$failed)
