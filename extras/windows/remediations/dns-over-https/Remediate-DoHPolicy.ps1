<#
.SYNOPSIS
    Intune remediation (remediate): sets Windows DNS over HTTPS to allow or require.
.NOTES
    Allow   -> DoHPolicy 2: DoH when the configured DNS server is a known DoH server, classic DNS otherwise.
    Require -> DoHPolicy 3: no name resolution without DoH. Only with your own DoH resolver that resolves
               internal names and whose template has been rolled out beforehand with `netsh dns add encryption`.
#>
$Mode = 'Allow'   # 'Allow' (phase 2) or 'Require' (phase 5)

$value = switch ($Mode) {
    'Allow'   { 2 }
    'Require' { 3 }
    default   { Write-Output "Unknown mode '$Mode'"; exit 1 }
}

$key = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient'
try {
    if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }
    New-ItemProperty -Path $key -Name DoHPolicy -PropertyType DWord -Value $value -Force | Out-Null
    # The DNS client reads the policy at startup; Dnscache cannot always be restarted, in which case it applies after a reboot.
    try { Restart-Service -Name Dnscache -Force -ErrorAction Stop } catch { Write-Output 'Dnscache not restarted; applies after the next reboot.' }
    Write-Output "DoHPolicy set to $value ($Mode)"
    exit 0
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    exit 1
}
