[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Assignment filters for Android Enterprise

Three `deviceAndAppManagementAssignmentFilter` bodies. A filter refines an assignment to a
group: *all users, but only on corporate devices*. They are not mandatory — the
Graph type of the policy already does most of the work (an `androidDeviceOwnerCompliancePolicy`
never touches a personal work profile) — but they are needed in three places:

| File | Rule | Use |
|---|---|---|
| `AND-Personal-Work-Profile.json` | `device.deviceOwnership -eq "Personal"` | optional: work profile policies only on personal devices |
| `AND-Corporate.json` | `device.deviceOwnership -eq "Corporate"` | assign `[Baseline] - AND - D - System Updates` to *all devices* with this filter |
| `AND-Dedicated.json` | `device.enrollmentProfileName -eq "DEDICATED-INSCHRIJFPROFIEL-INVULLEN"` | `[Baseline] - AND - D - Compliance Dedicated Device Health`, if you do not create a separate device group |

For the dedicated filter: fill in the name of the dedicated enrollment profile. If there are several
(kiosk and shared), combine them with `-or`, for example
`(device.enrollmentProfileName -eq "PROFIEL-1-INVULLEN") -or (device.enrollmentProfileName -eq "PROFIEL-2-INVULLEN")`.

Filters with `platform: androidForWork` apply to all Android Enterprise forms; they cannot be
selected on a policy for another platform.

## Deploying

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<contents of the file>
```

Or in the portal: Tenant administration → Filters → Create → Managed devices → Android Enterprise, and
paste the rule from the table. A filter does nothing until it is selected on an assignment.
