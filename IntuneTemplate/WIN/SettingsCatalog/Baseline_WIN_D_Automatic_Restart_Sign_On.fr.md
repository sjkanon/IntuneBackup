<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Automatic_Restart_Sign_On.md) · [English](Baseline_WIN_D_Automatic_Restart_Sign_On.en.md) · **Français**

# [Baseline] - WIN - D - Automatic Restart Sign-On

Après un redémarrage pour mises à jour, reconnecte automatiquement l'utilisateur en session verrouillée, afin que les programmes de démarrage s'exécutent sans que l'appareil reste déverrouillé sans surveillance.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-056-DAutomaticRestartSignOn` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Windows User Experience - D - Automatic Restart Sign-On |
| Fichier | [`Baseline_WIN_D_Automatic_Restart_Sign_On.json`](Baseline_WIN_D_Automatic_Restart_Sign_On.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_windowslogon_configautomaticrestartsignon` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_windowslogon_configautomaticrestartsignon_configautomaticrestartsignondescription` | 0 |
| `device_vendor_msft_policy_config_windowslogon_allowautomaticrestartsignon` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
