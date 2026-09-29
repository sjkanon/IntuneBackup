<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Software_Updates.md) · [English](Baseline_MAC_D_Software_Updates.en.md) · **Français**

# [Baseline] - MAC - D - Software Updates

Comment et quand macOS télécharge et installe ses propres mises à jour.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-047-MACDSoftwareUpdates` |
| Source | baseline propre — politique logicielle déclarative (DDM) ; complétée par Software Update Enforce Latest et la désactivation des bêtas, issus d'OpenIntuneBaseline macOS v2.0 beta (SC - Updates - D - Update Configuration) et de microsoft/intune-my-macs (pol-sys-103, pol-sys-106), avec un délai propre ; CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 1.1–1.6 |
| Fichier | [`Baseline_MAC_D_Software_Updates.json`](Baseline_MAC_D_Software_Updates.json) |

> Variante déclarative (DDM) au lieu des paramètres com.apple.softwareupdate fournis par OpenIntuneBaseline v1.0. Report : 7 jours pour les mises à jour mineures, 14 pour les majeures, 21 pour les mises à jour système ; Rapid Security Responses (Background Security Improvements) activées, y compris le retour arrière par l'utilisateur (valeur par défaut d'Apple, permet d'annuler une mise à jour défectueuse sans l'IT) ; notifications activées ; les utilisateurs standard peuvent installer eux-mêmes une mise à jour de l'OS. Les trois actions automatiques sont sur AlwaysOn (`_1`) ; jusqu'en septembre 2026 elles étaient sur `_0` (Allowed), et rien n'était alors imposé.
>
> **Enforce Latest (septembre 2026).** Delay in Days 30, Install Time 12:30. Microsoft : le délai court à partir de la date de publication de la mise à jour (ou de la création de la policy) et 'only determines the target enforcement date and not the date that the update is offered to users'. 30 est volontairement supérieur à chacun des reports ci-dessus (7/14/21) : avec les 3 jours d'OIB, l'échéance tomberait avant qu'une mise à jour majeure ne devienne visible via le report de 14 jours. 30 jours est aussi la limite CIS (1.1, 1.6) et le maximum du paramètre. 12:30 parce qu'un Mac est allumé en journée ; la nuit il est en veille et n'installe qu'à l'ouverture. Enforce Latest impose la version la plus récente pour ce modèle, **y compris une nouvelle version majeure** : macOS 27 devient visible 14 jours après sa sortie et est imposé après 30 jours. Si un client veut valider lui-même les versions majeures, retirez ce groupe et utilisez une policy avec une version cible. Microsoft Learn : 'When an update enforcement is assigned, the device ignores software update settings, including automatic update actions' — tant qu'une échéance est ouverte, c'est elle qui détermine le comportement ; les actions automatiques s'appliquent en dehors de cela.
>
> **Beta** (softwareupdate_beta ProgramEnrollment AlwaysOff) : pas de builds AppleSeed/bêta sur les Mac de l'entreprise ; macOS 15.4+, supervisé.
>
> **Mises à jour d'apps et données de configuration** via deux clés de la payload classique com.apple.SoftwareUpdate (AutomaticallyInstallAppUpdates, ConfigDataInstall), car la déclaration DDM n'a pas d'équivalent pour elles — mSCP (branche tahoe) relie lui aussi ces deux règles CIS uniquement aux clés de profil. Les deux sont déjà activées par défaut dans macOS ; la policy empêche désormais de les désactiver. Les autres clés de cette payload ne sont volontairement pas définies, car DDM les couvre.
>
> Point ouvert : le schéma d'Apple ne précise pas si SystemPeriodInDays (21) retarde aussi XProtect et les données de configuration. Si c'est le cas, réduisez-le.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management<br>7.4 Perform Automated Application Patch Management |
| NIST CSF 2.0 | PR.PS-02<br>ID.RA-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 23

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `softwareupdate_softwareupdate` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_allowstandarduserosupdates` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_download` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installosupdates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_automaticactions_installsecurityupdate` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enable` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_rapidsecurityresponse_enablerollback` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_majorperiodindays` | 14 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_minorperiodindays` | 7 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_deferrals_systemperiodindays` | 21 |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_notifications` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_beta` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`softwareupdate_beta_programenrollment` | 2 |
| `ddm-latestsoftwareupdate_ddm-latestsoftwareupdate` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_enforcelatestsoftwareupdateversion` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_delayindays` | 30 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ddm-latestsoftwareupdate_installtime` | 12:30 |
| `com.apple.softwareupdate_com.apple.softwareupdate` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.softwareupdate_automaticallyinstallappupdates` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.softwareupdate_configdatainstall` | true |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
