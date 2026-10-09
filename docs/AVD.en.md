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
Windows policy is added, put it here in one of the four groups as well.

## In short

| Group | Policies | Assignment on AVD |
|---|---:|---|
| **Shared** — physical and AVD, unchanged | 95 | as they are now, without a filter |
| **Physical only** — not on the session hosts | 40 | current assignment + **exclude** filter `WIN - AVD Multi-session` |
| **AVD variant** — physical and AVD each have their own version | 1 | physical version exclude, AVD version include |
| **AVD only** — the new policies and the Cloud PC set | 6 | **include** filter `WIN - AVD Multi-session` (Cloud PC set: own group) |

New in this repo for AVD:

- the assignment filter [`WIN - AVD Multi-session`](../IntuneTemplate/WIN/AssignmentFilters/README.en.md);
- [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md) — FSLogix and the Kerberos ticket for Azure Files;
- [`AVD Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.en.md) — the physical version without the password prompt;
- [`AVD Defender FSLogix Exclusions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.en.md) — the Defender exclusions Microsoft prescribes for FSLogix;
- [`AVD Session Host`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.en.md) — two-hour session limits and Storage Sense off.

All four are in phase 4 with `faseGroep` **SEC-AVD-Session-Hosts**, like the Cloud PC set.

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

## How the filter works

