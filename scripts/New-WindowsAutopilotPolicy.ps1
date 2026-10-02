#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Creates a Windows Autopilot deployment profile, Enrollment Status Page or Autopilot device
preparation policy from a JSON file, or exports the existing ones to JSON.

.DESCRIPTION
None of the three is one of the five CIPP template types, so they live in
IntuneTemplate/WIN/Enrollment/ next to the templates, not in a CIPP package - see the README there for the why and for
the CIPP standards that cover the same ground. The kind of object is read from the JSON:

  azureADWindowsAutopilotDeploymentProfile      -> windowsAutopilotDeploymentProfiles
  windows10EnrollmentCompletionPageConfiguration -> deviceEnrollmentConfigurations (+ setPriority)
  templateReference 80d33118-..._1               -> configurationPolicies (device preparation)

For device preparation the device security group is NOT applied by the setting in the policy
body; that string is only what the portal displays. Intune enrols devices into the group named by
the setEnrollmentTimeDeviceMembershipTarget action, which this script calls after the create
when -DeviceGroupName is given. That group must be owned by the Intune Provisioning Client
service principal (appId f1346770-5b25-470b-88bd-d5744ab7952c); -CreateDeviceGroup creates the
group with that owner, and adds the owner to an existing group that lacks it.

Beta endpoint: v1.0 knows none of the three in this form.

This script deliberately does not assign. A deployment profile assigned to the wrong device
group, or a device preparation policy assigned to all users, changes how every new device is
set up; that belongs in the portal (or a CIPP standard) with the target in front of you.

.PARAMETER Path
Path to the JSON file.

.PARAMETER DeviceGroupName
Device preparation only: the security group devices join during enrollment. Matched on exact
display name.

.PARAMETER CreateDeviceGroup
Device preparation only: create -DeviceGroupName if it does not exist, with the Intune
Provisioning Client as owner.

.PARAMETER Export
Fetches all Autopilot deployment profiles, non-default Enrollment Status Pages and device
preparation policies and writes them as JSON to -OutDir.

.PARAMETER OutDir
Target folder for -Export. Default IntuneTemplate/WIN/Enrollment/export (not committed blindly:
review and copy what you want to keep).

.EXAMPLE
.\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Deployment-Profile.json -WhatIf

.EXAMPLE
.\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Device-Preparation.json -DeviceGroupName 'WIN - Autopilot Device Preparation - Devices' -CreateDeviceGroup

.EXAMPLE
.\New-WindowsAutopilotPolicy.ps1 -Export
#>
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'High', DefaultParameterSetName = 'Create')]
param(
    [Parameter(Mandatory, ParameterSetName = 'Create')]
    [string]$Path,

    [Parameter(ParameterSetName = 'Create')]
    [string]$DeviceGroupName,

    [Parameter(ParameterSetName = 'Create')]
    [switch]$CreateDeviceGroup,

    [Parameter(Mandatory, ParameterSetName = 'Export')]
    [switch]$Export,

    [Parameter(ParameterSetName = 'Export')]
    [string]$OutDir = (Join-Path $PSScriptRoot '..\IntuneTemplate\WIN\Enrollment\export')
)

$ErrorActionPreference = 'Stop'
$graph = 'https://graph.microsoft.com/beta'
$devicePrepTemplateId = '80d33118-b7b4-40d8-b15f-81be745e053f_1'
$provisioningClientAppId = 'f1346770-5b25-470b-88bd-d5744ab7952c'

$scopes = @('DeviceManagementServiceConfig.ReadWrite.All', 'DeviceManagementConfiguration.ReadWrite.All')
if ($DeviceGroupName) { $scopes += @('Group.ReadWrite.All', 'Application.ReadWrite.All') }
$context = Get-MgContext
if (-not $context -or ($scopes | Where-Object { $_ -notin $context.Scopes })) {
    Connect-MgGraph -Scopes $scopes | Out-Null
}

function Get-GraphCollection([string]$Uri) {
    $items = @()
    while ($Uri) {
        $page = Invoke-MgGraphRequest -Method GET -Uri $Uri
        $items += $page.value
        $Uri = $page.'@odata.nextLink'
    }
    $items
}

