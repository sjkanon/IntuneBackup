#!/bin/bash
#
# Sets up the Dock once per user: the company apps in, Safari, Mail, Calendar and the rest of
# Apple's default set out. After that the Dock belongs to the user — anyone who wants to add
# or remove something may do so, and this script no longer touches it.
#
# Why a script and not a configuration profile:
#
#   The Settings Catalog has Dock settings, but they break with more than one app: Intune
#   formats the list incorrectly and the payload never reaches the device.
#   See https://learn.microsoft.com/en-us/answers/questions/1164432/ (still open).
#
#   A custom .mobileconfig with `static-only` does work, but it also locks the Dock: the user
#   can no longer change anything. That is a heavier tool than what is asked for here — the
#   agreement is a one-time setup, not locking it down.
#
# In Intune: Devices → macOS → Shell scripts. Required settings:
#
#   Run script as signed-in user   Yes    without this `defaults` writes to root's Dock
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# "Every 1 hour" seems to contradict "one-time", but it does not: as soon as the Dock is set up
# this script writes a marker and every following run stops immediately. The repetition is only
# there in case the apps were not yet installed at the first run — on a new Mac this script
# almost always runs before Intune has deployed the M365 apps. With "Not configured" (one run,
# never again) such a device would keep a half-empty Dock forever.

set -u

STATE_DIR="$HOME/Library/Application Support/Baseline"
MARKER="$STATE_DIR/dock-configured"
ATTEMPTS="$STATE_DIR/dock-attempts"
LOG="$STATE_DIR/dock.log"

# After this many unsuccessful attempts we set up the Dock with whatever is there. With one run
# per hour that is just over a day: waiting longer for an app that is not coming (not assigned,
# installation failed) only results in a Dock that never ends up right.
MAX_ATTEMPTS=30

# The order is the order in the Dock, from left to right. Finder is always on the left and the
# Trash always on the right; those two do not belong in this list — macOS manages them itself.
APPS=(
  "/Applications/Microsoft Outlook.app"
  "/Applications/Microsoft Teams.app"
  "/Applications/Microsoft Edge.app"
  "/Applications/Microsoft Word.app"
  "/Applications/Microsoft Excel.app"
  "/Applications/Microsoft PowerPoint.app"
  "/Applications/Windows App.app"
  "/Applications/OneDrive.app"
  "/Applications/Company Portal.app"
)

log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

mkdir -p "$STATE_DIR"

if [ -f "$MARKER" ]; then
  # No log line: this is the normal case on every run after the first, and a log file that
  # gains a line every hour becomes unreadable exactly when you need it.
  exit 0
fi

# System Settings has a different name from macOS 13 on and lives at a different path than
# before. Check both instead of reading the macOS version: the path is what matters.
for settings_app in "/System/Applications/System Settings.app" "/System/Applications/System Preferences.app"; do
  if [ -d "$settings_app" ]; then
    APPS+=("$settings_app")
    break
  fi
done

present=()
missing=()
for app in "${APPS[@]}"; do
  if [ -d "$app" ]; then
    present+=("$app")
  else
    missing+=("$(basename "$app" .app)")
  fi
done

attempt=1
[ -f "$ATTEMPTS" ] && attempt=$(( $(cat "$ATTEMPTS") + 1 ))
printf '%s' "$attempt" > "$ATTEMPTS"

if [ ${#missing[@]} -gt 0 ] && [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
  log "attempt $attempt/$MAX_ATTEMPTS — not installed yet: ${missing[*]}. Dock not touched yet."
  exit 0
fi

if [ ${#present[@]} -eq 0 ]; then
  log "none of the apps in the list found after $attempt attempts — Dock left alone."
  exit 0
fi

if [ ${#missing[@]} -gt 0 ]; then
  log "still missing after $attempt attempts: ${missing[*]}. Setting up the Dock without those apps."
fi

# Replace the whole list instead of adding or removing items. That removes Safari, Mail,
# Calendar, Contacts, Notes, Reminders, Messages, FaceTime, Photos, Music, TV, Podcasts, Maps,
# News, App Store and Freeform in one go — without having to name them one by one, which would
# be different again with every macOS version.
defaults delete com.apple.dock persistent-apps 2>/dev/null || true

for app in "${present[@]}"; do
  label=$(basename "$app" .app)
  defaults write com.apple.dock persistent-apps -array-add "<dict>
    <key>tile-data</key>
    <dict>
      <key>file-data</key>
      <dict>
        <key>_CFURLString</key><string>${app}</string>
        <key>_CFURLStringType</key><integer>0</integer>
      </dict>
      <key>file-label</key><string>${label}</string>
    </dict>
    <key>tile-type</key><string>file-tile</string>
  </dict>"
done

killall Dock 2>/dev/null || true

printf '%s' "$(date '+%Y-%m-%dT%H:%M:%S')" > "$MARKER"
log "Dock set up with ${#present[@]} app(s) after $attempt attempt(s). Further runs do nothing."
exit 0
