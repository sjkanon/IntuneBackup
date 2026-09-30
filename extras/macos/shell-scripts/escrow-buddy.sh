#!/bin/bash
#
# Makes sure a Mac that was already encrypted before it came under management still gets a
# FileVault recovery key in Intune. To do so it installs Escrow Buddy and has a new personal
# recovery key generated at the next sign-in.
#
# Why this script exists:
#
#   CXNM - Standard - MAC - D - FileVault turns on FileVault and stores the recovery key in
#   Intune — but only for a Mac that already had the escrow profile
#   (com.apple.security.FDERecoveryKeyEscrow) at the moment of encryption. A Mac that the user
#   had already encrypted themselves, or that was encrypted by Setup Assistant before
#   enrollment, has a key that Intune has never seen. Intune then shows no recovery key, and a
#   forgotten password means a lost disk.
#
#   macOS only escrows a key that is created while the escrow profile is present.
#   Escrow Buddy (macadmins/escrow-buddy, originally from Netflix) is an authorization plugin
#   that does exactly that at sign-in: using the password the user types anyway, it creates a
#   new personal recovery key. The user notices nothing.
#
# In Intune: Devices → macOS → Shell scripts. Required settings:
#
#   Run script as signed-in user   No     installing and changing the authorization database
#                                         requires root
#   Hide script notifications      Yes
#   Script frequency               Every 1 day
#   Max number of retries          3
#
# Assign to a device group. See README.md next to this script.

set -u

# --- What gets installed -----------------------------------------------------------------
#
# Fixed version and fixed signer. Fetching "latest" would mean that a change on GitHub lands
# on every Mac without review. The package is only installed if it is notarized by Apple and
# signed with Developer ID Installer of the team below; otherwise the script stops and the
# actual signer is in the log.
#
# T4SK8ZXCXG is "Mac Admins Open Source", the identity with which the build workflow of
# macadmins/escrow-buddy (.github/workflows/build_main.yml) signs the package.

EB_VERSION="1.0.0"
EB_URL="https://github.com/macadmins/escrow-buddy/releases/download/v${EB_VERSION}/Escrow.Buddy-${EB_VERSION}.pkg"
EB_TEAM_ID="T4SK8ZXCXG"

EB_BUNDLE="/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle"
EB_MECHANISM="Escrow Buddy:Invoke,privileged"
EB_PREFS="/Library/Preferences/com.netflix.Escrow-Buddy.plist"

STATE_DIR="/Library/Application Support/Baseline"
MARKER="$STATE_DIR/escrow-buddy-requested"
LOG_DIR="/Library/Logs/Baseline"
LOG="$LOG_DIR/escrow-buddy.log"

mkdir -p "$STATE_DIR" "$LOG_DIR"

log() {
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG"
}

if [[ $EUID -ne 0 ]]; then
  log "ERROR: this script must run as root (Run script as signed-in user = No)."
  exit 1
fi

# --- 1. Is there anything to do? -----------------------------------------------------------

if ! /usr/bin/fdesetup status | grep -q "FileVault is On"; then
  # Not encrypted: the FileVault policy encrypts the disk and then escrows the key itself.
  # Escrow Buddy is not needed for that.
  log "FileVault is not on; nothing to do (the FileVault policy handles encryption and escrow)."
  exit 0
fi

if [[ -f "$MARKER" ]]; then
  log "A new key was already requested earlier ($(cat "$MARKER")); nothing to do."
  exit 0
fi

# Without the escrow profile a new key is created but stored nowhere — then the situation is
# worse than before. Wait until CXNM - Standard - MAC - D - FileVault is in place.
if ! /usr/bin/profiles show -output stdout-xml 2>/dev/null | grep -q "com.apple.security.FDERecoveryKeyEscrow"; then
  log "The escrow profile (FDERecoveryKeyEscrow) is not on this Mac yet; trying again on the next run."
  exit 1
fi

# --- 2. Installing Escrow Buddy ------------------------------------------------------------

if [[ ! -d "$EB_BUNDLE" ]]; then
  TMP="$(mktemp -d /private/tmp/escrow-buddy.XXXXXX)"
  PKG="$TMP/EscrowBuddy.pkg"
  trap 'rm -rf "$TMP"' EXIT

  log "Downloading Escrow Buddy $EB_VERSION."
  if ! /usr/bin/curl --fail --silent --show-error --location --max-time 300 -o "$PKG" "$EB_URL" >>"$LOG" 2>&1; then
    log "ERROR: download failed; trying again on the next run."
    exit 1
  fi

  SIG="$(/usr/sbin/pkgutil --check-signature "$PKG" 2>&1)"
  if ! printf '%s' "$SIG" | grep -q "Developer ID Installer: .*(${EB_TEAM_ID})"; then
    log "ERROR: package is not signed by team $EB_TEAM_ID. Not installed. Signature:"
    printf '%s\n' "$SIG" >>"$LOG"
    exit 1
  fi
  if ! /usr/sbin/spctl --assess --type install "$PKG" >>"$LOG" 2>&1; then
    log "ERROR: Gatekeeper rejects the package (not notarized?). Not installed."
    exit 1
  fi

  log "Installing."
  if ! /usr/sbin/installer -pkg "$PKG" -target / >>"$LOG" 2>&1; then
    log "ERROR: installation failed."
    exit 1
  fi
fi

# The package's postinstall adds the mechanism to system.login.console. Check instead of
# assuming: without that entry the plugin never runs and silently nothing happens.
if ! /usr/bin/security authorizationdb read system.login.console 2>/dev/null | grep -q "<string>${EB_MECHANISM}</string>"; then
  if [[ -x "$EB_BUNDLE/Contents/Resources/AuthDBSetup.sh" ]]; then
    log "Mechanism missing from the authorization database; running AuthDBSetup.sh from the bundle."
    "$EB_BUNDLE/Contents/Resources/AuthDBSetup.sh" >>"$LOG" 2>&1
  fi
  if ! /usr/bin/security authorizationdb read system.login.console 2>/dev/null | grep -q "<string>${EB_MECHANISM}</string>"; then
    log "ERROR: Escrow Buddy is not in system.login.console; no key will be created."
    exit 1
  fi
fi

# --- 3. Requesting a new key ---------------------------------------------------------------

/usr/bin/defaults write "$EB_PREFS" GenerateNewKey -bool true
date '+%Y-%m-%d %H:%M:%S' >"$MARKER"
log "GenerateNewKey set. At the next sign-in of a FileVault user macOS creates a new recovery key and sends it to Intune."
exit 0
