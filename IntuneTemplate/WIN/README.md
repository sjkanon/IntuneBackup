<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# Windows — 73 policies

Alle policies heten `[Baseline] - WIN - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 64 |
| `DeviceConfigurations/` | 4 |
| `AdministrativeTemplates/` | 1 |
| `CompliancePolicies/` | 4 |

## Device-scoped (D) — 56

Toewijzen aan apparaatgroepen.

| Policy | Type | Instellingen | checkId | Toewijzing | Bron |
|---|---|---:|---|---|---|
| `Administrator Protection` | Settings Catalog | 2 | `INTUNE-BASE-055-DAdministratorProtection` | All Devices | OIB |
| `Attack Surface Reduction` | Settings Catalog | 19 | `INTUNE-BASE-007-ASRDefaultRules` | All Devices | OIB |
| `Audit and Event Logging` | Settings Catalog | 40 | `INTUNE-BASE-009-Auditing` | All Devices | OIB |
| `Automatic Restart Sign On` | Settings Catalog | 3 | `INTUNE-BASE-056-DAutomaticRestartSignOn` | All Devices | OIB |
| `BitLocker` | Settings Catalog | 36 | `INTUNE-BASE-011-Bitlocker` | All Devices | OIB |
| `Cloud Optimized Content` | Settings Catalog | 1 | `INTUNE-BASE-057-DCloudOptimizedContent` | All Devices | OIB |
| `Config Refresh` | Settings Catalog | 2 | `INTUNE-BASE-058-DConfigRefresh` | All Devices | OIB |
| `Defender Additional Configuration` | Settings Catalog | 9 | `INTUNE-BASE-059-DDefenderAdditionalConfiguration` | All Devices | OIB |
| `Defender Antivirus` | Settings Catalog | 31 | `INTUNE-BASE-012-DefaultAVPolicy` | All Devices | OIB |
| `Defender for Endpoint EDR` | Settings Catalog | 3 | `INTUNE-BASE-014-EDRConfiguration` | All Devices | eigen |
| `Defender Security Experience` | Settings Catalog | 4 | `INTUNE-BASE-060-DDefenderSecurityExperience` | All Devices | OIB |
| `Defender Update Ring 1 Pilot` | Settings Catalog | 3 | `INTUNE-BASE-061-DDefenderUpdateRing1Pilot` | — | OIB |
| `Defender Update Ring 2 UAT` | Settings Catalog | 3 | `INTUNE-BASE-062-DDefenderUpdateRing2UAT` | — | OIB |
| `Defender Update Ring 3 Production` | Settings Catalog | 3 | `INTUNE-BASE-063-DDefenderUpdateRing3Production` | All Devices | OIB |
| `Delivery Optimisation` | Settings Catalog | 12 | `INTUNE-BASE-064-DDeliveryOptimisation` | All Devices | OIB |
| `Device Guard and Credential Guard` | Settings Catalog | 8 | `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard` | All Devices | OIB |
| `Device Lock` | Settings Catalog | 15 | `INTUNE-BASE-013-DeviceLock` | All Devices | OIB |
| `Disable NTLM` | Settings Catalog | 3 | `INTUNE-BASE-066-DDisableNTLM` | All Devices | OIB |
| `Endpoint Analytics` | Device config | — | — | All Devices | OIB |
| `Enhanced Phishing Protection` | Settings Catalog | 4 | `INTUNE-BASE-024-Smartscreen` | All Devices | OIB |
| `In Box App Removal` | Settings Catalog | 26 | `INTUNE-BASE-068-DInBoxAppRemoval` | All Devices | OIB |
| `Internet Explorer Legacy` | Settings Catalog | 206 | `INTUNE-BASE-069-DInternetExplorerLegacy` | All Devices | OIB |
| `Legacy Hardening` | Settings Catalog | 24 | `INTUNE-BASE-070-DLegacyHardening` | All Devices | eigen |
| `Local Administrators` | Settings Catalog | 4 | `INTUNE-BASE-071-DLocalAdministrators` | All Devices | OIB |
| `Local Security Policies` | Settings Catalog | 24 | `INTUNE-BASE-018-LocalPoliciesSecurityOptions` | All Devices | OIB |
| `Location and Privacy` | Settings Catalog | 3 | `INTUNE-BASE-022-Privacy` | All Devices | OIB |
| `Login and Lock Screen` | Settings Catalog | 8 | `INTUNE-BASE-072-DLoginAndLockScreen` | All Devices | OIB |
| `Microsoft Accounts` | Settings Catalog | 5 | `INTUNE-BASE-073-DMicrosoftAccounts` | All Devices | OIB |
| `Microsoft Edge Search Engine` | ADMX | 5 | `INTUNE-BASE-015-EdgeStandardSearchEngineGoogle` | All Devices | eigen |
| `Microsoft Edge Security` | Settings Catalog | 54 | `INTUNE-BASE-020-MicrosoftEdge` | All Devices | OIB |
| `Microsoft Edge Updates` | Settings Catalog | 22 | `INTUNE-BASE-074-DMicrosoftEdgeUpdates` | All Devices | OIB |
| `Microsoft Office Security` | Settings Catalog | 209 | `INTUNE-BASE-075-DMicrosoftOfficeSecurity` | All Devices | OIB |
| `Microsoft Office Updates` | Settings Catalog | 6 | `INTUNE-BASE-021-OfficeUpdates` | All Devices | OIB |
| `Microsoft OneDrive` | Settings Catalog | 19 | `INTUNE-BASE-029-OnedriveSilentLogin` | All Devices | OIB |
| `Microsoft Store` | Settings Catalog | 7 | `INTUNE-BASE-019-MicrosoftAppStore` | All Devices | OIB |
| `Passwordless` | Settings Catalog | 4 | `INTUNE-BASE-076-DPasswordless` | All Devices | OIB |
| `Printing` | Settings Catalog | 20 | `INTUNE-BASE-077-DPrinting` | All Devices | OIB |
| `Remote Desktop and RPC` | Settings Catalog | 12 | `INTUNE-BASE-078-DRemoteDesktopAndRPC` | All Devices | OIB |
| `Script File Associations` | Settings Catalog | 1 | `INTUNE-BASE-079-DScriptFileAssociations` | All Devices | OIB |
| `Security Hardening` | Settings Catalog | 96 | `INTUNE-BASE-080-DSecurityHardening` | All Devices | OIB |
| `Settings Sync` | Settings Catalog | 4 | `INTUNE-BASE-081-DSettingsSync` | All Devices | OIB |
| `Timezone` | Settings Catalog | 10 | `INTUNE-BASE-082-DTimezone` | All Devices | OIB |
| `Update Reports and Telemetry` | Settings Catalog | 5 | `INTUNE-BASE-083-DUpdateReportsAndTelemetry` | All Devices | OIB |
| `User Rights` | Settings Catalog | 25 | `INTUNE-BASE-026-UserRights` | All Devices | OIB |
| `Windows Feature Configuration` | Settings Catalog | 8 | `INTUNE-BASE-084-DWindowsFeatureConfiguration` | All Devices | OIB |
| `Windows Firewall Rules` | Settings Catalog | 48 | `INTUNE-BASE-085-DWindowsFirewallRules` | All Devices | OIB |
| `Windows Firewall` | Settings Catalog | 31 | `INTUNE-BASE-016-Firewall` | All Devices | OIB |
| `Windows Hello Cloud Kerberos Trust` | Settings Catalog | 2 | `INTUNE-BASE-086-DWindowsHelloCloudKerberosTrust` | All Devices | OIB |
| `Windows Hello for Business` | Settings Catalog | 6 | `INTUNE-BASE-087-DWindowsHelloForBusiness` | All Devices | OIB |
| `Windows LAPS` | Settings Catalog | 13 | `INTUNE-BASE-027-WindowsLAPSPolicy` | All Devices | OIB |
| `Windows Package Manager` | Settings Catalog | 5 | `INTUNE-BASE-088-DWindowsPackageManager` | All Devices | OIB |
| `Windows Sandbox` | Settings Catalog | 6 | `INTUNE-BASE-089-DWindowsSandbox` | All Devices | OIB |
| `Windows Subsystem for Linux` | Settings Catalog | 10 | `INTUNE-BASE-090-DWindowsSubsystemForLinux` | All Devices | OIB |
| `Windows Update Ring 1 Pilot` | Device config | — | — | — | OIB |
| `Windows Update Ring 2 UAT` | Device config | — | — | — | OIB |
| `Windows Update Ring 3 Production` | Device config | — | — | All Devices | eigen |

## User-scoped (U) — 17

Toewijzen aan gebruikersgroepen.

| Policy | Type | Instellingen | checkId | Toewijzing | Bron |
|---|---|---:|---|---|---|
| `Compliance Defender for Endpoint` | Compliance | — | — | All Users | OIB |
| `Compliance Device Health` | Compliance | — | — | All Users | OIB |
| `Compliance Device Security` | Compliance | — | — | All Users | OIB |
| `Compliance Password` | Compliance | — | — | All Users | OIB |
| `Copilot` | Settings Catalog | 2 | `INTUNE-BASE-097-UCopilot` | All Users | OIB |
| `Microsoft Edge Extensions` | Settings Catalog | 6 | `INTUNE-BASE-098-UMicrosoftEdgeExtensions` | All Users | OIB |
| `Microsoft Edge Password Management` | Settings Catalog | 5 | `INTUNE-BASE-099-UMicrosoftEdgePasswordManagement` | All Users | OIB |
| `Microsoft Edge Profiles and Sync` | Settings Catalog | 9 | `INTUNE-BASE-100-UMicrosoftEdgeProfilesAndSync` | All Users | OIB |
| `Microsoft Edge User Experience` | Settings Catalog | 20 | `INTUNE-BASE-101-UMicrosoftEdgeUserExperience` | All Users | OIB |
| `Microsoft Office Experience` | Settings Catalog | 29 | `INTUNE-BASE-102-UMicrosoftOfficeExperience` | All Users | OIB |
| `Microsoft Office Security` | Settings Catalog | 221 | `INTUNE-BASE-103-UMicrosoftOfficeSecurity` | All Users | OIB |
| `Microsoft OneDrive` | Settings Catalog | 8 | `INTUNE-BASE-032-UMicrosoftOneDrive` | All Users | OIB |
| `Microsoft Outlook` | Settings Catalog | 1 | `INTUNE-BASE-010-AutomaticConfigurationOfOutlook` | All Users | eigen |
| `Microsoft Store` | Settings Catalog | 3 | `INTUNE-BASE-104-UMicrosoftStore` | All Users | OIB |
| `Personal Data Encryption` | Settings Catalog | 4 | `INTUNE-BASE-105-UPersonalDataEncryption` | All Users | OIB |
| `Windows Spotlight` | Settings Catalog | 11 | `INTUNE-BASE-106-UWindowsSpotlight` | All Users | OIB |
| `Windows User Experience` | Settings Catalog | 2 | `INTUNE-BASE-031-UWindowsUserExperience` | All Users | eigen |

---

Kolom **Bron**: `OIB` komt uit [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) via
[`_oib-manifest.json`](../_oib-manifest.json); `eigen` staat alleen in deze baseline.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
