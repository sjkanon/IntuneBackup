#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Brings the Entra group names in a tenant in line with the SG naming, according to the "groups" section of IntuneTemplate/_renames.json.

.DESCRIPTION
The baseline used to call its groups SEC-<Purpose>. The convention is now
SG-<U|D>-<domain>-[<platform>-]<subject>[-Dynamic] (CIPP-Regelboek, groups guide). The CIPP
packages, the baselines and Set-BaselineAssignment.ps1 find a group by NAME, so a tenant has to
carry the new names before the new templates reach CIPP. Otherwise CIPP assigns to a group that
does not exist, and the devices in the old group fall outside the policies.

Renaming rather than creating: a PATCH keeps the group id, so its members and every assignment
on it stay as they are. Two kinds of rules:

  rename  PATCH on displayName. Only when the membership type in the tenant matches the new
          name: a name ending in -Dynamic must be a dynamic group, any other name an assigned
          one. If not, the script reports it and leaves the group alone; the name would lie.
  split   The old group held users and devices together. The script creates the new groups
          (one kind of member each) when they are missing and copies the members into them by
          type. The old group stays: its assignments still work until CIPP or
          Set-BaselineAssignment.ps1 has assigned the new groups. Delete it afterwards by hand.

Always run with -WhatIf first.

.PARAMETER WhatIf
Shows what would happen without changing anything.

.EXAMPLE
.\Rename-BaselineGroup.ps1 -WhatIf
Mandatory first run: check that every old name is found once and that the membership types match.

.EXAMPLE
.\Rename-BaselineGroup.ps1
#>
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'Medium')]
param(
    [string]$RenamesPath
)

$ErrorActionPreference = 'Stop'

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

function Get-GroupByName {
    param([Parameter(Mandatory)][string]$Name)

    $escaped = $Name.Replace("'", "''")
    $filter = [uri]::EscapeDataString("displayName eq '$escaped'")
    return @(Get-GraphCollection -Uri "v1.0/groups?`$filter=$filter&`$select=id,displayName,groupTypes,membershipRule")
}

function Test-Dynamic {
    param($Group)
    return @($Group.groupTypes) -contains 'DynamicMembership'
}

if (-not $RenamesPath) {
    $RenamesPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'IntuneTemplate/_renames.json'
}
if (-not (Test-Path $RenamesPath)) { throw "_renames.json not found at $RenamesPath" }
$rules = (Get-Content -LiteralPath $RenamesPath -Raw | ConvertFrom-Json).groups
if (-not $rules) { throw "_renames.json has no 'groups' section." }

if ($null -eq (Get-MgContext)) {
    Connect-MgGraph -Scopes 'Group.ReadWrite.All', 'GroupMember.ReadWrite.All' | Out-Null
}

