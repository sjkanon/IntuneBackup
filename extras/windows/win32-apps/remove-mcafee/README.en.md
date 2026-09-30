[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Remove preinstalled McAfee

A Win32 app that removes the McAfee trial that ships from the factory on almost every new
consumer laptop.

Lives outside [`IntuneTemplate/`](../../../../IntuneTemplate/README.en.md), just like
[`extras/macos/shell-scripts/`](../../../macos/shell-scripts/README.en.md) and
[`extras/macos/compliance-scripts/`](../../../macos/compliance-scripts/README.en.md): a Win32 app is not a policy and does
not fit any of the five CIPP policy types. CIPP, `check-scope.js`, `export-intunebackup.js` and
`Set-BaselineAssignment.ps1` do nothing with this folder; you package and upload the app by hand.

## Why this belongs to the baseline

Not because McAfee is unwanted software, but because it **switches off Microsoft Defender**.
Windows allows only one active antivirus: as soon as McAfee registers itself, Defender goes into
*passive mode*. Real-time protection stops, and with it the foundation under a large part of this
baseline falls away — the ASR rules, Controlled Folder Access, Network Protection and the new
Remote Encryption Protection all rely on an active Defender engine.

The nasty part is that none of this reports an error. The policies arrive fine, Intune
reports them as succeeded, and the settings do nothing because the engine that would enforce them is on the
bench. That stays the case until the McAfee trial expires — and then the device runs for a while
without working antivirus.

| File | What it is |
|---|---|
| [`Detect-McAfee.ps1`](Detect-McAfee.ps1) | detection script: finds leftovers in the registry (64- and 32-bit), in Program Files and in the service list |
| [`Remove-McAfee.ps1`](Remove-McAfee.ps1) | runs MCPR three times, cleans up leftover folders and Appx packages |

`MCPR.exe` is **not** in this repo — it is McAfee's own tool and should not be committed.
Get it from McAfee and package it together with the two scripts into the `.intunewin`.

## Packaging and deploying

```powershell
IntuneWinAppUtil.exe -c .\apps\win32\remove-mcafee -s Remove-McAfee.ps1 -o .\uitvoer
```

In Intune → Apps → Windows → Win32 app:

| Field | Value |
|---|---|
| Install command | `powershell.exe -ExecutionPolicy Bypass -File Remove-McAfee.ps1` |
| Uninstall command | `cmd.exe /c exit 0` (there is nothing to put back) |
| Install behaviour | System |
| **Device restart behaviour** | **Intune will force a mandatory device restart** |
| Detection rule | Custom script → `Detect-McAfee.ps1` |

> **That restart is not an afterthought but the final step of the removal.** MCPR defers part of
> the work via `PendingFileRenameOperations`; without a restart the device is left in a
> half-removed state in which Defender still does not come back. Put this app on the
> Enrollment Status Page as a blocking app, so a new device goes through the removal
> before the user starts.

## How to tell whether it worked

The script logs to `C:\Windows\Logs\Baseline\remove-mcafee.log`. Afterwards, check on the
device that Defender is active again and not passive:

```powershell
Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled
```

`AMRunningMode` should be `Normal`. If it says `Passive` or `EDR Block Mode`, another antivirus
is still active and the removal is not finished.

Two things that are normal with MCPR and do not indicate an error:

- **A non-zero exit code.** "Incomplete uninstallation" means the remaining work has been
  deferred until the restart, not that it failed. So the script does not stop on it.
- **Multiple rounds needed.** Each round releases file locks that were still in the way of the
  previous one. A single run almost always leaves leftovers; that is why the script runs three
  rounds with a pause in between.

Source for the approach: [McAfee: the shadow IT that ships from the
factory](https://malinoski.me/2026/08/25/mcafee-the-shadow-it-that-ships-from-the-factory-and-how-to-remove-it-with-intune/).

---

Back to the [main README](../../../README.en.md).
