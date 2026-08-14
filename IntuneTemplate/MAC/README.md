<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# macOS — 20 policies

Alle policies heten `[Baseline] - MAC - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 17 |
| `CompliancePolicies/` | 3 |

## Device-scoped (D) — 13

Toewijzen aan apparaatgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| **Accounts and Login** | Bepaalt wat er bij het aanmelden zichtbaar is en welke accounts een Mac mag hebben. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-035-MACDAccountsAndLogin` |
| **Defender Antivirus** | Realtimebeveiliging, cloudbescherming en scangedrag van Defender op macOS. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-036-MACDDefenderAntivirus` |
| **Defender for Endpoint** | Geeft Defender de systeemrechten die macOS eist voordat het kan werken: systeemextensie, netwerkfilter en volledige schijftoegang. Zonder deze policy blijft Defender op een Mac half geïnstalleerd. | Settings Catalog | 55 | All Devices | `INTUNE-BASE-037-MACDDefenderForEndpoint` |
| **FileVault** | Versleutelt de schijf van de Mac en bewaart de herstelsleutel in Intune. De macOS-tegenhanger van BitLocker. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-038-MACDFileVault` |
| **Firewall and Gatekeeper** | Zet de macOS-firewall aan en laat Gatekeeper alleen software toe die door een herkende ontwikkelaar is ondertekend. | Settings Catalog | 7 | All Devices | `INTUNE-BASE-039-MACDFirewallAndGatekeeper` |
| **Microsoft AutoUpdate** | Hoe en wanneer Office, Edge en andere Microsoft-apps op de Mac zichzelf bijwerken. | Settings Catalog | 14 | All Devices | `INTUNE-BASE-040-MACDMicrosoftAutoUpdate` |
| **Microsoft Edge Password Management** | Bepaalt of Edge op de Mac wachtwoorden mag opslaan en tonen. | Settings Catalog | 3 | All Devices | `INTUNE-BASE-041-MACDMicrosoftEdgePasswordManagement` |
| **Microsoft Edge Security** | De beveiligingsinstellingen van Edge op macOS: SmartScreen, downloadcontrole en certificaatgedrag. | Settings Catalog | 29 | All Devices | `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity` |
| **Microsoft Office** | Basisconfiguratie van Office op macOS. | Settings Catalog | 5 | All Devices | `INTUNE-BASE-043-MACDMicrosoftOffice` |
| **Microsoft OneDrive** | Meldt de OneDrive-client op de Mac automatisch aan met het werkaccount en geeft 'm de toegangsrechten die macOS eist. | Settings Catalog | 14 | All Devices | `INTUNE-BASE-044-MACDMicrosoftOneDrive` |
| **Platform SSO** | Koppelt het aanmelden op de Mac aan Entra ID via de Microsoft-SSO-plug-in, zodat het Mac-wachtwoord en het werkaccount samenvallen. | Settings Catalog | 24 | All Devices | `INTUNE-BASE-045-MACDPlatformSSO` |
| **Restrictions** | Beperkt de macOS-functies waarmee bedrijfsdata het apparaat kan verlaten. | Settings Catalog | 37 | All Devices | `INTUNE-BASE-046-MACDRestrictions` |
| **Software Updates** | Hoe en wanneer macOS zijn eigen updates ophaalt en installeert. | Settings Catalog | 7 | All Devices | `INTUNE-BASE-047-MACDSoftwareUpdates` |

## User-scoped (U) — 7

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| **Compliance Device Health** | Toetst of de Mac versleuteld is en veilig opstart. | Compliance | — | All Users | — |
| **Compliance Device Security** | Toetst de beveiligingsstand van de Mac: firewall en systeemintegriteit. | Compliance | — | All Users | — |
| **Compliance Password** | Toetst of de Mac een wachtwoord vereist en hoe sterk die moet zijn. | Compliance | — | All Users | — |
| **Microsoft Edge Extensions** | Bepaalt welke Edge-extensies gebruikers op de Mac mogen installeren. | Settings Catalog | 4 | All Users | `INTUNE-BASE-051-MACUMicrosoftEdgeExtensions` |
| **Microsoft Edge Profiles and Sync** | Bepaalt met welk account gebruikers zich in Edge aanmelden en wat er gesynchroniseerd wordt. | Settings Catalog | 4 | All Users | `INTUNE-BASE-052-MACUMicrosoftEdgeProfilesAndSync` |
| **Microsoft Edge Updates** | Hoe en wanneer Edge op de Mac zichzelf bijwerkt. | Settings Catalog | 5 | All Users | `INTUNE-BASE-053-MACUMicrosoftEdgeUpdates` |
| **Microsoft OneDrive KFM** | Verplaatst Bureaublad en Documenten van de Mac naar OneDrive, zodat er niets alleen lokaal staat. | Settings Catalog | 15 | All Users | `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM` |

---

**Wat het doet** komt uit `doel` in [`_oib-manifest.json`](../_oib-manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
