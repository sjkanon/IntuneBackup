#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Assigns the baseline policies in a tenant to All Devices, All Users or a group.

.DESCRIPTION
Looks up in the tenant the policies that are in IntuneTemplate/ — across all five policy
types (Settings Catalog, Administrative Templates/ADMX, classic Device Configurations,
compliance policies and App Protection/MAM) — and sets an assignment on them in one go.

By default the policy list comes from IntuneTemplate/, not from a name filter on "[Baseline]".
That is deliberate: a policy that does not (yet) carry the prefix would be silently
skipped. With -Name you can supply your own list.

Which policies belong to the target follows from the fase (phase) in _manifest.json, the same
derivation as the CIPP packages: -AllDevices and -AllUsers take phase 1 with that target from
_assignments.json, -GroupName 'SEC-Baseline-Pilot' takes phase 2, and -GroupName with a
`faseGroep` takes that group's phase 4 policies. This script never assigns phase 3 and 5 on
its own. An exclusion (-Exclude) does go on all policies: it only takes something away.

Assignments are ADDED to by default, not replaced. Graph's /assign endpoint always overwrites
the complete list, so this script first reads the existing assignments and POSTs the merged
set. With -Replace you throw the existing ones away instead.

.PARAMETER AllDevices
Assigns to all devices (#microsoft.graph.allDevicesAssignmentTarget).

.PARAMETER AllUsers
Assigns to all licensed users (#microsoft.graph.allLicensedUsersAssignmentTarget).

.PARAMETER GroupId
Object id of the Entra group to assign to.

.PARAMETER GroupName
Display name of the Entra group; it is looked up and must return exactly one group.

.PARAMETER Exclude
Makes it an exclusion instead of an assignment. Only meaningful with a group.

.PARAMETER Name
Explicit policy names instead of the list from IntuneTemplate/.

.PARAMETER Scope
Limits the policy list to device-scoped ('D') or user-scoped ('U') policies, based on the
"[Baseline] - PLATFORM - D/U - Item" naming convention. Default 'Both': the list then stays
unfiltered, including policies that do not (yet) follow that convention. Also works on -Name.

.PARAMETER Platform
Limits the policy list to one platform: 'WIN', 'MAC', 'IOS' or 'AND'. Default 'All'.
Handy for rolling out a new platform separately without touching the Windows baseline.

.PARAMETER Replace
Replaces existing assignments instead of adding to them.

.PARAMETER IgnoreFase
Takes all templates from IntuneTemplate/, regardless of their phase. Only for a test tenant: a
phase 5 policy next to its counterpart produces a Conflict, after which Intune applies the
disputed setting through neither of them.

.PARAMETER FilterId
Object id of an assignment filter to put on the assignment.

.PARAMETER FilterType
'include' or 'exclude' — required together with -FilterId.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -AllDevices -WhatIf
Shows what would happen, without changing anything.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -GroupName 'SEC-Baseline-Pilot'

.EXAMPLE
.\Set-BaselineAssignment.ps1 -AllDevices -Replace
Throws away existing assignments and puts only All Devices on.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -Scope D -AllDevices
.\Set-BaselineAssignment.ps1 -Scope U -AllUsers
The day-to-day operation: device policies to devices, user policies to users.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -Platform MAC -Scope D -AllDevices -WhatIf
Only the macOS device policies, as a dry run first.
#>
# ConfirmImpact deliberately at Medium: with High PowerShell asks for confirmation per policy and
# with nearly a hundred policies you click yourself silly. Run -WhatIf first; that is the dry run here.
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'Medium', DefaultParameterSetName = 'AllDevices')]
param(
    [Parameter(Mandatory, ParameterSetName = 'AllDevices')]
    [switch]$AllDevices,

    [Parameter(Mandatory, ParameterSetName = 'AllUsers')]
    [switch]$AllUsers,

    [Parameter(Mandatory, ParameterSetName = 'GroupId')]
    [string]$GroupId,

    [Parameter(Mandatory, ParameterSetName = 'GroupName')]
    [string]$GroupName,

    [Parameter(ParameterSetName = 'GroupId')]
    [Parameter(ParameterSetName = 'GroupName')]
    [switch]$Exclude,

    [string[]]$Name,

    [ValidateSet('D', 'U', 'Both')]
    [string]$Scope = 'Both',

    [ValidateSet('WIN', 'MAC', 'IOS', 'AND', 'All')]
    [string]$Platform = 'All',

    [switch]$Replace,

    [switch]$IgnoreFase,

    [string]$FilterId,

    [ValidateSet('include', 'exclude')]
    [string]$FilterType,

    [ValidateSet('beta', 'v1.0')]
    [string]$ApiVersion = 'beta'
)

