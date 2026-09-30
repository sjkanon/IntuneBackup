#!/bin/bash
# Custom compliance check: is Microsoft Defender for Endpoint present, running and up to date
# on this Mac?
#
# Why this is a script and not a setting in a compliance policy: macOSCompliancePolicy does
# have `deviceThreatProtectionEnabled`, but that checks the risk score Defender for Endpoint
# assigns to the device — not whether Defender is running at all. A Mac on which the agent was
# never installed, or where the background process has stopped, produces no risk score and so
# passes the check as "no problem". That is exactly the device you want to see.
#
# Intune expects exactly one line of valid JSON on stdout, with no whitespace before or after
# it. Anything else this script wants to report goes to the log file, not to stdout — a single
# extra line of output invalidates the whole evaluation.
#
# Deployment: Devices > Compliance > Scripts > Add (macOS), then a macOS compliance policy with
# "Custom compliance" turned on and this script plus defender-health.json linked to it. See
# README.md in this folder.

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

# 1. Present. Both the app and the command-line tool: the app alone says nothing about a
#    working agent, and the tool alone still exists after a half-finished removal.
if [ -d "${APP}" ] && [ -x "${MDATP}" ]; then
  installed=true
fi

# 2. Running. wdavdaemon is the process that does the work; the app can be closed.
if pgrep -x "wdavdaemon" >/dev/null 2>&1; then
  running=true
fi

# `mdatp health` needs a running daemon. Without checking that first the call hangs until
# Intune aborts the script, and then there is no output and no verdict.
if [ "${installed}" = true ] && [ "${running}" = true ]; then
  veld() { "${MDATP}" health --field "$1" 2>>"${LOG}" | tr -d '"' | tr '[:upper:]' '[:lower:]' | xargs; }

  [ "$(veld healthy)" = "true" ] && healthy=true
  [ "$(veld real_time_protection_enabled)" = "true" ] && realtime=true

  # definitions_status has several values; only "up_to_date" is good. "up_to_date" with an
  # expired subscription does not exist, but "unknown" does — that counts as not OK here.
  case "$(veld definitions_status)" in
    up_to_date) definities=true ;;
    *) echo "definitions_status: $(veld definitions_status)" >>"${LOG}" ;;
  esac
fi

echo "installed=${installed} running=${running} healthy=${healthy} realtime=${realtime} definitions=${definities}" >>"${LOG}"

echo "{\"DefenderInstalled\":${installed},\"DefenderRunning\":${running},\"DefenderHealthy\":${healthy},\"DefenderRealtimeProtection\":${realtime},\"DefenderDefinitionsCurrent\":${definities}}"
