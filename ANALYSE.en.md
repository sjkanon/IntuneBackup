[Nederlands](ANALYSE.md) · **English** · [Français](ANALYSE.fr.md)

# Gap analysis — what are we missing for a first baseline?

Hand-written, unlike [`README.md`](README.en.md) next to it. This records *how* the
BASELINE2 set came about and — more importantly — what is deliberately **not** in it and why.
Without that last part, the next round is doomed to weigh the same 500 settings all over again.

Date: 3 September 2026. The baseline has 134 policies. This analysis describes the 25 added in September 2026: 15 from this analysis and the 10 that until this
date lived in `ISMSTemplate/` and have been merged in here. The end goal is a single baseline — this folder
is the waiting room, `IntuneTemplate/` the destination.

## The question

Are we missing anything from IntuneAdmin that we really need for a first baseline, taking into account the ISMS set,
NIS2, ISO 27001 and other templates on GitHub? And if so: which of it demonstrably
works, do we need to keep users safe, and applies to *every* device?

## Sources

| Source | What it is | How it was used |
|---|---|---|
| [IntuneAdmin/IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines) | 874 profiles: CIS v4 Windows 11 L1/L2, CIS Edge, CIS Visual Studio Code, Microsoft Endpoint Security baselines, Modern Workplace (Fundamentals/Associate/Expert), **ISO-IEC 27001-2022**, **NIS2 2022/2555**, Apple, Android, Linux, AVD/W365 | fully compared on `settingDefinitionId` |
| [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) | Windows v3.8, macOS v1.0, BYOD | already the source of `IntuneTemplate/`; used here only to check whether something was deliberately left out |
| [UniFy-Endpoint/iOS-iPadOS-Intune-Baseline](https://github.com/UniFy-Endpoint/iOS-iPadOS-Intune-Baseline) | 45 profiles, CIS Apple iOS/iPadOS 26 v1.0.0, Corporate and BYOD | MAM policy compared with ours |
| [UniFy-Endpoint/Android-Enterprise-Baseline](https://github.com/UniFy-Endpoint/Android-Enterprise-Baseline) | Android Enterprise, all five management modes | MAM policy compared with ours |
| [pl4nty/intune-change-tracking](https://github.com/pl4nty/intune-change-tracking) (`DCv2/Settings/`) | mirror of the *real* settings catalog definitions | every adopted value verified: platform, allowed options, min/max |
| [Policy CSP on Microsoft Learn](https://learn.microsoft.com/en-us/windows/client-management/mdm/) | the normative documentation | format, default value and minimum Windows version per setting |
| [usnistgov/macos_security](https://github.com/usnistgov/macos_security) | NIST macOS Security Compliance Project | looked at, not used: delivers `mobileconfig`/YAML rules, not Intune JSON — cannot be adopted without manual work |

## Method

Compare on **`settingDefinitionId`**, never on profile name. Two profiles both called
"Firewall" may have nothing in common, and two with different names may set the same setting
to a different value — and *that* is what produces a *Conflict* in Intune.

Three things that go wrong if you don't know them:

1. **IntuneAdmin's JSON files are UTF-16LE with a BOM.** A plain `readFileSync(f,"utf8")`
   followed by `JSON.parse` fails on all 874.
2. **A `GroupSettingCollection` is a container, not a setting.** Two policies that use the same
   macOS payload but set different children do not conflict. `flattenSettings` in
   [`scripts/lib/templates.js`](scripts/lib/templates.js) already makes that distinction.
3. **Values from an external set are not automatically correct.** See *Errors in the sources* below.

## Outcome in numbers

At the time of the comparison our two sets together set 1,908 settings
(`IntuneTemplate/` 106 policies / 1,877 settings, `ISMSTemplate/` 10 / 31 — the latter has
since been merged into this folder). Against that, IntuneAdmin yielded **509 `settingDefinitionId`s
that we set nowhere**. They break down as follows:

| | Count | What happened to them |
|---|---:|---|
| Browser (Chrome, Safari, Edge) | 180 | Chrome and Safari belong to a separate browser decision. The Edge settings are cosmetic or already covered — see below. |
| Apple payloads (`com.apple.*`) | 21 | mostly iOS restrictions for *supervised* devices; those require enrolled iOS devices. One exception: the passcode payload. |
| Visual Studio | 9 | developer-specific, not device-wide. `WIN - D - AI Tooling` already covers the Copilot side. |
| Office | 5 | already covered by the four Office policies in the baseline. |
| Other Windows CSP | 294 | the real work. The vast majority of these dropped out as *not device-wide* (kiosk, AVD, Windows 365, shared devices), *CIS L2* (deliberately: L2 breaks things) or *already covered by another setting*. |
| **Remaining and adopted** | **14** | spread over 8 Windows policies in `BASELINE2/` |

Plus three gaps that did not come from IntuneAdmin: the macOS passcode (from our own `OVERZICHT.md`),
the three MAM tightenings (from the UniFy comparison) and the four compliance policies for iOS and
Android that did not exist at all.

## What we were missing and now have

| Policy | What was missing | Why it meets the bar |
|---|---|---|
| `WIN - D - Account Lockout` | **Nothing counted how often someone failed to log in.** The baseline enforces password length (14) and history (24), but without a threshold someone with a stolen laptop can keep trying indefinitely. | CIS, the Microsoft Security Baseline and NIST SP 800-63B all three require it. Applies to every Windows device. |
| `WIN - D - Logon Hardening` | CTRL+ALT+DEL was not required, and the lock screen allowed network selection. | CTRL+ALT+DEL is the only key combination Windows cannot pass on to an application — without that requirement a fake sign-in screen is trivial. CIS L1 since Windows NT. |
| `WIN - D - Audit Policy Enforcement` | The baseline's 40 audit settings could be silently overruled by the old category settings. | One setting that turns the existing audit policy into actual truth rather than an intention. Invisible, breaks nothing. |
| `WIN - D - Kernel DMA Protection` | Nothing stopped a DMA-capable peripheral that does not support remapping. | The "evil maid": laptop left alone for a moment, plug in, key out of memory. Microsoft sets it to the same value in its own baseline. |
| `WIN - U - Attachment Scanning` | The antivirus scanner was not invoked when a downloaded attachment was opened. | An attachment that was still unknown on arrival *is* recognised a day later. CIS L1, no noticeable impact. |
| `WIN - D - Printing Hardening` | The print spooler was wide open: ordinary users could install drivers for a shared printer, and Protected Print was off. | That is exactly the hole PrintNightmare went through. Every Windows device has a spooler, even without a printer. |
| `WIN - D - Remote Access Hardening` | The WinRM remote shell (`winrs`) was open and an idle SMB session stayed up. | A standard step in lateral movement. Workstations have no legitimate reason to accept incoming remote shells. |
| `WIN - D - Privacy and Telemetry` | Cross-device clipboard, input personalisation, activity upload and advertising ID were all four on. | Four channels through which data leaves the device without anyone recognising them as a data flow. All four CIS L1. |
| `MAC - D - Passcode and Screen Lock` | **The compliance policy requires an 8-character password and locking after 15 minutes, but no policy configured it.** | Was already listed as an open gap in `OVERZICHT.md`. A Mac without a screen lock gets a red tick and the user can do nothing about it. Values taken one-to-one from the compliance policy. |
| `IOS - U - App Protection` | The iOS share sheet still offered unmanaged apps, despite the restriction on outbound transfer. Screenshots were not blocked, PIN reuse was allowed. | See *Mobile* below. Affects *every* iPhone with corporate data — including, and especially, personal devices. |
| `AND - U - App Protection` | PIN reuse allowed. | A PIN reset without history is meaningless, and that is exactly the moment it matters. |
| `IOS/AND - U - Compliance Device Health` and `Compliance Password` | **There was no compliance policy at all for iOS and Android.** | "Require a compliant device" in Conditional Access is an empty shell for those two platforms without a policy. Does nothing yet today — see the caveat below. |

## Second round: comparing per profile instead of per setting

The first comparison above went per `settingDefinitionId`. That finds individual gaps, but it
misses a whole category: an IntuneAdmin *profile* in which each setting seems unimportant on its own,
while the profile as a whole covers something we do nowhere. So the set was then
run through again per profile — 800 profiles with settings, of which **322 were 0%
covered**.

Of those 322, most drop out for the same reasons as before: 90 separate single-setting CIS profiles,
89 Edge profiles (L2 or cosmetic), 26 iOS and 9 Android restrictions that require
enrolment, 19 profiles for Windows 365 and AVD, 16 for Chrome and Safari, and one for
Defender on Linux. What remained were **five baselines that do matter**:

| Baseline | What we were missing | Phase |
|---|---|---:|
| `WIN - D - Power Management` | The baseline already requires a password on wake, but closing the lid did nothing — so the screen stayed unlocked. That is the moment a laptop is left unattended. | 1 |
| `WIN - D - Storage Sense` | A full disk breaks Windows Update, BitLocker encryption and Defender definition updates. That is the state in which a device silently falls behind. | 1 |
| `WIN - D - Enrollment Hardening` | Skipping the network step during OOBE is the best-known way to bypass Autopilot. One setting closes it. | 2 |
| `WIN - D - Windows AI Features Restricted` / `Permitted` | Cocreator, Image Creator, Generative Fill and the Settings Agent send input to a generative service. See *AI is a customer decision* below. | 2 / 5 |
| `WIN - U - Microsoft Teams` | Without a tenant restriction a user can sign in to a foreign tenant in the corporate Teams client and drag files there — an outbound data flow that is logged nowhere. | 3 |

Plus three CIS L1 user rights added to the existing `WIN - D - User Rights`:
`profilesystemperformance`, `replaceprocessleveltoken` and `logonasbatchjob`. The other
user rights from that CIS set appear in IntuneAdmin with a placeholder (`<YOURACT>`) because the
CIS requirement is "nobody"; an empty value collection cannot be reliably encoded in the settings catalog,
so those were deliberately skipped rather than guessed.


### Tenant-specific values: let CIPP fill them in

The Teams sign-in restriction needs a tenant id. That does not have to be a manual step: on deployment CIPP
replaces a number of `%tokens%` with tenant-specific values — `%tenantid%` and
`%OrganizationId%` become the customerId, `%tenantfilter%` the default domain, `%tenantname%` the
display name (see `Get-CIPPTextReplacement` in CIPP-API; the replacement is case-insensitive).
The OneDrive policies in this baseline already use that construct for their tenant list and for
Known Folder Move, so the Teams policy now does the same.

That exposed an existing bug. Until now the baseline check took those tokens as the
expected value, while the tenant contains the filled-in GUID. Five checks were therefore
permanently red — not because the tenant deviated, but because the baseline compared something that is never
stored that way. Such a check is worse than no check: it demands attention every round and teaches everyone to
ignore red. `generate-baseline.js` now skips those settings, with a message per
case, just as it already skipped the EDR onboarding token.

**Watch out with the other deployment route:** CIPP does that replacement, `Start-IntuneRestoreConfig` does not.
Anyone deploying via IntuneBackupAndRestore keeps `%OrganizationId%` literally in the policy and has to
fill in the id by hand.


### AI is a customer decision, so every AI policy is a pair

Whether generative AI is allowed on the workstation is not a technical fact but policy, and that differs per
customer. All three AI policies therefore exist in two variants that set the same settings to the
opposite value. **Assign one per pair** — both produces a
Conflict in Intune, after which the disputed setting is applied by *neither* policy and so
nothing is configured any more. `check-scope.js` guards that.

| Pair | Restricted | Permitted |
|---|---|---|
| `WIN - D - Windows AI` (112) | Recall not available, no screenshots, Click To Do off | all three allowed, set explicitly |
| `WIN - D - Windows AI Features` (147 / 146) | Cocreator, Image Creator, Generative Fill and Settings Agent off | the same four on |
| `WIN - U - AI Usage Control` (139 / 149) | Edge blocks ten public AI services plus the Store website | only the four Store rules; the AI services stay reachable |

Two things were done deliberately here:

- **The Restricted variant keeps the old checkId.** 112 and 139 already existed; that variant is the
  continuation of the policy as it was, so existing findings stay attached to it. The
  Permitted counterparts got 148 and 149. checkId 144 — the Windows AI Features policy before
  its split — has been retired and not reused.
- **The Permitted variant of AI Usage Control does not drop the block list.** Before the AI round that list
  already contained four rules for the Store website. It was cut back to those four
  instead of removing the whole setting — otherwise allowing AI would silently also
  have lifted the Store block, and that is a different decision.

The Permitted variants are not a recommendation. They are in phase 5 (do not deploy) because the
baseline chooses the Restricted side by default; anyone who wants the other side swaps the assignment.

For those who do, there is a third policy: **`WIN - D - Windows AI Recall Boundaries`** (150,
phase 3). Allowing Recall is not all-or-nothing. The damage of an index is not
evenly distributed — one snapshot of an open password vault or of the Entra portal
weighs more than a thousand of a word processor. That policy takes out exactly those places:

| Setting | Value | Why |
|---|---|---|
| `SetDenyUriListForRecall` | nine M365 admin portals and sign-in pages | by definition these show something on screen that does not belong in a searchable index |
| `SetDenyAppListForRecall` | RDP and four password vaults | an RDP session shows the screen of *another* system; a vault shows passwords |
| `SetMaximumStorageDurationForRecallSnapshots` | 30 days | the shortest value the setting offers; by default nothing expires |
| `SetMaximumStorageSpaceForRecallSnapshots` | 10 GB | capped instead of "whatever the disk allows" |
| `AllowRecallExport` | off | the export button is the route by which the whole index leaves the device |

The URI list is correct for every M365 tenant. **The app list is deliberately incomplete** and must be
supplemented per customer with whatever shows sensitive data there: the HR package, the case management system, the
banking environment. Names may be an executable (`app.exe`) or an AUMID for Store apps.

One thing stands regardless of these boundaries: the index is subject to the same retention periods and
deletion obligations as the data in it. A retention period of 30 days is a
technical limit, not a legal answer.

**Two sets the comparison rejected:**

- *App and Browser Isolation* (Microsoft Defender Application Guard, 10 settings) appears in
  three IntuneAdmin folders. Microsoft has since deprecated MDAG for Edge; building a baseline
  on a feature that is going away only produces maintenance.
- *MDE Enable file hash computation* sets the old ADMX variant, and to *Disabled* at that, while
  we already have the modern Defender CSP variant switched on in
  `WIN - D - Defender Additional Configuration`. Adopting it would make things worse.

**Third error in the source.** Besides the broken `AccountLockoutPolicy` above: IntuneAdmin's four Windows
AI profiles are called "Enable Paint Cocreator", "Paint Image Creator" and so on, and
set `Disable X` to *Disabled* — so they actually switch those AI features **on**. For an
AI policy that restricts those features it has to be the other way round, so our Restricted variant sets them to 1. Anyone importing those profiles unseen gets the
opposite of what the folder name suggests.

## What IntuneAdmin's ISO 27001 and NIS2 folders yielded

Little, and that is a finding in itself.

- The **ISO-IEC 27001-2022 folder** contains exactly one profile: Microsoft Edge. Of the 47 settings
  from it that we do not set, these are things like `cryptowalletenabled`, `gamermodeenabled`,
  `aigenthemesenabled` and `browseraddprofileenabled`. Those are tidy Edge settings, but they do
  not follow from ISO 27001 and they are not device-critical. Our
  [`Baseline_WIN_D_Microsoft_Edge_Security`](IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.en.md)
  (54 settings) already covers the security side. **None adopted.**
- The **NIS2 folder** contains an Edge and a Windows 11 profile. The Windows 11 profile yielded 11
  settings we do not set. Of those, **four were adopted** (the account lockout
  thresholds and the audit override); the rest dropped out: `donotrequirectrlaltdel` was not in it but
  *was* in CIS, the NTLM audit is already covered by `WIN - D - Disable NTLM`, and
  `sharesthatcanbeaccessedanonymously` uses an `<empty string>` sentinel that I do not want to adopt
  unseen.

Conclusion: IntuneAdmin's standards folders are thin. The substantive gain was in the CIS and
Microsoft Endpoint Security folders, and the accountability *to* ISO 27001 and NIS2 we record ourselves
in `_manifest.json` — as `ISMSTemplate/` does too.

## Mobile: the real gap, and why it is not a BASELINE2 template

iOS and Android together have exactly two policies in `IntuneTemplate/`, both App Protection
(MAM). Both are set to `targetedAppManagementLevels: "unmanaged"` — the phones are **not
enrolled**. That has two consequences:

**Compliance policies for iOS and Android do nothing today.** A compliance policy only affects
an enrolled device, and there are none. They are there anyway — four of them, Device
Health and Password per platform — because the alternative is that the day the first phone
is enrolled is a day without a check, and because "require a compliant device" in
Conditional Access for iOS and Android without a policy is an empty shell: there is then not a single rule
to comply with. They produce no red ticks as long as nothing is enrolled — a
compliance policy without devices reports nothing. Only assign them once devices are actually
being enrolled; until then they are ready and waiting. That caveat is also stated per policy in the manifest.

**The MAM policies, however, are the only thing that affects every phone, and they have three real gaps.**
Compared with UniFy-Endpoint's L2 BYOD variants our set is *stricter* on most points
(outbound data transfer only to managed apps, save-as blocked, printing
blocked, notifications without organisation data, backup blocked, SafetyNet hardware-backed).
What is missing:

| Setting | Us | Them | Why it matters |
|---|---|---|---|
| `filterOpenInToOnlyManagedApps` (iOS) | `false` | `true` | **The most important.** Outbound transfer is already set to "managed apps only", but without this tick the iOS share sheet still offers unmanaged apps. The existing restriction is thus only half there. |
| `screenCaptureConfigurationState` (iOS) | not set | `blocked` | Android already blocks screenshots (`screenCaptureBlocked: true`); on iOS there was no setting for it until iOS 26. Now there is — and the asymmetry is not intended. |
| `previousPinBlockCount` (both) | `0` | `5` | No PIN history: on a reset a user can choose the same PIN again. No friction at all to fix. |

These three are in this folder as `BASELINE2 - IOS/AND - U - App Protection`: a full copy
of the baseline policy with the tightening applied. **Deploy that instead of the baseline variant,
not alongside it.** Two App Protection policies on the same apps do not stack neatly — Intune picks
the strictest value per setting, but which policy supplies a setting can then no longer be
read off. Ultimately the change belongs back in the baseline policy itself; that is a decision about the
baseline agreed *with* the customer, not a clean-up, and that is why it is here first.

Deliberately not adopted from the UniFy sets: `pinRequiredInsteadOfBiometricTimeout` at 30 minutes
(ours: 12 hours — noticeable friction, and the PIN is not the only protection),
`allowedInboundDataTransferSources` at `managedApps` (blocks personal photos in a work document;
the sources do not agree among themselves on this either), `contactSyncBlocked` (breaks name display on
incoming calls) and `minimumRequiredOsVersion` (a hard version number locks users out
and requires maintenance — `minimumWarningOsVersion` is worth considering).

## Deliberately not adopted — Windows and macOS

| Setting / topic | Why not |
|---|---|
| SMB signing "if server/client agrees" | We already set the stricter `digitallysigncommunicationsalways`, on both sides. Adding it is double maintenance. |
| `remoteshell_allowremoteshellaccess` = 0 | CIS L1, but breaks WinRM-based management. Not safe device-wide without first knowing what relies on it. |
| `printers_configurewindowsprotectedprint` | Strong measure (Windows Protected Print Mode), but drops printers with older drivers. Requires an inventory of the printer fleet first. |
| `networkaccess_sharesthatcanbeaccessedanonymously` | Uses an `<empty string>` sentinel in a `SimpleSettingCollection`. I have not been able to verify its behaviour; do not adopt unseen. |
| `cryptography_tlsciphersuites` | An explicit cipher suite order goes stale and silently breaks connections. Belongs in a crypto policy with an owner, not in a baseline. |
| `applicationcontrol` / WDAC / AppLocker / Smart App Control | Missing entirely, and that is the largest substantive gap in the whole baseline. But application control is not a setting you switch on — it is a project with an inventory, an audit phase and an exceptions process. Does not belong in a set that promises "this works for every device". **It is, however, the most important candidate for the next round.** |
| DNS over HTTPS | Did not occur in IntuneAdmin and is not in our set. The baseline does set `turn_off_multicast` (LLMNR). Enforcing DoH requires a decision on which resolver, and that is tenant-specific. |
| `privacy_disableadvertisingid`, `allowcrossdeviceclipboard`, `uploaduseractivities` | Privacy, not security. Belong to a privacy decision by the organisation, not in a security baseline. (Since OIB v4.0 OpenIntuneBaseline itself turns `allowcrossdeviceclipboard` off, in Windows Feature Configuration.) |
| CIS L2 in general | L2 is explicitly "for environments where security takes precedence over functionality". That is the opposite bar to this set. One exception that *was* adopted: PowerShell transcription (L2), because logging policy usually requires that session recording. |
| macOS, beyond the passcode | The comparison with IntuneAdmin and the UniFy sets yielded 12 macOS settings we do not set. Eleven of those are Safari settings that the source actually sets to *allow* (`allowsafariprivatebrowsing_true`) — that is not hardening — and the rest are Kerberos SSO placeholders (`YOURKERBEROSREALM`). **Our 21 macOS policies are ahead of these sources.** |
| iOS/Android device restrictions | The UniFy sets have them extensively (App Management, Connectivity Controls, Device Pairing, Lock Screen). All settings catalog, and those only reach enrolled devices. Same agenda as the compliance policies, but with more choices — that is a round of its own, not a by-catch. |

## Errors we came across in the sources

Both are here because they will turn up again in a next comparison.

1. **IntuneAdmin, NIS2 Windows 11 profile:** `DeviceLock/AccountLockoutPolicy` is set to the bare
   value `"15"`. The CSP expects the three fields as a single string there
   (`"AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15"`).
   As it stands it does nothing. We set the full string.
2. **OpenIntuneBaseline, macOS:** the deprecated PPPC key `Allowed` alongside `Authorization`,
   causing macOS to reject the *entire* TCC payload. Already known and already fixed in `import-oib.js`
   ([OIB issue #62](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/issues/62)).


## Conclusion: 874 profiles versus 141 policies

Those two numbers compare nothing. In its CIS folders IntuneAdmin often uses **one profile per
setting** — 380 separate profiles for Windows 11 alone — whereas this baseline bundles settings
into a manageable policy. The fair comparison is on `settingDefinitionId`:

| | IntuneAdmin | This baseline |
|---|---:|---:|
| Files / policies | 874 | 141 |
| Profiles with settings | 808 | — |
| **Unique settingDefinitionIds** | **1,193** | **1,747** |

Of their 1,193 settings we set **729 (61%)**. Conversely we set **1,018
settings that IntuneAdmin does not have at all** — mostly the OpenIntuneBaseline content
for Windows and macOS, where IntuneAdmin is much thinner.

The 464 that remain, after three rounds of comparison:

| Category | Count | What happens to them |
|---|---:|---|
| Microsoft Edge | 133 | our Edge Security policy already sets 54; the rest is CIS L2 or cosmetic |
| Windows, other | 76 | the last round came from here; what remains was weighed one by one and dropped |
| Google Chrome | 34 | only relevant where Chrome is a managed browser; not part of this set |
| AVD / Windows 365 / RDS | 34 | belongs in a separate set for Cloud PCs and session hosts |
| Apple and Android restrictions | 40 | require enrolment; on the agenda with the first enrolled phone |
| Legacy/ADMX leftovers | 30 | Windows Media Player, Help and Support, MSS timers |
| Firewall profile variants | 29 | our firewall policy already sets the three profiles; these are Hyper-V/WSL variants |
| Defender | 22 | mostly App Guard (deprecated) and scan settings we already set differently |
| Linux | 15 | no Linux |
| Other | 51 | hiding the Defender UI, Visual Studio, OneDrive, Office, WSL, Teams |

What the last round still yielded is below. After that the bottom of this source has been reached:
what is left now is not applicable, duplicate, or deprecated.

| Addition | Why |
|---|---|
| `WIN - D - Defender Ransomware Protection` (153) | Modern ransomware does not encrypt the device it lands on but the shares around it. The whole baseline looked at what happens *on* the device; this is the first that looks at what the device does to *others*. Block at Low: only at 100% certainty, because a false positive here hits a backup or sync tool. |
| `Attachment Scanning` + Mark of the Web | Zone information on a downloaded file is preserved. That mark is what Office Protected View and SmartScreen rely on; if it disappears, a download opens as if it came from the local disk. |
| `Logon Hardening` + two | The user's email address no longer appears on the sign-in screen, and connected users are not enumerated. |
| `Privacy and Telemetry` + six | Search location, SMS sync, consumer content, online tips, font providers and sharing app data between users. All six CIS L1. |
| `Remote Access Hardening` + WinRM server management | The broader variant next to the remote shell: no incoming WinRM connection at all any more. |
| `Audit Policy Enforcement` + OneSettings auditing | Windows records when it fetches configuration from the OneSettings service. |

Deliberately *not* adopted in this round: IntuneAdmin's scan settings (our
Defender policy already sets a daily quick scan at 11:00 — their schedule would cut right
across it), blocking read access to removable media (we block writing; blocking reading
breaks too much), and the seven CIS user rights that have to be set to "nobody" — an empty
value collection cannot be reliably encoded in the settings catalog and IntuneAdmin itself fills them
with a placeholder.

## What needs to happen now

| # | Step | |
|---:|---|---|
| 1 | BASELINE2 on a pilot group | especially `Kernel DMA Protection` (test with the docks from the fleet) and `Logon Hardening` (announce CTRL+ALT+DEL to users in advance) |
| 2 | Decision on the three MAM settings | a change to the agreed baseline; can still be done now without migration |
| 3 | ~~Check the ISMP mapping in `_manifest.json`~~ | dropped: the mapping to one organisation's ISMS documents was removed from the manifest in September 2026, so the baseline is generic. ISO 27001, NIS2 and Part-IS are still there |
| 4 | Happy with a policy? | move it to `IntuneTemplate/` under the `Baseline_` name, with checkId and assignment |
| 5 | Next round | application control (WDAC/Smart App Control), and iOS/Android compliance as soon as phones are enrolled |

# Round OIB Windows v4.0 (14 September 2026)

OpenIntuneBaseline Windows v4.0 ("26H2 Edition") was adopted from branch `windows-v4.0` at
commit `f247604` (9 September 2026). **That version had not yet been released** — the CHANGELOG
still gives the date as `2026-09-xx`. Once the tag exists: point `.oib-source` at that tag and go through the
diff again. macOS (v1.0) and BYOD have not changed.

## How, and why not with `import-oib.js`

A full run of `import-oib.js` currently reverts manual work that was put into the templates
after earlier imports: the URL block list that moved from Edge User Experience to AI Usage Control,
three App Protection values (`previousPinBlockCount`, `screenCaptureConfigurationState`,
`filterOpenInToOnlyManagedApps`) that are not in the manifest as `veldOverrides`, and the policies
with neither `source` nor `type` (wifi, OS Version, iOS/Android compliance), which the importer treats as
Settings Catalog and moves to the wrong folder. That is why the differences between
v3.x and v4.0 were applied per setting to the existing templates: what OIB removed taken out, what OIB
added put in, and a changed value only if our template still had the old OIB value (plus
our overrides). Those three points need to be recorded in the manifest before the importer
is safe to run again.

**Resolved on 14 September 2026.** The URL block list is now a `dropSettings` entry on Edge User
Experience (and no longer counts as "OIB covers it", so AI Usage Control keeps it), the
App Protection values are `veldOverrides` (`screenCaptureConfigurationState` with
`toevoegen`, because the source does not supply that field), policies without `source` and `type` keep the
Type of their existing template, `dropSettings` also applies to adopted own settings,
`auditRuleInformation` is stripped and templates end with a newline as
`set-packages.js` writes them. One full run afterwards only corrected descriptions and the
order of settings; a second run writes nothing.

## What changed

| | |
|---|---|
| **Compliance** | Four bundled policies (Device Health, Device Security, Defender for Endpoint, Password) become nine separate ones: TPM, Firewall, Antivirus, Antispyware, Secure Boot, Code Integrity, BitLocker, Defender Security Intelligence and Defender Real Time Protection. Password is dropped: those requirements run through the EAS engine, are enforced rather than checked, and only affect local accounts. Locking after 15 minutes is now in Device Lock. checkId 093–096 have been retired; `_renames.json` says for each old policy where it ended up. |
| **Local Security Policies / LAPS** | The 24H2+ variants are the only ones. For LAPS nothing changes in substance; Local Security Policies now disables the built-in Administrator account. LAPS manages its own account, so that does not affect recovery. |
| **Defender** | Moderate and high to quarantine (was remove); exploit protection overrides by users blocked; the extended Windows Security notifications off (fewer superfluous notifications). |
| **Edge** | Five security settings from the Edge v151 baseline (process isolation, renderer app container, network service sandbox, code integrity guard); no sign-in with non-Microsoft accounts; no automatic download of local AI models; new policy **Microsoft Edge Management** (phase 2). |
| **Office** | Six settings from the M365 Apps baseline 2512. |
| **Other** | In-Box App Removal to the list variant; cross-device clipboard off; sensitive privilege use on Success only; IE mode TLS 1.2 and 1.3; sleep on AC power 30 minutes. |

## Where we deliberately deviate

| Setting | OIB v4.0 | Us | Why |
|---|---|---|---|
| `submitsamplesconsent` | send all samples automatically | send safe samples automatically | all samples also sends documents containing personal data to Microsoft without asking |
| Grace period Defender Security Intelligence | immediate (in the export) | 6 hours | the CHANGELOG itself says 0.25 days; immediate makes every laptop coming out of sleep briefly non-compliant |
| Microsoft Edge Management | — | phase 2 | reverses precedence: policy from the Edge Management Service wins over the Edge policy from this baseline |

## Duplicates cleaned up

Four of our own settings are now set by OIB itself, with the same value. They were removed from our policy
so they do not come from two policies: `machineinactivitylimit_v2` (Local Security Policies → Device
Lock), `disallowexploitprotectionoverride` (Threat Protection → Defender Additional Configuration),
`preventdevicemetadatafromnetwork` (Wireless and Peripherals → Windows Feature Configuration) and
`allowcrossdeviceclipboard` (Privacy and Telemetry → Windows Feature Configuration). The two bare
`apps.microsoft.com` rules that OIB removed from the URL block list have also been removed from both AI Usage
Control variants.

## Generic

The baseline bore traces of one organisation: the numbering of its ISMS documents
(`controls.isms` and ISMP references in the explanations), a storage account and LaunchAgent label
in the mount scripts, the admin account in the macOS enrolment profiles, and two customer reports.
Those are gone or replaced by placeholders; the reports are in the git-ignored `local/`.
Note: they are still in the git history.

# macOS fixes (14 September 2026)

Three errors in existing policies, found during the comparison with OpenIntuneBaseline
macOS v2.0 beta, UniFy and intune-my-macs:

| Policy | What was wrong | Now |
|---|---|---|
| `MAC - U - Compliance Device Security` | required *block all incoming connections*, while `MAC - D - Firewall and Gatekeeper` sets that setting to false — a Mac that followed the baseline exactly was non-compliant | requirement set to false, as a `veldOverride`; firewall and stealth mode remain required |
| `MAC - D - Software Updates` | the three automatic actions were set to `_0`, which is *Allowed*: the user chooses, nothing was enforced | AlwaysOn (`_1`) |
| `MAC - D - FileVault` | the personal recovery key was not explicitly created and showing it was not turned off | `userecoverykey` true and `showrecoverykey` false, as overrides with `parent` |

# Enrolled phones keep access (14 September 2026)

The App Protection policies for iOS and Android were set to `targetedAppManagementLevels:
unmanaged`. A phone that enrolled therefore fell outside App Protection, and Conditional
Access 2070 — which requires a compliant app for iOS and Android — then no longer allowed Outlook and Teams on that
device. Both policies are now set to `unspecified`: they apply to every device,
enrolled or not. 2070 now accepts a compliant device *or* a compliant app, and
excludes the Intune Enrollment app so that enrolment itself does not get stuck (see round 4 in
CA-Policies/ANALYSE.md).

At the same time three values that were tightened by hand after the OIB import are now in the manifest as
`veldOverrides`: `previousPinBlockCount` (iOS and Android),
`screenCaptureConfigurationState` and `filterOpenInToOnlyManagedApps` (iOS). A future
`import-oib.js` run therefore no longer reverts them.


# Compliance framework round: ISO 27001, NIS2, CIS and NIST CSF (14 September 2026)

The question: make the baseline so extensive and well-founded that a CISO can use it to account for ISO/IEC 27001:2022, NIS2,
CIS Controls v8.1 and NIST CSF 2.0 — for all four platforms and for
Conditional Access. Carried out as six work packages against one specification; every setting was
verified against the Intune definitions (pl4nty/intune-change-tracking, Graph) before it went
in, and everything was merged with `check-scope.js` green.

## What was added

38 new policies; the baseline now has 193 (was 155). New policies are almost all
in phase 2 to 5: they exist, but only roll out after a pilot, a prerequisite (an enrolled
device, a licence, a connector) or a customer decision.

| Platform | New | Policies |
|---|---:|---|
| Android | 11 | `AND - U - Work Profile Restrictions` (phase 3), `AND - U - Compliance Corporate Device Health` (phase 3), `AND - U - Compliance Corporate Password` (phase 3), `AND - D - System Updates` (phase 3), `AND - U - Corporate Device Security` (phase 3), `AND - U - Corporate Data Protection` (phase 2), `AND - U - Corporate AI Restricted` (phase 2), `AND - U - Compliance Block Device Administrator` (phase 3), `AND - U - Compliance Defender for Endpoint` (phase 3), `AND - U - Compliance Corporate Defender for Endpoint` (phase 3), `AND - D - Compliance Dedicated Device Health` (phase 4) |
| iOS/iPadOS | 11 | `IOS - D - Enterprise SSO` (phase 3), `IOS - D - Passcode` (phase 3), `IOS - D - Software Updates` (phase 3), `IOS - D - Restrictions Corporate` (phase 4), `IOS - D - Data Protection` (phase 3), `IOS - D - Apple Intelligence Restricted` (phase 3), `IOS - D - Apple Intelligence Permitted` (phase 5), `IOS - D - Lock Screen` (phase 4), `IOS - U - Compliance Defender for Endpoint` (phase 3), `IOS - D - Defender for Endpoint Onboarding Supervised` (phase 4), `IOS - D - Defender for Endpoint Onboarding Unsupervised` (phase 4) |
| macOS | 8 | `MAC - D - Screensaver` (phase 2), `MAC - D - Apple Intelligence Restricted` (phase 2), `MAC - D - Apple Intelligence Permitted` (phase 5), `MAC - D - Restrictions Hardening` (phase 2), `MAC - D - Recovery Lock` (phase 2), `MAC - D - Login Window` (phase 2), `MAC - D - Time Server` (phase 1), `MAC - D - External Storage Read Only` (phase 5) |
| Windows | 8 | `WIN - D - Network Authentication Hardening` (phase 2), `WIN - D - Windows Component Hardening` (phase 2), `WIN - U - File Sharing Restrictions` (phase 2), `WIN - D - Security Log Monitoring` (phase 2), `WIN - D - Windows Event Forwarding` (phase 3), `WIN - D - Microsoft Edge DNS over HTTPS Automatic` (phase 2), `WIN - D - Microsoft Edge DNS over HTTPS Secure` (phase 5), `WIN - U - Compliance Defender for Endpoint Risk` (phase 3) |


In addition:

- **Corrections to existing policies**: Android Compliance Password (text contradicted the JSON),
  Android Device Health (minimum patch level), iOS App Protection (widget sync off), macOS Software
  Updates (Enforce Latest after 30 days, beta off), Firewall and Gatekeeper (XProtect upload after prompt),
  Edge Security on macOS (no SSL error override).
- **[`extras/`](extras/README.en.md)**: what is not a CIPP type — enrolment restrictions, app configuration,
  assignment filters, App Control for Business, DNS over HTTPS for Windows, remediations for
  BitLocker/LAPS escrow, Escrow Buddy, Apple Business checklists.
- **Compliance framework**: every policy has `controls` (iso, nis2, cis, nistcsf) from the vocabulary in
  `IntuneTemplate/_controls.json`. `check-scope.js` rejects a policy without a label or with an unknown
  one; `scripts/generate-compliance.js` turns them into [`COMPLIANCE.md`](COMPLIANCE.en.md): Annex A matrix,
  NIS2 per measure with evidence route, CIS and CSF coverage, customer decisions and a starting point for the
  Statement of Applicability. Of the 38 existing mappings, 34 were normalised or
  corrected.
- **Conditional Access** (round 5 in CA-Policies/ANALYSE.md): `2060` excludes iOS/Android, P2 and
  token protection templates are optional, `1100` on alongside `1090`, `2055`/`2120` report-only,
  `2180` excludes guests, new `1190` insider risk, and `controls/ca-controls.json` with a test.
- **`import-oib.js`** is idempotent again (see the section on OIB v4.0 above).

## Benchmark coverage

| Benchmark | Status |
|---|---|
| CIS Microsoft Windows 11 Enterprise L1 | 329 of 378 unique settings (87%); the rest is covered via update rings, default value, or deliberately not (NIST password rules, user rights "nobody", SMB signing "if agrees", ESS) |
| CIS Apple macOS 26 L1 | 38 of 97 rules (was 21); of the rules with an MDM key, 30 of 50. 47 rules can only be done by script or manually |
| CIS Microsoft 365 Foundations 5.2.2 (CA) | 11 of 17 covered, 5 partly, 1 deliberately not (5.2.2.10 breaks WHfB and Autopilot registration) |
| CIS iOS/iPadOS and Android | corporate and BYOD restrictions, passcode, updates and compliance present; in phase 3/4 until there are enrolled devices |

## What was deliberately not done

- **App Control for Business as a template**: the `settingInstanceTemplateId` cannot be verified generically;
  it is in `extras/windows/app-control/` with a script that fetches the ids from your own tenant.
- **Defender for Endpoint onboarding on macOS**: requires the tenant-specific onboarding XML; route in
  `extras/macos/defender-onboarding/`.
- **Requiring SMB encryption and enforcing Kerberos armoring**: break things without an inventory.
- **External storage read-only on macOS** is in phase 5: macOS then does not mount an ordinary USB disk
  at all, so reading is gone too.
- **iOS Enterprise enrolment profile as a Catalog template**: template ids cannot be verified; as a
  Graph body in `extras/ios/enrollment/`.

## Open items

1. **Template ids in the macOS enrolment profiles** (`Baseline_MAC_D_Enrollment_Profile_*`, since
   27 August 2026) have a suspiciously regular pattern and cannot be verified anywhere. Compare them once
   against an export from a tenant.
2. **ISO labels**: 16 labels follow the established form in this manifest and not literally the NEN title
   (COMPLIANCE.md does show that). Converting is one edit in `_controls.json` plus the manifest.
   The NEN titles come from a public SoA, not from the standard itself; the CSF titles and the paragraphs of
   Implementing Regulation (EU) 2024/2690 have not been checked verbatim.
3. **COMPLIANCE.md without CA**: `CA-Policies/controls/ca-controls.json` has existed since 15 September 2026
   (41 CA policies, the same vocabulary as `_controls.json`), so a version with CA is now available:
   `node scripts/generate-compliance.js --strict --ca ../CA-Policies/controls/ca-controls.json`.
   What is in git is deliberately the `--no-ca` version, because that is what the workflow regenerates — the
   other line would open a PR on every CI run that reverts it. It makes the most difference for NIS2 (j):
   3 Intune policies without CA, 13 with. Choosing one line is still possible, and then this one: fill
   `secrets.CA_POLICIES_TOKEN` and remove the comment on the CA checkout in
   `.github/workflows/generate-baseline.yml` (the repo is already in it: `sjkanon/CA-Policies`), and in
   the same workflow replace `--no-ca` with `--ca .ca-policies/controls/ca-controls.json`.
4. **OIB macOS v2.0**: with that import OIB's Restrictions will itself set Apple Intelligence and hardening ids;
   the Restricted/Permitted pair and Restrictions Hardening will then have to be compared against the source again.
5. **CA**: check whether CIPP sends `insiderRiskLevels` along (otherwise `1190` blocks everyone); decision
   on `3010` to 4 hours (CIS); the platform engine does not yet compare insider and agent conditions.
6. **Not tested on real devices**: the new macOS, iOS and Android policies and the scripts in
   `extras/`. First one pilot device per platform.
