#!/bin/bash
#
# Mount een Azure Files-share op de Mac met het Kerberos-ticket uit Platform SSO, zodat de
# gebruiker geen wachtwoord hoeft in te vullen. Het macOS-equivalent van een drive mapping.
#
# De share komt in /Volumes en staat daarmee in de Finder-zijbalk onder Locaties, met een
# uitwerpknop — zie de opmerking bij mount_share() waarom dat via NetFS moet en niet met
# mount_smbfs.
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
#   share dus pas een uur na het inloggen terugzetten. De LaunchAgent doet het bij login en
#   daarna elke vijf minuten — dit script installeert alleen die agent en doet één eerste
#   poging.
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
SMB_URL="smb://${SERVER}/${SHARE_NAME}${SHARE_SUBPATH:+/${SHARE_SUBPATH}}"

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

# Op server en share, en bewust niet op het mountpad en niet op de submap. Twee redenen: als
# /Volumes/<naam> al bezet is hangt macOS er een cijfer achter, en NetFS bepaalt zelf of het
# de mount op de submap of op de share zet. Een controle op iets specifiekers zou de share
# elke ronde opnieuw mounten omdat hij zijn eigen mount niet herkent.
is_mounted() {
  /sbin/mount -t smbfs 2>/dev/null | grep -qi "${SERVER}/${SHARE_NAME} on "
}

# `klist -l` én een kale `klist`, want die twee kijken niet naar hetzelfde. Platform SSO zet
# het cloud-TGT in een cache met een eigen naam — `app-sso platform -s` laat die zien als
# "cacheName": "9205B6F4-…" — en een kale `klist` toont alleen de standaardcache. Zit het
# ticket in zo'n benoemde cache, dan meldt dit script anders elke ronde dat er geen ticket is
# terwijl het er wél was, en mount het nooit.
has_ticket() {
  { /usr/bin/klist -l 2>/dev/null; /usr/bin/klist 2>/dev/null; } |
    grep -q "KERBEROS.MICROSOFTONLINE.COM"
}

# macOS heeft geen `timeout`; die zit in coreutils en dat staat er niet standaard op.
#
# Nodig omdat `mount volume` kán blijven staan: heeft de Mac wél een ticket maar accepteert
# de share het niet, dan valt NetFS terug op een aanmeldvenster en wacht het tot iemand het
# invult. Uit een LaunchAgent gebeurt dat nooit. Het script blijft dan hangen, en een
# Intune-shellscript dat niet op tijd klaar is wordt door de agent afgebroken en als "Failed"
# gerapporteerd — zonder uitvoer, want die komt er nooit uit.
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

mount_share() {
  if is_mounted; then
    return 0
  fi

  # Zonder ticket niet proberen. NetFS zet bij een mislukte Kerberos-mount een aanmeldvenster
  # op het scherm, en dat elke vijf minuten uit een achtergrondagent is erger dan geen share.
  # --force is er voor handmatig testen, wanneer je de dialoog juist wil zien.
  #
  # QUIET staat aan als de LaunchAgent belt. Die draait elke vijf minuten, en zolang de
  # preview niet aanstaat is er nooit een ticket — dat zou 288 identieke regels per dag in de
  # log zetten en de ene regel die er wél toe doet onvindbaar maken. De uurlijkse Intune-run
  # meldt het wel, en dat is vaak genoeg om te weten dat het script leeft.
  if ! has_ticket && [ "${FORCE:-0}" -ne 1 ]; then
    if [ "${QUIET:-0}" -ne 1 ]; then
      log "Geen ticket voor KERBEROS.MICROSOFTONLINE.COM in een van de caches — niet gemount. Controleer met: app-sso platform -s (kerberosStatus moet ticketKeyPath tgt_cloud en importSuccessful true tonen)."
    fi
    return 0
  fi

  # Via NetFS (`mount volume`) en niet via mount_smbfs. Dat is het verschil tussen een share
  # die in Finder staat en een die er niet staat: NetFS mount in /Volumes, precies zoals
  # Finder → Verbind met server, en dan zet Finder hem in de zijbalk onder Locaties mét
  # uitwerpknop. mount_smbfs mount naar een map die je zelf aanmaakt — dat werkt, maar zo'n
  # mount is voor Finder geen server en verschijnt dus nergens in de zijbalk. Een gewone
  # gebruiker mag zelf niets in /Volumes aanmaken; NetFS regelt dat wel.
  with_timeout 30 /usr/bin/osascript -e "mount volume \"${SMB_URL}\"" >/dev/null 2>>"$LOG"
  case $? in
    0)
      log "Gemount: ${SMB_URL}"
      return 0
      ;;
    124)
      log "Mount liep vast op ${SMB_URL} en is na 30s afgebroken — vrijwel zeker een aanmeldvenster dat op antwoord wacht. Het ticket wordt door de share niet geaccepteerd."
      return 1
      ;;
    *)
      log "Mount mislukt voor ${SMB_URL}"
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
log "Gestart als $(id -un) (uid $(id -u)), macOS $(/usr/bin/sw_vers -productVersion), doel ${SMB_URL}"

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
    <key>StartInterval</key>
    <integer>300</integer>
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
