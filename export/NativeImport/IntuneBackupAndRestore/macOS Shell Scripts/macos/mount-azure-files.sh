#!/bin/bash
#
# Sets up a LaunchAgent on a Mac that mounts one or more Azure Files shares — the macOS
# equivalent of drive mappings. This script does not mount anything itself.
#
# Why this division of work:
#
#   A mount belongs in the user's graphical session, and the process the Intune agent starts is
#   not in it. That is why mounting by hand works and mounting from Intune does not, however
#   good the mount logic is. So:
#
#     this script, as root   writes the helper and the LaunchAgent to /Library
#     the LaunchAgent        mounts, in the user's session, at login and on network changes
#
#   macOS automatically loads a LaunchAgent in /Library/LaunchAgents for every user at every
#   login. No launchctl bootstrap from a domain we are not in, and right away good for the next
#   person on that device.
#
# Why one file for all sets:
#
#   If groups get different shares, you deploy this file several times with a different
#   SET_NAAM — not with a second copy of the code. One place where a fix lands. Two separate
#   copies are guaranteed to drift apart as soon as something changes, and you only notice when
#   it goes wrong.
#
# Why the helper is written and not copied:
#
#   That used to be a cp of $0 to the helper. With the Intune agent $0 does not point to the
#   script text, so something else ended up in /Library/Scripts — a binary file, and the
#   LaunchAgent died with exit 126, "cannot execute binary file". Now this script generates the
#   helper: the settings below are written into it and the rest comes from a literal heredoc.
#   No assumption at all any more about how this file is invoked.
#
# In Intune: Devices → macOS → Shell scripts. Required settings:
#
#   Run script as signed-in user   No     this script writes to /Library and only root may do
#                                         that; the LaunchAgent does the mounting
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# Assign: to the group that should get these shares. If it is everyone, use a device group —
# the LaunchAgent then works for every user of that device. If only part of the people get this
# set, use a user group; the script still runs as root, but only lands on those people's
# devices.
#
# NOTE with the key fallback: it has no per-user identity. The assignment then determines who
# gets the share mounted, not who can reach it — with the key on the device every share in that
# storage account is accessible. Real separation per group only comes with Kerberos and
# share-level permissions.

set -u

# --- Which set is this -----------------------------------------------------------------------
#
# If different groups get different shares, you deploy this file several times with a different
# SET_NAAM and a different SHARES list, and assign each deployment to its own group.
#
# SET_NAAM makes the helper, the LaunchAgent label and the log unique. Without it two
# deployments would overwrite each other's helper and fight over the same label — the last one
# to run wins, and the other group loses its drive without anyone seeing why.
#
# Only letters, digits and hyphens.

SET_NAAM="SET-NAAM-INVULLEN"

# --- The shares ----------------------------------------------------------------------------
#
# One line per share, and several are allowed: everything in this list belongs to the same group.
#
# A bare share name is best — it becomes the name of the volume and so the name in the Finder
# sidebar. A subfolder is allowed too ("<share>/<folder>"), but then Finder cannot link the mount to
# a share and shows the server name instead of the folder name.
#
# Each share lands in /Volumes/<name>.

STORAGE_ACCOUNT="STORAGE-ACCOUNT-INVULLEN"

SHARES=(
  "SHARE-NAAM-INVULLEN"
)

# --- Fallback to the storage account key ---------------------------------------------------
#
# Leave empty = Kerberos only. If a key is set, the helper first tries a ticket and then falls
# back to this key.
#
# NOTE, and this is not a formality:
#
#   * This key gives access to the WHOLE storage account, not to one share. If something else
#     runs on the same account, such as an AVD environment, that data falls under it too.
#   * There is no per-user identity. Everyone who mounts is the same "user", so per-person
#     permissions and traceability in the logs do not exist, and the share-level permissions
#     in Azure do nothing.
#   * Anyone who can read the helper has the key — in Intune, and on the device.
#
# NEVER FILL IT IN HERE IN THE REPO; that is public on GitHub. In git this value stays on the
# empty placeholder. The copy in local/ carries the real key and is not tracked in git.
#
# Paste the key as Azure gives it, without replacing anything.

STORAGE_KEY=""

# --- Do not change anything below this line ------------------------------------------------

BASIS="mount-azure-files-${SET_NAAM}"
LABEL="com.baseline.${BASIS}"
HELPER="/Library/Scripts/Baseline/${BASIS}.sh"
AGENT="/Library/LaunchAgents/$LABEL.plist"

# Without spaces, so that Intune can retrieve this log with "Collect logs". "Application
# Support" has a space in its name and therefore cannot be retrieved — exactly when you need it.
# The helper logs in the user's home folder, because it runs per person.
LOG_DIR="/Library/Logs/Baseline"
LOG="$LOG_DIR/${BASIS}-install.log"

mkdir -p "$LOG_DIR"

# To the log file and to stdout: Intune keeps the output and shows it in the portal with the
# device. Without that second trail all you see is "Failed" or "Success".
log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

log "Started as $(id -un) (uid $(id -u)), macOS $(/usr/bin/sw_vers -productVersion)."

