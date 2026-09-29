<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Sandbox.md) · [English](Baseline_WIN_D_Windows_Sandbox.en.md) · **Français**

# [Baseline] - WIN - D - Windows Sandbox

Restreint Windows Sandbox, qui ouvre sinon un Windows jetable ayant accès au réseau et au presse-papiers de l'hôte.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-089-DWindowsSandbox` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - U - Windows Sandbox |
| Fichier | [`Baseline_WIN_D_Windows_Sandbox.json`](Baseline_WIN_D_Windows_Sandbox.json) |

> Paramètres à portée appareil, d'où D — voir la remarque sur Device Guard.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_windowssandbox_allowaudioinput` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowclipboardredirection` | 1 |
| `device_vendor_msft_policy_config_windowssandbox_allownetworking` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowprinterredirection` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowvgpu` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowvideoinput` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
