<#
    ASCII only, so that Intune runs it the same in every code page; accented letters are [char] codes.

    Opens an Office file from a OneDrive or SharePoint synced folder in Office for the web.

    Windows cannot associate a file type with a web app, so on a device without the Office
    desktop apps a double-click on a .docx asks which app to use. This script is the app: the
    file associations of "Office op het web" point here (see Install-OfficeWeb.ps1), and the
    script runs the OneDrive context menu item "View online" of the file. OneDrive itself then
    opens the file in Word, Excel or PowerPoint for the web in the default browser. That also
    covers files in shortcuts to other libraries ("Add shortcut to My files"), which a URL
    built from the registry would get wrong.

    The menu item has a different name in every language. Instead of a list of translations
    that is never complete, the names come from OneDrive itself: FileSync.LocalizedResources.dll
    ships a .mui per language (94 in OneDrive 26.x). The English .mui gives the string IDs
    whose text is "View online"; the same IDs in every other .mui give the translations. The
    result is cached per OneDrive version, so a OneDrive update simply builds a new list.

    -BuildCache <folder> only writes the list (Install-OfficeWeb.ps1 does that for all users).
    -WhatIf shows which menu item would run, without running it.

    Runs as the signed-in user. Logs to OfficeWebOpen\open.log in the user's local app data.
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Position = 0)][string]$Path,
    [string]$BuildCache
)

$ErrorActionPreference = 'Stop'
$UserDir = Join-Path $env:LOCALAPPDATA 'OfficeWebOpen'
$MachineDir = Join-Path $env:ProgramData 'OfficeWebOpen'

function Write-Log($Text) {
    try {
        if (-not (Test-Path $UserDir)) { New-Item -ItemType Directory -Path $UserDir -Force -WhatIf:$false | Out-Null }
        Add-Content -WhatIf:$false -Path (Join-Path $UserDir 'open.log') -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $Text"
    } catch { }
}

# "&Online weergeven", a Japanese "...(&V)" and "View online" all become the plain text.
function ConvertTo-PlainName([string]$Name) {
    return (($Name -replace '\(&.\)', '') -replace '&', '').Trim()
}

function Get-OneDriveResourceDir {
    $roots = @("$env:ProgramFiles\Microsoft OneDrive", "${env:ProgramFiles(x86)}\Microsoft OneDrive", "$env:LOCALAPPDATA\Microsoft\OneDrive")
    $dirs = foreach ($root in $roots | Where-Object { $_ -and (Test-Path $_) }) {
        Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match '^\d+(\.\d+){1,3}$' -and (Test-Path (Join-Path $_.FullName 'FileSync.LocalizedResources.dll')) }
    }
    return $dirs | Sort-Object { [version]$_.Name } | Select-Object -Last 1
}

function Get-ViewOnlineNames {
    param([System.IO.DirectoryInfo]$ResourceDir)

    if (-not ('OfficeWebOpen.Native' -as [type])) {
        # No here-string: New-OfficeWebPlatformScript.ps1 puts this whole script in one.
        Add-Type -Namespace OfficeWebOpen -Name Native -MemberDefinition (@(
            '[DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)] public static extern IntPtr LoadLibraryEx(string file, IntPtr reserved, uint flags);'
            '[DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int LoadString(IntPtr module, uint id, System.Text.StringBuilder buffer, int size);'
            '[DllImport("kernel32.dll")] public static extern bool FreeLibrary(IntPtr module);'
        ) -join [Environment]::NewLine)
    }
    # LOAD_LIBRARY_AS_DATAFILE | LOAD_LIBRARY_AS_IMAGE_RESOURCE: read resources, run nothing.
    $flags = 0x22
    $buffer = New-Object System.Text.StringBuilder 512
    $muiFiles = Get-ChildItem -LiteralPath $ResourceDir.FullName -Directory |
        ForEach-Object { Join-Path $_.FullName 'FileSync.LocalizedResources.dll.mui' } |
        Where-Object { Test-Path $_ }
    $english = $muiFiles | Where-Object { $_ -match '\\en(-US)?\\FileSync' } | Select-Object -First 1
    if (-not $english) { throw "No English resources in $($ResourceDir.FullName)." }

    $module = [OfficeWebOpen.Native]::LoadLibraryEx($english, [IntPtr]::Zero, $flags)
    if ($module -eq [IntPtr]::Zero) { throw "Cannot read $english." }
    $ids = @(for ($id = 0; $id -lt 65536; $id++) {
        if ([OfficeWebOpen.Native]::LoadString($module, $id, $buffer, $buffer.Capacity) -gt 0 -and (ConvertTo-PlainName $buffer.ToString()) -eq 'View online') { $id }
    })
    [void][OfficeWebOpen.Native]::FreeLibrary($module)
    if ($ids.Count -eq 0) { throw "No 'View online' text in $english." }

    $names = New-Object System.Collections.Generic.HashSet[string]
    foreach ($mui in $muiFiles) {
        $module = [OfficeWebOpen.Native]::LoadLibraryEx($mui, [IntPtr]::Zero, $flags)
        if ($module -eq [IntPtr]::Zero) { continue }
        foreach ($id in $ids) {
            if ([OfficeWebOpen.Native]::LoadString($module, $id, $buffer, $buffer.Capacity) -gt 0) { [void]$names.Add((ConvertTo-PlainName $buffer.ToString())) }
        }
        [void][OfficeWebOpen.Native]::FreeLibrary($module)
    }
    return @($names)
}

