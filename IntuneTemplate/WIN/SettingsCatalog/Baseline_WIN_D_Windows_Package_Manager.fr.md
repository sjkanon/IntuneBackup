<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Package_Manager.md) · [English](Baseline_WIN_D_Windows_Package_Manager.en.md) · **Français**

# [Baseline] - WIN - D - Windows Package Manager

Restreint winget, afin que les utilisateurs ne puissent pas installer de logiciels depuis des sources arbitraires.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Windows Package Manager |
| Fichier | [`Baseline_WIN_D_Windows_Package_Manager.json`](Baseline_WIN_D_Windows_Package_Manager.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_desktopappinstaller_enableexperimentalfeatures` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablehashoverride` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablelocalmanifestfiles` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablemsappinstallerprotocol` | 0 |
| `device_vendor_msft_policy_config_desktopappinstaller_enablesettings` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
