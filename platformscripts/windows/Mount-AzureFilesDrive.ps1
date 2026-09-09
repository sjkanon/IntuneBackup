<#
.SYNOPSIS
Koppelt een Azure Files-share als netwerkschijf met het Entra Kerberos-ticket van de
aangemelde gebruiker.

.DESCRIPTION
Het Windows-equivalent van mount-azure-files.sh op de Mac, en de vervanger van de drive maps
uit Group Policy Preferences.

Waarom een script en geen policy: er is er geen. Alle 18.329 settingDefinitionId's van de
settings catalog zijn nagezocht op iets dat een netwerkschijf koppelt — dat bestaat niet.
`..._userprofiles_user_home_drive_letter` gaat over de home-drive uit AD en niet over een
mapping die je zelf kiest, en GPP Drive Maps is geen ADMX en dus ook niet te ingesten.

Waarom dit script maar één keer hoeft te draaien: `New-PSDrive -Persist` schrijft de mapping
in `HKCU\Network`, en Windows herstelt persistente mappings bij elke aanmelding. Een
Intune-platformscript draait één keer per gebruiker per apparaat, en dat is hier genoeg.
Haalt de gebruiker de mapping daarna zelf weg, dan komt hij niet terug — dat is een keuze,
geen tekortkoming, dezelfde lijn als bij configure-dock.sh. Wil je 'm wél laten terugkomen,
dan is dit script het verkeerde middel en wordt het een remediation (detect + remediate, met
een eigen schema).

Er wordt bewust geen -Credential meegegeven: het Kerberos-ticket doet het werk. Komt er toch
een aanmeldvenster, dan is dat het symptoom — zie de README naast dit bestand.

Vereisten die buiten dit script vallen:
  - Kerberos/CloudKerberosTicketRetrievalEnabled = 1. Staat al in de baseline, via
    [Baseline] - WIN - D - Windows Hello Cloud Kerberos Trust, op alle apparaten.
  - Het apparaat is Entra joined of Entra hybrid joined.
  - De diensten WinHttpAutoProxySvc en iphlpsvc draaien. De baseline zet ze niet uit — de
    enige diensten die [Baseline] - WIN - D - Security Hardening uitschakelt zijn de vier
    Xbox-diensten.
  - Entra Kerberos aan op het storage account, admin consent gegeven, MFA uitgesloten voor de
    Entra-app van dat account, en share-level permissions op dezelfde groep als waaraan dit
    script is toegewezen.

.NOTES
In Intune: Devices → Scripts and remediations → Platform scripts → Add → Windows 10 and later.

  Run this script using the logged on credentials   Yes   een netwerkschijf hoort bij een
                                                          gebruikersprofiel; als SYSTEM
                                                          landt hij nergens
  Enforce script signature check                    No
  Run script in 64 bit PowerShell Host              Yes

Toewijzen aan een gebruikersgroep, niet aan apparaten.
#>

# --- De share ------------------------------------------------------------------------------
#
# Storage account en sharenaam apart, want de UNC-vorm ziet er anders uit dan de HTTPS-URL uit
# de portal: https://acisafiles.file.core.windows.net/data wordt
# \\acisafiles.file.core.windows.net\data.
#
# Deze drie staan bewust als platte tekst in dit bestand en niet als CIPP-token: een
# platformscript gaat niet door Get-CIPPTextReplacement heen — dat werkt alleen op de
# templates in IntuneTemplate/. Wat hier staat is wat er op het apparaat draait.

$StorageAccount = 'acisafiles'
$ShareName      = 'data'
$DriveLetter    = 'Z'

# --- Vanaf hier niets meer aanpassen -------------------------------------------------------

$ErrorActionPreference = 'Stop'

$stateDir = Join-Path $env:LOCALAPPDATA 'Baseline'
$log      = Join-Path $stateDir 'mount-azurefiles.log'
$server   = "$StorageAccount.file.core.windows.net"
$root     = "\\$server\$ShareName"

if (-not (Test-Path $stateDir)) { New-Item -ItemType Directory -Path $stateDir -Force | Out-Null }

function Write-Log {
    param([string]$Message)
    "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message | Add-Content -Path $log -Encoding UTF8
}

if ($StorageAccount -eq 'STORAGE-ACCOUNT-INVULLEN' -or $ShareName -eq 'SHARE-NAAM-INVULLEN') {
    Write-Log 'Storage account of share staat nog op de placeholder - niets gedaan.'
    exit 1
}

# Al goed gekoppeld? Dan is er niets te doen. Wijst de letter naar iets anders, dan is dat
# een bewuste mapping van iemand anders en blijft hij staan: een bestaande schijf onder de
# gebruiker vandaan trekken is erger dan deze niet koppelen.
$existing = Get-PSDrive -Name $DriveLetter -PSProvider FileSystem -ErrorAction SilentlyContinue
if ($existing) {
    $current = $existing.DisplayRoot
    if ($current -eq $root) {
        Write-Log "Schijf ${DriveLetter}: staat al op $root."
        exit 0
    }
    Write-Log "Schijf ${DriveLetter}: is bezet door $current - niet aangeraakt."
    exit 1
}

# Poort 445 wordt door veel providers geblokkeerd. Zonder deze test is de foutmelding van
# New-PSDrive een generieke netwerkfout en zoekt de helpdesk in de verkeerde hoek.
$tcp = New-Object System.Net.Sockets.TcpClient
try {
    $connect = $tcp.BeginConnect($server, 445, $null, $null)
    if (-not $connect.AsyncWaitHandle.WaitOne(5000, $false)) {
        Write-Log "Poort 445 op $server is niet bereikbaar binnen 5 seconden - waarschijnlijk geblokkeerd door het netwerk."
        exit 1
    }
    $tcp.EndConnect($connect)
}
catch {
    Write-Log "Poort 445 op $server is niet bereikbaar: $($_.Exception.Message)"
    exit 1
}
finally {
    $tcp.Close()
}

try {
    New-PSDrive -Name $DriveLetter -PSProvider FileSystem -Root $root -Persist -Scope Global | Out-Null
    Write-Log "Gekoppeld: ${DriveLetter}: op $root"
    exit 0
}
catch {
    Write-Log "Koppelen mislukt: $($_.Exception.Message)"
    exit 1
}
