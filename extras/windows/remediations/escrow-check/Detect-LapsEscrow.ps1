<#
.SYNOPSIS
    Intune remediation (detection only): has Windows LAPS demonstrably updated the password in Entra ID recently?
.NOTES
    Microsoft-Windows-LAPS/Operational 10029 = password updated in Entra ID.
    $MaxAgeDays slightly longer than passwordagedays_aad (7) in CXNM - Standard - WIN - D - Windows LAPS.
    Exit 0 = recent successful update · exit 1 = no evidence; see the last LAPS error message in the output.
#>
$MaxAgeDays = 10

$since = (Get-Date).AddDays(-$MaxAgeDays)
$ok = Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-LAPS/Operational'; Id = 10029; StartTime = $since } -MaxEvents 1 -ErrorAction SilentlyContinue
if ($ok) {
    Write-Output "LAPS password updated in Entra ID on $($ok.TimeCreated.ToString('s'))."
    exit 0
}

$lastError = Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-LAPS/Operational'; Level = 2; StartTime = $since } -MaxEvents 1 -ErrorAction SilentlyContinue
if ($lastError) {
    Write-Output "No successful Entra update in $MaxAgeDays days. Last error ($($lastError.Id)): $($lastError.Message.Split([Environment]::NewLine)[0])"
} else {
    Write-Output "No successful Entra update and no LAPS error in $MaxAgeDays days — has the LAPS policy arrived?"
}
exit 1
