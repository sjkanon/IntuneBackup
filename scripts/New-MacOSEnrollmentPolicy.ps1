#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Maakt een macOS ADE-enrollmentprofiel aan uit een JSON-bestand, of exporteert bestaande
profielen naar JSON.

.DESCRIPTION
ADE-enrollmentprofielen (depMacOSEnrollmentProfile) hangen onder een ABM-token en vallen
buiten IntuneTemplate/ — zie enrollment/macos/README.md voor het waarom. Dit script is de
enige weg van een JSON in deze repo naar de tenant.

Beta-endpoint: v1.0 kent depMacOSEnrollmentProfile niet.

Toewijzen doet dit script bewust niet. Een profiel toewijzen aan de verkeerde serienummers
levert Macs op die niet meer zijn terug te draaien zonder wipe; dat hoort met de devicelijst
voor je neus in de portal.

.PARAMETER TokenName
Naam van het enrollment program token in Intune, bijvoorbeeld ACI_APPLE_MDM.

.PARAMETER Path
Pad naar het JSON-bestand met de profieldefinitie.

.PARAMETER Export
Haalt alle profielen onder het token op en schrijft ze als JSON naar -OutDir.

.PARAMETER OutDir
Doelmap voor -Export. Standaard enrollment/macos.

.EXAMPLE
.\New-MacOSEnrollmentPolicy.ps1 -TokenName ACI_APPLE_MDM -Path .\enrollment\macos\ACI-EP-MacOS-UF-Supervised-Corporate-01.json -WhatIf

.EXAMPLE
.\New-MacOSEnrollmentPolicy.ps1 -TokenName ACI_APPLE_MDM -Export
#>
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'High', DefaultParameterSetName = 'Create')]
param(
    [Parameter(Mandatory)]
    [string]$TokenName,

    [Parameter(Mandatory, ParameterSetName = 'Create')]
    [string]$Path,

    [Parameter(Mandatory, ParameterSetName = 'Export')]
    [switch]$Export,

    [Parameter(ParameterSetName = 'Export')]
    [string]$OutDir = (Join-Path $PSScriptRoot '..\enrollment\macos')
)

$ErrorActionPreference = 'Stop'
$graph = 'https://graph.microsoft.com/beta'

if (-not (Get-MgContext)) {
    Connect-MgGraph -Scopes 'DeviceManagementServiceConfig.ReadWrite.All' | Out-Null
}

# --- Token opzoeken ------------------------------------------------------------------------
$tokens = (Invoke-MgGraphRequest -Method GET -Uri "$graph/deviceManagement/depOnboardingSettings").value
if (-not $tokens) { throw "Geen enrollment program tokens gevonden. Is er een ABM-token geupload?" }

$token = $tokens | Where-Object { $_.tokenName -eq $TokenName }
if (-not $token) {
    $known = ($tokens | ForEach-Object { $_.tokenName }) -join ', '
    throw "Token '$TokenName' niet gevonden. Beschikbaar: $known"
}
Write-Verbose "Token '$TokenName' = $($token.id)"

$profilesUri = "$graph/deviceManagement/depOnboardingSettings/$($token.id)/enrollmentProfiles"

# --- Export --------------------------------------------------------------------------------
if ($Export) {
    if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
    $existing = (Invoke-MgGraphRequest -Method GET -Uri $profilesUri).value

    foreach ($p in $existing) {
        # id en @odata.context zijn tenantspecifiek en horen niet in een herbruikbaar bestand.
        $clean = [ordered]@{}
        foreach ($k in ($p.Keys | Sort-Object)) {
            if ($k -in @('id', '@odata.context')) { continue }
            $clean[$k] = $p[$k]
        }
        $file = Join-Path $OutDir ("{0}.json" -f ($p.displayName -replace '[^\w\.\-]', '_'))
        $clean | ConvertTo-Json -Depth 10 | Set-Content -Path $file -Encoding utf8
        Write-Host "Geexporteerd: $file"
    }
    if (-not $existing) { Write-Host "Geen profielen onder token '$TokenName'." }
    return
}

# --- Create --------------------------------------------------------------------------------
if (-not (Test-Path $Path)) { throw "Bestand niet gevonden: $Path" }

$json = Get-Content -Path $Path -Raw
try { $policy = $json | ConvertFrom-Json } catch { throw "Ongeldige JSON in ${Path}: $_" }

if (-not $policy.displayName) { throw "displayName ontbreekt in $Path" }
if ($policy.'@odata.type' -ne '#microsoft.graph.depMacOSEnrollmentProfile') {
    throw "@odata.type moet '#microsoft.graph.depMacOSEnrollmentProfile' zijn, niet '$($policy.'@odata.type')'"
}
# Graph laat dit toe en levert dan een profiel op dat stilzwijgend anders werkt dan bedoeld.
if ($policy.usePlatformSSODuringSetupAssistant -and $policy.configurationWebUrl) {
    throw "usePlatformSSODuringSetupAssistant en configurationWebUrl kunnen niet allebei true zijn."
}

$existing = (Invoke-MgGraphRequest -Method GET -Uri $profilesUri).value |
    Where-Object { $_.displayName -eq $policy.displayName }
if ($existing) {
    throw "Er bestaat al een profiel '$($policy.displayName)' onder token '$TokenName' (id $($existing.id)). Hernoem het bestand of verwijder het profiel eerst."
}

$target = "$TokenName -> $($policy.displayName)"
if ($PSCmdlet.ShouldProcess($target, 'Enrollmentprofiel aanmaken')) {
    $created = Invoke-MgGraphRequest -Method POST -Uri $profilesUri -Body $json -ContentType 'application/json'
    Write-Host "Aangemaakt: $($created.displayName) (id $($created.id))"
    Write-Host ""
    Write-Host "Nog te doen in de portal:"
    Write-Host "  Enrollment program tokens -> $TokenName -> Devices -> Assign policy"
    Write-Host "  of Set Default Policy als dit profiel voor alle apparaten onder het token geldt."
}
else {
    Write-Host "WhatIf: zou POST doen naar $profilesUri"
    Write-Host "        displayName        : $($policy.displayName)"
    Write-Host "        user affinity      : $($policy.requiresUserAuthentication)"
    Write-Host "        locked enrollment  : $($policy.profileRemovalDisabled)  (onomkeerbaar na enrollment)"
    Write-Host "        await final config : $($policy.waitForDeviceConfiguredConfirmation)"
}
