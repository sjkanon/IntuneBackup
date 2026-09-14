#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
    Vult de settingInstanceTemplateId in de App Control for Business-bodies in vanuit de eigen tenant.

.DESCRIPTION
    De bodies AppControl_BuiltIn_Audit.graph.json en AppControl_BuiltIn_Enforce.graph.json bevatten
    de placeholder SETTINGINSTANCETEMPLATEID-INVULLEN, omdat de id niet in een publieke definitiebron
    staat. Dit script haalt de setting templates van template d3849ba8-bf95-467c-9640-aa2334eae9e3_1
    op, zoekt de template voor device_vendor_msft_policy_config_applicationcontrolv2_buildoptions,
    vult de id (en, als die bestaat, de settingValueTemplateId van de gekozen optie) in en schrijft
    <naam>.resolved.json naast het origineel.

    Met -Create worden beide policies ook aangemaakt, zonder toewijzing. Toewijzen gebeurt bewust
    met de hand: audit eerst op de pilotgroep, afdwingen alleen op een eigen groep (zie README.md).

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

if (-not (Get-MgContext)) { throw 'Eerst Connect-MgGraph -Scopes DeviceManagementConfiguration.ReadWrite.All' }

$uri = "https://graph.microsoft.com/beta/deviceManagement/configurationPolicyTemplates('$templateId')/settingTemplates?`$expand=settingDefinitions&`$top=1000"
$templates = @()
do {
    $page = Invoke-MgGraphRequest -Method GET -Uri $uri -OutputType PSObject
    $templates += $page.value
    $uri = $page.'@odata.nextLink'
} while ($uri)

$match = $templates | Where-Object { $_.settingInstanceTemplate.settingDefinitionId -eq $settingId } | Select-Object -First 1
if (-not $match) { throw "Geen setting template voor $settingId in $templateId gevonden. Is de template-versie veranderd? Controleer in Intune → Endpoint security → App Control for Business." }

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
    if ($PSCmdlet.ShouldProcess($out, 'Schrijf body met ingevulde template-ids')) {
        Set-Content -Path $out -Value $json -Encoding utf8
    }
    if ($Create -and $PSCmdlet.ShouldProcess($body.name, 'Maak App Control-policy aan (zonder toewijzing)')) {
        $existing = Invoke-MgGraphRequest -Method GET -OutputType PSObject -Uri ("https://graph.microsoft.com/beta/deviceManagement/configurationPolicies?`$filter=name eq '{0}'" -f ($body.name -replace "'", "''"))
        if ($existing.value.Count -gt 0) {
            Write-Warning "Bestaat al: $($body.name) — overgeslagen."
            continue
        }
        $result = Invoke-MgGraphRequest -Method POST -Uri 'https://graph.microsoft.com/beta/deviceManagement/configurationPolicies' -Body $json -ContentType 'application/json'
        Write-Host "Aangemaakt: $($body.name) ($($result.id))"
    }
}
