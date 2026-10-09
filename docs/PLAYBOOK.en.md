[Nederlands](PLAYBOOK.md) · **English** · [Français](PLAYBOOK.fr.md)

# Runbook: deploying the baseline through CIPP, per device class

For ITCE engineers putting this baseline into a customer tenant with CIPP. The runbook assumes
three Windows device classes — shared, physical and AVD — told apart with **assignment filters**
instead of groups. Which policy is in which class and why is in [AVD.en.md](AVD.en.md); how the
repo fits together is in [STRUCTUUR.en.md](STRUCTUUR.en.md).

**Nothing in this runbook happens by itself.** The baseline in CIPP only deploys once you assign
tenants to it, and every script gets a `-WhatIf` run first.

## The three device classes

Every Windows policy has a `doelgroep` (target class) in [`_manifest.json`](../IntuneTemplate/_manifest.json).
macOS, iOS and Android policies have none: a filter with platform `windows10AndLater` cannot be
selected there.

| Class (`doelgroep`) | What | Filter (include) | Rule |
|---|---|---|---|
| `alle` (shared) | physical PCs and AVD session hosts, and everything that falls under neither filter | none | — |
| `fysiek` (physical) | laptops and workstations | `WIN - Physical` | `(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")` |
| `avd` | AVD session hosts running Windows 11 Enterprise multi-session | `WIN - AVD Multi-session` | `(device.operatingSystemSKU -eq "ServerRdsh")` |

The bodies are in [`IntuneTemplate/WIN/AssignmentFilters/`](../IntuneTemplate/WIN/AssignmentFilters/README.en.md).
Both were validated in the test tenant with `validateFilter` and *Preview devices*: `WIN - Physical`
matches the four physical and QEMU PCs and not the AVD host, `WIN - AVD Multi-session` exactly the AVD host.

**Windows 365 Cloud PCs and personal AVD hosts** (single-session, model `Cloud PC …` or
`Virtual Machine`) fall under **neither** filter. They only get class `alle`, plus the Cloud PC set
through the groups `SEC-Cloud-PC` and `SEC-Cloud-PC-External` (phase 4). No BitLocker, Windows
Hello, Storage Sense or physical `Remote Desktop and RPC`, and no FSLogix either. That is a choice,
not a mistake: at a customer with Windows 365, check that the shared set is enough there.

## Packages

A CIPP package (`Package` in the template) has one assignment and one filter for all its members.
So the pipeline makes a package per class: the package without suffix for `alle` and non-Windows,
`-Physical` and `-AVD` for the classes with a filter. Only in phase 1 and 2; phase 3 is not
assigned, phase 4 has its own group, phase 5 does not deploy. An empty class gets no package
(there is no `-Users-AVD` and no `-Pilot-AVD`).