function Get-CachedNames {
    param([System.IO.DirectoryInfo]$ResourceDir)

    $file = "view-online-$($ResourceDir.Name).txt"
    foreach ($dir in $MachineDir, $UserDir) {
        $cache = Join-Path $dir $file
        if (Test-Path $cache) { return @(Get-Content -LiteralPath $cache -Encoding UTF8 | Where-Object { $_ }) }
    }
    $names = Get-ViewOnlineNames -ResourceDir $ResourceDir
    if (-not (Test-Path $UserDir)) { New-Item -ItemType Directory -Path $UserDir -Force -WhatIf:$false | Out-Null }
    Set-Content -LiteralPath (Join-Path $UserDir $file) -Value $names -Encoding UTF8 -WhatIf:$false
    return $names
}

function Show-NotSynced([string]$FileName) {
    $text = switch ((Get-UICulture).TwoLetterISOLanguageName) {
        'nl' { "$FileName staat niet in een gesynchroniseerde OneDrive- of SharePoint-map.`n`nZet het bestand in je OneDrive-map en wacht tot het groene vinkje verschijnt. Daarna opent het in Office voor het web." }
        'fr' { "$FileName ne se trouve pas dans un dossier OneDrive ou SharePoint synchronis$([char]0x00E9).`n`nPlacez le fichier dans votre dossier OneDrive et attendez la coche verte. Il s'ouvrira ensuite dans Office pour le web." }
        'de' { "$FileName befindet sich nicht in einem synchronisierten OneDrive- oder SharePoint-Ordner.`n`nLegen Sie die Datei in Ihren OneDrive-Ordner und warten Sie auf das gr$([char]0x00FC)ne H$([char]0x00E4)kchen. Danach $([char]0x00F6)ffnet sie sich in Office f$([char]0x00FC)r das Web." }
        default { "$FileName is not in a synced OneDrive or SharePoint folder.`n`nPut the file in your OneDrive folder and wait for the green check mark. It then opens in Office for the web." }
    }
    Add-Type -AssemblyName System.Windows.Forms
    [void][System.Windows.Forms.MessageBox]::Show($text, 'Office', 'OK', 'Information')
}

$resourceDir = Get-OneDriveResourceDir

if ($BuildCache) {
    if (-not $resourceDir) { throw 'OneDrive is not installed on this device.' }
    if (-not (Test-Path $BuildCache)) { New-Item -ItemType Directory -Path $BuildCache -Force | Out-Null }
    $names = Get-ViewOnlineNames -ResourceDir $resourceDir
    Set-Content -LiteralPath (Join-Path $BuildCache "view-online-$($resourceDir.Name).txt") -Value $names -Encoding UTF8
    Write-Output "$($names.Count) names for OneDrive $($resourceDir.Name) in $BuildCache."
    return
}

if (-not $Path -or -not (Test-Path -LiteralPath $Path)) { Write-Log "no file: '$Path'"; return }
$file = Get-Item -LiteralPath $Path

try {
    if (-not $resourceDir) { throw 'OneDrive is not installed.' }
    $names = Get-CachedNames -ResourceDir $resourceDir
    $item = (New-Object -ComObject Shell.Application).NameSpace($file.DirectoryName).ParseName($file.Name)
    $verb = $item.Verbs() | Where-Object { $_.Name -and $names -contains (ConvertTo-PlainName $_.Name) } | Select-Object -First 1
    if ($verb) {
        if ($PSCmdlet.ShouldProcess($file.FullName, "run '$(ConvertTo-PlainName $verb.Name)'")) {
            $verb.DoIt()
            Write-Log "opened online: $($file.FullName)"
        } else {
            Write-Output "Would run '$(ConvertTo-PlainName $verb.Name)' on $($file.FullName)."
        }
        return
    }
    Write-Log "not synced: $($file.FullName)"
} catch {
    Write-Log "error: $_"
}
if ($WhatIfPreference) { Write-Output "No 'View online' item for $($file.FullName)." } else { Show-NotSynced $file.Name }
