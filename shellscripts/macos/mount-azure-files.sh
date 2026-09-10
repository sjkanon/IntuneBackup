#!/bin/bash
#
# Zet op een Mac een LaunchAgent klaar die een Azure Files-share mount — het macOS-equivalent
# van een drive mapping. Dit script mount zélf niets.
#
# Waarom die taakverdeling:
#
#   Een mount hoort in de grafische sessie van de gebruiker, en het proces dat de Intune-agent
#   start zit daar niet in. Vandaar dat mounten met de hand wél lukt en vanuit Intune niet, hoe
#   goed de mountlogica ook is. Dus:
#
#     dit script, als root   schrijft de helper en de LaunchAgent naar /Library
#     de LaunchAgent         mount, in de sessie van de gebruiker, bij login en netwerkwijziging
#
#   Een LaunchAgent in /Library/LaunchAgents laadt macOS automatisch voor élke gebruiker bij
#   élke login. Geen launchctl bootstrap vanuit een domein waar we niet in zitten, en meteen
#   goed voor de volgende persoon op dat toestel.
#
# Waarom de helper wordt geschreven en niet gekopieerd:
#
#   Dat was eerst een cp van $0 naar de helper. Bij de Intune-agent wijst $0 niet naar de
#   scripttekst, dus belandde er iets anders in /Library/Scripts — een binair bestand, en de
#   LaunchAgent stierf met exit 126, "cannot execute binary file". Nu genereert dit script de
#   helper: de instellingen hieronder worden erin geschreven en de rest komt uit een letterlijk
#   heredoc. Eén plek voor de instellingen, en geen enkele aanname over hoe dit bestand wordt
#   aangeroepen.
#
# Waarom een script en geen configuratieprofiel:
#
#   Er is er geen. Alle 18.329 settingDefinitionId's van de settings catalog zijn nagezocht op
#   een payload die een netwerkschijf koppelt: die bestaat niet, op geen van beide platformen.
#   Mounten is een handeling, geen instelling.
#
# In Intune: Devices → macOS → Shell scripts. Vereiste instellingen:
#
#   Run script as signed-in user   No     dit script schrijft naar /Library en dat mag alleen
#                                         root; mounten doet de LaunchAgent
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# Toewijzen aan een APPARAATgroep. De LaunchAgent werkt daarna voor iedere gebruiker van dat
# toestel; een gebruikersgroep zou alleen de eerste persoon bedienen.

set -u

# --- De share ------------------------------------------------------------------------------
#
# \\acisafiles.file.core.windows.net\data\Public wordt smb://acisafiles.file.core.windows.net
# /data/Public. In drie velden, want SMB kent maar één sharelaag: `data` is de share, `Public`
# is een map dáárin. De mount en de rechten hangen aan de share; de submap is alleen het punt
# waar je binnenkomt. SHARE_SUBPATH leeg laten mount de hele share.

STORAGE_ACCOUNT="acisafiles"
SHARE_NAME="data"
SHARE_SUBPATH="Public"

# --- Terugval op de storage account key ----------------------------------------------------
#
# Leeg laten = alleen Kerberos. Staat er een sleutel, dan probeert de helper eerst een ticket en
# valt daarna terug op deze sleutel.
#
# LET OP, en dit is geen formaliteit:
#
#   * Deze sleutel geeft toegang tot het HÉLE storage account, niet tot deze ene share. Bij
#     acisafiles is dat hetzelfde account waar de AVD-omgeving op draait.
#   * Er is geen identiteit per gebruiker. Iedereen die mount is dezelfde "gebruiker", dus
#     rechten per persoon en herleidbaarheid in de logs bestaan niet.
#   * Iedereen die de helper kan lezen heeft de sleutel — in Intune, en op het toestel.
#
# VUL HEM HIER NOOIT IN IN DE REPO; die staat publiek op GitHub. Deze waarde blijft in git op de
# lege placeholder staan. De kopie in local/ draagt de echte sleutel en gaat niet mee in git.
#
# Plak de sleutel zoals Azure hem geeft, zonder iets te vervangen.

STORAGE_KEY=""

# --- Vanaf hier niets meer aanpassen -------------------------------------------------------

LABEL="com.aci-europe.baseline.mount-azure-files"
HELPER="/Library/Scripts/Baseline/mount-azure-files.sh"
AGENT="/Library/LaunchAgents/$LABEL.plist"

