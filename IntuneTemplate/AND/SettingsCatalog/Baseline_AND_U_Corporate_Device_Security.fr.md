<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Corporate_Device_Security.md) · [English](Baseline_AND_U_Corporate_Device_Security.en.md) · **Français**

# CXNM - Standard - AND - U - Corporate Device Security

Durcit les appareils Android fully managed et corporate-owned : code à six chiffres (numérique complexe) qui efface l'appareil après dix tentatives, saisie du code une fois par jour au lieu de la seule biométrie, écran allumé quinze minutes au plus, Play Protect et mises à jour automatiques des applications activés, pas de transfert de fichiers via USB ni stockage externe, pas de 2G, pas d'heure manuelle, pas de Private Space et pas de partage du professionnel vers le personnel.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - SC - DR - DEV - Device-Password, System-Security, Applications, Connectivity, General-Settings et Data-Sharing-Controls (Fully-Managed et Corp-Work-Profile) - v1.5 ; accès USB limité au transfert de fichiers au lieu de toutes les données, sans expiration du mot de passe, mise en veille de l'écran à 15 minutes |
| Fichier | [`Baseline_AND_U_Corporate_Device_Security.json`](Baseline_AND_U_Corporate_Device_Security.json) |

> Volontairement `usbdataaccess_disallowusbfiletransfer` et non `disallowusbdatatransfer` (UniFy) : ce dernier bloque toutes les données USB, y compris les casques filaires, les stations d'accueil et Android Auto. Non repris de l'ensemble corporate d'UniFy : `airplanemodeblocked` (mode avion impossible), `minimumwifisecuritylevel_personalnetworksecurity` (les réseaux ouverts et invités, comme dans les hôtels et les trains, ne fonctionnent plus), `cellularblockwifitethering`, `wifidirectsettings_disallowed`, `ultrawidebandblocked`, `vpnconfigblocked`, `mobilenetworksconfigblocked`, `networkresetblocked` et `cellbroadcastsconfigblocked` (empêchent le télétravail ou les déplacements, ou n'apportent aucun gain de sécurité), `accountsblockmodification` et `certificatecredentialconfigurationdisabled` (exigent d'abord un provisionnement automatique des comptes et un profil SCEP/PKCS, UniFy W-5/W-6), `locationmode_enforced` (la localisation toujours active est une décision de protection de la vie privée), `securitycommoncriteriamodeenabled` (Samsung uniquement, W-25), `passwordexpirationdays` (NIST SP 800-63B), `bluetoothblockcontactsharing` (plus de nom de l'appelant dans la voiture) et `passwordblockkeyguard_true` (il s'agit de *Disable lock screen* — une erreur dans UniFy FM). Pas non plus : `appsallowinstallfromunknownsources_false` et `securitydevelopersettingsenabled_false` — pour ces paramètres Android, `_false` signifie « non configuré », et sur les appareils device owner les deux sont déjà fermés par défaut. La mise en veille de l'écran (`screentimeout`, 900 secondes) limite la durée pendant laquelle l'écran reste allumé ; le délai de verrouillage lui-même est vérifié par Compliance Corporate Password. Blocage de la 2G : dans les régions couvertes uniquement en 2G, il n'y a plus de réception mobile ; les appels d'urgence continuent de fonctionner. Les mises à jour d'applications sur `always` passent aussi par les données mobiles ; qui veut d'abord tester les applications métier choisit `wifionly` ou sa propre politique de mise à jour (UniFy W-9).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.7.7 Bureau propre et écran vide<br>A.7.10 Supports de stockage<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.5 Authentification sécurisée<br>A.8.7 Protection contre les programmes malveillants<br>A.8.8 Gestion des vulnérabilités techniques<br>A.8.12 Prévention de la fuite de données<br>A.8.17 Synchronisation des horloges<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.3 Configure Automatic Session Locking on Enterprise Assets<br>4.10 Enforce Automatic Device Lockout on Portable End-User Devices<br>4.12 Separate Enterprise Workspaces on Mobile End-User Devices<br>7.4 Perform Automated Application Patch Management<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.AA-03<br>PR.DS-01<br>PR.PS-01<br>PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 14

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.android.devicerestrictionpolicy.passwordrequiredtype` | numericcomplex |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.android.devicerestrictionpolicy.passwordminimumlength` | 6 |
| `com.android.devicerestrictionpolicy.passwordsigninfailurecountbeforefactoryreset` | 10 |
| `com.android.devicerestrictionpolicy.passwordpreviouspasswordcounttoblock` | 5 |
| `com.android.devicerestrictionpolicy.passwordrequireunlock` | requiredpasswordunlockdailyoption |
| `com.android.devicerestrictionpolicy.screentimeout` | 900 |
| `com.android.devicerestrictionpolicy.securityrequireverifyapps` | true |
| `com.android.devicerestrictionpolicy.appsautoupdatepolicy` | always |
| `com.android.devicerestrictionpolicy.usbdataaccess` | disallowusbfiletransfer |
| `com.android.devicerestrictionpolicy.storageblockexternalmedia` | true |
| `com.android.devicerestrictionpolicy.cellulartwogblocked` | true |
| `com.android.devicerestrictionpolicy.datetimeconfigurationblocked` | true |
| `com.android.devicerestrictionpolicy.privatespacepolicy` | disallowed |
| `com.android.devicerestrictionpolicy.crossprofilepoliciesallowdatasharing` | datasharingfromworktopersonalblocked |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
