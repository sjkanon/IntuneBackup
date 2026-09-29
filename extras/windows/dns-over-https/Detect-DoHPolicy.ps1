<#
.SYNOPSIS
    Intune remediation (detection): is Windows DNS over HTTPS set to the desired mode?
.NOTES
    2 = allow DoH (baseline, phase 2) · 3 = require DoH (alternative, phase 5).
    Exit 0 = compliant, exit 1 = remediation needed.
#>
$Expected = 2

$key = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient'
try {
    $current = (Get-ItemProperty -Path $key -Name DoHPolicy -ErrorAction Stop).DoHPolicy
} catch {
    $current = $null
}

if ($current -eq $Expected) {
    Write-Output "DoHPolicy = $current (expected $Expected)"
    exit 0
}
Write-Output "DoHPolicy = $(if ($null -eq $current) { 'not set' } else { $current }) (expected $Expected)"
exit 1