$ErrorActionPreference = 'Stop'

# Settings Catalog uses 'name', the rest 'displayName' — otherwise the match finds nothing.
#
# App Protection is a separate case: you find the policies via managedAppPolicies, but assigning
# only works via the platform-specific collection (iosManagedAppProtections /
# androidManagedAppProtections). A POST to managedAppPolicies/{id}/assign does not exist.
$PolicyTypes = @(
    [pscustomobject]@{ Label = 'Settings Catalog';        Endpoint = 'deviceManagement/configurationPolicies';      NameField = 'name' }
    [pscustomobject]@{ Label = 'Administrative Template'; Endpoint = 'deviceManagement/groupPolicyConfigurations';  NameField = 'displayName' }
    [pscustomobject]@{ Label = 'Device Configuration';    Endpoint = 'deviceManagement/deviceConfigurations';       NameField = 'displayName' }
    [pscustomobject]@{ Label = 'Compliance Policy';       Endpoint = 'deviceManagement/deviceCompliancePolicies';   NameField = 'displayName' }
    [pscustomobject]@{ Label = 'App Protection';          Endpoint = 'deviceAppManagement/managedAppPolicies';      NameField = 'displayName' }
)

# @odata.type of an app protection policy -> the collection where /assign does work.
$AppProtectionEndpoints = @{
    '#microsoft.graph.iosManagedAppProtection'              = 'deviceAppManagement/iosManagedAppProtections'
    '#microsoft.graph.androidManagedAppProtection'          = 'deviceAppManagement/androidManagedAppProtections'
    '#microsoft.graph.mdmWindowsInformationProtectionPolicy' = 'deviceAppManagement/mdmWindowsInformationProtectionPolicies'
    '#microsoft.graph.windowsInformationProtectionPolicy'   = 'deviceAppManagement/windowsInformationProtectionPolicies'
    '#microsoft.graph.targetedManagedAppConfiguration'      = 'deviceAppManagement/targetedManagedAppConfigurations'
}

