[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/macos/enrollment-restriction/

Advice and template: do not let personal Macs enrol in Intune.

An enrollment restriction (`deviceEnrollmentPlatformRestrictionConfiguration`) is none of the
five CIPP policy types and lives under `deviceManagement/deviceEnrollmentConfigurations`. Not
picked up by the pipelines, no `checkId`.

| File | What it is |
|---|---|
| `macos-block-personal.json` | Graph body: macOS platform allowed, personal ownership blocked |

## Advice

**Block personal Macs** as soon as all corporate Macs come in via Apple Business (ADE) or
their serial number is in Intune as a corporate identifier.

Why:

- The macOS baseline is built for corporate Macs. A personal Mac that enrols via Company
  Portal gets FileVault escrow, Platform SSO, Restrictions and Defender imposed on
  a device the organisation does not own — with a privacy and GDPR question
  (A.5.34) that nobody has answered.
- Much of the security in this baseline only works **supervised** (ADE): Recovery Lock, the
  declarative update and disk management settings, `allowUIConfigurationProfileInstallation`. A
  manually enrolled Mac is not supervised and silently falls outside those, while it
  can still become compliant and therefore get access.
- The user can remove a manually enrolled Mac from management themselves; an ADE Mac with
  locked enrollment cannot be (see `enrollment/macos/`).

Intune treats a Mac as **personally owned** by default. It is corporate-owned only if
it (Microsoft Learn, *Overview of enrollment restrictions*, "Blocking personal Macs"):

- was enrolled via Apple Automated Device Enrollment (ADE), or
- is registered with its serial number as a corporate identifier.

What then happens to a personal Mac: no enrollment. Access to M365 is handled by
Conditional Access — web access via Edge with app-enforced restrictions, or nothing. The baseline in
`CA-policies` decides that; this restriction changes nothing there.

**Note, as Microsoft puts it:** "Enrollment restrictions are not security features.
Compromised devices can misrepresent their character." This prevents accidental enrollment; the
real gate is Conditional Access with *require compliant device*.

When *not* to block: if the organisation deliberately manages personal Macs (BYOD with full
enrollment). That calls for its own, lighter set of policies — the corporate baseline is then
not the right one.

## Deploying

Preparation: first add existing Macs that did *not* come in via ADE by serial number under
Devices → Enrollment → Corporate device identifiers. Otherwise such a Mac cannot come back
after a wipe.

1. Intune → Devices → Device onboarding → Enrollment → **Device platform restriction** → macOS →
   Create restriction, or via Graph:

   ```powershell
   Connect-MgGraph -Scopes DeviceManagementServiceConfig.ReadWrite.All
   $body = Get-Content .\macos-block-personal.json -Raw
   $r = Invoke-MgGraphRequest -Method POST `
       -Uri "https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations" `
       -Body $body -ContentType "application/json"
   ```

2. Assign to a **user group** (enrollment restrictions apply to the user who
   enrols):

   ```powershell
   $assign = @{ enrollmentConfigurationAssignments = @(@{
       target = @{ "@odata.type" = "#microsoft.graph.groupAssignmentTarget"; groupId = "GROEP-ID-INVULLEN" } }) } | ConvertTo-Json -Depth 5
   Invoke-MgGraphRequest -Method POST `
       -Uri "https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations/$($r.id)/assign" `
       -Body $assign -ContentType "application/json"
   ```

   Or: modify the **default restriction** (All users, lowest priority) and set macOS
   personally owned to Block there — then it applies to everyone without a separate assignment.

3. Test with a test account on an unregistered Mac: Company Portal must refuse the
   enrollment.

Limitation from the same Microsoft page: userless ADE (without user affinity) always gets
the **default** restriction, not an assigned restriction. The ADE profiles in this baseline
use user affinity, so that does not affect them — but an ADE Mac is corporate-owned anyway.

## Standards

A.5.9 Inventory of information and other associated assets, A.8.1
User endpoint devices; NIS2 art. 21(2)(i); CIS Controls v8.1 1.1 Establish and
Maintain Detailed Enterprise Asset Inventory and 1.2 Address Unauthorized Assets; NIST CSF 2.0
ID.AM-01.
