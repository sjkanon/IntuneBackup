<#
    Removes "Office op het web" again: the ProgIds, the "Open with" entries, the registration
    with Default Apps, the script and the cached lists. Remove the policy
    [Baseline] - WIN - D - Shared Devices Office Web File Associations first, otherwise every
    sign-in points the file types at a ProgId that no longer exists.

    Runs as System. Logs to C:\Windows\Logs\Baseline\office-web-open.log.
#>

$LogDir = 'C:\Windows\Logs\Baseline'
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }
Add-Content -Path (Join-Path $LogDir 'office-web-open.log') -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  --- uninstall"

$classes = 'HKLM:\SOFTWARE\Classes'
foreach ($progId in 'OfficeWeb.Word', 'OfficeWeb.Excel', 'OfficeWeb.PowerPoint') {
    Remove-Item -Path (Join-Path $classes $progId) -Recurse -Force -ErrorAction SilentlyContinue
}
foreach ($ext in '.docx', '.docm', '.doc', '.dotx', '.xlsx', '.xlsm', '.xlsb', '.xls', '.pptx', '.pptm', '.ppt', '.ppsx') {
    $key = Join-Path $classes "$ext\OpenWithProgids"
    foreach ($progId in 'OfficeWeb.Word', 'OfficeWeb.Excel', 'OfficeWeb.PowerPoint') {
        Remove-ItemProperty -Path $key -Name $progId -ErrorAction SilentlyContinue
    }
}
Remove-ItemProperty -Path 'HKLM:\SOFTWARE\RegisteredApplications' -Name 'OfficeWebOpen' -ErrorAction SilentlyContinue
Remove-Item -Path 'HKLM:\SOFTWARE\OfficeWebOpen' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path (Join-Path $env:ProgramFiles 'OfficeWebOpen') -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path (Join-Path $env:ProgramData 'OfficeWebOpen') -Recurse -Force -ErrorAction SilentlyContinue
exit 0
