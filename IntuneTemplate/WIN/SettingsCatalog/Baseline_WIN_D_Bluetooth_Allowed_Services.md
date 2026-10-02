<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Bluetooth_Allowed_Services.en.md) · [Français](Baseline_WIN_D_Bluetooth_Allowed_Services.fr.md)

# CXNM - Standard - WIN - D - Bluetooth Allowed Services

Staat over Bluetooth alleen muizen, toetsenborden, headsets, telefoons via Phone Link en passkeys toe, en sluit bestandsoverdracht, tethering en seriële verbindingen af.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Bluetooth CSP ServicesAllowedList (Microsoft Learn, ServicesAllowedList usage guide) en de Bluetooth SIG Assigned Numbers — id en vorm geverifieerd tegen DCv2/Settings in pl4nty/intune-change-tracking |
| Bestand | [`Baseline_WIN_D_Bluetooth_Allowed_Services.json`](Baseline_WIN_D_Bluetooth_Allowed_Services.json) |

> Windows kan Bluetooth niet filteren op soort apparaat (iPhone, Android, merk), alleen op dienst: elke UUID op de lijst is een Bluetooth-profiel dat mag, en alles wat er niet op staat werkt niet meer. De lijst is ingedeeld in blokken, zodat je per tenant een blok kunt weghalen of toevoegen. BLE-basis (1800 Generic Access, 1801 Generic Attribute, 180A Device Information, 180F Battery, 1813 Scan Parameters, 1200 PnP Information) — nooit weghalen, zonder deze zes vallen moderne muizen en toetsenborden weg. Invoer: 1124 HID en 1812 HID over GATT (muis, toetsenbord, pen, gamecontroller). Klassieke audio: 1108/1112 Headset, 111E/111F Handsfree, 110A/110B/110D A2DP, 110C/110E/110F AVRCP. LE Audio voor nieuwere headsets en hoortoestellen: 1843–1855 (volume, microfoon, audiostreams, gesprekken, media, Hearing Access). Telefoon via Phone Link: 111E/111F Handsfree (bellen), 112E/112F/1130 PBAP (contacten), 1132/1133/1134 MAP (berichten), en Apple ANCS 7905F431-… en AMS 89D3502B-… (meldingen en media van een iPhone). Passkeys: FFF9 (telefoon als passkey via QR-code) en FFFD (FIDO-beveiligingssleutel over Bluetooth). Bewust níét op de lijst, en dus geblokkeerd: 1105 OBEX Object Push en 1106 OBEX File Transfer (bestanden versturen), 1115/1116/1117 PAN (tethering), 1101 Serial Port en 1103 Dial-up Networking. Wie bestandsoverdracht wél wil toestaan, voegt 1105 en 1106 toe in een tenantspecifieke kopie; wie geen telefoons wil, haalt het telefoonblok weg (laat Handsfree staan voor headsets). Windows leest de lijst bij het starten van de Bluetooth-stack: na toewijzen of wijzigen werkt hij pas na een herstart. Microsoft documenteert niet of de lijst ook BLE-advertenties raakt die de pc alleen ontvangt (zoals bij een passkey via QR-code); FFF9 staat er daarom voor de zekerheid op. Naast CXNM - Standard - WIN - D - Wireless and Peripherals, geen overlap: die zet alleen de vindbaarheid uit, deze bepaalt welke diensten werken.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.DS-01<br>PR.IR-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_bluetooth_servicesallowedlist` | {00001800-0000-1000-8000-00805F9B34FB}, {00001801-0000-1000-8000-00805F9B34FB}, {0000180A-0000-1000-8000-00805F9B34FB}, {0000180F-0000-1000-8000-00805F9B34FB}, {00001813-0000-1000-8000-00805F9B34FB}, {00001200-0000-1000-8000-00805F9B34FB}, {00001124-0000-1000-8000-00805F9B34FB}, {00001812-0000-1000-8000-00805F9B34FB}, {00001108-0000-1000-8000-00805F9B34FB}, {00001112-0000-1000-8000-00805F9B34FB}, {0000111E-0000-1000-8000-00805F9B34FB}, {0000111F-0000-1000-8000-00805F9B34FB}, {0000110A-0000-1000-8000-00805F9B34FB}, {0000110B-0000-1000-8000-00805F9B34FB}, {0000110D-0000-1000-8000-00805F9B34FB}, {0000110C-0000-1000-8000-00805F9B34FB}, {0000110E-0000-1000-8000-00805F9B34FB}, {0000110F-0000-1000-8000-00805F9B34FB}, {00001843-0000-1000-8000-00805F9B34FB}, {00001844-0000-1000-8000-00805F9B34FB}, {00001845-0000-1000-8000-00805F9B34FB}, {00001846-0000-1000-8000-00805F9B34FB}, {0000184B-0000-1000-8000-00805F9B34FB}, {0000184C-0000-1000-8000-00805F9B34FB}, {00001848-0000-1000-8000-00805F9B34FB}, {00001849-0000-1000-8000-00805F9B34FB}, {0000184D-0000-1000-8000-00805F9B34FB}, {0000184E-0000-1000-8000-00805F9B34FB}, {0000184F-0000-1000-8000-00805F9B34FB}, {00001850-0000-1000-8000-00805F9B34FB}, {00001853-0000-1000-8000-00805F9B34FB}, {00001854-0000-1000-8000-00805F9B34FB}, {00001855-0000-1000-8000-00805F9B34FB}, {0000112E-0000-1000-8000-00805F9B34FB}, {0000112F-0000-1000-8000-00805F9B34FB}, {00001130-0000-1000-8000-00805F9B34FB}, {00001132-0000-1000-8000-00805F9B34FB}, {00001133-0000-1000-8000-00805F9B34FB}, {00001134-0000-1000-8000-00805F9B34FB}, {0000FFF9-0000-1000-8000-00805F9B34FB}, {0000FFFD-0000-1000-8000-00805F9B34FB}, {7905F431-B5CE-4E99-A40F-4B1E122D00D0}, {89D3502B-0F36-433A-8EF4-C502AD55F8DC} |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