# id, timestamps and @odata.context are tenant-specific and do not belong in a reusable file.
function ConvertTo-PortableObject($Object) {
    $skip = @('id', '@odata.context', 'createdDateTime', 'lastModifiedDateTime', 'version',
        'settingCount', 'creationSource', 'isAssigned', 'settings@odata.context', 'managementServiceAppId')
    $clean = [ordered]@{}
    foreach ($k in ($Object.Keys | Sort-Object)) {
        if ($k -in $skip) { continue }
        $clean[$k] = $Object[$k]
    }
    $clean
}

function Write-ExportFile($Object, [string]$Name) {
    $file = Join-Path $OutDir ("{0}.json" -f ($Name -replace '[^\w\.\-]', '_'))
    $Object | ConvertTo-Json -Depth 30 | Set-Content -Path $file -Encoding utf8
    Write-Host "Exported: $file"
}

# --- Export --------------------------------------------------------------------------------
if ($Export) {
    if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

    foreach ($p in (Get-GraphCollection "$graph/deviceManagement/windowsAutopilotDeploymentProfiles")) {
        Write-ExportFile (ConvertTo-PortableObject $p) "AutopilotProfile_$($p.displayName)"
    }

    # The default ESP exists in every tenant and is edited with PATCH, not recreated.
    $esps = Get-GraphCollection "$graph/deviceManagement/deviceEnrollmentConfigurations" |
        Where-Object { $_.'@odata.type' -eq '#microsoft.graph.windows10EnrollmentCompletionPageConfiguration' }
    foreach ($e in $esps) {
        $name = if ($e.id -like '*DefaultWindows10EnrollmentCompletionPageConfiguration') { 'ESP_Default' } else { "ESP_$($e.displayName)" }
        Write-ExportFile (ConvertTo-PortableObject $e) $name
    }

    # Device preparation policies, including ones built on a newer template than the one in this
    # repo (device association adds language, naming and OOBE screens) - export is how those get here.
    $policies = Get-GraphCollection "$graph/deviceManagement/configurationPolicies?`$select=id,name,description,platforms,technologies,roleScopeTagIds,templateReference" |
        Where-Object { $_.platforms -eq 'windows10' -and $_.templateReference.templateFamily -eq 'enrollmentConfiguration' }
    foreach ($p in $policies) {
        $p['settings'] = @(Get-GraphCollection "$graph/deviceManagement/configurationPolicies('$($p.id)')/settings" |
            ForEach-Object { @{ '@odata.type' = '#microsoft.graph.deviceManagementConfigurationSetting'; settingInstance = $_.settingInstance } })
        $clean = ConvertTo-PortableObject $p
        $clean['templateReference'] = @{ templateId = $p.templateReference.templateId }
        Write-ExportFile $clean "DevicePreparation_$($p.name)"
    }
    Write-Host ""
    Write-Host "Device group ids and app/script ids in the export are tenant-specific. Replace them before committing."
    return
}

# --- Read the file -------------------------------------------------------------------------
if (-not (Test-Path $Path)) { throw "File not found: $Path" }
$json = Get-Content -Path $Path -Raw
try { $policy = $json | ConvertFrom-Json } catch { throw "Invalid JSON in ${Path}: $_" }

$kind = switch ($true) {
    ($policy.'@odata.type' -eq '#microsoft.graph.azureADWindowsAutopilotDeploymentProfile') { 'Profile'; break }
    ($policy.'@odata.type' -eq '#microsoft.graph.windows10EnrollmentCompletionPageConfiguration') { 'ESP'; break }
    ($policy.templateReference.templateId -eq $devicePrepTemplateId) { 'DevicePrep'; break }
    default { throw "Unknown object in ${Path}: expected an Autopilot profile, an ESP or a device preparation policy (template $devicePrepTemplateId)." }
}
if ($kind -ne 'DevicePrep' -and ($DeviceGroupName -or $CreateDeviceGroup)) {
    throw "-DeviceGroupName and -CreateDeviceGroup only apply to a device preparation policy."
}
$name = if ($kind -eq 'DevicePrep') { $policy.name } else { $policy.displayName }
if (-not $name) { throw "Name is missing in $Path" }

