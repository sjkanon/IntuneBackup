[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Assignment filters for Windows

One `deviceAndAppManagementAssignmentFilter` body. A filter refines an assignment to a
group: *all devices, but not the AVD session hosts*. Here it makes the distinction between
physical devices and the Azure Virtual Desktop session hosts running Windows 11 Enterprise
multi-session.

| File | Rule | Use |
|---|---|---|
| `WIN-AVD-Multi-Session.json` | `device.operatingSystemSKU -eq "ServerRdsh"` | **include** on the four AVD policies (`[Baseline] - WIN - D - AVD …`); **exclude** on the policies that do not belong on AVD |

`ServerRdsh` is the SKU of Windows Enterprise multi-session. Tested in the test tenant: the filter
matches exactly the AVD session host and no physical PC at all. Windows 365 Cloud PCs run
Windows Enterprise (single-session) and therefore do not fall under it.

Which policy gets include, exclude or neither is listed per policy in
[docs/AVD.en.md](../../../docs/AVD.en.md). The filter also works on user-targeted assignments,
such as `[Baseline] - WIN - U - Windows Hello for Business`: Intune evaluates the filter on the
device the user signs in to. Excluding a device group does nothing there, because the
assignment goes to users.

Filters with `platform: windows10AndLater` can only be selected on Windows policies.

## Deploying

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<contents of the file>
```

Or in the portal: Tenant administration → Filters → Create → Managed devices → Windows 10 and later, and
paste the rule from the table. A filter does nothing until it is selected on an assignment.
