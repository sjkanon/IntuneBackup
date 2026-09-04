<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# macOS — 26 policies

Alle policies heten `[Baseline] - MAC - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 21 |
| `DeviceConfigurations/` | 1 |
| `CompliancePolicies/` | 4 |

## Device-scoped (D) — 18

Toewijzen aan apparaatgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**Accounts and Login**](SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.md) | Bepaalt wat er bij het aanmelden zichtbaar is en welke accounts een Mac mag hebben. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-035-MACDAccountsAndLogin` |
| [**Defender Antivirus**](SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.md) | Realtimebeveiliging, cloudbescherming en scangedrag van Defender op macOS. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-036-MACDDefenderAntivirus` |
| [**Defender for Endpoint**](SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md) | Geeft Defender de systeemrechten die macOS eist voordat het kan werken: systeemextensie, netwerkfilter en volledige schijftoegang. Zonder deze policy blijft Defender op een Mac half geïnstalleerd. | Settings Catalog | 50 | All Devices | `INTUNE-BASE-037-MACDDefenderForEndpoint` |
| [**Enrollment Profile Administrator User Affinity**](SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md) | Doorloopt Setup Assistant voor een bedrijfs-Mac met user affinity en vergrendelde inschrijving, en maakt het aangemelde account aan als lokale beheerder. | Settings Catalog | 40 | — | `INTUNE-BASE-115-MACDEnrollmentProfileAdministratorUserAffinity` |
| [**Enrollment Profile Standard User Affinity**](SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) | Doorloopt Setup Assistant voor een bedrijfs-Mac met user affinity en vergrendelde inschrijving, en maakt het aangemelde account aan als standaardgebruiker; beheer loopt via het verborgen servicedeskaccount. | Settings Catalog | 40 | — | `INTUNE-BASE-116-MACDEnrollmentProfileStandardUserAffinity` |
| [**FileVault**](SettingsCatalog/Baseline_MAC_D_FileVault.md) | Versleutelt de schijf van de Mac en bewaart de herstelsleutel in Intune. De macOS-tegenhanger van BitLocker. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-038-MACDFileVault` |
| [**Firewall and Gatekeeper**](SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.md) | Zet de macOS-firewall aan en laat Gatekeeper alleen software toe die door een herkende ontwikkelaar is ondertekend. | Settings Catalog | 7 | All Devices | `INTUNE-BASE-039-MACDFirewallAndGatekeeper` |
| [**Microsoft AutoUpdate**](SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.md) | Hoe en wanneer Office, Edge en andere Microsoft-apps op de Mac zichzelf bijwerken. | Settings Catalog | 14 | All Devices | `INTUNE-BASE-040-MACDMicrosoftAutoUpdate` |
| [**Microsoft Edge Password Management**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.md) | Bepaalt of Edge op de Mac wachtwoorden mag opslaan en tonen. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement` |
| [**Microsoft Edge Security**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) | De beveiligingsinstellingen van Edge op macOS: SmartScreen, downloadcontrole en certificaatgedrag. | Settings Catalog | 29 | All Devices | `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity` |
| [**Microsoft Office**](SettingsCatalog/Baseline_MAC_D_Microsoft_Office.md) | Basisconfiguratie van Office op macOS. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-043-MACDMicrosoftOffice` |
| [**Microsoft OneDrive**](SettingsCatalog/Baseline_MAC_D_Microsoft_OneDrive.md) | Meldt de OneDrive-client op de Mac automatisch aan met het werkaccount en geeft 'm de toegangsrechten die macOS eist. | Settings Catalog | 13 | All Devices | `INTUNE-BASE-044-MACDMicrosoftOneDrive` |
| [**Passcode and Screen Lock**](SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) | Stelt op de Mac het wachtwoord en de schermvergrendeling in die de compliance-policy al eist: minimaal acht tekens, geen eenvoudig wachtwoord, vergrendelen na vijftien minuten. | Settings Catalog | 7 | — | `INTUNE-BASE-121-MACDPasscodeAndScreenLock` |
| [**Platform SSO**](SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) | Koppelt het aanmelden op de Mac aan Entra ID via de Microsoft-SSO-plug-in, zodat het Mac-wachtwoord en het werkaccount samenvallen. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-045-MACDPlatformSSO` |
| [**Privacy Preferences**](SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.md) | Zet de privacyrechten (PPPC) van de beheertools vast: NinjaOne Remote en TeamViewer krijgen Toegankelijkheid zodat besturing op afstand werkt, en de drie NinjaOne-onderdelen krijgen Volledige schijftoegang — zonder dat de gebruiker het hoeft goed te keuren, en zonder dat hij het kan intrekken. | Settings Catalog | 40 | All Devices | `INTUNE-BASE-110-MACDPrivacyPreferences` |
| [**Restrictions**](SettingsCatalog/Baseline_MAC_D_Restrictions.md) | Beperkt de macOS-functies waarmee bedrijfsdata het apparaat kan verlaten. | Settings Catalog | 37 | All Devices | `INTUNE-BASE-046-MACDRestrictions` |
| [**Screen Recording**](DeviceConfigurations/Baseline_MAC_D_Screen_Recording.md) | Zet schermopname voor NinjaOne Remote en TeamViewer op AllowStandardUserToSetSystemService: een gebruiker zonder beheerdersrechten kan het vinkje zelf aanzetten, zonder beheerderswachtwoord. Aanzetten blijft een handmatige klik — macOS staat een MDM niet toe schermopname te verlenen. | Device config | — | All Devices | — |
| [**Software Updates**](SettingsCatalog/Baseline_MAC_D_Software_Updates.md) | Hoe en wanneer macOS zijn eigen updates ophaalt en installeert. | Settings Catalog | 10 | All Devices | `INTUNE-BASE-047-MACDSoftwareUpdates` |

## User-scoped (U) — 8

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**Compliance Device Health**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md) | Toetst of System Integrity Protection op de Mac aanstaat. | Compliance | — | All Users | — |
| [**Compliance Device Security**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) | Toetst of de schijf van de Mac versleuteld is, de firewall aanstaat en Gatekeeper alleen ondertekende software toelaat. | Compliance | — | All Users | — |
| [**Compliance OS Version**](CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md) | Toetst of de Mac op macOS 14 of hoger draait — de versie die het declaratieve updatebeleid van de baseline vereist. | Compliance | — | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) | Toetst of de Mac een wachtwoord vereist en hoe sterk die moet zijn. | Compliance | — | All Users | — |
| [**Microsoft Edge Extensions**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.md) | Bepaalt welke Edge-extensies gebruikers op de Mac mogen installeren. | Settings Catalog | 4 | All Users | `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions` |
| [**Microsoft Edge Profiles and Sync**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.md) | Bepaalt met welk account gebruikers zich in Edge aanmelden en wat er gesynchroniseerd wordt. | Settings Catalog | 4 | All Users | `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync` |
| [**Microsoft Edge Updates**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.md) | Hoe en wanneer Edge op de Mac zichzelf bijwerkt. | Settings Catalog | 5 | All Users | `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates` |
| [**Microsoft OneDrive KFM**](SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.md) | Verplaatst Bureaublad en Documenten van de Mac naar OneDrive, zodat er niets alleen lokaal staat. | Settings Catalog | 15 | All Users | `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM` |

---

**Wat het doet** komt uit `doel` in [`_manifest.json`](../_manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