# --- Validate ------------------------------------------------------------------------------
switch ($kind) {
    'Profile' {
        # Intune answers a hyphen (or any other character outside this set) with a bare 500.
        if ($name -notmatch '^[\p{L}\p{N} :"?.@$&_\[\]{}|\\]+$') {
            throw "Autopilot profile name '$name' contains characters Intune rejects. Allowed: letters, digits, spaces and : `" ? . @ $ & _ [ ] { } | \"
        }
        # A NetBIOS name: 15 characters after the macros expand. %SERIAL% alone can exceed that.
        if ($policy.deviceNameTemplate -and $policy.deviceNameTemplate.Length -gt 15) {
            throw "deviceNameTemplate '$($policy.deviceNameTemplate)' is longer than 15 characters."
        }
        if ($policy.hardwareHashExtractionEnabled) {
            Write-Warning "hardwareHashExtractionEnabled is true: every Intune-managed device in the assigned group gets registered for Autopilot, and a registered device no longer runs device preparation."
        }
        $uri = "$graph/deviceManagement/windowsAutopilotDeploymentProfiles"
        $existing = Get-GraphCollection $uri | Where-Object { $_.displayName -eq $name }
    }
    'ESP' {
        $uri = "$graph/deviceManagement/deviceEnrollmentConfigurations"
        $existing = Get-GraphCollection $uri | Where-Object { $_.displayName -eq $name }
    }
    'DevicePrep' {
        $uri = "$graph/deviceManagement/configurationPolicies"
        $existing = Get-GraphCollection "$uri`?`$select=id,name" | Where-Object { $_.name -eq $name }
    }
}
if ($existing) {
    throw "'$name' already exists (id $(@($existing)[0].id)). Rename the file or delete the existing object first."
}

# --- Device group (device preparation) -----------------------------------------------------
$group = $null
if ($DeviceGroupName) {
    $escaped = $DeviceGroupName -replace "'", "''"
    $group = @(Get-GraphCollection "$graph/groups?`$filter=displayName eq '$escaped'&`$select=id,displayName,securityEnabled,mailEnabled")
    if ($group.Count -gt 1) { throw "More than one group is called '$DeviceGroupName'." }
    $group = $group | Select-Object -First 1

    $sp = (Invoke-MgGraphRequest -Method GET -Uri "$graph/servicePrincipals?`$filter=appId eq '$provisioningClientAppId'&`$select=id,displayName").value | Select-Object -First 1
    if (-not $sp) {
        if (-not $CreateDeviceGroup) { throw "The Intune Provisioning Client service principal ($provisioningClientAppId) does not exist in this tenant. Rerun with -CreateDeviceGroup, or create it with New-MgServicePrincipal -AppId $provisioningClientAppId." }
        if ($PSCmdlet.ShouldProcess($provisioningClientAppId, 'Create Intune Provisioning Client service principal')) {
            $sp = Invoke-MgGraphRequest -Method POST -Uri "$graph/servicePrincipals" -Body (@{ appId = $provisioningClientAppId } | ConvertTo-Json) -ContentType 'application/json'
            Write-Host "Created service principal: $($sp.displayName) ($($sp.id))"
        }
    }

    if (-not $group) {
        if (-not $CreateDeviceGroup) { throw "Group '$DeviceGroupName' not found. Rerun with -CreateDeviceGroup to create it." }
        if ($PSCmdlet.ShouldProcess($DeviceGroupName, 'Create security group owned by the Intune Provisioning Client')) {
            $body = @{
                displayName         = $DeviceGroupName
                description         = 'Devices enrolled with Windows Autopilot device preparation. Owned by the Intune Provisioning Client; membership is written by Intune during enrollment.'
                securityEnabled     = $true
                mailEnabled         = $false
                mailNickname        = ($DeviceGroupName -replace '[^a-zA-Z0-9]', '')
                'owners@odata.bind' = @("https://graph.microsoft.com/v1.0/servicePrincipals/$($sp.id)")
            } | ConvertTo-Json -Depth 5
            $group = Invoke-MgGraphRequest -Method POST -Uri "$graph/groups" -Body $body -ContentType 'application/json'
            Write-Host "Created group: $($group.displayName) ($($group.id))"
        }
    }
    elseif ($sp) {
        if (-not $group.securityEnabled -or $group.mailEnabled) { throw "Group '$DeviceGroupName' must be a security group without mail." }
        $owners = Get-GraphCollection "$graph/groups/$($group.id)/owners?`$select=id"
        if ($sp.id -notin $owners.id) {
            if (-not $CreateDeviceGroup) { throw "Group '$DeviceGroupName' is not owned by the Intune Provisioning Client. Rerun with -CreateDeviceGroup to add it as owner." }
            if ($PSCmdlet.ShouldProcess($DeviceGroupName, 'Add the Intune Provisioning Client as owner')) {
                $ref = @{ '@odata.id' = "https://graph.microsoft.com/v1.0/directoryObjects/$($sp.id)" } | ConvertTo-Json
                Invoke-MgGraphRequest -Method POST -Uri "$graph/groups/$($group.id)/owners/`$ref" -Body $ref -ContentType 'application/json' | Out-Null
                Write-Host "Added the Intune Provisioning Client as owner of '$DeviceGroupName'."
            }
        }
    }

    # What the portal shows. The membership target below is what Intune actually uses.
    if ($group) {
        $setting = $policy.settings | Where-Object { $_.settingInstance.settingDefinitionId -eq 'enrollment_autopilot_dpp_devicesecuritygroupids' }
        if ($setting) { $setting.settingInstance.simpleSettingValue.value = $group.id }
        $json = $policy | ConvertTo-Json -Depth 30
    }
}

