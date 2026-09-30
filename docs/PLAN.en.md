[Nederlands](PLAN.md) · **English** · [Français](PLAN.fr.md)

# Plan: from 24 in-house policies to a baseline built on OpenIntuneBaseline

Goal: extend the baseline and keep it current based on
[OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline), with an
explicit platform and device/user split — and with a separate tenant layer (ScubaGear / Maester) as the final piece.

Status: **phases 1, 2, 4, 5, 6 and 7 are done** (repo). Phase 3 (the tenant) and phase 8 are
still open. The tenant has not been touched yet.

| Phase | What | Risk | Status |
|---|---|---|---|
| 1 | Script changes (`check-scope.js`, `-Scope`, hard assignment check) | low | ✅ |
| 2 | D/U renaming + 2 splits in `IntuneTemplate/` | low in the repo | ✅ |
| 4 | Compliance policies (pipeline work + 7 policies) | medium | ✅ |
| 5 | Closing hardening gaps from OIB | medium | ✅ |
| 6 | Update rings | low | ✅ |
| 7 | Splitting Administrative Templates by theme | medium | ✅ |
| — | macOS, BYOD and the platform axis in the naming | medium | ✅ |
| 3 | **Tenant migration** via `Rename-BaselinePolicy.ps1` | **high** — `-WhatIf` first, in a pilot tenant first | open |
| 8 | Tenant layer ScubaGear/Maester | separate track | open |

Phase 3 deliberately comes after the rest: the repo is now complete and the tenant can be brought
up to date in one go, instead of being renamed twice in a row.

---

## What has happened in the repo

24 → 95 policies. The source is now `IntuneTemplate/_manifest.json` plus
`scripts/import-oib.js`; see [README.en.md](../README.en.md) for the layout, the naming and how to
pull in a new OIB version.

**Phases 1 and 2** (earlier): device/user split, renaming to `[Baseline] - D/U - Item`,
`check-scope.js` as a blocking CI step.

**Phase 4 — compliance.** There were none. Without a compliance policy, "require a compliant
device" in Conditional Access is meaningless. There are now 7 (4 Windows, 3 macOS), with a
new CIPP `Type` `deviceCompliancePolicies` and the folder `Device Compliance Policies` in the
export.

**Phase 5 — hardening.** The entire OIB Windows set has been adopted: Windows Hello for Business,
Cloud Kerberos Trust, Credential/Device Guard, Local Administrators, Office Security (D and U),
the Edge split, Disable NTLM, Administrator Protection, Config Refresh, In-Box App
Removal, Delivery Optimisation, Personal Data Encryption, Windows Sandbox, WSL, Package
Manager, Script File Associations, Timezone and more. 15 existing policies have been rewritten on
OIB content; the settings OIB does not have were kept (see point 2 in the README under
"Updating OpenIntuneBaseline").

**Phase 6 — update rings.** Ring 1 (Pilot) and Ring 2 (UAT) added next to the existing Ring 3,
plus the three Defender antivirus update rings. Ring 1 and 2 deliberately have no assignment.
Driver update profiles stay out of scope: IntuneBackupAndRestore 4.0.1 does not support them.

**Phase 7 — Administrative Templates split up.** The block of 300 settings has been divided
into Internet Explorer Legacy (204), Security Hardening (41), Printing (13), Remote Desktop and
RPC (9) and some smaller ones. The 15 settings with no OIB counterpart are in
`WIN - D - Legacy Hardening`, kept separate so an OIB upgrade neither drags them along nor throws them away.

**Platform axis.** All policies are now named `[Baseline] - <WIN|MAC|IOS|AND> - <D|U> - <Item>` and
live in `IntuneTemplate/<PLATFORM>/<POLICYTYPE>/`. macOS (20 policies) and BYOD app protection
for iOS and Android (2) are new.

---

## Phase 3 — Tenant migration

This is the risky part. The policies already exist in the tenant under their old name, and some
have been replaced in substance.

`IntuneTemplate/_renames.json` records per policy what it used to be called (both the original
name and the intermediate step from phase 2) and what belongs to it now. `scripts/Rename-BaselinePolicy.ps1`
carries that out with a `PATCH`: the name changes, the id stays, all existing assignments and
assignment history remain intact.

**Do not redeploy.** `Start-IntuneRestoreConfig` creates policies by name. Under a
new name that produces **duplicates** alongside the old ones — two policies with overlapping,
possibly conflicting settings on the same devices. Only do this in an empty tenant.

Order:

1. **Take inventory** with `Get-BaselinePolicyState.ps1` (see below) — before you change anything.
2. `Rename-BaselinePolicy.ps1 -WhatIf` → check that every old name is found exactly
   once.
