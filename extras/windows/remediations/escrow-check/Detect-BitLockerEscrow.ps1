<#
.SYNOPSIS
    Intune-remediation (detectie): is de BitLocker-herstelsleutel van de OS-schijf aantoonbaar naar Entra ID gestuurd?
.NOTES
    Exit 0 = niet versleuteld (niets te controleren) of backup aantoonbaar · exit 1 = herstel nodig.
#>
$mount = $env:SystemDrive
try {
    $volume = Get-BitLockerVolume -MountPoint $mount -ErrorAction Stop
} catch {
    Write-Output "BitLocker-status niet leesbaar: $($_.Exception.Message)"
    exit 1
}

if ($volume.VolumeStatus -eq 'FullyDecrypted') {
    Write-Output "$mount is niet versleuteld; niets te controleren (Compliance BitLocker toetst dat)."
    exit 0
}

$protectors = @($volume.KeyProtector | Where-Object KeyProtectorType -eq 'RecoveryPassword')
if ($protectors.Count -eq 0) {
    Write-Output "$mount is versleuteld zonder herstelwachtwoord-protector."
    exit 1
}

$events = Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-BitLocker/BitLocker Management'; Id = 845 } -ErrorAction SilentlyContinue
$missing = foreach ($p in $protectors) {
    $id = $p.KeyProtectorId.Trim('{}')
    if (-not ($events | Where-Object { $_.Message -match [regex]::Escape($id) })) { $p.KeyProtectorId }
}

if ($missing) {
    Write-Output "Geen Entra-backup gelogd voor protector(s): $($missing -join ', ')"
    exit 1
}
Write-Output "Entra-backup gelogd voor alle $($protectors.Count) herstelwachtwoord-protector(s) op $mount."
exit 0
