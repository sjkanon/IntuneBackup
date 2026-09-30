<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Wifi_Guest.md) · [English](Baseline_WIN_D_Wifi_Guest.en.md) · **Français**

# CXNM - Standard - WIN - D - Wifi Guest

Déploie le réseau invité comme second profil sur chaque portable Windows, afin qu'un appareil reste en ligne quand le réseau d'entreprise est inaccessible et revienne automatiquement au réseau d'entreprise dès qu'il est rétabli.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | Baseline propre — profil Wi-Fi Intune (windowsWifiConfiguration), WPA2-Personal. ISO/IEC 27001:2022 A.8.20 et A.8.21, NIS2 art. 21(2)(c) et (e). |
| Fichier | [`Baseline_WIN_D_Wifi_Guest.json`](Baseline_WIN_D_Wifi_Guest.json) |

> Le SSID et la PSK sont définis sur `<SSID-GUEST>` et `<PSK-GUEST>`. Renseignez-les avant d'affecter. Le mot de passe figure dans ce template et donc dans ce dépôt. Il n'existe pas de jeton CIPP pour une PSK comme %OrganizationId% pour l'id du tenant, et laisser un placeholder ne fonctionne pas ici : Graph ne renvoie jamais de PSK — une sauvegarde du tenant ne contient que `preSharedKeyIsSet: true`. Si vous la renseignez dans le tenant plutôt qu'ici, la synchronisation CIPP suivante réécrit le placeholder par-dessus et chaque appareil perd son Wi-Fi. Renseignez-la donc ici, et uniquement tant que ce dépôt est privé ; s'il est un jour partagé, changez la PSK. Que la PSK reste de toute façon un secret partagé est déjà expliqué dans les notes de CXNM - Standard - WIN - D - Wireless and Peripherals : un administrateur local la lit sans difficulté avec `netsh wlan show profile key=clear`, et la mesure qui résout réellement ce problème est le 802.1X avec certificats. `connectToPreferredNetwork` est à true ici et à false dans Wifi Corporate : c'est le réseau de repli, donc dès que le réseau de l'entreprise est de nouveau disponible, Windows doit y revenir. Ne le déployez qu'à côté de Wifi Corporate, sinon tout le parc se retrouve par défaut sur le réseau invité. Si le réseau invité est soumis à une limite de consommation, réglez `meteredConnectionLimit` sur `fixed` — il est actuellement sur `unrestricted`, ce qui fait que Windows y télécharge aussi les mises à jour.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Sécurité des réseaux<br>A.8.21 Sécurité des services réseau |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| NIST CSF 2.0 | PR.IR-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 9

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
