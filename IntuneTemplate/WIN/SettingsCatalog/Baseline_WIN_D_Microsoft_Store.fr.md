<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Store.md) · [English](Baseline_WIN_D_Microsoft_Store.en.md) · **Français**

# [Baseline] - WIN - D - Microsoft Store

Restreint le Microsoft Store, afin que les utilisateurs ne puissent pas installer n'importe quelle application.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-019-MicrosoftAppStore` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Store - D - Configuration |
| Fichier | [`Baseline_WIN_D_Microsoft_Store.json`](Baseline_WIN_D_Microsoft_Store.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Droits d'accès privilégiés<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 7

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_applicationmanagement_allowalltrustedapps` | 1 |
| `device_vendor_msft_policy_config_applicationmanagement_allowappstoreautoupdate` | 1 |
| `device_vendor_msft_policy_config_applicationmanagement_allowdeveloperunlock` | 0 |
| `device_vendor_msft_policy_config_applicationmanagement_allowgamedvr` | 0 |
| `device_vendor_msft_policy_config_applicationmanagement_blocknonadminuserinstall` | 1 |
| `device_vendor_msft_policy_config_applicationmanagement_msiallowusercontroloverinstall` | 0 |
| `device_vendor_msft_policy_config_applicationmanagement_msialwaysinstallwithelevatedprivileges` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
