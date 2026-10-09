**Nederlands** · [English](AVD.en.md) · [Français](AVD.fr.md)

# Azure Virtual Desktop: gezamenlijke policies en uitrolplan

Welke Windows-policies uit deze baseline ook op de Azure Virtual Desktop-sessiehosts horen, welke
alleen op fysieke toestellen, en in welke volgorde je dat in een tenant zet. Het gaat om sessiehosts
met **Windows 11 Enterprise multi-session**, **Entra-joined en ingeschreven in Intune**, met
**FSLogix-profielcontainers op Azure Files** en **Entra Kerberos** voor de toegang tot het share.

De indeling volgt `infra/INTUNE-BASELINE.md` (secties 2 tot 4) in de AVD-testrepo, getoetst aan
[Intune voor AVD multi-session](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session),
en de bevindingen uit de testtenant van 9 oktober 2026. De lijst hieronder is opgebouwd uit de
werkelijke policynamen in `IntuneTemplate/WIN` (142 policies). Dit document is handwerk: komt er
een Windows-policy bij, zet hem dan ook hier in een van de vier groepen.

## In het kort

| Groep | Policies | Toewijzing op AVD |
|---|---:|---|
| **Gezamenlijk** — fysiek en AVD, ongewijzigd | 95 | zoals ze nu staan, zonder filter |
| **Alleen fysiek** — niet op de sessiehosts | 40 | huidige toewijzing + **exclude**-filter `WIN - AVD Multi-session` |
| **AVD-variant** — fysiek en AVD elk een eigen versie | 1 | fysieke versie exclude, AVD-versie include |
| **Alleen AVD** — de nieuwe policies en de Cloud PC-set | 6 | **include**-filter `WIN - AVD Multi-session` (Cloud PC-set: eigen groep) |

Nieuw in deze repo voor AVD:

- het toewijzingsfilter [`WIN - AVD Multi-session`](../IntuneTemplate/WIN/AssignmentFilters/README.md);
- [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.md) — FSLogix en het Kerberos-ticket voor Azure Files;
- [`AVD Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.md) — de fysieke versie zonder wachtwoordprompt;
- [`AVD Defender FSLogix Exclusions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.md) — de Defender-uitsluitingen die Microsoft voor FSLogix voorschrijft;
- [`AVD Session Host`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.md) — sessielimieten van twee uur en Storage Sense uit.

Alle vier staan in fase 4 met `faseGroep` **SEC-AVD-Session-Hosts**, zoals de Cloud PC-set.

## Wat Intune op multi-session wel en niet doet

- **Settings Catalog** werkt, op apparaat- én gebruikersniveau. **Templates** (Device Configurations)
  werken niet, behalve certificaten en een VPN-device tunnel; ze komen op *Not applicable*.
- **Compliance:** alleen OS-versie, wachtwoord, Defender, firewall, antivirus, antispyware,
  realtimebeveiliging en het Defender-risico. BitLocker, TPM, Secure Boot en Code Integrity melden
  *Not applicable* en maken de host niet niet-compliant. En: **compliance gericht op gebruikers
  wordt op multi-session niet ondersteund.** De compliancepolicies in deze baseline (`WIN - U - Compliance …`)
  gaan naar alle gebruikers; voor de sessiehosts moeten ze óók aan de apparaatgroep
  SEC-AVD-Session-Hosts worden toegewezen. Zonder dat is de host niet compliant en blokkeert
  CA 2060 de desktop-apps in de sessie zodra die op enforce staat.
- **Update rings** werken niet. Updates komen met de maandelijkse image-rebuild.
- **Apps** alleen in systeemcontext en als *Required*.
- **Geen** Autopilot, ESP, wissen, vergrendelen op afstand of rotatie van de BitLocker-sleutel.

## Hoe het filter werkt

