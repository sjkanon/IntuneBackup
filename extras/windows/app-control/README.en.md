[Nederlands](README.md) · **English** · [Français](README.fr.md)

# App Control for Business (WDAC) — generic starting point

The biggest substantive gap in the baseline (ANALYSE.md, *Deliberately not adopted*):
there was no application control. This is the generic part that is the same for every tenant.
The exceptions that follow are per organisation and do **not** belong in this repo.

| | |
|---|---|
| **Controls** | ISO A.8.19 Installation of software on operational systems, A.8.7 Protection against malware · NIS2 art. 21(2)(e) security in acquisition, development and maintenance, incl. vulnerabilities · CIS Controls v8.1 2.5 Allowlist Authorized Software, 2.6 Allowlist Authorized Libraries, 2.7 Allowlist Authorized Scripts · NIST CSF 2.0 PR.PS-05 |
| **Benchmark** | CIS Controls IG2/IG3; ASD Essential Eight *Application control* (maturity level 1); Microsoft *App Control for Business design guide* |
| **Prerequisites** | Windows 11 Pro/Enterprise/Education (Pro with the November 2022 update or later), enrolled in Intune; co-managed: *Endpoint Protection* workload on Intune. Advanced Hunting requires Defender for Endpoint P2 or Business. |

## Why this is not a template in `IntuneTemplate/`

App Control policies are Endpoint security policies on template
`d3849ba8-bf95-467c-9640-aa2334eae9e3_1` (*App Control for Business*, family
`endpointSecurityApplicationControl`; that is how it exists in `pl4nty/intune-change-tracking`
DCv2/Templates and how Microsoft365DSC uses it). Such a body requires a
`settingInstanceTemplateId` per setting. That id is **not** in the definition source — pl4nty mirrors the
templates without their `settingTemplates` — and the only place we found it (a unit-test mock
in Microsoft365DSC) is not proof. The SPEC only allows verifiable ids, so the body is
here with a placeholder and a script that fetches the real id from your own tenant.

What *has* been verified against `DCv2/Settings/` (id, type, valid `itemId`s):

| settingDefinitionId | Value audit | Value enforce |
|---|---|---|
| `device_vendor_msft_policy_config_applicationcontrolv2_buildoptions` | `…_built_in_controls_selected` | same |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_auditmode` | `…_auditmode_enabled` | `…_auditmode_disabled` |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_trustappswithgoodreputation` | `…_enabled` | `…_enabled` |
| └ `device_vendor_msft_policy_config_applicationcontrolv2_trustappsfrommanagedinstaller` | `…_enabled` | `…_enabled` |

The older variant on template `4321b946-b76b-4450-8afd-769c08b16ffc_1`
(`applicationcontrol_policies_{policyguid}_policiesoptions` → `built_in_controls` →
`enable_app_control` + `trust_apps`) still exists, but Microsoft365DSC and the current portal
use the v2 ids. Do not add it alongside this one.

## Files

| File | What |
|---|---|
| `AppControl_BuiltIn_Audit.graph.json` | `POST /beta/deviceManagement/configurationPolicies` — Windows components + Store apps trusted, ISG (good reputation) and managed installer trusted, **audit mode**. Name `[Baseline] - WIN - D - App Control Audit`. |
| `AppControl_BuiltIn_Enforce.graph.json` | Same body, **enforce**. Name `[Baseline] - WIN - D - App Control Enforced`. Never together with the audit policy on the same device. |
| `Set-AppControlTemplateIds.ps1` | Fetches the `settingInstanceTemplateId` (and `settingValueTemplateId`) from `GET /beta/deviceManagement/configurationPolicyTemplates('d3849ba8-bf95-467c-9640-aa2334eae9e3_1')/settingTemplates`, fills them into both bodies and optionally creates the policies (`-Create`, no assignment). |
| `hunting-queries.kql` | Advanced Hunting queries for the audit phase and for monitoring after enforcement. |

## The process

Application control is not a setting but a project. The order below is that of the
Microsoft documentation, translated into the phases of this baseline.

### 0. Enable the managed installer — now, without consequences

Intune admin center → **Endpoint security → App Control for Business → Managed installer →
Create**, *Enable Intune Managed Extension as Managed Installer* = **Enabled**, assign to
all Windows devices.

- From that moment **every app that Intune installs** (Win32, LOB, Store via IME) gets the
  managed installer tag. The tag does nothing by itself: only an App Control policy with
  *Trust apps from managed installers* turns it into a permission.
- **Not retroactive.** What is already installed has no tag. That is exactly why
  this comes first, then weeks of audit, and only then enforcement.
