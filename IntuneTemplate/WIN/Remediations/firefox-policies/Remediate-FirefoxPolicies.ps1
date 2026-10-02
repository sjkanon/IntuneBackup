<#
.SYNOPSIS
    Intune remediation (remediate): sets the Firefox enterprise policies of the baseline.
.NOTES
    Firefox reads HKLM\SOFTWARE\Policies\Mozilla\Firefox at startup; a running Firefox picks the
    policies up after a restart. Values per https://mozilla.github.io/policy-templates/.
    $Policies and $BlockExtensions must be identical in Detect-FirefoxPolicies.ps1.
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
try {
    foreach ($p in $Policies) {
        $path = if ($p.Key) { Join-Path $root $p.Key } else { $root }
        if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null }
        $value = if ($p.Type -eq 'MultiString') { [string[]]@($p.Value) } else { $p.Value }
        New-ItemProperty -Path $path -Name $p.Name -PropertyType $p.Type -Value $value -Force | Out-Null
    }
    Write-Output "$($Policies.Count) Firefox policies set; applies at the next Firefox start"
    exit 0
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    exit 1
}
