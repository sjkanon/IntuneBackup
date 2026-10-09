[Nederlands](AVD.md) · **English** · [Français](AVD.fr.md)

# Azure Virtual Desktop: shared policies and rollout plan

Which Windows policies from this baseline also belong on the Azure Virtual Desktop session hosts,
which only on physical devices, and in which order you put that into a tenant. It concerns session
hosts running **Windows 11 Enterprise multi-session**, **Entra-joined and enrolled in Intune**, with
**FSLogix profile containers on Azure Files** and **Entra Kerberos** for access to the share.

The classification follows `infra/INTUNE-BASELINE.md` (sections 2 to 4) in the AVD test repo, checked
against [Intune for AVD multi-session](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session),
and the findings from the test tenant of 9 October 2026. The list below is built from the actual
policy names in `IntuneTemplate/WIN` (142 policies). This document is maintained by hand: when a
Windows policy is added, put it here in one of the four groups as well, and give it the matching
`doelgroep` in `_manifest.json` — `check-scope.js` rejects a Windows policy without one.

## In short

Every Windows policy has a `doelgroep` (target class) in [`_manifest.json`](../IntuneTemplate/_manifest.json):
the device class it belongs on. Three classes, two filters, **include** only:

| Group in this document | `doelgroep` | Policies | Assignment |
|---|---|---:|---|
| **Shared** — physical and AVD, unchanged | `alle` | 95 | as they are, no filter |
| **Physical only** — not on the session hosts | `fysiek` | 40 | **include** filter `WIN - Physical` |
| **AVD variant** — physical and AVD each have their own version | `fysiek` (the physical version) | 1 | physical version include `WIN - Physical`, AVD version include `WIN - AVD Multi-session` |
| **AVD only** — the new policies and the Cloud PC set | `avd` | 6 | **include** filter `WIN - AVD Multi-session` (Cloud PC set: own group) |

In phase 1 and 2 the pipeline turns these into CIPP packages of their own:
`[Baseline] - Baseline-Devices-Physical`, `-Users-Physical`, `-Pilot-Physical` and `-Devices-AVD`, with
the filter in the standard. How to roll that out in a customer tenant is in the runbook
[PLAYBOOK.en.md](PLAYBOOK.en.md).

New in this repo for AVD:

- the assignment filters [`WIN - Physical` and `WIN - AVD Multi-session`](../IntuneTemplate/WIN/AssignmentFilters/README.en.md);
- [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md) — FSLogix and the Kerberos ticket for Azure Files;
- [`AVD Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.en.md) — the physical version without the password prompt;
- [`AVD Defender FSLogix Exclusions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.en.md) — the Defender exclusions Microsoft prescribes for FSLogix;
- [`AVD Session Host`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.en.md) — two-hour session limits and Storage Sense with values of its own inside the container.

All four are in **phase 1** with class `avd`, in the package `[Baseline] - Baseline-Devices-AVD`
(all devices, include filter `WIN - AVD Multi-session`). The storage account in the two FSLogix
policies is the CIPP variable `%FSLogixStorageAccount%`, which you set per tenant.

## What Intune does and does not do on multi-session

- **Settings Catalog** works, at device and user level. **Templates** (Device Configurations)
  do not work, except certificates and a VPN device tunnel; they show *Not applicable*.
- **Compliance:** only OS version, password, Defender, firewall, antivirus, antispyware,
  real-time protection and the Defender risk. BitLocker, TPM, Secure Boot and Code Integrity report
  *Not applicable* and do not make the host non-compliant. And: **user-targeted compliance is not
  supported on multi-session.** The compliance policies in this baseline (`WIN - U - Compliance …`)
  go to all users; for the session hosts they must *also* be assigned to the device group
  SEC-AVD-Session-Hosts. Without that the host is not compliant and CA 2060 blocks the desktop apps
  in the session as soon as it is enforced.
- **Update rings** do not work. Updates come with the monthly image rebuild.
- **Apps** only in system context and as *Required*.
- **No** Autopilot, ESP, wipe, remote lock or BitLocker key rotation.
- **Pitfall: VDOT turns push notifications off.** `-Optimizations All` of the Virtual Desktop
  Optimization Tool sets `NoCloudApplicationNotification = 1` (*Turn off notifications network
  usage*). An Intune push then does not reach the host — event 404 *Cloud notifications have been
  turned off* on `./Vendor/MSFT/DMClient/Provider/MS DM Server/Push/PFN` — and new policies only
  arrive at the scheduled sync. The AVD image reverts that value after VDOT and sets
  `dmwappushservice` to automatic.

