#!/bin/bash
#
# Mount een Azure Files-share op de Mac met het Kerberos-ticket uit Platform SSO, zodat de
# gebruiker geen wachtwoord hoeft in te vullen. Het macOS-equivalent van een drive mapping.
#
# De share komt in /Volumes en staat daarmee in de Finder-zijbalk onder Locaties, met een
# uitwerpknop. Dat het in /Volumes staat is wat telt, niet welk commando hem mountte — zie de
# opmerking bij mount_share() waarom beide wegen via NetFS lopen, en waarom het script vooraf
# controleert of de aanmelding gaat lukken.
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
#   Run script as signed-in user   No     dit script installeert alleen; het schrijft naar
#                                         /Library en dat mag alleen root. Mounten doet de
#                                         LaunchAgent, in de sessie van de gebruiker.
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# Toewijzen aan een APPARAATgroep. Dat is nieuw ten opzichte van de eerste opzet: het script
# draait nu als root en zet een systeembrede LaunchAgent klaar, die vervolgens voor iedere
# gebruiker van dit toestel werkt. Een gebruikersgroep zou alleen de eerste persoon bedienen.
#
# Wie er bij de share mág blijft een eigenschap van de gebruiker — dat regelen de share-level
# permissions in Azure, niet de toewijzing van dit script. Behalve bij de sleutel-terugval: die
# kent geen identiteit per gebruiker, dus dan bepaalt de toewijzing wél wie erbij kan.
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
# Plak de sleutel zoals Azure hem geeft, zonder iets te vervangen.

STORAGE_KEY=""

# --- Vanaf hier niets meer aanpassen -------------------------------------------------------

# Als root (de Intune-run) schrijft alles naar /Library, zodat het voor élke gebruiker geldt.
# Als gebruiker (de LaunchAgent) landen de markeringen en de log in de thuismap, want die zijn
# per persoon. Beide logpaden zijn spatievrij, zodat Intune ze met "Collect logs" kan ophalen.
if [ "$(id -u)" -eq 0 ]; then
  STATE_DIR="/Library/Application Support/Baseline"
  LOG_DIR="/Library/Logs/Baseline"
else
  STATE_DIR="$HOME/Library/Application Support/Baseline"
  LOG_DIR="$HOME/Library/Logs/Baseline"
fi

# De log staat in Library/Logs en niet naast de markeringen in Application Support. Dat is de
# plek waar macOS logs verwacht, maar de reden is praktischer: Intune kan met "Collect logs"
# bestanden ophalen, en die paden worden met een puntkomma gescheiden zónder spaties.
# "Application Support" heeft een spatie in de naam en is daarmee niet op te halen — precies op
# het moment dat je de log het hardst nodig hebt.
LOG="$LOG_DIR/mount-azure-files.log"
FAVORIET_MARKER="$STATE_DIR/favoriet"
LABEL="com.aci-europe.baseline.mount-azure-files"

# Systeembreed, niet in de thuismap. Een LaunchAgent in /Library/LaunchAgents laadt macOS
# automatisch voor élke gebruiker bij élke login — dat is precies wat we willen, en het scheelt
# het gedoe met `launchctl bootstrap` vanuit een sessie waar we niet in zitten.
HELPER="/Library/Scripts/Baseline/mount-azure-files.sh"
AGENT="/Library/LaunchAgents/$LABEL.plist"

SERVER="$STORAGE_ACCOUNT.file.core.windows.net"
SMB_PAD="//${SERVER}/${SHARE_NAME}${SHARE_SUBPATH:+/${SHARE_SUBPATH}}"

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

