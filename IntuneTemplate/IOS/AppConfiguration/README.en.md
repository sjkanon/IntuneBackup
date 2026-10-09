[Nederlands](README.md) · **English** · [Français](README.fr.md)

# iOS/iPadOS app configuration

Six Graph bodies, two per app, and two for Windows App (at the bottom). App configuration is not a CIPP type and therefore lives here.

| File | Graph type | Endpoint (beta) | For |
|---|---|---|---|
| `outlook-managed-devices.json` | `iosMobileAppConfiguration` | `deviceAppManagement/mobileAppConfigurations` | enrolled devices |
| `outlook-managed-apps.json` | `targetedManagedAppConfiguration` | `deviceAppManagement/targetedManagedAppConfigurations` | any device (MAM) |
| `edge-managed-devices.json` | `iosMobileAppConfiguration` | same | enrolled |
| `edge-managed-apps.json` | `targetedManagedAppConfiguration` | same | any device |
| `defender-managed-devices.json` | `iosMobileAppConfiguration` | same | enrolled |
| `defender-managed-apps.json` | `targetedManagedAppConfiguration` | same | any device |

## Deploying

**Managed devices.** Replace `APP-ID-OUTLOOK-INVULLEN`, `APP-ID-EDGE-INVULLEN` and
`APP-ID-DEFENDER-INVULLEN` with the Intune app id (`GET beta/deviceAppManagement/mobileApps`
— the VPP or store app you assign to the devices), POST the body, and assign it to the
users or devices that get the app. An app that exists both as a VPP app and as a store app
has two ids: configure both or pick one.

**Managed apps.** POST the body and then link the app with the `targetApps` action:

```json
POST beta/deviceAppManagement/targetedManagedAppConfigurations/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.iosMobileAppIdentifier", "bundleId": "com.microsoft.Office.Outlook" } } ] }
```

Bundle ids: Outlook `com.microsoft.Office.Outlook`, Edge `com.microsoft.msedge`, Defender
`com.microsoft.scmx`. Assign to all users — the same audience as
`IOS - U - App Protection`.

## Why these keys

Only keys the vendor documents; values are deliberately limited to what touches
security. UniFy v1.2 sets more (Focused Inbox, Suggested Replies, homepage,
search engine) — that is preference, not baseline.

**Outlook** — [Microsoft Learn: Outlook for iOS and Android app configuration](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/outlook-for-ios-and-android/outlook-for-ios-and-android-configuration-with-microsoft-intune)

| Key | Value | Why |
|---|---|---|
| `com.microsoft.outlook.EmailProfile.AccountType` / `EmailAddress` / `EmailUPN` | `ModernAuth`, `{{mail}}`, `{{userprincipalname}}` | account prefilled; no mistyped address, no basic authentication |
| `IntuneMAMAllowedAccountsOnly` + `IntuneMAMUPN` | `Enabled`, `{{userprincipalname}}` | only the work account in the managed app; Microsoft: managed devices only |
| `com.microsoft.outlook.Mail.ExternalRecipientsToolTipEnabled` | `true` | warning for an external recipient — the cheapest control against mail sent by mistake |
| `com.microsoft.outlook.Contacts.LocalSyncEnabled` | `true` | caller's name visible; works together with `allowmanagedtowriteunmanagedcontacts=true` in `IOS - D - Data Protection`. Managed devices only: on an unmanaged device this remains the user's choice |

