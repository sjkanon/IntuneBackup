[Nederlands](README.md) · **English** · [Français](README.fr.md)

# macOS shell scripts

Intune shell scripts (`deviceShellScripts`) are none of the five CIPP policy types. A shell script
sits under `deviceManagement/deviceShellScripts`, `Set-CIPPIntunePolicy` has no `TemplateType` for
it, and `Start-IntuneRestoreConfig` does not restore it. `export-intunebackup.js` does copy every
`.sh` in this folder into `export/.../macOS Shell Scripts/macos/` as a sidecar, so the scripts are
not forgotten in a rebuild; CIPP, `check-scope.js` and `Set-BaselineAssignment.ps1` do nothing with
them. Creating and assigning them is manual.

| File | What it does | Scope |
|---|---|---|
| `configure-dock.sh` | Sets up the Dock once per user and then leaves it alone | User |
| `mount-azure-files.sh` | Installs a LaunchAgent that mounts the Azure Files share in the user's session | Device |
| `nudge-screen-recording.sh` | Asks the user to enable screen recording for the remote support tools (NinjaOne and TeamViewer by default), and opens the pane | User |
| `escrow-buddy.sh` | Installs Escrow Buddy (pinned version, signature checked) and requests a new FileVault recovery key once | Device |

## configure-dock.sh

Puts the company apps in the Dock and removes Apple's default set — Safari, Mail, Calendar,
Contacts, Notes, Reminders, Messages, FaceTime, Photos, Music, TV, Podcasts,
Maps, News, App Store and Freeform. They are not removed one by one: the script
replaces the *entire* `persistent-apps` list, so it does not drift out of step with whatever Apple
puts in the Dock by default in a future macOS version.

From left to right: Outlook, Teams, Edge, Word, Excel, PowerPoint, Windows App, OneDrive,
Company Portal, System Settings. Finder and Trash are not in the list — macOS manages those
itself and they cannot be moved.

### Settings in Intune

Devices → macOS → Shell scripts → Add.

| Setting | Value | Why |
|---|---|---|
| Run script as signed-in user | **Yes** | without this, `defaults` writes to root's Dock and the user sees nothing |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | |
| Max number of retries | 3 | |

Assign to a **user group** (All Users), not to devices: the Dock is per
user, and on a shared Mac every user should get their own setup.

### "Every hour" and "once" do not contradict each other

As soon as the Dock is in place, the script writes a marker to
`~/Library/Application Support/Baseline/dock-configured` and every subsequent run stops immediately.
The repetition is only there for the first time: on a new Mac this script almost
always runs before Intune has deployed the M365 apps. If you chose "Not configured" (one run,
never again), such a device would be left with half a Dock permanently.

As long as apps are missing, the script does not touch the Dock and tries again the next
hour. After 30 failed attempts — just over a day — it sets up the Dock with whatever *is* there
and records in `dock.log` which apps were missing. Otherwise, waiting for an app that never arrives
(not assigned, installation failed) produces a Dock that never ends up right.

### After that, the Dock belongs to the user

Anyone who wants to add or remove something may do so. That is a choice, not a shortcoming: the
alternatives are a custom `.mobileconfig` with `static-only` (Dock fully locked, the user
can do nothing) or doing nothing at all.

If you do want to lock it down, this script is the wrong tool — that calls for a
device configuration with a `com.apple.dock` payload.

### Running it again

Remove the marker; the next run sets up the Dock again:

```bash
rm -f ~/Library/Application\ Support/Baseline/dock-configured \
      ~/Library/Application\ Support/Baseline/dock-attempts
```

### Why not the Settings Catalog

