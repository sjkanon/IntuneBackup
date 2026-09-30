<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Removable_Storage.md) · [English](Baseline_WIN_D_Removable_Storage.en.md) · **Français**

# [Baseline] - WIN - D - Removable Storage

Bloque l'écriture sur le stockage amovible : clés USB et disques externes, ainsi que téléphones et appareils photo qui se présentent comme périphérique WPD. La lecture reste possible.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | baseline propre — comparaison avec IntuneAdmin/IntuneBaselines, août 2026 |
| Fichier | [`Baseline_WIN_D_Removable_Storage.json`](Baseline_WIN_D_Removable_Storage.json) |

> OIB ne couvre pas les supports amovibles. Seule l'écriture est bloquée, pas la lecture : les données peuvent entrer, pas sortir. La policy BitLocker laisse volontairement removabledrivesrequireencryption désactivé — avec un blocage en écriture, une exigence de chiffrement n'apporte rien.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.10 Supports de stockage<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_storage_removablediskdenywriteaccess` | 1 |
| `device_vendor_msft_policy_config_admx_removablestorage_wpddevices_denywrite_access_2` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
