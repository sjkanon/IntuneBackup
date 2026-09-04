#!/bin/bash
# Aangepaste compliance-check: is Microsoft Defender for Endpoint op deze Mac aanwezig,
# draaiend en actueel?
#
# Waarom dit een script is en geen instelling in een compliance-policy: macOSCompliancePolicy
# kent wel `deviceThreatProtectionEnabled`, maar dat toetst de risicoscore die Defender for
# Endpoint aan het apparaat toekent — niet of Defender überhaupt draait. Een Mac waarop de
# agent nooit is geïnstalleerd of waar het achtergrondproces is gestopt, levert geen risicoscore
# en komt daarmee als "geen probleem" door de toets. Dat is precies het apparaat dat je wilt zien.
#
# Intune verwacht op stdout één regel geldige JSON, zonder witruimte ervoor of erna. Alles wat
# dit script verder wil melden gaat naar het logbestand, niet naar stdout — één regel extra
# uitvoer maakt de hele evaluatie ongeldig.
#
# Uitrol: Apparaten > Compliancebeleid > Scripts > Toevoegen (macOS), daarna een
# macOS-compliancebeleid met "Aangepaste compliance" aan en dit script plus
# defender-health.json eraan gekoppeld. Zie README.md in deze map.

LOG_DIR="/Library/Logs/Microsoft/IntuneScripts/Compliance"
LOG="${LOG_DIR}/defender-health.log"
mkdir -p "${LOG_DIR}" 2>/dev/null
exec 2>>"${LOG}"
echo "--- $(date '+%Y-%m-%d %H:%M:%S') defender-health" >>"${LOG}"

MDATP="/usr/local/bin/mdatp"
APP="/Applications/Microsoft Defender.app"

installed=false
running=false
healthy=false
realtime=false
definities=false

# 1. Aanwezig. De app én de opdrachtregeltool: alleen de app zegt niets over een werkende agent,
#    en alleen de tool bestaat ook nog na een halve verwijdering.
if [ -d "${APP}" ] && [ -x "${MDATP}" ]; then
  installed=true
fi

# 2. Draaiend. wdavdaemon is het proces dat het werk doet; de app kan dicht staan.
if pgrep -x "wdavdaemon" >/dev/null 2>&1; then
  running=true
fi

# `mdatp health` vraagt om een draaiende daemon. Zonder die controle vooraf blijft de aanroep
# hangen tot Intune het script afbreekt, en dan is er geen uitvoer en geen oordeel.
if [ "${installed}" = true ] && [ "${running}" = true ]; then
  veld() { "${MDATP}" health --field "$1" 2>>"${LOG}" | tr -d '"' | tr '[:upper:]' '[:lower:]' | xargs; }

  [ "$(veld healthy)" = "true" ] && healthy=true
  [ "$(veld real_time_protection_enabled)" = "true" ] && realtime=true

  # definitions_status kent meerdere waarden; alleen "up_to_date" is goed. "up_to_date" met een
  # verlopen abonnement bestaat niet, maar "unknown" wel — die telt hier als niet in orde.
  case "$(veld definitions_status)" in
    up_to_date) definities=true ;;
    *) echo "definitions_status: $(veld definitions_status)" >>"${LOG}" ;;
  esac
fi

echo "installed=${installed} running=${running} healthy=${healthy} realtime=${realtime} definities=${definities}" >>"${LOG}"

echo "{\"DefenderInstalled\":${installed},\"DefenderRunning\":${running},\"DefenderHealthy\":${healthy},\"DefenderRealtimeProtection\":${realtime},\"DefenderDefinitionsCurrent\":${definities}}"