# Spatievrij, zodat Intune deze log met "Collect logs" kan ophalen. "Application Support" heeft
# een spatie in de naam en is daarmee niet op te halen — precies op het moment dat je hem nodig
# hebt. De helper logt in de thuismap van de gebruiker, want die draait per persoon.
LOG_DIR="/Library/Logs/Baseline"
LOG="$LOG_DIR/mount-azure-files-install.log"

mkdir -p "$LOG_DIR"

# Naar het logbestand én naar stdout: Intune bewaart de uitvoer en toont die in de portal bij
# het apparaat. Zonder dat tweede spoor staat er alleen "Failed" of "Success".
log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

log "Gestart als $(id -un) (uid $(id -u)), macOS $(/usr/bin/sw_vers -productVersion)."

if [ "$STORAGE_ACCOUNT" = "STORAGE-ACCOUNT-INVULLEN" ] || [ "$SHARE_NAME" = "SHARE-NAAM-INVULLEN" ]; then
  log "Storage account of share staat nog op de placeholder — niets gedaan."
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  log "Dit script hoort als root te draaien: zet in Intune 'Run script as signed-in user' op No."
  exit 1
fi

# --- De helper schrijven -------------------------------------------------------------------
#
# Eerst de instellingen, met %q zodat elk vreemd teken in de sleutel veilig wordt geciteerd.
# Daarna de logica uit een letterlijk heredoc: daarin wordt niets geëxpandeerd, dus die tekst
# komt er precies zo uit als hij hier staat.

