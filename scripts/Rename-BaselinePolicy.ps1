#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Brings the policy names in a tenant in line with the current convention, according to IntuneTemplate/_renames.json.

.DESCRIPTION
The baseline has been renamed three times: first to "[Baseline] - D/U - Item", then to
"[Baseline] - PLATFORM - D/U - Item", then to "CXNM - Standard - PLATFORM - D/U - Item". In a
tenant a policy may therefore still sit under one of three old names. This script looks them up and renames them.

Renaming rather than redeploying: a PATCH leaves the policy id, the assignments and the
assignment history intact. Start-IntuneRestoreConfig creates policies by name and would put a
duplicate under the new name next to the old one — two policies with overlapping, possibly
conflicting settings on the same devices.

Three kinds of rules in _renames.json:

  rename   PATCH on the name. That is all this script does; you update the content afterwards
           via CIPP or Start-IntuneRestoreConfig.
  replace  The policy type itself changes (different endpoint or different templateReference).
           That cannot be a PATCH. The script reports it and touches nothing — the old policy
           has to go and the new one come in, in that order and with a check in between.
  retire   Goes away entirely; the settings now live in other policies. Here too only a
           report: deleting is irreversible and should be a deliberate act, not something a
           naming script does in passing.

Always run with -WhatIf first.

.PARAMETER WhatIf
Shows what would happen without changing anything.

.EXAMPLE
.\Rename-BaselinePolicy.ps1 -WhatIf
Mandatory first run: check that every old name is found exactly once.

.EXAMPLE
.\Rename-BaselinePolicy.ps1
#>
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'Medium')]
param(
    [ValidateSet('beta', 'v1.0')]
    [string]$ApiVersion = 'beta',

    [string]$RenamesPath
)

$ErrorActionPreference = 'Stop'

# Settings Catalog uses 'name', the rest 'displayName' — the same pitfall as in
# Set-BaselineAssignment.ps1: a PATCH on the wrong field produces no error, just a
# policy that has not been renamed.
$PolicyTypes = @(
    [pscustomobject]@{ Label = 'Settings Catalog';        Endpoint = 'deviceManagement/configurationPolicies';      NameField = 'name' }
    [pscustomobject]@{ Label = 'Administrative Template'; Endpoint = 'deviceManagement/groupPolicyConfigurations';  NameField = 'displayName' }
    [pscustomobject]@{ Label = 'Device Configuration';    Endpoint = 'deviceManagement/deviceConfigurations';       NameField = 'displayName' }
    [pscustomobject]@{ Label = 'Compliance Policy';       Endpoint = 'deviceManagement/deviceCompliancePolicies';   NameField = 'displayName' }
    [pscustomobject]@{ Label = 'App Protection';          Endpoint = 'deviceAppManagement/managedAppPolicies';      NameField = 'displayName' }
)

function Get-GraphCollection {
    param([Parameter(Mandatory)][string]$Uri)

    $items = @()
    $next = $Uri
    while ($next) {
        $response = Invoke-MgGraphRequest -Method GET -Uri $next
        if ($response.value) { $items += $response.value }
        $next = $response.'@odata.nextLink'
    }
    return $items
}

if (-not $RenamesPath) {
    $RenamesPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'IntuneTemplate/_renames.json'
}
if (-not (Test-Path $RenamesPath)) { throw "_renames.json not found at $RenamesPath" }
$renames = (Get-Content -LiteralPath $RenamesPath -Raw | ConvertFrom-Json).policies

if ($null -eq (Get-MgContext)) {
    Connect-MgGraph -Scopes 'DeviceManagementConfiguration.ReadWrite.All', 'DeviceManagementApps.ReadWrite.All' | Out-Null
}

# Fetch everything once: going through all five collections per policy would cost
# 125 calls with ~25 rules.
Write-Host 'Fetching policies from the tenant...' -ForegroundColor Cyan
$inTenant = @()
foreach ($type in $PolicyTypes) {
    $uri = if ($type.Label -eq 'App Protection') { "$ApiVersion/$($type.Endpoint)" } else { "$ApiVersion/$($type.Endpoint)?`$select=id,$($type.NameField)" }
    foreach ($policy in Get-GraphCollection -Uri $uri) {
        $inTenant += [pscustomobject]@{
            Name      = $policy.($type.NameField)
            Id        = $policy.id
            Label     = $type.Label
            Endpoint  = $type.Endpoint
            NameField = $type.NameField
        }
    }
}
Write-Host "$($inTenant.Count) policies found.`n" -ForegroundColor Cyan

$results = foreach ($rename in $renames) {
    $current = @($inTenant | Where-Object { $rename.previousNames -contains $_.Name })
    $alreadyDone = @($inTenant | Where-Object { $rename.target -and $_.Name -eq $rename.target })

    if ($current.Count -eq 0) {
        $state = if ($alreadyDone.Count -gt 0) { 'already updated' } else { 'not in tenant' }
        [pscustomobject]@{ Policy = ($rename.previousNames -join ' / '); Type = '-'; Action = $state; To = $rename.target }
        continue
    }
    if ($current.Count -gt 1) {
        Write-Warning "'$($rename.previousNames -join " / ")' occurs $($current.Count) times in the tenant — probably duplicates. Clean up by hand; skipped."
        [pscustomobject]@{ Policy = $current[0].Name; Type = $current[0].Label; Action = 'DUPLICATE'; To = $rename.target }
        continue
    }

    $policy = $current[0]

    if ($rename.action -ne 'rename') {
        # replace/retire: report only. See the header for why this script deletes nothing.
        $vervangers = if ($rename.replacedBy) { $rename.replacedBy -join ', ' } else { $rename.target }
        Write-Warning "'$($policy.Name)' calls for '$($rename.action)', not for a rename: $($rename.reason)"
        Write-Warning "  Replaced by: $vervangers"
        [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Action = $rename.action.ToUpper(); To = $vervangers }
        continue
    }

    if ($alreadyDone.Count -gt 0) {
        Write-Warning "'$($policy.Name)' still exists and '$($rename.target)' already exists — renaming would produce two policies with the same name. Skipped."
        [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Action = 'BOTH PRESENT'; To = $rename.target }
        continue
    }

    $body = @{ $policy.NameField = $rename.target } | ConvertTo-Json
    if ($PSCmdlet.ShouldProcess($policy.Name, "rename to '$($rename.target)'")) {
        try {
            Invoke-MgGraphRequest -Method PATCH -Uri "$ApiVersion/$($policy.Endpoint)/$($policy.Id)" -Body $body | Out-Null
            [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Action = 'renamed'; To = $rename.target }
        } catch {
            Write-Error "$($policy.Name) - rename failed: $_" -ErrorAction Continue
            [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Action = 'FAILED'; To = $rename.target }
        }
    } else {
        [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Action = 'skipped (WhatIf)'; To = $rename.target }
    }
}

$results | Format-Table -AutoSize

$failed = @($results | Where-Object Action -eq 'FAILED')
$manual = @($results | Where-Object { $_.Action -in @('REPLACE', 'RETIRE', 'DUPLICATE', 'BOTH PRESENT') })
if ($manual.Count -gt 0) {
    Write-Warning "$($manual.Count) policy/policies need manual work — see the warnings above and _renames.json."
}
Write-Host "`nNext: update the content via CIPP or Start-IntuneRestoreConfig, and check with" -ForegroundColor Cyan
Write-Host "  .\Set-BaselineAssignment.ps1 -Scope D -AllDevices -WhatIf   (should report 'already assigned')" -ForegroundColor Cyan
if ($failed.Count -gt 0) { throw "$($failed.Count) rename(s) failed — see the errors above." }
