<#
    Verwijdert voorgeinstalleerde McAfee met MCPR, de officiele verwijdertool van McAfee.

    Drie dingen die dit script bewust doet:

    1. MCPR draait meerdere keren. Elke ronde geeft bestandsvergrendelingen vrij die de vorige
       ronde nog in de weg zaten, waardoor de volgende ronde verder komt. Een keer draaien laat
       vrijwel altijd resten achter.
    2. Een niet-nul exitcode van MCPR is geen fout. "Incomplete uninstallation" betekent dat de
       verwijdering via PendingFileRenameOperations is uitgesteld tot de herstart. Dit script
       stopt daar dus niet op.
    3. De herstart is de laatste stap van de verwijdering, geen bijzaak. Zet in Intune bij deze
       app "Gedrag bij opnieuw opstarten van apparaat" op *Intune dwingt een verplichte herstart
       af*. Zonder die herstart blijft het apparaat in een half verwijderde staat staan.

    Logt naar C:\Windows\Logs\Baseline\remove-mcafee.log.
#>

$LogMap = 'C:\Windows\Logs\Baseline'
$Log = Join-Path $LogMap 'remove-mcafee.log'
if (-not (Test-Path $LogMap)) { New-Item -ItemType Directory -Path $LogMap -Force | Out-Null }
function Schrijf($Tekst) {
    $Regel = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $Tekst"
    Add-Content -Path $Log -Value $Regel
    Write-Output $Regel
}

Schrijf '--- start'

$Mcpr = Join-Path $PSScriptRoot 'MCPR.exe'
if (-not (Test-Path $Mcpr)) {
    Schrijf "FOUT: MCPR.exe staat niet naast dit script. Haal hem bij McAfee en verpak hem mee."
    exit 1
}

for ($Ronde = 1; $Ronde -le 3; $Ronde++) {
    Schrijf "MCPR ronde $Ronde"
    try {
        $Proces = Start-Process -FilePath $Mcpr -ArgumentList '/quiet', '/silent' -Wait -PassThru -ErrorAction Stop
        Schrijf "  exitcode $($Proces.ExitCode)"
    } catch {
        Schrijf "  ronde $Ronde mislukt: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds 30
}

# Wat MCPR laat staan, gaat er hier af. Alleen mappen en Appx-pakketten; het register raken we
# niet aan, want daar zit ook de administratie van de uitgestelde verwijdering in.
foreach ($Map in @("${env:ProgramFiles}\McAfee", "${env:ProgramFiles(x86)}\McAfee", "$env:ProgramData\McAfee")) {
    if (Test-Path $Map) {
        Schrijf "Restmap opruimen: $Map"
        Remove-Item -Path $Map -Recurse -Force -ErrorAction SilentlyContinue
    }
}

foreach ($Pakket in (Get-AppxPackage -AllUsers | Where-Object { $_.Name -match 'McAfee' })) {
    Schrijf "Appx verwijderen: $($Pakket.Name)"
    Remove-AppxPackage -Package $Pakket.PackageFullName -AllUsers -ErrorAction SilentlyContinue
}
foreach ($Provisioned in (Get-AppxProvisionedPackage -Online | Where-Object { $_.DisplayName -match 'McAfee' })) {
    Schrijf "Appx-provisioning verwijderen: $($Provisioned.DisplayName)"
    Remove-AppxProvisionedPackage -Online -PackageName $Provisioned.PackageName -ErrorAction SilentlyContinue
}

Schrijf '--- klaar; de herstart maakt de verwijdering af'
exit 0
