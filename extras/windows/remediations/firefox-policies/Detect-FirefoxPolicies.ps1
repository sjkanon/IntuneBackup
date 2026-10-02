<#
.SYNOPSIS
    Intune remediation (detection): are the Firefox enterprise policies set as in the baseline?
.NOTES
    Firefox reads HKLM\SOFTWARE\Policies\Mozilla\Firefox itself — no ADMX import needed.
    $Policies and $BlockExtensions must be identical in Remediate-FirefoxPolicies.ps1.
    Exit 0 = compliant, exit 1 = remediation needed.
#>
$BlockExtensions = $false   # $true = phase 2 extension block, same as Google Chrome Extensions

$Policies = @(
    # Updates — the counterpart of Google Chrome Updates
    @{ Key = '';                      Name = 'DisableAppUpdate';       Type = 'DWord';       Value = 0 }
    @{ Key = '';                      Name = 'AppAutoUpdate';          Type = 'DWord';       Value = 1 }
    @{ Key = '';                      Name = 'BackgroundAppUpdate';    Type = 'DWord';       Value = 1 }
    # Security — the counterpart of Google Chrome Security
    @{ Key = 'DisableSecurityBypass'; Name = 'InvalidCertificate';     Type = 'DWord';       Value = 1 }
    @{ Key = 'DisableSecurityBypass'; Name = 'SafeBrowsing';           Type = 'DWord';       Value = 1 }
    @{ Key = 'DNSOverHTTPS';          Name = 'Enabled';                Type = 'DWord';       Value = 0 }
    @{ Key = 'DNSOverHTTPS';          Name = 'Locked';                 Type = 'DWord';       Value = 1 }
    @{ Key = '';                      Name = 'Preferences';            Type = 'MultiString'; Value = '{"network.http.http3.enable":{"Value":false,"Status":"locked"}}' }
    @{ Key = '';                      Name = 'PasswordManagerEnabled'; Type = 'DWord';       Value = 0 }
    @{ Key = '';                      Name = 'DisableFirefoxAccounts'; Type = 'DWord';       Value = 1 }
    @{ Key = '';                      Name = 'DisableTelemetry';       Type = 'DWord';       Value = 1 }
)
if ($BlockExtensions) {
    $Policies += @{ Key = ''; Name = 'ExtensionSettings'; Type = 'MultiString'; Value = '{"*":{"installation_mode":"blocked"}}' }
}

$root = 'HKLM:\SOFTWARE\Policies\Mozilla\Firefox'
$wrong = @()
foreach ($p in $Policies) {
    $path = if ($p.Key) { Join-Path $root $p.Key } else { $root }
    try {
        $current = (Get-ItemProperty -Path $path -Name $p.Name -ErrorAction Stop).($p.Name)
    } catch {
        $current = $null
    }
    # A REG_MULTI_SZ comes back as an array; Firefox joins the lines into one JSON text.
    if ($current -is [array]) { $current = $current -join "`n" }
    if ("$current" -ne "$($p.Value)") {
        $wrong += "$(if ($p.Key) { "$($p.Key)\" })$($p.Name) = $(if ($null -eq $current) { 'not set' } else { $current })"
    }
}

if ($wrong.Count -eq 0) {
    Write-Output "All $($Policies.Count) Firefox policies set"
    exit 0
}
Write-Output "$($wrong.Count) of $($Policies.Count) Firefox policies differ: $($wrong -join '; ')"
exit 1
