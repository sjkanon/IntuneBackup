[Nederlands](README.md) · **English** · [Français](README.fr.md)

# macOS ADE enrollment profiles

Apple Automated Device Enrollment profiles (`depMacOSEnrollmentProfile`) live **outside**
`IntuneTemplate/`. The pipelines there know five CIPP policy types and an enrollment profile is
none of those five: it sits under an ABM token
(`depOnboardingSettings/{id}/enrollmentProfiles`), does not go through the "Import profile" button, and
has no settings the baseline engine can assess. A file here is therefore **not**
picked up by `generate-baseline.js`, `export-intunebackup.js` or `Set-BaselineAssignment.ps1`.
Deployment goes via `scripts/New-MacOSEnrollmentPolicy.ps1`.

| File | Token | Default profile |
|---|---|---|
| `macOS-Corporate-ADE-Baseline.json` | `ADE-TOKEN-NAAM` | yes (`isDefault: true`) |

`isDefault: true` means that every device syncing from Apple Business under this token gets this
profile. That is deliberate — Microsoft recommends having a default profile as soon as possible,
because a synced device without a profile that is switched on fails enrollment.

## The schema is flat

`depMacOSEnrollmentProfile` has **no** nested `managementSettings` / `accountSettings` /
`setupAssistant` objects. All properties are at the top level, and Graph does not accept
unknown names. Documentation fields (`_meta`, `_recommendations`, `changeLog`) therefore belong in
this file, not in the JSON.

## Why these values

### Management settings — four that belong together

| Property | Value | UI label |
|---|---|---|
| `requiresUserAuthentication` | `true` | Enroll with user affinity |
| `enableAuthenticationViaCompanyPortal` + `configurationWebUrl` | both `true` | Setup Assistant with modern authentication |
| `waitForDeviceConfiguredConfirmation` | `true` | Await final configuration |
| `profileRemovalDisabled` | `true` | Locked enrollment |

`profileRemovalDisabled` is **irreversible** after enrollment — changing it requires a wipe.
`waitForDeviceConfiguredConfirmation` is enforced anyway as soon as you configure local accounts,
even if you were to turn it off.

### Accounts

`mdmadmin` is LAPS-managed: Intune generates a random 15-character password and
stores it encrypted. That is why `adminAccountPassword` is not in here. Rotation every 14 days
is a choice; the Intune default is six months.

Open, not solved by this file:

- **Rotation does not restrict reading.** Who may retrieve the escrowed password is controlled with
  RBAC/PIM, not here. Check who holds that role.
- **`mdmadmin` is predictable tenant-wide.** For an administrator with multiple customers, a
  name per customer (`<prefix>-<customercode>-adm`) is better.
- **`supportPhoneNumber` is set to `SERVICEDESK-TELEFOON-INVULLEN`.** The user sees that
  number during setup; fill it in per organisation before you create the profile.
- **Check that escrow is enabled** under Devices → macOS → Local admin password, otherwise
  the password does rotate but cannot be retrieved.

The primary account is `setPrimarySetupAccountAsRegularUser: true` — a **standard** account,
not admin. That is fine because `mdmadmin` fills the admin role; macOS requires at least one admin account.

The two prefill fields accept different variables:

| Property | Allowed |
|---|---|
| `primaryAccountUserName` | `{{partialupn}}` · `{{serialNumber}}` · `{{managedDeviceName}}` · `{{OnPremisesSamAccountName}}` |
| `primaryAccountFullName` | `{{username}}` · `{{serialNumber}}` · `{{OnPremisesSamAccountName}}` |

### Setup Assistant screens

`true` = hidden. Left visible:

| Screen | Why |
|---|---|
| Location Services | needed for the time zone |
| Touch ID | users want it, and it supports Platform SSO with Secure Enclave |
| Accessibility | hiding it turns off VoiceOver during setup — see below |
| Appearance / Choose your Look | harmless, one click |

