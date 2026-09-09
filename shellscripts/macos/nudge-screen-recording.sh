#!/bin/bash
#
# Vraagt de gebruiker om schermopname aan te zetten voor de apps waarmee wij op afstand
# meekijken, en opent daarbij meteen het juiste paneel. Stopt zodra het geregeld is.
#
# Waarom dit script bestaat:
#
#   Schermopname is de enige maatregel in deze baseline die een MDM niet kan afdwingen. Uit
#   Apple's eigen schema voor de PPPC-payload (apple/device-management,
#   com.apple.TCC.configuration-profile-policy.yaml), bij de key ScreenCapture:
#
#     "Access to the contents can't be given in a profile; it can only be denied."
#
#   Dezelfde categorie als Camera en Microphone. De waarde AllowStandardUserToSetSystemService
#   bestaat volgens datzelfde schema alléén voor ListenEvent en ScreenCapture — Apple heeft die
#   gemaakt omdát deze twee niet te verlenen zijn. Dat Intune in de settings catalog ook
#   `Allow` aanbiedt zegt niets: dat schema is generiek over alle TCC-diensten en macOS negeert
#   de waarde hier.
#
#   [Baseline] - MAC - D - Screen Recording zet daarom AllowStandardUserToSetSystemService.
#   Dat is het maximum: een gewone gebruiker mag de schakelaar zelf omzetten, zonder
#   beheerderswachtwoord. Zonder dat profiel kan een niet-admin het sinds Big Sur helemaal
#   niet. De klik blijft van de gebruiker; dit script zorgt dat hij hem ook doet.
#
# In Intune: Devices → macOS → Shell scripts. Vereiste instellingen:
#
#   Run script as signed-in user   Yes    het gaat om de rechten van déze gebruiker, en een
#                                         dialoog uit root ziet niemand
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# Toewijzen aan een gebruikersgroep. Geen apparaatgroep: op een gedeelde Mac heeft elke
# gebruiker zijn eigen TCC-database en dus zijn eigen klik.

set -u

# --- De apps waar het om gaat --------------------------------------------------------------
#
# Bundle-id's, in dezelfde volgorde als in het Screen Recording-profiel. Een app die niet
# geïnstalleerd is verschijnt niet in het paneel en telt hier dus ook niet mee — anders zou dit
# script blijven vragen om een vinkje dat nergens staat.

BUNDLES=(
  "com.ninjarmm.ncstreamer"
  "com.teamviewer.TeamViewer"
  "com.teamviewer.TeamViewerHost"
  "com.teamviewer.Desktop"
  "com.teamviewer.TeamViewerQS"
)

ORG_NAAM="ACI Europe"

# Na dit aantal pogingen houdt het script op met vragen. Bij een run per uur is dat vier
# dagen. Langer blijven vragen verandert een herinnering in een ergernis, en dan klikt iemand
# hem weg zonder te lezen. Wat er dan nog ontbreekt staat in de log en hoort in een gesprek,
# niet in een dialoog.
MAX_POGINGEN=96

# --- Vanaf hier niets meer aanpassen -------------------------------------------------------

STATE_DIR="$HOME/Library/Application Support/Baseline"
LOG_DIR="$HOME/Library/Logs/Baseline"
LOG="$LOG_DIR/screen-recording.log"
MARKER="$STATE_DIR/screen-recording-ok"
POGINGEN="$STATE_DIR/screen-recording-pogingen"
TCC_DB="$HOME/Library/Application Support/com.apple.TCC/TCC.db"
PANEEL="x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"

mkdir -p "$STATE_DIR" "$LOG_DIR"

log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

log "Gestart als $(id -un), macOS $(/usr/bin/sw_vers -productVersion)."

if [ -f "$MARKER" ]; then
  log "Al geregeld op $(cat "$MARKER") — niets te doen."
  exit 0
fi

# --- Welke apps staan er eigenlijk op dit toestel? -----------------------------------------

geinstalleerd() {
  /usr/bin/mdfind "kMDItemCFBundleIdentifier == '$1'" 2>/dev/null | /usr/bin/grep -q . ||
    /usr/bin/osascript -e "id of application id \"$1\"" >/dev/null 2>&1
}

AANWEZIG=()
for b in "${BUNDLES[@]}"; do
  if geinstalleerd "$b"; then AANWEZIG+=("$b"); fi
done

