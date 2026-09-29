[Nederlands](README.md) · **English** · [Français](README.fr.md)

# iOS/iPadOS ADE enrollment profile

`iOS-Corporate-ADE-Baseline.json` is a `depIOSEnrollmentProfile` (Graph beta). Like
`enrollment/macos/` it lives outside `IntuneTemplate/`: it hangs under an ADE token
(`depOnboardingSettings/{id}/enrollmentProfiles`) and is none of the five CIPP types.

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