## How the filters work

[`WIN-AVD-Multi-Session.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-AVD-Multi-Session.json)
has the rule `(device.operatingSystemSKU -eq "ServerRdsh")`: the SKU of Windows Enterprise
multi-session. [`WIN-Physical.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-Physical.json) is
`(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")`.
In the test tenant the first matches exactly the AVD session host, the second the four physical
and QEMU PCs and not the session host.

**What falls under neither:** Windows 365 Cloud PCs and personal AVD hosts (single-session, model
`Virtual Machine`). They only get the shared policies — so no BitLocker, Windows Hello or the
physical `Remote Desktop and RPC` with the password prompt either — plus the Cloud PC set through
their own group. That is deliberate: the physical policies assume hardware (TPM, disk, Wi-Fi,
battery) and the AVD policies assume multi-session with FSLogix.

A filter always sits next to an assignment — to all devices, all users or a group — and says which
of those devices take part. Why filters and not groups:

- **User-targeted assignments.** `WIN - U - Windows Hello for Business`,
  `WIN - U - Personal Data Encryption` and the Outlook variants go to users. Excluding a *device
  group* does nothing there: the assignment looks at the user. A filter *is* evaluated on the
  device the user signs in to — the same user gets Windows Hello on their laptop and not in the
  AVD session.
- **No waiting.** A filter is evaluated at check-in; a new session host or laptop does not have to
  wait until a dynamic group has picked it up.
- **One filter per CIPP package.** A CIPP package has one assignment and one filter for all its
  members. So every class gets a package of its own, and the filter is always **include**: the
  shared policies sit in a package *without* a filter, the physical ones in a package with
  `WIN - Physical`, the AVD policies in a package with `WIN - AVD Multi-session`.

**No more exclude filters.** The previous model put an exclude filter `WIN - AVD Multi-session` on
the physical-only policies. CIPP could not do that per policy: those policies sat in
`Baseline-Devices`, `-Users` and `-Pilot` together with the shared ones, and an exclude on such a
package also took the shared ones off the session hosts. A package per class solves that, and with
include instead of exclude a Cloud PC or a personal host can no longer get a physical policy by
accident.

**AVD variant:** the physical `Remote Desktop and RPC` has class `fysiek`, the AVD version `avd`.
They never come together on one host, so the password prompt of the physical version cannot apply
on the session host after all.

### Conflict check per class

`check-scope.js` compares, per setting, what lands on the same device: **alle + fysiek** on a
physical PC and **alle + avd** on a session host, over phase 1 and 2. Between `fysiek` and `avd`
the same setting may have a different value — that is exactly the point (Storage Sense when space
is low on a laptop, daily with shorter thresholds on a session host). Today: no conflicts; three settings are set twice with the same
value (NTLM in Disable NTLM and Local Security Policies, two Outlook settings in Office Experience
and Outlook Cached Mode Managed). The check does not compare phase 4 (own group); that overlap is
listed below by hand:

| Setting | AVD policy | Other policy | Handled by |
|---|---|---|---|
| `ts_sessions_idle_limit_2`, `ts_sessions_disconnected_timeout_2` | AVD Session Host (2 hours) | Cloud PC External Access (15 min, phase 4) | **open point**, see below — only on a host pool for external users |
| `kerberos_cloudkerberosticketretrievalenabled` | AVD FSLogix Profile Containers (1) | Windows Hello Cloud Kerberos Trust (1) | different classes; same value |
| eight settings of Remote Desktop and RPC | AVD Remote Desktop and RPC | Remote Desktop and RPC | different classes |
| `ts_time_zone` | — | Cloud PC Session Security | not included in AVD Session Host |

## Classification per policy

### Shared — 95

Physical and AVD, unchanged and without a filter.

