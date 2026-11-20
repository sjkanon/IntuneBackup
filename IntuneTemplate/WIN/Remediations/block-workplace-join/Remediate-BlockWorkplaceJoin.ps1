<#
.SYNOPSIS
    Intune remediation (remediate): blocks adding work or school accounts from other organisations.
.NOTES
    Sets HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin\BlockAADWorkplaceJoin = 1.
    Accounts that were already registered stay; see the README for how to find and remove them.
    Undo: remove the value BlockAADWorkplaceJoin.
#>
$key = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin'
try {
    if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }
    New-ItemProperty -Path $key -Name BlockAADWorkplaceJoin -PropertyType DWord -Value 1 -Force | Out-Null
    $check = (Get-ItemProperty -Path $key -Name BlockAADWorkplaceJoin -ErrorAction Stop).BlockAADWorkplaceJoin
    if ($check -ne 1) { throw "BlockAADWorkplaceJoin is $check after remediation" }
    Write-Output 'BlockAADWorkplaceJoin set to 1'
    exit 0
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    exit 1
}
