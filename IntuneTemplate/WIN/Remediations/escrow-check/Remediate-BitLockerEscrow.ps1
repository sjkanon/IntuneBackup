<#
.SYNOPSIS
    Intune remediation (remediate): sends the BitLocker recovery key of the OS drive (again) to Entra ID.
.NOTES
    Creates a recovery password protector if one is missing on an encrypted drive.
    Does not change anything about the encryption itself.
#>
$mount = $env:SystemDrive
try {
    $volume = Get-BitLockerVolume -MountPoint $mount -ErrorAction Stop
    if ($volume.VolumeStatus -eq 'FullyDecrypted') {
        Write-Output "$mount is not encrypted; nothing to do."
        exit 0
    }
    $protectors = @($volume.KeyProtector | Where-Object KeyProtectorType -eq 'RecoveryPassword')
    if ($protectors.Count -eq 0) {
        Add-BitLockerKeyProtector -MountPoint $mount -RecoveryPasswordProtector -ErrorAction Stop | Out-Null
        $protectors = @((Get-BitLockerVolume -MountPoint $mount).KeyProtector | Where-Object KeyProtectorType -eq 'RecoveryPassword')
        Write-Output 'Recovery password protector created.'
    }
    foreach ($p in $protectors) {
        BackupToAAD-BitLockerKeyProtector -MountPoint $mount -KeyProtectorId $p.KeyProtectorId -ErrorAction Stop | Out-Null
        Write-Output "Backup to Entra ID requested for $($p.KeyProtectorId)."
    }
    exit 0
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    exit 1
}
