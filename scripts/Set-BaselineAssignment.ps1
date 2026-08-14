#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Wijst de baseline-policies in een tenant toe aan All Devices, All Users of een groep.

.DESCRIPTION
Zoekt in de tenant de policies op die in IntuneTemplate/ staan — over alle vijf de
policytypes heen (Settings Catalog, Administrative Templates/ADMX, klassieke Device
Configurations, compliance-policies en App Protection/MAM) — en zet daar in één keer een
assignment op.

De policylijst komt standaard uit IntuneTemplate/, niet uit een naamfilter op "[Baseline]".
Dat is bewust: een policy die de prefix (nog) niet draagt zou stilzwijgend worden
overgeslagen. Met -Name kun je een eigen lijst opgeven.

Assignments worden standaard AANGEVULD, niet vervangen. Graph's /assign-endpoint overschrijft
namelijk altijd de volledige lijst, dus dit script leest eerst de bestaande assignments en
POST't de samenvoeging. Met -Replace gooi je de bestaande juist weg.

.PARAMETER AllDevices
Wijst toe aan alle apparaten (#microsoft.graph.allDevicesAssignmentTarget).

.PARAMETER AllUsers
Wijst toe aan alle gelicentieerde gebruikers (#microsoft.graph.allLicensedUsersAssignmentTarget).

.PARAMETER GroupId
Object-id van de Entra-groep waaraan toegewezen wordt.

.PARAMETER GroupName
Weergavenaam van de Entra-groep; wordt opgezocht en moet exact één groep opleveren.

.PARAMETER Exclude
Maakt er een uitsluiting van in plaats van een toewijzing. Alleen zinvol bij een groep.

.PARAMETER Name
Expliciete policynamen in plaats van de lijst uit IntuneTemplate/.

.PARAMETER Scope
Beperkt de policylijst tot device-scoped ('D') of user-scoped ('U') policies, op basis van de
"[Baseline] - PLATFORM - D/U - Item"-naamconventie. Standaard 'Both': dan blijft de lijst
ongefilterd, inclusief policies die die conventie (nog) niet volgen. Werkt ook op -Name.

.PARAMETER Platform
Beperkt de policylijst tot één platform: 'WIN', 'MAC', 'IOS' of 'AND'. Standaard 'All'.
Handig om een nieuw platform apart uit te rollen zonder de Windows-baseline aan te raken.

.PARAMETER Replace
Vervangt bestaande assignments in plaats van ze aan te vullen.

.PARAMETER FilterId
Object-id van een assignmentfilter dat op de assignment gezet wordt.

.PARAMETER FilterType
'include' of 'exclude' — verplicht samen met -FilterId.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -AllDevices -WhatIf
Laat zien wat er zou gebeuren, zonder iets te wijzigen.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -GroupName 'SEC-Baseline-Pilot'

.EXAMPLE
.\Set-BaselineAssignment.ps1 -AllDevices -Replace
Gooit bestaande assignments weg en zet alleen All Devices erop.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -Scope D -AllDevices
.\Set-BaselineAssignment.ps1 -Scope U -AllUsers
De dagelijkse bediening: device-policies naar apparaten, user-policies naar gebruikers.

.EXAMPLE
.\Set-BaselineAssignment.ps1 -Platform MAC -Scope D -AllDevices -WhatIf
Alleen de macOS-device-policies, eerst als dry run.
#>
# ConfirmImpact bewust op Medium: met High vraagt PowerShell per policy om bevestiging en
# klik je je bij bijna honderd policies suf. Draai eerst -WhatIf; dat is hier de dry run.
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

    [string]$FilterId,

    [ValidateSet('include', 'exclude')]
    [string]$FilterType,

    [ValidateSet('beta', 'v1.0')]
    [string]$ApiVersion = 'beta'
)

$ErrorActionPreference = 'Stop'

# Settings Catalog gebruikt 'name', de rest 'displayName' — anders vindt de match niets.
#
# App Protection staat apart: je vindt de policies via managedAppPolicies, maar toewijzen kan
# alleen via de platformspecifieke collectie (iosManagedAppProtections /
# androidManagedAppProtections). Een POST naar managedAppPolicies/{id}/assign bestaat niet.
$PolicyTypes = @(
    [pscustomobject]@{ Label = 'Settings Catalog';        Endpoint = 'deviceManagement/configurationPolicies';      NameField = 'name' }
    [pscustomobject]@{ Label = 'Administrative Template'; Endpoint = 'deviceManagement/groupPolicyConfigurations';  NameField = 'displayName' }
    [pscustomobject]@{ Label = 'Device Configuration';    Endpoint = 'deviceManagement/deviceConfigurations';       NameField = 'displayName' }
    [pscustomobject]@{ Label = 'Compliance Policy';       Endpoint = 'deviceManagement/deviceCompliancePolicies';   NameField = 'displayName' }
    [pscustomobject]@{ Label = 'App Protection';          Endpoint = 'deviceAppManagement/managedAppPolicies';      NameField = 'displayName' }
)

# @odata.type van een app protection-policy -> de collectie waar /assign wél op werkt.
$AppProtectionEndpoints = @{
    '#microsoft.graph.iosManagedAppProtection'              = 'deviceAppManagement/iosManagedAppProtections'
    '#microsoft.graph.androidManagedAppProtection'          = 'deviceAppManagement/androidManagedAppProtections'
    '#microsoft.graph.mdmWindowsInformationProtectionPolicy' = 'deviceAppManagement/mdmWindowsInformationProtectionPolicies'
    '#microsoft.graph.windowsInformationProtectionPolicy'   = 'deviceAppManagement/windowsInformationProtectionPolicies'
    '#microsoft.graph.targetedManagedAppConfiguration'      = 'deviceAppManagement/targetedManagedAppConfigurations'
}

function Get-GraphCollection {
    <# Volgt @odata.nextLink; zonder paginering mis je policies zodra een tenant er meer dan
       één pagina van heeft — precies het soort stille omissie dat hier niet mag. #>
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
    <# Leest de Displayname uit de CIPP-templates in IntuneTemplate/ (genestelde JSON-string).
       -Recurse omdat de templates per platform en policytype in submappen staan. #>
    param([Parameter(Mandatory)][string]$TemplateDir)

    Get-ChildItem -Path $TemplateDir -Filter 'Baseline_*.json' -File -Recurse | ForEach-Object {
        ((Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json).JSON | ConvertFrom-Json).Displayname
    }
}

function Get-TargetKey {
    <# Twee targets zijn hetzelfde als type, groep én filter gelijk zijn. Zonder deze sleutel
       zou aanvullen elke run een duplicaat toevoegen. #>
    param($Target)

    $type = $Target.'@odata.type'
    $group = $Target.groupId
    $filter = $Target.deviceAndAppManagementAssignmentFilterId
    $filterType = $Target.deviceAndAppManagementAssignmentFilterType
    return "$type|$group|$filter|$filterType"
}

# --- doelgroep bepalen ---------------------------------------------------------------
if ($FilterId -and -not $FilterType) { throw "-FilterId vereist ook -FilterType ('include' of 'exclude')." }
if ($FilterType -and -not $FilterId) { throw "-FilterType vereist ook -FilterId." }

if ($null -eq (Get-MgContext)) {
    Connect-MgGraph -Scopes 'DeviceManagementConfiguration.ReadWrite.All', 'Group.Read.All' | Out-Null
}

$resolvedGroupId = $GroupId
if ($GroupName) {
    $escaped = $GroupName.Replace("'", "''")
    $groups = Get-GraphCollection -Uri "v1.0/groups?`$filter=displayName eq '$escaped'&`$select=id,displayName"
    if ($groups.Count -eq 0) { throw "Geen groep gevonden met displayName '$GroupName'." }
    if ($groups.Count -gt 1) { throw "$($groups.Count) groepen heten '$GroupName' — gebruik -GroupId om de juiste aan te wijzen." }
    $resolvedGroupId = $groups[0].id
    Write-Host "Groep '$GroupName' -> $resolvedGroupId" -ForegroundColor Cyan
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

# --- policylijst bepalen -------------------------------------------------------------
if ($Name) {
    $wanted = $Name
} else {
    $templateDir = Join-Path (Split-Path -Parent $PSScriptRoot) 'IntuneTemplate'
    if (-not (Test-Path $templateDir)) { throw "IntuneTemplate/ niet gevonden op $templateDir — geef -Name mee om zonder de repo te draaien." }
    $wanted = @(Get-TemplateDisplayName -TemplateDir $templateDir)
}
if ($wanted.Count -eq 0) { throw 'Geen policynamen om toe te wijzen.' }

# Scope-filter: device-policies horen naar apparaten, user-policies naar gebruikers. De scope
# leest het script uit de naam ("[Baseline] - D - Item"), want dat is het enige wat zowel de
# repo als de tenant kent — een policy-id zegt er niets over. Policies die de conventie nog
# niet volgen vallen dus buiten elk scope-filter; dat is bewust zichtbaar in plaats van stil,
# anders wijs je na een halve migratie de helft van de baseline niet meer toe.
if ($Scope -ne 'Both' -or $Platform -ne 'All') {
    $before = $wanted
    $notConvention = @($before | Where-Object { $_ -notmatch '^\[Baseline\] - (WIN|MAC|IOS|AND) - [DU] - ' })
    if ($notConvention.Count -gt 0) {
        Write-Warning "$($notConvention.Count) policy/policies volgen de '[Baseline] - PLATFORM - D/U - Item'-conventie niet en vallen buiten élk filter:"
        $notConvention | ForEach-Object { Write-Warning "  $_" }
    }

    $platformPattern = if ($Platform -eq 'All') { '(WIN|MAC|IOS|AND)' } else { $Platform }
    $scopePattern = if ($Scope -eq 'Both') { '[DU]' } else { $Scope }
    $wanted = @($before | Where-Object { $_ -match "^\[Baseline\] - $platformPattern - $scopePattern - " })

    if ($wanted.Count -eq 0) {
        throw "Geen policies gevonden voor platform '$Platform' en scope '$Scope'. Draai zonder filter om alles toe te wijzen."
    }
}

Write-Host "$($wanted.Count) policies uit de baseline, doel: $($target.'@odata.type')$(if ($resolvedGroupId) { " ($resolvedGroupId)" })" -ForegroundColor Cyan
if ($Scope -ne 'Both') { Write-Host "Scope-filter: $Scope" -ForegroundColor Cyan }
if ($Platform -ne 'All') { Write-Host "Platformfilter: $Platform" -ForegroundColor Cyan }
Write-Host ("Modus: {0}" -f $(if ($Replace) { 'bestaande assignments VERVANGEN' } else { 'aanvullen op bestaande assignments' })) -ForegroundColor Cyan

# --- policies ophalen ----------------------------------------------------------------
$found = @{}
foreach ($type in $PolicyTypes) {
    # Bij App Protection geen $select: de @odata.type is nodig om te bepalen op welke
    # collectie /assign werkt, en die kun je niet selecteren.
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
                Write-Warning "'$policyName' heeft een onbekend app protection-type ($($policy.'@odata.type')) — overgeslagen."
                continue
            }
        }

        if ($found.ContainsKey($policyName)) {
            Write-Warning "'$policyName' bestaat meerdere keren in de tenant — alleen de eerste ($($found[$policyName].Label)) wordt toegewezen."
            continue
        }
        $found[$policyName] = [pscustomobject]@{ Id = $policy.id; Label = $type.Label; Endpoint = $endpoint; Name = $policyName }
    }
}

