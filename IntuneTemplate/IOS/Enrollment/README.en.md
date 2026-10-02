[Nederlands](README.md) · **English** · [Français](README.fr.md)

# iOS/iPadOS enrollment: ADE profile, groups and Apple Business

`iOS-Corporate-ADE-Baseline.json` is a `depIOSEnrollmentProfile` (Graph beta). Like the
[macOS ADE profile](../../MAC/Enrollment/ade-profile/README.en.md) it is none of the five CIPP
policy types: it hangs under an ADE token (`depOnboardingSettings/{id}/enrollmentProfiles`) and
so is not deployed through a CIPP package.

## Why not a Settings Catalog template

Intune also has a catalog form (`enrollmentConfiguration`, template
`27d20e9c-50c1-48f8-a44c-f37de4510051_1`, platform iOS). Its settingDefinitionIds
exist (`ade_useraffinity`, `ade_authenticationmethod`, `ade_lockedenrollment`,
`ade_modernauth_awaitfinalconfiguration`, `ade_appledevicenametemplate`,
`ade_setupassistant_*` — verified in pl4nty DCv2), but a template policy also requires a
`settingInstanceTemplateId` and `settingValueTemplateId` per setting. Those are not in
pl4nty (the template file contains only metadata) nor in any of the sources. Inventing them
yields a policy that Graph rejects or — worse — that sets different screens than intended. If
you want the catalog form: build the profile once in the portal with the values below and
export it (`GET deviceManagement/configurationPolicies/{id}?$expand=settings`).

## Deploying

`scripts/New-MacOSEnrollmentPolicy.ps1` rejects this file: it checks for
`#microsoft.graph.depMacOSEnrollmentProfile`. Until there is an iOS variant, use Graph:

```powershell
Connect-MgGraph -Scopes DeviceManagementServiceConfig.ReadWrite.All
$token = (Invoke-MgGraphRequest GET 'https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings').value |
  Where-Object tokenName -eq 'ADE-TOKEN-NAAM'
$body = Get-Content .\iOS-Corporate-ADE-Baseline.json -Raw   # fill in the placeholders first
Invoke-MgGraphRequest POST "https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings/$($token.id)/enrollmentProfiles" -Body $body -ContentType 'application/json'
```

Fill in before the POST:

| Placeholder | Where from |
|---|---|
| `VPP-TOKEN-ID-INVULLEN` | id of the VPP token (`GET beta/deviceAppManagement/vppTokens`) under which Company Portal was bought with device licences |
| `SERVICEDESK-TELEFOON-INVULLEN` | service desk number — the user sees it during setup and under Settings → General → About |

## Why these values

Largely identical to the UniFy Corporate Deployment Guide v1.2 §7.2–7.3 and to the
macOS profile in this repo.

| Property | Value | Why |
|---|---|---|
| `requiresUserAuthentication` + `configurationWebUrl` + `enableAuthenticationViaCompanyPortal` | `true` | *Setup Assistant with modern authentication*: Entra registration and MFA before the home screen. Same combination as the macOS profile; verify with an export of a portal profile if Graph returns it differently |
| `supervisedModeEnabled` | `true` | prerequisite for `IOS - D - Restrictions Corporate`, `Lock Screen`, the Defender content filter and automatic updates |
| `profileRemovalDisabled` | `true` | locked enrollment. **Irreversible** without a wipe |
| `awaitDeviceConfiguredConfirmation` / `waitForDeviceConfiguredConfirmation` | `true` | the device stays in Setup Assistant until the first policies are there — no corporate device without a passcode on the home screen |
| `iTunesPairingMode` | `disallow` | no sync with Finder/iTunes; USB data access and sideloading closed |
| `deviceNameTemplate` | `{{DEVICETYPE}}-{{SERIAL}}` | predictable inventory name, no personal name in AirDrop/Bluetooth |
| `supportDepartment` | `IT Servicedesk` | same as the macOS profile |
| `isDefault` | `true` | every serial number under this token gets this profile; a synced device without a profile fails at activation |

Screens (`true` = hidden). Left visible: **Location Services** (time zone and
per-app permissions), **Touch ID/Face ID** (biometrics immediately usable for Authenticator
and app PIN), **Software Update** and **Update Completed** (device starts on a current version),
**language/region**. Hidden: **Passcode** — Microsoft documents that the screen does not work
reliably from iOS 14.5 onwards; the requirement comes from `IOS - D - Passcode` after Setup Assistant completes.
**Restore** and **Device to Device Migration** — a corporate device starts clean, not from
a private backup. **Apple ID** — no private Apple Account on corporate hardware. If you use
Managed Apple Accounts (federation, see `../README.md`), set `appleIdDisabled` to `false`.