[`WIN-AVD-Multi-Session.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-AVD-Multi-Session.json)
heeft de regel `(device.operatingSystemSKU -eq "ServerRdsh")`: de SKU van Windows Enterprise
multi-session. In de testtenant matcht het precies de AVD-sessiehost en geen enkele fysieke pc.
Een Windows 365 Cloud PC is single-session en valt er niet onder.

Een filter staat altijd naast een toewijzing — aan alle apparaten, alle gebruikers of een groep —
en zegt welke apparaten daarvan mee- of niet meedoen:

- **Include** op de AVD-policies: alleen sessiehosts krijgen ze, ook als er per ongeluk een fysiek
  toestel in de groep belandt. CIPP wijst het pakket `[Baseline] - Baseline-SEC-AVD-Session-Hosts`
  toe aan de groep SEC-AVD-Session-Hosts; zet het include-filter in de CIPP-standard van dat pakket.
  Zonder CIPP kan het ook zonder groep: alle apparaten met het include-filter.
- **Exclude** op de policies die alleen op fysieke toestellen horen: de toewijzing blijft zoals ze
  is (alle apparaten, alle gebruikers of een groep), het filter haalt de sessiehosts eruit.
- **Gebruikersgerichte toewijzingen** zijn de reden voor een filter in plaats van een groep.
  `WIN - U - Windows Hello for Business`, `WIN - U - Personal Data Encryption` en de Outlook-varianten
  gaan naar gebruikers. Een uitsluiting van een *apparaatgroep* doet daar niets: de toewijzing
  kijkt naar de gebruiker, niet naar het apparaat. Een filter wordt wél op het apparaat getoetst
  waar de gebruiker zich aanmeldt — dezelfde gebruiker krijgt Windows Hello op zijn laptop en niet
  in de AVD-sessie.
- **AVD-variant:** de fysieke versie krijgt exclude, de AVD-versie include. Nooit beide op dezelfde
  host: dan zetten twee policies dezelfde instellingen en geldt de wachtwoordprompt van de fysieke
  versie alsnog.

`check-scope.js` controleert conflicten alleen tussen policies in fase 1. De AVD-policies (fase 4)
vallen daarbuiten; de overlap is daarom met de hand nagelopen:

| Instelling | AVD-policy | Andere policy | Afgehandeld door |
|---|---|---|---|
| `storage_allowstoragesenseglobal` | AVD Session Host (0) | Storage Sense (1) | Storage Sense is *Alleen fysiek* |
| `ts_sessions_idle_limit_2`, `ts_sessions_disconnected_timeout_2` | AVD Session Host (2 uur) | Cloud PC External Access (15 min) | SEC-Cloud-PC-External uitsluiten bij AVD Session Host |
| `kerberos_cloudkerberosticketretrievalenabled` | AVD FSLogix Profile Containers (1) | Windows Hello Cloud Kerberos Trust (1) | zelfde waarde; Cloud Kerberos Trust is bovendien *Alleen fysiek* |
| acht instellingen van Remote Desktop and RPC | AVD Remote Desktop and RPC | Remote Desktop and RPC | zelfde waarden; de fysieke is *AVD-variant* (exclude) |
| `ts_time_zone` | — | Cloud PC Session Security | niet opgenomen in AVD Session Host |

### CIPP en het exclude-filter

Een CIPP-pakket heeft één toewijzing en één filter voor al zijn leden. De policies die *Alleen
fysiek* zijn, zitten in `Baseline-Devices`, `Baseline-Users` en `Baseline-Pilot` samen met
gezamenlijke policies; een exclude-filter op zo'n pakket zou ook de gezamenlijke policies van de
sessiehosts halen. Tot de pijplijn een apart pakket voor de fysieke policies kent, zet je het
exclude-filter per policy in Intune (portal of `Set-BaselineAssignment.ps1`, zie het uitrolplan) en
controleer je na een CIPP-run dat het er nog staat. Dat is een open punt, zie onderaan.

## Indeling per policy

### Gezamenlijk — 95

Fysiek en AVD, ongewijzigd en zonder filter.

| Policy | Fase | Opmerking |
|---|---:|---|
| [D - Access Control](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.md) | 2 |  |
| [D - Account Lockout](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.md) | 2 |  |
| [D - Administrator Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.md) | 2 |  |
| [D - AI Tooling](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.md) | 1 |  |
| [D - Attack Surface Reduction](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.md) | 1 | Op AVD eerst in auditmodus bekijken (Defender ASR Policy Audit Mode). |
| [D - Audit and Event Logging](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_and_Event_Logging.md) | 1 |  |
| [D - Audit Policy Enforcement](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.md) | 1 |  |
| [D - Cloud Optimized Content](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_Optimized_Content.md) | 1 |  |
| [D - Config Refresh](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Config_Refresh.md) | 1 |  |
| [D - Cryptography](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.md) | 2 |  |
| [D - Data Minimisation](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Data_Minimisation.md) | 1 |  |
| [D - Defender Additional Configuration](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Additional_Configuration.md) | 1 |  |
| [D - Defender Antivirus](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Antivirus.md) | 1 |  |
| [D - Defender ASR Policy Audit Mode](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.md) | 4 |  |
| [D - Defender AV Policy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_AV_Policy.md) | 5 |  |
| [D - Defender EDR Policy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.md) | 1 |  |
| [D - Defender for Endpoint EDR](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.md) | 5 |  |
| [D - Defender Ransomware Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.md) | 1 |  |
| [D - Defender Security Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Security_Experience.md) | 1 |  |
| [D - Defender Update Ring 1 Pilot](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.md) | 4 |  |
| [D - Defender Update Ring 2 UAT](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.md) | 4 |  |
| [D - Defender Update Ring 3 Production](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.md) | 1 |  |
| [D - Enhanced Phishing Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.md) | 1 |  |
| [D - Internet Explorer Legacy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.md) | 1 |  |
| [D - Legacy Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.md) | 1 |  |
| [D - Local Administrators](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Administrators.md) | 1 |  |
| [D - Local Security Policies](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.md) | 1 |  |
| [D - Location and Privacy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Location_and_Privacy.md) | 1 |  |
| [D - Logging](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.md) | 1 |  |
| [D - Login and Lock Screen](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.md) | 1 |  |
| [D - Microsoft Accounts](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.md) | 1 |  |
| [D - Microsoft Edge DNS over HTTPS Automatic](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.md) | 2 |  |
| [D - Microsoft Edge DNS over HTTPS Secure](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.md) | 5 |  |
| [D - Microsoft Edge Search Engine](../IntuneTemplate/WIN/AdministrativeTemplates/Baseline_WIN_D_Microsoft_Edge_Search_Engine.md) | 5 |  |
| [D - Microsoft Edge Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.md) | 1 |  |
| [D - Microsoft Edge Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Updates.md) | 1 |  |
| [D - Microsoft Office Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.md) | 1 |  |
| [D - Microsoft OneDrive](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.md) | 1 | Known Folder Move en Files On-Demand werken samen met FSLogix. |
| [D - Microsoft Store](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.md) | 1 |  |
| [D - Network Authentication Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.md) | 2 |  |
| [D - Printing](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.md) | 1 | Zet *Limits print driver installation to Administrators*: printerdrivers horen in de golden image. |
| [D - Printing Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.md) | 2 |  |
| [D - Privacy and Telemetry](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Privacy_and_Telemetry.md) | 1 |  |
| [D - Remote Access Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.md) | 2 |  |
| [D - Script File Associations](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.md) | 2 |  |
| [D - Security Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.md) | 1 |  |
| [D - Security Log Monitoring](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.md) | 2 |  |
| [D - Settings Sync](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.md) | 1 |  |
| [D - Threat Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.md) | 1 |  |
| [D - Update Reports and Telemetry](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.md) | 1 |  |
| [D - User Rights](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.md) | 1 | Weigert RDP-aanmelding voor lokale accounts (S-1-5-113): een breakglass-beheerder meldt via de Azure-console aan, niet via RDP. |
| [D - Windows AI Features Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.md) | 5 | Restricted of Permitted naar keuze, zoals op fysieke toestellen. |
| [D - Windows AI Features Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.md) | 2 | Restricted of Permitted naar keuze, zoals op fysieke toestellen. |
| [D - Windows AI Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.md) | 5 | Restricted of Permitted naar keuze, zoals op fysieke toestellen. |
| [D - Windows AI Recall Boundaries](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.md) | 3 |  |
| [D - Windows AI Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.md) | 1 | Restricted of Permitted naar keuze, zoals op fysieke toestellen. |
| [D - Windows Component Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.md) | 2 |  |
| [D - Windows Event Forwarding](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.md) | 3 | Alleen als er een collector is. |
| [D - Windows Feature Configuration](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Feature_Configuration.md) | 1 |  |
| [D - Windows Firewall](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.md) | 1 |  |
| [D - Windows Firewall Rules](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.md) | 1 |  |
| [D - Windows LAPS](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.md) | 1 |  |
| [D - Windows Package Manager](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Package_Manager.md) | 1 |  |
| [D - Windows Sandbox](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Sandbox.md) | 1 |  |
| [D - Windows Subsystem for Linux](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.md) | 1 |  |
| [U - AI Usage Control Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.md) | 5 |  |
| [U - AI Usage Control Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.md) | 2 |  |
| [U - Attachment Scanning](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Attachment_Scanning.md) | 1 |  |
| [U - Compliance Antispyware](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.md) | 1 | Op multi-session alleen via een **apparaattoewijzing** (SEC-AVD-Session-Hosts): gebruikersgerichte compliance wordt daar niet ondersteund. |
| [U - Compliance Antivirus](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.md) | 1 | Op multi-session alleen via een **apparaattoewijzing** (SEC-AVD-Session-Hosts): gebruikersgerichte compliance wordt daar niet ondersteund. |
| [U - Compliance BitLocker](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.md) | 1 | Meldt op multi-session *Not applicable*; maakt de host niet niet-compliant. |
| [U - Compliance Code Integrity](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.md) | 1 | Meldt op multi-session *Not applicable*; maakt de host niet niet-compliant. |
| [U - Compliance Defender for Endpoint Risk](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.md) | 3 | Op multi-session alleen via een **apparaattoewijzing** (SEC-AVD-Session-Hosts): gebruikersgerichte compliance wordt daar niet ondersteund. |
| [U - Compliance Defender Real Time Protection](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.md) | 1 | Op multi-session alleen via een **apparaattoewijzing** (SEC-AVD-Session-Hosts): gebruikersgerichte compliance wordt daar niet ondersteund. |
| [U - Compliance Defender Security Intelligence](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.md) | 1 | Op multi-session alleen via een **apparaattoewijzing** (SEC-AVD-Session-Hosts): gebruikersgerichte compliance wordt daar niet ondersteund. |
| [U - Compliance Firewall](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.md) | 1 | Op multi-session alleen via een **apparaattoewijzing** (SEC-AVD-Session-Hosts): gebruikersgerichte compliance wordt daar niet ondersteund. |
| [U - Compliance OS Version](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.md) | 2 | Op multi-session alleen via een **apparaattoewijzing** (SEC-AVD-Session-Hosts): gebruikersgerichte compliance wordt daar niet ondersteund. |
| [U - Compliance Secure Boot](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.md) | 1 | Meldt op multi-session *Not applicable*; maakt de host niet niet-compliant. |
| [U - Compliance TPM](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.md) | 1 | Meldt op multi-session *Not applicable*; maakt de host niet niet-compliant. |
| [U - Copilot](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Copilot.md) | 1 |  |
| [U - File Sharing Restrictions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.md) | 2 |  |
| [U - Microsoft Edge Extensions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Extensions.md) | 1 |  |
| [U - Microsoft Edge Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Management.md) | 2 |  |
| [U - Microsoft Edge Password Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Password_Management.md) | 1 |  |
| [U - Microsoft Edge Profiles and Sync](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.md) | 1 |  |
| [U - Microsoft Edge User Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_User_Experience.md) | 1 |  |
| [U - Microsoft Office Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Experience.md) | 1 |  |
| [U - Microsoft Office Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.md) | 1 |  |
| [U - Microsoft OneDrive](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_OneDrive.md) | 1 | Known Folder Move en Files On-Demand werken samen met FSLogix. |
| [U - Microsoft Outlook](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook.md) | 1 |  |
| [U - Microsoft Outlook Cached Mode Managed](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.md) | 2 | De keuze voor AVD: eigen mailbox gecached in het FSLogix-profiel, gedeelde mailboxen online. |
| [U - Microsoft Store](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.md) | 1 |  |
| [U - Microsoft Teams](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.md) | 2 |  |
| [U - Windows Spotlight](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Spotlight.md) | 1 |  |
| [U - Windows User Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.md) | 1 |  |

### Alleen fysiek — 40

Op AVD uitsluiten met het exclude-filter `WIN - AVD Multi-session`.

| Policy | Fase | Waarom niet op AVD |
|---|---:|---|
| [D - Automatic Restart Sign-On](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Automatic_Restart_Sign_On.md) | 1 | Niet van toepassing op multi-session of op pooled hosts. |
| [D - BitLocker](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.md) | 1 | Azure versleutelt de schijf al (SSE, encryption at host). Compliance BitLocker meldt op multi-session *Not applicable*. |
| [D - Bluetooth Allowed Services](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Bluetooth_Allowed_Services.md) | 2 | Hardware die een VM niet heeft; redirectie staat al uit via Cloud PC Session Security. |
| [D - Business Continuity](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.md) | 1 | Niet van toepassing op multi-session of op pooled hosts. |
| [D - Delivery Optimisation](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Delivery_Optimisation.md) | 1 | Niet van toepassing op multi-session of op pooled hosts. |
| [D - Device Guard and Credential Guard](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) | 2 | Werkt alleen op een Trusted Launch-VM. Zet Trusted Launch aan als je deze policy op AVD wilt houden; dan wordt het *Gezamenlijk*. |
| [D - Device Lock](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.md) | 1 | Hardware die een VM niet heeft; redirectie staat al uit via Cloud PC Session Security. |
| [D - Disable NTLM](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.md) | 2 | Shares en apps op Entra DS vallen vanaf een Entra-joined host terug op NTLM. |
| [D - Endpoint Analytics](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Endpoint_Analytics.md) | 1 | Device configuration-template: niet ondersteund op multi-session. |
| [D - Enrollment Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.md) | 2 | Niet van toepassing op multi-session of op pooled hosts. |
| [D - Google Chrome Extensions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Extensions.md) | 2 | Chrome zit niet in de image. |
| [D - Google Chrome Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Security.md) | 2 | Chrome zit niet in de image. |
| [D - Google Chrome Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Updates.md) | 1 | Chrome zit niet in de image. |
| [D - In-Box App Removal](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.md) | 2 | Gebeurt al in de image (VDOT). Dubbel, niet schadelijk. |
| [D - Kernel DMA Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.md) | 2 | Een VM heeft geen DMA-poorten. |
| [D - Logon Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.md) | 2 | CTRL+ALT+DEL heeft geen zin in een RDP-sessie. Eerst testen of laten vallen. |
| [D - Microsoft Office Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.md) | 1 | Office automatisch bijwerken op een pooled host maakt de hosts onderling verschillend; updates komen met de image. |
| [D - Passwordless](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.md) | 1 | Verbergt het wachtwoordveld; zonder SSO kan dan niemand meer aanmelden op de host. |
| [D - Power Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.md) | 1 | Hardware die een VM niet heeft; redirectie staat al uit via Cloud PC Session Security. |
| [D - Removable Storage](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.md) | 2 | Hardware die een VM niet heeft; redirectie staat al uit via Cloud PC Session Security. |
| [D - Storage Sense](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.md) | 1 | Ruimt op in gekoppelde FSLogix-profielen; AVD Session Host zet Storage Sense uit (andere waarde, dus uitsluiten). |
| [D - Timezone](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Timezone.md) | 1 | Automatische tijdzone botst met de tijdzone-redirectie (`ts_time_zone`) uit Cloud PC Session Security. |
| [D - Wifi Corporate](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.md) | 3 | Device configuration-template: niet ondersteund op multi-session, en een VM heeft geen wifi. |
| [D - Wifi Guest](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.md) | 3 | Device configuration-template: niet ondersteund op multi-session, en een VM heeft geen wifi. |
| [D - Windows Hello Cloud Kerberos Trust](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.md) | 1 | Hoort bij Windows Hello. Het Kerberos-ticket voor Azure Files zet AVD FSLogix Profile Containers zelf. |
| [D - Windows Hello for Business](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.md) | 2 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |
| [D - Windows Hello for Business Multi User](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.md) | 4 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |
| [D - Windows Hello Passkey PIN Complexity Alphanumeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.md) | 2 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |
| [D - Windows Hello Passkey PIN Complexity Numeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.md) | 5 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |
| [D - Windows Hello PIN Complexity Alphanumeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.md) | 5 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |
| [D - Windows Hello PIN Complexity Numeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.md) | 5 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |
| [D - Windows Update Ring 1 Pilot](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.md) | 4 | Update rings werken niet op multi-session; updates komen met de maandelijkse image-rebuild. |
| [D - Windows Update Ring 2 UAT](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.md) | 4 | Update rings werken niet op multi-session; updates komen met de maandelijkse image-rebuild. |
| [D - Windows Update Ring 3 Production](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.md) | 1 | Update rings werken niet op multi-session; updates komen met de maandelijkse image-rebuild. |
| [D - Wireless and Peripherals](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.md) | 1 | Hardware die een VM niet heeft; redirectie staat al uit via Cloud PC Session Security. |
| [D - Wireless Shared Devices](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.md) | 4 | Hardware die een VM niet heeft; redirectie staat al uit via Cloud PC Session Security. |
| [U - Microsoft Outlook Cached Mode Default](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.md) | 5 | Fase 5-alternatief. Op AVD altijd *Cached Mode Managed*; *Off* maakt Outlook traag. |
| [U - Microsoft Outlook Cached Mode Off](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.md) | 5 | Fase 5-alternatief. Op AVD altijd *Cached Mode Managed*; *Off* maakt Outlook traag. |
| [U - Personal Data Encryption](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.md) | 1 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |
| [U - Windows Hello for Business](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.md) | 2 | Geen Windows Hello-aanmelding op een sessiehost; PDE hangt aan Hello. |

### AVD-variant — 1

| Policy | Fase | Opmerking |
|---|---:|---|
| [D - Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) | 1 | `promptforpassworduponconnection` breekt Entra-SSO en passkeys. Fysiek: exclude-filter; AVD: [AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.md) met include-filter. |

### Alleen AVD — 6

| Policy | Fase | Opmerking |
|---|---:|---|
| [D - AVD Defender FSLogix Exclusions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.md) | 4 | Nieuw. Include-filter WIN - AVD Multi-session. |
| [D - AVD FSLogix Profile Containers](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.md) | 4 | Nieuw. Include-filter WIN - AVD Multi-session. |
| [D - AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.md) | 4 | Nieuw. Include-filter WIN - AVD Multi-session. |
| [D - AVD Session Host](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.md) | 4 | Nieuw. Include-filter WIN - AVD Multi-session. |
| [D - Cloud PC External Access](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_External_Access.md) | 4 | Bestaand, alleen op een hostpool voor externen (SEC-Cloud-PC-External). Botst daar met de sessielimieten van AVD Session Host: sluit SEC-Cloud-PC-External uit bij AVD Session Host. |
| [D - Cloud PC Session Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_Session_Security.md) | 4 | Bestaand, via de groep SEC-Cloud-PC (ook Windows 365). Zet ook de tijdzone-redirectie. |

## Bevindingen uit de testtenant (9 oktober 2026)

De test liep met de oude `[Baseline] X`-set in de testtenant, van vóór de opsplitsing in de huidige namen.

- **`Limits print driver installation to Administrators`** (in de oude Administrative Templates)
  blokkeert dat gebruikers zelf een printerdriver installeren. In de huidige set is dat
  `restrictdriverinstallationtoadministrators` in [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.md),
  en die blijft *Gezamenlijk*: het is een beveiligingsmaatregel tegen PrintNightmare-achtige
  aanvallen. Gevolg voor AVD: **de printerdrivers horen in de golden image.**
- **`promptforpassworduponconnection`** stond in de oude `[Baseline] Administrative Templates`. In
  de huidige set zit hij in `Remote Desktop and RPC`, en bij de splitsing gaat hij naar de
  AVD-variant — die hem juist níet zet. Met de prompt vraagt de sessiehost bij elke verbinding om
  een wachtwoord en werkt Entra-SSO met een passkey niet.
- **In de oude set uitgesloten** op de sessiehost: Bitlocker, Device Lock, Windows Hello For
  Business, Windows 11 Update (de update ring) en Office Updates. Alle vijf staan hier onder
  *Alleen fysiek*.

## FSLogix: Intune én het hostscript

FSLogix wordt op twee plekken ingesteld, met opzet:

- **Het hostscript** `configure-fslogix.ps1` in de AVD-repo draait als Run Command bij de deploy
  van een host. Een nieuwe host krijgt de Intune-policy pas na de inschrijving en de eerste sync;
  zonder het script zou de eerste aanmelding op een nieuwe host zonder container gebeuren — of,
  met `PreventLoginWithFailure`, helemaal niet. Het script zet dezelfde waarden direct, dus de eerste
  aanmelding gaat al goed.
- **De Intune-policy** [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.md)
  houdt de waarden daarna centraal en zet ze terug als iemand ze op een host wijzigt (drift).

Beide schrijven dezelfde registerwaarden onder `HKLM\SOFTWARE\FSLogix\Profiles` (Enabled,
VHDLocations, SizeInMBs, IsDynamic, FlipFlopProfileDirectoryName, DeleteLocalProfileWhenVHDShouldApply,
PreventLoginWithFailure, PreventLoginWithTempProfile), dus er botst niets. Wat alleen in het script
staat, omdat de Settings Catalog het niet kent:

- `LoadCredKeyFromProfile = 1` onder `HKLM\SOFTWARE\Policies\Microsoft\AzureADAccount` — nodig voor
  Entra Kerberos met FSLogix;
- de lokale beheerder in de lokale groep `FSLogix Profile Exclude List`, zodat een
  breakglass-aanmelding altijd werkt, ook als het share onbereikbaar is.

Twee instellingen zet alleen het script, omdat hun definitie in de Settings Catalog niet met
zekerheid is geverifieerd: `VolumeType = VHDX` (sinds FSLogix 2210 de standaard) en `RoamIdentity`
(de vereiste waarde 0 is de standaard; Intune ondersteunt geen token-roaming). Het Kerberos-ticket
(`CloudKerberosTicketRetrievalEnabled`) zetten beide; de app van het opslagaccount moet in
Conditional Access van MFA zijn uitgesloten.

## Uitrolplan

1. **Filter aanmaken.** `WIN-AVD-Multi-Session.json` met een `POST` naar
   `deviceManagement/assignmentFilters`, of in de portal. Controleer met *Preview devices* dat
   alleen de sessiehosts matchen.
2. **Groep SEC-AVD-Session-Hosts** als dynamische apparaatgroep, bijvoorbeeld
   `(device.displayName -startsWith "<hostpoolprefix>-sh")`. CIPP wijst daar het AVD-pakket aan
   toe, en de compliance heeft hem nodig (stap 5).
3. **AVD-policies toewijzen met include.** Vul eerst `OPSLAGACCOUNT-INVULLEN` in (in `local/`, niet in
   git). Daarna het pakket `[Baseline] - Baseline-SEC-AVD-Session-Hosts` in CIPP met het include-filter
   in de standard, of in de portal: alle apparaten (of SEC-AVD-Session-Hosts) met include-filter.
   Op een hostpool voor externen: SEC-Cloud-PC-External uitsluiten bij `AVD Session Host`.
4. **Exclude op de policies die alleen fysiek zijn**, plus de fysieke `Remote Desktop and RPC`.
   In de portal per policy, of met `Set-BaselineAssignment.ps1 -Name <lijst> -AllDevices -FilterId <id> -FilterType exclude -Replace`
   (en `-AllUsers` voor de U-policies). Let op: `-Replace` vervangt álle toewijzingen van de policy —
   een policy met een groep of uitsluitingen (update ring 3, de `SEC-Shared-Devices`-policies) zet je
   in de portal. Draai eerst met `-WhatIf`.
5. **Compliance op het apparaat.** Wijs de compliancepolicies die multi-session ondersteunt —
   Antispyware, Antivirus, Defender for Endpoint Risk, Defender Real Time Protection, Defender Security
   Intelligence, Firewall en OS Version — óók toe aan SEC-AVD-Session-Hosts.
6. **Pilot-hostpool.** Eén hostpool met Entra join, Intune-inschrijving en Trusted Launch. Per host
   in Intune: elke policy *Succeeded* of *Not applicable*, geen *Conflict*. Aanmelden met een passkey
   zonder wachtwoordprompt, de FSLogix-container koppelt (`frx list-redirects`, het
   Kerberos-ticket met `klist`), printen met een driver uit de image.
7. **Compliance controleren.** De hosts staan in Intune en in Entra ID als compliant, en de
   aanmeldlogboeken van CA 2060 (report-only) tonen voor sessies vanaf de hosts *zou slagen*.
8. **CA 2060 naar enforce.** Pas als stap 7 klopt; anders werken Outlook, Teams en de andere
   desktop-apps in de sessie niet meer.

Daarna de overige hostpools; de Entra DS-hosts gaan in drain mode en worden weggehaald (Entra DS
blijft alleen voor de applicatieservers).

## Open punten

- **CIPP-pakket voor de fysieke policies.** Zolang `Baseline-Devices`, `-Users` en `-Pilot` gezamenlijke
  en fysieke policies mengen, kan CIPP het exclude-filter niet per policy zetten. Een eigen pakket
  (bijvoorbeeld een fase of vlag in het manifest die `set-packages.js` naar een pakket met
  `assignmentFilter` vertaalt) lost dat op.
- **Windows 365.** Cloud PC's vallen niet onder het filter en houden de fysieke `Remote Desktop and RPC`
  met de wachtwoordprompt. Controleer of SSO daar werkt; zo niet, dan hoort SEC-Cloud-PC dezelfde
  behandeling te krijgen.
- **VolumeType en RoamIdentity** in de settings picker van de tenant opzoeken en, als de definitie
  klopt, aan `AVD FSLogix Profile Containers` toevoegen.
- **Device Guard and Credential Guard** kan *Gezamenlijk* worden zodra alle hostpools Trusted Launch hebben.