# --- Create --------------------------------------------------------------------------------
if (-not $PSCmdlet.ShouldProcess($name, "Create ($kind)")) {
    Write-Host "WhatIf: would POST to $uri"
    Write-Host "        name: $name"
    if ($kind -eq 'DevicePrep') {
        Write-Host "        device group: $(if ($DeviceGroupName) { $DeviceGroupName } else { '(none - set it in the portal before assigning)' })"
    }
    return
}

$created = Invoke-MgGraphRequest -Method POST -Uri $uri -Body $json -ContentType 'application/json'
Write-Host "Created: $name (id $($created.id))"

if ($kind -eq 'ESP' -and $policy.priority) {
    # priority in the POST body is ignored; the order is only set through this action.
    $body = @{ priority = $policy.priority } | ConvertTo-Json
    Invoke-MgGraphRequest -Method POST -Uri "$uri/$($created.id)/setPriority" -Body $body -ContentType 'application/json' | Out-Null
    Write-Host "Priority set to $($policy.priority)."
}

if ($kind -eq 'DevicePrep' -and $group) {
    $body = @{
        enrollmentTimeDeviceMembershipTargets = @(@{
                '@odata.type' = 'microsoft.graph.enrollmentTimeDeviceMembershipTarget'
                targetType    = 'staticSecurityGroup'
                targetId      = $group.id
            })
    } | ConvertTo-Json -Depth 5
    $targetUri = "$uri('$($created.id)')/setEnrollmentTimeDeviceMembershipTarget"
    # The action answers 200 with a verdict. A freshly created group is not replicated yet and comes
    # back as securityGroupNotFound, which clears on its own; anything else is a real rejection.
    for ($attempt = 1; ; $attempt++) {
        $result = Invoke-MgGraphRequest -Method POST -Uri $targetUri -Body $body -ContentType 'application/json'
        if ($result.validationSucceeded) { Write-Host "Device group applied: $($group.displayName)"; break }
        $statuses = @($result.enrollmentTimeDeviceMembershipTargetValidationStatuses)
        $notReplicated = @($statuses | Where-Object { $_.targetValidationErrorCode -eq 'securityGroupNotFound' }).Count -gt 0
        if (-not $notReplicated -or $attempt -ge 6) {
            throw "Intune rejected the device group: $($statuses | ConvertTo-Json -Compress -Depth 5). The policy exists without a device group - fix the group and set it in the portal."
        }
        Start-Sleep -Seconds 10
    }
}

Write-Host ""
Write-Host "Still to do:"
switch ($kind) {
    'Profile' { Write-Host "  Assign to a device group of Autopilot-registered devices (Devices -> Enrollment -> Deployment profiles)." }
    'ESP' { Write-Host "  Assign to the same device group as the deployment profile (Devices -> Enrollment -> Enrollment Status Page)." }
    'DevicePrep' {
        Write-Host "  1. Assign apps and scripts to the device group, then add them to the policy (up to 25 apps, 10 scripts)."
        Write-Host "  2. Assign the policy to a USER group - device preparation follows the user who signs in."
    }
}
