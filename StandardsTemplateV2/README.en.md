[Nederlands](README.md) · **English** · [Français](README.fr.md)

# StandardsTemplateV2/

A single CIPP **standards** template. That is something different from everything in
`IntuneTemplate/`: that is about Intune policies on devices, this is about
tenant settings that CIPP itself monitors and restores.

| | |
|---|---|
| File | `Standard.json` |
| `PartitionKey` | `StandardsTemplateV2` — that is how CIPP recognises it, not by the folder name |
| Name in CIPP | `Standard` |

## What's in it

| Standard | Action | Setting |
|---|---|---|
| `NudgeMFA` | Remediate | off (`state: disabled`, `snoozeDurationInDays: 0`) |
| `PasskeyDynamicMigrationOptOut` | Remediate | on |

`isDriftTemplate` is set, so CIPP can use this for drift monitoring: if the tenant deviates,
CIPP puts it back.

## Why here and not in one of the policy sets

The pipelines in `scripts/` know five CIPP policy types (`Catalog`, `Admin`, `Device`,
`deviceCompliancePolicies`, `AppProtection`) and a standards template is none of those five.
So this file is **not** picked up by `check-scope.js`, `check-sets.js`
or `export-intunebackup.js`. Nor does it follow
the naming convention with platform and scope — that makes no sense for a tenant setting.

CIPP does read it directly, just like the policy sets: the file ends in `.json` and is not
under a `NativeImport` path. See the [main README](../README.en.md#restoring-into-a-tenant)
for how that scan works.

## Updating

Export the template again from CIPP (Tenant Administration → Standards → template →
Export) and replace `Standard.json`. Updating by hand is possible, but note: the entire
configuration is stored as a **string** in `.JSON`, so any change there has to be made inside
that string and escaped correctly.
