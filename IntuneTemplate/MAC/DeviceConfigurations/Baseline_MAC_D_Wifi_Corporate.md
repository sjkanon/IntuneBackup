<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Wifi Corporate

Rolt het bedrijfsnetwerk als wifi-profiel uit op elke Mac, zodat een apparaat na inschrijving vanzelf verbinding heeft en een gebruiker het netwerkwachtwoord nooit hoeft te kennen of in te typen.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | Eigen baseline — Intune wifi-profiel (macOSWiFiConfiguration), WPA/WPA2-Personal. ISO/IEC 27001:2022 A.8.20 en A.8.21, NIS2 art. 21(2)(e). |
| Bestand | [`Baseline_MAC_D_Wifi_Corporate.json`](Baseline_MAC_D_Wifi_Corporate.json) |

> SSID en PSK staan op `<SSID-CORPORATE>` en `<PSK-CORPORATE>`. Vul ze in vóór je toewijst; met de placeholder erin maakt het profiel op geen enkel apparaat verbinding. Het wachtwoord komt in dit template te staan en daarmee in deze repo. Er bestaat geen CIPP-token voor een PSK zoals %OrganizationId% dat voor de tenant-id is, en een placeholder laten staan werkt hier niet: Graph geeft een PSK nooit terug — bij een tenant-backup komt alleen `preSharedKeyIsSet: true` mee. Vul je hem dus in de tenant in in plaats van hier, dan zet de eerstvolgende CIPP-sync de placeholder er weer overheen en is elk apparaat zijn wifi kwijt. Vul hem hier in, en alleen zolang deze repo privé is; wordt hij ooit gedeeld, roteer dan de PSK. Dat de PSK sowieso een gedeeld geheim blijft staat al in de toelichting bij [Baseline] - WIN - D - Wireless and Peripherals: een lokale beheerder leest hem met `netsh wlan show profile key=clear` gewoon uit, en de maatregel die dat wél oplost is 802.1X met certificaten — wat ISMP19 ook voorschrijft. Twee macOS-eigenaardigheden: Apple's wifi-payload kent maar één personal-variant, dus `wpaPersonal` dekt WPA, WPA2 én WPA3 waar Windows apart `wpa2Personal` heeft; en macOS kent in dit profieltype geen tegenhanger van `connectToPreferredNetwork` — de voorkeursvolgorde volgt daar uit de netwerkvolgorde van het apparaat zelf. Dit is een gewone device configuration en geen custom .mobileconfig, dus de PSK staat als leesbaar veld in het template en niet verstopt in een base64-payload.

## Eigenschappen — 7

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `ssid` | <SSID-CORPORATE> |
| `networkName` | <SSID-CORPORATE> |
| `wiFiSecurityType` | wpaPersonal |
| `preSharedKey` | <PSK-CORPORATE> |
| `connectAutomatically` | true |
| `connectWhenNetworkNameIsHidden` | false |
| `proxySettings` | none |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
