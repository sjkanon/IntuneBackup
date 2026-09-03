<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Wireless and Peripherals

Maakt het apparaat onzichtbaar over Bluetooth en sluit Windows Connect Now af, zodat draadloze instellingen niet buiten het beheer om van het ene apparaat naar het andere kunnen worden overgezet. Al gekoppelde apparaten blijven werken.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-137-DWirelessAndPeripherals` |
| Bron | ISO/IEC 27001:2022 A.8.20 en A.7.9, NIS2 art. 21(2)(e) — instellingen uit de Endpoint Security-set van IntuneAdmin |
| Bestand | [`Baseline_WIN_D_Wireless_and_Peripherals.json`](Baseline_WIN_D_Wireless_and_Peripherals.json) |

> Windows Connect Now is de vergeten route: daarmee kan een gebruiker draadloze instellingen — inclusief het netwerkwachtwoord — via WPS of een USB-stick van het ene apparaat naar het andere overzetten, buiten elk beheer om. Beide instellingen sluiten dat af. Over de vraag wie elkaars wifi-profielen kan zien: profielen die via Intune of GPO worden uitgerold zijn apparaatbreed en dus voor elke gebruiker van dat apparaat zichtbaar, en wie zelf een netwerk toevoegt kan met netsh het bijbehorende wachtwoord in leesbare tekst opvragen. Zolang het bedrijfsnetwerk op een gedeeld wachtwoord (PSK) draait, kent iedere gebruiker die ooit verbonden heeft dat wachtwoord dus — daar helpt geen enkele policy tegen. De maatregel die dat wél oplost staat in ISMP19 zelf: 802.1X met certificaten, want dan is er geen gedeeld geheim om uit te lezen. Handmatige wifi-configuratie helemaal blokkeren (AllowManualWiFiConfiguration) is bewust weggelaten: dat maakt thuiswerken en hotels onmogelijk, en ISMP08 staat teleworking uitdrukkelijk toe. ISMP19 gaat verder en zegt dat alle Bluetooth-profielen behalve Serial Port Profile uit moeten. Letterlijk uitvoeren breekt koptelefoons, muizen en toetsenborden; dat vraagt eerst een besluit. Deze vier instellingen zijn de verdedigbare tussenstap: het apparaat is niet meer te ontdekken of te benaderen door een onbekende, bestaande koppelingen blijven werken. ServicesAllowedList is bewust weggelaten — die vraagt om GUID's per profiel en zet er zonder zorgvuldige lijst meer uit dan bedoeld.

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_bluetooth_allowadvertising` | 0 |
| `device_vendor_msft_policy_config_bluetooth_allowdiscoverablemode` | 0 |
| `device_vendor_msft_policy_config_bluetooth_allowprepairing` | 0 |
| `device_vendor_msft_policy_config_bluetooth_allowpromptedproximalconnections` | 0 |
| `device_vendor_msft_policy_config_deviceinstallation_preventdevicemetadatafromnetwork` | 1 |
| `device_vendor_msft_policy_config_admx_windowsconnectnow_wcn_enableregistrar` | 0 |
| `device_vendor_msft_policy_config_admx_windowsconnectnow_wcn_disablewcnui_2` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
