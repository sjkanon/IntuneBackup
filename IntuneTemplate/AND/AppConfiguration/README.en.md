[Nederlands](README.md) · **English** · [Français](README.fr.md)

# App configuration for Android (enrolled devices)

Three `androidManagedStoreAppConfiguration` bodies: the app configuration that Managed Google Play
passes to the app at installation. They only work on an **enrolled** Android
Enterprise device and only for an app deployed via Managed Google Play.
`profileApplicability: default` means: every profile type (personal work profile,
corporate-owned work profile, fully managed, dedicated) — one policy per app is enough.

| File | App | What it does | Placeholder |
|---|---|---|---|
| `AND-Outlook-Managed-Devices.json` | Outlook (`com.microsoft.office.outlook`) | work account prefilled with modern authentication, only the organisation account allowed, warning for external recipients | `OUTLOOK-APP-ID-INVULLEN` |
| `AND-Edge-Managed-Devices.json` | Edge (`com.microsoft.emmx`) | only the organisation account allowed | `EDGE-APP-ID-INVULLEN` |
| `AND-Defender-Low-Touch-Onboarding.json` | Microsoft Defender (`com.microsoft.scmx`) | onboarding without user action, web protection and anti-phishing on, privacy for the personal profile | `DEFENDER-APP-ID-INVULLEN` |

## Why these keys

`payloadJson` is base64. Decoded:

**Outlook** — `com.microsoft.outlook.EmailProfile.AccountType` = `ModernAuth`,
`…EmailUPN` = `{{userprincipalname}}`, `…EmailAddress` = `{{mail}}`,
`IntuneMAMAllowedAccountsOnly` = `Enabled`, `com.microsoft.intune.mam.AllowedAccountUPNs` =
`{{userprincipalname}}`, `com.microsoft.outlook.Mail.ExternalRecipientsToolTipEnabled` = `true`.

*Organization allowed accounts* (the two MAM keys) is the most important: without that rule
a user can also add a private account in the managed Outlook, and App Protection cannot
separate data between two accounts in the same app. The UniFy source also turns off Focused
Inbox, default signature, conversation view and suggested replies — that is
user preference and has been left out.

**Edge** — only the two account keys, for the same reason: links from Outlook and Teams must
open in Edge (App Protection), and they have to land in Edge's work profile, not in
a private account. Keys such as home page, search engine, SmartScreen and disabled features
have deliberately been left out: their Android types could not be verified against an Android export,
and most of them are an organisational decision.

**Defender** — unchanged from UniFy: `EnableLowTouchOnboarding` and `UserUPN` for onboarding
without user actions, `DefenderNetworkProtectionEnable`, `antiphishing` and `vpn` for
web protection, and the `-PP` keys (*personal profile*) that on a personal device keep the
apps and URLs of the private side out of reporting. The `permissionActions` give Defender
the storage, location and notification permissions it needs for scanning and network protection
up front. Web protection runs via a local VPN; that conflicts with another always-on VPN on the
device — in that case decide together with the network administrator.

## Deploying

1. Approve the app in Managed Google Play and look up the app id in Intune:
   `GET https://graph.microsoft.com/beta/deviceAppManagement/mobileApps?$filter=isof('microsoft.graph.androidManagedStoreApp')`
   → the `id` of the app with the right `packageId`.
2. Replace the placeholder in `targetedMobileApps` with that id.
3. `POST https://graph.microsoft.com/beta/deviceAppManagement/mobileAppConfigurations` with the
   contents of the file.
4. Assign to the same user groups as the app itself
   (`POST …/mobileAppConfigurations/{id}/assign`), or in the portal under Apps → App configuration.

## Not in this folder: MAM without enrollment

App configuration for phones **without** enrollment (`targetedManagedAppConfiguration`,
*Managed apps* in the portal) is deliberately not included. For that type no
source export was found in this round to verify the body against, and pl4nty does have
Settings Catalog definitions for Edge (`com.microsoft.edge.mamedgeappconfigsettings.*`) but no
example of the body that uses them. An unverified body at best does not import
and at worst imports silently without effect. Until then, set up that policy by hand:
Apps → App configuration → Add → *Managed apps*, the same two account keys, targeted at
Outlook and Edge.

Exception: Windows App, below. For that app Microsoft documents the keys and values itself.

## Windows App (Azure Virtual Desktop and Windows 365)

Two Graph bodies for Windows App, also on a device without enrollment:

| File | Graph type | What it does |
|---|---|---|
| `AND-Windows-App-App-Protection.json` | `androidManagedAppProtection` | PIN, no clipboard between the virtual desktop and local apps, `screenCaptureBlocked` = `true`, at least Windows App 11.0.0.94, hardware-backed Play Integrity, jailbroken or rooted devices blocked |
| `AND-Windows-App-Managed-Apps.json` | `targetedManagedAppConfiguration` | `redirectclipboard` = `0` and `drivestoredirect` = `0`: no clipboard and no files from the phone into the session |

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
POST https://graph.microsoft.com/beta/deviceAppManagement/androidManagedAppProtections
<contents of AND-Windows-App-App-Protection.json>

POST https://graph.microsoft.com/beta/deviceAppManagement/androidManagedAppProtections/{id}/targetApps
{ "apps": [ { "mobileAppIdentifier": { "@odata.type": "#microsoft.graph.androidMobileAppIdentifier", "packageId": "com.microsoft.rdc.androidx" } } ] }
```

For `AND-Windows-App-Managed-Apps.json` the same via `targetedManagedAppConfigurations`. Assign both to the users of Azure
Virtual Desktop or Windows 365. Company Portal must be in the same profile as Windows App.

**Not tested in a tenant.** After assigning, check in the portal that Windows App is not also
covered by `[Baseline] - AND - U - App Protection`: two app protection policies on the same app
for the same user produce a conflict.
