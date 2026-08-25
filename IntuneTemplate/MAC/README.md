<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# macOS — 21 policies

Alle policies heten `[Baseline] - MAC - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 18 |
| `CompliancePolicies/` | 3 |

## Device-scoped (D) — 14

Toewijzen aan apparaatgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**Accounts and Login**](SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.md) | Bepaalt wat er bij het aanmelden zichtbaar is en welke accounts een Mac mag hebben. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-035-MACDAccountsAndLogin` |
| [**Defender Antivirus**](SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.md) | Realtimebeveiliging, cloudbescherming en scangedrag van Defender op macOS. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-036-MACDDefenderAntivirus` |
| [**Defender for Endpoint**](SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md) | Geeft Defender de systeemrechten die macOS eist voordat het kan werken: systeemextensie, netwerkfilter en volledige schijftoegang. Zonder deze policy blijft Defender op een Mac half geïnstalleerd. | Settings Catalog | 55 | All Devices | `INTUNE-BASE-037-MACDDefenderForEndpoint` |
| [**FileVault**](SettingsCatalog/Baseline_MAC_D_FileVault.md) | Versleutelt de schijf van de Mac en bewaart de herstelsleutel in Intune. De macOS-tegenhanger van BitLocker. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-038-MACDFileVault` |
| [**Firewall and Gatekeeper**](SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.md) | Zet de macOS-firewall aan en laat Gatekeeper alleen software toe die door een herkende ontwikkelaar is ondertekend. | Settings Catalog | 7 | All Devices | `INTUNE-BASE-039-MACDFirewallAndGatekeeper` |
| [**Microsoft AutoUpdate**](SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.md) | Hoe en wanneer Office, Edge en andere Microsoft-apps op de Mac zichzelf bijwerken. | Settings Catalog | 14 | All Devices | `INTUNE-BASE-040-MACDMicrosoftAutoUpdate` |
| [**Microsoft Edge Password Management**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.md) | Bepaalt of Edge op de Mac wachtwoorden mag opslaan en tonen. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement` |
| [**Microsoft Edge Security**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) | De beveiligingsinstellingen van Edge op macOS: SmartScreen, downloadcontrole en certificaatgedrag. | Settings Catalog | 29 | All Devices | `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity` |
| [**Microsoft Office**](SettingsCatalog/Baseline_MAC_D_Microsoft_Office.md) | Basisconfiguratie van Office op macOS. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-043-MACDMicrosoftOffice` |
| [**Microsoft OneDrive**](SettingsCatalog/Baseline_MAC_D_Microsoft_OneDrive.md) | Meldt de OneDrive-client op de Mac automatisch aan met het werkaccount en geeft 'm de toegangsrechten die macOS eist. | Settings Catalog | 14 | All Devices | `INTUNE-BASE-044-MACDMicrosoftOneDrive` |
| [**Platform SSO**](SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) | Koppelt het aanmelden op de Mac aan Entra ID via de Microsoft-SSO-plug-in, zodat het Mac-wachtwoord en het werkaccount samenvallen. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-045-MACDPlatformSSO` |
| [**Privacy Preferences**](SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.md) | Zet de privacyrechten (PPPC) van de beheertools vast: NinjaOne Remote en TeamViewer krijgen Toegankelijkheid, zodat toetsenbord- en muisbesturing tijdens een sessie werkt zonder dat de gebruiker het zelf hoeft goed te keuren — en zonder dat hij het kan intrekken. | Settings Catalog | 30 | All Devices | `INTUNE-BASE-110-MACDPrivacyPreferences` |
| [**Restrictions**](SettingsCatalog/Baseline_MAC_D_Restrictions.md) | Beperkt de macOS-functies waarmee bedrijfsdata het apparaat kan verlaten. | Settings Catalog | 37 | All Devices | `INTUNE-BASE-046-MACDRestrictions` |
| [**Software Updates**](SettingsCatalog/Baseline_MAC_D_Software_Updates.md) | Hoe en wanneer macOS zijn eigen updates ophaalt en installeert. | Settings Catalog | 7 | All Devices | `INTUNE-BASE-047-MACDSoftwareUpdates` |

## User-scoped (U) — 7

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**Compliance Device Health**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md) | Toetst of de Mac versleuteld is en veilig opstart. | Compliance | — | All Users | — |
| [**Compliance Device Security**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) | Toetst de beveiligingsstand van de Mac: firewall en systeemintegriteit. | Compliance | — | All Users | — |
| [**Compliance Password**](CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) | Toetst of de Mac een wachtwoord vereist en hoe sterk die moet zijn. | Compliance | — | All Users | — |
| [**Microsoft Edge Extensions**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.md) | Bepaalt welke Edge-extensies gebruikers op de Mac mogen installeren. | Settings Catalog | 4 | All Users | `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions` |
| [**Microsoft Edge Profiles and Sync**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.md) | Bepaalt met welk account gebruikers zich in Edge aanmelden en wat er gesynchroniseerd wordt. | Settings Catalog | 4 | All Users | `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync` |
| [**Microsoft Edge Updates**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.md) | Hoe en wanneer Edge op de Mac zichzelf bijwerkt. | Settings Catalog | 5 | All Users | `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates` |
| [**Microsoft OneDrive KFM**](SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.md) | Verplaatst Bureaublad en Documenten van de Mac naar OneDrive, zodat er niets alleen lokaal staat. | Settings Catalog | 15 | All Users | `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM` |

---

**Wat het doet** komt uit `doel` in [`_oib-manifest.json`](../_oib-manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
