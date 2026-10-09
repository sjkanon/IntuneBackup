[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Assignment filters for Windows

Two `deviceAndAppManagementAssignmentFilter` bodies, one per device class that has a filter. A
filter refines an assignment to all devices, all users or a group: *all devices, but only the
physical ones*. Here it makes the distinction between physical devices and the Azure Virtual
Desktop session hosts running Windows 11 Enterprise multi-session.

| File | Filter | Rule | Class (`doelgroep`) |
|---|---|---|---|
| `WIN-Physical.json` | `WIN - Physical` | `(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")` | **fysiek** (physical) — laptops and workstations |
| `WIN-AVD-Multi-Session.json` | `WIN - AVD Multi-session` | `(device.operatingSystemSKU -eq "ServerRdsh")` | **avd** — multi-session session hosts |

Both are only used as **include**. The third class, **alle** (all), has no filter: those
policies go to every Windows device. Which policy is in which class is the `doelgroep` in
[`_manifest.json`](../../_manifest.json), and per policy with the reason in
[docs/AVD.en.md](../../../docs/AVD.en.md); the runbook is [docs/PLAYBOOK.en.md](../../../docs/PLAYBOOK.en.md).

Validated in the test tenant (`validateFilter` and *Preview devices*):

- `WIN - Physical` matches the four physical and QEMU PCs and not the AVD session host;
- `WIN - AVD Multi-session` matches exactly the AVD session host and no physical PC.

**What falls under neither:** a Windows 365 Cloud PC (model `Cloud PC …`, single-session) and a
personal AVD host (model `Virtual Machine`, single-session). They only get the policies of class
*alle* — no BitLocker, Windows Hello or Storage Sense, and no FSLogix either. The Cloud PC set
(`Cloud PC Session Security`, `Cloud PC External Access`) reaches them through its own groups. A
Hyper-V or Azure VM used as an ordinary PC falls outside *fysiek* for the same reason.

`-notStartsWith` does not exist in filter rules (the rule is then invalid); hence
`-notContains "Cloud PC"`.

The filter also works on user-targeted assignments, such as
`[Baseline] - WIN - U - Windows Hello for Business`: Intune evaluates the filter on the device the
user signs in to. Excluding a device group does nothing there, because the assignment goes to
users.

Filters with `platform: windows10AndLater` can only be selected on Windows policies.

## Deploying

Before the first CIPP run of the baseline. CIPP looks the filter up by name and, if it does not
exist, assigns **without** a filter — the physical-only policies then also land on the session hosts.

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<contents of the file>
```

Or `scripts/Set-BaselineAssignment.ps1 -CreateFilters` (with `-WhatIf` first), or in the portal:
Tenant administration → Filters → Create → Managed devices → Windows 10 and later, and paste the
rule from the table. Check with *Preview devices* afterwards. A filter does nothing until it is
selected on an assignment. The name must match exactly: CIPP, `Set-BaselineAssignment.ps1` and the
export look it up by `displayName`.
