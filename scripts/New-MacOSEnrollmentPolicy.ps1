#Requires -Modules Microsoft.Graph.Authentication
<#
.SYNOPSIS
Creates a macOS ADE enrollment profile from a JSON file, or exports existing
profiles to JSON.

.DESCRIPTION
ADE enrollment profiles (depMacOSEnrollmentProfile) hang under an ABM token and fall
outside IntuneTemplate/ — see enrollment/macos/README.md for the why. This script is the
only route from a JSON in this repo to the tenant.

Beta endpoint: v1.0 does not know depMacOSEnrollmentProfile.

This script deliberately does not assign. Assigning a profile to the wrong serial numbers
produces Macs that cannot be rolled back without a wipe; that belongs in the portal with the
device list in front of you.

.PARAMETER TokenName
Name of the enrollment program token in Intune, for example ADE-TOKEN-NAAM.

.PARAMETER Path
Path to the JSON file with the profile definition.

.PARAMETER Export
Fetches all profiles under the token and writes them as JSON to -OutDir.

.PARAMETER OutDir
Target folder for -Export. Default enrollment/macos.

.EXAMPLE
.\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Path .\enrollment\macos\macOS-Corporate-ADE-Baseline.json -WhatIf

.EXAMPLE
.\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Export
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

# --- Look up the token ---------------------------------------------------------------------
$tokens = (Invoke-MgGraphRequest -Method GET -Uri "$graph/deviceManagement/depOnboardingSettings").value
if (-not $tokens) { throw "No enrollment program tokens found. Has an ABM token been uploaded?" }

$token = $tokens | Where-Object { $_.tokenName -eq $TokenName }
if (-not $token) {
    $known = ($tokens | ForEach-Object { $_.tokenName }) -join ', '
    throw "Token '$TokenName' not found. Available: $known"
}
Write-Verbose "Token '$TokenName' = $($token.id)"

$profilesUri = "$graph/deviceManagement/depOnboardingSettings/$($token.id)/enrollmentProfiles"

# --- Export --------------------------------------------------------------------------------
if ($Export) {
    if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
    $existing = (Invoke-MgGraphRequest -Method GET -Uri $profilesUri).value

    foreach ($p in $existing) {
        # id and @odata.context are tenant-specific and do not belong in a reusable file.
        $clean = [ordered]@{}
        foreach ($k in ($p.Keys | Sort-Object)) {
            if ($k -in @('id', '@odata.context')) { continue }
            $clean[$k] = $p[$k]
        }
        $file = Join-Path $OutDir ("{0}.json" -f ($p.displayName -replace '[^\w\.\-]', '_'))
        $clean | ConvertTo-Json -Depth 10 | Set-Content -Path $file -Encoding utf8
        Write-Host "Exported: $file"
    }
    if (-not $existing) { Write-Host "No profiles under token '$TokenName'." }
    return
}

# --- Create --------------------------------------------------------------------------------
if (-not (Test-Path $Path)) { throw "File not found: $Path" }

$json = Get-Content -Path $Path -Raw
try { $policy = $json | ConvertFrom-Json } catch { throw "Invalid JSON in ${Path}: $_" }

if (-not $policy.displayName) { throw "displayName is missing in $Path" }
if ($policy.'@odata.type' -ne '#microsoft.graph.depMacOSEnrollmentProfile') {
    throw "@odata.type must be '#microsoft.graph.depMacOSEnrollmentProfile', not '$($policy.'@odata.type')'"
}
# Graph allows this and then produces a profile that silently behaves differently than intended.
if ($policy.usePlatformSSODuringSetupAssistant -and $policy.configurationWebUrl) {
    throw "usePlatformSSODuringSetupAssistant and configurationWebUrl cannot both be true."
}

$existing = (Invoke-MgGraphRequest -Method GET -Uri $profilesUri).value |
    Where-Object { $_.displayName -eq $policy.displayName }
if ($existing) {
    throw "A profile '$($policy.displayName)' already exists under token '$TokenName' (id $($existing.id)). Rename the file or delete the profile first."
}

$target = "$TokenName -> $($policy.displayName)"
if ($PSCmdlet.ShouldProcess($target, 'Create enrollment profile')) {
    $created = Invoke-MgGraphRequest -Method POST -Uri $profilesUri -Body $json -ContentType 'application/json'
    Write-Host "Created: $($created.displayName) (id $($created.id))"
    Write-Host ""
    Write-Host "Still to do in the portal:"
    Write-Host "  Enrollment program tokens -> $TokenName -> Devices -> Assign policy"
    Write-Host "  or Set Default Policy if this profile applies to all devices under the token."
}
else {
    Write-Host "WhatIf: would POST to $profilesUri"
    Write-Host "        displayName        : $($policy.displayName)"
    Write-Host "        user affinity      : $($policy.requiresUserAuthentication)"
    Write-Host "        locked enrollment  : $($policy.profileRemovalDisabled)  (irreversible after enrollment)"
    Write-Host "        await final config : $($policy.waitForDeviceConfiguredConfirmation)"
}
