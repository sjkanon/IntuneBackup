<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Privacy_and_Telemetry.md) · [English](Baseline_WIN_D_Privacy_and_Telemetry.en.md) · **Français**

# CXNM - Standard - WIN - D - Privacy and Telemetry

Désactive l'identifiant de publicité, bloque le presse-papiers entre appareils, arrête l'envoi des activités de l'utilisateur et conserve sur l'appareil ce que l'utilisateur tape et dicte.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | CIS v4 Windows 11 L1 — paramètres repris d'IntuneAdmin, valeurs vérifiées par rapport aux définitions du settings catalog. |
| Fichier | [`Baseline_WIN_D_Privacy_and_Telemetry.json`](Baseline_WIN_D_Privacy_and_Telemetry.json) |

> Perceptible sur un point : les suggestions de texte deviennent moins personnalisées avec le temps. Complète `CXNM - Standard - WIN - D - Data Minimisation` sans entrer en conflit avec elle — elle limite ce qui est inclus dans les données de diagnostic, celle-ci désactive trois canaux distincts. Le presse-papiers entre appareils figurait aussi ici, mais OpenIntuneBaseline le définit lui-même depuis v4.0 dans CXNM - Standard - WIN - D - Windows Feature Configuration. Six canaux ajoutés, tous les six CIS L1 : la recherche n'utilise plus la localisation, la synchronisation des SMS vers le cloud est désactivée, le contenu grand public sur l'écran de connexion disparaît, les conseils en ligne ne récupèrent plus rien auprès de Microsoft, les polices ne sont plus téléchargées depuis fs.microsoft.com, et les apps ne peuvent plus partager de données entre utilisateurs du même appareil. Ce dernier est le seul avec un effet perceptible : une app qui partage volontairement des données entre utilisateurs ne fonctionne plus ainsi.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.34 Protection de la vie privée et des DCP<br>A.8.12 Prévention de la fuite de données |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_privacy_disableadvertisingid` | 1 |
| `device_vendor_msft_policy_config_privacy_uploaduseractivities` | 0 |
| `device_vendor_msft_policy_config_privacy_allowinputpersonalization` | 0 |
| `device_vendor_msft_policy_config_search_allowsearchtouselocation` | 0 |
| `device_vendor_msft_policy_config_messaging_allowmessagesync` | 0 |
| `device_vendor_msft_policy_config_experience_disableconsumeraccountstatecontent` | 1 |
| `device_vendor_msft_policy_config_settings_allowonlinetips` | 0 |
| `device_vendor_msft_policy_config_system_allowfontproviders` | 0 |
| `device_vendor_msft_policy_config_applicationmanagement_allowshareduserappdata` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
