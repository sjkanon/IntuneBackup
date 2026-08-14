#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Brengt de policynamen in een tenant op de huidige conventie, volgens IntuneTemplate/_renames.json.

.DESCRIPTION
De baseline is twee keer hernoemd: eerst naar "[Baseline] - D/U - Item", daarna naar
"[Baseline] - PLATFORM - D/U - Item". In een tenant kan een policy dus nog onder een van
twee oude namen staan. Dit script zoekt ze op en hernoemt ze.

Hernoemen en niet opnieuw uitrollen: een PATCH laat het policy-id, de assignments en de
toewijzingsgeschiedenis intact. Start-IntuneRestoreConfig maakt policies aan op naam en zou
onder de nieuwe naam een duplicaat naast de oude zetten — twee policies met overlappende,
mogelijk conflicterende instellingen op dezelfde apparaten.

Drie soorten regels in _renames.json:

  rename   PATCH op de naam. Dat is alles wat dit script doet; de inhoud werk je daarna bij
           via CIPP of Start-IntuneRestoreConfig.
  replace  Het policytype zelf verandert (ander endpoint of andere templateReference). Dat
           kan geen PATCH zijn. Het script meldt het en raakt niets aan — de oude policy moet
           weg en de nieuwe erbij, in die volgorde en met een controle ertussen.
  retire   Gaat helemaal weg; de instellingen zitten voortaan in andere policies. Ook hier
           alleen een melding: verwijderen is onomkeerbaar en hoort een bewuste handeling te
           zijn, niet iets wat een naamscript en passant doet.

Draai altijd eerst met -WhatIf.

.PARAMETER WhatIf
Toont wat er zou gebeuren zonder iets te wijzigen.

.EXAMPLE
.\Rename-BaselinePolicy.ps1 -WhatIf
Verplichte eerste run: controleer dat elke oude naam precies één keer gevonden wordt.

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

# Settings Catalog gebruikt 'name', de rest 'displayName' — dezelfde valkuil als in
# Set-BaselineAssignment.ps1: een PATCH op het verkeerde veld levert geen fout op, alleen een
# policy die niet hernoemd is.
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
if (-not (Test-Path $RenamesPath)) { throw "_renames.json niet gevonden op $RenamesPath" }
$renames = (Get-Content -LiteralPath $RenamesPath -Raw | ConvertFrom-Json).policies

if ($null -eq (Get-MgContext)) {
    Connect-MgGraph -Scopes 'DeviceManagementConfiguration.ReadWrite.All', 'DeviceManagementApps.ReadWrite.All' | Out-Null
}

# Alles één keer ophalen: per policy alle vijf de collecties langsgaan zou bij ~25 regels
# 125 aanroepen kosten.
Write-Host 'Policies ophalen uit de tenant...' -ForegroundColor Cyan
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
Write-Host "$($inTenant.Count) policies gevonden.`n" -ForegroundColor Cyan

$results = foreach ($rename in $renames) {
    $current = @($inTenant | Where-Object { $rename.previousNames -contains $_.Name })
    $alreadyDone = @($inTenant | Where-Object { $rename.target -and $_.Name -eq $rename.target })

    if ($current.Count -eq 0) {
        $state = if ($alreadyDone.Count -gt 0) { 'al bijgewerkt' } else { 'niet in tenant' }
        [pscustomobject]@{ Policy = ($rename.previousNames -join ' / '); Type = '-'; Actie = $state; Naar = $rename.target }
        continue
    }
    if ($current.Count -gt 1) {
        Write-Warning "'$($rename.previousNames -join " / ")' komt $($current.Count) keer voor in de tenant — waarschijnlijk duplicaten. Handmatig opruimen; overgeslagen."
        [pscustomobject]@{ Policy = $current[0].Name; Type = $current[0].Label; Actie = 'DUPLICAAT'; Naar = $rename.target }
        continue
    }

    $policy = $current[0]

    if ($rename.action -ne 'rename') {
        # replace/retire: alleen melden. Zie de kop voor waarom dit script niets verwijdert.
        $vervangers = if ($rename.replacedBy) { $rename.replacedBy -join ', ' } else { $rename.target }
        Write-Warning "'$($policy.Name)' vraagt om '$($rename.action)', niet om hernoemen: $($rename.reason)"
        Write-Warning "  Vervangen door: $vervangers"
        [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Actie = $rename.action.ToUpper(); Naar = $vervangers }
        continue
    }

    if ($alreadyDone.Count -gt 0) {
        Write-Warning "'$($policy.Name)' bestaat nog én '$($rename.target)' bestaat al — hernoemen zou twee policies met dezelfde naam opleveren. Overgeslagen."
        [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Actie = 'BEIDE AANWEZIG'; Naar = $rename.target }
        continue
    }

    $body = @{ $policy.NameField = $rename.target } | ConvertTo-Json
    if ($PSCmdlet.ShouldProcess($policy.Name, "hernoemen naar '$($rename.target)'")) {
        try {
            Invoke-MgGraphRequest -Method PATCH -Uri "$ApiVersion/$($policy.Endpoint)/$($policy.Id)" -Body $body | Out-Null
            [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Actie = 'hernoemd'; Naar = $rename.target }
        } catch {
            Write-Error "$($policy.Name) - hernoemen mislukt: $_" -ErrorAction Continue
            [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Actie = 'MISLUKT'; Naar = $rename.target }
        }
    } else {
        [pscustomobject]@{ Policy = $policy.Name; Type = $policy.Label; Actie = 'overgeslagen (WhatIf)'; Naar = $rename.target }
    }
}

$results | Format-Table -AutoSize

$failed = @($results | Where-Object Actie -eq 'MISLUKT')
$manual = @($results | Where-Object { $_.Actie -in @('REPLACE', 'RETIRE', 'DUPLICAAT', 'BEIDE AANWEZIG') })
if ($manual.Count -gt 0) {
    Write-Warning "$($manual.Count) policy/policies vragen om handwerk — zie de waarschuwingen hierboven en _renames.json."
}
Write-Host "`nDaarna: werk de inhoud bij via CIPP of Start-IntuneRestoreConfig, en controleer met" -ForegroundColor Cyan
Write-Host "  .\Set-BaselineAssignment.ps1 -Scope D -AllDevices -WhatIf   (moet 'al toegewezen' melden)" -ForegroundColor Cyan
if ($failed.Count -gt 0) { throw "$($failed.Count) hernoeming(en) mislukt — zie de fouten hierboven." }