# --- toewijzen -----------------------------------------------------------------------
$results = foreach ($policyName in $wanted) {
    if (-not $found.ContainsKey($policyName)) {
        [pscustomobject]@{ Policy = $policyName; Type = '-'; Actie = 'NIET GEVONDEN'; Assignments = 0 }
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
        [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Actie = 'al toegewezen'; Assignments = $targets.Count }
        continue
    }
    [void]$targets.Add($target)

    $body = @{ assignments = @($targets | ForEach-Object { @{ target = $_ } }) } | ConvertTo-Json -Depth 10
    if ($PSCmdlet.ShouldProcess($policyName, "assignment zetten ($($targets.Count) target(s))")) {
        try {
            Invoke-MgGraphRequest -Method POST -Uri "$uri/assign" -Body $body | Out-Null
            [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Actie = $(if ($Replace) { 'vervangen' } else { 'toegevoegd' }); Assignments = $targets.Count }
        } catch {
            Write-Error "$policyName - assignment mislukt: $_" -ErrorAction Continue
            [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Actie = 'MISLUKT'; Assignments = 0 }
        }
    } else {
        [pscustomobject]@{ Policy = $policyName; Type = $policy.Label; Actie = 'overgeslagen (WhatIf)'; Assignments = $targets.Count }
    }
}

$results | Format-Table -AutoSize

$missing = @($results | Where-Object Actie -eq 'NIET GEVONDEN')
$failed = @($results | Where-Object Actie -eq 'MISLUKT')
if ($missing.Count -gt 0) {
    Write-Warning "$($missing.Count) policy/policies staan niet in de tenant. Rol ze eerst uit (CIPP, of Start-IntuneRestoreConfig op export/NativeImport/IntuneBackupAndRestore/) en draai dit script opnieuw."
}
if ($failed.Count -gt 0) { throw "$($failed.Count) assignment(s) mislukt — zie de fouten hierboven." }
