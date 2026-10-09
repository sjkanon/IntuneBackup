#Requires -Version 7.0
#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Zet de baseline-policies uit IntuneTemplate/ rechtstreeks in een tenant, zonder CIPP, en wijst ze toe.

.DESCRIPTION
Leest de CIPP-templates uit IntuneTemplate/<platform>/ en maakt ze via Microsoft Graph aan in de
tenant waarmee Connect-MgGraph verbonden is. Idempotent: een policy met dezelfde naam wordt
vergeleken met het template en alleen bijgewerkt als de instellingen verschillen (Settings
Catalog met PUT, compliance met PATCH); anders blijft hij staan. Een tweede run zonder wijziging
in de repo doet dus niets.

Welke policies meegaan volgt uit _manifest.json, net als bij Set-BaselineAssignment.ps1: -Fase
(standaard 1), -Doelgroep (alle, fysiek, avd) en -Platform. Met -Name geef je zelf de lijst.

Ondersteunde policytypes:
  Settings Catalog (configurationPolicies)   aanmaken, vergelijken, bijwerken met PUT
  Compliance (deviceCompliancePolicies)      aanmaken met scheduledActionsForRule, bijwerken met PATCH
Overgeslagen, met melding:
  Administrative Templates (ADMX)            via CIPP of de portal
  Device Configurations (templates)          via CIPP of de portal; werken niet op multi-session
  App Protection                             via CIPP of de portal
  Inschrijfprofielen (enrollmentConfiguration) horen bij een ADE-token, niet bij een toewijzing

CIPP-variabelen. Een template kan `%naam%` bevatten (`%FSLogixStorageAccount%`, `%OrganizationId%`).
Het script vervangt die hoofdletterongevoelig, zoals CIPP's Get-CIPPTextReplacement, met de
waarden uit -Variables. tenantid, organizationid, tenantname, defaultdomain en initialdomain leidt
het zelf af uit GET /organization; -Variables gaat daar boven. Blijft er na het vervangen een
`%…%` over die geen Windows-omgevingsvariabele is (%ProgramFiles%, %SystemRoot% …), dan slaat het
script die policy over en meldt welke variabele ontbreekt: een FSLogix-pad met een letterlijk
`%FSLogixStorageAccount%` en PreventLoginWithFailure houdt iedereen buiten de sessiehost.

Toewijzing (tenzij -NoAssign):
  Settings Catalog met ' - D - '   alle apparaten
  Settings Catalog met ' - U - '   alle gebruikers
  Compliance                       alle apparaten — ook de ' - U - '-policies: op multi-session wordt
                                   gebruikersgerichte compliance niet ondersteund, en een
                                   apparaattoewijzing werkt op fysieke toestellen net zo goed
Met -FilterName krijgt elke toewijzing in de run dat filter (-FilterType, standaard include).
Zonder -FilterName krijgen de fysiek- en avd-policies hun klassefilter uit _assignments.json en
de alle-policies geen. Een bestaande toewijzing blijft staan; staat er al een toewijzing van
hetzelfde soort met een ánder filter, dan verandert het script niets en meldt het dat.

Oude policies uitsluiten. -ExcludeLegacyFromFilter zet het filter als *exclude* op de toewijzingen
van de oude policies die niet uit deze repo komen: Windows-policies waarvan de naam begint met het
voorvoegsel zonder ' - ' (standaard '[Baseline] X', niet '[Baseline] - WIN - D - X'), plus wat je
met -LegacyName noemt. De bestaande toewijzing blijft; alleen het filter komt erbij. Heeft een
toewijzing al een ander filter, dan weigert het script die policy. Zo krijgt de nieuwe klasse de
nieuwe set en houden de andere apparaten de oude, zonder Conflict op de klasse. Vereist
-FilterName.

Altijd eerst met -WhatIf: dan doet het script alleen GET-verzoeken en toont het het plan.

.PARAMETER Platform
WIN, MAC, IOS of AND. Standaard WIN.

.PARAMETER Doelgroep
Alleen policies uit deze apparaatklassen: alle, fysiek, avd. Niet-Windows-policies tellen als alle.

.PARAMETER Fase
De fasen uit _manifest.json die meegaan. Standaard 1.

.PARAMETER Name
Expliciete policynamen in plaats van de selectie op fase en doelgroep.

.PARAMETER FilterName
Naam van een toewijzingsfilter dat al in de tenant staat (aanmaken: Set-BaselineAssignment.ps1
-CreateFilters). Komt op elke toewijzing in deze run.

.PARAMETER FilterType
include (standaard) of exclude, voor -FilterName.

.PARAMETER Variables
Waarden voor de CIPP-variabelen, bijvoorbeeld @{ FSLogixStorageAccount = 'stfslogix01' }.

