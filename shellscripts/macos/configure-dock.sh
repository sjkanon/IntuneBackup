#!/bin/bash
#
# Richt de Dock één keer per gebruiker in: de bedrijfsapps erin, Safari, Mail, Agenda en de
# rest van Apple's standaardset eruit. Daarna is de Dock van de gebruiker — wie er iets bij
# wil zetten of uit wil halen mag dat, en dit script komt er niet meer aan.
#
# Waarom een script en geen configuratieprofiel:
#
#   De Settings Catalog heeft Dock-instellingen, maar die zijn bij méér dan één app stuk:
#   Intune formatteert de lijst verkeerd en de payload komt niet op het apparaat aan.
#   Zie https://learn.microsoft.com/en-us/answers/questions/1164432/ (nog open).
#
#   Een custom .mobileconfig met `static-only` werkt wél, maar zet de Dock ook vást: de
#   gebruiker kan er dan niets meer aan veranderen. Dat is een zwaarder middel dan hier
#   gevraagd — de afspraak is eenmalig inrichten, niet dichttimmeren.
#
# In Intune: Devices → macOS → Shell scripts. Vereiste instellingen:
#
#   Run script as signed-in user   Yes    zonder dit schrijft `defaults` naar root's Dock
#   Hide script notifications      Yes
#   Script frequency               Every 1 hour
#   Max number of retries          3
#
# "Every 1 hour" lijkt in tegenspraak met "eenmalig", maar is het niet: zodra de Dock staat
# schrijft dit script een markering en stopt elke volgende run meteen. Het herhalen is er
# alleen voor het geval de apps bij de eerste run nog niet geïnstalleerd waren — bij een
# nieuwe Mac draait dit script vrijwel altijd vóórdat Intune de M365-apps heeft uitgerold.
# Met "Not configured" (één run, nooit meer) zou zo'n apparaat permanent een halve Dock
# houden.

set -u

STATE_DIR="$HOME/Library/Application Support/Baseline"
MARKER="$STATE_DIR/dock-configured"
ATTEMPTS="$STATE_DIR/dock-attempts"
LOG="$STATE_DIR/dock.log"

# Na dit aantal vergeefse pogingen richten we de Dock in met wat er wél staat. Bij een run
# per uur is dat ruim een dag: langer wachten op een app die niet komt (niet toegewezen,
# installatie mislukt) levert alleen maar een Dock op die nooit goed komt te staan.
MAX_ATTEMPTS=30

# Volgorde is de volgorde in de Dock, van links naar rechts. Finder staat altijd links en
# de Prullenbak altijd rechts; die twee horen niet in deze lijst — macOS beheert ze zelf.
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
  # Geen log-regel: dit is het normale geval bij elke run na de eerste, en een logbestand
  # dat elk uur een regel bijkrijgt maakt het onleesbaar precies wanneer je het nodig hebt.
  exit 0
fi

# Systeeminstellingen heet vanaf macOS 13 anders en staat op een ander pad dan daarvoor.
# Beide controleren in plaats van de macOS-versie uitlezen: het pad is waar het om gaat.
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
  log "poging $attempt/$MAX_ATTEMPTS — nog niet geïnstalleerd: ${missing[*]}. Dock nog niet aangeraakt."
  exit 0
fi

if [ ${#present[@]} -eq 0 ]; then
  log "geen enkele app uit de lijst gevonden na $attempt pogingen — Dock ongemoeid gelaten."
  exit 0
fi

if [ ${#missing[@]} -gt 0 ]; then
  log "na $attempt pogingen nog steeds afwezig: ${missing[*]}. Dock wordt ingericht zonder die apps."
fi

# De hele lijst vervangen in plaats van items toevoegen of verwijderen. Daarmee verdwijnen
# Safari, Mail, Agenda, Contacten, Notities, Herinneringen, Berichten, FaceTime, Foto's,
# Muziek, TV, Podcasts, Kaarten, Nieuws, App Store en Freeform in één keer — zonder ze stuk
# voor stuk op naam te hoeven noemen, wat bij elke macOS-versie weer anders zou liggen.
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
log "Dock ingericht met ${#present[@]} app(s) na $attempt poging(en). Verdere runs doen niets meer."
exit 0