case "$SET_NAAM" in
  "" | *[!a-zA-Z0-9-]*)
    log "SET_NAAM may only contain letters, digits and hyphens and must not be empty."
    exit 1
    ;;
esac

if [ "$SET_NAAM" = "SET-NAAM-INVULLEN" ]; then
  log "SET_NAAM is still set to the placeholder — nothing done."
  exit 1
fi

if [ "$STORAGE_ACCOUNT" = "STORAGE-ACCOUNT-INVULLEN" ]; then
  log "Storage account is still set to the placeholder — nothing done."
  exit 1
fi

if [ "${#SHARES[@]}" -eq 0 ]; then
  log "No shares specified — nothing to do."
  exit 1
fi

for share in "${SHARES[@]}"; do
  if [ "$share" = "SHARE-NAAM-INVULLEN" ]; then
    log "Share is still set to the placeholder — nothing done."
    exit 1
  fi
done

if [ "$(id -u)" -ne 0 ]; then
  log "This script must run as root: set 'Run script as signed-in user' to No in Intune."
  exit 1
fi

# --- Writing the helper --------------------------------------------------------------------
#
# First the settings, with %q so that any odd character in the key or a share name is quoted
# safely. Then the logic from a literal heredoc: nothing is expanded in it, so that text comes
# out exactly as it is written here.

NIEUW="$(mktemp)"
{
  printf '#!/bin/bash\n'
  printf '#\n'
  printf '# GENERATED by mount-azure-files.sh via Intune. Do not edit by hand:\n'
  printf '# the next run overwrites this file.\n'
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

# macOS has no timeout command; that is part of coreutils and not installed by default. Needed
# because a mount can keep waiting for a server that does not answer, and because NetFS, on a
# rejected sign-in, puts up a dialog that nobody responds to from a background agent.
#
# NOTE when using it: what runs here goes to the background, and in a non-interactive shell a
# background process gets its stdin from /dev/null. So never give a command input through a
# pipe or heredoc — it does not arrive, and the command then seems to have succeeded while it
# did nothing. That cost a day of searching here.
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

# Where is this share mounted? NetFS picks the name in /Volumes itself, so look it up instead
# of assuming. With sed and not with awk, because a mount path can contain spaces. With grep -F,
# because otherwise the dots in a server name are wildcards.
huidig_mountpunt() {
  /sbin/mount 2>/dev/null |
    /usr/bin/grep -iF "${SERVER}/$1" |
    /usr/bin/sed -n 's/.* on \(.*\) (.*/\1/p' |
    /usr/bin/head -1
}

# After a successful mount it does not show up in `mount` right away. Without waiting a moment
# the script reports "unknown path", and on the next round it thinks nothing is mounted — after
# which macOS hangs a second one next to it as /Volumes/<name>-1.
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

# Three ways, because none of the three look at the same thing. klist -s is the clean check
# but only applies to the default cache, and Platform SSO puts the cloud TGT in a cache with its
# own name. klist -l lists all caches. One of the three is enough.
has_ticket() {
  /usr/bin/klist -s 2>/dev/null && return 0
  { /usr/bin/klist -l 2>/dev/null; /usr/bin/klist 2>/dev/null; } |
    grep -q "KERBEROS.MICROSOFTONLINE.COM"
}

# A TGT is not access yet. Kerberos works in two steps: the TGT proves who you are, and then
# you ask for a ticket for one service — cifs/<server>. That second step can fail while the
# first is fine; on an account without Entra Kerberos it gives AADSTS700016, because the KDC
# then knows no application for that file service.
#
# Ask in advance rather than just trying: only if this succeeds do we know NetFS will not put
# up a sign-in window, and that is the condition for being allowed to mount Kerberos via NetFS.
# The ticket applies to the whole server, so this only needs to happen once per round.
has_service_ticket() {
  [ -x /usr/bin/kgetcred ] || return 1
  with_timeout 20 /usr/bin/kgetcred \
    "cifs/${SERVER}@KERBEROS.MICROSOFTONLINE.COM" >/dev/null 2>&1
}

# Mounting via NetFS. This is the route that opens /Volumes for a regular user — mount_smbfs
# has to create its mount point itself and is not allowed to there, which gives "Operation not
# permitted". NetFS runs with the privileges that are allowed to, just like Finder → Connect to
# Server. And only what is in /Volumes is put in the sidebar under Locations by Finder.
mount_via_netfs() {
  local share="$1" methode="$2"
  local doel="smb://${SERVER}/${share}"

  if [ "$methode" != "sleutel" ]; then
    with_timeout 60 /usr/bin/osascript -e "mount volume \"${doel}\"" >/dev/null 2>>"$LOG"
    return $?
  fi

  # The script goes through a temporary file and not through stdin: with_timeout runs
  # everything in the background and stdin is lost there. Not via -e either, because then the
  # key is in the process table. The file is 600 and gone again right away; the helper carries
  # that key anyway.
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

# Mount one share. $1 is the share, $2 the list of methods allowed this round.
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
        log "${share}: mount (${methode}) hung and was aborted after 60s — server unreachable, or a sign-in window is waiting."
        return 1
        ;;
      *)
        log "${share}: mount with ${methode} failed."
        continue
        ;;
    esac

    mp="$(wacht_op_mountpunt "$share")"
    if [ -z "$mp" ]; then
      log "${share}: mount with ${methode} reported no error, but the share is not mounted anywhere."
      return 1
    fi
    if [ "$methode" = "sleutel" ]; then
      log "${share}: mounted with the storage account key at ${mp} — access without per-user identity."
    else
      log "${share}: mounted with Kerberos at ${mp}."
    fi
    return 0
  done

  return 1
}

