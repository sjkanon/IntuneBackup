<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Wifi_Corporate.md) · [English](Baseline_MAC_D_Wifi_Corporate.en.md) · **Français**

# [Baseline] - MAC - D - Wifi Corporate

Déploie le réseau de l'entreprise sous forme de profil Wi-Fi sur chaque Mac, afin qu'un appareil se connecte automatiquement après l'inscription et qu'un utilisateur n'ait jamais besoin de connaître ou de saisir le mot de passe du réseau.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | Baseline propre — profil Wi-Fi Intune (macOSWiFiConfiguration), WPA/WPA2-Personal. ISO/IEC 27001:2022 A.8.20 et A.8.21, NIS2 art. 21(2)(e). |
| Fichier | [`Baseline_MAC_D_Wifi_Corporate.json`](Baseline_MAC_D_Wifi_Corporate.json) |

> Le SSID et la PSK sont définis sur `<SSID-CORPORATE>` et `<PSK-CORPORATE>`. Renseignez-les avant d'affecter ; avec le placeholder, le profil ne se connecte sur aucun appareil. Le mot de passe se retrouve dans ce template et donc dans ce repo. Il n'existe pas de token CIPP pour une PSK comme %OrganizationId% l'est pour l'ID du tenant, et laisser un placeholder ne fonctionne pas ici : Graph ne renvoie jamais une PSK — une sauvegarde du tenant ne contient que `preSharedKeyIsSet: true`. Si vous la renseignez donc dans le tenant plutôt qu'ici, la synchronisation CIPP suivante réécrit le placeholder par-dessus et chaque appareil perd son Wi-Fi. Renseignez-la ici, et uniquement tant que ce repo est privé ; s'il est un jour partagé, changez la PSK. Que la PSK reste de toute façon un secret partagé est déjà expliqué dans les notes de [Baseline] - WIN - D - Wireless and Peripherals : un administrateur local la lit simplement avec `netsh wlan show profile key=clear`, et la mesure qui résout vraiment cela est le 802.1X avec certificats. Deux particularités de macOS : la payload Wi-Fi d'Apple ne connaît qu'une seule variante personal, donc `wpaPersonal` couvre WPA, WPA2 et WPA3 là où Windows a un `wpa2Personal` séparé ; et macOS n'a pas d'équivalent de `connectToPreferredNetwork` dans ce type de profil — l'ordre de préférence y découle de l'ordre des réseaux de l'appareil lui-même. Il s'agit d'une device configuration ordinaire et non d'un .mobileconfig personnalisé, la PSK est donc un champ lisible dans le template et non cachée dans une payload base64.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.20 Sécurité des réseaux<br>A.8.21 Sécurité des services réseau |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| NIST CSF 2.0 | PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 7

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `ssid` | <SSID-CORPORATE> |
| `networkName` | <SSID-CORPORATE> |
| `wiFiSecurityType` | wpaPersonal |
| `preSharedKey` | <PSK-CORPORATE> |
| `connectAutomatically` | true |
| `connectWhenNetworkNameIsHidden` | false |
| `proxySettings` | none |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
