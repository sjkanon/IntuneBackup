#!/bin/bash
#
# Zorgt dat een Mac die al versleuteld was vóór hij onder beheer kwam, alsnog een
# FileVault-herstelsleutel in Intune krijgt. Installeert daarvoor Escrow Buddy en laat bij
# de eerstvolgende aanmelding een nieuwe persoonlijke herstelsleutel aanmaken.
#
# Waarom dit script bestaat:
#
#   [Baseline] - MAC - D - FileVault zet FileVault aan en bewaart de herstelsleutel in
#   Intune — maar alleen voor een Mac die op het moment van versleutelen het escrow-profiel
#   (com.apple.security.FDERecoveryKeyEscrow) al had. Een Mac die de gebruiker zelf al had
#   versleuteld, of die vóór de inschrijving door Setup Assistant is versleuteld, heeft een
#   sleutel die Intune nooit heeft gezien. Intune toont dan geen herstelsleutel, en een
#   vergeten wachtwoord betekent een verloren schijf.
#
#   macOS escrowt alleen een sleutel die wordt áángemaakt terwijl het escrow-profiel er staat.
#   Escrow Buddy (macadmins/escrow-buddy, oorspronkelijk van Netflix) is een authorization
#   plugin die bij het aanmelden precies dat doet: met het wachtwoord dat de gebruiker toch al
#   intypt een nieuwe persoonlijke herstelsleutel aanmaken. De gebruiker merkt er niets van.
#
# In Intune: Devices → macOS → Shell scripts. Vereiste instellingen:
#
#   Run script as signed-in user   No     installeren en de authorization database wijzigen
#                                         vraagt root
#   Hide script notifications      Yes
#   Script frequency               Every 1 day
#   Max number of retries          3
#
# Toewijzen aan een apparaatgroep. Zie README.md naast dit script.

set -u

# --- Wat er geïnstalleerd wordt ----------------------------------------------------------
#
# Vaste versie en vaste ondertekenaar. "latest" ophalen zou betekenen dat een wijziging op
# GitHub zonder review op elke Mac terechtkomt. Het pakket wordt alleen geïnstalleerd als het
# door Apple genotariseerd is én is ondertekend met Developer ID Installer van het team
# hieronder; anders stopt het script en staat de werkelijke ondertekenaar in de log.
#
# T4SK8ZXCXG is "Mac Admins Open Source", de identiteit waarmee de build-workflow van
# macadmins/escrow-buddy (.github/workflows/build_main.yml) het pakket ondertekent.

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
  log "FOUT: dit script moet als root draaien (Run script as signed-in user = No)."
  exit 1
fi

# --- 1. Is er iets te doen? ----------------------------------------------------------------

if ! /usr/bin/fdesetup status | grep -q "FileVault is On"; then
  # Niet versleuteld: de FileVault-policy versleutelt de schijf en escrowt de sleutel dan
  # zelf. Escrow Buddy is daar niet voor nodig.
  log "FileVault staat niet aan; niets te doen (de FileVault-policy regelt versleuteling en escrow)."
  exit 0
fi

if [[ -f "$MARKER" ]]; then
  log "Nieuwe sleutel is al eerder aangevraagd ($(cat "$MARKER")); niets te doen."
  exit 0
fi

# Zonder escrow-profiel wordt een nieuwe sleutel wél aangemaakt maar nergens bewaard — dan is
# de situatie slechter dan ervoor. Wachten tot [Baseline] - MAC - D - FileVault er staat.
if ! /usr/bin/profiles show -output stdout-xml 2>/dev/null | grep -q "com.apple.security.FDERecoveryKeyEscrow"; then
  log "Het escrow-profiel (FDERecoveryKeyEscrow) staat nog niet op deze Mac; volgende run opnieuw."
  exit 1
fi

# --- 2. Escrow Buddy installeren -----------------------------------------------------------

if [[ ! -d "$EB_BUNDLE" ]]; then
  TMP="$(mktemp -d /private/tmp/escrow-buddy.XXXXXX)"
  PKG="$TMP/EscrowBuddy.pkg"
  trap 'rm -rf "$TMP"' EXIT

  log "Escrow Buddy $EB_VERSION ophalen."
  if ! /usr/bin/curl --fail --silent --show-error --location --max-time 300 -o "$PKG" "$EB_URL" >>"$LOG" 2>&1; then
    log "FOUT: downloaden mislukt; volgende run opnieuw."
    exit 1
  fi

  SIG="$(/usr/sbin/pkgutil --check-signature "$PKG" 2>&1)"
  if ! printf '%s' "$SIG" | grep -q "Developer ID Installer: .*(${EB_TEAM_ID})"; then
    log "FOUT: pakket is niet ondertekend door team $EB_TEAM_ID. Niet geïnstalleerd. Ondertekening:"
    printf '%s\n' "$SIG" >>"$LOG"
    exit 1
  fi
  if ! /usr/sbin/spctl --assess --type install "$PKG" >>"$LOG" 2>&1; then
    log "FOUT: Gatekeeper keurt het pakket af (niet genotariseerd?). Niet geïnstalleerd."
    exit 1
  fi

  log "Installeren."
  if ! /usr/sbin/installer -pkg "$PKG" -target / >>"$LOG" 2>&1; then
    log "FOUT: installatie mislukt."
    exit 1
  fi
fi

# De postinstall van het pakket zet het mechanisme in system.login.console. Controleren in
# plaats van aannemen: zonder die regel draait de plugin nooit en gebeurt er stil niets.
if ! /usr/bin/security authorizationdb read system.login.console 2>/dev/null | grep -q "<string>${EB_MECHANISM}</string>"; then
  if [[ -x "$EB_BUNDLE/Contents/Resources/AuthDBSetup.sh" ]]; then
    log "Mechanisme ontbreekt in de authorization database; AuthDBSetup.sh uit de bundle draaien."
    "$EB_BUNDLE/Contents/Resources/AuthDBSetup.sh" >>"$LOG" 2>&1
  fi
  if ! /usr/bin/security authorizationdb read system.login.console 2>/dev/null | grep -q "<string>${EB_MECHANISM}</string>"; then
    log "FOUT: Escrow Buddy staat niet in system.login.console; er wordt geen sleutel aangemaakt."
    exit 1
  fi
fi

# --- 3. Nieuwe sleutel aanvragen -----------------------------------------------------------

/usr/bin/defaults write "$EB_PREFS" GenerateNewKey -bool true
date '+%Y-%m-%d %H:%M:%S' >"$MARKER"
log "GenerateNewKey gezet. Bij de volgende aanmelding van een FileVault-gebruiker maakt macOS een nieuwe herstelsleutel aan en stuurt hem naar Intune."
exit 0