3. Rename.
4. The `replace` cases by hand: `Windows Firewall` (Settings Catalog → Endpoint
   Security template) and `Microsoft Office Updates` (ADMX → Settings Catalog). Old one out, new
   one in, in that order.
5. Delete the `retire` cases: Network Security, Windows Search, System Services,
   OneDrive KFM. `replacedBy` in `_renames.json` says where their settings live now.
6. Deploy the ~65 new policies via CIPP or `Start-IntuneRestoreConfig`.
7. `Set-BaselineAssignment.ps1 -Scope D -AllDevices` and `-Scope U -AllUsers`, `-WhatIf`
   first. For the existing policies it should report "already assigned".
8. Call `Invoke-IntuneRestoreAppProtectionPolicyAssignment` separately (see README).
9. **Take inventory again** — the list of orphaned policies must be empty.

The pilot (phase 2) is not included in step 7: `-AllDevices` and `-AllUsers` only take what is in
phase 1. It follows separately with `-GroupName 'SEC-Baseline-Pilot'` — the list is in
[OVERZICHT.en.md](OVERZICHT.en.md#pilot-first).

### What if policies with the old name are still in the tenant

That scenario is not theoretical: a rename that stops halfway, a policy someone
renamed by hand earlier, a second tenant where CIPP was still deploying under the old name. Two
ways this goes wrong:

**1. Conflicting settings.** Two Settings Catalog policies that set the same
`settingDefinitionId` to a different value produce a *Conflict* — the
setting is then applied by neither of them. With 95 policies that risk is greater than
with 24; `check-scope.js` now checks it within the repo, but not what is left behind
in the tenant.

**2. Silent assignment drift.** `Set-BaselineAssignment.ps1 -Scope D` filters on the name. A
policy that does not follow the convention falls outside every filter and so simply keeps its old All
Devices assignment. The script warns about this — do not ignore that warning.

### Still to build: `scripts/Get-BaselinePolicyState.ps1`

Tenant-side counterpart of `check-scope.js`. Reads across the five policy types and reports:

| Finding | Meaning |
|---|---|
| policy in `IntuneTemplate/` but not in the tenant | not deployed yet |
| policy in the tenant under a name from `_renames.json` | orphaned — rename or delete |
| name occurs more than once | duplicate |
| `- D -` policy with a user target (or vice versa) | scope and assignment diverge |
| policy without any assignment | deploys nowhere |
| the same `settingDefinitionId` with a different value in two assigned policies | conflict |

Run before and after phase 3, and periodically after that. Read-only, no `-WhatIf` needed.

---

## Phase 8 — Tenant layer: ScubaGear and Maester

Not to be confused with the above: **ScubaGear does not look at Intune device policies.** It
assesses tenant configuration for Entra ID, Exchange Online, Defender, SharePoint/OneDrive,
Teams and Power Platform. Maester bundles EIDSCA, CISA SCuBA, CIS Microsoft 365 Foundations and
ORCA, and also has a handful of Intune checks (LAPS, ASR, App Control for Business,
Managed Installer).

Approach: first run ScubaGear for a baseline measurement, then set up Maester as the ongoing
check.

Maester's four Intune checks overlap with this repo. They are the natural link
between the two layers — start there.

---

## What we deliberately do not do

- **AppLocker / WDAC / App Control for Business** — OIB explicitly leaves this out because of
  environment dependency, and rightly so: this is a project, not a policy. Note that Maester
  does test for it (phase 8) — that check will be red; this is a deliberate choice and should be
  recorded as an exception, not as an open finding.
- **Driver update profiles** — IntuneBackupAndRestore 4.0.1 does not support them. Via CIPP it
  would be possible, but then the two restore routes diverge.
- **Windows 365** — OIB has policies for it; Cloud PCs belong in a set of their own.
- Deviations from CIS that OIB makes with justification (built-in Administrator enabled for LAPS,
  UAC prompt behaviour for the helpdesk) — adopted including the justification, see
  `OIBvsCIS-Rationale.csv` in OIB.

---

## Sources

- [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) — [WINDOWS](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/WINDOWS), [MACOS](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/MACOS), [BYOD](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/BYOD)
- [OIBvsCIS-Rationale.csv](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/blob/main/WINDOWS/OIBvsCIS-Rationale.csv)
- [OIB FAQ — why D and U in the name](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/blob/main/FAQ.md#why-do-policies-have-d-and-u-in-their-name)
- [cisagov/ScubaGear](https://github.com/cisagov/ScubaGear)
- [Maester — CISA tests](https://maester.dev/docs/tests/cisa/) · [CIS benchmark tests](https://maester.dev/docs/tests/cis/)
