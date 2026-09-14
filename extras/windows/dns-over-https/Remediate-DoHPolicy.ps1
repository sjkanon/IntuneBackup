<#
.SYNOPSIS
    Intune-remediation (herstel): zet DNS over HTTPS van Windows op toestaan of vereisen.
.NOTES
    Allow   -> DoHPolicy 2: DoH wanneer de ingestelde DNS-server een bekende DoH-server is, anders klassiek.
    Require -> DoHPolicy 3: geen naamresolutie zonder DoH. Alleen met een eigen DoH-resolver die interne
               namen oplost en waarvan de template vooraf met `netsh dns add encryption` is uitgerold.
#>
$Mode = 'Allow'   # 'Allow' (fase 2) of 'Require' (fase 5)

$value = switch ($Mode) {
    'Allow'   { 2 }
    'Require' { 3 }
    default   { Write-Output "Onbekende modus '$Mode'"; exit 1 }
}

$key = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient'
try {
    if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }
    New-ItemProperty -Path $key -Name DoHPolicy -PropertyType DWord -Value $value -Force | Out-Null
    # De DNS-client leest de policy bij het starten; Dnscache is niet altijd te herstarten, dan geldt het na een herstart.
    try { Restart-Service -Name Dnscache -Force -ErrorAction Stop } catch { Write-Output 'Dnscache niet herstart; geldt na de volgende herstart.' }
    Write-Output "DoHPolicy op $value gezet ($Mode)"
    exit 0
} catch {
    Write-Output "Fout: $($_.Exception.Message)"
    exit 1
}