.PARAMETER ExcludeLegacyFromFilter
Zet -FilterName als exclude-filter op de toewijzingen van de oude policies (zie hierboven).

.PARAMETER LegacyNamePattern
Regex voor de namen van oude policies. Standaard: begint met het voorvoegsel zonder ' - '
('[Baseline]'), maar volgt niet de conventie '<prefix><PLATFORM> - <D|U> - <Item>'.

.PARAMETER LegacyName
Extra oude policies op naam (bijv. 'Windows 11 Update'), naast het patroon.

.PARAMETER NoAssign
Alleen aanmaken en bijwerken, niet toewijzen.

.PARAMETER TenantId
Verwachte tenant-ID. Wijkt de verbonden tenant af, dan stopt het script vóór er iets gebeurt.

.EXAMPLE
.\Deploy-BaselinePolicies.ps1 -Platform WIN -Doelgroep alle,avd -Fase 1 `
    -FilterName 'WIN - AVD Multi-session' -FilterType include `
    -Variables @{ FSLogixStorageAccount = 'stfslogix01' } -ExcludeLegacyFromFilter -WhatIf
De volledige baseline alleen op de AVD-sessiehosts, de oude set daar uitgesloten. Eerst als plan.

.EXAMPLE
.\Deploy-BaselinePolicies.ps1 -Platform WIN -Doelgroep fysiek -Fase 1 -WhatIf
De fysieke klasse, elk met zijn include-filter 'WIN - Physical' uit _assignments.json.
#>
# ConfirmImpact Medium: met High vraagt PowerShell per policy om bevestiging. -WhatIf is de proefrun.
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'Medium')]
param(
    [ValidateSet('WIN', 'MAC', 'IOS', 'AND')]
    [string]$Platform = 'WIN',

    [ValidateSet('alle', 'fysiek', 'avd')]
    [string[]]$Doelgroep,

    [ValidateRange(1, 5)]
    [int[]]$Fase = @(1),

    [string[]]$Name,

    [string]$FilterName,

    [ValidateSet('include', 'exclude')]
    [string]$FilterType = 'include',

    [hashtable]$Variables = @{},

    [switch]$ExcludeLegacyFromFilter,

    [string]$LegacyNamePattern,

    [string[]]$LegacyName = @(),

    [switch]$NoAssign,

    [string]$TenantId
)

$ErrorActionPreference = 'Stop'
$api = 'beta'
$repoRoot = Split-Path -Parent $PSScriptRoot
$templateRoot = Join-Path $repoRoot 'IntuneTemplate'

if ($ExcludeLegacyFromFilter -and -not $FilterName) { throw '-ExcludeLegacyFromFilter vraagt om -FilterName: het filter dat op de oude policies exclude wordt.' }

# Windows-omgevingsvariabelen staan in firewallregels en Defender-uitsluitingen en zijn géén
# CIPP-variabele. Die blijven staan en tellen niet als ontbrekend.
$WindowsEnvVars = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
@('ALLUSERSPROFILE', 'APPDATA', 'COMMONPROGRAMFILES', 'COMPUTERNAME', 'COMSPEC', 'DRIVERDATA', 'HOMEDRIVE',
    'HOMEPATH', 'LOCALAPPDATA', 'LOGONSERVER', 'NUMBER_OF_PROCESSORS', 'ONEDRIVE', 'ONEDRIVECOMMERCIAL', 'OS',
    'PATH', 'PATHEXT', 'PROCESSOR_ARCHITECTURE', 'PROGRAMDATA', 'PROGRAMFILES', 'PROGRAMW6432', 'PUBLIC',
    'SYSTEMDRIVE', 'SYSTEMROOT', 'TEMP', 'TMP', 'USERDOMAIN', 'USERNAME', 'USERPROFILE', 'WINDIR') |
    ForEach-Object { [void]$WindowsEnvVars.Add($_) }

# --- Graph ---------------------------------------------------------------------------
function Invoke-Graph {
    param([Parameter(Mandatory)][string]$Method, [Parameter(Mandatory)][string]$Uri, $Body)
    $params = @{ Method = $Method; Uri = $Uri }
    if ($null -ne $Body) {
        $params.Body = if ($Body -is [string]) { $Body } else { $Body | ConvertTo-Json -Depth 64 -Compress }
        $params.ContentType = 'application/json'
    }
    Invoke-MgGraphRequest @params
}

function Get-GraphCollection {
    <# Volgt @odata.nextLink: zonder paging mis je policies zodra er meer dan één pagina is. #>
    param([Parameter(Mandatory)][string]$Uri)
    $items = [System.Collections.Generic.List[object]]::new()
    $next = $Uri
    while ($next) {
        $response = Invoke-Graph -Method GET -Uri $next
        foreach ($v in @($response.value)) { if ($null -ne $v) { $items.Add($v) } }
        $next = $response.'@odata.nextLink'
    }
    return $items.ToArray()
}