State at the time of writing, counted from the manifest; the current, generated table is in the
[`IntuneTemplate` README](../IntuneTemplate/README.en.md#cipp-packages).

| Package | Assignment | Filter | Stage | Policies |
|---|---|---|---:|---:|
| `[Baseline] - Baseline-Devices` | all devices | — | 1 | 53 |
| `[Baseline] - Baseline-Devices-Physical` | all devices | `WIN - Physical` | 1 | 14 |
| `[Baseline] - Baseline-Devices-AVD` | all devices | `WIN - AVD Multi-session` | 1 | 4 |
| `[Baseline] - Baseline-Users` | all users | — | 1 | 31 |
| `[Baseline] - Baseline-Users-Physical` | all users | `WIN - Physical` | 1 | 1 |
| `[Baseline] - Baseline-ADE-token` | do not assign (ADE token) | — | 1 | 2 |
| `[Baseline] - Baseline-SEC-<group>` (ten packages) | the group from `faseGroep` | — | 1 | 14 |
| `[Baseline] - Baseline-Pilot` | group `SEC-Baseline-Pilot` | — | 2 | 29 |
| `[Baseline] - Baseline-Pilot-Physical` | group `SEC-Baseline-Pilot` | `WIN - Physical` | 2 | 13 |
| `[Baseline] - Baseline-Wacht` | do not assign | — | 3 | 26 |
| `[Baseline] - Updates-Ring3-Physical` | all devices except `SEC-Update-Ring1/2` | `WIN - Physical` | 1 (Windows-Updates) | 1 |
| `[Baseline] - Updates-SEC-Update-Ring1`, `-Ring2` | the ring group | — | 1 (Windows-Updates) | 2 |
| `[Baseline] - Updates-Devices` | all devices | — | 1 (Windows-Updates) | 1 |
| `[Baseline] - Updates-Devices-Physical` | all devices | `WIN - Physical` | 1 (Windows-Updates) | 1 |
| *(no package — phase 5)* | — | — | — | 15 |

207 in total. The `Baseline-` packages are in [`BaselineTemplate/Baseline.json`](../BaselineTemplate/Baseline.json),
the `Updates-` packages in [`Windows-Updates.json`](../BaselineTemplate/README.en.md#windows-updatesjson--patching).
A class package sits in the same stage as its counterpart. The CIPP standard holds the filter as a
**name** (`assignmentFilter`, `assignmentFilterType: include`); CIPP looks it up per tenant.

## Filters or groups?

**Filters for the classes**, for four reasons:

1. **Immediately at check-in.** Intune evaluates a filter the moment the device checks in. A new
   session host or laptop gets the right set straight away; with a dynamic group it first waits
   until Entra has put it in the group, and gets the wrong policies or none in the meantime.
2. **Also on user assignments.** Windows Hello for Business, Personal Data Encryption and the other
   `U` policies go to users. Excluding a *device group* does nothing there; a filter *is* evaluated
   on the device the user signs in to. The same user gets Windows Hello on their laptop and not in
   their AVD session.
3. **Recommended by Microsoft.** Assigning to *All users* / *All devices* with a filter is faster
   than to large groups: no group evaluation on every change.
4. **Fits CIPP.** A CIPP package has exactly one filter, and a class is exactly one filter. The
   previous model — exclude filters per policy on mixed packages — could not be expressed in CIPP.

**Groups are still needed** where it is about a selection and not a kind of device:

- **The pilot**: `SEC-Baseline-Pilot`. Who is in the pilot is a choice, not a property of the device.
- **Phase 4**: `SEC-Cloud-PC`, `SEC-Cloud-PC-External`, `SEC-Shared-Devices`, the update rings
  `SEC-Update-Ring1/2` and the other `faseGroep` groups.
- **The AVD host group `SEC-AVD-Session-Hosts`**, not for the baseline packages but for the host
  pool setting *RDP SSO → target device groups*, the compliance device assignment on
  multi-session, and reporting.
- **Features that require a group**, such as Windows Autopatch and other update services with
  their own groups.

**Group and filter** can be combined: `[Baseline] - Baseline-Pilot-Physical` goes to the group
`SEC-Baseline-Pilot` with include `WIN - Physical`. If a session host is in the pilot group, it gets
the shared pilot policies (`Baseline-Pilot`) but not the physical ones.

## Naming

The repo only describes its convention for policies and files, in [README.en.md](../README.en.md#naming).
Derived from what is there, this applies to everything:

**What is visible in the tenant or in CIPP is English; what only lives in the repo is Dutch.**
Policy, package, filter and group names are English; manifest fields (`doel`, `fase`, `faseGroep`,
`doelgroep`) and their values (`alle`, `fysiek`, `avd`) are Dutch.

| What | Pattern | Example |
|---|---|---|
| Policy | `<prefix><PLATFORM> - <D\|U> - <Item>` | `[Baseline] - WIN - D - BitLocker` |
| Policy file | `Baseline_<PLATFORM>_<D\|U>_<Item with _>.json` | `Baseline_WIN_D_BitLocker.json` |
| CIPP package | `<prefix>Baseline-<target>[-<class>]` | `[Baseline] - Baseline-Devices-Physical` |
| Update package | `<prefix>Updates-<target>[-<class>]` | `[Baseline] - Updates-Ring3-Physical` |
| Class suffix | `-Physical`, `-AVD` — always last | `[Baseline] - Baseline-Pilot-Physical` |
| Group package | `<prefix>Baseline-<group name>` | `[Baseline] - Baseline-SEC-Cloud-PC` |
| CIPP baseline | `<prefix><Subject>` | `[Baseline] - Windows Updates` |
| Assignment filter | `<PLATFORM> - <Name>`, **without** prefix | `WIN - Physical`, `AND - Corporate` |
| Filter file | `<PLATFORM>-<Name with ->.json` in `<PLATFORM>/AssignmentFilters/` | `WIN-Physical.json` |
| Entra group | `SEC-<Purpose-in-words>` with hyphens | `SEC-Baseline-Pilot`, `SEC-AVD-Session-Hosts` |
| CIPP custom variable | PascalCase, between `%` in the template | `%SecurityAlertMail%`, `%FSLogixStorageAccount%` |
| Placeholder in git | `<WHAT>-INVULLEN`, filled in in `local/` | `DEDICATED-INSCHRIJFPROFIEL-INVULLEN` |

`<prefix>` is `[Baseline] - ` from [`_organisation.json`](../IntuneTemplate/_organisation.json) and
is changed with `set-organisation.js`. Filters deliberately do not carry the prefix: they are a
building block also used outside the baseline, and CIPP, `Set-BaselineAssignment.ps1` and the
export look them up literally by name — renaming a filter therefore means the tenant and this repo
at the same time.

**Deviations that were already there** (not renamed, as they are outside this work; worth knowing):

- `[Baseline] - Baseline-Wacht` is the only Dutch word in a package name; the CIPP stages also have
  Dutch names (`Nu`, `Pilot`, `Wacht op voorwaarde`, and `Melden`/`Blokkeren` for DLP).
- The filter file `WIN-AVD-Multi-Session.json` has a capital S, the filter name
  `WIN - AVD Multi-session` does not. For the Android filters file and name match exactly.
- `[Baseline] - Baseline-SEC-Baseline-Pilot` (phase 4, one policy) and `[Baseline] - Baseline-Pilot`
  (phase 2) go to the same group: two packages for one target.
- Group names spell the platform the brand way (`SEC-iOS-BYOD`, `SEC-Remote-Support-macOS`),
  elsewhere as a code (`IOS`, `MAC`).
- `[Baseline] Windows Hello For Business` from the old set is not in `_renames.json` (see migration).

## Steps

### 0. Preparation

- **Roles**: in the customer tenant Intune Administrator (filters, assignments) and for the Graph
  scripts `DeviceManagementConfiguration.ReadWrite.All` and `Group.Read.All`. In CIPP a role that
  may manage baselines and standards.
- **Licences**: Intune Plan 1 (included in Business Premium, E3/E5); for AVD Windows 11 Enterprise
  multi-session through the AVD rights; for the `Defender for Endpoint` policies Defender for
  Business or P2.
- **CIPP**: the tenant has been added (GDAP) and the template repository points to this repo.
- **Tenant settings** from [STRUCTUUR.en.md](STRUCTUUR.en.md#tenant-settings-that-are-not-a-policy):
  devices without a compliance policy not compliant, Defender for Endpoint connector on.
- **Groups** the tenant needs: `SEC-Baseline-Pilot` (with a handful of physical pilot PCs and
  users) and the `faseGroep` groups you use. See the
  [BaselineTemplate README](../BaselineTemplate/README.en.md).

### 1. Create the filters

**Before the first CIPP run.** CIPP looks the filter up by name and, if it does not exist, assigns
**without** a filter with only a warning in the log — BitLocker and Windows Hello then land on the
session hosts too.

```powershell
.\scripts\Set-BaselineAssignment.ps1 -AllDevices -Doelgroep fysiek,avd -CreateFilters -WhatIf
```

creates only the missing filters from the JSON bodies (for real without `-WhatIf`) and shows what
it would assign; you can stop after creating and leave assigning to CIPP. Or with Graph:
`POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters` with the contents of the
file. Or in the portal: Tenant administration → Filters → Create → Managed devices → Windows 10 and later.

Then check every filter with **Preview devices**: `WIN - Physical` shows the laptops and
workstations and no session host or Cloud PC; `WIN - AVD Multi-session` only the session hosts.

### 2. CIPP custom variable (only with AVD)

In CIPP: Settings → Custom Variables → for this tenant `FSLogixStorageAccount` = the name of the
storage account (without `.file.core.windows.net`). CIPP replaces `%FSLogixStorageAccount%` in
`AVD FSLogix Profile Containers` and `AVD Defender FSLogix Exclusions` on every deployment.
**Without the variable** the token stays in the path literally, and with `PreventLoginWithFailure`
nobody can sign in to the host. A tenant without AVD does not need the variable: the policies only
land on multi-session hosts.

### 3. Templates and baseline in CIPP

1. Sync the templates: the repo link fetches `IntuneTemplate/`. Check under Tenant Administration →
   Templates that the packages with `-Physical` and `-AVD` are there.
2. Import the baselines: **Tools → Community Repos → this repo → `BaselineTemplate/Baseline.json`
   → Import**, and likewise `Windows-Updates.json`. The automatic sync does not do this. A
   re-import updates an existing baseline.
3. Check in the baseline editor that `Baseline-Devices-Physical`, `-Users-Physical` and
   `-Devices-AVD` are in stage 1 and `Baseline-Pilot-Physical` in stage 2, each with its filter and
   *Include*.

### 4. Assign stage 1

Assign the baseline (and `[Baseline] - Windows Updates`) to the tenant. Stage 1 deploys right
away: the shared packages, the class packages and the group packages. `remediate` is on, and
`verifyAssignments` also checks the filter on every run.

### 5. Check

Per device in Intune (Devices → the device → Device configuration):

- every policy *Succeeded* or *Not applicable*, **no *Conflict***;
- a physical PC has the `-Physical` policies (BitLocker, Windows Hello, Storage Sense) and no
  `AVD …` policies; a session host the other way round;
- compliant under *Compliance*, and in Entra ID as well.

A policy shows the filter and its result per assignment (*Filter evaluation*). `check-scope.js` has
already checked beforehand that nothing clashes within a class (see
[AVD.en.md](AVD.en.md#conflict-check-per-class)); a Conflict in the tenant therefore comes from
something outside the baseline, usually an old policy.

### 6. Stage 2: the pilot

CIPP moves on to stage 2 once everything in stage 1 is compliant **and** two weeks have passed.
`Baseline-Pilot` and `Baseline-Pilot-Physical` then go to `SEC-Baseline-Pilot`. Grow the pilot
through the group, not with an extra stage.

### 7. Stage 3 by hand

`Baseline-Wacht` is not assigned: those policies wait for something CIPP does not measure (first
phone enrolment, a collector, a tenant id). Move the stage on once the prerequisite is there; per
policy the prerequisite is in `faseWaarom` and in
[COMPLIANCE.en.md](COMPLIANCE.en.md).

## Migrating from an old set

Example: the test tenant `kanon` has the old `[Baseline] X` policies (e.g. `[Baseline] Bitlocker`)
on *All devices* without a filter, with hand-set exclude filters `WIN - AVD Multi-session` on
Bitlocker, Device Lock, Windows Hello For Business, `Windows 11 Update` and Office Updates.

1. **Rename instead of putting next to it.** `.\scripts\Rename-BaselinePolicy.ps1 -WhatIf`, then
   without. The script looks up every `previousNames` from [`_renames.json`](../IntuneTemplate/_renames.json)
   and sets the current name (PATCH: id and assignments stay). `replace` and `retire` it only
   reports. For example `[Baseline] Office Updates` is `replace` (ADMX → Settings Catalog): the old
   one has to go once the new one is in place. `[Baseline] Windows Hello For Business` is not in
   `_renames.json`; find out by hand which new policy replaces it.
2. **Create the filters** (step 1) and **assign the baseline** (step 4). CIPP finds the renamed
   policies by name, aligns the content and replaces the assignment with the package's:
   `verifyAssignments` manages the assignment, so the old *All devices without filter* becomes
   *All devices with include `WIN - Physical`*.
3. **Clean up the hand-set exclude filters.** On the renamed policies they disappear in step 2 by
   themselves (CIPP replaces the assignment). On old policies that were not renamed (`replace`,
   `retire`, or not in `_renames.json`) they are still there: unassign those policies, and delete
   them only once the new ones show *Succeeded* per device.
4. **Without CIPP**: `Set-BaselineAssignment.ps1 -AllDevices -Replace -WhatIf` and
   `-AllUsers -Replace -WhatIf`. `-Replace` replaces *all* assignments of a policy — groups and
   exclusions too; without `-Replace` the old assignment without filter stays and the script warns.

## AVD specifics

See [AVD.en.md](AVD.en.md) for the classification per policy, the FSLogix approach and the rollout
plan. In short:

- **Compliance on the device too.** User-targeted compliance does not work on multi-session;
  assign the compliance policies multi-session supports *also* to `SEC-AVD-Session-Hosts`. CIPP
  manages the assignment of `Baseline-Users` and removes such an extra assignment on a run — check
  after every run until this is in the pipeline (open point in AVD.en.md).
- **Force a sync on a multi-session host**: `deviceenroller.exe /o <enrollment-ID> /c /b` (the
  enrollment ID is under `HKLM\SOFTWARE\Microsoft\Enrollments`). The scheduled task *PushLaunch*
  does not exist there.
- **Keeping profiles small.** `AVD Session Host` turns Storage Sense on daily inside the container
  (OneDrive online-only after 7 days, recycle bin 14, Downloads 30), and FSLogix compacts the
  container at every sign-out (`VHD Compact Disk`). No more weekly FSLShrink; only as an emergency
  measure for containers that are already large, once and with the hosts in drain mode. See
  [AVD.en.md](AVD.en.md#keeping-profiles-small-storage-sense-and-compaction).
- **FSLogix: Intune and the host script.** The host script `configure-fslogix.ps1` sets the values
  at deployment, so the first sign-in works before Intune reaches the host; the Intune policy keeps
  them in place afterwards. Both write the same registry values.
- **Host pool for external users**: `AVD Session Host` and `Cloud PC External Access` clash there on
  two session limits — open point in AVD.en.md.

## Checklist

- [ ] Filters `WIN - Physical` and `WIN - AVD Multi-session` exist, name exact, *Preview* right.
- [ ] With AVD: custom variable `FSLogixStorageAccount` set for this tenant.
- [ ] Groups `SEC-Baseline-Pilot` and the `faseGroep` groups in use exist; with AVD also `SEC-AVD-Session-Hosts`.
- [ ] Tenant settings: not compliant without a policy, Defender connector on.
- [ ] `Baseline.json` and `Windows-Updates.json` imported with the button, tenant assigned.
- [ ] Old policies renamed (`Rename-BaselinePolicy.ps1`), `replace`/`retire` handled by hand.
- [ ] One device per class checked: no Conflict, compliant.
- [ ] With AVD: compliance device assignment in place, sign-in with a passkey without prompt, FSLogix attaches.
- [ ] After two weeks: stage 2 active, pilot devices checked.

## Troubleshooting

| Symptom | Cause | What to do |
|---|---|---|
| *Conflict* on a setting | two policies set it differently on the same device — nearly always an old policy next to the new one | Opening the setting in Intune shows both policies. Unassign the old policy; with two baseline policies `check-scope.js` has a gap: report it. |
| *Not applicable* on a session host | Device Configuration templates and part of compliance do not work on multi-session | Expected for the policies in AVD.en.md; only a problem for a Settings Catalog policy. |
| Physical policy on a session host, or an AVD policy nowhere | the filter did not exist at the CIPP run (CIPP then assigns without filter) or the name differs | CIPP log for *No assignment filter found*; create the filter with the exact name, run the baseline again. |
| Filter does not match what you expect | rule or device property other than assumed (model, SKU) | *Preview devices* on the filter; per device the *Filter evaluation* tab. |
| A hand-set filter or extra group disappears | CIPP `verifyAssignments` manages the package's assignment and puts it back | That is intended: change the package in the repo (class, phase) instead of the tenant. |
| Session host does not check in with Intune | no PushLaunch on multi-session | `deviceenroller.exe /o <enrollment-ID> /c /b` on the host. |
| Nobody can sign in to an AVD host | `%FSLogixStorageAccount%` not replaced, share unreachable or Kerberos ticket failing | Check the variable in CIPP; `klist`, `frx list-redirects`; the storage account app excluded from MFA. |