| Policy | Phase | Remark |
|---|---:|---|
| [D - Access Control](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.en.md) | 2 |  |
| [D - Account Lockout](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.en.md) | 2 |  |
| [D - Administrator Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.en.md) | 2 |  |
| [D - AI Tooling](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.en.md) | 1 |  |
| [D - Attack Surface Reduction](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.en.md) | 1 | On AVD review in audit mode first (Defender ASR Policy Audit Mode). |
| [D - Audit and Event Logging](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_and_Event_Logging.en.md) | 1 |  |
| [D - Audit Policy Enforcement](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.en.md) | 1 |  |
| [D - Cloud Optimized Content](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_Optimized_Content.en.md) | 1 |  |
| [D - Config Refresh](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Config_Refresh.en.md) | 1 |  |
| [D - Cryptography](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.en.md) | 2 |  |
| [D - Data Minimisation](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Data_Minimisation.en.md) | 1 |  |
| [D - Defender Additional Configuration](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Additional_Configuration.en.md) | 1 |  |
| [D - Defender Antivirus](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Antivirus.en.md) | 1 |  |
| [D - Defender ASR Policy Audit Mode](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.en.md) | 4 |  |
| [D - Defender AV Policy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_AV_Policy.en.md) | 5 |  |
| [D - Defender EDR Policy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.en.md) | 1 |  |
| [D - Defender for Endpoint EDR](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.en.md) | 5 |  |
| [D - Defender Ransomware Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.en.md) | 1 |  |
| [D - Defender Security Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Security_Experience.en.md) | 1 |  |
| [D - Defender Update Ring 1 Pilot](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.en.md) | 4 |  |
| [D - Defender Update Ring 2 UAT](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.en.md) | 4 |  |
| [D - Defender Update Ring 3 Production](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.en.md) | 1 |  |
| [D - Enhanced Phishing Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.en.md) | 1 |  |
| [D - Internet Explorer Legacy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.en.md) | 1 |  |
| [D - Legacy Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.en.md) | 1 |  |
| [D - Local Administrators](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Administrators.en.md) | 1 |  |
| [D - Local Security Policies](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.en.md) | 1 |  |
| [D - Location and Privacy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Location_and_Privacy.en.md) | 1 |  |
| [D - Logging](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.en.md) | 1 |  |
| [D - Login and Lock Screen](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.en.md) | 1 |  |
| [D - Microsoft Accounts](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.en.md) | 1 |  |
| [D - Microsoft Edge DNS over HTTPS Automatic](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.en.md) | 2 |  |
| [D - Microsoft Edge DNS over HTTPS Secure](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.en.md) | 5 |  |
| [D - Microsoft Edge Search Engine](../IntuneTemplate/WIN/AdministrativeTemplates/Baseline_WIN_D_Microsoft_Edge_Search_Engine.en.md) | 5 |  |
| [D - Microsoft Edge Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.en.md) | 1 |  |
| [D - Microsoft Edge Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Updates.en.md) | 1 |  |
| [D - Microsoft Office Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.en.md) | 1 |  |
| [D - Microsoft OneDrive](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.en.md) | 1 | Known Folder Move and Files On-Demand work together with FSLogix. |
| [D - Microsoft Store](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.en.md) | 1 |  |
| [D - Network Authentication Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.en.md) | 2 |  |
| [D - Printing](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.en.md) | 1 | Sets *Limits print driver installation to Administrators*: printer drivers are installed on the session host after deployment (same driver as on the print server). |
| [D - Printing Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.en.md) | 2 |  |
| [D - Privacy and Telemetry](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Privacy_and_Telemetry.en.md) | 1 |  |
| [D - Remote Access Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.en.md) | 2 |  |
| [D - Script File Associations](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.en.md) | 2 |  |
| [D - Security Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.en.md) | 1 |  |
| [D - Security Log Monitoring](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.en.md) | 2 |  |
| [D - Settings Sync](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.en.md) | 1 |  |
| [D - Threat Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.en.md) | 1 |  |
| [D - Update Reports and Telemetry](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.en.md) | 1 |  |
| [D - User Rights](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.en.md) | 1 | Denies RDP sign-in for local accounts (S-1-5-113): a break-glass administrator signs in through the Azure console, not RDP. |
| [D - Windows AI Features Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.en.md) | 5 | Restricted or Permitted as chosen, as on physical devices. |
| [D - Windows AI Features Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.en.md) | 2 | Restricted or Permitted as chosen, as on physical devices. |
| [D - Windows AI Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.en.md) | 5 | Restricted or Permitted as chosen, as on physical devices. |
| [D - Windows AI Recall Boundaries](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.en.md) | 3 |  |
| [D - Windows AI Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.en.md) | 1 | Restricted or Permitted as chosen, as on physical devices. |
| [D - Windows Component Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.en.md) | 2 |  |
| [D - Windows Event Forwarding](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.en.md) | 3 | Only if there is a collector. |
| [D - Windows Feature Configuration](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Feature_Configuration.en.md) | 1 |  |
| [D - Windows Firewall](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.en.md) | 1 |  |
| [D - Windows Firewall Rules](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.en.md) | 1 |  |
| [D - Windows LAPS](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.en.md) | 1 |  |
| [D - Windows Package Manager](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Package_Manager.en.md) | 1 |  |
| [D - Windows Sandbox](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Sandbox.en.md) | 1 |  |
| [D - Windows Subsystem for Linux](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.en.md) | 1 |  |
| [U - AI Usage Control Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.en.md) | 5 |  |
| [U - AI Usage Control Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.en.md) | 2 |  |
| [U - Attachment Scanning](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Attachment_Scanning.en.md) | 1 |  |
| [U - Compliance Antispyware](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.en.md) | 1 | On multi-session only through a **device assignment** (SEC-AVD-Session-Hosts): user-targeted compliance is not supported there. |
| [U - Compliance Antivirus](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.en.md) | 1 | On multi-session only through a **device assignment** (SEC-AVD-Session-Hosts): user-targeted compliance is not supported there. |
| [U - Compliance BitLocker](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.en.md) | 1 | Reports *Not applicable* on multi-session; does not make the host non-compliant. |
| [U - Compliance Code Integrity](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.en.md) | 1 | Reports *Not applicable* on multi-session; does not make the host non-compliant. |
| [U - Compliance Defender for Endpoint Risk](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.en.md) | 3 | On multi-session only through a **device assignment** (SEC-AVD-Session-Hosts): user-targeted compliance is not supported there. |
| [U - Compliance Defender Real Time Protection](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.en.md) | 1 | On multi-session only through a **device assignment** (SEC-AVD-Session-Hosts): user-targeted compliance is not supported there. |
| [U - Compliance Defender Security Intelligence](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.en.md) | 1 | On multi-session only through a **device assignment** (SEC-AVD-Session-Hosts): user-targeted compliance is not supported there. |
| [U - Compliance Firewall](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.en.md) | 1 | On multi-session only through a **device assignment** (SEC-AVD-Session-Hosts): user-targeted compliance is not supported there. |
| [U - Compliance OS Version](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.en.md) | 2 | On multi-session only through a **device assignment** (SEC-AVD-Session-Hosts): user-targeted compliance is not supported there. |
| [U - Compliance Secure Boot](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.en.md) | 1 | Reports *Not applicable* on multi-session; does not make the host non-compliant. |
| [U - Compliance TPM](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.en.md) | 1 | Reports *Not applicable* on multi-session; does not make the host non-compliant. |
| [U - Copilot](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Copilot.en.md) | 1 |  |
| [U - File Sharing Restrictions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.en.md) | 2 |  |
| [U - Microsoft Edge Extensions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Extensions.en.md) | 1 |  |
| [U - Microsoft Edge Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Management.en.md) | 2 |  |
| [U - Microsoft Edge Password Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Password_Management.en.md) | 1 |  |
| [U - Microsoft Edge Profiles and Sync](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.en.md) | 1 |  |
| [U - Microsoft Edge User Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_User_Experience.en.md) | 1 |  |
| [U - Microsoft Office Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Experience.en.md) | 1 |  |
| [U - Microsoft Office Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.en.md) | 1 |  |
| [U - Microsoft OneDrive](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_OneDrive.en.md) | 1 | Known Folder Move and Files On-Demand work together with FSLogix. |
| [U - Microsoft Outlook](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook.en.md) | 1 |  |
| [U - Microsoft Outlook Cached Mode Managed](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.en.md) | 2 | The choice for AVD: own mailbox cached in the FSLogix profile, shared mailboxes online. |
| [U - Microsoft Store](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.en.md) | 1 |  |
| [U - Microsoft Teams](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.en.md) | 2 |  |
| [U - Windows Spotlight](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Spotlight.en.md) | 1 |  |
| [U - Windows User Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.en.md) | 1 |  |

