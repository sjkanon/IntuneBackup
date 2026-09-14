# extras/macos/defender-onboarding/

Hoe een Mac wordt aangemeld bij Microsoft Defender for Endpoint — en waarom daar geen
generiek template voor in `IntuneTemplate/` staat.

## De leemte

De baseline zet Defender op macOS wel klaar —
[`MAC - D - Defender for Endpoint`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md)
(systeemextensies, netwerkfilter, volledige schijftoegang, meldingen) en
[`MAC - D - Defender Antivirus`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.md)
(realtimebeveiliging, tamper protection) — maar **meldt de Mac nergens aan**. Zonder aanmelding
draait de agent zonder licentie: `mdatp health` meldt `licensed: false`, er komen geen
EDR-signalen in het Defender-portaal en de compliance-check in
[`compliance/macos/`](../../../compliance/macos/README.md) blijft rood.

## Kan het generiek, zoals op Windows? Nee.

Op Windows zet `[Baseline] - WIN - D - Defender for Endpoint EDR` de instelling
`device_vendor_msft_windowsadvancedthreatprotection_onboarding_fromconnector`: Intune haalt het
aanmeldpakket zelf op via de Defender-connector, dus het template bevat niets tenantspecifieks.

Voor macOS bestaat die route niet (gecontroleerd september 2026):

| Gezocht | Resultaat |
|---|---|
| settings catalog (`pl4nty/intune-change-tracking`, 18.329 definities) op `onboard`, `wdav.atp`, `orgid` | alleen de twee Windows-ids en een Office-instelling; geen macOS-onboarding |
| Endpoint security-template *Endpoint detection and response* voor macOS (`a6ff37f6-c841-4264-9249-1ecf793d94ef_1`, technologies `mdm,microsoftSense`) | bevat alleen apparaattags (`com.apple.managedclient.preferences_tags`) en groeps-id's (`…_groupids`) — geen aanmeldpakket, geen connector-optie |
| Microsoft Learn — *Deploy Microsoft Defender for Endpoint on macOS with Intune* (bijgewerkt 9 september 2026), stap 13–14 | het aanmeldpakket `WindowsDefenderATPOnboarding.xml` downloaden uit het Defender-portaal en uploaden als **custom configuration profile** |

Dat XML-bestand bevat de organisatie-id en aanmeldgegevens van de tenant. Een CIPP-template
(`macOSCustomConfiguration`, Type `Device`) zou technisch kunnen, maar dan staat er per tenant
een ander bestand in de payload — het tegendeel van een generieke baseline, en een geheim in de
repo. Een placeholder werkt niet: de payload is base64 van een plist die macOS moet kunnen lezen.

## De route (per tenant, eenmalig)

Voorwaarden: licentie Defender for Endpoint Plan 1/2 of Microsoft 365 E3/E5/Business Premium,
en de **Microsoft Defender for Endpoint-connector** aan in Intune (Endpoint security →
Microsoft Defender for Endpoint → *Connect macOS devices … to Microsoft Defender for Endpoint*: On).

1. **Configuratie eerst.** Wijs `MAC - D - Defender for Endpoint` en `MAC - D - Defender Antivirus`
   toe vóór de app en het aanmeldpakket (Microsoft: "Deploy the required configuration profiles
   before you deploy the Defender for Endpoint app and onboarding package").
2. **App.** Apps → macOS → Add → *Microsoft Defender for Endpoint (macOS)*, standaardwaarden,
   toewijzen aan dezelfde apparaatgroep. (Een app-toewijzing is geen CIPP-policytype; daarom
   ook hier en niet in `IntuneTemplate/`.)
3. **Aanmeldpakket downloaden.** Defender-portaal → Settings → Endpoints → Onboarding →
   macOS, Connectivity type *Streamlined*, Deployment method *Mobile Device Management / Microsoft
   Intune* → Download. Uit de zip: `intune/WindowsDefenderATPOnboarding.xml`.
4. **Profiel.** Devices → macOS → Configuration → Create → Templates → **Custom**. Naam
   `[Baseline] - MAC - D - Defender for Endpoint Onboarding`, deployment channel *Device channel*,
   bestand `WindowsDefenderATPOnboarding.xml`. Toewijzen aan dezelfde groep.
5. **Controleren.** Op de Mac: `mdatp health --field licensed` → `true`, en
   `mdatp health --field org_id` toont de tenant. In het portaal verschijnt het apparaat binnen
   ongeveer een uur. EDR-test: Microsoft Learn *EDR detection test*.
6. **Compliance.** Pas daarna de custom compliance uit `compliance/macos/` toewijzen, en — als de
   organisatie op risiconiveau wil sturen — `deviceThreatProtectionEnabled` in de
   macOS-compliance.

Bewaar het XML-bestand **niet** in deze repo. Het pakket verloopt niet, maar wie het heeft kan
apparaten bij de tenant aanmelden.

## Wat de bestaande policy nog mist (voor de volgende OIB-import)

Microsoft's lijst van benodigde profielen vergeleken met `MAC - D - Defender for Endpoint`
(OpenIntuneBaseline macOS v1.0):

| Microsoft Learn | Nu | OIB macOS v2.0 beta |
|---|---|---|
| Background services voor `com.microsoft.wdav` | alleen regels voor `com.microsoft.fresno` en `com.microsoft.dlp` | voegt `com.microsoft.wdav` toe, met team-id |
| Allowed System Extension **Types** `Network` en `EndpointSecurity` | niet gezet (alleen de extensies zelf) | niet gezet |
| Notificaties voor `com.microsoft.autoupdate2` | alleen `com.microsoft.wdav.tray` | wel |

Die punten horen in de import van OIB macOS v2.0 zodra die uit beta is; ze zijn hier niet los
ingebouwd omdat de policy uit OIB komt en een tweede `com.apple.servicemanagement`-profiel naast
de bestaande regels het beheer onoverzichtelijk maakt. Het Endpoint security-EDR-template (tags)
is optioneel en organisatiespecifiek; niet opgenomen.

## Normen

Onboarding is wat A.8.7 (bescherming tegen malware), A.8.16 (monitoringactiviteiten), NIS2
art. 21(2)(b) (incidentbehandeling) en CIS Controls v8.1 10.1 / 13.7 (host-based intrusion
prevention) op een Mac daadwerkelijk invult; de configuratiepolicies alleen doen dat niet.
