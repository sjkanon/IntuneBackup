#!/bin/bash
#
# Zet op een Mac een LaunchAgent klaar die een of meer Azure Files-shares mount — het
# macOS-equivalent van drive mappings. Dit script mount zélf niets.
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
# Waarom één bestand voor alle sets:
#
#   Krijgen groepen verschillende shares, dan rol je dit bestand meerdere keren uit met een
#   andere SET_NAAM — niet met een tweede kopie van de code. Eén plek waar een fix landt. Twee
#   losse kopieën lopen gegarandeerd uit de pas zodra er iets aan verandert, en dat merk je pas
#   als het misgaat.
#
# Waarom de helper wordt geschreven en niet gekopieerd:
#
#   Dat was eerst een cp van $0 naar de helper. Bij de Intune-agent wijst $0 niet naar de
#   scripttekst, dus belandde er iets anders in /Library/Scripts — een binair bestand, en de
#   LaunchAgent stierf met exit 126, "cannot execute binary file". Nu genereert dit script de
#   helper: de instellingen hieronder worden erin geschreven en de rest komt uit een letterlijk
#   heredoc. Geen enkele aanname meer over hoe dit bestand wordt aangeroepen.
#
# In Intune: Devices → macOS → Shell scripts. Vereiste instellingen:
#
#   Run script as signed-in user   No     dit script schrijft naar /Library en dat mag alleen
#                                         root; mounten doet de LaunchAgent
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# Toewijzen: aan de groep die deze shares hoort te krijgen. Gaat het om iedereen, neem dan een
# apparaatgroep — de LaunchAgent werkt dan voor elke gebruiker van dat toestel. Krijgt maar een
# deel van de mensen deze set, dan een gebruikersgroep; het script draait nog steeds als root,
# maar landt alleen op toestellen van die mensen.
#
# LET OP bij de sleutel-terugval: die kent geen identiteit per gebruiker. De toewijzing bepaalt
# dan wie de share gemount kríjgt, niet wie erbij kán — met de sleutel op het toestel is elke
# share in dat storage account te benaderen. Echte scheiding per groep krijg je pas met Kerberos
# en share-level permissions.

set -u

# --- Welke set is dit ------------------------------------------------------------------------
#
# Krijgen verschillende groepen verschillende shares, dan rol je dit bestand meerdere keren uit
# met een andere SET_NAAM en een andere SHARES-lijst, en wijs je elke uitrol aan zijn eigen
# groep toe.
#
# SET_NAAM maakt de helper, het LaunchAgent-label en de log uniek. Zonder dat zouden twee
# uitrollen elkaars helper overschrijven en om hetzelfde label vechten — de laatste die draait
# wint, en de andere groep raakt zijn schijf kwijt zonder dat iemand ziet waarom.
#
# Alleen letters, cijfers en koppeltekens.

SET_NAAM="public"

# --- De shares -----------------------------------------------------------------------------
#
# Eén regel per share, en meerdere mag: alles in deze lijst hoort bij dezelfde groep.
#
# Een kale sharenaam is het beste — die wordt de naam van het volume en dus de naam in de
# Finder-zijbalk. Een submap mag ook ("data/Public"), maar dan kan Finder de mount niet aan een
# share koppelen en toont hij de servernaam in plaats van de mapnaam.
#
# Elke share landt in /Volumes/<naam>.

STORAGE_ACCOUNT="acisafiles"

SHARES=(
  "data/Public"
)

# --- Terugval op de storage account key ----------------------------------------------------
#
# Leeg laten = alleen Kerberos. Staat er een sleutel, dan probeert de helper eerst een ticket en
# valt daarna terug op deze sleutel.
#
# LET OP, en dit is geen formaliteit:
#
#   * Deze sleutel geeft toegang tot het HÉLE storage account, niet tot één share. Bij
#     acisafiles is dat hetzelfde account waar de AVD-omgeving op draait.
#   * Er is geen identiteit per gebruiker. Iedereen die mount is dezelfde "gebruiker", dus
#     rechten per persoon en herleidbaarheid in de logs bestaan niet, en de share-level
#     permissions in Azure doen niets.
#   * Iedereen die de helper kan lezen heeft de sleutel — in Intune, en op het toestel.
#
# VUL HEM HIER NOOIT IN IN DE REPO; die staat publiek op GitHub. Deze waarde blijft in git op de
# lege placeholder staan. De kopie in local/ draagt de echte sleutel en gaat niet mee in git.
#
# Plak de sleutel zoals Azure hem geeft, zonder iets te vervangen.

