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
een Windows-policy bij, zet hem dan ook hier in een van de vier groepen én geef hem de bijbehorende
`doelgroep` in `_manifest.json` — `check-scope.js` weigert een Windows-policy zonder.

## In het kort

Elke Windows-policy heeft in [`_manifest.json`](../IntuneTemplate/_manifest.json) een `doelgroep`:
de apparaatklasse waarop hij hoort. Drie klassen, twee filters, alleen **include**:

| Groep in dit document | `doelgroep` | Policies | Toewijzing |
|---|---|---:|---|
| **Gezamenlijk** — fysiek en AVD, ongewijzigd | `alle` | 95 | zoals ze staan, zonder filter |
| **Alleen fysiek** — niet op de sessiehosts | `fysiek` | 40 | **include**-filter `WIN - Physical` |
| **AVD-variant** — fysiek en AVD elk een eigen versie | `fysiek` (de fysieke versie) | 1 | fysieke versie include `WIN - Physical`, AVD-versie include `WIN - AVD Multi-session` |
| **Alleen AVD** — de nieuwe policies en de Cloud PC-set | `avd` | 6 | **include**-filter `WIN - AVD Multi-session` (Cloud PC-set: eigen groep) |

In fase 1 en 2 maakt de pijplijn er eigen CIPP-pakketten van: `[Baseline] - Baseline-Devices-Physical`,
`-Users-Physical`, `-Pilot-Physical` en `-Devices-AVD`, met het filter in de standard. Hoe je dat in
een klanttenant uitrolt staat in het draaiboek [PLAYBOOK.md](PLAYBOOK.md).

Nieuw in deze repo voor AVD:

- de toewijzingsfilters [`WIN - Physical` en `WIN - AVD Multi-session`](../IntuneTemplate/WIN/AssignmentFilters/README.md);
- [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.md) — FSLogix en het Kerberos-ticket voor Azure Files;
- [`AVD Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.md) — de fysieke versie zonder wachtwoordprompt;
- [`AVD Defender FSLogix Exclusions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.md) — de Defender-uitsluitingen die Microsoft voor FSLogix voorschrijft;
- [`AVD Session Host`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.md) — sessielimieten van twee uur en Storage Sense met eigen waarden in de container.

Alle vier staan in **fase 1** met doelgroep `avd`, in het pakket `[Baseline] - Baseline-Devices-AVD`
(alle apparaten, include-filter `WIN - AVD Multi-session`). Het opslagaccount in de twee
FSLogix-policies is de CIPP-variabele `%FSLogixStorageAccount%`, die je per tenant zet.

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
- **Valkuil: VDOT schakelt pushmeldingen uit.** `-Optimizations All` van de Virtual Desktop
  Optimization Tool zet `NoCloudApplicationNotification = 1` (*Turn off notifications network
  usage*). Dan bereikt een Intune-push de host niet — event 404 *Cloud notifications have been turned
  off* op `./Vendor/MSFT/DMClient/Provider/MS DM Server/Push/PFN` — en komen nieuwe policies pas bij
  de geplande sync. De AVD-image draait die waarde na VDOT terug en zet `dmwappushservice` op
  automatisch.

## Hoe de filters werken

[`WIN-AVD-Multi-Session.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-AVD-Multi-Session.json)
heeft de regel `(device.operatingSystemSKU -eq "ServerRdsh")`: de SKU van Windows Enterprise
multi-session. [`WIN-Physical.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-Physical.json) is
`(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")`.
In de testtenant matcht het eerste precies de AVD-sessiehost, het tweede de vier fysieke en
QEMU-pc's en niet de sessiehost.

**Wat onder geen van beide valt:** Windows 365 Cloud PC's en persoonlijke AVD-hosts (single-session,
model `Virtual Machine`). Die krijgen alleen de gezamenlijke policies — dus ook geen BitLocker,
Windows Hello of de fysieke `Remote Desktop and RPC` met de wachtwoordprompt — plus de Cloud PC-set
via hun eigen groep. Dat is bewust: de fysieke policies gaan uit van hardware (TPM, schijf, wifi,
batterij) en de AVD-policies van multi-session met FSLogix.

Een filter staat altijd naast een toewijzing — aan alle apparaten, alle gebruikers of een groep —
en zegt welke apparaten daarvan meedoen. Waarom filters en geen groepen:

- **Gebruikersgerichte toewijzingen.** `WIN - U - Windows Hello for Business`,
  `WIN - U - Personal Data Encryption` en de Outlook-varianten gaan naar gebruikers. Een uitsluiting
  van een *apparaatgroep* doet daar niets: de toewijzing kijkt naar de gebruiker. Een filter wordt
  wél op het apparaat getoetst waar de gebruiker zich aanmeldt — dezelfde gebruiker krijgt Windows
  Hello op zijn laptop en niet in de AVD-sessie.
- **Geen wachttijd.** Een filter wordt bij de check-in getoetst; een nieuwe sessiehost of laptop
  hoeft niet te wachten tot een dynamische groep hem heeft opgenomen.
- **Eén filter per CIPP-pakket.** Een CIPP-pakket heeft één toewijzing en één filter voor al zijn
  leden. Daarom krijgt elke klasse een eigen pakket, en is het filter altijd **include**: de
  gezamenlijke policies zitten in een pakket zónder filter, de fysieke in een pakket met
  `WIN - Physical`, de AVD-policies in een pakket met `WIN - AVD Multi-session`.

**Geen exclude-filters meer.** Het vorige model zette op de alleen-fysieke policies een
exclude-filter `WIN - AVD Multi-session`. Dat kon CIPP niet per policy: die policies zaten in
`Baseline-Devices`, `-Users` en `-Pilot` samen met de gezamenlijke, en een exclude op zo'n pakket
haalde ook de gezamenlijke van de sessiehosts. Met een eigen pakket per klasse is dat opgelost, en
met include in plaats van exclude kan een Cloud PC of een persoonlijke host niet meer per ongeluk
een fysieke policy krijgen.

**AVD-variant:** de fysieke `Remote Desktop and RPC` heeft doelgroep `fysiek`, de AVD-versie
`avd`. Ze komen nooit samen op één host, dus de wachtwoordprompt van de fysieke versie kan op de
sessiehost niet alsnog gelden.

### Conflictcontrole per klasse

`check-scope.js` vergelijkt per instelling wat op hetzelfde apparaat landt: **alle + fysiek** op een
fysieke pc en **alle + avd** op een sessiehost, over fase 1 en 2. Tussen `fysiek` en `avd` mag
dezelfde instelling een andere waarde hebben — dat is juist het doel (Storage Sense bij weinig
ruimte op een laptop, dagelijks met kortere termijnen op een sessiehost). Vandaag: geen conflicten; drie instellingen worden dubbel gezet met
dezelfde waarde (NTLM in Disable NTLM en Local Security Policies, twee Outlook-instellingen in
Office Experience en Outlook Cached Mode Managed). Fase 4 (eigen groep) vergelijkt de check niet;
die overlap staat hieronder met de hand:

| Instelling | AVD-policy | Andere policy | Afgehandeld door |
|---|---|---|---|
| `ts_sessions_idle_limit_2`, `ts_sessions_disconnected_timeout_2` | AVD Session Host (2 uur) | Cloud PC External Access (15 min, fase 4) | **open punt**, zie onderaan — alleen op een hostpool voor externen |
| `kerberos_cloudkerberosticketretrievalenabled` | AVD FSLogix Profile Containers (1) | Windows Hello Cloud Kerberos Trust (1) | verschillende klassen; zelfde waarde |
| acht instellingen van Remote Desktop and RPC | AVD Remote Desktop and RPC | Remote Desktop and RPC | verschillende klassen |
| `ts_time_zone` | — | Cloud PC Session Security | niet opgenomen in AVD Session Host |

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

Doelgroep `fysiek`: in fase 1 en 2 het include-filter `WIN - Physical`, dus niet op een sessiehost, een Windows 365 Cloud PC of een persoonlijke AVD-host.

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
| [D - Storage Sense](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.md) | 1 | Bij weinig ruimte, 30 dagen — werkt niet op een sessiehost, waar C: nooit volloopt. AVD Session Host zet Storage Sense daar met eigen waarden aan (dagelijks, 7/14/30 dagen). |
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
| [D - Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.md) | 1 | `promptforpassworduponconnection` breekt Entra-SSO en passkeys. Fysiek: doelgroep `fysiek` (include `WIN - Physical`); AVD: [AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.md) met doelgroep `avd`. |

