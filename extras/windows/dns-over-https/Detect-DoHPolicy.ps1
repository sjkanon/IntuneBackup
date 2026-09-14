<#
.SYNOPSIS
    Intune-remediation (detectie): staat DNS over HTTPS van Windows op de gewenste modus?
.NOTES
    2 = DoH toestaan (baseline, fase 2) · 3 = DoH vereisen (alternatief, fase 5).
    Exit 0 = in orde, exit 1 = herstel nodig.
#>
$Expected = 2

$key = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient'
try {
    $current = (Get-ItemProperty -Path $key -Name DoHPolicy -ErrorAction Stop).DoHPolicy
} catch {
    $current = $null
}

if ($current -eq $Expected) {
    Write-Output "DoHPolicy = $current (verwacht $Expected)"
    exit 0
}
Write-Output "DoHPolicy = $(if ($null -eq $current) { 'niet gezet' } else { $current }) (verwacht $Expected)"
exit 1
