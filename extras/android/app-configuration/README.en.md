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