NIEUW="$(mktemp)"
{
  printf '#!/bin/bash\n'
  printf '#\n'
  printf '# GEGENEREERD door mount-azure-files.sh via Intune. Niet met de hand bijwerken:\n'
  printf '# de eerstvolgende run overschrijft dit bestand.\n'
  printf '#\n'
  printf 'set -u\n'
  printf 'STORAGE_ACCOUNT=%q\n' "$STORAGE_ACCOUNT"
  printf 'SHARE_NAME=%q\n' "$SHARE_NAME"
  printf 'SHARE_SUBPATH=%q\n' "$SHARE_SUBPATH"
  printf 'STORAGE_KEY=%q\n' "$STORAGE_KEY"
  cat <<'HELPER_EINDE'

STATE_DIR="$HOME/Library/Application Support/Baseline"
LOG_DIR="$HOME/Library/Logs/Baseline"
LOG="$LOG_DIR/mount-azure-files.log"
FAVORIET_MARKER="$STATE_DIR/favoriet"

SERVER="$STORAGE_ACCOUNT.file.core.windows.net"
DOEL="smb://${SERVER}/${SHARE_NAME}${SHARE_SUBPATH:+/${SHARE_SUBPATH}}"

mkdir -p "$STATE_DIR" "$LOG_DIR"

log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

# macOS heeft geen timeout-commando; dat zit in coreutils en staat er niet standaard op. Nodig
# omdat een mount lang kan blijven wachten op een server die niet antwoordt, en omdat NetFS bij
# een afgewezen aanmelding een dialoog opzet waar uit een achtergrondagent niemand op reageert.
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

# Waar staat deze share nu gemount? NetFS kiest de naam in /Volumes zelf, dus opzoeken in plaats
# van aannemen. Met sed en niet met awk, want een mountpad kan spaties bevatten.
huidig_mountpunt() {
  /sbin/mount 2>/dev/null |
    /usr/bin/grep -i "${SERVER}/${SHARE_NAME}" |
    /usr/bin/sed -n 's/.* on \(.*\) (.*/\1/p' |
    /usr/bin/head -1
}

is_mounted() {
  [ -n "$(huidig_mountpunt)" ]
}

# Drie manieren, want ze kijken geen van drieën naar hetzelfde. klist -s is de nette check maar
# geldt alleen voor de standaardcache, en Platform SSO zet het cloud-TGT in een cache met een
# eigen naam. klist -l somt alle caches op. Eén van de drie is genoeg.
has_ticket() {
  /usr/bin/klist -s 2>/dev/null && return 0
  { /usr/bin/klist -l 2>/dev/null; /usr/bin/klist 2>/dev/null; } |
    grep -q "KERBEROS.MICROSOFTONLINE.COM"
}

# Een TGT is nog geen toegang. Kerberos gaat in twee stappen: het TGT bewijst wie je bent, en
# daarna vraag je een bewijs voor één dienst — cifs/<server>. Die tweede stap kan mislukken
# terwijl de eerste prima is; op acisafiles geeft hij AADSTS700016, want Entra Kerberos staat
# daar niet aan.
#
# Vooraf vragen en niet gewoon proberen: alleen als dit lukt weten we dat NetFS geen
# aanmeldvenster gaat opzetten, en dat is de voorwaarde om Kerberos via NetFS te mogen mounten.
has_service_ticket() {
  [ -x /usr/bin/kgetcred ] || return 1
  with_timeout 20 /usr/bin/kgetcred \
    "cifs/${SERVER}@KERBEROS.MICROSOFTONLINE.COM" >/dev/null 2>&1
}

# Mounten via NetFS. Dit is de weg die /Volumes openkrijgt voor een gewone gebruiker —
# mount_smbfs moet zijn mountpunt zelf aanmaken en mag dat daar niet, wat "Operation not
# permitted" oplevert. NetFS draait met de rechten die het wel mogen, net als Finder → Verbind
# met server. En alleen wat in /Volumes staat, zet Finder in de zijbalk onder Locaties.
#
# De sleutel gaat via stdin naar osascript en niet als argument, dus hij staat niet in de
# procestabel. Coderen hoeft niet: as user name / with password neemt de waarde zoals hij is.
mount_via_netfs() {
  if [ "${1:-}" != "sleutel" ]; then
    with_timeout 60 /usr/bin/osascript -e "mount volume \"${DOEL}\"" >/dev/null 2>>"$LOG"
    return $?
  fi
  with_timeout 60 /usr/bin/osascript >/dev/null 2>>"$LOG" <<OSA
mount volume "${DOEL}" as user name "${STORAGE_ACCOUNT}" with password "${STORAGE_KEY}"
OSA
}

# Zet het mountpunt in de Favorieten bovenin de Finder-zijbalk, met sfltool van Apple zelf; geen
# tool van derden nodig. Eén keer, met een markering ernaast — anders zet elke netwerkwijziging
# er een regel bij en staat de zijbalk na een dag vol met dezelfde snelkoppeling.
#
# Locaties en Favorieten zijn niet hetzelfde: een gemounte server verschijnt vanzelf onder
# Locaties en verdwijnt bij uitwerpen; een favoriet is een vaste verwijzing die blijft staan.
zet_in_favorieten() {
  local mp="$1" url
  [ -x /usr/bin/sfltool ] || return 0
  if [ -f "$FAVORIET_MARKER" ] && [ "$(cat "$FAVORIET_MARKER" 2>/dev/null)" = "$mp" ]; then
    return 0
  fi
  url="file://${mp// /%20}"
  if /usr/bin/sfltool add-item com.apple.LSSharedFileList.FavoriteItems "$url" >>"$LOG" 2>&1; then
    printf '%s' "$mp" >"$FAVORIET_MARKER"
    log "In de Finder-favorieten gezet: ${mp}"
  fi
}

mount_share() {
  if is_mounted; then
    return 0
  fi

  # Kerberos eerst: dat is de vorm met identiteit per gebruiker, de sleutel is de terugval.
  # Zodra Entra Kerberos ergens wel aanstaat, neemt Kerberos vanzelf over.
  local methoden=()
  if has_ticket; then
    if has_service_ticket; then
      methoden+=("kerberos")
    elif [ "${QUIET:-0}" -ne 1 ]; then
      log "Wel een TGT, maar geen servicebewijs voor cifs/${SERVER} — Entra Kerberos staat niet aan op dit storage account (AADSTS700016)."
    fi
  elif [ "${QUIET:-0}" -ne 1 ]; then
    log "Geen ticket voor KERBEROS.MICROSOFTONLINE.COM. Controleer met: app-sso platform -s"
  fi
  if [ -n "$STORAGE_KEY" ]; then
    methoden+=("sleutel")
  fi
  if [ "${#methoden[@]}" -eq 0 ]; then
    return 1
  fi

  local methode mp
  for methode in "${methoden[@]}"; do
    mount_via_netfs "$methode"
    case $? in
      0) ;;
      124)
        log "Mount (${methode}) liep vast en is na 60s afgebroken — server onbereikbaar, of er wacht een aanmeldvenster."
        return 1
        ;;
      *)
        log "Mount met ${methode} mislukt."
        continue
        ;;
    esac

    mp="$(huidig_mountpunt)"
    [ -n "$mp" ] || mp="onbekend pad"
    if [ "$methode" = "sleutel" ]; then
      log "Gemount met de storage account key op ${mp} — let op: toegang zonder identiteit per gebruiker."
    else
      log "Gemount met Kerberos op ${mp}."
    fi
    zet_in_favorieten "$mp"
    return 0
  done

  return 1
}

