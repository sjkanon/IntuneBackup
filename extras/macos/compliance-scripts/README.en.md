[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/macos/compliance-scripts/

A custom compliance check for macOS: is Microsoft Defender for Endpoint running on this Mac,
and is it healthy?

These two files deliberately live **outside** [`IntuneTemplate/`](../../../IntuneTemplate/README.en.md),
for the same reason as [`extras/macos/shell-scripts/`](../shell-scripts/README.en.md) and
[`extras/macos/enrollment/`](../enrollment/README.en.md): in Graph a compliance script is a
resource of its own (`deviceManagement/deviceComplianceScripts`) and does not fit any of the five
CIPP policy types. CIPP, `check-scope.js`, `export-intunebackup.js` and
`Set-BaselineAssignment.ps1` do nothing with this folder; deployment is manual, see below.

| File | What it is |
|---|---|
| [`defender-health.sh`](defender-health.sh) | runs on the Mac and writes a single line of JSON with five booleans |
| [`defender-health.json`](defender-health.json) | states which value is good, and what the user sees in Company Portal when it is not |

## Why this is needed

The baseline deploys Defender for Endpoint on macOS
([`MAC - D - Defender for Endpoint`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.en.md)
and [`MAC - D - Defender Antivirus`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.en.md)),
but nowhere checked whether that actually succeeded. Windows does have that check —
`WIN - U - Compliance Defender Real Time Protection` and `Defender Security Intelligence` test
whether Defender is on, real-time protection is active and the definitions are current. On macOS
the counterpart was missing.

`macOSCompliancePolicy` does have `deviceThreatProtectionEnabled`, but that tests something else:
the **risk score** Defender assigns to the device. A Mac on which the agent was never
installed, or where the background process has stopped, produces no risk score at all — and
thereby passes that test as "no problem". Exactly the device you wanted to find
falls outside the measurement. A script is the only way to test that the agent is actually there.

## What it checks

| Boolean | How |
|---|---|
| `DefenderInstalled` | the app and `/usr/local/bin/mdatp` both exist — the app alone says nothing about a working agent, and the tool alone also survives a half-completed removal |
| `DefenderRunning` | the `wdavdaemon` process is running; the app may be closed |
| `DefenderHealthy` | `mdatp health --field healthy` |
| `DefenderRealtimeProtection` | `mdatp health --field real_time_protection_enabled` |
| `DefenderDefinitionsCurrent` | `mdatp health --field definitions_status` is `up_to_date` |

All five must be `true`. The health calls only happen when the daemon is running: without
that check first, `mdatp health` hangs until Intune kills the script, and then there is
no output and therefore no verdict.

## Deploying

1. **Intune** → Devices → Compliance policies → **Scripts** → Add → macOS.
   Paste `defender-health.sh`. Leave *Run as signed-in user* **off** — the check is meant to be
   device-wide and `mdatp` does not need a user context.
2. Create a macOS compliance policy, set **Custom compliance** to *Require*, pick the script
   from step 1 and upload `defender-health.json`.
3. Assign to all users, like the other macOS compliance policies.

> There is deliberately **no** compliance policy template for this in `IntuneTemplate/`. Such a
> policy refers via `deviceCompliancePolicyScript` to the id of the script from step 1, and that
> id only comes into existence in the tenant. A template with an empty or foreign id does not
> import, or worse: imports and tests nothing.

## Troubleshooting

The script logs to `/Library/Logs/Microsoft/IntuneScripts/Compliance/defender-health.log`, with
the five results per run and the raw `definitions_status` when it was not good.

Two things that often go wrong with a custom compliance check:

- **Extra output on stdout invalidates the whole evaluation.** Intune expects exactly one line
  of JSON. That is why everything else this script reports goes to the log file and not to stdout.
- **`DefenderHealthy` at `false` while the rest is fine** usually points to a missing
  permission under System Settings → Privacy & Security, usually Full Disk Access.
  The baseline sets that via
  [`MAC - D - Privacy Preferences`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.en.md);
  if that policy does not arrive, this is the first place you notice.

Source for the approach: [Custom compliance for Defender on macOS](https://www.oddsandendpoints.co.uk/posts/macos-custom-defender-compliance/)
(Odds and Endpoints).

---

Back to the [main README](../../README.en.md).
