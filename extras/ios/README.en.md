[Nederlands](README.md) · **English** · [Français](README.fr.md)

# iOS/iPadOS — what does not fit in `IntuneTemplate/`

The CIPP pipelines carry five policy types (Catalog, Device, compliance, App Protection,
Admin). A complete iOS baseline needs more: tenant settings in Apple Business,
an ADE enrollment profile, app configuration and two dynamic groups. Those live here. Nothing
in this folder is picked up by CIPP, `check-scope.js`, `export-intunebackup.js` or
`Set-BaselineAssignment.ps1`; deployment follows the README in each folder.

| Folder | What | Deploy |
|---|---|---|
| [`enrollment/`](enrollment/README.en.md) | `depIOSEnrollmentProfile` for corporate devices via ADE | Graph POST under the ADE token |
| [`app-configuration/`](app-configuration/README.en.md) | Outlook, Edge and Microsoft Defender — managed devices and managed apps | Graph POST or manually in the portal |

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
