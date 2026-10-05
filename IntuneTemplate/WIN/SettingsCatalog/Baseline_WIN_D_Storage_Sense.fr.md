<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Storage_Sense.md) · [English](Baseline_WIN_D_Storage_Sense.en.md) · **Français**

# [Baseline] - WIN - D - Storage Sense

Nettoie automatiquement les fichiers temporaires, la Corbeille et les anciens téléchargements dès que le disque menace d'être plein, et repasse en ligne uniquement les fichiers OneDrive mis en cache localement.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | IntuneAdmin/IntuneBaselines — Modern Workplace, Baseline - Storage Sense |
| Fichier | [`Baseline_WIN_D_Storage_Sense.json`](Baseline_WIN_D_Storage_Sense.json) |

> Une cadence de 0 signifie : uniquement lorsque l'espace disque libre est faible, pas selon un calendrier fixe. Les téléchargements et la corbeille sont nettoyés après 30 jours ; les fichiers OneDrive non ouverts depuis 30 jours redeviennent disponibles en ligne uniquement — le fichier continue d'exister, seule la copie locale disparaît.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.30 Préparation des TIC pour la continuité d'activité<br>A.8.6 Dimensionnement |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises |
| NIST CSF 2.0 | PR.IR-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_storage_allowstoragesenseglobal` | 1 |
| `device_vendor_msft_policy_config_storage_allowstoragesensetemporaryfilescleanup` | 1 |
| `device_vendor_msft_policy_config_storage_configstoragesenseglobalcadence` | 0 |
| `device_vendor_msft_policy_config_storage_configstoragesenserecyclebincleanupthreshold` | 30 |
| `device_vendor_msft_policy_config_storage_configstoragesensedownloadscleanupthreshold` | 30 |
| `device_vendor_msft_policy_config_storage_configstoragesensecloudcontentdehydrationthreshold` | 30 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
