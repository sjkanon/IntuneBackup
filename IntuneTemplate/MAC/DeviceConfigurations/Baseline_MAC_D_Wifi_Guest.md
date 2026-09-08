<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Wifi Guest

Rolt het gastnetwerk uit als tweede profiel op elke Mac, zodat een apparaat online blijft wanneer het bedrijfsnetwerk niet bereikbaar is.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | Eigen baseline — Intune wifi-profiel (macOSWiFiConfiguration), WPA/WPA2-Personal. ISO/IEC 27001:2022 A.8.20 en A.8.21, NIS2 art. 21(2)(c) en (e). |
| Bestand | [`Baseline_MAC_D_Wifi_Guest.json`](Baseline_MAC_D_Wifi_Guest.json) |

> SSID en PSK staan op `<SSID-GUEST>` en `<PSK-GUEST>`. Vul ze in vóór je toewijst. Het wachtwoord komt in dit template te staan en daarmee in deze repo. Er bestaat geen CIPP-token voor een PSK zoals %OrganizationId% dat voor de tenant-id is, en een placeholder laten staan werkt hier niet: Graph geeft een PSK nooit terug — bij een tenant-backup komt alleen `preSharedKeyIsSet: true` mee. Vul je hem dus in de tenant in in plaats van hier, dan zet de eerstvolgende CIPP-sync de placeholder er weer overheen en is elk apparaat zijn wifi kwijt. Vul hem hier in, en alleen zolang deze repo privé is; wordt hij ooit gedeeld, roteer dan de PSK. Dat de PSK sowieso een gedeeld geheim blijft staat al in de toelichting bij [Baseline] - WIN - D - Wireless and Peripherals: een lokale beheerder leest hem met `netsh wlan show profile key=clear` gewoon uit, en de maatregel die dat wél oplost is 802.1X met certificaten — wat ISMP19 ook voorschrijft. Dit profiel is de terugval, niet de eerste keuze: rol hem alleen uit náást Wifi Corporate, anders hangt de hele vloot standaard op het gastnetwerk. macOS bepaalt de voorkeursvolgorde zelf op basis van de netwerkvolgorde van het apparaat; wil je die hard vastleggen, dan is dat handwerk of een script en niet dit profiel.

## Eigenschappen — 7

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `ssid` | <SSID-GUEST> |
| `networkName` | <SSID-GUEST> |
| `wiFiSecurityType` | wpaPersonal |
| `preSharedKey` | <PSK-GUEST> |
| `connectAutomatically` | true |
| `connectWhenNetworkNameIsHidden` | false |
| `proxySettings` | none |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