### Physical only — 40

Class `fysiek`: in phase 1 and 2 the include filter `WIN - Physical`, so not on a session host, a Windows 365 Cloud PC or a personal AVD host.

| Policy | Phase | Why not on AVD |
|---|---:|---|
| [D - Automatic Restart Sign-On](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Automatic_Restart_Sign_On.en.md) | 1 | Not applicable to multi-session or pooled hosts. |
| [D - BitLocker](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.en.md) | 1 | Azure already encrypts the disk (SSE, encryption at host). Compliance BitLocker reports *Not applicable* on multi-session. |
| [D - Bluetooth Allowed Services](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Bluetooth_Allowed_Services.en.md) | 2 | Hardware a VM does not have; redirection is already off through Cloud PC Session Security. |
| [D - Business Continuity](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.en.md) | 1 | Not applicable to multi-session or pooled hosts. |
| [D - Delivery Optimisation](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Delivery_Optimisation.en.md) | 1 | Not applicable to multi-session or pooled hosts. |
| [D - Device Guard and Credential Guard](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.en.md) | 2 | Only works on a Trusted Launch VM. Enable Trusted Launch if you want to keep this policy on AVD; it then becomes *Shared*. |
| [D - Device Lock](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.en.md) | 1 | Hardware a VM does not have; redirection is already off through Cloud PC Session Security. |
| [D - Disable NTLM](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.en.md) | 2 | Shares and apps on Entra DS fall back to NTLM from an Entra-joined host. |
| [D - Endpoint Analytics](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Endpoint_Analytics.en.md) | 1 | Device configuration template: not supported on multi-session. |
| [D - Enrollment Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.en.md) | 2 | Not applicable to multi-session or pooled hosts. |
| [D - Google Chrome Extensions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Extensions.en.md) | 2 | Chrome is not in the image. |
| [D - Google Chrome Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Security.en.md) | 2 | Chrome is not in the image. |
| [D - Google Chrome Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Updates.en.md) | 1 | Chrome is not in the image. |
| [D - In-Box App Removal](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.en.md) | 2 | Already done in the image (VDOT). Redundant, not harmful. |
| [D - Kernel DMA Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.en.md) | 2 | A VM has no DMA ports. |
| [D - Logon Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.en.md) | 2 | CTRL+ALT+DEL makes no sense in an RDP session. Test first or drop it. |
| [D - Microsoft Office Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.en.md) | 1 | Updating Office automatically on a pooled host makes the hosts differ from each other; updates come with the image. |
| [D - Passwordless](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.en.md) | 1 | Hides the password field; without SSO nobody can sign in to the host. |
| [D - Power Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.en.md) | 1 | Hardware a VM does not have; redirection is already off through Cloud PC Session Security. |
| [D - Removable Storage](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.en.md) | 2 | Hardware a VM does not have; redirection is already off through Cloud PC Session Security. |
| [D - Storage Sense](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.en.md) | 1 | When space is low, 30 days — does not work on a session host, where C: never fills up. AVD Session Host turns Storage Sense on there with values of its own (daily, 7/14/30 days). |
| [D - Timezone](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Timezone.en.md) | 1 | Automatic time zone clashes with time zone redirection (`ts_time_zone`) from Cloud PC Session Security. |
| [D - Wifi Corporate](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.en.md) | 3 | Device configuration template: not supported on multi-session, and a VM has no Wi-Fi. |
| [D - Wifi Guest](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.en.md) | 3 | Device configuration template: not supported on multi-session, and a VM has no Wi-Fi. |
| [D - Windows Hello Cloud Kerberos Trust](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.en.md) | 1 | Belongs with Windows Hello. AVD FSLogix Profile Containers sets the Kerberos ticket for Azure Files itself. |
| [D - Windows Hello for Business](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.en.md) | 2 | No Windows Hello sign-in on a session host; PDE depends on Hello. |
| [D - Windows Hello for Business Multi User](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.en.md) | 4 | No Windows Hello sign-in on a session host; PDE depends on Hello. |
| [D - Windows Hello Passkey PIN Complexity Alphanumeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.en.md) | 2 | No Windows Hello sign-in on a session host; PDE depends on Hello. |
| [D - Windows Hello Passkey PIN Complexity Numeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.en.md) | 5 | No Windows Hello sign-in on a session host; PDE depends on Hello. |
| [D - Windows Hello PIN Complexity Alphanumeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.en.md) | 5 | No Windows Hello sign-in on a session host; PDE depends on Hello. |
| [D - Windows Hello PIN Complexity Numeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.en.md) | 5 | No Windows Hello sign-in on a session host; PDE depends on Hello. |
| [D - Windows Update Ring 1 Pilot](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.en.md) | 4 | Update rings do not work on multi-session; updates come with the monthly image rebuild. |
| [D - Windows Update Ring 2 UAT](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.en.md) | 4 | Update rings do not work on multi-session; updates come with the monthly image rebuild. |
| [D - Windows Update Ring 3 Production](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.en.md) | 1 | Update rings do not work on multi-session; updates come with the monthly image rebuild. |
| [D - Wireless and Peripherals](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.en.md) | 1 | Hardware a VM does not have; redirection is already off through Cloud PC Session Security. |
| [D - Wireless Shared Devices](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.en.md) | 4 | Hardware a VM does not have; redirection is already off through Cloud PC Session Security. |
| [U - Microsoft Outlook Cached Mode Default](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.en.md) | 5 | Phase 5 alternative. On AVD always *Cached Mode Managed*; *Off* makes Outlook slow. |
| [U - Microsoft Outlook Cached Mode Off](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.en.md) | 5 | Phase 5 alternative. On AVD always *Cached Mode Managed*; *Off* makes Outlook slow. |
| [U - Personal Data Encryption](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.en.md) | 1 | No Windows Hello sign-in on a session host; PDE depends on Hello. |
| [U - Windows Hello for Business](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.en.md) | 2 | No Windows Hello sign-in on a session host; PDE depends on Hello. |