# --- repo ----------------------------------------------------------------------------
$organisation = Get-Content -LiteralPath (Join-Path $templateRoot '_organisation.json') -Raw | ConvertFrom-Json
$prefix = $organisation.prefix
$prefixPattern = '^' + [regex]::Escape($prefix)
$manifest = Get-Content -LiteralPath (Join-Path $templateRoot '_manifest.json') -Raw | ConvertFrom-Json
$assignmentsRepo = Get-Content -LiteralPath (Join-Path $templateRoot '_assignments.json') -Raw | ConvertFrom-Json -AsHashtable
$manifestByName = @{}
foreach ($p in $manifest.policies) { $manifestByName[$p.displayName] = $p }

# Alle templates van het platform, op naam. Ook buiten de selectie: die namen zijn 'van de repo'
# en dus nooit een oude policy.
$templates = @{}
foreach ($file in Get-ChildItem -Path (Join-Path $templateRoot $Platform) -Filter 'Baseline_*.json' -File -Recurse) {
    $outer = Get-Content -LiteralPath $file.FullName -Raw | ConvertFrom-Json
    $inner = $outer.JSON | ConvertFrom-Json
    $templates[$inner.Displayname] = [pscustomobject]@{ Name = $inner.Displayname; Type = $inner.Type; RAWJson = $inner.RAWJson; File = $file.Name }
}
$allRepoNames = [System.Collections.Generic.HashSet[string]]::new([string[]]@(
    Get-ChildItem -Path $templateRoot -Filter 'Baseline_*.json' -File -Recurse | ForEach-Object {
        ((Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json).JSON | ConvertFrom-Json).Displayname
    }))

function Get-PolicyClass { param([string]$PolicyName)
    $e = $manifestByName[$PolicyName]; if ($e -and $e.doelgroep) { [string]$e.doelgroep } else { 'alle' } }

if ($Name) {
    $selected = @($Name)
} else {
    $selected = @($manifest.policies | Where-Object {
            $_.target -like "Baseline_$($Platform)_*" -and $Fase -contains [int]$_.fase -and
            (-not $Doelgroep -or $Doelgroep -contains (Get-PolicyClass $_.displayName))
        } | ForEach-Object { $_.displayName })
}
if ($selected.Count -eq 0) { throw 'Geen policies in de selectie (platform, fase, doelgroep).' }
Write-Host "$($selected.Count) policies geselecteerd: platform $Platform, fase $($Fase -join ','), doelgroep $(if ($Doelgroep) { $Doelgroep -join ',' } else { 'alle klassen' })" -ForegroundColor Cyan

# --- tenant ---------------------------------------------------------------------------
$context = Get-MgContext
if ($null -eq $context) {
    Connect-MgGraph -Scopes 'DeviceManagementConfiguration.ReadWrite.All' -NoWelcome | Out-Null
    $context = Get-MgContext
}
if ($TenantId -and $context.TenantId -ne $TenantId) { throw "Verbonden met tenant $($context.TenantId), verwacht $TenantId. Niets gedaan." }

$org = @((Invoke-Graph -Method GET -Uri 'v1.0/organization?$select=id,displayName,verifiedDomains').value)[0]
Write-Host "Tenant: $($org.displayName) ($($org.id))" -ForegroundColor Cyan
# Ingebouwde variabelen zoals CIPP ze kent; -Variables gaat erboven.
$vars = [System.Collections.Hashtable]::new([StringComparer]::OrdinalIgnoreCase)
$vars['tenantid'] = $org.id
$vars['organizationid'] = $org.id
$vars['tenantname'] = $org.displayName
$vars['defaultdomain'] = @($org.verifiedDomains | Where-Object { $_.isDefault })[0].name
$vars['initialdomain'] = @($org.verifiedDomains | Where-Object { $_.isInitial })[0].name
foreach ($k in $Variables.Keys) { $vars[$k] = [string]$Variables[$k] }

function Expand-TemplateVariable {
    <# Vervangt %naam% hoofdletterongevoelig, JSON-veilig (de tekst is een JSON-string), en geeft
       de variabelen terug die overblijven en geen Windows-omgevingsvariabele zijn. #>
    param([string]$Text)
    foreach ($k in $vars.Keys) {
        if ($null -eq $vars[$k]) { continue }
        $escaped = (ConvertTo-Json -InputObject ([string]$vars[$k]) -Compress).Trim('"').Replace('$', '$$')
        $Text = [regex]::Replace($Text, '%' + [regex]::Escape($k) + '%', $escaped, 'IgnoreCase')
    }
    $left = @([regex]::Matches($Text, '%([A-Za-z][A-Za-z0-9_]*)%') | ForEach-Object { $_.Groups[1].Value } |
            Where-Object { -not $WindowsEnvVars.Contains($_) } | Sort-Object -Unique)
    [pscustomobject]@{ Text = $Text; Missing = $left }
}