if [ "${#AANWEZIG[@]}" -eq 0 ]; then
  log "Geen van de apps is geïnstalleerd — nog niets te vragen."
  exit 0
fi

# --- Staat het al aan? ---------------------------------------------------------------------
#
# De TCC-database van de gebruiker is het enige eerlijke antwoord, maar hij is beschermd: een
# proces zonder Volledige Schijftoegang mag hem niet lezen. Lukt het, dan weten we het zeker en
# vraagt dit script niets. Lukt het niet, dan is dat geen fout — dan vragen we het gewoon aan
# de gebruiker. Beter één keer te veel vragen dan een rechtenstatus verzinnen.
#
# De kolom heet `auth_value` sinds Big Sur (2 = toegestaan) en `allowed` daarvoor. Beide
# proberen; welke van de twee er is, verschilt per macOS-versie.

tcc_zegt_aan() {
  local bundle="$1" uit
  [ -r "$TCC_DB" ] || return 2
  uit=$(/usr/bin/sqlite3 "$TCC_DB" \
    "select auth_value from access where service='kTCCServiceScreenCapture' and client='$bundle';" 2>/dev/null) ||
    uit=$(/usr/bin/sqlite3 "$TCC_DB" \
      "select allowed from access where service='kTCCServiceScreenCapture' and client='$bundle';" 2>/dev/null) ||
    return 2
  case "$uit" in
    2 | 1) return 0 ;;
    "") return 2 ;;
    *) return 1 ;;
  esac
}

ONTBREEKT=()
ZEKER=1
for b in "${AANWEZIG[@]}"; do
  tcc_zegt_aan "$b"
  case $? in
    0) ;;
    1) ONTBREEKT+=("$b") ;;
    2)
      ZEKER=0
      ONTBREEKT+=("$b")
      ;;
  esac
done

if [ "$ZEKER" -eq 1 ] && [ "${#ONTBREEKT[@]}" -eq 0 ]; then
  date '+%Y-%m-%d %H:%M:%S' >"$MARKER"
  log "Schermopname staat aan voor: ${AANWEZIG[*]} — klaar."
  exit 0
fi

if [ "$ZEKER" -eq 0 ]; then
  log "TCC-database niet leesbaar (geen Volledige Schijftoegang) — de gebruiker wordt het gevraagd."
fi

# --- Vragen --------------------------------------------------------------------------------

POGING=$(cat "$POGINGEN" 2>/dev/null || echo 0)
POGING=$((POGING + 1))
echo "$POGING" >"$POGINGEN"

if [ "$POGING" -gt "$MAX_POGINGEN" ]; then
  log "Poging $POGING — na $MAX_POGINGEN keer wordt er niet meer gevraagd. Ontbreekt nog: ${ONTBREEKT[*]}"
  exit 0
fi

TEKST="Om op afstand te kunnen meekijken bij een storing heeft de helpdesk toestemming voor schermopname nodig.

Zet in het venster dat nu opent de schakelaar aan bij:
$(printf '   • %s\n' "${ONTBREEKT[@]}")
Je hebt hier geen beheerderswachtwoord voor nodig. Dit is de enige stap die $ORG_NAAM niet voor je kan doen — Apple staat niet toe dat toestemming voor schermopname op afstand wordt gegeven."

ANTWOORD=$(/usr/bin/osascript <<OSA 2>>"$LOG"
display dialog "$TEKST" ¬
  with title "Schermopname voor de helpdesk" ¬
  buttons {"Later", "Staat al aan", "Open instellingen"} ¬
  default button "Open instellingen" ¬
  with icon caution ¬
  giving up after 300
OSA
)

case "$ANTWOORD" in
*"Open instellingen"*)
  /usr/bin/open "$PANEEL"
  log "Poging $POGING — paneel geopend voor: ${ONTBREEKT[*]}"
  ;;
*"Staat al aan"*)
  # Op zijn woord. Is de TCC-database leesbaar, dan had dit script het zelf al gezien en was
  # het hier niet gekomen; is hij dat niet, dan is de gebruiker de enige die het kan zien.
  date '+%Y-%m-%d %H:%M:%S' >"$MARKER"
  log "Poging $POGING — gebruiker bevestigt dat het aanstaat. Niet meer vragen."
  ;;
*)
  log "Poging $POGING — uitgesteld door de gebruiker."
  ;;
esac

exit 0