### AVD variant — 1

| Policy | Phase | Remark |
|---|---:|---|
| [D - Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.en.md) | 1 | `promptforpassworduponconnection` breaks Entra SSO and passkeys. Physical: class `fysiek` (include `WIN - Physical`); AVD: [AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.en.md) with class `avd`. |

### AVD only — 6

| Policy | Phase | Remark |
|---|---:|---|
| [D - AVD Defender FSLogix Exclusions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.en.md) | 1 | New. Class `avd`: package `Baseline-Devices-AVD`, include filter `WIN - AVD Multi-session`. |
| [D - AVD FSLogix Profile Containers](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md) | 1 | New. Class `avd`: package `Baseline-Devices-AVD`, include filter `WIN - AVD Multi-session`. |
| [D - AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.en.md) | 1 | New. Class `avd`: package `Baseline-Devices-AVD`, include filter `WIN - AVD Multi-session`. |
| [D - AVD Session Host](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.en.md) | 1 | New. Class `avd`: package `Baseline-Devices-AVD`, include filter `WIN - AVD Multi-session`. |
| [D - Cloud PC External Access](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_External_Access.en.md) | 4 | Existing, only on a host pool for external users (SEC-Cloud-PC-External). Clashes there with the session limits of AVD Session Host — see the open points. |
| [D - Cloud PC Session Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_Session_Security.en.md) | 4 | Existing, through the group SEC-Cloud-PC (also Windows 365). Also sets time zone redirection. |