# Filters op naam: een id bestaat maar in één tenant.
$filtersByName = @{}
foreach ($f in Get-GraphCollection -Uri "$api/deviceManagement/assignmentFilters?`$select=id,displayName,platform") {
    if ($filtersByName.ContainsKey($f.displayName)) { $filtersByName[$f.displayName] = 'DUBBEL' } else { $filtersByName[$f.displayName] = $f }
}
function Resolve-Filter { param([string]$FilterDisplayName)
    $f = $filtersByName[$FilterDisplayName]
    if (-not $f) { throw "Toewijzingsfilter '$FilterDisplayName' bestaat niet in de tenant. Maak hem eerst aan: Set-BaselineAssignment.ps1 -CreateFilters, of uit IntuneTemplate/WIN/AssignmentFilters/." }
    if ($f -eq 'DUBBEL') { throw "Toewijzingsfilter '$FilterDisplayName' staat meer dan eens in de tenant — haal het dubbele weg." }
    $f }
$runFilter = if ($FilterName) { Resolve-Filter $FilterName } else { $null }
if ($runFilter) { Write-Host "Filter '$FilterName' ($FilterType) -> $($runFilter.id)" -ForegroundColor Cyan }

$tenantCatalog = @(Get-GraphCollection -Uri "$api/deviceManagement/configurationPolicies?`$select=id,name,platforms,technologies,roleScopeTagIds,templateReference")
$tenantCompliance = @(Get-GraphCollection -Uri "$api/deviceManagement/deviceCompliancePolicies")

# --- vergelijken ------------------------------------------------------------------------
# Graph geeft velden terug die een template niet heeft (null-referenties, @odata.context,
# auditRuleInformation) en laat andere weg (het @odata.type van een choiceSettingValue), en kan
# kinderen in een andere volgorde zetten. Vergelijken gebeurt daarom op een genormaliseerde vorm:
# zonder nulls en zonder @odata.type — de settingDefinitionId bepaalt het soort al.
$IgnoredKeys = @('@odata.context', '@odata.type', 'settingDefinitions', 'id')
function ConvertTo-Canonical {
    param($Node)
    if ($null -eq $Node) { return $null }
    if ($Node -is [System.Collections.IDictionary]) {
        $out = [ordered]@{}
        foreach ($k in ($Node.Keys | Sort-Object)) {
            if ($IgnoredKeys -contains $k) { continue }
            $v = $Node[$k]
            if ($null -eq $v) { continue }
            $out[$k] = ConvertTo-Canonical $v
        }
        return $out
    }
    if ($Node -is [System.Collections.IEnumerable] -and $Node -isnot [string]) {
        $items = @(foreach ($i in $Node) { , (ConvertTo-Canonical $i) })
        if ($items.Count -gt 0 -and $items[0] -is [System.Collections.IDictionary] -and $items[0].Contains('settingDefinitionId')) {
            $items = @($items | Sort-Object { $_['settingDefinitionId'] })
        }
        return , $items
    }
    return $Node
}
function Get-CanonicalJson { param($Node) (ConvertTo-Canonical $Node) | ConvertTo-Json -Depth 64 -Compress }

function Compare-CatalogSetting {
    <# Geeft de settingDefinitionId's terug die verschillen tussen template en tenant. #>
    param($TemplateSettings, $TenantSettings)
    $want = @{}; foreach ($s in $TemplateSettings) { $want[$s.settingInstance.settingDefinitionId] = Get-CanonicalJson $s.settingInstance }
    $have = @{}; foreach ($s in $TenantSettings) { $have[$s.settingInstance.settingDefinitionId] = Get-CanonicalJson $s.settingInstance }
    $diff = foreach ($k in (@($want.Keys) + @($have.Keys) | Sort-Object -Unique)) {
        if (-not $have.ContainsKey($k)) { "+$k" }
        elseif (-not $want.ContainsKey($k)) { "-$k" }
        elseif ($want[$k] -ne $have[$k]) { "~$k" }
    }
    @($diff)
}

# --- toewijzen --------------------------------------------------------------------------
function Get-TargetKey { param($T) "$($T.'@odata.type')|$($T.groupId)|$($T.deviceAndAppManagementAssignmentFilterId)|$($T.deviceAndAppManagementAssignmentFilterType)" }