- Intune deploys an AppLocker policy with a dummy rule for this. If there is already AppLocker policy
  with an empty *NotConfigured* RuleCollection, that merge can block everything
  (up to and including sign-in) — remove such collections beforehand. If AppLocker is not used anywhere,
  there is nothing to worry about.
- Since August 2025 Microsoft describes this as a policy per group instead of a single
  tenant setting; Graph has no stable, documented type for it that CIPP carries —
  hence a manual step.

### 1. Audit — phase 2, pilot group, then all devices

Create `AppControl_BuiltIn_Audit.graph.json` (see *Deployment*) and assign it to the pilot group
(`SEC-Baseline-Pilot`), after a week to all Windows devices. In audit mode everything keeps
running; Windows logs per file what **would** have been blocked:

| Event | Log | Advanced Hunting `ActionType` |
|---|---|---|
| 3076 — would have been blocked (audit) | Microsoft-Windows-CodeIntegrity/Operational | `AppControlCodeIntegrityPolicyAudited` |
| 3077 — blocked (enforce) | same | `AppControlCodeIntegrityPolicyBlocked` |
| 3089 — signature information for 3076/3077 | same | `AppControlCodeIntegritySigningInformation` |
| 3090/3091/3092 — allowed/audited/blocked based on ISG or managed installer | same | `AppControlCodeIntegrityOrigin*` |
| 8028/8029 — script/MSI audited/blocked | Microsoft-Windows-AppLocker/MSI and Script | `AppControlCIScriptAudited` / `…Blocked` |
| 3099 — policy loaded | CodeIntegrity/Operational | `AppControlCodeIntegrityPolicyLoaded` |

Let the audit run for at least **30 days**, including a month-end close: periodic tools
(payroll, year-end close, printer drivers) otherwise only show up after enforcement.
Enlarge the CodeIntegrity log beforehand with `../event-log-sizes/`.

### 2. Exceptions — per organisation

Queries 2 and 3 in `hunting-queries.kql` give per file: path, publisher, hash, how many
devices. A decision per row:

1. **(Re)install via Intune** — the preferred option. Gets the managed installer tag and is
   automatically covered by the base policy. Applies mainly to apps deployed before step 0.
2. **Supplemental policy** — for what does not come via Intune (developer tools updated by the user,
   vendors' portable apps). Create XML with the
   [App Control Policy Wizard](https://webapp-wdac-wizard.azurewebsites.net/) or
   `New-CIPolicy -Level Publisher -Fallback Hash`, set `BasePolicyID` to the PolicyID of the
   built-in controls combination, and deploy via **Create Policy → Enter xml data** with the same
   assignment as the base policy. For audit + ISG + managed installer that PolicyID is
   `{2DA0F72D-1688-4097-847D-C42C39E631BC}` (Microsoft Learn, *Manage App Control*). Preference:
   publisher rules over hash rules (hashes break with every update), never path rules on
   user-writable paths.
3. **Remove** — software that does not belong there. Then the audit has already paid off.

These exceptions are organisation-specific and belong in your own tenant, not in this repo.

### 3. Enforce — phase 4

Only when query 2 shows nothing unknown over seven days: assign
`AppControl_BuiltIn_Enforce.graph.json` to a group `SEC-AppControl-Enforced` and
**remove that group from the assignment of the audit policy**. Both policies have the same
PolicyID; on one device they conflict. Expand per department, not all at once.

Enforcement does not require a restart (rebootless base policy). However:

- **Rolling back:** first reassign the audit policy (or an `AllowAll` policy), only then
  remove the enforce policy. A removed App Control policy stays active until the next restart;
  Microsoft also warns about boot problems when removing policies from or unenrolling
  devices with enforced policies — follow *Remove App Control policies causing boot stop
  failures* on Microsoft Learn.
- **Monitoring:** queries 1 and 4 daily; every 3077 is a user who could not start something.

## Deployment

```powershell
Connect-MgGraph -Scopes DeviceManagementConfiguration.ReadWrite.All
./Set-AppControlTemplateIds.ps1              # fills in the placeholders, writes *.resolved.json
./Set-AppControlTemplateIds.ps1 -Create      # same, and creates both policies without assignment
```

Via CIPP: first fill in the ids with the script, then import the `*.resolved.json` as an
Endpoint security template into your own CIPP instance; CIPP's `IntuneTemplate` type carries the
`templateReference` block along.

## What this does *not* cover

- **Smart App Control** — only on cleanly installed devices, cannot be managed centrally
  and switches itself off on managed devices. Not an alternative to this project.
- **AppLocker profiles** under Attack surface reduction — phased out by Microsoft in favour
  of the ApplicationControl CSP.
- **Drivers** — the Microsoft vulnerable driver blocklist is already enabled via HVCI
  (Device Guard and Credential Guard) and the ASR rule *Block abuse of exploited vulnerable signed
  drivers*.
