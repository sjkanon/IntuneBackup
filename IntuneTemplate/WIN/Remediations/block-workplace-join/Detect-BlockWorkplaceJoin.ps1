<#
.SYNOPSIS
    Intune remediation (detection): is adding work or school accounts from other organisations blocked?
.NOTES
    HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin\BlockAADWorkplaceJoin = 1.
    Exit 0 = compliant, exit 1 = remediation needed.
#>
$Expected = 1

$key = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin'
try {
    $current = (Get-ItemProperty -Path $key -Name BlockAADWorkplaceJoin -ErrorAction Stop).BlockAADWorkplaceJoin
} catch {
    $current = $null
}

if ($current -eq $Expected) {
    Write-Output "BlockAADWorkplaceJoin = $current (expected $Expected)"
    exit 0
}
Write-Output "BlockAADWorkplaceJoin = $(if ($null -eq $current) { 'not set' } else { $current }) (expected $Expected)"
exit 1