function Set-PolicyAssignment {
    <# Voegt één doel toe aan de bestaande toewijzingen. Geeft een korte status terug. #>
    param([string]$Endpoint, [string]$Id, [string]$PolicyName, [hashtable]$Target)
    $existing = @(Get-GraphCollection -Uri "$api/deviceManagement/$Endpoint/$Id/assignments" | ForEach-Object { $_.target })
    $key = Get-TargetKey $Target
    if (@($existing | Where-Object { (Get-TargetKey $_) -eq $key }).Count -gt 0) { return 'al toegewezen' }
    $sameKind = @($existing | Where-Object { $_.'@odata.type' -eq $Target.'@odata.type' -and $_.groupId -eq $Target.groupId })
    if ($sameKind.Count -gt 0) {
        Write-Warning "'$PolicyName' heeft al $($Target.'@odata.type' -replace '#microsoft.graph.','') met een ander filter ($(@($sameKind | ForEach-Object { "$($_.deviceAndAppManagementAssignmentFilterType) $($_.deviceAndAppManagementAssignmentFilterId)" }) -join ', ')). Niets veranderd: pas het met de hand aan of gebruik Set-BaselineAssignment.ps1 -Replace."
        return 'NIET toegewezen: ander filter'
    }
    $body = @{ assignments = @(@($existing) + @($Target) | ForEach-Object { @{ target = $_ } }) }
    if ($PSCmdlet.ShouldProcess($PolicyName, 'toewijzing toevoegen')) {
        Invoke-Graph -Method POST -Uri "$api/deviceManagement/$Endpoint/$Id/assign" -Body $body | Out-Null
        return 'toegewezen'
    }
    return 'zou toegewezen worden'
}

function Get-DesiredTarget {
    param([string]$PolicyName, [string]$Kind)
    $odata = if ($Kind -eq 'Catalog' -and $PolicyName -match ' - U - ') { '#microsoft.graph.allLicensedUsersAssignmentTarget' } else { '#microsoft.graph.allDevicesAssignmentTarget' }
    $t = @{ '@odata.type' = $odata; deviceAndAppManagementAssignmentFilterId = $null; deviceAndAppManagementAssignmentFilterType = 'none' }
    $label = if ($odata -match 'allDevices') { 'alle apparaten' } else { 'alle gebruikers' }
    if ($runFilter) {
        $t.deviceAndAppManagementAssignmentFilterId = $runFilter.id; $t.deviceAndAppManagementAssignmentFilterType = $FilterType
        $label += " + $FilterType '$FilterName'"
    } else {
        $classFilter = @($assignmentsRepo[$PolicyName] | Where-Object { $_.filterDisplayName } | ForEach-Object { $_.filterDisplayName })[0]
        if ($classFilter) {
            $f = Resolve-Filter $classFilter
            $t.deviceAndAppManagementAssignmentFilterId = $f.id; $t.deviceAndAppManagementAssignmentFilterType = 'include'
            $label += " + include '$classFilter'"
        }
    }
    [pscustomobject]@{ Target = $t; Label = $label }
}

# --- uitrollen --------------------------------------------------------------------------
$results = [System.Collections.Generic.List[object]]::new()
function Add-Result { param($Type, $Policy, $Action, $Reason, $Assignment)
    $results.Add([pscustomobject]@{ Type = $Type; Policy = $Policy; Actie = $Action; Reden = $Reason; Toewijzing = $Assignment }) }

