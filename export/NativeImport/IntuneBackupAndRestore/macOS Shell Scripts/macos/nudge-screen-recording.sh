#!/bin/bash
#
# Asks the user to turn on screen recording for the organisation's remote support tools, and
# opens the right panel straight away. Stops as soon as it is sorted.
#
# Why this script exists:
#
#   Screen recording is the only measure in this baseline that an MDM cannot enforce. From
#   Apple's own schema for the PPPC payload (apple/device-management,
#   com.apple.TCC.configuration-profile-policy.yaml), at the key ScreenCapture:
#
#     "Access to the contents can't be given in a profile; it can only be denied."
#
#   The same category as Camera and Microphone. According to that same schema the value
#   AllowStandardUserToSetSystemService exists only for ListenEvent and ScreenCapture — Apple
#   created it precisely because these two cannot be granted. That Intune also offers `Allow`
#   in the settings catalog means nothing: that schema is generic across all TCC services and
#   macOS ignores the value here.
#
#   [Baseline] - MAC - D - Screen Recording therefore sets AllowStandardUserToSetSystemService.
#   That is the maximum: a standard user may flip the switch themselves, without an
#   administrator password. Without that profile a non-admin cannot do it at all since Big Sur.
#   The click remains the user's; this script makes sure they actually do it.
#
# In Intune: Devices → macOS → Shell scripts. Required settings:
#
#   Run script as signed-in user   Yes    it is about this user's permissions, and nobody sees
#                                         a dialog from root
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# Assign to a user group. Not a device group: on a shared Mac each user has their own TCC
# database and therefore their own click.

set -u

# --- The apps this is about ----------------------------------------------------------------
#
# Bundle IDs, in the same order as in the Screen Recording profile. An app that is not
# installed does not appear in the panel and so does not count here either — otherwise this
# script would keep asking for a checkbox that is not there.

# By default NinjaOne and TeamViewer, matching [Baseline] - MAC - D - Screen Recording. If the
# organisation uses other tools, replace them here and in that profile.
BUNDLES=(
  "com.ninjarmm.ncstreamer"
  "com.teamviewer.TeamViewer"
  "com.teamviewer.TeamViewerHost"
  "com.teamviewer.Desktop"
  "com.teamviewer.TeamViewerQS"
)

# The name of the IT organisation as it appears in the dialog. Leave empty for a generic name in
# the user's language ("de IT-afdeling", "le service informatique", "the IT department"). A name
# filled in here is used as is in every language.
ORG_NAAM=""

# After this many attempts the script stops asking. With one run per hour that is four days.
# Asking for longer turns a reminder into an annoyance, and then someone clicks it away without
# reading. Whatever is still missing by then is in the log and belongs in a conversation, not in
# a dialog.
MAX_POGINGEN=96

# --- Do not change anything below this line ------------------------------------------------

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

log "Started as $(id -un), macOS $(/usr/bin/sw_vers -productVersion)."

if [ -f "$MARKER" ]; then
  log "Already sorted on $(cat "$MARKER") — nothing to do."
  exit 0
fi

# --- Which apps are actually on this device? -----------------------------------------------

geinstalleerd() {
  /usr/bin/mdfind "kMDItemCFBundleIdentifier == '$1'" 2>/dev/null | /usr/bin/grep -q . ||
    /usr/bin/osascript -e "id of application id \"$1\"" >/dev/null 2>&1
}

AANWEZIG=()
for b in "${BUNDLES[@]}"; do
  if geinstalleerd "$b"; then AANWEZIG+=("$b"); fi
done

if [ "${#AANWEZIG[@]}" -eq 0 ]; then
  log "None of the apps is installed — nothing to ask yet."
  exit 0
fi

# --- Is it already on? ---------------------------------------------------------------------
#
# The user's TCC database is the only honest answer, but it is protected: a process without
# Full Disk Access may not read it. If reading works, we know for sure and this script asks
# nothing. If it does not, that is not an error — then we simply ask the user. Better to ask
# once too often than to make up a permission state.
#
# The column is called `auth_value` since Big Sur (2 = allowed) and `allowed` before that. Try
# both; which of the two exists differs per macOS version.

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
  log "Screen recording is on for: ${AANWEZIG[*]} — done."
  exit 0
fi

if [ "$ZEKER" -eq 0 ]; then
  log "TCC database not readable (no Full Disk Access) — the user will be asked."