Two screens are hidden because the baseline already enforces that setting — do not let the user
choose what is policy:

| Screen | Enforced by |
|---|---|
| FileVault | `Baseline_MAC_D_FileVault` |
| iCloud Storage (Desktop & Documents) | `Baseline_MAC_U_Microsoft_OneDrive_KFM` |

The rest is consumer noise on a corporate Mac.

## New panes: `enabledSkipKeys`

Wallpaper, Lockdown mode, Intelligence, Terms of Address, Software update and OS Showcase have
**no property of their own** in the Graph schema. They go through `enabledSkipKeys` using Apple's
SkipKeys names, taken from
[apple/device-management → other/skipkeys.yaml](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
(22 of the 51 keys apply to macOS):

| SkipKey | macOS from | Screen | Here |
|---|---|---|---|
| `SoftwareUpdate` | 15.4 | automatic software update | hidden |
| `UpdateCompleted` | 26.1 | Software Update Complete | hidden |
| `EnableLockdownMode` | 14.0 | Lockdown Mode | hidden |
| `Intelligence` | 15.0 | Apple Intelligence | hidden |
| `TermsOfAddress` | 13.0 | form of address | hidden |
| `OSShowcase` | 26.1 | OS Showcase | hidden |
| `Wallpaper` | 14.1 | wallpaper | hidden |
| `AppStore` | 11.1 | App Store | visible |
| `Appearance` | 10.14 | Choose your Look | visible |
| `Welcome` | 15.0 | Get Started | visible |

Do **not** put keys here that already have their own property (`Accessibility`, `Biometric`,
`DisplayTone`, `FileVault`, `iCloudDiagnostics`, `iCloudStorage`, `Location`, `Payment`,
`Privacy`, `ScreenTime`, `Siri`, `UnlockWithWatch`) — you would then configure the same screen twice.

These names come from Apple; that Intune passes them through one-to-one is plausible but not tested
by me. Verify with `-Export` after you have set one of these screens in the portal.

## Three decisions you can still reverse

**1. Apple ID hidden.** IntuneIRL keeps this screen visible because Managed Apple Accounts tie their
sign-in to the PSSO token; the ADE guide by MBaranekTech hides it instead, to avoid getting a
personal Apple ID on corporate hardware. Here it is **hidden**. If you use Managed
Apple Accounts, set `appleIdDisabled` to `false`.

**2. Accessibility visible.** Microsoft documents that hiding it makes VoiceOver unusable
during setup; the ADE guide calls that an accessibility risk. That is why it is
visible here, even though the proposal we received had it hidden. If you still want it gone:
`accessibilityScreenDisabled: true`.

**3. The primary account is created in advance.** That works on macOS 14, 15 and 26 and is what is
in the tenant now. If you are going to use Platform SSO during Setup Assistant, PSSO creates the
account itself via `EnableCreateUserAtLogin` and creating it in advance is redundant:

```jsonc
"skipPrimarySetupAccountCreation": true,
"dontAutoPopulatePrimaryAccountInfo": true
// and omit primaryAccountUserName / primaryAccountFullName
```

Only do that once the three PSSO prerequisites are in place (macOS 26+, Company Portal 5.2604+ as an LOB app,
and `Enable Registration During Setup` in `Baseline_MAC_D_Platform_SSO.json`). Without those three
you end up with a Mac that has only a hidden admin account.

## Aligning with Platform SSO

`Baseline_MAC_D_Platform_SSO.json` sets `TokenToUserMapping → AccountName = preferred_username`,
which yields the **full UPN**. This profile already creates an account with `{{partialupn}}`, the
**short** name. Those two do not point to the same string. Test on one Mac whether you get one account
or two.

`usePlatformSSODuringSetupAssistant` is set to `false`. Graph literally documents: *"This
value cannot be TRUE when configurationWebUrl is TRUE."* — and `configurationWebUrl` is exactly
what turns on modern authentication. If you want that route, build that profile in the portal and
export the result to here. The script blocks the wrong combination before the POST.

## Usage

```powershell
# What would happen
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Path .\enrollment\macos\macOS-Corporate-ADE-Baseline.json -WhatIf

# Create
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Path .\enrollment\macos\macOS-Corporate-ADE-Baseline.json

# Retrieve an existing profile as JSON (to capture manual work done in the portal)
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName ADE-TOKEN-NAAM -Export -OutDir .\enrollment\macos
```

A dynamic Entra group on the profile name saves manual work when assigning apps and
policies (not the enrollment profile itself — that goes per serial number under the token):

```
(device.deviceOSType -eq "MacMMP") and
(device.enrollmentProfileName -eq "macOS Corporate ADE Baseline")
```

Assignment remains manual work in the portal: **Enrollment program tokens → token → Devices →
Assign policy**, or **Set Default Policy**.

## Changes

| Date | Change | Reason |
|---|---|---|
| 2026-08-18 | `diagnosticsDisabled`: false → true | data minimisation (GDPR); no opt-in for Apple diagnostics |
| 2026-08-18 | `SoftwareUpdate` + `UpdateCompleted` to `enabledSkipKeys` | update cadence belongs with central Intune update policy, not with the user during OOBE |
| 2026-08-18 | `appleIdDisabled`: false → true | no personal Apple ID on corporate hardware |
| 2026-08-18 | `enabledSkipKeys` filled from Apple's schema | Lockdown mode, Intelligence, Terms of Address, OS Showcase, Wallpaper have no property of their own |

Hiding `Intelligence` only skips the opt-in screen — it does not block the feature.
If Apple Intelligence really has to be off, that is a separate settings catalog policy.

## Sources

- [Set up automated device enrollment (ADE) for macOS](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/setup-automated-macos)
- [depMacOSEnrollmentProfile — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-enrollment-depmacosenrollmentprofile?view=graph-rest-beta)
- [Apple SkipKeys — apple/device-management](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
- [Add Platform SSO policy to ADE Profile on macOS devices](https://learn.microsoft.com/en-us/intune/device-configuration/settings-catalog/configure-platform-sso-during-enrollment)

## Company Portal asks for setup while the Mac is already enrolled

`requiresUserAuthentication`, `enableAuthenticationViaCompanyPortal` and `configurationWebUrl`
are all three set to `true` — *Setup Assistant with modern authentication*. The Mac enrolls
during Setup Assistant, and Company Portal then completes the user affinity. That the
portal asks for setup because of this is normal in itself.

**But it sometimes keeps asking long after enrollment is complete.** On a test Mac
everything was in order and the portal still showed *Install management profile*. So first check
what is actually there, before you touch that button:

```bash
profiles status -type enrollment
ls -ld "/Library/Intune/Microsoft Intune Agent.app"
```

If it says `Enrolled via DEP: Yes` with `MDM enrollment: Yes (User Approved)` and the agent is present,
enrollment is done and the prompt is meaningless. **Do not click *Download profile* then.**
That starts the manual enrollment flow on a Mac that is already managed, and that produces a second
device record with two MDM channels working against each other.

If something is missing, that is the first thing to fix, not the script:

- Without completed enrollment the **Microsoft Intune management agent** does not install, and it
  is required for every shell script.
- Without user affinity, everything tied to a **user group** stays stuck.

In the portal both cases look like `Result: NotRun`, which sounds like "wait a bit
longer" while structurally nothing is going to happen. That is why those two commands come before any
script diagnosis.

If everything is in order and it still says `NotRun`, you simply wait for the agent: it fetches scripts
**every 8 hours**, independently of the MDM sync.

Like the click for screen recording (see [`shellscripts/macos/`](../../shellscripts/macos/README.en.md)),
user affinity is a per-Mac action that no policy can take over. Both belong in the
handover of a new device.
