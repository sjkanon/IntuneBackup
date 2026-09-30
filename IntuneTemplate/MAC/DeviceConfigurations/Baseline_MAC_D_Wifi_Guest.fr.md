<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Wifi_Guest.md) · [English](Baseline_MAC_D_Wifi_Guest.en.md) · **Français**

# CXNM - Standard - MAC - D - Wifi Guest

Déploie le réseau invité comme second profil sur chaque Mac, afin qu'un appareil reste en ligne lorsque le réseau de l'entreprise n'est pas joignable.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | Baseline propre — profil Wi-Fi Intune (macOSWiFiConfiguration), WPA/WPA2-Personal. ISO/IEC 27001:2022 A.8.20 et A.8.21, NIS2 art. 21(2)(c) et (e). |
| Fichier | [`Baseline_MAC_D_Wifi_Guest.json`](Baseline_MAC_D_Wifi_Guest.json) |

> Le SSID et la PSK sont définis sur `<SSID-GUEST>` et `<PSK-GUEST>`. Renseignez-les avant d'affecter. Le mot de passe se retrouve dans ce template et donc dans ce repo. Il n'existe pas de token CIPP pour une PSK comme %OrganizationId% l'est pour l'ID du tenant, et laisser un placeholder ne fonctionne pas ici : Graph ne renvoie jamais une PSK — une sauvegarde du tenant ne contient que `preSharedKeyIsSet: true`. Si vous la renseignez donc dans le tenant plutôt qu'ici, la synchronisation CIPP suivante réécrit le placeholder par-dessus et chaque appareil perd son Wi-Fi. Renseignez-la ici, et uniquement tant que ce repo est privé ; s'il est un jour partagé, changez la PSK. Que la PSK reste de toute façon un secret partagé est déjà expliqué dans les notes de CXNM - Standard - WIN - D - Wireless and Peripherals : un administrateur local la lit simplement avec `netsh wlan show profile key=clear`, et la mesure qui résout vraiment cela est le 802.1X avec certificats. Ce profil est la solution de repli, pas le premier choix : ne le déployez qu'à côté de Wifi Corporate, sinon toute la flotte se retrouve par défaut sur le réseau invité. macOS détermine lui-même l'ordre de préférence en fonction de l'ordre des réseaux de l'appareil ; si vous voulez le figer, cela demande une intervention manuelle ou un script, pas ce profil.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Sécurité des réseaux<br>A.8.21 Sécurité des services réseau |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| NIST CSF 2.0 | PR.IR-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 7

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `ssid` | <SSID-GUEST> |
| `networkName` | <SSID-GUEST> |
| `wiFiSecurityType` | wpaPersonal |
| `preSharedKey` | <PSK-GUEST> |
| `connectAutomatically` | true |
| `connectWhenNetworkNameIsHidden` | false |
| `proxySettings` | none |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
