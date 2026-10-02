<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Bluetooth_Allowed_Services.md) · [English](Baseline_WIN_D_Bluetooth_Allowed_Services.en.md) · **Français**

# CXNM - Standard - WIN - D - Bluetooth Allowed Services

N'autorise en Bluetooth que les souris, claviers, casques, téléphones via Phone Link et passkeys, et bloque le transfert de fichiers, le partage de connexion et les connexions série.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Bluetooth CSP ServicesAllowedList (Microsoft Learn, ServicesAllowedList usage guide) et les Bluetooth SIG Assigned Numbers — id et forme vérifiés par rapport à DCv2/Settings dans pl4nty/intune-change-tracking |
| Fichier | [`Baseline_WIN_D_Bluetooth_Allowed_Services.json`](Baseline_WIN_D_Bluetooth_Allowed_Services.json) |

> Windows ne peut pas filtrer le Bluetooth par type d'appareil (iPhone, Android, marque), seulement par service : chaque UUID de la liste est un profil Bluetooth autorisé, et tout ce qui n'y figure pas cesse de fonctionner. La liste est regroupée en blocs, pour pouvoir retirer ou ajouter un bloc par tenant. Base BLE (1800 Generic Access, 1801 Generic Attribute, 180A Device Information, 180F Battery, 1813 Scan Parameters, 1200 PnP Information) — à ne jamais retirer ; sans ces six, les souris et claviers récents ne fonctionnent plus. Saisie : 1124 HID et 1812 HID over GATT (souris, clavier, stylet, manette). Audio classique : 1108/1112 Headset, 111E/111F Handsfree, 110A/110B/110D A2DP, 110C/110E/110F AVRCP. LE Audio pour les casques et aides auditives récents : 1843–1855 (volume, micro, flux audio, appels, médias, Hearing Access). Téléphone via Phone Link : 111E/111F Handsfree (appels), 112E/112F/1130 PBAP (contacts), 1132/1133/1134 MAP (messages), et Apple ANCS 7905F431-… et AMS 89D3502B-… (notifications et médias d'un iPhone). Passkeys : FFF9 (téléphone comme passkey via code QR) et FFFD (clé de sécurité FIDO en Bluetooth). Volontairement absents de la liste, donc bloqués : 1105 OBEX Object Push et 1106 OBEX File Transfer (envoi de fichiers), 1115/1116/1117 PAN (partage de connexion), 1101 Serial Port et 1103 Dial-up Networking. Pour autoriser le transfert de fichiers, ajoutez 1105 et 1106 dans une copie propre au tenant ; pour exclure les téléphones, retirez le bloc téléphone (gardez Handsfree pour les casques). Windows lit la liste au démarrage de la pile Bluetooth : après attribution ou modification, elle ne s'applique qu'après un redémarrage. Microsoft ne documente pas si la liste touche aussi les annonces BLE que le PC ne fait que recevoir (comme pour une passkey via code QR) ; FFF9 y figure donc par précaution. À côté de CXNM - Standard - WIN - D - Wireless and Peripherals, sans chevauchement : celle-ci ne coupe que la visibilité, celle-là décide quels services fonctionnent.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.DS-01<br>PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_bluetooth_servicesallowedlist` | {00001800-0000-1000-8000-00805F9B34FB}, {00001801-0000-1000-8000-00805F9B34FB}, {0000180A-0000-1000-8000-00805F9B34FB}, {0000180F-0000-1000-8000-00805F9B34FB}, {00001813-0000-1000-8000-00805F9B34FB}, {00001200-0000-1000-8000-00805F9B34FB}, {00001124-0000-1000-8000-00805F9B34FB}, {00001812-0000-1000-8000-00805F9B34FB}, {00001108-0000-1000-8000-00805F9B34FB}, {00001112-0000-1000-8000-00805F9B34FB}, {0000111E-0000-1000-8000-00805F9B34FB}, {0000111F-0000-1000-8000-00805F9B34FB}, {0000110A-0000-1000-8000-00805F9B34FB}, {0000110B-0000-1000-8000-00805F9B34FB}, {0000110D-0000-1000-8000-00805F9B34FB}, {0000110C-0000-1000-8000-00805F9B34FB}, {0000110E-0000-1000-8000-00805F9B34FB}, {0000110F-0000-1000-8000-00805F9B34FB}, {00001843-0000-1000-8000-00805F9B34FB}, {00001844-0000-1000-8000-00805F9B34FB}, {00001845-0000-1000-8000-00805F9B34FB}, {00001846-0000-1000-8000-00805F9B34FB}, {0000184B-0000-1000-8000-00805F9B34FB}, {0000184C-0000-1000-8000-00805F9B34FB}, {00001848-0000-1000-8000-00805F9B34FB}, {00001849-0000-1000-8000-00805F9B34FB}, {0000184D-0000-1000-8000-00805F9B34FB}, {0000184E-0000-1000-8000-00805F9B34FB}, {0000184F-0000-1000-8000-00805F9B34FB}, {00001850-0000-1000-8000-00805F9B34FB}, {00001853-0000-1000-8000-00805F9B34FB}, {00001854-0000-1000-8000-00805F9B34FB}, {00001855-0000-1000-8000-00805F9B34FB}, {0000112E-0000-1000-8000-00805F9B34FB}, {0000112F-0000-1000-8000-00805F9B34FB}, {00001130-0000-1000-8000-00805F9B34FB}, {00001132-0000-1000-8000-00805F9B34FB}, {00001133-0000-1000-8000-00805F9B34FB}, {00001134-0000-1000-8000-00805F9B34FB}, {0000FFF9-0000-1000-8000-00805F9B34FB}, {0000FFFD-0000-1000-8000-00805F9B34FB}, {7905F431-B5CE-4E99-A40F-4B1E122D00D0}, {89D3502B-0F36-433A-8EF4-C502AD55F8DC} |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
