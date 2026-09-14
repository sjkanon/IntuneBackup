<#
.SYNOPSIS
    Intune-remediation (alleen detectie): heeft Windows LAPS het wachtwoord recent aantoonbaar in Entra ID bijgewerkt?
.NOTES
    Microsoft-Windows-LAPS/Operational 10029 = wachtwoord bijgewerkt in Entra ID.
    $MaxAgeDays iets ruimer dan passwordagedays_aad (7) in [Baseline] - WIN - D - Windows LAPS.
    Exit 0 = recente geslaagde update · exit 1 = geen bewijs; zie het laatste LAPS-foutbericht in de uitvoer.
#>
$MaxAgeDays = 10

$since = (Get-Date).AddDays(-$MaxAgeDays)
$ok = Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-LAPS/Operational'; Id = 10029; StartTime = $since } -MaxEvents 1 -ErrorAction SilentlyContinue
if ($ok) {
    Write-Output "LAPS-wachtwoord bijgewerkt in Entra ID op $($ok.TimeCreated.ToString('s'))."
    exit 0
}

$lastError = Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-LAPS/Operational'; Level = 2; StartTime = $since } -MaxEvents 1 -ErrorAction SilentlyContinue
if ($lastError) {
    Write-Output "Geen geslaagde Entra-update in $MaxAgeDays dagen. Laatste fout ($($lastError.Id)): $($lastError.Message.Split([Environment]::NewLine)[0])"
} else {
    Write-Output "Geen geslaagde Entra-update en geen LAPS-fout in $MaxAgeDays dagen — is de LAPS-policy aangekomen?"
}
exit 1