function Get-GraphCollection {
    <# Follows @odata.nextLink; without paging you miss policies as soon as a tenant has more
       than one page of them — exactly the kind of silent omission that must not happen here. #>
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

function Get-TemplateDisplayName {
    <# Reads the Displayname from the CIPP templates in IntuneTemplate/ (nested JSON string).
       -Recurse because the templates sit in subfolders per platform and policy type. #>
    param([Parameter(Mandatory)][string]$TemplateDir)

    Get-ChildItem -Path $TemplateDir -Filter 'Baseline_*.json' -File -Recurse | ForEach-Object {
        ((Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json).JSON | ConvertFrom-Json).Displayname
    }
}

function Get-TargetKey {
    <# Two targets are the same if type, group and filter are all equal. Without this key,
       adding would append a duplicate on every run. #>
    param($Target)

    $type = $Target.'@odata.type'
    $group = $Target.groupId
    $filter = $Target.deviceAndAppManagementAssignmentFilterId
    $filterType = $Target.deviceAndAppManagementAssignmentFilterType
    return "$type|$group|$filter|$filterType"
}

# --- determine the target -----------------------------------------------------------
if ($FilterId -and -not $FilterType) { throw "-FilterId also requires -FilterType ('include' or 'exclude')." }
if ($FilterType -and -not $FilterId) { throw "-FilterType also requires -FilterId." }

if ($null -eq (Get-MgContext)) {
    Connect-MgGraph -Scopes 'DeviceManagementConfiguration.ReadWrite.All', 'Group.Read.All' | Out-Null
}

$resolvedGroupId = $GroupId
if ($GroupName) {
    $escaped = $GroupName.Replace("'", "''")
    $groups = Get-GraphCollection -Uri "v1.0/groups?`$filter=displayName eq '$escaped'&`$select=id,displayName"
    if ($groups.Count -eq 0) { throw "No group found with displayName '$GroupName'." }
    if ($groups.Count -gt 1) { throw "$($groups.Count) groups are named '$GroupName' — use -GroupId to point at the right one." }
    $resolvedGroupId = $groups[0].id
    Write-Host "Group '$GroupName' -> $resolvedGroupId" -ForegroundColor Cyan
}

$target = switch ($PSCmdlet.ParameterSetName) {
    'AllDevices' { @{ '@odata.type' = '#microsoft.graph.allDevicesAssignmentTarget' } }
    'AllUsers'   { @{ '@odata.type' = '#microsoft.graph.allLicensedUsersAssignmentTarget' } }
    default {
        @{
            '@odata.type' = if ($Exclude) { '#microsoft.graph.exclusionGroupAssignmentTarget' } else { '#microsoft.graph.groupAssignmentTarget' }
            groupId       = $resolvedGroupId
        }
    }
}
$target['deviceAndAppManagementAssignmentFilterId'] = if ($FilterId) { $FilterId } else { $null }
$target['deviceAndAppManagementAssignmentFilterType'] = if ($FilterType) { $FilterType } else { 'none' }

# --- determine the policy list ------------------------------------------------------
# By default the list follows the fase (phase) in _manifest.json, not "everything in IntuneTemplate/".
# Without that distinction -AllDevices would also put the pilot, the waiting room and the
# alternatives on all devices — and a phase 5 policy next to its counterpart produces a Conflict,
# after which Intune applies the disputed setting through neither of them. The same derivation as
# packageFor() in scripts/lib/templates.js, so CIPP and this script roll out the same thing to the
# same target: phase 1 is listed with its target in _assignments.json, phase 2 belongs on the pilot
# group, phase 4 on its `faseGroep`, and phase 3 and 5 are assigned by nothing.
$PilotGroup = 'SEC-Baseline-Pilot'

if ($Name) {
    $wanted = $Name
} else {
    $templateDir = Join-Path (Split-Path -Parent $PSScriptRoot) 'IntuneTemplate'
    if (-not (Test-Path $templateDir)) { throw "IntuneTemplate/ not found at $templateDir — pass -Name to run without the repo." }

    if ($IgnoreFase -or $Exclude) {
        # An exclusion on every baseline policy can do no harm: it only takes something away.
        $wanted = @(Get-TemplateDisplayName -TemplateDir $templateDir)
    } else {
        $manifest = Get-Content -LiteralPath (Join-Path $templateDir '_manifest.json') -Raw | ConvertFrom-Json
        $assigned = Get-Content -LiteralPath (Join-Path $templateDir '_assignments.json') -Raw | ConvertFrom-Json
        $assignedTo = {
            param([string]$TargetType)
            $assigned.PSObject.Properties |
                Where-Object { @($_.Value.target.'@odata.type') -contains "#microsoft.graph.$TargetType" } |
                ForEach-Object Name
        }

        $wanted = @(switch ($PSCmdlet.ParameterSetName) {
            'AllDevices' { & $assignedTo 'allDevicesAssignmentTarget' }
            'AllUsers'   { & $assignedTo 'allLicensedUsersAssignmentTarget' }
            'GroupName'  {
                $manifest.policies |
                    Where-Object {
                        ($_.fase -eq 2 -and $GroupName -eq $PilotGroup) -or
                        ($_.fase -eq 4 -and (($_.faseGroep -split ' \(')[0].Trim()) -eq $GroupName)
                    } |
                    ForEach-Object displayName
            }
            'GroupId' {
                throw "With only -GroupId there is no telling which phase belongs to that group. Use -GroupName, specify the policies with -Name, or take everything with -IgnoreFase."
            }
        })

        if ($wanted.Count -eq 0) {
            $known = @($PilotGroup) + @($manifest.policies | Where-Object { $_.fase -eq 4 } | ForEach-Object { ($_.faseGroep -split ' \(')[0].Trim() }) | Sort-Object -Unique
            throw "No policy belongs to this target according to the phase. Groups the phase knows: $($known -join ', '). For another group: -Name or -IgnoreFase."
        }
        Write-Host "Policy list according to the phase in _manifest.json ($($wanted.Count) policies)" -ForegroundColor Cyan
    }
}
if ($wanted.Count -eq 0) { throw 'No policy names to assign.' }

# Scope filter: device policies belong on devices, user policies on users. The script reads
# the scope from the name ("[Baseline] - D - Item"), because that is the only thing both the
# repo and the tenant know — a policy id says nothing about it. Policies that do not yet follow
# the convention therefore fall outside every scope filter; that is deliberately visible instead
# of silent, otherwise after a half-finished migration you would no longer assign half the baseline.
if ($Scope -ne 'Both' -or $Platform -ne 'All') {
    $before = $wanted
    $notConvention = @($before | Where-Object { $_ -notmatch '^\[Baseline\] - (WIN|MAC|IOS|AND) - [DU] - ' })
    if ($notConvention.Count -gt 0) {
        Write-Warning "$($notConvention.Count) policy/policies do not follow the '[Baseline] - PLATFORM - D/U - Item' convention and fall outside every filter:"
        $notConvention | ForEach-Object { Write-Warning "  $_" }
    }

    $platformPattern = if ($Platform -eq 'All') { '(WIN|MAC|IOS|AND)' } else { $Platform }
    $scopePattern = if ($Scope -eq 'Both') { '[DU]' } else { $Scope }
    $wanted = @($before | Where-Object { $_ -match "^\[Baseline\] - $platformPattern - $scopePattern - " })

    if ($wanted.Count -eq 0) {
        throw "No policies found for platform '$Platform' and scope '$Scope'. Run without a filter to assign everything."
    }
}

Write-Host "$($wanted.Count) policies from the baseline, target: $($target.'@odata.type')$(if ($resolvedGroupId) { " ($resolvedGroupId)" })" -ForegroundColor Cyan
if ($Scope -ne 'Both') { Write-Host "Scope filter: $Scope" -ForegroundColor Cyan }
if ($Platform -ne 'All') { Write-Host "Platform filter: $Platform" -ForegroundColor Cyan }
Write-Host ("Mode: {0}" -f $(if ($Replace) { 'REPLACE existing assignments' } else { 'add to existing assignments' })) -ForegroundColor Cyan

# --- fetch policies -----------------------------------------------------------------
$found = @{}
foreach ($type in $PolicyTypes) {
    # No $select for App Protection: the @odata.type is needed to determine which collection
    # /assign works on, and you cannot select it.
    $uri = if ($type.Label -eq 'App Protection') {
        "$ApiVersion/$($type.Endpoint)"
    } else {
        "$ApiVersion/$($type.Endpoint)?`$select=id,$($type.NameField)"
    }

    foreach ($policy in Get-GraphCollection -Uri $uri) {
        $policyName = $policy.($type.NameField)
        if ($wanted -notcontains $policyName) { continue }

        $endpoint = $type.Endpoint
        if ($type.Label -eq 'App Protection') {
            $endpoint = $AppProtectionEndpoints[[string]$policy.'@odata.type']
            if (-not $endpoint) {
                Write-Warning "'$policyName' has an unknown app protection type ($($policy.'@odata.type')) — skipped."
                continue
            }
        }

        if ($found.ContainsKey($policyName)) {
            Write-Warning "'$policyName' exists more than once in the tenant — only the first one ($($found[$policyName].Label)) is assigned."
            continue
        }
        $found[$policyName] = [pscustomobject]@{ Id = $policy.id; Label = $type.Label; Endpoint = $endpoint; Name = $policyName }
    }
}

# --- assign -------------------------------------------------------------------------
$results = foreach ($policyName in $wanted) {
    if (-not $found.ContainsKey($policyName)) {
        [pscustomobject]@{ Policy = $policyName; Type = '-'; Action = 'NOT FOUND'; Assignments = 0 }
        continue
    }
    $policy = $found[$policyName]
    $uri = "$ApiVersion/$($policy.Endpoint)/$($policy.Id)"

    $existing = if ($Replace) { @() } else { @(Get-GraphCollection -Uri "$uri/assignments" | ForEach-Object { $_.target }) }
    $targets = [System.Collections.ArrayList]::new()
    $seen = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($t in $existing) { if ($seen.Add((Get-TargetKey $t))) { [void]$targets.Add($t) } }

    $isNew = $seen.Add((Get-TargetKey $target))
    if (-not $isNew) {
        [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Action = 'already assigned'; Assignments = $targets.Count }
        continue
    }
    [void]$targets.Add($target)

    $body = @{ assignments = @($targets | ForEach-Object { @{ target = $_ } }) } | ConvertTo-Json -Depth 10
    if ($PSCmdlet.ShouldProcess($policyName, "set assignment ($($targets.Count) target(s))")) {
        try {
            Invoke-MgGraphRequest -Method POST -Uri "$uri/assign" -Body $body | Out-Null
            [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Action = $(if ($Replace) { 'replaced' } else { 'added' }); Assignments = $targets.Count }
        } catch {
            Write-Error "$policyName - assignment failed: $_" -ErrorAction Continue
            [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Action = 'FAILED'; Assignments = 0 }
        }
    } else {
        [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Action = 'skipped (WhatIf)'; Assignments = $targets.Count }
    }
}

$results | Format-Table -AutoSize

$missing = @($results | Where-Object Action -eq 'NOT FOUND')
$failed = @($results | Where-Object Action -eq 'FAILED')
if ($missing.Count -gt 0) {
    Write-Warning "$($missing.Count) policy/policies are not in the tenant. Roll them out first (CIPP, or Start-IntuneRestoreConfig on export/NativeImport/IntuneBackupAndRestore/) and run this script again."
}
if ($failed.Count -gt 0) { throw "$($failed.Count) assignment(s) failed — see the errors above." }
