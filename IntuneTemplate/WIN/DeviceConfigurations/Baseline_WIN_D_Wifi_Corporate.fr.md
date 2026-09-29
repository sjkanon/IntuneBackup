<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Wifi_Corporate.md) · [English](Baseline_WIN_D_Wifi_Corporate.en.md) · **Français**

# [Baseline] - WIN - D - Wifi Corporate

Déploie le réseau d'entreprise sous forme de profil Wi-Fi sur chaque portable Windows, afin qu'un appareil se connecte automatiquement après l'inscription et qu'un utilisateur n'ait jamais à connaître ni saisir le mot de passe du réseau.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| checkId | aucun — le moteur de la plateforme n'a pas de correspondance pour ce type de policy |
| Source | Baseline propre — profil Wi-Fi Intune (windowsWifiConfiguration), WPA2-Personal. ISO/IEC 27001:2022 A.8.20 et A.8.21, NIS2 art. 21(2)(e). |
| Fichier | [`Baseline_WIN_D_Wifi_Corporate.json`](Baseline_WIN_D_Wifi_Corporate.json) |

> Le SSID et la PSK sont définis sur `<SSID-CORPORATE>` et `<PSK-CORPORATE>`. Renseignez-les avant d'affecter ; avec le placeholder, le profil ne se connecte sur aucun appareil. Le mot de passe figure dans ce template et donc dans ce dépôt. Il n'existe pas de jeton CIPP pour une PSK comme %OrganizationId% pour l'id du tenant, et laisser un placeholder ne fonctionne pas ici : Graph ne renvoie jamais de PSK — une sauvegarde du tenant ne contient que `preSharedKeyIsSet: true`. Si vous la renseignez dans le tenant plutôt qu'ici, la synchronisation CIPP suivante réécrit le placeholder par-dessus et chaque appareil perd son Wi-Fi. Renseignez-la donc ici, et uniquement tant que ce dépôt est privé ; s'il est un jour partagé, changez la PSK. Que la PSK reste de toute façon un secret partagé est déjà expliqué dans les notes de [Baseline] - WIN - D - Wireless and Peripherals : un administrateur local la lit sans difficulté avec `netsh wlan show profile key=clear`, et la mesure qui résout réellement ce problème est le 802.1X avec certificats. `connectToPreferredNetwork` est volontairement à false ici et à true dans Wifi Guest : c'est le réseau préféré, Windows n'a donc pas à chercher ailleurs. Attention à l'interaction avec [Baseline] - WIN - D - Wireless Shared Devices : cette policy n'autorise plus que les réseaux déployés par Intune et a donc besoin de ce profil pour ne pas mettre un appareil partagé hors ligne. C'est la policy qui en constitue le prérequis.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.20 Sécurité des réseaux<br>A.8.21 Sécurité des services réseau |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| NIST CSF 2.0 | PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 9

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
