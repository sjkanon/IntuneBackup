<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Component_Hardening.md) · [English](Baseline_WIN_D_Windows_Component_Hardening.en.md) · **Français**

# CXNM - Standard - WIN - D - Windows Component Hardening

Comble sept petites lacunes CIS dans des composants Windows : pas de connexion automatique, pas de serveur NTP, pas de poursuite sur un autre appareil, pas d'énumération des utilisateurs locaux, mode protégé pour le protocole shell, pas d'accès WinRT depuis du contenu hébergé et pas d'offre de mise à niveau via le Store.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS v4 Windows 11 L1 (profils CISv4 d'IntuneAdmin) — structures d'instance reprises d'IntuneAdmin, valeurs vérifiées par rapport aux définitions du settings catalog ; 'Enumerate local users' s'écarte volontairement de la valeur d'IntuneAdmin |
| Fichier | [`Baseline_WIN_D_Windows_Component_Hardening.json`](Baseline_WIN_D_Windows_Component_Hardening.json) |

> **Écart volontaire par rapport à la source :** IntuneAdmin définit 'Enumerate local users on domain-joined computers' sur `_1` (Enabled), CIS L1 18.9.28.x exige Disabled ; ici `_0`. Trois de ces profils (serveur NTP, offre de mise à niveau du Store, WinRT hosted content) relèvent peut-être du niveau L2 dans le benchmark CIS lui-même ; ils sont inclus parce qu'IntuneAdmin les fournit en L1 et qu'ils n'affectent aucune fonctionnalité du poste de travail. Chevauchement vérifié : `hideexclusionsfromlocaladmins` se trouve dans Defender Additional Configuration (id différent), le masquage des utilisateurs connectés dans Logon Hardening (id différent). Le masquage des exclusions Defender pour les utilisateurs standard (CIS) ne figure volontairement pas ici : OpenIntuneBaseline v4.0 a supprimé ce paramètre parce que 'Hide Exclusions From Local Admins' dans CXNM - Standard - WIN - D - Defender Additional Configuration le couvre déjà.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_autoadminlogon` | 0 |
| `device_vendor_msft_policy_config_admx_w32time_w32time_policy_enable_ntpserver` | 0 |
| `device_vendor_msft_policy_config_admx_grouppolicy_enablecdp` | 0 |
| `device_vendor_msft_policy_config_windowslogon_enumeratelocalusersondomainjoinedcomputers` | 0 |
| `device_vendor_msft_policy_config_admx_windowsexplorer_shellprotocolprotectedmodetitle_2` | 0 |
| `device_vendor_msft_policy_config_admx_appxruntime_appxruntimeblockhostedappaccesswinrt` | 1 |
| `device_vendor_msft_policy_config_admx_windowsstore_disableosupgrade_2` | 1 |
| `device_vendor_msft_policy_config_admx_grouppolicy_disablebackgroundpolicy` | 0 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_temp_delete` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
