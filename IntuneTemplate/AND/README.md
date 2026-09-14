<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# Android — 14 policies

Alle policies heten `[Baseline] - AND - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `CompliancePolicies/` | 8 |
| `DeviceConfigurations/` | 2 |
| `AppProtection/` | 1 |
| `SettingsCatalog/` | 3 |

## Device-scoped (D) — 2

Toewijzen aan apparaatgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**Compliance Dedicated Device Health**](CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.md) | Merkt een dedicated Android-toestel (kiosk of gedeeld) als niet-compliant wanneer het geroot is, Play Integrity niet hardwarematig slaagt, de Intune-app gemanipuleerd is, de opslag niet versleuteld is of de laatste beveiligingspatch ouder is dan de ondergrens. | Compliance | — | — | — |
| [**System Updates**](DeviceConfigurations/Baseline_AND_D_System_Updates.md) | Installeert Android-systeemupdates op toestellen van de organisatie automatisch in een onderhoudsvenster tussen 00:00 en 06:00. | Device config | — | — | — |

## User-scoped (U) — 12

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing | checkId |
|---|---|---|---:|---|---|
| [**App Protection**](AppProtection/Baseline_AND_U_App_Protection.md) | Beschermt bedrijfsdata binnen de Microsoft-apps op een persoonlijke Android-telefoon: aparte PIN, versleuteling, geen kopiëren naar privé-apps, en op afstand wissen van alleen de werkgegevens. | App Protection | — | All Users | — |
| [**Compliance Block Device Administrator**](CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.md) | Merkt elk Android-toestel dat nog met het verouderde device administrator wordt beheerd als niet-compliant, zodat het naar Android Enterprise moet. | Compliance | — | — | — |
| [**Compliance Corporate Defender for Endpoint**](CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.md) | Merkt een fully managed of corporate-owned Android-toestel als niet-compliant wanneer Defender for Endpoint er een risicoscore hoger dan laag aan geeft. | Compliance | — | — | — |
| [**Compliance Corporate Device Health**](CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.md) | Merkt een fully managed of corporate-owned Android-toestel als niet-compliant wanneer het geroot is, Play Integrity niet hardwarematig slaagt, de Intune-app gemanipuleerd is, het onder Android 16 draait of de laatste beveiligingspatch ouder is dan de ondergrens. | Compliance | — | — | — |
| [**Compliance Corporate Password**](CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.md) | Toetst of een fully managed of corporate-owned Android-toestel een numeriek complexe code van minimaal zes cijfers heeft, na vijftien minuten vergrendelt, de laatste vijf codes niet hergebruikt en versleuteld is. | Compliance | — | — | — |
| [**Compliance Defender for Endpoint**](CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.md) | Merkt een Android-toestel met persoonlijk werkprofiel als niet-compliant wanneer Defender for Endpoint er een risicoscore hoger dan laag aan geeft. | Compliance | — | — | — |
| [**Compliance Device Health**](CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.md) | Merkt een Android-toestel met persoonlijk werkprofiel als niet-compliant wanneer het geroot is, USB-foutopsporing aanstaat, apps van buiten de Play Store zijn toegestaan, Play Integrity niet hardwarematig bevestigd kan worden, of de laatste beveiligingspatch ouder is dan de ondergrens. | Compliance | — | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_AND_U_Compliance_Password.md) | Toetst of een Android-toestel met persoonlijk werkprofiel een schermvergrendeling van gemiddelde complexiteit heeft, of het werkprofiel daarnaast een eigen code van minimaal zes cijfers (numeriek complex, gemiddelde complexiteit) vraagt die na vijftien minuten vergrendelt, en of de opslag versleuteld is. | Compliance | — | — | — |
| [**Corporate AI Restricted**](SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.md) | Voorkomt op fully managed en corporate-owned Android-toestellen dat scherminhoud naar een assistent-app gaat (zoals Gemini of Circle to Search) en dat apps functies aan AI-agenten aanbieden. | Settings Catalog | 2 | — | `INTUNE-BASE-179-ANDUCorporateAIRestricted` |
| [**Corporate Data Protection**](SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.md) | Blokkeert op fully managed en corporate-owned Android-toestellen schermafdrukken, delen van bestanden via Bluetooth en het terugzetten naar fabrieksinstellingen door de gebruiker. | Settings Catalog | 3 | — | `INTUNE-BASE-180-ANDUCorporateDataProtection` |
| [**Corporate Device Security**](SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.md) | Hardt fully managed en corporate-owned Android-toestellen: code van zes cijfers (numeriek complex) die na tien pogingen wist, dagelijks één keer de code in plaats van alleen biometrie, scherm hoogstens vijftien minuten aan, Play Protect en automatische app-updates aan, geen bestandsoverdracht via USB of externe opslag, geen 2G, geen handmatige tijd, geen Private Space en geen delen van werk naar privé. | Settings Catalog | 14 | — | `INTUNE-BASE-181-ANDUCorporateDeviceSecurity` |
| [**Work Profile Restrictions**](DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.md) | Zet op een toestel met persoonlijk werkprofiel een eigen werkprofielcode (zes cijfers, gemiddelde complexiteit, vergrendelt na vijftien minuten, wist na tien pogingen alleen het werkprofiel), blokkeert kopiëren, delen en schermafdrukken van werk naar privé, en zet Play Protect aan. | Device config | — | — | — |

---

**Wat het doet** komt uit `doel` in [`_manifest.json`](../_manifest.json). Diezelfde zin
staat, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld van het
template — en dus straks in de tenant naast de policy.

Een lege **checkId** betekent dat de platform-engine geen matcher voor dat policytype heeft
(Device config, compliance, app protection) — zie de [hoofd-README](../../README.md#welke-types-een-check-opleveren).