STORAGE_KEY=""

# --- Vanaf hier niets meer aanpassen -------------------------------------------------------

BASIS="mount-azure-files-${SET_NAAM}"
LABEL="com.aci-europe.baseline.${BASIS}"
HELPER="/Library/Scripts/Baseline/${BASIS}.sh"
AGENT="/Library/LaunchAgents/$LABEL.plist"

# Spatievrij, zodat Intune deze log met "Collect logs" kan ophalen. "Application Support" heeft
# een spatie in de naam en is daarmee niet op te halen — precies op het moment dat je hem nodig
# hebt. De helper logt in de thuismap van de gebruiker, want die draait per persoon.
LOG_DIR="/Library/Logs/Baseline"
LOG="$LOG_DIR/${BASIS}-install.log"

mkdir -p "$LOG_DIR"

# Naar het logbestand én naar stdout: Intune bewaart de uitvoer en toont die in de portal bij
# het apparaat. Zonder dat tweede spoor staat er alleen "Failed" of "Success".
log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

log "Gestart als $(id -un) (uid $(id -u)), macOS $(/usr/bin/sw_vers -productVersion)."

case "$SET_NAAM" in
  "" | *[!a-zA-Z0-9-]*)
    log "SET_NAAM mag alleen letters, cijfers en koppeltekens bevatten en niet leeg zijn."
    exit 1
    ;;
esac

if [ "$STORAGE_ACCOUNT" = "STORAGE-ACCOUNT-INVULLEN" ]; then
  log "Storage account staat nog op de placeholder — niets gedaan."
  exit 1
fi

if [ "${#SHARES[@]}" -eq 0 ]; then
  log "Geen shares opgegeven — niets te doen."
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  log "Dit script hoort als root te draaien: zet in Intune 'Run script as signed-in user' op No."
  exit 1
fi

# --- De helper schrijven -------------------------------------------------------------------
#
# Eerst de instellingen, met %q zodat elk vreemd teken in de sleutel of een sharenaam veilig
# wordt geciteerd. Daarna de logica uit een letterlijk heredoc: daarin wordt niets geëxpandeerd,
# dus die tekst komt er precies zo uit als hij hier staat.

