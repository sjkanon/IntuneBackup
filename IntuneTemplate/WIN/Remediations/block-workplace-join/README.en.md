[Nederlands](README.md) · **English** · [Français](README.fr.md)

# No work accounts from other organisations on Windows

| | |
|---|---|
| **Controls** | ISO A.5.15 Access control, A.8.1 User endpoint devices, A.8.9 Configuration management · NIS2 art. 21(2)(i) human resources security, access control policies and asset management · CIS Controls v8.1 4.1 Establish and Maintain a Secure Configuration Process · NIST CSF 2.0 PR.AA-01, PR.PS-01 |
| **Phase** | 2 (pilot), then all physical Windows devices |
| **Source** | IntuneAdmin/IntuneBaselines, *Modern Work Detect and Remediation* (October 2026); own scripts |

## What it stops

On an organisation device a user can add a work account from **another tenant** under
*Settings → Accounts → Access work or school*. Office does the same unasked: after signing in with
another work account it shows a ticked box *Allow my organization to manage my device*. The device
is then also registered in that other tenant (Entra registered). The result:

- the other organisation can apply its Conditional Access, and sometimes its MAM or MDM policy, to
  this device;
- tokens from that other tenant sit in the WAM cache of a device we manage, and our data can reach
  the other tenant through apps signed in with that account;
- our device appears in the other tenant's Entra ID — invisible from, and impossible to clean up
  from, this tenant.

`BlockAADWorkplaceJoin = 1` (`HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin`) blocks that
registration. The organisation's own work account, with which the device is Entra joined, is not
affected.

## Why a script and not a template

The setting is not in the settings catalog (`pl4nty/intune-change-tracking` has no `workplacejoin`
definition) and not in a built-in ADMX. Hence, like [`dns-over-https/`](../dns-over-https/README.en.md),
a remediation.

## What to watch for

- **Consultants and shared staff** who work for a second organisation with an account from *that*
  tenant will run into this. Guest access (B2B) with their own account — switching Teams to another
  organisation, a shared SharePoint site — does not use a second work account and keeps working.
  Check in the pilot whether anyone uses a second work account in the desktop apps; such a user
  moves to the browser in a separate profile, or gets an exception (an exclusion group on the
  assignment).
- **Existing registrations stay.** The script prevents new ones; existing ones show in
  `dsregcmd /status` (section *Work Account*) or under *Access work or school*. The user or the
  service desk removes them with *Disconnect*.
- **Shared devices and AVD**: just as useful there, but redundant on multi-session if users have no
  Settings app. Start with physical devices.

## Rollout

Intune admin center → **Devices → Scripts and remediations → Create**:

| Field | Value |
|---|---|
| Name | `[Baseline] - WIN - D - Block Workplace Join` |
| Detection script | `Detect-BlockWorkplaceJoin.ps1` |
| Remediation script | `Remediate-BlockWorkplaceJoin.ps1` |
| Run this script using the logged-on credentials | No (SYSTEM) |
| Run script in 64-bit PowerShell | Yes |
| Schedule | Daily |
| Assignment | pilot group, then all physical Windows devices |

Undo: remove the value `BlockAADWorkplaceJoin`. A user can then add a work account from another
organisation again.