`enabledSkipKeys` contains the screens without their own Graph property, with Apple's names from
[apple/device-management `other/skipkeys.yaml`](https://github.com/apple/device-management/blob/release/other/skipkeys.yaml)
(all eleven documented there for iOS): `ActionButton` (17.0), `AppStore` (14.3),
`CameraButton` (18.0), `EnableLockdownMode` (17.1), `Intelligence` (18.0), `Multitasking`
(26.0), `OSShowcase` (26.0), `Safety` (16.0), `SafetyAndHandling` (18.4), `TermsOfAddress`
(16.0), `WebContentFiltering` (18.2). That Intune passes them through one-to-one is plausible but
not tested; check with a GET after creation.

Not set: `enrollmentTimeAzureAdGroupIds` (tenant GUID; Enrollment Time Grouping can be done
afterwards in the portal), `carrierActivationUrl`, Shared iPad and shared device mode fields
(different scenario).

## Three kinds of device, three levels of protection

| Kind | How it comes in | What the baseline delivers |
|---|---|---|
| **Not enrolled** (MAM) | User installs Outlook/Teams from the App Store | `IOS - U - App Protection` (phase 1) — the only layer |
| **Personally enrolled** | Company Portal (web-based device enrollment) or account-driven user enrollment | App Protection + compliance + `Data Protection`, `Passcode`, `Enterprise SSO`, `Software Updates` (deadline), Defender via VPN |
| **Corporate (ADE, supervised)** | Serial number in Apple Business, profile below | everything above + `Restrictions Corporate`, `Lock Screen`, Defender via content filter, automatic updates |

## Groups

Two phase 4 groups in the manifest. Create them as dynamic device groups in Entra ID:

| Group | Rule |
|---|---|
| `SEC-iOS-Corporate` | `(device.deviceOSType -in ["iPhone","iPad"]) -and (device.deviceOwnership -eq "Company")` |
| `SEC-iOS-BYOD` | `(device.deviceOSType -in ["iPhone","iPad"]) -and (device.deviceOwnership -eq "Personal")` |

Intune marks an ADE device as *Company*. Before assigning, check that there are no
non-supervised devices manually marked as *Company*: they would receive the
supervised-only policies (which iOS then ignores) and no Defender VPN. If you want it tighter,
use `device.enrollmentProfileName -eq "iOS Corporate ADE Baseline"` for `SEC-iOS-Corporate`.

## Apple Business (formerly Apple Business Manager)

Once per tenant, outside Intune:

1. **Tokens and certificates — renew all three every year.**
   - *Apple MDM Push certificate* (Intune → Devices → iOS/iPadOS → Enrollment). Renew with
     the **same** managed Apple Account it was created with; a new certificate
     under a different account forces every enrolled device to enrol again. Use a
     functional account, not a personal one.
   - *ADE token* (Enrollment program tokens). Expires after a year; after that Intune no longer
     syncs new serial numbers.
   - *VPP/content token* (Tenant administration → Connectors → Apple VPP tokens). Expires after
     a year; after that VPP apps are no longer updated or installed.
   Set a reminder 30 days before expiry on all three, and make renewal part of the
   management process (ISO 27001 A.5.37 documented operating procedures).
2. **MDM server.** Create an MDM server for Intune in Apple Business and assign new purchases to it
   by default (Preferences → Default device assignment), so a new device does not
   first have to be assigned manually.
3. **Federate Managed Apple Accounts with Entra ID.** Apple Business → Preferences → Accounts:
   verify the domain and turn on *federated authentication* with Microsoft Entra ID. Users
   then sign in with their work account instead of a separate Apple password, and
   a user removed from Entra also loses their Managed Apple Account.
4. **Managed Apple Accounts only on managed devices.** In the account settings, restrict
   where a Managed Apple Account may sign in to devices the organisation manages
   (supervised). That keeps iCloud data from the work account off a private iPad.
   Check the exact name of the option in the current Apple Business interface; Apple has
   rearranged it several times in 2025–2026.
5. **Company Portal and Microsoft Authenticator via VPP.** Buy both (free) in Apple
   Business → Apps and Books with **device licences**, sync the VPP token, and assign them
   in Intune as *required* to `SEC-iOS-Corporate`. Device licences install without an
   Apple Account. Authenticator is a prerequisite for `IOS - D - Enterprise SSO`; Company Portal
   is installed by the enrollment profile itself (`companyPortalVppTokenId`) — do not create
   a second assignment for it, or the user gets a sign-in prompt. Do the same for
   Microsoft Defender if Defender for Endpoint is in use.

## Intune tenant settings

- **iOS/iPadOS enrollment restriction** (Devices → Enrollment → Device platform restriction):
  allowing or blocking personally enrolled devices is an organisational decision. If you want BYOD only
  via App Protection, block *Personally owned* — then `SEC-iOS-BYOD` and the VPN variant
  of Defender are unnecessary.
- **Defender for Endpoint connector** (Endpoint security → Microsoft Defender for Endpoint):
  *Connect iOS/iPadOS devices* on, and for the MAM route also *Connect iOS/iPadOS devices to
  Microsoft Defender for Endpoint for App Protection Policy evaluation*. Prerequisite for
  `IOS - U - Compliance Defender for Endpoint`.
- **Apple Configurator/host pairing**: the enrollment profile sets `iTunesPairingMode` to
  `disallow`. If you use Apple Configurator, set it to `requiresCertificate` and add the
  certificate.
