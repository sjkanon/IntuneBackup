<#
.SYNOPSIS
    Intune-remediation (herstel): stuurt de BitLocker-herstelsleutel van de OS-schijf (opnieuw) naar Entra ID.
.NOTES
    Maakt een herstelwachtwoord-protector aan als die ontbreekt op een versleutelde schijf.
    Verandert niets aan de versleuteling zelf.
#>
$mount = $env:SystemDrive
try {
    $volume = Get-BitLockerVolume -MountPoint $mount -ErrorAction Stop
    if ($volume.VolumeStatus -eq 'FullyDecrypted') {
        Write-Output "$mount is niet versleuteld; niets te doen."
        exit 0
    }
    $protectors = @($volume.KeyProtector | Where-Object KeyProtectorType -eq 'RecoveryPassword')
    if ($protectors.Count -eq 0) {
        Add-BitLockerKeyProtector -MountPoint $mount -RecoveryPasswordProtector -ErrorAction Stop | Out-Null
        $protectors = @((Get-BitLockerVolume -MountPoint $mount).KeyProtector | Where-Object KeyProtectorType -eq 'RecoveryPassword')
        Write-Output 'Herstelwachtwoord-protector aangemaakt.'
    }
    foreach ($p in $protectors) {
        BackupToAAD-BitLockerKeyProtector -MountPoint $mount -KeyProtectorId $p.KeyProtectorId -ErrorAction Stop | Out-Null
        Write-Output "Backup naar Entra ID aangevraagd voor $($p.KeyProtectorId)."
    }
    exit 0
} catch {
    Write-Output "Fout: $($_.Exception.Message)"
    exit 1
}
