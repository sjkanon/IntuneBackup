[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Defender for Endpoint onboarding on macOS

How a Mac is onboarded to Microsoft Defender for Endpoint — and why there is no
generic template for it in this repo.

## The gap

The baseline does prepare Defender on macOS —
[`MAC - D - Defender for Endpoint`](../SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.en.md)
(system extensions, network filter, full disk access, notifications) and
[`MAC - D - Defender Antivirus`](../SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.en.md)
(real-time protection, tamper protection) — but **does not onboard the Mac anywhere**. Without onboarding
the agent runs unlicensed: `mdatp health` reports `licensed: false`, no
EDR signals reach the Defender portal and the compliance check in
[`IntuneTemplate/MAC/ComplianceScripts/`](../ComplianceScripts/README.en.md) stays red.

## Can it be done generically, as on Windows? No.

On Windows, `[Baseline] - WIN - D - Defender for Endpoint EDR` sets the setting
`device_vendor_msft_windowsadvancedthreatprotection_onboarding_fromconnector`: Intune fetches the
onboarding package itself via the Defender connector, so the template contains nothing tenant-specific.

For macOS that route does not exist (checked September 2026):

| Searched | Result |
|---|---|
| settings catalog (`pl4nty/intune-change-tracking`, 18,329 definitions) for `onboard`, `wdav.atp`, `orgid` | only the two Windows ids and an Office setting; no macOS onboarding |
| Endpoint security template *Endpoint detection and response* for macOS (`a6ff37f6-c841-4264-9249-1ecf793d94ef_1`, technologies `mdm,microsoftSense`) | contains only device tags (`com.apple.managedclient.preferences_tags`) and group ids (`…_groupids`) — no onboarding package, no connector option |
| Microsoft Learn — *Deploy Microsoft Defender for Endpoint on macOS with Intune* (updated 9 September 2026), steps 13–14 | download the onboarding package `WindowsDefenderATPOnboarding.xml` from the Defender portal and upload it as a **custom configuration profile** |

That XML file contains the tenant's organisation id and onboarding data. A CIPP template
(`macOSCustomConfiguration`, Type `Device`) would be technically possible, but then each tenant has
a different file in the payload — the opposite of a generic baseline, and a secret in the
repo. A placeholder does not work: the payload is base64 of a plist that macOS must be able to read.

## The route (per tenant, once)

Prerequisites: a Defender for Endpoint Plan 1/2 or Microsoft 365 E3/E5/Business Premium licence,
and the **Microsoft Defender for Endpoint connector** turned on in Intune (Endpoint security →
Microsoft Defender for Endpoint → *Connect macOS devices … to Microsoft Defender for Endpoint*: On).

1. **Configuration first.** Assign `MAC - D - Defender for Endpoint` and `MAC - D - Defender Antivirus`
   before the app and the onboarding package (Microsoft: "Deploy the required configuration profiles
   before you deploy the Defender for Endpoint app and onboarding package").
2. **App.** Apps → macOS → Add → *Microsoft Defender for Endpoint (macOS)*, default values,
   assign to the same device group. (An app assignment is not a CIPP policy type; that is
   why this step is here.)
3. **Download the onboarding package.** Defender portal → Settings → Endpoints → Onboarding →
   macOS, Connectivity type *Streamlined*, Deployment method *Mobile Device Management / Microsoft
   Intune* → Download. From the zip: `intune/WindowsDefenderATPOnboarding.xml`.
4. **Profile.** Devices → macOS → Configuration → Create → Templates → **Custom**. Name
   `[Baseline] - MAC - D - Defender for Endpoint Onboarding`, deployment channel *Device channel*,
   file `WindowsDefenderATPOnboarding.xml`. Assign to the same group.
5. **Verify.** On the Mac: `mdatp health --field licensed` → `true`, and
   `mdatp health --field org_id` shows the tenant. The device appears in the portal within
   about an hour. EDR test: Microsoft Learn *EDR detection test*.
6. **Compliance.** Only then assign the custom compliance from `IntuneTemplate/MAC/ComplianceScripts/`, and — if the
   organisation wants to steer on risk level — `deviceThreatProtectionEnabled` in the
   macOS compliance.

Do **not** store the XML file in this repo. The package does not expire, but whoever has it can
onboard devices to the tenant.

## What the existing policy still lacks (for the next OIB import)

Microsoft's list of required profiles compared with `MAC - D - Defender for Endpoint`
(OpenIntuneBaseline macOS v1.0):

| Microsoft Learn | Now | OIB macOS v2.0 beta |
|---|---|---|
| Background services for `com.microsoft.wdav` | only rules for `com.microsoft.fresno` and `com.microsoft.dlp` | adds `com.microsoft.wdav`, with team id |
| Allowed System Extension **Types** `Network` and `EndpointSecurity` | not set (only the extensions themselves) | not set |
| Notifications for `com.microsoft.autoupdate2` | only `com.microsoft.wdav.tray` | yes |

Those points belong in the import of OIB macOS v2.0 once it is out of beta; they have not been built in
separately here because the policy comes from OIB and a second `com.apple.servicemanagement` profile alongside
the existing rules makes management confusing. The Endpoint security EDR template (tags)
is optional and organisation-specific; not included.

## Standards

Onboarding is what actually fulfils A.8.7 (protection against malware), A.8.16 (monitoring activities), NIS2
art. 21(2)(b) (incident handling) and CIS Controls v8.1 10.1 / 13.7 (host-based intrusion
prevention) on a Mac; the configuration policies alone do not.