NIEUW="$(mktemp)"
{
  printf '#!/bin/bash\n'
  printf '#\n'
  printf '# GEGENEREERD door mount-azure-files.sh via Intune. Niet met de hand bijwerken:\n'
  printf '# de eerstvolgende run overschrijft dit bestand.\n'
  printf '#\n'
  printf 'set -u\n'
  printf 'BASIS=%q\n' "$BASIS"
  printf 'STORAGE_ACCOUNT=%q\n' "$STORAGE_ACCOUNT"
  printf 'STORAGE_KEY=%q\n' "$STORAGE_KEY"
  printf 'SHARES=('
  printf '%q ' "${SHARES[@]}"
  printf ')\n'
  cat <<'HELPER_EINDE'

STATE_DIR="$HOME/Library/Application Support/Baseline"
LOG_DIR="$HOME/Library/Logs/Baseline"
LOG="$LOG_DIR/${BASIS}.log"

SERVER="$STORAGE_ACCOUNT.file.core.windows.net"

mkdir -p "$STATE_DIR" "$LOG_DIR"

log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

# macOS heeft geen timeout-commando; dat zit in coreutils en staat er niet standaard op. Nodig
# omdat een mount lang kan blijven wachten op een server die niet antwoordt, en omdat NetFS bij
# een afgewezen aanmelding een dialoog opzet waar uit een achtergrondagent niemand op reageert.
#
# LET OP bij gebruik: wat hier draait komt op de achtergrond, en een achtergrondproces krijgt in
# een niet-interactieve shell zijn stdin van /dev/null. Geef een commando dus nooit invoer via
# een pipe of heredoc mee — dat komt niet aan, en het commando lijkt dan geslaagd terwijl het
# niets heeft gedaan. Dat kostte hier een dag zoeken.
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

# Waar staat deze share gemount? NetFS kiest de naam in /Volumes zelf, dus opzoeken in plaats van
# aannemen. Met sed en niet met awk, want een mountpad kan spaties bevatten. Met grep -F, want de
# punten in een servernaam zijn anders jokertekens.
huidig_mountpunt() {
  /sbin/mount 2>/dev/null |
    /usr/bin/grep -iF "${SERVER}/$1" |
    /usr/bin/sed -n 's/.* on \(.*\) (.*/\1/p' |
    /usr/bin/head -1
}

# Na een geslaagde mount staat hij niet meteen in `mount`. Zonder even wachten meldt het script
# "onbekend pad", en denkt het bij de volgende ronde dat er niets gemount is — waarna macOS er
# een tweede naast hangt als /Volumes/<naam>-1.
wacht_op_mountpunt() {
  local poging mp
  for poging in 1 2 3 4 5; do
    mp="$(huidig_mountpunt "$1")"
    if [ -n "$mp" ]; then
      printf '%s' "$mp"
      return 0
    fi
    sleep 1
  done
  return 1
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
# Het bewijs geldt voor de hele server, dus dit hoeft maar één keer per ronde.
has_service_ticket() {
  [ -x /usr/bin/kgetcred ] || return 1
  with_timeout 20 /usr/bin/kgetcred \
    "cifs/${SERVER}@KERBEROS.MICROSOFTONLINE.COM" >/dev/null 2>&1
}

# Mounten via NetFS. Dit is de weg die /Volumes openkrijgt voor een gewone gebruiker —
# mount_smbfs moet zijn mountpunt zelf aanmaken en mag dat daar niet, wat "Operation not
# permitted" oplevert. NetFS draait met de rechten die het wel mogen, net als Finder → Verbind
# met server. En alleen wat in /Volumes staat, zet Finder in de zijbalk onder Locaties.
mount_via_netfs() {
  local share="$1" methode="$2"
  local doel="smb://${SERVER}/${share}"

  if [ "$methode" != "sleutel" ]; then
    with_timeout 60 /usr/bin/osascript -e "mount volume \"${doel}\"" >/dev/null 2>>"$LOG"
    return $?
  fi

  # Het script gaat via een tijdelijk bestand en niet via stdin: with_timeout draait alles op de
  # achtergrond en daar valt stdin weg. Ook niet via -e, want dan staat de sleutel in de
  # procestabel. Het bestand is 600 en meteen weer weg; de helper draagt die sleutel toch al.
  local scpt rc
  scpt="$(mktemp)" || return 1
  chmod 600 "$scpt"
  printf 'mount volume "%s" as user name "%s" with password "%s"\n' \
    "$doel" "$STORAGE_ACCOUNT" "$STORAGE_KEY" >"$scpt"
  with_timeout 60 /usr/bin/osascript "$scpt" >/dev/null 2>>"$LOG"
  rc=$?
  rm -f "$scpt"
  return $rc
}

# Eén share mounten. $1 is de share, $2 de lijst methoden die deze ronde mogen.
mount_een() {
  local share="$1"
  shift
  local methode mp

  if [ -n "$(huidig_mountpunt "$share")" ]; then
    return 0
  fi

  for methode in "$@"; do
    mount_via_netfs "$share" "$methode"
    case $? in
      0) ;;
      124)
        log "${share}: mount (${methode}) liep vast en is na 60s afgebroken — server onbereikbaar, of er wacht een aanmeldvenster."
        return 1
        ;;
      *)
        log "${share}: mount met ${methode} mislukt."
        continue
        ;;
    esac

    mp="$(wacht_op_mountpunt "$share")"
    if [ -z "$mp" ]; then
      log "${share}: mount met ${methode} meldde geen fout, maar de share staat nergens gemount."
      return 1
    fi
    if [ "$methode" = "sleutel" ]; then
      log "${share}: gemount met de storage account key op ${mp} — toegang zonder identiteit per gebruiker."
    else
      log "${share}: gemount met Kerberos op ${mp}."
    fi
    return 0
  done

  return 1
}

