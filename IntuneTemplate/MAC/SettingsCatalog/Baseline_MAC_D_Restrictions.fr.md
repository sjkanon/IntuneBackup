<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Restrictions.md) · [English](Baseline_MAC_D_Restrictions.en.md) · **Français**

# CXNM - Standard - MAC - D - Restrictions

Restreint les fonctionnalités macOS par lesquelles les données de l'entreprise peuvent quitter l'appareil.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline macOS v1.0 — Device Security - D - Restrictions |
| Fichier | [`Baseline_MAC_D_Restrictions.json`](Baseline_MAC_D_Restrictions.json) |

> Désactive Siri avec allowAssistant. Depuis macOS 26.4, Apple marque cette clé comme dépréciée, au profit de la configuration déclarative com.apple.configuration.siri.settings (dans Intune : sirisettings_sirisettings avec sirisettings_enabled). Elle est conservée pour l'instant pour la même raison que dans CXNM - Standard - MAC - D - Apple Intelligence Restricted : cette configuration DDM n'existe qu'à partir de macOS 26.4 et uniquement sur des Mac supervisés, alors que ce payload fonctionne aussi sur macOS 14 et 15 et sur un Mac que l'utilisateur a inscrit lui-même. CXNM - Standard - IOS - D - Restrictions Corporate utilise déjà sirisettings (allowwhilelocked), car sur iOS l'ancienne restriction s'appliquait différemment. Basculer dès que le parc est en 26.4 ou plus et inscrit via ADE.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.14 Transfert des informations<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.DS-02<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 39

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.systempreferences_com.apple.systempreferences` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempreferences_disabledpreferencepanes` | com.apple.AirDrop-Handoff-Settings.extension, com.apple.Family-Settings.extension, com.apple.Game-Center-Settings.extension, com.apple.Siri-Settings.extension, com.apple.Startup-Disk-Settings.extension, com.apple.Time-Machine-Settings.extension, com.apple.WalletSettingsExtension, com.apple.systempreferences.AppleIDSettings |
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowaccountmodification` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowactivitycontinuation` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowaddinggamecenterfriends` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowairplayincomingrequests` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowairdrop` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowapplepersonalizedadvertising` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowassistant` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowautounlock` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowbluetoothsharingmodification` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudaddressbook` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudbookmarks` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudcalendar` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowclouddesktopanddocuments` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowclouddocumentsync` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudfreeform` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudkeychainsync` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudmail` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudnotes` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudphotolibrary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudprivaterelay` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcloudreminders` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowdevicenamemodification` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowerasecontentandsettings` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowfilesharingmodification` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowfindmydevice` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowfindmyfriends` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowgamecenter` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowinternetsharingmodification` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowitunesfilesharing` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowlocalusercreation` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmultiplayergaming` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowpasswordproximityrequests` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowpasswordsharing` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowprintersharingmodification` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowstartupdiskmodification` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_safariallowautofill` | false |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