### Alleen AVD — 6

| Policy | Fase | Opmerking |
|---|---:|---|
| [D - AVD Defender FSLogix Exclusions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.md) | 1 | Nieuw. Doelgroep `avd`: pakket `Baseline-Devices-AVD`, include-filter `WIN - AVD Multi-session`. |
| [D - AVD FSLogix Profile Containers](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.md) | 1 | Nieuw. Doelgroep `avd`: pakket `Baseline-Devices-AVD`, include-filter `WIN - AVD Multi-session`. |
| [D - AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.md) | 1 | Nieuw. Doelgroep `avd`: pakket `Baseline-Devices-AVD`, include-filter `WIN - AVD Multi-session`. |
| [D - AVD Session Host](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.md) | 1 | Nieuw. Doelgroep `avd`: pakket `Baseline-Devices-AVD`, include-filter `WIN - AVD Multi-session`. |
| [D - Cloud PC External Access](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_External_Access.md) | 4 | Bestaand, alleen op een hostpool voor externen (SEC-Cloud-PC-External). Botst daar met de sessielimieten van AVD Session Host — zie de open punten. |
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

## Profielen klein houden: Storage Sense en compactie

Twee instellingen werken samen om de FSLogix-containers zo klein mogelijk te houden:

- **Storage Sense ruimt binnen de gekoppelde container op.** [`AVD Session Host`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.md)
  zet het aan met eigen waarden: OneDrive-bestanden na 7 dagen alleen online (geen dataverlies, de
  grootste winst), tijdelijke bestanden, de prullenbak na 14 dagen en Downloads na 30 dagen (echte
  verwijdering, daarom niet korter). **De cadence (dagelijks) zet de AVD-image, niet Intune:**
  `configstoragesenseglobalcadence` heeft in zijn Settings Catalog-definitie geen
  `windowsMultiSession` in `applicability.windowsSkus`, dus Intune levert hem niet aan een
  multi-session-host (de andere vijf instellingen wel; op de host geverifieerd). De image zet
  `HKLM\SOFTWARE\Policies\Microsoft\Windows\StorageSense\ConfigStorageSenseGlobalCadence = 1`
  (`run-vdot.ps1` in de AVD-repo). Zonder cadence draait Storage Sense alleen bij weinig vrije ruimte
  op C:, en die loopt op een sessiehost nooit vol — Storage Sense kijkt naar die schijf, niet naar de
  container. De fysieke `Storage Sense`-policy (cadence 0, 30 dagen) blijft
  `fysiek`; de twee komen nooit op één apparaat.
- **FSLogix comprimeert de container bij afmelden** (`VHD Compact Disk`, in
  [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.md)
  expliciet aan, al is het sinds FSLogix 2210 de standaard). Wat Storage Sense heeft vrijgemaakt,
  gaat zo terug naar het share. Bij Azure Files Premium rekent Microsoft op de provisioned grootte,
  dus de winst zit niet in de rekening maar in snellere aanmeldingen en minder kans op een volle
  container.

**Geen wekelijkse `Invoke-FslShrinkDisk` of FSLShrink meer.** De ingebouwde compactie doet hetzelfde
bij elke afmelding, zonder aparte VM met rechten op het share en zonder het risico dat een script een
gekoppelde container raakt. De sessielimieten (afmelden na twee uur verbroken) zorgen dat er ook echt
wordt afgemeld. FSLShrink blijft alleen een noodmiddel voor containers die al groot zijn: eenmalig,
buiten kantooruren, met de hosts in drain mode.

## Uitrolplan

Het volledige draaiboek, ook voor de fysieke klasse en de migratie van een oude set, staat in
[PLAYBOOK.md](PLAYBOOK.md). Voor AVD in het kort:

1. **Filters aanmaken.** `WIN - Physical` en `WIN - AVD Multi-session` uit
   [`IntuneTemplate/WIN/AssignmentFilters/`](../IntuneTemplate/WIN/AssignmentFilters/README.md), met
   een `POST` naar `deviceManagement/assignmentFilters`, in de portal of met
   `Set-BaselineAssignment.ps1 -CreateFilters`. Controleer met *Preview devices*. Vóór de eerste
   CIPP-run: bestaat het filter niet, dan wijst CIPP toe zónder filter.
