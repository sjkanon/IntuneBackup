<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Wifi Guest

Rolt het gastnetwerk uit als tweede profiel op elke Windows-laptop, zodat een apparaat online blijft wanneer het bedrijfsnetwerk niet bereikbaar is en vanzelf terugvalt naar het bedrijfsnetwerk zodra dat weer in de lucht is.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | Eigen baseline — Intune wifi-profiel (windowsWifiConfiguration), WPA2-Personal. ISO/IEC 27001:2022 A.8.20 en A.8.21, NIS2 art. 21(2)(c) en (e). |
| Bestand | [`Baseline_WIN_D_Wifi_Guest.json`](Baseline_WIN_D_Wifi_Guest.json) |

> SSID en PSK staan op `<SSID-GUEST>` en `<PSK-GUEST>`. Vul ze in vóór je toewijst. Het wachtwoord komt in dit template te staan en daarmee in deze repo. Er bestaat geen CIPP-token voor een PSK zoals %OrganizationId% dat voor de tenant-id is, en een placeholder laten staan werkt hier niet: Graph geeft een PSK nooit terug — bij een tenant-backup komt alleen `preSharedKeyIsSet: true` mee. Vul je hem dus in de tenant in in plaats van hier, dan zet de eerstvolgende CIPP-sync de placeholder er weer overheen en is elk apparaat zijn wifi kwijt. Vul hem hier in, en alleen zolang deze repo privé is; wordt hij ooit gedeeld, roteer dan de PSK. Dat de PSK sowieso een gedeeld geheim blijft staat al in de toelichting bij [Baseline] - WIN - D - Wireless and Peripherals: een lokale beheerder leest hem met `netsh wlan show profile key=clear` gewoon uit, en de maatregel die dat wél oplost is 802.1X met certificaten — wat ISMP19 ook voorschrijft. `connectToPreferredNetwork` staat hier op true en bij Wifi Corporate op false: dit is de terugval, dus zodra het bedrijfsnetwerk weer in de lucht is hoort Windows daarheen terug te gaan. Rol hem alleen uit náást Wifi Corporate, anders hangt de hele vloot standaard op het gastnetwerk. Staat er een verbruikslimiet op het gastnetwerk, zet `meteredConnectionLimit` dan op `fixed` — nu staat hij op `unrestricted`, waarmee Windows er ook updates over binnenhaalt.

## Eigenschappen — 9

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `ssid` | <SSID-GUEST> |
| `networkName` | <SSID-GUEST> |
| `wifiSecurityType` | wpa2Personal |
| `preSharedKey` | <PSK-GUEST> |
| `connectAutomatically` | true |
| `connectToPreferredNetwork` | true |
| `connectWhenNetworkNameIsHidden` | false |
| `meteredConnectionLimit` | unrestricted |
| `proxySetting` | none |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
