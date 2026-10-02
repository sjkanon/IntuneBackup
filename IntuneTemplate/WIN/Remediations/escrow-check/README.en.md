[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Escrow check: BitLocker recovery key and LAPS password in Entra ID

| | |
|---|---|
| **Controls** | ISO A.8.13 Information backup, A.8.24 Use of cryptography, A.8.2 Privileged access rights · NIS2 art. 21(2)(c) business continuity and crisis management, art. 21(2)(f) assessment of effectiveness · CIS Controls v8.1 3.11 Encrypt Sensitive Data at Rest, 5.2 Use Unique Passwords · NIST CSF 2.0 PR.DS-01, PR.AA-05 |
| **Phase** | detection 1 (changes nothing) · BitLocker remediation 2 |

## Why

`CXNM - Standard - WIN - D - BitLocker` requires the recovery key to go to Entra ID and
`CXNM - Standard - WIN - D - Windows LAPS` requires the administrator password to be stored there. Both policies
report **Succeeded** as soon as the setting has been applied — not whether the key or the password
actually arrived. The compliance check `Compliance BitLocker` only looks at whether the
disk is encrypted. A device that is encrypted without a usable recovery key in Entra
is irrecoverably a lost device at the first BitLocker recovery. These scripts make that
difference visible in the remediation report — the demonstrable part of A.8.13 and art. 21(2)(f).

## Files

| File | Detection | Remediation |
|---|---|---|
| `Detect-BitLockerEscrow.ps1` / `Remediate-BitLockerEscrow.ps1` | Does the OS disk have a recovery password protector, and is there a successful Entra backup (BitLocker API event 845) in the log for *that* protector? | `BackupToAAD-BitLockerKeyProtector` for each recovery password protector; creates one if it is missing and the disk is encrypted |
| `Detect-LapsEscrow.ps1` | Has a successful LAPS update to Entra ID been logged in the last `$MaxAgeDays` days (Microsoft-Windows-LAPS/Operational 10029)? | none — detection only; `Invoke-LapsPolicyProcessing` forces a new attempt, but a persistent error lies in the policy or in the Entra device setting *Enable Microsoft Entra Local Administrator Password Solution* and must be fixed there |

## Deployment

Intune admin center → **Devices → Scripts and remediations → Create**, per pair:

| Field | Value |
|---|---|
| Name | `CXNM - Standard - WIN - D - BitLocker Escrow Check` / `CXNM - Standard - WIN - D - LAPS Escrow Check` |
| Run this script using the logged-on credentials | No (SYSTEM) |
| 64-bit PowerShell | Yes |
| Schedule | Daily |
| Assignment | all Windows devices; the BitLocker remediation script only after a week in the pilot group |

The report (Scripts and remediations → the remediation → Device status) is the evidence:
*Without issues* = key or password demonstrably in Entra.

## Caveats

- Event 845 is only in the log as long as it has not been overwritten. A device that was encrypted
  long ago may therefore rightly have a key in Entra and still show up as an *issue*;
  the remediation script then creates a new backup and after that it is green. That is
  deliberate: better one superfluous backup than one assumption.
- `Detect-LapsEscrow.ps1` assumes `passwordagedays_aad` = 7 in the LAPS policy; `$MaxAgeDays`
  is therefore set to 10. Adjust it if the policy changes.
- Both detections only read logs and BitLocker status; they send nothing.
