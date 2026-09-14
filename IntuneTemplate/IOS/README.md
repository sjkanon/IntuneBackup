<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# iOS/iPadOS — 14 policies

Alle policies heten `[Baseline] - IOS - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 8 |
| `DeviceConfigurations/` | 2 |
| `AppProtection/` | 1 |
| `CompliancePolicies/` | 3 |

## Device-scoped (D) — 10

Toewijzen aan apparaatgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**Apple Intelligence Permitted**](SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.md) | Staat op ingeschreven iPhones en iPads de generatieve Apple Intelligence-functies en de koppeling met externe AI-diensten uitdrukkelijk toe. | Settings Catalog | 12 | — | `INTUNE-BASE-183-IOSDAppleIntelligencePermitted` |
| [**Apple Intelligence Restricted**](SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.md) | Zet op ingeschreven iPhones en iPads de generatieve Apple Intelligence-functies uit — Writing Tools, Genmoji, Image Playground, Image Wand, gepersonaliseerd handschrift, samenvattingen in Mail, Notities, Safari en Visual Intelligence — en de koppeling met externe AI-diensten zoals ChatGPT. | Settings Catalog | 12 | — | `INTUNE-BASE-184-IOSDAppleIntelligenceRestricted` |
| [**Data Protection**](SettingsCatalog/Baseline_IOS_D_Data_Protection.md) | Houdt bedrijfsgegevens op elk ingeschreven toestel gescheiden van privé-apps: documenten uit beheerde apps openen niet in onbeheerde apps, AirDrop telt als onbeheerd, beheerde apps synchroniseren niet naar iCloud, privé-apps lezen geen werkcontacten en lokale back-ups zijn versleuteld. | Settings Catalog | 6 | — | `INTUNE-BASE-185-IOSDDataProtection` |
| [**Defender for Endpoint Onboarding Supervised**](DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.md) | Onboardt Microsoft Defender for Endpoint zonder gebruikersactie op supervised bedrijfstoestellen met een content filter-profiel, zodat webbescherming werkt zonder lokale VPN. | Device config | — | — | — |
| [**Defender for Endpoint Onboarding Unsupervised**](DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.md) | Onboardt Microsoft Defender for Endpoint zonder gebruikersactie op niet-supervised ingeschreven toestellen via Defender's lokale loopback-VPN, die webbescherming levert zonder verkeer van het toestel te sturen. | Device config | — | — | — |
| [**Enterprise SSO**](SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.md) | Zet de Microsoft Enterprise SSO-plug-in van Microsoft Authenticator aan, zodat beheerde apps en Safari één Entra-aanmelding delen en het apparaat zich bij Conditional Access kan bewijzen. | Settings Catalog | 19 | — | `INTUNE-BASE-188-IOSDEnterpriseSSO` |
| [**Lock Screen**](SettingsCatalog/Baseline_IOS_D_Lock_Screen.md) | Toont op het vergrendelscherm van een bedrijfs-iPhone of -iPad een tekst voor de vinder, zodat een verloren toestel terug kan naar de organisatie. | Settings Catalog | 1 | — | `INTUNE-BASE-189-IOSDLockScreen` |
| [**Passcode**](SettingsCatalog/Baseline_IOS_D_Passcode.md) | Stelt op ingeschreven iPhones en iPads de toegangscode in die de compliance-policy toetst: minimaal zes tekens, geen eenvoudige code, direct vergrendelen, automatisch vergrendelen na hoogstens vijf minuten, en wissen pas na tien foute pogingen. | Settings Catalog | 6 | — | `INTUNE-BASE-190-IOSDPasscode` |
| [**Restrictions Corporate**](SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.md) | Hardening voor supervised bedrijfs-iPhones en -iPads: geen handmatig geïnstalleerde profielen of ontwikkelaarsapps, geen apps van buiten de App Store, onbetrouwbare TLS-certificaten automatisch geweigerd, geen wissen via Instellingen, een vergrendelscherm zonder Control Center, meldingenhistorie, Today-weergave en Siri, en Activation Lock alleen met een door Intune bewaarde bypasscode. | Settings Catalog | 18 | — | `INTUNE-BASE-191-IOSDRestrictionsCorporate` |
| [**Software Updates**](SettingsCatalog/Baseline_IOS_D_Software_Updates.md) | Dwingt op ingeschreven iPhones en iPads de nieuwste iOS-versie af uiterlijk 14 dagen na uitgave (installatie om 02:00), zet automatisch downloaden en installeren van OS- en beveiligingsupdates vast aan, en laat de gebruiker beveiligingsverbeteringen niet terugdraaien. | Settings Catalog | 10 | — | `INTUNE-BASE-192-IOSDSoftwareUpdates` |

## User-scoped (U) — 4

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**App Protection**](AppProtection/Baseline_IOS_U_App_Protection.md) | Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke iPhone of iPad: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens — zonder dat het apparaat zelf beheerd wordt. | App Protection | — | All Users | — |
| [**Compliance Defender for Endpoint**](CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.md) | Merkt een iPhone of iPad als niet-compliant zodra Microsoft Defender for Endpoint het machinerisico hoger dan Medium inschat. | Compliance | — | — | — |
| [**Compliance Device Health**](CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.md) | Merkt een iPhone of iPad die met een jailbreak is opengebroken als niet-compliant. | Compliance | — | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_IOS_U_Compliance_Password.md) | Toetst of een iPhone of iPad een toegangscode van minimaal zes tekens vereist, geen eenvoudige code, en na vijftien minuten vergrendelt. | Compliance | — | — | — |

---

**Wat het doet** komt uit `doel` in [`_manifest.json`](../_manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