**Edge** — [Microsoft Learn: Manage Microsoft Edge on iOS and Android with Intune](https://learn.microsoft.com/intune/app-management/configuration/configure-edge-ios-android)

| Key | Value | Why |
|---|---|---|
| `com.microsoft.intune.mam.managedbrowser.SmartScreenEnabled` | `true` | Defender SmartScreen against phishing and malware downloads; on by default, pinned here |
| `com.microsoft.intune.mam.managedbrowser.SSLErrorOverrideAllowed` | `false` | a user cannot click away a certificate error — the Edge counterpart of `allowuntrustedtlsprompt=false` |
| `IntuneMAMAllowedAccountsOnly` + `IntuneMAMUPN` | managed devices only | only the work profile |

Deliberately not: `disabledFeatures` (password|inprivate|autofill). Turning off password management in Edge
is a decision that should match the macOS/Windows Edge policies; not to be decided separately here.

**Microsoft Defender** — [Microsoft Learn: Configure Defender for Endpoint on iOS features](https://learn.microsoft.com/defender-endpoint/ios-configure-features)

| Key | Value | Why |
|---|---|---|
| `issupervised` | `{{issupervised}}` | Defender knows whether the device is supervised; on supervised devices the privacy consent for app inventory is not needed |
| `WebProtection` | `true` | anti-phishing via local VPN; on by default, pinned here. Does not apply to the content filter route |
| `DefenderNetworkProtectionEnable` | `true` | detection of unsafe Wi-Fi and certificates |
| `DefenderOpenNetworkDetection` | `2` | report open networks to the user (0 off, 1 audit, 2 on) |
| `DisableSignOut` | `true` | the user cannot sign out of the app and so make the risk score disappear |

Deliberately not: `DefenderTVMPrivacyMode=false` (a full app inventory of a personal
device is a privacy decision; on supervised devices it is not needed) and
`SuppressOSUpdateNotification` (retired as of July 2026 according to Microsoft).

The schemas have been verified against Graph beta (`iosMobileAppConfiguration` as exported
by UniFy v1.2; `targetedManagedAppConfiguration.customSettings` on Microsoft Learn), not
tested against a tenant.

## Windows App (Azure Virtual Desktop and Windows 365)

Two Graph bodies for Windows App, also on a device without enrollment:

| File | Graph type | What it does |
|---|---|---|
| `windows-app-app-protection.json` | `iosManagedAppProtection` | PIN, no clipboard between the virtual desktop and local apps, `screenCaptureConfigurationState` = `blocked`, `allowedOutboundDataTransferDestinations` = `none`, at least Windows App 11.2.4, no third-party keyboards, jailbroken or rooted devices blocked |
| `windows-app-managed-apps.json` | `targetedManagedAppConfiguration` | `redirectclipboard` = `0` and `drivestoredirect` = `0`: no clipboard and no files from the phone into the session |

**Why.** Conditional Access `2150` only lets Windows App on iOS and Android in with an app
protection policy or a compliant device. A policy on *all Microsoft apps* does not count for that:
Microsoft has Windows App selected explicitly. Without this policy an unmanaged phone therefore
never gets in. In addition, a Cloud PC or session host with screen capture protection
(`[Baseline] - WIN - D - Cloud PC Session Security`) refuses the connection if Windows App does not
block screen capture; that is only possible from the version mentioned. The app configuration is a
second layer next to the session host settings; the most restrictive of the two wins, and Microsoft
states explicitly that it does not replace them.

**Why not a CIPP template.** CIPP removes the `apps` list from an app protection template before
it creates the policy. A policy meant only for Windows App therefore cannot go through CIPP; it is
here as a Graph body.

**Deploying.**

```http
POST https://graph.microsoft.com/beta/deviceAppManagement/iosManagedAppProtections
<contents of windows-app-app-protection.json>

POST https://graph.microsoft.com/beta/deviceAppManagement/iosManagedAppProtections/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.iosMobileAppIdentifier", "bundleId": "com.microsoft.rdc.ios" } } ] }
```

For `windows-app-managed-apps.json` the same via `targetedManagedAppConfigurations`. Assign both to the users of Azure
Virtual Desktop or Windows 365. On an enrolled iPhone, Windows App must be in Intune as a store app; since release 2409 Intune sends the MAM keys itself.

**Not tested in a tenant.** After assigning, check in the portal that Windows App is not also
covered by `[Baseline] - IOS - U - App Protection`: two app protection policies on the same app
for the same user produce a conflict.