# Op server en share, niet op een pad: NetFS kiest de naam in /Volumes zelf, dus wat wij bedacht
# hadden hoeft er niet te staan.
is_mounted() {
  [ -n "$(huidig_mountpunt)" ]
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

# Kan de KDC een servicebewijs voor déze fileservice geven? Dat is de vraag die telt, en hij is
# rechtstreeks te stellen.
#
# Een TGT is namelijk nog geen toegang. Kerberos gaat in twee stappen: het TGT bewijst wie je
# bent tegenover het realm, en daarna vraag je een bewijs voor één specifieke dienst —
# `cifs/<server>`. Die tweede stap kan mislukken terwijl de eerste prima is. Op acisafiles gaf
# hij AADSTS700016: er is in de directory geen toepassing voor die fileservice, omdat Entra
# Kerberos niet aanstaat op dat account.
#
# Waarom dit vooraf vragen en niet gewoon de mount proberen: alleen als dit lukt, weten we dat
# NetFS geen aanmeldvenster gaat opzetten. En dát is de voorwaarde om Kerberos via NetFS te
# mogen mounten — de enige weg die op deze toestellen /Volumes openkrijgt.
has_service_ticket() {
  [ -x /usr/bin/kgetcred ] || return 1
  with_timeout 20 /usr/bin/kgetcred \
    "cifs/${SERVER}@KERBEROS.MICROSOFTONLINE.COM" >/dev/null 2>&1
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

# Mounten via NetFS, met de sleutel. Dit is de weg die /Volumes wél openkrijgt.
#
# `mount_smbfs` moet zijn mountpunt zelf aanmaken en mag dat op deze toestellen niet: /Volumes
# is er niet schrijfbaar voor een gewone gebruiker, en dan is "Operation not permitted" het
# antwoord. NetFS draait met de rechten die dat wél mogen — dat is hoe Finder → Verbind met
# server het ook doet. Gevolg: de share landt in /Volumes en staat dus in de zijbalk onder
# Locaties.
#
# Waarom dit hier wel mag en bij Kerberos niet: NetFS zet een aanmeldvenster op het scherm
# zodra de aanmelding wordt afgewezen, en uit een LaunchAgent antwoordt daar niemand op. Met een
# geldige sleutel wordt er niets afgewezen. Zonder sleutel — alleen een ticket — blijft dat
# risico bestaan, en daar houden we `mount_smbfs -N` aan. De timeout eromheen vangt af dat de
# sleutel ooit toch geweigerd wordt, bijvoorbeeld na roulering.
#
# De sleutel gaat via stdin naar osascript en niet als argument: zo staat hij niet in de
# procestabel. Percent-coderen hoeft hier ook niet — `as user name … with password …` neemt de
# waarde zoals hij is.
mount_via_netfs() {
  local doel="smb://${SERVER}/${SHARE_NAME}${SHARE_SUBPATH:+/${SHARE_SUBPATH}}"

  # Zonder inloggegevens: NetFS gebruikt dan het Kerberos-servicebewijs dat er is. Dat mag alleen
  # als has_service_ticket() net heeft bevestigd dát het er is — anders komt er een dialoog.
  if [ "${1:-}" != "sleutel" ]; then
    with_timeout 60 /usr/bin/osascript -e "mount volume \"${doel}\"" >/dev/null 2>>"$LOG"
    return $?
  fi

  with_timeout 60 /usr/bin/osascript >/dev/null 2>>"$LOG" <<OSA
mount volume "${doel}" as user name "${STORAGE_ACCOUNT}" with password "${STORAGE_KEY}"
OSA
}

# Waar staat deze share nu gemount? NetFS bepaalt de naam zelf, dus na afloop opzoeken in plaats
# van aannemen. Met sed en niet met awk, want een mountpad kan spaties bevatten.
huidig_mountpunt() {
  /sbin/mount 2>/dev/null |
    /usr/bin/grep -i "${SERVER}/${SHARE_NAME}" |
    /usr/bin/sed -n 's/.* on \(.*\) (.*/\1/p' |
    /usr/bin/head -1
}

# Zet het mountpunt in de Favorieten bovenin de Finder-zijbalk.
#
# Met `sfltool`, Apple's eigen commando; er is geen tool van derden voor nodig. Het moet wel als
# de ingelogde gebruiker draaien, want de favorietenlijst is per gebruiker — dat is hier het
# geval, zowel vanuit Intune ("Run script as signed-in user") als vanuit de LaunchAgent.
#
# Eén keer, met een markering ernaast. Zonder die markering zou elke netwerkwijziging er een
# regel bij zetten en staat de zijbalk na een dag vol met dezelfde snelkoppeling.
#
# Let op wat een favoriet wél en niet is: een gemounte server verschijnt vanzelf onder
# *Locaties* en verdwijnt daar weer bij het uitwerpen. Een favoriet is een vaste verwijzing naar
# een pad en blijft staan — ook als er op dat moment niets gemount is.
zet_in_favorieten() {
  local mp="$1" url
  [ -x /usr/bin/sfltool ] || return 0
  if [ -f "$FAVORIET_MARKER" ] && [ "$(cat "$FAVORIET_MARKER" 2>/dev/null)" = "$mp" ]; then
    return 0
  fi

  # Alleen spaties hoeven gecodeerd; de schuine strepen van het pad moeten juist blijven staan.
  url="file://${mp// /%20}"

  if /usr/bin/sfltool add-item com.apple.LSSharedFileList.FavoriteItems "$url" >>"$LOG" 2>&1; then
    printf '%s' "$mp" >"$FAVORIET_MARKER"
    log "In de Finder-favorieten gezet: ${mp}"
  else
    log "Kon ${mp} niet aan de Finder-favorieten toevoegen."
  fi
}

mount_share() {
  if is_mounted; then
    return 0
  fi

  # Kerberos eerst: dat is de vorm mét identiteit per gebruiker, de sleutel is de terugval — niet
  # andersom. Zodra Entra Kerberos ergens wél aanstaat, neemt Kerberos dus vanzelf over en hoeft
  # er aan dit script niets te veranderen.
  #
  # Beide wegen lopen via NetFS, want alleen die krijgt /Volumes open als gewone gebruiker, en
  # alleen wat in /Volumes staat zet Finder in de zijbalk. De prijs van NetFS is dat het een
  # aanmeldvenster opzet zodra de aanmelding wordt afgewezen, en uit een LaunchAgent antwoordt
  # daar niemand op. Daarom vraagt het script vooraf of de aanmelding gáát lukken: een
  # servicebewijs voor Kerberos, een ingevulde sleutel voor de terugval.
  local methoden=()
  if has_ticket || [ "${FORCE:-0}" -eq 1 ]; then
    if has_service_ticket || [ "${FORCE:-0}" -eq 1 ]; then
      methoden+=("kerberos")
    elif [ "${QUIET:-0}" -ne 1 ]; then
      log "Wel een TGT, maar de KDC geeft geen servicebewijs voor cifs/${SERVER}. Entra Kerberos staat niet aan op dit storage account (AADSTS700016), of de app-registratie ontbreekt."
    fi
  elif [ "${QUIET:-0}" -ne 1 ]; then
    # QUIET staat aan als de LaunchAgent belt. Die vuurt bij elke netwerkwijziging, en zolang er
    # geen ticket is zou dat de log vullen met dezelfde regel.
    log "Geen ticket voor KERBEROS.MICROSOFTONLINE.COM in een van de caches. Controleer met: app-sso platform -s"
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
# Dit deel draait als root, vanuit Intune, en mount zélf niets.
#
# Dat is de hele les van deze uitrol. Een mount hoort in de grafische sessie van de gebruiker,
# en het proces dat de Intune-agent start zit daar niet in — vandaar dat het met de hand wél
# lukte en via Intune niet. De taakverdeling is nu:
#
#   Intune, als root   zet de helper en de LaunchAgent klaar in /Library
#   LaunchAgent        mount, in de sessie van de gebruiker, bij login en bij netwerkwijziging
#
# Een LaunchAgent in /Library/LaunchAgents laadt macOS automatisch voor élke gebruiker bij élke
# login. Daarmee werkt het ook voor de volgende persoon op dit toestel, zonder dat iemand iets
# hoeft te doen.

log "Gestart als $(id -un) (uid $(id -u)), macOS $(/usr/bin/sw_vers -productVersion), doel ${SMB_PAD}"

if [ "$(id -u)" -ne 0 ]; then
  log "Dit script hoort als root te draaien: zet in Intune 'Run script as signed-in user' op No. Het mount niet zelf; de LaunchAgent doet dat in de sessie van de gebruiker."
  exit 1
fi

mkdir -p "$(dirname "$HELPER")" /Library/LaunchAgents

# De helper is een kopie van dit bestand: één bestand met de instellingen erin, dus de agent kan
# niet uit de pas lopen met wat Intune uitrolt.
if ! cmp -s "$0" "$HELPER"; then
  cp "$0" "$HELPER" && chown root:wheel "$HELPER" && chmod 755 "$HELPER"
  log "Helper bijgewerkt: ${HELPER}"
  HERLADEN=1
else
  HERLADEN=0
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

if [ ! -f "$AGENT" ] || [ "$(cat "$AGENT")" != "$PLIST" ]; then
  printf '%s
' "$PLIST" >"$AGENT"
  chown root:wheel "$AGENT"
  chmod 644 "$AGENT"
  log "LaunchAgent geschreven: ${AGENT}"
  HERLADEN=1
fi

# Bij de volgende login laadt macOS de agent vanzelf. Maar er zit nu iemand achter dit toestel,
# en die wil zijn schijf niet pas morgen. Root mag in de grafische sessie van de console-
# gebruiker laden, dus dat doen we er meteen bij.
CONSOLE_GEBRUIKER="$(/usr/bin/stat -f%Su /dev/console 2>/dev/null)"
if [ "$HERLADEN" -eq 1 ] && [ -n "$CONSOLE_GEBRUIKER" ] && [ "$CONSOLE_GEBRUIKER" != "root" ]; then
  CONSOLE_UID="$(/usr/bin/id -u "$CONSOLE_GEBRUIKER" 2>/dev/null)"
  if [ -n "$CONSOLE_UID" ]; then
    # bootout mag falen: de eerste keer draait er nog niets.
    /bin/launchctl bootout "gui/${CONSOLE_UID}/${LABEL}" 2>/dev/null
    if /bin/launchctl bootstrap "gui/${CONSOLE_UID}" "$AGENT" 2>>"$LOG"; then
      log "LaunchAgent geladen voor ${CONSOLE_GEBRUIKER} — de mount volgt binnen enkele seconden."
    else
      log "LaunchAgent laden voor ${CONSOLE_GEBRUIKER} mislukt; hij gaat vanzelf bij de volgende login."
    fi
  fi
elif [ "$HERLADEN" -eq 0 ]; then
  log "Helper en LaunchAgent stonden al goed."
fi

# Bewust altijd 0. Een Intune-shellscript dat niet-nul teruggeeft komt in de portal als "Failed"
# te staan. Of de mount lukt is hier niet te zien — dat gebeurt straks in de sessie van de
# gebruiker, en staat in diens eigen log. Wat dit script wél kon doen staat hierboven.
log "Klaar."
exit 0
