<#
    Detectiescript voor de Win32-app "Verwijder voorgeinstalleerde McAfee".

    Exit 0 + uitvoer op stdout = gevonden, dus nog aanwezig -> Intune ziet de app als
    "niet geinstalleerd" en voert de installatie (lees: de verwijdering) uit.
    Exit 1 zonder uitvoer      = niets meer gevonden -> klaar.

    Waarom op meerdere plekken kijken: MCPR laat regelmatig een half verwijderde staat achter
    waarin de diensten weg zijn maar de registratie blijft. Kijken naar alleen een map of alleen
    een dienst zegt daarom niets. De 32-bits registerweergave staat er apart bij omdat een deel
    van de McAfee-installaties zich daar registreert, ook op een 64-bits systeem.
#>

$Sporen = @()

$RegistryPaden = @(
    'HKLM:\SOFTWARE\McAfee',
    'HKLM:\SOFTWARE\WOW6432Node\McAfee',
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall'
)

foreach ($Pad in $RegistryPaden) {
    if (-not (Test-Path $Pad)) { continue }
    if ($Pad -like '*\Uninstall') {
        $Treffers = Get-ChildItem $Pad -ErrorAction SilentlyContinue |
            ForEach-Object { $_ | Get-ItemProperty -ErrorAction SilentlyContinue } |
            Where-Object { $_.DisplayName -match 'McAfee|WebAdvisor' }
        foreach ($T in $Treffers) { $Sporen += "Uninstall: $($T.DisplayName)" }
    } else {
        $Sporen += "Registersleutel: $Pad"
    }
}

foreach ($Map in @("${env:ProgramFiles}\McAfee", "${env:ProgramFiles(x86)}\McAfee", "$env:ProgramData\McAfee")) {
    if (Test-Path $Map) { $Sporen += "Map: $Map" }
}

foreach ($Dienst in (Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^mc|McAfee' })) {
    $Sporen += "Dienst: $($Dienst.Name)"
}

if ($Sporen.Count -gt 0) {
    Write-Output ($Sporen -join '; ')
    exit 0
}
exit 1
