<#
    Installs "Office op het web": a file association that opens Word, Excel and PowerPoint files
    from a OneDrive or SharePoint synced folder in Office for the web. Meant for shared devices
    without the Office desktop apps.

    What it does, machine-wide:
    - copies Open-OfficeWeb.ps1 to OfficeWebOpen in Program Files;
    - registers the ProgIds OfficeWeb.Word, OfficeWeb.Excel and OfficeWeb.PowerPoint, which run
      that script headless (conhost --headless, so no console window flashes);
    - adds them to "Open with" of the file types, and registers the app with Default Apps
      (Capabilities + RegisteredApplications), so that it can be chosen there;
    - builds the list of "View online" names for the installed OneDrive in
      OfficeWebOpen in ProgramData, so the first double-click of a new profile is quick.

    It does not make the app the default: Windows protects that per user (UserChoice). The
    policy [Baseline] - WIN - D - Shared Devices Office Web File Associations does that at every
    sign-in, with DefaultAssociationsConfiguration.

    Runs as System. Logs to C:\Windows\Logs\Baseline\office-web-open.log.
#>

$ErrorActionPreference = 'Stop'
$LogDir = 'C:\Windows\Logs\Baseline'
$Log = Join-Path $LogDir 'office-web-open.log'
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }
function Write-Log($Text) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $Text"
    Add-Content -Path $Log -Value $line
    Write-Output $line
}

$Version = '1.0.1'
$InstallDir = Join-Path $env:ProgramFiles 'OfficeWebOpen'
$Script = Join-Path $InstallDir 'Open-OfficeWeb.ps1'
$AppKey = 'HKLM:\SOFTWARE\OfficeWebOpen'
$Command = "`"$env:SystemRoot\System32\conhost.exe`" --headless `"$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe`" -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$Script`" `"%1`""

# The extensions Office for the web opens. Older formats (.doc, .xls, .ppt) open read-only or
# are converted by the web app; the user gets that choice there.
$Apps = @(
    @{ ProgId = 'OfficeWeb.Word';       Name = 'Word';       Icon = "$env:SystemRoot\System32\imageres.dll,-102"; Extensions = '.docx', '.docm', '.doc', '.dotx' }
    @{ ProgId = 'OfficeWeb.Excel';      Name = 'Excel';      Icon = "$env:SystemRoot\System32\imageres.dll,-102"; Extensions = '.xlsx', '.xlsm', '.xlsb', '.xls' }
    @{ ProgId = 'OfficeWeb.PowerPoint'; Name = 'PowerPoint'; Icon = "$env:SystemRoot\System32\imageres.dll,-102"; Extensions = '.pptx', '.pptm', '.ppt', '.ppsx' }
)

function Set-Value($Key, $Name, $Value, $Type = 'String') {
    if (-not (Test-Path $Key)) { New-Item -Path $Key -Force | Out-Null }
    New-ItemProperty -Path $Key -Name $Name -Value $Value -PropertyType $Type -Force | Out-Null
}

Write-Log "--- install $Version"

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
# As a Win32 app the script sits next to this one. As a platform script (CIPP or Intune
# Scripts, or the CIPP app template) there is only one file: New-OfficeWebPlatformScript.ps1
# puts it in $OpenScript.
# @@OPEN-SCRIPT@@
if (Get-Variable -Name OpenScript -ErrorAction SilentlyContinue) {
    Set-Content -LiteralPath $Script -Value $OpenScript -Encoding ASCII
} else {
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Open-OfficeWeb.ps1') -Destination $Script -Force
}
Write-Log "script in $Script"

$classes = 'HKLM:\SOFTWARE\Classes'
foreach ($app in $Apps) {
    $progKey = Join-Path $classes $app.ProgId
    Set-Value $progKey '(default)' "$($app.Name) (Office op het web)"
    Set-Value $progKey 'FriendlyTypeName' "$($app.Name) (Office op het web)"
    Set-Value (Join-Path $progKey 'DefaultIcon') '(default)' $app.Icon
    Set-Value (Join-Path $progKey 'shell\open\command') '(default)' $Command
    foreach ($ext in $app.Extensions) {
        Set-Value (Join-Path $classes "$ext\OpenWithProgids") $app.ProgId ([byte[]]@()) 'None'
        Set-Value "$AppKey\Capabilities\FileAssociations" $ext $app.ProgId
    }
    Write-Log "$($app.ProgId): $($app.Extensions -join ', ')"
}

Set-Value "$AppKey\Capabilities" 'ApplicationName' 'Office op het web'
Set-Value "$AppKey\Capabilities" 'ApplicationDescription' 'Opent Word-, Excel- en PowerPoint-bestanden uit OneDrive en SharePoint in Office voor het web.'
Set-Value 'HKLM:\SOFTWARE\RegisteredApplications' 'OfficeWebOpen' 'SOFTWARE\OfficeWebOpen\Capabilities'
Set-Value $AppKey 'Version' $Version

# Tell Explorer the associations changed (SHCNE_ASSOCCHANGED).
Add-Type -Namespace OfficeWebOpen -Name Shell -MemberDefinition '[DllImport("shell32.dll")] public static extern void SHChangeNotify(int e, uint f, IntPtr a, IntPtr b);'
[OfficeWebOpen.Shell]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)

try {
    $out = & $Script -BuildCache (Join-Path $env:ProgramData 'OfficeWebOpen')
    Write-Log $out
} catch {
    # Not fatal: without the list the script builds it per user on the first double-click.
    Write-Log "list not built: $_"
}

Write-Log '--- done'