# Welke methoden mogen we deze ronde proberen? Dat hangt aan de server en niet aan de share, dus
# één keer bepalen en daarna voor elke share hergebruiken. Kerberos eerst: dat is de vorm mét
# identiteit per gebruiker, de sleutel is de terugval. Zodra Entra Kerberos ergens wél aanstaat,
# neemt Kerberos vanzelf over.
bepaal_methoden() {
  METHODEN=()
  if has_ticket; then
    if has_service_ticket; then
      METHODEN+=("kerberos")
    elif [ "${QUIET:-0}" -ne 1 ]; then
      log "Wel een TGT, maar geen servicebewijs voor cifs/${SERVER} — Entra Kerberos staat niet aan op dit storage account (AADSTS700016)."
    fi
  elif [ "${QUIET:-0}" -ne 1 ]; then
    log "Geen ticket voor KERBEROS.MICROSOFTONLINE.COM. Controleer met: app-sso platform -s"
  fi
  [ -n "$STORAGE_KEY" ] && METHODEN+=("sleutel")
}

mount_alles() {
  local share fout=0 tedoen=0

  # Staat alles er al? Dan niets doen en niets loggen. De agent vuurt bij elke netwerkwijziging
  # en elke vijf minuten; zonder deze afslag zou de log volstromen.
  for share in "${SHARES[@]}"; do
    [ -n "$(huidig_mountpunt "$share")" ] || tedoen=1
  done
  [ "$tedoen" -eq 0 ] && return 0

  bepaal_methoden
  if [ "${#METHODEN[@]}" -eq 0 ]; then
    return 1
  fi

  for share in "${SHARES[@]}"; do
    mount_een "$share" "${METHODEN[@]}" || fout=1
  done
  return $fout
}

# QUIET onderdrukt de regels over een ontbrekend ticket. De agent vuurt vaak, en zonder dit zou
# de log volstromen met dezelfde melding.
if [ "${1:-}" = "--stil" ]; then
  QUIET=1 mount_alles
else
  log "Handmatig gestart voor: ${SHARES[*]}"
  mount_alles
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
  log "Helper geschreven voor ${#SHARES[@]} share(s): ${SHARES[*]}"
  HERLADEN=1
else
  rm -f "$NIEUW"
fi

# --- De LaunchAgent --------------------------------------------------------------------------
#
# Drie aanleidingen, en alle drie zijn nodig:
#
#   RunAtLoad       bij het inloggen, en bij het laden vanuit het installatiescript
#   WatchPaths      zodra het netwerk wijzigt — wifi-wissel, VPN erbij, uit de slaap komen
#   StartInterval   elke vijf minuten als vangnet
#
# Dat laatste had ik eerst weggelaten omdat pollen lelijk is naast WatchPaths. Dat was fout: een
# SMB-mount raakt ook los zonder dat er iets aan het netwerk verandert — na slaapstand, of als de
# server de verbinding laat vallen. Dan vuurt WatchPaths niet en blijft de share weg tot de
# volgende login. Vijf minuten kost niets: staat alles er nog, dan stopt de helper meteen.

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
    <key>StartInterval</key>
    <integer>300</integer>
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
# en die wil zijn schijven niet pas morgen. Root mag laden in de grafische sessie van de
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
      log "LaunchAgent geladen voor ${CONSOLE_GEBRUIKER}. Het resultaat staat in ~/Library/Logs/Baseline/mount-azure-files.log van die gebruiker."
    else
      log "LaunchAgent laden voor ${CONSOLE_GEBRUIKER} mislukt; hij gaat vanzelf bij de volgende login."
    fi
  fi
fi

# Bewust altijd 0. Of de mounts lukken is hier niet te zien — dat gebeurt in de sessie van de
# gebruiker. Wat dit script kon doen staat hierboven.
log "Klaar."
exit 0