foreach ($policyName in $selected) {
    $tpl = $templates[$policyName]
    if (-not $tpl) { Add-Result '-' $policyName 'overgeslagen' 'geen template in de repo' ''; continue }
    $typeLabel = switch ($tpl.Type) { 'Catalog' { 'Settings Catalog' } 'deviceCompliancePolicies' { 'Compliance' } 'Admin' { 'ADMX' } 'Device' { 'Device Configuration' } default { $tpl.Type } }
    switch ($tpl.Type) {
        'Admin' { Add-Result $typeLabel $policyName 'overgeslagen' 'ADMX niet in dit script: via CIPP of de portal' ''; continue }
        'Device' { Add-Result $typeLabel $policyName 'overgeslagen' 'Device Configuration-template niet in dit script (werkt niet op multi-session): via CIPP of de portal' ''; continue }
        'AppProtection' { Add-Result $typeLabel $policyName 'overgeslagen' 'App Protection niet in dit script: via CIPP of de portal' ''; continue }
    }
    if ($tpl.Type -notin 'Catalog', 'deviceCompliancePolicies') { Add-Result $typeLabel $policyName 'overgeslagen' "onbekend templatetype '$($tpl.Type)'" ''; continue }

    $expanded = Expand-TemplateVariable $tpl.RAWJson
    if ($expanded.Missing.Count -gt 0) {
        Add-Result $typeLabel $policyName 'overgeslagen' "variabele zonder waarde: $(($expanded.Missing | ForEach-Object { "%$_%" }) -join ', ') — geef ze mee met -Variables" ''
        continue
    }
    $body = $expanded.Text | ConvertFrom-Json -AsHashtable

    try {
        $policyId = $null; $action = $null; $reason = ''
        if ($tpl.Type -eq 'Catalog') {
            $endpoint = 'configurationPolicies'
            if ($body.templateReference -and $body.templateReference.templateFamily -eq 'enrollmentConfiguration') {
                Add-Result $typeLabel $policyName 'overgeslagen' 'inschrijfprofiel: hoort bij een ADE-token' ''; continue
            }
            $matches_ = @($tenantCatalog | Where-Object { $_.name -eq $policyName })
            if ($matches_.Count -gt 1) { Add-Result $typeLabel $policyName 'overgeslagen' "$($matches_.Count)x in de tenant — eerst opruimen" ''; continue }
            if ($matches_.Count -eq 0) {
                if ($PSCmdlet.ShouldProcess($policyName, 'Settings Catalog-policy aanmaken')) {
                    $created = Invoke-Graph -Method POST -Uri "$api/deviceManagement/configurationPolicies" -Body $body
                    $policyId = $created.id; $action = 'aangemaakt'
                } else { $action = 'aanmaken' }
                $reason = "$(@($body.settings).Count) instellingen"
            } else {
                $existing = $matches_[0]; $policyId = $existing.id
                $tenantSettings = @(Get-GraphCollection -Uri "$api/deviceManagement/configurationPolicies('$policyId')/settings")
                $diff = Compare-CatalogSetting -TemplateSettings $body.settings -TenantSettings $tenantSettings
                if ($diff.Count -eq 0) { $action = 'ongewijzigd'; $reason = 'instellingen gelijk' }
                else {
                    $reason = "$($diff.Count) verschil(len): $(($diff | Select-Object -First 4) -join ', ')$(if ($diff.Count -gt 4) { ', …' })"
                    $put = @{
                        name              = $body.name
                        description       = $body.description
                        platforms         = $body.platforms
                        technologies      = $body.technologies
                        roleScopeTagIds   = @(if ($existing.roleScopeTagIds) { $existing.roleScopeTagIds } else { '0' })
                        templateReference = $body.templateReference
                        settings          = $body.settings
                    }
                    if ($PSCmdlet.ShouldProcess($policyName, 'Settings Catalog-policy bijwerken (PUT)')) {
                        Invoke-Graph -Method PUT -Uri "$api/deviceManagement/configurationPolicies('$policyId')" -Body $put | Out-Null
                        $action = 'bijgewerkt'
                    } else { $action = 'bijwerken' }
                }
            }
        } else {
            $endpoint = 'deviceCompliancePolicies'
            foreach ($ro in 'id', 'createdDateTime', 'lastModifiedDateTime', 'version') { $body.Remove($ro) }
            if (-not $body.scheduledActionsForRule) {
                # Verplicht bij aanmaken: zonder deze regel weigert Graph de policy.
                $body.scheduledActionsForRule = @(@{ ruleName = 'PasswordRequired'; scheduledActionConfigurations = @(@{ actionType = 'block'; gracePeriodHours = 0; notificationTemplateId = ''; notificationMessageCCList = @() }) })
            }
            $matches_ = @($tenantCompliance | Where-Object { $_.displayName -eq $policyName })
            if ($matches_.Count -gt 1) { Add-Result $typeLabel $policyName 'overgeslagen' "$($matches_.Count)x in de tenant — eerst opruimen" ''; continue }
            if ($matches_.Count -eq 0) {
                if ($PSCmdlet.ShouldProcess($policyName, 'compliancepolicy aanmaken')) {
                    $created = Invoke-Graph -Method POST -Uri "$api/deviceManagement/deviceCompliancePolicies" -Body $body
                    $policyId = $created.id; $action = 'aangemaakt'
                } else { $action = 'aanmaken' }
            } else {
                $existing = $matches_[0]; $policyId = $existing.id
                if ($existing.'@odata.type' -ne $body.'@odata.type') { Add-Result $typeLabel $policyName 'overgeslagen' "ander type in de tenant ($($existing.'@odata.type'))" ''; continue }
                $patch = @{ '@odata.type' = $body.'@odata.type' }
                foreach ($k in $body.Keys) {
                    if ($k -in '@odata.type', 'scheduledActionsForRule', 'roleScopeTagIds') { continue }
                    if ((Get-CanonicalJson @{ v = $body[$k] }) -ne (Get-CanonicalJson @{ v = $existing[$k] })) { $patch[$k] = $body[$k] }
                }
                $changed = @($patch.Keys | Where-Object { $_ -ne '@odata.type' })
                if ($changed.Count -eq 0) { $action = 'ongewijzigd'; $reason = 'velden gelijk' }
                else {
                    $reason = "$($changed.Count) veld(en): $(($changed | Sort-Object | Select-Object -First 4) -join ', ')$(if ($changed.Count -gt 4) { ', …' })"
                    if ($PSCmdlet.ShouldProcess($policyName, 'compliancepolicy bijwerken (PATCH)')) {
                        Invoke-Graph -Method PATCH -Uri "$api/deviceManagement/deviceCompliancePolicies/$policyId" -Body $patch | Out-Null
                        $action = 'bijgewerkt'
                    } else { $action = 'bijwerken' }
                }
            }
        }

        $assignText = ''
        if (-not $NoAssign) {
            $desired = Get-DesiredTarget -PolicyName $policyName -Kind $tpl.Type
            $status = if ($policyId) { Set-PolicyAssignment -Endpoint $endpoint -Id $policyId -PolicyName $policyName -Target $desired.Target } else { 'zou toegewezen worden' }
            $assignText = "$($desired.Label): $status"
        }
        Add-Result $typeLabel $policyName $action $reason $assignText
    } catch {
        Write-Error "$policyName — mislukt: $_" -ErrorAction Continue
        Add-Result $typeLabel $policyName 'MISLUKT' "$_" ''
    }
}

