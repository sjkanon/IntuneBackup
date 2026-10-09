[Nederlands](AVD.md) · [English](AVD.en.md) · **Français**

# Azure Virtual Desktop : stratégies communes et plan de déploiement

Quelles stratégies Windows de cette baseline ont aussi leur place sur les hôtes de session Azure
Virtual Desktop, lesquelles uniquement sur les appareils physiques, et dans quel ordre les mettre en
place dans un tenant. Il s'agit d'hôtes de session sous **Windows 11 Enterprise multisession**,
**joints à Entra et inscrits dans Intune**, avec des **conteneurs de profil FSLogix sur Azure Files**
et **Entra Kerberos** pour l'accès au partage.

La répartition suit `infra/INTUNE-BASELINE.md` (sections 2 à 4) du dépôt de test AVD, vérifiée par
rapport à [Intune pour AVD multisession](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session),
et les constats du tenant de test du 9 octobre 2026. La liste ci-dessous est construite à partir des
noms réels des stratégies dans `IntuneTemplate/WIN` (142 stratégies). Ce document est maintenu à
la main : quand une stratégie Windows est ajoutée, placez-la aussi ici dans l'un des quatre groupes, et donnez-lui le `doelgroep` correspondant dans
`_manifest.json` — `check-scope.js` refuse une stratégie Windows sans.

## En bref

Chaque stratégie Windows a un `doelgroep` (classe cible) dans [`_manifest.json`](../IntuneTemplate/_manifest.json) :
la classe d'appareils à laquelle elle est destinée. Trois classes, deux filtres, uniquement en **inclusion** :

| Groupe dans ce document | `doelgroep` | Stratégies | Affectation |
|---|---|---:|---|
| **Commune** — physique et AVD, inchangée | `alle` | 95 | telles quelles, sans filtre |
| **Physique uniquement** — pas sur les hôtes de session | `fysiek` | 40 | filtre d'**inclusion** `WIN - Physical` |
| **Variante AVD** — physique et AVD ont chacun leur version | `fysiek` (la version physique) | 1 | version physique inclusion `WIN - Physical`, version AVD inclusion `WIN - AVD Multi-session` |
| **AVD uniquement** — les nouvelles stratégies et l'ensemble Cloud PC | `avd` | 6 | filtre d'**inclusion** `WIN - AVD Multi-session` (ensemble Cloud PC : groupe propre) |

En phases 1 et 2, le pipeline en fait des paquets CIPP distincts : `[Baseline] - Baseline-Devices-Physical`,
`-Users-Physical`, `-Pilot-Physical` et `-Devices-AVD`, avec le filtre dans le standard. Le
déploiement dans un tenant client est décrit dans le guide [PLAYBOOK.fr.md](PLAYBOOK.fr.md).

Nouveau dans ce dépôt pour AVD :

- les filtres d'affectation [`WIN - Physical` et `WIN - AVD Multi-session`](../IntuneTemplate/WIN/AssignmentFilters/README.fr.md) ;
- [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.fr.md) — FSLogix et le ticket Kerberos pour Azure Files ;
- [`AVD Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.fr.md) — la version physique sans invite de mot de passe ;
- [`AVD Defender FSLogix Exclusions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.fr.md) — les exclusions Defender que Microsoft prescrit pour FSLogix ;
- [`AVD Session Host`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.fr.md) — limites de session de deux heures et Storage Sense désactivé.

