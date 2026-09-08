<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Wifi Corporate

Rolt het bedrijfsnetwerk als wifi-profiel uit op elke Windows-laptop, zodat een apparaat na inschrijving vanzelf verbinding heeft en een gebruiker het netwerkwachtwoord nooit hoeft te kennen of in te typen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | Eigen baseline — Intune wifi-profiel (windowsWifiConfiguration), WPA2-Personal. ISO/IEC 27001:2022 A.8.20 en A.8.21, NIS2 art. 21(2)(e). |
| Bestand | [`Baseline_WIN_D_Wifi_Corporate.json`](Baseline_WIN_D_Wifi_Corporate.json) |

> SSID en PSK staan op `<SSID-CORPORATE>` en `<PSK-CORPORATE>`. Vul ze in vóór je toewijst; met de placeholder erin maakt het profiel op geen enkel apparaat verbinding. Het wachtwoord komt in dit template te staan en daarmee in deze repo. Er bestaat geen CIPP-token voor een PSK zoals %OrganizationId% dat voor de tenant-id is, en een placeholder laten staan werkt hier niet: Graph geeft een PSK nooit terug — bij een tenant-backup komt alleen `preSharedKeyIsSet: true` mee. Vul je hem dus in de tenant in in plaats van hier, dan zet de eerstvolgende CIPP-sync de placeholder er weer overheen en is elk apparaat zijn wifi kwijt. Vul hem hier in, en alleen zolang deze repo privé is; wordt hij ooit gedeeld, roteer dan de PSK. Dat de PSK sowieso een gedeeld geheim blijft staat al in de toelichting bij [Baseline] - WIN - D - Wireless and Peripherals: een lokale beheerder leest hem met `netsh wlan show profile key=clear` gewoon uit, en de maatregel die dat wél oplost is 802.1X met certificaten — wat ISMP19 ook voorschrijft. `connectToPreferredNetwork` staat hier bewust op false en bij Wifi Guest op true: dit ís het voorkeursnetwerk, dus Windows hoeft hier niet weg te zoeken. Let op de samenloop met [Baseline] - WIN - D - Wireless Shared Devices: die policy staat alleen nog door Intune uitgerolde netwerken toe en heeft dit profiel dus nodig om een gedeeld apparaat niet offline te zetten. Dit is de policy die daar als voorwaarde bij hoort.

## Eigenschappen — 9

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `ssid` | <SSID-CORPORATE> |
| `networkName` | <SSID-CORPORATE> |
| `wifiSecurityType` | wpa2Personal |
| `preSharedKey` | <PSK-CORPORATE> |
| `connectAutomatically` | true |
| `connectToPreferredNetwork` | false |
| `connectWhenNetworkNameIsHidden` | false |
| `meteredConnectionLimit` | unrestricted |
| `proxySetting` | none |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
