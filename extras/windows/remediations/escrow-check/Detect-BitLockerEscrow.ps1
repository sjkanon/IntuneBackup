<#
.SYNOPSIS
    Intune remediation (detection): has the BitLocker recovery key of the OS drive demonstrably been sent to Entra ID?
.NOTES
    Exit 0 = not encrypted (nothing to check) or backup demonstrable · exit 1 = remediation needed.
#>
$mount = $env:SystemDrive
try {
    $volume = Get-BitLockerVolume -MountPoint $mount -ErrorAction Stop
} catch {
    Write-Output "BitLocker status not readable: $($_.Exception.Message)"
    exit 1
}

if ($volume.VolumeStatus -eq 'FullyDecrypted') {
    Write-Output "$mount is not encrypted; nothing to check (Compliance BitLocker checks that)."
    exit 0
}

$protectors = @($volume.KeyProtector | Where-Object KeyProtectorType -eq 'RecoveryPassword')
if ($protectors.Count -eq 0) {
    Write-Output "$mount is encrypted without a recovery password protector."
    exit 1
}

$events = Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-BitLocker/BitLocker Management'; Id = 845 } -ErrorAction SilentlyContinue
$missing = foreach ($p in $protectors) {
    $id = $p.KeyProtectorId.Trim('{}')
    if (-not ($events | Where-Object { $_.Message -match [regex]::Escape($id) })) { $p.KeyProtectorId }
}

if ($missing) {
    Write-Output "No Entra backup logged for protector(s): $($missing -join ', ')"
    exit 1
}
Write-Output "Entra backup logged for all $($protectors.Count) recovery password protector(s) on $mount."
exit 0
