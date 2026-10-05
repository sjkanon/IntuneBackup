<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Google_Chrome_Updates.md) · [English](Baseline_WIN_D_Google_Chrome_Updates.en.md) · **Français**

# [Baseline] - WIN - D - Google Chrome Updates

Garantit qu'une mise à jour de Chrome prend effet sous trois jours : notification de redémarrage obligatoire, redémarrage forcé en dehors des heures de travail, et plus rapide lorsque la version est très en retard.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | Stratégie Google Chrome dans le catalogue de paramètres (chromeintunev1, chromeintunev141) — valeurs choisies d'après l'équivalent Edge de cette baseline ; ids, options et plages vérifiés par rapport à DCv2/Settings dans pl4nty/intune-change-tracking |
| Fichier | [`Baseline_WIN_D_Google_Chrome_Updates.json`](Baseline_WIN_D_Google_Chrome_Updates.json) |

> Google Update lui-même (stratégie de mise à jour, canal) n'est pas dans le catalogue de paramètres : les définitions `update~policy~cat_google~cat_googleupdate` qui y figurent appartiennent au programme de mise à jour d'Edge, dont l'ADMX est un fork de Google Update qui a gardé les anciens noms de catégorie. Tant que personne ne désactive les mises à jour via Google Update, Chrome se met à jour lui-même ; cette stratégie garantit que ces mises à jour prennent effet. RelaunchFastIfOutdated se trouve dans l'espace de noms chromeintunev141, le reste dans chromeintunev1. Un appareil éteint la nuit ne redémarre que dans la fenêtre suivante.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.4 Perform Automated Application Patch Management<br>9.1 Ensure Use of Only Fully Supported Browsers and Email Clients |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_componentupdatesenabled` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotification` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotification_relaunchnotification` | 2 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotificationperiod` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchnotificationperiod_relaunchnotificationperiod` | 259200000 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchwindow` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_relaunchwindow_relaunchwindow` | {"entries":[{"duration_mins":780,"start":{"hour":17,"minute":0}}]} |
| `device_vendor_msft_policy_config_chromeintunev141~policy~googlechrome_relaunchfastifoutdated` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev141~policy~googlechrome_relaunchfastifoutdated_relaunchfastifoutdated` | 7 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
