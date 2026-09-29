#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
    Fills in the settingInstanceTemplateId in the App Control for Business bodies from your own tenant.

.DESCRIPTION
    The bodies AppControl_BuiltIn_Audit.graph.json and AppControl_BuiltIn_Enforce.graph.json contain
    the placeholder SETTINGINSTANCETEMPLATEID-INVULLEN, because the id is not in any public definition
    source. This script retrieves the setting templates of template d3849ba8-bf95-467c-9640-aa2334eae9e3_1,
    looks up the template for device_vendor_msft_policy_config_applicationcontrolv2_buildoptions,
    fills in the id (and, if it exists, the settingValueTemplateId of the chosen option) and writes
    <name>.resolved.json next to the original.

    With -Create both policies are also created, without assignment. Assigning is deliberately done
    by hand: audit first on the pilot group, enforce only on a dedicated group (see README.md).

.EXAMPLE
    Connect-MgGraph -Scopes DeviceManagementConfiguration.ReadWrite.All
    ./Set-AppControlTemplateIds.ps1 -WhatIf
    ./Set-AppControlTemplateIds.ps1 -Create
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [switch]$Create
)

$ErrorActionPreference = 'Stop'
$templateId = 'd3849ba8-bf95-467c-9640-aa2334eae9e3_1'
$settingId = 'device_vendor_msft_policy_config_applicationcontrolv2_buildoptions'

if (-not (Get-MgContext)) { throw 'Run Connect-MgGraph -Scopes DeviceManagementConfiguration.ReadWrite.All first' }

$uri = "https://graph.microsoft.com/beta/deviceManagement/configurationPolicyTemplates('$templateId')/settingTemplates?`$expand=settingDefinitions&`$top=1000"
$templates = @()
do {
    $page = Invoke-MgGraphRequest -Method GET -Uri $uri -OutputType PSObject
    $templates += $page.value
    $uri = $page.'@odata.nextLink'
} while ($uri)

$match = $templates | Where-Object { $_.settingInstanceTemplate.settingDefinitionId -eq $settingId } | Select-Object -First 1
if (-not $match) { throw "No setting template found for $settingId in $templateId. Has the template version changed? Check in Intune → Endpoint security → App Control for Business." }

$instanceTemplateId = $match.settingInstanceTemplate.settingInstanceTemplateId
$valueTemplateId = $match.settingInstanceTemplate.choiceSettingValueTemplate.settingValueTemplateId
Write-Host "settingInstanceTemplateId = $instanceTemplateId"
if ($valueTemplateId) { Write-Host "settingValueTemplateId    = $valueTemplateId" }

foreach ($file in 'AppControl_BuiltIn_Audit.graph.json', 'AppControl_BuiltIn_Enforce.graph.json') {
    $path = Join-Path $PSScriptRoot $file
    $body = Get-Content -Raw -Path $path | ConvertFrom-Json -Depth 50
    $instance = $body.settings[0].settingInstance
    $instance.settingInstanceTemplateReference.settingInstanceTemplateId = $instanceTemplateId
    if ($valueTemplateId) {
        $instance.choiceSettingValue.settingValueTemplateReference = [pscustomobject]@{
            settingValueTemplateId = $valueTemplateId
            useTemplateDefault     = $false
        }
    }
    $json = $body | ConvertTo-Json -Depth 50
    $out = $path -replace '\.graph\.json$', '.resolved.json'
    if ($PSCmdlet.ShouldProcess($out, 'Write body with filled-in template ids')) {
        Set-Content -Path $out -Value $json -Encoding utf8
    }
    if ($Create -and $PSCmdlet.ShouldProcess($body.name, 'Create App Control policy (without assignment)')) {
        $existing = Invoke-MgGraphRequest -Method GET -OutputType PSObject -Uri ("https://graph.microsoft.com/beta/deviceManagement/configurationPolicies?`$filter=name eq '{0}'" -f ($body.name -replace "'", "''"))
        if ($existing.value.Count -gt 0) {
            Write-Warning "Already exists: $($body.name) — skipped."
            continue
        }
        $result = Invoke-MgGraphRequest -Method POST -Uri 'https://graph.microsoft.com/beta/deviceManagement/configurationPolicies' -Body $json -ContentType 'application/json'
        Write-Host "Created: $($body.name) ($($result.id))"
    }
}