## Findings from the test tenant (9 October 2026)

The test ran with the old `[Baseline] X` set in the test tenant, from before the split into the current names.

- **`Limits print driver installation to Administrators`** (in the old Administrative Templates)
  prevents users from installing a printer driver themselves. In the current set that is
  `restrictdriverinstallationtoadministrators` in [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.en.md),
  and it stays *Shared*: it is a security measure against PrintNightmare-style attacks.
  Consequence for AVD: **the printer drivers are installed on every session host after deployment** (AVD-Test: `printerDrivers`, step `sessionhost-printers`), with exactly the same driver as on the separate print server.
- **`promptforpassworduponconnection`** was in the old `[Baseline] Administrative Templates`. In
  the current set it is in `Remote Desktop and RPC`, and with the split it moves to the AVD variant —
  which deliberately does *not* set it. With the prompt the session host asks for a password on every
  connection and Entra SSO with a passkey does not work.
- **Excluded in the old set** on the session host: Bitlocker, Device Lock, Windows Hello For
  Business, Windows 11 Update (the update ring) and Office Updates. All five are under
  *Physical only* here.

## FSLogix: Intune and the host script

FSLogix is configured in two places, on purpose:

- **The host script** `configure-fslogix.ps1` in the AVD repo runs as a Run Command when a host is
  deployed. A new host only receives the Intune policy after enrolment and the first sync; without
  the script the first sign-in on a new host would happen without a container — or, with
  `PreventLoginWithFailure`, not at all. The script sets the same values immediately, so the first
  sign-in already works.
