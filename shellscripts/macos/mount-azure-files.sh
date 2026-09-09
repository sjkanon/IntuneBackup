#!/bin/bash
#
# Mount een Azure Files-share op de Mac met het Kerberos-ticket uit Platform SSO, zodat de
# gebruiker geen wachtwoord hoeft in te vullen. Het macOS-equivalent van een drive mapping.
#
# De share komt in /Volumes en staat daarmee in de Finder-zijbalk onder Locaties, met een
# uitwerpknop. Dat het in /Volumes staat is wat telt, niet welk commando hem mountte — zie de
# opmerking bij mount_share() waarom het mount_smbfs is en uitdrukkelijk niet NetFS.
#
# Waarom een script en geen configuratieprofiel:
#
#   Er is er geen. Alle 18.329 settingDefinitionId's van de settings catalog zijn nagezocht
#   op een payload die een netwerkschijf koppelt: die bestaat niet, op geen van beide
#   platformen. Apple heeft `com.apple.finder_showmountedserversondesktop` (of een al
#   gemounte share op het bureaublad staat) en verder niets. Mounten is een handeling, geen
#   instelling, en dus een script.
#
# Waarom een LaunchAgent en niet alleen dit script:
#
#   Een mount overleeft geen uitloggen. Een Intune-shellscript dat elk uur draait zou de
#   share dus pas een uur na het inloggen terugzetten. De LaunchAgent doet het bij login én
#   bij elke netwerkwijziging (WatchPaths op resolv.conf en de netwerkconfiguratie) — dit
#   script installeert alleen die agent en doet één eerste poging.
#
#   Op de wachtrij en niet op een klok: een share mount je als het netwerk verandert, niet om
#   de zoveel minuten. Wifi-wissel, VPN erbij, uit de slaap komen — dat zijn de momenten
#   waarop een mount weg is of juist weer kan. De vorm komt van 42Loris/macOS_DriveMapping,
#   dat dezelfde constructie in productie draait.
#
# In Intune: Devices → macOS → Shell scripts. Vereiste instellingen:
#
#   Run script as signed-in user   Yes    een mount hoort bij een sessie; als root landt hij
#                                         in een sessie die niemand ziet
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# Toewijzen aan een gebruikersgroep, niet aan apparaten — wie bij de share mag is een
# eigenschap van de gebruiker, en de share-level permissions in Azure staan op dezelfde
# groep.
#
# Vereist dat [Baseline] - MAC - D - Azure Files Cloud Kerberos is uitgerold; zonder dat
# profiel is er geen ticket voor het KERBEROS.MICROSOFTONLINE.COM-realm en vraagt de mount
# alsnog om een wachtwoord.

set -u

# --- De share ------------------------------------------------------------------------------
#
# \\acisafiles.file.core.windows.net\data\Public wordt smb://acisafiles.file.core.windows.net
# /data/Public. In drie velden, want SMB kent maar één sharelaag: `data` is de share, `Public`
# is een map dáárin. Dat onderscheid is niet cosmetisch — de mount en de rechten hangen aan de
# share, de submap is alleen het punt waar je binnenkomt.
#
# SHARE_SUBPATH leeg laten mount de hele share.
#
# Deze drie staan bewust als platte tekst in dit bestand en niet als CIPP-token: een
# shellscript gaat niet door Get-CIPPTextReplacement heen — dat werkt alleen op de templates
# in IntuneTemplate/. Wat hier staat is wat er op het apparaat draait.

STORAGE_ACCOUNT="acisafiles"
SHARE_NAME="data"
SHARE_SUBPATH="Public"

