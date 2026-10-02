<#
.SYNOPSIS
    Builds the Intune Win32 package for Winget-AutoUpdate: downloads the pinned WAU.msi,
    verifies its SHA-256 and stages it next to excluded_apps.txt.
.DESCRIPTION
    WAU.msi is not Authenticode-signed, so the hash is the only check that the file is the
    published release. Version and hash are pinned here and change together, deliberately:
    a new WAU version is a decision, not something that happens on its own.
    The MSI picks up excluded_apps.txt from its own folder at install time, so both go into
    the same package.
.PARAMETER OutputPath
    Staging folder. Defaults to %TEMP%\WAU-package — outside the repo, so the MSI never ends
    up in git.
.PARAMETER IntuneWinAppUtil
    Path to IntuneWinAppUtil.exe. If given (or found on PATH), the .intunewin is built too.
.EXAMPLE
    .\New-WAUPackage.ps1 -IntuneWinAppUtil C:\Tools\IntuneWinAppUtil.exe
#>
param(
    [string]$OutputPath = (Join-Path $env:TEMP 'WAU-package'),
    [string]$IntuneWinAppUtil
)
$ErrorActionPreference = 'Stop'

# Pinned release. Hash from the GitHub release asset digest, recomputed on download.
$Version = 'v2.12.0'
$Sha256 = 'f5ab2303fdf82fbfcb2248cca4f96479fe17d74584a528b0f86b3dbe9f9e9718'
$ProductCode = '{FB0EB14E-95AC-45D7-A951-432316FFCBD4}'

$source = Join-Path $OutputPath 'source'
New-Item -ItemType Directory -Force -Path $source | Out-Null
$msi = Join-Path $source 'WAU.msi'

$url = "https://github.com/Romanitho/Winget-AutoUpdate/releases/download/$Version/WAU.msi"
Write-Output "Downloading $url"
Invoke-WebRequest -Uri $url -OutFile $msi -UseBasicParsing

$actual = (Get-FileHash -Path $msi -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $Sha256) {
    Remove-Item $msi -Force
    throw "SHA-256 mismatch for WAU.msi $Version`n  expected $Sha256`n  got      $actual"
}
Write-Output "SHA-256 verified: $actual"

Copy-Item -Path (Join-Path $PSScriptRoot 'excluded_apps.txt') -Destination $source -Force

if (-not $IntuneWinAppUtil) {
    $IntuneWinAppUtil = (Get-Command IntuneWinAppUtil.exe -ErrorAction SilentlyContinue).Source
}
if ($IntuneWinAppUtil) {
    & $IntuneWinAppUtil -c $source -s 'WAU.msi' -o $OutputPath -q
    Write-Output "Package: $(Join-Path $OutputPath 'WAU.intunewin')"
} else {
    Write-Output "IntuneWinAppUtil.exe not found; package $source yourself with setup file WAU.msi."
}

Write-Output ''
Write-Output "Uninstall command: msiexec /x $ProductCode /qn"
Write-Output 'Install command and detection: see README.md.'