- **The Intune policy** [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md)
  then keeps the values central and puts them back if someone changes them on a host (drift).

Both write the same registry values under `HKLM\SOFTWARE\FSLogix\Profiles` (Enabled,
VHDLocations, SizeInMBs, IsDynamic, FlipFlopProfileDirectoryName, DeleteLocalProfileWhenVHDShouldApply,
PreventLoginWithFailure, PreventLoginWithTempProfile, VolumeType, RoamIdentity), so nothing clashes. Only in the script, because
the Settings Catalog does not know them:

- `LoadCredKeyFromProfile = 1` under `HKLM\SOFTWARE\Policies\Microsoft\AzureADAccount` — needed for
  Entra Kerberos with FSLogix;
- the local administrator in the local group `FSLogix Profile Exclude List`, so that a
  break-glass sign-in always works, even when the share is unreachable.

**VolumeType must be VHDX explicitly.** The FSLogix default is **VHD**, not VHDX: the definition in the
tenant says *Default is VHD … the same as Not Configured*. A host that only gets the Intune policy,
without the script, would then create a new `.VHD` next to the existing `.VHDX`, and the user's
profile appears to be gone. That is why the policy sets `VolumeType = VHDX` (an ADMX choice with the
*VHD/VHDX* dropdown as a child). As with `VHD Compact Disk`, setting *Enabled* back to *Not
Configured* has no effect for this ADMX setting: to switch, set the other value explicitly.
`RoamIdentity` is off (*Disabled*): Intune does not support token roaming. Both set the Kerberos
ticket (`CloudKerberosTicketRetrievalEnabled`); the storage account app must be excluded from MFA in
Conditional Access.

## Keeping profiles small: Storage Sense and compaction

Two settings work together to keep the FSLogix containers as small as possible:

- **Storage Sense cleans up inside the attached container.** [`AVD Session Host`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.en.md)
  turns it on with values of its own: OneDrive files online-only after 7 days (no data loss, the
  biggest gain), temporary files, the recycle bin after 14 days and Downloads after 30 days (real
  deletion, hence not shorter). **The cadence (daily) is set by the AVD image, not by Intune:**
  `configstoragesenseglobalcadence` has no `windowsMultiSession` in `applicability.windowsSkus` in its
  Settings Catalog definition, so Intune does not deliver it to a multi-session host (the other five
  settings it does; verified on the host). The image sets
  `HKLM\SOFTWARE\Policies\Microsoft\Windows\StorageSense\ConfigStorageSenseGlobalCadence = 1`
  (`run-vdot.ps1` in the AVD repo). Without a cadence Storage Sense only runs when free space on C: is
  low, and on a session host that never happens — Storage Sense looks at that drive, not at the
  container. The physical `Storage Sense` policy (cadence 0, 30 days) stays `fysiek`; the two never
  meet on one device.
- **FSLogix compacts the container at sign-out** (`VHD Compact Disk`, explicitly enabled in
  [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md),
  even though it has been the default since FSLogix 2210). What Storage Sense freed up goes back to
  the share. With Azure Files Premium Microsoft bills the provisioned size, so the gain is not in the
  bill but in faster sign-ins and less chance of a full container.

**No more weekly `Invoke-FslShrinkDisk` or FSLShrink.** The built-in compaction does the same at
every sign-out, without a separate VM with rights on the share and without the risk of a script
touching an attached container. The session limits (sign-out after two hours disconnected) make sure
sign-outs actually happen. FSLShrink remains only an emergency measure for containers that are already
large: once, outside office hours, with the hosts in drain mode.

