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
# Storage account en sharenaam apart, want de SMB-URL ziet er anders uit dan de HTTPS-URL uit
# de portal: https://acisafiles.file.core.windows.net/data wordt
# smb://acisafiles.file.core.windows.net/data.
#
# Deze twee staan bewust als platte tekst in dit bestand en niet als CIPP-token: een
# shellscript gaat niet door Get-CIPPTextReplacement heen — dat werkt alleen op de templates
# in IntuneTemplate/. Wat hier staat is wat er op het apparaat draait.

STORAGE_ACCOUNT="acisafiles"
SHARE_NAME="data"

# --- Vanaf hier niets meer aanpassen -------------------------------------------------------

STATE_DIR="$HOME/Library/Application Support/Baseline"
LOG="$STATE_DIR/mount-azure-files.log"
HELPER="$STATE_DIR/mount-azure-files.sh"
LABEL="com.aci-europe.baseline.mount-azure-files"
AGENT="$HOME/Library/LaunchAgents/$LABEL.plist"

SERVER="$STORAGE_ACCOUNT.file.core.windows.net"
SMB_URL="smb://${SERVER}/${SHARE_NAME}"

mkdir -p "$STATE_DIR"

log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" >>"$LOG"
}

if [ "$STORAGE_ACCOUNT" = "STORAGE-ACCOUNT-INVULLEN" ] || [ "$SHARE_NAME" = "SHARE-NAAM-INVULLEN" ]; then
  log "Storage account of share staat nog op de placeholder — niets gedaan."
  exit 1
fi

# --- Mounten -------------------------------------------------------------------------------

# Op server en share en niet op het mountpad: als /Volumes/<share> al bezet is hangt macOS er
# een cijfer achter, en dan zou een controle op de padnaam de share elke ronde opnieuw mounten.
is_mounted() {
  /sbin/mount -t smbfs 2>/dev/null | grep -qi "${SERVER}/${SHARE_NAME} on "
}

has_ticket() {
  /usr/bin/klist 2>/dev/null | grep -q "KERBEROS.MICROSOFTONLINE.COM"
}

mount_share() {
  if is_mounted; then
    return 0
  fi

  # Zonder ticket niet proberen. NetFS zet bij een mislukte Kerberos-mount een aanmeldvenster
  # op het scherm, en dat elke vijf minuten uit een achtergrondagent is erger dan geen share.
  # --force is er voor handmatig testen, wanneer je de dialoog juist wil zien.
  if ! has_ticket && [ "${FORCE:-0}" -ne 1 ]; then
    log "Geen ticket voor KERBEROS.MICROSOFTONLINE.COM in de cache — niet gemount."
    return 0
  fi

  # Via NetFS (`mount volume`) en niet via mount_smbfs. Dat is het verschil tussen een share
  # die in Finder staat en een die er niet staat: NetFS mount in /Volumes, precies zoals
  # Finder → Verbind met server, en dan zet Finder hem in de zijbalk onder Locaties mét
  # uitwerpknop. mount_smbfs mount naar een map die je zelf aanmaakt — dat werkt, maar zo'n
  # mount is voor Finder geen server en verschijnt dus nergens in de zijbalk. Een gewone
  # gebruiker mag zelf niets in /Volumes aanmaken; NetFS regelt dat wel.
  if /usr/bin/osascript -e "mount volume \"${SMB_URL}\"" >/dev/null 2>>"$LOG"; then
    log "Gemount: ${SMB_URL}"
    return 0
  fi

  log "Mount mislukt voor ${SMB_URL}"
  return 1
}

if [ "${1:-}" = "--mount" ]; then
  mount_share
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
exit 0
