<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Wireless Shared Devices

Laat op gedeelde apparaten alleen de netwerken toe die via Intune zijn uitgerold. Zelf toegevoegde wifi-netwerken worden verwijderd en er kunnen er geen bij.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-138-DWirelessSharedDevices` |
| Bron | ISO/IEC 27001:2022 A.8.20 en A.8.1, NIS2 art. 21(2)(e) — Policy CSP Wifi/AllowManualWiFiConfiguration |
| Bestand | [`Baseline_WIN_D_Wireless_Shared_Devices.json`](Baseline_WIN_D_Wireless_Shared_Devices.json) |

> ALLEEN voor gedeelde apparaten. Windows maakt van een netwerk dat een gebruiker zelf toevoegt standaard een all-user-profiel: elke andere gebruiker van dat apparaat ziet die SSID in de lijst staan en kan er verbinding mee maken. Het wachtwoord uitlezen lukt alleen als lokale beheerder, en dat is bij ons beperkt tot WLapsAdmin — maar de SSID-lijst zelf verraadt al waar een collega is geweest. Per-gebruiker-profielen bestaan in Windows wel (netsh wlan add profile user=current), maar de interface maakt ze nooit zo aan en er is geen MDM- of Settings Catalog-instelling die dat afdwingt: de bijbehorende GPO zit in Wireless Network (IEEE 802.11) Policies en is domeingebonden. Wat wel kan is de andere kant op: alleen nog netwerken uit Intune toestaan. TWEE VOORWAARDEN. Rol eerst een wifi-profiel uit via Intune, anders staat het apparaat na toepassing offline. En zet deze policy nooit op laptops: thuis- en hotelnetwerken werken dan niet meer, en ISMP08 staat teleworking uitdrukkelijk toe. Microsoft waarschuwt bovendien dat bestaande, door gebruikers aangemaakte profielen bij toepassing worden verwijderd — dat is hier de bedoeling, maar meld het vooraf.

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_wifi_allowmanualwificonfiguration` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