## Rollout plan

The full runbook, including the physical class and migrating from an old set, is in
[PLAYBOOK.en.md](PLAYBOOK.en.md). For AVD in short:

1. **Create the filters.** `WIN - Physical` and `WIN - AVD Multi-session` from
   [`IntuneTemplate/WIN/AssignmentFilters/`](../IntuneTemplate/WIN/AssignmentFilters/README.en.md),
   with a `POST` to `deviceManagement/assignmentFilters`, in the portal or with
   `Set-BaselineAssignment.ps1 -CreateFilters`. Check with *Preview devices*. Before the first CIPP
   run: if the filter does not exist, CIPP assigns without a filter.
2. **CIPP variable `FSLogixStorageAccount`** per tenant (Settings → Custom Variables): the name of
   the storage account, without `.file.core.windows.net`. Without that variable
   `%FSLogixStorageAccount%` stays in the path literally and, with `PreventLoginWithFailure`, nobody
   can sign in to the host any more.
3. **Group SEC-AVD-Session-Hosts** as a dynamic device group, for example
   `(device.displayName -startsWith "<hostpoolprefix>-sh")`. Not for the baseline packages (they use
   the filter), but for the compliance device assignment (step 5), the RDP SSO setting *target
   device groups* on the host pool, and reporting.
4. **Baseline in CIPP.** Stage 1 rolls out `[Baseline] - Baseline-Devices-AVD` (all devices,
   include `WIN - AVD Multi-session`) next to the shared packages. The physical-only policies go
   through the `-Physical` packages and therefore do not reach the host.
5. **Compliance on the device.** Assign the compliance policies multi-session supports —
   Antispyware, Antivirus, Defender for Endpoint Risk, Defender Real Time Protection, Defender Security
   Intelligence, Firewall and OS Version — *also* to SEC-AVD-Session-Hosts. Mind the open point
   below: CIPP's `verifyAssignments` sees that extra assignment as a deviation.
6. **Pilot host pool.** One host pool with Entra join, Intune enrolment and Trusted Launch. Per host
   in Intune: every policy *Succeeded* or *Not applicable*, no *Conflict*. Sign in with a passkey
   without a password prompt, the FSLogix container attaches (`frx list-redirects`, the Kerberos
   ticket with `klist`), print with a driver from the image. Force a sync on the host:
   `deviceenroller.exe /o <enrollment-ID> /c /b` — the PushLaunch task does not exist on multi-session.
7. **Check compliance.** The hosts are compliant in Intune and in Entra ID, and the sign-in logs of
   CA 2060 (report-only) show *would succeed* for sessions from the hosts.
8. **CA 2060 to enforce.** Only once step 7 is right; otherwise Outlook, Teams and the other
   desktop apps in the session stop working.

Then the other host pools; the Entra DS hosts go into drain mode and are removed (Entra DS stays
only for the application servers).

## Open points

- **Host pool for external users.** On a host in SEC-Cloud-PC-External both `AVD Session Host`
  (phase 1, `avd`) and `Cloud PC External Access` (phase 4) land, with different session limits: a
  Conflict, after which neither limit applies. In the package model `AVD Session Host` cannot be
  excluded on its own — an exclude group on `Baseline-Devices-AVD` would also take FSLogix off those
  hosts. Only relevant in a tenant with such a host pool; one solution is to move the session
  limits into a policy of their own.
- **Compliance on the device and `verifyAssignments`.** CIPP manages the assignment of
  `Baseline-Users` (all users) and sees an extra device assignment to SEC-AVD-Session-Hosts as a
  deviation that remediation removes again (`Compare-CIPPIntuneAssignments`: extra include groups
  count as soon as the standard manages the assignment). Until the pipeline puts the compliance
  policies in a package of their own: check after every CIPP run that the device assignment is
  still there.
- **Windows 365.** Cloud PCs fall under neither filter and therefore no longer get the physical
  `Remote Desktop and RPC` either. Check that they get the shared set and the Cloud PC set they need.
- **Device Guard and Credential Guard** can become *Shared* once all host pools have Trusted Launch.