[`WIN-AVD-Multi-Session.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-AVD-Multi-Session.json)
has the rule `(device.operatingSystemSKU -eq "ServerRdsh")`: the SKU of Windows Enterprise
multi-session. In the test tenant it matches exactly the AVD session host and no physical PC at all.
A Windows 365 Cloud PC is single-session and does not fall under it.

A filter always sits next to an assignment — to all devices, all users or a group — and states
which of those devices take part or not:

- **Include** on the AVD policies: only session hosts get them, even if a physical device ends up in
  the group by mistake. CIPP assigns the package `[Baseline] - Baseline-SEC-AVD-Session-Hosts` to
  the group SEC-AVD-Session-Hosts; set the include filter in that package's CIPP standard. Without
  CIPP it also works without a group: all devices with the include filter.
- **Exclude** on the policies that belong only on physical devices: the assignment stays as it is
  (all devices, all users or a group), the filter takes the session hosts out.
- **User-targeted assignments** are the reason for a filter instead of a group.
  `WIN - U - Windows Hello for Business`, `WIN - U - Personal Data Encryption` and the Outlook variants
  go to users. Excluding a *device group* does nothing there: the assignment looks at the user, not
  the device. A filter *is* evaluated on the device the user signs in to — the same user gets
  Windows Hello on their laptop and not in the AVD session.
- **AVD variant:** the physical version gets exclude, the AVD version include. Never both on the same
  host: two policies would then set the same settings and the password prompt of the physical
  version would apply anyway.

`check-scope.js` only checks conflicts between policies in phase 1. The AVD policies (phase 4) fall
outside that; the overlap was therefore checked by hand:

| Setting | AVD policy | Other policy | Handled by |
|---|---|---|---|
| `storage_allowstoragesenseglobal` | AVD Session Host (0) | Storage Sense (1) | Storage Sense is *Physical only* |
| `ts_sessions_idle_limit_2`, `ts_sessions_disconnected_timeout_2` | AVD Session Host (2 hours) | Cloud PC External Access (15 min) | exclude SEC-Cloud-PC-External on AVD Session Host |
| `kerberos_cloudkerberosticketretrievalenabled` | AVD FSLogix Profile Containers (1) | Windows Hello Cloud Kerberos Trust (1) | same value; Cloud Kerberos Trust is also *Physical only* |
| eight settings of Remote Desktop and RPC | AVD Remote Desktop and RPC | Remote Desktop and RPC | same values; the physical one is *AVD variant* (exclude) |
| `ts_time_zone` | — | Cloud PC Session Security | not included in AVD Session Host |

### CIPP and the exclude filter

A CIPP package has one assignment and one filter for all its members. The *Physical only* policies
sit in `Baseline-Devices`, `Baseline-Users` and `Baseline-Pilot` together with shared policies; an
exclude filter on such a package would also take the shared policies off the session hosts. Until
the pipeline has a separate package for the physical policies, set the exclude filter per policy in
Intune (portal or `Set-BaselineAssignment.ps1`, see the rollout plan) and check after a CIPP run that
it is still there. That is an open point, see below.

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
| [D - Printing](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.en.md) | 1 | Sets *Limits print driver installation to Administrators*: printer drivers belong in the golden image. |
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

Exclude on AVD with the exclude filter `WIN - AVD Multi-session`.

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
| [D - Storage Sense](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.en.md) | 1 | Cleans up inside mounted FSLogix profiles; AVD Session Host turns Storage Sense off (different value, so exclude). |
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
| [D - Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.en.md) | 1 | `promptforpassworduponconnection` breaks Entra SSO and passkeys. Physical: exclude filter; AVD: [AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.en.md) with include filter. |

### AVD only — 6

| Policy | Phase | Remark |
|---|---:|---|
| [D - AVD Defender FSLogix Exclusions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.en.md) | 4 | New. Include filter WIN - AVD Multi-session. |
| [D - AVD FSLogix Profile Containers](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md) | 4 | New. Include filter WIN - AVD Multi-session. |
| [D - AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.en.md) | 4 | New. Include filter WIN - AVD Multi-session. |
| [D - AVD Session Host](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.en.md) | 4 | New. Include filter WIN - AVD Multi-session. |
| [D - Cloud PC External Access](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_External_Access.en.md) | 4 | Existing, only on a host pool for external users (SEC-Cloud-PC-External). Clashes there with the session limits of AVD Session Host: exclude SEC-Cloud-PC-External on AVD Session Host. |
| [D - Cloud PC Session Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_Session_Security.en.md) | 4 | Existing, through the group SEC-Cloud-PC (also Windows 365). Also sets time zone redirection. |

## Findings from the test tenant (9 October 2026)

The test ran with the old `[Baseline] X` set in the test tenant, from before the split into the current names.

- **`Limits print driver installation to Administrators`** (in the old Administrative Templates)
  prevents users from installing a printer driver themselves. In the current set that is
  `restrictdriverinstallationtoadministrators` in [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.en.md),
  and it stays *Shared*: it is a security measure against PrintNightmare-style attacks.
  Consequence for AVD: **the printer drivers belong in the golden image.**
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
PreventLoginWithFailure, PreventLoginWithTempProfile), so nothing clashes. Only in the script, because
the Settings Catalog does not know them:

- `LoadCredKeyFromProfile = 1` under `HKLM\SOFTWARE\Policies\Microsoft\AzureADAccount` — needed for
  Entra Kerberos with FSLogix;
- the local administrator in the local group `FSLogix Profile Exclude List`, so that a
  break-glass sign-in always works, even when the share is unreachable.

Two settings are set only by the script, because their definition in the Settings Catalog has not been
verified with certainty: `VolumeType = VHDX` (the default since FSLogix 2210) and `RoamIdentity`
(the required value 0 is the default; Intune does not support token roaming). Both set the Kerberos
ticket (`CloudKerberosTicketRetrievalEnabled`); the storage account app must be excluded from MFA in
Conditional Access.

## Rollout plan

1. **Create the filter.** `WIN-AVD-Multi-Session.json` with a `POST` to
   `deviceManagement/assignmentFilters`, or in the portal. Use *Preview devices* to check that only the
   session hosts match.
2. **Group SEC-AVD-Session-Hosts** as a dynamic device group, for example
   `(device.displayName -startsWith "<hostpoolprefix>-sh")`. CIPP assigns the AVD package to it, and
   compliance needs it (step 5).
3. **Assign the AVD policies with include.** First fill in `OPSLAGACCOUNT-INVULLEN` (in `local/`, not in
   git). Then the package `[Baseline] - Baseline-SEC-AVD-Session-Hosts` in CIPP with the include filter
   in the standard, or in the portal: all devices (or SEC-AVD-Session-Hosts) with the include filter.
   On a host pool for external users: exclude SEC-Cloud-PC-External on `AVD Session Host`.
4. **Exclude on the physical-only policies**, plus the physical `Remote Desktop and RPC`. In the
   portal per policy, or with `Set-BaselineAssignment.ps1 -Name <list> -AllDevices -FilterId <id> -FilterType exclude -Replace`
   (and `-AllUsers` for the U policies). Note: `-Replace` replaces *all* assignments of the policy —
   set a policy with a group or exclusions (update ring 3, the `SEC-Shared-Devices` policies) in the
   portal. Run with `-WhatIf` first.
5. **Compliance on the device.** Assign the compliance policies that multi-session supports —
   Antispyware, Antivirus, Defender for Endpoint Risk, Defender Real Time Protection, Defender Security
   Intelligence, Firewall and OS Version — *also* to SEC-AVD-Session-Hosts.
6. **Pilot host pool.** One host pool with Entra join, Intune enrolment and Trusted Launch. Per host
   in Intune: every policy *Succeeded* or *Not applicable*, no *Conflict*. Sign in with a passkey
   without a password prompt, the FSLogix container attaches (`frx list-redirects`, the Kerberos
   ticket with `klist`), print with a driver from the image.
7. **Check compliance.** The hosts are compliant in Intune and in Entra ID, and the sign-in logs of
   CA 2060 (report-only) show *would succeed* for sessions from the hosts.
8. **CA 2060 to enforce.** Only when step 7 holds; otherwise Outlook, Teams and the other desktop
   apps in the session stop working.

Then the other host pools; the Entra DS hosts go into drain mode and are removed (Entra DS remains
only for the application servers).

## Open points

- **CIPP package for the physical policies.** As long as `Baseline-Devices`, `-Users` and `-Pilot` mix
  shared and physical policies, CIPP cannot set the exclude filter per policy. A package of its own
  (for example a phase or flag in the manifest that `set-packages.js` translates into a package with
  `assignmentFilter`) solves that.
- **Windows 365.** Cloud PCs do not fall under the filter and keep the physical `Remote Desktop and RPC`
  with the password prompt. Check whether SSO works there; if not, SEC-Cloud-PC should get the same
  treatment.
- **VolumeType and RoamIdentity**: look them up in the tenant's settings picker and, if the definition
  is right, add them to `AVD FSLogix Profile Containers`.
- **Device Guard and Credential Guard** can become *Shared* once all host pools have Trusted Launch.