2. **CIPP-variabele `FSLogixStorageAccount`** per tenant (Settings → Custom Variables): de naam van
   het opslagaccount, zonder `.file.core.windows.net`. Zonder die variabele staat
   `%FSLogixStorageAccount%` letterlijk in het pad en kan met `PreventLoginWithFailure` niemand meer
   op de host aanmelden.
3. **Groep SEC-AVD-Session-Hosts** als dynamische apparaatgroep, bijvoorbeeld
   `(device.displayName -startsWith "<hostpoolprefix>-sh")`. Niet voor de baseline-pakketten (die
   gebruiken het filter), wel voor de compliance-apparaattoewijzing (stap 5), de RDP-SSO-instelling
   *target device groups* op de hostpool en rapportage.
4. **Baseline in CIPP.** Stage 1 rolt `[Baseline] - Baseline-Devices-AVD` uit (alle apparaten,
   include `WIN - AVD Multi-session`) naast de gezamenlijke pakketten. De alleen-fysieke policies
   gaan via de `-Physical`-pakketten en komen dus niet op de host.
5. **Compliance op het apparaat.** Wijs de compliancepolicies die multi-session ondersteunt —
   Antispyware, Antivirus, Defender for Endpoint Risk, Defender Real Time Protection, Defender Security
   Intelligence, Firewall en OS Version — óók toe aan SEC-AVD-Session-Hosts. Let op het open punt
   hieronder: CIPP's `verifyAssignments` ziet die extra toewijzing als afwijking.
6. **Pilot-hostpool.** Eén hostpool met Entra join, Intune-inschrijving en Trusted Launch. Per host
   in Intune: elke policy *Succeeded* of *Not applicable*, geen *Conflict*. Aanmelden met een passkey
   zonder wachtwoordprompt, de FSLogix-container koppelt (`frx list-redirects`, het
   Kerberos-ticket met `klist`), printen met een driver uit de image. Sync forceren op de host:
   `deviceenroller.exe /o <enrollment-ID> /c /b` — de PushLaunch-taak bestaat op multi-session niet.
7. **Compliance controleren.** De hosts staan in Intune en in Entra ID als compliant, en de
   aanmeldlogboeken van CA 2060 (report-only) tonen voor sessies vanaf de hosts *zou slagen*.
8. **CA 2060 naar enforce.** Pas als stap 7 klopt; anders werken Outlook, Teams en de andere
   desktop-apps in de sessie niet meer.

Daarna de overige hostpools; de Entra DS-hosts gaan in drain mode en worden weggehaald (Entra DS
blijft alleen voor de applicatieservers).

## Open punten

- **Hostpool voor externen.** Op een host in SEC-Cloud-PC-External landen `AVD Session Host`
  (fase 1, `avd`) en `Cloud PC External Access` (fase 4) allebei, met andere sessielimieten: een
  Conflict, waarna geen van beide limieten geldt. In het pakketmodel is `AVD Session Host` niet los
  uit te sluiten — een exclude-groep op `Baseline-Devices-AVD` zou ook FSLogix van die hosts halen.
  Alleen relevant in een tenant met zo'n hostpool; een oplossing is de sessielimieten in een eigen
  policy onderbrengen.
- **Compliance op het apparaat en `verifyAssignments`.** CIPP beheert de toewijzing van
  `Baseline-Users` (alle gebruikers) en ziet een extra apparaattoewijzing aan SEC-AVD-Session-Hosts
  als afwijking die remediëring weer weghaalt (`Compare-CIPPIntuneAssignments`: extra
  include-groepen tellen mee zodra de standard de toewijzing beheert). Tot de pijplijn de
  compliancepolicies in een eigen pakket zet: controleer na elke CIPP-run dat de apparaattoewijzing
  er nog staat.
- **Windows 365.** Cloud PC's vallen onder geen van beide filters en krijgen dus ook de fysieke
  `Remote Desktop and RPC` niet meer. Controleer of ze de gezamenlijke set én de Cloud PC-set
  krijgen die ze nodig hebben.
- **VolumeType en RoamIdentity** in de settings picker van de tenant opzoeken en, als de definitie
  klopt, aan `AVD FSLogix Profile Containers` toevoegen.
- **Device Guard and Credential Guard** kan *Gezamenlijk* worden zodra alle hostpools Trusted Launch hebben.