The Settings Catalog *does* have Dock settings, but they are broken with more than one app: Intune
formats the list incorrectly and the payload never reaches the device. See
[Microsoft Q&A 1164432](https://learn.microsoft.com/en-us/answers/questions/1164432/macos-settings-catalog-user-experience-dock-persis)
— still open, and still being reported in 2026. With a single app it does work, so anyone who tries it
easily gets the impression that it is fine.

### Line endings

`.gitattributes` enforces LF for `*.sh`. This repo is maintained on Windows with
`core.autocrlf=true`; without that rule this script gets CRLF on checkout and fails on the
Mac with `bad interpreter: /bin/bash^M`. Check this after an upload with `file` or `cat -A` —
Intune accepts the script without complaint and the error only shows up on the device.

## mount-azure-files.sh

Mounts an Azure Files share in `/Volumes` using the Kerberos ticket that Platform SSO
issues, so the user does not have to enter a password and the share appears in the
Finder sidebar. The macOS equivalent of a drive mapping, and the counterpart of
[`Mount-AzureFilesDrive.ps1`](../../WIN/PlatformScripts/README.en.md) on Windows.

### Why a script and not a configuration profile

There is no drive-mapping payload. All 18,329 `settingDefinitionId`s of the settings catalog
were searched for anything that maps a network drive; no such thing exists, on either
platform. Apple has `com.apple.finder_showmountedserversondesktop` — whether an already mounted
share appears on the desktop — and nothing else. Mounting is an action, not a setting.

### The Azure side: a second storage account with Entra Kerberos

Applies to **both** platforms — `Mount-AzureFilesDrive.ps1` on Windows has exactly the same
prerequisites. The one-identity-source limitation applies per storage account and not per tenant,
so a second account next to the existing one solves it without touching what already runs on the first
account (for example an AVD environment on Entra Domain Services).

A **new** account is also easier than an existing one: the `CIFS/` → `cifs/` correction
on the identifier URI is only needed for shares that already existed.

1. **Create the storage account** in the same region as the users, with a file share in it.
2. **Enable Entra Kerberos.** In the portal via *Data storage* → *File shares* →
   *Identity-based access* → *Microsoft Entra Kerberos* → *Set up*, or:

   ```powershell
   Set-AzStorageAccount -ResourceGroupName "<rg>" -Name "<account>" `
       -EnableAzureActiveDirectoryKerberosForFile $true
   ```

   Azure then automatically registers an app `[Storage Account] <account>.file.core.windows.net`.
3. **Grant admin consent** on that app: Entra ID → App registrations → All applications → the app
   named after the storage account → *API permissions* → *Grant admin consent*.
   Without this step the app exists but nothing happens.
4. **Enable cloud-only group support.** Mandatory as soon as you use cloud-only identities,
   and easy to miss: a Kerberos ticket carries at most 1,010 group SIDs, and
   without the right `Tags` in the app manifest authentication fails. See
   [Group SID limit in Entra Kerberos](https://learn.microsoft.com/en-us/entra/identity/authentication/kerberos#group-sid-limit-in-entra-kerberos-preview).
5. **Exclude the app from MFA.** Entra Kerberos cannot handle MFA. If there is a
   Conditional Access policy on all apps, this one belongs in the exclusion list — search for
   `[Storage Account] <account>.file.core.windows.net`. If you forget this, the symptom is
   `System error 1327` on `net use`.
6. **Assign share-level permissions** to the same user group you assign the script
   to. After that, the NTFS permissions inside the share determine the rest.
7. **Fill in the account name** in `IntuneTemplate/MAC/PlatformScripts/mount-azure-files.sh` and
   `IntuneTemplate/WIN/PlatformScripts/Mount-AzureFilesDrive.ps1`, and move this policy from phase 3 to
   phase 1.

On the client side: the device must be Entra joined or Entra hybrid joined. Windows then works
immediately — Entra Kerberos is generally available there. For **macOS**, access
to Azure Files via the Platform SSO ticket remains a limited preview that Microsoft has to enable
for the tenant (azurefiles@microsoft.com); you can send that email right away, independently of all this,
because it is the slowest link.

This profile does **not** need to change for a different storage account: `Hosts` is set to
`.windows.net` and thereby covers every account in Azure.

### What others do, and what they give up for it

There is no elegant solution to this problem; there are three solutions that each give up
something different. That is worth knowing before you start tinkering with this construction.

| Approach | Who | What it costs |
|---|---|---|
| **Shortcut in the Dock**, no mount | [Oktay Sari](https://allthingscloud.blog/revamping-network-drive-mappings-on-macos-with-intune/) (MVP) — `defaults write com.apple.dock persistent-others` with an `smb://` URL | Does not solve authentication. Clicking brings up a sign-in window unless Kerberos is in place separately underneath. |
| **Storage account key in the script** | [Llewellyn Hughes](https://www.llewellynhughes.co.uk/post/azure-map-drive-mac/) — `mount_smbfs -d 777 -f 777 //account:KEY@…` | The key is in plain text in the script and gives access to the entire storage account. No per-user identity, no per-person permissions. |
| **Kerberos, with password as fallback** | [42Loris/macOS_DriveMapping](https://github.com/42Loris/macOS_DriveMapping) — `mount_smbfs -N`, otherwise a keychain helper | Nothing on the security side, but it requires a working Kerberos source. It also requires a Developer ID certificate for the helper. |

This baseline does the third. Because the Kerberos side gets stuck as soon as the storage account already
has another identity source (AD DS or Entra Domain Services), and you cannot simply switch that, the
second has been added as a **fallback** — see below.

### The storage account key as fallback

`STORAGE_KEY` at the top of the script. Leaving it empty means Kerberos only; if a key is set,
the script first tries a ticket and then falls back to the key. The key goes into the URL
percent-encoded, so you paste it exactly as Azure gives it to you.

What you give up with this, and it is more than it seems:

- **The key opens the entire storage account**, not just this one share. If something else runs on the same
  account, such as an AVD environment, that data falls under it as well.
- **No per-user identity.** Everyone who mounts is the same "user". Per-person permissions
  and traceability in the logs do not exist, and the share-level permissions in Azure
  no longer do anything.
- **Anyone who can read the script has the key** — in Intune, and on the device.

That is why this file contains an empty placeholder and not the key itself. **Never fill it in
in the repo.** The copy you upload to Intune carries the real value; what is in git stays
empty. A key that has been in git once is there forever, even after a commit that
removes it, and then rotation is the only way out — with everything attached to it.

Rotate the key in any case as soon as the Kerberos route works, and earlier if it has
passed through somewhere it does not belong: Azure portal → the storage account → *Access keys* →
*Rotate key*. Use key2 for the deployment and keep key1 in reserve, so you can rotate
without breaking everything at once.

The key briefly appears in the process table because `mount_smbfs` receives it as an argument. That
is not pretty, but it is not the weakest link: the same key is in the script on every
device anyway. The alternative is the keychain, and on macOS that asks for a consent dialog
unless the same signed program both writes and reads it — exactly the reason 42Loris
builds a dedicated Swift helper with a Developer ID certificate for it.

### Why there is a LaunchAgent

A mount belongs in the **user's graphical session**, and the process that the Intune agent
starts is not in it. That explains the picture we were stuck on for a long time: mounting
by hand worked, and via Intune nothing happened.

That is why the Intune script no longer mounts anything itself. The division of labour:

| | does what | runs as |
|---|---|---|
| Intune script | installs the helper and the LaunchAgent in `/Library` | **root** |
| LaunchAgent | mounts, at login and on network change | the signed-in user |

macOS loads a LaunchAgent in `/Library/LaunchAgents/` **automatically for every user at
every login**. That saves the hassle of `launchctl bootstrap` from a session you are not
in, and it works straight away for the next person on that device. For whoever is sitting at it *now*,
the installation script loads the agent as well, so you do not have to log out.

A mount also does not survive logging out, and an Intune script that runs every hour would only
restore the share an hour after login — exactly the moment someone needs it.

That agent has **three** triggers, and all three are needed:

| | when |
|---|---|
| `RunAtLoad` | at login, and when loaded from the installation script |
| `WatchPaths` | as soon as the network changes — Wi-Fi switch, VPN connected, waking from sleep |
| `StartInterval` | every five minutes, as a safety net |

I initially left out that last one because polling is ugly next to `WatchPaths`. That was wrong: an
SMB mount also drops **without** anything changing on the network — after sleep, or when
the server drops the connection. Then `WatchPaths` does not fire and the share stays gone until the
next login. Exactly what happened during testing: mounted at 08:41, gone eight minutes later,
and nothing that brought it back.

Five minutes costs nothing. If the share is still there, the script stops immediately, and with `QUIET`
it writes nothing about it to the log. A `ThrottleInterval` of ten seconds keeps the agent
calm when several triggers arrive in quick succession.

The Intune script **generates** the helper in `/Library/Scripts/Baseline/`: it writes the
settings from the top of the file into it (with `printf %q`, so a key with spaces or
quotes stays intact) and appends the mount logic verbatim. One place for the
settings, and the agent cannot drift out of step with what Intune deploys.

At first the script copied *itself* with `cp "$0"`. That went wrong: with the Intune agent,
`$0` does not point to the script text, so a **binary file** ended up in `/Library/Scripts` and
the LaunchAgent died with `exit 126 — cannot execute binary file`. Generating makes no
assumption at all about how the file is invoked, and there is now a `bash -n` check on the
helper before it goes into use.

### More than one share, or more than one group

At the top of the script are two fields that together determine what this deployment does:

```bash
SET_NAAM="group-a"
SHARES=(
  "share-a"
)
```

**Multiple shares for the same group?** List them one below the other in `SHARES`. One helper, one
LaunchAgent, one log.

**Different groups, different shares?** Then deploy this file **twice** with a
different `SET_NAAM`, and assign each deployment to its own group. `SET_NAAM` makes the helper,
the LaunchAgent label and the log unique:

| `SET_NAAM` | helper | label |
|---|---|---|
| `group-a` | `/Library/Scripts/Baseline/mount-azure-files-group-a.sh` | `…baseline.mount-azure-files-group-a` |
| `group-b` | `/Library/Scripts/Baseline/mount-azure-files-group-b.sh` | `…baseline.mount-azure-files-group-b` |

Without that distinction, two deployments overwrite each other's helper and fight over the same
label — the last one to run wins, and the other group loses its drive without anyone
seeing why.

What you should **not** do is copy the script and modify the copy. Then every fix has to be done twice,
and at some point that goes wrong.

#### What a group assignment does and does not arrange

With the **key fallback**, the assignment only determines who *gets* the share mounted — not who
*can access* it. That key opens the entire storage account, so someone with a Mac from one group
can just as well mount the other group's share by hand.

Real separation per group only comes with **Kerberos**: then the share-level permission in
Azure applies, and the KDC simply issues no ticket for a share you are not allowed to access. As long as the key
is in play, the group split is a convenience and not a boundary.

### Settings in Intune

Devices → macOS → Shell scripts → Add.

| Setting | Value | Why |
|---|---|---|
| Run script as signed-in user | **No** | the script only installs, and writes to `/Library` — only root may do that |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | keeps the helper and the LaunchAgent up to date |
| Max number of retries | 3 | |

Assign to a **device group**. The LaunchAgent the script installs then works for
every user of that device; a user group would only serve the first person.

Who *may* access the share remains a property of the user — that is handled by the share-level
permissions in Azure. Except with the key fallback: that has no per-user identity,
so in that case the assignment *does* determine who can access it.

### What needs to be in place outside this script

[`Baseline_MAC_D_Azure_Files_Cloud_Kerberos`](../SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.en.md)
must be deployed — without that profile there is no ticket for the
`KERBEROS.MICROSOFTONLINE.COM` realm and the mount still asks for a password. That profile
is currently in **phase 3**: access to Azure Files via the Platform SSO ticket is a
limited preview that Microsoft has to enable for you, and it requires macOS Tahoe 26.5. As long as
those prerequisites are not met, this script mounts nothing and the log says why.

The tenant side (Entra Kerberos on the storage account, admin consent, MFA excluded for the
Entra app, share-level permissions, and the `CIFS/` → `cifs/` correction on the identifier URI of
existing shares) is described in the note for that profile.

### `server rejected the connection: Authentication error`

Port 445 is open, but the mount is refused. Then the network is fine and the problem lies with
Kerberos. Three causes, in the order in which you rule them out.

**1. The ticket is not in the default cache.** `mount_smbfs` uses the
*default* credential cache via GSSAPI. Platform SSO puts the cloud TGT in a cache with its own name, and
if that is not the default, `mount_smbfs` does not find it and the server refuses.

```bash
klist -l
```

The **`*`** at the start of a line marks the default cache. If it is next to the
`@KERBEROS.MICROSOFTONLINE.COM` ticket and that has not expired, this is not the cause —
move on to 2. If it is somewhere else, you can test this with
`kswitch -p <principal>` followed by the mount.

**2. The identifier URI uses `CIFS/` in upper case.** For a share that already existed before
Entra Kerberos was enabled, Azure registers the app with `CIFS/<account>.file.core.windows.net`.
macOS mounts exclusively on `cifs/` in lower case and otherwise gets no service access. You can
see this in Entra ID → App registrations → All applications → the storage account → Manifest.
Correct it with [`updateappmanifestazurefiles.ps1`](https://github.com/Azure-Samples/azure-files-samples/blob/master/update-app-manifest/updateappmanifestazurefiles.ps1)
from azure-files-samples.

**3. The authorisation behind it.** Admin consent on the storage account's service principal,
MFA excluded for that Entra app, and a share-level permission for this user on this
share. If one of these is missing, a ticket *is* issued but the server still refuses it.

**Telling 2 and 3 apart in one test.** Ask the KDC directly for the
service ticket, twice, and note the difference in case:

```bash
kgetcred cifs/<account>.file.core.windows.net@KERBEROS.MICROSOFTONLINE.COM ; echo "klein: $?"
kgetcred CIFS/<account>.file.core.windows.net@KERBEROS.MICROSOFTONLINE.COM ; echo "groot: $?"
```

Kerberos principals are case-sensitive, and that is exactly where this goes wrong.

| Outcome | What it means |
|---|---|
| lower case fails, upper case succeeds | **Cause 2.** The SPN is registered as `CIFS/` and macOS asks for `cifs/`. Correct the identifier URI. |
| both fail with **AADSTS700016** | There is no app for this storage account in this tenant. See below — this is the most common cause. |
| lower case succeeds, mount still fails | **Cause 3.** The ticket is issued; the server refuses authorisation. Look at consent, the MFA exclusion and the share-level permission. |

#### AADSTS700016 — the app does not exist

```
kgetcred: krb5_get_creds: Error from KDC: AADSTS700016: Application with identifier 'cifs'
was not found in the directory '<tenant-id>'. This can happen if the application has not been
installed by the administrator of the tenant or consented to by any user in the tenant.
```

If this appears for **both** spellings, there is no case to correct: the
KDC does not know any application for this file service at all. Enabling Entra Kerberos creates
that app registration (`[Storage Account] <account>.file.core.windows.net`) automatically;
as long as it does not exist, there is nothing to issue.

**First look at the identity source of the storage account**, because that is the most
common cause. Azure portal → the storage account → *Data storage* → *File shares* →
*Identity-based access*. If **Microsoft Entra Kerberos** and **AD DS** are greyed out there with
*"Another access method is already configured"*, another source has already been chosen — for example
Microsoft Entra Domain Services. Microsoft is firm about this:

> Your Azure storage account can't authenticate with both Microsoft Entra ID and a second
> method like AD DS or Microsoft Entra Domain Services. If you already chose another identity
> source for your storage account, you must disable it before enabling Microsoft Entra
> Kerberos.

One identity source per storage account, and that is a choice that reaches further than the Macs: all
existing traffic to those shares depends on it. Switching is done according to
[Change the identity source for Azure file shares](https://learn.microsoft.com/en-us/azure/storage/files/change-identity-source)
and is not a setting you just flip.

**Why Entra DS still does not work with this profile.** Kerberos against an Entra DS share goes
through the domain controllers of that managed domain, with the domain itself as realm — not through the
cloud KDC at `KERBEROS.MICROSOFTONLINE.COM`. Platform SSO issues only two tickets:
`tgt_cloud` for Entra Kerberos, and `tgt_ad` for an on-premises AD via Cloud Kerberos Trust.
Entra DS is neither — it is a managed domain that synchronises *from* Entra ID and
does not take part in Cloud Kerberos Trust. So a TGT for that realm is never issued.

Anyone who still wants to stay with Entra DS needs a classic Kerberos SSO setup on the Mac:
realm and `Hosts` of the managed domain, network line of sight to the domain controllers in the VNet (so
VPN or ExpressRoute) and a user who types in their password. That works, but it is a
different solution from this one — the sign-in-free mount is not part of it.

**Entra ID and Entra Domain Services are not the same thing**, and that naming confusion is the
crux here. Entra ID is the cloud directory that Intune, Platform SSO and Conditional Access run on;
it speaks OAuth2 and OIDC and has no classic Kerberos. Entra DS is a **managed
AD domain on VMs in your own VNet**, with LDAP, NTLM and regular Kerberos, that synchronises one-way
from Entra ID. The same users, a different directory, a different realm, its own
domain controllers on private addresses. The fact that your users and devices are "in Azure AD" therefore
says nothing about whether they can reach Entra DS.

This does not apply only to Macs. Microsoft sets as a prerequisite for Entra DS:

> To access an Azure file share by using Microsoft Entra credentials from a VM, your VM must be
> domain-joined to Microsoft Entra Domain Services. […] Non-domain-joined VMs can access Azure
> file shares using Microsoft Entra Domain Services authentication only if the VM has
> unimpeded network connectivity to the domain controllers […] Usually this connectivity
> requires either site-to-site or point-to-site VPN.

#### Why it does work with a domain-joined device

There are three Kerberos worlds in play, and the misunderstanding lies in the assumption that they
connect to each other.

| | Who is the KDC | What the storage account is there |
|---|---|---|
| **Classic AD** (on-prem AD DS or Entra DS) | real domain controllers | an account in *that* domain, with the SPN `cifs/<naam>.file.core.windows.net` |
| **Entra Kerberos** | Entra ID itself, via a KDC proxy over HTTPS, realm `KERBEROS.MICROSOFTONLINE.COM` | an app registration with identifier `cifs/<naam>.file.core.windows.net` |

A **domain-joined** device works in the first world: it is a member of that domain, finds the
domain controllers, gets its TGT there and asks the same controller for the `cifs/` ticket.
The controller knows it, because user and storage account are in the same directory. That the device
is *also* Entra joined plays no part in this — it is the domain membership that does the work.

An **Entra-joined device under Intune** has a ticket from the second world, and the storage
account trusts the first. Different realm, different KDC, and no trust relationship between them.
Hence `AADSTS700016`: you are asking the cloud KDC for a service it has never heard of.

And the obvious objection — Entra ID *can* issue on-premises tickets, that is
`tgt_ad` — is correct, but only for a *real* on-premises AD DS, where you use
`Set-AzureADKerberosServer` to place a trust object in that domain. On a managed domain that
is not possible; Microsoft on this, when asked whether Cloud Kerberos Trust can work with Entra DS:

> No, that wouldnt work, the trust is with Azure AD, not the Azure AD DS managed domain.

And even *if* it were possible: Cloud Kerberos Trust removes the domain controller from **sign-in**,
not from accessing a resource. For the `cifs/` ticket you still have to reach a
domain controller. So the VPN requirement stands regardless.

An Entra-joined laptop managed by Intune is not domain-joined and has no line of sight to those
domain controllers from the internet. With Entra DS as identity source, a storage account in practice
serves only VMs in or connected to that VNet — not a single laptop in the
fleet, neither Windows nor macOS. macOS is not even listed among the supported clients on that page,
incidentally.

If Entra Kerberos *is* enabled and this error still appears, there are two remaining possibilities. The
**admin consent** on the new service principal may be missing — Entra ID → App registrations →
All applications → the app named after the storage account → *API permissions* →
*Grant admin consent*. Or the storage account belongs to a **different directory** from
the one the Mac is signed in to; the error message names the tenant ID that was searched, and Entra
Kerberos does not work across tenants.

As long as this error is there, there is no point in tinkering with the profile, the `Hosts` list or the script.
That side is demonstrably fine: there is a valid TGT in the default cache, port
445 is open, and the KDC answers politely — with the message that there is nothing to give.

If the Mac does not have `kgetcred`, you can read the same thing after a failed mount with
`klist | grep -i cifs`: if there is a `cifs/` line, the KDC issued the ticket (3); if there is
nothing, it never even got that far (2).

### The key icon in the menu bar is not a diagnosis

The menu bar icon of the Kerberos extension can report "Not signed in" or "Network not available"
while everything works. Microsoft writes about this:

> Users don't need to interact with the menu bar extra for Kerberos SSO to work. SSO
> functionality operates correctly even if the menu bar extra reports "Not signed in". You can
> instruct users to ignore the menu bar extra.

With this setup that makes sense too. With `usePlatformSSOTGT` set to true, the extension fetches
**no ticket of its own** — it uses the TGT that Platform SSO has already imported. The
extension itself therefore never connects to a KDC, and what the icon reports about that
connection says nothing about whether it works.

The only source that does count is:

```bash
app-sso platform -s
```

Under `kerberosStatus` there should be an entry with `"realm": "KERBEROS.MICROSOFTONLINE.COM"`,
`"ticketKeyPath": "tgt_cloud"` and `"importSuccessful": true`. If it is there, the
Platform SSO side is done and a failed mount is down to the Azure side.

**Before you start digging in the profile**, do check whether the token has been replaced — that is a
real pitfall, just not the one this icon points to. In the template the KDC URL is
`kkdcp://login.microsoftonline.com/%OrganizationId%/kerberos`, and CIPP fills that in on
deployment. If you deploy with IntuneBackupAndRestore or via a direct JSON import, that does not happen:

```bash
sudo profiles show -output /tmp/profielen.plist
grep -A3 preferredKDCs /tmp/profielen.plist
```

There should be a GUID there, not `%OrganizationId%`.

### Share and subfolder are not the same

`smb://<account>.file.core.windows.net/<share>/<submap>` appears in the script as
`STORAGE_ACCOUNT` plus an entry in `SHARES`: `<share>` is the **share**, `<submap>` a **folder
inside it**. SMB has only one share level, and that distinction is not cosmetic — the mount and the
share-level permissions in Azure hang off `<share>`; the subfolder is merely the point where you
enter. Someone who may only access one subfolder should get that through the permissions on that folder, not
by entering a different value here.

A line in `SHARES` with only `<share>`, without a subfolder, mounts the whole share.

The "is it already there?" check therefore looks at the **share** and not at the subfolder or the
mount path: NetFS decides itself whether to put the mount at `/Volumes/<submap>` or at `/Volumes/<share>`,
and if /Volumes already has that name, macOS appends a number. A stricter check would
not recognise its own mount and would remount every round.

### Visible in Finder

The share lands in `/Volumes` and appears in the Finder sidebar under **Locations**, with an
eject button — the same as if you had connected it via *Go → Connect to Server*.

What matters for that is **where** the share lands, not which command mounted it. Finder puts everything in
`/Volumes` in the sidebar; a mount in a folder in the home folder is not seen by Finder
as a server and appears nowhere.

The script uses `mount_smbfs -N`, and explicitly **not** `osascript -e 'mount volume'`:

| | `mount_smbfs -N` | `mount volume` (NetFS) |
|---|---|---|
| Mount point in `/Volumes` | creates it itself, even as a standard user | created by NetFS |
| Kerberos | uses the TGT that is there | same |
| If the ticket is not accepted | mount fails, with an error message | **puts a sign-in window on screen and waits** |

That last row is the whole difference. From a LaunchAgent nobody answers that dialog:
the script hangs until the Intune agent kills it after 60 minutes and reports "Failed",
without a single line of output. That is exactly what happened here. `-N` by definition asks nothing.

[`42Loris/macOS_DriveMapping`](https://github.com/42Loris/macOS_DriveMapping) makes the same trade-off,
with a comment in the script that `osascript` triggers that "continue" dialog for a URL
without credentials.

#### If /Volumes does not work

`mount_smbfs` creates its own mount point in `/Volumes`, but not always: if there is still a
folder there from an earlier attempt that belongs to `root`, *every* subsequent mount gives
**`Operation not permitted`**. That is different from `Authentication error` — it is then not
about the key or the ticket but about the mount point, and anyone who confuses the two spends days looking in the
wrong place.

The script cleans up such an empty leftover itself and otherwise falls back to `~/<share>`. That fallback
always works, but does not produce an entry under *Locations*; the log says so when it happens.
Manual clean-up can be done with `sudo rmdir /Volumes/<naam>`.

#### Favourites is not possible, Locations is

The share lands in `/Volumes` and thereby automatically appears in the Finder sidebar under
**Locations**, with an eject button. That is the sidebar.

The **Favourites** at the top of that sidebar are something else, and a script on macOS 26 cannot
populate them. `sfltool` — Apple's own tool — only knows:

```
csinfo | dumpbtm | archive | clear | resetbtm | resetlist | list | list-info
```

There is no `add-item`. Older sources do mention that command; this macOS does not accept it and
only writes its usage to the log. The script now first checks whether the subcommand
exists and otherwise silently skips it — because a log line that says "In de Finder-favorieten gezet"
while nothing happened is worse than no line at all.

If you still want a fixed favourite, [`mysides`](https://github.com/mosen/mysides) is the only
working tool: a third-party binary that you have to deploy and sign yourself. The
difference you buy with it: Locations disappears on eject, a favourite stays.

### No ticket, no attempt

Without a Kerberos ticket the script does not mount. That is deliberate: when a Kerberos mount fails,
NetFS puts a sign-in window on screen, and that every five minutes from a
background agent is worse than a missing share. The script checks `klist` for a
ticket for `KERBEROS.MICROSOFTONLINE.COM` and records in the log why it did nothing.

The check uses `klist -l` **and** a bare `klist`, because the two do not see the
same thing. Platform SSO puts the cloud TGT in a cache with its own name and a bare `klist`
only shows the default cache. What is really there is seen most reliably from Microsoft itself:

```bash
app-sso platform -s
```

Under `kerberosStatus` there should be an entry with `"realm": "KERBEROS.MICROSOFTONLINE.COM"`,
`"ticketKeyPath": "tgt_cloud"` and `"importSuccessful": true`. If it is there, the
Platform SSO side is fine and a failed mount is down to the Azure side.

Manual testing, *with* dialog, is possible with `--force`:

```bash
~/Library/Application\ Support/Baseline/mount-azure-files.sh --force
```

### When Intune reports "Failed"

In an Intune run the script **always** ends with exit 0, even if there was nothing to mount.
That is deliberate: as long as the Azure Files preview is not enabled, no Mac has a ticket,
and then every device would be permanently red for something that is going according to plan. What *did*
happen, the script writes to stdout, and Intune keeps that output with the device.

"Failed" therefore means the script did not itself get to the end. Three causes, in
order of likelihood:

1. **The mount got stuck on a sign-in window.** If the Mac does have a Kerberos ticket but
   the share does not accept it, NetFS falls back to a dialog and waits for someone to fill
   it in. From a LaunchAgent that never happens; the script hangs and the Intune agent
   kills it. Since the 60-second timeout this no longer happens — the script then records
   `hung and was aborted after 60s` and carries on.
2. **An older version is in Intune.** The placeholder check is the only other path
   that gives exit 1. The log then literally says `is still set to the placeholder`.
3. **The script never started.** Line endings or a BOM from a Windows editor turn
   the first line into `#!/bin/bash^M` and then nothing starts. See *Line endings* above.

You can tell 2 and 3 apart from the log: if there is a `Started as …` line, the
script ran and the error is in the logic; if there is no log file, it never
started.

### "Failed" stays, even when things have long been fine

Three things from
[Microsoft's documentation on shell scripts](https://learn.microsoft.com/en-us/intune/intune-service/apps/macos-shell-scripts)
that explain why the portal can give a wrong picture, and that you need to know before you upload a
new version:

- **The agent fetches scripts every 8 hours**, and that is separate from the MDM sync. A new version
  is therefore not on the device immediately. The user can force it: open Company Portal, choose the
  device, **Check settings**.
- **The status is only reported when it changes.** If it stays the same, Intune only
  updates the timestamp — every 7 days. An old "Failed" can therefore still be shown while
  nothing is going wrong any more.
- **A failed script is not run again** unless *Max number of times to retry* is
  set. If that is *Not configured*, one failure is final until you change the script
  or restart the device.

Useful to know for cause 1 above: the agent only kills a script after **60 minutes**.
A mount waiting on a sign-in window therefore easily reaches that limit.

```bash
cat ~/Library/Logs/Baseline/mount-azure-files.log
```

And without touching the Mac: **Devices → Scripts and remediations → Platform scripts →**
the script **→ Device status →** choose the device **→ Collect logs**, with paths separated by
a semicolon and *without* spaces between them:

```
/Users/<gebruiker>/Library/Logs/Baseline/mount-azure-files.log;/Users/<gebruiker>/Library/Logs/Baseline/screen-recording.log
```

*That* is why these logs are in `~/Library/Logs/Baseline/` and not next to the markers in
`Application Support`: that folder name has a space and therefore cannot be collected. The Intune
agent always includes its own logs, from `/Library/Logs/Microsoft/Intune/` and
`~/Library/Logs/Microsoft/Intune/`.

### Running it again

```bash
launchctl bootout gui/$(id -u)/com.baseline.mount-azure-files-<SET_NAAM>
sudo rm -f /Library/LaunchAgents/com.baseline.mount-azure-files-<SET_NAAM>.plist
```

The next run of the Intune script puts both back. The log is in
`~/Library/Logs/Baseline/mount-azure-files.log`.

## nudge-screen-recording.sh

Asks the user to enable screen recording for the apps the helpdesk uses to view the screen,
and opens the right pane straight away. Stops as soon as it is sorted.

### Why this cannot be done with a policy

Screen recording is the only control in this baseline that an MDM cannot enforce, and that is
not a shortcoming of the baseline but a decision by Apple. From Apple's own schema for the
PPPC payload ([`apple/device-management`](https://github.com/apple/device-management/blob/main/mdm/profiles/com.apple.TCC.configuration-profile-policy.yaml),
under the key `ScreenCapture`):

> Access to the contents can't be given in a profile; it can only be denied.

The same wording appears for `Camera`, `Microphone` and `ListenEvent`. According to that same schema, the value
`AllowStandardUserToSetSystemService` exists **only** for
`ListenEvent` and `ScreenCapture` — Apple created it precisely *because* these two cannot be
granted.

That the Intune settings catalog also offers `Allow` under `Authorization` means nothing: that
list is generic across all 24 TCC services. If you set it to `Allow` here, Intune accepts
the profile and macOS ignores the value.

[`Baseline_MAC_D_Screen_Recording`](../DeviceConfigurations/Baseline_MAC_D_Screen_Recording.en.md)
therefore gets the maximum: a **standard user** may flip the switch themselves, without an
administrator password. Without that profile, a non-admin cannot do it at all since Big Sur.
The click remains the user's; this script makes sure they actually do it.

### Five switches, not one

By default the profile covers five bundles, from NinjaOne and TeamViewer. If the organisation uses
other tools, replace them in the profile *and* in `BUNDLES` in the script:

```
com.ninjarmm.ncstreamer
com.teamviewer.TeamViewer
com.teamviewer.TeamViewerHost
com.teamviewer.Desktop
com.teamviewer.TeamViewerQS
```

Only installed apps appear in the pane, and each app is its own checkbox. The
script therefore only asks about what is on *this* device — otherwise it would keep asking for
a switch that is not there.

### How it knows whether it is already set

It tries to read the user's TCC database
(`~/Library/Application Support/com.apple.TCC/TCC.db`, column `auth_value`, or `allowed` on
older versions). If that works, the script knows for sure and asks nothing.

That database is protected: without Full Disk Access nobody may read it. If reading fails,
that is not an error — the user is asked instead, with a button **Already on**
that makes the script stop. Better to ask once too often than to make up a permission status.

### In the user's language

The dialog follows the signed-in user's language preference (the first language in
`AppleLanguages`, otherwise `AppleLocale`): Dutch, French, and English in every other case.
The buttons are then **Later** / **Staat al aan** / **Open instellingen**, **Plus tard** /
**Déjà activé** / **Ouvrir les réglages** or **Later** / **Already on** / **Open Settings**.
`ORG_NAAM` at the top of the script is empty by default; the text then says "de IT-afdeling",
"le service informatique" or "the IT department". If you fill in a name, it appears as is in
every language. The log is always in English.

### It stops at some point

After 96 attempts — with one run per hour that is four days — it stops asking and records
in the log what is still missing. Asking for longer turns a reminder into an annoyance, and
then someone clicks it away without reading. Whatever is still missing by then belongs in a conversation, not in a
dialog.

### Settings in Intune

Devices → macOS → Shell scripts → Add.

| Setting | Value | Why |
|---|---|---|
| Run script as signed-in user | **Yes** | it is about *this* user's permissions, and nobody sees a dialog from root |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 hour** | |
| Max number of retries | 3 | |

Assign to a **user group**. Not a device group: on a shared Mac every
user has their own TCC database and therefore their own click.

### Asking again

```bash
rm -f ~/Library/Application\ Support/Baseline/screen-recording-ok \
      ~/Library/Application\ Support/Baseline/screen-recording-pogingen
```

The log is in `~/Library/Logs/Baseline/screen-recording.log`.

## escrow-buddy.sh

Getting the FileVault recovery key into Intune after all for a Mac that was already encrypted.

### The gap

[`MAC - D - FileVault`](../SettingsCatalog/Baseline_MAC_D_FileVault.en.md)
stores the recovery key in Intune, but macOS only escrows a key that is
**created** while the escrow profile (`com.apple.security.FDERecoveryKeyEscrow`) is on the Mac.
Three situations therefore fall through the cracks:

- the user had already turned on FileVault themselves before the Mac was enrolled;
- a Mac was enrolled via Company Portal after it was already encrypted;
- the profile only arrived after Setup Assistant had already encrypted the disk.

Intune then shows no recovery key for the device, and the rotation from the FileVault policy
(`recoverykeyrotationinmonths`) only works on a key that Intune already knows. A forgotten
password in that situation means a lost disk.

### How it works

[Escrow Buddy](https://github.com/macadmins/escrow-buddy) (Apache 2.0, Mac Admins Open Source,
originally Netflix) is an authorization plugin. The package places the mechanism
`Escrow Buddy:Invoke,privileged` in `system.login.console`, just before `loginwindow:done`. If
`GenerateNewKey` in `/Library/Preferences/com.netflix.Escrow-Buddy.plist` is true, the
plugin uses the typed password at the next sign-in of a FileVault user to create
a new personal recovery key. macOS sends it to Intune via the escrow profile.
The user notices nothing; no dialog appears.

The script:

1. stops if FileVault is off (then the FileVault policy handles both encryption and escrow);
2. stops if it has already requested a key before (marker in
   `/Library/Application Support/Baseline/escrow-buddy-requested`);
3. waits if the escrow profile is not there yet — a new key without escrow makes things
   worse, because the old personal key is then gone as well;
4. downloads Escrow Buddy **1.0.0** from the GitHub release and installs only if the package
   is notarised by Apple (`spctl --assess --type install`) and signed with
   *Developer ID Installer* from team **T4SK8ZXCXG** (Mac Admins Open Source — the identity from
   the project's `.github/workflows/build_main.yml`). A different signer: do not
   install, signature in the log;
5. checks that the mechanism is really in the authorization database;
6. sets `GenerateNewKey`.

Log: `/Library/Logs/Baseline/escrow-buddy.log`.

It does no harm if the script also runs on a Mac whose key Intune did already have:
the key is then replaced once and escrowed again, exactly what the rotation in the
FileVault policy does too. That is why there is no attempt to guess from the Mac whether Intune has a
key — the Mac cannot see that.

### Settings in Intune

Devices → macOS → Shell scripts → Add.

| Setting | Value | Why |
|---|---|---|
| Run script as signed-in user | **No** | installing and changing `authorizationdb` requires root |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 day** | the script waits for the escrow profile; after the marker it does nothing more |
| Max number of retries | 3 | |

Assign to the same **device group** as `MAC - D - FileVault`, and only after that policy is on the
Mac. Phase: same as FileVault (pilot first).

### Verifying

- On the Mac, after signing in: `sudo profiles show -type configuration | grep -i escrow` shows the
  profile, and the log ends with "GenerateNewKey set". After the next sign-in,
  `GenerateNewKey` is false again (`defaults read /Library/Preferences/com.netflix.Escrow-Buddy.plist`).
- In Intune: Devices → the device → **Recovery keys** shows a key.

### New version

Update `EB_VERSION`, and before deploying, check on one Mac that
`pkgutil --check-signature` still shows `Developer ID Installer: Mac Admins Open Source (T4SK8ZXCXG)`.
If the signer changes, the script deliberately stops — only change `EB_TEAM_ID` after
checking with the project.

**Open item:** release 1.0.0 dates from June 2023; the signature of that release has not been
verified on a Mac from this workstation. The script fails safe if the team id does not match;
check that in the log on the first pilot Mac.

### Removing

```bash
sudo "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle/Contents/Resources/AuthDBTeardown.sh"
sudo rm -rf "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle"
sudo pkgutil --forget com.netflix.Escrow-Buddy
```

That is what the project's `scripts/uninstall.sh` does too. Do not leave the plugin on a Mac
that is leaving management: a mechanism in `system.login.console` whose bundle is missing
blocks sign-in.

### Line endings

LF, like all `*.sh` in this repo (`.gitattributes`).