fi

# --- Asking -------------------------------------------------------------------------------

POGING=$(cat "$POGINGEN" 2>/dev/null || echo 0)
POGING=$((POGING + 1))
echo "$POGING" >"$POGINGEN"

if [ "$POGING" -gt "$MAX_POGINGEN" ]; then
  log "Attempt $POGING — no longer asking after $MAX_POGINGEN times. Still missing: ${ONTBREEKT[*]}"
  exit 0
fi

# The dialog is shown in the user's own language: Dutch, French, or otherwise English. This
# script runs as the signed-in user, so `defaults read -g` reads that user's preferences. The
# first entry of AppleLanguages is the preferred language ("nl-NL", "fr", "en-GB"); AppleLocale
# ("nl_NL") is the fallback if that list is missing.
TAAL=$(/usr/bin/defaults read -g AppleLanguages 2>/dev/null |
  /usr/bin/sed -n 's/^[[:space:]]*"\{0,1\}\([A-Za-z][A-Za-z]\).*/\1/p' | /usr/bin/head -1)
[ -n "$TAAL" ] || TAAL=$(/usr/bin/defaults read -g AppleLocale 2>/dev/null | /usr/bin/cut -c1-2)

LIJST=$(printf '   • %s\n' "${ONTBREEKT[@]}")

case "$TAAL" in
nl* | NL*)
  ORG="${ORG_NAAM:-de IT-afdeling}"
  TITEL="Schermopname voor de helpdesk"
  KNOP_LATER="Later"
  KNOP_AAN="Staat al aan"
  KNOP_OPEN="Open instellingen"
  TEKST="Om op afstand te kunnen meekijken bij een storing heeft de helpdesk toestemming voor schermopname nodig.

Zet in het venster dat nu opent de schakelaar aan bij:
$LIJST
Je hebt hier geen beheerderswachtwoord voor nodig. Dit is de enige stap die $ORG niet voor je kan doen — Apple staat niet toe dat toestemming voor schermopname op afstand wordt gegeven."
  ;;
fr* | FR*)
  ORG="${ORG_NAAM:-le service informatique}"
  TITEL="Enregistrement de l’écran pour le support"
  KNOP_LATER="Plus tard"
  KNOP_AAN="Déjà activé"
  KNOP_OPEN="Ouvrir les réglages"
  TEKST="Pour pouvoir voir votre écran à distance en cas de problème, le support a besoin de l’autorisation d’enregistrement de l’écran.

Dans la fenêtre qui s’ouvre maintenant, activez l’interrupteur pour :
$LIJST
Aucun mot de passe administrateur n’est nécessaire. C’est la seule étape que $ORG ne peut pas faire à votre place — Apple ne permet pas d’accorder à distance l’autorisation d’enregistrement de l’écran."
  ;;
*)
  ORG="${ORG_NAAM:-the IT department}"
  TITEL="Screen recording for the helpdesk"
  KNOP_LATER="Later"
  KNOP_AAN="Already on"
  KNOP_OPEN="Open Settings"
  TEKST="So that the helpdesk can view your screen remotely when something goes wrong, it needs permission for screen recording.

In the window that opens now, turn on the switch for:
$LIJST
You do not need an administrator password for this. This is the only step $ORG cannot do for you — Apple does not allow screen recording permission to be granted remotely."
  ;;
esac

ANTWOORD=$(/usr/bin/osascript <<OSA 2>>"$LOG"
display dialog "$TEKST" ¬
  with title "$TITEL" ¬
  buttons {"$KNOP_LATER", "$KNOP_AAN", "$KNOP_OPEN"} ¬
  default button "$KNOP_OPEN" ¬
  with icon caution ¬
  giving up after 300
OSA
)

case "$ANTWOORD" in
*"$KNOP_OPEN"*)
  /usr/bin/open "$PANEEL"
  log "Attempt $POGING — panel opened for: ${ONTBREEKT[*]}"
  ;;
*"$KNOP_AAN"*)
  # Taken at their word. If the TCC database is readable, this script would have seen it
  # itself and would not have got here; if it is not, the user is the only one who can see it.
  date '+%Y-%m-%d %H:%M:%S' >"$MARKER"
  log "Attempt $POGING — user confirms it is on. Not asking again."
  ;;
*)
  log "Attempt $POGING — postponed by the user."
  ;;
esac

exit 0