# QUIET onderdrukt de regels over een ontbrekend ticket. De agent vuurt bij elke
# netwerkwijziging, en zonder dit zou de log volstromen met dezelfde melding.
if [ "${1:-}" = "--stil" ]; then
  QUIET=1 mount_share
else
  log "Handmatig gestart."
  mount_share
fi
exit $?
HELPER_EINDE
} >"$NIEUW"

# --- Controleren wat er geschreven is, vóór het in gebruik gaat -----------------------------
#
# Precies de fout die dit script eerder maakte: er belandde een binair bestand in /Library en de
# LaunchAgent stierf met exit 126. Een syntaxcontrole kost niets en vangt dat af.
if ! /bin/bash -n "$NIEUW" 2>>"$LOG"; then
  log "De gegenereerde helper is geen geldig script — niets vervangen."
  rm -f "$NIEUW"
  exit 1
fi

HERLADEN=0
mkdir -p "$(dirname "$HELPER")"
if ! cmp -s "$NIEUW" "$HELPER"; then
  mv "$NIEUW" "$HELPER"
  chown root:wheel "$HELPER"
  chmod 755 "$HELPER"
  log "Helper geschreven: ${HELPER}"
  HERLADEN=1
else
  rm -f "$NIEUW"
fi

# --- De LaunchAgent --------------------------------------------------------------------------
#
# RunAtLoad plus WatchPaths op resolv.conf en de netwerkconfiguratie: een share mount je als het
# netwerk verandert, niet om de zoveel minuten. Wifi-wissel, VPN erbij, uit de slaap komen — dat
# zijn de momenten waarop een mount weg is of juist weer kan.

read -r -d '' PLIST <<PLIST_EINDE || true
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
        <string>--stil</string>
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
</dict>
</plist>
PLIST_EINDE

if [ ! -f "$AGENT" ] || [ "$(cat "$AGENT")" != "$PLIST" ]; then
  printf '%s\n' "$PLIST" >"$AGENT"
  chown root:wheel "$AGENT"
  chmod 644 "$AGENT"
  log "LaunchAgent geschreven: ${AGENT}"
  HERLADEN=1
fi

# --- Meteen laden voor wie er nu achter zit --------------------------------------------------
#
# Bij de volgende login laadt macOS de agent vanzelf. Maar er zit nu iemand achter dit toestel,
# en die wil zijn schijf niet pas morgen. Root mag laden in de grafische sessie van de
# console-gebruiker.

if [ "$HERLADEN" -eq 0 ]; then
  log "Helper en LaunchAgent stonden al goed."
  log "Klaar."
  exit 0
fi

CONSOLE_GEBRUIKER="$(/usr/bin/stat -f%Su /dev/console 2>/dev/null)"
if [ -n "$CONSOLE_GEBRUIKER" ] && [ "$CONSOLE_GEBRUIKER" != "root" ]; then
  CONSOLE_UID="$(/usr/bin/id -u "$CONSOLE_GEBRUIKER" 2>/dev/null)"
  if [ -n "$CONSOLE_UID" ]; then
    /bin/launchctl bootout "gui/${CONSOLE_UID}/${LABEL}" 2>/dev/null
    if /bin/launchctl bootstrap "gui/${CONSOLE_UID}" "$AGENT" 2>>"$LOG"; then
      log "LaunchAgent geladen voor ${CONSOLE_GEBRUIKER}. Het resultaat van de mount staat in ~/Library/Logs/Baseline/mount-azure-files.log van die gebruiker."
    else
      log "LaunchAgent laden voor ${CONSOLE_GEBRUIKER} mislukt; hij gaat vanzelf bij de volgende login."
    fi
  fi
fi

# Bewust altijd 0. Of de mount lukt is hier niet te zien — dat gebeurt in de sessie van de
# gebruiker. Wat dit script kon doen staat hierboven.
log "Klaar."
exit 0