# --- Terugval op de storage account key ----------------------------------------------------
#
# Leeg laten = alleen Kerberos. Staat er een sleutel, dan probeert het script eerst Kerberos en
# valt daarna terug op deze sleutel.
#
# LET OP, en dit is geen formaliteit:
#
#   * Deze sleutel geeft toegang tot het HÉLE storage account, niet tot deze ene share. Bij
#     acisafiles is dat hetzelfde account waar de AVD-omgeving op draait.
#   * Er is geen identiteit per gebruiker. Iedereen die mount is dezelfde "gebruiker", dus
#     rechten per persoon en herleidbaarheid in de logs bestaan niet.
#   * Iedereen die het script kan lezen heeft de sleutel — in Intune, en op het toestel.
#
# VUL HEM HIER NOOIT IN IN DE REPO. Deze waarde blijft in git op de placeholder staan; de kopie
# die je in Intune uploadt draagt de echte sleutel. Een sleutel in git staat er voorgoed in, ook
# na een commit die hem weghaalt, en roulering breekt dan alles wat hem gebruikt.
#
# Plak de sleutel zoals Azure hem geeft; het script codeert hem zelf voor de URL.

STORAGE_KEY=""

# --- Vanaf hier niets meer aanpassen -------------------------------------------------------

STATE_DIR="$HOME/Library/Application Support/Baseline"

# De log staat in ~/Library/Logs en niet naast de markeringen in Application Support. Dat is
# de plek waar macOS logs verwacht, maar de reden is praktischer: Intune kan met "Collect
# logs" bestanden van het toestel ophalen, en die paden worden met een puntkomma gescheiden
# zónder spaties. "Application Support" heeft een spatie in de naam en is daarmee niet op te
# halen — precies op het moment dat je de log het hardst nodig hebt.
LOG_DIR="$HOME/Library/Logs/Baseline"
LOG="$LOG_DIR/mount-azure-files.log"
HELPER="$STATE_DIR/mount-azure-files.sh"
LABEL="com.aci-europe.baseline.mount-azure-files"
AGENT="$HOME/Library/LaunchAgents/$LABEL.plist"

SERVER="$STORAGE_ACCOUNT.file.core.windows.net"
SMB_PAD="//${SERVER}/${SHARE_NAME}${SHARE_SUBPATH:+/${SHARE_SUBPATH}}"

# De naam die in de Finder-zijbalk komt te staan, en dus ook de map in /Volumes.
MOUNT_NAAM="${SHARE_SUBPATH:-$SHARE_NAME}"
MOUNTPOINT="/Volumes/$MOUNT_NAAM"

mkdir -p "$STATE_DIR" "$LOG_DIR"

# Naar het logbestand én naar stdout. Intune bewaart de uitvoer van een shellscript en toont
# die in de portal bij het apparaat; zonder dat tweede spoor staat er alleen "Failed" of
# "Success" en moet je voor elke diagnose op de Mac zelf zijn.
log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

if [ "$STORAGE_ACCOUNT" = "STORAGE-ACCOUNT-INVULLEN" ] || [ "$SHARE_NAME" = "SHARE-NAAM-INVULLEN" ]; then
  log "Storage account of share staat nog op de placeholder — niets gedaan."
  exit 1
fi

# --- Mounten -------------------------------------------------------------------------------

# Op het mountpad, want dat kiezen we nu zelf: mount_smbfs zet de share precies op het pad dat
# je meegeeft. Vergelijken op kolom 3 van `mount` en niet met grep op de hele regel — anders
# zou /Volumes/Public ook matchen op /Volumes/Public-2, en dan denkt het script dat het al
# goed staat terwijl het naar een andere mount kijkt.
is_mounted() {
  /sbin/mount 2>/dev/null | /usr/bin/awk -v m="$MOUNTPOINT" '$3 == m { gevonden = 1 } END { exit !gevonden }'
}

# Drie manieren, want ze kijken geen van drieën naar hetzelfde. `klist -s` is de nette check
# maar geldt alleen voor de standaardcache, en Platform SSO zet het cloud-TGT in een cache met
# een eigen naam — `app-sso platform -s` toont die als "cacheName": "9205B6F4-…". `klist -l`
# somt álle caches op. Eén van de drie is genoeg.
has_ticket() {
  /usr/bin/klist -s 2>/dev/null && return 0
  { /usr/bin/klist -l 2>/dev/null; /usr/bin/klist 2>/dev/null; } |
    grep -q "KERBEROS.MICROSOFTONLINE.COM"
}

