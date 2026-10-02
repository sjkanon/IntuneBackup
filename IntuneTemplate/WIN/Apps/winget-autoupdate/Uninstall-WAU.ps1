<#
.SYNOPSIS
    Intune Win32 uninstall script for Winget-AutoUpdate, for the CIPP application template.
.NOTES
    The product code belongs to the pinned version in Install-WAU.ps1 and New-WAUPackage.ps1.
    1605 (product not installed) counts as success: there is nothing left to remove.
#>
$ProductCode = '{FB0EB14E-95AC-45D7-A951-432316FFCBD4}'

$Process = Start-Process -FilePath 'msiexec.exe' -ArgumentList @('/x', $ProductCode, '/qn') -Wait -PassThru
if ($Process.ExitCode -eq 1605) { exit 0 }
exit $Process.ExitCode