# --- oude policies uitsluiten -------------------------------------------------------------
$legacyResults = [System.Collections.Generic.List[object]]::new()
if ($ExcludeLegacyFromFilter) {
    if (-not $LegacyNamePattern) {
        $stem = $prefix.TrimEnd().TrimEnd('-').TrimEnd()
        $LegacyNamePattern = '^' + [regex]::Escape($stem)
    }
    $conventionPattern = "$prefixPattern(WIN|MAC|IOS|AND) - [DU] - "
    $legacyTypes = @(
        @{ Label = 'Settings Catalog'; Endpoint = 'configurationPolicies'; Uri = "$api/deviceManagement/configurationPolicies?`$select=id,name,platforms"; NameField = 'name'; IsWindows = { param($p) $p.platforms -match 'windows' } }
        @{ Label = 'ADMX'; Endpoint = 'groupPolicyConfigurations'; Uri = "$api/deviceManagement/groupPolicyConfigurations?`$select=id,displayName"; NameField = 'displayName'; IsWindows = { param($p) $true } }
        @{ Label = 'Device Configuration'; Endpoint = 'deviceConfigurations'; Uri = "$api/deviceManagement/deviceConfigurations?`$select=id,displayName"; NameField = 'displayName'; IsWindows = { param($p) $p.'@odata.type' -match 'windows|edition|sharedPC' } }
        @{ Label = 'Compliance'; Endpoint = 'deviceCompliancePolicies'; Uri = "$api/deviceManagement/deviceCompliancePolicies?`$select=id,displayName"; NameField = 'displayName'; IsWindows = { param($p) $p.'@odata.type' -match 'windows' } }
    )
    $outside = [System.Collections.Generic.List[string]]::new()
    foreach ($lt in $legacyTypes) {
        foreach ($p in Get-GraphCollection -Uri $lt.Uri) {
            $pName = $p.($lt.NameField)
            if ($allRepoNames.Contains($pName) -or $pName -match $conventionPattern) { continue }
            if (-not (& $lt.IsWindows $p)) { continue }
            $isLegacy = ($pName -match $LegacyNamePattern) -or ($LegacyName -contains $pName)
            $assignments = @(Get-GraphCollection -Uri "$api/deviceManagement/$($lt.Endpoint)/$($p.id)/assignments" | ForEach-Object { $_.target })
            if (-not $isLegacy) {
                $open = @($assignments | Where-Object { $_.'@odata.type' -ne '#microsoft.graph.exclusionGroupAssignmentTarget' -and $_.deviceAndAppManagementAssignmentFilterId -ne $runFilter.id })
                if ($open.Count -gt 0) { $outside.Add("$pName ($($lt.Label))") }
                continue
            }
            if ($assignments.Count -eq 0) { $legacyResults.Add([pscustomobject]@{ Type = $lt.Label; Policy = $pName; Actie = 'niets'; Reden = 'niet toegewezen' }); continue }

            $newTargets = @(); $changed = 0; $conflict = $null
            foreach ($t in $assignments) {
                $copy = @{}; foreach ($k in $t.Keys) { $copy[$k] = $t[$k] }
                if ($copy.'@odata.type' -eq '#microsoft.graph.exclusionGroupAssignmentTarget') { $newTargets += $copy; continue }
                $ft = [string]$copy.deviceAndAppManagementAssignmentFilterType
                if (-not $ft -or $ft -eq 'none') {
                    $copy.deviceAndAppManagementAssignmentFilterId = $runFilter.id
                    $copy.deviceAndAppManagementAssignmentFilterType = 'exclude'
                    $changed++
                } elseif ($copy.deviceAndAppManagementAssignmentFilterId -eq $runFilter.id -and $ft -eq 'exclude') {
                    # al uitgesloten
                } else {
                    $conflict = "$ft-filter $($copy.deviceAndAppManagementAssignmentFilterId) op $($copy.'@odata.type' -replace '#microsoft.graph.','')"
                }
                $newTargets += $copy
            }
            if ($conflict) { $legacyResults.Add([pscustomobject]@{ Type = $lt.Label; Policy = $pName; Actie = 'GEWEIGERD'; Reden = "heeft al een ander filter ($conflict)" }); continue }
            if ($changed -eq 0) { $legacyResults.Add([pscustomobject]@{ Type = $lt.Label; Policy = $pName; Actie = 'al uitgesloten'; Reden = "exclude '$FilterName'" }); continue }
            $assignBody = @{ assignments = @($newTargets | ForEach-Object { @{ target = $_ } }) }
            if ($PSCmdlet.ShouldProcess($pName, "exclude-filter '$FilterName' toevoegen aan $changed toewijzing(en)")) {
                try {
                    Invoke-Graph -Method POST -Uri "$api/deviceManagement/$($lt.Endpoint)/$($p.id)/assign" -Body $assignBody | Out-Null
                    $legacyResults.Add([pscustomobject]@{ Type = $lt.Label; Policy = $pName; Actie = 'uitgesloten'; Reden = "$changed toewijzing(en) + exclude '$FilterName'" })
                } catch {
                    Write-Error "$pName — uitsluiten mislukt: $_" -ErrorAction Continue
                    $legacyResults.Add([pscustomobject]@{ Type = $lt.Label; Policy = $pName; Actie = 'MISLUKT'; Reden = "$_" })
                }
            } else {
                $legacyResults.Add([pscustomobject]@{ Type = $lt.Label; Policy = $pName; Actie = 'uitsluiten'; Reden = "$changed toewijzing(en) + exclude '$FilterName'" })
            }
        }
    }
    if ($outside.Count -gt 0) {
        Write-Warning "Toegewezen Windows-policies buiten de repo en buiten het patroon '$LegacyNamePattern', zonder uitsluiting — niet aangeraakt (voeg ze toe met -LegacyName als ze van de klasse af moeten):"
        $outside | ForEach-Object { Write-Warning "  $_" }
    }
}