# macOS heeft geen `timeout`; die zit in coreutils en dat staat er niet standaard op.
#
# `mount_smbfs -N` vraagt niets, maar hij kan wél lang blijven wachten op een server die niet
# antwoordt — poort 445 dicht op een gastnetwerk is het gewone geval. Een Intune-shellscript
# dat na 60 minuten nog draait wordt door de agent afgebroken en als "Failed" gerapporteerd,
# zonder uitvoer. Liever zelf afbreken met een regel in de log erbij.
with_timeout() {
  local secs="$1"
  shift
  "$@" &
  local pid=$!
  local waited=0
  while kill -0 "$pid" 2>/dev/null; do
    if [ "$waited" -ge "$secs" ]; then
      kill -9 "$pid" 2>/dev/null
      wait "$pid" 2>/dev/null
      return 124
    fi
    sleep 1
    waited=$((waited + 1))
  done
  wait "$pid"
}

# Een storage account key bevat +, / en = en die moeten percent-gecodeerd de URL in, anders
# breekt hij op het eerste schuine streepje. Zo kan de sleutel erin zoals Azure hem geeft.
urlencode() {
  local s="$1" out="" c i
  for ((i = 0; i < ${#s}; i++)); do
    c="${s:i:1}"
    case "$c" in
      [a-zA-Z0-9.~_-]) out="$out$c" ;;
      *) out="$out$(printf '%%%02X' "'$c")" ;;
    esac
  done
  printf '%s' "$out"
}

# Mounten met de sleutel in plaats van met een ticket. De gebruikersnaam voor Azure Files met
# gedeelde sleutel is de accountnaam zelf.
#
# De sleutel staat hier in de aanroep en dus kortstondig in de procestabel. Dat is niet mooi,
# maar het is niet de zwakste schakel: dezelfde sleutel staat sowieso in het script op elk
# toestel. Het alternatief is de sleutelhanger, en die vraagt op macOS een toestemmingsdialoog
# tenzij hetzelfde ondertekende programma hem schrijft én leest — dat is precies waarom
# 42Loris/macOS_DriveMapping daar een eigen Swift-helper met Developer ID voor bouwt.
mount_met_sleutel() {
  with_timeout 60 /sbin/mount_smbfs -N -o soft \
    "//${STORAGE_ACCOUNT}:$(urlencode "$STORAGE_KEY")@${SERVER}/${SHARE_NAME}${SHARE_SUBPATH:+/${SHARE_SUBPATH}}" \
    "$MOUNTPOINT" 2>>"$LOG"
}

mount_share() {
  if is_mounted; then
    return 0
  fi

  # --- Eerst Kerberos ---------------------------------------------------------------------
  #
  # mount_smbfs -N, en uitdrukkelijk niet `osascript -e 'mount volume'`. Die laatste gaat door
  # NetFS, en NetFS zet bij een URL zonder inloggegevens een "verbinden"-dialoog op het scherm
  # zodra Kerberos niet wordt geaccepteerd. Uit een LaunchAgent antwoordt daar niemand op: het
  # script blijft staan tot de Intune-agent het na 60 minuten afbreekt en "Failed" meldt,
  # zonder één regel uitvoer. -N vraagt per definitie niets en gebruikt het TGT dat er is.
  #
  # mount_smbfs maakt bovendien zijn eigen mountpunt in /Volumes aan, ook als gewone gebruiker.
  # Dát het in /Volumes staat is wat Finder in de zijbalk onder Locaties zet.
  if has_ticket || [ "${FORCE:-0}" -eq 1 ]; then
    with_timeout 60 /sbin/mount_smbfs -N -o soft "$SMB_PAD" "$MOUNTPOINT" 2>>"$LOG"
    case $? in
      0)
        log "Gemount met Kerberos: ${SMB_PAD} op ${MOUNTPOINT}"
        return 0
        ;;
      124)
        log "Kerberos-mount liep vast en is na 60s afgebroken — server niet bereikbaar of poort 445 dicht."
        ;;
      *)
        log "Kerberos-mount geweigerd voor ${SMB_PAD}."
        ;;
    esac
  elif [ "${QUIET:-0}" -ne 1 ]; then
    # QUIET staat aan als de LaunchAgent belt. Die vuurt bij elke netwerkwijziging, en zolang er
    # geen ticket is zou dat de log vullen met dezelfde regel.
    log "Geen ticket voor KERBEROS.MICROSOFTONLINE.COM in een van de caches. Controleer met: app-sso platform -s"
  fi

  # --- Dan de sleutel ---------------------------------------------------------------------
  if [ -z "$STORAGE_KEY" ]; then
    return 1
  fi

  mount_met_sleutel
  case $? in
    0)
      log "Gemount met de storage account key op ${MOUNTPOINT}. Let op: dit is toegang zonder identiteit per gebruiker."
      return 0
      ;;
    124)
      log "Mount met de sleutel liep vast en is na 60s afgebroken."
      return 1
      ;;
    *)
      log "Mount met de sleutel mislukt (zie de regel hierboven voor de melding van mount_smbfs)."
      return 1
      ;;
  esac
}