# Which methods may we try this round? That depends on the server and not on the share, so
# determine it once and then reuse it for every share. Kerberos first: that is the form with
# per-user identity, the key is the fallback. As soon as Entra Kerberos is enabled somewhere,
# Kerberos takes over by itself.
bepaal_methoden() {
  METHODEN=()
  if has_ticket; then
    if has_service_ticket; then
      METHODEN+=("kerberos")
    elif [ "${QUIET:-0}" -ne 1 ]; then
      log "A TGT, but no service ticket for cifs/${SERVER} — Entra Kerberos is not enabled on this storage account (AADSTS700016)."
    fi
  elif [ "${QUIET:-0}" -ne 1 ]; then
    log "No ticket for KERBEROS.MICROSOFTONLINE.COM. Check with: app-sso platform -s"
  fi
  [ -n "$STORAGE_KEY" ] && METHODEN+=("sleutel")
}

mount_alles() {
  local share fout=0 tedoen=0

  # Is everything already there? Then do nothing and log nothing. The agent fires on every
  # network change and every five minutes; without this shortcut the log would fill up.
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

# QUIET suppresses the lines about a missing ticket. The agent fires often, and without this
# the log would fill up with the same message.
if [ "${1:-}" = "--stil" ]; then
  QUIET=1 mount_alles
else
  log "Started manually for: ${SHARES[*]}"
  mount_alles
fi
exit $?
HELPER_EINDE
} >"$NIEUW"

# --- Checking what was written, before it goes into use ------------------------------------
#
# Exactly the mistake this script made before: a binary file ended up in /Library and the
# LaunchAgent died with exit 126. A syntax check costs nothing and catches that.
if ! /bin/bash -n "$NIEUW" 2>>"$LOG"; then
  log "The generated helper is not a valid script — nothing replaced."
  rm -f "$NIEUW"
  exit 1
fi

HERLADEN=0
mkdir -p "$(dirname "$HELPER")"
if ! cmp -s "$NIEUW" "$HELPER"; then
  mv "$NIEUW" "$HELPER"
  chown root:wheel "$HELPER"
  chmod 755 "$HELPER"
  log "Helper written for ${#SHARES[@]} share(s): ${SHARES[*]}"
  HERLADEN=1
else
  rm -f "$NIEUW"
fi

# --- The LaunchAgent -------------------------------------------------------------------------
#
# Three triggers, and all three are needed:
#
#   RunAtLoad       at login, and when loaded from the install script
#   WatchPaths      as soon as the network changes — Wi-Fi switch, VPN added, waking from sleep
#   StartInterval   every five minutes as a safety net
#
# I left that last one out at first because polling is ugly next to WatchPaths. That was wrong:
# an SMB mount also drops without anything changing on the network — after sleep, or when the
# server drops the connection. Then WatchPaths does not fire and the share stays gone until the
# next login. Five minutes costs nothing: if everything is still there, the helper stops at once.

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
  log "LaunchAgent written: ${AGENT}"
  HERLADEN=1
fi

# --- Load right away for whoever is using the device now -----------------------------------
#
# At the next login macOS loads the agent by itself. But someone is using this device right
# now, and they do not want their drives only tomorrow. Root may load into the graphical
# session of the console user.

if [ "$HERLADEN" -eq 0 ]; then
  log "Helper and LaunchAgent were already up to date."
  log "Done."
  exit 0
fi

CONSOLE_GEBRUIKER="$(/usr/bin/stat -f%Su /dev/console 2>/dev/null)"
if [ -n "$CONSOLE_GEBRUIKER" ] && [ "$CONSOLE_GEBRUIKER" != "root" ]; then
  CONSOLE_UID="$(/usr/bin/id -u "$CONSOLE_GEBRUIKER" 2>/dev/null)"
  if [ -n "$CONSOLE_UID" ]; then
    /bin/launchctl bootout "gui/${CONSOLE_UID}/${LABEL}" 2>/dev/null
    if /bin/launchctl bootstrap "gui/${CONSOLE_UID}" "$AGENT" 2>>"$LOG"; then
      log "LaunchAgent loaded for ${CONSOLE_GEBRUIKER}. The result is in that user's ~/Library/Logs/Baseline/mount-azure-files.log."
    else
      log "Loading the LaunchAgent for ${CONSOLE_GEBRUIKER} failed; it will load by itself at the next login."
    fi
  fi
fi

# Deliberately always 0. Whether the mounts succeed cannot be seen here — that happens in the
# user's session. What this script could do is logged above.
log "Done."
exit 0
