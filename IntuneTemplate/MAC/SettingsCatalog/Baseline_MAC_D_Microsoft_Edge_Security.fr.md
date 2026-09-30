<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Microsoft_Edge_Security.md) · [English](Baseline_MAC_D_Microsoft_Edge_Security.en.md) · **Français**

# CXNM - Standard - MAC - D - Microsoft Edge Security

Les paramètres de sécurité d'Edge sur macOS : SmartScreen, contrôle des téléchargements et comportement des certificats.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - D - Security |
| Fichier | [`Baseline_MAC_D_Microsoft_Edge_Security.json`](Baseline_MAC_D_Microsoft_Edge_Security.json) |

> Depuis septembre 2026, cette policy définit deux paramètres qu'OpenIntuneBaseline macOS v1.0 ne contient pas : SSLErrorOverrideAllowed=false (un utilisateur ne peut plus passer outre une erreur de certificat — l'interception classique d'une connexion) et MicrosoftEdgeInsiderPromotionEnabled=false. Les deux sont identiques à CXNM - Standard - WIN - D - Microsoft Edge Security et à OIB macOS v2.0 beta. Ils ne figurent pas dans la source OIB v1.0 et sont conservés comme paramètres propres lors d'un nouvel import (carry, voir l'en-tête de import-oib.js). Attention aux sites internes avec un certificat auto-signé : ils ne peuvent plus être ouverts dans Edge tant que le certificat n'est pas correct. DownloadRestrictions reste volontairement à 1 (Block dangerous downloads). OIB v2.0 beta et la policy Windows définissent 4 (Block malicious downloads), ce qui bloque moins : 1 arrête tout téléchargement accompagné d'un avertissement SmartScreen, 4 uniquement les téléchargements que SmartScreen identifie comme malware connu.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.23 Filtrage web<br>A.8.7 Protection contre les programmes malveillants<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 9.3 Maintain and Enforce Network-Based URL Filters<br>10.1 Deploy and Maintain Anti-Malware Software<br>3.10 Encrypt Sensitive Data in Transit |
| NIST CSF 2.0 | PR.PS-01<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 31

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.managedclient.preferences_adssettingforintrusiveadssites` | 1 |
| `com.apple.managedclient.preferences_downloadrestrictions` | 1 |
| `com.apple.managedclient.preferences_importbrowsersettings` | false |
| `com.apple.managedclient.preferences_importhistory` | false |
| `com.apple.managedclient.preferences_importhomepage` | false |
| `com.apple.managedclient.preferences_importpaymentinfo` | false |
| `com.apple.managedclient.preferences_importsavedpasswords` | false |
| `com.apple.managedclient.preferences_importsearchengine` | false |
| `com.apple.managedclient.preferences_enterprisehardwareplatformapienabled` | false |
| `com.apple.managedclient.preferences_personalizationreportingenabled` | false |
| `com.apple.managedclient.preferences_browsernetworktimequeriesenabled` | true |
| `com.apple.managedclient.preferences_nativemessaginguserlevelhosts` | false |
| `com.apple.managedclient.preferences_autoimportatfirstrun` | 4 |
| `com.apple.managedclient.preferences_trackingprevention` | 2 |
| `com.apple.managedclient.preferences_clearbrowsingdataonexit` | false |
| `com.apple.managedclient.preferences_clearcachedimagesandfilesonexit` | false |
| `com.apple.managedclient.preferences_smartscreenenabled` | true |
| `com.apple.managedclient.preferences_smartscreenpuaenabled` | true |
| `com.apple.managedclient.preferences_experimentationandconfigurationservicecontrol` | 2 |
| `com.apple.managedclient.preferences_dnsinterceptionchecksenabled` | true |
| `com.apple.managedclient.preferences_autofilladdressenabled` | false |
| `com.apple.managedclient.preferences_autofillcreditcardenabled` | false |
| `com.apple.managedclient.preferences_enablemediarouter` | false |
| `com.apple.managedclient.preferences_proactiveauthenabled` | false |
| `com.apple.managedclient.preferences_hidefirstrunexperience` | true |
| `com.apple.managedclient.preferences_sslversionmin` | 2 |
| `com.apple.managedclient.preferences_preventsmartscreenpromptoverride` | true |
| `com.apple.managedclient.preferences_preventsmartscreenpromptoverrideforfiles` | true |
| `com.apple.managedclient.preferences_authschemes` | ntlm,negotiate |
| `com.apple.managedclient.preferences_sslerroroverrideallowed` | false |
| `com.apple.managedclient.preferences_microsoftedgeinsiderpromotionenabled` | false |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
