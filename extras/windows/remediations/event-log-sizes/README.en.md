[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Event log sizes for PowerShell, Defender and Code Integrity

| | |
|---|---|
| **Controls** | ISO A.8.15 Logging · NIS2 art. 21(2)(b) incident handling · CIS Controls v8.1 8.3 Ensure Adequate Audit Log Storage · NIST CSF 2.0 PR.PS-04 |
| **Phase** | 2 |

## Why

`CXNM - Standard - WIN - D - Audit and Event Logging` sets the size of Application, Security and
System. The three operational channels that incident investigation relies on most have no CSP
for their maximum size and default to 15 MB or less:

| Channel | Filled by | Default | Here |
|---|---|---:|---:|
| `Microsoft-Windows-PowerShell/Operational` | script block logging (Security Hardening), module logging (Security Log Monitoring) | 15 MB | 256 MB |
| `Microsoft-Windows-Windows Defender/Operational` | detections, ASR, Network Protection, tamper alerts | 16 MB | 64 MB |
| `Microsoft-Windows-CodeIntegrity/Operational` | App Control audit 3076/3089 (see `../app-control/`) | 1 MB | 64 MB |

With module logging on, the PowerShell log on an active admin workstation fills up within hours
and yesterday's events are gone by the time someone looks for them. The
1 MB CodeIntegrity log does not survive a thirty-day audit phase.

## Deployment

Intune admin center → **Devices → Scripts and remediations → Create**:

| Field | Value |
|---|---|
| Name | `CXNM - Standard - WIN - D - Event Log Sizes` |
| Detection script | `Detect-EventLogSizes.ps1` |
| Remediation script | `Remediate-EventLogSizes.ps1` |
| Run this script using the logged-on credentials | No (SYSTEM) |
| 64-bit PowerShell | Yes |
| Schedule | Daily |
| Assignment | pilot group, then all Windows devices |

The sizes are in the same `$Channels` table in both scripts; keep them identical. 256 + 64 + 64 MB
is negligible on a 256 GB disk; Storage Sense does not touch event logs.
