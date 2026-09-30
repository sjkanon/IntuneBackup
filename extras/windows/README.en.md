[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/windows

Components of the Windows baseline that are none of the five CIPP types (`Catalog`, `Device`,
`deviceCompliancePolicies`, `AppProtection`, `Admin`) and therefore are not deployed via `IntuneTemplate/` and the
pipeline. `check-scope.js`, `export-intunebackup.js` and `Set-BaselineAssignment.ps1`
do nothing with this folder. Each folder has its own README with deployment instructions, phase and the controls
it contributes to.

| Folder | What | Why not in IntuneTemplate/ | Phase |
|---|---|---|---:|
| [`app-control/`](app-control/README.en.md) | App Control for Business (WDAC) with the built-in controls — audit variant, enforce variant, managed installer, KQL | Endpoint security template; the `settingInstanceTemplateId` cannot be verified against `pl4nty/intune-change-tracking` and must come from Graph per tenant | 2 (audit) / 4 (enforce) |
| [`remediations/dns-over-https/`](remediations/dns-over-https/README.en.md) | DoH for Windows itself: allow (phase 2) or require (phase 5), as a remediation | The Windows DoH setting (`DoHPolicy`) does not exist in the settings catalog; only the Edge variant does — that one is included as a template | 2 / 5 |
| [`remediations/escrow-check/`](remediations/escrow-check/README.en.md) | Checks whether the BitLocker recovery key and the LAPS password actually are in Entra ID, and repairs the BitLocker escrow | Remediation scripts (Intune → Scripts and remediations), not a policy | 1 (detection only) / 2 |
| [`remediations/event-log-sizes/`](remediations/event-log-sizes/README.en.md) | Enlarges the PowerShell/Operational, Defender/Operational and CodeIntegrity/Operational logs | Those channels have no CSP for the maximum size | 2 |
| [`platform-scripts/`](platform-scripts/README.en.md) | Maps an Azure Files share as a drive letter using the Entra Kerberos ticket | A drive mapping is not a policy; platform scripts have no CIPP `TemplateType` | waits for a storage account with Entra Kerberos |
| [`win32-apps/remove-mcafee/`](win32-apps/remove-mcafee/README.en.md) | Removes the preinstalled McAfee, which puts Defender in passive mode | A Win32 app is not a policy | before the Defender policies |

All scripts are generic: no tenant id, no groups, no domains. Where something is needed per
organisation, there is a placeholder in CAPITALS ending in `-INVULLEN`.