if [ "${1:-}" = "--mount" ]; then
  QUIET=1 mount_share
  exit $?
fi

if [ "${1:-}" = "--force" ]; then
  FORCE=1 mount_share
  exit $?
fi

# --- Installeren ---------------------------------------------------------------------------
#
# Het script kopieert zichzelf en laat de LaunchAgent die kopie aanroepen. Eén bestand met de
# instellingen erin, dus de agent kan niet uit de pas lopen met wat Intune uitrolt.

# Vanaf hier is dit een Intune-run. De eerste regel is er om te kunnen zien dát het script
# heeft gedraaid: staat hij er niet, dan is het script nooit begonnen en zit de fout ervóór —
# bij het uploaden of bij de interpreter, niet in de logica hieronder.
log "Gestart als $(id -un) (uid $(id -u)), macOS $(/usr/bin/sw_vers -productVersion), doel ${SMB_PAD}"

if ! cmp -s "$0" "$HELPER"; then
  cp "$0" "$HELPER" && chmod 755 "$HELPER"
  log "Helper bijgewerkt."
  NEEDS_RELOAD=1
else
  NEEDS_RELOAD=0
fi

read -r -d '' PLIST <<PLIST_EOF || true
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${HELPER}</string>
        <string>--mount</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WatchPaths</key>
    <array>
        <string>/private/var/run/resolv.conf</string>
        <string>/Library/Preferences/SystemConfiguration/com.apple.network.identification.plist</string>
        <string>/Library/Preferences/SystemConfiguration/NetworkInterfaces.plist</string>
    </array>
    <key>ThrottleInterval</key>
    <integer>10</integer>
    <key>ProcessType</key>
    <string>Background</string>
</dict>
</plist>
PLIST_EOF

mkdir -p "$HOME/Library/LaunchAgents"
if [ ! -f "$AGENT" ] || [ "$(cat "$AGENT")" != "$PLIST" ]; then
  printf '%s\n' "$PLIST" >"$AGENT"
  log "LaunchAgent geschreven."
  NEEDS_RELOAD=1
fi

if [ "$NEEDS_RELOAD" -eq 1 ]; then
  # bootout mag falen: de eerste keer draait er nog niets.
  /bin/launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null
  if /bin/launchctl bootstrap "gui/$(id -u)" "$AGENT" 2>>"$LOG"; then
    log "LaunchAgent geladen."
  else
    log "LaunchAgent laden mislukt."
  fi
fi

mount_share

# Bewust altijd 0. Een Intune-shellscript dat niet-nul teruggeeft komt in de portal als
# "Failed" te staan, en zolang de Azure Files-preview niet aanstaat is er op geen enkele Mac
# een ticket — dan zou élk toestel permanent rood staan voor iets dat volgens plan verloopt.
# Wat er wél gebeurde staat hierboven in de uitvoer, en die bewaart Intune bij het apparaat.
# Zie je in de portal tóch "Failed", dan is het script niet zelf tot hier gekomen.
log "Klaar."
exit 0