$results = foreach ($rule in $rules) {
    $old = @(Get-GroupByName -Name $rule.previousName)

    if ($old.Count -gt 1) {
        Write-Warning "'$($rule.previousName)' occurs $($old.Count) times in the tenant. Clean up by hand; skipped."
        [pscustomobject]@{ Group = $rule.previousName; Action = 'DUPLICATE'; To = '-' }
        continue
    }

    if ($rule.action -eq 'rename') {
        $new = @(Get-GroupByName -Name $rule.name)
        if ($old.Count -eq 0) {
            $state = if ($new.Count -gt 0) { 'already renamed' } else { 'not in tenant' }
            [pscustomobject]@{ Group = $rule.previousName; Action = $state; To = $rule.name }
            continue
        }
        if ($new.Count -gt 0) {
            Write-Warning "'$($rule.previousName)' and '$($rule.name)' both exist. Renaming would produce two groups with the same name; skipped."
            [pscustomobject]@{ Group = $rule.previousName; Action = 'BOTH PRESENT'; To = $rule.name }
            continue
        }
        $group = $old[0]
        $isDynamic = Test-Dynamic $group
        if ($isDynamic -ne ($rule.membership -eq 'dynamic')) {
            $actual = if ($isDynamic) { 'dynamic' } else { 'assigned' }
            Write-Warning "'$($group.displayName)' is $actual in this tenant, '$($rule.name)' says $($rule.membership). Not renamed: decide by hand (a new group with the right type, see the groups guide)."
            [pscustomobject]@{ Group = $group.displayName; Action = 'MEMBERSHIP MISMATCH'; To = $rule.name }
            continue
        }
        if ($PSCmdlet.ShouldProcess($group.displayName, "rename to '$($rule.name)'")) {
            try {
                Invoke-MgGraphRequest -Method PATCH -Uri "v1.0/groups/$($group.id)" -Body (@{ displayName = $rule.name } | ConvertTo-Json) | Out-Null
                [pscustomobject]@{ Group = $group.displayName; Action = 'renamed'; To = $rule.name }
            } catch {
                Write-Error "$($group.displayName) - rename failed: $_" -ErrorAction Continue
                [pscustomobject]@{ Group = $group.displayName; Action = 'FAILED'; To = $rule.name }
            }
        } else {
            [pscustomobject]@{ Group = $group.displayName; Action = 'would rename'; To = $rule.name }
        }
        continue
    }

    if ($rule.action -eq 'split') {
        if ($old.Count -eq 0) {
            [pscustomobject]@{ Group = $rule.previousName; Action = 'not in tenant'; To = ($rule.into.name -join ', ') }
            continue
        }
        $source = $old[0]
        $members = @(Get-GraphCollection -Uri "v1.0/groups/$($source.id)/members?`$select=id,displayName")
        $other = @($members | Where-Object { $_.'@odata.type' -notin '#microsoft.graph.user', '#microsoft.graph.device' })
        if ($other.Count -gt 0) {
            Write-Warning "'$($source.displayName)' has $($other.Count) member(s) that are neither a user nor a device (nested group, service principal). Those are not copied: $(($other.displayName) -join ', ')"
        }

        foreach ($part in $rule.into) {
            $type = "#microsoft.graph.$($part.members)"
            $wanted = @($members | Where-Object { $_.'@odata.type' -eq $type })
            $target = @(Get-GroupByName -Name $part.name)
            if ($target.Count -gt 1) {
                Write-Warning "'$($part.name)' occurs $($target.Count) times in the tenant. Clean up by hand; skipped."
                [pscustomobject]@{ Group = $source.displayName; Action = 'DUPLICATE'; To = $part.name }
                continue
            }

            if ($target.Count -eq 0) {
                if (-not $PSCmdlet.ShouldProcess($part.name, "create assigned security group and add $($wanted.Count) $($part.members) member(s) from '$($source.displayName)'")) {
                    [pscustomobject]@{ Group = $source.displayName; Action = "would create, $($wanted.Count) $($part.members)(s)"; To = $part.name }
                    continue
                }
                $body = @{
                    displayName     = $part.name
                    description     = "Pilot group of the Intune baseline ($($part.members)s only). Split from $($source.displayName)."
                    mailEnabled     = $false
                    mailNickname    = ($part.name -replace '[^A-Za-z0-9]', '')
                    securityEnabled = $true
                    groupTypes      = @()
                } | ConvertTo-Json
                $created = Invoke-MgGraphRequest -Method POST -Uri 'v1.0/groups' -Body $body
                $targetId = $created.id
                $present = @()
            } else {
                if (Test-Dynamic $target[0]) {
                    Write-Warning "'$($part.name)' is dynamic in this tenant; members cannot be added. Skipped."
                    [pscustomobject]@{ Group = $source.displayName; Action = 'TARGET DYNAMIC'; To = $part.name }
                    continue
                }
                $targetId = $target[0].id
                $present = @(Get-GraphCollection -Uri "v1.0/groups/$targetId/members?`$select=id").id
            }

            $missing = @($wanted | Where-Object { $present -notcontains $_.id })
            $added = 0
            foreach ($member in $missing) {
                if ($PSCmdlet.ShouldProcess($member.displayName, "add to '$($part.name)'")) {
                    $ref = @{ '@odata.id' = "https://graph.microsoft.com/v1.0/directoryObjects/$($member.id)" } | ConvertTo-Json
                    Invoke-MgGraphRequest -Method POST -Uri "v1.0/groups/$targetId/members/`$ref" -Body $ref | Out-Null
                    $added++
                }
            }
            $state = if ($target.Count -eq 0) { "created, $added $($part.members)(s)" }
                     elseif ($missing.Count -eq 0) { 'already split' }
                     elseif ($added -eq 0) { "would add $($missing.Count) $($part.members)(s)" }
                     else { "$added $($part.members)(s) added" }
            [pscustomobject]@{ Group = $source.displayName; Action = $state; To = $part.name }
        }
        continue
    }

    Write-Warning "Unknown action '$($rule.action)' for '$($rule.previousName)'; skipped."
}

$results | Format-Table -AutoSize

$manual = @($results | Where-Object { $_.Action -cmatch '^[A-Z ]+$' })
if ($manual.Count -gt 0) {
    Write-Warning "$($manual.Count) group(s) need manual work, see the warnings above."
}
$split = @($rules | Where-Object { $_.action -eq 'split' })
if ($split.Count -gt 0) {
    Write-Host "`nThe old group of a split ($($split.previousName -join ', ')) stays. Delete it once CIPP or Set-BaselineAssignment.ps1 has assigned the new groups." -ForegroundColor Yellow
}
