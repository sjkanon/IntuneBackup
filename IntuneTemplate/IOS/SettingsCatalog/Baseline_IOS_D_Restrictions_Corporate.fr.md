<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Restrictions_Corporate.md) · [English](Baseline_IOS_D_Restrictions_Corporate.en.md) · **Français**

# [Baseline] - IOS - D - Restrictions Corporate

Durcissement des iPhone et iPad d'entreprise supervisés : pas de profils ni d'applications de développeur installés manuellement, pas d'applications hors de l'App Store, certificats TLS non fiables automatiquement refusés, pas d'effacement via Réglages, un écran verrouillé sans Control Center, historique des notifications, vue Aujourd'hui et Siri, et Activation Lock uniquement avec un code de contournement conservé par Intune.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | UniFy iOS/iPadOS Baseline v1.2 (CIS Apple iOS/iPadOS 26 Benchmark v1.0.0, L1) — fusion de SC - Device Restrictions, Device Security, Device Pairing, Lock Screen, Safari Browser, Web-App-Store (EU) et Apple Intelligence & Siri - Corporate ; IntuneAdmin — Disable Web Distribution App Installation EU. Valeurs corrigées là où UniFy utilise `_false` au sens de « ne pas imposer » |
| Fichier | [`Baseline_IOS_D_Restrictions_Corporate.json`](Baseline_IOS_D_Restrictions_Corporate.json) |

> Volontairement **non** inclus : allowpasswordautofill=false (UniFy Corporate) — cela désactive aussi les passkeys et les gestionnaires de mots de passe ; forceauthenticationbeforeautofill est utilisé à la place. Sauvegarde iCloud et iCloud Drive désactivés (UniFy Corporate) — une décision du client sur l'endroit où les données peuvent être stockées, pas du durcissement ; les apps gérées ne se synchronisent déjà pas vers iCloud via [Baseline] - IOS - D - Data Protection. Blocage des modifications Bluetooth, NFC, point d'accès et VPN (Connectivity Controls, L2) — casse les kits voiture, les cartes de paiement et le télétravail. Siri entièrement désactivé — seul Siri sur l'écran verrouillé est désactivé. L'appairage hôte (Finder/iTunes) est géré par le profil d'inscription (iTunesPairingMode disallow), pas par cette policy. allowopenfromunmanagedtomanaged non bloqué : sinon une photo de l'app Photos ne peut plus être partagée dans Outlook ou Teams — le même arbitrage que pour allowedInboundDataTransferSources dans App Protection. Centre de contrôle désactivé sur l'écran verrouillé signifie aussi : pas de lampe torche sans déverrouiller. Corrections par rapport à UniFy : forceautomaticdateandtime y est à false (= non imposé), ici true. Activation Lock : UniFy le bloque (false) ; ici autorisé (true), car un appareil supervisé bénéficie alors d'une protection contre le vol tandis qu'Intune conserve le code de contournement (action sur l'appareil « Désactiver le verrouillage d'activation »). Avant le déploiement, vérifiez qu'Intune affiche un code de contournement pour un appareil de test ; sans ce code, un appareil restitué avec un Apple Account personnel ne peut pas être réutilisé — choisissez alors false. Cette policy partage le groupe de premier niveau com.apple.applicationaccess avec Data Protection mais ne définit aucune clé en double ; iOS fusionne les payloads de restriction.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.19 Installation de logiciels sur des systèmes opérationnels<br>A.8.20 Sécurité des réseaux<br>A.7.7 Bureau propre et écran vide |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>2.5 Allowlist Authorized Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 22

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowuiconfigurationprofileinstallation` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowerasecontentandsettings` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowenterpriseapptrust` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowuntrustedtlsprompt` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceautomaticdateandtime` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowlockscreencontrolcenter` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowlockscreennotificationsview` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowlockscreentodayview` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowusbrestrictedmode` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowpasswordsharing` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowpasswordproximityrequests` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowproximitysetuptonewdevice` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceauthenticationbeforeautofill` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_safariforcefraudwarning` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowwebdistributionappinstallation` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmarketplaceappinstallation` | false |
| `settings_item_mdmoptions` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`settings_item_mdmoptions_mdmoptions` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`settings_item_mdmoptions_mdmoptions_activationlockallowedwhilesupervised` | true |
| `sirisettings_sirisettings` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`sirisettings_allowwhilelocked` | false |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