# --- verslag -----------------------------------------------------------------------------
# Regels in plaats van Format-Table: een tabel met lange namen wordt in een smalle console of een
# logbestand afgekapt, en juist de reden en de toewijzing moeten leesbaar blijven.
Write-Host "`nPolicies" -ForegroundColor Cyan
foreach ($r in $results) {
    Write-Host ('  {0,-13} {1,-20} {2}' -f $r.Actie, $r.Type, $r.Policy)
    if ($r.Reden) { Write-Host "      $($r.Reden)" -ForegroundColor DarkGray }
    if ($r.Toewijzing) { Write-Host "      toewijzing: $($r.Toewijzing)" -ForegroundColor DarkGray }
}
Write-Host 'Samenvatting per type en actie' -ForegroundColor Cyan
$results | Group-Object Type, Actie | Sort-Object Name | ForEach-Object { Write-Host ('  {0,-45} {1,4}' -f $_.Name, $_.Count) }
if ($ExcludeLegacyFromFilter) {
    Write-Host "`nOude policies (exclude '$FilterName')" -ForegroundColor Cyan
    foreach ($r in $legacyResults) { Write-Host ('  {0,-15} {1,-20} {2} — {3}' -f $r.Actie, $r.Type, $r.Policy, $r.Reden) }
}

$failed = @($results | Where-Object Actie -eq 'MISLUKT') + @($legacyResults | Where-Object Actie -in 'MISLUKT', 'GEWEIGERD')
$skippedVars = @($results | Where-Object { $_.Actie -eq 'overgeslagen' -and $_.Reden -like 'variabele*' })
if ($skippedVars.Count -gt 0) { Write-Warning "$($skippedVars.Count) policy/policies overgeslagen om een ontbrekende variabele — zie de kolom Reden." }
if ($failed.Count -gt 0) { throw "$($failed.Count) actie(s) mislukt of geweigerd — zie hierboven." }
