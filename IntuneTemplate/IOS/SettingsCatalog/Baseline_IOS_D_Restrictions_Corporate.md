<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Restrictions Corporate

Hardening voor supervised bedrijfs-iPhones en -iPads: geen handmatig geïnstalleerde profielen of ontwikkelaarsapps, geen apps van buiten de App Store, onbetrouwbare TLS-certificaten automatisch geweigerd, geen wissen via Instellingen, een vergrendelscherm zonder Control Center, meldingenhistorie, Today-weergave en Siri, en Activation Lock alleen met een door Intune bewaarde bypasscode.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-191-IOSDRestrictionsCorporate` |
| Bron | UniFy iOS/iPadOS Baseline v1.2 (CIS Apple iOS/iPadOS 26 Benchmark v1.0.0, L1) — samengevoegd uit SC - Device Restrictions, Device Security, Device Pairing, Lock Screen, Safari Browser, Web-App-Store (EU) en Apple Intelligence & Siri - Corporate; IntuneAdmin — Disable Web Distribution App Installation EU. Waarden gecorrigeerd waar UniFy `_false` als 'niet afdwingen' gebruikt |
| Bestand | [`Baseline_IOS_D_Restrictions_Corporate.json`](Baseline_IOS_D_Restrictions_Corporate.json) |

> Bewust **niet** opgenomen: allowpasswordautofill=false (UniFy Corporate) — dat zet ook passkeys en wachtwoordmanagers uit; in plaats daarvan forceauthenticationbeforeautofill. iCloud-back-up en iCloud Drive uit (UniFy Corporate) — een klantbesluit over waar gegevens mogen staan, geen hardening; beheerde apps synchroniseren al niet naar iCloud via [Baseline] - IOS - D - Data Protection. Bluetooth-, NFC-, hotspot- en VPN-wijzigingen blokkeren (Connectivity Controls, L2) — breekt carkits, betaalpassen en thuiswerken. Siri volledig uit — alleen Siri op het vergrendelscherm staat uit. Host pairing (Finder/iTunes) regelt het inschrijfprofiel (iTunesPairingMode disallow), niet deze policy. allowopenfromunmanagedtomanaged niet geblokkeerd: dan kan een foto uit de Foto's-app niet meer in Outlook of Teams worden gedeeld — dezelfde afweging als bij allowedInboundDataTransferSources in App Protection. Controlecenter op het vergrendelscherm uit betekent ook: geen zaklamp zonder ontgrendelen. Correcties op UniFy: forceautomaticdateandtime staat daar op false (= niet afdwingen), hier true. Activation Lock: UniFy blokkeert het (false); hier toegestaan (true), omdat een supervised toestel dan diefstalbescherming heeft terwijl Intune de bypasscode bewaart (apparaatactie 'Activeringsslot uitschakelen'). Controleer vóór uitrol dat Intune voor een testtoestel een bypasscode toont; zonder die code is een teruggebracht toestel met een privé-Apple Account niet opnieuw te gebruiken — kies dan false. Deze policy deelt de top-levelgroep com.apple.applicationaccess met Data Protection maar zet geen enkele sleutel dubbel; iOS voegt restrictiepayloads samen.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.19 Installatie van software op operationele systemen<br>A.8.20 Netwerkbeveiliging<br>A.7.7 Clear desk en clear screen |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>2.5 Allowlist Authorized Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 22

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowuiconfigurationprofileinstallation` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowerasecontentandsettings` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowenterpriseapptrust` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowuntrustedtlsprompt` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceautomaticdateandtime` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowlockscreencontrolcenter` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowlockscreennotificationsview` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowlockscreentodayview` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowusbrestrictedmode` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowpasswordsharing` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowpasswordproximityrequests` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowproximitysetuptonewdevice` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceauthenticationbeforeautofill` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_safariforcefraudwarning` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowwebdistributionappinstallation` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmarketplaceappinstallation` | false |
| `settings_item_mdmoptions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`settings_item_mdmoptions_mdmoptions` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`settings_item_mdmoptions_mdmoptions_activationlockallowedwhilesupervised` | true |
| `sirisettings_sirisettings` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`sirisettings_allowwhilelocked` | false |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
