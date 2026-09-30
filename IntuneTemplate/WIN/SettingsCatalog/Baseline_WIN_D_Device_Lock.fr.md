<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Device_Lock.md) · [English](Baseline_WIN_D_Device_Lock.en.md) · **Français**

# CXNM - Standard - WIN - D - Device Lock

Détermine quand l'écran se verrouille et quelles exigences s'appliquent au code d'accès, ainsi que le comportement à la fermeture du capot et pour l'alimentation.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - U - Power and Device Lock |
| Fichier | [`Baseline_WIN_D_Device_Lock.json`](Baseline_WIN_D_Device_Lock.json) |

> OIB nomme cette policy U parce qu'elle l'affecte aux utilisateurs ; les 12 paramètres sont tous de portée appareil, c'est donc D ici (voir check-scope.js). Les trois paramètres de mot de passe propres sont conservés. Depuis OIB v4.0, elle contient aussi le verrouillage après 15 minutes d'inactivité (interactivelogon_machineinactivitylimit_v2 = 900) : le remplaçant de la policy de conformité Password supprimée, et un paramètre que la baseline définissait auparavant dans Local Security Policies. La mise en veille sur secteur passe en même temps à 30 minutes, afin que verrouillage et mise en veille ne tombent pas au même moment.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.7.7 Bureau propre et écran vide<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 16

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_power_requirepasswordwhencomputerwakesonbattery` | 1 |
| `device_vendor_msft_policy_config_power_requirepasswordwhencomputerwakespluggedin` | 1 |
| `device_vendor_msft_policy_config_power_standbytimeoutonbattery` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_standbytimeoutonbattery_enterdcstandbytimeout` | 600 |
| `device_vendor_msft_policy_config_power_standbytimeoutpluggedin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_standbytimeoutpluggedin_enteracstandbytimeout` | 1800 |
| `device_vendor_msft_policy_config_power_displayofftimeoutonbattery` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_displayofftimeoutonbattery_entervideodcpowerdowntimeout` | 300 |
| `device_vendor_msft_policy_config_power_displayofftimeoutpluggedin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_power_displayofftimeoutpluggedin_entervideoacpowerdowntimeout` | 600 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_machineinactivitylimit_v2` | 900 |
| `device_vendor_msft_policy_config_power_unattendedsleeptimeoutonbattery` | 600 |
| `device_vendor_msft_policy_config_power_unattendedsleeptimeoutpluggedin` | 1800 |
| `device_vendor_msft_policy_config_devicelock_devicepasswordenabled` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_devicelock_devicepasswordhistory` | 24 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_devicelock_mindevicepasswordlength` | 14 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