Les quatre sont en **phase 1** avec la classe `avd`, dans le paquet `[Baseline] - Baseline-Devices-AVD`
(tous les appareils, filtre d'inclusion `WIN - AVD Multi-session`). Le compte de stockage des deux
stratégies FSLogix est la variable CIPP `%FSLogixStorageAccount%`, à définir par tenant.

## Ce qu'Intune fait et ne fait pas en multisession

- Le **Settings Catalog** fonctionne, au niveau appareil et utilisateur. Les **modèles** (Device
  Configurations) ne fonctionnent pas, sauf les certificats et un tunnel d'appareil VPN ; ils
  apparaissent en *Not applicable*.
- **Conformité :** uniquement version de l'OS, mot de passe, Defender, pare-feu, antivirus,
  antispyware, protection en temps réel et le risque Defender. BitLocker, TPM, Secure Boot et Code
  Integrity indiquent *Not applicable* et ne rendent pas l'hôte non conforme. Et : **la conformité
  ciblant les utilisateurs n'est pas prise en charge en multisession.** Les stratégies de conformité
  de cette baseline (`WIN - U - Compliance …`) vont à tous les utilisateurs ; pour les hôtes de session,
  elles doivent *aussi* être affectées au groupe d'appareils SEC-AVD-Session-Hosts. Sans cela,
  l'hôte n'est pas conforme et la CA 2060 bloque les applications de bureau dans la session dès
  qu'elle est appliquée.
- Les **anneaux de mise à jour** ne fonctionnent pas. Les mises à jour arrivent avec la reconstruction
  mensuelle de l'image.
- **Applications** uniquement en contexte système et en *Required*.
- **Pas** d'Autopilot, d'ESP, d'effacement, de verrouillage à distance ni de rotation de la clé BitLocker.

## Fonctionnement des filtres

[`WIN-AVD-Multi-Session.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-AVD-Multi-Session.json)
a la règle `(device.operatingSystemSKU -eq "ServerRdsh")` : la SKU de Windows Enterprise
multisession. [`WIN-Physical.json`](../IntuneTemplate/WIN/AssignmentFilters/WIN-Physical.json) est
`(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")`.
Dans le tenant de test, le premier correspond exactement à l'hôte de session AVD, le second aux
quatre PC physiques et QEMU, pas à l'hôte de session.

**Ce qui ne relève d'aucun des deux :** les Cloud PC Windows 365 et les hôtes AVD personnels
(mono-session, modèle `Virtual Machine`). Ils ne reçoivent que les stratégies communes — donc pas
de BitLocker, de Windows Hello ni de `Remote Desktop and RPC` physique avec l'invite de mot de
passe — plus l'ensemble Cloud PC par leur propre groupe. C'est voulu : les stratégies physiques
supposent du matériel (TPM, disque, Wi-Fi, batterie) et les stratégies AVD le multisession avec FSLogix.

Un filtre accompagne toujours une affectation — à tous les appareils, à tous les utilisateurs ou à
un groupe — et indique quels appareils y participent. Pourquoi des filtres et pas des groupes :

- **Affectations ciblant les utilisateurs.** `WIN - U - Windows Hello for Business`,
  `WIN - U - Personal Data Encryption` et les variantes Outlook vont aux utilisateurs. Exclure un
  *groupe d'appareils* n'y fait rien : l'affectation regarde l'utilisateur. Un filtre est, lui,
  évalué sur l'appareil auquel l'utilisateur se connecte — le même utilisateur reçoit Windows Hello
  sur son portable et pas dans la session AVD.
- **Pas d'attente.** Un filtre est évalué au check-in ; un nouvel hôte de session ou portable n'a
  pas à attendre qu'un groupe dynamique l'ait intégré.
- **Un filtre par paquet CIPP.** Un paquet CIPP a une affectation et un filtre pour tous ses
  membres. Chaque classe a donc son propre paquet, et le filtre est toujours en **inclusion** : les
  stratégies communes sont dans un paquet *sans* filtre, les physiques dans un paquet avec
  `WIN - Physical`, les stratégies AVD dans un paquet avec `WIN - AVD Multi-session`.

**Plus de filtres d'exclusion.** L'ancien modèle mettait un filtre d'exclusion
`WIN - AVD Multi-session` sur les stratégies réservées au physique. CIPP ne pouvait pas le faire
par stratégie : elles étaient dans `Baseline-Devices`, `-Users` et `-Pilot` avec les communes, et
une exclusion sur un tel paquet retirait aussi les communes des hôtes de session. Un paquet par
classe règle cela, et avec l'inclusion plutôt que l'exclusion, un Cloud PC ou un hôte personnel ne
peut plus recevoir par erreur une stratégie physique.

**Variante AVD :** le `Remote Desktop and RPC` physique a la classe `fysiek`, la version AVD `avd`.
Elles ne se retrouvent jamais sur un même hôte, l'invite de mot de passe de la version physique ne
peut donc pas s'appliquer malgré tout sur l'hôte de session.

### Contrôle des conflits par classe

`check-scope.js` compare, par paramètre, ce qui arrive sur un même appareil : **alle + fysiek** sur
un PC physique et **alle + avd** sur un hôte de session, sur les phases 1 et 2. Entre `fysiek` et
`avd`, un même paramètre peut avoir une valeur différente — c'est précisément le but (Storage Sense
activé sur un portable, désactivé sur un hôte de session). Aujourd'hui : aucun conflit ; trois
paramètres sont définis deux fois avec la même valeur (NTLM dans Disable NTLM et Local Security
Policies, deux paramètres Outlook dans Office Experience et Outlook Cached Mode Managed). Le
contrôle ne compare pas la phase 4 (groupe propre) ; ce chevauchement est listé ci-dessous à la main :

| Paramètre | Stratégie AVD | Autre stratégie | Traité par |
|---|---|---|---|
| `storage_allowstoragesenseglobal` | AVD Session Host (0) | Storage Sense (1) | Storage Sense est `fysiek` ; check-scope le surveille |
| `ts_sessions_idle_limit_2`, `ts_sessions_disconnected_timeout_2` | AVD Session Host (2 heures) | Cloud PC External Access (15 min, phase 4) | **point ouvert**, voir plus bas — uniquement sur un pool d'hôtes pour externes |
| `kerberos_cloudkerberosticketretrievalenabled` | AVD FSLogix Profile Containers (1) | Windows Hello Cloud Kerberos Trust (1) | classes différentes ; même valeur |
| huit paramètres de Remote Desktop and RPC | AVD Remote Desktop and RPC | Remote Desktop and RPC | classes différentes |
| `ts_time_zone` | — | Cloud PC Session Security | non repris dans AVD Session Host |

## Répartition par stratégie

### Commune — 95

Physique et AVD, inchangée et sans filtre.

| Stratégie | Phase | Remarque |
|---|---:|---|
| [D - Access Control](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.fr.md) | 2 |  |
| [D - Account Lockout](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.fr.md) | 2 |  |
| [D - Administrator Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.fr.md) | 2 |  |
| [D - AI Tooling](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.fr.md) | 1 |  |
| [D - Attack Surface Reduction](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.fr.md) | 1 | Sur AVD, examiner d'abord en mode audit (Defender ASR Policy Audit Mode). |
| [D - Audit and Event Logging](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_and_Event_Logging.fr.md) | 1 |  |
| [D - Audit Policy Enforcement](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.fr.md) | 1 |  |
| [D - Cloud Optimized Content](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_Optimized_Content.fr.md) | 1 |  |
| [D - Config Refresh](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Config_Refresh.fr.md) | 1 |  |
| [D - Cryptography](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.fr.md) | 2 |  |
| [D - Data Minimisation](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Data_Minimisation.fr.md) | 1 |  |
| [D - Defender Additional Configuration](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Additional_Configuration.fr.md) | 1 |  |
| [D - Defender Antivirus](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Antivirus.fr.md) | 1 |  |
| [D - Defender ASR Policy Audit Mode](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.fr.md) | 4 |  |
| [D - Defender AV Policy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_AV_Policy.fr.md) | 5 |  |
| [D - Defender EDR Policy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.fr.md) | 1 |  |
| [D - Defender for Endpoint EDR](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.fr.md) | 5 |  |
| [D - Defender Ransomware Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.fr.md) | 1 |  |
| [D - Defender Security Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Security_Experience.fr.md) | 1 |  |
| [D - Defender Update Ring 1 Pilot](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.fr.md) | 4 |  |
| [D - Defender Update Ring 2 UAT](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.fr.md) | 4 |  |
| [D - Defender Update Ring 3 Production](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.fr.md) | 1 |  |
| [D - Enhanced Phishing Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.fr.md) | 1 |  |
| [D - Internet Explorer Legacy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.fr.md) | 1 |  |
| [D - Legacy Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.fr.md) | 1 |  |
| [D - Local Administrators](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Administrators.fr.md) | 1 |  |
| [D - Local Security Policies](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.fr.md) | 1 |  |
| [D - Location and Privacy](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Location_and_Privacy.fr.md) | 1 |  |
| [D - Logging](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.fr.md) | 1 |  |
| [D - Login and Lock Screen](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.fr.md) | 1 |  |
| [D - Microsoft Accounts](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.fr.md) | 1 |  |
| [D - Microsoft Edge DNS over HTTPS Automatic](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.fr.md) | 2 |  |
| [D - Microsoft Edge DNS over HTTPS Secure](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.fr.md) | 5 |  |
| [D - Microsoft Edge Search Engine](../IntuneTemplate/WIN/AdministrativeTemplates/Baseline_WIN_D_Microsoft_Edge_Search_Engine.fr.md) | 5 |  |
| [D - Microsoft Edge Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.fr.md) | 1 |  |
| [D - Microsoft Edge Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Updates.fr.md) | 1 |  |
| [D - Microsoft Office Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.fr.md) | 1 |  |
| [D - Microsoft OneDrive](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.fr.md) | 1 | Known Folder Move et Files On-Demand fonctionnent avec FSLogix. |
| [D - Microsoft Store](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.fr.md) | 1 |  |
| [D - Network Authentication Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.fr.md) | 2 |  |
| [D - Printing](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.fr.md) | 1 | Active *Limits print driver installation to Administrators* : les pilotes d'imprimante doivent être dans l'image de référence. |
| [D - Printing Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.fr.md) | 2 |  |
| [D - Privacy and Telemetry](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Privacy_and_Telemetry.fr.md) | 1 |  |
| [D - Remote Access Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.fr.md) | 2 |  |
| [D - Script File Associations](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.fr.md) | 2 |  |
| [D - Security Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.fr.md) | 1 |  |
| [D - Security Log Monitoring](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.fr.md) | 2 |  |
| [D - Settings Sync](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.fr.md) | 1 |  |
| [D - Threat Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.fr.md) | 1 |  |
| [D - Update Reports and Telemetry](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.fr.md) | 1 |  |
| [D - User Rights](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.fr.md) | 1 | Refuse la connexion RDP aux comptes locaux (S-1-5-113) : un administrateur break-glass se connecte via la console Azure, pas via RDP. |
| [D - Windows AI Features Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.fr.md) | 5 | Restricted ou Permitted au choix, comme sur les appareils physiques. |
| [D - Windows AI Features Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.fr.md) | 2 | Restricted ou Permitted au choix, comme sur les appareils physiques. |
| [D - Windows AI Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.fr.md) | 5 | Restricted ou Permitted au choix, comme sur les appareils physiques. |
| [D - Windows AI Recall Boundaries](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.fr.md) | 3 |  |
| [D - Windows AI Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.fr.md) | 1 | Restricted ou Permitted au choix, comme sur les appareils physiques. |
| [D - Windows Component Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.fr.md) | 2 |  |
| [D - Windows Event Forwarding](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.fr.md) | 3 | Uniquement s'il existe un collecteur. |
| [D - Windows Feature Configuration](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Feature_Configuration.fr.md) | 1 |  |
| [D - Windows Firewall](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.fr.md) | 1 |  |
| [D - Windows Firewall Rules](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.fr.md) | 1 |  |
| [D - Windows LAPS](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.fr.md) | 1 |  |
| [D - Windows Package Manager](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Package_Manager.fr.md) | 1 |  |
| [D - Windows Sandbox](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Sandbox.fr.md) | 1 |  |
| [D - Windows Subsystem for Linux](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.fr.md) | 1 |  |
| [U - AI Usage Control Permitted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.fr.md) | 5 |  |
| [U - AI Usage Control Restricted](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.fr.md) | 2 |  |
| [U - Attachment Scanning](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Attachment_Scanning.fr.md) | 1 |  |
| [U - Compliance Antispyware](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.fr.md) | 1 | En multisession uniquement via une **affectation aux appareils** (SEC-AVD-Session-Hosts) : la conformité ciblée sur l'utilisateur n'y est pas prise en charge. |
| [U - Compliance Antivirus](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.fr.md) | 1 | En multisession uniquement via une **affectation aux appareils** (SEC-AVD-Session-Hosts) : la conformité ciblée sur l'utilisateur n'y est pas prise en charge. |
| [U - Compliance BitLocker](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.fr.md) | 1 | Indique *Not applicable* en multisession ; ne rend pas l'hôte non conforme. |
| [U - Compliance Code Integrity](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.fr.md) | 1 | Indique *Not applicable* en multisession ; ne rend pas l'hôte non conforme. |
| [U - Compliance Defender for Endpoint Risk](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md) | 3 | En multisession uniquement via une **affectation aux appareils** (SEC-AVD-Session-Hosts) : la conformité ciblée sur l'utilisateur n'y est pas prise en charge. |
| [U - Compliance Defender Real Time Protection](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.fr.md) | 1 | En multisession uniquement via une **affectation aux appareils** (SEC-AVD-Session-Hosts) : la conformité ciblée sur l'utilisateur n'y est pas prise en charge. |
| [U - Compliance Defender Security Intelligence](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.fr.md) | 1 | En multisession uniquement via une **affectation aux appareils** (SEC-AVD-Session-Hosts) : la conformité ciblée sur l'utilisateur n'y est pas prise en charge. |
| [U - Compliance Firewall](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.fr.md) | 1 | En multisession uniquement via une **affectation aux appareils** (SEC-AVD-Session-Hosts) : la conformité ciblée sur l'utilisateur n'y est pas prise en charge. |
| [U - Compliance OS Version](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.fr.md) | 2 | En multisession uniquement via une **affectation aux appareils** (SEC-AVD-Session-Hosts) : la conformité ciblée sur l'utilisateur n'y est pas prise en charge. |
| [U - Compliance Secure Boot](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.fr.md) | 1 | Indique *Not applicable* en multisession ; ne rend pas l'hôte non conforme. |
| [U - Compliance TPM](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.fr.md) | 1 | Indique *Not applicable* en multisession ; ne rend pas l'hôte non conforme. |
| [U - Copilot](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Copilot.fr.md) | 1 |  |
| [U - File Sharing Restrictions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.fr.md) | 2 |  |
| [U - Microsoft Edge Extensions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Extensions.fr.md) | 1 |  |
| [U - Microsoft Edge Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Management.fr.md) | 2 |  |
| [U - Microsoft Edge Password Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Password_Management.fr.md) | 1 |  |
| [U - Microsoft Edge Profiles and Sync](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.fr.md) | 1 |  |
| [U - Microsoft Edge User Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_User_Experience.fr.md) | 1 |  |
| [U - Microsoft Office Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Experience.fr.md) | 1 |  |
| [U - Microsoft Office Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.fr.md) | 1 |  |
| [U - Microsoft OneDrive](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_OneDrive.fr.md) | 1 | Known Folder Move et Files On-Demand fonctionnent avec FSLogix. |
| [U - Microsoft Outlook](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook.fr.md) | 1 |  |
| [U - Microsoft Outlook Cached Mode Managed](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.fr.md) | 2 | Le choix pour AVD : boîte personnelle en cache dans le profil FSLogix, boîtes partagées en ligne. |
| [U - Microsoft Store](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.fr.md) | 1 |  |
| [U - Microsoft Teams](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.fr.md) | 2 |  |
| [U - Windows Spotlight](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Spotlight.fr.md) | 1 |  |
| [U - Windows User Experience](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.fr.md) | 1 |  |

### Physique uniquement — 40

Classe `fysiek` : en phases 1 et 2 le filtre d'inclusion `WIN - Physical`, donc pas sur un hôte de session, un Cloud PC Windows 365 ni un hôte AVD personnel.

| Stratégie | Phase | Pourquoi pas sur AVD |
|---|---:|---|
| [D - Automatic Restart Sign-On](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Automatic_Restart_Sign_On.fr.md) | 1 | Non applicable au multisession ni aux hôtes en pool. |
| [D - BitLocker](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.fr.md) | 1 | Azure chiffre déjà le disque (SSE, encryption at host). Compliance BitLocker indique *Not applicable* en multisession. |
| [D - Bluetooth Allowed Services](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Bluetooth_Allowed_Services.fr.md) | 2 | Matériel qu'une VM n'a pas ; la redirection est déjà désactivée par Cloud PC Session Security. |
| [D - Business Continuity](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.fr.md) | 1 | Non applicable au multisession ni aux hôtes en pool. |
| [D - Delivery Optimisation](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Delivery_Optimisation.fr.md) | 1 | Non applicable au multisession ni aux hôtes en pool. |
| [D - Device Guard and Credential Guard](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md) | 2 | Ne fonctionne que sur une VM Trusted Launch. Activez Trusted Launch pour conserver cette stratégie sur AVD ; elle devient alors *Commune*. |
| [D - Device Lock](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.fr.md) | 1 | Matériel qu'une VM n'a pas ; la redirection est déjà désactivée par Cloud PC Session Security. |
| [D - Disable NTLM](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.fr.md) | 2 | Les partages et applications sur Entra DS reviennent à NTLM depuis un hôte joint à Entra. |
| [D - Endpoint Analytics](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Endpoint_Analytics.fr.md) | 1 | Modèle de configuration d'appareil : non pris en charge en multisession. |
| [D - Enrollment Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.fr.md) | 2 | Non applicable au multisession ni aux hôtes en pool. |
| [D - Google Chrome Extensions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Extensions.fr.md) | 2 | Chrome n'est pas dans l'image. |
| [D - Google Chrome Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Security.fr.md) | 2 | Chrome n'est pas dans l'image. |
| [D - Google Chrome Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Google_Chrome_Updates.fr.md) | 1 | Chrome n'est pas dans l'image. |
| [D - In-Box App Removal](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.fr.md) | 2 | Déjà fait dans l'image (VDOT). Redondant, sans danger. |
| [D - Kernel DMA Protection](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.fr.md) | 2 | Une VM n'a pas de ports DMA. |
| [D - Logon Hardening](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.fr.md) | 2 | CTRL+ALT+SUPPR n'a pas de sens dans une session RDP. Tester d'abord ou abandonner. |
| [D - Microsoft Office Updates](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.fr.md) | 1 | Mettre Office à jour automatiquement sur un hôte en pool rend les hôtes différents entre eux ; les mises à jour arrivent avec l'image. |
| [D - Passwordless](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.fr.md) | 1 | Masque le champ du mot de passe ; sans SSO, plus personne ne peut se connecter à l'hôte. |
| [D - Power Management](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.fr.md) | 1 | Matériel qu'une VM n'a pas ; la redirection est déjà désactivée par Cloud PC Session Security. |
| [D - Removable Storage](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.fr.md) | 2 | Matériel qu'une VM n'a pas ; la redirection est déjà désactivée par Cloud PC Session Security. |
| [D - Storage Sense](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.fr.md) | 1 | Nettoie dans les profils FSLogix montés ; AVD Session Host désactive Storage Sense (autre valeur : d'où `fysiek`). |
| [D - Timezone](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Timezone.fr.md) | 1 | Le fuseau horaire automatique entre en conflit avec la redirection du fuseau horaire (`ts_time_zone`) de Cloud PC Session Security. |
| [D - Wifi Corporate](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.fr.md) | 3 | Modèle de configuration d'appareil : non pris en charge en multisession, et une VM n'a pas de Wi-Fi. |
| [D - Wifi Guest](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.fr.md) | 3 | Modèle de configuration d'appareil : non pris en charge en multisession, et une VM n'a pas de Wi-Fi. |
| [D - Windows Hello Cloud Kerberos Trust](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.fr.md) | 1 | Lié à Windows Hello. AVD FSLogix Profile Containers active lui-même le ticket Kerberos pour Azure Files. |
| [D - Windows Hello for Business](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md) | 2 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |
| [D - Windows Hello for Business Multi User](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md) | 4 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |
| [D - Windows Hello Passkey PIN Complexity Alphanumeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.fr.md) | 2 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |
| [D - Windows Hello Passkey PIN Complexity Numeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.fr.md) | 5 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |
| [D - Windows Hello PIN Complexity Alphanumeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.fr.md) | 5 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |
| [D - Windows Hello PIN Complexity Numeric](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.fr.md) | 5 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |
| [D - Windows Update Ring 1 Pilot](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.fr.md) | 4 | Les anneaux de mise à jour ne fonctionnent pas en multisession ; les mises à jour arrivent avec la reconstruction mensuelle de l'image. |
| [D - Windows Update Ring 2 UAT](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.fr.md) | 4 | Les anneaux de mise à jour ne fonctionnent pas en multisession ; les mises à jour arrivent avec la reconstruction mensuelle de l'image. |
| [D - Windows Update Ring 3 Production](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.fr.md) | 1 | Les anneaux de mise à jour ne fonctionnent pas en multisession ; les mises à jour arrivent avec la reconstruction mensuelle de l'image. |
| [D - Wireless and Peripherals](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.fr.md) | 1 | Matériel qu'une VM n'a pas ; la redirection est déjà désactivée par Cloud PC Session Security. |
| [D - Wireless Shared Devices](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.fr.md) | 4 | Matériel qu'une VM n'a pas ; la redirection est déjà désactivée par Cloud PC Session Security. |
| [U - Microsoft Outlook Cached Mode Default](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.fr.md) | 5 | Alternative de phase 5. Sur AVD toujours *Cached Mode Managed* ; *Off* rend Outlook lent. |
| [U - Microsoft Outlook Cached Mode Off](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.fr.md) | 5 | Alternative de phase 5. Sur AVD toujours *Cached Mode Managed* ; *Off* rend Outlook lent. |
| [U - Personal Data Encryption](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.fr.md) | 1 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |
| [U - Windows Hello for Business](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) | 2 | Pas de connexion Windows Hello sur un hôte de session ; PDE dépend de Hello. |

### Variante AVD — 1

| Stratégie | Phase | Remarque |
|---|---:|---|
| [D - Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.fr.md) | 1 | `promptforpassworduponconnection` casse le SSO Entra et les passkeys. Physique : classe `fysiek` (inclusion `WIN - Physical`) ; AVD : [AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.fr.md) avec la classe `avd`. |

### AVD uniquement — 6

| Stratégie | Phase | Remarque |
|---|---:|---|
| [D - AVD Defender FSLogix Exclusions](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.fr.md) | 1 | Nouveau. Classe `avd` : paquet `Baseline-Devices-AVD`, filtre d'inclusion `WIN - AVD Multi-session`. |
| [D - AVD FSLogix Profile Containers](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.fr.md) | 1 | Nouveau. Classe `avd` : paquet `Baseline-Devices-AVD`, filtre d'inclusion `WIN - AVD Multi-session`. |
| [D - AVD Remote Desktop and RPC](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Remote_Desktop_and_RPC.fr.md) | 1 | Nouveau. Classe `avd` : paquet `Baseline-Devices-AVD`, filtre d'inclusion `WIN - AVD Multi-session`. |
| [D - AVD Session Host](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_Session_Host.fr.md) | 1 | Nouveau. Classe `avd` : paquet `Baseline-Devices-AVD`, filtre d'inclusion `WIN - AVD Multi-session`. |
| [D - Cloud PC External Access](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_External_Access.fr.md) | 4 | Existant, uniquement sur un pool d'hôtes pour externes (SEC-Cloud-PC-External). Y entre en conflit avec les limites de session d'AVD Session Host — voir les points ouverts. |
| [D - Cloud PC Session Security](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_PC_Session_Security.fr.md) | 4 | Existant, via le groupe SEC-Cloud-PC (aussi Windows 365). Active aussi la redirection du fuseau horaire. |

## Constats du tenant de test (9 octobre 2026)

Le test a été mené avec l'ancien ensemble `[Baseline] X` dans le tenant de test, d'avant la scission
sous les noms actuels.

- **`Limits print driver installation to Administrators`** (dans les anciens Administrative Templates)
  empêche les utilisateurs d'installer eux-mêmes un pilote d'imprimante. Dans l'ensemble actuel,
  c'est `restrictdriverinstallationtoadministrators` dans [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.fr.md),
  qui reste *Commune* : c'est une mesure de sécurité contre les attaques de type PrintNightmare.
  Conséquence pour AVD : **les pilotes d'imprimante doivent être dans l'image de référence.**
- **`promptforpassworduponconnection`** figurait dans l'ancien `[Baseline] Administrative Templates`.
  Dans l'ensemble actuel, il est dans `Remote Desktop and RPC`, et lors de la scission il passe à la
  variante AVD — qui ne le définit justement *pas*. Avec l'invite, l'hôte de session demande un mot
  de passe à chaque connexion et le SSO Entra avec une passkey ne fonctionne pas.
- **Exclues dans l'ancien ensemble** sur l'hôte de session : Bitlocker, Device Lock, Windows Hello For
  Business, Windows 11 Update (l'anneau de mise à jour) et Office Updates. Les cinq figurent ici sous
  *Physique uniquement*.

## FSLogix : Intune et le script d'hôte

FSLogix est configuré à deux endroits, volontairement :

- **Le script d'hôte** `configure-fslogix.ps1` du dépôt AVD s'exécute comme Run Command lors du
  déploiement d'un hôte. Un nouvel hôte ne reçoit la stratégie Intune qu'après l'inscription et la
  première synchronisation ; sans le script, la première connexion sur un nouvel hôte se ferait sans
  conteneur — ou, avec `PreventLoginWithFailure`, pas du tout. Le script définit immédiatement les
  mêmes valeurs, la première connexion fonctionne donc déjà.
- **La stratégie Intune** [`AVD FSLogix Profile Containers`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AVD_FSLogix_Profile_Containers.fr.md)
  garde ensuite les valeurs centralisées et les rétablit si quelqu'un les modifie sur un hôte (dérive).

Les deux écrivent les mêmes valeurs de registre sous `HKLM\SOFTWARE\FSLogix\Profiles` (Enabled,
VHDLocations, SizeInMBs, IsDynamic, FlipFlopProfileDirectoryName, DeleteLocalProfileWhenVHDShouldApply,
PreventLoginWithFailure, PreventLoginWithTempProfile), rien n'entre donc en conflit. Uniquement dans
le script, parce que le Settings Catalog ne les connaît pas :

- `LoadCredKeyFromProfile = 1` sous `HKLM\SOFTWARE\Policies\Microsoft\AzureADAccount` — nécessaire pour
  Entra Kerberos avec FSLogix ;
- l'administrateur local dans le groupe local `FSLogix Profile Exclude List`, afin qu'une connexion
  break-glass fonctionne toujours, même quand le partage est inaccessible.

Deux paramètres ne sont définis que par le script, car leur définition dans le Settings Catalog n'a
pas été vérifiée avec certitude : `VolumeType = VHDX` (la valeur par défaut depuis FSLogix 2210) et
`RoamIdentity` (la valeur requise 0 est la valeur par défaut ; Intune ne prend pas en charge
l'itinérance des jetons). Les deux définissent le ticket Kerberos (`CloudKerberosTicketRetrievalEnabled`) ;
l'application du compte de stockage doit être exclue de la MFA dans l'accès conditionnel.

## Plan de déploiement

Le guide complet, y compris la classe physique et la migration depuis un ancien ensemble, figure
dans [PLAYBOOK.fr.md](PLAYBOOK.fr.md). Pour AVD en bref :

1. **Créer les filtres.** `WIN - Physical` et `WIN - AVD Multi-session` depuis
   [`IntuneTemplate/WIN/AssignmentFilters/`](../IntuneTemplate/WIN/AssignmentFilters/README.fr.md),
   par un `POST` sur `deviceManagement/assignmentFilters`, dans le portail ou avec
   `Set-BaselineAssignment.ps1 -CreateFilters`. Vérifiez avec *Preview devices*. Avant la première
   exécution CIPP : si le filtre n'existe pas, CIPP affecte sans filtre.
2. **Variable CIPP `FSLogixStorageAccount`** par tenant (Settings → Custom Variables) : le nom du
   compte de stockage, sans `.file.core.windows.net`. Sans cette variable, `%FSLogixStorageAccount%`
   reste tel quel dans le chemin et, avec `PreventLoginWithFailure`, plus personne ne peut se
   connecter à l'hôte.
3. **Groupe SEC-AVD-Session-Hosts** comme groupe d'appareils dynamique, par exemple
   `(device.displayName -startsWith "<hostpoolprefix>-sh")`. Pas pour les paquets de la baseline
   (ils utilisent le filtre), mais pour l'affectation de conformité aux appareils (étape 5), le
   paramètre RDP SSO *target device groups* du pool d'hôtes et les rapports.
4. **Baseline dans CIPP.** L'étape 1 déploie `[Baseline] - Baseline-Devices-AVD` (tous les
   appareils, inclusion `WIN - AVD Multi-session`) à côté des paquets communs. Les stratégies
   réservées au physique passent par les paquets `-Physical` et n'atteignent donc pas l'hôte.
5. **Conformité sur l'appareil.** Affectez les stratégies de conformité prises en charge en
   multisession — Antispyware, Antivirus, Defender for Endpoint Risk, Defender Real Time Protection,
   Defender Security Intelligence, Firewall et OS Version — *aussi* à SEC-AVD-Session-Hosts.
   Attention au point ouvert ci-dessous : le `verifyAssignments` de CIPP voit cette affectation
   supplémentaire comme un écart.
6. **Pool d'hôtes pilote.** Un pool d'hôtes avec jonction Entra, inscription Intune et Trusted
   Launch. Par hôte dans Intune : chaque stratégie *Succeeded* ou *Not applicable*, aucun *Conflict*.
   Connexion avec une passkey sans invite de mot de passe, le conteneur FSLogix se monte
   (`frx list-redirects`, le ticket Kerberos avec `klist`), impression avec un pilote de l'image.
   Forcer une synchronisation sur l'hôte : `deviceenroller.exe /o <enrollment-ID> /c /b` — la tâche
   PushLaunch n'existe pas en multisession.
7. **Vérifier la conformité.** Les hôtes sont conformes dans Intune et dans Entra ID, et les
   journaux de connexion de la CA 2060 (report-only) montrent *aurait réussi* pour les sessions
   depuis les hôtes.
8. **CA 2060 en mode appliqué.** Seulement quand l'étape 7 est correcte ; sinon Outlook, Teams et
   les autres applications de bureau ne fonctionnent plus dans la session.

Ensuite les autres pools d'hôtes ; les hôtes Entra DS passent en mode drain et sont supprimés
(Entra DS ne reste que pour les serveurs d'applications).

## Points ouverts

- **Pool d'hôtes pour externes.** Sur un hôte de SEC-Cloud-PC-External arrivent à la fois
  `AVD Session Host` (phase 1, `avd`) et `Cloud PC External Access` (phase 4), avec des limites de
  session différentes : un Conflict, après quoi aucune des deux limites ne s'applique. Dans le
  modèle par paquets, `AVD Session Host` ne peut pas être exclue seule — un groupe d'exclusion sur
  `Baseline-Devices-AVD` retirerait aussi FSLogix de ces hôtes. Ne concerne qu'un tenant doté d'un
  tel pool ; une solution consiste à placer les limites de session dans une stratégie à part.
- **Conformité sur l'appareil et `verifyAssignments`.** CIPP gère l'affectation de `Baseline-Users`
  (tous les utilisateurs) et voit une affectation supplémentaire aux appareils de
  SEC-AVD-Session-Hosts comme un écart que la remédiation retire (`Compare-CIPPIntuneAssignments` :
  les groupes d'inclusion supplémentaires comptent dès que le standard gère l'affectation). Tant que
  le pipeline ne place pas les stratégies de conformité dans un paquet à part : vérifiez après
  chaque exécution CIPP que l'affectation aux appareils est toujours là.
- **Windows 365.** Les Cloud PC ne relèvent d'aucun des deux filtres et ne reçoivent donc plus non
  plus le `Remote Desktop and RPC` physique. Vérifiez qu'ils reçoivent l'ensemble commun et
  l'ensemble Cloud PC dont ils ont besoin.
- Rechercher **VolumeType et RoamIdentity** dans le sélecteur de paramètres du tenant et, si la
  définition est correcte, les ajouter à `AVD FSLogix Profile Containers`.
- **Device Guard and Credential Guard** peut devenir *Commune* dès que tous les pools d'hôtes ont Trusted Launch.
