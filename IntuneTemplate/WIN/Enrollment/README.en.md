[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Windows Autopilot: classic and device preparation

Two ways to set up a new Windows PC during OOBE. Both can exist side by side in one tenant, but
**any one device only ever runs one of them**. Neither is one of the five CIPP template types,
so they are not deployed through a CIPP package. CIPP does have three *standards* for
them; see [Deploying](#deploying).

| File | What | Variant |
|---|---|---|
| [`WIN-Autopilot-Deployment-Profile.json`](WIN-Autopilot-Deployment-Profile.json) | deployment profile (`azureADWindowsAutopilotDeploymentProfile`) | classic (v1) |
| [`WIN-Autopilot-Enrollment-Status-Page.json`](WIN-Autopilot-Enrollment-Status-Page.json) | Enrollment Status Page (`windows10EnrollmentCompletionPageConfiguration`) | classic (v1) |
| [`WIN-Autopilot-Device-Preparation.json`](WIN-Autopilot-Device-Preparation.json) | device preparation policy (settings catalog, template `80d33118-…_1`) | device preparation (v2) |
| [`../../../scripts/New-WindowsAutopilotPolicy.ps1`](../../../scripts/New-WindowsAutopilotPolicy.ps1) | creates any of the three from its JSON, handles the device group for v2, exports with `-Export` | both |

## Which variant

| Needed | Classic | Device preparation |
|---|:---:|:---:|
| Microsoft Entra join | ✅ | ✅ |
| Microsoft Entra **hybrid** join | ✅ | ❌ |
| Pre-provisioning (white glove), self-deploying (kiosk), Autopilot reset | ✅ | ❌ |
| Windows 10 | ✅ | ❌ |
| Register the device in advance (hardware hash) | required | not needed |
| Block the user phase until user apps and policies are in place | ✅ (user ESP) | ❌ |
| Win32 and LOB apps in the same deployment | ❌ | ✅ |
| Near real-time report, with logs on failure | ❌ | ✅ |
| Max. apps during OOBE | 100 (ESP) | 25 apps + 10 scripts |

**Which one wins.** If a device is registered as an Autopilot device, the classic profile runs,
unless the device is bound to the tenant through *device association*: then device preparation
wins. To use device preparation on a registered device without association, *deregister* it from
Autopilot first.

**Recommendation.** Device preparation for new, Entra-joined Windows 11 laptops that go straight to
the user. Keep classic for pre-provisioning by a partner, kiosk and meeting room devices, hybrid
join, and devices the supplier already registers. That is why `hardwareHashExtractionEnabled` is
`false` in the classic profile. Set to `true`, Intune registers every managed device in the
assigned group in Autopilot, and from then on such a device no longer gets device preparation.

## Prerequisites

For both:

- **Entra ID → Devices → Device settings → Users may join devices to Microsoft Entra**: *All*, or a
  group containing every user who sets up a PC themselves. Without it, OOBE stops at sign-in.
- **Windows automatic enrollment**: MDM user scope set to *All* or to that same group.
- A licence with Entra ID P1 and Intune (Business Premium, E3/E5, EMS) **assigned to the user**.
- **Company branding** in Entra ID. Without branding, *hide change account options* does nothing.
- [`Baseline_WIN_D_Enrollment_Hardening`](../SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.en.md)
  requires a network during OOBE. That suits both variants: neither works offline.
- **Personal Windows enrollment blocked?** An Autopilot-registered device counts as corporate
  automatically. Device preparation then needs *corporate identifiers* (manufacturer, model,
  serial number) or *device association*, otherwise the enrollment is refused.

Additionally for device preparation:

- Windows 11 24H2 or later, or 22H2/23H2 with KB5035942 (installation media from April 2024 or
  later). Check with the supplier which build ships on new devices.
- A **security group for devices** owned by the **Intune Provisioning Client** service principal
  (appId `f1346770-5b25-470b-88bd-d5744ab7952c`). In some tenants it is called *Intune Autopilot
  ConfidentialClient*; the appId is what counts. The script creates both with `-CreateDeviceGroup`.
- RBAC for whoever manages it: *Enrollment programs → Enrollment time device membership
  assignment* on top of the usual rights on device configurations.

## Classic: deployment profile + Enrollment Status Page

### Deployment profile

| Property | Value | Why |
|---|---|---|
| `displayName` | `CXNM Standard WIN Autopilot User Driven` | **No hyphens.** Intune only accepts letters, digits, spaces and `: " ? . @ $ & _ [ ] { } \| \` in a profile name. A hyphen gets a bare 500 with no reason. That is why this name departs from the `CXNM - Standard - …` convention. |
| `outOfBoxExperienceSetting.deviceUsageType` | `singleUser` | user-driven; `shared` is self-deploying and belongs in a separate kiosk profile |
| `outOfBoxExperienceSetting.userType` | `standard` | the user does not become a local admin; admin work goes through LAPS |
| `preprovisioningAllowed` | `true` | a partner or the service desk can pre-provision devices (Windows key 5× in OOBE). Does nothing if nobody uses it. |
| `hardwareHashExtractionEnabled` | `false` | see [Which variant](#which-variant) |
| `escapeLinkHidden` · `privacySettingsHidden` · `eulaHidden` | `true` | no consumer screens; privacy settings come from policy |
| `keyboardSelectionPageSkipped` | `false` | in Belgium, azerty-be, azerty-fr and qwerty vary per user. With a single layout, set this to `true` and `locale` to a fixed language. |
| `locale` | `os-default` | the language of the Windows image |
| `deviceNameTemplate` | empty | Windows keeps the name it picks itself. For a fixed name: at most **15 characters** after the macros expand (NetBIOS), `%SERIAL%` or `%RAND:x%`, for example `PFX-%RAND:6%`. The script refuses a template longer than 15 characters. |

Assign to a **device group** of registered devices. A dynamic group catches everything in
Autopilot:

```
(device.devicePhysicalIDs -any (_ -startsWith "[ZTDid]"))
```

Or only one group tag (for example for a second profile for kiosks):

```
(device.devicePhysicalIDs -any (_ -eq "[OrderID]:KIOSK"))
```

Registration goes through the supplier or reseller (partner ID in the Microsoft 365 admin center),
with `Get-WindowsAutopilotInfo -Online` on the device itself, or by CSV in **Devices → Enrollment →
Devices → Import**. CIPP can do it too: **Endpoint → Autopilot → Add Autopilot Device**.

### Enrollment Status Page

| Property | Value | Why |
|---|---|---|
| `trackInstallProgressForAutopilotOnly` | `true` | Autopilot only; a manual enrollment or an existing device gets no ESP |
| `showInstallationProgress` | `true` | without it there is no ESP |
| `selectedMobileAppIds` | empty | blocks on **all** apps assigned to the device. If that becomes too much, pick the essential apps. |
| `installProgressTimeoutInMinutes` | `90` | 60 is tight once the quality updates below run as well |
| `installQualityUpdates` | `true` | the device is patched before the user sees the desktop; costs 20 to 40 minutes and sometimes a restart |
| `allowDeviceUseOnInstallFailure` | `false` | no desktop without the baseline |
| `allowDeviceResetOnInstallFailure` · `allowLogCollectionOnInstallFailure` | `true` | the user can start over and hand logs to the service desk |
| `blockDeviceSetupRetryByUser` | `false` | retrying is allowed |
| `disableUserStatusTrackingAfterFirstUser` | `true` | only the first user waits for the user phase |
| `priority` | `1` | ignored in the POST. The script sets it afterwards with `setPriority`. |

Assign to the same device group as the profile. The default ESP (*All users and all devices*)
stays as it is.

**Restart between the device and user phase.** OIB assigns Device Guard and Credential Guard to
users to avoid a restart in the middle of Autopilot. Here they are device-scoped
([`Baseline_WIN_D_Device_Guard_and_Credential_Guard`](../SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.en.md)),
so expect one restart after the device phase. The user signs in again afterwards. That is not an
error. Do put it in the handover instructions.

## Device preparation (Autopilot v2)

How it works:

1. The user signs in during OOBE. Intune looks for the device preparation policy assigned to a
   **user group** of that user.
2. During enrollment the device joins the **device group** from the policy. That link does not go
   through the `devicesecuritygroupids` setting in the policy, because that text is only what the
   portal displays. It goes through the separate `setEnrollmentTimeDeviceMembershipTarget` action.
   A policy created only from the body therefore has **no** device group. The script calls that
   action.
3. During OOBE the device waits **only** for the apps and scripts you pick in the policy. They must
   *also* be assigned to the device group. Everything else (the baseline policies, other apps)
   arrives after the desktop, at the first sync. Since September 2026 the Intune Management
   Extension syncs right after OOBE.

| Setting | Value | Why |
|---|---|---|
| Deployment mode / type / join type | user-driven · single user · Entra join | the only options the setting definition knows (`_0`). CIPP also offers *hybrid* and *shared*, but those values do not exist. |
| User account type | Standard user | as in classic |
| Minutes allowed before showing installation error | `90` | room for 25 apps and the quality updates that have run during OOBE since 2025 |
| Allow users to skip setup after multiple attempts | No | no desktop without the selected apps |
| Show link to diagnostics | Yes | the user can hand over logs; the report also collects them itself on failure |
| Custom error message | trilingual | one field for all users |
| Device security group | empty | per tenant, through the script or the portal |
| Allowed applications / scripts | not in the file | app ids are per tenant. Add them in the portal once they are assigned to the device group. |

Candidates for the app list from this repo:
[`remove-mcafee`](../Apps/remove-mcafee/README.en.md) (before Defender becomes active),
Microsoft 365 Apps, Company Portal. [`winget-autoupdate`](../Apps/winget-autoupdate/README.en.md)
does not belong there: it deliberately skips its first run during OOBE.

After enrollment the policy name is in `enrollmentProfileName`. Use it for a dynamic group of
everything that came in through device preparation:

```
(device.enrollmentProfileName -eq "CXNM - Standard - WIN - Autopilot Device Preparation")
```

If you rename the policy, update this rule.

### Device association: what this file does not do yet

Since 27 August 2026, device preparation can bind a device to the tenant before enrollment
(*device association*). This uses TPM attestation and a marker in UEFI. It brings settings the
classic profile already had:

- language and keyboard
- hide the EULA and privacy screen
- hide change account options
- a device name template
- assignment to the device instead of the user
- the device counts as corporate automatically

Requirements: a physical device with TPM 2.0, Windows 11 24H2 or 25H2 with KB5120998, and access to
`ztd.dds.microsoft.com` and the `*.attest.azure.net` endpoints from the
[Microsoft documentation](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/requirements).

The settings catalog knows these settings (`enrollment_autopilot_dpp_language`, `_skipeula`,
`_skipexpress`, `_skipkeyboard`, `_forcedenrollment`, `_applydevicerenametemplate`, `_enablequ`,
`_enablecue`, `_allowedpolicyids`). They belong to a second template, `70d256b3-…_1`, with 18
settings. That template's `settingInstanceTemplateId`s are in no public source, and a template
policy without the right ids is refused. That is why this file uses the 12-setting template, which
CIPP, the terraform provider and two other baselines use identically.

If you want association: build the policy once in the portal, fetch it with
`New-WindowsAutopilotPolicy.ps1 -Export`, and put the result here (without group and app ids).

## Deploying

### Through CIPP

CIPP has a standard for all three (**Tenant → Standards → Intune Standards**). With these values
they match the files here:

| Standard | Setting | Value | Note |
|---|---|---|---|
| **Enable Autopilot Profile** | Profile Display Name | `CXNM Standard WIN Autopilot User Driven` | no hyphens; CIPP checks this |
| | Convert all targeted devices to Autopilot | **off** | **on** by default |
| | Enable Self-deploying Mode | **off** | **on** by default; on means a kiosk profile with no user |
| | Allow White Glove OOBE | on | |
| | Setup user as a standard user · Hide Terms · Hide Privacy · Hide Change Account | on | CIPP always turns Hide Change Account on |
| | Automatically configure keyboard | off | see above |
| | Assign to all devices | your choice | *All devices* only affects registered devices |
| **Enrollment Status Page settings** | Timeout · Install Windows quality updates | `90` · on | |
| | Show progress · Log collection · Only show during OOBE · Block device usage · Allow reset | on | |
| | Allow device use on failure | off | |
| **Deploy Device Prep Profile** | Profile Display Name | `CXNM - Standard - WIN - Autopilot Device Preparation` | |
| | Deployment Type · Join Type · Account Type | Single user · Microsoft Entra join · Standard user | *Shared* and *hybrid* do not exist in the definition |
| | Timeout · Allow skip · Allow diagnostics | `90` · off · on | |
| | Device Security Group Name · Create new group | the group name · on | CIPP creates it with the Intune Provisioning Client as owner |
| | Policy Assignment | Do not assign | assign to a user group in the portal; CIPP only offers *All users* |

Three differences from the script:

- The ESP standard edits the **default ESP** (*All users and all devices*, priority 0) instead of
  creating a separate ESP. With *Only show during OOBE* on, other enrollments do not notice.
- The device preparation standard puts **no apps or scripts** in the policy. When settings drift
  it **deletes** the policy and creates it again. Apps you picked in the portal afterwards are then
  gone. After the first deployment, set this standard to *Report* or *Alert*, not *Remediate*.
- CIPP overwrites changes made in the portal to the classic profile on its next run.

### Through the script

```powershell
# Classic
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Deployment-Profile.json -WhatIf
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Enrollment-Status-Page.json

# Device preparation, with device group (created if missing)
.\scripts\New-WindowsAutopilotPolicy.ps1 -Path .\IntuneTemplate\WIN\Enrollment\WIN-Autopilot-Device-Preparation.json `
    -DeviceGroupName 'WIN - Autopilot Device Preparation - Devices' -CreateDeviceGroup

# What is in the tenant, as JSON (including what was built in the portal)
.\scripts\New-WindowsAutopilotPolicy.ps1 -Export
```

The script refuses an object whose name already exists, and **does not assign**. A profile on the
wrong group changes how every new device is set up. That is why assigning happens in the portal:

- the profile and the ESP to the device group of registered devices;
- the device preparation policy to a **user group**.

## Phase

| Part | Phase | When to move on |
|---|---:|---|
| Classic profile + ESP | 2 | assign to a pilot group of registered devices; after a successful setup (including the restart), to the dynamic `[ZTDid]` group |
| Device preparation | 3 | waits for new devices with Windows 11 24H2+, the device group, and the decision which device stream stays classic |

Neither touches existing devices. They only apply at the next OOBE.

## Sources

- [Compare Windows Autopilot device preparation and Windows Autopilot](https://learn.microsoft.com/en-us/autopilot/device-preparation/compare)
- [Windows Autopilot device preparation requirements](https://learn.microsoft.com/en-us/autopilot/device-preparation/requirements)
- [What's new in Windows Autopilot device preparation](https://learn.microsoft.com/en-us/autopilot/device-preparation/whats-new)
- [Overview of Windows Autopilot device association](https://learn.microsoft.com/en-us/autopilot/device-preparation/device-association/overview)
- [windowsAutopilotDeploymentProfile — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-enrollment-windowsautopilotdeploymentprofile?view=graph-rest-beta)
- [windows10EnrollmentCompletionPageConfiguration — Graph beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-onboarding-windows10enrollmentcompletionpageconfiguration?view=graph-rest-beta)
- Setting definitions: [pl4nty/intune-change-tracking](https://github.com/pl4nty/intune-change-tracking), `DCv2/Settings/enrollment_autopilot_dpp_*.json`
- Template and instance ids: CIPP-API `Invoke-CIPPStandardDevicePrepProfile.ps1`, terraform-provider-microsoft365 `windows_autopilot_device_preparation_policy/constants.go`
